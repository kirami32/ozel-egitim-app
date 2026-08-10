import { Building2, Users, GraduationCap, ClipboardList } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminGenelBakis() {
  await oturumGerekli(["SUPER_ADMIN"]);

  const [kurumSayisi, kullaniciSayisi, ogrenciSayisi, dersKaydiSayisi, sonKurumlar] =
    await Promise.all([
      prisma.institution.count(),
      prisma.user.count(),
      prisma.student.count(),
      prisma.sessionLog.count(),
      prisma.institution.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { _count: { select: { users: true, students: true } } },
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
    </div>
  );
}
