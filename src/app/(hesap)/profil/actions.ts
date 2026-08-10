"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";
import { AZAMI_AVATAR_UZUNLUGU } from "@/lib/avatar";

/** İstemciden gelen data URL'i doğrular — sadece küçük, gerçek bir görsel kabul edilir. */
const avatarSemasi = z
  .string()
  .max(AZAMI_AVATAR_UZUNLUGU, "Fotoğraf çok büyük.")
  .regex(/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+=*$/, "Geçersiz görsel.");

export async function profilAvatariKaydet(dataUrl: string | null) {
  const kullanici = await oturumGerekli();

  if (dataUrl === null) {
    await prisma.user.update({
      where: { id: kullanici.id },
      data: { avatar: null, avatarSurum: null },
    });
  } else {
    const gecerli = avatarSemasi.parse(dataUrl);
    await prisma.user.update({
      where: { id: kullanici.id },
      data: { avatar: gecerli, avatarSurum: new Date() },
    });
  }

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: dataUrl === null ? "PROFIL_AVATAR_DELETE" : "PROFIL_AVATAR_UPDATE",
    hedefTur: "User",
    hedefId: kullanici.id,
  });

  revalidatePath("/profil");
  return { basarili: true };
}

const bilgiSemasi = z.object({
  adSoyad: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı"),
});

export async function profilBilgisiGuncelle(formData: FormData) {
  const kullanici = await oturumGerekli();
  const veri = bilgiSemasi.parse({ adSoyad: formData.get("adSoyad") });

  await prisma.user.update({
    where: { id: kullanici.id },
    data: { adSoyad: veri.adSoyad },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "PROFIL_GUNCELLE",
    hedefTur: "User",
    hedefId: kullanici.id,
    detay: { yeniAdSoyad: veri.adSoyad },
  });

  revalidatePath("/profil");
  return { basarili: true };
}

const sifreSemasi = z
  .object({
    mevcutSifre: z.string().min(1, "Mevcut şifrenizi girin"),
    yeniSifre: z.string().min(8, "Yeni şifre en az 8 karakter olmalı"),
    yeniSifreTekrar: z.string(),
  })
  .refine((v) => v.yeniSifre === v.yeniSifreTekrar, {
    message: "Yeni şifreler eşleşmiyor",
    path: ["yeniSifreTekrar"],
  });

export async function sifreDegistir(formData: FormData) {
  const kullanici = await oturumGerekli();

  const veri = sifreSemasi.parse({
    mevcutSifre: formData.get("mevcutSifre"),
    yeniSifre: formData.get("yeniSifre"),
    yeniSifreTekrar: formData.get("yeniSifreTekrar"),
  });

  const kayit = await prisma.user.findUnique({
    where: { id: kullanici.id },
    select: { sifreHash: true },
  });
  if (!kayit) throw new Error("Kullanıcı bulunamadı.");

  const dogruMu = await bcrypt.compare(veri.mevcutSifre, kayit.sifreHash);
  if (!dogruMu) {
    throw new Error("Mevcut şifreniz hatalı.");
  }

  await prisma.user.update({
    where: { id: kullanici.id },
    data: { sifreHash: await bcrypt.hash(veri.yeniSifre, 12) },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "PASSWORD_CHANGE",
    hedefTur: "User",
    hedefId: kullanici.id,
  });

  return { basarili: true };
}
