import { cn } from "@/lib/utils";

/**
 * Verimlilik puanını renkle de anlatır: düşük puanlar kırmızıya, yüksek
 * puanlar yeşile kayar. Böylece uzun listelerde tek tek rakam okumak yerine
 * genel gidişat bir bakışta görülüyor.
 */
export function VerimlilikRozeti({
  puan,
  className,
}: {
  puan: number;
  className?: string;
}) {
  const sinif =
    puan >= 8
      ? "bg-[oklch(0.72_0.14_145)]/15 text-[oklch(0.42_0.11_150)] dark:text-[oklch(0.82_0.12_145)]"
      : puan >= 5
        ? "bg-[oklch(0.78_0.13_75)]/20 text-[oklch(0.45_0.11_65)] dark:text-[oklch(0.85_0.11_75)]"
        : "bg-[oklch(0.68_0.18_25)]/15 text-[oklch(0.48_0.16_25)] dark:text-[oklch(0.8_0.13_25)]";

  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
        sinif,
        className
      )}
    >
      {puan}/10
    </span>
  );
}
