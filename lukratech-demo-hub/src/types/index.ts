export type { AgentAction, AgentRunResult } from "@/lib/agent/types";
export type { IndustryConfig, SeedOperationalItem } from "@/lib/industries/types";

export type AgentRunListItem = {
  id: string;
  industry: string;
  ranAt: string;
  itemsReviewed: number | null;
  actionsTaken: number | null;
  reasoningSummary: string | null;
};
