import { CalendarDays } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { HaftalikProgram } from "@/components/haftalik-program";

export default async function OgretmenProgramSayfasi() {
  const kullanici = await oturumGerekli(["OGRETMEN"]);

  const [slotlar, ogrenciler] = await Promise.all([
    prisma.scheduleSlot.findMany({
      where: { teacherId: kullanici.id },
      include: { student: { select: { id: true, adSoyad: true, avatarSurum: true } } },
    }),
    prisma.student.findMany({
      where: { classroom: { teacherId: kullanici.id }, aktifMi: true },
      orderBy: { adSoyad: "asc" },
      select: { id: true, adSoyad: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <SayfaBasligi
        icon={CalendarDays}
        renk="yesil"
        baslik="Haftalık Ders Programı"
        aciklama="Öğrencilerinizin haftalık ders saatlerini planlayın."
      />
      <HaftalikProgram slotlar={slotlar} ogrenciler={ogrenciler} duzenlenebilir />
    </div>
  );
}
