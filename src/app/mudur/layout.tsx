import { auth } from "@/lib/auth";
import { DashboardShell, type NavOgesi } from "@/components/dashboard-shell";

const NAV: NavOgesi[] = [
  { href: "/mudur", label: "Genel Bakış", icon: "LayoutDashboard" },
  { href: "/mudur/ogretmenler", label: "Öğretmenler", icon: "Users" },
  { href: "/mudur/siniflar", label: "Sınıflar", icon: "School" },
  { href: "/mudur/ogrenciler", label: "Öğrenciler", icon: "GraduationCap" },
  { href: "/mudur/devamsizlik", label: "Devam / Devamsızlık", icon: "CalendarCheck" },
];

export default async function MudurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const kullaniciAdi = session?.user?.adSoyad ?? "Müdür";

  return (
    <DashboardShell navOgeleri={NAV} rolEtiketi="Kurum Müdürü" kullaniciAdi={kullaniciAdi}>
      {children}
    </DashboardShell>
  );
}
