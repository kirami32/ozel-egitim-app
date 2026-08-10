import Link from "next/link";
import { History } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";

export default async function OgretmenGecmisPage() {
  const kullanici = await oturumGerekli(["OGRETMEN"]);

  const kayitlar = await prisma.sessionLog.findMany({
    where: { teacherId: kullanici.id },
    orderBy: { tarih: "desc" },
    take: 100,
    include: {
      student: { select: { id: true, adSoyad: true } },
      behaviorTags: { include: { behaviorTag: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Geçmiş Derslerim</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Şimdiye kadar girdiğiniz tüm ders kayıtları, en yeniden eskiye.
        </p>
      </div>

      {kayitlar.length === 0 ? (
        <EmptyState
          icon={History}
          baslik="Henüz ders kaydı girmediniz"
          aciklama="Öğrencilerim sayfasından bir öğrenci seçip ilk kaydınızı ekleyin."
        />
      ) : (
        <div className="space-y-4">
          {kayitlar.map((kayit) => (
            <Card key={kayit.id} className="border-border/60">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-primary/12 text-primary text-xs font-semibold">
                      {kayit.student.adSoyad.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/ogretmen/ogrenci/${kayit.student.id}`}
                        className="truncate text-sm font-semibold hover:underline"
                      >
                        {kayit.student.adSoyad}
                      </Link>
                      <Badge>{kayit.verimlilikPuani}/10</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(kayit.tarih)}
                    </p>
                    {kayit.islenenKonu && (
                      <p className="mt-1.5 text-sm text-muted-foreground">{kayit.islenenKonu}</p>
                    )}
                    {kayit.behaviorTags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {kayit.behaviorTags.map((iliski) => (
                          <span
                            key={iliski.behaviorTagId}
                            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white"
                            style={{ backgroundColor: iliski.behaviorTag.renkKodu }}
                          >
                            {iliski.behaviorTag.ad}
                          </span>
                        ))}
                      </div>
                    )}
                    {kayit.serbestNot && (
                      <p className="mt-2 text-sm text-foreground/80">{kayit.serbestNot}</p>
                    )}
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
