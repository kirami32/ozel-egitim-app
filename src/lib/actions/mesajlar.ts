"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { denetimKaydiOlustur } from "@/lib/audit";
import { bildirimOlustur } from "@/lib/bildirim";
import { ogrenciGorulebilirMi } from "@/lib/ogrenci-erisim";
import type { Role } from "@/generated/prisma/enums";

const ROL_YOLLARI = ["/admin", "/mudur", "/ogretmen", "/veli"];

function ogrenciYollariniTazele(ogrenciId: string) {
  for (const onEk of ROL_YOLLARI) {
    revalidatePath(`${onEk}/ogrenci/${ogrenciId}`);
  }
}

const mesajSemasi = z.object({
  icerik: z.string().trim().min(1, "Mesaj boş olamaz").max(2000),
});

/**
 * Veli <-> öğretmen/müdür arasında öğrenci bağlamında iki yönlü mesajlaşma.
 * Süper admin bu platformda yalnızca izler, mesajlaşmaya taraf olmaz.
 */
export async function mesajGonder(ogrenciId: string, formData: FormData) {
  const kullanici = await oturumGerekli(["VELI", "OGRETMEN", "MUDUR"]);

  const yetkili = await ogrenciGorulebilirMi(kullanici, ogrenciId);
  if (!yetkili) throw new Error("Bu öğrenciye mesaj gönderme yetkiniz yok.");

  const veri = mesajSemasi.parse({ icerik: formData.get("icerik") });

  const ogrenci = await prisma.student.findUnique({
    where: { id: ogrenciId },
    select: {
      adSoyad: true,
      veliId: true,
      classroom: { select: { teacherId: true } },
    },
  });
  if (!ogrenci) throw new Error("Öğrenci bulunamadı.");

  const mesaj = await prisma.message.create({
    data: {
      studentId: ogrenciId,
      icerik: veri.icerik,
      gonderenId: kullanici.id,
    },
  });

  await denetimKaydiOlustur({
    userId: kullanici.id,
    eylem: "MESAJ_GONDER",
    hedefTur: "Message",
    hedefId: mesaj.id,
    detay: { studentId: ogrenciId },
  });

  // Karşı taraf(lar)a bildirim gönder: veli ve/veya atanmış öğretmen —
  // gönderenin kendisi hariç. Müdür gönderirse ikisine de gider. Bağlantı,
  // gönderenin değil alıcının rolune göre kurulmalı (veli -> /veli/..,
  // öğretmen -> /ogretmen/..) yoksa alıcı kendi paneline gidemez.
  const aliciIdler: { id: string; onEk: "veli" | "ogretmen" }[] = [];
  if (ogrenci.veliId && ogrenci.veliId !== kullanici.id) {
    aliciIdler.push({ id: ogrenci.veliId, onEk: "veli" });
  }
  if (ogrenci.classroom?.teacherId && ogrenci.classroom.teacherId !== kullanici.id) {
    aliciIdler.push({ id: ogrenci.classroom.teacherId, onEk: "ogretmen" });
  }

  for (const { id: aliciId, onEk } of aliciIdler) {
    await bildirimOlustur({
      aliciId,
      tur: "YENI_MESAJ",
      baslik: `${ogrenci.adSoyad} hakkında yeni bir mesaj`,
      mesaj: veri.icerik.slice(0, 140),
      link: `/${onEk}/ogrenci/${ogrenciId}`,
    });
  }

  ogrenciYollariniTazele(ogrenciId);
  return { basarili: true };
}

/**
 * Bir öğrenci mesaj dizisi açıldığında, gönderen olmayan taraf (veli veya
 * öğretmen) için "okundu" işaretler. Müdür/süper admin salt izleyici olduğu
 * için bu işlemi tetiklemez.
 */
export async function mesajlariOkunduIsaretle(ogrenciId: string, kullaniciId: string, rol: Role) {
  if (rol !== "VELI" && rol !== "OGRETMEN") return;
  try {
    await prisma.message.updateMany({
      where: { studentId: ogrenciId, gonderenId: { not: kullaniciId }, okunduMu: false },
      data: { okunduMu: true },
    });
  } catch (err) {
    console.error("Mesajlar okundu işaretlenemedi:", err);
  }
}
