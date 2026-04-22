import { runAgent } from "@/lib/agent/runner";
import { generateSeedData, INDUSTRIES } from "@/lib/industries";
import { NextResponse } from "next/server";
import type { AgentRunResult } from "@/lib/agent/types";
import type { OperationsItem } from "@/types";

type RunRequestBody = {
  industry: string;
  useRealSheets?: boolean;
};

type ErrorResponseBody = {
  error: string;
};

export async function POST(request: Request): Promise<Response> {
  let body: RunRequestBody;
  try {
    body = (await request.json()) as RunRequestBody;
  } catch {
    return NextResponse.json<ErrorResponseBody>(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const industry = body.industry;
  if (typeof industry !== "string" || industry.length === 0) {
    return NextResponse.json<ErrorResponseBody>(
      { error: "Missing required field: industry" },
      { status: 400 },
    );
  }

  if (!INDUSTRIES[industry]) {
    return NextResponse.json<ErrorResponseBody>(
      { error: "Unknown industry" },
      { status: 400 },
    );
  }

  const useRealSheets = body.useRealSheets ?? false;
  if (useRealSheets) {
    return NextResponse.json<ErrorResponseBody>(
      { error: "Real Sheets snapshot is not implemented yet" },
      { status: 501 },
    );
  }

  let snapshot: OperationsItem[];
  try {
    snapshot = generateSeedData(industry);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json<ErrorResponseBody>(
      { error: `Failed to generate seed data: ${msg}` },
      { status: 500 },
    );
  }

  try {
    const result: AgentRunResult = await runAgent(industry, snapshot);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json<ErrorResponseBody>(
      { error: msg },
      { status: 500 },
    );
  }
}
