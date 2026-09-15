import { cn } from "@/lib/cn";
import { useCopy, useLocale, type Locale } from "@/lib/i18n";

export function LangToggle({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const locale = useLocale((s) => s.locale);
  const setLocale = useLocale((s) => s.setLocale);
  const c = useCopy();

  return (
    <div
      role="group"
      aria-label={c.language}
      className={cn(
        "inline-flex rounded-full border border-primary/40 bg-bg/70 p-0.5",
        className,
      )}
    >
      {(["es", "en"] as const).map((code: Locale) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={cn(
              "rounded-full font-medium tracking-wide uppercase transition-colors",
              compact ? "h-7 min-w-9 px-2 text-[10px]" : "h-8 min-w-11 px-3 text-xs",
              active
                ? "bg-primary text-primary-fg"
                : "text-muted hover:text-fg",
            )}
            aria-pressed={active}
          >
            {code === "es" ? "ES" : "EN"}
          </button>
        );
      })}
    </div>
  );
}
