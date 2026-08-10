import { RolKabugu } from "@/components/rol-kabugu";

/**
 * Ayarlar ve Profil sayfaları role özel değil; kullanıcı hangi roldeyse onun
 * kenar çubuğuyla açılırlar.
 */
export default async function HesapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RolKabugu>{children}</RolKabugu>;
}
