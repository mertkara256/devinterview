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

Sorular `sorular/` klasöründeki Markdown dosyalarında durur. Her açık uçlu soru, mülakat modunda olduğu gibi sorulur ve otomatik puanlanan küçük kartlara bölünür: tek seçim, çoklu seçim, doğru/yanlış, boşluk doldurma, kod çıktısı, sıralama ve eşleştirme. Güncel soru ve kart sayıları Ayarlar ekranında ve `node build.cjs` çıktısında görünür.

## Soru ekleme ve düzenleme

Soru eklemek veya değiştirmek için yalnız `sorular/` klasöründeki dosyaları düzenleyin; mevcut dosyalar `java.md`, `oop.md`, `algoritma.md` ve `savunma.md`'dir. Klasöre yeni `.md` dosyaları da eklenebilir, derleme hepsini okuyup birleştirir. Uygulama bu dosyaları doğrudan okuyamadığı için değişiklikten sonra şu komutu çalıştırın:

```bash
node build.cjs
```

Komut `assets/bank.js` dosyasını yeniden üretir. Hatalı bir soru varsa dosya adı ve satır numarasıyla bildirir ve bankayı değiştirmez. Uygulamayı açmak için Node.js gerekmez; yalnız soruları derlemek için gerekir.

### Yapı

Her açık uçlu soru `# ` ile başlar, ona ait kartlar altında `## ` ile gelir:

```text
# J46 · Orta · Teori

Açık uçlu soru metni. Birden fazla paragraf ve kod bloğu içerebilir.

## J46-01 · Tek seçim
Konu: Konu adı
Soru: Kartta sorulan soru
Şıklar:
- [x] a: Doğru şık
  Neden: Doğru şıkkın açıklaması (isteğe bağlı)
- [ ] b: Yanlış şık
  Neden: Yanlış şıkkın neden yanlış olduğu (zorunlu)
İpucu: Pratikte ilk yanlıştan sonra gösterilir
Kısa açıklama: Tek cümlelik özet
Açıklama: Ayrıntılı açıklama
Varsayım: Soruyu netleştiren varsayım
Etiketler: etiket1, etiket2
```

- Soru kimliğinin harfi bölümü belirler: `J` Java, `O` OOP, `A` Algoritma, `S` Savunma. Yeni bir bölüm için `build.cjs` içindeki `SECTIONS` ile `assets/engine.js` içindeki `SECTION_PREFIXES` birlikte güncellenir. Başlıktaki zorluk `Kolay`, `Orta` veya `Zorlayıcı` olur; son kısım sorunun türüdür (Teori, Kod okuma, Kod yazma gibi).
- Başlıktan sonraki ilk satır isteğe bağlı olarak `Alan: Gömülü ve işletim sistemleri` gibi bir alan olabilir. Alan, soruyu bölümünün içinde bir gruba koyar; test oluşturucu, mülakat modu ve soru gezgini bu gruplara göre filtreler. Bir bölümde bir soruya alan verilirse o bölümdeki bütün sorulara da verilmelidir; eksik olanı derleme bildirir. Şu an yalnız Savunma bölümünde alan var.
- Soru metninden sonra, ilk karttan önce isteğe bağlı bir `Anahtar noktalar:` listesi gelebilir. Her satırı `- ` ile başlar ve iyi bir cevapta geçmesi gereken bir noktayı söyler. Mülakat modu kendine puan verirken bu listeyi kontrol listesi olarak gösterir; liste yoksa kartların kısa açıklamalarından üretilir. Şu an Savunma sorularında bu liste var.
- Kart kimliği soru kimliğiyle başlar: `J46-01`, `J46-02`. İlerleme kayıtları bu kimliklere bağlıdır; mevcut bir kartın kimliğini değiştirmeyin.
- Her alan tek satırdır. Kod, `Kod:` satırının hemen altında ```` ``` ```` bloğu içinde yazılır.
- Zorunlu alanlar: `Konu`, `Soru`, `İpucu`, `Kısa açıklama`, `Açıklama`. İsteğe bağlı alanlar: `Kod`, `Varsayım` (birden çok kez yazılabilir) ve `Etiketler` (virgülle ayrılır).
- Kartın zorluğu sorunun başlığından gelir. Kart sürümü içerikten otomatik üretilir; kart değişince sürümü de değişir ve yarım kalmış oturumlar kartı başladıkları hâliyle göstermeye devam eder.
- `<!-- ... -->` yorumları yok sayılır.

### Türlere göre cevap

Kart başlığındaki tür `Tek seçim`, `Çoklu seçim`, `Doğru / Yanlış`, `Boşluk doldurma`, `Kod çıktısı`, `Sıralama` veya `Eşleştirme` olur.

**Tek seçim ve çoklu seçim:** Yukarıdaki gibi `Şıklar:` listesi. Tek seçimde tam bir, çoklu seçimde en az bir şık `[x]` ile işaretlenir.

**Doğru / Yanlış:**

```text
Şıklar:
- [ ] Doğru
  Neden: Bu cevabı seçen için açıklama
- [x] Yanlış
  Neden: Bu cevabı seçen için açıklama
