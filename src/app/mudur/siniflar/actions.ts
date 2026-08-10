"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";

const sinifSemasi = z.object({
  ad: z.string().trim().min(1, "Sınıf adı gerekli").max(100),
  teacherId: z.string().optional(),
});

export async function sinifOlustur(formData: FormData) {
  const kullanici = await oturumGerekli(["MUDUR"]);
  const institutionId = kullanici.institutionId!;

  const veri = sinifSemasi.parse({
    ad: formData.get("ad"),
    teacherId: formData.get("teacherId") || undefined,
  });

  if (veri.teacherId) {
    const ogretmen = await prisma.user.findFirst({
      where: { id: veri.teacherId, institutionId, rol: "OGRETMEN" },
    });
    if (!ogretmen) throw new Error("Geçersiz öğretmen seçimi.");
  }

  const sinif = await prisma.classroom.create({
    data: {
      ad: veri.ad,
      institutionId,
      teacherId: veri.teacherId ?? null,
    },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "CLASSROOM_CREATE",
    hedefTur: "Classroom",
    hedefId: sinif.id,
  });

  revalidatePath("/mudur/siniflar");
  return { basarili: true };
}
