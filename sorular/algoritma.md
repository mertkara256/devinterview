<!-- Algoritma soruları. Biçim için README.md içindeki "Soru ekleme ve düzenleme" bölümüne bakın. -->

# A01 · Kolay · Teori

Big O notasyonu neyi ifade eder? En iyi, ortalama ve en kötü durum karmaşıklıkları arasındaki fark nedir?

Anahtar noktalar:
- Big O, girdi büyürken çalışma süresinin ya da belleğin nasıl büyüdüğünü gösteren asimptotik bir üst sınırdır
- Sabit çarpanlar ve küçük terimler atılır: 3n² + 5n, O(n²) olur
- En iyi, ortalama ve en kötü durum aynı algoritmanın farklı girdilerdeki maliyetidir; hangisinden söz edildiği belirtilir
- Örnek: doğrusal aramada en iyi durum hedefin başta olması (Θ(1)), en kötü durum hedefin olmaması (Θ(n))
- Ortalama durum bir girdi dağılımı varsayar; Θ sıkı sınırı, Ω alt sınırı ifade eder

## A01-01 · Tek seçim
Konu: Karmaşıklık analizi
Soru: Big O notasyonu bir algoritma için öncelikle neyi ifade eder?
Şıklar:
- [x] a: Girdi büyürken kaynak kullanımının asimptotik üst sınırını
- [ ] b: Algoritmanın belirli bir makinedeki kesin çalışma süresini
  Neden: Donanım, JVM ve girdi ayrıntıları kesin süreyi değiştirir.
- [ ] c: En iyi durumdaki işlem sayısını
  Neden: En iyi durum ayrıca belirtilir; Big O yalnız ona özgü değildir.
- [ ] d: Programın kaç satır kaynak kod içerdiğini
  Neden: Kod satırı sayısı asimptotik maliyet ölçüsü değildir.
İpucu: Sabit donanım hızından bağımsız, büyüme eğrisini düşünün.
Kısa açıklama: Big O, girdi boyutu büyürken zaman veya alan kullanımının asimptotik üst sınırını anlatır.
Açıklama: Big O sabit çarpanları ve düşük dereceli terimleri göz ardı ederek büyüme hızına odaklanır. Tek başına kesin süreyi veya mutlaka en kötü durumu söylemez; analiz edilen durum ayrıca belirtilir. Sıkı asimptotik sınır için Θ notasyonu kullanılır.
Varsayım: Kavramsal sorudur; null/boş girdi ve sayısal taşma yoktur. n negatif olmayan girdi boyutudur; belirli bir algoritmanın sıkı maliyeti ayrıca Θ ile ifade edilmelidir.
Etiketler: big-o, asimptotik-analiz

## A01-02 · Eşleştirme
Konu: Karmaşıklık analizi
Soru: Analiz türlerini tanımlarıyla eşleştirin.
Eşleşmeler:
- best: En iyi durum => min: Boyutu n olan girdilerde en az maliyet
- average: Ortalama durum => expected: Belirtilen girdi dağılımı altındaki beklenen maliyet
- worst: En kötü durum => max: Boyutu n olan girdilerde en fazla maliyet
Fazladan seçenekler:
- decoy: Girdiden bağımsız, her zaman aynı kalan maliyet
İpucu: Minimum, beklenen ve maksimum maliyet ayrımını kullanın.
Kısa açıklama: En iyi durum minimumu, ortalama durum bir dağılıma göre bekleneni, en kötü durum maksimumu ölçer.
Açıklama: Ortalama durum ifadesi bir olasılık dağılımı belirtilmeden eksiktir. Her üç durum da O, Ω veya Θ ile sınırlandırılabilir; örneğin doğrusal aramanın en iyi durumu Θ(1), en kötü durumu Θ(n)'dir.
Varsayım: Aynı girdi boyutundaki geçerli girdiler karşılaştırılır; null/boş girdi ve taşma bu kavramsal eşleştirmeyi etkilemez. Verilen örnekte sıkı sınırlar Θ ile belirtilir.
Etiketler: best-case, average-case, worst-case

# A02 · Kolay · Teori

`O(1)`, `O(log n)`, `O(n)`, `O(n log n)`, `O(n²)` ve `O(2ⁿ)` karmaşıklıklarını büyüme hızına göre sıralayın.

Anahtar noktalar:
- Sıra: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)
- Örnekler: dizide indeksle erişim O(1), binary search O(log n), doğrusal arama O(n)
- Merge sort O(n log n), iç içe iki döngü O(n²), bütün alt kümeleri denemek O(2ⁿ)
- Logaritmanın tabanı sınıfı değiştirmez; sabitler büyük n'de önemini yitirir
- Küçük n'de sabitler baskın olabilir; asimptotik sıra büyük girdiler için geçerlidir

## A02-01 · Sıralama
Konu: Karmaşıklık analizi
Soru: n büyürken karmaşıklık sınıflarını en yavaş büyüyenden en hızlı büyüyene sıralayın.
Sıra:
1. constant: O(1)
2. log: O(log n)
3. linear: O(n)
4. nlogn: O(n log n)
5. quadratic: O(n²)
6. exponential: O(2ⁿ)
İpucu: Önce sabit ve logaritmik, en sona üstel büyümeyi yerleştirin.
Kısa açıklama: Doğru sıra O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)'dir.
Açıklama: Yeterince büyük n için sabitler ve logaritmalar polinomlardan; polinomlar da 2ⁿ gibi üstel fonksiyonlardan daha yavaş büyür. Logaritmanın tabanı asimptotik sınıfı değiştirmez.
Varsayım: n pozitif tam sayı olarak sonsuza gider; null/boş koleksiyon ve aritmetik taşma yoktur. Bunlar büyüme sınıflarıdır; belirli bir algoritmanın sıkı sınırı ancak ek bilgiyle Θ olarak verilebilir.
Etiketler: big-o, buyume-sirasi

# A03 · Kolay · Kod okuma

`process()` çağrısının `O(1)` olduğunu varsayarak zaman karmaşıklığını belirleyin. Ardışık döngülerin karmaşıklıkları neden çarpılmaz?

```java
for (int i = 0; i < n; i++) {
    process(i);
}

for (int j = 0; j < n; j++) {
    process(j);
}
```

Anahtar noktalar:
- Her döngü n kez döner ve `process` O(1)'dir; her döngü Θ(n) sürer
- Ardışık döngülerin maliyetleri toplanır: n + n = 2n, yani Θ(n)
- Çarpma yalnız iç içe döngülerde uygulanır: iç döngü dış döngünün her turunda baştan çalışır
- Sabit çarpan (2) Big O'da atılır
- Ek bellek kullanılmadığı için alan Θ(1)'dir

## A03-01 · Tek seçim
Konu: Döngü analizi
Soru: process çağrısı sabit süreliyse iki ardışık döngünün sıkı zaman karmaşıklığı nedir?
Kod:
```java
for (int i = 0; i < n; i++) { process(i); }
for (int j = 0; j < n; j++) { process(j); }
```
Şıklar:
- [ ] a: Θ(1)
  Neden: Çağrı sayısı n ile büyür.
- [x] b: Θ(n)
- [ ] c: Θ(n²)
  Neden: Θ(n²) ancak n kez çalışan döngüler iç içe olsaydı oluşurdu.
- [ ] d: Θ(2ⁿ)
  Neden: Kodda üstel dallanma yoktur.
İpucu: Ardışık blokların işlem sayılarını toplayın.
Kısa açıklama: n + n = 2n çağrı yapılır; sabit çarpan atılınca sıkı sınır Θ(n)'dir.
Açıklama: Döngüler iç içe değildir. Bu nedenle maliyetler çarpılmaz, T(n)=cn+cn+O(1) biçiminde toplanır ve Θ(n) elde edilir. Yardımcı alan Θ(1)'dir.
Varsayım: n >= 0, process Θ(1) zaman ve Θ(1) ek alan kullanır; sayaç taşmaz. n=0 boş çalışmadır. Toplam zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: dongu, ardisik-bloklar, theta

## A03-02 · Doğru / Yanlış
Konu: Döngü analizi
Soru: Birbiri ardına çalışan, her biri n kez dönen iki bağımsız döngünün maliyetleri çarpılır ve sonuç Θ(n²) olur.
Şıklar:
- [ ] Doğru
  Neden: Yanlış seçimdir; ardışık döngülerin maliyetleri çarpılmaz, toplanır.
- [x] Yanlış
  Neden: Doğru seçimdir; Θ(n) + Θ(n) toplamı Θ(n) kalır.
İpucu: Aynı anda iç içe mi, yoksa sırayla mı çalışıyorlar?
Kısa açıklama: Yanlış. Ardışık maliyetler toplanır: Θ(n)+Θ(n)=Θ(n).
Açıklama: Çarpma kuralı, bir döngünün her yinelemesinde diğer döngünün tamamı çalışıyorsa uygulanır. Ardışık iki döngüde toplam çağrı 2n'dir; bu da sıkı olarak Θ(n)'dir.
Varsayım: n >= 0 ve her gövde Θ(1)'dir; null girdi ve taşma yoktur. Zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: dongu, toplama-kurali

# A04 · Kolay · Kod okuma

`process()` çağrısının `O(1)` olduğunu varsayarak çağrı sayısını ve zaman karmaşıklığını belirleyin.

```java
for (int i = 0; i < n; i++) {
    for (int j = 0; j <= i; j++) {
        process(i, j);
    }
}
```

