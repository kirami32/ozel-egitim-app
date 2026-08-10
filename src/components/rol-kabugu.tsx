import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard-shell";
import { ROL_ANA_SAYFA, ROL_ETIKETI, ROL_NAV } from "@/lib/navigasyon";
import type { Role } from "@/generated/prisma/enums";

/**
 * Tüm panel sayfalarının ortak kabuğu. `rol` verilirse o role ait alan
 * korunur (yanlış roldeki kullanıcı kendi ana sayfasına gönderilir); verilmezse
 * oturumdaki rolün menüsü kullanılır — Ayarlar/Profil gibi role özel olmayan
 * sayfalar bu ikinci biçimi kullanıyor.
 */
export async function RolKabugu({
  rol,
  children,
}: {
  rol?: Role;
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/giris");

  const kullanici = session.user;
  if (rol && kullanici.rol !== rol) {
    redirect(ROL_ANA_SAYFA[kullanici.rol]);
  }

  // Sadece avatarın sürümünü çekiyoruz; base64 gövdesi /api/avatar üzerinden
  // ayrıca ve önbelleklenebilir şekilde servis ediliyor.
  const profil = await prisma.user.findUnique({
    where: { id: kullanici.id },
    select: { avatarSurum: true, adSoyad: true },
  });

  return (
    <DashboardShell
      navOgeleri={ROL_NAV[kullanici.rol]}
      rolEtiketi={ROL_ETIKETI[kullanici.rol]}
      kullaniciAdi={profil?.adSoyad ?? kullanici.adSoyad}
      kullaniciId={kullanici.id}
      avatarSurum={profil?.avatarSurum ?? null}
    >
      {children}
    </DashboardShell>
  );
}
