import { Users, GraduationCap, School, TrendingUp } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function MudurGenelBakis() {
  const kullanici = await oturumGerekli(["MUDUR"]);
  const institutionId = kullanici.institutionId!;

  const [ogretmenSayisi, ogrenciSayisi, sinifSayisi, verimlilikOrt, sonDersKayitlari] =
    await Promise.all([
      prisma.user.count({ where: { institutionId, rol: "OGRETMEN" } }),
      prisma.student.count({ where: { institutionId } }),
      prisma.classroom.count({ where: { institutionId } }),
      prisma.sessionLog.aggregate({
        where: { student: { institutionId } },
        _avg: { verimlilikPuani: true },
      }),
      prisma.sessionLog.findMany({
        where: { student: { institutionId } },
        orderBy: { tarih: "desc" },
        take: 6,
        include: { student: { select: { adSoyad: true } }, teacher: { select: { adSoyad: true } } },
      }),
    ]);

  const ortalama = verimlilikOrt._avg.verimlilikPuani;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kurum Genel Bakış</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kurumunuzun güncel durumu ve son aktiviteler.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/12 text-primary text-xs font-semibold">
                      {kayit.student.adSoyad.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{kayit.student.adSoyad}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {kayit.teacher.adSoyad} ·{" "}
                      {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(kayit.tarih)}
                    </p>
                  </div>
                  <div className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {kayit.verimlilikPuani}/10
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
