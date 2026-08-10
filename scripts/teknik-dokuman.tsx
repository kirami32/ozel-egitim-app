import { Document, Page, Text, View } from "@react-pdf/renderer";
import { Adim, AltBilgi, BolumBasligi, Madde, RENK, Tablo, stil } from "./pdf-bilesenleri";

const BELGE = "Özel Eğitim Takip Sistemi — Teknik Doküman";

export function TeknikDokuman() {
  return (
    <Document
      title="Özel Eğitim Takip Sistemi — Teknik Doküman"
      author="Özel Eğitim Takip Sistemi"
      language="tr"
    >
      {/* ---------- KAPAK ---------- */}
      <Page size="A4" style={stil.kapakSayfa}>
        <View style={stil.kapakBant}>
          <Text style={stil.kapakUstYazi}>TEKNİK DOKÜMAN</Text>
          <Text style={stil.kapakBaslik}>{"Özel Eğitim Takip ve\nRaporlama Sistemi"}</Text>
          <Text style={stil.kapakAltBaslik}>
            Kullanılan teknolojiler, tercih gerekçeleri, veri modeli ve sistem mimarisi
          </Text>
        </View>

        <View style={stil.kapakGovde}>
          <Text style={stil.h2}>Bu belge nedir?</Text>
          <Text style={stil.p}>
            Bu belge, özel eğitim kurumları için geliştirilen öğrenci takip ve raporlama
            platformunun teknik altyapısını açıklar. Hangi teknolojinin neden seçildiğini,
            verilerin nasıl saklandığını, rollerin birbirinden nasıl ayrıldığını ve KVKK
            kapsamındaki önlemleri özetler.
          </Text>

          <View style={stil.kutu}>
            <Text style={stil.kutuBaslik}>Sistem tek cümleyle</Text>
            <Text>
              Öğretmenlerin her ders sonrası girdiği verimlilik puanı, serbest not ve davranış
              etiketlerini; öğrenci bazlı gelişim grafiklerine, kurum geneli raporlara ve veliye
              sunulan dönemsel PDF çıktılarına dönüştüren, rol bazlı yetkilendirmeye sahip bir web
              platformu.
            </Text>
          </View>

          <Text style={stil.h2}>İçindekiler</Text>
          <Madde>Projenin amacı ve çözdüğü problem</Madde>
          <Madde>Kullanılan teknolojiler ve seçim gerekçeleri</Madde>
          <Madde>Veri modeli (veritabanı yapısı)</Madde>
          <Madde>Roller ve yetki matrisi</Madde>
          <Madde>Güvenlik ve KVKK uyumluluğu</Madde>
          <Madde>Ekranlar ve özellikler</Madde>
          <Madde>Yayına alma (deployment) altyapısı</Madde>

          <View style={{ marginTop: 26, paddingTop: 12, borderTopWidth: 1, borderTopColor: RENK.cizgi, borderTopStyle: "solid" }}>
            <Text style={{ ...stil.kucuk, ...stil.soluk }}>
              Belge tarihi: {new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(new Date())}
            </Text>
          </View>
        </View>
      </Page>

      {/* ---------- 1. AMAÇ ---------- */}
      <Page size="A4" style={stil.sayfa}>
        <BolumBasligi baslik="1. Projenin Amacı ve Çözdüğü Problem" />

        <Text style={stil.p}>
          Özel eğitim kurumlarında öğrenci gelişimi genellikle kâğıt defterlere, ayrı ayrı Excel
          dosyalarına veya öğretmenin kişisel notlarına yazılır. Bu yöntemin üç temel sorunu vardır:
        </Text>

        <Madde>
          <Text style={stil.kalin}>Veri kaybolur ve karşılaştırılamaz. </Text>
          Öğretmen değiştiğinde geçmiş bilgi kaybolur; “bu öğrenci üç ay önce neredeydi, şimdi
          nerede?” sorusu cevapsız kalır.
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Veli bilgiye erişemez. </Text>
          Aile, çocuğunun gelişimini yalnızca sözlü geri bildirimle öğrenir; somut bir gelişim
          eğrisi göremez.
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Kurum yönetimi kör uçar. </Text>
          Müdür, kurum genelinde hangi öğrencinin gerilediğini veya hangi davranışın yaygınlaştığını
          sayısal olarak takip edemez.
        </Madde>

        <Text style={stil.h2}>Sistemin yaklaşımı</Text>
        <Text style={stil.p}>
          Platform, her ders sonrası öğretmenden yalnızca <Text style={stil.kalin}>üç şey</Text>{" "}
          ister: 1–10 arası bir verimlilik puanı, işlenen konu ve gözlemlenen davranışların
          etiketlenmesi. Serbest metin not isteğe bağlıdır. Bu minimal giriş, zamanla anlamlı bir
          veri birikimine dönüşür.
        </Text>

        <View style={stil.kutu}>
          <Text style={stil.kutuBaslik}>Neden serbest metin değil de etiket sistemi?</Text>
          <Text>
            “Bugün çok tepkiliydi” gibi bir not insan için anlamlıdır ama sayılamaz. Davranışlar
            önceden tanımlı etiketlerle (Ekolali, Duyusal Aşırı Yüklenme, Odak Kaybı, Göz Teması
            Kurma vb.) işaretlendiğinde, “bu öğrencide odak kaybı son bir ayda kaç kez gözlendi?”
            sorusu grafikle cevaplanabilir hâle gelir. Serbest metin not, etiketlerin üzerine ek
            bağlam olarak korunur — ikisi birbirinin yerine değil, tamamlayıcısı olarak kullanılır.
          </Text>
        </View>

        <Text style={stil.h2}>Hedef kullanıcılar</Text>
        <Tablo
          genislikler={["24%", "76%"]}
          basliklar={["Rol", "Sistemden beklentisi"]}
          satirlar={[
            ["Öğretmen", "Ders sonrası 30 saniyede kayıt girmek, öğrencinin geçmişini görmek"],
            ["Kurum Müdürü", "Kurum geneli performansı izlemek, öğretmen ve öğrenci yönetimi"],
            ["Veli", "Çocuğunun gelişimini somut olarak görmek, dönemsel rapor almak"],
            ["Süper Admin", "Birden fazla kurumu yönetmek, sistem geneli denetim"],
          ]}
        />

        <AltBilgi belgeAdi={BELGE} />
      </Page>

      {/* ---------- 2. TEKNOLOJİLER ---------- */}
      <Page size="A4" style={stil.sayfa}>
        <BolumBasligi baslik="2. Kullanılan Teknolojiler ve Seçim Gerekçeleri" />

        <Text style={stil.h3}>Next.js 16 (App Router) — Uygulama çatısı</Text>
        <Text style={stil.p}>
          Hem arayüzü hem sunucu tarafını tek bir kod tabanında topladığı için seçildi. Ayrı bir
          backend servisi kurmak, dağıtmak ve iki ayrı sistemi senkron tutmak gerekmiyor. Sayfalar
          sunucuda üretildiği (Server Components) için veritabanı sorgusu doğrudan sayfa içinde
          çalışır; hassas veri hiçbir zaman tarayıcıya gereksiz yere gönderilmez. Bu, özel nitelikli
          sağlık verisi işleyen bir sistemde önemli bir güvenlik avantajıdır.
        </Text>

        <Text style={stil.h3}>TypeScript — Tip güvenliği</Text>
        <Text style={stil.p}>
          Veritabanı şemasından arayüze kadar tüm katmanlarda tiplerin uyumlu olmasını zorunlu
          kılar. “Öğrencinin veli alanı boş olabilir” gibi durumlar derleme aşamasında yakalanır,
          canlıda hata olarak patlamaz.
        </Text>

        <Text style={stil.h3}>PostgreSQL (Neon) — Veritabanı</Text>
        <Text style={stil.p}>
          Veriler doğası gereği ilişkisel: kurum → sınıf → öğrenci → ders kaydı → davranış etiketi.
          Bu ilişkileri ve “son 3 ayın ortalaması” gibi zaman serisi sorgularını en verimli yapan
          seçenek ilişkisel bir veritabanıdır. Neon, sunucu yönetimi gerektirmeyen (serverless) bir
          PostgreSQL sağlayıcısıdır ve ücretsiz katmanı bu ölçek için yeterlidir.
        </Text>

        <Text style={stil.h3}>Prisma 7 — ORM ve şema yönetimi</Text>
        <Text style={stil.p}>
          Veritabanı yapısı tek bir şema dosyasında tanımlanır; Prisma buradan hem tip güvenli
          sorgu istemcisini hem de sürümlenebilir migration dosyalarını üretir. Şema değiştiğinde
          hangi SQL komutlarının çalışacağı önceden görülebilir, bu da canlı veritabanında kazara
          veri kaybı riskini azaltır.
        </Text>

        <Text style={stil.h3}>NextAuth v5 — Kimlik doğrulama</Text>
        <Text style={stil.p}>
          Oturum yönetimi, çerez güvenliği ve CSRF koruması gibi kolay hata yapılan konuları hazır
          ve denenmiş bir çözümle karşılar. Şifreler bcrypt ile (12 tur) özetlenerek saklanır;
          veritabanı ele geçse dahi şifreler okunabilir değildir. Oturum bilgisi JWT içinde taşınır
          ve kullanıcının rolü ile kurum kimliğini içerir.
        </Text>

        <Text style={stil.h3}>Tailwind CSS v4 + shadcn/ui (Radix) — Arayüz</Text>
        <Text style={stil.p}>
          shadcn/ui bileşenleri projeye kaynak kod olarak kopyalanır; dışarıdan bir paket gibi
          kilitli değildir, istenildiği gibi değiştirilebilir. Altyapısındaki Radix, klavye
          navigasyonu ve ekran okuyucu desteğini standart olarak sağlar — özel eğitim alanında
          çalışan bir üründe erişilebilirlik ihmal edilemez.
        </Text>

        <AltBilgi belgeAdi={BELGE} />
      </Page>

      <Page size="A4" style={stil.sayfa}>
        <Text style={stil.h3}>Recharts — Grafikler</Text>
        <Text style={stil.p}>
          Verimlilik trend çizgisi ve davranış etiketi dağılım grafiği bu kütüphaneyle üretilir.
          Grafik renkleri sabit kodlanmak yerine uygulamanın tema değişkenlerinden okunur; böylece
          açık/koyu tema değiştiğinde grafikler de uyumlu kalır.
        </Text>

        <Text style={stil.h3}>React Hook Form + Zod — Form yönetimi ve doğrulama</Text>
        <Text style={stil.p}>
          Aynı doğrulama kuralları hem tarayıcıda (hızlı geri bildirim için) hem sunucuda (güvenlik
          için) çalıştırılır. Sunucu tarafındaki kontrol asıl olandır: kullanıcı tarayıcıdaki
          kontrolü atlatsa bile geçersiz veri veritabanına yazılamaz.
        </Text>

        <Text style={stil.h3}>@react-pdf/renderer — PDF rapor üretimi</Text>
        <Text style={stil.p}>
          Velinin indirdiği dönemsel rapor sunucuda PDF olarak üretilir. Rapor, o anki veriden
          anlık olarak oluşturulur; önceden hazırlanmış dosya saklanmadığı için eskimiş veri
          paylaşılması riski yoktur. (Bu belgenin kendisi de aynı altyapıyla üretilmiştir.)
        </Text>

        <Text style={stil.h3}>Framer Motion — Mikro animasyonlar</Text>
        <Text style={stil.p}>
          Kartların belirmesi, aktif menü göstergesinin kayması gibi küçük geçişler için kullanılır.
          Amaç süs değil, kullanıcının ekranda ne değiştiğini takip edebilmesidir.
        </Text>

        <Text style={stil.h3}>Vercel — Yayın ortamı</Text>
        <Text style={stil.p}>
          GitHub deposuna yapılan her gönderim otomatik olarak yayına alınır. Hata durumunda önceki
          sürüme tek tıkla geri dönülebilir. Sunucu bakımı, SSL sertifikası ve ölçekleme platform
          tarafından yönetilir.
        </Text>

        <Text style={stil.h2}>Özet teknoloji tablosu</Text>
        <Tablo
          genislikler={["30%", "22%", "48%"]}
          basliklar={["Teknoloji", "Katman", "Temel gerekçe"]}
          satirlar={[
            ["Next.js 16", "Uygulama çatısı", "Tek kod tabanı, sunucuda render, hız"],
            ["TypeScript", "Dil", "Tip güvenliği, hataların erken yakalanması"],
            ["PostgreSQL / Neon", "Veritabanı", "İlişkisel yapı, zaman serisi sorguları"],
            ["Prisma 7", "ORM", "Tip güvenli sorgu, sürümlü şema değişikliği"],
            ["NextAuth v5", "Kimlik doğrulama", "Oturum ve rol yönetimi, CSRF koruması"],
            ["bcrypt", "Güvenlik", "Şifrelerin geri döndürülemez şekilde saklanması"],
            ["Tailwind + shadcn/ui", "Arayüz", "Hızlı geliştirme, erişilebilir bileşenler"],
            ["Recharts", "Görselleştirme", "Trend ve dağılım grafikleri"],
            ["React Hook Form + Zod", "Form", "Çift taraflı doğrulama"],
            ["@react-pdf/renderer", "Raporlama", "Sunucuda dinamik PDF üretimi"],
            ["Vercel", "Yayın", "Otomatik dağıtım, kolay geri alma"],
          ]}
        />

        <AltBilgi belgeAdi={BELGE} />
      </Page>

      {/* ---------- 3. VERİ MODELİ ---------- */}
      <Page size="A4" style={stil.sayfa}>
        <BolumBasligi baslik="3. Veri Modeli" />

        <Text style={stil.p}>
          Sistem sekiz tablodan oluşur. Aşağıdaki zincir, verinin nasıl bağlandığını özetler:
        </Text>

        <View style={stil.kutu}>
          <Text style={{ ...stil.kalin, textAlign: "center" }}>
            Kurum → Sınıf → Öğrenci → Ders Kaydı → Davranış Etiketi
          </Text>
        </View>

        <Tablo
          genislikler={["26%", "74%"]}
          basliklar={["Tablo", "İçeriği ve rolü"]}
          satirlar={[
            [
              "Institution\n(Kurum)",
              "Ad, adres, iletişim, aktiflik durumu. Tüm veri izolasyonunun kök noktasıdır — bir kurumun verisi başka kuruma sızamaz.",
            ],
            [
              "User\n(Kullanıcı)",
              "Ad soyad, e-posta, şifre özeti, rol ve bağlı olduğu kurum. Dört rol: süper admin, müdür, öğretmen, veli.",
            ],
            [
              "Classroom\n(Sınıf)",
              "Sınıf adı ve sorumlu öğretmen. Öğretmenin hangi öğrencileri görebileceği bu bağ üzerinden belirlenir.",
            ],
            [
              "Student\n(Öğrenci)",
              "Ad soyad, doğum tarihi, tanı/ihtiyaç kategorisi, bağlı sınıf ve veli. Sistemin merkezindeki kayıttır.",
            ],
            [
              "SessionLog\n(Ders Kaydı)",
              "Tarih, işlenen konu, 1–10 verimlilik puanı, serbest not. Öğretmen ve öğrenciye bağlıdır.",
            ],
            [
              "BehaviorTag\n(Davranış Etiketi)",
              "Etiket adı, kategori ve renk kodu. Kurumlar arası ortak sözlük görevi görür.",
            ],
            [
              "SessionLogBehaviorTag",
              "Ders kaydı ile etiketleri bağlayan ara tablo. Bir derste birden fazla davranış işaretlenebilir.",
            ],
            [
              "AuditLog\n(Denetim Kaydı)",
              "Kim, ne zaman, hangi veriye erişti veya neyi değiştirdi. KVKK gereği tutulur.",
            ],
          ]}
        />

        <Text style={stil.h2}>Silme davranışı</Text>
        <Text style={stil.p}>
          İlişkiler bilinçli olarak farklı davranacak şekilde kurulmuştur. Bir kurum silinirse ona
          bağlı sınıf ve öğrenciler de silinir (cascade). Ancak bir öğretmen hesabı silinirse
          sınıfın öğretmen alanı boşalır, sınıf ve öğrenciler durur — personel değişikliği öğrenci
          verisini yok etmez.
        </Text>

        <AltBilgi belgeAdi={BELGE} />
      </Page>

      {/* ---------- 4. ROLLER ---------- */}
      <Page size="A4" style={stil.sayfa}>
        <BolumBasligi baslik="4. Roller ve Yetki Matrisi" />

        <Tablo
          genislikler={["34%", "16.5%", "16.5%", "16.5%", "16.5%"]}
          basliklar={["Yetki", "Süper Admin", "Müdür", "Öğretmen", "Veli"]}
          satirlar={[
            ["Tüm kurumları görme / ekleme", "Evet", "—", "—", "—"],
            ["Denetim kayıtlarını görme", "Evet", "—", "—", "—"],
            ["Kurum personeli ekleme", "Evet", "Evet", "—", "—"],
            ["Sınıf ve öğrenci ekleme", "Evet", "Evet", "—", "—"],
            ["Kurum geneli rapor / grafik", "Evet", "Evet", "—", "—"],
            ["Ders kaydı girme", "—", "—", "Evet", "—"],
            ["Kendi öğrencilerini görme", "Tümü", "Kurumu", "Sınıfı", "Çocuğu"],
            ["PDF rapor indirme", "—", "—", "—", "Evet"],
          ]}
        />

        <Text style={stil.h2}>Yetkilendirme nasıl uygulanıyor?</Text>
        <Text style={stil.p}>
          Yetki kontrolü <Text style={stil.kalin}>iki katmanda</Text> yapılır ve asıl
          koruma ikinci katmandır:
        </Text>

        <Adim no={1}>
          <Text style={stil.kalin}>Yönlendirme katmanı (proxy). </Text>
          Kullanıcı yetkisi olmayan bir adrese gitmeye çalışırsa kendi ana sayfasına yönlendirilir.
          Bu yalnızca kullanıcı deneyimi içindir, güvenliğin kendisi değildir.
        </Adim>
        <Adim no={2}>
          <Text style={stil.kalin}>Veri katmanı (asıl koruma). </Text>
          Her veritabanı sorgusu, oturumdaki kullanıcının kimliğine göre filtrelenir. Örneğin bir
          veli, adres çubuğuna başka bir öğrencinin kimliğini yazsa bile sorgu “bu öğrencinin velisi
          sen misin?” koşulunu içerdiği için sonuç dönmez.
        </Adim>

        <View style={stil.uyariKutu}>
          <Text style={stil.kutuBaslik}>Neden bu ayrım önemli?</Text>
          <Text>
            Yalnızca arayüzde menü gizlemek güvenlik değildir. Bu sistemde bir kullanıcı doğrudan
            API adresine istek atsa dahi, yetkisi olmayan veriye erişemez — çünkü kısıtlama
            sorgunun kendisine gömülüdür.
          </Text>
        </View>

        <AltBilgi belgeAdi={BELGE} />
      </Page>

      {/* ---------- 5. GÜVENLİK / KVKK ---------- */}
      <Page size="A4" style={stil.sayfa}>
        <BolumBasligi baslik="5. Güvenlik ve KVKK Uyumluluğu" />

        <Text style={stil.p}>
          Sistem, engelli çocuklara ait sağlık ve davranış verisi işler. Bu veriler KVKK kapsamında{" "}
          <Text style={stil.kalin}>özel nitelikli kişisel veri</Text> sayılır ve normal
          kişisel veriden daha yüksek koruma gerektirir.
        </Text>

        <Text style={stil.h2}>Uygulanan teknik önlemler</Text>
        <Madde>
          <Text style={stil.kalin}>Şifre güvenliği: </Text>
          Şifreler bcrypt algoritmasıyla 12 tur özetlenerek saklanır; düz metin şifre hiçbir yerde
          tutulmaz ve geri çözülemez.
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Aktarımda şifreleme: </Text>
          Tüm trafik HTTPS üzerinden akar; veritabanı bağlantısı da SSL zorunlu olarak kurulur.
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Denetim kaydı: </Text>
          Öğrenci profili görüntüleme, ders kaydı ekleme, rapor indirme gibi işlemler kim–ne
          zaman–hangi kayıt bilgisiyle loglanır. Süper admin bu kayıtları arayüzden inceleyebilir.
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Kaba kuvvet koruması: </Text>
          Aynı e-posta ile 10 dakika içinde 10’dan fazla başarısız giriş denemesi engellenir.
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Girdi doğrulama: </Text>
          Sunucuya gelen her veri şema ile doğrulanır; beklenmeyen veya aşırı uzun girdiler
          reddedilir.
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Güvenlik başlıkları: </Text>
          Sayfanın başka sitede çerçeve içine alınması (clickjacking) engellenir; kamera, mikrofon
          ve konum erişimi tarayıcı düzeyinde kapatılmıştır.
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Asgari veri ilkesi: </Text>
          Kullanıcı listelenirken şifre özeti gibi alanlar sorguya hiç dâhil edilmez.
        </Madde>

        <View style={stil.uyariKutu}>
          <Text style={stil.kutuBaslik}>Kuruma düşen yükümlülükler</Text>
          <Text>
            Teknik altyapı hazır olsa da KVKK uyumu yalnızca yazılımla tamamlanmaz. Kurumun ayrıca
            yapması gerekenler: veliden açık rıza alınması, aydınlatma metninin hukukçu tarafından
            hazırlanması, VERBİS kaydı, veri saklama ve imha politikasının yazılı hâle getirilmesi.
            Sistem, aydınlatma/rıza akışının eklenebilmesi için altyapı olarak uygundur.
          </Text>
        </View>

        <AltBilgi belgeAdi={BELGE} />
      </Page>

      {/* ---------- 6. EKRANLAR ---------- */}
      <Page size="A4" style={stil.sayfa}>
        <BolumBasligi baslik="6. Ekranlar ve Özellikler" />

        <Text style={stil.h3}>Ortak</Text>
        <Madde>Giriş ekranı — rol otomatik algılanır, kullanıcı kendi paneline yönlendirilir</Madde>
        <Madde>Masaüstünde yan menü, mobilde alt gezinti çubuğu ile duyarlı (responsive) tasarım</Madde>
        <Madde>Veri olmayan ekranlarda boş sayfa yerine yönlendirici mesajlar</Madde>

        <Text style={stil.h3}>Süper Admin</Text>
        <Madde>Sistem geneli özet: kurum, kullanıcı, öğrenci ve ders kaydı sayıları</Madde>
        <Madde>Kurum listesi, yeni kurum ekleme, kurumu aktif/pasif yapma</Madde>
        <Madde>Tüm kullanıcılar tablosu ve yeni kullanıcı oluşturma</Madde>
        <Madde>Tüm kurumlardaki öğrenciler ve her birinin tam gelişim profili</Madde>
        <Madde>Denetim kayıtları — kim ne zaman ne yaptı dökümü</Madde>

        <Text style={stil.h3}>Kurum Müdürü</Text>
        <Madde>Kurum özeti: öğretmen, öğrenci, sınıf sayısı ve ortalama verimlilik</Madde>
        <Madde>Kurum geneli verimlilik trendi ve davranış eğilimi grafikleri</Madde>
        <Madde>Öğretmen yönetimi; öğretmen detayında sınıfları, öğrencileri ve performansı</Madde>
        <Madde>Sınıf ve öğrenci ekleme, veli eşleştirme</Madde>
        <Madde>Her öğrencinin tam profiline erişim</Madde>

        <Text style={stil.h3}>Öğretmen</Text>
        <Madde>Kendi sınıfındaki öğrenciler ve son kayıt durumları</Madde>
        <Madde>Günlük özet: öğrenci sayısı, bugün girilen kayıt, toplam kayıt</Madde>
        <Madde>Hızlı kayıt ekranı — öğrenci seç, puan ver, etiketle, notu yaz</Madde>
        <Madde>Geçmiş dersler — girilen tüm kayıtların kronolojik listesi</Madde>
        <Madde>Öğrenci profilinde geçmiş kayıtlar, trend ve davranış dağılımı</Madde>

        <Text style={stil.h3}>Veli</Text>
        <Madde>Çocuğunun özet sayfası (tek çocuk varsa doğrudan profile yönlendirme)</Madde>
        <Madde>Geçmiş ders kayıtları: tarih, öğretmen, konu, puan, davranışlar ve not</Madde>
        <Madde>Verimlilik trend grafiği ve davranış etiketi dağılımı</Madde>
        <Madde>Dönemsel PDF rapor indirme</Madde>

        <Text style={stil.h2}>Yayına alma altyapısı</Text>
        <Text style={stil.p}>
          Kaynak kod GitHub’da özel (private) bir depoda tutulur. Ana dala yapılan her gönderim
          Vercel tarafından otomatik olarak derlenip yayına alınır. Veritabanı bağlantı bilgisi ve
          oturum anahtarı gibi hassas değerler kod içinde değil, platformun şifreli ortam
          değişkenlerinde saklanır.
        </Text>

        <AltBilgi belgeAdi={BELGE} />
      </Page>
    </Document>
  );
}
