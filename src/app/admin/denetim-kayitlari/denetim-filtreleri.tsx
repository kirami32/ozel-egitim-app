"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Filter, Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eylemleriKategorizeEt } from "@/lib/denetim";

const ROL_SECENEKLERI = [
  { deger: "SUPER_ADMIN", etiket: "Süper Admin" },
  { deger: "MUDUR", etiket: "Kurum Müdürü" },
  { deger: "OGRETMEN", etiket: "Öğretmen" },
  { deger: "VELI", etiket: "Veli" },
];

export function DenetimFiltreleri() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [arama, setArama] = useState(searchParams.get("q") ?? "");

  const eylemGruplari = eylemleriKategorizeEt();

  const parametreGuncelle = (anahtar: string, deger: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (deger && deger !== "TUMU") params.set(anahtar, deger);
    else params.delete(anahtar);
    startTransition(() => router.push(`?${params.toString()}`));
  };

  const aramaGonder = (e: React.FormEvent) => {
    e.preventDefault();
    parametreGuncelle("q", arama.trim() || null);
  };

  const filtreVarMi =
    searchParams.get("eylem") ||
    searchParams.get("rol") ||
    searchParams.get("q") ||
    searchParams.get("baslangic") ||
    searchParams.get("bitis");

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card p-3">
      <form onSubmit={aramaGonder} className="relative min-w-48 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          placeholder="İsim, e-posta veya IP ara..."
          className="pl-8"
        />
      </form>

      <Select
        value={searchParams.get("eylem") ?? "TUMU"}
        onValueChange={(v) => parametreGuncelle("eylem", v)}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Eylem" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TUMU">Tüm eylemler</SelectItem>
          {Object.entries(eylemGruplari).map(([kategori, ogeler]) => (
            <SelectGroup key={kategori}>
              <SelectLabel>{kategori}</SelectLabel>
              {ogeler.map((oge) => (
                <SelectItem key={oge.deger} value={oge.deger}>
                  {oge.etiket}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("rol") ?? "TUMU"}
        onValueChange={(v) => parametreGuncelle("rol", v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Rol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TUMU">Tüm roller</SelectItem>
          {ROL_SECENEKLERI.map((r) => (
            <SelectItem key={r.deger} value={r.deger}>
              {r.etiket}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={searchParams.get("baslangic") ?? ""}
        onChange={(e) => parametreGuncelle("baslangic", e.target.value || null)}
        className="w-36"
        aria-label="Başlangıç tarihi"
      />
      <span className="text-xs text-muted-foreground">—</span>
      <Input
        type="date"
        value={searchParams.get("bitis") ?? ""}
        onChange={(e) => parametreGuncelle("bitis", e.target.value || null)}
        className="w-36"
        aria-label="Bitiş tarihi"
      />

      {filtreVarMi && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => startTransition(() => router.push("?"))}
        >
          <X className="h-3.5 w-3.5" />
          Temizle
        </Button>
      )}

      {isPending && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}
      {!isPending && !filtreVarMi && (
        <Filter className="h-4 w-4 text-muted-foreground/50" />
      )}
    </div>
  );
}
