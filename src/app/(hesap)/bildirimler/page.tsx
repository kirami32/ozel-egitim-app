import Link from "next/link";
import { Bell } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import { goreliZaman } from "@/lib/zaman";
import { IKON_HARITASI } from "@/lib/icons";
import { BILDIRIM_META } from "@/lib/bildirim-meta";

export const metadata = { title: "Bildirimler · Özel Eğitim Takip Sistemi" };

export default async function BildirimlerSayfasi() {
  const kullanici = await oturumGerekli();

  const bildirimler = await prisma.notification.findMany({
    where: { aliciId: kullanici.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  // Sayfayı ziyaret etmek tüm bildirimleri okunmuş sayar.
  if (bildirimler.some((b) => !b.okunduMu)) {
    await prisma.notification.updateMany({
      where: { aliciId: kullanici.id, okunduMu: false },
      data: { okunduMu: true },
    });
  }

  return (
    <div className="space-y-6">
      <SayfaBasligi
        icon={Bell}
        renk="accent"
        baslik="Bildirimler"
        aciklama="Sizinle ilgili son gelişmeler."
      />

      {bildirimler.length === 0 ? (
        <EmptyState
          icon={Bell}
          baslik="Henüz bildirim yok"
          aciklama="Yeni bir gelişme olduğunda burada görünecek."
        />
      ) : (
        <div className="space-y-2">
          {bildirimler.map((bildirim) => {
            const meta = BILDIRIM_META[bildirim.tur];
            const Icon = IKON_HARITASI[meta.ikonAdi];
            const govde = (
              <Card
                className={cn(
                  "border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md",
                  !bildirim.okunduMu && "ring-1 ring-primary/30"
                )}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      meta.renk
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{bildirim.baslik}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{bildirim.mesaj}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground/70">
                      {goreliZaman(bildirim.createdAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );

            return bildirim.link ? (
              <Link key={bildirim.id} href={bildirim.link} className="block">
                {govde}
              </Link>
            ) : (
              <div key={bildirim.id}>{govde}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
