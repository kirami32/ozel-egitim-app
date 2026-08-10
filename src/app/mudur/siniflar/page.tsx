import { School } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { YeniSinifDialog } from "./yeni-sinif-dialog";

export default async function SiniflarPage() {
  const kullanici = await oturumGerekli(["MUDUR"]);
  const institutionId = kullanici.institutionId!;

  const [siniflar, ogretmenler] = await Promise.all([
    prisma.classroom.findMany({
      where: { institutionId },
      orderBy: { createdAt: "desc" },
      include: { teacher: { select: { adSoyad: true } }, _count: { select: { students: true } } },
    }),
    prisma.user.findMany({
      where: { institutionId, rol: "OGRETMEN" },
      select: { id: true, adSoyad: true },
      orderBy: { adSoyad: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sınıflar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kurumunuzdaki sınıfları ve sorumlu öğretmenlerini yönetin.
          </p>
        </div>
        <YeniSinifDialog ogretmenler={ogretmenler} />
      </div>

      {siniflar.length === 0 ? (
        <EmptyState
          icon={School}
          baslik="Henüz sınıf eklenmemiş"
          aciklama="Öğrenci eklemeden önce en az bir sınıf oluşturmanız gerekir."
          aksiyon={<YeniSinifDialog ogretmenler={ogretmenler} />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siniflar.map((sinif) => (
            <Card key={sinif.id} className="border-border/60">
              <CardContent className="p-5">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/15 text-[color:var(--chart-3)]">
                  <School className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{sinif.ad}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {sinif.teacher ? sinif.teacher.adSoyad : "Öğretmen atanmadı"}
                </p>
                <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  {sinif._count.students} öğrenci
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
