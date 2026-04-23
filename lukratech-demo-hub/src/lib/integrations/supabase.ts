import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { AgentRunResult, DispatchResult } from "@/lib/agent/types";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function isSupabaseConfigured(): boolean {
  return (
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0
  );
}

/**
 * True when server-side write logging is possible (service role bypasses RLS for inserts).
 */
export function isSupabaseServiceRoleConfigured(): boolean {
  return (
    isSupabaseConfigured() &&
    typeof process.env.SUPABASE_SERVICE_ROLE_KEY === "string" &&
    process.env.SUPABASE_SERVICE_ROLE_KEY.length > 0
  );
}

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component; ignore if read-only cookie context.
          }
        },
      },
    },
  );
}

/**
 * Server-only: uses the service role key. Never use in client components or the browser.
 */
function createServiceRoleClient(): SupabaseClient {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );
}

export type AgentActionRecord = {
  id: string;
  run_id: string;
  action_type: string;
  target_id: string;
  message_sent: string;
  reasoning: string;
  created_at: string;
};

export type AgentRunRecord = {
  id: string;
  industry: string;
  ran_at: string;
  items_reviewed: number;
  actions_taken: number;
  reasoning_summary: string;
  actions: AgentActionRecord[];
};

type AgentRunRowWithActions = {
  id: string;
  industry: string;
  ran_at: string;
  items_reviewed: number | null;
  actions_taken: number | null;
  reasoning_summary: string | null;
  agent_actions:
    | Array<{
        id: string;
        run_id: string;
        action_type: string;
        target_id: string | null;
        message_sent: string | null;
        reasoning: string | null;
        created_at: string;
      }>
    | null;
};

/** Produces a value safe for Postgrest JSON/JSONB columns. */
function toJsonb(
  value: unknown,
):
  | string
  | number
  | boolean
  | null
  | Record<string, unknown>
  | unknown[] {
  if (value === null || value === undefined) {
    return null;
  }
  try {
    return JSON.parse(JSON.stringify(value)) as
      | Record<string, unknown>
      | unknown[];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown";
    return { _error: "raw_claude_output not JSON-serializable", detail: message };
  }
}

/**
 * Persists a completed run and its actions. Inserts with the service role key
 * (RLS has no public INSERT; service role bypasses RLS).
 *
 * The `dispatchResult` is accepted for forward-compatible logging; the current
 * `agent_runs` / `agent_actions` schema stores model output and actions only.
 */
export async function logAgentRun(
  result: AgentRunResult,
  _dispatchResult: DispatchResult,
): Promise<string> {
  void _dispatchResult;
  try {
    const supabase = createServiceRoleClient();

    const { data: runData, error: runError } = await supabase
      .from("agent_runs")
      .insert({
        industry: result.industry,
        items_reviewed: result.itemsReviewed,
        actions_taken: result.actionsTaken,
        reasoning_summary: result.reasoningSummary,
        raw_claude_output: toJsonb(result.rawClaudeOutput),
      })
      .select("id")
      .single();

    if (runError) {
      throw new Error(
        `logAgentRun: failed to insert agent_runs: ${runError.message}`,
      );
    }
    if (!runData || typeof runData.id !== "string") {
      throw new Error("logAgentRun: insert did not return a run id");
    }

    const runId = runData.id;

    if (result.actions.length > 0) {
      const rows = result.actions.map((a) => ({
        run_id: runId,
        action_type: a.actionType,
        target_id: a.targetId,
        message_sent: a.messageSent,
        reasoning: a.reasoning,
      }));

      const { error: actError } = await supabase.from("agent_actions").insert(rows);
      if (actError) {
        throw new Error(
          `logAgentRun: failed to insert agent_actions: ${actError.message}`,
        );
      }
    }

    return runId;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`logAgentRun: ${err.message}`);
    }
    throw new Error("logAgentRun: unknown error");
  }
}

/**
 * Fetches recent runs with nested actions (public RLS read; uses anon key).
 */
export async function getRecentRuns(
  limit: number = 20,
): Promise<AgentRunRecord[]> {
  try {
    if (!isSupabaseConfigured()) {
      throw new Error("getRecentRuns: Supabase URL/anon key not configured");
    }

    const supabase = createClient(
      requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
      requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    );

    const { data, error } = await supabase
      .from("agent_runs")
      .select(
        `
        id,
        industry,
        ran_at,
        items_reviewed,
        actions_taken,
        reasoning_summary,
        agent_actions (
          id,
          run_id,
          action_type,
          target_id,
          message_sent,
          reasoning,
          created_at
        )
      `,
      )
      .order("ran_at", { ascending: false })
      .limit(limit)
      .returns<AgentRunRowWithActions[]>();

    if (error) {
      throw new Error(`getRecentRuns: query failed: ${error.message}`);
    }

    return (data ?? []).map((row) => {
      const actionsRaw = [...(row.agent_actions ?? [])].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
      const actions: AgentActionRecord[] = actionsRaw.map((a) => ({
        id: a.id,
        run_id: a.run_id,
        action_type: a.action_type,
        target_id: a.target_id ?? "",
        message_sent: a.message_sent ?? "",
        reasoning: a.reasoning ?? "",
        created_at: a.created_at,
      }));

      return {
        id: row.id,
        industry: row.industry,
        ran_at: row.ran_at,
        items_reviewed: row.items_reviewed ?? 0,
        actions_taken: row.actions_taken ?? 0,
        reasoning_summary: row.reasoning_summary ?? "",
        actions,
      };
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`getRecentRuns: ${err.message}`);
    }
    throw new Error("getRecentRuns: unknown error");
  }
}
