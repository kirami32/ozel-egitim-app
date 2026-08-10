"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";
import { ogrenciYonetilebilirMi } from "@/lib/ogrenci-erisim";
import { AZAMI_AVATAR_UZUNLUGU } from "@/lib/avatar";

const avatarSemasi = z
  .string()
  .max(AZAMI_AVATAR_UZUNLUGU, "Fotoğraf çok büyük.")
  .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+=*$/, "Geçersiz görsel.");

/**
 * Öğrenci fotoğrafını günceller. Yalnızca öğrenciyi görme yetkisi olan
 * personel (öğretmen/müdür/admin) çağırabilir; veli yalnızca görüntüleyebilir.
 */
export async function ogrenciAvatariKaydet(
  ogrenciId: string,
  dataUrl: string | null
) {
  const kullanici = await oturumGerekli();

  const yetkili = await ogrenciYonetilebilirMi(kullanici, ogrenciId);
  if (!yetkili) {
    throw new Error("Bu öğrencinin fotoğrafını değiştirme yetkiniz yok.");
  }

  if (dataUrl === null) {
    await prisma.student.update({
      where: { id: ogrenciId },
      data: { avatar: null, avatarSurum: null },
    });
  } else {
    const gecerli = avatarSemasi.parse(dataUrl);
    await prisma.student.update({
      where: { id: ogrenciId },
      data: { avatar: gecerli, avatarSurum: new Date() },
    });
  }

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: dataUrl === null ? "STUDENT_AVATAR_DELETE" : "STUDENT_AVATAR_UPDATE",
    hedefTur: "Student",
    hedefId: ogrenciId,
  });

  // Öğrenci profili dört farklı rol altında görüntülenebiliyor.
  for (const onEk of ["/admin", "/mudur", "/ogretmen", "/veli"]) {
    revalidatePath(`${onEk}/ogrenci/${ogrenciId}`);
  }

  return { basarili: true };
}
