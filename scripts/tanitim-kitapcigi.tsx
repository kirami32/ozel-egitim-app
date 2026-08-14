import fs from "node:fs";
import path from "node:path";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const FONT_AILESI = "Roboto";
let fontlarKayitli = false;

function fontlariKaydet() {
  if (fontlarKayitli) return;
  const dizin = path.join(process.cwd(), "src", "assets", "fonts");
  Font.register({
    family: FONT_AILESI,
    fonts: [
      { src: path.join(dizin, "Roboto-Regular.ttf") },
      { src: path.join(dizin, "Roboto-Bold.ttf"), fontWeight: 700 },
    ],
  });
  Font.registerHyphenationCallback((kelime) => [kelime]);
  fontlarKayitli = true;
}

/** Uygulamanın globals.css'indeki oklch token'larının sRGB karşılığı. */
const RENK = {
  teal: "#009B9C",
  tealKoyu: "#046F70",
  tealAcik: "#E3F4F4",
  krem: "#FCFAF4",
  turuncu: "#E8A87C",
  turuncuKoyu: "#B9754A",
  mor: "#8B7FD1",
  yesil: "#6FB98F",
  kirmizi: "#ED4042",
  lacivert: "#1D2A37",
  gri: "#5C6B7A",
  griAcik: "#F3F0E5",
  cizgi: "#D3E1E2",
  beyaz: "#FFFFFF",
};

const GORSEL_DIZINI = path.join(process.cwd(), "docs", "ekran-goruntuleri");

function gorsel(ad: string) {
  return path.join(GORSEL_DIZINI, `${ad}.png`);
}

function gorselVarMi(ad: string) {
  return fs.existsSync(gorsel(ad));
}

