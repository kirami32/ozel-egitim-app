import { RolKabugu } from "@/components/rol-kabugu";

export default async function VeliLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RolKabugu rol="VELI">{children}</RolKabugu>;
}
