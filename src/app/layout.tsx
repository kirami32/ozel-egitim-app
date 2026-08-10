import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { TemaSaglayici } from "@/components/tema-saglayici";
import { GORUNUM_SCRIPTI } from "@/lib/gorunum";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Özel Eğitim Takip Sistemi",
  description: "Öğrenci takip, ders raporlama ve gelişim analizi platformu",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: tema ve görünüm sınıfları sunucu HTML'inde yok,
    // istemcide <head> script'i tarafından ekleniyor — beklenen bir fark.
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: GORUNUM_SCRIPTI }} />
      </head>
      <body className="min-h-full flex flex-col">
        <TemaSaglayici>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-center" />
          </TooltipProvider>
        </TemaSaglayici>
      </body>
    </html>
  );
}
