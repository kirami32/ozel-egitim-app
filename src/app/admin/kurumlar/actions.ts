"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";

const kurumSemasi = z.object({
  ad: z.string().trim().min(2, "Kurum adı en az 2 karakter olmalı").max(200),
  adres: z.string().trim().max(500).optional().or(z.literal("")),
  telefon: z.string().trim().max(30).optional().or(z.literal("")),
  email: z.string().trim().email("Geçerli bir e-posta girin").optional().or(z.literal("")),
});

export async function kurumOlustur(formData: FormData) {
  const kullanici = await oturumGerekli(["SUPER_ADMIN"]);

  const veri = kurumSemasi.parse({
    ad: formData.get("ad"),
    adres: formData.get("adres") ?? "",
    telefon: formData.get("telefon") ?? "",
    email: formData.get("email") ?? "",
  });

  const kurum = await prisma.institution.create({
    data: {
      ad: veri.ad,
      adres: veri.adres || null,
      telefon: veri.telefon || null,
      email: veri.email || null,
    },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "INSTITUTION_CREATE",
    hedefTur: "Institution",
    hedefId: kurum.id,
  });

  revalidatePath("/admin/kurumlar");
  revalidatePath("/admin");
  return { basarili: true };
}

export async function kurumDurumDegistir(kurumId: string, aktifMi: boolean) {
  const kullanici = await oturumGerekli(["SUPER_ADMIN"]);

  await prisma.institution.update({
    where: { id: kurumId },
    data: { aktifMi },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: aktifMi ? "INSTITUTION_ACTIVATE" : "INSTITUTION_DEACTIVATE",
    hedefTur: "Institution",
    hedefId: kurumId,
  });

  revalidatePath("/admin/kurumlar");
}
