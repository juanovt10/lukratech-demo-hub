export type {
  AgentAction,
  AgentRunResult,
  DispatchResult,
} from "@/lib/agent/types";
export type { IndustryConfig, SeedOperationalItem } from "@/lib/industries/types";

export type OperationsItem = {
  id: string;
  description: string;
  responsible: string;
  status: string;
  createdAt: string;
  deadline: string;
  notes: string;
};

export type AgentRunListItem = {
  id: string;
  industry: string;
  ranAt: string;
  itemsReviewed: number | null;
  actionsTaken: number | null;
  reasoningSummary: string | null;
};
