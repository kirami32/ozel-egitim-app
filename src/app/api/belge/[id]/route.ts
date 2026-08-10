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

  const belge = await prisma.studentDocument.findUnique({
    where: { id },
    select: { studentId: true, dosyaAdi: true, mimeTuru: true, veri: true },
  });
  if (!belge) return new NextResponse("Bulunamadı", { status: 404 });

  const gorebilir = await ogrenciGorulebilirMi(kullanici, belge.studentId);
  if (!gorebilir) return new NextResponse("Yetkisiz", { status: 403 });

  const eslesme = /^data:[^;]+;base64,(.+)$/.exec(belge.veri);
  if (!eslesme) return new NextResponse("Bulunamadı", { status: 404 });

  const govde = Buffer.from(eslesme[1], "base64");

  return new NextResponse(new Uint8Array(govde), {
    headers: {
      "Content-Type": belge.mimeTuru,
      "Content-Length": String(govde.byteLength),
      "Content-Disposition": `attachment; filename="${encodeURIComponent(belge.dosyaAdi)}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
