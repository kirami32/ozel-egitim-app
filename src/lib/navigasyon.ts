import type { Role } from "@/generated/prisma/enums";
import type { IkonAdi } from "@/lib/icons";

export interface NavOgesi {
  href: string;
  label: string;
  icon: IkonAdi;
  /** Kenar çubuğunda öğeleri kategorilere ayıran küçük grup etiketi. */
  grup: string;
}

/**
 * Rol bazlı kenar çubuğu menüsü. Hem rol dizinlerinin kendi layout'ları hem de
 * ortak (hesap) route grubu buradan okur — böylece Ayarlar/Profil sayfalarında
 * kullanıcı kendi rolünün menüsünü kaybetmez.
 */
export const ROL_NAV: Record<Role, NavOgesi[]> = {
  SUPER_ADMIN: [
    { href: "/admin", label: "Genel Bakış", icon: "LayoutDashboard", grup: "Genel" },
    { href: "/admin/kurumlar", label: "Kurumlar", icon: "Building2", grup: "Yönetim" },
    { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: "Users", grup: "Yönetim" },
    { href: "/admin/ogrenciler", label: "Öğrenciler", icon: "GraduationCap", grup: "Yönetim" },
    {
      href: "/admin/devamsizlik",
      label: "Devam / Devamsızlık",
      icon: "CalendarCheck",
      grup: "Takip",
    },
    { href: "/admin/program", label: "Ders Programı", icon: "CalendarDays", grup: "Takip" },
    { href: "/admin/hedefler", label: "BEP Hedefleri", icon: "Target", grup: "Takip" },
    { href: "/admin/belgeler", label: "Belgeler", icon: "Paperclip", grup: "Takip" },
    {
      href: "/admin/denetim-kayitlari",
      label: "Denetim Kayıtları",
      icon: "ShieldCheck",
      grup: "Takip",
    },
  ],
  MUDUR: [
    { href: "/mudur", label: "Genel Bakış", icon: "LayoutDashboard", grup: "Genel" },
    { href: "/mudur/ogretmenler", label: "Öğretmenler", icon: "Users", grup: "Yönetim" },
    { href: "/mudur/siniflar", label: "Sınıflar", icon: "School", grup: "Yönetim" },
    { href: "/mudur/ogrenciler", label: "Öğrenciler", icon: "GraduationCap", grup: "Yönetim" },
    {
      href: "/mudur/devamsizlik",
      label: "Devam / Devamsızlık",
      icon: "CalendarCheck",
      grup: "Takip",
    },
    { href: "/mudur/program", label: "Ders Programı", icon: "CalendarDays", grup: "Takip" },
    { href: "/mudur/hedefler", label: "BEP Hedefleri", icon: "Target", grup: "Takip" },
    { href: "/mudur/belgeler", label: "Belgeler", icon: "Paperclip", grup: "Takip" },
  ],
  OGRETMEN: [
    { href: "/ogretmen", label: "Öğrencilerim", icon: "Users", grup: "Genel" },
    { href: "/ogretmen/yeni-kayit", label: "Yeni Kayıt Ekle", icon: "PlusCircle", grup: "Genel" },
    {
      href: "/ogretmen/devamsizlik",
      label: "Devam / Devamsızlık",
      icon: "CalendarCheck",
      grup: "Takip",
    },
    { href: "/ogretmen/program", label: "Ders Programı", icon: "CalendarDays", grup: "Takip" },
    { href: "/ogretmen/gecmis", label: "Geçmiş Derslerim", icon: "History", grup: "Takip" },
  ],
  VELI: [
    { href: "/veli", label: "Özet", icon: "Home", grup: "Genel" },
    { href: "/veli/rapor", label: "Rapor İndir", icon: "FileDown", grup: "Genel" },
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
