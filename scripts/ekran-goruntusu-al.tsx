import fs from "node:fs";
import path from "node:path";
import puppeteer, { type Browser, type Page } from "puppeteer-core";

/**
 * Tanıtım PDF'inde kullanılacak ekran görüntülerini canlı/yerel siteden toplar.
 *
 * Çalıştırmak için:
 *   npx tsx scripts/ekran-goruntusu-al.tsx
 *   npx tsx scripts/ekran-goruntusu-al.tsx http://localhost:3000
 *
 * Kurulu Chrome'u kullanır (puppeteer-core tarayıcı indirmez).
 */

const TABAN_URL = process.argv[2] ?? "https://ozel-egitim-app.vercel.app";
const CIKTI_DIZINI = path.join(process.cwd(), "docs", "ekran-goruntuleri");

const CHROME_ADAYLARI = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

function chromeYolu() {
  const bulunan = CHROME_ADAYLARI.find((yol) => fs.existsSync(yol));
  if (!bulunan) throw new Error("Kurulu Chrome/Edge bulunamadı.");
  return bulunan;
}

/** Demo hesapları — canlı sitedeki tanıtım verisi için kurulmuştu. */
const HESAPLAR = {
  admin: { email: "admin@ozelegitim.local", sifre: "Admin123!" },
  mudur: { email: "mudur@gokkusagi.demo", sifre: "Demo123!" },
  ogretmen: { email: "ogretmen1@gokkusagi.demo", sifre: "Demo123!" },
  veli: { email: "veli1@gokkusagi.demo", sifre: "Demo123!" },
} as const;

type HesapAdi = keyof typeof HESAPLAR;

interface Cekim {
  dosya: string;
  /** Sabit yol. `yolBul` verilmişse yok sayılır. */
  yol?: string;
  /**
   * Yolu çalışma anında bulur: önce `listeYolu` açılır, oradaki ilk
   * `linkDeseni` eşleşmesi hedef alınır (öğrenci id'leri sabit değil).
   */
  yolBul?: { listeYolu: string; linkDeseni: string };
  /** Sayfanın tamamı mı, yoksa yalnızca görünen alan mı? */
  tamSayfa?: boolean;
  /** Görüntüden önce beklenecek ek milisaniye (grafik animasyonları için). */
  bekle?: number;
}

const PLAN: Record<HesapAdi, Cekim[]> = {
  admin: [
    { dosya: "admin-panel", yol: "/admin", bekle: 1500 },
    { dosya: "admin-kurumlar", yol: "/admin/kurumlar" },
    { dosya: "admin-denetim", yol: "/admin/denetim-kayitlari" },
    { dosya: "admin-kullanicilar", yol: "/admin/kullanicilar" },
  ],
  mudur: [
    { dosya: "mudur-panel", yol: "/mudur", bekle: 1500 },
    { dosya: "mudur-ogrenciler", yol: "/mudur/ogrenciler" },
    { dosya: "mudur-program", yol: "/mudur/program" },
    { dosya: "mudur-devamsizlik", yol: "/mudur/devamsizlik" },
  ],
  ogretmen: [
    { dosya: "ogretmen-panel", yol: "/ogretmen", bekle: 1200 },
    { dosya: "ogretmen-yeni-kayit", yol: "/ogretmen/yeni-kayit" },
    { dosya: "ogretmen-devamsizlik", yol: "/ogretmen/devamsizlik" },
    { dosya: "ogretmen-program", yol: "/ogretmen/program" },
    {
      dosya: "ogretmen-ogrenci-profil",
      yolBul: { listeYolu: "/ogretmen", linkDeseni: "/ogretmen/ogrenci/" },
      bekle: 1800,
    },
  ],
  // Not: Tek çocuğu olan veli /veli adresinden doğrudan çocuğun profiline
  // yönlendiriliyor; bu yüzden "veli-panel" zaten profil ekranını gösteriyor.
  veli: [
    { dosya: "veli-panel", yol: "/veli", bekle: 1200 },
    { dosya: "veli-rapor", yol: "/veli/rapor", bekle: 1200 },
  ],
};

