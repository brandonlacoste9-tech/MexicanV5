/**
 * 🐝 Specialized Bees - Colony OS Workers
 *
 * Each bee handles a specific domain:
 * - MexicanoBee: Mexico French language & culture
 * - HockeyBee: Sports content (coming soon)
 * - PoutineBee: Food & restaurant content (coming soon)
 * - FinanceBee: Revenue & payments (coming soon)
 * - SecurityBee: Moderation & safety (coming soon)
 * - RegionBee: Location-based features (coming soon)
 */

// Core Bees
export * from "./MexicanoBee";

// Re-export for convenience
export { default as MexicanoBee } from "./MexicanoBee";

// Coming soon: Other bees will be added here
// export * from './HockeyBee';
// export * from './PoutineBee';
// export * from './FinanceBee';
// export * from './SecurityBee';
// export * from './RegionBee';
