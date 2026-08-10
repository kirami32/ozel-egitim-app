"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";
import { SAAT_REGEX } from "@/lib/program";

const slotSemasi = z
  .object({
    studentId: z.string().min(1, "Öğrenci seçimi gerekli"),
    gun: z.coerce.number().int().min(1).max(5),
    baslangicSaati: z.string().regex(SAAT_REGEX, "Geçerli bir saat girin"),
    bitisSaati: z.string().regex(SAAT_REGEX, "Geçerli bir saat girin"),
  })
  .refine((v) => v.bitisSaati > v.baslangicSaati, {
    message: "Bitiş saati başlangıçtan sonra olmalı",
    path: ["bitisSaati"],
  });

export async function programSlotOlustur(formData: FormData) {
  const kullanici = await oturumGerekli(["OGRETMEN"]);

  const veri = slotSemasi.parse({
    studentId: formData.get("studentId"),
    gun: formData.get("gun"),
    baslangicSaati: formData.get("baslangicSaati"),
    bitisSaati: formData.get("bitisSaati"),
  });

  // Öğrenci gerçekten bu öğretmenin sınıfında mı — başkasının programına slot eklenemez.
  const ogrenci = await prisma.student.findFirst({
    where: { id: veri.studentId, classroom: { teacherId: kullanici.id } },
    select: { id: true },
  });
  if (!ogrenci) throw new Error("Bu öğrenci için program oluşturma yetkiniz yok.");

  const slot = await prisma.scheduleSlot.create({
    data: {
      studentId: veri.studentId,
      teacherId: kullanici.id,
      gun: veri.gun,
      baslangicSaati: veri.baslangicSaati,
      bitisSaati: veri.bitisSaati,
    },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "PROGRAM_SLOT_CREATE",
    hedefTur: "ScheduleSlot",
    hedefId: slot.id,
    detay: { studentId: veri.studentId, gun: veri.gun },
  });

  revalidatePath("/ogretmen/program");
  revalidatePath("/mudur/program");
  return { basarili: true };
}

export async function programSlotSil(slotId: string) {
  const kullanici = await oturumGerekli(["OGRETMEN"]);

  const slot = await prisma.scheduleSlot.findUnique({
    where: { id: slotId },
    select: { teacherId: true },
  });
  if (!slot || slot.teacherId !== kullanici.id) {
    throw new Error("Bu programı silme yetkiniz yok.");
  }

  await prisma.scheduleSlot.delete({ where: { id: slotId } });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "PROGRAM_SLOT_DELETE",
    hedefTur: "ScheduleSlot",
    hedefId: slotId,
  });

  revalidatePath("/ogretmen/program");
  revalidatePath("/mudur/program");
  return { basarili: true };
}
