import { cn } from "@/lib/cn";
import { initials } from "@/lib/store";

const SIZES = {
  sm: "size-9 text-[11px]",
  md: "size-12 text-xs",
  lg: "size-16 text-xl",
  xl: "size-20 text-2xl",
} as const;

export function AvatarCircle({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const box = cn(
    "grid shrink-0 place-items-center overflow-hidden rounded-full border border-primary/40 bg-elevated font-medium text-primary",
    SIZES[size],
    className,
  );
  if (src) {
    return (
      <span className={box}>
        <img
          src={src}
          alt=""
          referrerPolicy="no-referrer"
          className="size-full object-cover"
        />
      </span>
    );
  }
  return <span className={box}>{initials(name)}</span>;
}
