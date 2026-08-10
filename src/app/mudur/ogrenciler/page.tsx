import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { KisiAvatari } from "@/components/kisi-avatari";
import { Badge } from "@/components/ui/badge";
import { YeniOgrenciDialog } from "./yeni-ogrenci-dialog";

export default async function OgrencilerPage() {
  const kullanici = await oturumGerekli(["MUDUR"]);
  const institutionId = kullanici.institutionId!;

  const [ogrenciler, siniflar, veliler] = await Promise.all([
    prisma.student.findMany({
      where: { institutionId },
      orderBy: { createdAt: "desc" },
      include: { classroom: { select: { ad: true } }, veli: { select: { adSoyad: true } } },
    }),
    prisma.classroom.findMany({
      where: { institutionId },
      select: { id: true, ad: true },
      orderBy: { ad: "asc" },
    }),
    prisma.user.findMany({
      where: { institutionId, rol: "VELI" },
      select: { id: true, adSoyad: true },
      orderBy: { adSoyad: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <SayfaBasligi
        icon={GraduationCap}
        renk="yesil"
        baslik="Öğrenciler"
        aciklama="Kurumunuzdaki öğrencileri, sınıflarını ve velilerini yönetin."
        aksiyon={
          <YeniOgrenciDialog
            siniflar={siniflar.map((s) => ({ id: s.id, ad: s.ad }))}
            veliler={veliler.map((v) => ({ id: v.id, ad: v.adSoyad }))}
          />
        }
      />

      {ogrenciler.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          baslik="Henüz öğrenci eklenmemiş"
          aciklama="Sağ üstteki butonla ilk öğrencinizi ekleyin."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ogrenciler.map((ogrenci) => (
            <Link key={ogrenci.id} href={`/mudur/ogrenci/${ogrenci.id}`}>
              <Card className="border-border/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex items-start gap-3 p-5">
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
                      {ogrenci.classroom?.ad ?? "Sınıf atanmadı"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {ogrenci.taniKategorisi && (
                        <Badge variant="secondary" className="text-[10px]">
                          {ogrenci.taniKategorisi}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[10px]">
                        {ogrenci.veli ? `Veli: ${ogrenci.veli.adSoyad}` : "Veli atanmadı"}
                      </Badge>
                    </div>
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
