import { constructionConfig } from "@/lib/industries/construction/config";
import { generateSeedData as generateConstructionSeedData } from "@/lib/industries/construction/seedData";
import { fuelConfig } from "@/lib/industries/fuel/config";
import { generateSeedData as generateFuelSeedData } from "@/lib/industries/fuel/seedData";
import { logisticsConfig } from "@/lib/industries/logistics/config";
import { generateSeedData as generateLogisticsSeedData } from "@/lib/industries/logistics/seedData";
import { restaurantConfig } from "@/lib/industries/restaurant/config";
import { generateSeedData as generateRestaurantSeedData } from "@/lib/industries/restaurant/seedData";
import { retailConfig } from "@/lib/industries/retail/config";
import { generateSeedData as generateRetailSeedData } from "@/lib/industries/retail/seedData";
import type { IndustryConfig } from "@/lib/industries/types";
import type { OperationsItem } from "@/types";

export type { IndustryConfig, SeedOperationalItem } from "@/lib/industries/types";

export const INDUSTRIES: Record<string, IndustryConfig> = {
  fuel: fuelConfig,
  restaurant: restaurantConfig,
  construction: constructionConfig,
  retail: retailConfig,
  logistics: logisticsConfig,
};

export async function getCachedIndustrySummaries(): Promise<
  { id: string; label: string; emoji: string }[]
> {
  "use cache";
  return Object.values(INDUSTRIES).map((config) => ({
    id: config.id,
    label: config.label,
    emoji: config.emoji,
  }));
}

export function generateSeedData(industry: string): OperationsItem[] {
  switch (industry) {
    case "fuel":
      return generateFuelSeedData();
    case "restaurant":
      return generateRestaurantSeedData();
    case "construction":
      return generateConstructionSeedData();
    case "retail":
      return generateRetailSeedData();
    case "logistics":
      return generateLogisticsSeedData();
    default:
      throw new Error(`Unknown industry: ${industry}`);
  }
}
