# Giriş sayfası tanıtım videosu

`giris-tanitim.mp4` (ve aynı görüntünün WebM sürümü `giris-tanitim.webm`), üç
ayrı [Pexels](https://www.pexels.com) klibinden birleştirilmiş 13,3 saniyelik
sessiz bir döngüdür. Pexels Lisansı ticari kullanıma izin verir, atıf zorunlu
değildir; yalnızca klipleri stok görüntü olarak yeniden dağıtmak yasaktır — bir
ürün arayüzünde kullanmak serbesttir.

| Sıra | Pexels video kimliği | Sahne | Kaynak çözünürlük | Alınan aralık |
| --- | --- | --- | --- | --- |
| 1 | `7313176` | Yetişkinin eşlik ettiği blok kulesi çalışması | 2160×4096 | 1,5 – 6,5 sn |
| 2 | `7313304` | Bloklarla ince motor beceri çalışması (yakın plan) | 4096×2160 | 4,5 – 9,5 sn |
| 3 | `6965651` | Çocuğun tuvale resim yapması | 2732×1440 | 1,0 – 6,0 sn |

Üç klip de bilinçli olarak **aydınlık, beyaza çalan** sahnelerden seçildi;
sağdaki beşgen desenli açık zeminle aynı ton ailesinde durmaları için. İlk iki
klip aynı çekimden geldiği için (aynı bloklar) geçiş doğal duruyor.

Kadrajlar, **tanınabilir yüz mümkün olduğunca girmeyecek** biçimde kırpıldı
(profil, eller, materyal yakın planı; üçüncü klipte hiç yüz yok). Ürün özel
eğitim kurumlarına satıldığı için tanınabilir kişilerin ticari kullanımı
ayrıca model izni gerektirebiliyor — yüz göstermeyen kareler bu riski azaltıyor.
Videoyu değiştirirken aynı ölçütü koruyun.

`giris-tanitim-poster.webp`, videonun 1,2. saniyesinden alınmış poster
karesidir. Panel bileşeni hareket azaltma tercihi açıkken videoyu hiç
başlatmayıp poster üzerinde beklettiği için ikisinin aynı an olması önemli.

## Yeniden üretmek

Kaynak klipler `https://www.pexels.com/download/video/<id>/` adresinden en
yüksek çözünürlükte iner (302 ile `videos.pexels.com`'a yönlendirir).
Birleştirme (ffmpeg 7.x):

```sh
ffmpeg -y \
  -ss 1.5 -t 5.0 -i 7313176.mp4 \
  -ss 4.5 -t 5.0 -i 7313304.mp4 \
  -ss 1.0 -t 5.0 -i 6965651.mp4 \
  -filter_complex "\
[0:v]crop=2160:2880:0:700,scale=1080:1440,fps=25,setsar=1[v0];\
[1:v]crop=1620:2160:1150:0,scale=1080:1440,fps=25,setsar=1[v1];\
[2:v]crop=1080:1440:1400:0,fps=25,setsar=1[v2];\
[v0][v1]xfade=transition=fade:duration=0.8:offset=4.2[x1];\
[x1][v2]xfade=transition=fade:duration=0.8:offset=8.4[x2];\
[x2]fade=t=in:st=0:d=0.7,fade=t=out:st=12.7:d=0.7[out]" \
  -map "[out]" -an -c:v libx264 -profile:v high -crf 24 -preset slow \
  -pix_fmt yuv420p -movflags +faststart giris-tanitim.mp4

ffmpeg -y -i giris-tanitim.mp4 -c:v libvpx-vp9 -crf 36 -b:v 0 \
  -row-mt 1 -cpu-used 4 -an giris-tanitim.webm

ffmpeg -y -ss 1.2 -i giris-tanitim.mp4 -frames:v 1 \
  -c:v libwebp -quality 80 giris-tanitim-poster.webp
```

3:4 (1080×1440) dikey oran, panelin geniş ekrandaki en-boy oranına yakın olduğu
için seçildi; yatay kaynak `object-cover` ile gerildiğinde görüntünün büyük
bölümü kadraj dışında kalıyordu. Baştaki ve sondaki karartma, döngü başa
sardığında kesmenin sert görünmemesi için var.

WebM (1,4 MB) mp4'ün (2,7 MB) yaklaşık yarısı; `<source>` sırasında önce o
geldiği için destekleyen tarayıcılar küçük olanı indiriyor.
