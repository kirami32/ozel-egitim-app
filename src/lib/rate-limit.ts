import "server-only";

interface Deneme {
  sayac: number;
  ilkDenemeZamani: number;
}

const denemeHaritasi = new Map<string, Deneme>();
const PENCERE_MS = 10 * 60 * 1000;
const MAKS_DENEME = 10;

/**
 * Basit bellek-içi hız sınırlayıcı (giriş denemesi kaba kuvvet koruması).
 * Tek instance için yeterli; çoklu instance/serverless ölçekte Redis/Upstash ile değiştirilmeli.
 */
export function hizSinirinaTakildiMi(anahtar: string): boolean {
  const simdi = Date.now();
  const kayit = denemeHaritasi.get(anahtar);

  if (!kayit || simdi - kayit.ilkDenemeZamani > PENCERE_MS) {
    denemeHaritasi.set(anahtar, { sayac: 1, ilkDenemeZamani: simdi });
    return false;
  }

  kayit.sayac += 1;
  return kayit.sayac > MAKS_DENEME;
}

export function hizSiniriniSifirla(anahtar: string): void {
  denemeHaritasi.delete(anahtar);
}
