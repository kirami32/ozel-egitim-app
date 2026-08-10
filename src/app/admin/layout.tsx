import { RolKabugu } from "@/components/rol-kabugu";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RolKabugu rol="SUPER_ADMIN">{children}</RolKabugu>;
}
