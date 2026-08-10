import { CalendarDays } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { HaftalikProgram } from "@/components/haftalik-program";

export default async function MudurProgramSayfasi() {
  const kullanici = await oturumGerekli(["MUDUR"]);
  const institutionId = kullanici.institutionId!;

  const slotlar = await prisma.scheduleSlot.findMany({
    where: { student: { institutionId } },
    include: {
      student: { select: { id: true, adSoyad: true, avatarSurum: true } },
      teacher: { select: { adSoyad: true } },
    },
  });

  return (
    <div className="space-y-6">
      <SayfaBasligi
        icon={CalendarDays}
        renk="yesil"
        baslik="Kurum Ders Programı"
        aciklama="Tüm öğretmenlerin haftalık ders programlarını buradan görüntüleyin."
      />
      <HaftalikProgram slotlar={slotlar} duzenlenebilir={false} ogretmenAdiGoster />
    </div>
  );
}
