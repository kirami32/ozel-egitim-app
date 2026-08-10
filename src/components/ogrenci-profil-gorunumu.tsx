import { TrendingUp, Tags, History } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { VerimlilikTrendChart } from "@/components/verimlilik-trend-chart";
import { DavranisDagilimChart } from "@/components/davranis-dagilim-chart";

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

interface OgrenciProfilGorunumuProps {
  adSoyad: string;
  sinifAdi: string | null;
  veliAdi?: string | null;
  taniKategorisi: string | null;
  sessionLogs: DersKaydi[];
  ustBaslikSagi?: React.ReactNode;
  ogretmenAdiGoster?: boolean;
}

export function OgrenciProfilGorunumu({
  adSoyad,
  sinifAdi,
  veliAdi,
  taniKategorisi,
  sessionLogs,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary/12 text-primary text-lg font-semibold">
              {adSoyad.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
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
