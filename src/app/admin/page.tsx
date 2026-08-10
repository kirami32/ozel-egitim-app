import Link from "next/link";
import { Building2, ClipboardList } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function AdminGenelBakis() {
  await oturumGerekli(["SUPER_ADMIN"]);

  const [
    kurumSayisi,
    kullaniciSayisi,
    ogrenciSayisi,
    dersKaydiSayisi,
    sonKurumlar,
    sonDersKayitlari,
  ] = await Promise.all([
    prisma.institution.count(),
    prisma.user.count(),
    prisma.student.count(),
    prisma.sessionLog.count(),
    prisma.institution.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { _count: { select: { users: true, students: true } } },
    }),
    prisma.sessionLog.findMany({
      orderBy: { tarih: "desc" },
      take: 8,
      include: {
        student: { select: { id: true, adSoyad: true, institution: { select: { ad: true } } } },
        teacher: { select: { adSoyad: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sistem Genel Bakış</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platformdaki tüm kurumların ve kullanımın özeti.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard baslik="Toplam Kurum" deger={kurumSayisi} icon="Building2" renk="primary" index={0} />
        <StatCard baslik="Toplam Kullanıcı" deger={kullaniciSayisi} icon="Users" renk="accent" index={1} />
        <StatCard baslik="Toplam Öğrenci" deger={ogrenciSayisi} icon="GraduationCap" renk="chart-3" index={2} />
        <StatCard baslik="Toplam Ders Kaydı" deger={dersKaydiSayisi} icon="ClipboardList" renk="chart-4" index={3} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Son Eklenen Kurumlar</CardTitle>
          </CardHeader>
          <CardContent>
            {sonKurumlar.length === 0 ? (
              <EmptyState
                icon={Building2}
                baslik="Henüz kurum eklenmemiş"
                aciklama="Sisteme ilk kurumu ekleyerek başlayın. Kurumlar sayfasından yeni bir kurum oluşturabilirsiniz."
              />
            ) : (
              <div className="divide-y divide-border">
                {sonKurumlar.map((kurum) => (
                  <div key={kurum.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">{kurum.ad}</p>
                      <p className="text-xs text-muted-foreground">
                        {kurum._count.users} kullanıcı · {kurum._count.students} öğrenci
                      </p>
                    </div>
                    <Badge variant={kurum.aktifMi ? "default" : "secondary"}>
                      {kurum.aktifMi ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistem Genelinde Son Ders Kayıtları</CardTitle>
          </CardHeader>
          <CardContent>
            {sonDersKayitlari.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                baslik="Henüz ders kaydı yok"
                aciklama="Öğretmenler kayıt ekledikçe burada görünecek."
              />
            ) : (
              <div className="divide-y divide-border">
                {sonDersKayitlari.map((kayit) => (
                  <Link
                    key={kayit.id}
                    href={`/admin/ogrenci/${kayit.student.id}`}
                    className="flex items-center gap-3 py-3 hover:bg-muted/40 -mx-1 rounded-lg px-1"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/12 text-primary text-xs font-semibold">
                        {kayit.student.adSoyad.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{kayit.student.adSoyad}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {kayit.student.institution.ad} · {kayit.teacher.adSoyad}
                      </p>
                    </div>
                    <div className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {kayit.verimlilikPuani}/10
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
