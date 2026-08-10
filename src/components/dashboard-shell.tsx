"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/components/sign-out-button";
import { cn } from "@/lib/utils";
import { IKON_HARITASI, type IkonAdi } from "@/lib/icons";

export type { IkonAdi };

export interface NavOgesi {
  href: string;
  label: string;
  icon: IkonAdi;
}

interface DashboardShellProps {
  navOgeleri: NavOgesi[];
  rolEtiketi: string;
  kullaniciAdi: string;
  children: React.ReactNode;
}

function baslangicHarfleri(adSoyad: string) {
  return adSoyad
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function DashboardShell({
  navOgeleri,
  rolEtiketi,
  kullaniciAdi,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Masaüstü kenar çubuğu */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 md:flex">
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Özel Eğitim</p>
            <p className="text-xs text-muted-foreground">Takip Sistemi</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navOgeleri.map((oge) => {
            const aktif =
              pathname === oge.href || pathname.startsWith(oge.href + "/");
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
        </nav>

        <div className="mt-auto space-y-3 border-t border-sidebar-border pt-4">
          <div className="flex items-center gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                {baslangicHarfleri(kullaniciAdi)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium">{kullaniciAdi}</p>
              <Badge variant="secondary" className="mt-0.5 text-[10px]">
                {rolEtiketi}
              </Badge>
            </div>
          </div>
          <SignOutButton className="w-full justify-start" />
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pb-20 md:pb-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobil alt gezinti */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-sidebar-border bg-sidebar/95 px-2 py-2 backdrop-blur md:hidden">
        {navOgeleri.slice(0, 5).map((oge) => {
          const aktif =
            pathname === oge.href || pathname.startsWith(oge.href + "/");
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
