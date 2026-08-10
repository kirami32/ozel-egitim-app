import { AlertTriangle, Download, ShieldCheck } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { StatCard } from "@/components/stat-card";
import { KisiAvatari } from "@/components/kisi-avatari";
import { RolRozeti } from "@/components/rol-rozeti";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { eylemEtiketi, eylemRengi, GUVENLIK_EYLEMLERI } from "@/lib/denetim";
import { denetimWhereUret, type DenetimFiltreParametreleri } from "@/lib/denetim-sorgu";
import { DenetimFiltreleri } from "./denetim-filtreleri";

const AZAMI_KAYIT = 300;

export default async function DenetimKayitlariPage({
  searchParams,
}: {
  searchParams: Promise<DenetimFiltreParametreleri>;
}) {
  await oturumGerekli(["SUPER_ADMIN"]);
  const filtreler = await searchParams;
  const where = denetimWhereUret(filtreler);

  const bugunBaslangic = new Date();
  bugunBaslangic.setUTCHours(0, 0, 0, 0);
  const yirmiDortSaatOnce = new Date();
  yirmiDortSaatOnce.setHours(yirmiDortSaatOnce.getHours() - 24);

  const [kayitlar, toplamKayitSayisi, bugunGirisSayisi, guvenlikOlaySayisi] =
    await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: AZAMI_KAYIT,
        include: {
          user: { select: { id: true, adSoyad: true, email: true, rol: true, avatarSurum: true } },
        },
      }),
      prisma.auditLog.count({ where }),
      prisma.auditLog.count({
        where: { eylem: "LOGIN_SUCCESS", createdAt: { gte: bugunBaslangic } },
      }),
      prisma.auditLog.count({
        where: {
          eylem: { in: Array.from(GUVENLIK_EYLEMLERI) },
          createdAt: { gte: yirmiDortSaatOnce },
        },
      }),
    ]);

  return (
    <div className="space-y-6">
      <SayfaBasligi
        icon={ShieldCheck}
        renk="mor"
        baslik="Denetim Kayıtları"
        aciklama="Kim, ne zaman, hangi veriye eriştiğinin veya değiştirdiğinin dökümü (KVKK uyumluluğu için tutulur)."
        aksiyon={
          <Button asChild variant="outline">
            <a
              href={`/api/export/denetim-kayitlari?${new URLSearchParams(
                Object.entries(filtreler).filter(([, v]) => v) as [string, string][]
              ).toString()}`}
            >
              <Download className="h-4 w-4" />
              CSV İndir
            </a>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard baslik="Toplam Kayıt" deger={toplamKayitSayisi} icon="ShieldCheck" renk="primary" index={0} />
        <StatCard baslik="Bugün Giriş Yapan" deger={bugunGirisSayisi} icon="Users" renk="accent" index={1} />
        <StatCard
          baslik="Güvenlik Olayı (24s)"
          deger={guvenlikOlaySayisi}
          icon="ShieldCheck"
          renk={guvenlikOlaySayisi > 0 ? "chart-4" : "secondary"}
          index={2}
        />
      </div>

      <DenetimFiltreleri />

      {kayitlar.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          baslik="Bu filtrelerle kayıt bulunamadı"
          aciklama="Filtreleri temizleyip tekrar deneyin, ya da kullanıcılar sistemde işlem yaptıkça burada listelenecek."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Eylem</TableHead>
                    <TableHead>Hedef</TableHead>
                    <TableHead>IP Adresi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kayitlar.map((kayit) => {
                    const guvenlikOlayiMi = GUVENLIK_EYLEMLERI.has(kayit.eylem);
                    const denenenEposta =
                      kayit.detay && typeof kayit.detay === "object" && "email" in kayit.detay
                        ? String((kayit.detay as Record<string, unknown>).email)
                        : null;
                    return (
                      <TableRow
                        key={kayit.id}
                        className={cn(guvenlikOlayiMi && "bg-destructive/[0.04]")}
                      >
                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {new Intl.DateTimeFormat("tr-TR", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(kayit.createdAt)}
                        </TableCell>
                        <TableCell>
                          {kayit.user ? (
                            <div className="flex items-center gap-2.5">
                              <KisiAvatari
                                tur="kullanici"
                                id={kayit.user.id}
                                adSoyad={kayit.user.adSoyad}
                                avatarSurum={kayit.user.avatarSurum}
                                size="sm"
                              />
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{kayit.user.adSoyad}</p>
                                <p className="truncate text-xs text-muted-foreground">
                                  {kayit.user.email}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                                <AlertTriangle className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-muted-foreground">Bilinmiyor</p>
                                {denenenEposta && (
                                  <p className="truncate text-xs text-muted-foreground/70">
                                    denenen: {denenenEposta}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant={eylemRengi(kayit.eylem)}>
                              {eylemEtiketi(kayit.eylem)}
                            </Badge>
                            {kayit.user && <RolRozeti rol={kayit.user.rol} className="text-[10px]" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {kayit.hedefTur}
                          {kayit.hedefId && (
                            <span className="ml-1 font-mono">#{kayit.hedefId.slice(-6)}</span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {kayit.ipAdresi ?? "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {toplamKayitSayisi > AZAMI_KAYIT && (
              <p className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
                {toplamKayitSayisi} kayıttan en son {AZAMI_KAYIT} tanesi gösteriliyor. Daha eskilere
                ulaşmak için tarih filtresini daraltın.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
