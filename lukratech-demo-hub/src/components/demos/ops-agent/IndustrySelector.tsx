import Link from "next/link";

type IndustrySummary = {
  id: string;
  label: string;
  emoji: string;
};

type IndustrySelectorProps = {
  industries: IndustrySummary[];
};

export function IndustrySelector({ industries }: IndustrySelectorProps) {
  return (
    <section>
      <header>
        <h1>Autonomous Ops Agent</h1>
        <p>Selecciona un sector para adaptar el demo.</p>
      </header>
      <ul>
        {industries.map((industry) => (
          <li key={industry.id}>
            <Link href={`/demos/ops-agent/run?industry=${industry.id}`}>
              {industry.emoji} {industry.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
