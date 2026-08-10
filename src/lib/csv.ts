import "server-only";

/** Bir hücre değerini CSV için güvenli hâle getirir (virgül/tırnak/satır sonu varsa tırnaklar). */
function hucreKac(deger: unknown): string {
  const metin = deger === null || deger === undefined ? "" : String(deger);
  if (/[",\n\r]/.test(metin)) {
    return `"${metin.replace(/"/g, '""')}"`;
  }
  return metin;
}

/**
 * Satır dizisinden CSV metni üretir. Excel'in Türkçe karakterleri doğru
 * göstermesi için UTF-8 BOM ekleniyor.
 */
export function csvOlustur(basliklar: string[], satirlar: unknown[][]): string {
  const govde = [basliklar, ...satirlar]
    .map((satir) => satir.map(hucreKac).join(","))
    .join("\r\n");
  return "\uFEFF" + govde;
}

export function csvYaniti(dosyaAdi: string, icerik: string): Response {
  return new Response(icerik, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${dosyaAdi}"`,
    },
  });
}
