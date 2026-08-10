import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SayfaBasligiProps {
  baslik: string;
  aciklama?: string;
  icon: LucideIcon;
  /** Başlık şeridinin rengi — sayfalar birbirinden ayırt edilsin diye. */
  renk?: "primary" | "accent" | "mor" | "yesil" | "kirmizi";
  aksiyon?: React.ReactNode;
}

const RENK_SINIFLARI = {
  primary: {
    seritler: "from-[oklch(0.62_0.115_195)]/12 via-card to-card",
    ikon: "bg-gradient-to-br from-[oklch(0.66_0.12_195)] to-[oklch(0.58_0.11_205)]",
    hale: "bg-[oklch(0.62_0.115_195)]/20",
  },
  accent: {
    seritler: "from-[oklch(0.75_0.13_55)]/14 via-card to-card",
    ikon: "bg-gradient-to-br from-[oklch(0.76_0.13_55)] to-[oklch(0.68_0.13_40)]",
    hale: "bg-[oklch(0.75_0.13_55)]/20",
  },
  mor: {
    seritler: "from-[oklch(0.65_0.14_300)]/12 via-card to-card",
    ikon: "bg-gradient-to-br from-[oklch(0.68_0.13_300)] to-[oklch(0.6_0.14_290)]",
    hale: "bg-[oklch(0.65_0.14_300)]/20",
  },
  yesil: {
    seritler: "from-[oklch(0.7_0.15_145)]/12 via-card to-card",
    ikon: "bg-gradient-to-br from-[oklch(0.7_0.14_145)] to-[oklch(0.62_0.13_155)]",
    hale: "bg-[oklch(0.7_0.15_145)]/20",
  },
  kirmizi: {
    seritler: "from-[oklch(0.68_0.18_25)]/12 via-card to-card",
    ikon: "bg-gradient-to-br from-[oklch(0.7_0.16_25)] to-[oklch(0.62_0.17_15)]",
    hale: "bg-[oklch(0.68_0.18_25)]/20",
  },
} as const;

/**
 * Her sayfanın tepesindeki renkli başlık şeridi. Sayfaların düz bir metin
 * yığını gibi başlamasını engelliyor ve rolden bağımsız olarak nerede
 * olunduğunu renkle hatırlatıyor.
 */
export function SayfaBasligi({
  baslik,
  aciklama,
  icon: Icon,
  renk = "primary",
  aksiyon,
}: SayfaBasligiProps) {
  const r = RENK_SINIFLARI[renk];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-r p-5 shadow-sm sm:p-6",
        r.seritler
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full blur-3xl",
          r.hale
        )}
      />
      <div className="relative flex flex-wrap items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-black/10",
            r.ikon
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {baslik}
          </h1>
          {aciklama && (
            <p className="mt-1 text-sm text-muted-foreground">{aciklama}</p>
          )}
        </div>
        {aksiyon && <div className="shrink-0">{aksiyon}</div>}
      </div>
    </div>
  );
}
