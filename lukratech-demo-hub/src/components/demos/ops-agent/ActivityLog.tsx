import type { AgentRunListItem } from "@/types";

type ActivityLogProps = {
  runs: AgentRunListItem[];
  configured: boolean;
};

export function ActivityLog({ runs, configured }: ActivityLogProps) {
  return (
    <section>
      <header>
        <h1>Registro de actividad</h1>
        <p>
          {configured
            ? "Historial reciente de ejecuciones del agente."
            : "Configura Supabase para cargar el historial desde la base de datos."}
        </p>
      </header>
      <ul>
        {runs.map((run) => (
          <li key={run.id}>
            <span>{run.industry}</span>
            <span>{run.ranAt}</span>
            <span>{run.reasoningSummary ?? "Sin resumen"}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
