import { FileDown, GraduationCap } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";

export default async function VeliRaporPage() {
  const kullanici = await oturumGerekli(["VELI"]);

  const cocuklar = await prisma.student.findMany({
    where: { veliId: kullanici.id },
    orderBy: { adSoyad: "asc" },
    include: { classroom: { select: { ad: true } }, _count: { select: { sessionLogs: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dönemsel Rapor</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Çocuğunuzun gelişim özetini PDF olarak indirin.
        </p>
      </div>

      {cocuklar.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          baslik="Henüz bağlı bir öğrenci bulunamadı"
          aciklama="Çocuğunuzun hesabınıza bağlanması için kurumunuzla iletişime geçin."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cocuklar.map((cocuk) => (
            <Card key={cocuk.id} className="border-border/60">
              <CardContent className="flex items-center gap-3 p-5">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-primary/12 text-primary font-semibold">
                    {cocuk.adSoyad.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{cocuk.adSoyad}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {cocuk.classroom?.ad ?? "Sınıf atanmadı"} · {cocuk._count.sessionLogs} kayıt
                  </p>
                </div>
                <Button asChild size="sm" disabled={cocuk._count.sessionLogs === 0}>
                  <a href={`/api/rapor/${cocuk.id}`} download>
                    <FileDown className="h-4 w-4" />
                    İndir
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
