"use client";

import { useId, useState } from "react";

type FormState = "idle" | "submitting" | "joined" | "already" | "error";

const IDLE_HINT = "One email when MING opens. Nothing else.";

export function WaitlistForm({ source }: { source: string }) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorText, setErrorText] = useState("");

  const done = state === "joined" || state === "already";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting" || done) return;
    setState("submitting");
    setErrorText("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { status?: string; error?: string }
        | null;

      if (!response.ok) {
        setErrorText(payload?.error ?? "Could not save that just now. Try again.");
        setState("error");
        return;
      }
      setState(payload?.status === "already_on_list" ? "already" : "joined");
    } catch {
      setErrorText("No connection. Try again in a moment.");
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate={false} className="w-full">
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          id={inputId}
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          enterKeyHint="go"
          maxLength={254}
          disabled={done || state === "submitting"}
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state === "error") setState("idle");
          }}
          className="h-12 w-full rounded-md border border-input bg-surface px-4 text-[16px] text-foreground outline-none transition placeholder:text-placeholder-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring-subtle disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={done || state === "submitting"}
          className="h-12 shrink-0 rounded-md bg-primary px-6 text-[15px] font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60 sm:px-7"
        >
          {state === "submitting" ? "Joining…" : done ? "You’re in" : "Join the waitlist"}
        </button>
      </div>
      <p
        aria-live="polite"
        className={`mt-3 text-[13px] leading-snug ${
          state === "error" ? "text-destructive" : "text-tertiary-foreground"
        }`}
      >
        {state === "joined"
          ? "You’re on the list. We’ll email you once, when MING opens."
          : state === "already"
            ? "You’re already on the list — nothing more to do."
            : state === "error"
              ? errorText
              : IDLE_HINT}
      </p>
    </form>
  );
}
