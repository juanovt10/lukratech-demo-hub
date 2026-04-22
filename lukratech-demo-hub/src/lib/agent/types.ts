export type AgentAction = {
  actionType: "telegram" | "email" | "log_only";
  targetId: string;
  messageSent: string;
  reasoning: string;
};

export type AgentRunResult = {
  industry: string;
  itemsReviewed: number;
  actionsTaken: number;
  reasoningSummary: string;
  actions: AgentAction[];
  rawClaudeOutput: unknown;
};
