import { region } from "./region";

export function clipPermalink(id: string) {
  return `${region.siteUrl}/c/${encodeURIComponent(id)}`;
}

export function isFeedPath(pathname: string) {
  return pathname === "/" || pathname.startsWith("/c/");
}
