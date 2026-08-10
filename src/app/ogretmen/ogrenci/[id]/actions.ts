"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";

const dersKaydiSemasi = z.object({
  studentId: z.string().min(1),
  islenenKonu: z.string().trim().max(300).optional(),
  verimlilikPuani: z.coerce.number().int().min(1).max(10),
  serbestNot: z.string().trim().max(4000).optional(),
  behaviorTagIds: z.array(z.string()).default([]),
});

export async function dersKaydiOlustur(formData: FormData) {
  const kullanici = await oturumGerekli(["OGRETMEN"]);

  const veri = dersKaydiSemasi.parse({
    studentId: formData.get("studentId"),
    islenenKonu: formData.get("islenenKonu") || undefined,
    verimlilikPuani: formData.get("verimlilikPuani"),
    serbestNot: formData.get("serbestNot") || undefined,
    behaviorTagIds: formData.getAll("behaviorTagIds"),
  });

  const ogrenci = await prisma.student.findFirst({
    where: { id: veri.studentId, classroom: { teacherId: kullanici.id } },
  });
  if (!ogrenci) {
    throw new Error("Bu öğrenci için kayıt ekleme yetkiniz yok.");
  }

  const kayit = await prisma.sessionLog.create({
    data: {
      studentId: veri.studentId,
      teacherId: kullanici.id,
      islenenKonu: veri.islenenKonu || null,
      verimlilikPuani: veri.verimlilikPuani,
      serbestNot: veri.serbestNot || null,
      behaviorTags: {
        create: veri.behaviorTagIds.map((behaviorTagId) => ({ behaviorTagId })),
      },
    },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "SESSION_LOG_CREATE",
    hedefTur: "SessionLog",
    hedefId: kayit.id,
    detay: { studentId: veri.studentId },
  });

  revalidatePath(`/ogretmen/ogrenci/${veri.studentId}`);
  revalidatePath("/ogretmen");
  return { basarili: true };
}
