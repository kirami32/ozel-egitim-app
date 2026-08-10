import { RolKabugu } from "@/components/rol-kabugu";

export default async function MudurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RolKabugu rol="MUDUR">{children}</RolKabugu>;
}
