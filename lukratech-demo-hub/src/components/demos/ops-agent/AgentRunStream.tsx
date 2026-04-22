import { INDUSTRIES } from "@/lib/industries";

type AgentRunStreamProps = {
  industryId: string;
};

export function AgentRunStream({ industryId }: AgentRunStreamProps) {
  const industry = INDUSTRIES[industryId];
  const label = industry?.label ?? industryId;

  return (
    <section>
      <header>
        <h1>Ejecución del agente</h1>
        <p>Sector seleccionado: {label}</p>
      </header>
      <p>
        La transmisión en vivo y las acciones del agente se conectarán aquí (stub).
      </p>
    </section>
  );
}
