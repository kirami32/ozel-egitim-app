/** Denetim kaydı eylem türleri için etiket, renk ve kategori bilgisi. */

export type EylemRengi = "default" | "secondary" | "outline" | "destructive";

interface EylemMeta {
  etiket: string;
  renk: EylemRengi;
  kategori: string;
}

export const EYLEM_META: Record<string, EylemMeta> = {
  LOGIN_SUCCESS: { etiket: "Giriş Yapıldı", renk: "default", kategori: "Giriş/Çıkış" },
  LOGIN_FAILED: { etiket: "Başarısız Giriş", renk: "destructive", kategori: "Giriş/Çıkış" },
  LOGIN_RATE_LIMITED: {
    etiket: "Giriş Engellendi (Çok Deneme)",
    renk: "destructive",
    kategori: "Giriş/Çıkış",
  },
  LOGOUT: { etiket: "Çıkış Yapıldı", renk: "outline", kategori: "Giriş/Çıkış" },

  INSTITUTION_CREATE: { etiket: "Kurum Oluşturuldu", renk: "default", kategori: "Kurum" },
  INSTITUTION_ACTIVATE: { etiket: "Kurum Aktifleştirildi", renk: "default", kategori: "Kurum" },
  INSTITUTION_DEACTIVATE: {
    etiket: "Kurum Pasifleştirildi",
    renk: "destructive",
    kategori: "Kurum",
  },

  USER_CREATE: { etiket: "Kullanıcı Oluşturuldu", renk: "default", kategori: "Kullanıcı" },
  PASSWORD_CHANGE: { etiket: "Şifre Değiştirildi", renk: "secondary", kategori: "Kullanıcı" },
  PROFIL_GUNCELLE: { etiket: "Profil Bilgisi Güncellendi", renk: "secondary", kategori: "Kullanıcı" },
  PROFIL_AVATAR_UPDATE: { etiket: "Profil Fotoğrafı Değişti", renk: "outline", kategori: "Kullanıcı" },
  PROFIL_AVATAR_DELETE: { etiket: "Profil Fotoğrafı Kaldırıldı", renk: "outline", kategori: "Kullanıcı" },

  CLASSROOM_CREATE: { etiket: "Sınıf Oluşturuldu", renk: "secondary", kategori: "Sınıf" },

  STUDENT_CREATE: { etiket: "Öğrenci Oluşturuldu", renk: "secondary", kategori: "Öğrenci" },
  STUDENT_VIEW: { etiket: "Öğrenci Profili Görüntülendi", renk: "outline", kategori: "Öğrenci" },
  STUDENT_AVATAR_UPDATE: { etiket: "Öğrenci Fotoğrafı Değişti", renk: "outline", kategori: "Öğrenci" },
  STUDENT_AVATAR_DELETE: { etiket: "Öğrenci Fotoğrafı Kaldırıldı", renk: "outline", kategori: "Öğrenci" },

  SESSION_LOG_CREATE: { etiket: "Ders Kaydı Eklendi", renk: "default", kategori: "Ders/Devam" },
  ATTENDANCE_RECORD: { etiket: "Devam Durumu Girildi", renk: "secondary", kategori: "Ders/Devam" },
  REPORT_DOWNLOAD: { etiket: "PDF Rapor İndirildi", renk: "outline", kategori: "Ders/Devam" },

  HEDEF_CREATE: { etiket: "Hedef Oluşturuldu", renk: "default", kategori: "Hedef (BEP)" },
  HEDEF_DURUM_GUNCELLE: { etiket: "Hedef Durumu Değişti", renk: "secondary", kategori: "Hedef (BEP)" },
  HEDEF_ILERLEME_CREATE: { etiket: "Hedefe İlerleme Eklendi", renk: "secondary", kategori: "Hedef (BEP)" },

  VELI_NOTU_CREATE: { etiket: "Veliye Not Paylaşıldı", renk: "default", kategori: "Veli Notu" },
  VELI_NOTU_DELETE: { etiket: "Veli Notu Silindi", renk: "destructive", kategori: "Veli Notu" },
};

export function eylemEtiketi(eylem: string): string {
  return EYLEM_META[eylem]?.etiket ?? eylem;
}

export function eylemRengi(eylem: string): EylemRengi {
  return EYLEM_META[eylem]?.renk ?? "secondary";
}

/** Filtre açılır menüsünü kategori başlıklarıyla gruplamak için. */
export function eylemleriKategorizeEt(): Record<string, { deger: string; etiket: string }[]> {
  const gruplar: Record<string, { deger: string; etiket: string }[]> = {};
  for (const [deger, meta] of Object.entries(EYLEM_META)) {
    (gruplar[meta.kategori] ??= []).push({ deger, etiket: meta.etiket });
  }
  return gruplar;
}

/** Güvenlik açısından hassas eylemler — sayfada ayrı bir vurgu için. */
export const GUVENLIK_EYLEMLERI = new Set([
  "LOGIN_FAILED",
  "LOGIN_RATE_LIMITED",
  "INSTITUTION_DEACTIVATE",
  "VELI_NOTU_DELETE",
]);
