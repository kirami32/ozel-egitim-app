"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Filter, Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function OgrenciFiltreleri({
  kurumlar,
}: {
  kurumlar: { id: string; ad: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [arama, setArama] = useState(searchParams.get("q") ?? "");

  const parametreGuncelle = (anahtar: string, deger: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (deger && deger !== "TUMU") params.set(anahtar, deger);
    else params.delete(anahtar);
    params.delete("sayfa");
    startTransition(() => router.push(`?${params.toString()}`));
  };

  const aramaGonder = (e: React.FormEvent) => {
    e.preventDefault();
    parametreGuncelle("q", arama.trim() || null);
  };

  const filtreVarMi = searchParams.get("q") || searchParams.get("kurum");

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card p-3">
      <form onSubmit={aramaGonder} className="relative min-w-48 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={arama}
          onChange={(e) => setArama(e.target.value)}
          placeholder="Öğrenci adı ara..."
          className="pl-8"
        />
      </form>

      <Select
        value={searchParams.get("kurum") ?? "TUMU"}
        onValueChange={(v) => parametreGuncelle("kurum", v)}
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Kurum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="TUMU">Tüm kurumlar</SelectItem>
          {kurumlar.map((k) => (
            <SelectItem key={k.id} value={k.id}>
              {k.ad}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {filtreVarMi && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setArama("");
            startTransition(() => router.push("?"));
          }}
        >
          <X className="h-3.5 w-3.5" />
          Temizle
        </Button>
      )}

      {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      {!isPending && !filtreVarMi && (
        <Filter className="h-4 w-4 text-muted-foreground/50" />
      )}
    </div>
  );
}
