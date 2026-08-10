import { RolKabugu } from "@/components/rol-kabugu";

export default async function OgretmenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RolKabugu rol="OGRETMEN">{children}</RolKabugu>;
}
