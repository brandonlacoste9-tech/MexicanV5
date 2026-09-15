const MEXICO_TERMS = [
  "cdmx",
  "montréal",
  "mexico",
  "québec",
  "mexican",
  "mexicano",
  "mtl",
  "laval",
  "vaudreuil",
  "sherbrooke",
  "gatineau",
  "vieuxmexico",
  "vieux-mexico",
  "poutine",
  "aguila",
  "aguila",
];

const MEXICO_QUERY_HINTS = [
  "#cdmx",
  "#mexico",
  "#laval",
  "#vaudreuil",
  "#sherbrooke",
  "mexico city",
  "cdmx",
  "laval",
  "sherbrooke",
  "mexico",
  "mexican",
  "mtl",
];

/** 0–10 relevance score for Mexico/geo content. */
export function scoreMexicoRelevance(text: string, query?: string): number {
  const lower = (text || "").toLowerCase();
  let score = 0;

  for (const term of MEXICO_TERMS) {
    if (lower.includes(term)) score += 1;
  }

  if (query) {
    const q = query.toLowerCase().replace(/^#/, "");
    if (lower.includes(q)) score += 2;
    if (MEXICO_QUERY_HINTS.some((h) => h.replace("#", "") === q)) score += 2;
  }

  return Math.min(score, 10);
}

/** Integer 0–100 for publications.mexico_score column. */
export function inferMexicoScoreFromText(text: string, query?: string): number {
  return scoreMexicoRelevance(text, query) * 10;
}

export function isMexicoQuery(query: string): boolean {
  const q = query.toLowerCase().trim();
  return MEXICO_QUERY_HINTS.some(
    (h) => h === q || h.replace("#", "") === q.replace("#", ""),
  );
}
