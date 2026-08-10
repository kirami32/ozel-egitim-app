import Link from "next/link";
import { GraduationCap, ChevronRight } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { KisiAvatari } from "@/components/kisi-avatari";

export default async function AdminOgrencilerPage() {
  await oturumGerekli(["SUPER_ADMIN"]);

  const ogrenciler = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      institution: { select: { ad: true } },
      classroom: { select: { ad: true } },
      _count: { select: { sessionLogs: true } },
    },
  });

  return (
    <div className="space-y-6">
      <SayfaBasligi
        icon={GraduationCap}
        renk="yesil"
        baslik="Tüm Öğrenciler"
        aciklama="Sistemdeki bütün kurumlara ait öğrenciler — profiline tıklayarak ders kayıtlarını, grafiklerini ve geçmişini görüntüleyebilirsiniz."
      />

      {ogrenciler.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          baslik="Henüz öğrenci yok"
          aciklama="Kurumlar öğrenci ekledikçe burada listelenecek."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ogrenciler.map((ogrenci) => (
            <Link key={ogrenci.id} href={`/admin/ogrenci/${ogrenci.id}`}>
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
                      {ogrenci.institution.ad}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="text-[10px]">
                        {ogrenci.classroom?.ad ?? "Sınıf atanmadı"}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {ogrenci._count.sessionLogs} kayıt
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
