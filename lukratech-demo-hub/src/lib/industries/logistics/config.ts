import type { IndustryConfig } from "@/lib/industries/types";

export const logisticsConfig: IndustryConfig = {
  id: "logistics",
  label: "Logística y transporte de carga",
  emoji: "🚚",
  entityName: "Envío",
  entityNamePlural: "Envíos",
  slaHours: 24,
  personas: {
    responsible: "Planner de rutas",
    manager: "Jefe de flota",
  },
  telegramAlertTemplate:
    "Envío {{entity_id}}: {{reason}} — revisar conductor, ventana y documentación.",
  caseStudyHeadline: "Menos reprogramaciones en última milla nacional",
  caseStudyProblem:
    "Despachos con ventanas incumplidas y poca visibilidad de excepciones en ruta.",
  caseStudyResult:
    "Alertas de desvío y reordenamiento de paradas bajaron reprogramaciones en 35%.",
};