async function girisYap(sayfa: Page, hesap: { email: string; sifre: string }) {
  await sayfa.goto(`${TABAN_URL}/giris`, { waitUntil: "networkidle2" });
  await sayfa.waitForSelector("#email", { timeout: 20000 });
  await sayfa.type("#email", hesap.email, { delay: 12 });
  await sayfa.type("#password", hesap.sifre, { delay: 12 });

  await Promise.all([
    sayfa.waitForNavigation({ waitUntil: "networkidle2", timeout: 40000 }).catch(() => null),
    sayfa.click('button[type="submit"]'),
  ]);
  // NextAuth istemci tarafında yönlendiriyor olabilir; kısa bir pay bırak.
  await new Promise((r) => setTimeout(r, 2500));
}

async function cikisYap(sayfa: Page) {
  // Oturum çerezlerini temizlemek en güvenilir yol; UI'daki çıkış menüsüne bağlı kalmıyoruz.
  const cerezler = await sayfa.browserContext().cookies();
  await sayfa.browserContext().deleteCookie(...cerezler);
}

/** Liste sayfasındaki ilk eşleşen bağlantının yolunu döndürür. */
async function yolBul(sayfa: Page, listeYolu: string, linkDeseni: string) {
  await sayfa.goto(`${TABAN_URL}${listeYolu}`, { waitUntil: "networkidle2", timeout: 40000 });
  const bulunan = await sayfa.evaluate((desen) => {
    const bag = Array.from(document.querySelectorAll("a")).find((a) =>
      a.getAttribute("href")?.includes(desen)
    );
    return bag?.getAttribute("href") ?? null;
  }, linkDeseni);

  if (!bulunan) throw new Error(`"${linkDeseni}" içeren bağlantı bulunamadı (${listeYolu})`);
  return bulunan;
}

async function cek(sayfa: Page, cekim: Cekim) {
  const yol = cekim.yolBul
    ? await yolBul(sayfa, cekim.yolBul.listeYolu, cekim.yolBul.linkDeseni)
    : cekim.yol!;

  const hedef = yol.startsWith("http") ? yol : `${TABAN_URL}${yol}`;
  await sayfa.goto(hedef, { waitUntil: "networkidle2", timeout: 40000 });
  if (cekim.bekle) await new Promise((r) => setTimeout(r, cekim.bekle));

  const kaydedilecek = path.join(CIKTI_DIZINI, `${cekim.dosya}.png`);
  await sayfa.screenshot({
    path: kaydedilecek as `${string}.png`,
    fullPage: cekim.tamSayfa ?? false,
  });

  const url = sayfa.url();
  const uyari = url.includes("/giris") ? "  ⚠ giriş sayfasına düştü" : "";
  console.log(`  ✔ ${cekim.dosya}.png${uyari}`);
}

async function main() {
  fs.mkdirSync(CIKTI_DIZINI, { recursive: true });
  console.log(`Hedef: ${TABAN_URL}`);
  console.log(`Çıktı: ${CIKTI_DIZINI}\n`);

  let tarayici: Browser | null = null;
  try {
    tarayici = await puppeteer.launch({
      executablePath: chromeYolu(),
      headless: true,
      defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--lang=tr-TR"],
    });

    const sayfa = await tarayici.newPage();
    await sayfa.emulateTimezone("Europe/Istanbul");

    // Giriş sayfası — oturum gerektirmiyor, en başta alalım.
    await sayfa.goto(`${TABAN_URL}/giris`, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1200));
    await sayfa.screenshot({ path: path.join(CIKTI_DIZINI, "giris.png") as `${string}.png` });
    console.log("  ✔ giris.png\n");

    for (const [ad, cekimler] of Object.entries(PLAN) as [HesapAdi, Cekim[]][]) {
      console.log(`${ad} oturumu:`);
      await cikisYap(sayfa);
      await girisYap(sayfa, HESAPLAR[ad]);

      for (const cekim of cekimler) {
        try {
          await cek(sayfa, cekim);
        } catch (err) {
          console.log(`  ✖ ${cekim.dosya}: ${(err as Error).message.split("\n")[0]}`);
        }
      }
      console.log("");
    }
  } finally {
    await tarayici?.close();
  }

  const uretilen = fs.readdirSync(CIKTI_DIZINI).filter((d) => d.endsWith(".png"));
  console.log(`Toplam ${uretilen.length} görsel üretildi.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
