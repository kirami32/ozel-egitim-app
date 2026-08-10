import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { oturumGerekli } from "@/lib/rbac";
import { kullaniciAvatariGorulebilirMi } from "@/lib/avatar-yetki";
import { ogrenciGorulebilirMi } from "@/lib/ogrenci-erisim";

/**
 * Profil fotoğraflarını servis eder. Fotoğraflar veritabanında data URL olarak
 * duruyor; burada çözülüp gerçek bir görsel olarak dönüyorlar. Böylece sayfa
 * HTML'i base64 ile şişmiyor ve tarayıcı görselleri önbelleğe alabiliyor.
 */
export async function GET(
  _istek: Request,
  { params }: { params: Promise<{ tur: string; id: string }> }
) {
  const { tur, id } = await params;

  if (tur !== "kullanici" && tur !== "ogrenci") {
    return new NextResponse("Bulunamadı", { status: 404 });
  }

  let izleyen;
  try {
    izleyen = await oturumGerekli();
  } catch {
    return new NextResponse("Yetkisiz", { status: 401 });
  }

  const gorebilir =
    tur === "kullanici"
      ? await kullaniciAvatariGorulebilirMi(izleyen, id)
      : await ogrenciGorulebilirMi(izleyen, id);

  if (!gorebilir) {
    return new NextResponse("Yetkisiz", { status: 403 });
  }

  const kayit =
    tur === "kullanici"
      ? await prisma.user.findUnique({
          where: { id },
          select: { avatar: true },
        })
      : await prisma.student.findUnique({
          where: { id },
          select: { avatar: true },
        });

  if (!kayit?.avatar) {
    return new NextResponse("Bulunamadı", { status: 404 });
  }

  const eslesme = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(kayit.avatar);
  if (!eslesme) {
    return new NextResponse("Bulunamadı", { status: 404 });
  }

  const [, mimeTuru, base64] = eslesme;
  const govde = Buffer.from(base64, "base64");

  return new NextResponse(new Uint8Array(govde), {
    headers: {
      "Content-Type": mimeTuru,
      "Content-Length": String(govde.byteLength),
      // Adres ?v=<zaman damgası> taşıdığı için içerik değişince URL de değişir;
      // bu yüzden uzun süreli önbellek güvenli. private: paylaşımlı CDN'de
      // tutulmasın, fotoğraflar yetkiye bağlı.
      "Cache-Control": "private, max-age=86400, must-revalidate",
    },
  });
}
