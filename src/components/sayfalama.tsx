import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SayfalamaProps {
  mevcutSayfa: number;
  toplamSayfa: number;
  bazYol: string;
  /** sayfa dışındaki mevcut filtreler — sayfa linklerinde korunur */
  parametreler?: Record<string, string | undefined>;
}

function sayfaHrefUret(bazYol: string, parametreler: Record<string, string | undefined>, sayfa: number) {
  const params = new URLSearchParams();
  for (const [anahtar, deger] of Object.entries(parametreler)) {
    if (deger) params.set(anahtar, deger);
  }
  if (sayfa > 1) params.set("sayfa", String(sayfa));
  const sorgu = params.toString();
  return sorgu ? `${bazYol}?${sorgu}` : bazYol;
}

/** Gösterilecek sayfa numaralarını üretir: her zaman ilk/son + mevcut sayfanın etrafı, aradakiler "…" ile atlanır. */
function sayfaListesiUret(mevcutSayfa: number, toplamSayfa: number) {
  const sayfalar = new Set<number>([1, toplamSayfa, mevcutSayfa, mevcutSayfa - 1, mevcutSayfa + 1]);
  return Array.from(sayfalar)
    .filter((s) => s >= 1 && s <= toplamSayfa)
    .sort((a, b) => a - b);
}

export function Sayfalama({ mevcutSayfa, toplamSayfa, bazYol, parametreler = {} }: SayfalamaProps) {
  if (toplamSayfa <= 1) return null;

  const sayfalar = sayfaListesiUret(mevcutSayfa, toplamSayfa);

  return (
    <nav className="flex items-center justify-center gap-1 py-2" aria-label="Sayfalama">
      <Link
        href={sayfaHrefUret(bazYol, parametreler, Math.max(1, mevcutSayfa - 1))}
        aria-disabled={mevcutSayfa === 1}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted",
          mevcutSayfa === 1 && "pointer-events-none opacity-40"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {sayfalar.map((sayfa, i) => {
        const oncekiSayfa = sayfalar[i - 1];
        const bosluk = oncekiSayfa !== undefined && sayfa - oncekiSayfa > 1;
        return (
          <span key={sayfa} className="flex items-center gap-1">
            {bosluk && <span className="px-1 text-xs text-muted-foreground/60">…</span>}
            <Link
              href={sayfaHrefUret(bazYol, parametreler, sayfa)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                sayfa === mevcutSayfa
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {sayfa}
            </Link>
          </span>
        );
      })}

      <Link
        href={sayfaHrefUret(bazYol, parametreler, Math.min(toplamSayfa, mevcutSayfa + 1))}
        aria-disabled={mevcutSayfa === toplamSayfa}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted",
          mevcutSayfa === toplamSayfa && "pointer-events-none opacity-40"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
