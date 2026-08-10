import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Role } from "@/generated/prisma/enums";

const ROL_ANA_SAYFA: Record<Role, string> = {
  SUPER_ADMIN: "/admin",
  MUDUR: "/mudur",
  OGRETMEN: "/ogretmen",
  VELI: "/veli",
};

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/giris");
  }

  redirect(ROL_ANA_SAYFA[session.user.rol]);
}
