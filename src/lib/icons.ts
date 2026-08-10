import {
  LayoutDashboard,
  Building2,
  Users,
  School,
  GraduationCap,
  Home,
  FileDown,
  ClipboardList,
  TrendingUp,
  UserPlus,
  History,
  ShieldCheck,
  PlusCircle,
  CalendarCheck,
  CalendarX2,
  type LucideIcon,
} from "lucide-react";

export const IKON_HARITASI = {
  LayoutDashboard,
  Building2,
  Users,
  School,
  GraduationCap,
  Home,
  FileDown,
  ClipboardList,
  TrendingUp,
  UserPlus,
  History,
  ShieldCheck,
  PlusCircle,
  CalendarCheck,
  CalendarX2,
} satisfies Record<string, LucideIcon>;

export type IkonAdi = keyof typeof IKON_HARITASI;
