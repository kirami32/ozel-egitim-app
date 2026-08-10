import { Document, Page, Text, View } from "@react-pdf/renderer";
import { Adim, AltBilgi, BolumBasligi, Madde, RENK, Tablo, stil } from "./pdf-bilesenleri";

const BELGE = "Özel Eğitim Takip Sistemi — Kullanım Kılavuzu";

export function KullanimKilavuzu() {
  return (
    <Document
      title="Özel Eğitim Takip Sistemi — Kullanım Kılavuzu"
      author="Özel Eğitim Takip Sistemi"
      language="tr"
    >
      {/* ---------- KAPAK ---------- */}
      <Page size="A4" style={stil.kapakSayfa}>
        <View style={stil.kapakBant}>
          <Text style={stil.kapakUstYazi}>KULLANIM KILAVUZU</Text>
          <Text style={stil.kapakBaslik}>{"Özel Eğitim Takip\nSistemi Nasıl Kullanılır?"}</Text>
          <Text style={stil.kapakAltBaslik}>
            Veliler, öğretmenler ve kurum yöneticileri için adım adım anlatım
          </Text>
        </View>

        <View style={stil.kapakGovde}>
          <Text style={stil.p}>
            Bu kılavuz, sistemi ilk kez kullanacak herkes için hazırlanmıştır. Bilgisayar
            kullanmakta zorlanıyorsanız endişelenmeyin — her adım tek tek anlatılmıştır.
          </Text>

          <View style={stil.kutu}>
            <Text style={stil.kutuBaslik}>Hangi bölümü okumalıyım?</Text>
            <Text>
              Kendi rolünüzle ilgili bölümü okumanız yeterlidir. Tüm kılavuzu baştan sona okumanıza
              gerek yoktur.
            </Text>
          </View>

          <Text style={stil.h2}>İçindekiler</Text>
          <Tablo
            genislikler={["18%", "48%", "34%"]}
            basliklar={["Bölüm", "Konu", "Kimin için?"]}
            satirlar={[
              ["Bölüm 1", "Sisteme giriş yapmak", "Herkes"],
              ["Bölüm 2", "Veli kılavuzu", "Anne / baba / vasi"],
              ["Bölüm 3", "Öğretmen kılavuzu", "Eğitmenler"],
              ["Bölüm 4", "Kurum müdürü kılavuzu", "Yöneticiler"],
              ["Bölüm 5", "Süper admin kılavuzu", "Sistem sahibi"],
              ["Bölüm 6", "Sık sorulan sorular", "Herkes"],
            ]}
          />

          <View style={stil.uyariKutu}>
            <Text style={stil.kutuBaslik}>Yardıma mı ihtiyacınız var?</Text>
            <Text>
              Giriş yapamıyor veya bir şeyi bulamıyorsanız, çocuğunuzun eğitim aldığı kurumla
              iletişime geçin. Kurum yöneticiniz hesabınızı sıfırlayabilir ve size yardımcı olabilir.
            </Text>
          </View>
        </View>
      </Page>

      {/* ---------- 1. GİRİŞ ---------- */}
      <Page size="A4" style={stil.sayfa}>
        <BolumBasligi baslik="Bölüm 1 — Sisteme Giriş Yapmak" />

        <Text style={stil.p}>
          Sistem bir internet sitesidir. Bilgisayarınızdan, tabletinizden veya telefonunuzdan
          kullanabilirsiniz. Ayrıca bir program yüklemenize <Text style={stil.kalin}>gerek yoktur</Text>.
        </Text>

        <Text style={stil.h2}>Adım adım giriş</Text>

        <Adim no={1}>
          Telefonunuzda veya bilgisayarınızda internet tarayıcısını açın (Chrome, Safari, Edge gibi).
        </Adim>
        <Adim no={2}>
          Kurumunuzun size verdiği <Text style={stil.kalin}>internet adresini</Text> en
          üstteki adres çubuğuna yazın ve Enter tuşuna basın.
        </Adim>
        <Adim no={3}>
          Karşınıza mavi-yeşil tonlarında bir giriş ekranı gelecek. “E-posta” kutusuna kurumun size
          verdiği e-posta adresini yazın.
        </Adim>
        <Adim no={4}>
          “Şifre” kutusuna şifrenizi yazın. Yazdıklarınız güvenlik için nokta şeklinde görünür,
          bu normaldir.
        </Adim>
        <Adim no={5}>
          <Text style={stil.kalin}>“Giriş Yap”</Text> düğmesine basın. Sistem sizi otomatik
          olarak kendi sayfanıza götürecektir.
        </Adim>

        <View style={stil.kutu}>
          <Text style={stil.kutuBaslik}>Rolünüzü seçmenize gerek yok</Text>
          <Text>
            Veli misiniz, öğretmen misiniz — sistem bunu kendisi bilir. Giriş yaptığınızda doğrudan
            size ait ekran açılır.
          </Text>
        </View>

        <Text style={stil.h2}>Sık karşılaşılan giriş sorunları</Text>
        <Tablo
          genislikler={["42%", "58%"]}
          basliklar={["Sorun", "Ne yapmalısınız?"]}
          satirlar={[
            [
              "“E-posta veya şifre hatalı” yazıyor",
              "Şifreyi büyük/küçük harfe dikkat ederek tekrar yazın. Klavyenizde Caps Lock açık olabilir.",
            ],
            [
              "“Çok fazla başarısız deneme” yazıyor",
              "Güvenlik için hesap kısa süre kilitlenir. 10 dakika bekleyip tekrar deneyin.",
            ],
            [
              "Şifremi unuttum",
              "Sistemde şifre sıfırlama yoktur. Kurumunuzu arayın; yönetici size yeni şifre tanımlar.",
            ],
            [
              "Sayfa hiç açılmıyor",
              "İnternet bağlantınızı kontrol edin, adresi doğru yazdığınızdan emin olun.",
            ],
          ]}
        />

        <Text style={stil.h2}>Çıkış yapmak</Text>
        <Text style={stil.p}>
          İşiniz bittiğinde, özellikle ortak kullanılan bir bilgisayardaysanız, sol alt köşedeki{" "}
          <Text style={stil.kalin}>“Çıkış Yap”</Text> yazısına tıklayın. Telefonda bu düğme
          menünün içindedir.
        </Text>

        <AltBilgi belgeAdi={BELGE} />
      </Page>

      {/* ---------- 2. VELİ ---------- */}
      <Page size="A4" style={stil.sayfa}>
        <BolumBasligi baslik="Bölüm 2 — Veli Kılavuzu" />

        <Text style={stil.p}>
          Bu bölüm anne, baba ve vasiler içindir. Sistemde{" "}
          <Text style={stil.kalin}>yalnızca kendi çocuğunuzun</Text> bilgilerini
          görebilirsiniz. Başka hiçbir öğrencinin verisine erişiminiz yoktur; aynı şekilde başka
          veliler de sizin çocuğunuzun bilgilerini göremez.
        </Text>

        <View style={stil.kutu}>
          <Text style={stil.kutuBaslik}>Yanlışlıkla bir şey bozabilir miyim?</Text>
          <Text>
            Hayır. Veli hesabı yalnızca görüntüleme yetkisine sahiptir. Hiçbir şeyi silemez veya
            değiştiremezsiniz. Rahatça gezinebilirsiniz.
          </Text>
        </View>

        <Text style={stil.h2}>Giriş yaptığınızda ne göreceksiniz?</Text>
        <Text style={stil.p}>
          Tek çocuğunuz varsa sistem sizi doğrudan çocuğunuzun sayfasına götürür. Birden fazla
          çocuğunuz kayıtlıysa önce bir liste görürsünüz; hangisinin bilgilerine bakmak istiyorsanız
          kartına tıklayın.
        </Text>

        <Text style={stil.h2}>Çocuğunuzun sayfasındaki bölümler</Text>

        <Text style={stil.h3}>1) Geçmiş Ders Kayıtları (en üstte)</Text>
        <Text style={stil.p}>
          Çocuğunuzun katıldığı her dersin kaydı, en yeniden eskiye doğru sıralanır. Her kayıtta şu
          bilgiler bulunur:
        </Text>
        <Madde>
          <Text style={stil.kalin}>Tarih </Text>— dersin yapıldığı gün
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Öğretmen adı </Text>— dersi veren eğitmen
        </Madde>
        <Madde>
          <Text style={stil.kalin}>İşlenen konu </Text>— o gün ne çalışıldığı
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Puan (sağ üstte, örn. 8/10) </Text>— o dersin verimliliği
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Renkli etiketler </Text>— derste gözlemlenen davranışlar
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Öğretmen notu </Text>— varsa ek açıklama
        </Madde>

        <View style={stil.uyariKutu}>
          <Text style={stil.kutuBaslik}>Puanı nasıl yorumlamalıyım?</Text>
          <Text>
            Bu puan bir <Text style={stil.kalin}>karne notu değildir</Text>. Çocuğunuzun o
            günkü derse ne kadar katılabildiğini, ne kadar verimli geçtiğini gösterir. Düşük bir gün
            başarısızlık anlamına gelmez — çocuk yorgun, hasta veya huzursuz olabilir. Önemli olan
            tek bir gün değil, <Text style={stil.kalin}>zaman içindeki genel eğilimdir</Text>.
          </Text>
        </View>

        <AltBilgi belgeAdi={BELGE} />
      </Page>

      <Page size="A4" style={stil.sayfa}>
        <Text style={stil.h3}>2) Verimlilik Trendi (grafik)</Text>
        <Text style={stil.p}>
          Bu çizgi grafik, çocuğunuzun son derslerdeki puanlarını yan yana gösterir. Okuması kolaydır:
        </Text>
        <Madde>
          <Text style={stil.kalin}>Yatay eksen (alt) </Text>— ders tarihleri (gün/ay)
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Dikey eksen (sol) </Text>— 0 ile 10 arası puan
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Çizginin genel yönü </Text>— yukarı doğruysa gelişim var,
          düz gidiyorsa istikrarlı, aşağı doğruysa öğretmenle konuşmakta fayda var
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Sağ üstteki “Ortalama” </Text>— tüm derslerin ortalaması
        </Madde>

        <Text style={stil.p}>
          Grafikteki bir noktanın üzerine gelirseniz (telefonda parmağınızla dokunursanız) o günün
          tam puanı görünür.
        </Text>

        <View style={stil.kutu}>
          <Text style={stil.kutuBaslik}>İnişli çıkışlı olması normal mi?</Text>
          <Text>
            Evet, tamamen normaldir. Hiçbir çocuk her gün aynı performansı göstermez. Grafikte
            zikzaklar olması beklenen bir durumdur; bakmanız gereken şey birkaç haftalık genel
            yöndür.
          </Text>
        </View>

        <Text style={stil.h3}>3) Davranış Etiketi Dağılımı (grafik)</Text>
        <Text style={stil.p}>
          Bu yatay çubuk grafik, çocuğunuzda hangi davranışın kaç kez gözlemlendiğini gösterir.
          Çubuk ne kadar uzunsa, o davranış o kadar sık görülmüş demektir.
        </Text>
        <Text style={stil.p}>
          Etiketlerin bir kısmı desteklenmesi gereken durumları (Odak Kaybı, Duyusal Aşırı Yüklenme
          gibi), bir kısmı ise olumlu gelişmeleri (Göz Teması Kurma, Yönerge Takibi, Sosyal Etkileşim
          gibi) ifade eder. Yani uzun bir çubuk her zaman olumsuz anlam taşımaz.
        </Text>

        <Text style={stil.h2}>PDF rapor indirmek</Text>
        <Text style={stil.p}>
          Çocuğunuzun gelişim özetini dosya olarak kaydedebilir, yazdırabilir veya bir uzmanla
          paylaşabilirsiniz.
        </Text>

        <Adim no={1}>Sol menüden “Rapor İndir” bölümüne girin (telefonda alt çubuktadır).</Adim>
        <Adim no={2}>Çocuğunuzun kartını bulun.</Adim>
        <Adim no={3}>
          Sağdaki <Text style={stil.kalin}>“İndir”</Text> düğmesine basın.
        </Adim>
        <Adim no={4}>
          Dosya cihazınıza inecektir. Bilgisayarda genellikle “İndirilenler” klasörüne, telefonda
          “Dosyalarım” bölümüne kaydedilir.
        </Adim>

        <Text style={stil.p}>
          Raporun içinde ortalama verimlilik, toplam ders sayısı, en sık gözlemlenen davranış ve tüm
          ders kayıtlarının dökümü yer alır.
        </Text>

        <View style={stil.uyariKutu}>
          <Text style={stil.kutuBaslik}>Rapor gizlidir</Text>
          <Text>
            İndirdiğiniz belge çocuğunuza ait özel sağlık ve davranış bilgisi içerir. Yalnızca
            gerekli kişilerle (doktor, terapist, aile) paylaşmanızı, sosyal medyada
            yayınlamamanızı öneririz.
          </Text>
        </View>

        <AltBilgi belgeAdi={BELGE} />
      </Page>

      {/* ---------- 3. ÖĞRETMEN ---------- */}
      <Page size="A4" style={stil.sayfa}>
        <BolumBasligi baslik="Bölüm 3 — Öğretmen Kılavuzu" />

        <Text style={stil.p}>
          Öğretmen hesabıyla yalnızca <Text style={stil.kalin}>size atanmış sınıflardaki
          öğrencileri</Text> görür ve onlar için ders kaydı girersiniz.
        </Text>

        <Text style={stil.h2}>Ana sayfa</Text>
        <Text style={stil.p}>
          Giriş yaptığınızda üstte üç özet kutusu görürsünüz: öğrenci sayınız, bugün girdiğiniz
          kayıt sayısı ve toplam kayıt sayınız. Altında öğrenci kartlarınız listelenir. Her kartta
          öğrencinin son aldığı puan görünür; hiç kayıt yoksa “Henüz kayıt yok” yazar.
        </Text>

        <Text style={stil.h2}>Ders kaydı eklemenin iki yolu</Text>

        <Text style={stil.h3}>Yol 1 — Öğrenci sayfasından</Text>
        <Adim no={1}>Ana sayfada öğrencinin kartına tıklayın.</Adim>
        <Adim no={2}>Sağ tarafta “Yeni Ders Kaydı Ekle” formu açılır.</Adim>
        <Adim no={3}>Formu doldurup “Kaydı Ekle” düğmesine basın.</Adim>

        <Text style={stil.h3}>Yol 2 — Hızlı kayıt (art arda kayıt girerken pratiktir)</Text>
        <Adim no={1}>Sol menüden “Yeni Kayıt Ekle” bölümüne girin.</Adim>
        <Adim no={2}>Açılan listeden öğrenciyi seçin.</Adim>
        <Adim no={3}>Form hemen altında belirir; doldurup kaydedin.</Adim>

        <Text style={stil.h2}>Formu doldururken</Text>
        <Tablo
          genislikler={["28%", "72%"]}
          basliklar={["Alan", "Ne yazmalı?"]}
          satirlar={[
            [
              "İşlenen Konu",
              "O derste ne çalıştığınız. Örn: “Sayı eşleştirme çalışması”, “Duyusal bütünleme oyunları”. Kısa ve net olması yeterlidir.",
            ],
            [
              "Verimlilik Puanı",
              "1’den 10’a kadar bir rakama tıklayın. Öğrencinin derse katılımını ve verimini yansıtır. Varsayılan 7’dir.",
            ],
            [
              "Davranış Etiketleri",
              "Gözlemlediğiniz davranışlara tıklayın; seçilenler renklenir. Birden fazla seçebilir, hiç seçmeyebilirsiniz.",
            ],
            [
              "Serbest Not",
              "Etiketlerin anlatamadığı bağlam. Örn: “Sabah yorgun geldi, ikinci yarıda toparlandı.” İsteğe bağlıdır.",
            ],
          ]}
        />

        <View style={stil.kutu}>
          <Text style={stil.kutuBaslik}>Neden etiket kullanmalıyım?</Text>
          <Text>
            Serbest metin notlar insan için değerlidir ama sayılamaz. Etiketler sayesinde “bu
            öğrencide odak kaybı son bir ayda kaç kez görüldü?” sorusu grafikle cevaplanabilir hâle
            gelir ve velinin raporunda somut olarak görünür.
          </Text>
        </View>

        <Text style={stil.h2}>Geçmiş Derslerim</Text>
        <Text style={stil.p}>
          Sol menüdeki bu bölümde, girdiğiniz tüm kayıtlar en yeniden eskiye listelenir. Öğrenci
          adına tıklayarak o öğrencinin tam profiline geçebilirsiniz.
        </Text>

        <View style={stil.uyariKutu}>
          <Text style={stil.kutuBaslik}>Dikkat: Kayıt silinemez</Text>
          <Text>
            Girilen ders kayıtları veri bütünlüğü ve denetim gereği silinemez veya düzenlenemez.
            Kaydetmeden önce puanı ve etiketleri kontrol edin. Hatalı bir kayıt için kurum
            yöneticinize bilgi verin.
          </Text>
        </View>

        <AltBilgi belgeAdi={BELGE} />
      </Page>

      {/* ---------- 4. MÜDÜR ---------- */}
      <Page size="A4" style={stil.sayfa}>
        <BolumBasligi baslik="Bölüm 4 — Kurum Müdürü Kılavuzu" />

        <Text style={stil.p}>
          Müdür hesabı, <Text style={stil.kalin}>yalnızca kendi kurumunuzun</Text> tüm
          verisini görür ve yönetir. Başka kurumların bilgilerine erişemezsiniz.
        </Text>

        <Text style={stil.h2}>Kurulum sırası (yeni kurum için önerilen)</Text>
        <Adim no={1}>
          <Text style={stil.kalin}>Öğretmenleri ekleyin. </Text>
          “Öğretmenler” bölümünden “Öğretmen Ekle” ile ad soyad, e-posta ve geçici şifre tanımlayın.
        </Adim>
        <Adim no={2}>
          <Text style={stil.kalin}>Sınıfları oluşturun. </Text>
          “Sınıflar” bölümünden sınıf adını girin ve sorumlu öğretmeni seçin. Öğretmen ancak kendi
          sınıfındaki öğrencileri görebilir, bu yüzden atama önemlidir.
        </Adim>
        <Adim no={3}>
          <Text style={stil.kalin}>Velileri ekleyin. </Text>
          Öğrenci eklemeden önce velinin hesabını oluşturun; böylece öğrenciyi doğrudan velisine
          bağlayabilirsiniz.
        </Adim>
        <Adim no={4}>
          <Text style={stil.kalin}>Öğrencileri ekleyin. </Text>
          Ad soyad, doğum tarihi, tanı kategorisi girin; sınıf ve veli eşleştirmesini yapın.
        </Adim>

        <View style={stil.kutu}>
          <Text style={stil.kutuBaslik}>Geçici şifreler</Text>
          <Text>
            Kullanıcı oluştururken belirlediğiniz şifreyi ilgili kişiye güvenli bir yolla (yüz yüze
            veya telefonla) iletin. En az 8 karakter olmalıdır.
          </Text>
        </View>

        <Text style={stil.h2}>Genel Bakış sayfası</Text>
        <Madde>Öğretmen, öğrenci ve sınıf sayıları ile kurum ortalama verimliliği</Madde>
        <Madde>
          <Text style={stil.kalin}>Kurum Geneli Verimlilik Trendi </Text>— tüm öğrencilerin
          günlük ortalaması; kurumun genel gidişatını gösterir
        </Madde>
        <Madde>
          <Text style={stil.kalin}>Kurum Geneli Davranış Eğilimleri </Text>— hangi
          davranışın kurum çapında ne sıklıkta gözlendiği
        </Madde>
        <Madde>Son ders kayıtları akışı — öğretmenlerin sisteme düzenli kayıt girip girmediğini takip edin</Madde>

        <Text style={stil.h2}>Öğretmen ve öğrenci detayları</Text>
        <Text style={stil.p}>
          “Öğretmenler” listesinde bir karta tıkladığınızda o öğretmenin sınıfları, öğrencileri,
          ortalama verimliliği ve son ders kayıtları açılır. Aynı şekilde “Öğrenciler” listesinden
          bir öğrenciye tıklayarak tam gelişim profilini (geçmiş kayıtlar, trend grafiği, davranış
          dağılımı) görebilirsiniz.
        </Text>

        <AltBilgi belgeAdi={BELGE} />
      </Page>

      {/* ---------- 5. SÜPER ADMIN ---------- */}
      <Page size="A4" style={stil.sayfa}>
        <BolumBasligi baslik="Bölüm 5 — Süper Admin Kılavuzu" />

        <Text style={stil.p}>
          Süper admin, sistemin sahibidir ve tüm kurumların verisine erişir. Bu hesap yalnızca
          platformu işleten kişide bulunmalıdır.
        </Text>

        <Text style={stil.h2}>Yeni bir kurumu sisteme almak</Text>
        <Adim no={1}>“Kurumlar” bölümünden “Yeni Kurum Ekle” ile kurumu tanımlayın.</Adim>
        <Adim no={2}>
          “Kullanıcılar” bölümünden bu kuruma bir <Text style={stil.kalin}>müdür</Text>{" "}
          hesabı oluşturun.
        </Adim>
        <Adim no={3}>
          Gerisini müdür kendi yürütür: öğretmen, sınıf, veli ve öğrenci ekleme işlemleri artık ona
          aittir.
        </Adim>

        <Text style={stil.h2}>Kurumu pasife almak</Text>
        <Text style={stil.p}>
          Kurum kartındaki “Aktif” rozetine tıklayarak durumu değiştirebilirsiniz. Bu, aboneliği
          biten kurumlar için veriyi silmeden erişimi kısıtlamanın yoludur.
        </Text>

        <Text style={stil.h2}>Denetim Kayıtları</Text>
        <Text style={stil.p}>
          Bu bölüm KVKK uyumu açısından sistemin en kritik parçasıdır. Kimin, ne zaman, hangi veriye
          eriştiğinin veya neyi değiştirdiğinin kaydını tutar. Son 300 işlem listelenir.
        </Text>

        <Tablo
          genislikler={["40%", "60%"]}
          basliklar={["Eylem", "Anlamı"]}
          satirlar={[
            ["Kurum Oluşturuldu", "Sisteme yeni bir kurum eklendi"],
            ["Kullanıcı Oluşturuldu", "Yeni bir hesap açıldı (müdür, öğretmen veya veli)"],
            ["Sınıf Oluşturuldu", "Bir kurumda yeni sınıf tanımlandı"],
            ["Öğrenci Oluşturuldu", "Sisteme yeni öğrenci kaydedildi"],
            ["Ders Kaydı Eklendi", "Bir öğretmen ders sonrası kayıt girdi"],
            ["Öğrenci Profili Görüntülendi", "Bir kullanıcı öğrenci verisine erişti"],
            ["PDF Rapor İndirildi", "Bir veli dönemsel raporu indirdi"],
            ["Kurum Pasifleştirildi", "Bir kurumun erişimi kapatıldı"],
          ]}
        />

        <Text style={stil.p}>
          Bir veri ihlali şüphesi veya “bu bilgiye kim baktı?” sorusu durumunda başvurulacak yer
          burasıdır.
        </Text>

        <AltBilgi belgeAdi={BELGE} />
      </Page>

      {/* ---------- 6. SSS ---------- */}
      <Page size="A4" style={stil.sayfa}>
        <BolumBasligi baslik="Bölüm 6 — Sık Sorulan Sorular" />

        <Text style={stil.h3}>Telefondan kullanabilir miyim?</Text>
        <Text style={stil.p}>
          Evet. Sistem telefon, tablet ve bilgisayarda çalışır. Telefonda menü, ekranın altındaki
          çubukta yer alır.
        </Text>

        <Text style={stil.h3}>Uygulama indirmem gerekiyor mu?</Text>
        <Text style={stil.p}>
          Hayır. Sadece internet tarayıcısı yeterlidir. İsterseniz adresi telefonunuzun ana ekranına
          kısayol olarak ekleyebilirsiniz.
        </Text>

        <Text style={stil.h3}>Verilerim güvende mi?</Text>
        <Text style={stil.p}>
          Tüm bağlantı şifrelidir, şifreler geri döndürülemez şekilde saklanır ve her veri erişimi
          kayıt altına alınır. Her kullanıcı yalnızca yetkili olduğu veriyi görür.
        </Text>

        <Text style={stil.h3}>Çocuğumun bilgilerini başka veliler görebilir mi?</Text>
        <Text style={stil.p}>
          Hayır. Veli hesapları yalnızca kendi çocuklarına erişebilir. Bu kısıtlama arayüzde menü
          gizleyerek değil, veritabanı sorgusunun kendisinde uygulanır.
        </Text>

        <Text style={stil.h3}>Bir gün ders kaydı girilmemiş, sorun mu var?</Text>
        <Text style={stil.p}>
          Hayır. Öğrencinin dersi olmadığı, devamsızlık yaptığı veya öğretmenin kaydı sonradan
          gireceği günler olabilir. Uzun süreli bir boşluk fark ederseniz kurumla görüşün.
        </Text>

        <Text style={stil.h3}>Puanlar düşük çıkıyor, endişelenmeli miyim?</Text>
        <Text style={stil.p}>
          Tek bir düşük puan anlamlı değildir. Birkaç hafta boyunca sürekli düşen bir eğilim
          görürseniz, bunu öğretmen veya kurum yöneticisiyle konuşmanız faydalı olur. Sistem bir
          teşhis aracı değil, takip ve iletişim aracıdır.
        </Text>

        <Text style={stil.h3}>Şifremi değiştirebilir miyim?</Text>
        <Text style={stil.p}>
          Şu an kullanıcılar kendi şifrelerini değiştiremez. Kurum yöneticiniz sizin için yeni bir
          şifre tanımlayabilir.
        </Text>

        <Text style={stil.h3}>Yanlış bir bilgi görüyorum, ne yapmalıyım?</Text>
        <Text style={stil.p}>
          Kurumunuzla iletişime geçin. Ders kayıtları veri bütünlüğü için silinemez; düzeltme
          kurum yöneticisi tarafından değerlendirilir.
        </Text>

        <View
          style={{
            marginTop: 22,
            paddingTop: 14,
            borderTopWidth: 1,
            borderTopColor: RENK.cizgi,
            borderTopStyle: "solid",
          }}
        >
          <Text style={{ ...stil.kucuk, ...stil.soluk, textAlign: "center" }}>
            Bu kılavuzda cevabını bulamadığınız sorular için çocuğunuzun eğitim aldığı kurumla
            iletişime geçebilirsiniz.
          </Text>
        </View>

        <AltBilgi belgeAdi={BELGE} />
      </Page>
    </Document>
  );
}
