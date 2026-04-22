import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/integrations/supabase";
import type { AgentRunListItem } from "@/types";
import { NextResponse } from "next/server";

type AgentRunRow = {
  id: string;
  industry: string;
  ran_at: string;
  items_reviewed: number | null;
  actions_taken: number | null;
  reasoning_summary: string | null;
};

export async function GET(): Promise<Response> {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ runs: [] satisfies AgentRunListItem[], configured: false });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("agent_runs")
    .select(
      "id, industry, ran_at, items_reviewed, actions_taken, reasoning_summary",
    )
    .order("ran_at", { ascending: false })
    .limit(50)
    .returns<AgentRunRow[]>();

  if (error) {
    return NextResponse.json(
      { error: error.message, runs: [], configured: true },
      { status: 500 },
    );
  }

  const runs: AgentRunListItem[] = (data ?? []).map((row) => ({
    id: row.id,
    industry: row.industry,
    ranAt: row.ran_at,
    itemsReviewed: row.items_reviewed,
    actionsTaken: row.actions_taken,
    reasoningSummary: row.reasoning_summary,
  }));

  return NextResponse.json({ runs, configured: true });
}