const s = StyleSheet.create({
  sayfa: {
    padding: 0,
    fontSize: 10,
    fontFamily: FONT_AILESI,
    color: RENK.lacivert,
    backgroundColor: RENK.beyaz,
  },
  icerik: { paddingHorizontal: 40, paddingTop: 34, paddingBottom: 46, flex: 1 },

  // --- Kapak ---
  kapak: {
    backgroundColor: RENK.teal,
    color: RENK.beyaz,
    padding: 46,
    height: "100%",
    justifyContent: "space-between",
  },
  kapakUst: { flexDirection: "row", alignItems: "center", gap: 10 },
  kapakLogo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  kapakLogoMetin: { fontSize: 15, fontWeight: 700, color: RENK.beyaz },
  kapakMarka: { fontSize: 12, fontWeight: 700, color: RENK.beyaz },
  kapakMarkaAlt: { fontSize: 8.5, color: "rgba(255,255,255,0.75)", marginTop: 1 },
  kapakBaslik: { fontSize: 33, fontWeight: 700, lineHeight: 1.22 },
  kapakAltBaslik: {
    fontSize: 12.5,
    marginTop: 14,
    color: "rgba(255,255,255,0.9)",
    maxWidth: 400,
    lineHeight: 1.55,
  },
  etiketSatiri: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 24 },
  etiket: {
    fontSize: 8.5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.16)",
    color: RENK.beyaz,
  },
  kapakDip: { fontSize: 8.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 },

  // --- Ortak sayfa başlığı ---
  ustBilgi: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
    paddingBottom: 10,
    borderBottom: `1.5 solid ${RENK.teal}`,
  },
  ustMarka: { fontSize: 8.5, fontWeight: 700, color: RENK.teal },
  ustSayfa: { fontSize: 8.5, color: RENK.gri },

  etiketBolum: {
    fontSize: 8.5,
    fontWeight: 700,
    color: RENK.teal,
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  baslik: { fontSize: 21, fontWeight: 700, marginBottom: 8, lineHeight: 1.25 },
  girisMetni: { fontSize: 10.5, color: RENK.gri, lineHeight: 1.6, marginBottom: 18, maxWidth: 470 },

  altBilgi: {
    position: "absolute",
    bottom: 22,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: "#9CA3AF",
  },

  // --- Ekran görüntüsü ---
  ekranCerceve: {
    borderRadius: 8,
    border: `1 solid ${RENK.cizgi}`,
    padding: 5,
    backgroundColor: RENK.krem,
  },
  ekranGorsel: { width: "100%", borderRadius: 4 },
  ekranAltYazi: { fontSize: 8, color: RENK.gri, marginTop: 6 },

  // --- Madde listesi ---
  maddeSatiri: { flexDirection: "row", gap: 7, marginBottom: 7, alignItems: "flex-start" },
  maddeNokta: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: RENK.teal,
    marginTop: 4,
  },
  maddeMetin: { fontSize: 9.5, color: "#374151", lineHeight: 1.5, flex: 1 },

  // --- Kart ızgaraları ---
  grid2: { flexDirection: "row", flexWrap: "wrap", gap: 11 },
  kart2: {
    width: "47.5%",
    backgroundColor: RENK.griAcik,
    borderRadius: 9,
    padding: 13,
  },
  grid3: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  kart3: {
    width: "31.4%",
    backgroundColor: RENK.tealAcik,
    borderRadius: 9,
    padding: 12,
  },
  kartBaslik: { fontSize: 10.5, fontWeight: 700, marginBottom: 4 },
  kartMetin: { fontSize: 9, color: RENK.gri, lineHeight: 1.45 },
  kartIkon: { width: 22, height: 22, borderRadius: 6, marginBottom: 8 },

  // --- Rol kartı ---
  rolKart: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    border: `1 solid ${RENK.cizgi}`,
  },
  rolUst: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 7 },
  rolRozet: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  rolRozetMetin: { fontSize: 10, fontWeight: 700, color: RENK.beyaz },
  rolBaslik: { fontSize: 12, fontWeight: 700 },
  rolAlt: { fontSize: 8.5, color: RENK.gri, marginTop: 1 },

  // --- Vurgu kutusu ---
  vurguKutu: {
    backgroundColor: RENK.tealAcik,
    borderLeft: `3 solid ${RENK.teal}`,
    borderRadius: 6,
    padding: 12,
    marginTop: 14,
  },
  vurguBaslik: { fontSize: 10, fontWeight: 700, marginBottom: 3, color: RENK.tealKoyu },
  vurguMetin: { fontSize: 9, color: "#374151", lineHeight: 1.5 },

  // --- Tablo ---
  tabloSatir: { flexDirection: "row", borderBottom: `1 solid ${RENK.cizgi}` },
  tabloBaslikSatir: { flexDirection: "row", backgroundColor: RENK.tealAcik },
  th: { fontSize: 9, fontWeight: 700, padding: 8, color: RENK.tealKoyu },
  td: { fontSize: 9, padding: 8, color: "#374151", lineHeight: 1.4 },

  // --- İçindekiler ---
  icindekilerSatir: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottom: `1 solid ${RENK.griAcik}`,
  },
  icindekilerMetin: { fontSize: 10, color: "#374151" },
  icindekilerNo: { fontSize: 10, color: RENK.gri, fontWeight: 700 },

  // --- Kapanış ---
  kapanis: {
    backgroundColor: RENK.lacivert,
    color: RENK.beyaz,
    padding: 46,
    height: "100%",
    justifyContent: "center",
  },
  kapanisBaslik: { fontSize: 25, fontWeight: 700, lineHeight: 1.25 },
  kapanisMetin: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    marginTop: 14,
    lineHeight: 1.6,
    maxWidth: 400,
  },
  iletisimKutu: {
    marginTop: 28,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 18,
  },
  iletisimEtiket: { fontSize: 8, color: "rgba(255,255,255,0.55)", textTransform: "uppercase" },
  iletisimDeger: { fontSize: 11.5, color: RENK.beyaz, marginTop: 3, marginBottom: 10 },
});

/* ------------------------------------------------------------------ */
/* Yardımcı bileşenler                                                 */
/* ------------------------------------------------------------------ */

function Madde({ children }: { children: React.ReactNode }) {
  return (
    <View style={s.maddeSatiri}>
      <View style={s.maddeNokta} />
      <Text style={s.maddeMetin}>{children}</Text>
    </View>
  );
}

/**
 * Ekran görüntüsü kutusu. `genislik`, sayfadaki metin yoğunluğuna göre
 * ayarlanır — görsel taşarsa @react-pdf onu başlıksız bir sonraki sayfaya
 * atıyor, bu yüzden her sayfa için ölçü elle veriliyor.
 */
function Ekran({
  ad,
  altYazi,
  genislik = "100%",
}: {
  ad: string;
  altYazi: string;
  genislik?: string;
}) {
  if (!gorselVarMi(ad)) return null;
  // Dosya yolunu doğrudan vermek yerine içeriği okuyoruz: @react-pdf yolu
  // uzak kaynak sanıp fetch etmeye çalışabiliyor.
  const veri = fs.readFileSync(gorsel(ad));
  return (
    <View>
      <View style={[s.ekranCerceve, { width: genislik }]}>
        <Image style={s.ekranGorsel} src={{ data: veri, format: "png" }} />
      </View>
      <Text style={s.ekranAltYazi}>{altYazi}</Text>
    </View>
  );
}

