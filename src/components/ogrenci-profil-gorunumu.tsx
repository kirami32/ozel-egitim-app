import { TrendingUp, Tags, History, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KisiAvatari } from "@/components/kisi-avatari";
import { AvatarYukleyici } from "@/components/avatar-yukleyici";
import { ogrenciAvatariKaydet } from "@/lib/actions/ogrenci-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { VerimlilikTrendChart } from "@/components/verimlilik-trend-chart";
import { DavranisDagilimChart } from "@/components/davranis-dagilim-chart";
import { DevamDurumuChart } from "@/components/devam-durumu-chart";
import { HedeflerBolumu } from "@/components/hedefler-bolumu";
import { VeliNotlariBolumu } from "@/components/veli-notlari-bolumu";
import { BelgelerBolumu } from "@/components/belgeler-bolumu";
import { MesajlasmaBolumu } from "@/components/mesajlasma-bolumu";
import { SaglikBilgileriKarti } from "@/components/saglik-bilgileri-karti";
import { DEVAM_DURUM_META, devamOraniHesapla } from "@/lib/devam";
import { cn } from "@/lib/utils";
import type {
  AttendanceStatus,
  BasariSeviyesi,
  HedefDurum,
  HedefKategori,
  Role,
} from "@/generated/prisma/enums";

interface DavranisEtiketiIliski {
  behaviorTagId: string;
  behaviorTag: { ad: string; renkKodu: string };
}

interface DersKaydi {
  id: string;
  tarih: Date;
  islenenKonu: string | null;
  verimlilikPuani: number;
  serbestNot: string | null;
  behaviorTags: DavranisEtiketiIliski[];
  teacher?: { adSoyad: string };
}

interface DevamKaydi {
  id: string;
  tarih: Date;
  durum: AttendanceStatus;
  aciklama: string | null;
}

interface HedefIlerlemeKaydi {
  id: string;
  tarih: Date;
  seviye: BasariSeviyesi;
  notu: string | null;
  ekleyen: { adSoyad: string };
}

interface HedefVerisi {
  id: string;
  baslik: string;
  aciklama: string | null;
  kategori: HedefKategori;
  durum: HedefDurum;
  hedefTarihi: Date | null;
  ilerlemeKayitlari: HedefIlerlemeKaydi[];
}

interface VeliNotuVerisi {
  id: string;
  icerik: string;
  onemli: boolean;
  createdAt: Date;
  yazar: { id: string; adSoyad: string; avatarSurum: Date | null };
}

interface BelgeVerisi {
  id: string;
  dosyaAdi: string;
  mimeTuru: string;
  boyutBayt: number;
  aciklama: string | null;
  createdAt: Date;
  yukleyen: { id: string; adSoyad: string; avatarSurum: Date | null };
}

interface MesajVerisi {
  id: string;
  icerik: string;
  createdAt: Date;
  gonderen: { id: string; adSoyad: string; rol: Role; avatarSurum: Date | null };
}

interface SaglikBilgisiVerisi {
  allerjiler: string | null;
  kullandigiIlaclar: string | null;
  saglikNotu: string | null;
  acilKontakAdi: string | null;
  acilKontakTelefon: string | null;
}

interface OgrenciProfilGorunumuProps {
  ogrenciId: string;
  adSoyad: string;
  sinifAdi: string | null;
  veliAdi?: string | null;
  taniKategorisi: string | null;
  avatarSurum?: Date | null;
  /** Fotoğraf yükleyebilir mi — öğretmen/müdür/admin. Veli yalnızca görüntüler. */
  avatarDuzenlenebilir?: boolean;
  /**
   * Hedef/BEP ve veli notu ekleyebilir mi — yalnızca öğretmen/müdür.
   * Süper admin bu platformda sadece izler, içerik üretmez.
   */
  notVeHedefDuzenlenebilir?: boolean;
  sessionLogs: DersKaydi[];
  attendanceRecords?: DevamKaydi[];
  hedefler?: HedefVerisi[];
  veliNotlari?: VeliNotuVerisi[];
  belgeler?: BelgeVerisi[];
  mesajlar?: MesajVerisi[];
  saglikBilgisi?: SaglikBilgisiVerisi;
  /**
   * Mesaj gönderebilir mi / sağlık bilgisini düzenleyebilir mi — veli, öğretmen
   * ve müdür için true. Resmi kayıtların aksine veli burada taraf olabilir;
   * süper admin yine yalnızca izler.
   */
  mesajVeSaglikDuzenlenebilir?: boolean;
  mevcutKullaniciId: string;
  mevcutKullaniciRolu: Role;
  ustBaslikSagi?: React.ReactNode;
  ogretmenAdiGoster?: boolean;
}

