import { IndustrySelector } from "@/components/demos/ops-agent/IndustrySelector";
import { getCachedIndustrySummaries } from "@/lib/industries";

export default async function OpsAgentIndustryPage() {
  const industries = await getCachedIndustrySummaries();
  return <IndustrySelector industries={industries} />;
}
