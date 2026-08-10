import path from "node:path";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

/**
 * Türkçe karakterler (ş, ğ, ı, İ) standart PDF fontlarının (Helvetica) karakter
 * setinde yoktur — bu fontla "Gelişim" kelimesi "Geli_im" olarak çıkar.
 * Bu yüzden Türkçe destekli Roboto'yu projeye gömüp kaydediyoruz.
 */
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
  // Türkçe kelimeler satır sonunda yanlış bölünmesin
  Font.registerHyphenationCallback((kelime) => [kelime]);
  fontlarKayitli = true;
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: FONT_AILESI, color: "#28324A" },
  baslikSatiri: { marginBottom: 20, borderBottom: "2 solid #4E9C88", paddingBottom: 12 },
  baslik: { fontSize: 18, fontFamily: FONT_AILESI, fontWeight: 700, marginBottom: 2 },
  altBaslik: { fontSize: 10, color: "#6B7280" },
  ozetSatiri: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  ozetKutu: {
    width: "31%",
    padding: 10,
    backgroundColor: "#F0F7F5",
    borderRadius: 8,
  },
  ozetDeger: { fontSize: 16, fontFamily: FONT_AILESI, fontWeight: 700, color: "#4E9C88" },
  ozetEtiket: { fontSize: 9, color: "#6B7280", marginTop: 2 },
  bolumBaslik: {
    fontSize: 12,
    fontFamily: FONT_AILESI,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 8,
  },
  kayit: {
    borderBottom: "1 solid #E5E7EB",
    paddingVertical: 8,
  },
  kayitUst: { flexDirection: "row", justifyContent: "space-between" },
  kayitTarih: { fontSize: 10, fontFamily: FONT_AILESI, fontWeight: 700 },
  kayitPuan: { fontSize: 10, fontFamily: FONT_AILESI, fontWeight: 700, color: "#4E9C88" },
  kayitKonu: { fontSize: 9, color: "#6B7280", marginTop: 2 },
  kayitNot: { fontSize: 9, color: "#374151", marginTop: 3 },
  etiketSatiri: { flexDirection: "row", flexWrap: "wrap", marginTop: 4, gap: 4 },
  etiketKutu: {
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    color: "#FFFFFF",
  },
  altBilgi: { position: "absolute", bottom: 30, left: 40, right: 40, fontSize: 8, color: "#9CA3AF" },
});

interface RaporVerisi {
  ogrenciAdi: string;
  sinifAdi: string;
  kurumAdi: string;
  donem: string;
  ortalamaVerimlilik: string;
  toplamKayit: number;
  enSikEtiket: string;
  kayitlar: {
    tarih: string;
    konu: string | null;
    puan: number;
    not: string | null;
    etiketler: { ad: string; renk: string }[];
  }[];
}

export function OgrenciRaporPdf({ veri }: { veri: RaporVerisi }) {
  fontlariKaydet();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.baslikSatiri}>
          <Text style={styles.baslik}>{veri.ogrenciAdi} — Gelişim Raporu</Text>
          <Text style={styles.altBaslik}>
            {veri.kurumAdi} · {veri.sinifAdi} · {veri.donem}
          </Text>
        </View>

        <View style={styles.ozetSatiri}>
          <View style={styles.ozetKutu}>
            <Text style={styles.ozetDeger}>{veri.ortalamaVerimlilik}/10</Text>
            <Text style={styles.ozetEtiket}>Ortalama Verimlilik</Text>
          </View>
          <View style={styles.ozetKutu}>
            <Text style={styles.ozetDeger}>{veri.toplamKayit}</Text>
            <Text style={styles.ozetEtiket}>Toplam Ders Kaydı</Text>
          </View>
          <View style={styles.ozetKutu}>
            <Text style={styles.ozetDeger}>{veri.enSikEtiket}</Text>
            <Text style={styles.ozetEtiket}>En Sık Gözlemlenen Davranış</Text>
          </View>
        </View>

        <Text style={styles.bolumBaslik}>Ders Kayıtları</Text>
        {veri.kayitlar.map((kayit, i) => (
          <View key={i} style={styles.kayit} wrap={false}>
            <View style={styles.kayitUst}>
              <Text style={styles.kayitTarih}>{kayit.tarih}</Text>
              <Text style={styles.kayitPuan}>{kayit.puan}/10</Text>
            </View>
            {kayit.konu && <Text style={styles.kayitKonu}>{kayit.konu}</Text>}
            {kayit.etiketler.length > 0 && (
              <View style={styles.etiketSatiri}>
                {kayit.etiketler.map((e, j) => (
                  <Text key={j} style={{ ...styles.etiketKutu, backgroundColor: e.renk }}>
                    {e.ad}
                  </Text>
                ))}
              </View>
            )}
            {kayit.not && <Text style={styles.kayitNot}>{kayit.not}</Text>}
          </View>
        ))}

        <Text style={styles.altBilgi} fixed>
          Bu rapor Özel Eğitim Takip Sistemi tarafından otomatik oluşturulmuştur. İçerik gizlidir,
          yalnızca ilgili veli/vasi ile paylaşılmak üzere hazırlanmıştır.
        </Text>
      </Page>
    </Document>
  );
}
