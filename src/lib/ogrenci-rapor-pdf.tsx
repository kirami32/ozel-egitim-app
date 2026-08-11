import path from "node:path";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { HEDEF_KATEGORI_META, BASARI_SEVIYESI_META, HEDEF_DURUM_META } from "@/lib/hedef";
import type { BasariSeviyesi, HedefDurum, HedefKategori } from "@/generated/prisma/enums";

/**
 * react-pdf kendi başına bir CSS motoru çalıştırmıyor, bu yüzden web
 * tarafındaki `var(--chart-N)` renkleri burada çözülemiyor — kategorilere
 * ve başarı düzeylerine PDF'e özel sabit hex renkler tanımlıyoruz. Etiket
 * metinleri (Türkçe adlar) yine tek kaynaktan, lib/hedef.ts'den geliyor.
 */
const HEDEF_KATEGORI_RENK: Record<HedefKategori, string> = {
  ILETISIM: "#4E9C88",
  AKADEMIK: "#8B7FD1",
  SOSYAL: "#E8A87C",
  OZ_BAKIM: "#7FBF7F",
  MOTOR: "#D1857F",
  DAVRANIS: "#D9484F",
};

const BASARI_SEVIYESI_RENK: Record<BasariSeviyesi, string> = {
  BAGIMSIZ: "#5FA872",
  SOZEL_IPUCUYLA: "#D9A441",
  FIZIKSEL_YARDIMLA: "#D1857F",
  YAPAMADI: "#B0483F",
};

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
  ozetSatiri: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
    marginBottom: 20,
  },
  ozetKutu: {
    width: "23%",
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

  hedefKart: {
    border: "1 solid #E5E7EB",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  hedefUst: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  hedefBaslik: { fontSize: 10, fontFamily: FONT_AILESI, fontWeight: 700, flex: 1, marginRight: 8 },
  hedefEtiketSatiri: { flexDirection: "row", gap: 4 },
  hedefEtiket: {
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    color: "#FFFFFF",
  },
  hedefDurumEtiket: {
    fontSize: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    color: "#4B5563",
  },
  hedefAciklama: { fontSize: 9, color: "#6B7280", marginTop: 4 },
  hedefTarih: { fontSize: 8, color: "#9CA3AF", marginTop: 3 },
  ilerlemeBasligi: { fontSize: 8, fontFamily: FONT_AILESI, fontWeight: 700, marginTop: 6, color: "#374151" },
  ilerlemeSatiri: { flexDirection: "row", alignItems: "center", marginTop: 3, gap: 5 },
  ilerlemeNoktasi: { width: 6, height: 6, borderRadius: 3 },
  ilerlemeMetin: { fontSize: 8, color: "#4B5563" },
  ilerlemeNot: { fontSize: 8, color: "#9CA3AF" },
});

interface RaporVerisi {
  ogrenciAdi: string;
  sinifAdi: string;
  kurumAdi: string;
  donem: string;
  ortalamaVerimlilik: string;
  toplamKayit: number;
  enSikEtiket: string;
  devamOrani: string;
  kayitlar: {
    tarih: string;
    konu: string | null;
    puan: number;
    not: string | null;
    etiketler: { ad: string; renk: string }[];
  }[];
  devamKayitlari: {
    tarih: string;
    durum: string;
    aciklama: string | null;
  }[];
  hedefler: {
    baslik: string;
    aciklama: string | null;
    kategori: HedefKategori;
    durum: HedefDurum;
    hedefTarihi: string | null;
    ilerleme: { tarih: string; seviye: BasariSeviyesi; notu: string | null }[];
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
          <View style={styles.ozetKutu}>
            <Text style={styles.ozetDeger}>{veri.devamOrani}</Text>
            <Text style={styles.ozetEtiket}>Devam Oranı</Text>
          </View>
        </View>

        {veri.hedefler.length > 0 && (
          <View>
            <Text style={styles.bolumBaslik}>BEP Hedefleri</Text>
            {veri.hedefler.map((hedef, i) => (
              <View key={i} style={styles.hedefKart} wrap={false}>
                <View style={styles.hedefUst}>
                  <Text style={styles.hedefBaslik}>{hedef.baslik}</Text>
                  <View style={styles.hedefEtiketSatiri}>
                    <Text
                      style={{
                        ...styles.hedefEtiket,
                        backgroundColor: HEDEF_KATEGORI_RENK[hedef.kategori],
                      }}
                    >
                      {HEDEF_KATEGORI_META[hedef.kategori].etiket}
                    </Text>
                    <Text style={styles.hedefDurumEtiket}>
                      {HEDEF_DURUM_META[hedef.durum].etiket}
                    </Text>
                  </View>
                </View>

                {hedef.aciklama && <Text style={styles.hedefAciklama}>{hedef.aciklama}</Text>}
                {hedef.hedefTarihi && (
                  <Text style={styles.hedefTarih}>Hedef tarihi: {hedef.hedefTarihi}</Text>
                )}

                {hedef.ilerleme.length > 0 && (
                  <>
                    <Text style={styles.ilerlemeBasligi}>İlerleme Kayıtları</Text>
                    {hedef.ilerleme.map((kayit, j) => (
                      <View key={j} style={styles.ilerlemeSatiri}>
                        <View
                          style={{
                            ...styles.ilerlemeNoktasi,
                            backgroundColor: BASARI_SEVIYESI_RENK[kayit.seviye],
                          }}
                        />
                        <Text style={styles.ilerlemeMetin}>
                          {kayit.tarih} — {BASARI_SEVIYESI_META[kayit.seviye].kisaEtiket}
                        </Text>
                        {kayit.notu && <Text style={styles.ilerlemeNot}>· {kayit.notu}</Text>}
                      </View>
                    ))}
                  </>
                )}
              </View>
            ))}
          </View>
        )}

        <Text style={styles.bolumBaslik} break={veri.hedefler.length > 0}>
          Ders Kayıtları
        </Text>
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

        {veri.devamKayitlari.length > 0 && (
          <>
            <Text style={styles.bolumBaslik} break>
              Devam Durumu (Son Kayıtlar)
            </Text>
            {veri.devamKayitlari.map((kayit, i) => (
              <View key={i} style={styles.kayitUst} wrap={false}>
                <Text style={{ fontSize: 9, color: "#374151" }}>
                  {kayit.tarih} — {kayit.durum}
                  {kayit.aciklama ? ` (${kayit.aciklama})` : ""}
                </Text>
              </View>
            ))}
          </>
        )}

        <Text style={styles.altBilgi} fixed>
          Bu rapor Özel Eğitim Takip Sistemi tarafından otomatik oluşturulmuştur. İçerik gizlidir,
          yalnızca ilgili veli/vasi ile paylaşılmak üzere hazırlanmıştır.
        </Text>
      </Page>
    </Document>
  );
}
