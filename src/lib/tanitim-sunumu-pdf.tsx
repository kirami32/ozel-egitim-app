import path from "node:path";
import { Document, Page, Text, View, StyleSheet, Font, Svg, Path } from "@react-pdf/renderer";

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

const RENK = {
  teal: "#4E9C88",
  tealKoyu: "#2F6B5C",
  tealAcik: "#EAF5F2",
  turuncu: "#E8A87C",
  turuncuKoyu: "#B9754A",
  mor: "#8B7FD1",
  yesil: "#7FBF7F",
  kirmizi: "#D1857F",
  lacivert: "#28324A",
  gri: "#6B7280",
  griAcik: "#F3F4F6",
  beyaz: "#FFFFFF",
};

const s = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 11,
    fontFamily: FONT_AILESI,
    color: RENK.lacivert,
  },
  icerik: { padding: 40, flex: 1 },

  // Kapak
  kapakSayfa: {
    backgroundColor: RENK.teal,
    color: RENK.beyaz,
    padding: 50,
    height: "100%",
    justifyContent: "space-between",
  },
  kapakUst: { flexDirection: "row", alignItems: "center", gap: 10 },
  kapakLogoKutu: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  kapakLogoMetin: { fontSize: 10, fontFamily: FONT_AILESI, fontWeight: 700, color: RENK.beyaz },
  kapakOrta: { marginTop: 140 },
  kapakBaslik: { fontSize: 34, fontFamily: FONT_AILESI, fontWeight: 700, lineHeight: 1.25 },
  kapakAltBaslik: {
    fontSize: 14,
    marginTop: 14,
    color: "rgba(255,255,255,0.9)",
    maxWidth: 380,
    lineHeight: 1.5,
  },
  kapakEtiketSatiri: { flexDirection: "row", gap: 8, marginTop: 26 },
  kapakEtiket: {
    fontSize: 9,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.16)",
    color: RENK.beyaz,
  },
  kapakAlt: { fontSize: 9, color: "rgba(255,255,255,0.7)" },

  // Ortak sayfa başlığı
  ustBilgi: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
    paddingBottom: 14,
    borderBottom: `2 solid ${RENK.teal}`,
  },
  ustBilgiMarka: { fontSize: 9, fontFamily: FONT_AILESI, fontWeight: 700, color: RENK.teal },
  ustBilgiSayfaNo: { fontSize: 9, color: RENK.gri },
  bolumEtiket: {
    fontSize: 9,
    fontFamily: FONT_AILESI,
    fontWeight: 700,
    color: RENK.teal,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  bolumBaslik: { fontSize: 22, fontFamily: FONT_AILESI, fontWeight: 700, marginBottom: 10 },
  bolumAciklama: { fontSize: 11, color: RENK.gri, lineHeight: 1.6, marginBottom: 22, maxWidth: 480 },

  altBilgi: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#9CA3AF",
  },

  // Problem kartları
  problemGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  problemKart: {
    width: "47%",
    backgroundColor: RENK.griAcik,
    borderRadius: 10,
    padding: 14,
  },
  problemBaslik: { fontSize: 11, fontFamily: FONT_AILESI, fontWeight: 700, marginBottom: 4 },
  problemMetin: { fontSize: 9.5, color: RENK.gri, lineHeight: 1.5 },

  // Rol kartları
  rolKart: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    border: "1 solid #E5E7EB",
  },
  rolUst: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  rolRozet: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rolRozetMetin: { fontSize: 11, fontFamily: FONT_AILESI, fontWeight: 700, color: RENK.beyaz },
  rolBaslik: { fontSize: 13, fontFamily: FONT_AILESI, fontWeight: 700 },
  rolAltBaslik: { fontSize: 9, color: RENK.gri, marginTop: 1 },
  rolMaddeSatiri: { flexDirection: "row", gap: 6, marginTop: 4, alignItems: "flex-start" },
  rolMaddeNokta: { width: 4, height: 4, borderRadius: 2, marginTop: 4 },
  rolMaddeMetin: { fontSize: 9.5, color: "#374151", lineHeight: 1.4, flex: 1 },

  // Özellik kartları
  ozellikGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  ozellikKart: {
    width: "31%",
    padding: 12,
    borderRadius: 10,
    backgroundColor: RENK.tealAcik,
  },
  ozellikIkonKutu: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: RENK.teal,
    marginBottom: 8,
  },
  ozellikBaslik: { fontSize: 10, fontFamily: FONT_AILESI, fontWeight: 700, marginBottom: 3 },
  ozellikMetin: { fontSize: 8.5, color: RENK.gri, lineHeight: 1.4 },

  // Güvenlik listesi
  guvenlikSatiri: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 14,
  },
  guvenlikNoktaKutu: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: RENK.lacivert,
    alignItems: "center",
    justifyContent: "center",
  },
  guvenlikNoktaMetin: { fontSize: 10, fontFamily: FONT_AILESI, fontWeight: 700, color: RENK.beyaz },
  guvenlikBaslik: { fontSize: 11, fontFamily: FONT_AILESI, fontWeight: 700 },
  guvenlikMetin: { fontSize: 9.5, color: RENK.gri, marginTop: 2, lineHeight: 1.5, maxWidth: 440 },

  // Kapanış
  kapanisSayfa: {
    backgroundColor: RENK.lacivert,
    color: RENK.beyaz,
    padding: 50,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  kapanisBaslik: { fontSize: 24, fontFamily: FONT_AILESI, fontWeight: 700, textAlign: "center" },
  kapanisMetin: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    marginTop: 12,
    textAlign: "center",
    maxWidth: 380,
    lineHeight: 1.6,
  },
  kapanisKutu: {
    marginTop: 34,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  kapanisKutuBaslik: { fontSize: 9, color: "rgba(255,255,255,0.6)", marginBottom: 3 },
  kapanisKutuMetin: { fontSize: 12, fontFamily: FONT_AILESI, fontWeight: 700, color: RENK.beyaz },
});

