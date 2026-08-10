import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap, ChevronRight } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";

export default async function VeliOzetPage() {
  const kullanici = await oturumGerekli(["VELI"]);

  const cocuklar = await prisma.student.findMany({
    where: { veliId: kullanici.id },
    orderBy: { adSoyad: "asc" },
    include: {
      classroom: { select: { ad: true } },
      sessionLogs: { orderBy: { tarih: "desc" }, take: 1 },
    },
  });

  if (cocuklar.length === 1) {
    redirect(`/veli/ogrenci/${cocuklar[0].id}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Çocuklarım</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Detaylı gelişim raporu için bir çocuk seçin.
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
          {cocuklar.map((cocuk) => {
            const sonKayit = cocuk.sessionLogs[0];
            return (
              <Link key={cocuk.id} href={`/veli/ogrenci/${cocuk.id}`}>
                <Card className="border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="flex items-center gap-3 p-5">
                    <Avatar className="h-11 w-11">
                      <AvatarFallback className="bg-primary/12 text-primary font-semibold">
                        {cocuk.adSoyad.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{cocuk.adSoyad}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {cocuk.classroom?.ad ?? "Sınıf atanmadı"}
                      </p>
                      {sonKayit && (
                        <Badge variant="secondary" className="mt-1.5 text-[10px]">
                          Son kayıt: {sonKayit.verimlilikPuani}/10
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
