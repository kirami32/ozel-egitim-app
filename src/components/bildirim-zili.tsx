"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import { goreliZaman } from "@/lib/zaman";
import { IKON_HARITASI } from "@/lib/icons";
import { BILDIRIM_META } from "@/lib/bildirim-meta";
import {
  bildirimOkunduIsaretle,
  tumBildirimleriOkunduIsaretle,
} from "@/lib/actions/bildirimler";
import type { BildirimTuru } from "@/generated/prisma/enums";

interface Bildirim {
  id: string;
  tur: BildirimTuru;
  baslik: string;
  mesaj: string;
  link: string | null;
  okunduMu: boolean;
  createdAt: Date;
}

/** 25 saniyede bir okunmamış sayacını tazeler; başka bir sekmede/işlemde gelen yeni bildirim rozet olarak anında görünür. */
const SAYAC_YENILEME_MS = 25_000;

export function BildirimZili({
  ilkBildirimler,
  ilkSayac,
}: {
  ilkBildirimler: Bildirim[];
  ilkSayac: number;
}) {
  const router = useRouter();
  const [bildirimler, setBildirimler] = useState(ilkBildirimler);
  const [sayac, setSayac] = useState(ilkSayac);
  const [acikMi, setAcikMi] = useState(false);

  useEffect(() => {
    const zamanlayici = setInterval(async () => {
      try {
        const yanit = await fetch("/api/bildirim/sayac");
        if (!yanit.ok) return;
        const { sayac: yeniSayac } = await yanit.json();
        setSayac(yeniSayac);
      } catch {
        // sessiz geç — bir sonraki denemede tekrar dener
      }
    }, SAYAC_YENILEME_MS);
    return () => clearInterval(zamanlayici);
  }, []);

  const acildiginda = (acik: boolean) => {
    setAcikMi(acik);
    if (acik && sayac > 0) {
      setSayac(0);
      setBildirimler((onceki) => onceki.map((b) => ({ ...b, okunduMu: true })));
      tumBildirimleriOkunduIsaretle().then(() => router.refresh());
    }
  };

  const tiklandi = (bildirim: Bildirim) => {
    if (!bildirim.okunduMu) {
      bildirimOkunduIsaretle(bildirim.id);
    }
  };

  return (
    <DropdownMenu open={acikMi} onOpenChange={acildiginda}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative" aria-label="Bildirimler">
          <Bell className="h-4 w-4" />
          <AnimatePresence>
            {sayac > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground"
              >
                {sayac > 9 ? "9+" : sayac}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <p className="text-sm font-semibold">Bildirimler</p>
          <Link
            href="/bildirimler"
            className="text-xs font-medium text-primary hover:underline"
          >
            Tümünü gör
          </Link>
        </div>

        {bildirimler.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={Bell}
              baslik="Bildirim yok"
              aciklama="Yeni bir gelişme olduğunda burada görünecek."
            />
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto py-1">
            {bildirimler.map((bildirim) => {
              const meta = BILDIRIM_META[bildirim.tur];
              const Icon = IKON_HARITASI[meta.ikonAdi];
              const icerik = (
                <div
                  className={cn(
                    "flex gap-2.5 px-3 py-2.5 transition-colors hover:bg-muted/60",
                    !bildirim.okunduMu && "bg-primary/[0.04]"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      meta.renk
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold">{bildirim.baslik}</p>
                      {!bildirim.okunduMu && (
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {bildirim.mesaj}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground/70">
                      {goreliZaman(bildirim.createdAt)}
                    </p>
                  </div>
                </div>
              );

              return bildirim.link ? (
                <Link key={bildirim.id} href={bildirim.link} onClick={() => tiklandi(bildirim)}>
                  {icerik}
                </Link>
              ) : (
                <div key={bildirim.id} onClick={() => tiklandi(bildirim)}>
                  {icerik}
                </div>
              );
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
