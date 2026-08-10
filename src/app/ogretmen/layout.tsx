import { auth } from "@/lib/auth";
import { DashboardShell, type NavOgesi } from "@/components/dashboard-shell";

const NAV: NavOgesi[] = [
  { href: "/ogretmen", label: "Öğrencilerim", icon: "Users" },
  { href: "/ogretmen/yeni-kayit", label: "Yeni Kayıt Ekle", icon: "PlusCircle" },
  { href: "/ogretmen/devamsizlik", label: "Devam / Devamsızlık", icon: "CalendarCheck" },
  { href: "/ogretmen/gecmis", label: "Geçmiş Derslerim", icon: "History" },
];

export default async function OgretmenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const kullaniciAdi = session?.user?.adSoyad ?? "Öğretmen";

  return (
    <DashboardShell navOgeleri={NAV} rolEtiketi="Öğretmen" kullaniciAdi={kullaniciAdi}>
      {children}
    </DashboardShell>
  );
}
