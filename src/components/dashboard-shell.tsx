"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, GraduationCap, Settings, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/components/sign-out-button";
import { KisiAvatari } from "@/components/kisi-avatari";
import { TemaDegistirici } from "@/components/tema-degistirici";
import { BildirimZili } from "@/components/bildirim-zili";
import { cn } from "@/lib/utils";
import { IKON_HARITASI } from "@/lib/icons";
import type { NavOgesi } from "@/lib/navigasyon";
import type { BildirimTuru } from "@/generated/prisma/enums";

export type { NavOgesi };

interface Bildirim {
  id: string;
  tur: BildirimTuru;
  baslik: string;
  mesaj: string;
  link: string | null;
  okunduMu: boolean;
  createdAt: Date;
}

interface DashboardShellProps {
  navOgeleri: NavOgesi[];
  rolEtiketi: string;
  kullaniciAdi: string;
  kullaniciId: string;
  avatarSurum?: Date | string | null;
  ilkBildirimler: Bildirim[];
  ilkOkunmamisSayac: number;
  children: React.ReactNode;
}

const HESAP_OGELERI = [
  { href: "/profil", label: "Profilim", Icon: UserRound },
  { href: "/bildirimler", label: "Bildirimler", Icon: Bell },
  { href: "/ayarlar", label: "Ayarlar", Icon: Settings },
];

export function DashboardShell({
  navOgeleri,
  rolEtiketi,
  kullaniciAdi,
  kullaniciId,
  avatarSurum,
  ilkBildirimler,
  ilkOkunmamisSayac,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();

  const aktifMi = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Masaüstü kenar çubuğu */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.7_0.13_55)] text-primary-foreground shadow-sm shadow-primary/25">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold">Özel Eğitim</p>
            <p className="truncate text-xs text-muted-foreground">Takip Sistemi</p>
          </div>
          <BildirimZili ilkBildirimler={ilkBildirimler} ilkSayac={ilkOkunmamisSayac} />
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navOgeleri.map((oge) => {
            const aktif = aktifMi(oge.href);
            const Icon = IKON_HARITASI[oge.icon];
            return (
              <Link
                key={oge.href}
                href={oge.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  aktif
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                )}
              >
                {aktif && (
                  <motion.span
                    layoutId="aktif-nav-gostergesi"
                    className="absolute inset-0 rounded-xl ring-1 ring-primary/20"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon className="h-4 w-4 shrink-0" />
                <span className="relative">{oge.label}</span>
              </Link>
            );
          })}

          <div className="my-3 border-t border-sidebar-border" />

          {HESAP_OGELERI.map(({ href, label, Icon }) => {
            const aktif = aktifMi(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  aktif
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 border-t border-sidebar-border pt-4">
          <Link
            href="/profil"
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-sidebar-accent/60"
          >
            <KisiAvatari
              tur="kullanici"
              id={kullaniciId}
              adSoyad={kullaniciAdi}
              avatarSurum={avatarSurum}
            />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium">{kullaniciAdi}</p>
              <Badge variant="secondary" className="mt-0.5 text-[10px]">
                {rolEtiketi}
              </Badge>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <SignOutButton className="flex-1 justify-start" />
            <TemaDegistirici />
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pb-20 md:pb-0">
        {/* Mobil üst çubuk — profil/ayarlar mobilde buradan erişiliyor */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-sidebar-border bg-sidebar/95 px-4 py-2.5 backdrop-blur md:hidden">
          <Link href="/profil" className="flex min-w-0 items-center gap-2">
            <KisiAvatari
              tur="kullanici"
              id={kullaniciId}
              adSoyad={kullaniciAdi}
              avatarSurum={avatarSurum}
              size="sm"
            />
            <span className="truncate text-sm font-medium">{kullaniciAdi}</span>
          </Link>
          <div className="flex items-center gap-1">
            <BildirimZili ilkBildirimler={ilkBildirimler} ilkSayac={ilkOkunmamisSayac} />
            <TemaDegistirici />
            <Link
              href="/ayarlar"
              aria-label="Ayarlar"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobil alt gezinti */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-sidebar-border bg-sidebar/95 px-2 py-2 backdrop-blur md:hidden">
        {navOgeleri.slice(0, 5).map((oge) => {
          const aktif = aktifMi(oge.href);
          const Icon = IKON_HARITASI[oge.icon];
          return (
            <Link
              key={oge.href}
              href={oge.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium",
                aktif ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {oge.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
