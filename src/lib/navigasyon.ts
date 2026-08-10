import type { Role } from "@/generated/prisma/enums";
import type { IkonAdi } from "@/lib/icons";

export interface NavOgesi {
  href: string;
  label: string;
  icon: IkonAdi;
}

/**
 * Rol bazlı kenar çubuğu menüsü. Hem rol dizinlerinin kendi layout'ları hem de
 * ortak (hesap) route grubu buradan okur — böylece Ayarlar/Profil sayfalarında
 * kullanıcı kendi rolünün menüsünü kaybetmez.
 */
export const ROL_NAV: Record<Role, NavOgesi[]> = {
  SUPER_ADMIN: [
    { href: "/admin", label: "Genel Bakış", icon: "LayoutDashboard" },
    { href: "/admin/kurumlar", label: "Kurumlar", icon: "Building2" },
    { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "Users" },
    { href: "/admin/ogrenciler", label: "Öğrenciler", icon: "GraduationCap" },
    {
      href: "/admin/denetim-kayitlari",
      label: "Denetim Kayıtları",
      icon: "ShieldCheck",
    },
  ],
  MUDUR: [
    { href: "/mudur", label: "Genel Bakış", icon: "LayoutDashboard" },
    { href: "/mudur/ogretmenler", label: "Öğretmenler", icon: "Users" },
    { href: "/mudur/siniflar", label: "Sınıflar", icon: "School" },
    { href: "/mudur/ogrenciler", label: "Öğrenciler", icon: "GraduationCap" },
    {
      href: "/mudur/devamsizlik",
      label: "Devam / Devamsızlık",
      icon: "CalendarCheck",
    },
  ],
  OGRETMEN: [
    { href: "/ogretmen", label: "Öğrencilerim", icon: "Users" },
    { href: "/ogretmen/yeni-kayit", label: "Yeni Kayıt Ekle", icon: "PlusCircle" },
    {
      href: "/ogretmen/devamsizlik",
      label: "Devam / Devamsızlık",
      icon: "CalendarCheck",
    },
    { href: "/ogretmen/gecmis", label: "Geçmiş Derslerim", icon: "History" },
  ],
  VELI: [
    { href: "/veli", label: "Özet", icon: "Home" },
    { href: "/veli/rapor", label: "Rapor İndir", icon: "FileDown" },
  ],
};

export const ROL_ETIKETI: Record<Role, string> = {
  SUPER_ADMIN: "Süper Admin",
  MUDUR: "Kurum Müdürü",
  OGRETMEN: "Öğretmen",
  VELI: "Veli",
};

export const ROL_ANA_SAYFA: Record<Role, string> = {
  SUPER_ADMIN: "/admin",
  MUDUR: "/mudur",
  OGRETMEN: "/ogretmen",
  VELI: "/veli",
};