Anahtar noktalar:
- `i` için iç döngü `i + 1` kez döner; toplam 1 + 2 + … + n = n(n+1)/2 çağrı yapılır
- Bu üçgensel toplam n²/2 + n/2'dir; sabitler atılınca Θ(n²) olur
- İç döngünün sınırı `n` değil `i` olsa da sonuç yine karesel büyür
- Alan Θ(1)'dir; yalnız döngü değişkenleri kullanılır
- Aynı kalıp her elemanı kendinden öncekilerle karşılaştıran algoritmalarda görülür (ör. insertion sort'un en kötü durumu)

## A04-01 · Boşluk doldurma
Konu: Döngü analizi
Soru: n >= 0 için process çağrılarının tam sayısını n cinsinden yazın.
Kod:
```java
for (int i = 0; i < n; i++) {
    for (int j = 0; j <= i; j++) {
        process(i, j);
    }
}
```
Cevap: n(n+1)/2
Kabul: n*(n+1)/2
Kabul: n * (n + 1) / 2
Kabul: (n^2+n)/2
Kabul: (n²+n)/2
İpucu: İç döngü sırasıyla 1, 2, ..., n kez çalışır.
Kısa açıklama: Çağrı sayısı 1+2+...+n = n(n+1)/2'dir.
Açıklama: i değeri 0 iken 1, n-1 iken n çağrı yapılır. Aritmetik seri toplamı n(n+1)/2 olduğundan zamanın sıkı sınırı Θ(n²), yardımcı alan Θ(1)'dir.
Varsayım: n negatif değildir; process Θ(1)'dir ve çağrı sayısını temsil eden matematiksel ifade taşmaz. n=0 için sonuç 0'dır. Zaman Θ(n²), yardımcı alan Θ(1)'dir.
Etiketler: ic-ice-dongu, aritmetik-seri

## A04-02 · Tek seçim
Konu: Döngü analizi
Soru: Üçgensel iç içe döngünün sıkı zaman karmaşıklığı nedir?
Kod:
```java
for (int i = 0; i < n; i++)
    for (int j = 0; j <= i; j++)
        process(i, j);
```
Şıklar:
- [ ] a: Θ(log n)
  Neden: Arama alanını yarıya indiren bir işlem yoktur.
- [ ] b: Θ(n)
  Neden: Toplam çağrı doğrusal değildir.
- [ ] c: Θ(n log n)
  Neden: Toplam n log n değil, aritmetik seridir.
- [x] d: Θ(n²)
İpucu: Tam çağrı sayısındaki baskın terime bakın.
Kısa açıklama: n(n+1)/2 ifadesinin baskın terimi n²/2 olduğundan zaman Θ(n²)'dir.
Açıklama: İç döngünün sınırı sabit n değil i olsa da toplam yineleme üçgensel sayıdır. Üst ve alt sınırlar sabit katlarla n²'ye bağlı olduğu için yalnız O(n²) değil, sıkı olarak Θ(n²) denir.
Varsayım: n >= 0, process Θ(1), sayaçlar taşmaz; boş n=0 girdisi sıfır çağrı yapar. Zaman Θ(n²), yardımcı alan Θ(1)'dir.
Etiketler: ic-ice-dongu, theta

# A05 · Kolay · Teori

Zaman karmaşıklığı ile alan karmaşıklığı arasındaki fark nedir? Bir diziyi kopyalayan çözümle yerinde değiştiren çözümü karşılaştırın.

Anahtar noktalar:
- Zaman karmaşıklığı yapılan işin, alan karmaşıklığı kullanılan ek belleğin girdiyle nasıl büyüdüğünü ölçer
- Diziyi yeni bir diziye kopyalayan çözüm Θ(n) zaman ve Θ(n) ek alan kullanır; girdi değişmez
- Yerinde (in-place) çözüm Θ(n) zaman ama Θ(1) ek alan kullanır; girdiyi değiştirir
- Seçim bağlama bağlıdır: girdi korunmalıysa kopya, bellek kısıtlıysa yerinde değişiklik
- Yardımcı alan girdinin kendisini saymaz; özyineleme yığını da ek alandır

## A05-01 · Eşleştirme
Konu: Zaman ve alan
Soru: n elemanlı bir diziyi kopyalama ile aynı diziyi yerinde ters çevirme özelliklerini eşleştirin.
Eşleşmeler:
- copy: Yeni diziye kopyalama => copy-cost: Θ(n) zaman, Θ(n) yardımcı alan
- inplace: İki uçtan yerinde ters çevirme => inplace-cost: Θ(n) zaman, Θ(1) yardımcı alan
Fazladan seçenekler:
- decoy: Θ(n²) zaman, Θ(1) yardımcı alan
İpucu: Her iki yöntem de elemanları işler; fark yeni depolamadadır.
Kısa açıklama: Kopyalama yeni n elemanlık alan ister; yerinde ters çevirme yalnız birkaç değişken kullanır.
Açıklama: Zaman karmaşıklığı çalışmanın büyümesini, yardımcı alan karmaşıklığı girdi dışında kullanılan ek belleği ölçer. İki yöntem de n ile orantılı iş yapar; yerinde yöntem girdi dizisini değiştirerek Θ(1) yardımcı alan sağlar.
Varsayım: Dizi null değildir; boş ve tek elemanlı diziler geçerlidir. Eleman kopyalama/swap Θ(1), indisler taşmaz. İki yöntemin sıkı zaman sınırı Θ(n); alanları sırasıyla Θ(n) ve Θ(1)'dir.
Etiketler: alan-karmasikligi, yerinde-algoritma

# A06 · Kolay · Teori

Dizide indeksle erişim neden hızlıdır? Dizinin başına eleman eklemek veya silmek neden daha maliyetlidir?

Anahtar noktalar:
- Dizi elemanları bellekte bitişik ve eşit boyuttadır; adres `başlangıç + i × eleman boyutu` ile doğrudan hesaplanır
- Bu yüzden `arr[i]` erişimi Θ(1)'dir; önceki elemanları dolaşmak gerekmez
- Başa eleman eklemek ya da ilk elemanı silmek diğer bütün elemanları bir konum kaydırmayı gerektirir: Θ(n)
- Java dizilerinin boyutu sabittir; büyütmek için yeni bir dizi oluşturup elemanları kopyalamak gerekir
- Başta sık ekleme ve silme gerekiyorsa `ArrayDeque` gibi bir yapı daha uygundur

## A06-01 · Tek seçim
Konu: Diziler
Soru: Bir int[] dizisinde geçerli arr[i] erişiminin sıkı zaman maliyeti neden Θ(1)'dir?
Şıklar:
- [x] a: Adres doğrudan hesaplanır
- [ ] b: JVM erişimde baştan başlayıp i. elemana kadar ilerler, ama bu adımlar sabit sayıldığı için toplam Θ(1)'dir
  Neden: Baştan dolaşmak i ile büyür ve linked list erişimine özgüdür; dizi erişimi doğrudan adres hesabıdır.
- [ ] c: Dizi erişimden önce sıralanır
  Neden: Erişim sıralama yapmaz.
- [ ] d: Hash tablosunda bucket aranır
  Neden: Dizi indekslemesi hash kullanmaz.
İpucu: Bitişik bellek ve sabit eleman boyutunu düşünün.
Kısa açıklama: Dizi elemanları indekslenebilir düzende tutulduğu için adres doğrudan hesaplanır.
Açıklama: Java sınır kontrolü yapar ancak bu da sabit zamanlıdır. Geçerli bir indeks için önceki elemanları dolaşmak gerekmez; dolayısıyla erişim sıkı olarak Θ(1) zaman ve Θ(1) yardımcı alandır.
Varsayım: arr null değildir ve 0 <= i < arr.length; boş dizide geçerli indeks yoktur. Adres hesabında model düzeyinde taşma yoktur. Zaman Θ(1), yardımcı alan Θ(1)'dir.
Etiketler: dizi, rastgele-erisim

## A06-02 · Çoklu seçim
Konu: Diziler
Soru: Sabit uzunluklu n elemanlı bir dizinin başına eleman eklemek veya ilk elemanı silmek hakkında doğru ifadeleri seçin.
Şıklar:
- [x] a: Kalan elemanların konumları kaydırılmalıdır
- [ ] b: İndeksle erişim artık Θ(n) olur
  Neden: Dizi var olduktan sonra indeks erişimi Θ(1) kalır.
- [x] c: En kötü durumda taşıma maliyeti Θ(n)'dir
- [ ] d: Bitişik yerleşim kaydırma gereksinimini ortadan kaldırır
  Neden: Tam tersine, bitişik ve sıralı konumlar kaydırmayı gerekli kılar.
İpucu: İşlemden sonra eski ikinci elemanın hangi indekste bulunacağını düşünün.
Kısa açıklama: Baştaki değişiklik n ile orantılı sayıda elemanı kaydırabilir; maliyet Θ(n)'dir.
Açıklama: Dizinin bitişik ve indekslenebilir yapısını korumak için elemanlar bir konum taşınır. Bu, indeks erişiminin Θ(1) olmasını değiştirmez; yalnız ekleme/silme işleminin en kötü ve sıkı maliyeti Θ(n)'dir.
Varsayım: Dizi null değildir; ekleme için yeterli kapasite olduğu veya aynı boyutta kaydırma yapıldığı varsayılır. n=0 sınır durumu sözleşmeyle ele alınır, taşma yoktur. Taşıma zamanı Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: dizi, ekleme, silme

# A07 · Kolay · Kod yazma

Bir dizideki en küçük ve en büyük elemanı tek geçişte bulun. Boş dizi davranışını tanımlayın.

Anahtar noktalar:
- Tek geçiş: `min` ve `max` ilk elemanla başlatılır, kalan elemanlar ikisiyle de karşılaştırılır
- Boş dizi için tanımlı bir davranış seçilir: `IllegalArgumentException` fırlatmak ya da boş sonuç (`OptionalInt`) dönmek
- `min`'i `Integer.MAX_VALUE` ile başlatmak boş dizide anlamsız bir sonuç üretir; ilk elemanla başlamak daha güvenlidir
- Zaman Θ(n), ek alan Θ(1)
- İki değeri birlikte döndürmek için küçük bir sonuç nesnesi ya da iki elemanlı bir dizi kullanılır

## A07-01 · Kod çıktısı
Konu: Diziler
Soru: Metot {4, -2, 7, 1} girdisi için hangi metni yazdırır?
Kod:
```java
static void printMinMax(int[] a) {
    if (a == null || a.length == 0) throw new IllegalArgumentException();
    int min = a[0], max = a[0];
    for (int i = 1; i < a.length; i++) {
        if (a[i] < min) min = a[i];
        if (a[i] > max) max = a[i];
    }
    System.out.print(min + "," + max);
}
```
Cevap: -2,7
Kabul: -2, 7
İpucu: Her eleman için hem mevcut minimumu hem maksimumu güncelleyin.
Kısa açıklama: Tek geçiş sonunda minimum -2, maksimum 7'dir.
Açıklama: Başlangıçta her iki değer 4'tür. -2 minimumu, 7 maksimumu değiştirir; 1 ikisini de değiştirmez. n>0 için zaman Θ(n), yardımcı alan Θ(1)'dir.
Varsayım: Metot null veya boş dizide IllegalArgumentException atar; verilen dizi doludur. Yalnız karşılaştırma yapıldığı için aritmetik taşma yoktur. Zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: min-max, tek-gecis, dizi

## A07-02 · Tek seçim
Konu: Diziler
Soru: Tek geçişli min/max metodunun sözleşmesi 'null veya boş dizide IllegalArgumentException' ise doğru karmaşıklık çifti hangisidir?
Şıklar:
- [x] a: Θ(n) zaman, Θ(1) yardımcı alan
- [ ] b: Θ(n log n) zaman, Θ(1) yardımcı alan
  Neden: Sıralama gereksizdir.
- [ ] c: Θ(n) zaman, Θ(n) yardımcı alan
  Neden: Ek dizi kullanılmaz.
- [ ] d: Θ(1) zaman, Θ(n) yardımcı alan
  Neden: Tüm elemanları görmeden genel sonucu belirlemek mümkün değildir.
İpucu: Dizi sıralanmıyor ve yalnız iki sonuç değişkeni tutuluyor.
Kısa açıklama: Her eleman en az bir kez incelenir ve sabit sayıda değişken tutulur.
Açıklama: Minimum ve maksimumu bulmak için genel durumda tüm elemanlar okunmalıdır; bu nedenle alt ve üst sınır birlikte Θ(n)'dir. Girdi dışında kullanılan bellek n ile büyümez, Θ(1)'dir.
Varsayım: arr null veya boşsa istisna sabit zamanda atılır; analiz n>0 geçerli girdiler içindir. Karşılaştırmalar taşmaz. Geçerli girdide zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: min-max, karmasiklik

# A08 · Kolay · Kod yazma

Ek dizi kullanmadan bir `int[]` dizisini ters çevirin.

Örnek çözüm:
```java
static void reverse(int[] arr) {
    int left = 0;
    int right = arr.length - 1;
    while (left < right) {
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
}
```

Anahtar noktalar:
- İki işaretçi: `left` baştan, `right` sondan başlar
- `left < right` iken iki elemanın yeri değiştirilir, `left` artar ve `right` azalır
- Her takas iki elemanı son yerine koyar; toplam n/2 takas yapılır
- Zaman Θ(n), ek alan Θ(1); girdi dizisi yerinde değişir
- Boş ve tek elemanlı dizilerde döngü hiç çalışmaz; ayrı bir kontrol gerekmez

## A08-01 · Sıralama
Konu: Diziler
Soru: {1,2,3,4} dizisini iki uçlu yerinde ters çevirme algoritmasının adımlarını sıralayın.
Sıra:
1. swap-outer: 0 ve 3 indekslerindeki elemanları değiştir
2. move-outer: Sol indeksi 1'e artır, sağ indeksi 2'ye azalt
3. swap-inner: 1 ve 2 indekslerindeki elemanları değiştir
4. move-inner: Sol indeksi 2'ye artır, sağ indeksi 1'e azalt
5. stop: Sol indeks sağ indeksi geçtiği için dur
İpucu: Uçlardan merkeze doğru ilerleyin.
Kısa açıklama: Önce dış çift, sonra iç çift değiştirilir ve indisler kesişince işlem biter.
Açıklama: Her swap iki simetrik elemanı nihai yerine koyar. floor(n/2) swap yapılır; dolayısıyla zaman Θ(n), yalnız indisler ve geçici değer kullanıldığı için yardımcı alan Θ(1)'dir.
Varsayım: Dizi null değildir; boş ve tek elemanlı diziler değişmeden kalır. İndisler ve int değerleri üzerinde aritmetik işlem taşması yoktur. Zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: dizi-ters-cevirme, two-pointer, yerinde

## A08-02 · Çoklu seçim
Konu: Diziler
Soru: İki uçlu, ek dizi kullanmayan ters çevirme için doğru özellikleri seçin.
Şıklar:
- [x] a: Girdi dizisini değiştirir
- [x] b: Yardımcı alanı Θ(1)'dir
- [ ] c: Zamanı Θ(log n)'dir
  Neden: n/2 işlem Θ(n)'dir, Θ(log n) değildir.
- [ ] d: Boş dizi için mutlaka hata verir
  Neden: Uygun sözleşme ve döngüyle boş dizi doğal olarak işlenebilir.
İpucu: 'Yerinde' sözcüğünün yan etkisini ve bellek anlamını düşünün.
Kısa açıklama: Algoritma diziyi yerinde değiştirir, Θ(n) zaman ve Θ(1) yardımcı alan kullanır.
Açıklama: Dizinin yarısı kadar swap yine de n ile doğrusal büyür. Döngü koşulu left < right ise boş dizi için hiç swap yapılmadan güvenle tamamlanabilir.
Varsayım: arr null değildir; boş/tek elemanlı dizi geçerlidir, null için sözleşme ayrı tanımlanır. Swap taşma üretmez. Zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: dizi-ters-cevirme, yan-etki, karmasiklik

# A09 · Kolay · Kod yazma

Linear search ile hedefin ilk indeksini döndüren, bulunamazsa `-1` veren bir metot yazın.

Anahtar noktalar:
- Dizi baştan sona dolaşılır; hedef görüldüğü ilk indekste hemen döndürülür
- Döngü bittiğinde hedef bulunmadıysa `-1` döndürülür
- En iyi durum Θ(1) (hedef başta), en kötü durum Θ(n) (hedef yok ya da sonda)
- Ek alan Θ(1); dizinin sıralı olması gerekmez
- Dizi sıralıysa binary search ile O(log n)'de bulunabilir

## A09-01 · Kod çıktısı
Konu: Doğrusal arama
Soru: find({8,3,5,3}, 3) çağrısının dönüş değeri nedir?
Kod:
```java
static int find(int[] a, int target) {
    for (int i = 0; i < a.length; i++) {
        if (a[i] == target) return i;
    }
    return -1;
}
```
Cevap: 1
İpucu: Metot ilk eşleşmede hemen döner.
Kısa açıklama: 3 değerinin ilk görüldüğü indeks 1'dir.
Açıklama: İndeks 0 eşleşmez, indeks 1 eşleşir ve sonraki 3 incelenmeden 1 döndürülür. Bu özel çağrı sabit sayıda adım sürse de algoritmanın en kötü sıkı zamanı Θ(n)'dir.
Varsayım: Dizi null değildir; boş dizide -1 döner. int eşitliği taşma yapmaz. En iyi zaman Θ(1), en kötü zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: linear-search, ilk-indeks

## A09-02 · Tek seçim
Konu: Doğrusal arama
Soru: Sıralı olduğu garanti edilmeyen n elemanlı dizide, hedef yokken linear search'ün sıkı maliyeti nedir?
Şıklar:
- [ ] a: Θ(1) zaman
  Neden: Yalnız ilk eleman eşleşirse en iyi durum Θ(1)'dir.
- [ ] b: Θ(log n) zaman
  Neden: Binary search için sıralılık gerekir.
- [x] c: Θ(n) zaman
- [ ] d: Θ(n²) zaman
  Neden: İç içe tarama yoktur.
İpucu: Hedefin olmadığını kanıtlamak için kaç eleman görülmelidir?
Kısa açıklama: Hedef yoksa n elemanın tamamı incelenir; zaman Θ(n)'dir.
Açıklama: Erken dönüş yalnız hedef bulunduğunda yardımcı olur. Sırasız dizide yokluğu belirlemek için her konum kontrol edilir. Ek veri yapısı kullanılmadığından yardımcı alan Θ(1)'dir.
Varsayım: arr null değildir; n=0 için -1 sabit zamanda döner ve genel formül Θ(n) ile uyumludur. Karşılaştırma taşmaz. En kötü zaman Θ(n), alan Θ(1)'dir.
Etiketler: linear-search, worst-case

# A10 · Kolay · Hata bulma

Linear search metodundaki sınır hatasını bulun.

```java
static int find(int[] arr, int target) {
    for (int i = 0; i <= arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}
```

Anahtar noktalar:
- Hata: `i <= arr.length` son turda `arr[arr.length]`'e erişir; geçerli son indeks `arr.length - 1`'dir
- Hedef yoksa `-1` satırına ulaşmadan `ArrayIndexOutOfBoundsException` oluşur
- Düzeltme: koşulu `i < arr.length` yapmak
- Hedef dizide varsa hata görünmeyebilir; bu yüzden "bulunamadı" durumu da test edilir
- Sınır hataları için boş dizi, tek eleman ve hedefin son elemanda olduğu durumlar denenir

## A10-01 · Boşluk doldurma
Konu: Doğrusal arama
Soru: Sınır hatasını düzeltmek için döngü koşulunu yazın: for (int i = 0; _____; i++).
Kod:
```java
static int find(int[] arr, int target) {
    for (int i = 0; i <= arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}
```
Cevap: i < arr.length
Kabul: i<arr.length
Kabul: i < arr.length;
Kabul: i<arr.length;
Büyük/küçük harf duyarlı: evet
İpucu: Son geçerli indeks length - 1'dir.
Kısa açıklama: Koşul i < arr.length olmalıdır.
Açıklama: i == arr.length olduğunda arr[i] erişimi sınır dışıdır. Sıkı üst sınır kullanmak tüm geçerli 0..length-1 indekslerini kapsar ve geçersiz indekse ulaşmaz.
Varsayım: arr null değildir; boş dizide döngü çalışmaz ve -1 döner. İndis sayacı pratik dizi sınırlarında taşmaz. En kötü zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: off-by-one, linear-search, hata-bulma

## A10-02 · Kod çıktısı
Konu: Doğrusal arama
Soru: Hatalı metot find(new int[]{4, 7}, 9) çağrısında hangi istisna sınıfı oluşur?
Kod:
```java
static int find(int[] arr, int target) {
    for (int i = 0; i <= arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}
```
Cevap: ArrayIndexOutOfBoundsException
Kabul: java.lang.ArrayIndexOutOfBoundsException
Büyük/küçük harf duyarlı: evet
İpucu: Hedef bulunmazsa i sonunda arr.length değerini alır.
Kısa açıklama: arr[2] erişimi geçersiz olduğu için ArrayIndexOutOfBoundsException oluşur.
Açıklama: İki elemanlı dizinin son geçerli indeksi 1'dir. <= koşulu i=2 yinelemesine izin verir ve if koşulundaki arr[2] daha -1 satırına ulaşmadan istisna üretir.
Varsayım: arr null değildir ve hedef dizide yoktur; boş dizi de ilk erişimde aynı istisnayı üretir. Taşma yoktur. Hata oluşana kadar zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: off-by-one, exception, kod-ciktisi

# A11 · Kolay · Kod yazma

Hazır bir `reverse()` metodu kullanmadan bir String’i ters çevirin.

Anahtar noktalar:
- Metni `char[]`'a çevirip iki işaretçiyle uçlardan ortaya doğru takas etmek
- Alternatif: sondan başa dolaşıp `StringBuilder`'a eklemek; döngüde `String +=` her turda yeni nesne üretir
- Zaman Θ(n), ek alan Θ(n); `String` immutable olduğu için yerinde değiştirilemez
- Java'da `char` bir UTF-16 kod birimidir; emoji gibi BMP dışı karakterler iki `char` tutar ve takas onları bozar
- Güvenli yol: `codePoints()` ile kod noktalarını ters sırayla eklemek

## A11-01 · Kod çıktısı
Konu: String işlemleri
Soru: reverse("Java") çağrısının dönüş değeri nedir?
Kod:
```java
static String reverse(String s) {
    char[] chars = s.toCharArray();
    for (int l = 0, r = chars.length - 1; l < r; l++, r--) {
        char t = chars[l]; chars[l] = chars[r]; chars[r] = t;
    }
    return new String(chars);
}
```
Cevap: avaJ
Büyük/küçük harf duyarlı: evet
İpucu: İlk ve son karakterden merkeze ilerleyin.
Kısa açıklama: Karakter çiftleri yer değiştirdiğinde sonuç avaJ olur.
Açıklama: char dizisine dönüştürme ve çiftleri değiştirme n ile doğrusal çalışır. Java char UTF-16 kod birimidir; bu yöntem BMP dışındaki bazı Unicode karakterlerin vekil çiftlerini bozabilir.
Varsayım: s null değildir; boş ve tek char içeren metin değişmeden döner. Bu karttaki girdi yalnız BMP karakterleridir, uzunluk taşmaz. Zaman Θ(n), yeni char[] ve sonuç nedeniyle yardımcı/çıktı alanı Θ(n)'dir.
Etiketler: string, reverse, two-pointer

## A11-02 · Tek seçim
Konu: String işlemleri
Soru: BMP dışındaki Unicode karakterlerini de bozmadan String ters çevirmek için en güvenli yaklaşım hangisidir?
Şıklar:
- [ ] a: UTF-16 char değerlerini tek tek ters çevirmek; Java'da bir Unicode karakteri tam olarak bir char ile temsil edilir
  Neden: BMP dışındaki karakterler iki char'lık surrogate çiftidir; tek char tersleme çifti bozar.
- [x] b: codePoints() ile Unicode kod noktalarını alıp sıralarını ters çevirmek
- [ ] c: String.hashCode() değerini ters çevirmek
  Neden: Hash kodu metni geri üretmez.
- [ ] d: Metni toLowerCase() ile küçük harfe çevirmek
  Neden: Harf dönüşümü sıralamayı değiştirmez.
İpucu: Bir görünen karakter bazı durumlarda iki char ile temsil edilir.
Kısa açıklama: Kod noktaları üzerinden ilerlemek surrogate çiftlerini parçalamaz.
Açıklama: String.codePoints() int kod noktaları üretir; bunlar ters sırada StringBuilder.appendCodePoint ile eklenebilir. Bu yaklaşım kod noktalarını korur. Birleşik grapheme kümelerini tam kullanıcı algısına göre ters çevirmek ise daha ileri bir segmentasyon problemi olabilir.
Varsayım: s null değildir; boş metin geçerlidir. Ters çevirme birimi Unicode kod noktasıdır, grapheme kümesi değildir; boyut taşmaz. Zaman Θ(n) UTF-16 birimi, yardımcı alan Θ(n)'dir.
Etiketler: unicode, code-point, string

# A12 · Kolay · Kod yazma

Bir String’in palindrome olup olmadığını kontrol edin. Boş ve tek karakterli String davranışını belirtin.

Anahtar noktalar:
- İki işaretçi: baştaki ve sondaki karakterleri karşılaştırıp ortaya doğru ilerlemek
- İlk uyuşmazlıkta `false` dönülür; işaretçiler buluşursa `true`
- Boş String ve tek karakter palindromdur; döngü hiç çalışmaz
- Zaman Θ(n), ek alan Θ(1); metni ters çevirip karşılaştırmak da doğrudur ama Θ(n) ek alan kullanır
- Politika belirtilir: büyük-küçük harf, boşluk ve noktalama yok sayılacak mı?

## A12-01 · Doğru / Yanlış
Konu: Palindrome
Soru: Tam karakter eşitliği kullanan standart tanımda boş String ve tek karakterli String palindrome kabul edilir.
Şıklar:
- [x] Doğru
  Neden: Doğru seçimdir; karşılaştırılacak ters bir çift olmadığından simetri bozulmaz.
- [ ] Yanlış
  Neden: Yanlış seçimdir; palindrome tanımı en az iki karakter şartı koymaz.
İpucu: Karşılaştırılacak ters bir çift var mı?
Kısa açıklama: Doğru. Her ikisinde de simetriyi bozan karakter çifti yoktur.
Açıklama: İki uçlu algoritmada left < right koşulu baştan false olur ve true döner. Bu, boş dizinin ve tek elemanlı dizinin tersine eşit olmasıyla da uyumludur.
Varsayım: s null değildir; karşılaştırma büyük-küçük harfe duyarlı UTF-16 char eşitliğidir. null için sözleşme ayrıca belirlenmelidir; taşma yoktur. Zaman en kötü Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: palindrome, sinir-durumu

## A12-02 · Kod çıktısı
Konu: Palindrome
Soru: isPalindrome("abca") çağrısının çıktısı nedir?
Kod:
```java
static boolean isPalindrome(String s) {
    for (int l = 0, r = s.length() - 1; l < r; l++, r--) {
        if (s.charAt(l) != s.charAt(r)) return false;
    }
    return true;
}
```
Cevap: false
Kabul: False
Kabul: FALSE
İpucu: Dıştaki a çifti eşleşir; sonra içteki çifte bakın.
Kısa açıklama: İçte b ve c farklı olduğu için false döner.
Açıklama: Metot ilk uyuşmazlıkta erken döner. Bu girdi iki çift kontrolünde biter; genel en kötü durumda n/2 karşılaştırma yapılır ve sıkı zaman Θ(n)'dir.
Varsayım: s null değildir; boş/tek karakter true, karşılaştırma büyük-küçük harfe duyarlı UTF-16 char düzeyindedir. Uzunluk taşmaz. En kötü zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: palindrome, two-pointer, kod-ciktisi

# A13 · Kolay · Kod yazma

Küçük İngilizce harflerinden oluşan bir String için `int[26]` frekans tablosu oluşturun. Karakter kümesi genişlerse çözümünüzü nasıl değiştirirsiniz?

Anahtar noktalar:
- `int[26]` tablosunda `c - 'a'` her küçük harfi 0..25 indeksine eşler
- Her karakter bir kez işlenir: zaman Θ(n); alan sabit 26 hücre olduğu için Θ(1)
- Aralık dışı bir karakter (büyük harf, Türkçe karakter, rakam) geçersiz indeks üretir; girdi önceden doğrulanır
- Karakter kümesi genişlerse `Map<Integer, Integer>` (kod noktası → sayı) kullanılır; alan farklı karakter sayısı kadardır
- Yalnız ASCII varsa `int[128]` dizisi yeterlidir

## A13-01 · Kod çıktısı
Konu: Frekans tablosu
Soru: Kod "abaca" için ne yazdırır?
Kod:
```java
int[] freq = new int[26];
for (char c : "abaca".toCharArray()) {
    freq[c - 'a']++;
}
System.out.print(freq[0] + "," + freq[1] + "," + freq[2]);
```
Cevap: 3,1,1
Kabul: 3, 1, 1
İpucu: 0, 1 ve 2 indeksleri sırasıyla a, b ve c'dir.
Kısa açıklama: a üç, b bir ve c bir kez görülür.
Açıklama: c-'a' ifadesi küçük İngilizce harflerini 0..25 aralığına eşler. Tüm karakterler bir kez işlendiği için zaman Θ(n), 26 sabit hücre nedeniyle yardımcı alan Θ(1)'dir.
Varsayım: Metin null değildir ve yalnız 'a'..'z' içerir; boş metinde tüm sayaçlar 0'dır. Her frekans int sınırını aşmayacak uzunluktadır. Zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: frekans, dizi, karakter

## A13-02 · Eşleştirme
Konu: Frekans tablosu
Soru: Karakter kümesi varsayımını uygun frekans yapısıyla eşleştirin.
Eşleşmeler:
- lower: Yalnız 26 küçük İngilizce harfi => array: int[26] ve c - 'a' indeksi
- unicode: Önceden sınırlandırılmamış Unicode kod noktaları => map: Map<Integer, Integer> ve codePoints()
Fazladan seçenekler:
- decoy: Sıralanmış char[] dizisi
İpucu: Sabit ve küçük alfabe doğrudan indekslenebilir; geniş alfabe seyrek olabilir.
Kısa açıklama: Sabit küçük alfabe için dizi, genel Unicode için kod noktası anahtarlı Map uygundur.
Açıklama: int[26] hızlı ve sabit alanlıdır ama aralık dışı karakterde geçersiz indeks üretir. Map yalnız görülen kod noktalarını tutar; beklenen zaman Θ(n), yardımcı alan farklı kod noktası sayısı k için Θ(k)'dir.
Varsayım: Girdi null değildir; boş girdi geçerlidir. Unicode yaklaşımı kod noktalarını sayar, grapheme kümelerini değil; frekans sayaçları taşmaz. Dizi çözümü Θ(n)/Θ(1), Map çözümü beklenen Θ(n)/Θ(k)'dir.
Etiketler: unicode, hashmap, frekans

# A14 · Kolay · Kod yazma

Bir dizide tekrar eden herhangi bir eleman olup olmadığını `Set` kullanarak belirleyin.

Örnek çözüm:
```java
static boolean hasDuplicate(int[] arr) {
    Set<Integer> seen = new HashSet<>();
    for (int value : arr) {
        // add, eleman zaten varsa false döner; ayrıca contains çağırmaya gerek yoktur.
        if (!seen.add(value)) return true;
    }
    return false;
}
```

Anahtar noktalar:
- Dizi dolaşılırken her eleman bir `HashSet`'e eklenir
- `add` eleman zaten varsa `false` döner; ilk `false`'ta tekrar bulunmuştur ve hemen `true` dönülür
- Beklenen zaman Θ(n), ek alan Θ(n)
- Alternatif: diziyi sıralayıp komşuları karşılaştırmak; O(n log n) zaman, az ek alan, ama girdi değişir
- İç içe döngüyle her çifti karşılaştırmak O(n²)'dir

## A14-01 · Doğru / Yanlış
Konu: Set
Soru: Bir HashSet'e sırayla 2, 1, 2 eklenirken add metodu üçüncü çağrıda da true döner; tekrarı ancak size() ile anlamak mümkündür.
Şıklar:
- [ ] Doğru
  Neden: Yanlış seçimdir; HashSet.add yinelenen eşit elemanda false döndürür.
- [x] Yanlış
  Neden: Doğru seçimdir; üçüncü ekleme kümeyi değiştirmez ve add false döner.
İpucu: Set.add, küme değişmediyse ne döndürür?
Kısa açıklama: Yanlış. İkinci 2 zaten bulunduğu için add false döner; tekrar doğrudan bu dönüşten anlaşılır.
Açıklama: Her elemanda if (!seen.add(value)) return true kalıbı kullanılabilir. HashSet'in iyi dağılımlı ortalama işlemleri sabit zamanlı olduğundan beklenen toplam zaman Θ(n)'dir.
Varsayım: Dizi null değildir; boş/tek eleman için sonuç false'tur. Integer hash/eşitliği kullanılır ve sayaç taşması yoktur. Beklenen zaman Θ(n), kötü durum üst sınırı O(n²), yardımcı alan en kötü Θ(n)'dir.
Etiketler: set, duplicate, hashing

## A14-02 · Tek seçim
Konu: Set
Soru: n farklı int içeren dizide HashSet tabanlı tekrar kontrolünün beklenen sıkı zaman ve yardımcı alanı nedir?
Şıklar:
- [ ] a: Θ(1) zaman, Θ(1) alan
  Neden: Set n farklı elemanı saklar.
- [x] b: Θ(n) zaman, Θ(n) alan
- [ ] c: Θ(n log n) zaman, Θ(1) alan
  Neden: Sıralama yapılmaz ve alan sabit değildir.
- [ ] d: Θ(n²) zaman, Θ(n²) alan
  Neden: Normal hash varsayımında kareli maliyet beklenmez.
İpucu: Her eleman bir kez eklenir ve tümü farklıysa Set'te kalır.
Kısa açıklama: Ortalama sabit hash işlemleriyle beklenen zaman Θ(n), saklanan n değerle alan Θ(n)'dir.
Açıklama: Erken tekrar yoksa n ekleme yapılır. Hash dağılımı iyi ve yeniden boyutlandırmanın amortize maliyeti hesaba katıldığında beklenen toplam Θ(n)'dir; tüm değerler saklandığı için yardımcı alan sıkı Θ(n)'dir.
Varsayım: arr null değildir; n=0 geçerlidir. HashSet ortalama/amortize davranışı ve yeterli bellek varsayılır; int değerler taşmaz. Beklenen zaman Θ(n), patolojik çakışmada O(n²), alan Θ(n)'dir.
Etiketler: hashset, karmasiklik, duplicate

# A15 · Kolay · Kod yazma

İki String’in anagram olup olmadığını kontrol edin. Büyük-küçük harf ve boşluk politikasını önceden tanımlayın.

Örnek çözüm:
```java
// Politika: boşluklar yok sayılır, harfler Locale.ROOT ile küçültülür,
// İngilizce harf dışı karakter reddedilir.
static boolean isAnagram(String first, String second) {
    String a = normalize(first);
    String b = normalize(second);
    if (a.length() != b.length()) return false;
    int[] counts = new int[26];
    for (int i = 0; i < a.length(); i++) {
        counts[a.charAt(i) - 'a']++;
        counts[b.charAt(i) - 'a']--;
    }
    for (int count : counts) {
        if (count != 0) return false;
    }
    return true;
}

static String normalize(String text) {
    String result = text.replaceAll("\\s", "").toLowerCase(Locale.ROOT);
    for (int i = 0; i < result.length(); i++) {
        char c = result.charAt(i);
        if (c < 'a' || c > 'z') {
            throw new IllegalArgumentException("Desteklenmeyen karakter: " + c);
        }
    }
    return result;
}
```

Anahtar noktalar:
- Önce politika belirlenir: boşluklar yok sayılır, harfler `Locale.ROOT` ile küçültülür
- Normalize edilmiş uzunluklar farklıysa hemen `false` dönülür
- Tek bir `int[26]` tablosunda ilk metnin harfleri artırılır, ikincinin harfleri azaltılır; sonunda bütün sayaçlar 0 olmalıdır
- Zaman Θ(n + m), ek alan Θ(1); iki metni sıralayıp karşılaştırmak O(n log n)'dir
- Unicode ya da Türkçe karakter için `int[26]` yerine `Map` kullanılır

## A15-01 · Doğru / Yanlış
Konu: Anagram
Soru: Politika: boşlukları yok say ve Locale.ROOT ile küçük harfe dönüştür. Bu politikada "Dormitory" ile "Dirty room" anagramdır.
Şıklar:
- [x] Doğru
  Neden: Doğru seçimdir; belirtilen normalizasyondan sonra karakter çoklukları aynıdır.
- [ ] Yanlış
  Neden: Yanlış seçimdir; boşluk kaldırılıp harfler küçültüldüğünde frekanslar eşittir.
İpucu: Normalize edilmiş iki metindeki harf frekanslarını karşılaştırın.
Kısa açıklama: Doğru. Her ikisi de aynı harfleri aynı sayıda içerir.
Açıklama: Normalize edildiğinde metinler dormitory ve dirtyroom olur. Sıra farklı olsa da karakter çoklukları aynıdır. Açık bir boşluk ve büyük-küçük harf politikası sonuç belirsizliğini kaldırır.
Varsayım: Girdiler null değildir; boş+boş true kabul edilir. Yalnız ASCII İngilizce harfleri vardır, sayaçlar taşmaz. int[26] ile zaman Θ(n+m), yardımcı alan Θ(1)'dir.
Etiketler: anagram, normalizasyon, frekans

## A15-02 · Çoklu seçim
Konu: Anagram
Soru: Yalnız küçük İngilizce harfleri kabul eden int[26] anagram çözümü için doğru ifadeleri seçin.
Şıklar:
- [x] a: Uzunluklar farklıysa hemen false dönülebilir
- [ ] b: İki metin için iki ayrı int[26] tablosu kurmak gerekir
  Neden: Tek tabloda ilk metinde artırıp ikincide azaltmak yeterlidir; ikinci tablo gerekmez.
- [x] c: Sonunda her sayaç sıfır olmalıdır
- [ ] d: Çözüm büyük harf ve Türkçe karakter içeren metinlerde de değişiklik gerekmeden çalışır
  Neden: `c - 'a'` yalnız küçük İngilizce harfler için 0–25 arası indeks üretir; diğer karakterler için Map gibi bir yapı gerekir.
İpucu: Aynı çokluk kümesi toplam uzunluğu ve tüm frekansları eşit kılar.
Kısa açıklama: Uzunluk kontrolü, tek frekans tablosunda artırma/azaltma ve sıfır doğrulaması doğru yaklaşımdır.
Açıklama: İki metin aynı uzunluktaysa ilkini sayıp ikincisini düşmek, tüm hücrelerin sıfır olmasıyla eşit frekansları kanıtlar. Sabit 26 hücre alanı Θ(1)'dir; genel Unicode için farklı yapı gerekir.
Varsayım: İki girdi null değildir, yalnız 'a'..'z' içerir; boş metinler anagramdır. Uzunluk/frekans int sınırını aşmaz. Zaman Θ(n+m), yardımcı alan Θ(1)'dir.
Etiketler: anagram, frekans-tablosu, sinir-durumu

# A16 · Kolay · Kod yazma

Negatif olmayan bir sayının rakamları toplamını ve rakam sayısını hesaplayın. `0` girdisini ele alın.

Anahtar noktalar:
- `n % 10` son basamağı verir, `n / 10` onu atar; `n` 0 olana kadar tekrarlanır
- Her turda basamak toplama eklenir ve sayaç bir artar
- `0` özel durumdur: döngüye girmez ama bir basamağı vardır; toplam 0, basamak sayısı 1
- Negatif girdi sözleşmeyle reddedilir (`IllegalArgumentException`)
- Zaman basamak sayısı kadar, yani Θ(log n); ek alan Θ(1)

## A16-01 · Kod çıktısı
Konu: Sayı algoritmaları
Soru: Kod sırasıyla digitSumAndCount(508) ve digitSumAndCount(0) için ne yazdırır?
Kod:
```java
static String digitSumAndCount(int n) {
    if (n < 0) throw new IllegalArgumentException();
    if (n == 0) return "0:1";
    int sum = 0, count = 0;
    while (n > 0) { sum += n % 10; count++; n /= 10; }
    return sum + ":" + count;
}
System.out.print(digitSumAndCount(508) + "," + digitSumAndCount(0));
```
Cevap: 13:3,0:1
Kabul: 13:3, 0:1
İpucu: 508 üç rakamlıdır; 0 sayısının rakam sayısı özel olarak 1 kabul edilir.
Kısa açıklama: 5+0+8=13 ve üç rakam vardır; 0 için toplam 0, rakam sayısı 1'dir.
Açıklama: Pozitif sayıda her /10 işlemi bir ondalık basamağı kaldırır. 0 döngüye girmediği için sözleşme onu ayrı ele alır. d rakam için sıkı zaman Θ(d), yardımcı alan Θ(1)'dir.
Varsayım: n int aralığında ve negatif değildir; negatifte IllegalArgumentException atılır. sum en fazla 90 olduğundan int taşması yoktur. 0 özel durumu 0 toplam/1 rakamdır. Zaman Θ(d), alan Θ(1)'dir.
Etiketler: rakam-toplami, basamak-sayisi, sayi

# A17 · Kolay · Kod yazma

Faktoriyeli döngüyle hesaplayın. Negatif girdi ve veri tipi taşması için beklenen davranışı belirtin.

Örnek çözüm:
```java
static long factorial(int n) {
    if (n < 0) throw new IllegalArgumentException("n negatif olamaz: " + n);
    long result = 1;
    for (int i = 2; i <= n; i++) {
        // 21! long aralığını aşar; multiplyExact sessizce sarmak yerine
        // ArithmeticException fırlatır.
        result = Math.multiplyExact(result, i);
    }
    return result;
}
```

Anahtar noktalar:
- Döngü `result = 1` ile başlar ve 2'den n'e kadar çarpar; `0! = 1`
- Negatif girdi geçersizdir: `IllegalArgumentException`
- `long` en fazla 20!'i tutar; 21! sığmaz
- Java taşmada hata vermez, değeri sessizce sarar; `Math.multiplyExact` taşmada `ArithmeticException` fırlatır
- Daha büyük n için `BigInteger`; zaman Θ(n), ek alan Θ(1)

## A17-01 · Boşluk doldurma
Konu: Faktoriyel
Soru: long türünde faktoriyeli taşmadan saklanabilen en büyük negatif olmayan n değerini yazın.
Cevap: 20
Kabul: 20L
İpucu: 15! yaklaşık 1,31 × 10^12; long üst sınırı yaklaşık 9,22 × 10^18'dir.
Kısa açıklama: 20! long aralığına sığar, 21! sığmaz; cevap 20'dir.
Açıklama: 20! = 2.432.902.008.176.640.000 değeridir. 21 ile bir sonraki çarpım Long.MAX_VALUE değerini aşar. Bu nedenle sözleşme n>20 için taşmayı açıkça reddetmelidir.
Varsayım: n tam sayı ve n>=0'dır; 0!=1. Sonuç signed 64-bit long ile tutulur. Döngülü hesaplama zamanı Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: faktoriyel, overflow, long

## A17-02 · Çoklu seçim
Konu: Faktoriyel
Soru: Güvenli döngülü long faktoriyel sözleşmesi için doğru davranışları seçin.
Şıklar:
- [x] a: n < 0 ise IllegalArgumentException at
- [x] b: n == 0 ise 1 döndür
- [x] c: Her çarpımda Math.multiplyExact kullanarak taşmayı yakala
- [ ] d: n > 20 iken sarılmış negatif değeri geçerli sonuç say
  Neden: Sarılmış değer matematiksel faktoriyel değildir ve sessiz veri hatasıdır.
İpucu: Matematiksel tanım, geçersiz alan ve Java taşmasını ayrı ele alın.
Kısa açıklama: Negatif girdi reddedilir, 0! bir kabul edilir ve taşma sessizce geçilmez.
Açıklama: Java long taşması varsayılan olarak sessiz sarılır. Math.multiplyExact bunu ArithmeticException'a dönüştürür. Döngü 2..n aralığında ilerlediğinde geçerli n için Θ(n) zaman ve Θ(1) alan kullanır.
Varsayım: n int türündedir; n<0 geçersiz, n=0 geçerli, n>20 long için taşar. Null girdi yoktur. Geçerli girdide zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: faktoriyel, exception, overflow

# A18 · Kolay · Kod okuma

Metodu farklı girdilerle izleyin ve zaman/alan karmaşıklığını belirleyin.

```java
static int fib(int n) {
    int a = 0;
    int b = 1;

    for (int i = 0; i < n; i++) {
        int next = a + b;
        a = b;
        b = next;
    }

    return a;
}
```

Anahtar noktalar:
- Çıktı: `fib(0) = 0`, `fib(1) = 1` ve `fib(6) = 8`
- Döngü her turda `(a, b)` çiftini bir sonraki Fibonacci çiftine kaydırır; n tur sonunda `a = F(n)`
- Zaman Θ(n), ek alan Θ(1); önceki değerler saklanmaz
- Naif özyinelemeli çözüm aynı alt problemleri tekrar hesapladığı için üstel zaman alır
- `int` en fazla F(46)'yı tutar; daha büyük n için `long` ya da `BigInteger` gerekir

## A18-01 · Kod çıktısı
Konu: Fibonacci
Soru: Kod fib(0), fib(1) ve fib(6) değerlerini hangi sırayla yazdırır?
Kod:
```java
static int fib(int n) {
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        int next = a + b; a = b; b = next;
    }
    return a;
}
System.out.print(fib(0) + "," + fib(1) + "," + fib(6));
```
Cevap: 0,1,8
Kabul: 0, 1, 8
İpucu: Döngü başında a, mevcut Fibonacci değerini temsil eder.
Kısa açıklama: F0=0, F1=1 ve F6=8'dir.
Açıklama: Her yinelemede (a,b) çifti (F_i,F_{i+1}) durumundan bir sonraki çifte geçer. n yineleme sonunda a=F_n olur.
Varsayım: Bu çağrılarda 0 <= n <= 6 ve int taşması yoktur; negatif girdi reddedilir. Genel olarak metot F46'yı doğru döndürse de n=46'nın son b güncellemesinde F47 int'i taşır; tüm ara değerlerin taşmasız olması için n<=45 veya long kullanılmalıdır. Null yoktur. Zaman Θ(n), alan Θ(1)'dir.
Etiketler: fibonacci, iterasyon, kod-ciktisi

## A18-02 · Eşleştirme
Konu: Fibonacci
Soru: Döngülü Fibonacci metodunun özelliklerini eşleştirin.
Eşleşmeler:
- time: 0 <= n <= 46 için zaman => theta-n: Θ(n)
- space: Yardımcı alan => theta-1: Θ(1)
- largest: int içinde doğru kalan en büyük n => forty-six: 46
Fazladan seçenekler:
- decoy: 47
İpucu: Döngü n kez çalışır ve yalnız üç sayı tutulur; F47 int sınırını aşar.
Kısa açıklama: Zaman Θ(n), alan Θ(1); int için son güvenli indeks 46'dır.
Açıklama: Metot n yineleme yapar fakat geçmiş diziyi saklamaz. Dönen değer olarak F46=1.836.311.903 sığar; F47=2.971.215.073 Integer.MAX_VALUE değerinden büyüktür. Kaynaktaki döngü n=46'da b için F47'yi de hesapladığından ara taşmayı tamamen önleyen uygulama long kullanmalı veya son gereksiz toplamı yapmamalıdır.
Varsayım: n negatif değildir; int dönüş değeri olarak son doğru Fibonacci indeksi 46'dır, ancak kaynak döngünün n=46 son b güncellemesi ara taşma yapar. Taşmasız sözleşmede long kullanılmalı ya da döngü uyarlanmalıdır; null yoktur. Sıkı zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: fibonacci, karmasiklik, overflow

# A19 · Kolay · Kod yazma

Bir sayının asal olup olmadığını kontrol edin. Kontrollerin neden karekök sınırına kadar yapılabileceğini açıklayın.

Anahtar noktalar:
- 2'den küçük sayılar asal değildir; 2 asaldır
- Bölenler yalnız √n'e kadar denenir: n = a × b ise çarpanlardan biri mutlaka √n'den küçük ya da ona eşittir
- `d <= n / d` koşulu √n sınırını taşma riski olmadan uygular; `d * d <= n` büyük n'de taşabilir
- 2'yi ayrıca kontrol edip yalnız tek bölenleri denemek işi yarıya indirir
- Zaman O(√n), ek alan O(1); çok sayıda sorgu için Eratosthenes eleği kullanılır

## A19-01 · Kod çıktısı
Konu: Asal sayı
Soru: isPrime(1), isPrime(2) ve isPrime(49) hangi çıktıyı verir?
Kod:
```java
static boolean isPrime(int n) {
    if (n < 2) return false;
    for (int d = 2; d <= n / d; d++) {
        if (n % d == 0) return false;
    }
    return true;
}
```
Cevap: false,true,false
Kabul: false, true, false
Kabul: False,True,False
İpucu: 1 asal değildir; 49'un 7 çarpanı vardır.
Kısa açıklama: Sonuçlar sırasıyla false, true ve false'tur.
Açıklama: n<2 doğrudan reddedilir. 2 için döngü çalışmaz. 49'da d=7 iken kalan sıfır olur. n/d karşılaştırması d*d taşması riskini önler.
Varsayım: n herhangi bir int olabilir; negatif, 0 ve 1 asal değildir. d*d yerine n/d kullanıldığı için çarpma taşması yoktur. En kötü zaman Θ(√n) (n>=2), alan Θ(1)'dir.
Etiketler: asal-sayi, sqrt, kod-ciktisi

## A19-02 · Tek seçim
Konu: Asal sayı
Soru: Asallık testinde bölenleri √n sınırına kadar denemek neden yeterlidir?
Şıklar:
- [x] a: Küçük çarpan daima ≤ √n olur
- [ ] b: √n her zaman n'nin tam bölenidir
  Neden: Örneğin √10 tam sayı veya bölen değildir.
- [ ] c: Java yalnız √n kez mod işlemi yapabilir
  Neden: Bu matematiksel bir sınırdır, Java kısıtı değildir.
- [ ] d: √n'den büyük bir bölen varsa onun eşi de √n'den büyük olmak zorundadır
  Neden: a×b=n ve a>√n ise b<√n olur; eş çarpan küçük taraftadır ve zaten denenmiştir.
İpucu: İki çarpanın ikisi de √n'den büyük olsaydı çarpımları ne olurdu?
Kısa açıklama: Bileşik sayının çarpan çiftinden en az biri √n'yi aşamaz.
Açıklama: a>√n ve b>√n aynı anda olsaydı a×b>n olurdu. Bu yüzden küçük çarpan bulunmadıysa daha büyük eşinin de bulunması mümkün değildir. Asal n için tüm adaylar denenir ve sıkı maliyet Θ(√n)'dir.
Varsayım: n int ve n>=2 analiz edilir; negatif/0/1 false'tur. d<=n/d kullanılarak overflow önlenir. En kötü sıkı zaman Θ(√n), yardımcı alan Θ(1)'dir.
Etiketler: asal-sayi, carpan-cifti, karmasiklik

# A20 · Kolay · Kod yazma

`0` ile `n` arasındaki sayılardan birinin eksik olduğu dizide eksik sayıyı bulun. Toplam ve XOR yaklaşımlarını karşılaştırın.

Anahtar noktalar:
- Toplam yaklaşımı: beklenen toplam n(n+1)/2'den dizinin toplamı çıkarılır
- `int` ile n(n+1)/2 büyük n'de taşabilir; hesap `long` ile yapılır
- XOR yaklaşımı: 0..n arası bütün sayılar ve dizi elemanları XOR'lanır; iki kez görülenler sıfırlanır, eksik sayı kalır
- XOR'da taşma riski yoktur; iki yöntem de Θ(n) zaman ve Θ(1) ek alan kullanır
- İkisi de girdinin geçerli olduğunu (tam bir sayı eksik, tekrar yok) varsayar; bunu doğrulamaz

## A20-01 · Kod çıktısı
Konu: Eksik sayı
Soru: XOR tabanlı missing(new int[]{3,0,1}) çağrısı ne döndürür?
Kod:
```java
static int missing(int[] a) {
    int x = a.length;
    for (int i = 0; i < a.length; i++) {
        x ^= i;
        x ^= a[i];
    }
    return x;
}
```
Cevap: 2
İpucu: Aynı sayılar XOR işleminde birbirini götürür.
Kısa açıklama: 0..3 aralığında eksik olan tek değer 2'dir.
Açıklama: İndekslerden 0..n-1, başlangıçtan n ve diziden mevcut değerler XOR'lanır. İki kez görülen her değer sıfırlanır; yalnız eksik değer kalır.
Varsayım: a null değildir; uzunluğu n ve elemanları 0..n aralığında benzersizdir, tam bir değer eksiktir. n int dizi sınırındadır; XOR aritmetik overflow üretmez. Zaman Θ(n), alan Θ(1)'dir.
Etiketler: xor, eksik-sayi, dizi

## A20-02 · Çoklu seçim
Konu: Eksik sayı
Soru: Geçerli 0..n eksik sayı girdisinde toplam formülü ile XOR yaklaşımını karşılaştıran doğru ifadeleri seçin.
Şıklar:
- [x] a: İkisi de Θ(n) zaman ve Θ(1) yardımcı alan kullanabilir
- [x] b: int ile n(n+1)/2 hesabı taşabilir
- [ ] c: XOR yaklaşımı n büyüdükçe toplam formülünden daha önce int taşmasına uğrar
  Neden: XOR toplama yapmaz; sonuç bit genişliğini aşmadığı için taşma oluşmaz.
- [ ] d: İki yöntem de bir sayının tekrarlandığı bozuk girdiyi fark edip hata bildirir
  Neden: Formüller doğru girdi sözleşmesine dayanır; tekrar/çoklu eksikliği ayrı doğrulama olmadan garanti edemez.
İpucu: Geçerli girdi varsayımı ile doğrulama yeteneğini karıştırmayın.
Kısa açıklama: İki yaklaşım da doğrusal/sabit alanlıdır; toplam taşabilir, XOR bu toplama taşmasını önler.
Açıklama: Toplam çözümünde long kullanmak veya işlem sırasını güvenli kurmak gerekir. XOR yalnız bit işlemi yapar. Ancak her iki formül de giriş sözleşmesi bozuksa bunu güvenilir biçimde doğrulayan genel bir denetleyici değildir.
Varsayım: a null değildir; n+1 olası değerden tam biri eksik, diğerleri benzersiz ve aralıktadır; boş dizi n=0 için eksik 0 verir. Toplam int ile taşabilir, long ile önlenir. Her iki yöntem Θ(n) zaman/Θ(1) alandır.
Etiketler: xor, toplam-formulu, overflow

# A21 · Kolay · Teori

“Eleman daha önce görüldü mü?” ve “Her eleman kaç kez görüldü?” problemlerinde `Set` ve `Map` arasında nasıl seçim yaparsınız?

Anahtar noktalar:
- "Daha önce görüldü mü?" için `Set`: yalnız benzersiz elemanları tutar; `add`'in dönüş değeri tekrarı söyler
- "Kaç kez görüldü?" için `Map`: her elemana bir sayaç bağlar
- `HashSet` ve `HashMap`'te işlemler ortalama O(1); toplam O(n) zaman, k farklı eleman için O(k) alan
- Eklenme sırası gerekiyorsa `LinkedHashSet` ya da `LinkedHashMap`, sıralı çıktı için `TreeMap`
- Sayma için kısa yol: `counts.merge(x, 1, Integer::sum)`

## A21-01 · Eşleştirme
Konu: Set ve Map
Soru: İhtiyacı uygun veri yapısıyla eşleştirin.
Eşleşmeler:
- seen: Bir değer daha önce görüldü mü? => set: Set<T>
- count: Her değer kaç kez görüldü? => map: Map<T, Integer>
Fazladan seçenekler:
- decoy: Queue<T>
İpucu: İlk ihtiyaç üyelik, ikincisi anahtar yanında sayaç ister.
Kısa açıklama: Üyelik için Set; frekans için anahtarı sayıya bağlayan Map kullanılır.
Açıklama: Set yalnız benzersiz anahtarları saklar ve contains/add ile görülme bilgisini verir. Map her anahtarı bir frekans değeriyle ilişkilendirir. Hash tabanlı uygulamalarda her ikisinin işlemleri ortalama sabit sürelidir.
Varsayım: Girdi null değildir; null eleman politikası seçilen uygulamaya göre önceden belirlenir, boş girdi boş yapı üretir. Sayaçlar taşmaz. n öğe için beklenen zaman Θ(n), en kötü saklama alanı Θ(k) (k farklı öğe)'dir.
Etiketler: set, map, veri-yapisi-secimi

# A22 · Kolay · Teori

Hash table nasıl çalışır? Hash değeri, bucket, collision ve ortalama/kötü durum arama sürelerini açıklayın.

Anahtar noktalar:
- Hash fonksiyonu anahtarı bir tamsayıya çevirir; bu değer kapasiteye göre bir bucket indeksine dönüştürülür
- Collision: farklı anahtarlar aynı bucket'a düşebilir; zincirleme ya da açık adresleme ile çözülür
- Aramada önce bucket bulunur, sonra bucket içindeki anahtarlar `equals` ile karşılaştırılır
- İyi dağılım ve kontrollü yük faktöründe arama beklenen O(1); bütün anahtarlar tek bucket'a düşerse O(n)
- Yük faktörü eşiği aşılınca tablo büyütülür ve anahtarlar yeniden dağıtılır (rehash)

## A22-01 · Eşleştirme
Konu: Hash table
Soru: Hash table terimlerini tanımlarıyla eşleştirin.
Eşleşmeler:
- hash: Hash değeri => derived: Anahtardan hesaplanan sayısal özet
- bucket: Bucket => slot: Tabloda kayıtların yönlendirildiği bölüm
- collision: Collision => same: Farklı anahtarların aynı bölüme yönlenmesi
Fazladan seçenekler:
- decoy: Eleman sayısının bucket sayısına oranı
İpucu: Hash yönlendirme bilgisidir; bucket hedeftir; collision hedef çakışmasıdır.
Kısa açıklama: Hash anahtardan üretilir, bucket kayıtları barındırır, collision aynı bucketa yönlenmedir.
Açıklama: Hash table önce hash'i hesaplar, kapasiteye göre bucket seçer, sonra eşitliği kontrol ederek doğru anahtarı bulur. Collision normaldir ve zincirleme/ağaçlama/açık adresleme gibi yöntemlerle çözülür.
Varsayım: Anahtar sözleşmesi equals ile uyumlu hashCode sağlar; null anahtar politikası uygulamaya bağlıdır. Boş tabloda arama başarısızdır, kapasite hesabı taşmaz. Ortalama işlem Θ(1), kötü çakışmalı soyut modelde Θ(n)'dir.
Etiketler: hash-table, bucket, collision

## A22-02 · Tek seçim
Konu: Hash table
Soru: İyi dağılan hash değerleri ve kontrollü yük faktörü altında aramanın beklenen; tüm anahtarların tek zincirde toplandığı durumda sıkı maliyeti hangisidir?
Şıklar:
- [x] a: Beklenen Θ(1), zincirli kötü durum Θ(n)
- [ ] b: Beklenen Θ(log n), kötü durum Θ(1)
  Neden: Beklenen hash erişimi logaritmik değil sabittir.
- [ ] c: Beklenen ve kötü durumda Θ(1)
  Neden: Çakışma çözümü kötü durumda ek karşılaştırmalar ister.
- [ ] d: Beklenen ve kötü durumda Θ(n²)
  Neden: Tek arama için kareli tarama gerekmez.
İpucu: İyi dağılım kısa bucket, tam çakışma uzun zincir oluşturur.
Kısa açıklama: Beklenen arama Θ(1), tek zincirli patolojik durumda Θ(n)'dir.
Açıklama: Yük faktörü sabit tutulduğunda beklenen bucket uzunluğu sabittir. Tüm anahtarlar aynı bucketa gider ve zincir doğrusal aranırsa hedefe/yokluğa göre n kayıt incelenebilir. Java 8 HashMap'in bazı büyük bucketları ağaçlaştırması uygulama ayrıntısıdır; kart soyut zincirleme modelini sorar.
Varsayım: n kayıt, uyumlu equals/hashCode ve zincirleme modeli vardır; null anahtar ve boş tablo özel davranışı sonucu değiştirmez. Boyut taşmaz. Beklenen zaman Θ(1), tümü çakışan zincirde sıkı zaman Θ(n), tablo alanı Θ(n)'dir.
Etiketler: hash-table, average-case, worst-case

# A23 · Kolay · Kod okuma

`counts` içeriğini ve karmaşıklığı belirleyin.

```java
Map<String, Integer> counts = new HashMap<>();

for (String word :
        Arrays.asList("java", "oop", "java", "array")) {
    counts.put(word, counts.getOrDefault(word, 0) + 1);
}
```

Anahtar noktalar:
- Sonuç: `java` → 2, `oop` → 1, `array` → 1
- `getOrDefault(word, 0) + 1` ilk görülen kelimeyi 1 ile başlatır, sonrakilerde sayacı artırır
- n kelime ve k farklı kelime için beklenen zaman Θ(n), ek alan Θ(k)
- `HashMap`'in yazdırma sırası garanti edilmez; sıra gerekiyorsa `LinkedHashMap` ya da `TreeMap`
- Daha kısa yazım: `counts.merge(word, 1, Integer::sum)`

## A23-01 · Kod çıktısı
Konu: Frekans Map'i
Soru: Döngüden sonra belirtilen anahtarlar hangi değerleri yazdırır?
Kod:
```java
Map<String, Integer> counts = new HashMap<>();
for (String word : Arrays.asList("java", "oop", "java", "array")) {
    counts.put(word, counts.getOrDefault(word, 0) + 1);
}
System.out.print(counts.get("java") + "," + counts.get("oop") + "," + counts.get("array"));
```
Cevap: 2,1,1
Kabul: 2, 1, 1
İpucu: getOrDefault ilk görülmede 0, sonraki görülmede mevcut sayıyı verir.
Kısa açıklama: java iki; oop ve array birer kez sayılır.
Açıklama: HashMap'in yazdırma sırası garanti edilmediği için kart doğrudan anahtarları sorgular. Her kelimede mevcut frekans bir artırılır.
Varsayım: Liste ve kelimeler null değildir; boş listede Map boş kalır. Frekanslar Integer.MAX_VALUE değerini aşmaz. Beklenen zaman Θ(n), k farklı kelime için alan Θ(k)'dir.
Etiketler: hashmap, getOrDefault, frekans

## A23-02 · Tek seçim
Konu: Frekans Map'i
Soru: n kelime ve k farklı kelime için HashMap frekans döngüsünün beklenen sıkı zaman/alanı nedir?
Şıklar:
- [x] a: Θ(n) zaman, Θ(k) yardımcı alan
- [ ] b: Θ(k) zaman, Θ(1) alan
  Neden: Tekrarlı kelimeler de döngüde işlenir.
- [ ] c: Θ(n²) zaman, Θ(n²) alan
  Neden: Normal hash varsayımında iç içe tarama yoktur.
- [ ] d: Θ(log n) zaman, Θ(k) alan
  Neden: HashMap erişimi beklenen logaritmik değildir.
İpucu: Her girdi kelimesi bir kez işlenir; Map yalnız farklı anahtarları tutar.
Kısa açıklama: Beklenen zaman Θ(n), yardımcı alan Θ(k)'dir.
Açıklama: get ve put işlemleri ortalama sabit zamanlı kabul edilir. Döngü n kez çalışır; frekans Map'inde her farklı kelime için bir kayıt bulunur.
Varsayım: Girdi koleksiyonu null değildir; null kelimeye izin verilip verilmediği sözleşmede sabitlenir, boş koleksiyon geçerlidir. Sayaç taşmaz. Beklenen zaman Θ(n), patolojik zincirde O(n²), alan Θ(k)'dir.
Etiketler: hashmap, karmasiklik, frekans

# A24 · Kolay · Teori

Binary search uygulanabilmesi için girdi hangi koşulu sağlamalıdır? Arama alanının sürekli yarıya düşmesi karmaşıklığı nasıl etkiler?

Anahtar noktalar:
- Binary search için dizi sıralı olmalıdır; sıra olmadan bir yarıyı elemek hatalı sonuç verir
- Her adımda ortadaki eleman hedefle karşılaştırılır ve aranacak aralığın yarısı atılır
- n, k adımda n/2^k'ya iner; aralık 1'e düşene kadar yaklaşık log₂ n adım gerekir: O(log n)
- Ortayı `left + (right - left) / 2` ile hesaplamak `int` taşmasını önler
- Sınırlar dikkatle güncellenir (`left = mid + 1`, `right = mid - 1`); yanlış güncelleme sonsuz döngüye yol açar

## A24-01 · Doğru / Yanlış
Konu: Binary search
Soru: Standart binary search, dizi sıralı olmasa da hedef dizide bulunuyorsa onu bulur; sıralılık aramanın doğruluğu için değil, Θ(log n) adımda bitmesi için gereklidir.
Şıklar:
- [ ] Doğru
  Neden: Yanlış seçimdir; sırasız girdide yarıyı elemek geçerli bir çıkarım değildir.
- [x] Yanlış
  Neden: Doğru seçimdir; binary search'ün doğruluğu monoton sıralılığa dayanır.
İpucu: Orta elemanın hedefe göre yön göstermesi hangi özelliğe dayanır?
Kısa açıklama: Yanlış. Sıralılık olmadan orta eleman arama yönünü güvenle belirleyemez.
Açıklama: Sıralı değilse arr[mid] < target bilgisi sol yarının elenmesini haklı çıkarmaz. Artan veya azalan sıra kullanılabilir, fakat karşılaştırma ve sınır güncellemeleri aynı düzene uygun olmalıdır.
Varsayım: arr null değildir ve artan sıradadır; boş dizi -1 verir, tekrar varsa herhangi bir eşleşme kabul edilir. mid hesabı taşma güvenlidir. Zaman en kötü Θ(log n), alan iteratifte Θ(1)'dir.
Etiketler: binary-search, sirali-dizi, on-kosul

## A24-02 · Tek seçim
Konu: Binary search
Soru: Her adımda kalan arama alanı yaklaşık yarıya indiriliyorsa en kötü sıkı zaman neden Θ(log n)'dir?
Şıklar:
- [x] a: n/2^k yaklaşık 1 olduğunda k yaklaşık log₂n olur
- [ ] b: Adımlar arama alanındaki n elemanın tamamını inceler
  Neden: Her adım yalnız orta elemanı karşılaştırır.
- [ ] c: Binary search sabit boyutlu dizilerle sınırlıdır
  Neden: Binary search değişken boyutlarda çalışır.
- [ ] d: Logaritmik süre recursive koddan kaynaklanır
  Neden: İteratif binary search de aynı logaritmik adım sayısına sahiptir.
İpucu: Kaç kez ikiye böldüğünüzde n'den 1'e ulaşırsınız?
Kısa açıklama: Kalan boyut n/2^k olur; 1'e ulaşmak yaklaşık log₂n adım gerektirir.
Açıklama: Her karşılaştırma aralığın en az yarısını eler. En kötü durumda hedef bulunana veya aralık boşalana kadar floor(log₂n)+1 karşılaştırma yapılır; bu sıkı olarak Θ(log n)'dir.
Varsayım: n>=1 sıralı, null olmayan dizi boyutudur; n=0 sabit zamanda başarısızdır. İndis hesabı taşmaz. En kötü zaman Θ(log n), iteratif yardımcı alan Θ(1)'dir.
Etiketler: binary-search, logaritma, karmasiklik

# A25 · Kolay · Teori

Stack’in LIFO davranışını `push`, `pop` ve `peek` üzerinden açıklayın. İki kullanım örneği verin.

Anahtar noktalar:
- Stack LIFO çalışır: son eklenen eleman ilk çıkar
- `push` tepeye ekler, `pop` tepedekini çıkarıp döndürür, `peek` çıkarmadan gösterir
- Java'da `Stack` sınıfı yerine `ArrayDeque` kullanılır; işlemler O(1)'dir
- Boş stack'te `pop` exception fırlatır; önce `isEmpty()` kontrol edilir
- Kullanım örnekleri: dengeli parantez kontrolü, geri al (undo) geçmişi, metot çağrı yığını

## A25-01 · Kod çıktısı
Konu: Stack
Soru: Deque stack olarak kullanıldığında kod ne yazdırır?
Kod:
```java
Deque<Integer> stack = new ArrayDeque<>();
stack.push(10);
stack.push(20);
int removed = stack.pop();
int top = stack.peek();
System.out.print(removed + "," + top);
```
Cevap: 20,10
Kabul: 20, 10
İpucu: Son eklenen 20 önce çıkar.
Kısa açıklama: LIFO nedeniyle pop 20'yi çıkarır; tepede 10 kalır.
Açıklama: push elemanı tepeye koyar, pop tepedekini çıkarıp döndürür, peek çıkarmadan gösterir. ArrayDeque üzerinde bu uç işlemleri amortize/sıkı pratikte sabit zamanlıdır.
Varsayım: Stack null değildir ve pop öncesi boş değildir; ArrayDeque null eleman kabul etmez. Boyut taşmaz. Her işlem amortize Θ(1), toplam verilen dizi Θ(1), saklama alanı eleman sayısı için Θ(n)'dir.
Etiketler: stack, lifo, deque

## A25-02 · Çoklu seçim
Konu: Stack
Soru: LIFO stack için doğal kullanım örneklerini seçin.
Şıklar:
- [x] a: Dengeli parantez kontrolü
- [x] b: Geri al (undo) geçmişi
- [ ] c: BFS'de katman sırasını koruma
  Neden: BFS'nin keşif sırası için doğal yapı FIFO queue'dur.
- [x] d: Recursive çağrı çerçeveleri
İpucu: En son açılan/eklenen işin önce kapanması gereken durumları arayın.
Kısa açıklama: Parantez, undo ve çağrı çerçeveleri LIFO düzeninden yararlanır.
Açıklama: En son açılan parantez önce kapanır; en son işlem önce geri alınır; en son fonksiyon çağrısı önce döner. Standart BFS ise FIFO queue kullanır.
Varsayım: Kavramsal sorudur; boş stackte pop/peek davranışı API sözleşmesine göre ele alınır, null ve taşma yoktur. Her temel stack işlemi uygun uygulamada amortize Θ(1), n öğe alanı Θ(n)'dir.
Etiketler: stack, kullanim-alani, lifo

# A26 · Kolay · Teori

Queue’nun FIFO davranışını açıklayın. Stack’ten farkını ve iki kullanım örneğini belirtin.

Anahtar noktalar:
- Queue FIFO çalışır: ilk eklenen eleman ilk çıkar
- `offer` sona ekler, `poll` baştakini çıkarır, `peek` baştakini çıkarmadan gösterir
- Stack'te ekleme ve çıkarma aynı uçtan, queue'da farklı uçlardan yapılır
- Java'da `ArrayDeque` ya da `LinkedList` kullanılır; boş queue'da `poll` ve `peek` null döner
- Kullanım örnekleri: görev ya da yazıcı kuyruğu, BFS (genişlik öncelikli arama)

## A26-01 · Kod çıktısı
Konu: Queue
Soru: FIFO queue işlemlerinden sonra çıktı nedir?
Kod:
```java
Queue<String> q = new ArrayDeque<>();
q.offer("A");
q.offer("B");
String removed = q.poll();
q.offer("C");
System.out.print(removed + "," + q.peek());
```
Cevap: A,B
Kabul: A, B
Büyük/küçük harf duyarlı: evet
İpucu: poll en uzun süredir bekleyen elemanı çıkarır; peek yenisini çıkarmaz.
Kısa açıklama: A çıkarılır ve sıranın başında B kalır.
Açıklama: Offer sırasıyla A ve B'yi sona ekler. Poll A'yı çıkarır, C sona gelir ve peek B'yi gösterir. Kalan sıra B,C'dir.
Varsayım: Queue null değildir; ArrayDeque null kabul etmez. poll/peek boşta null döner fakat burada kuyruk doludur; boyut taşmaz. Her işlem amortize Θ(1), n eleman için alan Θ(n)'dir.
Etiketler: queue, fifo, arraydeque

## A26-02 · Eşleştirme
Konu: Queue
Soru: Davranış veya kullanım örneğini uygun yapıyla eşleştirin.
Eşleşmeler:
- stack: Stack => lifo: LIFO; undo veya çağrı yığını
- queue: Queue => fifo: FIFO; görev kuyruğu veya BFS
Fazladan seçenekler:
- decoy: Öncelik sırası; en küçük eleman önce çıkar
İpucu: Stack son ekleneni, queue ilk ekleneni önce işler.
Kısa açıklama: Stack LIFO, queue FIFO davranır.
Açıklama: İki yapı da uç işlemlerini verimli sağlayabilir; ayırıcı özellik çıkarma sırasıdır. Stack'te push/pop aynı uçtan, queue'da offer sonda ve poll başta çalışır.
Varsayım: Yapılar null değildir; boş yapı işlemlerinin sonucu kullanılan API ile tanımlanır, kapasite taşmaz. Uygun Deque uygulamasında temel işlemler amortize Θ(1), n öğe alanı Θ(n)'dir.
Etiketler: queue, stack, fifo, lifo

# A27 · Kolay · Teori

Tek yönlü linked list düğümü nasıl modellenir? Linked list ile diziyi erişim, başa ekleme ve bellek kullanımı açısından karşılaştırın.

Anahtar noktalar:
- Düğüm bir değer ve sonraki düğüme bir referans tutar: `class Node { int value; Node next; }`
- Dizi `arr[i]`'ye Θ(1)'de erişir; linked list'te i. düğüm için baştan i adım gidilir (Θ(n))
- Başa ekleme linked list'te Θ(1)'dir (yeni düğüm `head` olur); dizide bütün elemanları kaydırmak gerekir (Θ(n))
- Linked list bitişik bellek istemez ama her düğüm ek bir referans taşır; cache locality zayıftır
- Son düğümün `next` alanı null'dır; `head` null ise liste boştur

## A27-01 · Eşleştirme
Konu: Linked list
Soru: n elemanlı dizi ile tek yönlü linked list özelliklerini eşleştirin.
Eşleşmeler:
- array-access: Dizide i indeksine erişim => constant: Θ(1)
- list-access: Linked listte i. düğüme erişim => linear: Θ(n) en kötü
- list-head: Linked list başına ekleme => head-constant: Yeni head bağlantısıyla Θ(1)
- memory: Linked list düğümünün ek maliyeti => pointer: Her düğümde next referansı ve nesne yükü
Fazladan seçenekler:
- decoy: Θ(log n)
İpucu: Dizi adres hesaplar; linked list bağlantıları izler.
Kısa açıklama: Dizi rastgele erişimde sabit; liste erişimde doğrusal, başa eklemede sabittir ve bağlantı belleği taşır.
Açıklama: Node tipik olarak value ve next alanlarıyla modellenir. Linked list bitişik bellek istemez ve head biliniyorsa başa ekleme Θ(1)'dir; ancak i. düğüm için baştan i bağlantı izlenir.
Varsayım: Yapılar null referans değil; boş listede head=null ve geçerli indeks yoktur. İndis/boyut taşmaz. Dizi erişimi Θ(1), liste erişimi en kötü Θ(n), başa ekleme Θ(1), toplam bellek Θ(n)'dir.
Etiketler: linked-list, array, node

# A28 · Orta · Hata bulma

Binary search kodundaki sınır ve ilerleme hatalarını bulun.

```java
static int search(int[] arr, int target) {
    int left = 0;
    int right = arr.length;

    while (left <= right) {
        int mid = (left + right) / 2;

        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid;
        } else {
            right = mid;
        }
    }

    return -1;
}
```

Anahtar noktalar:
- Hata: `right = arr.length` kapsayıcı aralıkta geçersiz bir indeks bırakır; `arr.length - 1` olmalıdır
- Hata: `left = mid` ve `right = mid` aralığı daraltmayabilir ve sonsuz döngüye yol açar; `mid + 1` ve `mid - 1` olmalıdır
- Hata: `(left + right) / 2` çok büyük indekslerde taşabilir; `left + (right - left) / 2` güvenlidir
- `[left, right]` kapsayıcı aralıkta döngü koşulu `left <= right`'tır
- Test: boş dizi, tek eleman, hedefin ilk ya da son eleman olması ve hedefin bulunmaması

## A28-01 · Çoklu seçim
Konu: Binary search
Soru: Verilen binary search kodundaki doğruluk veya ilerleme sorunlarını seçin.
Kod:
```java
int left = 0;
int right = arr.length;
while (left <= right) {
    int mid = (left + right) / 2;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) left = mid;
    else right = mid;
}
```
Şıklar:
- [x] a: right başlangıçta arr.length - 1 olmalı
- [x] b: Hedef büyükse left = mid + 1 olmalı
- [x] c: Hedef küçükse right = mid - 1 olmalı
- [x] d: (left + right) toplamı çok büyük indislerde taşabilir
- [ ] e: Orta indeks taşmasın diye `mid = (right - left) / 2` yazılmalı
  Neden: Bu ifade aralığın başlangıcını eklemediği için yanlış indeks verir; taşmayan doğru biçim `left + (right - left) / 2`'dir.
İpucu: Aralık kapsayıcıysa son geçerli indeksi ve her adımda mid'in dışlanmasını kontrol edin.
Kısa açıklama: Başlangıç sınırı hatalıdır; iki güncelleme mid'i dışlamaz ve orta hesaplaması overflow riski taşır.
Açıklama: Kapsayıcı [left,right] aralığında right=length-1'dir. Karşılaştırılan mid eşit değilse yeniden aday olamaz, bu yüzden +1/-1 gerekir; aksi halde sonsuz döngü olabilir. Güvenli orta left+(right-left)/2'dir.
Varsayım: arr null değildir ve artan sıralıdır; boş dizi -1 vermelidir. İndis toplama taşması güvenli formülle önlenir. Düzeltilmiş algoritma Θ(log n) zaman, Θ(1) alan kullanır.
Etiketler: binary-search, off-by-one, sonsuz-dongu, overflow

## A28-02 · Tek seçim
Konu: Binary search
Soru: Kapsayıcı [left,right] aralığı kullanan doğru ve overflow-güvenli binary search parçası hangisidir?
Şıklar:
- [x] a: right=arr.length-1; mid=left+(right-left)/2; küçükse left=mid+1; büyükse right=mid-1
- [ ] b: right=arr.length; mid=(left+right)/2; küçükse left=mid; büyükse right=mid
  Neden: length geçersiz indeks ve mid'i koruyan güncellemeler ilerlememe üretir.
- [ ] c: right=arr.length-1; mid=(left+right)/2; küçükse left=mid+1; büyükse right=mid-1
  Neden: Arama mantığı doğru olsa da left+right büyük indekslerde int taşmasına uğrayabilir; overflow-güvenli değildir.
- [ ] d: right=arr.length; mid=left; iki durumda da left++
  Neden: Doğrusal ilerler, right geçersizdir ve binary search mantığını kullanmaz.
İpucu: Geçerli son indeks length-1 ve elenen orta nokta bir sonraki aralıkta bulunmamalıdır.
Kısa açıklama: Doğru parça son geçerli sınırı kullanır, mid'i dışlar ve toplam taşmasını önler.
Açıklama: left+(right-left)/2, left ve right geçerliyken güvenli fark üzerinden hesaplanır. Her başarısız karşılaştırma aralığı kesin küçültür; algoritma sonlanır ve logaritmik çalışır.
Varsayım: arr null değildir, artan sıralı ve int ile indekslenebilir; boş dizi right=-1 ile doğal olarak -1 döner. Güvenli mid hesabı overflow'u önler. Zaman Θ(log n), alan Θ(1)'dir.
Etiketler: binary-search, guvenli-mid, sinir

# A29 · Orta · Kod yazma

Sıralı bir dizide hedef değerin ilk görüldüğü indeksi binary search ile bulun.

Anahtar noktalar:
- Hedef bulununca hemen dönülmez; indeks `result`'a kaydedilir ve `right = mid - 1` ile sol yarıda aranmaya devam edilir
- `arr[mid] < target` ise `left = mid + 1`, aksi hâlde `right = mid - 1`
- Döngü bitince son kaydedilen indeks döndürülür; hedef yoksa `-1`
- Zaman O(log n), ek alan O(1); tekrar sayısı çok olsa da logaritmik kalır
- Son indeksi bulmak için simetrik olarak eşleşmede `left = mid + 1` yapılır

## A29-01 · Kod çıktısı
Konu: Binary search
Soru: firstIndex({1,2,2,2,5}, 2) çağrısı ne döndürür?
Kod:
```java
static int firstIndex(int[] a, int target) {
    int left=0, right=a.length-1, result=-1;
    while (left<=right) {
        int mid=left+(right-left)/2;
        if (a[mid] >= target) {
            if (a[mid] == target) result=mid;
            right=mid-1;
        } else { left=mid+1; }
    }
    return result;
}
```
Cevap: 1
İpucu: Eşleşme bulunduğunda durmak yerine daha solda eşleşme arayın.
Kısa açıklama: 2'nin ilk görüldüğü indeks 1'dir.
Açıklama: İlk eşleşme result'a kaydedilir ve right sola çekilir. Böylece daha küçük eşleşen indeks varsa bulunur; yoksa son kaydedilen indeks döner.
Varsayım: a null değildir ve artan sıralıdır; boş dizi veya bulunamayan hedef -1 verir. Güvenli mid hesabı taşmaz. Zaman Θ(log n), yardımcı alan Θ(1)'dir.
Etiketler: binary-search, first-occurrence, duplicate

## A29-02 · Sıralama
Konu: Binary search
Soru: Hedefin ilk indeksini bulan binary search'te bir eşleşme görüldüğünde yapılacak işlemleri sıralayın.
Sıra:
1. save: mid indeksini geçici sonuç olarak kaydet
2. left-half: right = mid - 1 ile sol yarıda aramayı sürdür
3. finish: Döngü bitince son kaydedilen indeksi döndür
İpucu: Eşleşmeyi kaybetmeden daha küçük indeks aramalısınız.
Kısa açıklama: Eşleşme kaydedilir, sol yarı aranır ve sonunda en soldaki kayıt döner.
Açıklama: İlk eşleşmede dönmek herhangi bir kopyayı verir. result değişkeni bulunan adayı korur; sağ sınırı azaltmak daha soldaki olası eşleşmeleri araştırır. Aralık her seferinde yarıya iner.
Varsayım: Dizi null değildir, artan sıralıdır; tekrar olabilir, boş veya hedef yoksa -1 döner. İndis hesabı taşmaz. Zaman Θ(log n), yardımcı alan Θ(1)'dir.
Etiketler: binary-search, ilk-indeks, invariant

# A30 · Orta · Kod yazma

`()`, `[]` ve `{}` karakterlerinden oluşan bir ifadenin dengeli olup olmadığını stack kullanarak kontrol edin.

Örnek çözüm:
```java
static boolean isBalanced(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (c == '(' || c == '[' || c == '{') {
            stack.push(c);
        } else if (c == ')' || c == ']' || c == '}') {
            if (stack.isEmpty() || stack.pop() != openingOf(c)) return false;
        } else {
            return false; // Politika: parantez dışı karakter reddedilir.
        }
    }
    return stack.isEmpty();
}

static char openingOf(char closing) {
    return closing == ')' ? '(' : closing == ']' ? '[' : '{';
}
```

Anahtar noktalar:
- Karakterler soldan sağa taranır; açılış parantezleri stack'e konur
- Kapanışta stack boşsa ya da tepedeki açılış türü uymuyorsa ifade dengesizdir
- Tür uyarsa tepedeki eleman çıkarılır (`pop`)
- Tarama bitince stack boş olmalıdır; `"("` gibi kapanmamış parantezler böyle yakalanır
- Zaman Θ(n), en kötü ek alan Θ(n); Java'da stack olarak `ArrayDeque` kullanılır

## A30-01 · Doğru / Yanlış
Konu: Stack
Soru: Yalnız ()[]{} karakterlerini kabul eden dengeli parantez denetiminde "{[()]}" geçerli, "([)]" geçersizdir.
Şıklar:
- [x] Doğru
  Neden: Doğru seçimdir; ilk ifade düzgün iç içedir, ikincisinde kapanış türü stack tepesine uymaz.
- [ ] Yanlış
  Neden: Yanlış seçimdir; ([)] ifadesinde kapanış sırası açılışların ters sırasına uymaz.
İpucu: Kapanış karakteri, en son açılan türle eşleşmelidir.
Kısa açıklama: Doğru. İlk ifade düzgün iç içedir; ikincide ] geldiğinde tepede ( vardır.
Açıklama: Stack LIFO olduğu için en içte/en son açılan parantez önce kapanır. Tür eşleşmezse ifade hemen reddedilir; tüm girdi bitince stack de boş olmalıdır.
Varsayım: s null değildir ve yalnız altı parantez karakterini içerir; boş String dengeli kabul edilir. Uzunluk taşmaz. Zaman Θ(n), en kötü yardımcı alan Θ(n)'dir.
Etiketler: balanced-brackets, stack, lifo

## A30-02 · Sıralama
Konu: Stack
Soru: Dengeli parantez algoritmasının temel adımlarını sıralayın.
Sıra:
1. scan: Karakterleri soldan sağa tara
2. push: Açılış karakterini stack'e koy
3. close: Kapanışta stack boşsa veya tepe türü uymuyorsa false dön; uyarsa pop yap
4. end: Tarama sonunda stack boşsa true dön
İpucu: Açılışlar bekleyen işleri, kapanışlar son bekleyeni tamamlar.
Kısa açıklama: Açılışlar push edilir, kapanışlar eşleşen tepeyi pop eder, sonunda stack boş olmalıdır.
Açıklama: Her karakter en fazla bir push ve bir pop işlemine neden olur. Erken hatalar hemen dönebilir; tamamen açılışlardan oluşan girdi n öğe stack alanı gerektirir.
Varsayım: s null değildir; boş metin true'dur, yalnız ()[]{} geçerlidir ve diğer karakter politikası reddetmedir. Boyut taşmaz. Zaman Θ(n), en kötü alan Θ(n)'dir.
Etiketler: balanced-brackets, stack, algoritma-adimlari

# A31 · Orta · Kod okuma

İşlemlerden sonra değişkenlerin değerini ve queue’nun kalan sırasını bulun. `offer`, `poll` ve `peek` davranışlarını açıklayın.

```java
Queue<Integer> queue = new ArrayDeque<>();
queue.offer(10);
queue.offer(20);

int first = queue.poll();

queue.offer(30);
int next = queue.peek();
```

Anahtar noktalar:
- Çıktı: `first = 10`, `next = 20` ve kalan kuyruk `[20, 30]`
- `offer` sona ekler; `poll` baştakini çıkarıp döndürür, kuyruk boşsa null döner
- `peek` baştakini çıkarmadan döndürür, kuyruk boşsa null döner
- `add`, `remove` ve `element` aynı işleri yapar ama başarısız olunca exception fırlatır
- Boş kuyrukta `int first = queue.poll();` null'ı `int`'e açmaya çalıştığı için `NullPointerException` verir

## A31-01 · Kod çıktısı
Konu: Queue
Soru: Kod first, next ve kuyruğun kalan sırası için ne yazdırır?
Kod:
```java
Queue<Integer> queue = new ArrayDeque<>();
queue.offer(10);
queue.offer(20);
int first = queue.poll();
queue.offer(30);
int next = queue.peek();
System.out.print(first + "," + next + "," + queue);
```
Cevap: 10,20,[20, 30]
Kabul: 10, 20, [20, 30]
İpucu: poll başı çıkarır; peek yeni başı çıkarmadan okur.
Kısa açıklama: first=10, next=20 ve kalan FIFO sırası [20, 30]'dur.
Açıklama: 10 ve 20 eklendikten sonra poll 10'u çıkarır. 30 sona eklenir; peek baştaki 20'yi döndürür ama silmez. ArrayDeque'nin toString'i yineleme sırasını gösterir.
Varsayım: Queue ArrayDeque ve null değildir; null eleman yoktur, poll/peek çağrılarında kuyruk boş değildir. Boyut taşmaz. Her işlem amortize Θ(1), toplam bu sabit program için Θ(1), genel saklama alanı Θ(n)'dir.
Etiketler: queue, offer, poll, peek

## A31-02 · Eşleştirme
Konu: Queue
Soru: Queue metotlarını davranışlarıyla eşleştirin.
Eşleşmeler:
- offer: offer(e) => append: Elemanı sona eklemeyi dener ve boolean döndürür
- poll: poll() => remove: Baştakini çıkarır; boşsa null döndürür
- peek: peek() => inspect: Baştakini çıkarmadan verir; boşsa null döndürür
Fazladan seçenekler:
- decoy: Baştakini çıkarır; boşsa NoSuchElementException fırlatır
İpucu: poll değiştirir, peek yalnız bakar.
Kısa açıklama: offer ekler, poll çıkarır, peek çıkarmadan gösterir.
Açıklama: Bu metotlar exception atan add/remove/element ailesinden farklı olarak kapasite/boşluk durumunu özel dönüşlerle bildirir. ArrayDeque sınırsız büyüyebildiği ölçüde offer genellikle true döner.
Varsayım: Queue null değildir; ArrayDeque null eleman kabul etmez. Boş kuyrukta poll/peek null döner, boyut taşmaz. Temel uç işlemleri amortize Θ(1), n öğe alanı Θ(n)'dir.
Etiketler: queue-api, offer, poll, peek

# A32 · Orta · Kod yazma

Tek yönlü linked list’i dolaşarak düğüm sayısını ve son düğümün değerini bulun. Boş listeyi ele alın.

Anahtar noktalar:
- `current = head` ile başlayıp `current != null` iken düğümleri sayarak ilerlemek
- Son düğüm, `current` ilerlemeden önce `last`'a kaydedilir
- Boş liste (`head == null`) için sayı 0'dır ve son değer yoktur
- "Değer yok" durumu 0 ile değil `OptionalInt.empty()` ya da null ile bildirilir; 0 geçerli bir değer olabilir
- Zaman Θ(n), ek alan Θ(1)

## A32-01 · Kod çıktısı
Konu: Linked list
Soru: head 4 -> 7 -> 9 -> null listesini gösterdiğinde traverse(head) ne yazdırır?
Kod:
```java
static void traverse(Node head) {
    int count = 0;
    Node current = head, last = null;
    while (current != null) {
        count++; last = current; current = current.next;
    }
    System.out.print(count + "," + (last == null ? "empty" : last.value));
}
```
Cevap: 3,9
Kabul: 3, 9
İpucu: current null olana kadar düğümleri sayın; last son ziyaret edileni tutar.
Kısa açıklama: Üç düğüm vardır ve son düğümün değeri 9'dur.
Açıklama: Dolaşma her düğümü tam bir kez ziyaret eder. last, current ilerletilmeden önce güncellendiği için döngü sonunda tail düğümünü gösterir.
Varsayım: Liste sonlu, döngüsüz ve head null olabilir; bu kartta üç düğüm vardır. value int taşmasıyla işlenmez, düğüm sayısı int sınırını aşmaz. Zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: linked-list, traversal, tail

## A32-02 · Tek seçim
Konu: Linked list
Soru: Aynı dolaşma sözleşmesinde head == null için doğru sonuç hangisidir?
Şıklar:
- [x] a: count=0 ve son değer yok
- [ ] b: count=1 ve son değer 0
  Neden: Boş listede düğüm yoktur; 0 geçerli bir düğüm değeri olabilir.
- [ ] c: NullPointerException zorunludur
  Neden: Null head döngü koşuluyla güvenle ele alınabilir.
- [ ] d: count=-1 ve son değer head
  Neden: Negatif sayım için gerekçe yoktur.
İpucu: while (current != null) döngüsü kaç kez çalışır?
Kısa açıklama: Boş listede düğüm sayısı 0'dır ve son düğüm yoktur.
Açıklama: last başlangıçta null tutulur ve döngü hiç çalışmaz. API son değer için OptionalInt.empty, null sarmalayıcı veya ayrı bir sonuç nesnesi kullanabilir; 0 değerini 'yok' anlamında kullanmak belirsizdir.
Varsayım: head null boş listeyi temsil eder; liste döngüsüzdür. Sayım taşmaz. Boş durumda zaman Θ(1), genel n düğüm için Θ(n); yardımcı alan Θ(1)'dir.
Etiketler: linked-list, empty-list, contract

# A33 · Orta · Hata bulma

Kodun boş liste ve hedefin ilk düğümde olması durumlarındaki sorunlarını bulun.

```java
static Node remove(Node head, int target) {
    Node current = head;

    while (current.next != null) {
        if (current.next.value == target) {
            current.next = current.next.next;
            return head;
        }

        current = current.next;
    }

    return head;
}
```

Anahtar noktalar:
- Hata: `head` null ise `current.next` erişimi `NullPointerException` verir
- Hata: döngü yalnız `current.next`'e baktığı için ilk düğüm hiç kontrol edilmez
- Düzeltme: önce `if (head == null) return null;`, sonra `if (head.value == target) return head.next;`
- Diğer düğümler, öncülün `next` alanı silinen düğümün `next`'ine bağlanarak silinir
- Alternatif: listenin başına sahte (dummy) bir düğüm koyup ilk düğümü de aynı kuralla silmek

## A33-01 · Çoklu seçim
Konu: Linked list silme
Soru: Verilen remove metodundaki sorunları seçin.
Kod:
```java
static Node remove(Node head, int target) {
    Node current = head;
    while (current.next != null) {
        if (current.next.value == target) {
            current.next = current.next.next; return head;
        }
        current = current.next;
    }
    return head;
}
```
Şıklar:
- [x] a: head null ise current.next erişimi NullPointerException üretir
- [x] b: İlk düğüm hedefse hiçbir zaman kontrol edilmez
- [ ] c: Son düğüm hiçbir koşulda silinemez
  Neden: current sondan bir önceki düğümdeyken current.next tail'dir ve silinebilir.
- [ ] d: Metot ilk eşleşmeyi sildikten sonra dönmeyi unutur
  Neden: Silme dalında return head zaten vardır.
İpucu: current'ın kendisi değil current.next kontrol ediliyor; current başlangıçta ne olabilir?
Kısa açıklama: Boş liste korunmamıştır ve head düğümünün değeri hiç sınanmaz.
Açıklama: Önce head==null kontrolü, sonra head.value==target ise head.next dönüşü gerekir. Sonraki düğümler current.next üzerinden güvenle silinebilir; tail de current.next olarak kontrol edildiği için silinebilir.
Varsayım: Liste sonlu/döngüsüzdür; hedef int karşılaştırması taşmaz. Amaç yalnız ilk eşleşmeyi silmektir. Düzeltilmiş metot en kötü Θ(n) zaman, Θ(1) yardımcı alan kullanır.
Etiketler: linked-list, remove, null, head

## A33-02 · Tek seçim
Konu: Linked list silme
Soru: İlk eşleşen düğümü silen metot için doğru başlangıç kontrolleri hangisidir?
Şıklar:
- [x] a: if (head == null) return null; if (head.value == target) return head.next;
- [ ] b: if (head == null) return new Node(0); if (head.value == target) return head;
  Neden: Boş listede sahte düğüm eklenmez ve hedef head değişmeden bırakılamaz.
- [ ] c: if (head.next == null) return null;
  Neden: Tek düğümlü hedef listeyi ve boş head'i doğru ayırmaz.
- [ ] d: head = head.next; ardından her zaman head döndür
  Neden: Hedef olmasa bile ilk düğümü kaybeder.
İpucu: Boş listeyi ve head'in bizzat hedef olduğu durumu ayrı ele alın.
Kısa açıklama: Null head null kalır; hedef head ise yeni head eski head.next olur.
Açıklama: Tek yönlü listede ilk düğümün öncülü olmadığı için head silme özel durumdur. Diğer düğümlerde predecessor.next bağlantısı atlanacak düğümün next'ine bağlanabilir.
Varsayım: Liste null head ile boş olabilir, sonlu ve döngüsüzdür; yalnız ilk eşleşme silinir. Değer karşılaştırması taşmaz. En kötü zaman Θ(n), alan Θ(1)'dir.
Etiketler: linked-list, head-removal, guard-clause

# A34 · Orta · Kod yazma

Linked list’in orta düğümünü slow/fast pointer tekniğiyle bulun. Çift uzunlukta hangi orta düğümün döndürüleceğini tanımlayın.

Anahtar noktalar:
- `slow` bir, `fast` iki adım ilerler; `fast` sona ulaştığında `slow` ortadadır
- Döngü koşulu `fast != null && fast.next != null` olur
- `fast = head` ile başlamak çift uzunlukta ikinci ortayı verir (1 → 2 → 3 → 4 için 3)
- İlk orta isteniyorsa `fast = head.next` ile başlanır; hangisinin döndüğü sözleşmede belirtilir
- Zaman Θ(n), ek alan Θ(1); uzunluğu önce sayıp sonra ortaya gitmek de Θ(n) ama iki geçiş ister

## A34-01 · Kod çıktısı
Konu: Slow/fast pointer
Soru: fast=head ve fast iki adım ilerlerken slow bir adım ilerliyorsa 1 -> 2 -> 3 -> 4 listesinde döndürülen orta değer nedir? Çift uzunlukta ikinci orta seçilir.
Kod:
```java
Node slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
}
return slow;
```
Cevap: 3
İpucu: fast sona ulaştığında slow iki adım ilerlemiş olur.
Kısa açıklama: Dört düğümde ikinci orta olan 3 döndürülür.
Açıklama: İlk yineleme sonrası slow=2, fast=3; ikinci sonrası slow=3, fast=null olur. Başlangıç düzeni çift listelerde n/2 indeksli, yani ikinci orta düğümü seçer.
Varsayım: Liste sonlu/döngüsüz ve head null olabilir; null head için null döner. Düğüm sayısı taşmaz. Zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: linked-list, slow-fast, middle

## A34-02 · Boşluk doldurma
Konu: Slow/fast pointer
Soru: Slow/fast pointer ile orta düğüm bulmanın sıkı zaman ve yardımcı alan karmaşıklığını 'zaman, alan' biçiminde yazın.
Cevap: Θ(n), Θ(1)
Kabul: Theta(n), Theta(1)
Kabul: theta(n), theta(1)
İpucu: Liste bir kez geçilir; düğümler kopyalanmaz.
Kısa açıklama: Sıkı zaman Θ(n), yardımcı alan Θ(1)'dir.
Açıklama: fast yaklaşık n/2 yineleme yapar; bu doğrusal büyümedir. slow, fast ve birkaç referans dışında ek yapı tutulmaz.
Varsayım: Liste null olabilir, sonlu ve döngüsüzdür; boş liste null döndürür. Sayaç aritmetiği kullanılmadığı için taşma yoktur. Zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: slow-fast, karmasiklik, linked-list

# A35 · Orta · Kod yazma

Tek yönlü linked list’i iteratif olarak ters çevirin ve yeni head’i döndürün.

Örnek çözüm:
```java
class Node {
    int value;
    Node next;

    Node(int value) {
        this.value = value;
    }
}

static Node reverse(Node head) {
    Node previous = null;
    Node current = head;
    while (current != null) {
        Node next = current.next; // Kalan listeyi kaybetmemek için önce saklanır.
        current.next = previous;
        previous = current;
        current = next;
    }
    return previous;
}
```

Anahtar noktalar:
- Üç işaretçi: `previous` (null ile başlar), `current` (`head`) ve döngüde saklanan `next`
- Her turda önce `next = current.next` saklanır, sonra `current.next = previous` ile bağlantı ters çevrilir
- `previous = current` ve `current = next` ile ilerlenir
- `current` null olunca `previous` yeni `head`'dir
- Zaman Θ(n), ek alan Θ(1); boş ve tek düğümlü listeler ek kontrol gerektirmez

## A35-01 · Sıralama
Konu: Linked list ters çevirme
Soru: Tek yönlü linked list'i iteratif ters çeviren döngünün adımlarını sıralayın.
Sıra:
1. save: next = current.next ile kalan listeyi kaydet
2. reverse: current.next = previous ile bağlantıyı ters çevir
3. advance-prev: previous = current yap
4. advance-current: current = next ile eski listede ilerle
5. return: current null olduğunda previous'ı yeni head olarak döndür
İpucu: Bağlantıyı değiştirmeden önce eski next referansını kaybetmeyin.
Kısa açıklama: Önce next saklanır, ok ters çevrilir, iki işaretçi ilerletilir ve previous döner.
Açıklama: Döngü değişmezi: previous işlenmiş ters öneki, current işlenmemiş son eki gösterir. next önce saklanmazsa listenin geri kalanına erişim kaybedilir.
Varsayım: Liste null head ile boş olabilir, sonlu ve döngüsüzdür; boşta null, tek düğümde aynı head döner. Değer aritmetiği/taşma yoktur. Zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: linked-list, reverse, iterative, invariant

# A36 · Orta · Kod okuma

Bir bubble sort geçişinden sonra dizinin durumunu, karşılaştırma ve swap sayısını bulun.

```java
int[] arr = {5, 1, 4, 2};

for (int j = 0; j < arr.length - 1; j++) {
    if (arr[j] > arr[j + 1]) {
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
    }
}
```

Anahtar noktalar:
- Çıktı: `[1, 4, 2, 5]`; 3 karşılaştırma ve 3 takas
- Tek geçişte yan yana elemanlar karşılaştırılır; soldaki büyükse yer değiştirir
- Bir geçiş en büyük elemanı (5) sona taşır ama diziyi tamamen sıralamaz
- Tam sıralama n - 1 geçiş gerektirebilir; her geçişte sondaki sıralı kısım bir eleman büyür
- Hiç takas olmayan bir geçiş dizinin sıralı olduğunu gösterir (erken çıkış)

## A36-01 · Kod çıktısı
Konu: Bubble sort
Soru: Tek bubble sort geçişinden sonra 'dizi; karşılaştırma; swap' çıktısı nedir?
Kod:
```java
int[] arr = {5, 1, 4, 2};
int comparisons = 0, swaps = 0;
for (int j = 0; j < arr.length - 1; j++) {
    comparisons++;
    if (arr[j] > arr[j + 1]) {
        int t=arr[j]; arr[j]=arr[j+1]; arr[j+1]=t; swaps++;
    }
}
```
Cevap: [1, 4, 2, 5]; 3; 3
Kabul: [1,4,2,5];3;3
Kabul: 1,4,2,5;3;3
İpucu: 5 her komşu karşılaştırmada sağa taşınır.
Kısa açıklama: Dizi [1,4,2,5] olur; 3 karşılaştırma ve 3 swap yapılır.
Açıklama: Sırasıyla (5,1), (5,4), (5,2) çiftleri yer değiştirir. Tek tam geçiş en büyük elemanı sona yerleştirir; tüm diziyi mutlaka sıralamaz.
Varsayım: arr null değildir ve dört elemanlıdır; boş/tek elemanda sıfır işlem yapılır. Karşılaştırma/swap sayaçları taşmaz. Tek geçiş zamanı Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: bubble-sort, trace, swap

# A37 · Orta · Kod yazma

Bubble sort’u yazın. Dizi sıralıysa erken çıkış optimizasyonu ekleyin ve en iyi/kötü durum karmaşıklıklarını belirtin.

Örnek çözüm:
```java
static void bubbleSort(int[] arr) {
    for (int end = arr.length - 1; end > 0; end--) {
        boolean swapped = false;
        for (int j = 0; j < end; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        // Bir geçişte hiç swap olmadıysa dizi sıralıdır: en iyi durum Θ(n).
        if (!swapped) break;
    }
    // Kötü durum (ters sıralı girdi) Θ(n²) zamandır; ek bellek her durumda Θ(1).
}
```

Anahtar noktalar:
- Yan yana elemanlar karşılaştırılır, soldaki büyükse yer değiştirir; her geçiş en büyük elemanı sona taşır
- Her geçişte sondaki sıralı kısım bir büyür; iç döngünün sınırı her turda bir azalır
- Erken çıkış: bir geçişte hiç takas olmadıysa dizi sıralıdır ve döngü biter
- En iyi durum (sıralı girdi) Θ(n), en kötü durum (ters sıralı) Θ(n²); ek alan Θ(1)
- Kararlıdır: yalnız `>` ile karşılaştırıldığı için eşit elemanların sırası korunur

## A37-01 · Çoklu seçim
Konu: Bubble sort
Soru: Swap bayrağıyla erken çıkan standart bubble sort için doğru özellikleri seçin.
Şıklar:
- [x] a: Sıralı girdide en iyi zaman Θ(n)'dir
- [x] b: Ters sıralı girdide kötü zaman Θ(n²)'dir
- [ ] c: Standart karşılaştırmayla eşit komşuları da yer değiştirdiği için kararsızdır
  Neden: Standart bubble sort yalnız > olduğunda swap yapar; eşitler yer değiştirmediği için kararlıdır.
- [ ] d: Yardımcı alanı Θ(n)'dir
  Neden: Yerinde uygulama bayrak ve geçici değer dışında sabit yardımcı alan kullanır.
İpucu: İlk geçişte swap yoksa durur; swap yalnız > karşılaştırmasında yapılır.
Kısa açıklama: Optimize bubble sort sıralıda doğrusal, kötü durumda karesel, standart biçimde kararlı ve yerindedir.
Açıklama: İlk geçiş n-1 karşılaştırma yapıp swap görmezse sonlanır. Ters sırada üçgensel sayıda karşılaştırma/swap oluşur. Eşitlerin sırası korunur ve yalnız sabit geçici bellek kullanılır.
Varsayım: arr null değildir; boş/tek eleman zaten sıralıdır. Karşılaştırıcı tutarlı, sayaçlar taşmaz. En iyi Θ(n), ortalama/kötü Θ(n²), yardımcı alan Θ(1)'dir.
Etiketler: bubble-sort, early-exit, stable

## A37-02 · Kod çıktısı
Konu: Bubble sort
Soru: Erken çıkışlı bubble sort {1,2,3,4} için tamamlandığında 'dış geçiş, karşılaştırma, swap' sayaçları nedir?
Kod:
```java
int passes=0, comparisons=0, swaps=0;
for (int end=arr.length-1; end>0; end--) {
    boolean swapped=false; passes++;
    for (int j=0; j<end; j++) {
        comparisons++;
        if (arr[j] > arr[j+1]) { /* swap */ swaps++; swapped=true; }
    }
    if (!swapped) break;
}
```
Cevap: 1,3,0
Kabul: 1, 3, 0
İpucu: İlk geçişte hiçbir ters komşu yoktur.
Kısa açıklama: Bir geçiş, üç karşılaştırma, sıfır swap yapılır.
Açıklama: swapped false kaldığı için ilk dış yineleme sonunda break çalışır. n elemanlı sıralı girdide n-1 karşılaştırma yapılması en iyi sıkı zamanı Θ(n) yapar.
Varsayım: arr null değildir ve artan sıralı dört elemanlıdır; boş/tek elemanda döngü yoktur. Sayaçlar taşmaz. Bu girdi için ve genel sıralı n için zaman Θ(n), alan Θ(1)'dir.
Etiketler: bubble-sort, best-case, trace

# A38 · Orta · Kod yazma

Selection sort’u uygulayın. Her dış döngü sonunda dizinin hangi bölümünün doğru konuma geldiğini açıklayın.

Örnek çözüm:
```java
static void selectionSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) minIndex = j;
        }
        if (minIndex != i) {
            int temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
        // Bu adımın sonunda arr[0..i] nihai ve sıralıdır:
        // en küçük i + 1 eleman yerine oturmuştur.
    }
}
```

Anahtar noktalar:
- Her dış turda sıralanmamış kısmın en küçüğü bulunur ve `i` konumuna alınır
- Her tur sonunda `arr[0..i]` nihai ve sıralıdır; bu döngü değişmezidir
- Karşılaştırma sayısı girdiden bağımsızdır: her durumda Θ(n²)
- Takas sayısı en fazla n - 1'dir; yazma maliyeti yüksekse bu bir avantajdır
- Yerinde çalışır (Θ(1) ek alan) ama standart hâli kararlı değildir

## A38-01 · Sıralama
Konu: Selection sort
Soru: Selection sort'un her dış döngü yinelemesindeki adımları sıralayın.
Sıra:
1. start: minIndex = i ile sıralanmamış bölümün başını aday seç
2. scan: i+1..n-1 aralığını tarayıp en küçük elemanın indeksini bul
3. swap: minIndex farklıysa a[i] ile a[minIndex]'i değiştir
4. invariant: 0..i önekinin nihai ve sıralı olduğunu kabul ederek ilerle
İpucu: Önce minimum bulunur, sonra sıralı önekin sonuna yerleştirilir.
Kısa açıklama: Sıralanmamış bölümün minimumu bulunup i konumuna alınır; doğru önek bir büyür.
Açıklama: Döngü değişmezi, i öncesindeki elemanların nihai konumunda olmasıdır. Her yineleme kalan minimumu seçtiği için bu değişmez korunur.
Varsayım: arr null değildir; boş/tek eleman değişmez. Karşılaştırıcı tutarlı ve indisler taşmaz. Her durumda zaman Θ(n²), yardımcı alan Θ(1)'dir.
Etiketler: selection-sort, invariant, order

## A38-02 · Kod çıktısı
Konu: Selection sort
Soru: Selection sort {4,3,2,1} dizisinde i=0 ve i=1 dış yinelemeleri tamamlandıktan sonra dizi nedir?
Cevap: [1, 2, 3, 4]
Kabul: [1,2,3,4]
Kabul: 1,2,3,4
İpucu: İlkinde 1 başa, ikincide kalan bölümün minimumu 2 indeks 1'e gelir.
Kısa açıklama: İlk geçiş [1,3,2,4], ikinci geçiş [1,2,3,4] üretir.
Açıklama: i=0 için minIndex=3 ve 4 ile 1 swap edilir. i=1 için {3,2,4} bölümünün minimumu 2'dir ve 3 ile değiştirilir. Son kısım tesadüfen de sıralanmış olur.
Varsayım: Dizi null değildir ve karşılaştırma doğal int sırasıdır; boş/tek eleman değişmez. Swap taşma yapmaz. İki geçişin bu sabit girdide maliyeti Θ(1), genel tam algoritma Θ(n²) zaman/Θ(1) alandır.
Etiketler: selection-sort, trace, dizi

# A39 · Orta · Kod yazma

Insertion sort’u uygulayın. Neredeyse sıralı dizilerde neden avantajlı olabileceğini açıklayın.

Anahtar noktalar:
- Her adımda `key = a[i]` alınır; soldaki sıralı kısımda ondan büyük elemanlar bir sağa kaydırılır ve `key` boşluğa yazılır
- Döngü değişmezi: `i`. turun sonunda `a[0..i]` sıralıdır
- En iyi durum (sıralı girdi) Θ(n), en kötü durum (ters sıralı) Θ(n²); ek alan Θ(1)
- Neredeyse sıralı dizide az kaydırma yapılır; ters çift sayısı k için süre Θ(n + k)'dır
- Kararlıdır; küçük dizilerde hızlı olduğu için gelişmiş sıralama algoritmaları küçük parçalarda onu kullanır

## A39-01 · Kod çıktısı
Konu: Insertion sort
Soru: Insertion sort {4,1,3,2} dizisinde i=2 yinelemesi tamamlandığında dizi nedir?
Kod:
```java
for (int i=1; i<a.length; i++) {
    int key=a[i], j=i-1;
    while (j>=0 && a[j]>key) { a[j+1]=a[j]; j--; }
    a[j+1]=key;
}
```
Cevap: [1, 3, 4, 2]
Kabul: [1,3,4,2]
Kabul: 1,3,4,2
İpucu: i=1 sonrasında [1,4,3,2]; sonra 3 sıralı önekte yerine eklenir.
Kısa açıklama: i=2 sonunda sıralı önek [1,3,4] olur; dizi [1,3,4,2]'dir.
Açıklama: key=3 iken 4 bir sağa kayar ve 3 indeks 1'e yazılır. Döngü değişmezi, i yinelemesi sonunda 0..i önekinin sıralı olmasıdır.
Varsayım: arr null değildir; boş/tek eleman değişmez. Karşılaştırıcı tutarlı, değer atamaları taşma üretmez. Genel en iyi Θ(n), kötü Θ(n²), yardımcı alan Θ(1)'dir.
Etiketler: insertion-sort, trace, sorted-prefix

## A39-02 · Tek seçim
Konu: Insertion sort
Soru: Insertion sort neredeyse sıralı dizilerde neden avantajlı olabilir?
Şıklar:
- [x] a: Ters çift azsa süresi Θ(n)'e yaklaşır
- [ ] b: Girdi sıralı olsa da n² swap yapar
  Neden: Sıralı girdide iç döngü hemen durur.
- [ ] c: Sıralı kısmı ikili aramayla taradığı için her eleman Θ(log n) kaydırmayla yerine yerleşir
  Neden: Standart insertion sort doğrusal tarar; avantajı ters çift az olduğunda kaydırmanın az olmasıdır.
- [ ] d: Eşit elemanlar olduğunda sıralama bozulur
  Neden: Eşit değerlerle de çalışır ve uygun karşılaştırmayla kararlı kalır.
İpucu: İç döngü yalnız key'den büyük önceki elemanları kaydırır.
Kısa açıklama: Maliyet terslik sayısıyla ilişkilidir; az terslik az kaydırma demektir.
Açıklama: Dış döngünün Θ(n) taban maliyetine ek olarak her inversion yaklaşık bir kaydırma doğurur. Bu nedenle ince analiz Θ(n+k)'dır; k=0 iken Θ(n), k=Θ(n²) iken Θ(n²) olur.
Varsayım: arr null değildir; eşit elemanlara izin verilir, karşılaştırma tutarlıdır. Boş/tek eleman geçerlidir, indis taşması yoktur. Zaman sıkı Θ(n+k), yardımcı alan Θ(1)'dir.
Etiketler: insertion-sort, nearly-sorted, inversion

# A40 · Orta · Karşılaştırma

Bubble, selection ve insertion sort’u kararlılık, yerinde çalışma, en iyi/kötü durum ve swap sayısı açısından karşılaştırın.

Anahtar noktalar:
- Üçü de yerinde çalışır (Θ(1) ek alan) ve en kötü durumda Θ(n²) zaman alır
- Bubble sort: erken çıkışla en iyi durum Θ(n); takas sayısı çoktur; kararlıdır
- Selection sort: her durumda Θ(n²) karşılaştırma ama en fazla n - 1 takas; standart hâli kararlı değildir
- Insertion sort: en iyi durum Θ(n); neredeyse sıralı girdide hızlıdır; kararlıdır
- Pratikte küçük ya da neredeyse sıralı veride insertion sort, büyük veride O(n log n) algoritmalar tercih edilir

## A40-01 · Eşleştirme
Konu: Sıralama karşılaştırması
Soru: Standart yerinde uygulamaları özellik kümeleriyle eşleştirin.
Eşleşmeler:
- bubble: Erken çıkışlı bubble sort => b-props: Kararlı; en iyi Θ(n), kötü Θ(n²); kötü durumda Θ(n²) swap
- selection: Selection sort => s-props: Genelde kararsız; her durumda Θ(n²) karşılaştırma; en fazla n-1 swap
- insertion: Insertion sort => i-props: Kararlı; en iyi Θ(n), kötü Θ(n²); terslik kadar kaydırma
Fazladan seçenekler:
- decoy: Kararlı; her durumda Θ(n log n); Θ(n) ek alan
İpucu: Selection minimumu uzağa swap eder; insertion sıralı öneğe ekler.
Kısa açıklama: Bubble ve insertion standart biçimde kararlı; selection az swap yapar ama genelde kararsızdır.
Açıklama: Üçü de Θ(1) yardımcı alanla yerinde uygulanabilir. Optimize bubble ve insertion sıralı girdide Θ(n)'e iner. Selection minimumu bulmak için girdi düzeninden bağımsız üçgensel sayıda karşılaştırma yapar, fakat dış tur başına en çok bir swap gerekir.
Varsayım: Diziler null değildir; boş/tek eleman geçerlidir, karşılaştırıcı tutarlıdır ve sayaçlar taşmaz. Standart implementasyonlar sorulur: bubble yalnız > ile swap, insertion eşitleri kaydırmaz, selection uzak swap yapar. Alanların tümü Θ(1)'dir.
Etiketler: sorting, stability, in-place, comparison

# A41 · Orta · Teori

Recursion’da base case neden gereklidir? Çağrıların stack üzerinde tutulması ve `StackOverflowError` riskini açıklayın.

Anahtar noktalar:
- Base case özyinelemeyi durduran ve doğrudan sonuç döndüren koşuldur
- Her özyinelemeli adım girdiyi base case'e yaklaştırmalıdır; yoksa çağrılar sonlanmaz
- Her çağrı stack'te bir frame (parametreler, yerel değişkenler, dönüş adresi) tutar; frame'ler dönüşte LIFO sırasıyla kalkar
- Derinlik stack sınırını aşarsa, sonuç matematiksel olarak doğru olsa bile `StackOverflowError` oluşur
- Java tail-call optimizasyonu yapmaz; çok derin özyineleme döngüye çevrilir

## A41-01 · Boşluk doldurma
Konu: Recursion
Soru: Recursion'da daha fazla recursive çağrı yapmadan doğrudan sonuç döndüren koşulun adını yazın.
Cevap: base case
Kabul: temel durum
Kabul: taban durum
Kabul: base-case
İpucu: Çağrı zincirinin durmasını sağlayan durumdur.
Kısa açıklama: Bu koşula base case (temel/taban durum) denir.
Açıklama: Base case probleme ait en küçük doğrudan çözülebilir girdiyi tanımlar. Recursive adım girdiyi bu duruma yaklaştırmalıdır; yalnız base case yazmak, erişilebilir değilse sonlanmayı garanti etmez.
Varsayım: Kavramsal sorudur; recursive fonksiyonun girdisi kendi geçerli alanındadır, null/boş girdi gerekiyorsa fonksiyon içinde ayrıca ele alınır. Taşma yoktur. Zaman/alan bağıntısı probleme bağlıdır; çağrı derinliği d ise stack alanı sıkı Θ(d)'dir.
Etiketler: recursion, base-case, termination

## A41-02 · Tek seçim
Konu: Recursion
Soru: Çok derin veya sonlanmayan recursive çağrılar Java'da neden StackOverflowError üretebilir?
Şıklar:
- [x] a: Her çağrı stack frame tüketir
- [ ] b: Her recursive çağrı heap'e yeni nesne koyduğu için heap dolar ve JVM bunu StackOverflowError olarak bildirir
  Neden: Heap'in dolması OutOfMemoryError üretir; StackOverflowError çağrı yığınının tükenmesidir.
- [ ] c: JVM recursive metotları hiç desteklemez
  Neden: Java recursion'ı destekler.
- [ ] d: Base case sonucu int türüne sığmaz
  Neden: Sayısal taşma farklı bir hata sınıfıdır.
İpucu: Henüz dönmemiş her çağrının bilgisinin nerede tutulduğunu düşünün.
Kısa açıklama: Her aktif çağrı call stackte bir frame tutar; sınırlı stack tükenebilir.
Açıklama: Çağrılar base case'e ulaşana kadar frame'ler birikir ve dönüşlerde LIFO sırasıyla çözülür. Derinlik stack sınırını aşarsa, matematiksel sonuç doğru olsa bile StackOverflowError oluşur. Java genel olarak tail-call optimizasyonu garantilemez.
Varsayım: Girdi null/boş durumu sözleşmeyle base case'e bağlanır; sayısal taşma bu kartın konusu değildir. Çağrı derinliği d için sıkı stack alanı Θ(d); zaman, çağrı sayısı c için Θ(c)'dir.
Etiketler: recursion, call-stack, stack-overflow

# A42 · Orta · Hata bulma

Recursive faktoriyel metodundaki problemi bulun.

```java
static long factorial(int n) {
    if (n == 1) {
        return 1;
    }

    return n * factorial(n - 1);
}
```

Anahtar noktalar:
- Base case yalnız `n == 1`'dir; `factorial(0)` 1'e hiç ulaşmaz ve stack taşar (`StackOverflowError`)
- Negatif n de 1'e yaklaşmadığı için aynı hatayı verir
- Düzeltme: negatif girdiyi reddetmek ve base case'i `n <= 1` yapmak
- `long` 20!'den sonra sessizce taşar; `Math.multiplyExact` ya da `BigInteger` kullanılır
- Zaman Θ(n), stack alanı Θ(n); döngülü çözüm aynı işi Θ(1) alanla yapar

## A42-01 · Çoklu seçim
Konu: Recursive faktoriyel
Soru: Verilen recursive faktoriyel metodunun sorunlarını seçin.
Kod:
```java
static long factorial(int n) {
    if (n == 1) return 1;
    return n * factorial(n - 1);
}
```
Şıklar:
- [x] a: n=0 için base case'e ulaşmaz ve stack taşar
- [x] b: Negatif n için de çağrılar 1'e yaklaşmaz
- [x] c: Yeterince büyük pozitif n için long aritmetiği taşar
- [ ] d: n=1 için yanlışlıkla 0 döndürür
  Neden: n=1 koşulu doğrudan 1 döndürür.
İpucu: 0!, geçerli girdi alanı ve long üst sınırını ayrı kontrol edin.
Kısa açıklama: 0 ve negatif girdiler sonlanmaz; büyük pozitif sonuçlar long'u taşır.
Açıklama: Doğru temel durum n==0 veya n<=1 olabilir, ancak negatif değerler önce reddedilmelidir. long ile 20!'ye kadar doğru sonuç alınır; daha büyüğü kontrol edilmezse sessizce sarılır.
Varsayım: n int'tir; hedef sözleşme n>=0, 0!=1 ve n>20 için taşma hatasıdır. Null girdi yoktur. Düzeltilmiş algoritma Θ(n) zaman ve recursive olduğu için Θ(n) stack alanı kullanır.
Etiketler: recursion, factorial, base-case, overflow

## A42-02 · Kod çıktısı
Konu: Recursive faktoriyel
Soru: Düzeltilmiş metot factorial(5) için ne döndürür?
Kod:
```java
static long factorial(int n) {
    if (n < 0) throw new IllegalArgumentException();
    if (n <= 1) return 1L;
    return Math.multiplyExact((long) n, factorial(n - 1));
}
```
Cevap: 120
Kabul: 120L
İpucu: 5 × 4 × 3 × 2 × 1 işlemini izleyin.
Kısa açıklama: 5! = 120'dir.
Açıklama: Çağrılar 5'ten 1'e iner, sonra dönüşte çarpımlar yapılır. Math.multiplyExact long taşmasını ArithmeticException ile görünür kılar; 5 için taşma yoktur.
Varsayım: n>=0 geçerlidir; negatifte IllegalArgumentException, n>20 için ArithmeticException oluşur; 0!=1. Null yoktur. Geçerli n için zaman Θ(n), çağrı stack alanı Θ(n)'dir.
Etiketler: recursive-factorial, multiplyExact, kod-ciktisi

# A43 · Orta · Kod okuma

Recursive Fibonacci çözümündeki tekrarlanan alt problemleri, zaman karmaşıklığını ve stack alanını değerlendirin.

```java
static int fib(int n) {
    if (n <= 1) {
        return n;
    }

    return fib(n - 1) + fib(n - 2);
}
```

Anahtar noktalar:
- Her çağrı iki çağrı daha yapar ve aynı alt problemler tekrar tekrar hesaplanır: `fib(5)` içinde `fib(2)` üç kez çağrılır
- Zaman üsteldir: Θ(φⁿ) (φ ≈ 1,618); sık söylenen O(2ⁿ) geçerli ama gevşek bir üst sınırdır
- Stack derinliği en fazla n'dir: alan Θ(n)
- Memoization ile her değer bir kez hesaplanır ve zaman Θ(n)'e iner
- Döngülü çözüm Θ(n) zaman ve Θ(1) alan kullanır; `int` F(46)'dan sonra taşar

## A43-01 · Tek seçim
Konu: Recursive Fibonacci
Soru: Naif recursive fib(n) için sıkı asimptotik zaman ve en büyük çağrı-stack alanı hangisidir?
Kod:
```java
if (n <= 1) return n;
return fib(n - 1) + fib(n - 2);
```
Şıklar:
- [x] a: Θ(φⁿ) zaman, Θ(n) stack
- [ ] b: Θ(n) zaman, Θ(1) stack
  Neden: Memoization olmadan alt problemler tekrar edilir.
- [ ] c: Θ(n²) zaman, Θ(n²) stack
  Neden: Çağrı sayısı polinom değil üsteldir; aynı anda tüm ağaç stackte tutulmaz.
- [ ] d: Θ(log n) zaman, Θ(log n) stack
  Neden: Girdi yarıya indirilmiyor.
İpucu: Çağrı ağacı dallanır; tek bir kökten yaprağa yolun uzunluğu n'dir.
Kısa açıklama: Naif çağrı sayısı Fibonacci gibi büyür: Θ(φⁿ); maksimum derinlik Θ(n)'dir.
Açıklama: fib(n-1) ve fib(n-2) aynı alt problemleri tekrar tekrar hesaplar. Toplam çağrı sayısı Θ(F_n)=Θ(φⁿ) iken aynı anda aktif olan en uzun zincir n seviyelidir. O(2ⁿ) geçerli fakat sıkı olmayan yaygın bir üst sınırdır.
Varsayım: 0<=n<=46 ile int sonucu taşmaz; negatif girdi reddedilir, null yoktur. φ altın orandır. Sıkı zaman Θ(φⁿ), stack yardımcı alanı Θ(n)'dir.
Etiketler: fibonacci, recursion, exponential, stack

## A43-02 · Kod çıktısı
Konu: Recursive Fibonacci
Soru: Naif fib(5) değerlendirilirken fib(2) metodu toplam kaç kez çağrılır?
Kod:
```java
static int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
```
Cevap: 3
İpucu: fib(5) ağacını fib(4)+fib(3), sonra alt dallar olarak açın.
Kısa açıklama: fib(2) üç ayrı dalda yeniden hesaplanır.
Açıklama: fib(4) içinde iki, fib(3) içinde bir fib(2) çağrısı vardır. Bu tekrar memoization ile her n değeri bir kez hesaplanarak giderilebilir ve zaman Θ(n)'e düşürülebilir.
Varsayım: n=5 negatif olmayan ve int taşması üretmeyen sabit girdidir; null yoktur. Bu çağrı için sayı sabittir; genel naif algoritma Θ(φⁿ) zaman, Θ(n) stack alanı kullanır.
Etiketler: fibonacci, repeated-subproblem, trace

# A44 · Orta · Kod yazma

Sıralı olmayan bir dizide toplamı hedefe eşit iki elemanın indekslerini `Map` kullanarak bulun.

Anahtar noktalar:
- Dizi bir kez dolaşılır; her eleman için gereken tamamlayıcı `target - a[i]` hesaplanır
- Tamamlayıcı `Map`'te varsa iki indeks döndürülür; yoksa elemanın değeri ve indeksi `Map`'e eklenir
- Kontrol eklemeden önce yapıldığı için aynı eleman iki kez kullanılmaz
- Beklenen zaman Θ(n), ek alan Θ(n); iç içe döngülü kaba kuvvet çözümü O(n²)'dir
- Birden çok çift varsa hangisinin döneceği ve çift yoksa ne döneceği sözleşmede belirtilir

## A44-01 · Kod çıktısı
Konu: Two sum
Soru: Metot twoSum(new int[]{2,7,11,15}, 9) için hangi indeksleri döndürür?
Kod:
```java
static int[] twoSum(int[] a, int target) {
    Map<Integer,Integer> seen = new HashMap<>();
    for (int i=0; i<a.length; i++) {
        int need = target - a[i];
        if (seen.containsKey(need)) return new int[]{seen.get(need), i};
        seen.put(a[i], i);
    }
    return new int[0];
}
```
Cevap: [0, 1]
Kabul: [0,1]
Kabul: 0,1
İpucu: 7 işlenirken gerekli tamamlayıcı 2 daha önce görülmüştür.
Kısa açıklama: 2 + 7 = 9 olduğundan indeksler [0,1]'dir.
Açıklama: Map yalnız önceki indeksleri içerdiği için aynı eleman iki kez kullanılmaz. i=1 anında need=2 bulunur ve kayıtlı indeks 0 ile mevcut indeks 1 döner.
Varsayım: a null değildir; çözüm yoksa boş int[] döner, birden çok çözümde taramada ilk bulunan döner. target-a[i] int taşması oluşturmayacak aralıktadır. Beklenen zaman Θ(n), alan Θ(n)'dir.
Etiketler: two-sum, hashmap, indices

## A44-02 · Çoklu seçim
Konu: Two sum
Soru: Tek geçişli Map tabanlı two-sum için doğru ifadeleri seçin.
Şıklar:
- [ ] a: Tamamlayıcıyı aramadan önce mevcut değeri Map'e koymak aynı indeksi iki kez kullanmayı önler
  Neden: Önce eklemek, target değerin iki katı olduğunda elemanın kendisiyle eşleşmesine izin verir; önce aranmalıdır.
- [x] b: Tek çözüm garantisi yoksa döndürülecek çift politikası belirtilmelidir
- [x] c: Beklenen zaman Θ(n), yardımcı alan en kötü Θ(n)'dir
- [ ] d: target ve value `int` aralığında olduğu sürece `target - value` işlemi taşmaz
  Neden: Yanlış; örneğin target pozitif ve value çok negatif olduğunda fark `int` aralığını aşabilir.
İpucu: Algoritma sözleşmesi, işlem sırası ve sayısal aralığı ayrı değerlendirin.
Kısa açıklama: Arama-önce-ekleme doğru indeksleri korur; sonuç politikası ve doğrusal/bellek maliyeti açıktır.
Açıklama: Map daha önce görülen değerleri indeksleriyle tutar. Birden çok çift varsa tarama sırasındaki ilk eşleşme doğal politikadır. int çıkarma taşabileceği için geniş aralıkta long tamamlayıcı veya açık sınır gerekir.
Varsayım: a null değildir; çözüm olmayabilir ve tekrar eden değerlere izin verilir. Bu kartta çıkarma taşmayacak girdiler veya long hesap kullanılır. Beklenen zaman Θ(n), patolojik hashte O(n²), alan Θ(n)'dir.
Etiketler: two-sum, hashmap, overflow, contract

# A45 · Orta · Kod yazma

Artan sıradaki bir dizide toplamı hedefe eşit iki elemanı two pointer tekniğiyle bulun.

Anahtar noktalar:
- `left` baştan, `right` sondan başlar; dizinin artan sırada olması gerekir
- Toplam hedefe eşitse iki indeks döndürülür
- Toplam küçükse `left` artırılır (toplam büyür), büyükse `right` azaltılır (toplam küçülür)
- Her adım bir adayı güvenle eler: zaman Θ(n), ek alan Θ(1)
- Toplamı `long` ile hesaplamak `int` taşmasını önler; dizi sıralı değilse `Map` çözümü kullanılır

## A45-01 · Kod çıktısı
Konu: Two pointer
Soru: Artan sıralı {-2,1,4,6,9} dizisinde hedef 10 için two-pointer metodu hangi indeksleri döndürür?
Kod:
```java
int left=0, right=a.length-1;
while (left<right) {
    long sum=(long)a[left]+a[right];
    if (sum==target) return new int[]{left,right};
    if (sum<target) left++; else right--;
}
return new int[0];
```
Cevap: [1, 4]
Kabul: [1,4]
Kabul: 1,4
İpucu: Önce -2+9=7 küçük olduğu için solu ilerletin.
Kısa açıklama: İndeks 1'deki 1 ile indeks 4'teki 9 toplamı 10'dur.
Açıklama: Sıralılık sayesinde küçük toplamda sol değer artırılır. İlk adımın ardından 1+9=10 bulunur. long toplam int ekleme taşmasını önler.
Varsayım: a null değildir ve artan sıralıdır; çözüm yoksa boş dizi, birden çok çözümde dıştan ilk bulunan çift döner. Toplam long hesaplanır. Zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: two-pointer, two-sum, sorted-array

## A45-02 · Tek seçim
Konu: Two pointer
Soru: Artan sıralı dizide toplam hedeften küçükse neden left artırılır?
Şıklar:
- [x] a: left artınca toplam büyür
- [ ] b: right artırılırsa dizi uzar
  Neden: İşaretçi hareketi dizinin boyutunu değiştirmez.
- [ ] c: left, hedef değerin indeksini gösterir
  Neden: left yalnız aday sınırdır.
- [ ] d: Bu hareket pozitif sayılarda doğrudur; dizide negatif sayı varsa onun yerine right azaltılmalıdır
  Neden: Monotonluk pozitiflikten değil sıralı olmaktan gelir; negatif sayılarda da left artırılır.
İpucu: Sıralılık altında sabit sol değerle sağ işaretçiyi sola çekmenin etkisini düşünün.
Kısa açıklama: Mevcut en büyük sağ adayla toplam bile küçükse mevcut sol hiçbir çözümde kullanılamaz.
Açıklama: right o anda kalan en büyük değerdir. a[left]+a[right]<target ise aynı left ile daha soldaki tüm sağ değerler daha küçük toplam verir; left güvenle elenir. Argüman negatif sayılarda da sıralılık sayesinde geçerlidir.
Varsayım: Dizi null değildir ve artan sıralıdır; boş/tek elemanda çift yoktur. Toplam long ile overflow-güvenlidir. Her indeks en fazla bir kez geçildiği için sıkı zaman Θ(n), alan Θ(1)'dir.
Etiketler: two-pointer, monotonicity, proof

# A46 · Orta · Kod yazma

Sıralı bir dizide tekrar eden elemanları ek dizi kullanmadan kaldırın ve benzersiz kısmın yeni uzunluğunu döndürün.

Anahtar noktalar:
- Sıralı dizide tekrarlar yan yanadır
- `write` bir sonraki benzersiz değerin yazılacağı konumu, `read` incelenen elemanı gösterir
- `a[read]` son yazılan değerden (`a[write - 1]`) farklıysa `a[write++]` konumuna yazılır
- Sonuç dizinin ilk `write` elemanıdır; bu uzunluk döndürülür, sonrası önemsizdir
- Boş dizi için 0 döner; zaman Θ(n), ek alan Θ(1)

## A46-01 · Kod çıktısı
Konu: Tekrar kaldırma
Soru: removeDuplicates({1,1,2,2,3}) çağrısı yeni uzunluk ve geçerli önek olarak ne üretir?
Kod:
```java
static int removeDuplicates(int[] a) {
    if (a.length == 0) return 0;
    int write=1;
    for (int read=1; read<a.length; read++) {
        if (a[read] != a[write-1]) a[write++] = a[read];
    }
    return write;
}
```
Cevap: 3; [1, 2, 3]
Kabul: 3;[1,2,3]
Kabul: 3,1,2,3
İpucu: write yalnız yeni bir değer görüldüğünde ilerler.
Kısa açıklama: Yeni uzunluk 3, geçerli önek [1,2,3]'tür.
Açıklama: Sıralılık tekrarları bitişik yapar. read yeni değer bulduğunda onu bir sonraki write konumuna yazar. Yeni uzunluktan sonraki hücrelerin içeriği sözleşme dışıdır.
Varsayım: a null değildir ve artan sıralıdır; boş dizi 0 döner, tekrar/eşitlik int düzeyindedir. İndisler taşmaz. Zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: two-pointer, remove-duplicates, in-place

## A46-02 · Boşluk doldurma
Konu: Tekrar kaldırma
Soru: Sıralı dizide read/write işaretçileriyle yerinde tekrar kaldırmanın sıkı zaman ve yardımcı alanını 'zaman, alan' biçiminde yazın.
Cevap: Θ(n), Θ(1)
Kabul: Theta(n), Theta(1)
Kabul: theta(n), theta(1)
İpucu: read diziyi bir kez tarar; yeni dizi kurulmaz.
Kısa açıklama: Zaman Θ(n), yardımcı alan Θ(1)'dir.
Açıklama: Her eleman read tarafından bir kez görülür ve en fazla bir kez yazılır. Sonuç aynı dizinin önek bölgesinde tutulduğu için birkaç indeks dışında ek bellek yoktur.
Varsayım: Dizi null değildir, artan sıralı ve boş olabilir. Değer/indis taşması yoktur. n>0 için sıkı zaman Θ(n), yardımcı alan Θ(1)'dir; n=0 sabit özel durumdur.
Etiketler: remove-duplicates, karmasiklik, in-place

# A47 · Orta · Kod yazma

Bir dizideki tüm sıfırları sona taşıyın; sıfır olmayan elemanların sırasını koruyun ve ek dizi kullanmayın.

Anahtar noktalar:
- `write` işaretçisi sıfır olmayan bir sonraki değerin yazılacağı konumu tutar
- İlk geçişte sıfır olmayan değerler okunma sırasıyla `write` konumlarına yazılır; sıraları korunur
- Ardından kalan konumlar sıfırla doldurulur
- Zaman Θ(n), ek alan Θ(1); dizi yerinde değişir
- Takaslı tek geçişli sürüm de aynı sonucu verir; yalnız yazma sayısı farklıdır

## A47-01 · Kod çıktısı
Konu: Sıfırları taşıma
Soru: moveZeroes({0,1,0,3,12}) tamamlandığında dizi nedir?
Kod:
```java
static void moveZeroes(int[] a) {
    int write=0;
    for (int value : a) if (value != 0) a[write++] = value;
    while (write < a.length) a[write++] = 0;
}
```
Cevap: [1, 3, 12, 0, 0]
Kabul: [1,3,12,0,0]
Kabul: 1,3,12,0,0
İpucu: Önce sıfır olmayanları sırayla öne yazın, kalan hücreleri sıfırla doldurun.
Kısa açıklama: Sıfır olmayanların sırası korunur ve iki sıfır sona gelir.
Açıklama: write bir sonraki sıfır olmayan değer konumudur. İlk geçiş [1,3,12,...] önekini kurar; ikinci geçiş kalan iki hücreyi sıfırlar.
Varsayım: a null değildir; boş/tümü sıfır/tümü sıfır olmayan diziler geçerlidir. Yalnız atama yapıldığından sayısal taşma yoktur. Zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: two-pointer, move-zeroes, stable

## A47-02 · Çoklu seçim
Konu: Sıfırları taşıma
Soru: Sıfırları sona taşıyan read/write çözümü için doğru özellikleri seçin.
Şıklar:
- [ ] a: Sıfır olmayan elemanların göreli sırası değişebilir; çözüm kararsızdır
  Neden: Sıfır olmayanlar okuma sırasıyla yazıldığı için göreli sıraları korunur.
- [x] b: Girdi dizisini yerinde değiştirir
- [x] c: Sıkı zaman Θ(n), yardımcı alan Θ(1)'dir
- [ ] d: Sonuçtan sonra dizinin uzunluğu azalır
  Neden: Dizi uzunluğu sabittir; yalnız elemanların konumu değişir.
İpucu: Değerler silinmez; yalnız yeniden düzenlenir.
Kısa açıklama: Çözüm kararlı, yerinde, doğrusal zamanlı ve sabit alanlıdır.
Açıklama: Sıfır olmayanlar okuma sırasıyla yazıldığı için kendi aralarındaki düzen korunur. Kalan hücrelere sıfır yazılır; Java dizisinin sabit uzunluğu değişmez.
Varsayım: Dizi null değildir ve boş olabilir; int değerler yalnız eşitlik testinden geçer, taşma yoktur. Her hücre en az okunur/yazılır: zaman Θ(n), alan Θ(1)'dir.
Etiketler: move-zeroes, in-place, stability

# A48 · Zorlayıcı · Kod yazma

Uzunluğu `k` olan ardışık alt diziler arasındaki en büyük toplamı bulun. Kaba kuvvet ve sabit boyutlu sliding window çözümlerini karşılaştırın.

Anahtar noktalar:
- Kaba kuvvet her pencerenin toplamını baştan hesaplar: Θ((n - k + 1) · k), k büyükse Θ(n²)
- Sliding window'da ilk k elemanın toplamı bir kez hesaplanır
- Her kaymada pencereden çıkan eleman çıkarılır, giren eklenir: her adım O(1), toplam Θ(n)
- En büyük toplam her kaymadan sonra güncellenir; ek alan Θ(1)
- Geçersiz girdiler (`k <= 0`, `k > n`) reddedilir; toplamı `long` tutmak taşmayı önler

## A48-01 · Kod çıktısı
Konu: Sliding window
Soru: maxWindowSum({2,1,5,1,3,2}, 3) hangi long değeri döndürür?
Kod:
```java
static long maxWindowSum(int[] a, int k) {
    if (a == null || k <= 0 || k > a.length) throw new IllegalArgumentException();
    long sum=0;
    for (int i=0; i<k; i++) sum += a[i];
    long best=sum;
    for (int r=k; r<a.length; r++) {
        sum += a[r]; sum -= a[r-k]; best=Math.max(best,sum);
    }
    return best;
}
```
Cevap: 9
Kabul: 9L
İpucu: Uzunluk 3 pencereleri: 2+1+5, 1+5+1, 5+1+3, 1+3+2.
Kısa açıklama: En büyük pencere 5+1+3=9'dur.
Açıklama: İlk toplam 8'dir; her kaymada çıkan değer çıkarılıp giren eklenir. Toplamlar 8,7,9,6 olur. Her eleman sabit sayıda işlenir.
Varsayım: a null değildir ve 1<=k<=a.length; boş dizi/geçersiz k IllegalArgumentException üretir. Toplam long ile hesaplanır ve long'u aşmayacak girdi kabul edilir. Zaman Θ(n), alan Θ(1)'dir.
Etiketler: sliding-window, fixed-window, max-sum

## A48-02 · Eşleştirme
Konu: Sliding window
Soru: Uzunluğu k olan maksimum alt dizi toplamı yaklaşımlarını maliyetleriyle eşleştirin.
Eşleşmeler:
- brute: Her başlangıçta k elemanı yeniden topla => nk: Θ((n-k+1)k) zaman, Θ(1) alan
- window: Çıkanı çıkarıp gireni ekleyen sliding window => n: Θ(n) zaman, Θ(1) alan
Fazladan seçenekler:
- decoy: Θ(n log n) zaman, Θ(n) alan
İpucu: Pencere toplamını baştan kurmakla yalnız iki değerle güncellemeyi karşılaştırın.
Kısa açıklama: Kaba kuvvet her pencereyi yeniden toplar; sliding window toplamı Θ(n)'de günceller.
Açıklama: n-k+1 pencerenin her biri k toplama isterse sıkı maliyet Θ((n-k+1)k)'dır; k n ile orantılıysa Θ(n²) olur. Sliding window ilk k toplamdan sonra her kaymayı sabit zamanda yapar.
Varsayım: a null değildir, 1<=k<=n ve n>0; toplam long sınırındadır. İki çözüm de Θ(1) yardımcı alan kullanır. Sıkı zamanlar kaba kuvvette Θ((n-k+1)k), sliding window'da Θ(n)'dir.
Etiketler: sliding-window, brute-force, complexity

# A49 · Zorlayıcı · Kod yazma

Tekrar etmeyen karakterlerden oluşan en uzun ardışık alt String’in uzunluğunu değişken boyutlu sliding window ile bulun.

Anahtar noktalar:
- Pencere `[left, right]` tekrar içermeyen bir alt metindir; `right` her adımda bir ilerler
- Her karakterin son görüldüğü indeks bir `Map`'te tutulur
- Karakter pencerenin içinde daha önce görüldüyse `left` o konumun bir sağına atlar; `left` hiç geri gitmez
- En iyi uzunluk her adımda `right - left + 1` ile güncellenir
- Her konum en fazla iki kez işlenir: zaman Θ(n), ek alan farklı karakter sayısı kadardır

## A49-01 · Kod çıktısı
Konu: Değişken sliding window
Soru: Tekrar etmeyen en uzun alt String algoritması lengthOfLongest("abcabcbb") için ne döndürür?
Kod:
```java
static int lengthOfLongest(String s) {
    Map<Character,Integer> last = new HashMap<>();
    int left=0, best=0;
    for (int right=0; right<s.length(); right++) {
        char c=s.charAt(right);
        if (last.containsKey(c) && last.get(c)>=left) left=last.get(c)+1;
        last.put(c,right);
        best=Math.max(best,right-left+1);
    }
    return best;
}
```
Cevap: 3
İpucu: abc tekrar içermeyen uzunluk 3 bir penceredir.
Kısa açıklama: En uzun tekrar etmeyen pencerelerin uzunluğu 3'tür.
Açıklama: abc, bca ve cab uzunluk 3'tür. Tekrar görüldüğünde left yalnız mevcut pencere içindeki önceki konumun bir sağına ilerler; geriye gitmez.
Varsayım: s null değildir; boş metin 0 döndürür. Karakter birimi UTF-16 char'dır; genel Unicode kod noktaları için uyarlanmalıdır, indeksler taşmaz. Beklenen zaman Θ(n), alan Θ(min(n, alfabe))'dir.
Etiketler: sliding-window, longest-substring, hashmap

## A49-02 · Sıralama
Konu: Değişken sliding window
Soru: Son görülen indeks Map'i kullanan tekrar etmeyen en uzun alt String döngüsünün adımlarını sıralayın.
Sıra:
1. read: right konumundaki karakteri oku
2. shrink: Karakter mevcut pencere içinde görülmüşse left'i önceki indeks + 1'e ilerlet
3. remember: Karakterin son indeksini right olarak güncelle
4. best: best'i right - left + 1 ile büyüt
İpucu: Önce eski konumla pencereyi düzeltin, sonra yeni konumu kaydedin.
Kısa açıklama: Karakter okunur, gerekirse sol sınır ilerler, son konum kaydedilir ve maksimum güncellenir.
Açıklama: left=Math.max(left,last+1) eşdeğer koruması sol sınırın geriye gitmesini engeller. Her right bir kez, left yalnız ileri gider; hash işlemleri ortalama sabitse toplam beklenen zaman doğrusaldır.
Varsayım: s null değildir; boşta 0 döner. Birim UTF-16 char'dır, Map sayaç/indeksleri taşmaz. Beklenen sıkı zaman Θ(n), k farklı pencere karakteri için alan Θ(k), hash kötü durumu O(n²)'dir.
Etiketler: variable-window, invariant, last-seen

# A50 · Zorlayıcı · Kod yazma

Linked list içinde döngü olup olmadığını slow/fast pointer yaklaşımıyla belirleyin. Ek bellek kullanan alternatifle karşılaştırın.

Örnek çözüm:
```java
class Node {
    int value;
    Node next;

    Node(int value) {
        this.value = value;
    }
}

// Floyd: fast iki, slow bir adım ilerler; döngü varsa fast, slow'a döngü
// içinde yetişir. Θ(n) zaman, Θ(1) ek bellek.
static boolean hasCycle(Node head) {
    Node slow = head;
    Node fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}

// Alternatif: görülen düğümleri saklamak. Zaman yine Θ(n),
// ama ek bellek Θ(n) olur.
static boolean hasCycleWithSet(Node head) {
    Set<Node> seen = new HashSet<>();
    for (Node current = head; current != null; current = current.next) {
        if (!seen.add(current)) return true;
    }
    return false;
}
```

Anahtar noktalar:
- Floyd: `slow` bir, `fast` iki adım ilerler; döngü varsa `fast` döngü içinde `slow`'a yetişir
- `fast` ya da `fast.next` null olursa liste biter ve döngü yoktur
- Zaman Θ(n), ek alan Θ(1)
- Alternatif: görülen düğümleri bir `HashSet`'te saklamak; aynı düğüm ikinci kez görülürse döngü vardır ama ek alan Θ(n)'dir
- Düğümler referanslarıyla karşılaştırılır; aynı değeri taşımak döngü kanıtı değildir

## A50-01 · Doğru / Yanlış
Konu: Linked list döngüsü
Soru: 1 -> 2 -> 3 -> 4 listesinin 4 düğümü tekrar 2'yi gösteriyorsa Floyd slow/fast algoritması sonunda slow == fast eşitliği görür.
Şıklar:
- [x] Doğru
  Neden: Doğru seçimdir; işaretçiler döngüye girdikten sonra modüler göreli mesafe kapanır.
- [ ] Yanlış
  Neden: Yanlış seçimdir; sonlu bir döngüde göreli hız farkı buluşmayı garanti eder.
İpucu: Döngü içinde hızlı işaretçi yavaşa göre her tur bir düğüm kazanır.
Kısa açıklama: Doğru. İki işaretçi döngü içinde sonlu sayıda adımda buluşur.
Açıklama: fast her tur iki, slow bir adım gider. İkisi cycle'a girdikten sonra aralarındaki modüler mesafe her tur bir azalır; cycle uzunluğu kadar tur içinde aynı düğüme gelirler.
Varsayım: head null olabilir; düğümler sonlu sayıdadır ve next ya null ya aynı listedeki düğümdür. Değerler kullanılmaz, aritmetik taşma yoktur. Zaman Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: cycle-detection, floyd, slow-fast

## A50-02 · Eşleştirme
Konu: Linked list döngüsü
Soru: Linked list döngüsü algılama yaklaşımlarını maliyetleriyle eşleştirin.
Eşleşmeler:
- set: Ziyaret edilen Node referanslarını Set'te tutma => set-cost: Beklenen Θ(n) zaman, Θ(n) yardımcı alan
- floyd: Slow/fast Floyd yaklaşımı => floyd-cost: Θ(n) zaman, Θ(1) yardımcı alan
Fazladan seçenekler:
- decoy: Θ(n²) zaman, Θ(1) yardımcı alan
İpucu: İki yöntem de düğümleri izler; yalnız biri geçmişin tamamını saklar.
Kısa açıklama: Set yaklaşımı doğrusal bellek, Floyd sabit bellek kullanır; ikisi de doğrusal zamanda bulabilir.
Açıklama: Set aynı Node referansı ikinci kez görüldüğünde cycle bildirir ve açıklaması doğrudandır. Floyd geçmişi saklamaz; farklı hızlarla buluşmayı kullanır. Identity tabanlı düğüm karşılaştırması önemlidir; yalnız value eşitliği cycle kanıtı değildir.
Varsayım: head null olabilir, erişilebilir düğüm sayısı n sonludur. Set Node kimliğini kullanır; değer/indis taşması yoktur. Set beklenen Θ(n) zaman/Θ(n) alan, Floyd sıkı Θ(n) zaman/Θ(1) alandır.
Etiketler: cycle-detection, hashset, floyd, space

## A50-03 · Sıralama
Konu: Linked list döngüsü
Soru: Floyd ile yalnız döngü varlığını belirleyen algoritmanın adımlarını sıralayın.
Sıra:
1. init: slow = head ve fast = head olarak başlat
2. guard: fast != null ve fast.next != null olduğu sürece döngüye gir
3. move: slow'u bir, fast'i iki düğüm ilerlet
4. meet: slow == fast ise true döndür
5. end: Döngü null sınıra ulaşıp biterse false döndür
İpucu: İki adım ilerlemeden önce fast ve fast.next güvenli olmalıdır.
Kısa açıklama: İşaretçiler başlatılır, güvenli koşulla farklı hızlarda ilerler; buluşma true, null'a ulaşma false'tur.
Açıklama: Guard kısa devre sırası fast.next erişimini null'a karşı korur. Acyclic listede fast sona ulaşır; cyclic listede göreli hız nedeniyle işaretçiler buluşur. Döngü girişini bulmak ayrı bir ikinci aşamadır ve bu kartın kapsamı değildir.
Varsayım: head null boş liste olabilir ve false verir; erişilebilir düğümler sonludur, next bağlantıları okuma sırasında değişmez. Sayısal taşma yoktur. Zaman sıkı Θ(n), yardımcı alan Θ(1)'dir.
Etiketler: floyd, cycle-detection, algorithm-steps
