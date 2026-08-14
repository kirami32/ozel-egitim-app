import { Users } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { KisiAvatari } from "@/components/kisi-avatari";
import { RolRozeti } from "@/components/rol-rozeti";
import { KullaniciEkleDialog } from "@/components/kullanici-ekle-dialog";
import { Sayfalama } from "@/components/sayfalama";
import { KullaniciDurumSwitch } from "./kullanici-durum-switch";
import { KullaniciFiltreleri } from "./kullanici-filtreleri";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Prisma } from "@/generated/prisma/client";
import type { Role } from "@/generated/prisma/enums";

const SAYFA_BOYUTU = 20;

export default async function KullanicilarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; rol?: string; kurum?: string; sayfa?: string }>;
}) {
  const kullanici = await oturumGerekli(["SUPER_ADMIN"]);
  const filtreler = await searchParams;
  const sayfa = Math.max(1, Number(filtreler.sayfa) || 1);

  const where: Prisma.UserWhereInput = {};
  if (filtreler.q) {
    where.OR = [
      { adSoyad: { contains: filtreler.q, mode: "insensitive" } },
      { email: { contains: filtreler.q, mode: "insensitive" } },
    ];
  }
  if (filtreler.rol) where.rol = filtreler.rol as Role;
  if (filtreler.kurum) where.institutionId = filtreler.kurum;

  const [kullanicilar, toplamKayit, kurumlar] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (sayfa - 1) * SAYFA_BOYUTU,
      take: SAYFA_BOYUTU,
      select: {
        id: true,
        adSoyad: true,
        email: true,
        rol: true,
        aktifMi: true,
        avatarSurum: true,
        institution: { select: { ad: true } },
      },
    }),
    prisma.user.count({ where }),
    prisma.institution.findMany({
      where: { aktifMi: true },
      select: { id: true, ad: true },
      orderBy: { ad: "asc" },
    }),
  ]);

  const toplamSayfa = Math.max(1, Math.ceil(toplamKayit / SAYFA_BOYUTU));

  return (
    <div className="space-y-6">
      <SayfaBasligi
        icon={Users}
        renk="accent"
        baslik="Kullanıcılar"
        aciklama={`Sistemdeki tüm kullanıcıları görüntüleyin (${toplamKayit} kullanıcı).`}
        aksiyon={
          <KullaniciEkleDialog
            izinliRoller={["MUDUR", "OGRETMEN", "VELI"]}
            kurumlar={kurumlar}
          />
        }
      />

      <KullaniciFiltreleri kurumlar={kurumlar} />

      {kullanicilar.length === 0 ? (
        <EmptyState
          icon={Users}
          baslik="Kayıt bulunamadı"
          aciklama="Filtreleri temizleyip tekrar deneyin ya da ilk kullanıcıyı sağ üstteki butonla ekleyin."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ad Soyad</TableHead>
                  <TableHead>E-posta</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Kurum</TableHead>
                  <TableHead>Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kullanicilar.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <KisiAvatari
                          tur="kullanici"
                          id={k.id}
                          adSoyad={k.adSoyad}
                          avatarSurum={k.avatarSurum}
                        />
                        <span className="font-medium">{k.adSoyad}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{k.email}</TableCell>
                    <TableCell>
                      <RolRozeti rol={k.rol} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {k.institution?.ad ?? "—"}
                    </TableCell>
                    <TableCell>
                      <KullaniciDurumSwitch
                        kullaniciId={k.id}
                        aktifMi={k.aktifMi}
                        kendisiMi={k.id === kullanici.id}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="border-t border-border">
              <Sayfalama
                mevcutSayfa={sayfa}
                toplamSayfa={toplamSayfa}
                bazYol="/admin/kullanicilar"
                parametreler={{ q: filtreler.q, rol: filtreler.rol, kurum: filtreler.kurum }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
