/**
 * Tema dışındaki görünüm tercihleri. Tema next-themes tarafından yönetiliyor;
 * bunlar da aynı mantıkla localStorage'da tutulup <html> üzerine sınıf olarak
 * yansıtılıyor, böylece sunucuya bir tur atmadan anında uygulanıyorlar.
 */

export const YOGUNLUK_ANAHTARI = "gorunum-yogunluk";
export const HAREKET_ANAHTARI = "gorunum-hareket";

export const YOGUN_SINIFI = "yogun-gorunum";
export const HAREKETSIZ_SINIFI = "hareket-azalt";

/**
 * Sayfa boyanmadan önce <head> içinde çalışır: tercihleri okuyup <html>'e
 * uygular. Aksi hâlde React hidrasyonuna kadar varsayılan görünüm görünür
 * ve göz alıcı bir sıçrama olur.
 */
export const GORUNUM_SCRIPTI = `
(function () {
  try {
    var d = document.documentElement;
    if (localStorage.getItem("${YOGUNLUK_ANAHTARI}") === "yogun") {
      d.classList.add("${YOGUN_SINIFI}");
    }
    if (localStorage.getItem("${HAREKET_ANAHTARI}") === "azalt") {
      d.classList.add("${HAREKETSIZ_SINIFI}");
    }
  } catch (e) {}
})();
`;

/**
 * Tercihler React'in dışında (localStorage + <html> sınıfı) yaşıyor, bu yüzden
 * useSyncExternalStore ile okunuyorlar: efekt içinde setState çağırıp fazladan
 * render tetiklemeye gerek kalmıyor ve sunucu anlık görüntüsü açıkça "kapalı"
 * oluyor — <head> script'i zaten gerçek değeri boyamadan önce uygulamış olur.
 */
const dinleyiciler = new Set<() => void>();

function bildir() {
  for (const dinleyici of dinleyiciler) dinleyici();
}

export function tercihleriDinle(geriCagirim: () => void) {
  dinleyiciler.add(geriCagirim);
  // Başka bir sekmede değişirse burada da güncellensin.
  window.addEventListener("storage", geriCagirim);
  return () => {
    dinleyiciler.delete(geriCagirim);
    window.removeEventListener("storage", geriCagirim);
  };
}

export function tercihAcikMi(sinif: string) {
  return document.documentElement.classList.contains(sinif);
}

/** next-themes'in tercihi sakladığı localStorage anahtarı. */
export const TEMA_ANAHTARI = "theme";

/**
 * Seçili temayı next-themes'in kendi deposundan okur. useTheme()'in döndürdüğü
 * değer ilk render'da sunucuyla uyuşmadığı için doğrudan render'da kullanılamaz;
 * burada sunucu anlık görüntüsü açıkça "system" olarak veriliyor.
 */
export function temaTercihi() {
  try {
    return localStorage.getItem(TEMA_ANAHTARI) ?? "system";
  } catch {
    return "system";
  }
}

/** setTheme sonrası aboneleri uyarır — depo React'in dışında yaşıyor. */
export function temaDegistiBildir() {
  bildir();
}

export function tercihiDegistir(
  anahtar: string,
  sinif: string,
  acikDeger: string,
  kapaliDeger: string,
  acik: boolean
) {
  localStorage.setItem(anahtar, acik ? acikDeger : kapaliDeger);
  document.documentElement.classList.toggle(sinif, acik);
  bildir();
}