export function OgrenciProfilGorunumu({
  ogrenciId,
  adSoyad,
  sinifAdi,
  veliAdi,
  taniKategorisi,
  avatarSurum = null,
  avatarDuzenlenebilir = false,
  notVeHedefDuzenlenebilir = false,
  sessionLogs,
  attendanceRecords = [],
  hedefler = [],
  veliNotlari = [],
  belgeler = [],
  mesajlar = [],
  saglikBilgisi = {
    allerjiler: null,
    kullandigiIlaclar: null,
    saglikNotu: null,
    acilKontakAdi: null,
    acilKontakTelefon: null,
  },
  mesajVeSaglikDuzenlenebilir = false,
  mevcutKullaniciId,
  mevcutKullaniciRolu,
  ustBaslikSagi,
  ogretmenAdiGoster = false,
}: OgrenciProfilGorunumuProps) {
  const trendVerisi = [...sessionLogs]
    .reverse()
    .slice(-15)
    .map((kayit) => ({
      tarih: new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(
        kayit.tarih
      ),
      puan: kayit.verimlilikPuani,
    }));

  const dagilimMap = new Map<string, { sayi: number; renk: string }>();
  for (const kayit of sessionLogs) {
    for (const iliski of kayit.behaviorTags) {
      const mevcut = dagilimMap.get(iliski.behaviorTag.ad);
      dagilimMap.set(iliski.behaviorTag.ad, {
        sayi: (mevcut?.sayi ?? 0) + 1,
        renk: iliski.behaviorTag.renkKodu,
      });
    }
  }
  const dagilimVerisi = Array.from(dagilimMap.entries())
    .map(([etiket, v]) => ({ etiket, sayi: v.sayi, renk: v.renk }))
    .sort((a, b) => b.sayi - a.sayi);

  const ortalamaVerimlilik =
    sessionLogs.length > 0
      ? (sessionLogs.reduce((t, k) => t + k.verimlilikPuani, 0) / sessionLogs.length).toFixed(1)
      : "—";

  const devamDagilimSayaci: Record<AttendanceStatus, number> = { VAR: 0, YOK: 0, GEC: 0, IZINLI: 0 };
  for (const kayit of attendanceRecords) devamDagilimSayaci[kayit.durum]++;
  const devamDagilimVerisi = (Object.keys(devamDagilimSayaci) as AttendanceStatus[])
    .filter((durum) => devamDagilimSayaci[durum] > 0)
    .map((durum) => ({
      etiket: DEVAM_DURUM_META[durum].etiket,
      sayi: devamDagilimSayaci[durum],
      renk: DEVAM_DURUM_META[durum].renk,
    }));
  const devamOrani = devamOraniHesapla(attendanceRecords);
  const sonDevamKayitlari = [...attendanceRecords]
    .sort((a, b) => b.tarih.getTime() - a.tarih.getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-r from-[oklch(0.62_0.115_195)]/12 via-card to-card p-5 shadow-sm sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-[oklch(0.62_0.115_195)]/20 blur-3xl"
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <KisiAvatari
              tur="ogrenci"
              id={ogrenciId}
              adSoyad={adSoyad}
              avatarSurum={avatarSurum}
              className="size-14 text-lg shadow-sm"
            />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{adSoyad}</h1>
              <p className="text-sm text-muted-foreground">
                {sinifAdi ?? "Sınıf atanmadı"}
                {veliAdi && ` · Veli: ${veliAdi}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {taniKategorisi && <Badge variant="secondary">{taniKategorisi}</Badge>}
            {ustBaslikSagi}
          </div>
        </div>

        {avatarDuzenlenebilir && (
          <div className="relative mt-5 border-t border-border/60 pt-5">
            <AvatarYukleyici
              tur="ogrenci"
              id={ogrenciId}
              adSoyad={adSoyad}
              avatarSurum={avatarSurum}
              kaydet={ogrenciAvatariKaydet.bind(null, ogrenciId)}
            />
          </div>
        )}
      </div>

      <SaglikBilgileriKarti
        ogrenciId={ogrenciId}
        bilgi={saglikBilgisi}
        duzenlenebilir={mesajVeSaglikDuzenlenebilir}
      />

      <HedeflerBolumu
        ogrenciId={ogrenciId}
        hedefler={hedefler}
        yonetilebilir={notVeHedefDuzenlenebilir}
      />

      <VeliNotlariBolumu
        ogrenciId={ogrenciId}
        notlar={veliNotlari}
        yazilabilir={notVeHedefDuzenlenebilir}
        mevcutKullaniciId={mevcutKullaniciId}
        mevcutKullaniciRolu={mevcutKullaniciRolu}
      />

      <MesajlasmaBolumu
        ogrenciId={ogrenciId}
        mesajlar={mesajlar}
        gonderebilir={mesajVeSaglikDuzenlenebilir}
        mevcutKullaniciId={mevcutKullaniciId}
      />

      <BelgelerBolumu
        ogrenciId={ogrenciId}
        belgeler={belgeler}
        yonetilebilir={avatarDuzenlenebilir}
      />

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-primary" />
            Geçmiş Ders Kayıtları
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessionLogs.length === 0 ? (
            <EmptyState
              icon={History}
              baslik="Henüz ders kaydı yok"
              aciklama="Öğretmen ders sonrası kayıt ekledikçe burada listelenecek."
            />
          ) : (
            <div className="space-y-4">
              {sessionLogs.map((kayit) => (
                <div key={kayit.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(kayit.tarih)}
                    </p>
                    <Badge>{kayit.verimlilikPuani}/10</Badge>
                  </div>
                  {ogretmenAdiGoster && kayit.teacher && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{kayit.teacher.adSoyad}</p>
                  )}
                  {kayit.islenenKonu && (
                    <p className="mt-1 text-sm text-muted-foreground">{kayit.islenenKonu}</p>
                  )}
                  {kayit.behaviorTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {kayit.behaviorTags.map((iliski) => (
                        <span
                          key={iliski.behaviorTagId}
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white"
                          style={{ backgroundColor: iliski.behaviorTag.renkKodu }}
                        >
                          {iliski.behaviorTag.ad}
                        </span>
                      ))}
                    </div>
                  )}
                  {kayit.serbestNot && (
                    <p className="mt-2 text-sm text-foreground/80">{kayit.serbestNot}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarCheck className="h-4 w-4 text-primary" />
            Devam Durumu
          </CardTitle>
          <Badge variant="outline">
            Devam Oranı: {devamOrani !== null ? `%${devamOrani}` : "—"}
          </Badge>
        </CardHeader>
        <CardContent>
          {attendanceRecords.length === 0 ? (
            <EmptyState
              icon={CalendarCheck}
              baslik="Henüz devam kaydı yok"
              aciklama="Öğretmen devam durumu girdikçe burada özetlenecek."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <DevamDurumuChart veri={devamDagilimVerisi} />
              <div className="space-y-2">
                {sonDevamKayitlari.map((kayit) => (
                  <div
                    key={kayit.id}
                    className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(
                          kayit.tarih
                        )}
                      </p>
                      {kayit.aciklama && (
                        <p className="text-xs text-muted-foreground">{kayit.aciklama}</p>
                      )}
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        DEVAM_DURUM_META[kayit.durum].badgeSinif
                      )}
                    >
                      {DEVAM_DURUM_META[kayit.durum].etiket}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            Verimlilik Trendi
          </CardTitle>
          <Badge variant="outline">Ortalama: {ortalamaVerimlilik}/10</Badge>
        </CardHeader>
        <CardContent>
          {trendVerisi.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              baslik="Henüz veri yok"
              aciklama="İlk ders kaydı eklendiğinde trend grafiği burada oluşacak."
            />
          ) : (
            <VerimlilikTrendChart veri={trendVerisi} />
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Tags className="h-4 w-4 text-primary" />
            Davranış Etiketi Dağılımı
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dagilimVerisi.length === 0 ? (
            <EmptyState
              icon={Tags}
              baslik="Henüz davranış etiketi kaydı yok"
              aciklama="Ders kayıtlarına etiket eklendikçe dağılım burada görünecek."
            />
          ) : (
            <DavranisDagilimChart veri={dagilimVerisi} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
