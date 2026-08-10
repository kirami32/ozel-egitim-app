import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { denetimKaydiOlustur } from "@/lib/audit";
import { OgrenciProfilGorunumu } from "@/components/ogrenci-profil-gorunumu";
import { Badge } from "@/components/ui/badge";

export default async function AdminOgrenciDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kullanici = await oturumGerekli(["SUPER_ADMIN"]);

  const ogrenci = await prisma.student.findUnique({
    where: { id },
    include: {
      institution: { select: { ad: true } },
      classroom: { select: { ad: true } },
      veli: { select: { adSoyad: true } },
      sessionLogs: {
        orderBy: { tarih: "desc" },
        include: {
          behaviorTags: { include: { behaviorTag: true } },
          teacher: { select: { adSoyad: true } },
        },
      },
      attendanceRecords: { orderBy: { tarih: "desc" } },
      hedefler: {
        orderBy: { createdAt: "desc" },
        include: {
          ilerlemeKayitlari: {
            orderBy: { tarih: "desc" },
            include: { ekleyen: { select: { adSoyad: true } } },
          },
        },
      },
      veliNotlari: {
        orderBy: { createdAt: "desc" },
        include: { yazar: { select: { id: true, adSoyad: true, avatarSurum: true } } },
      },
    },
  });

  if (!ogrenci) notFound();

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "STUDENT_VIEW",
    hedefTur: "Student",
    hedefId: ogrenci.id,
  });

  return (
    <div className="space-y-6">
      <Link
        href="/admin/ogrenciler"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Tüm öğrencilere dön
      </Link>

      <OgrenciProfilGorunumu
        ogrenciId={ogrenci.id}
        adSoyad={ogrenci.adSoyad}
        avatarSurum={ogrenci.avatarSurum}
        avatarDuzenlenebilir
        sinifAdi={ogrenci.classroom?.ad ?? null}
        veliAdi={ogrenci.veli?.adSoyad}
        taniKategorisi={ogrenci.taniKategorisi}
        sessionLogs={ogrenci.sessionLogs}
        attendanceRecords={ogrenci.attendanceRecords}
        hedefler={ogrenci.hedefler}
        veliNotlari={ogrenci.veliNotlari}
        mevcutKullaniciId={kullanici.id}
        mevcutKullaniciRolu={kullanici.rol}
        ogretmenAdiGoster
        ustBaslikSagi={<Badge variant="outline">{ogrenci.institution.ad}</Badge>}
      />
    </div>
  );
}
