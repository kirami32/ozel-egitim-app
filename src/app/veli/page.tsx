import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap, ChevronRight } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { KisiAvatari } from "@/components/kisi-avatari";
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
      <SayfaBasligi
        icon={GraduationCap}
        renk="primary"
        baslik="Çocuklarım"
        aciklama="Detaylı gelişim raporu için bir çocuk seçin."
      />

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
                    <KisiAvatari
                      tur="ogrenci"
                      id={cocuk.id}
                      adSoyad={cocuk.adSoyad}
                      avatarSurum={cocuk.avatarSurum}
                      className="size-11"
                    />
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
