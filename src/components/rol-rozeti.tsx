import { Building2, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROL_ETIKETI } from "@/lib/navigasyon";
import type { Role } from "@/generated/prisma/enums";

/** Her role kendi rengi ve ikonu — tablolarda roller bir bakışta ayrılıyor. */
const ROL_STILI: Record<Role, { sinif: string; Icon: typeof Users }> = {
  SUPER_ADMIN: {
    sinif:
      "bg-[oklch(0.68_0.13_300)]/15 text-[oklch(0.45_0.13_300)] dark:text-[oklch(0.82_0.1_300)]",
    Icon: ShieldCheck,
  },
  MUDUR: {
    sinif:
      "bg-[oklch(0.68_0.12_195)]/15 text-[oklch(0.43_0.1_200)] dark:text-[oklch(0.82_0.1_195)]",
    Icon: Building2,
  },
  OGRETMEN: {
    sinif:
      "bg-[oklch(0.78_0.13_55)]/20 text-[oklch(0.47_0.12_45)] dark:text-[oklch(0.85_0.11_55)]",
    Icon: GraduationCap,
  },
  VELI: {
    sinif:
      "bg-[oklch(0.72_0.14_145)]/15 text-[oklch(0.42_0.11_150)] dark:text-[oklch(0.82_0.12_145)]",
    Icon: Users,
  },
};

export function RolRozeti({
  rol,
  className,
}: {
  rol: Role;
  className?: string;
}) {
  const { sinif, Icon } = ROL_STILI[rol];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        sinif,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {ROL_ETIKETI[rol]}
    </span>
  );
}
