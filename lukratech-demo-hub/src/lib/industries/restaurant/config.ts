import type { IndustryConfig } from "@/lib/industries/types";

export const restaurantConfig: IndustryConfig = {
  id: "restaurant",
  label: "Restaurantes y dark kitchen",
  emoji: "🍽️",
  entityName: "Pedido",
  entityNamePlural: "Pedidos",
  slaHours: 4,
  personas: {
    responsible: "Jefe de turno",
    manager: "Director de operaciones",
  },
  telegramAlertTemplate:
    "Pedido {{entity_id}}: {{reason}} — revisar cocina, tiempos y plataforma.",
  caseStudyHeadline: "Tiempos de preparación estables en hora pico",
  caseStudyProblem:
    "Pedidos de apps con retrasos y falta de visibilidad entre sala y cocina.",
  caseStudyResult:
    "Alertas por cola de tickets y priorización por SLA bajaron quejas en 41%.",
};
