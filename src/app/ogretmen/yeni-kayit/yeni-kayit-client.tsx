"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DersKaydiForm } from "@/components/ders-kaydi-form";
import { Users } from "lucide-react";

interface Ogrenci {
  id: string;
  adSoyad: string;
  sinifAdi: string | null;
}

interface DavranisEtiketi {
  id: string;
  ad: string;
  renkKodu: string;
}

export function YeniKayitClient({
  ogrenciler,
  davranisEtiketleri,
}: {
  ogrenciler: Ogrenci[];
  davranisEtiketleri: DavranisEtiketi[];
}) {
  const [seciliOgrenciId, setSeciliOgrenciId] = useState<string>("");

  return (
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-primary" />
            Öğrenci Seçin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm space-y-2">
            <Label>Öğrenci</Label>
            <Select value={seciliOgrenciId} onValueChange={setSeciliOgrenciId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bir öğrenci seçin" />
              </SelectTrigger>
              <SelectContent>
                {ogrenciler.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.adSoyad} {o.sinifAdi ? `· ${o.sinifAdi}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {seciliOgrenciId && (
        <DersKaydiForm studentId={seciliOgrenciId} davranisEtiketleri={davranisEtiketleri} />
      )}
    </div>
  );
}
