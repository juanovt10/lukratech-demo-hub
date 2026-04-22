import type { IndustryConfig } from "@/lib/industries/types";

export const retailConfig: IndustryConfig = {
  id: "retail",
  label: "Retail y cadena de tiendas",
  emoji: "🛒",
  entityName: "Reposición",
  entityNamePlural: "Reposiciones",
  slaHours: 48,
  personas: {
    responsible: "Líder de tienda",
    manager: "Gerente regional",
  },
  telegramAlertTemplate:
    "Reposición {{entity_id}}: {{reason}} — revisar inventario, traslado y promociones.",
  caseStudyHeadline: "Menos quiebres de stock en temporada alta",
  caseStudyProblem:
    "Reposiciones reactivas y datos de venta desconectados del centro de distribución.",
  caseStudyResult:
    "Alertas de cobertura y priorización por SKU mejoraron disponibilidad en góndola en 19%.",
};
