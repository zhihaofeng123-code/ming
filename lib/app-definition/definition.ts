import type { AppDefinition } from "@/lib/app-definition/types";

export const appDefinition: AppDefinition = {
  dataViewer: { mode: "required" },
  app: {
    id: "8b37682a2a27",
    name: "MING",
    description:
      "MING's public landing page: what the product is, a sample of the daily ritual, and the pre-launch email waitlist.",
    version: "1.0.0",
    baseUrl: "https://ming.kylon.app",
  },
  entities: [
    {
      id: "waitlist_signups",
      label: "Waitlist signup",
      pluralLabel: "Waitlist signups",
      description:
        "Email addresses submitted from the MING landing page before launch, with the page section they came from.",
      titleField: "email",
      table: "waitlist_signups",
      createdAtColumn: "created_at",
      updatedAtColumn: "updated_at",
      fields: [
        { key: "email", label: "Email", type: "email", required: true },
        {
          key: "status",
          label: "Status",
          type: "select",
          config: {
            options: [
              { id: "pending", label: "Pending", color: "brown" },
              { id: "invited", label: "Invited", color: "mint" },
              { id: "declined", label: "Declined" },
            ],
          },
        },
        { key: "source", label: "Source", type: "text" },
        { key: "note", label: "Note", type: "text" },
      ],
      relationships: [],
    },
  ],
  openapi: {
    paths: {
      "/api/waitlist": {
        post: {
          operationId: "joinWaitlist",
          summary: "Join the MING pre-launch waitlist",
          description:
            "Stores one email address as a waitlist signup. Unauthenticated: this is the public landing page form. Idempotent per email address (case-insensitive) — submitting an address that is already stored returns status \"already_on_list\" and writes nothing. Rate limited per client IP within a single server instance.",
          tags: ["waitlist"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      maxLength: 254,
                      description: "Email address to add to the waitlist.",
                    },
                    source: {
                      type: "string",
                      maxLength: 60,
                      description:
                        "Which part of the page the signup came from, for example landing_hero or landing_footer.",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "The address is on the waitlist.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["status"],
                    properties: {
                      status: { type: "string", enum: ["joined", "already_on_list"] },
                    },
                  },
                },
              },
            },
            "400": {
              description: "The request body was missing or the email address was not valid.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { error: { type: "string" } },
                  },
                },
              },
            },
            "429": { description: "Too many submissions from this client." },
            "503": { description: "The waitlist database is not configured." },
          },
        },
      },
    },
  },
};
