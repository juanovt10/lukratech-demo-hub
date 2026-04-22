import type { IndustryConfig } from "@/lib/industries/types";

export const fuelConfig: IndustryConfig = {
  id: "fuel",
  label: "Combustibles y logística de última milla",
  emoji: "⛽",
  entityName: "Entrega",
  entityNamePlural: "Entregas",
  slaHours: 36,
  personas: {
    responsible: "Coordinador de despacho",
    manager: "Gerente de operaciones",
  },
  telegramAlertTemplate:
    "Alerta {{entity_id}}: {{reason}} — revisar tanque, conductor y ventana de entrega.",
  caseStudyHeadline: "Menos ruptura de stock en estaciones de Antioquia",
  caseStudyProblem:
    "Entregas de ACPM con confirmaciones tardías y rutas sin priorizar pedidos críticos.",
  caseStudyResult:
    "Alertas tempranas y priorización automática redujeron incidentes de desabastecimiento en 32%.",
};
