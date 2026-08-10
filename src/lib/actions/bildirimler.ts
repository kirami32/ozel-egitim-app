"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";

export async function bildirimOkunduIsaretle(bildirimId: string) {
  const kullanici = await oturumGerekli();

  await prisma.notification.updateMany({
    where: { id: bildirimId, aliciId: kullanici.id },
    data: { okunduMu: true },
  });

  revalidatePath("/bildirimler");
  return { basarili: true };
}

export async function tumBildirimleriOkunduIsaretle() {
  const kullanici = await oturumGerekli();

  await prisma.notification.updateMany({
    where: { aliciId: kullanici.id, okunduMu: false },
    data: { okunduMu: true },
  });

  revalidatePath("/bildirimler");
  return { basarili: true };
}
