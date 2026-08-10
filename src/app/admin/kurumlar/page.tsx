import { Building2 } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { YeniKurumDialog } from "./yeni-kurum-dialog";
import { KurumDurumSwitch } from "./kurum-durum-switch";

export default async function KurumlarPage() {
  await oturumGerekli(["SUPER_ADMIN"]);

  const kurumlar = await prisma.institution.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { users: true, students: true, classrooms: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kurumlar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sisteme kayıtlı tüm kurumları buradan yönetin.
          </p>
        </div>
        <YeniKurumDialog />
      </div>

      {kurumlar.length === 0 ? (
        <EmptyState
          icon={Building2}
          baslik="Henüz kurum eklenmemiş"
          aciklama="Başlamak için sağ üstteki butondan ilk kurumunuzu ekleyin."
          aksiyon={<YeniKurumDialog />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kurumlar.map((kurum) => (
            <Card key={kurum.id} className="border-border/60">
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <KurumDurumSwitch kurumId={kurum.id} aktifMi={kurum.aktifMi} />
                </div>
                <h3 className="font-semibold">{kurum.ad}</h3>
                {kurum.adres && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{kurum.adres}</p>
                )}
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                  <div>
                    <p className="text-sm font-semibold">{kurum._count.users}</p>
                    <p className="text-[11px] text-muted-foreground">Kullanıcı</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{kurum._count.classrooms}</p>
                    <p className="text-[11px] text-muted-foreground">Sınıf</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{kurum._count.students}</p>
                    <p className="text-[11px] text-muted-foreground">Öğrenci</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
