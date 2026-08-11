"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";

const kullaniciSemasi = z.object({
  adSoyad: z.string().trim().min(2, "Ad soyad en az 2 karakter olmalı"),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
  rol: z.enum(["MUDUR", "OGRETMEN", "VELI"]),
  institutionId: z.string().min(1, "Kurum seçimi gerekli"),
});

export async function kullaniciOlustur(formData: FormData) {
  const kullanici = await oturumGerekli(["SUPER_ADMIN", "MUDUR"]);

  const veri = kullaniciSemasi.parse({
    adSoyad: formData.get("adSoyad"),
    email: formData.get("email"),
    password: formData.get("password"),
    rol: formData.get("rol"),
    institutionId: formData.get("institutionId"),
  });

  if (kullanici.rol === "MUDUR") {
    if (veri.rol === "MUDUR" || veri.institutionId !== kullanici.institutionId) {
      throw new Error("Bu işlem için yetkiniz yok.");
    }
  }

  const mevcut = await prisma.user.findUnique({ where: { email: veri.email } });
  if (mevcut) {
    throw new Error("Bu e-posta adresi zaten kayıtlı.");
  }

  const sifreHash = await bcrypt.hash(veri.password, 12);

  const yeniKullanici = await prisma.user.create({
    data: {
      adSoyad: veri.adSoyad,
      email: veri.email,
      sifreHash,
      rol: veri.rol,
      institutionId: veri.institutionId,
    },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "USER_CREATE",
    hedefTur: "User",
    hedefId: yeniKullanici.id,
    detay: { rol: veri.rol },
  });

  revalidatePath("/admin/kullanicilar");
  revalidatePath("/mudur/ogretmenler");
  return { basarili: true };
}

export async function kullaniciDurumDegistir(hedefKullaniciId: string, aktifMi: boolean) {
  const kullanici = await oturumGerekli(["SUPER_ADMIN"]);

  if (hedefKullaniciId === kullanici.id) {
    throw new Error("Kendi hesabınızı pasife alamazsınız.");
  }

  await prisma.user.update({
    where: { id: hedefKullaniciId },
    data: { aktifMi },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: aktifMi ? "USER_ACTIVATE" : "USER_DEACTIVATE",
    hedefTur: "User",
    hedefId: hedefKullaniciId,
  });

  revalidatePath("/admin/kullanicilar");
  return { basarili: true };
}
