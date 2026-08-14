function tarihFormatla(tarih: Date) {
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short" }).format(tarih);
}

function kacis(metin: string) {
  return metin
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Projenin kendi renk paleti (src/app/globals.css'teki oklch token'larının sRGB karşılığı).
const RENK = {
  arkaplan: "#fcfaf4",
  kart: "#ffffff",
  kenar: "#d3e1e2",
  metin: "#1d2a37",
  metinSoluk: "#5c6b7a",
  primary: "#009b9c",
  primaryUstYazi: "#f8fdfd",
  primaryYumusak: "#e3f4f4",
  destructive: "#ed4042",
  destructiveYumusak: "#fdeaea",
};

// Kurumun sosyal medya / web sitesi adresleri belli olduğunda buradan doldurulacak.
// Şimdilik "#" - footer'da ikonlar görünür ama tıklanınca hiçbir yere gitmez.
const SOSYAL_LINKLER = {
  instagram: "#",
  twitter: "#",
  website: "#",
};

// Lucide ikon path verileri - projede src/lib/icons.ts'de kullanılan set ile aynı kaynaktan.
// Mail istemcileri harici görsel/font yükleyemeyebildiği için inline SVG olarak gömülüyor.
const IKON_YOLLARI = {
  ogrenci: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  ogretmen:
    '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  tarih:
    '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',
  konu: '<path d="M12 5v16"/><path d="M20.001 19A2 2 0 0 0 22 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2 5 5 0 0 1 4-2z"/>',
  verimlilik: '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  not: '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 5.004 2.224 3 3 0 0 1-.832 2.083l-3.447 3.62a1 1 0 0 1-1.45-.001z"/>',
  onemli: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
} as const;

type IkonAdi = keyof typeof IKON_YOLLARI;

function ikonSvg(ad: IkonAdi, renk: string, boyut = 16) {
  return `<svg width="${boyut}" height="${boyut}" viewBox="0 0 24 24" fill="none" stroke="${renk}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;">${IKON_YOLLARI[ad]}</svg>`;
}

// Marka logoları (Simple Icons, tek path/fill) - lucide'da bulunmuyor.
const INSTAGRAM_YOLU =
  '<path d="M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.418-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>';

const X_YOLU =
  '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>';

const WEBSITE_YOLU =
  '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>';

/** Footer'daki yuvarlak sosyal ikon: projedeki "bg-primary/10 text-primary" yumuşak rozet deseni. */
function sosyalIkon(href: string, path: string, fillMi: boolean) {
  const icerik = fillMi
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="${RENK.primary}">${path}</svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${RENK.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

  return `<a href="${href}" style="display:inline-block;width:36px;height:36px;border-radius:50%;background:${RENK.primaryYumusak};text-decoration:none;">
    <table role="presentation" width="36" height="36" cellpadding="0" cellspacing="0"><tr><td align="center" valign="middle">${icerik}</td></tr></table>
  </a>`;
}

function sosyalSatiri() {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
    <tr>
      <td style="padding:0 6px;">${sosyalIkon(SOSYAL_LINKLER.instagram, INSTAGRAM_YOLU, true)}</td>
      <td style="padding:0 6px;">${sosyalIkon(SOSYAL_LINKLER.twitter, X_YOLU, true)}</td>
      <td style="padding:0 6px;">${sosyalIkon(SOSYAL_LINKLER.website, WEBSITE_YOLU, false)}</td>
    </tr>
  </table>`;
}

/** İkon rozeti + başlık; projedeki empty-state/stat-card ikon kutusu deseniyle aynı. */
function baslikSatiri(ikonAdi: IkonAdi, baslik: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
    <tr>
      <td width="44" valign="middle">
        <table role="presentation" width="44" height="44" cellpadding="0" cellspacing="0" style="background:${RENK.primary};border-radius:12px;">
          <tr><td width="44" height="44" align="center" valign="middle">${ikonSvg(ikonAdi, RENK.primaryUstYazi, 20)}</td></tr>
        </table>
      </td>
      <td width="14"></td>
      <td valign="middle">
        <h1 style="margin:0;font-size:17px;line-height:1.35;color:${RENK.metin};">${kacis(baslik)}</h1>
      </td>
    </tr>
  </table>`;
}

function emailKabugu(ikonAdi: IkonAdi, baslik: string, govdeHtml: string, link: string, linkMetni: string) {
  return `<!doctype html>
<html lang="tr">
  <body style="margin:0;padding:0;background:${RENK.arkaplan};font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${RENK.arkaplan};padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:${RENK.kart};border-radius:16px;overflow:hidden;border:1px solid ${RENK.kenar};">
            <tr>
              <td style="background:${RENK.primary};height:4px;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:28px 28px 8px;">
                ${baslikSatiri(ikonAdi, baslik)}
                ${govdeHtml}
                <div style="margin-top:24px;">
                  <a href="${link}" style="background:${RENK.primary};color:${RENK.primaryUstYazi};padding:11px 20px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block;">${kacis(linkMetni)}</a>
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:26px 28px 6px;">${sosyalSatiri()}</td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#f6f4ec;text-align:center;">
                <span style="color:${RENK.metinSoluk};font-size:11.5px;">Bu e-posta Özel Eğitim Takip sisteminden otomatik gönderilmiştir.</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function satir(ikonAdi: IkonAdi, etiket: string, deger: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 10px;">
    <tr>
      <td width="22" valign="top" style="padding-top:1px;">${ikonSvg(ikonAdi, RENK.metinSoluk)}</td>
      <td width="8"></td>
      <td style="font-size:14px;color:${RENK.metinSoluk};line-height:1.4;"><strong style="color:${RENK.metin};">${kacis(etiket)}:</strong> ${kacis(deger)}</td>
    </tr>
  </table>`;
}

export function dersKaydiEmailKonusu(ogrenciAdi: string) {
  return `${ogrenciAdi} için yeni bir ders kaydı eklendi`;
}

export function dersKaydiEmailHtml(girdi: {
  ogrenciAdi: string;
  ogretmenAdi: string;
  tarih: Date;
  islenenKonu: string | null;
  verimlilikPuani: number;
  serbestNot: string | null;
  link: string;
}) {
  const govde = [
    satir("ogrenci", "Öğrenci", girdi.ogrenciAdi),
    satir("ogretmen", "Öğretmen", girdi.ogretmenAdi),
    satir("tarih", "Tarih", tarihFormatla(girdi.tarih)),
    girdi.islenenKonu ? satir("konu", "İşlenen konu", girdi.islenenKonu) : "",
    satir("verimlilik", "Verimlilik puanı", `${girdi.verimlilikPuani}/10`),
    girdi.serbestNot
      ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0 0;">
          <tr>
            <td width="22" valign="top" style="padding-top:1px;">${ikonSvg("not", RENK.metinSoluk)}</td>
            <td width="8"></td>
            <td style="font-size:14px;color:${RENK.metinSoluk};line-height:1.5;"><strong style="color:${RENK.metin};">Öğretmen notu:</strong><br />${kacis(girdi.serbestNot)}</td>
          </tr>
        </table>`
      : "",
  ].join("");

  return emailKabugu("ogretmen", dersKaydiEmailKonusu(girdi.ogrenciAdi), govde, girdi.link, "Ders kaydını görüntüle");
}

export function veliNotuEmailKonusu(ogrenciAdi: string) {
  return `${ogrenciAdi} için yeni bir not var`;
}

export function veliNotuEmailHtml(girdi: {
  ogrenciAdi: string;
  yazarAdi: string;
  icerik: string;
  onemli: boolean;
  link: string;
}) {
  const govde = [
    girdi.onemli
      ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 14px;">
          <tr>
            <td valign="middle">${ikonSvg("onemli", RENK.destructive)}</td>
            <td width="6"></td>
            <td valign="middle" style="font-size:12px;font-weight:700;color:${RENK.destructive};letter-spacing:0.03em;">ÖNEMLİ</td>
          </tr>
        </table>`
      : "",
    satir("ogrenci", "Öğrenci", girdi.ogrenciAdi),
    satir("ogretmen", "Yazan", girdi.yazarAdi),
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0 0;">
      <tr>
        <td width="22" valign="top" style="padding-top:1px;">${ikonSvg("not", RENK.metinSoluk)}</td>
        <td width="8"></td>
        <td style="font-size:14px;color:${RENK.metinSoluk};line-height:1.5;">${kacis(girdi.icerik)}</td>
      </tr>
    </table>`,
  ].join("");

  return emailKabugu("not", veliNotuEmailKonusu(girdi.ogrenciAdi), govde, girdi.link, "Notu görüntüle");
}
