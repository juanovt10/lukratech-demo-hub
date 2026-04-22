import type { Tool } from "@anthropic-ai/sdk/resources/messages";

export type FlaggedItemUrgency = "high" | "medium";

export type FlagItemsNeedingAttentionToolInput = {
  flagged_items: Array<{
    item_id: string;
    reason: string;
    urgency: FlaggedItemUrgency;
    message_to_send: string;
    notify_role: string;
  }>;
  run_summary: string;
};

export const FLAG_ITEMS_NEEDING_ATTENTION_TOOL_NAME =
  "flag_items_needing_attention" as const;

export const flagItemsNeedingAttentionTool: Tool = {
  name: FLAG_ITEMS_NEEDING_ATTENTION_TOOL_NAME,
  description:
    "Flag operational items needing attention and compose Spanish alerts. Always call this tool; return empty `flagged_items` when nothing needs attention.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      flagged_items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            item_id: { type: "string" },
            reason: { type: "string" },
            urgency: { type: "string", enum: ["high", "medium"] },
            message_to_send: { type: "string" },
            notify_role: { type: "string" },
          },
          required: [
            "item_id",
            "reason",
            "urgency",
            "message_to_send",
            "notify_role",
          ],
        },
      },
      run_summary: { type: "string" },
    },
    required: ["flagged_items", "run_summary"],
  },
  strict: true,
};
