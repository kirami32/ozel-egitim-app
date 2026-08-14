"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { KisiAvatari } from "@/components/kisi-avatari";
import { ProgramSlotEkleDialog } from "@/components/program-slot-ekle-dialog";
import { programSlotSil } from "@/lib/actions/program";
import { cn } from "@/lib/utils";
import { GUN_ADLARI, GUN_RENKLERI, GUN_SIRASI } from "@/lib/program";

interface ProgramSlotu {
  id: string;
  gun: number;
  baslangicSaati: string;
  bitisSaati: string;
  student: { id: string; adSoyad: string; avatarSurum: Date | null };
  teacher?: { adSoyad: string };
}

export function HaftalikProgram({
  slotlar,
  ogrenciler,
  duzenlenebilir,
  ogretmenAdiGoster = false,
}: {
  slotlar: ProgramSlotu[];
  ogrenciler?: { id: string; adSoyad: string }[];
  duzenlenebilir: boolean;
  ogretmenAdiGoster?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const sil = (slotId: string) => {
    startTransition(async () => {
      try {
        await programSlotSil(slotId);
        toast.success("Programdan kaldırıldı");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      {GUN_SIRASI.map((gun, gunIndex) => {
        const gununSlotlari = slotlar
          .filter((s) => s.gun === gun)
          .sort((a, b) => a.baslangicSaati.localeCompare(b.baslangicSaati));

        return (
          <motion.div
            key={gun}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: gunIndex * 0.04 }}
            className="flex flex-col rounded-2xl border border-border/60 bg-card"
          >
            <div
              className="flex items-center justify-between rounded-t-2xl px-3 py-2.5 text-white"
              style={{ backgroundColor: GUN_RENKLERI[gun] }}
            >
              <p className="text-sm font-semibold">{GUN_ADLARI[gun]}</p>
              <span className="text-xs opacity-90">{gununSlotlari.length} ders</span>
            </div>

            <div className="flex-1 space-y-2 p-2.5">
              {gununSlotlari.length === 0 ? (
                <p className="flex items-center gap-1.5 px-1 py-3 text-xs text-muted-foreground/70">
                  <Clock className="h-3.5 w-3.5" />
                  Ders yok
                </p>
              ) : (
                gununSlotlari.map((slot) => (
                  <div
                    key={slot.id}
                    className="group flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-2"
                  >
                    <KisiAvatari
                      tur="ogrenci"
                      id={slot.student.id}
                      adSoyad={slot.student.adSoyad}
                      avatarSurum={slot.student.avatarSurum}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{slot.student.adSoyad}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {slot.baslangicSaati} – {slot.bitisSaati}
                        {ogretmenAdiGoster && slot.teacher && ` · ${slot.teacher.adSoyad}`}
                      </p>
                    </div>
                    {duzenlenebilir && (
                      <button
                        type="button"
                        onClick={() => sil(slot.id)}
                        disabled={isPending}
                        aria-label="Programdan kaldır"
                        className={cn(
                          "shrink-0 rounded-lg p-1 text-muted-foreground opacity-100 transition-opacity",
                          "hover:bg-destructive/10 hover:text-destructive md:opacity-0 md:group-hover:opacity-100"
                        )}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {duzenlenebilir && ogrenciler && (
              <div className="border-t border-border/60 p-2.5">
                <ProgramSlotEkleDialog gun={gun} ogrenciler={ogrenciler} />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
