import { Font, StyleSheet, Text, View } from "@react-pdf/renderer";

/**
 * Türkçe karakterler (ş, ğ, ı, İ) standart PDF fontlarının (Helvetica) karakter
 * setinde yok. Bu yüzden sistemdeki Arial'i kaydediyoruz.
 */
export function fontlariKaydet() {
  const arialAilesi = [
    { src: "C:/Windows/Fonts/arial.ttf" },
    { src: "C:/Windows/Fonts/arialbd.ttf", fontWeight: 700 as const },
    { src: "C:/Windows/Fonts/ariali.ttf", fontStyle: "italic" as const },
  ];

  Font.register({ family: "Arial", fonts: arialAilesi });

  // Türkçe kelimelerin satır sonunda yanlış bölünmesini engelle
  Font.registerHyphenationCallback((kelime) => [kelime]);
}

export const RENK = {
  metin: "#243043",
  soluk: "#6B7A90",
  ana: "#2E8B7A",
  anaAcik: "#EAF5F2",
  vurgu: "#C77B3F",
  vurguAcik: "#FBF0E6",
  cizgi: "#DFE6EC",
  kutuZemin: "#F7FAFB",
};

export const stil = StyleSheet.create({
  sayfa: {
    paddingTop: 46,
    paddingBottom: 58,
    paddingHorizontal: 46,
    fontFamily: "Arial",
    fontSize: 10,
    lineHeight: 1.55,
    color: RENK.metin,
  },
  kapakSayfa: {
    padding: 0,
    fontFamily: "Arial",
    color: RENK.metin,
  },
  kapakBant: {
    backgroundColor: RENK.ana,
    paddingTop: 90,
    paddingBottom: 46,
    paddingHorizontal: 46,
  },
  kapakUstYazi: {
    fontSize: 10,
    color: "#BFE0D8",
    letterSpacing: 2,
    marginBottom: 14,
  },
  kapakBaslik: {
    fontSize: 30,
    fontFamily: "Arial",
    fontWeight: 700,
    color: "#FFFFFF",
    lineHeight: 1.25,
  },
  kapakAltBaslik: {
    fontSize: 13,
    color: "#D6EDE7",
    marginTop: 12,
    lineHeight: 1.5,
  },
  kapakGovde: {
    paddingHorizontal: 46,
    paddingTop: 34,
  },
  h1: {
    fontSize: 17,
    fontFamily: "Arial",
    fontWeight: 700,
    marginBottom: 4,
    color: RENK.metin,
  },
  h1Cizgi: {
    height: 3,
    width: 44,
    backgroundColor: RENK.ana,
    marginBottom: 14,
  },
  h2: {
    fontSize: 12.5,
    fontFamily: "Arial",
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 6,
    color: RENK.metin,
  },
  h3: {
    fontSize: 10.5,
    fontFamily: "Arial",
    fontWeight: 700,
    marginTop: 10,
    marginBottom: 3,
    color: RENK.ana,
  },
  p: {
    marginBottom: 7,
    textAlign: "justify",
  },
  soluk: {
    color: RENK.soluk,
  },
  kucuk: {
    fontSize: 9,
  },
  madde: {
    flexDirection: "row",
    marginBottom: 4,
    paddingRight: 6,
  },
  maddeNokta: {
    width: 13,
    color: RENK.ana,
    fontFamily: "Arial",
    fontWeight: 700,
  },
  maddeMetin: {
    flex: 1,
  },
  kutu: {
    backgroundColor: RENK.kutuZemin,
    borderLeftWidth: 3,
    borderLeftColor: RENK.ana,
    borderLeftStyle: "solid",
    padding: 11,
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 3,
  },
  uyariKutu: {
    backgroundColor: RENK.vurguAcik,
    borderLeftWidth: 3,
    borderLeftColor: RENK.vurgu,
    borderLeftStyle: "solid",
    padding: 11,
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 3,
  },
  kutuBaslik: {
    fontFamily: "Arial",
    fontWeight: 700,
    marginBottom: 3,
  },
  /**
   * İç içe <Text> öğeleri fontFamily'yi miras almadığı için kalın yazılan
   * her parçada aileyi açıkça belirtmek gerekiyor — aksi hâlde react-pdf
   * gömülü Helvetica'ya düşüyor ve Türkçe karakterler (ş, ğ, ı) bozuluyor.
   */
  kalin: {
    fontFamily: "Arial",
    fontWeight: 700,
  },
  tablo: {
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: RENK.cizgi,
    borderStyle: "solid",
    borderRadius: 3,
  },
  tabloBaslikSatir: {
    flexDirection: "row",
    backgroundColor: RENK.anaAcik,
  },
  tabloSatir: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: RENK.cizgi,
    borderTopStyle: "solid",
  },
  tabloHucre: {
    padding: 7,
    fontSize: 9,
  },
  tabloBaslikHucre: {
    padding: 7,
    fontSize: 9,
    fontFamily: "Arial",
    fontWeight: 700,
  },
  adimSatir: {
    flexDirection: "row",
    marginBottom: 9,
  },
  adimNo: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: RENK.ana,
    color: "#FFFFFF",
    fontSize: 9.5,
    fontFamily: "Arial",
    fontWeight: 700,
    textAlign: "center",
    paddingTop: 3.5,
    marginRight: 9,
  },
  adimMetin: {
    flex: 1,
    paddingTop: 1,
  },
  altBilgi: {
    position: "absolute",
    bottom: 26,
    left: 46,
    right: 46,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: RENK.cizgi,
    borderTopStyle: "solid",
    paddingTop: 7,
    fontSize: 8,
    color: RENK.soluk,
  },
});

export function Madde({ children }: { children: React.ReactNode }) {
  return (
    <View style={stil.madde}>
      <Text style={stil.maddeNokta}>•</Text>
      <Text style={stil.maddeMetin}>{children}</Text>
    </View>
  );
}

export function Adim({ no, children }: { no: number; children: React.ReactNode }) {
  return (
    <View style={stil.adimSatir} wrap={false}>
      <Text style={stil.adimNo}>{no}</Text>
      <Text style={stil.adimMetin}>{children}</Text>
    </View>
  );
}

export function BolumBasligi({ baslik }: { baslik: string }) {
  return (
    <View>
      <Text style={stil.h1}>{baslik}</Text>
      <View style={stil.h1Cizgi} />
    </View>
  );
}

export function Tablo({
  basliklar,
  satirlar,
  genislikler,
}: {
  basliklar: string[];
  satirlar: string[][];
  genislikler: string[];
}) {
  return (
    <View style={stil.tablo}>
      <View style={stil.tabloBaslikSatir}>
        {basliklar.map((b, i) => (
          <Text key={i} style={{ ...stil.tabloBaslikHucre, width: genislikler[i] }}>
            {b}
          </Text>
        ))}
      </View>
      {satirlar.map((satir, si) => (
        <View key={si} style={stil.tabloSatir} wrap={false}>
          {satir.map((h, hi) => (
            <Text key={hi} style={{ ...stil.tabloHucre, width: genislikler[hi] }}>
              {h}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

export function AltBilgi({ belgeAdi }: { belgeAdi: string }) {
  return (
    <View style={stil.altBilgi} fixed>
      <Text>{belgeAdi}</Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}
