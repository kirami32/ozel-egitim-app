import Link from "next/link";
import { Users, ChevronRight, PlusCircle } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { KisiAvatari } from "@/components/kisi-avatari";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { StatCard } from "@/components/stat-card";

export default async function OgretmenAnaSayfa() {
  const kullanici = await oturumGerekli(["OGRETMEN"]);

  const bugunBaslangic = new Date();
  bugunBaslangic.setHours(0, 0, 0, 0);

  const [ogrenciler, bugunkuKayitSayisi, toplamKayitSayisi, aktifHedefSayisi] =
    await Promise.all([
      prisma.student.findMany({
        where: { classroom: { teacherId: kullanici.id }, aktifMi: true },
        orderBy: { adSoyad: "asc" },
        include: {
          classroom: { select: { ad: true } },
          sessionLogs: {
            where: { teacherId: kullanici.id },
            orderBy: { tarih: "desc" },
            take: 1,
          },
        },
      }),
      prisma.sessionLog.count({
        where: { teacherId: kullanici.id, tarih: { gte: bugunBaslangic } },
      }),
      prisma.sessionLog.count({ where: { teacherId: kullanici.id } }),
      prisma.hedef.count({
        where: { durum: "AKTIF", student: { classroom: { teacherId: kullanici.id } } },
      }),
    ]);

  return (
    <div className="space-y-6">
      <SayfaBasligi
        icon={Users}
        renk="primary"
        baslik="Bugün Dersi Olan Öğrenciler"
        aciklama="Ders sonrası kayıt eklemek için bir öğrenci seçin."
        aksiyon={
          <Button asChild>
            <Link href="/ogretmen/yeni-kayit">
              <PlusCircle className="h-4 w-4" />
              Yeni Kayıt Ekle
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard baslik="Öğrencilerim" deger={ogrenciler.length} icon="Users" renk="primary" index={0} />
        <StatCard baslik="Bugün Girilen Kayıt" deger={bugunkuKayitSayisi} icon="PlusCircle" renk="accent" index={1} />
        <StatCard baslik="Toplam Ders Kaydı" deger={toplamKayitSayisi} icon="History" renk="chart-3" index={2} />
        <StatCard baslik="Aktif Hedef" deger={aktifHedefSayisi} icon="Target" renk="chart-4" index={3} />
      </div>

      {ogrenciler.length === 0 ? (
        <EmptyState
          icon={Users}
          baslik="Henüz size atanmış öğrenci yok"
          aciklama="Kurum müdürünüz sizi bir sınıfa atadığında öğrencileriniz burada listelenecek."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ogrenciler.map((ogrenci) => {
            const sonKayit = ogrenci.sessionLogs[0];
            return (
              <Link key={ogrenci.id} href={`/ogretmen/ogrenci/${ogrenci.id}`}>
                <Card className="border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="flex items-center gap-3 p-5">
                    <KisiAvatari
                      tur="ogrenci"
                      id={ogrenci.id}
                      adSoyad={ogrenci.adSoyad}
                      avatarSurum={ogrenci.avatarSurum}
                      className="size-11"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{ogrenci.adSoyad}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {ogrenci.classroom?.ad ?? "Sınıf atanmadı"}
                      </p>
                      {sonKayit ? (
                        <Badge variant="secondary" className="mt-1.5 text-[10px]">
                          Son kayıt: {sonKayit.verimlilikPuani}/10
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="mt-1.5 text-[10px]">
                          Henüz kayıt yok
                        </Badge>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
