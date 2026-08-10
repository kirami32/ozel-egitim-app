import Link from "next/link";
import { TrendingUp, Tags, LayoutDashboard } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { KisiAvatari } from "@/components/kisi-avatari";
import { VerimlilikRozeti } from "@/components/verimlilik-rozeti";
import { VerimlilikTrendChart } from "@/components/verimlilik-trend-chart";
import { DavranisDagilimChart } from "@/components/davranis-dagilim-chart";

export default async function MudurGenelBakis() {
  const kullanici = await oturumGerekli(["MUDUR"]);
  const institutionId = kullanici.institutionId!;

  const [
    ogretmenSayisi,
    ogrenciSayisi,
    sinifSayisi,
    verimlilikOrt,
    aktifHedefSayisi,
    sonDersKayitlari,
    tumKayitlar,
  ] = await Promise.all([
      prisma.user.count({ where: { institutionId, rol: "OGRETMEN" } }),
      prisma.student.count({ where: { institutionId } }),
      prisma.classroom.count({ where: { institutionId } }),
      prisma.sessionLog.aggregate({
        where: { student: { institutionId } },
        _avg: { verimlilikPuani: true },
      }),
      prisma.hedef.count({
        where: { durum: "AKTIF", student: { institutionId } },
      }),
      prisma.sessionLog.findMany({
        where: { student: { institutionId } },
        orderBy: { tarih: "desc" },
        take: 6,
        include: {
          student: { select: { id: true, adSoyad: true, avatarSurum: true } },
          teacher: { select: { adSoyad: true } },
        },
      }),
      prisma.sessionLog.findMany({
        where: { student: { institutionId } },
        orderBy: { tarih: "asc" },
        include: { behaviorTags: { include: { behaviorTag: true } } },
      }),
    ]);

  const ortalama = verimlilikOrt._avg.verimlilikPuani;

  const gunlukMap = new Map<string, { toplam: number; sayi: number }>();
  for (const kayit of tumKayitlar) {
    const anahtar = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(
      kayit.tarih
    );
    const mevcut = gunlukMap.get(anahtar);
    gunlukMap.set(anahtar, {
      toplam: (mevcut?.toplam ?? 0) + kayit.verimlilikPuani,
      sayi: (mevcut?.sayi ?? 0) + 1,
    });
  }
  const trendVerisi = Array.from(gunlukMap.entries())
    .slice(-14)
    .map(([tarih, v]) => ({ tarih, puan: Number((v.toplam / v.sayi).toFixed(1)) }));

  const dagilimMap = new Map<string, { sayi: number; renk: string }>();
  for (const kayit of tumKayitlar) {
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

  return (
    <div className="space-y-8">
      <SayfaBasligi
        icon={LayoutDashboard}
        renk="primary"
        baslik="Kurum Genel Bakış"
        aciklama="Kurumunuzun güncel durumu ve son aktiviteler."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <StatCard baslik="Öğretmen" deger={ogretmenSayisi} icon="Users" renk="primary" index={0} />
        <StatCard baslik="Öğrenci" deger={ogrenciSayisi} icon="GraduationCap" renk="accent" index={1} />
        <StatCard baslik="Sınıf" deger={sinifSayisi} icon="School" renk="chart-3" index={2} />
        <StatCard
          baslik="Ortalama Verimlilik"
          deger={ortalama ? `${ortalama.toFixed(1)} / 10` : "—"}
          icon="TrendingUp"
          renk="chart-4"
          index={3}
        />
        <StatCard baslik="Aktif Hedef" deger={aktifHedefSayisi} icon="Target" renk="secondary" index={4} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Kurum Geneli Verimlilik Trendi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trendVerisi.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                baslik="Henüz veri yok"
                aciklama="Öğretmenler ders kaydı ekledikçe trend burada oluşacak."
              />
            ) : (
              <VerimlilikTrendChart veri={trendVerisi} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Tags className="h-4 w-4 text-primary" />
              Kurum Geneli Davranış Eğilimleri
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

      <Card>
        <CardHeader>
          <CardTitle>Son Ders Kayıtları</CardTitle>
        </CardHeader>
        <CardContent>
          {sonDersKayitlari.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              baslik="Henüz ders kaydı yok"
              aciklama="Öğretmenler ders sonrası kayıt girdikçe burada görünecek."
            />
          ) : (
            <div className="divide-y divide-border">
              {sonDersKayitlari.map((kayit) => (
                <div key={kayit.id} className="flex items-center gap-3 py-3">
                  <KisiAvatari
                    tur="ogrenci"
                    id={kayit.student.id}
                    adSoyad={kayit.student.adSoyad}
                    avatarSurum={kayit.student.avatarSurum}
                    size="lg"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{kayit.student.adSoyad}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {kayit.teacher.adSoyad} ·{" "}
                      {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(kayit.tarih)}
                    </p>
                  </div>
                  <VerimlilikRozeti puan={kayit.verimlilikPuani} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-right">
        <Link href="/mudur/ogrenciler" className="text-sm font-medium text-primary hover:underline">
          Tüm öğrencileri görüntüle →
        </Link>
      </div>
    </div>
  );
}
