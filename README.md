# Shooting game

- Bu proje, sabit şekilde duran bir topun, ekranın üst kısmından oyun alanına giren ve farklı yönlere doğru düz bir şekilde hareket eden rakip topları yok etmeye çalıştığı bir browser oyunudur.

***

- Rakip topların temas etmesi hâlinde "can" puanı azalmaktadır. Toplam 3 "can" hakkı bulunmaktadır.

- Normal mermiler ile yapılan her 20 isabetli atıştan sonra, oyuncuya "torpido" kullanma hakkı verilir. İsabetli olmayan atışlar ise torpido bar'ına katkı sağlamaz. Ayrıca, torpido atışları da (isabetli olsalar bile) torpido bar'ına katkı sağlamazlar.

- Torpido, normal mermilerden farklı olarak, rakip toplara isabet ettiğinde yok olmayan ve bu sayede, isabet ettiği tüm topları yok ederek ilerleyen bir silahtır.

- Normal atışlar, "sol tık" veya "space" tuşu ile yapılır. İkisini de kullanarak daha seri atış yapmak mümkündür.

- "Sol tık" ve "space" tuşu için "basılı tutarak arka arkaya ateş etme" özelliği devre dışı bırakılmıştır.

- Torpido atışları, "sağ tık" ile yapılır.

***

- İsabetli normal mermiler, (lvl * 10) puan kazandırır.

- İsabetli torpido atışları, "lvl up için ulaşılması gereken puan"ın %10'unu kazandırır.

- İlk level up sınırı 200 puandır. 200 puana ulaşan oyuncu "level 2" olurken, 400 puana ulaşan oyuncu "level 3" olur ve 800 puana ulaşan oyuncu da "level 4" olur. Oyundaki seviye sistemi, üstel olarak devam etmektedir.

- Her "level up" sonrasında, rakip topların hızı %20 artmaktadır. (Tüm topların hızları aynı değildir.)

***

- F tuşuna basıldığında, "otomatik ateş" özelliği açılır. Bu özellik, 1 saniyede "level" kadar "normal mermi" fırlatır. Mesela 4 level için "saniyede 4 mermi" fırlatılır.

- "Otomatik ateş" özelliği açık iken, "sol tık" veya "space" ile "normal mermi" gönderilemez. "Sol tık" veya "space" ile normal mermi kullanmak isteyen bir oyuncu, F tuşuna tekrar basarak "otomatik ateş" özelliğini kapatmalıdır.

- "Otomatik ateş" özelliği, torpido kullanımına engel değildir.

***
***
***

# Düzeltilecek veya eklenecek özellikler

- Oyun kaybedildiğinde, tekrar başlatılabilmesi için buton eklenecek.

- Oyuna "Pause" özelliği eklenecek.

- "Can" kürelerinin konumları düzeltilecek.