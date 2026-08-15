import Image from "next/image";
import birebirDers from "../../public/gorseller/birebir-ders.webp";
import renkliBloklar from "../../public/gorseller/renkli-bloklar.webp";
import sanatEtkinligi from "../../public/gorseller/sanat-etkinligi.webp";

const GORSELLER = [
  { src: birebirDers, alt: "Öğretmen ve öğrencisi birebir ders çalışıyor" },
  { src: renkliBloklar, alt: "Renkli ahşap bloklarla çalışan bir çocuğun eli" },
  { src: sanatEtkinligi, alt: "Parmak boyalarıyla resim yapan bir çocuğun eli" },
];

/**
 * Formun üstünde duran, üst üste binmiş üç yuvarlak fotoğraf. Yalnızca dar
 * ekranlarda görünür — geniş ekranda soldaki fotoğraflı hero zaten devrede.
 */
export function GirisMiniGaleri() {
  return (
    <div className="mb-5 flex -space-x-3 lg:hidden">
      {GORSELLER.map(({ src, alt }) => (
        <div
          key={alt}
          className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-background shadow-md"
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="3.5rem"
            className="object-cover"
            placeholder="blur"
          />
        </div>
      ))}
    </div>
  );
}
