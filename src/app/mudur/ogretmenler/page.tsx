import Link from "next/link";
import { Users } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { KisiAvatari } from "@/components/kisi-avatari";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { KullaniciEkleDialog } from "@/components/kullanici-ekle-dialog";

export default async function OgretmenlerPage() {
  const kullanici = await oturumGerekli(["MUDUR"]);
  const institutionId = kullanici.institutionId!;

  const ogretmenler = await prisma.user.findMany({
    where: { institutionId, rol: "OGRETMEN" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      adSoyad: true,
      email: true,
      avatarSurum: true,
      _count: { select: { classroomsTaught: true, sessionLogs: true } },
    },
  });

  return (
    <div className="space-y-6">
      <SayfaBasligi
        icon={Users}
        renk="accent"
        baslik="Öğretmenler"
        aciklama="Kurumunuzdaki öğretmenleri yönetin."
        aksiyon={
          <KullaniciEkleDialog
            izinliRoller={["OGRETMEN"]}
            sabitKurumId={institutionId}
            butonMetni="Öğretmen Ekle"
          />
        }
      />

      {ogretmenler.length === 0 ? (
        <EmptyState
          icon={Users}
          baslik="Henüz öğretmen eklenmemiş"
          aciklama="Sağ üstteki butonla ilk öğretmeninizi ekleyin."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ogretmenler.map((ogretmen) => (
            <Link key={ogretmen.id} href={`/mudur/ogretmen/${ogretmen.id}`}>
              <Card className="border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <KisiAvatari
                      tur="kullanici"
                      id={ogretmen.id}
                      adSoyad={ogretmen.adSoyad}
                      avatarSurum={ogretmen.avatarSurum}
                      className="size-11"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{ogretmen.adSoyad}</p>
                      <p className="truncate text-xs text-muted-foreground">{ogretmen.email}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <Badge variant="secondary">{ogretmen._count.classroomsTaught} sınıf</Badge>
                    <Badge variant="secondary">{ogretmen._count.sessionLogs} ders kaydı</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
