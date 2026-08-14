"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOutButton({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  if (iconOnly) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Çıkış Yap"
        title="Çıkış Yap"
        className={className}
        onClick={() => signOut({ callbackUrl: "/giris" })}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={() => signOut({ callbackUrl: "/giris" })}
    >
      <LogOut className="h-4 w-4" />
      Çıkış Yap
    </Button>
  );
}
