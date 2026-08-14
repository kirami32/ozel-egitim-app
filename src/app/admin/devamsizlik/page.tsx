import Link from "next/link";
import { CalendarX2, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DevamOranTrendChart } from "@/components/devam-oran-trend-chart";
import { DevamDurumuChart } from "@/components/devam-durumu-chart";
import { DEVAM_DURUM_META, devamOraniHesapla } from "@/lib/devam";
import type { AttendanceStatus } from "@/generated/prisma/enums";

export default async function AdminDevamsizlikPage() {
  await oturumGerekli(["SUPER_ADMIN"]);

  const bugun = new Date();
  bugun.setUTCHours(0, 0, 0, 0);
  const otuzGunOnce = new Date(bugun);
  otuzGunOnce.setUTCDate(otuzGunOnce.getUTCDate() - 29);

  const kayitlar = await prisma.attendance.findMany({
    where: { tarih: { gte: otuzGunOnce } },
    include: {
      student: { select: { adSoyad: true, institution: { select: { ad: true } } } },
    },
    orderBy: { tarih: "asc" },
  });

  const bugunKayitlari = kayitlar.filter((k) => k.tarih.getTime() === bugun.getTime());
  const bugunDevamOrani = devamOraniHesapla(bugunKayitlari);
  const bugunDevamsizSayisi = bugunKayitlari.filter((k) => k.durum === "YOK").length;
  const genelDevamOrani = devamOraniHesapla(kayitlar);

  const gunlukMap = new Map<string, { durum: AttendanceStatus }[]>();
  for (const kayit of kayitlar) {
    const anahtar = kayit.tarih.toISOString().slice(0, 10);
    const liste = gunlukMap.get(anahtar) ?? [];
    liste.push({ durum: kayit.durum });
    gunlukMap.set(anahtar, liste);
  }
  const trendVerisi = Array.from(gunlukMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([tarih, gununKayitlari]) => ({
      tarih: new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit" }).format(
        new Date(`${tarih}T00:00:00.000Z`)
      ),
      oran: devamOraniHesapla(gununKayitlari) ?? 0,
    }));

  const dagilimSayaci: Record<AttendanceStatus, number> = { VAR: 0, YOK: 0, GEC: 0, IZINLI: 0 };
  for (const kayit of kayitlar) dagilimSayaci[kayit.durum]++;
  const dagilimVerisi = (Object.keys(dagilimSayaci) as AttendanceStatus[])
    .filter((durum) => dagilimSayaci[durum] > 0)
    .map((durum) => ({
      etiket: DEVAM_DURUM_META[durum].etiket,
      sayi: dagilimSayaci[durum],
      renk: DEVAM_DURUM_META[durum].renk,
    }));

  const ogrenciMap = new Map<
    string,
    { adSoyad: string; kurumAdi: string; kayitlar: { durum: AttendanceStatus }[] }
  >();
  for (const kayit of kayitlar) {
    const mevcut = ogrenciMap.get(kayit.studentId);
    const girdi = { durum: kayit.durum };
    if (mevcut) mevcut.kayitlar.push(girdi);
    else
      ogrenciMap.set(kayit.studentId, {
        adSoyad: kayit.student.adSoyad,
        kurumAdi: kayit.student.institution.ad,
        kayitlar: [girdi],
      });
  }
  const ogrenciSirasi = Array.from(ogrenciMap.entries())
    .map(([studentId, veri]) => ({
      studentId,
      adSoyad: veri.adSoyad,
      kurumAdi: veri.kurumAdi,
      yokSayisi: veri.kayitlar.filter((k) => k.durum === "YOK").length,
      gecSayisi: veri.kayitlar.filter((k) => k.durum === "GEC").length,
      oran: devamOraniHesapla(veri.kayitlar),
    }))
    .sort((a, b) => b.yokSayisi - a.yokSayisi || a.adSoyad.localeCompare(b.adSoyad))
    .slice(0, 12);

  return (
    <div className="space-y-8">
      <SayfaBasligi
        icon={CalendarX2}
        renk="kirmizi"
        baslik="Devam / Devamsızlık"
        aciklama="Tüm kurumlar genelinde son 30 günlük devam durumu özeti."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          baslik="Bugünkü Devam Oranı"
          deger={bugunDevamOrani !== null ? `%${bugunDevamOrani}` : "—"}
          icon="CalendarCheck"
          renk="chart-4"
          index={0}
        />
        <StatCard
          baslik="Bugün Devamsız"
          deger={bugunDevamsizSayisi}
          icon="CalendarX2"
          renk="accent"
          index={1}
        />
        <StatCard
          baslik="30 Günlük Devam Oranı"
          deger={genelDevamOrani !== null ? `%${genelDevamOrani}` : "—"}
          icon="TrendingUp"
          renk="primary"
          index={2}
        />
        <StatCard
          baslik="Toplam Kayıt (30 gün)"
          deger={kayitlar.length}
          icon="ClipboardList"
          renk="chart-3"
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Devam Oranı Trendi (Son 30 Gün)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trendVerisi.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                baslik="Henüz devam kaydı yok"
                aciklama="Öğretmenler devam durumu girdikçe trend burada oluşacak."
              />
            ) : (
              <DevamOranTrendChart veri={trendVerisi} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChartIcon className="h-4 w-4 text-primary" />
              Durum Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dagilimVerisi.length === 0 ? (
              <EmptyState
                icon={PieChartIcon}
                baslik="Veri yok"
                aciklama="Devam kaydı girildikçe dağılım burada görünecek."
              />
            ) : (
              <DevamDurumuChart veri={dagilimVerisi} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>En Çok Devamsızlık Yapan Öğrenciler</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {ogrenciSirasi.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={CalendarX2}
                baslik="Henüz devam kaydı yok"
                aciklama="Öğretmenler devam durumu girdikçe burada listelenecek."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Öğrenci</TableHead>
                  <TableHead>Kurum</TableHead>
                  <TableHead>Devamsız</TableHead>
                  <TableHead>Geç Kalma</TableHead>
                  <TableHead>Devam Oranı</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {ogrenciSirasi.map((o) => (
                  <TableRow key={o.studentId}>
                    <TableCell className="font-medium">{o.adSoyad}</TableCell>
                    <TableCell className="text-muted-foreground">{o.kurumAdi}</TableCell>
                    <TableCell>
                      <Badge variant={o.yokSayisi > 0 ? "destructive" : "secondary"}>
                        {o.yokSayisi}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{o.gecSayisi}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {o.oran !== null ? `%${o.oran}` : "—"}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/ogrenci/${o.studentId}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Detay →
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