function UstBilgi({ sayfa }: { sayfa: string }) {
  return (
    <View style={s.ustBilgi} fixed>
      <Text style={s.ustBilgiMarka}>ÖZEL EĞİTİM TAKİP SİSTEMİ</Text>
      <Text style={s.ustBilgiSayfaNo}>{sayfa}</Text>
    </View>
  );
}

function AltBilgi() {
  return (
    <View style={s.altBilgi} fixed>
      <Text>ozel-egitim-app.vercel.app</Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

const OKLU_IKON = (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path d="M9 6l6 6-6 6" stroke="#FFFFFF" strokeWidth={2.5} fill="none" />
  </Svg>
);

const ROLLER = [
  {
    ad: "Süper Admin",
    renk: RENK.mor,
    kisaltma: "SA",
    aciklama: "Platformun tamamına genel bakış",
    maddeler: [
      "Tüm kurumları, kullanıcıları ve öğrencileri tek ekrandan izler",
      "Sistem geneli verimlilik trendi, kurum karşılaştırma ve en aktif öğretmen raporlarını görür",
      "Kim, ne zaman, hangi veriye eriştiğini gösteren denetim kaydını (KVKK) inceler, CSV olarak dışa aktarır",
      "Gerektiğinde bir kullanıcıyı pasife alabilir",
      "İçerik üretmez (not, hedef eklemez) — yalnızca izler ve denetler",
    ],
  },
  {
    ad: "Kurum Müdürü",
    renk: RENK.teal,
    kisaltma: "KM",
    aciklama: "Kendi kurumunun tam yöneticisi",
    maddeler: [
      "Kendi kurumundaki öğretmenleri, sınıfları ve öğrencileri yönetir",
      "Kurum geneli verimlilik ve devam trendlerini, davranış dağılımını grafiklerle görür",
      "Tüm öğretmenlerin haftalık ders programını tek ekranda görür",
      "Öğrenci hedeflerine (BEP), notlarına ve belgelerine erişip yönetebilir",
    ],
  },
  {
    ad: "Öğretmen",
    renk: RENK.turuncu,
    kisaltma: "ÖĞ",
    aciklama: "Günlük işin yapıldığı yer",
    maddeler: [
      "Yalnızca kendi sınıfındaki öğrencileri görür",
      "Ders sonrası kayıt (verimlilik puanı, davranış etiketleri, serbest not) girer",
      "Bireyselleştirilmiş eğitim hedefi (BEP) tanımlar, MEB standart ölçeğiyle ilerleme kaydeder",
      "Günlük devam/devamsızlık durumunu işaretler, haftalık ders programını planlar",
      "Veliye tek yönlü, hızlı bir bilgilendirme notu bırakır; resmi belge yükler",
    ],
  },
  {
    ad: "Veli",
    renk: RENK.yesil,
    kisaltma: "VE",
    aciklama: "Sadece kendi çocuğunu görür",
    maddeler: [
      "Yalnızca kendi çocuğunun profiline erişir — başka öğrenciye asla erişemez",
      "Ders kayıtlarını, devam durumunu, hedef ilerlemesini ve öğretmen notlarını okur",
      "Detaylı, imzaya hazır bir gelişim raporunu PDF olarak indirir",
      "Yeni bir not veya hedef eklendiğinde bildirim alır",
    ],
  },
];

const OZELLIKLER = [
  { baslik: "BEP Hedef Takibi", metin: "MEB standart ölçeğiyle (Bağımsız / Sözel İpucuyla / Fiziksel Yardımla / Yapamadı) ilerleme kaydı." },
  { baslik: "Ders Kaydı & Verimlilik", metin: "Her ders sonrası puan, davranış etiketi ve serbest notla anlık kayıt." },
  { baslik: "Devam Takibi", metin: "Günlük devam/devamsızlık girişi ve otomatik oran hesaplama." },
  { baslik: "Veli İletişimi", metin: "Tek yönlü hızlı not paylaşımı ve anlık bildirimlerle veliyi sürece dahil eder." },
  { baslik: "Haftalık Ders Programı", metin: "Öğretmen bazlı, tekrar eden haftalık program planlaması." },
  { baslik: "Belge Yönetimi", metin: "Resmi BEP formu, doktor raporu gibi belgeleri öğrenci profiline ekleme." },
  { baslik: "Detaylı PDF Raporlama", metin: "Hedefler, ders kayıtları ve devam durumunu içeren imzaya hazır veli raporu." },
  { baslik: "Kurumsal Analitik", metin: "Kurum karşılaştırma, verimlilik trendi ve en aktif öğretmen sıralaması." },
  { baslik: "Denetim Kaydı (KVKK)", metin: "Giriş/çıkış dahil her hassas erişim IP adresiyle birlikte kayıt altında." },
];

export function TanitimSunumuPdf() {
  fontlariKaydet();

  return (
    <Document>
      {/* Kapak */}
      <Page size="A4" style={s.page}>
        <View style={s.kapakSayfa}>
          <View style={s.kapakUst}>
            <View style={s.kapakLogoKutu}>
              <Text style={s.kapakLogoMetin}>ÖE</Text>
            </View>
            <Text style={{ fontSize: 11, fontFamily: FONT_AILESI, fontWeight: 700 }}>
              Özel Eğitim Takip Sistemi
            </Text>
          </View>

          <View style={s.kapakOrta}>
            <Text style={s.kapakBaslik}>Kurumunuzun her öğrencisi,{"\n"}tek bir yerden takip edilsin.</Text>
            <Text style={s.kapakAltBaslik}>
              Özel eğitim kurumları için hedef takibi, ders kaydı, devam durumu ve veli iletişimini
              tek platformda birleştiren, roller arası veri gizliliğini garanti eden bir yönetim sistemi.
            </Text>
            <View style={s.kapakEtiketSatiri}>
              <Text style={s.kapakEtiket}>BEP Hedef Takibi</Text>
              <Text style={s.kapakEtiket}>Veli İletişimi</Text>
              <Text style={s.kapakEtiket}>KVKK Uyumlu</Text>
            </View>
          </View>

          <Text style={s.kapakAlt}>Kurum Yöneticileri İçin Tanıtım · ozel-egitim-app.vercel.app</Text>
        </View>
      </Page>

      {/* Neden bu platform */}
      <Page size="A4" style={s.page}>
        <View style={s.icerik}>
          <UstBilgi sayfa="Neden Bu Platform?" />
          <Text style={s.bolumEtiket}>Sorun</Text>
          <Text style={s.bolumBaslik}>Bugün özel eğitim kurumlarında takip nasıl yapılıyor?</Text>
          <Text style={s.bolumAciklama}>
            Çoğu kurumda öğrenci gelişimi kağıt dosyalarda, Excel tablolarında veya öğretmenin kendi
            defterinde dağınık şekilde tutuluyor. Bu durum hem kurum yönetimi hem de veliler için
            ciddi görünmezlik yaratıyor.
          </Text>

          <View style={s.problemGrid}>
            <View style={s.problemKart}>
              <Text style={s.problemBaslik}>Dağınık ve kaybolan veri</Text>
              <Text style={s.problemMetin}>
                Kağıt üzerindeki BEP formları, öğretmen değişince veya dosya kaybolunca geçmiş bilgi
                birlikte kayboluyor.
              </Text>
            </View>
            <View style={s.problemKart}>
              <Text style={s.problemBaslik}>Hedeflerin izlenememesi</Text>
              <Text style={s.problemMetin}>
                Bireyselleştirilmiş eğitim hedefleri düzenli ölçülmediği için ilerleme objektif olarak
                gösterilemiyor.
              </Text>
            </View>
            <View style={s.problemKart}>
              <Text style={s.problemBaslik}>Veli ile kopuk iletişim</Text>
              <Text style={s.problemMetin}>
                Veli, çocuğunun o gün nasıl geçtiğini yalnızca sözlü aktarımla veya dönem sonu
                toplantılarında öğreniyor.
              </Text>
            </View>
            <View style={s.problemKart}>
              <Text style={s.problemBaslik}>Denetlenebilirlik eksikliği</Text>
              <Text style={s.problemMetin}>
                Kim hangi öğrenci verisine ne zaman eriştiğini gösteren bir kayıt olmadığından
                KVKK sorumluluğu güçleşiyor.
              </Text>
            </View>
          </View>
        </View>
        <AltBilgi />
      </Page>

      {/* Kim ne görür */}
      <Page size="A4" style={s.page}>
        <View style={s.icerik}>
          <UstBilgi sayfa="Kim Ne Görür?" />
          <Text style={s.bolumEtiket}>Rol Bazlı Erişim</Text>
          <Text style={s.bolumBaslik}>Dört rol, dört farklı ekran</Text>
          <Text style={s.bolumAciklama}>
            Her kullanıcı yalnızca görmesi gereken veriyi görür. Bir öğretmen yalnızca kendi
            öğrencilerini, bir veli yalnızca kendi çocuğunu görebilir — bu kural arayüzde değil,
            sunucu tarafında zorunlu kılınır.
          </Text>

          {ROLLER.slice(0, 2).map((rol) => (
            <View key={rol.ad} style={s.rolKart}>
              <View style={s.rolUst}>
                <View style={{ ...s.rolRozet, backgroundColor: rol.renk }}>
                  <Text style={s.rolRozetMetin}>{rol.kisaltma}</Text>
                </View>
                <View>
                  <Text style={s.rolBaslik}>{rol.ad}</Text>
                  <Text style={s.rolAltBaslik}>{rol.aciklama}</Text>
                </View>
              </View>
              {rol.maddeler.map((madde, i) => (
                <View key={i} style={s.rolMaddeSatiri}>
                  <View style={{ ...s.rolMaddeNokta, backgroundColor: rol.renk }} />
                  <Text style={s.rolMaddeMetin}>{madde}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <AltBilgi />
      </Page>

      <Page size="A4" style={s.page}>
        <View style={s.icerik}>
          <UstBilgi sayfa="Kim Ne Görür?" />
          {ROLLER.slice(2, 4).map((rol) => (
            <View key={rol.ad} style={s.rolKart}>
              <View style={s.rolUst}>
                <View style={{ ...s.rolRozet, backgroundColor: rol.renk }}>
                  <Text style={s.rolRozetMetin}>{rol.kisaltma}</Text>
                </View>
                <View>
                  <Text style={s.rolBaslik}>{rol.ad}</Text>
                  <Text style={s.rolAltBaslik}>{rol.aciklama}</Text>
                </View>
              </View>
              {rol.maddeler.map((madde, i) => (
                <View key={i} style={s.rolMaddeSatiri}>
                  <View style={{ ...s.rolMaddeNokta, backgroundColor: rol.renk }} />
                  <Text style={s.rolMaddeMetin}>{madde}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <AltBilgi />
      </Page>

      {/* Özellikler */}
      <Page size="A4" style={s.page}>
        <View style={s.icerik}>
          <UstBilgi sayfa="Öne Çıkan Özellikler" />
          <Text style={s.bolumEtiket}>Platform</Text>
          <Text style={s.bolumBaslik}>Tek platformda dokuz temel modül</Text>
          <Text style={s.bolumAciklama}>
            Her modül gerçek bir ihtiyaçtan doğdu; hiçbiri &ldquo;olsun bari&rdquo; eklenmedi.
          </Text>

          <View style={s.ozellikGrid}>
            {OZELLIKLER.map((oz) => (
              <View key={oz.baslik} style={s.ozellikKart}>
                <View style={s.ozellikIkonKutu} />
                <Text style={s.ozellikBaslik}>{oz.baslik}</Text>
                <Text style={s.ozellikMetin}>{oz.metin}</Text>
              </View>
            ))}
          </View>
        </View>
        <AltBilgi />
      </Page>

      {/* Güvenlik */}
      <Page size="A4" style={s.page}>
        <View style={s.icerik}>
          <UstBilgi sayfa="Güvenlik ve KVKK" />
          <Text style={s.bolumEtiket}>Güven</Text>
          <Text style={s.bolumBaslik}>Hassas veri, gerçek koruma altında</Text>
          <Text style={s.bolumAciklama}>
            Özel eğitim verisi özel nitelikli kişisel veridir. Platform bunu bir &ldquo;özellik&rdquo; değil,
            temel tasarım ilkesi olarak ele alır.
          </Text>

          <View style={s.guvenlikSatiri}>
            <View style={s.guvenlikNoktaKutu}>{OKLU_IKON}</View>
            <View>
              <Text style={s.guvenlikBaslik}>Rol bazlı veri izolasyonu</Text>
              <Text style={s.guvenlikMetin}>
                Öğretmen yalnızca kendi sınıfını, veli yalnızca kendi çocuğunu görebilir. Bu kural
                arayüzde gizlenmez, her sunucu isteğinde ayrıca doğrulanır.
              </Text>
            </View>
          </View>
          <View style={s.guvenlikSatiri}>
            <View style={s.guvenlikNoktaKutu}>{OKLU_IKON}</View>
            <View>
              <Text style={s.guvenlikBaslik}>Kapsamlı denetim kaydı</Text>
              <Text style={s.guvenlikMetin}>
                Giriş/çıkış denemeleri (başarısız olanlar dahil), öğrenci profili görüntüleme, rapor
                indirme, veri değişikliği — hepsi kim/ne zaman/hangi IP&apos;den bilgisiyle kaydedilir.
              </Text>
            </View>
          </View>
          <View style={s.guvenlikSatiri}>
            <View style={s.guvenlikNoktaKutu}>{OKLU_IKON}</View>
            <View>
              <Text style={s.guvenlikBaslik}>Şifreli kimlik bilgileri</Text>
              <Text style={s.guvenlikMetin}>
                Şifreler tek yönlü, geri döndürülemez şekilde saklanır; hiçbir yönetici bir
                kullanıcının şifresini görüntüleyemez.
              </Text>
            </View>
          </View>
          <View style={s.guvenlikSatiri}>
            <View style={s.guvenlikNoktaKutu}>{OKLU_IKON}</View>
            <View>
              <Text style={s.guvenlikBaslik}>Anlık erişim iptali</Text>
              <Text style={s.guvenlikMetin}>
                Kurum veya kullanıcı süper admin tarafından tek tıkla pasife alınabilir; pasif
                kullanıcı bir sonraki girişte otomatik reddedilir.
              </Text>
            </View>
          </View>
        </View>
        <AltBilgi />
      </Page>

      {/* Kapanış */}
      <Page size="A4" style={s.page}>
        <View style={s.kapanisSayfa}>
          <Text style={s.kapanisBaslik}>Kurumunuz için de{"\n"}bir sonraki adım</Text>
          <Text style={s.kapanisMetin}>
            Öğrenci gelişimini kağıttan çıkarıp dijital, denetlenebilir ve veli katılımına açık bir
            sisteme taşıyalım.
          </Text>
          <View style={s.kapanisKutu}>
            <Text style={s.kapanisKutuBaslik}>Canlı Demo</Text>
            <Text style={s.kapanisKutuMetin}>ozel-egitim-app.vercel.app</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
