import { notFound } from "next/navigation";
import { Building2, Mail, Shield, UserRound } from "lucide-react";
import { oturumGerekli } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { SayfaBasligi } from "@/components/sayfa-basligi";
import { AvatarYukleyici } from "@/components/avatar-yukleyici";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROL_ETIKETI } from "@/lib/navigasyon";
import { AdSoyadFormu, SifreFormu } from "./profil-formlari";
import { profilAvatariKaydet } from "./actions";

export const metadata = { title: "Profilim · Özel Eğitim Takip Sistemi" };

export default async function ProfilSayfasi() {
  const oturum = await oturumGerekli();

  const kullanici = await prisma.user.findUnique({
    where: { id: oturum.id },
    select: {
      id: true,
      adSoyad: true,
      email: true,
      rol: true,
      avatarSurum: true,
      createdAt: true,
      institution: { select: { ad: true } },
    },
  });

  if (!kullanici) notFound();

  const bilgiler = [
    { Icon: Mail, etiket: "E-posta", deger: kullanici.email },
    { Icon: Shield, etiket: "Rol", deger: ROL_ETIKETI[kullanici.rol] },
    {
      Icon: Building2,
      etiket: "Kurum",
      deger: kullanici.institution?.ad ?? "Tüm kurumlar",
    },
  ];

  return (
    <div className="space-y-6">
      <SayfaBasligi
        icon={UserRound}
        renk="primary"
        baslik="Profilim"
        aciklama="Fotoğrafınızı, adınızı ve şifrenizi buradan güncelleyebilirsiniz."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-primary" />
            Profil Fotoğrafı
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AvatarYukleyici
            tur="kullanici"
            id={kullanici.id}
            adSoyad={kullanici.adSoyad}
            avatarSurum={kullanici.avatarSurum}
            kaydet={profilAvatariKaydet}
          />

          <div className="grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
            {bilgiler.map(({ Icon, etiket, deger }) => (
              <div key={etiket} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{etiket}</p>
                  <p className="truncate text-sm font-medium">{deger}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">
              Üyelik: {kullanici.createdAt.toLocaleDateString("tr-TR")}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdSoyadFormu adSoyad={kullanici.adSoyad} />
        <SifreFormu />
      </div>
    </div>
  );
}
