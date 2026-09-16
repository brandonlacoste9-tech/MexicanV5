import { tCopy } from "./i18n";

export const AUTH_PATHS = new Set([
  "/entrar",
  "/registro",
  "/recuperar",
  "/nueva-clave",
]);

export const GUEST_KEY = "ojea-guest";
export const GUEST_TS_KEY = "ojea-guest-ts";
export const GUEST_MS = 24 * 60 * 60 * 1000;
export const AGE_KEY = "ojea-age-ok";
export const ONBOARD_KEY = "ojea-onboarded";
export const MUTE_KEY = "otealo-muted";

export function readMuted() {
  try {
    const v = localStorage.getItem(MUTE_KEY);
    if (v === "0") return false;
    if (v === "1") return true;
  } catch {
    /* default on */
  }
  return true;
}

export function writeMuted(muted: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function readGuestSession() {
  try {
    if (localStorage.getItem(GUEST_KEY) !== "1") {
      return { guest: false, remainingMs: 0 };
    }
    const ts = Number(localStorage.getItem(GUEST_TS_KEY) || 0);
    const remainingMs = Math.max(0, GUEST_MS - (Date.now() - ts));
    if (!ts || remainingMs <= 0) {
      localStorage.removeItem(GUEST_KEY);
      localStorage.removeItem(GUEST_TS_KEY);
      return { guest: false, remainingMs: 0 };
    }
    return { guest: true, remainingMs };
  } catch {
    return { guest: false, remainingMs: 0 };
  }
}

export function startGuestSession() {
  localStorage.setItem(GUEST_KEY, "1");
  localStorage.setItem(GUEST_TS_KEY, String(Date.now()));
}

export function clearGuestSession() {
  localStorage.removeItem(GUEST_KEY);
  localStorage.removeItem(GUEST_TS_KEY);
}

export function formatGuestRemaining(ms: number) {
  const hours = Math.max(1, Math.ceil(ms / (60 * 60 * 1000)));
  return tCopy().hours(hours);
}
