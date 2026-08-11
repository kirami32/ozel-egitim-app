import Link from "next/link";
import { Download, Paperclip } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { goreliZaman } from "@/lib/zaman";
import { belgeTuruEtiketi, dosyaBoyutuOku } from "@/lib/belge";

export default async function AdminBelgelerPage() {
  await oturumGerekli(["SUPER_ADMIN"]);

  const belgeler = await prisma.studentDocument.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      student: { select: { id: true, adSoyad: true, institution: { select: { ad: true } } } },
      yukleyen: { select: { adSoyad: true } },
    },
  });

  const toplamBayt = belgeler.reduce((toplam, b) => toplam + b.boyutBayt, 0);
  const kurumSayisi = new Set(belgeler.map((b) => b.student.institution.ad)).size;

  return (
    <div className="space-y-8">
      <SayfaBasligi
        icon={Paperclip}
        renk="mor"
        baslik="Belgeler"
        aciklama="Tüm kurumlarda öğrencilere yüklenen belgelerin toplu görünümü."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard baslik="Toplam Belge" deger={belgeler.length} icon="Paperclip" renk="primary" index={0} />
        <StatCard
          baslik="Toplam Boyut"
          deger={dosyaBoyutuOku(toplamBayt)}
          icon="FileText"
          renk="secondary"
          index={1}
        />
        <StatCard baslik="Kurum Sayısı" deger={kurumSayisi} icon="Building2" renk="chart-4" index={2} />
      </div>

      <Card>
        <CardContent className="p-0">
          {belgeler.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Paperclip}
                baslik="Henüz belge yok"
                aciklama="Öğretmenler ve müdürler öğrenci belgesi yükledikçe burada listelenecek."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Belge</TableHead>
                  <TableHead>Öğrenci</TableHead>
                  <TableHead>Kurum</TableHead>
                  <TableHead>Yükleyen</TableHead>
                  <TableHead>Boyut</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {belgeler.map((belge) => (
                  <TableRow key={belge.id}>
                    <TableCell className="max-w-[220px] truncate font-medium">
                      {belge.dosyaAdi}
                      <Badge variant="secondary" className="ml-2 align-middle text-[10px]">
                        {belgeTuruEtiketi(belge.mimeTuru)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/ogrenci/${belge.student.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {belge.student.adSoyad}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {belge.student.institution.ad}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{belge.yukleyen.adSoyad}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {dosyaBoyutuOku(belge.boyutBayt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {goreliZaman(belge.createdAt)}
                    </TableCell>
                    <TableCell>
                      <a href={`/api/belge/${belge.id}`} aria-label="İndir">
                        <Button variant="ghost" size="icon-sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
