import type { AgentRunResult } from "@/lib/agent/types";

/**
 * Core agent execution loop (stub).
 * The production implementation will call Anthropic, execute tools, and persist results.
 */
export async function runAutonomousOpsAgent(
  industryId: string,
): Promise<AgentRunResult> {
  return {
    industry: industryId,
    itemsReviewed: 0,
    actionsTaken: 0,
    reasoningSummary:
      "Stub: el agente aún no está conectado a Claude ni a integraciones externas.",
    actions: [],
    rawClaudeOutput: null,
  };
}
