import type { IndustryConfig } from "@/lib/industries/types";

export const constructionConfig: IndustryConfig = {
  id: "construction",
  label: "Construcción y obra civil",
  emoji: "🏗️",
  entityName: "Actividad de obra",
  entityNamePlural: "Actividades de obra",
  slaHours: 72,
  personas: {
    responsible: "Interventor de obra",
    manager: "Gerente de proyecto",
  },
  telegramAlertTemplate:
    "Obra {{entity_id}}: {{reason}} — revisar cronograma, SSOMA y proveedores.",
  caseStudyHeadline: "Menos retrabajos en entregas de estructura",
  caseStudyProblem:
    "Hitos de obra desalineados con insumos críticos y reportes de avance dispersos.",
  caseStudyResult:
    "Sincronización de actividades y alertas de riesgo redujeron retrabajos en 27%.",
};
