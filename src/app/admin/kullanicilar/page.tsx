import { Users } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { KullaniciEkleDialog } from "@/components/kullanici-ekle-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ROL_ETIKETLERI: Record<string, string> = {
  SUPER_ADMIN: "Süper Admin",
  MUDUR: "Kurum Müdürü",
  OGRETMEN: "Öğretmen",
  VELI: "Veli",
};

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kullanıcılar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sistemdeki tüm kullanıcıları görüntüleyin.
          </p>
        </div>
        <KullaniciEkleDialog
          izinliRoller={["MUDUR", "OGRETMEN", "VELI"]}
          kurumlar={kurumlar}
        />
      </div>

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
                    <TableCell className="font-medium">{k.adSoyad}</TableCell>
                    <TableCell className="text-muted-foreground">{k.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{ROL_ETIKETLERI[k.rol]}</Badge>
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
