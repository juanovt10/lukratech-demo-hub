import {
  getRecentRuns,
  isSupabaseConfigured,
  type AgentRunRecord,
} from "@/lib/integrations/supabase";
import { NextResponse } from "next/server";

type ErrorResponseBody = {
  error: string;
};

export async function GET(): Promise<Response> {
  if (!isSupabaseConfigured()) {
    return NextResponse.json<ErrorResponseBody>(
      { error: "Supabase is not configured" },
      { status: 503 },
    );
  }

  try {
    const runs: AgentRunRecord[] = await getRecentRuns(20);
    return NextResponse.json<AgentRunRecord[]>(runs);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json<ErrorResponseBody>(
      { error: message },
      { status: 500 },
    );
  }
}
