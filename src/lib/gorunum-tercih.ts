"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { HAREKETSIZ_SINIFI, tercihAcikMi, tercihleriDinle } from "@/lib/gorunum";

/**
 * Bir görünüm tercihinin (yoğun görünüm, hareket azalt) açık olup olmadığını
 * okur. Tercih React'in dışında — <html> sınıfı olarak — yaşadığı için
 * useSyncExternalStore ile izleniyor; sunucu anlık görüntüsü daima "kapalı".
 */
export function useTercih(sinif: string) {
  return useSyncExternalStore(
    tercihleriDinle,
    () => tercihAcikMi(sinif),
    () => false,
  );
}

/**
 * Hareketin azaltılması gerekip gerekmediği: kullanıcının uygulama içi tercihi
 * ya da işletim sistemi düzeyindeki `prefers-reduced-motion` ayarı.
 */
export function useHareketAzalt() {
  const tercih = useTercih(HAREKETSIZ_SINIFI);
  const [sistem, setSistem] = useState(false);

  useEffect(() => {
    const sorgu = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSistem(sorgu.matches);
    const guncelle = () => setSistem(sorgu.matches);
    sorgu.addEventListener("change", guncelle);
    return () => sorgu.removeEventListener("change", guncelle);
  }, []);

  return tercih || sistem;
}
