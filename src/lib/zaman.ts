/** "2 saat önce" gibi göreli zaman metni üretir; bir haftadan eskiyse tarihi gösterir. */
export function goreliZaman(tarih: Date) {
  const farkDk = Math.round((Date.now() - tarih.getTime()) / 60000);
  if (farkDk < 1) return "az önce";
  if (farkDk < 60) return `${farkDk} dk önce`;
  const farkSaat = Math.round(farkDk / 60);
  if (farkSaat < 24) return `${farkSaat} sa önce`;
  const farkGun = Math.round(farkSaat / 24);
  if (farkGun < 7) return `${farkGun} gün önce`;
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(tarih);
}
