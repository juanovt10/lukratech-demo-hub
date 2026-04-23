export type AgentAction = {
  actionType: "telegram" | "email" | "log_only";
  targetId: string;
  /** Urgency from the model tool output; used in notifications. */
  urgency: "high" | "medium";
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

export type DispatchResult = {
  telegramSent: number;
  emailSent: boolean;
  errors: string[];
  /** Set when the run is persisted to Supabase. */
  runId?: string;
};
