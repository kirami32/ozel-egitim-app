/**
 * Avatar yardımcıları. Sunucu ve istemci tarafında ortak kullanılır.
 */

export type AvatarTuru = "kullanici" | "ogrenci";

/** "Ayşe Nur Yılmaz" -> "AY" */
export function baslangicHarfleri(adSoyad: string) {
  const parcalar = adSoyad.trim().split(/\s+/).filter(Boolean);
  if (parcalar.length === 0) return "?";
  if (parcalar.length === 1) return parcalar[0].slice(0, 2).toLocaleUpperCase("tr-TR");
  return (parcalar[0][0] + parcalar[parcalar.length - 1][0]).toLocaleUpperCase("tr-TR");
}

/**
 * İsimden sabit bir renk üretir; aynı kişi her yerde aynı renkte görünür.
 * Fotoğrafı olmayan kullanıcılar için listeleri renklendiriyor.
 */
const AVATAR_RENKLERI = [
  "bg-[oklch(0.9_0.06_195)] text-[oklch(0.35_0.09_195)]",
  "bg-[oklch(0.9_0.06_55)] text-[oklch(0.38_0.1_45)]",
  "bg-[oklch(0.9_0.06_300)] text-[oklch(0.37_0.09_300)]",
  "bg-[oklch(0.9_0.06_145)] text-[oklch(0.36_0.09_145)]",
  "bg-[oklch(0.9_0.06_25)] text-[oklch(0.38_0.1_25)]",
  "bg-[oklch(0.9_0.06_250)] text-[oklch(0.36_0.09_250)]",
];

const AVATAR_RENKLERI_KOYU = [
  "dark:bg-[oklch(0.35_0.07_195)] dark:text-[oklch(0.88_0.06_195)]",
  "dark:bg-[oklch(0.36_0.08_45)] dark:text-[oklch(0.9_0.06_55)]",
  "dark:bg-[oklch(0.35_0.07_300)] dark:text-[oklch(0.89_0.05_300)]",
  "dark:bg-[oklch(0.34_0.07_145)] dark:text-[oklch(0.89_0.06_145)]",
  "dark:bg-[oklch(0.36_0.08_25)] dark:text-[oklch(0.9_0.06_25)]",
  "dark:bg-[oklch(0.35_0.07_250)] dark:text-[oklch(0.89_0.05_250)]",
];

export function avatarRengi(anahtar: string) {
  let toplam = 0;
  for (let i = 0; i < anahtar.length; i++) {
    toplam = (toplam * 31 + anahtar.charCodeAt(i)) >>> 0;
  }
  const indeks = toplam % AVATAR_RENKLERI.length;
  return `${AVATAR_RENKLERI[indeks]} ${AVATAR_RENKLERI_KOYU[indeks]}`;
}

/**
 * Avatar görselinin adresi. `surum` cache kırmak için kullanılıyor: fotoğraf
 * değişince URL de değişir, tarayıcı eskisini göstermeye devam etmez.
 */
export function avatarUrl(
  tur: AvatarTuru,
  id: string,
  surum: Date | string | null | undefined
) {
  if (!surum) return null;
  const damga = surum instanceof Date ? surum.getTime() : new Date(surum).getTime();
  return `/api/avatar/${tur}/${id}?v=${damga}`;
}

/** Yüklenebilecek en büyük data URL (yaklaşık 300 KB) — kötü niyetli devasa gönderimleri keser. */
export const AZAMI_AVATAR_UZUNLUGU = 400_000;
