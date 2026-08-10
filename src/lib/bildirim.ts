import "server-only";
import { prisma } from "@/lib/prisma";
import type { BildirimTuru } from "@/generated/prisma/enums";

interface BildirimGirdisi {
  aliciId: string;
  tur: BildirimTuru;
  baslik: string;
  mesaj: string;
  link?: string;
}

/** Bildirim oluşturur. Ana işlemi asla bloklamaz — hata olursa sessizce loglanır. */
export async function bildirimOlustur(girdi: BildirimGirdisi) {
  try {
    await prisma.notification.create({ data: girdi });
  } catch (err) {
    console.error("Bildirim oluşturulamadı:", err);
  }
}

/** Aynı bildirimi birden çok alıcıya (ör. tüm süper adminlere) gönderir. */
export async function bildirimOlusturTopluca(
  aliciIdler: string[],
  girdi: Omit<BildirimGirdisi, "aliciId">
) {
  try {
    if (aliciIdler.length === 0) return;
    await prisma.notification.createMany({
      data: aliciIdler.map((aliciId) => ({ ...girdi, aliciId })),
    });
  } catch (err) {
    console.error("Toplu bildirim oluşturulamadı:", err);
  }
}
