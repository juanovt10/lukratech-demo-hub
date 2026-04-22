import { Suspense } from "react";
import { RunSection } from "./RunSection";

type RunPageProps = {
  searchParams: Promise<{ industry?: string }>;
};

export default function OpsAgentRunPage({ searchParams }: RunPageProps) {
  return (
    <Suspense fallback={<section><p>Preparando demo…</p></section>}>
      <RunSection searchParams={searchParams} />
    </Suspense>
  );
}
