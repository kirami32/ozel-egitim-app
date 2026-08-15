"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Rows3, Sun, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  HAREKET_ANAHTARI,
  HAREKETSIZ_SINIFI,
  YOGUN_SINIFI,
  YOGUNLUK_ANAHTARI,
  tercihiDegistir,
  tercihleriDinle,
  temaDegistiBildir,
  temaTercihi,
} from "@/lib/gorunum";
import { useTercih } from "@/lib/gorunum-tercih";

const TEMA_SECENEKLERI = [
  { deger: "light", etiket: "Açık", Icon: Sun },
  { deger: "dark", etiket: "Koyu", Icon: Moon },
  { deger: "system", etiket: "Sistem", Icon: Monitor },
] as const;

export function AyarlarClient() {
  const { setTheme } = useTheme();
  const yogun = useTercih(YOGUN_SINIFI);
  const hareketAzalt = useTercih(HAREKETSIZ_SINIFI);
  const seciliTema = useSyncExternalStore(
    tercihleriDinle,
    temaTercihi,
    () => "system"
  );

  const temaSec = (deger: string) => {
    setTheme(deger);
    temaDegistiBildir();
  };

  const yogunlukDegistir = (acik: boolean) =>
    tercihiDegistir(YOGUNLUK_ANAHTARI, YOGUN_SINIFI, "yogun", "rahat", acik);

  const hareketDegistir = (acik: boolean) =>
    tercihiDegistir(HAREKET_ANAHTARI, HAREKETSIZ_SINIFI, "azalt", "normal", acik);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-primary" />
            Görünüm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Uygulamanın renk temasını seçin. &ldquo;Sistem&rdquo;, cihazınızın
            ayarını takip eder.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TEMA_SECENEKLERI.map(({ deger, etiket, Icon }) => {
              const secili = seciliTema === deger;
              return (
                <button
                  key={deger}
                  type="button"
                  onClick={() => temaSec(deger)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm font-medium transition-all",
                    secili
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/50"
                  )}
                  aria-pressed={secili}
                >
                  <Icon className="h-5 w-5" />
                  {etiket}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-primary" />
            Kullanım Tercihleri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Label
                htmlFor="yogun-gorunum"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Rows3 className="h-4 w-4 text-muted-foreground" />
                Yoğun görünüm
              </Label>
              <p className="mt-1 text-sm text-muted-foreground">
                Boşlukları daraltır, ekrana daha fazla satır sığar. Uzun
                listelerle çalışırken kullanışlı.
              </p>
            </div>
            <Switch
              id="yogun-gorunum"
              checked={yogun}
              onCheckedChange={yogunlukDegistir}
            />
          </div>

          <div className="border-t border-border pt-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Label
                  htmlFor="hareket-azalt"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Wand2 className="h-4 w-4 text-muted-foreground" />
                  Hareketi azalt
                </Label>
                <p className="mt-1 text-sm text-muted-foreground">
                  Geçiş ve animasyonları kapatır. Hareketli görüntüden rahatsız
                  olanlar için.
                </p>
              </div>
              <Switch
                id="hareket-azalt"
                checked={hareketAzalt}
                onCheckedChange={hareketDegistir}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
