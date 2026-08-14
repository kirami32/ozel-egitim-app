import Link from "next/link";
import { Target } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { HEDEF_DURUM_META, HEDEF_KATEGORI_META } from "@/lib/hedef";

export default async function AdminHedeflerPage() {
  await oturumGerekli(["SUPER_ADMIN"]);

  const hedefler = await prisma.hedef.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      student: { select: { id: true, adSoyad: true, institution: { select: { ad: true } } } },
    },
  });

  const aktifSayisi = hedefler.filter((h) => h.durum === "AKTIF").length;
  const tamamlananSayisi = hedefler.filter((h) => h.durum === "TAMAMLANDI").length;
  const ogrenciSayisi = new Set(hedefler.map((h) => h.student.id)).size;

  return (
    <div className="space-y-8">
      <SayfaBasligi
        icon={Target}
        renk="mor"
        baslik="BEP Hedefleri"
        aciklama="Tüm kurumlardaki bireyselleştirilmiş eğitim hedeflerinin toplu görünümü."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard baslik="Toplam Hedef" deger={hedefler.length} icon="Target" renk="primary" index={0} />
        <StatCard baslik="Aktif Hedef" deger={aktifSayisi} icon="TrendingUp" renk="chart-4" index={1} />
        <StatCard
          baslik="Tamamlanan Hedef"
          deger={tamamlananSayisi}
          icon="ShieldCheck"
          renk="secondary"
          index={2}
        />
        <StatCard baslik="Öğrenci Sayısı" deger={ogrenciSayisi} icon="GraduationCap" renk="chart-3" index={3} />
      </div>

      <Card>
        <CardContent className="p-0">
          {hedefler.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={Target}
                baslik="Henüz hedef yok"
                aciklama="Öğretmenler ve müdürler öğrenciler için BEP hedefi tanımladıkça burada listelenecek."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hedef</TableHead>
                  <TableHead>Öğrenci</TableHead>
                  <TableHead>Kurum</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {hedefler.map((hedef) => {
                  const kategori = HEDEF_KATEGORI_META[hedef.kategori];
                  const durum = HEDEF_DURUM_META[hedef.durum];
                  return (
                    <TableRow key={hedef.id}>
                      <TableCell className="max-w-[240px] truncate font-medium">
                        {hedef.baslik}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/ogrenci/${hedef.student.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {hedef.student.adSoyad}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {hedef.student.institution.ad}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            kategori.badgeSinif
                          )}
                        >
                          {kategori.etiket}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("border-transparent", durum.badgeSinif)}>
                          {durum.etiket}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/ogrenci/${hedef.student.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Detay →
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
