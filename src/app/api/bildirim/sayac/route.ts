import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Bildirim zilinin okunmamış sayacını tazelemek için hafif, sık çağrılabilir bir uç nokta. */
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Yetkisiz", { status: 401 });
  }

  const sayac = await prisma.notification.count({
    where: { aliciId: session.user.id, okunduMu: false },
  });

  return NextResponse.json({ sayac });
}
