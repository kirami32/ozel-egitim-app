import type { BildirimTuru } from "@/generated/prisma/enums";

export const BILDIRIM_META: Record<
  BildirimTuru,
  { ikonAdi: "MessageCircleHeart" | "Target" | "PartyPopper" | "Users" | "ShieldAlert"; renk: string }
> = {
  VELI_NOTU: { ikonAdi: "MessageCircleHeart", renk: "bg-[oklch(0.68_0.13_300)]/12 text-[oklch(0.68_0.13_300)]" },
  HEDEF_OLUSTURULDU: { ikonAdi: "Target", renk: "bg-[oklch(0.62_0.115_195)]/12 text-[oklch(0.62_0.115_195)]" },
  HEDEF_TAMAMLANDI: { ikonAdi: "PartyPopper", renk: "bg-[oklch(0.7_0.15_145)]/15 text-[oklch(0.55_0.13_145)]" },
  OGRENCI_ATANDI: { ikonAdi: "Users", renk: "bg-[oklch(0.75_0.13_55)]/18 text-[oklch(0.55_0.12_45)]" },
  GUVENLIK_UYARISI: { ikonAdi: "ShieldAlert", renk: "bg-destructive/12 text-destructive" },
};
