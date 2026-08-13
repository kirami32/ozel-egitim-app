import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { ogrenciGorulebilirMi } from "@/lib/ogrenci-erisim";

export async function GET(
  _istek: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let kullanici;
  try {
    kullanici = await oturumGerekli();
  } catch {
    return new NextResponse("Yetkisiz", { status: 401 });
  }

  const mesaj = await prisma.message.findUnique({
    where: { id },
    select: { studentId: true, ekAdi: true, ekMimeTuru: true, ekVerisi: true },
  });
  if (!mesaj || !mesaj.ekVerisi || !mesaj.ekMimeTuru) {
    return new NextResponse("Bulunamadı", { status: 404 });
  }

  const gorebilir = await ogrenciGorulebilirMi(kullanici, mesaj.studentId);
  if (!gorebilir) return new NextResponse("Yetkisiz", { status: 403 });

  const eslesme = /^data:[^;]+;base64,(.+)$/.exec(mesaj.ekVerisi);
  if (!eslesme) return new NextResponse("Bulunamadı", { status: 404 });

  const govde = Buffer.from(eslesme[1], "base64");
  const gorselMi = mesaj.ekMimeTuru.startsWith("image/");

  return new NextResponse(new Uint8Array(govde), {
    headers: {
      "Content-Type": mesaj.ekMimeTuru,
      "Content-Length": String(govde.byteLength),
      "Content-Disposition": `${gorselMi ? "inline" : "attachment"}; filename="${encodeURIComponent(mesaj.ekAdi ?? "dosya")}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
