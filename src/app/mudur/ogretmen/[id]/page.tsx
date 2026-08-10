import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, School, ClipboardList, ChevronRight } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";

export default async function MudurOgretmenDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kullanici = await oturumGerekli(["MUDUR"]);

  const ogretmen = await prisma.user.findFirst({
    where: { id, institutionId: kullanici.institutionId!, rol: "OGRETMEN" },
    include: {
      classroomsTaught: {
        include: {
          students: {
            include: { sessionLogs: { orderBy: { tarih: "desc" }, take: 1 } },
          },
        },
      },
    },
  });

  if (!ogretmen) notFound();

  const [verimlilikOrt, sonKayitlar] = await Promise.all([
    prisma.sessionLog.aggregate({
      where: { teacherId: ogretmen.id },
      _avg: { verimlilikPuani: true },
    }),
    prisma.sessionLog.findMany({
      where: { teacherId: ogretmen.id },
      orderBy: { tarih: "desc" },
      take: 6,
      include: { student: { select: { id: true, adSoyad: true } } },
    }),
  ]);

  const ogrenciSayisi = ogretmen.classroomsTaught.reduce((t, s) => t + s.students.length, 0);
  const ortalama = verimlilikOrt._avg.verimlilikPuani;

  return (
    <div className="space-y-6">
      <Link
        href="/mudur/ogretmenler"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Tüm öğretmenlere dön
      </Link>

      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="bg-primary/12 text-primary text-lg font-semibold">
            {ogretmen.adSoyad.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{ogretmen.adSoyad}</h1>
          <p className="text-sm text-muted-foreground">{ogretmen.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard baslik="Sınıf" deger={ogretmen.classroomsTaught.length} icon="School" renk="primary" index={0} />
        <StatCard baslik="Öğrenci" deger={ogrenciSayisi} icon="GraduationCap" renk="accent" index={1} />
        <StatCard
          baslik="Ortalama Verimlilik"
          deger={ortalama ? `${ortalama.toFixed(1)}/10` : "—"}
          icon="TrendingUp"
          renk="chart-3"
          index={2}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <School className="h-4 w-4 text-primary" />
            Sınıfları ve Öğrencileri
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ogretmen.classroomsTaught.length === 0 ? (
            <EmptyState
              icon={School}
              baslik="Henüz sınıf atanmamış"
              aciklama="Sınıflar sayfasından bu öğretmene bir sınıf atayabilirsiniz."
            />
          ) : (
            <div className="space-y-5">
              {ogretmen.classroomsTaught.map((sinif) => (
                <div key={sinif.id}>
                  <p className="mb-2 text-sm font-semibold">{sinif.ad}</p>
                  {sinif.students.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Bu sınıfta öğrenci yok.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {sinif.students.map((ogrenci) => (
                        <Link
                          key={ogrenci.id}
                          href={`/mudur/ogrenci/${ogrenci.id}`}
                          className="flex items-center gap-2.5 rounded-xl border border-border p-2.5 hover:bg-muted/40"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-accent/40 text-accent-foreground text-xs font-semibold">
                              {ogrenci.adSoyad.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1 truncate text-sm">{ogrenci.adSoyad}</span>
                          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="h-4 w-4 text-primary" />
            Son Ders Kayıtları
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sonKayitlar.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              baslik="Henüz ders kaydı yok"
              aciklama="Öğretmen ders sonrası kayıt ekledikçe burada görünecek."
            />
          ) : (
            <div className="divide-y divide-border">
              {sonKayitlar.map((kayit) => (
                <Link
                  key={kayit.id}
                  href={`/mudur/ogrenci/${kayit.student.id}`}
                  className="flex items-center justify-between py-3 hover:bg-muted/40 -mx-1 rounded-lg px-1"
                >
                  <div>
                    <p className="text-sm font-medium">{kayit.student.adSoyad}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(kayit.tarih)}
                    </p>
                  </div>
                  <Badge>{kayit.verimlilikPuani}/10</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
