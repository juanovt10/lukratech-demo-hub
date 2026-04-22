/**
 * Claude tool definitions (schemas only — wiring happens in the agent runner).
 */
export type ToolDefinition = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

export const OPS_AGENT_TOOLS: readonly ToolDefinition[] = [
  {
    name: "notify_telegram",
    description:
      "Send an operational alert to the Telegram channel configured for the demo.",
    inputSchema: {
      type: "object",
      properties: {
        targetId: { type: "string" },
        message: { type: "string" },
      },
      required: ["targetId", "message"],
    },
  },
  {
    name: "send_email",
    description: "Send a follow-up email via Resend for an operational item.",
    inputSchema: {
      type: "object",
      properties: {
        targetId: { type: "string" },
        subject: { type: "string" },
        body: { type: "string" },
      },
      required: ["targetId", "subject", "body"],
    },
  },
  {
    name: "log_only",
    description: "Record a decision without sending external notifications.",
    inputSchema: {
      type: "object",
      properties: {
        targetId: { type: "string" },
        note: { type: "string" },
      },
      required: ["targetId", "note"],
    },
  },
] as const;
