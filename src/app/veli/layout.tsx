import { auth } from "@/lib/auth";
import { DashboardShell, type NavOgesi } from "@/components/dashboard-shell";

const NAV: NavOgesi[] = [
  { href: "/veli", label: "Özet", icon: "Home" },
  { href: "/veli/rapor", label: "Rapor İndir", icon: "FileDown" },
];

export default async function VeliLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const kullaniciAdi = session?.user?.adSoyad ?? "Veli";

  return (
    <DashboardShell navOgeleri={NAV} rolEtiketi="Veli" kullaniciAdi={kullaniciAdi}>
      {children}
    </DashboardShell>
  );
}
