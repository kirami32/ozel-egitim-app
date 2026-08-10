"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";
import { gunBasiTarih } from "@/lib/devam";

const devamsizlikGirdiSemasi = z.object({
  tarih: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçersiz tarih"),
  kayitlar: z
    .array(
      z.object({
        studentId: z.string().min(1),
        durum: z.enum(["VAR", "YOK", "GEC", "IZINLI"]),
        aciklama: z.string().trim().max(500).optional(),
      })
    )
    .min(1),
});

export async function devamsizlikKaydet(girdi: z.infer<typeof devamsizlikGirdiSemasi>) {
  const kullanici = await oturumGerekli(["OGRETMEN"]);
  const veri = devamsizlikGirdiSemasi.parse(girdi);
  const gun = gunBasiTarih(veri.tarih);

  const ogrenciIdleri = veri.kayitlar.map((k) => k.studentId);
  const yetkiliOgrenciler = await prisma.student.findMany({
    where: { id: { in: ogrenciIdleri }, classroom: { teacherId: kullanici.id } },
    select: { id: true },
  });
  const yetkiliIdSeti = new Set(yetkiliOgrenciler.map((o) => o.id));
  if (yetkiliOgrenciler.length !== new Set(ogrenciIdleri).size) {
    throw new Error("Bazı öğrenciler için kayıt ekleme yetkiniz yok.");
  }

  await prisma.$transaction(
    veri.kayitlar
      .filter((kayit) => yetkiliIdSeti.has(kayit.studentId))
      .map((kayit) =>
        prisma.attendance.upsert({
          where: { studentId_tarih: { studentId: kayit.studentId, tarih: gun } },
          update: {
            durum: kayit.durum,
            aciklama: kayit.aciklama || null,
            recordedById: kullanici.id,
          },
          create: {
            studentId: kayit.studentId,
            tarih: gun,
            durum: kayit.durum,
            aciklama: kayit.aciklama || null,
            recordedById: kullanici.id,
          },
        })
      )
  );

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "ATTENDANCE_RECORD",
    hedefTur: "Attendance",
    detay: { tarih: veri.tarih, ogrenciSayisi: veri.kayitlar.length },
  });

  revalidatePath("/ogretmen/devamsizlik");
  revalidatePath("/mudur/devamsizlik");
  revalidatePath("/mudur");

  return { basarili: true, kayitSayisi: veri.kayitlar.length };
}
