import { CalendarDays } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { HaftalikProgram } from "@/components/haftalik-program";

export default async function AdminProgramSayfasi() {
  await oturumGerekli(["SUPER_ADMIN"]);

  const slotlar = await prisma.scheduleSlot.findMany({
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
        baslik="Ders Programı"
        aciklama="Tüm kurumlardaki öğretmenlerin haftalık ders programlarını buradan görüntüleyin."
      />
      <HaftalikProgram slotlar={slotlar} duzenlenebilir={false} ogretmenAdiGoster />
    </div>
  );
}
