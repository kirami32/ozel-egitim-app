import { Users } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { KisiAvatari } from "@/components/kisi-avatari";
import { RolRozeti } from "@/components/rol-rozeti";
import { KullaniciEkleDialog } from "@/components/kullanici-ekle-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function KullanicilarPage() {
  await oturumGerekli(["SUPER_ADMIN"]);

  const [kullanicilar, kurumlar] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
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
    prisma.institution.findMany({
      where: { aktifMi: true },
      select: { id: true, ad: true },
      orderBy: { ad: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <SayfaBasligi
        icon={Users}
        renk="accent"
        baslik="Kullanıcılar"
        aciklama="Sistemdeki tüm kullanıcıları görüntüleyin."
        aksiyon={
          <KullaniciEkleDialog
            izinliRoller={["MUDUR", "OGRETMEN", "VELI"]}
            kurumlar={kurumlar}
          />
        }
      />

      {kullanicilar.length === 0 ? (
        <EmptyState
          icon={Users}
          baslik="Henüz kullanıcı yok"
          aciklama="İlk kullanıcıyı eklemek için sağ üstteki butonu kullanın."
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
                      <Badge variant={k.aktifMi ? "default" : "secondary"}>
                        {k.aktifMi ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