```

**Boşluk doldurma ve kod çıktısı:**

```text
Cevap: n(n+1)/2
Kabul: n*(n+1)/2
Büyük/küçük harf duyarlı: evet
```

`Kabul:` alternatif cevaplar için tekrarlanabilir. Çok satırlı bir cevap, `Cevap:` satırının altında ```` ``` ```` bloğu içinde yazılır.

**Sıralama:** Adımlar doğru sırayla yazılır; uygulama onları karıştırarak gösterir.

```text
Sıra:
1. init: İlk adım
2. loop: İkinci adım
3. done: Son adım
```

**Eşleştirme:** Her satır bir sol öğeyi doğru sağ öğesine bağlar. Hiçbir sola uymayan yanıltıcı seçenekler ayrıca yazılır.

```text
Eşleşmeler:
- offer: offer(e) => append: Elemanı sona eklemeyi dener
- poll: poll() => remove: Baştakini çıkarır; boşsa null döndürür
Fazladan seçenekler:
- decoy: Baştakini çıkarır; boşsa exception fırlatır
```

## Yerel doğrulama

İsteğe bağlı geliştirici kontrolleri için Node.js ve JDK gerekir; uygulamanın kendisini açmak için bunlar gerekmez. Bu klasörde aşağıdaki komutlar ayrı ayrı çalıştırılabilir:

```bash
node build.cjs --check
node qa/validate-static.cjs
node qa/validate-bank.cjs
node qa/validate-engine.cjs
node qa/validate-runtime.cjs
node qa/validate-java.cjs
```

Kontroller; `assets/bank.js` dosyasının `sorular/` ile güncel olduğunu, teslimat dosyalarını, klasik yerel script sırasını, ağ/CDN/telemetri ve ES module kullanılmadığını, yedi cevap türünün veri biçimini, puanlama davranışını, cevapların şık biçiminden tahmin edilemediğini, sıralama kartlarının boş-geçme durumunu ve aktif sınavda çözüm rotasının kapalı olduğunu doğrular. Java kontrolü kod içeren kartları `javac --release 8` ile derler, kasıtlı derleme hatalarını beklenen hata olarak sınar ve doğrudan çalıştırılabilen çıktı örneklerini cevap anahtarıyla karşılaştırır. Boşluk doldurma kod şablonları, eksik kısmı bilerek içerdiği için derlenmez. Bilerek derlenmeyen kod içeren yeni bir kart eklerseniz, onu `qa/validate-java.cjs` içindeki beklenen hatalar listesine de ekleyin.

Aynı kontroller GitHub'a yapılan her push'ta ve pull request'te GitHub Actions ile de çalışır (`.github/workflows/qa.yml`). Bir kontrol başarısız olursa GitHub'ın Actions sekmesinde hangi adımın neden düştüğü görünür ve hesap ayarlarına göre e-posta bildirimi gelir.

## Modlar

- **Pratik:** İlk yanlışta küçük ipucu, ikinci denemeden sonra çözüm. Doğru/Yanlış sorularında ikinci deneme anlamsız olduğundan çözüm ilk yanlıştan hemen sonra gösterilir.
- **Sınav:** Doğruluk ve çözüm oturum bitene kadar gizlidir.
- **Kaynak sırası:** Temelden ileri konulara önerilen çalışma yolu.
- **Karışık test:** Bölüm, konu, zorluk, tür ve geçmiş durumuyla filtrelenir.
- **Akıllı tekrar:** 1, 3, 7, 14 ve 30 günlük aralıklarla zayıf konuları geri getirir.
- **Zaten biliyorum:** Soru gezgininde bu şekilde işaretlenen kaynak öğrenildi sayılır, tekrar kuyruğuna girmez ve testlere ancak havuzda başka kaynak kalmadığında seçilir. "Öğrenilen" filtresiyle yine bilerek çalışılabilir.
- **Mülakat:** Kaynak soruları açık uçlu olarak sorar. Cevabı sesli anlatır veya yazarsın; ardından örnek cevap ve kontrol listesiyle karşılaştırıp kendini "Anlatamadım", "Eksik kaldı" veya "Rahat anlattım" olarak puanlarsın. Örnek cevap, o kaynağa ait kartların açıklamalarından oluşturulur. Mülakat puanları kendi tekrar takvimini kullanır; test sonuçlarını ve ustalık hesabını etkilemez.

## Klavye

- `1–9`: Şık seç
- `Enter`: Cevabı kaydet veya sonraki soruya geç
- `←` / `→`: Önceki / sonraki soru
- `F`: Sonra dön işareti
- `V`: Favori
- `H`: Gösterilmiş ipucuna odaklan
- `?`: Yardım paneli
- Mülakat modunda `Enter` örnek cevabı açar (yazarken `Cmd/Ctrl + Enter`), `1–3` kendini puanlar

## Not

Bu statik bir kişisel öğrenme aracıdır. Cevap anahtarı `sorular/` klasöründe ve yerel JavaScript dosyalarında teknik olarak incelenebilir; gözetimli veya hileye dayanıklı bir sınav sistemi değildir.
