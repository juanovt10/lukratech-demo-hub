import { runAutonomousOpsAgent } from "@/lib/agent/runner";
import { INDUSTRIES } from "@/lib/industries";
import { NextResponse } from "next/server";

type RunRequestBody = {
  industryId?: string;
};

export async function POST(request: Request): Promise<Response> {
  let body: RunRequestBody;
  try {
    body = (await request.json()) as RunRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const industryId = body.industryId ?? "fuel";
  if (!INDUSTRIES[industryId]) {
    return NextResponse.json({ error: "Unknown industry" }, { status: 400 });
  }

  const result = await runAutonomousOpsAgent(industryId);
  return NextResponse.json(result);
}
