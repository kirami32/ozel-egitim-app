import { ShieldCheck } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EYLEM_ETIKETLERI: Record<string, string> = {
  INSTITUTION_CREATE: "Kurum Oluşturuldu",
  INSTITUTION_ACTIVATE: "Kurum Aktifleştirildi",
  INSTITUTION_DEACTIVATE: "Kurum Pasifleştirildi",
  USER_CREATE: "Kullanıcı Oluşturuldu",
  CLASSROOM_CREATE: "Sınıf Oluşturuldu",
  STUDENT_CREATE: "Öğrenci Oluşturuldu",
  STUDENT_VIEW: "Öğrenci Profili Görüntülendi",
  SESSION_LOG_CREATE: "Ders Kaydı Eklendi",
  ATTENDANCE_RECORD: "Devam Durumu Girildi",
  REPORT_DOWNLOAD: "PDF Rapor İndirildi",
};

const EYLEM_RENKLERI: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  INSTITUTION_CREATE: "default",
  INSTITUTION_ACTIVATE: "default",
  INSTITUTION_DEACTIVATE: "destructive",
  USER_CREATE: "default",
  CLASSROOM_CREATE: "secondary",
  STUDENT_CREATE: "secondary",
  STUDENT_VIEW: "outline",
  SESSION_LOG_CREATE: "default",
  ATTENDANCE_RECORD: "secondary",
  REPORT_DOWNLOAD: "outline",
};

export default async function DenetimKayitlariPage() {
  await oturumGerekli(["SUPER_ADMIN"]);

  const kayitlar = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
    include: { user: { select: { adSoyad: true, email: true, rol: true } } },
  });

  return (
    <div className="space-y-6">
      <SayfaBasligi
        icon={ShieldCheck}
        renk="mor"
        baslik="Denetim Kayıtları"
        aciklama="Kim, ne zaman, hangi veriye eriştiğinin veya değiştirdiğinin dökümü (KVKK uyumluluğu için tutulur). Son 300 kayıt gösteriliyor."
      />

      {kayitlar.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          baslik="Henüz denetim kaydı yok"
          aciklama="Kullanıcılar sistemde işlem yaptıkça burada listelenecek."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>Eylem</TableHead>
                  <TableHead>Hedef</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kayitlar.map((kayit) => (
                  <TableRow key={kayit.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("tr-TR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(kayit.createdAt)}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{kayit.user.adSoyad}</p>
                      <p className="text-xs text-muted-foreground">{kayit.user.email}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={EYLEM_RENKLERI[kayit.eylem] ?? "secondary"}>
                        {EYLEM_ETIKETLERI[kayit.eylem] ?? kayit.eylem}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {kayit.hedefTur}
                      {kayit.hedefId && (
                        <span className="ml-1 font-mono">#{kayit.hedefId.slice(-6)}</span>
                      )}
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
