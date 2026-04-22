export type IndustryConfig = {
  id: string;
  label: string;
  emoji: string;
  entityName: string;
  entityNamePlural: string;
  slaHours: number;
  personas: {
    responsible: string;
    manager: string;
  };
  telegramAlertTemplate: string;
  caseStudyHeadline: string;
  caseStudyProblem: string;
  caseStudyResult: string;
};

export type SeedOperationalItem = {
  id: string;
  description: string;
  responsible: string;
  status: string;
  createdAt: string;
  deadline: string;
  notes: string;
};
