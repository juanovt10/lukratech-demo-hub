import { AgentRunStream } from "@/components/demos/ops-agent/AgentRunStream";

type RunSectionProps = {
  searchParams: Promise<{ industry?: string }>;
};

export async function RunSection({ searchParams }: RunSectionProps) {
  const params = await searchParams;
  const industryId = params.industry ?? "fuel";

  return <AgentRunStream industryId={industryId} />;
}
