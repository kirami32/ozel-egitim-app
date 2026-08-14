import "server-only";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const GONDEREN = process.env.RESEND_FROM_EMAIL || "Özel Eğitim Takip <onboarding@resend.dev>";

interface EmailGirdisi {
  to: string;
  subject: string;
  html: string;
}

/** E-posta gönderir. Ana işlemi asla bloklamaz — hata olursa sessizce loglanır. */
export async function emailGonder(girdi: EmailGirdisi) {
  if (!resend) {
    console.warn(`RESEND_API_KEY tanımlı değil, e-posta gönderilmedi: "${girdi.subject}"`);
    return;
  }
  try {
    await resend.emails.send({ from: GONDEREN, to: girdi.to, subject: girdi.subject, html: girdi.html });
  } catch (err) {
    console.error("E-posta gönderilemedi:", err);
  }
}

/** Uygulama içi bir yolu, e-postada kullanılabilecek mutlak URL'e çevirir. */
export function uygulamaUrl(yol: string) {
  const taban =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  return `${taban}${yol}`;
}
