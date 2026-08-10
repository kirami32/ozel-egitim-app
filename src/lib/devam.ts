import type { AttendanceStatus } from "@/generated/prisma/enums";

/** "YYYY-MM-DD" bicimindeki tarihi gun basi (UTC 00:00) Date'e cevirir - depolama ve karsilastirma icin tutarli anahtar. */
export function gunBasiTarih(tarihStr: string): Date {
  return new Date(`${tarihStr}T00:00:00.000Z`);
}

export function bugununTarihStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export const DEVAM_DURUM_SIRASI: AttendanceStatus[] = ["VAR", "YOK", "GEC", "IZINLI"];

export const DEVAM_DURUM_META: Record<
  AttendanceStatus,
  { etiket: string; kisaEtiket: string; renk: string; badgeSinif: string }
> = {
  VAR: {
    etiket: "Geldi",
    kisaEtiket: "Var",
    renk: "var(--chart-4)",
    badgeSinif: "bg-[color:var(--chart-4)]/15 text-[color:var(--chart-4)]",
  },
  YOK: {
    etiket: "Gelmedi",
    kisaEtiket: "Yok",
    renk: "var(--destructive)",
    badgeSinif: "bg-destructive/12 text-destructive",
  },
  GEC: {
    etiket: "Geç Geldi",
    kisaEtiket: "Geç",
    renk: "var(--chart-2)",
    badgeSinif: "bg-[color:var(--chart-2)]/20 text-[color:var(--chart-2)]",
  },
  IZINLI: {
    etiket: "İzinli",
    kisaEtiket: "İzinli",
    renk: "var(--chart-3)",
    badgeSinif: "bg-[color:var(--chart-3)]/15 text-[color:var(--chart-3)]",
  },
};

/** Devam orani: Var + Gec / toplam kayit (Izinli orana dahil edilmez, devamsizlik sayilmaz ama devam da sayilmaz) */
export function devamOraniHesapla(
  kayitlar: { durum: AttendanceStatus }[]
): number | null {
  const degerlendirilenler = kayitlar.filter((k) => k.durum !== "IZINLI");
  if (degerlendirilenler.length === 0) return null;
  const gelenSayisi = degerlendirilenler.filter(
    (k) => k.durum === "VAR" || k.durum === "GEC"
  ).length;
  return Math.round((gelenSayisi / degerlendirilenler.length) * 100);
}
