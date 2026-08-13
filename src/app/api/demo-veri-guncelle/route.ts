import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Gecici, tek seferlik: demo mesaj ekini gercek boyutlu bir gorselle degistirir.
const GIZLI_ANAHTAR = "kirami-demo-seed-8f3a1c9d2e6b4f70";

export async function POST(istek: Request) {
  const anahtar = istek.headers.get("x-setup-secret");
  if (anahtar !== GIZLI_ANAHTAR) {
    return new NextResponse("Yetkisiz", { status: 401 });
  }

  const { ekVerisi } = (await istek.json()) as { ekVerisi: string };
  const eslesme = /^data:[^;]+;base64,(.+)$/.exec(ekVerisi);
  if (!eslesme) return NextResponse.json({ hata: "Geçersiz veri" }, { status: 400 });
  const boyutBayt = Math.floor((eslesme[1].length * 3) / 4);

  const mesaj = await prisma.message.findFirst({ where: { ekVerisi: { not: null } } });
  if (!mesaj) return NextResponse.json({ hata: "Dosyalı mesaj bulunamadı" }, { status: 404 });

  await prisma.message.update({
    where: { id: mesaj.id },
    data: { ekVerisi, ekBoyutBayt: boyutBayt },
  });

  return NextResponse.json({ basarili: true, mesajId: mesaj.id, boyutBayt });
}
