export const IZIN_VERILEN_BELGE_TURLERI = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const AZAMI_BELGE_BAYTI = 5 * 1024 * 1024; // 5 MB
/** data URL olarak saklandığı için base64 şişkinliğini (yaklaşık %37) de içeren üst sınır. */
export const AZAMI_BELGE_VERI_UZUNLUGU = Math.ceil(AZAMI_BELGE_BAYTI * 1.4);

export function dosyaBoyutuOku(bayt: number): string {
  if (bayt < 1024) return `${bayt} B`;
  if (bayt < 1024 * 1024) return `${(bayt / 1024).toFixed(0)} KB`;
  return `${(bayt / (1024 * 1024)).toFixed(1)} MB`;
}

/** Mime türüne göre kısa bir Türkçe etiket — dosya listesinde göstermek için. */
export function belgeTuruEtiketi(mimeTuru: string): string {
  if (mimeTuru === "application/pdf") return "PDF";
  if (mimeTuru.startsWith("image/")) return "Görsel";
  if (mimeTuru.includes("word")) return "Word";
  return "Dosya";
}
