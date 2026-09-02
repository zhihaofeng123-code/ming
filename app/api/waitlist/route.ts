import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { clientKeyFromHeaders } from "@/lib/client-error-rate-limit";
import { hasDatabaseConnection, queryRows } from "@/lib/db";

/**
 * Public waitlist intake for the landing page.
 *
 * Unauthenticated by necessity — a visitor who has not launched the product yet
 * has no account — so every field is treated as hostile: bounded body, bounded
 * fields, allowlisted source, and a per-instance submission cap.
 */

const MAX_BODY_BYTES = 4 * 1024;
const MAX_EMAIL_LENGTH = 254;
const MAX_SOURCE_LENGTH = 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SUBMIT_WINDOW_MS = 60_000;
const MAX_SUBMITS_PER_WINDOW = 10;
const MAX_TRACKED_CLIENTS = 5_000;
const submitWindows = new Map<string, { count: number; resetAt: number }>();

function isOverSubmitLimit(key: string, now = Date.now()): boolean {
  const entry = submitWindows.get(key);
  if (entry && entry.resetAt > now) {
    entry.count += 1;
    return entry.count > MAX_SUBMITS_PER_WINDOW;
  }
  if (submitWindows.size >= MAX_TRACKED_CLIENTS) {
    for (const [trackedKey, tracked] of submitWindows) {
      if (tracked.resetAt <= now) submitWindows.delete(trackedKey);
    }
    if (submitWindows.size >= MAX_TRACKED_CLIENTS) submitWindows.clear();
  }
  submitWindows.set(key, { count: 1, resetAt: now + SUBMIT_WINDOW_MS });
  return false;
}

export async function POST(req: NextRequest) {
  if (isOverSubmitLimit(clientKeyFromHeaders(req.headers))) {
    return NextResponse.json({ error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return NextResponse.json({ error: "Could not read the request." }, { status: 400 });
  }
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  let payload: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Expected a JSON object." }, { status: 400 });
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Expected a JSON object." }, { status: 400 });
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "That does not look like an email address." }, { status: 400 });
  }

  const rawSource = typeof payload.source === "string" ? payload.source.trim() : "";
  const source = /^[a-z0-9_-]{1,60}$/.test(rawSource) ? rawSource.slice(0, MAX_SOURCE_LENGTH) : "landing";

  if (!hasDatabaseConnection()) {
    return NextResponse.json({ error: "The waitlist is not available right now." }, { status: 503 });
  }

  try {
    const inserted = await queryRows<{ id: string }>(
      `INSERT INTO waitlist_signups (id, email, email_normalized, source)
       VALUES (?, ?, ?, ?)
       ON CONFLICT (email_normalized) DO NOTHING
       RETURNING id`,
      [randomUUID(), email, email.toLowerCase(), source],
    );
    return NextResponse.json({ status: inserted.length > 0 ? "joined" : "already_on_list" });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "waitlist_insert_failed",
        message: error instanceof Error ? error.message : "unknown",
      }),
    );
    return NextResponse.json({ error: "Could not save that just now. Try again." }, { status: 500 });
  }
}
