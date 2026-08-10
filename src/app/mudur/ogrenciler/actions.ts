"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";

const ogrenciSemasi = z.object({
  adSoyad: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı"),
  dogumTarihi: z.string().optional(),
  taniKategorisi: z.string().trim().optional(),
  classroomId: z.string().optional(),
  veliId: z.string().optional(),
});

export async function ogrenciOlustur(formData: FormData) {
  const kullanici = await oturumGerekli(["MUDUR"]);
  const institutionId = kullanici.institutionId!;

  const veri = ogrenciSemasi.parse({
    adSoyad: formData.get("adSoyad"),
    dogumTarihi: formData.get("dogumTarihi") || undefined,
    taniKategorisi: formData.get("taniKategorisi") || undefined,
    classroomId: formData.get("classroomId") || undefined,
    veliId: formData.get("veliId") || undefined,
  });

  if (veri.classroomId) {
    const sinif = await prisma.classroom.findFirst({
      where: { id: veri.classroomId, institutionId },
    });
    if (!sinif) throw new Error("Geçersiz sınıf seçimi.");
  }

  if (veri.veliId) {
    const veli = await prisma.user.findFirst({
      where: { id: veri.veliId, institutionId, rol: "VELI" },
    });
    if (!veli) throw new Error("Geçersiz veli seçimi.");
  }

  const ogrenci = await prisma.student.create({
    data: {
      adSoyad: veri.adSoyad,
      institutionId,
      classroomId: veri.classroomId ?? null,
      veliId: veri.veliId ?? null,
      taniKategorisi: veri.taniKategorisi ?? null,
      dogumTarihi: veri.dogumTarihi ? new Date(veri.dogumTarihi) : null,
    },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "STUDENT_CREATE",
    hedefTur: "Student",
    hedefId: ogrenci.id,
  });

  revalidatePath("/mudur/ogrenciler");
  revalidatePath("/mudur");
  return { basarili: true };
}
