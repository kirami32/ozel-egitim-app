import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { denetimKaydiOlustur } from "@/lib/audit";
import { OgrenciProfilGorunumu } from "@/components/ogrenci-profil-gorunumu";
import { DersKaydiForm } from "@/components/ders-kaydi-form";

export default async function OgrenciProfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kullanici = await oturumGerekli(["OGRETMEN"]);

  const ogrenci = await prisma.student.findFirst({
    where: { id, classroom: { teacherId: kullanici.id } },
    include: {
      classroom: { select: { ad: true } },
      veli: { select: { adSoyad: true } },
      sessionLogs: {
        orderBy: { tarih: "desc" },
        include: { behaviorTags: { include: { behaviorTag: true } } },
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

  const davranisEtiketleri = await prisma.behaviorTag.findMany({ orderBy: { ad: "asc" } });

  return (
    <div className="space-y-6">
      <Link
        href="/ogretmen"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Öğrencilerime dön
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OgrenciProfilGorunumu
            adSoyad={ogrenci.adSoyad}
            sinifAdi={ogrenci.classroom?.ad ?? null}
            veliAdi={ogrenci.veli?.adSoyad}
            taniKategorisi={ogrenci.taniKategorisi}
            sessionLogs={ogrenci.sessionLogs}
          />
        </div>

        <div>
          <DersKaydiForm studentId={ogrenci.id} davranisEtiketleri={davranisEtiketleri} />
        </div>
      </div>
    </div>
  );
}
