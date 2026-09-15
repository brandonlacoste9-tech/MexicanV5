/**
 * Ojea hive bootstrap — driven by the Mexico region pack.
 */
import { region } from "./region";

export const HIVE_CONFIG = {
  id: region.hive,
  name: region.brand,
  theme: "leather",
  locale: region.locale,
  identity: {
    name: region.brand,
    slogan: region.tagline,
    giftEmoji: "MXN",
    primaryColor: "#E8B84A",
  },
} as const;
