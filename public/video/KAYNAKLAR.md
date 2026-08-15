# Giriş sayfası tanıtım videosu

`giris-tanitim.mp4`, üç ayrı [Mixkit](https://mixkit.co) klibinden birleştirilmiş
14,6 saniyelik sessiz bir döngüdür. Mixkit Free License ticari kullanıma izin
verir, atıf zorunlu değildir; yalnızca klipleri stok görüntü olarak yeniden
dağıtmak yasaktır — bir ürün arayüzünde kullanmak serbesttir.

| Sıra | Mixkit klip kimliği | Sahne | Alınan aralık |
| --- | --- | --- | --- |
| 1 | `26230` | Eğitim materyaliyle birebir çalışma | 2,0 – 7,4 sn |
| 2 | `45147` | Boya çalışmasında el yönlendirme | 7,0 – 12,4 sn |
| 3 | `26241` | Bloklarla ince motor beceri çalışması | 3,5 – 8,9 sn |

Klipler bilinçli olarak **tanınabilir yüz içermeyecek** şekilde seçildi; üçünde
de kadrajda yalnızca eller ve materyaller var. Ürün özel eğitim kurumlarına
satıldığı için, tanınabilir kişilerin ticari kullanımı ayrıca model izni
gerektirebiliyor — yüz göstermeyen kareler bu riski ortadan kaldırıyor.
Videoyu değiştirirken aynı ölçütü koruyun.

`giris-tanitim-poster.webp`, videonun 1,2. saniyesinden alınmış poster
karesidir. Panel bileşeni hareket azaltma tercihi açıkken videoyu tam bu
kareye sarıp duraklattığı için ikisinin aynı an olması önemli.

## Yeniden üretmek

Kaynak klipler `https://assets.mixkit.co/videos/<id>/<id>-720.mp4` adresinden
iner. Birleştirme (ffmpeg 6.x):

```sh
ffmpeg -y \
  -ss 2   -t 5.4 -i 26230.mp4 \
  -ss 7   -t 5.4 -i 45147.mp4 \
  -ss 3.5 -t 5.4 -i 26241.mp4 \
  -filter_complex "\
[0:v]crop=720:720:(iw-720)/2:0,scale=860:860,fps=24,setsar=1[v0];\
[1:v]crop=720:720:(iw-720)/2:0,scale=860:860,fps=24,setsar=1[v1];\
[2:v]crop=720:720:(iw-720)/2:0,scale=860:860,fps=24,setsar=1[v2];\
[v0][v1]xfade=transition=fade:duration=0.8:offset=4.6[x1];\
[x1][v2]xfade=transition=fade:duration=0.8:offset=9.2[x2];\
[x2]fade=t=in:st=0:d=0.7,fade=t=out:st=13.9:d=0.7[out]" \
  -map "[out]" -an -c:v libx264 -profile:v high -crf 28 -preset slow \
  -pix_fmt yuv420p -movflags +faststart giris-tanitim.mp4

ffmpeg -y -ss 1.2 -i giris-tanitim.mp4 -frames:v 1 \
  -c:v libwebp -quality 72 giris-tanitim-poster.webp
```

Kare (1:1) oran, panelin geniş ekrandaki en-boy oranına yakın olduğu için
seçildi; 16:9 kaynak `object-cover` ile gerildiğinde görüntü belirgin biçimde
bulanıklaşıyordu. Baştaki ve sondaki karartma, döngü başa sardığında kesmenin
sert görünmemesi için var.
