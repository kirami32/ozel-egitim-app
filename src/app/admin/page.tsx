import Link from "next/link";
import { Building2, ClipboardList, LayoutDashboard } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { KisiAvatari } from "@/components/kisi-avatari";
import { VerimlilikRozeti } from "@/components/verimlilik-rozeti";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        student: {
          select: {
            id: true,
            adSoyad: true,
            avatarSurum: true,
            institution: { select: { ad: true } },
          },
        },
        teacher: { select: { adSoyad: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <SayfaBasligi
        icon={LayoutDashboard}
        renk="primary"
        baslik="Sistem Genel Bakış"
        aciklama="Platformdaki tüm kurumların ve kullanımın özeti."
      />

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
                  <div key={kurum.id} className="flex items-center gap-3 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.68_0.12_195)] to-[oklch(0.58_0.11_205)] text-white shadow-sm">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{kurum.ad}</p>
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
                        {kayit.student.institution.ad} · {kayit.teacher.adSoyad}
                      </p>
                    </div>
                    <VerimlilikRozeti puan={kayit.verimlilikPuani} />
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
