import type { BasariSeviyesi, HedefDurum, HedefKategori } from "@/generated/prisma/enums";

export const HEDEF_KATEGORI_SIRASI: HedefKategori[] = [
  "ILETISIM",
  "AKADEMIK",
  "SOSYAL",
  "OZ_BAKIM",
  "MOTOR",
  "DAVRANIS",
];

export const HEDEF_KATEGORI_META: Record<
  HedefKategori,
  { etiket: string; renk: string; badgeSinif: string }
> = {
  ILETISIM: {
    etiket: "İletişim",
    renk: "var(--chart-1)",
    badgeSinif: "bg-[color:var(--chart-1)]/15 text-[color:var(--chart-1)]",
  },
  AKADEMIK: {
    etiket: "Akademik",
    renk: "var(--chart-3)",
    badgeSinif: "bg-[color:var(--chart-3)]/15 text-[color:var(--chart-3)]",
  },
  SOSYAL: {
    etiket: "Sosyal",
    renk: "var(--chart-2)",
    badgeSinif: "bg-[color:var(--chart-2)]/20 text-[color:var(--chart-2)]",
  },
  OZ_BAKIM: {
    etiket: "Öz Bakım",
    renk: "var(--chart-4)",
    badgeSinif: "bg-[color:var(--chart-4)]/15 text-[color:var(--chart-4)]",
  },
  MOTOR: {
    etiket: "Motor Beceri",
    renk: "var(--chart-5)",
    badgeSinif: "bg-[color:var(--chart-5)]/15 text-[color:var(--chart-5)]",
  },
  DAVRANIS: {
    etiket: "Davranış",
    renk: "var(--destructive)",
    badgeSinif: "bg-destructive/12 text-destructive",
  },
};

export const HEDEF_DURUM_META: Record<
  HedefDurum,
  { etiket: string; badgeSinif: string }
> = {
  AKTIF: {
    etiket: "Aktif",
    badgeSinif: "bg-[color:var(--chart-1)]/15 text-[color:var(--chart-1)]",
  },
  TAMAMLANDI: {
    etiket: "Tamamlandı",
    badgeSinif: "bg-[color:var(--chart-4)]/15 text-[color:var(--chart-4)]",
  },
  ERTELENDI: {
    etiket: "Ertelendi",
    badgeSinif: "bg-muted text-muted-foreground",
  },
};

/** MEB BEP formlarındaki standart başarı düzeyi ölçeği, kötüden iyiye sıralı. */
export const BASARI_SEVIYESI_SIRASI: BasariSeviyesi[] = [
  "YAPAMADI",
  "FIZIKSEL_YARDIMLA",
  "SOZEL_IPUCUYLA",
  "BAGIMSIZ",
];

export const BASARI_SEVIYESI_META: Record<
  BasariSeviyesi,
  { etiket: string; kisaEtiket: string; renk: string; badgeSinif: string; puan: number }
> = {
  BAGIMSIZ: {
    etiket: "Bağımsız Yaptı",
    kisaEtiket: "Bağımsız",
    renk: "var(--chart-4)",
    badgeSinif: "bg-[color:var(--chart-4)]/15 text-[color:var(--chart-4)]",
    puan: 3,
  },
  SOZEL_IPUCUYLA: {
    etiket: "Sözel İpucuyla Yaptı",
    kisaEtiket: "Sözel İpucu",
    renk: "var(--chart-2)",
    badgeSinif: "bg-[color:var(--chart-2)]/20 text-[color:var(--chart-2)]",
    puan: 2,
  },
  FIZIKSEL_YARDIMLA: {
    etiket: "Fiziksel Yardımla Yaptı",
    kisaEtiket: "Fiziksel Yardım",
    renk: "var(--chart-5)",
    badgeSinif: "bg-[color:var(--chart-5)]/15 text-[color:var(--chart-5)]",
    puan: 1,
  },
  YAPAMADI: {
    etiket: "Yapamadı",
    kisaEtiket: "Yapamadı",
    renk: "var(--destructive)",
    badgeSinif: "bg-destructive/12 text-destructive",
    puan: 0,
  },
};

/**
 * Son N kayıttaki başarı düzeylerinin ortalamasından 0-100 arası bir ilerleme
 * yüzdesi üretir. Hedef kartındaki ilerleme çubuğu için kullanılır.
 */
export function ilerlemeYuzdesiHesapla(
  kayitlar: { seviye: BasariSeviyesi }[]
): number | null {
  if (kayitlar.length === 0) return null;
  const sonKayitlar = kayitlar.slice(0, 5);
  const toplam = sonKayitlar.reduce(
    (t, k) => t + BASARI_SEVIYESI_META[k.seviye].puan,
    0
  );
  return Math.round((toplam / (sonKayitlar.length * 3)) * 100);
}
