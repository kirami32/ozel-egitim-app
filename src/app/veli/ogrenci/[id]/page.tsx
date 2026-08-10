import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TrendingUp, Tags, History, FileDown } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { denetimKaydiOlustur } from "@/lib/audit";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { VerimlilikTrendChart } from "@/components/verimlilik-trend-chart";
import { DavranisDagilimChart } from "@/components/davranis-dagilim-chart";

export default async function VeliOgrenciDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kullanici = await oturumGerekli(["VELI"]);

  const ogrenci = await prisma.student.findFirst({
    where: { id, veliId: kullanici.id },
    include: {
      classroom: { select: { ad: true } },
      sessionLogs: {
        orderBy: { tarih: "desc" },
        include: { behaviorTags: { include: { behaviorTag: true } }, teacher: { select: { adSoyad: true } } },
      },
    },
  });

  if (!ogrenci) notFound();

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "STUDENT_VIEW",
    hedefTur: "Student",
    hedefId: ogrenci.id,
  });

  const trendVerisi = [...ogrenci.sessionLogs]
    .reverse()
    .slice(-15)
    .map((kayit) => ({
      tarih: new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(
        kayit.tarih
      ),
      puan: kayit.verimlilikPuani,
    }));

  const dagilimMap = new Map<string, { sayi: number; renk: string }>();
  for (const kayit of ogrenci.sessionLogs) {
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
    ogrenci.sessionLogs.length > 0
      ? (
          ogrenci.sessionLogs.reduce((t, k) => t + k.verimlilikPuani, 0) /
          ogrenci.sessionLogs.length
        ).toFixed(1)
      : "—";

  return (
    <div className="space-y-6">
      <Link
        href="/veli"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Çocuklarıma dön
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-primary/12 text-primary text-lg font-semibold">
              {ogrenci.adSoyad.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{ogrenci.adSoyad}</h1>
            <p className="text-sm text-muted-foreground">
              {ogrenci.classroom?.ad ?? "Sınıf atanmadı"}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/veli/rapor?studentId=${ogrenci.id}`}>
            <FileDown className="h-4 w-4" />
            PDF Rapor İndir
          </Link>
        </Button>
      </div>

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
              aciklama="Öğretmen ilk ders kaydını eklediğinde trend grafiği burada oluşacak."
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
              aciklama="Kayıtlar arttıkça dağılım burada görünecek."
            />
          ) : (
            <DavranisDagilimChart veri={dagilimVerisi} />
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-primary" />
            Geçmiş Ders Kayıtları
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ogrenci.sessionLogs.length === 0 ? (
            <EmptyState
              icon={History}
              baslik="Henüz ders kaydı yok"
              aciklama="Öğretmen ders sonrası kayıt ekledikçe burada listelenecek."
            />
          ) : (
            <div className="space-y-4">
              {ogrenci.sessionLogs.map((kayit) => (
                <div key={kayit.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(kayit.tarih)}
                    </p>
                    <Badge>{kayit.verimlilikPuani}/10</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{kayit.teacher.adSoyad}</p>
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
    </div>
  );
}
