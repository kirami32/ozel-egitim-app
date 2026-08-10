import { auth } from "@/lib/auth";
import { DashboardShell, type NavOgesi } from "@/components/dashboard-shell";

const NAV: NavOgesi[] = [
  { href: "/admin", label: "Genel Bakış", icon: "LayoutDashboard" },
  { href: "/admin/kurumlar", label: "Kurumlar", icon: "Building2" },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "Users" },
  { href: "/admin/ogrenciler", label: "Öğrenciler", icon: "GraduationCap" },
  { href: "/admin/denetim-kayitlari", label: "Denetim Kayıtları", icon: "ShieldCheck" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const kullaniciAdi = session?.user?.adSoyad ?? "Yönetici";

  return (
    <DashboardShell navOgeleri={NAV} rolEtiketi="Süper Admin" kullaniciAdi={kullaniciAdi}>
      {children}
    </DashboardShell>
  );
}
