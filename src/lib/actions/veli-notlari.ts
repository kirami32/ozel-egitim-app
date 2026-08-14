"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";
import { bildirimOlustur } from "@/lib/bildirim";
import { emailGonder, uygulamaUrl } from "@/lib/email";
import { veliNotuEmailHtml, veliNotuEmailKonusu } from "@/lib/email-sablonlari";
import { ogrenciYonetilebilirMi } from "@/lib/ogrenci-erisim";

const ROL_YOLLARI = ["/admin", "/mudur", "/ogretmen", "/veli"];

function ogrenciYollariniTazele(ogrenciId: string) {
  for (const onEk of ROL_YOLLARI) {
    revalidatePath(`${onEk}/ogrenci/${ogrenciId}`);
  }
}

const notSemasi = z.object({
  icerik: z.string().trim().min(2, "Not en az 2 karakter olmalı").max(1000),
  onemli: z.coerce.boolean().optional().default(false),
});

/**
 * Öğretmen/müdürden veliye tek yönlü, hızlı bilgilendirme notu. Mesajlaşma
 * değil — veli yalnızca okur, cevap yazamaz.
 */
export async function veliNotuEkle(ogrenciId: string, formData: FormData) {
  // Süper admin bu platformda yalnızca raporları/notları izler, not yazmaz.
  const kullanici = await oturumGerekli(["OGRETMEN", "MUDUR"]);

  const yetkili = await ogrenciYonetilebilirMi(kullanici, ogrenciId);
  if (!yetkili) throw new Error("Bu öğrenciye not ekleme yetkiniz yok.");

  const veri = notSemasi.parse({
    icerik: formData.get("icerik"),
    onemli: formData.get("onemli"),
  });

  const not = await prisma.parentNote.create({
    data: {
      studentId: ogrenciId,
      icerik: veri.icerik,
      onemli: veri.onemli,
      yazarId: kullanici.id,
    },
    include: {
      student: {
        select: { adSoyad: true, veliId: true, veli: { select: { email: true } } },
      },
    },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "VELI_NOTU_CREATE",
    hedefTur: "ParentNote",
    hedefId: not.id,
    detay: { studentId: ogrenciId },
  });

  if (not.student.veliId) {
    const link = `/veli/ogrenci/${ogrenciId}`;

    await bildirimOlustur({
      aliciId: not.student.veliId,
      tur: "VELI_NOTU",
      baslik: `${not.student.adSoyad} için yeni bir not var`,
      mesaj: veri.icerik.slice(0, 140),
      link,
    });

    if (not.student.veli?.email) {
      await emailGonder({
        to: not.student.veli.email,
        subject: veliNotuEmailKonusu(not.student.adSoyad),
        html: veliNotuEmailHtml({
          ogrenciAdi: not.student.adSoyad,
          yazarAdi: kullanici.adSoyad,
          icerik: veri.icerik,
          onemli: veri.onemli,
          link: uygulamaUrl(link),
        }),
      });
    }
  }

  ogrenciYollariniTazele(ogrenciId);
  return { basarili: true };
}

export async function veliNotuSil(notId: string, ogrenciId: string) {
  const kullanici = await oturumGerekli();

  const not = await prisma.parentNote.findUnique({
    where: { id: notId },
    select: { yazarId: true, studentId: true },
  });
  if (!not || not.studentId !== ogrenciId) throw new Error("Not bulunamadı.");

  // Yalnızca notu yazan kişi veya kurum yöneticisi/admin silebilir.
  const yetkili =
    not.yazarId === kullanici.id ||
    kullanici.rol === "SUPER_ADMIN" ||
    kullanici.rol === "MUDUR";
  if (!yetkili) throw new Error("Bu notu silme yetkiniz yok.");

  if (kullanici.rol === "MUDUR") {
    const kapsamda = await ogrenciYonetilebilirMi(kullanici, ogrenciId);
    if (!kapsamda) throw new Error("Bu notu silme yetkiniz yok.");
  }

  await prisma.parentNote.delete({ where: { id: notId } });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "VELI_NOTU_DELETE",
    hedefTur: "ParentNote",
    hedefId: notId,
    detay: { studentId: ogrenciId, yazariMi: not.yazarId === kullanici.id },
  });

  ogrenciYollariniTazele(ogrenciId);
  return { basarili: true };
}
