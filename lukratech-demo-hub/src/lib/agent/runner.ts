import type { AgentAction, AgentRunResult } from "@/lib/agent/types";
import {
  FLAG_ITEMS_NEEDING_ATTENTION_TOOL_NAME,
  flagItemsNeedingAttentionTool,
  type FlagItemsNeedingAttentionToolInput,
  type FlaggedItemUrgency,
} from "@/lib/agent/tools";
import { INDUSTRIES } from "@/lib/industries";
import type { IndustryConfig } from "@/lib/industries/types";
import type { OperationsItem } from "@/types";
import Anthropic from "@anthropic-ai/sdk";
import type { Message, ToolUseBlock } from "@anthropic-ai/sdk/resources/messages";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUrgency(value: unknown): value is FlaggedItemUrgency {
  return value === "high" || value === "medium";
}

function parseToolInput(input: unknown): FlagItemsNeedingAttentionToolInput {
  if (!isRecord(input)) {
    throw new Error("Tool input must be an object");
  }

  const runSummary = input["run_summary"];
  const flaggedItems = input["flagged_items"];

  // if (typeof runSummary !== "string") {
  //   throw new Error("Tool input.run_summary must be a string");
  // }
  // AFTER
  const resolvedSummary = typeof runSummary === "string" ? runSummary : "No summary provided";
  if (!Array.isArray(flaggedItems)) {
    throw new Error("Tool input.flagged_items must be an array");
  }

  const parsed = flaggedItems.map((raw, idx) => {
    if (!isRecord(raw)) {
      throw new Error(`flagged_items[${idx}] must be an object`);
    }

    const itemId = raw["item_id"];
    const reason = raw["reason"];
    const urgency = raw["urgency"];
    const messageToSend = raw["message_to_send"];
    const notifyRole = raw["notify_role"];

    if (typeof itemId !== "string") {
      throw new Error(`flagged_items[${idx}].item_id must be a string`);
    }
    if (typeof reason !== "string") {
      throw new Error(`flagged_items[${idx}].reason must be a string`);
    }
    if (!isUrgency(urgency)) {
      throw new Error(
        `flagged_items[${idx}].urgency must be \"high\" | \"medium\"`,
      );
    }
    if (typeof messageToSend !== "string") {
      throw new Error(`flagged_items[${idx}].message_to_send must be a string`);
    }
    if (typeof notifyRole !== "string") {
      throw new Error(`flagged_items[${idx}].notify_role must be a string`);
    }

    return {
      item_id: itemId,
      reason,
      urgency,
      message_to_send: messageToSend,
      notify_role: notifyRole,
    };
  });

  return { flagged_items: parsed, run_summary: resolvedSummary  };
}

function getIndustryConfig(industry: string): IndustryConfig {
  const config = INDUSTRIES[industry];
  if (!config) {
    throw new Error(`Unknown industry: ${industry}`);
  }
  return config;
}

async function loadIndustrySystemPrompt(industry: string): Promise<string> {
  switch (industry) {
    case "fuel": {
      const mod = await import("@/lib/industries/fuel/prompt");
      return mod.systemPrompt;
    }
    case "restaurant": {
      const mod = await import("@/lib/industries/restaurant/prompt");
      return mod.systemPrompt;
    }
    case "construction": {
      const mod = await import("@/lib/industries/construction/prompt");
      return mod.systemPrompt;
    }
    case "retail": {
      const mod = await import("@/lib/industries/retail/prompt");
      return mod.systemPrompt;
    }
    case "logistics": {
      const mod = await import("@/lib/industries/logistics/prompt");
      return mod.systemPrompt;
    }
    default:
      throw new Error(`No system prompt module for industry: ${industry}`);
  }
}

function findToolUse(message: Message): ToolUseBlock | null {
  for (const block of message.content) {
    if (block.type === "tool_use" && block.name === FLAG_ITEMS_NEEDING_ATTENTION_TOOL_NAME) {
      return block;
    }
  }
  return null;
}



export async function runAgent(
  industry: string,
  dataSnapshot: OperationsItem[],
): Promise<AgentRunResult> {
  const industryConfig = getIndustryConfig(industry);
  const systemPrompt = await loadIndustrySystemPrompt(industry);

  const client = new Anthropic({
    apiKey: requireEnv("ANTHROPIC_API_KEY"),
  });

  const nowIso = new Date().toISOString();
  const userPayload = {
    industry,
    timestamp: nowIso,
    sla_hours_threshold: industryConfig.slaHours,
    entity_name_plural: industryConfig.entityNamePlural,
    data_snapshot: dataSnapshot,
  };

  let message: Message;
  try {
    message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: JSON.stringify(userPayload),
        },
      ],
      tools: [flagItemsNeedingAttentionTool],
      tool_choice: { type: "auto" },
    });
  } catch (err: unknown) {
    const details =
      err instanceof Error ? `${err.name}: ${err.message}` : "Unknown error";
    throw new Error(`Anthropic request failed: ${details}`);
  }

  const toolUse = findToolUse(message);
  if (!toolUse) {
    throw new Error(
      `Model did not call required tool: ${FLAG_ITEMS_NEEDING_ATTENTION_TOOL_NAME}`,
    );
  }

  const parsed = parseToolInput(toolUse.input);

  const actions: AgentAction[] = parsed.flagged_items.map((item) => ({
    actionType: "telegram",
    targetId: item.item_id,
    urgency: item.urgency,
    messageSent: item.message_to_send,
    reasoning: item.reason,
  }));

  const result: AgentRunResult = {
    industry,
    itemsReviewed: dataSnapshot.length,
    actionsTaken: parsed.flagged_items.length,
    reasoningSummary: parsed.run_summary,
    actions,
    rawClaudeOutput: message,
  };

  console.log(
    JSON.stringify(
      {
        industry: result.industry,
        itemsReviewed: result.itemsReviewed,
        actionsTaken: result.actionsTaken,
      },
      null,
      2,
    ),
  );

  return result;
}
