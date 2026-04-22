import { constructionConfig } from "@/lib/industries/construction/config";
import { fuelConfig } from "@/lib/industries/fuel/config";
import { logisticsConfig } from "@/lib/industries/logistics/config";
import { restaurantConfig } from "@/lib/industries/restaurant/config";
import { retailConfig } from "@/lib/industries/retail/config";
import type { IndustryConfig } from "@/lib/industries/types";

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
