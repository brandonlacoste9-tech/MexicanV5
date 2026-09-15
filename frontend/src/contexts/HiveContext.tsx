import React, { createContext, useContext, useState, ReactNode } from "react";
import { region } from "@/config/region";

export type HiveId = "mexico" | "brazil" | "argentina";

interface HiveConfig {
  id: HiveId;
  name: string;
  flag: string;
  locale: string;
  culture: "chilango" | "carioca" | "porteño";
  currency: "MXN" | "BRL" | "ARS";
  prices: { bronze: number; silver: number; gold: number };
  personality: string;
  mascot: string;
  mascotEmoji: string;
}

export const HIVES: Record<HiveId, HiveConfig> = {
  mexico: {
    id: "mexico",
    name: "México",
    flag: "MX",
    locale: region.locale,
    culture: "chilango",
    currency: region.currency,
    prices: { bronze: 59, silver: 119, gold: 249 },
    personality: "Güey",
    mascot: "Águila",
    mascotEmoji: "MX",
  },
  brazil: {
    id: "brazil",
    name: "Brasil",
    flag: "BR",
    locale: "pt-BR",
    culture: "carioca",
    currency: "BRL",
    prices: { bronze: 19, silver: 39, gold: 79 },
    personality: "Mano",
    mascot: "Onça",
    mascotEmoji: "BR",
  },
  argentina: {
    id: "argentina",
    name: "Argentina",
    flag: "AR",
    locale: "es-AR",
    culture: "porteño",
    currency: "ARS",
    prices: { bronze: 500, silver: 999, gold: 1999 },
    personality: "Pibe",
    mascot: "Puma",
    mascotEmoji: "AR",
  },
};

interface HiveContextType {
  currentHive: HiveConfig;
  switchHive: (hiveId: HiveId) => void;
  availableHives: HiveConfig[];
}

const HiveContext = createContext<HiveContextType | undefined>(undefined);

export function detectHiveFromLocale(): HiveId {
  const lang =
    (typeof navigator !== "undefined" &&
      (navigator.language || navigator.languages?.[0])) ||
    region.locale;
  const lower = lang.toLowerCase();
  if (lower.startsWith("es-ar")) return "argentina";
  if (lower.startsWith("pt")) return "brazil";
  return "mexico";
}

export const HiveProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentHive, setCurrentHive] = useState<HiveConfig>(() => {
    const saved = localStorage.getItem("ojea_hive_id") as HiveId;
    if (saved && HIVES[saved]) return HIVES[saved];
    return HIVES[detectHiveFromLocale()];
  });

  const switchHive = (hiveId: HiveId) => {
    if (HIVES[hiveId]) {
      setCurrentHive(HIVES[hiveId]);
      localStorage.setItem("ojea_hive_id", hiveId);
    }
  };

  const value = React.useMemo(
    () => ({
      currentHive,
      switchHive,
      availableHives: Object.values(HIVES),
    }),
    [currentHive],
  );

  return <HiveContext.Provider value={value}>{children}</HiveContext.Provider>;
};

export const useHive = (): HiveContextType => {
  const context = useContext(HiveContext);
  if (!context) {
    throw new Error("useHive must be used within a HiveProvider");
  }
  return context;
};
