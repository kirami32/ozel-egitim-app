import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileDown } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { denetimKaydiOlustur } from "@/lib/audit";
import { Button } from "@/components/ui/button";
import { OgrenciProfilGorunumu } from "@/components/ogrenci-profil-gorunumu";

export default async function VeliOgrenciDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kullanici = await oturumGerekli(["VELI"]);

  const ogrenci = await prisma.student.findFirst({
    where: { id, veliId: kullanici.id },
    include: {
      classroom: { select: { ad: true } },
      sessionLogs: {
        orderBy: { tarih: "desc" },
        include: {
          behaviorTags: { include: { behaviorTag: true } },
          teacher: { select: { adSoyad: true } },
        },
      },
      attendanceRecords: { orderBy: { tarih: "desc" } },
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
        href="/veli"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Çocuklarıma dön
      </Link>

      <OgrenciProfilGorunumu
        adSoyad={ogrenci.adSoyad}
        sinifAdi={ogrenci.classroom?.ad ?? null}
        taniKategorisi={ogrenci.taniKategorisi}
        sessionLogs={ogrenci.sessionLogs}
        attendanceRecords={ogrenci.attendanceRecords}
        ogretmenAdiGoster
        ustBaslikSagi={
          <Button asChild>
            <Link href={`/veli/rapor?studentId=${ogrenci.id}`}>
              <FileDown className="h-4 w-4" />
              PDF Rapor İndir
            </Link>
          </Button>
        }
      />
    </div>
  );
}
