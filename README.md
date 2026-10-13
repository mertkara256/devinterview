# DevInterview — Yerel Java Mülakat Sınavı

Tamamen çevrimdışı, Chrome içinde çalışan Java, OOP ve algoritma çalışma uygulamasıdır. Sunucu, hesap, kurulum veya internet bağlantısı gerekmez.

## Açma

1. Bu klasörü kalıcı bir konumda tutun.
2. `index.html` dosyasına çift tıklayın.
3. Gerekirse dosyayı Chrome ile açmayı seçin.

Uygulama `file://` adresinde çalışır; yerel bir sunucu veya terminal komutu gerekmez.

## Veri ve yedekleme

- Cevaplar, oturumlar, notlar ve ilerleme Chrome'un IndexedDB alanına otomatik kaydedilir.
- Kayıtlar bu Chrome profiline ve dosyanın konumuna bağlıdır.
- Klasörü taşımadan veya tarayıcı verilerini temizlemeden önce **Ayarlar → JSON yedeği** seçeneğini kullanın.
- JSON yedeği tüm geçmişi geri yükleyebilir. CSV dosyası analiz içindir ve tam yedek değildir.
- Uygulama hiçbir ağ isteği, telemetri veya üçüncü taraf veri aktarımı yapmaz.

## İçerik

- 135 kaynak soru
- 259 atomik ve otomatik puanlanan kart
- Java: 92 kart
- OOP: 74 kart
- Algoritma: 93 kart
- Tek seçim, çoklu seçim, doğru/yanlış, boşluk doldurma, kod çıktısı, sıralama ve eşleştirme

Kaynak Markdown dosyası değiştirilmemiştir. Kayıtlı SHA-256:

`0f0846a1e36ed9f9a1d528f17e49e08e80b0139cb06e1505b735a440b84af06c`

## Yerel doğrulama

İsteğe bağlı geliştirici kontrolleri için Node.js ve JDK gerekir; uygulamanın kendisini açmak için bunlar gerekmez. Bu klasörde aşağıdaki komutlar ayrı ayrı çalıştırılabilir:

```bash
node qa/validate-static.cjs
node qa/validate-bank.cjs
node qa/validate-engine.cjs
node qa/validate-runtime.cjs
node qa/validate-java.cjs
```

Kontroller; teslimat dosyalarını, klasik yerel script sırasını, ağ/CDN/telemetri ve ES module kullanılmadığını, 259 kart ile 135 kaynak kimliğini, yedi cevap türünün veri biçimini, puanlama davranışını, sıralama kartlarının boş-geçme durumunu, aktif sınavda çözüm rotasının kapalı olduğunu ve kaynak Markdown SHA-256 değerini doğrular. Java kontrolü 91 geçerli kod parçasını `javac --release 8` ile derler, sekiz kasıtlı derleme hatasını beklenen hata olarak sınar ve doğrudan çalıştırılabilen çıktı örneklerini cevap anahtarıyla karşılaştırır. Dört boşluk doldurma kod şablonu, eksik kısmı bilerek içerdiği için derleme grubuna alınmaz.

Kaynak dosya başka bir konumdaysa yalnız doğrulama komutları için yol belirtilebilir:

```bash
SOURCE_MD="/tam/yol/sorular.md" node qa/validate-static.cjs
```

## Modlar

- **Pratik:** İlk yanlışta küçük ipucu, ikinci denemeden sonra çözüm.
- **Sınav:** Doğruluk ve çözüm oturum bitene kadar gizlidir.
- **Kaynak sırası:** Markdown dosyasındaki önerilen çalışma yolu.
- **Karışık test:** Bölüm, konu, zorluk, tür ve geçmiş durumuyla filtrelenir.
- **Akıllı tekrar:** 1, 3, 7, 14 ve 30 günlük aralıklarla zayıf konuları geri getirir.

## Klavye

- `1–9`: Şık seç
- `Enter`: Cevabı kaydet veya sonraki soruya geç
- `←` / `→`: Önceki / sonraki soru
- `F`: Sonra dön işareti
- `V`: Favori
- `H`: Gösterilmiş ipucuna odaklan
- `?`: Yardım paneli

## Not

Bu statik bir kişisel öğrenme aracıdır. Cevap anahtarı yerel JavaScript dosyalarında teknik olarak incelenebilir; gözetimli veya hileye dayanıklı bir sınav sistemi değildir.