interface SayfaProps {
  etiket: string;
  baslik: string;
  giris?: string;
  no: number;
  children: React.ReactNode;
}

function Sayfa({ etiket, baslik, giris, no, children }: SayfaProps) {
  return (
    <Page size="A4" style={s.sayfa}>
      <View style={s.icerik}>
        <View style={s.ustBilgi}>
          <Text style={s.ustMarka}>ÖZEL EĞİTİM TAKİP SİSTEMİ</Text>
          <Text style={s.ustSayfa}>{String(no).padStart(2, "0")}</Text>
        </View>
        <Text style={s.etiketBolum}>{etiket}</Text>
        <Text style={s.baslik}>{baslik}</Text>
        {giris && <Text style={s.girisMetni}>{giris}</Text>}
        {children}
      </View>
      <View style={s.altBilgi}>
        <Text>Özel Eğitim Takip Sistemi — Kurum Tanıtım Kitapçığı</Text>
        <Text>{String(no).padStart(2, "0")}</Text>
      </View>
    </Page>
  );
}

/* ------------------------------------------------------------------ */
/* Belge                                                               */
/* ------------------------------------------------------------------ */

export function TanitimKitapcigi() {
  return (
    <Document
      title="Özel Eğitim Takip Sistemi — Kurum Tanıtım Kitapçığı"
      author="Özel Eğitim Takip Sistemi"
      subject="Özel eğitim ve rehabilitasyon merkezleri için dijital takip ve raporlama sistemi"
    >
      {/* 1 — Kapak */}
      <Page size="A4" style={s.sayfa}>
        <View style={s.kapak}>
          <View>
            <View style={s.kapakUst}>
              <View style={s.kapakLogo}>
                <Text style={s.kapakLogoMetin}>ÖE</Text>
              </View>
              <View>
                <Text style={s.kapakMarka}>Özel Eğitim</Text>
                <Text style={s.kapakMarkaAlt}>Takip Sistemi</Text>
              </View>
            </View>
          </View>

          <View>
            <Text style={s.kapakBaslik}>
              Kâğıt dosyaların{"\n"}yerini alan dijital{"\n"}takip sistemi
            </Text>
            <Text style={s.kapakAltBaslik}>
              Özel eğitim ve rehabilitasyon merkezleri için BEP hedef takibi, devam kaydı,
              ders raporlaması ve veli iletişimini tek yerde toplayan bulut tabanlı sistem.
            </Text>
            <View style={s.etiketSatiri}>
              <Text style={s.etiket}>MEB BEP ölçeğiyle uyumlu</Text>
              <Text style={s.etiket}>KVKK denetim kaydı</Text>
              <Text style={s.etiket}>Veliye otomatik e-posta</Text>
              <Text style={s.etiket}>Kurulum gerektirmez</Text>
            </View>
          </View>

          <Text style={s.kapakDip}>
            Kurum yöneticileri için hazırlanmıştır.{"\n"}
            Bu kitapçıktaki tüm ekran görüntüleri çalışan sistemden alınmıştır.
          </Text>
        </View>
      </Page>

      {/* 2 — İçindekiler */}
      <Sayfa no={2} etiket="Genel bakış" baslik="İçindekiler">
        <View>
          {[
            ["Neden dijital bir takip sistemi?", "03"],
            ["Sistem ne yapıyor?", "04"],
            ["Dört rol, tek sistem", "05"],
            ["Kurum müdürü paneli", "06"],
            ["Öğrenci, program ve devam yönetimi", "07"],
            ["Öğretmen paneli", "08"],
            ["Ders kaydı: sistemin kalbi", "09"],
            ["Yoklama ve haftalık program", "10"],
            ["Veli görünümü ve PDF rapor", "11"],
            ["Veliye otomatik e-posta bildirimi", "12"],
            ["Çok kurumlu yönetim", "13"],
            ["KVKK ve veri güvenliği", "14"],
            ["Teknik altyapı", "15"],
            ["Kurulum ve destek süreci", "16"],
          ].map(([ad, no]) => (
            <View key={ad} style={s.icindekilerSatir}>
              <Text style={s.icindekilerMetin}>{ad}</Text>
              <Text style={s.icindekilerNo}>{no}</Text>
            </View>
          ))}
        </View>

        <View style={s.vurguKutu}>
          <Text style={s.vurguBaslik}>Bu kitapçık kimin için?</Text>
          <Text style={s.vurguMetin}>
            Özel eğitim ve rehabilitasyon merkezi sahipleri, kurum müdürleri ve eğitim
            koordinatörleri için hazırlandı. Teknik bilgi gerektirmez.
          </Text>
        </View>
      </Sayfa>

      {/* 3 — Problem */}
      <Sayfa
        no={3}
        etiket="Sorun"
        baslik="Neden dijital bir takip sistemi?"
        giris="Özel eğitim kurumlarının çoğu bugün hâlâ kâğıt dosya, Excel tablosu ve WhatsApp mesajlarıyla çalışıyor. Bu, hem denetimlerde hem de veli ilişkilerinde ciddi risk yaratıyor."
      >
        <View style={s.grid2}>
          {[
            [
              "Dağınık kayıtlar",
              "BEP formları dolapta, yoklama defterde, veli mesajları telefonda. Bir öğrencinin geçmişini görmek için üç ayrı yere bakmak gerekiyor.",
            ],
            [
              "Denetime hazırlık stresi",
              "MEB denetimi geldiğinde evrakları toplamak günler alıyor; eksik ya da geç doldurulmuş form riski her zaman var.",
            ],
            [
              "Veli görünürlüğü yok",
              "Veli çocuğunun derste ne yaptığını çoğunlukla bilmiyor. Bilgi akışı olmayınca memnuniyet düşüyor, öğrenci kaybı artıyor.",
            ],
            [
              "Öğretmen değişince bilgi kayboluyor",
              "Ayrılan öğretmenin gözlemleri kayıt altında değilse, yeni öğretmen öğrenciyi sıfırdan tanımaya başlıyor.",
            ],
            [
              "İlerleme ölçülemiyor",
              "Çocuğun gelişimi somut veriyle gösterilemediğinde, hem eğitim planı hem de veliye verilen geri bildirim sezgisel kalıyor.",
            ],
            [
              "KVKK riski",
              "Öğrenci sağlık ve tanı bilgileri özel nitelikli kişisel veri. Kâğıt ve WhatsApp bu veriyi korumak için uygun ortamlar değil.",
            ],
          ].map(([b, m]) => (
            <View key={b} style={s.kart2}>
              <Text style={s.kartBaslik}>{b}</Text>
              <Text style={s.kartMetin}>{m}</Text>
            </View>
          ))}
        </View>
      </Sayfa>

      {/* 4 — Çözüm + giriş ekranı */}
      <Sayfa
        no={4}
        etiket="Çözüm"
        baslik="Sistem ne yapıyor?"
        giris="Tarayıcıdan girilen, kurulum gerektirmeyen bir web uygulaması. Her kullanıcı kendi rolüne göre yalnızca yetkili olduğu veriyi görüyor."
      >
        <Ekran ad="giris" altYazi="Giriş ekranı — her kullanıcı kendi e-posta ve şifresiyle giriş yapar." genislik="88%" />

        <View style={{ marginTop: 14 }}>
          <Madde>
            <Text style={{ fontWeight: 700 }}>Tek kayıt noktası:</Text> ders kayıtları, yoklama,
            BEP hedefleri, belgeler ve veli notları aynı öğrenci dosyasında toplanır.
          </Madde>
          <Madde>
            <Text style={{ fontWeight: 700 }}>Otomatik raporlama:</Text> girilen veriler grafiklere
            ve veliye gönderilebilir PDF raporlara kendiliğinden dönüşür.
          </Madde>
          <Madde>
            <Text style={{ fontWeight: 700 }}>Rol bazlı yetki:</Text> öğretmen yalnızca kendi
            sınıfını, veli yalnızca kendi çocuğunu görür; müdür kurumun tamamını yönetir.
          </Madde>
          <Madde>
            <Text style={{ fontWeight: 700 }}>Her cihazdan erişim:</Text> bilgisayar, tablet ve
            telefondan çalışır; kurulum, lisans veya sunucu gerekmez.
          </Madde>
        </View>
      </Sayfa>

      {/* 5 — Roller */}
      <Sayfa
        no={5}
        etiket="Kullanıcılar"
        baslik="Dört rol, tek sistem"
        giris="Sistem dört farklı kullanıcı tipine göre ayrı ekranlar sunar. Herkes yalnızca işini yapmak için gereken bilgiyi görür."
      >
        {[
          [
            "SA",
            RENK.lacivert,
            "Süper Admin",
            "Sistem sahibi / yazılım yöneticisi",
            "Birden fazla kurumu tek panelden yönetir, kullanıcı açar, denetim kayıtlarını izler, kurum karşılaştırma raporları alır.",
          ],
          [
            "KM",
            RENK.teal,
            "Kurum Müdürü",
            "Merkez sahibi veya müdür",
            "Kendi kurumunun öğretmen, sınıf ve öğrenci kadrosunu yönetir; devam oranlarını, verimlilik trendini ve BEP hedeflerini izler.",
          ],
          [
            "ÖĞ",
            RENK.turuncuKoyu,
            "Öğretmen",
            "Özel eğitim öğretmeni",
            "Ders sonrası kayıt girer, yoklama alır, BEP hedeflerine ilerleme işler, veliye not ve mesaj gönderir.",
          ],
          [
            "VE",
            RENK.mor,
            "Veli",
            "Öğrencinin ebeveyni",
            "Çocuğunun ders kayıtlarını, devam durumunu ve hedef ilerlemesini görür; PDF rapor indirir, öğretmenle mesajlaşır.",
          ],
        ].map(([kod, renk, ad, alt, aciklama]) => (
          <View key={ad} style={s.rolKart}>
            <View style={s.rolUst}>
              <View style={[s.rolRozet, { backgroundColor: renk }]}>
                <Text style={s.rolRozetMetin}>{kod}</Text>
              </View>
              <View>
                <Text style={s.rolBaslik}>{ad}</Text>
                <Text style={s.rolAlt}>{alt}</Text>
              </View>
            </View>
            <Text style={s.kartMetin}>{aciklama}</Text>
          </View>
        ))}
      </Sayfa>

      {/* 6 — Müdür paneli */}
      <Sayfa
        no={6}
        etiket="Kurum müdürü"
        baslik="Kurumun tamamı tek ekranda"
        giris="Müdür panelinde kurumun güncel durumu özet kartlar ve grafiklerle görünür. Kimin kaç öğrencisi var, verimlilik nereye gidiyor, hangi davranışlar öne çıkıyor — hepsi tek bakışta."
      >
        <Ekran
          ad="mudur-panel"
          altYazi="Kurum genel bakış — özet kartlar, verimlilik trendi ve davranış eğilimleri grafiği."
        genislik="92%" />

        <View style={{ marginTop: 14 }}>
          <Madde>
            Öğretmen, öğrenci, sınıf sayısı ve kurum ortalama verimlilik puanı canlı olarak hesaplanır.
          </Madde>
          <Madde>
            Verimlilik trendi grafiği, kurumun eğitim kalitesindeki değişimi zaman içinde gösterir.
          </Madde>
          <Madde>
            Davranış eğilimleri, öğretmenlerin ders kayıtlarında işaretlediği etiketlerden otomatik
            üretilir; kurum genelinde hangi alanlara ağırlık verilmesi gerektiğini ortaya koyar.
          </Madde>
        </View>
      </Sayfa>

      {/* 7 — Öğrenci / program / devam */}
      <Sayfa
        no={7}
        etiket="Kurum müdürü"
        baslik="Öğrenci, program ve devam yönetimi"
        giris="Öğrenci kayıtları, haftalık ders programı ve devamsızlık takibi müdürün doğrudan kontrolünde."
      >
        <Ekran ad="mudur-ogrenciler" altYazi="Öğrenci listesi — arama, filtreleme ve sayfalama ile." genislik="80%" />
        <View style={{ height: 12 }} />
        <Ekran ad="mudur-devamsizlik" altYazi="Devam / devamsızlık takibi — kurum genelinde günlük görünüm." genislik="80%" />
      </Sayfa>

      {/* 8 — Öğretmen paneli */}
      <Sayfa
        no={8}
        etiket="Öğretmen"
        baslik="Öğretmenin günlük çalışma ekranı"
        giris="Öğretmen giriş yaptığında doğrudan kendi öğrencilerini görür. Fazla menü, gereksiz alan yok — amaç ders sonrası kaydın bir dakikada girilmesi."
      >
        <Ekran ad="ogretmen-panel" altYazi="Öğretmen paneli — atanmış öğrenciler ve hızlı erişim." genislik="92%" />

        <View style={{ marginTop: 14 }}>
          <Madde>Öğretmen yalnızca kendi sınıfına atanmış öğrencileri görebilir.</Madde>
          <Madde>
            Geçmiş derslerim ekranından daha önce girdiği tüm kayıtlara ulaşır, tutarlılığını takip eder.
          </Madde>
          <Madde>
            Öğrenci profilinde sağlık ve acil durum bilgisi üstte durur; alerji veya ilaç bilgisi
            derse girmeden önce görünür.
          </Madde>
        </View>
      </Sayfa>

      {/* 9 — Ders kaydı */}
      <Sayfa
        no={9}
        etiket="Öğretmen"
        baslik="Ders kaydı: sistemin kalbi"
        giris="Her dersin sonunda girilen kısa kayıt, sistemdeki bütün grafiklerin, raporların ve veli bildirimlerinin kaynağıdır."
      >
        <Ekran
          ad="ogretmen-ogrenci-profil"
          altYazi="Öğrenci profili ve sağdaki hızlı ders kaydı formu — konu, verimlilik puanı, davranış etiketleri ve serbest not."
        genislik="76%" />

        <View style={{ marginTop: 12 }}>
          <Madde>
            <Text style={{ fontWeight: 700 }}>1–10 verimlilik puanı:</Text> dersin nasıl geçtiğini
            ölçülebilir hale getirir, zaman içindeki değişim grafikte görünür.
          </Madde>
          <Madde>
            <Text style={{ fontWeight: 700 }}>Davranış etiketleri:</Text> duyusal aşırı yüklenme,
            göz teması, odak kaybı gibi hazır etiketler tek dokunuşla işaretlenir.
          </Madde>
          <Madde>
            <Text style={{ fontWeight: 700 }}>Serbest not:</Text> öğretmenin kendi gözlemi; veliye
            gönderilen raporda ve e-postada aynen yer alır.
          </Madde>
        </View>

        <View style={s.vurguKutu}>
          <Text style={s.vurguBaslik}>Neden önemli?</Text>
          <Text style={s.vurguMetin}>
            Öğretmen değişse bile öğrencinin geçmişi kurumda kalır. Yeni öğretmen, çocuğu ilk
            günden veriyle tanır; veli ise her ders sonrası ne yapıldığını görür.
          </Text>
        </View>
      </Sayfa>

      {/* 10 — Yoklama ve program */}
      <Sayfa
        no={10}
        etiket="Öğretmen"
        baslik="Yoklama ve haftalık program"
        giris="Devam kaydı ve ders programı, hem kurumun planlamasını hem de veliye verilen devam raporunu besler."
      >
        <Ekran ad="ogretmen-devamsizlik" altYazi="Yoklama ekranı — var / yok / geç / izinli olarak tek ekranda işaretlenir." genislik="80%" />
        <View style={{ height: 12 }} />
        <Ekran ad="ogretmen-program" altYazi="Haftalık ders programı — öğretmenin hangi gün hangi öğrenciyle çalıştığı." genislik="80%" />
      </Sayfa>

      {/* 11 — Veli görünümü */}
      <Sayfa
        no={11}
        etiket="Veli"
        baslik="Velinin gördüğü ekran"
        giris="Veli sisteme girdiğinde doğrudan çocuğunun sayfasına ulaşır. Yalnızca kendi çocuğunu görür; başka hiçbir öğrencinin verisine erişemez."
      >
        <Ekran
          ad="veli-panel"
          altYazi="Veli görünümü — öğrenci profili, sağlık bilgisi, mesajlaşma ve PDF rapor indirme."
        genislik="80%" />

        <View style={{ marginTop: 14 }}>
          <Madde>Ders kayıtları, devam durumu ve BEP hedef ilerlemesi veliye şeffaf biçimde açılır.</Madde>
          <Madde>
            Veli, öğretmenle sistem içinden mesajlaşabilir; fotoğraf veya belge eki gönderebilir.
          </Madde>
          <Madde>
            Sağlık ve acil durum bilgisini veli kendisi girer; öğretmen derse girmeden önce görür.
          </Madde>
          <Madde>
            <Text style={{ fontWeight: 700 }}>PDF Rapor İndir</Text> ile çocuğun gelişim raporu tek
            tıkla indirilir — kuruma ek iş çıkarmadan.
          </Madde>
        </View>
      </Sayfa>

      {/* 12 — E-posta bildirimi */}
      <Sayfa
        no={12}
        etiket="Veli iletişimi"
        baslik="Veliye otomatik e-posta bildirimi"
        giris="Öğretmen bir ders kaydı ya da veli notu eklediğinde, velinin e-posta adresine detaylı bir bilgilendirme otomatik olarak gider. Kimsenin ayrıca mesaj yazması gerekmez."
      >
        <View style={s.grid2}>
          {[
            [
              "Ders bittiğinde",
              "Öğrenci adı, öğretmen, tarih, işlenen konu, verimlilik puanı ve öğretmen notu veliye e-posta ile iletilir.",
            ],
            [
              "Veli notu eklendiğinde",
              "Öğretmen veya müdürün yazdığı bilgilendirme notu anında veliye ulaşır; önemli işaretli notlar ayrıca vurgulanır.",
            ],
            [
              "Uygulama içi bildirim",
              "E-postanın yanında sistem içindeki bildirim ziline de düşer; veli giriş yaptığında okunmamış bildirimleri görür.",
            ],
            [
              "Tek tıkla erişim",
              "E-postadaki buton veliyi doğrudan ilgili ekrana götürür; şifre veya bağlantı arama derdi yoktur.",
            ],
          ].map(([b, m]) => (
            <View key={b} style={s.kart2}>
              <Text style={s.kartBaslik}>{b}</Text>
              <Text style={s.kartMetin}>{m}</Text>
            </View>
          ))}
        </View>

        <View style={s.vurguKutu}>
          <Text style={s.vurguBaslik}>Kuruma ne kazandırır?</Text>
          <Text style={s.vurguMetin}>
            Veli memnuniyetsizliğinin en yaygın sebebi bilgi eksikliğidir. Her ders sonrası
            otomatik giden bilgilendirme, kurumun yaptığı işi görünür kılar ve öğrenci
            devamlılığını doğrudan destekler.
          </Text>
        </View>
      </Sayfa>

      {/* 13 — Çok kurumlu yönetim */}
      <Sayfa
        no={13}
        etiket="Süper admin"
        baslik="Birden fazla şube, tek panel"
        giris="Zincir kurumlar ve birden fazla şubesi olan merkezler için tüm kurumlar tek yönetim panelinden izlenir."
      >
        <Ekran ad="admin-panel" altYazi="Süper admin genel bakış — kurumlar arası karşılaştırmalı görünüm." genislik="80%" />
        <View style={{ height: 12 }} />
        <Ekran ad="admin-kurumlar" altYazi="Kurum yönetimi — yeni kurum ekleme, aktif/pasif durumu." genislik="80%" />
      </Sayfa>

      {/* 14 — KVKK */}
      <Sayfa
        no={14}
        etiket="Güvenlik"
        baslik="KVKK ve veri güvenliği"
        giris="Özel eğitim kurumları, öğrencilerin tanı ve sağlık bilgisi gibi özel nitelikli kişisel verileri işler. Sistem bu sorumluluğu teknik önlemlerle destekler."
      >
        <Ekran ad="admin-denetim" altYazi="Denetim kayıtları — hangi kullanıcı, hangi veriye, ne zaman erişti." genislik="80%" />

        <View style={{ marginTop: 14 }}>
          <Madde>
            <Text style={{ fontWeight: 700 }}>Denetim kaydı:</Text> giriş/çıkış, öğrenci görüntüleme,
            kayıt oluşturma ve silme işlemleri kullanıcı ve IP bilgisiyle saklanır.
          </Madde>
          <Madde>
            <Text style={{ fontWeight: 700 }}>Rol bazlı erişim:</Text> her sorgu veri katmanında
            yetki denetiminden geçer; yetkisiz erişim veri tabanına kadar ulaşamaz.
          </Madde>
          <Madde>
            <Text style={{ fontWeight: 700 }}>Şifre güvenliği:</Text> parolalar bcrypt ile
            saklanır, art arda başarısız giriş denemelerinde hesap geçici olarak kilitlenir ve
            yöneticiye güvenlik uyarısı düşer.
          </Madde>
          <Madde>
            <Text style={{ fontWeight: 700 }}>Silinmeyen geçmiş:</Text> kullanıcı silinse bile
            denetim kaydı korunur; sorumluluk zinciri kopmaz.
          </Madde>
        </View>
      </Sayfa>

      {/* 15 — Teknik */}
      <Sayfa
        no={15}
        etiket="Teknik"
        baslik="Altyapı ve çalışma şekli"
        giris="Kurumun sunucu kurmasına, lisans satın almasına veya bilgi işlem personeli tutmasına gerek yoktur."
      >
        <View style={s.grid3}>
          {[
            ["Bulut tabanlı", "Sistem bulutta çalışır; kurum yalnızca tarayıcıdan giriş yapar."],
            ["Güncellemeler otomatik", "Yeni özellikler kuruma ek iş çıkarmadan yayına alınır."],
            ["Yedekli veri tabanı", "Veriler yönetilen PostgreSQL üzerinde, düzenli yedeklemeyle tutulur."],
            ["Mobil uyumlu", "Telefon ve tablette de tam işlevsel çalışır."],
            ["Türkçe arayüz", "Tüm ekranlar ve raporlar Türkçe; yabancı yazılım çevirisi değildir."],
            ["Hızlı erişim", "Sayfalar sunucu tarafında hazırlanır, düşük internet hızında da açılır."],
          ].map(([b, m]) => (
            <View key={b} style={s.kart3}>
              <View style={[s.kartIkon, { backgroundColor: RENK.teal }]} />
              <Text style={s.kartBaslik}>{b}</Text>
              <Text style={s.kartMetin}>{m}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={[s.kartBaslik, { marginBottom: 8 }]}>MEB uyumu</Text>
          <View style={s.tabloBaslikSatir}>
            <Text style={[s.th, { width: "38%" }]}>Sistemdeki karşılığı</Text>
            <Text style={[s.th, { width: "62%" }]}>Açıklama</Text>
          </View>
          {[
            ["BEP hedefleri", "Hedef, kategori, hedef tarihi ve ilerleme kayıtlarıyla birlikte tutulur."],
            [
              "Başarı düzeyi ölçeği",
              "Bağımsız / sözel ipucuyla / fiziksel yardımla / yapamadı — MEB BEP formlarındaki standart ölçek.",
            ],
            ["Devam çizelgesi", "Var / yok / geç / izinli durumlarıyla günlük kayıt."],
            ["Öğrenci dosyası", "Resmî belgeler, doktor raporu ve değerlendirme evrakı sisteme yüklenebilir."],
          ].map(([a, b]) => (
            <View key={a} style={s.tabloSatir}>
              <Text style={[s.td, { width: "38%", fontWeight: 700 }]}>{a}</Text>
              <Text style={[s.td, { width: "62%" }]}>{b}</Text>
            </View>
          ))}
        </View>
      </Sayfa>

      {/* 16 — Kurulum süreci */}
      <Sayfa
        no={16}
        etiket="Başlangıç"
        baslik="Kurulum ve destek süreci"
        giris="Kurumun sisteme geçişi genellikle bir hafta içinde tamamlanır. Veri girişinde destek sağlanır."
      >
        {[
          ["1", "Tanışma ve demo", "Kurumun ihtiyaçları dinlenir, sistem canlı veriyle gösterilir. Yaklaşık 30 dakika."],
          ["2", "Kurum kaydı", "Kurum, sınıflar ve öğretmen hesapları oluşturulur. Kurum tarafında hiçbir teknik işlem gerekmez."],
          ["3", "Öğrenci ve veli aktarımı", "Mevcut öğrenci listesi sisteme aktarılır, veli hesapları açılır."],
          ["4", "Öğretmen eğitimi", "Öğretmenlere ders kaydı ve yoklama girişi anlatılır. Tek oturum yeterlidir."],
          ["5", "Deneme dönemi", "Kurum sistemi gerçek verisiyle kullanır; sorular anında yanıtlanır."],
          ["6", "Sürekli destek", "Yayına alındıktan sonra da güncellemeler ve destek devam eder."],
        ].map(([no, b, m]) => (
          <View key={no} style={[s.maddeSatiri, { marginBottom: 12 }]}>
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                backgroundColor: RENK.teal,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: 700, color: RENK.beyaz }}>{no}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 3 }}>
              <Text style={s.kartBaslik}>{b}</Text>
              <Text style={s.kartMetin}>{m}</Text>
            </View>
          </View>
        ))}

        <View style={s.vurguKutu}>
          <Text style={s.vurguBaslik}>Geçiş sırasında kurum çalışmaya devam eder</Text>
          <Text style={s.vurguMetin}>
            Sistem, mevcut kâğıt düzenin yerini bir anda almak zorunda değildir. Kurum önce ders
            kaydı ve yoklamayla başlar, alışıldıkça BEP hedefleri ve veli iletişimi devreye alınır.
          </Text>
        </View>
      </Sayfa>

      {/* 17 — Kapanış */}
      <Page size="A4" style={s.sayfa}>
        <View style={s.kapanis}>
          <Text style={s.kapanisBaslik}>
            Kurumunuzu canlı{"\n"}sistemde görelim
          </Text>
          <Text style={s.kapanisMetin}>
            Demo görüşmesinde sistemi kendi öğrenci ve sınıf yapınızla birlikte kuruyoruz.
            Sunum değil, doğrudan çalışan ekranlar üzerinden ilerliyoruz.
          </Text>

          <View style={s.iletisimKutu}>
            <Text style={s.iletisimEtiket}>Demo ve bilgi için</Text>
            <Text style={s.iletisimDeger}>oberat020@gmail.com</Text>

            <Text style={s.iletisimEtiket}>Canlı sistem</Text>
            <Text style={s.iletisimDeger}>ozel-egitim-app.vercel.app</Text>
          </View>

          <Text style={[s.kapanisMetin, { fontSize: 8.5, marginTop: 26 }]}>
            Bu kitapçıktaki ekran görüntüleri, tanıtım amacıyla oluşturulmuş demo verilerle
            çalışan sistemden alınmıştır. Gerçek öğrenci verisi içermez.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

/* ------------------------------------------------------------------ */

export { fontlariKaydet };
