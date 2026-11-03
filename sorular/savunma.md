<!-- Savunma sanayii yeni mezun yazılım mülakatlarında sorulan sorular. "Nerede soruldu" satırları aday beyanlarına ve ilanlara dayanır. Biçim için README.md içindeki "Soru ekleme ve düzenleme" bölümüne bakın. -->

# S01 · Orta · Teori

Alan: C/C++
Şirket: ASELSAN

Memory leak nedir, nasıl önlenir? C ve C++ için önleme yollarını ve gömülü sistemlerdeki yaklaşımı anlatın.

Nerede soruldu: ASELSAN (aday beyanı).

Anahtar noktalar:
- Tanım: heap'te ayrılıp serbest bırakılmayan ve artık erişilemeyen bellek
- C'de her `malloc` için tek bir `free`; hata yollarında da serbest bırakmak
- C++'ta RAII ve akıllı işaretçiler (`std::unique_ptr`, `std::shared_ptr`)
- Tespit araçları: Valgrind, AddressSanitizer ve statik analiz
- Gömülüde çalışma sırasında dinamik tahsisten kaçınmak; statik veya havuz (pool) tahsisi

## S01-01 · Çoklu seçim
Konu: C/C++ bellek yönetimi
Soru: C/C++'ta memory leak'i önlemeye veya bulmaya yardımcı olan uygulamaları seçin.
Şıklar:
- [x] a: Kaynağı bir nesnenin ömrüne bağlayan RAII ve `std::unique_ptr` kullanmak
  Neden: Nesne kapsamdan çıkınca yıkıcı belleği kendiliğinden serbest bırakır.
- [x] b: Testleri Valgrind veya AddressSanitizer altında çalıştırmak
  Neden: Bu araçlar serbest bırakılmayan blokları çalışma sırasında raporlar.
- [ ] c: Kullanılan bloğun işaretçisini `free` çağırmadan `NULL` yapmak
  Neden: İşaretçiyi `NULL` yapmak bloğu serbest bırakmaz; `free` çağrılmazsa sızıntı tam da böyle oluşur.
- [x] d: Gömülü yazılımda başlangıçtan sonra dinamik bellek tahsisinden kaçınmak
  Neden: Tahsis yalnız başlangıçta yapılırsa çalışma sırasında sızıntı ve parçalanma riski ortadan kalkar.
- [ ] e: Belleği büyütürken `realloc` sonucunu doğrudan aynı işaretçiye atamak (`p = realloc(p, n)`)
  Neden: Yanlış; `realloc` başarısız olunca `NULL` döner ve özgün bloğun adresi kaybolur; sonuç önce geçici bir işaretçide denetlenmelidir.
İpucu: Sızıntı, heap'te ayrılan ve artık erişilemeyen ama serbest bırakılmamış bellektir.
Kısa açıklama: RAII, akıllı işaretçiler, sızıntı araçları ve gömülüde statik tahsis sızıntıyı önler.
Açıklama: Memory leak, ayrılan heap belleğin serbest bırakılmadan erişiminin kaybedilmesidir. C++'ta RAII ve akıllı işaretçiler serbest bırakmayı kapsam sonuna bağlar; Valgrind ve ASan sızıntıyı test sırasında gösterir. Gömülü sistemlerde dinamik tahsis çoğu zaman tamamen yasaklanır veya yalnız başlangıçta yapılır.
Etiketler: c, cpp, bellek, raii

# S02 · Orta · Teori

Alan: C/C++

`volatile` anahtar kelimesi ne işe yarar? Ne zaman gereklidir ve neyi garanti etmez?

Nerede soruldu: klasik gömülü yazılım sorusu.

Anahtar noktalar:
- Derleyicinin değişkeni register'da tutup okumayı optimize etmesini engeller
- Kullanım: donanım register'ları, ISR ile paylaşılan bayraklar, memory-mapped I/O
- Atomiklik sağlamaz; `count++` gibi okuma-değiştirme-yazma işlemi kesilebilir
- Thread senkronizasyonu veya bellek sıralaması garantisi vermez; mutex ya da atomik tipler gerekir

## S02-01 · Tek seçim
Konu: volatile
Soru: Bir ISR'nin güncellediği bayrak değişkeni neden `volatile` tanımlanır?
Şıklar:
- [x] a: Derleyicinin değişkeni register'da önbelleğe alıp döngüde yeniden okumayı atlamasını engellemek için
- [ ] b: Değişkene erişimi atomik yapıp okuma-değiştirme-yazma işleminin kesilmesini önlemek için
  Neden: volatile atomiklik sağlamaz; okuma, değiştirme ve yazma adımları yine bölünebilir.
- [ ] c: Değişkeni ISR ile ana döngü arasında otomatik bir mutex ile korumak için
  Neden: volatile kilit veya karşılıklı dışlama sağlamaz.
- [ ] d: Değişkenin ROM'a yerleştirilmesi için
  Neden: Yerleşim const ve linker betiğiyle ilgilidir; volatile bununla ilgili değildir.
İpucu: Derleyici, kodun dışında değişebilecek bir değeri bilemez.
Kısa açıklama: volatile, değişkenin her erişimde gerçekten bellekten okunmasını sağlar.
Açıklama: Optimizasyon açıkken derleyici, döngü içinde değişmediğini düşündüğü bir değişkeni register'da tutabilir ve ISR'nin yaptığı güncellemeyi hiç görmez. volatile her okuma ve yazmanın bellek üzerinden yapılmasını sağlar; donanım register'ları ve ISR ile paylaşılan bayraklar için gereklidir. Atomiklik ve sıralama garantisi vermez.
Etiketler: volatile, gömülü, isr

## S02-02 · Doğru / Yanlış
Konu: volatile
Soru: `volatile` tanımlanmış bir sayaçta `count++`, her erişim bellekten yapıldığı için ISR ile ana döngü arasında güvenli ve atomik bir artırmadır.
Şıklar:
- [ ] Doğru
  Neden: `volatile` yalnız her erişimin bellekten yapılmasını sağlar; artırma okuma, toplama ve yazma adımlarına bölünür.
- [x] Yanlış
  Neden: Doğru; atomiklik için kesmeleri kısa süre kapatmak veya atomik bir tip kullanmak gerekir.
İpucu: `count++` kaç ayrı adımdan oluşur?
Kısa açıklama: `volatile` atomiklik sağlamaz.
Açıklama: `count++` değeri okur, bir ekler ve geri yazar. Bu adımların arasında bir kesme gelip aynı değişkeni değiştirirse güncelleme kaybolur. Çözüm kritik bölümde kesmeleri kısa süre kapatmak ya da atomik işlemler kullanmaktır.
Etiketler: volatile, atomiklik

# S03 · Orta · Teori

Alan: C/C++

`const int*`, `int* const` ve `const` üye fonksiyon arasındaki farkları açıklayın.

Nerede soruldu: klasik C/C++ sorusu.

Anahtar noktalar:
- `const int* p`: gösterilen veri değiştirilemez, işaretçi başka adrese yöneltilebilir
- `int* const p`: işaretçi sabittir, gösterdiği veri değiştirilebilir
- `const int* const p`: ikisi de sabittir
- `const` üye fonksiyon nesneyi değiştirmez ve const nesnelerde çağrılabilir
- Kural: `const` solundakine, solunda bir şey yoksa sağındakine uygulanır

## S03-01 · Eşleştirme
Konu: const ve işaretçiler
Soru: Bildirimleri anlamlarıyla eşleştirin.
Eşleşmeler:
- ptrToConst: const int* p => dataFixed: p başka adrese gösterilebilir ama *p üzerinden değer değiştirilemez
- constPtr: int* const p => ptrFixed: p başka adrese gösterilemez ama *p değiştirilebilir
- both: const int* const p => bothFixed: Ne işaretçi ne de gösterdiği değer değiştirilebilir
- member: int get() const => noMutate: Fonksiyon nesnenin üye alanlarını değiştiremez
Fazladan seçenekler:
- decoy: İşaretçi derleme zamanında sabit bir adrese yerleştirilir
İpucu: const, solundaki öğeye; solunda bir şey yoksa sağındakine uygulanır.
Kısa açıklama: const'un yıldıza göre konumu, sabit olanın veri mi işaretçi mi olduğunu belirler.
Açıklama: const int* (int const* ile aynı) gösterilen veriyi salt okunur yapar; int* const işaretçinin kendisini sabitler. Üye fonksiyondaki const, fonksiyonun this üzerinden nesneyi değiştirmeyeceğini söyler ve const nesneler üzerinde çağrılabilmesini sağlar.
Etiketler: const, işaretçi, cpp

# S04 · Orta · Teori

Alan: C/C++

C/C++'ta `static` anahtar kelimesinin farklı kullanımlarını açıklayın.

Nerede soruldu: klasik C/C++ sorusu.

Anahtar noktalar:
- Fonksiyon içinde: bir kez başlatılır, program boyunca yaşar ve değerini korur
- Dosya kapsamında: iç bağlantı (internal linkage); yalnız o kaynak dosyada görünür
- Sınıf üyesinde: nesneye değil sınıfa aittir; tek kopya paylaşılır
- `static` üye fonksiyonun `this` işaretçisi yoktur

## S04-01 · Eşleştirme
Konu: static
Soru: static kullanımlarını etkileriyle eşleştirin.
Eşleşmeler:
- local: Fonksiyon içindeki static değişken => lifetime: Program boyunca yaşar ve çağrılar arasında değerini korur
- file: Dosya kapsamındaki static fonksiyon veya değişken => linkage: Yalnız tanımlandığı kaynak dosyadan görülebilir
- member: Sınıfın static veri üyesi => shared: Tüm nesneler arasında tek bir kopya olarak paylaşılır
Fazladan seçenekler:
- decoy: Değişkeni salt okunur yapar ve değiştirilmesini engeller
İpucu: Aynı kelime kapsama göre ömür, görünürlük veya paylaşım anlamına gelir.
Kısa açıklama: static yerel değişkende kalıcı ömür, dosya kapsamında iç bağlantı, sınıfta paylaşılan üye demektir.
Açıklama: Fonksiyon içindeki static değişken bir kez başlatılır ve program boyunca yaşar. Dosya kapsamında static, sembolü diğer çeviri birimlerinden gizler (internal linkage). Sınıfın static üyesi nesneye değil sınıfa aittir. Salt okunurluk const'un işidir.
Etiketler: static, c, cpp

## S04-02 · Kod çıktısı
Konu: static yerel değişken
Soru: Programın çıktısını yazın.
Kod:
```c
#include <stdio.h>

int next_id(void) {
    static int count = 0;
    count++;
    return count;
}

int main(void) {
    next_id();
    next_id();
    printf("%d\n", next_id());
    return 0;
}
```
Cevap: 3
İpucu: `count` her çağrıda yeniden mi başlatılıyor?
Kısa açıklama: `static` yerel değişken bir kez başlatılır ve çağrılar arasında değerini korur; üçüncü çağrı 3 döndürür.
Açıklama: `static int count = 0;` başlatması program boyunca bir kez yapılır; her çağrı aynı `count` değişkenini artırır. `static` olmasaydı her çağrıda yeni bir yerel değişken oluşur ve fonksiyon hep 1 döndürürdü.
Etiketler: c, static

# S05 · Orta · Teori

Alan: C/C++
Şirket: ASELSAN

C++'ta virtual fonksiyonlar nasıl çalışır? Taban sınıfın yıkıcısı neden virtual olmalıdır?

Nerede soruldu: ASELSAN gömülü yazılım (C++ OOP, aday beyanı).

Anahtar noktalar:
- Virtual çağrı çalışma zamanında nesnenin gerçek tipine göre seçilir
- Tipik uygulama: her nesnede bir vptr, her sınıfta bir vtable
- Taban sınıf işaretçisiyle silinen nesnede yıkıcı virtual değilse davranış tanımsızdır
- Saf virtual fonksiyon (`= 0`) sınıfı soyut yapar
- Maliyet: dolaylı çağrı ve inline edilememe

## S05-01 · Tek seçim
Konu: Virtual yıkıcı
Soru: `Base* p = new Derived(); delete p;` satırında `Base`'in yıkıcısı virtual değilse ne olur?
Şıklar:
- [ ] a: Derleyici hata verir; taban sınıf işaretçisiyle delete yapılamaz
  Neden: Kod derlenir; sorun çalışma zamanındaki davranıştadır.
- [x] b: Davranış tanımsızdır; pratikte yalnız Base yıkıcısı çalışır ve Derived'ın kaynakları sızabilir
- [ ] c: Önce Derived sonra Base yıkıcısı çalışır, çünkü delete her zaman dinamik tipi kullanır ve virtual gerekmez
  Neden: Dinamik tipe göre yıkıcı seçimi yalnız yıkıcı virtual olduğunda yapılır.
- [ ] d: Bellek hiç serbest bırakılmaz
  Neden: Bellek serbest bırakılabilir; asıl sorun türetilmiş yıkıcının atlanmasıdır.
İpucu: Yıkıcı seçimi statik tipe mi, dinamik tipe mi göre yapılıyor?
Kısa açıklama: Taban sınıf işaretçisiyle silinen nesnelerde yıkıcı virtual olmalıdır.
Açıklama: Virtual olmayan bir yıkıcı statik tipe göre çağrılır; Derived'ın yıkıcısı çalışmaz ve davranış tanımsızdır. Çok biçimli kullanılacak her taban sınıfın yıkıcısı virtual (veya protected ve non-virtual) olmalıdır.
Etiketler: virtual, yıkıcı, cpp

## S05-02 · Doğru / Yanlış
Konu: vtable
Soru: Virtual fonksiyonu olan bir sınıfın nesneleri, yaygın derleyicilerde sınıfın vtable'ını gösteren gizli bir işaretçi (vptr) taşır.
Şıklar:
- [x] Doğru
  Neden: Doğru; dinamik bağlama çağrıyı bu tablodaki fonksiyon adresi üzerinden yapar.
- [ ] Yanlış
  Neden: Standart bunu şart koşmasa da yaygın derleyicilerin hepsi vptr ve vtable kullanır.
İpucu: Çalışma zamanında hangi fonksiyonun çağrılacağı nasıl bulunur?
Kısa açıklama: Dinamik bağlama vptr/vtable ile gerçekleşir.
Açıklama: Her çok biçimli sınıfın virtual fonksiyon adreslerini tutan bir tablosu vardır; nesne kurulurken vptr bu tabloyu gösterecek şekilde ayarlanır. Virtual çağrı vptr üzerinden tablodaki adrese dolaylı bir sıçramadır.
Etiketler: virtual, vtable

## S05-03 · Kod çıktısı
Konu: Virtual yıkıcı
Soru: Programın çıktısını satır satır yazın.
Kod:
```cpp
#include <iostream>

struct Base {
    virtual ~Base() { std::cout << "Base\n"; }
};

struct Derived : Base {
    ~Derived() override { std::cout << "Derived\n"; }
};

int main() {
    Base* p = new Derived();
    delete p;
    return 0;
}
```
Cevap:
```
Derived
Base
```
İpucu: Yıkıcılar kurucuların ters sırasıyla çalışır.
Kısa açıklama: Yıkıcı virtual olduğu için önce `Derived`, sonra `Base` yıkıcısı çalışır.
Açıklama: `delete p`, virtual yıkıcı sayesinde nesnenin gerçek tipi olan `Derived` sınıfının yıkıcısını çağırır; o bitince taban sınıfın yıkıcısı otomatik olarak çalışır. `Base` sınıfının yıkıcısı virtual olmasaydı davranış tanımsız olurdu ve pratikte yalnız `Base` yazdırılabilirdi.
Etiketler: cpp, virtual, yıkıcı

# S06 · Zorlayıcı · Teori

Alan: C/C++

Kopya kurucu, atama operatörü ve move semantiğini açıklayın. Rule of three ve rule of five ne söyler?

Nerede soruldu: klasik C++ sorusu.

Anahtar noktalar:
- Ham kaynak sahibi sınıfta varsayılan kopya yüzeyseldir; çift silmeye yol açar
- Rule of three: yıkıcı, kopya kurucu ve kopya atama birlikte tanımlanır
- Rule of five: bunlara move kurucu ve move atama eklenir
- Move kaynağı kopyalamadan devralır; `std::move` yalnız rvalue'ya çevirir
- Rule of zero: kaynağı `std::unique_ptr` gibi sınıflara bırakıp hiçbirini yazmamak

## S06-01 · Çoklu seçim
Konu: Rule of three/five
Soru: Ham bir işaretçiyle heap belleği sahiplenen bir C++ sınıfı için doğru ifadeleri seçin.
Şıklar:
- [x] a: Derleyicinin ürettiği kopya kurucu yüzeysel kopya yapar ve iki nesne aynı belleği siler
  Neden: Doğru; çift silme (double free) tanımsız davranıştır.
- [x] b: Yıkıcı, kopya kurucu ve kopya atama operatöründen biri gerekiyorsa genellikle üçü de gerekir
  Neden: Rule of three budur.
- [ ] c: `std::move` nesneyi kendi başına taşır ve kaynak nesneyi siler
  Neden: `std::move` yalnız bir rvalue dönüşümüdür; taşımayı move kurucusu veya move atama operatörü yapar.
- [x] d: Move kurucusu kaynağın işaretçisini devralıp kaynak nesnedeki işaretçiyi boşaltabilir
  Neden: Doğru; böylece derin kopya yapılmaz.
- [ ] e: Yıkıcıyı yazmak kopyalamayı da güvenli hâle getirir
  Neden: Kopyalar yine aynı işaretçiyi paylaşır ve çift silme oluşur.
İpucu: Varsayılan kopya işaretçinin kendisini mi, gösterdiği veriyi mi kopyalar?
Kısa açıklama: Kaynak sahibi sınıflar kopya ve taşıma işlemlerini birlikte tanımlamalıdır.
Açıklama: Varsayılan kopya üyeleri tek tek kopyalar; ham işaretçide bu iki nesnenin aynı belleği sahiplenmesi demektir. Rule of three yıkıcı, kopya kurucu ve kopya atamanın birlikte yazılmasını; rule of five buna move kurucu ve move atamayı ekler. En iyisi kaynağı `unique_ptr` gibi bir sınıfa bırakıp hiçbirini yazmamaktır (rule of zero).
Etiketler: cpp, move, kopya

# S07 · Kolay · Karşılaştırma

Alan: C/C++

`malloc`/`free` ile `new`/`delete` arasındaki farklar nelerdir?

Nerede soruldu: klasik C/C++ sorusu.

Anahtar noktalar:
- `new` bellek ayırıp kurucuyu çağırır; `delete` yıkıcıyı çağırıp belleği bırakır
- `malloc`/`free` yalnız ham bellek verir; kurucu ve yıkıcı çalışmaz
- `new` hatada `std::bad_alloc` fırlatır; `malloc` NULL döner
- `new` tipli işaretçi döner; `malloc` `void*` döner
- Çiftler karıştırılmaz: `new`/`delete`, `new[]`/`delete[]`, `malloc`/`free`

## S07-01 · Tek seçim
Konu: Dinamik bellek
Soru: `malloc`/`free` ile `new`/`delete` arasındaki temel fark hangisidir?
Şıklar:
- [ ] a: `malloc` daha hızlı olduğu için C++ nesnelerinde `new` yerine tercih edilmelidir
  Neden: Hız bir ölçüt değildir; `malloc` kurucu çağırmadığı için C++ nesnelerinde yanlış kullanımdır.
- [ ] b: İkisi de aynı şeyi yapar; yazımları farklıdır ve birbirleriyle karıştırılabilir
  Neden: Kurucu/yıkıcı çağrısı ve tip güvenliği farklıdır; `new` ile alınan bellek `free` ile bırakılamaz.
- [x] c: `new` kurucuyu, `delete` yıkıcıyı çağırır; `malloc` ve `free` çağırmaz
- [ ] d: `new` başarısız olunca `NULL` döner
  Neden: Varsayılan `new` başarısızlıkta `std::bad_alloc` fırlatır; `NULL` dönen `malloc`'tur.
İpucu: Nesnenin yaşam döngüsünü kim başlatıyor?
Kısa açıklama: `new`/`delete` nesne yaşam döngüsünü yönetir; `malloc`/`free` yalnız ham bellek verir.
Açıklama: `new` bellek ayırıp kurucuyu çağırır, doğru tipte işaretçi döndürür ve başarısızlıkta exception fırlatır. `malloc` yalnız boyut kadar ham bellek ayırır, `void*` döndürür ve başarısızlıkta `NULL` verir. Eşleşmeyen çiftler (`new`/`free`, `malloc`/`delete`) tanımsız davranıştır.
Etiketler: cpp, bellek

## S07-02 · Doğru / Yanlış
Konu: Dinamik bellek
Soru: `new` ile ayrılan nesneyi `free` ile bırakmak, kaynak tutmayan basit sınıflarda güvenlidir; eksik kalan tek şey yıkıcı çağrısıdır.
Şıklar:
- [ ] Doğru
  Neden: Yıkıcı çalışmaz ve iki tahsisçi farklı olabilir; davranış tanımsızdır.
- [x] Yanlış
  Neden: Doğru; new ile alınan delete, malloc ile alınan free ile bırakılır.
İpucu: free yıkıcıyı çağırır mı?
Kısa açıklama: new ile delete, malloc ile free eşleştirilmelidir.
Açıklama: free yalnız malloc ailesinden gelen belleği bırakmak içindir ve yıkıcı çağırmaz. new ile oluşturulan bir nesneyi free ile bırakmak hem yıkıcıyı atlar hem de tahsisçiler farklıysa yığını bozabilir.
Etiketler: cpp, bellek

# S08 · Orta · Kod okuma

Alan: C/C++
Şirket: Baykar

Verilen C kodunun çıktısını bulun ve koddaki hatayı gösterin. İşaretsiz taşma, pointer aritmetiği ve operatör önceliği tuzaklarını açıklayın.

Nerede soruldu: Baykar kontrol sınavı (C/C++ hata bulma, aday beyanı).

Anahtar noktalar:
- İşaretsiz taşma tanımlıdır ve sarar (`0u - 1` = `UINT_MAX`); işaretli taşma tanımsızdır
- Pointer aritmetiği eleman boyutu kadar ilerler; `a[i]` ile `*(a + i)` aynıdır
- Operatör önceliği tuzakları: `*p++`, `a & b == c` gibi ifadeler
- Dizi sınırı dışına erişim ve başlatılmamış değişken tanımsız davranıştır
- Kodu satır satır izleyip her değişkenin değerini yazarak ilerlemek

## S08-01 · Kod çıktısı
Konu: İşaretsiz taşma
Soru: Programın çıktısını yazın.
Kod:
```c
#include <stdio.h>

int main(void) {
    unsigned int x = 0;
    x = x - 1;
    printf("%u\n", x);
    return 0;
}
```
Cevap: 4294967295
İpucu: İşaretsiz tamsayılar modüler aritmetikle sarar.
Kısa açıklama: 0'dan 1 çıkarmak işaretsiz tipte UINT_MAX değerine sarar.
Açıklama: İşaretsiz aritmetik 2^32 modunda tanımlıdır; 0 - 1 sonucu 4294967295 olur. İşaretli tamsayı taşması ise tanımsız davranıştır. Bu yüzden sayaç ve indeks hesaplarında işaretsiz tiplerle eksiltme yaparken dikkatli olmak gerekir.
Varsayım: unsigned int 32 bittir.
Etiketler: c, taşma, unsigned

## S08-02 · Tek seçim
Konu: Pointer aritmetiği
Soru: Program ne yazdırır?
Kod:
```c
#include <stdio.h>

int main(void) {
    int a[4] = {1, 2, 3, 4};
    int *p = a;
    printf("%d\n", *(p + 2));
    return 0;
}
```
Şıklar:
- [x] a: 3
- [ ] b: Dizinin başlangıç adresine 2 bayt eklenmiş adresteki değer
  Neden: Pointer aritmetiği bayt değil eleman boyutu kadar ilerler; p + 2 üçüncü elemandır.
- [ ] c: 2, çünkü indeks 1'den başlar
  Neden: C dizileri 0'dan başlar; *(p + 2), a[2] ile aynıdır.
- [ ] d: Derleme hatası
  Neden: İfade geçerlidir ve a[2] ile aynıdır.
İpucu: p + 2, iki int ileri gider.
Kısa açıklama: *(p + 2) ifadesi a[2], yani 3'tür.
Açıklama: Bir işaretçiye n eklemek onu n eleman (n * sizeof(int) bayt) ilerletir. a[i] ifadesi tanım gereği *(a + i) ile aynıdır; bu yüzden *(p + 2) üçüncü elemanı verir.
Etiketler: c, işaretçi

## S08-03 · Kod çıktısı
Konu: İşaretli ve işaretsiz karşılaştırma
Soru: Programın çıktısını yazın.
Kod:
```c
#include <stdio.h>

int main(void) {
    int i = -1;
    unsigned int u = 1;
    printf("%d\n", i < u);
    return 0;
}
```
Cevap: 0
İpucu: Karşılaştırmadan önce iki taraf ortak bir tipe dönüştürülür.
Kısa açıklama: `i` işaretsiz tipe dönüşüp `UINT_MAX` olur; `i < u` yanlıştır ve 0 yazdırılır.
Açıklama: `int` ile `unsigned int` karşılaştırılırken olağan aritmetik dönüşümler `int` değerini `unsigned int` tipine çevirir. -1, 32 bitte 4294967295 olur ve 1'den küçük değildir; karşılaştırma 0 üretir. Derleyiciler bu tuzak için `-Wsign-compare` uyarısı verebilir; uzunluk ve indeks hesaplarında işaretli ve işaretsiz tipleri karıştırmamak gerekir.
Varsayım: `int` ve `unsigned int` 32 bittir.
Etiketler: c, unsigned, dönüşüm

## S08-04 · Tek seçim
Konu: Sarkan işaretçi
Soru: Girdi kısa olsa bile bu fonksiyonun her çağrısında sorun çıkaran hata hangisidir?
Kod:
```c
#include <string.h>

char *copy_name(const char *name) {
    char buffer[32];
    strcpy(buffer, name);
    return buffer;
}
```
Şıklar:
- [ ] a: `strcpy` sonlandırıcı `'\0'` karakterini kopyalamaz; dönen metin sonlanmamış kalır
  Neden: `strcpy` sonlandırıcı karakteri de kopyalar.
- [ ] b: `const char*` parametresi `strcpy` fonksiyonuna verilemez; kod derlenmez
  Neden: `strcpy` kaynak olarak zaten `const char*` alır; kod derlenir.
- [x] c: Fonksiyon dönünce ömrü biten yerel dizinin adresini döndürür
- [ ] d: `buffer` sıfırla başlatılmadığı için kopyalanan metin bozulur
  Neden: `strcpy` hedefi baştan yazar ve sonlandırıcıyı koyar; başlangıç değeri önemli değildir.
İpucu: `buffer` hangi bellek bölgesinde yaşar ve ne zaman yok olur?
Kısa açıklama: Yerel dizinin adresini döndürmek sarkan (dangling) işaretçi üretir.
Açıklama: `buffer` stack'te yaşar ve fonksiyon dönünce ömrü biter; dönen işaretçiyle yapılan her erişim tanımsız davranıştır. Düzeltmek için çağıran, tamponu ve boyutunu parametre olarak vermeli ya da bellek `malloc` ile ayrılıp serbest bırakma işi çağırana bırakılmalıdır. 31 karakterden uzun girdilerde ayrıca taşma vardır; `strcpy` yerine boyut sınırı olan bir kopyalama kullanılmalıdır.
Etiketler: c, işaretçi, stack

# S09 · Orta · Kod yazma

Alan: C/C++

Bir register'da n. biti set, clear ve toggle edin; sistemin endianness'ını test eden bir kod yazın.

Nerede soruldu: klasik gömülü yazılım sorusu.

Anahtar noktalar:
- Set: `reg |= (1u << n)`, clear: `reg &= ~(1u << n)`, toggle: `reg ^= (1u << n)`
- Bit okuma: `(reg >> n) & 1u`
- İşaretsiz tip kullanmak; işaretli kaydırmada tanımsız davranış riski
- Endianness testi: çok baytlı değerin ilk baytını `uint8_t*` ile okumak
- Ağ düzeni big-endian'dır; `htonl`/`ntohl` ile dönüşüm yapılır

## S09-01 · Eşleştirme
Konu: Bit işlemleri
Soru: İşlemleri doğru ifadelerle eşleştirin.
Eşleşmeler:
- set: n. biti 1 yap => orAssign: reg |= (1u << n)
- clear: n. biti 0 yap => andNotAssign: reg &= ~(1u << n)
- toggle: n. biti tersle => xorAssign: reg ^= (1u << n)
- test: n. biti oku => andTest: (reg >> n) & 1u
Fazladan seçenekler:
- decoy: reg = (1u << n)
İpucu: OR biti açar, AND ile tersi alınmış maske kapatır, XOR tersler.
Kısa açıklama: Bit işlemleri maske ve kaydırmayla yapılır.
Açıklama: (1u << n) yalnız n. biti 1 olan maskedir. OR ile birleştirmek biti açar, ~maske ile AND biti kapatır, XOR biti tersler. reg = (1u << n) ise diğer tüm bitleri sildiği için register'da tek bit değiştirmek için yanlıştır.
Etiketler: bit, gömülü, register

## S09-02 · Tek seçim
Konu: Endianness
Soru: `uint32_t v = 0x01020304;` değerinin en düşük adresteki baytı `0x04` okunuyorsa sistem hangi düzendedir?
Şıklar:
- [x] a: Little-endian; en düşük anlamlı bayt en düşük adreste saklanır
- [ ] b: Big-endian; en anlamlı bayt en düşük adrestedir
  Neden: Big-endian'da ilk bayt 0x01 okunurdu.
- [ ] c: Bu yöntemle endianness anlaşılamaz
  Neden: char* ile ilk baytı okumak endianness'ı doğrudan gösterir.
- [ ] d: Middle-endian; baytlar ikişer ikişer ters dizilir
  Neden: Bu nadir görülen bir düzendir; ilk bayt 0x04 ise düzen little-endian'dır.
İpucu: İlk adreste hangi uçtaki bayt duruyor?
Kısa açıklama: En düşük adreste en düşük anlamlı bayt varsa sistem little-endian'dır.
Açıklama: Endianness, çok baytlı bir değerin baytlarının bellekteki sırasıdır. x86 ve çoğu ARM yapılandırması little-endian'dır; ağ protokolleri ise big-endian (network byte order) kullanır. Bu yüzden haberleşmede htonl/ntohl gibi dönüşümler gerekir.
Etiketler: endianness, gömülü

## S09-03 · Kod çıktısı
Konu: Bit işlemleri
Soru: Programın çıktısını yazın.
Kod:
```c
#include <stdio.h>

int main(void) {
    unsigned int reg = 0x0F;
    reg &= ~(1u << 2);
    reg |= (1u << 7);
    printf("0x%X\n", reg);
    return 0;
}
```
Cevap: 0x8B
İpucu: Önce 2. biti temizleyin, sonra 7. biti açın; bitler 0'dan sayılır.
Kısa açıklama: 0x0F'te 2. bit temizlenince 0x0B, ardından 7. bit açılınca 0x8B olur.
Açıklama: 0x0F ikilik tabanda 0000 1111'dir. `reg &= ~(1u << 2)` 2. biti sıfırlar: 0000 1011, yani 0x0B. `reg |= (1u << 7)` 7. biti açar: 1000 1011, yani 0x8B. `%X` onaltılık değeri büyük harflerle yazdırır.
Etiketler: c, bit, register

# S10 · Orta · Teori

Alan: C/C++

C++ akıllı işaretçi türlerini ve aralarındaki farkları açıklayın.

Nerede soruldu: klasik C++ sorusu.

Anahtar noktalar:
- `std::unique_ptr`: tek sahiplik; kopyalanamaz, taşınabilir, ek maliyeti yok
- `std::shared_ptr`: referans sayacıyla ortak sahiplik
- `std::weak_ptr`: sayacı artırmadan gözlemler, shared_ptr döngülerini kırar
- `std::make_unique` ve `std::make_shared` tercih edilir
- C++'ta çöp toplayıcı yoktur; bellek sahiplik kurallarıyla yönetilir

## S10-01 · Eşleştirme
Konu: Akıllı işaretçiler
Soru: Akıllı işaretçileri sahiplik modelleriyle eşleştirin.
Eşleşmeler:
- unique: std::unique_ptr => sole: Tek sahiplik; kopyalanamaz, yalnız taşınabilir
- shared: std::shared_ptr => counted: Referans sayacıyla ortak sahiplik; son sahip yok olunca bellek bırakılır
- weak: std::weak_ptr => observer: Sayacı artırmadan gözlemler; shared_ptr döngülerini kırar
Fazladan seçenekler:
- decoy: Çöp toplayıcıya kaydolup belleği periyodik olarak temizler
İpucu: Nesnenin kaç sahibi olabilir?
Kısa açıklama: unique_ptr tek, shared_ptr ortak sahiplik sağlar; weak_ptr sahiplik almadan gözlemler.
Açıklama: unique_ptr sıfır ek maliyetle tek sahipliği ifade eder ve varsayılan tercih olmalıdır. shared_ptr atomik bir referans sayacı tutar; weak_ptr bu sayacı artırmadan nesneye erişmeyi dener ve karşılıklı referans döngülerini kırmak için kullanılır. C++'ta çöp toplayıcı yoktur.
Etiketler: cpp, akıllı-işaretçi

## S10-02 · Doğru / Yanlış
Konu: Akıllı işaretçiler
Soru: Birbirini `shared_ptr` ile gösteren iki nesne, dışarıdaki son `shared_ptr` yok edilince sayaçları sıfıra indiği için serbest kalır.
Şıklar:
- [ ] Doğru
  Neden: Döngüdeki sayaçlar sıfıra inmez; nesneler sızar.
- [x] Yanlış
  Neden: Doğru; döngünün bir tarafı weak_ptr olmalıdır.
İpucu: İki nesnenin sayacı neden sıfıra inmez?
Kısa açıklama: shared_ptr döngüsü sızıntıya yol açar; döngü weak_ptr ile kırılır.
Açıklama: A, B'yi ve B, A'yı shared_ptr ile tutarsa dış referanslar bitse de her birinin sayacı 1'de kalır ve yıkıcılar hiç çalışmaz. Ebeveyn–çocuk gibi ilişkilerde geri yönlü bağlantı weak_ptr ile kurulur.
Etiketler: cpp, shared-ptr

# S11 · Orta · Kod yazma

Alan: Tasarım ve modelleme

Singleton nasıl yazılır? Çok thread'li ortamda nasıl güvenli hâle getirilir ve dezavantajları nelerdir?

Nerede soruldu: klasik tasarım sorusu.

Örnek çözüm:
```cpp
#include <iostream>
#include <string>

class Logger {
public:
    // Fonksiyon-yerel static: C++11'den beri ilk çağrıdaki başlatma
    // thread-safe'tir, elle kilit gerekmez.
    static Logger& instance() {
        static Logger logger;
        return logger;
    }

    // Kopyalama ve atama yasaktır; ikinci bir örnek oluşturulamaz.
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;

    void log(const std::string& message) {
        std::cout << message << '\n';
    }

private:
    Logger() = default;  // Dışarıdan oluşturulamaz.
};

// Kullanım: Logger::instance().log("Sistem açıldı");
// Dezavantaj: global durum ve gizli bağımlılık yaratır; sınıfın neye ihtiyaç
// duyduğu imzasından görünmez ve testte sahtesiyle değiştirmek zorlaşır.
// Çoğu zaman nesneyi bir kez oluşturup bağımlılık olarak geçirmek daha iyidir.
```

Anahtar noktalar:
- Özel kurucu, kopyalamanın yasaklanması ve tek erişim noktası
- C++11'de fonksiyon-yerel `static` nesnenin başlatılması thread-safe'tir
- Elle çift kontrollü kilitleme hataya açıktır
- Dezavantajlar: global durum, gizli bağımlılık ve test zorluğu
- Alternatif: nesneyi bir kez oluşturup bağımlılık olarak geçirmek

## S11-01 · Tek seçim
Konu: Singleton
Soru: C++11 ve sonrasında thread-safe bir Singleton başlatmanın en sade yolu hangisidir?
Şıklar:
- [ ] a: Her `getInstance` çağrısında mutex alıp nesnenin oluşturulup oluşturulmadığını kontrol etmek
  Neden: Çalışır ama her çağrıda kilit maliyeti öder; C++11'de buna gerek yoktur.
- [x] b: `getInstance` içinde fonksiyon-yerel bir `static` nesne tanımlamak
- [ ] c: Global bir işaretçiyi `volatile` yapmak
  Neden: `volatile` thread güvenliği sağlamaz.
- [ ] d: Kurucuyu public bırakmak
  Neden: Public kurucu birden fazla nesne oluşturulmasına izin verir.
İpucu: C++11, fonksiyon içindeki `static` nesnelerin başlatılması için ne garanti eder?
Kısa açıklama: C++11'den beri fonksiyon-yerel `static` nesnelerin ilk başlatılması thread-safe'tir.
Açıklama: Fonksiyon içindeki `static` nesne ilk çağrıda bir kez başlatılır ve dil, eşzamanlı ilk çağrılarda başlatmanın yalnız bir kez yapılmasını garanti eder (magic statics). Bu yöntem çift kontrollü kilitleme gibi hataya açık desenlere gerek bırakmaz.
Etiketler: singleton, thread, cpp

## S11-02 · Çoklu seçim
Konu: Singleton
Soru: Singleton deseninin dezavantajlarını seçin.
Şıklar:
- [x] a: Global durum oluşturduğu için birim testlerde izole etmek zorlaşır
- [x] b: Bağımlılıkları gizler; sınıfın neye ihtiyaç duyduğu imzasından görünmez
- [ ] c: Her çağrıda yeni nesne oluşturduğu için bellek kullanımı artar
  Neden: Singleton tek örnek tutar; her çağrıda yeni nesne oluşmaz.
- [ ] d: C++'ta yazılamaz, yalnız Java'da kullanılabilir
  Neden: Singleton dilden bağımsız bir desendir.
İpucu: Global değişkenlerin sorunlarını düşünün.
Kısa açıklama: Singleton global durum ve gizli bağımlılık yaratır.
Açıklama: Singleton'a doğrudan erişen kod, test sırasında sahte bir nesneyle değiştirilemez ve testler birbirinin durumunu etkileyebilir. Çoğu durumda nesneyi bir kez oluşturup bağımlılık olarak geçirmek aynı faydayı bu maliyetler olmadan sağlar.
Etiketler: singleton, tasarım

# S12 · Orta · Tasarım

Alan: Tasarım ve modelleme

Observer, Factory, Strategy ve State desenleri hangi problemleri çözer? Her biri için bir örnek verin.

Nerede soruldu: klasik tasarım sorusu.

Anahtar noktalar:
- Observer: bir nesnedeki değişikliği abonelere bildirir (ör. radar verisini ekranlara dağıtmak)
- Factory: hangi somut sınıfın üretileceğini istemciden gizler
- Strategy: değiştirilebilir algoritmayı ayrı nesnelere taşır
- State: davranışı nesnenin iç durumuna göre değiştirir
- Her desen için somut bir örnek ve çözdüğü problem

## S12-01 · Eşleştirme
Konu: Tasarım desenleri
Soru: Desenleri çözdükleri problemle eşleştirin.
Eşleşmeler:
- observer: Observer => events: Bir nesnedeki değişikliği ona abone olan birçok nesneye bildirir
- factory: Factory => creation: Hangi somut sınıfın üretileceğini istemciden gizler
- strategy: Strategy => algorithm: Değiştirilebilir bir algoritmayı ayrı nesnelere taşır
- state: State => stateMachine: Nesnenin davranışını iç durumuna göre değiştirir
Fazladan seçenekler:
- decoy: Bir nesnenin tek örneğinin global erişimle paylaşılmasını sağlar
İpucu: Fazladan seçenek, listede olmayan başka bir deseni anlatıyor.
Kısa açıklama: Observer olay dağıtır, Factory üretimi soyutlar, Strategy algoritmayı, State durum davranışını ayırır.
Açıklama: Örnekler: radar verisini birçok ekrana dağıtmak (Observer), mesaj tipine göre doğru ayrıştırıcıyı oluşturmak (Factory), farklı rota hesaplama algoritmaları arasında geçiş (Strategy), bir aracın bekleme, görev ve dönüş modlarında farklı davranması (State). Tek örnek ve global erişim Singleton'dır.
Etiketler: tasarım-desenleri

# S13 · Orta · Teori

Alan: Tasarım ve modelleme
Şirket: HAVELSAN

Dependency Injection nedir? .NET'te `AddTransient`, `AddScoped` ve `AddSingleton` ömürleri arasındaki fark nedir?

Nerede soruldu: HAVELSAN .NET (aday beyanı).

Anahtar noktalar:
- DI: sınıf bağımlılıklarını kendisi oluşturmaz, dışarıdan alır
- Faydaları: gevşek bağlılık ve test edilebilirlik
- `AddTransient`: her istendiğinde yeni nesne
- `AddScoped`: kapsam (ör. web isteği) başına bir nesne
- `AddSingleton`: uygulama boyunca tek nesne; içine scoped servis enjekte etmek captive dependency'dir

## S13-01 · Eşleştirme
Konu: DI ömürleri
Soru: Servis kayıt yöntemlerini ömürleriyle eşleştirin.
Eşleşmeler:
- transient: AddTransient => everyResolve: Her istendiğinde yeni bir nesne oluşturulur
- scoped: AddScoped => perScope: Her kapsamda (ör. bir web isteği) tek nesne paylaşılır
- singleton: AddSingleton => appWide: Uygulama boyunca tek nesne kullanılır
Fazladan seçenekler:
- decoy: Uygulama başlarken her thread için ayrı bir nesne oluşturulur
İpucu: Nesne ne sıklıkla yeniden oluşturuluyor?
Kısa açıklama: Transient her istekte yeni, scoped kapsam başına bir, singleton uygulama başına bir nesnedir.
Açıklama: DI konteyneri bağımlılıkları oluşturup sınıflara dışarıdan verir. Ömür seçimi durum paylaşımını belirler: durumsuz hafif servisler transient, istek boyunca paylaşılan iş birimi (ör. DbContext) scoped, pahalı ve thread-safe paylaşılan servisler singleton olarak kaydedilir.
Etiketler: dotnet, di, ömür

## S13-02 · Doğru / Yanlış
Konu: DI ömürleri
Soru: Singleton ömürlü bir servise scoped ömürlü bir servisi enjekte etmek, scoped servisin gereğinden uzun yaşamasına yol açabilir.
Şıklar:
- [x] Doğru
  Neden: Doğru; singleton ilk aldığı scoped örneği uygulama boyunca tutar (captive dependency).
- [ ] Yanlış
  Neden: Singleton yeniden oluşturulmadığı için içindeki scoped nesne de kapsam bitse bile tutulur.
İpucu: Uzun ömürlü nesne kısa ömürlü olanı tutarsa ne olur?
Kısa açıklama: Uzun ömürlü servis kısa ömürlü bağımlılığı esir alır.
Açıklama: Bu hataya captive dependency denir; örneğin bir DbContext'in uygulama boyunca paylaşılması thread güvenliği ve eski veri sorunlarına yol açar. ASP.NET Core geliştirme ortamında bu durumu kapsam doğrulamasıyla yakalar.
Etiketler: dotnet, di

# S14 · Kolay · Teori

Alan: Tasarım ve modelleme
Şirket: ASELSAN

Sınıf ve sekans diyagramı çizin. Model tabanlı bir araç (ör. IBM Rational Rhapsody) kullandınız mı?

Nerede soruldu: ASELSAN gömülü yazılım (Rhapsody ön ödevi, aday beyanı).

Anahtar noktalar:
- Sınıf diyagramı: sınıflar, alanlar, metotlar ve ilişkiler
- Kalıtım içi boş üçgen; composition dolu, aggregation içi boş elmas
- Sekans diyagramı: nesneler arası mesajların zaman sırası
- Model tabanlı geliştirmede modelden kod üretimi (ör. Rhapsody)

## S14-01 · Eşleştirme
Konu: UML
Soru: UML sınıf diyagramı gösterimlerini anlamlarıyla eşleştirin.
Eşleşmeler:
- inheritance: İçi boş üçgen uçlu düz çizgi => generalization: Kalıtım (is-a)
- composition: Dolu elmas uçlu çizgi => strongOwnership: Parça bütünle birlikte yaşar ve yok olur
- aggregation: İçi boş elmas uçlu çizgi => weakOwnership: Parça bütünden bağımsız yaşayabilir
- dependency: Kesikli, açık oklu çizgi => uses: Bir sınıf diğerini geçici olarak kullanır
Fazladan seçenekler:
- decoy: Sınıfın bir veritabanı tablosu olduğunu gösterir
İpucu: Elmasın dolu ya da boş olması sahipliğin gücünü gösterir.
Kısa açıklama: Üçgen kalıtımı, dolu elmas composition'ı, boş elmas aggregation'ı, kesikli ok bağımlılığı gösterir.
Açıklama: Composition'da parça bütün olmadan var olamaz (ör. uçak ile kanadı); aggregation'da parça bağımsız yaşar (ör. filo ile uçaklar). Kesikli ve açık oklu çizgi geçici kullanım bağımlılığıdır; kesikli çizgi ile içi boş üçgen ise interface gerçekleştirmesidir.
Etiketler: uml, modelleme

## S14-02 · Tek seçim
Konu: UML
Soru: Sekans diyagramı neyi gösterir?
Şıklar:
- [ ] a: Sınıfların alanlarını, metotlarını ve aralarındaki kalıtım ilişkilerini statik olarak
  Neden: Bu sınıf diyagramıdır.
- [ ] b: Sistemin donanım düğümlerine ve bu düğümlere yüklenen yazılım bileşenlerine dağılımını
  Neden: Bu dağıtım (deployment) diyagramıdır.
- [x] c: Nesneler arasındaki mesajların zaman sırasına göre akışını
- [ ] d: Veritabanı tablolarını
  Neden: Tablolar ER diyagramında gösterilir.
İpucu: Dikey eksen zamanı gösterir.
Kısa açıklama: Sekans diyagramı nesneler arası mesajların zaman sırasını gösterir.
Açıklama: Her nesnenin dikey bir yaşam çizgisi vardır; mesajlar bu çizgiler arasında yatay oklarla, yukarıdan aşağı zaman sırasıyla çizilir. Bir senaryonun (ör. hedef takibi başlatma) hangi sırayla hangi çağrılarla gerçekleştiğini göstermek için kullanılır.
Etiketler: uml, sekans

# S15 · Orta · Karşılaştırma

Alan: Veri yapıları ve algoritmalar
Şirket: Baykar

Quicksort ile mergesort'u karşılaştırın: ortalama ve en kötü durum, kararlılık ve ek bellek.

Nerede soruldu: Baykar (basit sıralama problemi ve kod testi, aday beyanı).

Anahtar noktalar:
- Quicksort ortalama Θ(n log n), en kötü Θ(n²); pivot seçimi belirleyici
- Mergesort her durumda Θ(n log n) ama Θ(n) ek bellek ister
- Mergesort kararlıdır; tipik yerinde quicksort kararsızdır
- Quicksort önbellek dostu olduğu için pratikte çoğu zaman daha hızlı
- Rastgele ya da üç ortanca pivot en kötü durumu pratikte engeller

## S15-01 · Çoklu seçim
Konu: Sıralama algoritmaları
Soru: Quicksort ve mergesort için doğru ifadeleri seçin.
Şıklar:
- [x] a: Mergesort en kötü durumda da Θ(n log n) çalışır
  Neden: Doğru; her seviyede bölme dengelidir.
- [x] b: Quicksort'un en kötü durumu Θ(n²)'dir; örneğin pivot hep en küçük eleman seçilirse
  Neden: Doğru; bölmeler 0 ve n-1 elemanlı olur.
- [ ] c: Quicksort kararlı, mergesort kararsızdır
  Neden: Tersi doğrudur: standart mergesort kararlı, tipik yerinde quicksort kararsızdır.
- [ ] d: Dizilerde mergesort yerinde çalışır ve Θ(1) ek bellek kullanır
  Neden: Yanlış; standart dizi mergesort'u birleştirme için Θ(n) yardımcı dizi kullanır.
- [ ] e: İkisi de en iyi durumda Θ(n) çalışır
  Neden: İki algoritma da en iyi durumda Θ(n log n)'dir.
İpucu: Pivot seçimi ve birleştirme adımının maliyetini düşünün.
Kısa açıklama: Mergesort hep Θ(n log n) ve kararlıdır ama ek bellek ister; quicksort yerinde ama en kötü durumda Θ(n²)'dir.
Açıklama: Quicksort pratikte önbellek dostu olduğu için çoğu zaman daha hızlıdır; rastgele pivot veya üç ortanca seçimi en kötü durumu olasılık dışı bırakır. Mergesort kararlılık ve garantili süre gerektiğinde, ayrıca bağlı listelerde tercih edilir.
Etiketler: sıralama, quicksort, mergesort

## S15-02 · Tek seçim
Konu: Sıralama algoritmaları
Soru: Her zaman ilk elemanı pivot seçen quicksort, zaten sıralı bir diziye uygulanırsa süre ne olur?
Şıklar:
- [x] a: Θ(n²)
- [ ] b: Θ(n log n), çünkü bölmeler dengeli olur
  Neden: Sıralı dizide ilk eleman pivot seçilince bölmeler 0 ve n-1 elemanlı olur.
- [ ] c: Θ(n), çünkü dizi zaten sıralıdır
  Neden: Quicksort sıralılığı fark edip erken bitmez.
- [ ] d: Θ(log n), çünkü pivot en küçük eleman olduğu için bölme hızlı biter
  Neden: Her seviyede yalnız bir eleman ayrılır; n seviye ve toplamda n² mertebesinde karşılaştırma oluşur.
İpucu: Her bölmede kaç eleman ayrılıyor?
Kısa açıklama: Sıralı girdide ilk eleman pivotu en kötü bölmeyi üretir: Θ(n²).
Açıklama: Pivot her seferinde en küçük eleman olduğunda sağ taraf n-1 eleman kalır ve özyineleme derinliği n'ye ulaşır. Toplam karşılaştırma (n-1) + (n-2) + ... = Θ(n²) olur. Rastgele pivot bu durumu pratikte engeller.
Etiketler: quicksort, karmaşıklık

# S16 · Orta · Kod yazma

Alan: Veri yapıları ve algoritmalar

Bir ring buffer (dairesel kuyruk) yazın. Bir ISR ile ana döngü arasında veri aktarırken nelere dikkat edilir?

Nerede soruldu: klasik gömülü yazılım sorusu.

Örnek çözüm:
```c
#include <stdbool.h>
#include <stdint.h>

/* İkinin kuvveti: modulo yerine & (RING_SIZE - 1) maskesi kullanılabilir. */
#define RING_SIZE 16u

typedef struct {
    /* volatile: derleyici bu alanları önbelleğe almaz ve erişim sırasını korur. */
    volatile uint8_t data[RING_SIZE];
    /* Her indeksi tek taraf yazar; 8 bit olduğu için tek komutta okunup yazılır. */
    volatile uint8_t head;  /* yalnız üretici (ISR) yazar */
    volatile uint8_t tail;  /* yalnız tüketici (ana döngü) yazar */
} RingBuffer;

/* ISR'den çağrılır. Kuyruk doluysa veri düşer ve false döner;
   dolu ile boşu ayırt etmek için bir slot hep boş kalır. */
bool ring_put(RingBuffer *rb, uint8_t value) {
    uint8_t next = (uint8_t)((rb->head + 1u) & (RING_SIZE - 1u));
    if (next == rb->tail) return false;
    rb->data[rb->head] = value;
    /* İndeks veriden sonra güncellenir; çok çekirdekli sistemde
       arada bellek bariyeri gerekir. */
    rb->head = next;
    return true;
}

/* Ana döngüden çağrılır. Kuyruk boşsa false döner. */
bool ring_get(RingBuffer *rb, uint8_t *value) {
    if (rb->tail == rb->head) return false;
    *value = rb->data[rb->tail];
    rb->tail = (uint8_t)((rb->tail + 1u) & (RING_SIZE - 1u));
    return true;
}
```

Anahtar noktalar:
- `head` yazma, `tail` okuma indeksi; indeksler mod N ile sarar
- Boş: `head == tail`; dolu: `(head + 1) % N == tail` (bir slot boş kalır) ya da ayrı sayaç
- N ikinin kuvvetiyse modulo yerine maske kullanılabilir
- Tek üretici–tek tüketici düzeninde her taraf yalnız kendi indeksini yazarsa kilit gerekmez
- Paylaşılan indeksler `volatile` ve atomik genişlikte; çok çekirdekte bellek bariyeri

## S16-01 · Tek seçim
Konu: Ring buffer
Soru: Boyutu N olan, `head` yazma ve `tail` okuma indeksi olan ve bir slotu boş bırakan ring buffer'da kuyruğun dolu olduğu nasıl anlaşılır?
Şıklar:
- [x] a: `(head + 1) % N == tail` olduğunda; yazılacak bir sonraki konum okuma konumuna denk gelir
- [ ] b: `head == tail` olduğunda; okuma ve yazma indeksleri aynı yeri gösterir
  Neden: Bu kurala göre `head == tail` kuyruğun boş olduğunu gösterir.
- [ ] c: `head == N` olduğunda
  Neden: İndeksler mod N ile sarar; `head` hiçbir zaman N değerinde kalmaz.
- [ ] d: Eleman sayısı N'ye ulaştığında; tüm slotlar dolar
  Neden: Bu tasarımda bir slot boş kalır; en fazla N - 1 eleman tutulur.
İpucu: Boş ve dolu durumları ayırt etmek için bir slot feda edilir.
Kısa açıklama: `head` bir adım ilerleyince `tail`'e çarpıyorsa kuyruk doludur.
Açıklama: `head == tail` boş durumu gösterdiği için dolu durum `(head + 1) % N == tail` ile tanımlanır ve kapasite N - 1 olur. Alternatif olarak ayrı bir eleman sayacı tutulabilir; ama sayaç hem ISR hem ana döngü tarafından değiştirileceği için korunması gerekir.
Etiketler: ring-buffer, gömülü, kuyruk

## S16-02 · Doğru / Yanlış
Konu: Ring buffer
Soru: Tek üreticili (ISR) ve tek tüketicili bir ring buffer'da her taraf yalnız kendi indeksini yazıyor ve indeksler atomik erişiliyorsa kilit gerekmez.
Şıklar:
- [x] Doğru
  Neden: Doğru; head'i yalnız ISR, tail'i yalnız ana döngü yazar; indeksler volatile ve atomik genişlikte olmalıdır.
- [ ] Yanlış
  Neden: Tek üretici–tek tüketici düzeninde paylaşılan bir yazma yoktur; bu yüzden kilitsiz çalışabilir.
İpucu: Aynı değişkene iki taraf birden yazıyor mu?
Kısa açıklama: Tek üretici–tek tüketici ring buffer kilitsiz çalışabilir.
Açıklama: ISR yalnız head'i, ana döngü yalnız tail'i değiştirir; her taraf diğerinin indeksini yalnız okur. İndeks tek komutta okunup yazılabilen bir genişlikte ve volatile olmalı, çok çekirdekli sistemlerde ayrıca bellek bariyerleri düşünülmelidir.
Etiketler: ring-buffer, kilitsiz

# S17 · Orta · Teori

Alan: Veri yapıları ve algoritmalar

Ağaç gezinme yöntemlerini (BFS, DFS; pre-order, in-order, post-order) ve ikili arama ağacında (BST) ekleme ile aramayı açıklayın.

Nerede soruldu: klasik veri yapıları sorusu.

Anahtar noktalar:
- BFS seviye seviye gezer (kuyruk); DFS derine iner (yığın veya özyineleme)
- Pre-order, in-order ve post-order farkı; BST'de in-order sıralı verir
- BST ekleme ve arama: küçükse sola, büyükse sağa
- Dengeli ağaçta O(log n), dengesizde O(n)
- Dengeli ağaç örnekleri: AVL ve kırmızı-siyah ağaç

## S17-01 · Tek seçim
Konu: BST
Soru: Bir BST'yi in-order gezmek hangi çıktıyı verir?
Şıklar:
- [ ] a: Düğümleri seviye seviye, kökten yapraklara doğru; aynı seviyede soldan sağa
  Neden: Bu seviye sırası (BFS) gezintisidir.
- [x] b: Anahtarları küçükten büyüğe sıralı biçimde
- [ ] c: Önce kökü
  Neden: Kökü önce ziyaret eden pre-order'dır.
- [ ] d: Rastgele sıra
  Neden: Gezinme deterministiktir; in-order BST'de sıralı sonuç verir.
İpucu: In-order: sol alt ağaç, düğüm, sağ alt ağaç.
Kısa açıklama: BST'nin in-order gezintisi anahtarları sıralı verir.
Açıklama: BST'de her düğümün solundaki anahtarlar küçük, sağındakiler büyüktür. Sol–düğüm–sağ sırasıyla gezmek bu yüzden anahtarları artan sırada üretir; bu, BST'nin doğru kurulduğunu test etmenin de kolay bir yoludur.
Etiketler: bst, ağaç, dfs

## S17-02 · Boşluk doldurma
Konu: BST
Soru: 1'den 7'ye kadar anahtarlar içeren tam dengeli bir BST'de, en kötü durumda bir arama kaç düğümle karşılaştırma yapar?
Cevap: 3
Kabul: üç
İpucu: Tam dengeli 7 düğümlü ağacın kaç seviyesi vardır?
Kısa açıklama: Dengeli BST'de arama ağaç yüksekliği kadar, yani 3 adım sürer.
Açıklama: Kök 4, ikinci seviye 2 ve 6, üçüncü seviye 1, 3, 5 ve 7'dir; en derin anahtar üç karşılaştırmada bulunur. Dengeli ağaçta yükseklik yaklaşık log₂n'dir; anahtarlar sıralı eklenirse ağaç bir listeye dönüşür ve arama Θ(n) olur.
Etiketler: bst, karmaşıklık

# S18 · Zorlayıcı · Teori

Alan: Veri yapıları ve algoritmalar

En kısa yol için Dijkstra veya A* algoritmasını anlatın. Rota planlamada hangisini neden seçersiniz?

Nerede soruldu: klasik algoritma sorusu (rota planlama bağlamı).

Anahtar noktalar:
- Dijkstra: öncelik kuyruğundan en yakın düğümü al, komşuları gevşet
- İkili yığınla süre O((V + E) log V)
- Negatif ağırlıklı kenarlarda çalışmaz; Bellman-Ford gerekir
- A*: f = g + h; kabul edilebilir sezgiselle sonuç yine optimaldir
- Haritada Öklid veya Manhattan uzaklığı sezgisel olarak kullanılır

## S18-01 · Çoklu seçim
Konu: En kısa yol
Soru: Dijkstra ve A* için doğru ifadeleri seçin.
Şıklar:
- [x] a: Dijkstra negatif ağırlıklı kenar olan grafiklerde yanlış sonuç verebilir
  Neden: Doğru; kesinleşmiş bir düğümün mesafesi sonradan düşebilir.
- [x] b: İkili yığın öncelik kuyruğuyla Dijkstra'nın süresi O((V + E) log V) olur
  Neden: Doğru; her kenar en fazla bir güncelleme yapar.
- [ ] c: A*, gerçek maliyeti olduğundan fazla tahmin eden bir sezgiselle de en kısa yolu garanti eder
  Neden: Optimal sonuç için sezgiselin hedefe olan gerçek maliyeti aşmaması (admissible) gerekir.
- [x] d: Sezgisel fonksiyonu her zaman 0 olan A*, Dijkstra gibi davranır
  Neden: Doğru; yönlendirme bilgisi olmayınca yalnız mesafeye göre genişler.
- [x] e: Dijkstra döngü içeren genel grafiklerde de çalışır
  Neden: Doğru; tek koşul kenar ağırlıklarının negatif olmamasıdır.
İpucu: A*'ın Dijkstra'dan farkı hedefe doğru tahminidir.
Kısa açıklama: Dijkstra negatif olmayan kenarlarda en kısa yolu bulur; A* kabul edilebilir bir sezgiselle hedefe yönelerek daha az düğüm açar.
Açıklama: Dijkstra her adımda en yakın keşfedilmemiş düğümü kesinleştirir. A*, g(n) + h(n) değerine göre genişler; h kabul edilebilir ise sonuç yine optimaldir ve harita üzerindeki rota planlamada Öklid veya Manhattan uzaklığı gibi sezgiseller büyük hızlanma sağlar.
Etiketler: dijkstra, a-star, graf

## S18-02 · Sıralama
Konu: En kısa yol
Soru: Dijkstra algoritmasının adımlarını doğru sırayla dizin.
Sıra:
1. init: Kaynağın mesafesini 0, diğerlerini sonsuz yap ve kaynağı kuyruğa ekle
2. pick: Kuyruktan mesafesi en küçük düğümü al
3. relax: Komşular için daha kısa bir yol varsa mesafeyi güncelle ve kuyruğa ekle
4. repeat: Kuyruk boşalana kadar ikinci adıma dön
İpucu: Önce başlangıç değerleri, sonra en yakın düğüm, sonra komşular.
Kısa açıklama: Başlat, en yakını seç, komşuları gevşet, tekrarla.
Açıklama: Gevşetme (relaxation) adımı, bir komşuya şu anki düğüm üzerinden daha kısa bir yol bulunduğunda mesafesini düşürür. Kuyruktan çıkan bir düğümün mesafesi negatif kenar olmadığı sürece kesinleşmiştir.
Etiketler: dijkstra, graf

# S19 · Kolay · Karşılaştırma

Alan: Gömülü ve işletim sistemleri
Şirket: HAVELSAN, Baykar

Process ile thread arasındaki fark nedir? Hangi kaynaklar paylaşılır, bağlam değiştirme maliyeti nasıl farklılaşır?

Nerede soruldu: HAVELSAN ve Baykar (aday beyanları).

Anahtar noktalar:
- Process kendi adres alanına sahiptir; thread'ler process'in adres alanını paylaşır
- Her thread'in kendi stack'i ve register durumu vardır
- Thread geçişi genellikle process geçişinden ucuzdur
- Paylaşım senkronizasyon gerektirir; process'ler arası iletişim IPC ile yapılır
- Bir thread'in çökmesi genellikle bütün process'i düşürür

## S19-01 · Çoklu seçim
Konu: Process ve thread
Soru: Process ve thread için doğru ifadeleri seçin.
Şıklar:
- [x] a: Aynı process'in thread'leri heap'i ve global değişkenleri paylaşır
  Neden: Doğru; aynı adres alanında çalışırlar.
- [x] b: Her thread'in kendi stack'i ve register durumu vardır
  Neden: Doğru; çağrı zinciri ve yerel değişkenler thread'e özeldir.
- [x] c: Process'ler arası veri paylaşımı pipe, soket veya paylaşılan bellek gibi IPC yöntemleriyle yapılır
  Neden: Doğru; process'lerin adres alanları ayrıdır.
- [ ] d: Thread'ler arası geçiş, her geçişte sayfa tablosu değiştiği için process geçişinden pahalıdır
  Neden: Yanlış; aynı process'in thread'leri aynı adres alanını kullanır; sayfa tablosu ve TLB değişmediği için geçiş genellikle daha ucuzdur.
- [ ] e: Bir thread segmentation fault ile çökerse process'in diğer thread'leri çalışmaya devam eder
  Neden: Segmentation fault bütün process'i sonlandırır; diğer thread'ler de durur.
İpucu: Adres alanını kim paylaşıyor?
Kısa açıklama: Thread'ler process'in adres alanını paylaşır; process'ler birbirinden yalıtılmıştır.
Açıklama: Process, kendi adres alanı ve kaynaklarıyla çalışan programdır; thread ise process içindeki bir yürütme akışıdır. Paylaşım thread'ler arasında iletişimi kolaylaştırır ama senkronizasyon ihtiyacı doğurur; process'ler arasındaki yalıtım ise bir hatanın diğerlerine yayılmasını engeller.
Etiketler: process, thread, işletim-sistemi

# S20 · Orta · Karşılaştırma

Alan: Gömülü ve işletim sistemleri
Şirket: ASELSAN

Race condition nedir? Mutex ile semaphore arasındaki fark nedir?

Nerede soruldu: ASELSAN gömülü yazılım (multithreading, aday beyanı).

Anahtar noktalar:
- Race condition: sonucun eşzamanlı erişimin zamanlamasına bağlı olması
- Mutex: sahipli kilit; alan thread bırakır ve kritik bölgeyi korur
- Semaphore: sayaç; N kaynağı sayar veya thread'ler arası sinyal verir
- RTOS mutex'leri genellikle priority inheritance destekler
- Deadlock riskine karşı kilitleri hep aynı sırayla almak

## S20-01 · Tek seçim
Konu: Mutex ve semaphore
Soru: Mutex ile counting semaphore arasındaki temel fark hangisidir?
Şıklar:
- [ ] a: Semaphore yalnız iki process arasında, mutex ise yalnız aynı process'in thread'leri arasında kullanılabilir
  Neden: İkisi de tasarıma göre process içinde veya process'ler arasında kullanılabilir; temel fark sahiplik ve sayaçtır.
- [ ] b: Mutex kesmelerin içinde kilit almak için tasarlanmıştır, semaphore ise ISR'de hiç kullanılamaz
  Neden: ISR'de bloklayan kilit alınmaz; birçok RTOS ISR'den semaphore vermeye izin verir.
- [x] c: Mutex'in sahibi vardır ve onu yalnız alan thread bırakır; semaphore N kaynağı sayar
- [ ] d: Aralarında fark yoktur
  Neden: Sahiplik, sayaç ve priority inheritance desteği farklıdır.
İpucu: Kilidi kim bırakabilir?
Kısa açıklama: Mutex sahipli karşılıklı dışlamadır; semaphore sayaç tabanlı sinyalleşmedir.
Açıklama: Mutex kritik bölgeyi korur ve onu alan thread bırakır; RTOS'larda priority inheritance da genellikle mutex'e özgüdür. Counting semaphore N özdeş kaynağı veya biriken olayları sayar ve bir thread'in alıp başkasının vermesine izin verir. Race condition, paylaşılan veriye eşzamanlı erişimin sonucunun zamanlamaya bağlı olmasıdır.
Etiketler: mutex, semaphore, eşzamanlılık

## S20-02 · Doğru / Yanlış
Konu: Mutex ve semaphore
Soru: Bir üretici, bir tüketiciye "veri hazır" sinyali vermek için semaphore kullanabilir; sinyali veren thread'in semaphore'u önceden almış olması gerekmez.
Şıklar:
- [x] Doğru
  Neden: Doğru; semaphore sahiplik taşımaz, bu yüzden sinyalleşmede kullanılır.
- [ ] Yanlış
  Neden: Sahiplik mutex'e özgüdür; semaphore'u bir thread alıp başka bir thread verebilir.
İpucu: Semaphore'un sahibi var mıdır?
Kısa açıklama: Semaphore thread'ler arası sinyalleşmede kullanılabilir.
Açıklama: Tüketici semaphore'da bekler, üretici veri hazır olunca semaphore'u verir. Aynı işi mutex ile yapmak yanlıştır, çünkü mutex'i yalnız onu alan thread bırakabilir.
Etiketler: semaphore, sinyalleşme

# S21 · Zorlayıcı · Teori

Alan: Gömülü ve işletim sistemleri

Priority inversion nedir? Gerçek zamanlı sistemlerde nasıl önlenir?

Nerede soruldu: klasik RTOS sorusu.

Anahtar noktalar:
- Düşük öncelikli görev kilidi tutarken yüksek öncelikli görev bekler
- Araya giren orta öncelikli görev bu beklemeyi sınırsız uzatabilir
- Çözüm: priority inheritance veya priority ceiling
- Kritik bölgeleri kısa tutmak
- Bilinen örnek: Mars Pathfinder'daki sıfırlamalar

## S21-01 · Tek seçim
Konu: Priority inversion
Soru: Priority inversion'ı sınırlamak için RTOS mutex'lerinde yaygın kullanılan mekanizma hangisidir?
Şıklar:
- [x] a: Priority inheritance
- [ ] b: Görevleri round-robin zamanlamaya geçirip öncelikleri tamamen kaldırmak
  Neden: Öncelikleri kaldırmak gerçek zamanlı garantileri bozar.
- [ ] c: Yüksek öncelikli görevin, kilidi beklerken düşük öncelikli görevi sonlandırması
  Neden: Görevi sonlandırmak paylaşılan veriyi tutarsız bırakır.
- [ ] d: Kilidi tutan görevin önceliğini düşürmek
  Neden: Tersine, kilidi tutan görevin önceliği bekleyen yüksek görevin seviyesine yükseltilmelidir.
İpucu: Kilidi tutan görev neden daha hızlı bitirilmeli?
Kısa açıklama: Priority inheritance, kilidi tutan görevi geçici olarak bekleyen en yüksek önceliğe çıkarır.
Açıklama: Düşük öncelikli görev kilidi tutarken yüksek öncelikli görev bekler; araya giren orta öncelikli görevler düşük görevi geciktirirse yüksek görev sınırsız bekleyebilir. Priority inheritance ve priority ceiling bu beklemeyi kritik bölüm süresiyle sınırlar. Mars Pathfinder'daki sıfırlamalar bu sorundan kaynaklanmıştı.
Etiketler: rtos, priority-inversion

## S21-02 · Sıralama
Konu: Priority inversion
Soru: Bir priority inversion senaryosunun adımlarını oluş sırasına göre dizin.
Sıra:
1. lowLocks: Düşük öncelikli L görevi paylaşılan mutex'i alır
2. highWaits: Yüksek öncelikli H görevi aynı mutex'i ister ve bloklanır
3. midRuns: Orta öncelikli M görevi L'yi keserek uzun süre çalışır
4. highStarves: H, M bitene kadar dolaylı olarak beklemek zorunda kalır
İpucu: Sorun, kilidi tutanın araya giren görev tarafından geciktirilmesidir.
Kısa açıklama: L kilidi tutar, H bekler, M L'yi keser ve H dolaylı olarak M'yi bekler.
Açıklama: H'nin beklemesi L'nin kritik bölümüyle sınırlı kalsaydı sorun olmazdı; asıl tehlike M gibi kilitle ilgisi olmayan görevlerin bu süreyi sınırsız uzatmasıdır. Priority inheritance'ta L, H'nin önceliğini devraldığı için M onu kesemez.
Etiketler: rtos, zamanlama

# S22 · Orta · Karşılaştırma

Alan: Gömülü ve işletim sistemleri

Hard ve soft real-time arasındaki fark nedir? Bir RTOS, genel amaçlı işletim sisteminden nasıl ayrılır?

Nerede soruldu: klasik RTOS sorusu.

Anahtar noktalar:
- Hard real-time'da süre aşımı sistem hatasıdır; soft real-time'da kaliteyi düşürür
- Gerçek zamanlılık hız değil, öngörülebilirliktir
- RTOS: öncelikli, preemptive ve deterministik zamanlama
- En kötü durum yürütme süresi (WCET) ve sınırlı kesme gecikmesi
- Örnekler: uçuş kontrolü hard, video akışı soft real-time

## S22-01 · Eşleştirme
Konu: Gerçek zamanlı sistemler
Soru: Kavramları tanımlarıyla eşleştirin.
Eşleşmeler:
- hard: Hard real-time => missFails: Tek bir süre aşımı sistem hatası sayılır
- soft: Soft real-time => missDegrades: Süre aşımı kaliteyi düşürür ama sistem çalışmaya devam eder
- rtos: RTOS => deterministic: Öncelikli, kesintili (preemptive) ve öngörülebilir zamanlama sunar
- gpos: Genel amaçlı işletim sistemi => throughput: Ortalama verimi ve adaleti öne çıkarır
Fazladan seçenekler:
- decoy: Görevleri yalnız gelme sırasına göre ve kesintisiz çalıştırır
İpucu: Gerçek zamanlılıkta ölçüt hız değil, süre sınırının garantisidir.
Kısa açıklama: Hard real-time'da süre aşımı başarısızlıktır; RTOS bunun için öngörülebilir zamanlama sağlar.
Açıklama: Uçuş kontrolü veya füze güdümü hard real-time örnekleridir; video akışı soft real-time'dır. RTOS, en yüksek öncelikli hazır görevi hemen çalıştıran preemptive bir zamanlayıcı ve sınırlı kesme gecikmesi sunar; genel amaçlı işletim sistemleri ise ortalama performansı optimize eder.
Etiketler: rtos, gerçek-zamanlı

## S22-02 · Doğru / Yanlış
Konu: Gerçek zamanlı sistemler
Soru: Gerçek zamanlı bir sistemi ayırt eden özellik, işlemleri olabildiğince hızlı bitirmesidir.
Şıklar:
- [ ] Doğru
  Neden: Gerçek zamanlılık hız değil öngörülebilirliktir; yavaş ama süre sınırını her zaman tutan bir sistem gerçek zamanlıdır.
- [x] Yanlış
  Neden: Doğru; ölçüt süre sınırlarının garanti edilmesidir.
İpucu: Ortalama süre mi, en kötü durum süresi mi önemli?
Kısa açıklama: Gerçek zamanlılık en kötü durumda bile süre sınırını tutmaktır.
Açıklama: Ortalamada çok hızlı ama ara sıra öngörülemeyen gecikmeler yaşayan bir sistem gerçek zamanlı değildir. Bu yüzden gerçek zamanlı yazılımda en kötü durum yürütme süresi (WCET) analiz edilir.
Etiketler: gerçek-zamanlı

# S23 · Orta · Teori

Alan: Gömülü ve işletim sistemleri

Kesme (interrupt) nedir? Bir ISR yazarken nelerden kaçınılır?

Nerede soruldu: klasik gömülü yazılım sorusu.

Anahtar noktalar:
- Kesme gelince bağlam kaydedilir, vektör tablosundaki ISR çalışır, sonra geri dönülür
- ISR kısa olmalı; işi bayrak veya kuyrukla ana döngüye ya da bir göreve devretmek
- ISR'de bloklayan çağrı, `printf`, `malloc` ve mutex beklemek yok
- Paylaşılan değişkenler `volatile`; çok baytlı erişimlerde kısa kritik bölge
- Kesme bayrağını temizlemek ve kesme önceliklerini doğru ayarlamak

## S23-01 · Çoklu seçim
Konu: Kesmeler
Soru: Bir ISR içinde kaçınılması gerekenleri seçin.
Şıklar:
- [x] a: `printf` gibi uzun süren veya bloklayan çağrılar
  Neden: Doğru; ISR süresini uzatır ve diğer kesmeleri geciktirir.
- [x] b: Mutex beklemek gibi bloklayan senkronizasyon işlemleri
  Neden: Doğru; ISR bloklanamaz.
- [ ] c: Bir bayrak set edip asıl işi ana döngüye bırakmak
  Neden: Bu önerilen yaklaşımdır: ISR kısa tutulur, iş ertelenir.
- [ ] d: Kesmenin bekleme (pending) bayrağını temizlemek
  Neden: Bu gereklidir; birçok donanımda bayrak temizlenmezse kesme çıkışta hemen yeniden tetiklenir.
- [ ] e: ISR ile paylaşılan değişkeni `volatile` tanımlamak
  Neden: Bu gereklidir; derleyicinin değişkeni önbelleğe almasını engeller.
İpucu: ISR'nin süresi diğer her şeyi geciktirir.
Kısa açıklama: ISR kısa ve bloklamasız olmalı; asıl iş ertelenmelidir.
Açıklama: Kesme geldiğinde işlemci ana kodu durdurur; uzun bir ISR diğer kesmelerin gecikmesini ve zamanlama hatalarını artırır. İyi uygulama ISR'de yalnız veriyi almak ve bir bayrak veya kuyrukla ana döngüye ya da bir göreve haber vermektir.
Etiketler: isr, kesme, gömülü

## S23-02 · Sıralama
Konu: Kesmeler
Soru: Bir kesmenin işlenme akışını doğru sırayla dizin.
Sıra:
1. request: Çevre birimi bir kesme isteği üretir
2. save: İşlemci mevcut komutu bitirip bağlamı kaydeder
3. vector: Kesme vektör tablosundan ISR adresi bulunur
4. isr: ISR çalışır ve kesme bayrağını temizler
5. restore: Bağlam geri yüklenir ve kesilen koda dönülür
İpucu: Bağlam, ISR'den önce kaydedilir ve sonra geri yüklenir.
Kısa açıklama: İstek, bağlam kaydı, vektör, ISR ve geri dönüş.
Açıklama: Ayrıntılar mimariye göre değişse de akış aynıdır; örneğin ARM Cortex-M'de bağlamın bir kısmı donanım tarafından otomatik kaydedilir. Kesme bayrağı temizlenmezse ISR'den çıkınca aynı kesme hemen tekrar tetiklenir.
Etiketler: kesme, gömülü

# S24 · Orta · Karşılaştırma

Alan: Gömülü ve işletim sistemleri

Polling, interrupt ve DMA ne zaman seçilir? CPU yükü, gecikme ve veri hacmi açısından karşılaştırın.

Nerede soruldu: klasik gömülü yazılım sorusu.

Anahtar noktalar:
- Polling basittir ama beklerken CPU harcar; çok kısa beklemeler için uygundur
- Interrupt seyrek olaylarda CPU'yu boşta bırakır; her olay bir bağlam geçişidir
- DMA büyük ve sürekli veriyi CPU'ya uğramadan taşır, bitince kesme üretir
- Seçim ölçütleri: veri hacmi, olay sıklığı, gecikme ve CPU yükü
- DMA'da önbellek tutarlılığı ve aktarım sürerken tampona dokunmamak

## S24-01 · Eşleştirme
Konu: Polling, interrupt ve DMA
Soru: Senaryoları en uygun yöntemle eşleştirin.
Eşleşmeler:
- adc: Yüksek hızda sürekli gelen büyük ADC örnek blokları => dma: DMA
- button: Seyrek basılan ve hemen tepki istenen bir buton => interrupt: Interrupt
- startup: Başlangıçta birkaç mikrosaniye içinde hazır olması beklenen bir donanım bayrağı => polling: Polling
Fazladan seçenekler:
- decoy: Watchdog timer
İpucu: Veri hacmi ve olayın sıklığı seçimi belirler.
Kısa açıklama: Büyük ve sürekli veri DMA, seyrek olay interrupt, çok kısa bekleme polling için uygundur.
Açıklama: Polling basittir ama beklerken CPU'yu harcar; yalnız çok kısa beklemelerde mantıklıdır. Interrupt seyrek olaylarda CPU'yu boşta bırakır ama her olay bir bağlam geçişi demektir. DMA büyük blokları CPU'ya uğramadan belleğe taşır ve iş bitince tek bir kesme üretir.
Etiketler: dma, interrupt, polling

## S24-02 · Tek seçim
Konu: DMA
Soru: DMA'nın temel faydası nedir?
Şıklar:
- [x] a: Veriyi çevre birimi ile bellek arasında CPU her baytı taşımadan aktarır; CPU bu sırada başka iş yapar
- [ ] b: Kesmeleri tamamen gereksiz kılar; aktarım bitince işlemciye hiç haber verilmez
  Neden: DMA aktarım bitince genellikle bir kesme üretir.
- [ ] c: Bellekteki veriyi şifreler
  Neden: DMA veri taşır; şifreleme yapmaz.
- [ ] d: İşlemcinin saat frekansını artırarak aktarımı hızlandırır
  Neden: DMA saat frekansını değiştirmez; işi ayrı bir denetleyiciye devreder.
İpucu: Baytları kim taşıyor?
Kısa açıklama: DMA veri aktarımını CPU'dan alıp ayrı bir denetleyiciye verir.
Açıklama: DMA denetleyicisi kaynak, hedef ve boyut bilgisiyle aktarımı kendisi yapar; CPU bu sırada hesaplama yapabilir. Önbellek tutarlılığı ve aktarım sürerken tampona dokunmamak dikkat edilmesi gereken noktalardır.
Etiketler: dma, gömülü

# S25 · Orta · Karşılaştırma

Alan: Gömülü ve işletim sistemleri
Şirket: Roketsan

UART, SPI ve I2C arasındaki farklar nelerdir? RS232 ile RS485 arasındaki fark nedir?

Nerede soruldu: Roketsan RF gömülü yazılım ilanı.

Anahtar noktalar:
- UART: saat hattı yok, asenkron, iki uç arası; baud rate iki tarafta aynı olmalı
- SPI: SCLK, MOSI, MISO ve slave başına chip select; tam çift yönlü ve hızlı
- I2C: SDA ve SCL, adresleme, çok cihaz, pull-up dirençleri; daha yavaş
- RS232 tek uçlu ve noktadan noktaya; RS485 diferansiyel, uzun mesafe ve çok noktalı
- Seçim ölçütleri: hız, mesafe, cihaz sayısı ve pin maliyeti

## S25-01 · Eşleştirme
Konu: Haberleşme arayüzleri
Soru: Arayüzleri özellikleriyle eşleştirin.
Eşleşmeler:
- uart: UART => async: Saat hattı olmadan, iki uç arasında asenkron TX/RX
- spi: SPI => fullDuplex: Saat, MOSI, MISO ve her slave için chip select; tam çift yönlü ve hızlı
- i2c: I2C => addressed: İki hat (SDA, SCL), adreslemeyle çok cihazlı yarı çift yönlü veri yolu
- rs485: RS485 => differential: Diferansiyel hat; uzun mesafe ve çok noktalı (multi-drop) bağlantı
Fazladan seçenekler:
- decoy: Tek uçlu sinyal; yalnız noktadan noktaya ve kısa mesafe
İpucu: Saat hattı, hat sayısı ve adresleme farklarına bakın.
Kısa açıklama: UART asenkron, SPI hızlı ve chip select'li, I2C adreslemeli iki hatlı; RS485 diferansiyel ve çok noktalıdır.
Açıklama: SPI en hızlısıdır ama her slave için ayrı seçim hattı ister; I2C iki hatla çok sayıda cihazı adresleyerek bağlar ama daha yavaştır. RS232 tek uçlu ve noktadan noktaya iken RS485 diferansiyel sinyalleşme sayesinde gürültüye dayanıklıdır ve yüzlerce metre mesafede çok noktalı çalışır. Fazladan seçenek RS232'yi anlatır.
Etiketler: uart, spi, i2c, rs485

## S25-02 · Doğru / Yanlış
Konu: Haberleşme arayüzleri
Soru: SPI'de birden fazla slave, I2C'deki gibi adresleriyle ayırt edildiği için tek bir chip select hattını paylaşabilir.
Şıklar:
- [ ] Doğru
  Neden: SPI'de her slave'in genellikle kendi chip select hattı vardır; adreslemeyle ayırt etmek I2C'ye özgüdür.
- [x] Yanlış
  Neden: Doğru; SPI'de slave seçimi ayrı chip select hatlarıyla yapılır.
İpucu: SPI çerçevesinde bir adres alanı var mı?
Kısa açıklama: SPI'de slave seçimi ayrı chip select hatlarıyla yapılır.
Açıklama: SPI protokolünde adres alanı yoktur; master, konuşmak istediği slave'in chip select hattını aktif eder. Daisy-chain gibi özel bağlantılar dışında her slave ayrı bir seçim hattı ister; bu da çok cihazlı sistemlerde pin maliyeti yaratır.
Etiketler: spi, i2c

# S26 · Orta · Karşılaştırma

Alan: Gömülü ve işletim sistemleri
Şirket: Roketsan

Bare-metal ile RTOS'lu geliştirme arasındaki fark nedir? Watchdog timer ne işe yarar?

Nerede soruldu: Roketsan ilanı (bare-metal).

Anahtar noktalar:
- Bare-metal: işletim sistemi yok; super-loop ve kesmelerle çalışır
- RTOS görevler, öncelikler, kuyruklar ve semaphore'lar sunar
- Küçük ve öngörülebilir sistemlerde bare-metal, karmaşık zamanlamada RTOS
- Watchdog düzenli beslenmezse sistemi resetler
- Watchdog'u kesme içinden koşulsuz beslemek kilitlenmeyi gizler

## S26-01 · Tek seçim
Konu: Watchdog
Soru: Watchdog timer'ın amacı nedir?
Şıklar:
- [ ] a: Görevlerin CPU kullanımını ölçüp en yoğun görevi raporlayan bir performans sayacıdır
  Neden: Bu bir profilleme aracıdır; watchdog kilitlenmeyi yakalar.
- [x] b: Yazılım düzenli olarak sıfırlamazsa süresi dolar ve sistemi yeniden başlatır
- [ ] c: Gerçek saati tutar
  Neden: Gerçek saat RTC'nin işidir.
- [ ] d: Kesmeleri önceliklendirir
  Neden: Bu kesme denetleyicisinin (ör. NVIC) işidir.
İpucu: Yazılım takılırsa sistemi kim kurtarır?
Kısa açıklama: Watchdog, takılan yazılımı tespit edip sistemi yeniden başlatır.
Açıklama: Yazılım çalışırken watchdog'u düzenli aralıklarla besler (kick). Sonsuz döngü veya kilitlenme yüzünden besleme kesilirse sayaç dolar ve donanım reset üretir. Watchdog'u bir kesmenin içinden koşulsuz beslemek, ana döngü takılsa bile resetin oluşmamasına yol açar.
Etiketler: watchdog, gömülü

## S26-02 · Doğru / Yanlış
Konu: Bare-metal
Soru: Bare-metal bir super-loop tasarımında görevler ana döngü, zamanlayıcılar ve kesmelerle düzenlenir; RTOS'taki gibi preemptive bir görev zamanlayıcısı yoktur.
Şıklar:
- [x] Doğru
  Neden: Doğru; görevler sırayla çağrılır ve zamanlama kesmelerle sağlanır.
- [ ] Yanlış
  Neden: Bare-metal'de işletim sistemi ve görev zamanlayıcısı yoktur; görevler ana döngüde sırayla çalışır.
İpucu: Bare-metal'de işletim sistemi var mı?
Kısa açıklama: Super-loop'ta görevler sırayla çalışır; preemptive zamanlayıcı yoktur.
Açıklama: Bare-metal küçük ve öngörülebilir sistemlerde basit ve düşük maliyetlidir. Görev sayısı ve zamanlama gereksinimleri arttıkça, öncelikli görevler, kuyruklar ve semaphore'lar sunan bir RTOS bakımı kolaylaştırır.
Etiketler: bare-metal, rtos

# S27 · Kolay · Teori

Alan: Gömülü ve işletim sistemleri
Şirket: Roketsan

Kaynak koddan çalışan programa giden adımları anlatın: preprocessor, compiler, assembler ve linker. Statik ve dinamik kütüphane arasındaki fark nedir? Makefile ve CMake ne işe yarar?

Nerede soruldu: Roketsan ilanı (CMake, Makefile, GCC).

Anahtar noktalar:
- Preprocessor `#include` ve makroları açar
- Derleyici assembly'ye, assembler nesne dosyasına çevirir
- Linker nesne dosyalarını ve kütüphaneleri birleştirip sembolleri çözer
- Statik kütüphane programa kopyalanır; dinamik kütüphane çalışma zamanında yüklenir
- Make kuralları çalıştırır; CMake platforma uygun yapı dosyalarını üretir

## S27-01 · Sıralama
Konu: Derleme zinciri
Soru: Bir C programının derlenme adımlarını doğru sırayla dizin.
Sıra:
1. preprocess: Preprocessor #include ve makroları açar
2. compile: Derleyici C kodunu assembly'ye çevirir
3. assemble: Assembler nesne dosyası (.o) üretir
4. link: Linker nesne dosyalarını ve kütüphaneleri birleştirip çalıştırılabilir dosya oluşturur
İpucu: Makrolar derlemeden önce açılır, semboller en son çözülür.
Kısa açıklama: Önişleme, derleme, assembly ve bağlama.
Açıklama: gcc -E, -S ve -c seçenekleri sırasıyla önişlenmiş kaynağı, assembly'yi ve nesne dosyasını üretir; seçeneksiz gcc bağlamayı da yapar. "undefined reference" hataları bağlama aşamasında, sözdizimi hataları derleme aşamasında çıkar.
Etiketler: gcc, derleme, linker

## S27-02 · Eşleştirme
Konu: Kütüphaneler ve yapı araçları
Soru: Kavramları tanımlarıyla eşleştirin.
Eşleşmeler:
- staticLib: Statik kütüphane (.a / .lib) => copied: Derleme sırasında çalıştırılabilir dosyanın içine kopyalanır
- dynamicLib: Dinamik kütüphane (.so / .dll) => loaded: Çalışma zamanında yüklenir ve birden fazla program tarafından paylaşılabilir
- cmake: CMake => generator: Platforma uygun Makefile veya proje dosyaları üretir
Fazladan seçenekler:
- decoy: Kaynak kodu derlemeden doğrudan yorumlayarak çalıştırır
İpucu: Kod ne zaman programa dahil oluyor?
Kısa açıklama: Statik kütüphane programa gömülür, dinamik kütüphane çalışırken yüklenir; CMake yapı dosyaları üretir.
Açıklama: Statik bağlama dağıtımı kolaylaştırır ama dosyayı büyütür ve güncelleme için yeniden derleme gerektirir; gömülü sistemlerde genellikle tercih edilir. Dinamik kütüphaneler bellekte paylaşılır ve ayrı güncellenebilir. Make yapı kurallarını çalıştırır; CMake ise farklı platformlar için bu kuralları üretir.
Etiketler: kütüphane, cmake, make

# S28 · Zorlayıcı · Teori

Alan: Gömülü ve işletim sistemleri

Sanal bellek, paging ve page fault nedir? TLB ne işe yarar?

Nerede soruldu: klasik işletim sistemleri sorusu.

Anahtar noktalar:
- Her process kendi sanal adres alanını görür; MMU adresi fiziksel adrese çevirir
- Sayfa tablosu sanal sayfaları fiziksel çerçevelere eşler
- TLB son adres çevirilerini önbellekte tutar
- Page fault'ta işletim sistemi sayfayı getirir; geçersiz adres segmentation fault olur
- Sık swap performansı düşürür; gerçek zamanlı sistemlerde sayfalar belleğe kilitlenir

## S28-01 · Çoklu seçim
Konu: Sanal bellek
Soru: Sanal bellek için doğru ifadeleri seçin.
Şıklar:
- [x] a: Her process kendi sanal adres alanını görür; MMU bunu fiziksel adrese çevirir
  Neden: Doğru; böylece process'ler birbirinden yalıtılır.
- [ ] b: TLB, sık kullanılan sayfaların verisini önbellekte tutar
  Neden: Yanlış; TLB veri değil, son kullanılan sanal–fiziksel adres çevirilerini tutar; veriyi önbelleğe alan CPU cache'tir.
- [x] c: Erişilen sayfa bellekte değilse page fault oluşur; işletim sistemi sayfayı getirip programı sürdürür
  Neden: Doğru; geçersiz bir adrese erişim ise segmentation fault'a dönüşür.
- [x] d: Sayfanın diskten (swap) getirilmesi bellekten okumaya göre çok daha yavaştır
  Neden: Doğru; bu yüzden sık swap performansı çökertir.
- [ ] e: Paging harici parçalanmayı artırır
  Neden: Sabit boyutlu sayfalar harici parçalanmayı ortadan kaldırır; iç parçalanma olabilir.
İpucu: Adres çevirisini donanımda kim yapar?
Kısa açıklama: Sanal bellek adresleri sayfalar hâlinde fiziksel belleğe eşler; TLB bu çeviriyi hızlandırır.
Açıklama: Sayfa tablosu sanal sayfaları fiziksel çerçevelere eşler. Erişilen sayfa bellekte değilse page fault oluşur ve işletim sistemi sayfayı getirir; geçersiz bir adrese erişim ise segmentation fault'a dönüşür. Gerçek zamanlı sistemlerde öngörülebilirlik için sayfalar genellikle belleğe kilitlenir.
Etiketler: sanal-bellek, paging, tlb

# S29 · Orta · Karşılaştırma

Alan: Gömülü ve işletim sistemleri
Şirket: Roketsan

Verilog/VHDL ile bir yazılım dili arasındaki temel fark nedir?

Nerede soruldu: Roketsan ilanı (Verilog veya VHDL zorunlu).

Anahtar noktalar:
- HDL eşzamanlı çalışan donanımı tanımlar; yazılım dili sıralı komut üretir
- Sentezlenebilir kod FPGA veya ASIC devresine dönüşür
- Saat kenarı, senkron tasarım ve zamanlama kısıtları temel kavramlardır
- Ardışık mantıkta non-blocking (`<=`), kombinasyonel mantıkta blocking (`=`) atama
- Simülasyon ve testbench ile doğrulama

## S29-01 · Tek seçim
Konu: HDL
Soru: Verilog/VHDL ile C gibi bir yazılım dili arasındaki temel fark hangisidir?
Şıklar:
- [ ] a: HDL de C gibi sırayla çalışan komutlar üretir; tek fark FPGA'da daha hızlı yürütülmesidir
  Neden: HDL komut üretmez; sentezlenince gerçek bir donanım devresine dönüşür.
- [ ] b: HDL yalnız simülasyon için kullanılır; gerçek donanıma dönüştürülemez ve FPGA'ya yüklenemez
  Neden: Sentezlenebilir HDL kodu FPGA veya ASIC devresine dönüştürülür.
- [x] c: HDL eşzamanlı çalışan donanımı tanımlar; sentezlenince devreye dönüşür
- [ ] d: HDL nesne yönelimlidir
  Neden: Verilog ve VHDL donanım tanımlama dilleridir; nesne yönelim temel özellikleri değildir.
İpucu: Kodun sonucu bir program mı, bir devre mi?
Kısa açıklama: HDL paralel çalışan donanımı tanımlar; yazılım dili sıralı komutlar üretir.
Açıklama: HDL'de yazılan her yapı aynı anda var olan donanıma karşılık gelir; saat kenarı, senkron tasarım ve zamanlama kısıtları temel kavramlardır. Simülasyon için sentezlenemeyen yapılar da yazılabilir, ama FPGA'ya giden kod sentezlenebilir alt kümeyle sınırlıdır.
Etiketler: verilog, vhdl, fpga

## S29-02 · Doğru / Yanlış
Konu: HDL
Soru: Verilog'da aynı saat kenarına bağlı iki ayrı `always` bloğu, C'deki iki fonksiyon çağrısı gibi dosyada yazıldıkları sırayla art arda çalışır.
Şıklar:
- [ ] Doğru
  Neden: always blokları eşzamanlı donanımı tanımlar; aynı saat kenarında paralel çalışırlar.
- [x] Yanlış
  Neden: Doğru; HDL'de bloklar sıralı kod değil, paralel donanımdır.
İpucu: Donanımda iki devre sırayla mı çalışır?
Kısa açıklama: always blokları paralel donanımı tanımlar.
Açıklama: Kaynak dosyadaki sıralama, blokların çalışma sırasını belirlemez. Bir always bloğunun içindeki blocking (=) atamalar simülasyonda sıralı değerlendirilir, ama bloklar birbirine göre eşzamanlıdır; bu yüzden ardışık mantıkta non-blocking (<=) atama kullanılır.
Etiketler: verilog, eşzamanlılık

# S30 · Orta · Teori

Alan: Gömülü ve işletim sistemleri
Şirket: Roketsan

Gömülü kodunuzun güvenilirliğini ve emniyetini nasıl sağlarsınız? Kodlama standardı (ör. MISRA C) ve statik analiz neden kullanılır?

Nerede soruldu: Roketsan staj (aday beyanı); kodlama standardı klasik gömülü yazılım sorusu.

Anahtar noktalar:
- MISRA C gibi bir kodlama standardıyla riskli yapıları yasaklamak
- Statik analizi sürekli entegrasyonda çalıştırmak; derleyici uyarılarını açık tutmak
- Birim testlerini hem bilgisayarda hem hedef donanımda koşturmak
- Savunmacı programlama: girdi ve sınır kontrolleri, dönen hata kodlarını kontrol etmek
- Watchdog, dinamik tahsisten kaçınmak ve kod incelemesi

## S30-01 · Çoklu seçim
Konu: Güvenilir gömülü yazılım
Soru: Gömülü yazılımın güvenilirliğini artıran uygulamaları seçin.
Şıklar:
- [x] a: MISRA C gibi bir standartla tanımsız ve belirsiz davranışa yol açan yapıları yasaklamak
  Neden: Doğru; hata sınıflarını kod yazılırken ortadan kaldırır.
- [x] b: Statik analiz aracını sürekli entegrasyonda her derlemede çalıştırmak
  Neden: Doğru; ihlaller birikmeden yakalanır.
- [x] c: Birim testlerini hem bilgisayarda hem hedef donanımda koşturmak
  Neden: Doğru; donanıma özgü davranışlar da test edilir.
- [ ] d: Derleyici uyarılarını kapatıp derlemeyi temiz göstermek
  Neden: Uyarılar çoğu zaman gerçek hataları gösterir; açık tutulup giderilmelidir.
- [ ] e: Watchdog timer'ı ana döngü yerine periyodik bir timer kesmesinde beslemek
  Neden: Yanlış; timer kesmesi ana döngü takılsa da çalışır ve watchdog tetiklenmez; besleme ana döngünün ilerlediğini göstermelidir.
İpucu: Hataları mümkün olduğunca erken ve otomatik yakalamak hedeflenir.
Kısa açıklama: Kodlama standardı, statik analiz, donanımda test ve watchdog güvenilirliği artırır.
Açıklama: MISRA C dinamik bellek, sınırsız özyineleme ve belirsiz tip dönüşümleri gibi riskli yapıları kısıtlar. Statik analiz bu kuralları ve olası taşmaları kod çalıştırılmadan denetler. Testler ise beklenen davranışı doğrular; ikisi birbirinin yerine geçmez.
Etiketler: misra, statik-analiz, emniyet

## S30-02 · Doğru / Yanlış
Konu: Statik analiz
Soru: Statik analiz aracının uyarı vermediği bir modül için ayrıca birim testi yazmak gerekmez.
Şıklar:
- [ ] Doğru
  Neden: Statik analiz belirli hata sınıflarını bulur ama gereksinimin doğru karşılandığını göstermez; test yine gereklidir.
- [x] Yanlış
  Neden: Doğru; statik analiz ve test birbirini tamamlar.
İpucu: Statik analiz kodun doğru şeyi yaptığını bilebilir mi?
Kısa açıklama: Statik analiz testi tamamlar ama yerine geçmez.
Açıklama: Statik analiz null erişimi, taşma riski ve kural ihlallerini bulur; ama bir hız hesabının yanlış formülle yapıldığını bilemez. Emniyet kritik süreçler hem analiz hem test kanıtı ister.
Etiketler: statik-analiz, test

# S31 · Kolay · Karşılaştırma

Alan: Ağ ve güvenlik
Şirket: HAVELSAN, Baykar, Roketsan

TCP ile UDP arasındaki fark nedir? Telemetri veya canlı video için hangisini seçersiniz?

Nerede soruldu: HAVELSAN ve Baykar (aday beyanları); Roketsan ilanı (UDP/TCP).

Anahtar noktalar:
- TCP: bağlantı tabanlı, güvenilir ve sıralı; üçlü el sıkışma ve yeniden iletim
- UDP: bağlantısız, sırasız ve onaysız ama düşük gecikmeli
- Canlı video ve telemetride genellikle UDP; geç gelen veri işe yaramaz
- Gereken güvenilirlik uygulama katmanında eklenir (ör. önemli komutlara onay)
- Multicast UDP ile yapılır

## S31-01 · Tek seçim
Konu: TCP ve UDP
Soru: Bir İHA'dan yer istasyonuna canlı video aktarımında hangisi genellikle tercih edilir?
Şıklar:
- [ ] a: TCP, çünkü kaybolan her paketi yeniden gönderdiği için görüntü her zaman en güncel kalır
  Neden: Yeniden gönderim gecikme ekler; canlı yayında eski kareyi beklemek, kaybı tolere etmekten kötüdür.
- [x] b: UDP; birkaç kayıp kare, artan gecikmeden daha iyidir
- [ ] c: TCP, çünkü UDP paket boyutu video karesi taşımaya yetmez ve karelerin parçalanması imkânsızdır
  Neden: Video, uygulama katmanında (ör. RTP) parçalara bölünerek UDP ile taşınır.
- [ ] d: Fark etmez; iki protokol de aynı gecikme ve güvenilirlik özelliklerine sahiptir
  Neden: TCP sıralama ve yeniden iletim yapar, UDP yapmaz; bu gecikmeyi doğrudan etkiler.
İpucu: Canlı yayında geç gelen veri işe yarar mı?
Kısa açıklama: Gecikmeye duyarlı ve kaybı tolere eden akışlarda UDP tercih edilir.
Açıklama: TCP bağlantı, sıralama, yeniden iletim ve tıkanıklık kontrolü sağlar; tek bir kayıp sonraki tüm verinin beklemesine yol açabilir. UDP bu garantileri vermez ama gecikmesi düşüktür; gerekli güvenilirlik (ör. önemli komutların onaylanması) uygulama katmanında eklenir.
Etiketler: tcp, udp, ağ

## S31-02 · Çoklu seçim
Konu: TCP ve UDP
Soru: TCP'nin özelliklerini seçin.
Şıklar:
- [x] a: Bağlantı kurmak için üçlü el sıkışma yapar
  Neden: Doğru; SYN, SYN-ACK ve ACK.
- [x] b: Kaybolan segmentleri yeniden iletir
  Neden: Doğru; onay gelmeyen veri tekrar gönderilir.
- [ ] c: Mesaj sınırlarını korur; her send çağrısı karşı tarafta ayrı bir recv ile okunur
  Neden: TCP bayt akışıdır; birden çok send tek recv'de gelebilir veya bir send bölünebilir. Mesaj sınırlarını uygulama belirler.
- [ ] d: Multicast gönderimi destekler
  Neden: Multicast UDP ile yapılır; TCP noktadan noktaya bağlantıdır.
- [ ] e: Başlığı UDP başlığından küçüktür
  Neden: TCP başlığı en az 20 bayt, UDP başlığı 8 bayttır.
İpucu: Güvenilirliğin bedeli nedir?
Kısa açıklama: TCP güvenilir, sıralı ve bağlantı tabanlıdır.
Açıklama: TCP'nin güvenilirlik mekanizmaları başlığı büyütür ve gecikme ekler. UDP ise bağlantısız, sırasız ve onaysızdır; bu yüzden hem multicast hem de düşük gecikmeli akışlar için uygundur.
Etiketler: tcp, ağ

# S32 · Orta · Teori

Alan: Ağ ve güvenlik

OSI ve TCP/IP katmanlarını açıklayın. Tarayıcıya bir adres yazdığınızda neler olur?

Nerede soruldu: klasik ağ sorusu.

Anahtar noktalar:
- OSI yedi katmanlıdır; TCP/IP modeli uygulama, taşıma, ağ ve bağlantı katmanlarından oluşur
- HTTP uygulama, TCP/UDP taşıma, IP ağ, Ethernet veri bağlantı katmanındadır
- Adres yazılınca: DNS çözümleme, TCP bağlantısı ve TLS el sıkışma
- Ardından HTTP isteği, sunucu yanıtı ve sayfanın çizilmesi
- Yerel ağda bir sonraki adımın MAC adresi ARP ile bulunur

## S32-01 · Eşleştirme
Konu: Ağ katmanları
Soru: Protokolleri katmanlarıyla eşleştirin.
Eşleşmeler:
- http: HTTP => app: Uygulama katmanı
- tcp: TCP => transport: Taşıma katmanı
- ip: IP => network: Ağ katmanı
- ethernet: Ethernet çerçevesi => link: Veri bağlantı katmanı
Fazladan seçenekler:
- decoy: Oturum katmanı
İpucu: Uçtan uca güvenilirlik hangi katmanın işidir?
Kısa açıklama: HTTP uygulama, TCP taşıma, IP ağ, Ethernet veri bağlantı katmanındadır.
Açıklama: OSI yedi katmanlı kavramsal bir modeldir; pratikte kullanılan TCP/IP modeli oturum ve sunum katmanlarını uygulama katmanında birleştirir. Her katman kendi başlığını ekler ve alt katmana devreder.
Etiketler: osi, tcp-ip, ağ

## S32-02 · Sıralama
Konu: Ağ katmanları
Soru: Tarayıcıya bir HTTPS adresi yazıldığında olan adımları doğru sırayla dizin.
Sıra:
1. dns: DNS ile alan adı IP adresine çözülür
2. handshake: Sunucuyla TCP bağlantısı kurulur (üçlü el sıkışma)
3. tls: TLS el sıkışmasıyla şifreli kanal kurulur
4. request: Tarayıcı HTTP isteğini gönderir
5. render: Gelen yanıt işlenir ve sayfa çizilir
İpucu: Adres bulunmadan bağlantı, bağlantı kurulmadan şifreleme olmaz.
Kısa açıklama: DNS, TCP bağlantısı, TLS, HTTP isteği ve çizim.
Açıklama: IP adresi bulunduktan sonra yerel ağda bir sonraki adımın MAC adresi ARP ile öğrenilir. TLS sertifika doğrulaması ve anahtar değişimiyle şifreli kanal kurar; HTTP isteği bu kanal üzerinden gider. Önbellekler (DNS, tarayıcı) bazı adımları atlatabilir.
Etiketler: dns, tls, http

# S33 · Kolay · Karşılaştırma

Alan: Ağ ve güvenlik

Unicast, multicast ve broadcast arasındaki fark nedir? Aynı veriyi birçok alıcıya göndermenin maliyetini karşılaştırın.

Nerede soruldu: klasik ağ sorusu.

Anahtar noktalar:
- Unicast tek alıcıya, multicast gruba, broadcast yerel ağdaki herkese gönderir
- Multicast'te gönderici bir kez yollar; ağ yalnız gruba katılanlara çoğaltır
- Grup üyeliği IGMP ile yönetilir
- Broadcast yönlendiricileri aşmaz ve ilgisiz cihazları da meşgul eder
- Aynı veriyi çok alıcıya unicast ile göndermek bant genişliğini katlar

## S33-01 · Eşleştirme
Konu: Gönderim türleri
Soru: Gönderim türlerini tanımlarıyla eşleştirin.
Eşleşmeler:
- unicast: Unicast => one: Tek bir alıcıya gönderim
- multicast: Multicast => group: Gruba katılmış alıcılara tek gönderimle dağıtım
- broadcast: Broadcast => all: Yerel ağdaki tüm cihazlara gönderim
Fazladan seçenekler:
- decoy: Aynı adresi paylaşan sunuculardan en yakın olana yönlendirilen gönderim
İpucu: Alıcı kümesinin büyüklüğüne bakın.
Kısa açıklama: Unicast birine, multicast gruba, broadcast herkese gönderir.
Açıklama: Multicast'te gönderici paketi bir kez yollar; ağ paketi yalnız gruba katılmış alıcılara giden yollarda çoğaltır (IGMP ile grup üyeliği). Broadcast yönlendiricileri aşmaz ve ilgisiz tüm cihazları da meşgul eder. Fazladan seçenek anycast'i anlatır.
Etiketler: multicast, ağ

## S33-02 · Tek seçim
Konu: Gönderim türleri
Soru: 20 konsola aynı telemetri akışını göndermek için hangisi ağı en az yorar?
Şıklar:
- [x] a: Multicast; gönderici paketi bir kez yollar, ağ yalnız gruba katılanlara çoğaltır
- [ ] b: Unicast; her konsola ayrı bağlantı açmak en güvenilir ve en ucuz yoldur
  Neden: Unicast'te gönderici aynı veriyi 20 kez yollar; bant genişliği 20 katına çıkar.
- [ ] c: Broadcast; yönlendiricileri de aşar
  Neden: Broadcast yerel ağla sınırlıdır ve ilgisiz tüm cihazları da yorar.
- [ ] d: Tek bir TCP bağlantısı
  Neden: TCP noktadan noktaya bir taşıma protokolüdür; tek bağlantı yalnız bir alıcıya ulaşır.
İpucu: Gönderici aynı paketi kaç kez yollamalı?
Kısa açıklama: Çok alıcılı aynı akış için multicast en verimlisidir.
Açıklama: Multicast özellikle simülasyon, komuta kontrol ve sensör dağıtım ağlarında yaygındır. Bedeli, ağ cihazlarının multicast yönlendirmeyi desteklemesi ve UDP kullanıldığı için güvenilirliğin uygulamada sağlanmasıdır.
Etiketler: multicast, telemetri

# S34 · Orta · Kod yazma

Alan: Veritabanı ve uygulama
Şirket: HAVELSAN

Bir ER diyagramı çizin ve SQL sorgusu yazın: JOIN türleri ve GROUP BY.

Nerede soruldu: HAVELSAN iş analistliği (aday beyanı).

Anahtar noktalar:
- ER diyagramı: varlıklar, ilişkiler ve kardinalite (1-1, 1-N, N-N)
- N-N ilişki ara tabloyla kurulur
- INNER, LEFT ve FULL OUTER JOIN farkları
- `GROUP BY` ile gruplama ve `COUNT`, `SUM` gibi toplama fonksiyonları
- `WHERE` gruplamadan önce satırları, `HAVING` sonra grupları filtreler

## S34-01 · Eşleştirme
Konu: SQL JOIN
Soru: JOIN türlerini sonuçlarıyla eşleştirin.
Eşleşmeler:
- inner: INNER JOIN => matching: Yalnız iki tabloda eşleşen satırlar
- left: LEFT JOIN => allLeft: Soldaki tüm satırlar; eşleşme yoksa sağ sütunlar NULL
- full: FULL OUTER JOIN => allBoth: İki tablodaki tüm satırlar; eşleşmeyen taraf NULL
Fazladan seçenekler:
- decoy: İki tablonun tüm satır kombinasyonları; birleştirme koşulu uygulanmaz
İpucu: Eşleşmeyen satırlara ne oluyor?
Kısa açıklama: INNER eşleşenleri, LEFT soldakilerin hepsini, FULL iki taraftakilerin hepsini getirir.
Açıklama: LEFT JOIN, "hiç siparişi olmayan müşteriler" gibi soruları WHERE sağ.id IS NULL ile yanıtlamak için kullanılır. Fazladan seçenek CROSS JOIN'i anlatır ve n × m satır üretir.
Etiketler: sql, join

## S34-02 · Tek seçim
Konu: SQL GROUP BY
Soru: `HAVING` ile `WHERE` arasındaki fark nedir?
Şıklar:
- [ ] a: `WHERE` yalnız `SELECT` sorgularında, `HAVING` ise yalnız `UPDATE` ve `DELETE` sorgularında kullanılabilir
  Neden: `HAVING` gruplanmış sonuçları filtreler; `UPDATE` ve `DELETE` ile ilgisi yoktur.
- [x] b: `WHERE` gruplamadan önce satırları, `HAVING` gruplamadan sonra grupları filtreler
- [ ] c: İkisi aynıdır
  Neden: Toplama fonksiyonlarıyla filtre, örneğin `COUNT(*) > 5`, yalnız `HAVING`'de yazılır.
- [ ] d: `HAVING` daha hızlıdır
  Neden: Hız değil uygulanma aşaması farklıdır; `WHERE` ile erken filtrelemek genellikle daha verimlidir.
İpucu: `COUNT(*)` değeri hangi aşamada hesaplanır?
Kısa açıklama: `WHERE` satırları gruplamadan önce, `HAVING` grupları gruplamadan sonra filtreler.
Açıklama: Sorgunun mantıksal sırası `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `SELECT` ve `ORDER BY`'dır. Bu yüzden toplama sonucuna göre filtre `HAVING`'de, tek tek satırlara göre filtre `WHERE`'de yazılır.
Etiketler: sql, group-by

## S34-03 · Boşluk doldurma
Konu: SQL GROUP BY
Soru: Her departmandaki çalışan sayısını bulan sorguyu tamamlayın: `SELECT dept_id, COUNT(*) FROM employees ____ dept_id;`
Cevap: GROUP BY
İpucu: Satırları aynı `dept_id` değerine göre toplamak gerekir.
Kısa açıklama: Eksik ifade `GROUP BY`'dır.
Açıklama: `GROUP BY dept_id` aynı departmandaki satırları tek grupta toplar ve `COUNT(*)` her grubun satır sayısını verir. `SELECT` listesindeki toplama dışı sütunlar `GROUP BY`'da yer almalıdır.
Etiketler: sql, group-by

## S34-04 · Tek seçim
Konu: SQL JOIN ve COUNT
Soru: Hiç çalışanı olmayan bir departman bu sorgunun sonucunda nasıl görünür?
Kod:
```sql
SELECT d.name, COUNT(e.id) AS employee_count
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id
GROUP BY d.name;
```
Şıklar:
- [x] a: `employee_count` değeri 0 olarak listelenir
- [ ] b: Departman sonuçta hiç yer almaz
  Neden: Eşleşmeyen satırları eleyen INNER JOIN'dir; LEFT JOIN soldaki tüm departmanları tutar.
- [ ] c: `employee_count` değeri 1 olarak listelenir
  Neden: 1 sonucu `COUNT(*)` ile çıkardı; `COUNT(e.id)` NULL değerleri saymaz.
- [ ] d: `employee_count` değeri NULL olarak listelenir
  Neden: `COUNT` NULL döndürmez; sayılacak değer yoksa 0 döner.
İpucu: LEFT JOIN eşleşmeyen satırı nasıl doldurur; `COUNT(sütun)` NULL değerleri sayar mı?
Kısa açıklama: LEFT JOIN departmanı korur; `COUNT(e.id)` NULL saymadığı için 0 döner.
Açıklama: Çalışanı olmayan departman LEFT JOIN sonucunda bir kez, çalışan sütunları NULL olarak yer alır. `COUNT(e.id)` yalnız NULL olmayan değerleri saydığı için bu grupta 0 döner. `COUNT(*)` kullanılsaydı satırın kendisi sayılır ve sonuç 1 olurdu; "çalışanı olmayanlar da görünsün" sorularındaki klasik tuzak budur.
Etiketler: sql, join, count

# S35 · Orta · Teori

Alan: Veritabanı ve uygulama

Normalizasyon nedir (1NF–3NF)? Index nasıl çalışır; ne zaman sorguları yavaşlatır?

Nerede soruldu: klasik veritabanı sorusu.

Anahtar noktalar:
- 1NF atomik değer, 2NF tam anahtar bağımlılığı, 3NF geçişli bağımlılığın olmaması
- Normalizasyon tekrarı ve güncelleme anomalilerini azaltır
- Index (genellikle B-tree) aramayı hızlandırır
- Index yazmayı yavaşlatır ve yer kaplar; düşük seçicilikli sütunda faydası azdır
- Okuma ağırlıklı raporlamada bilinçli denormalizasyon yapılabilir

## S35-01 · Eşleştirme
Konu: Normalizasyon
Soru: Normal formları kurallarıyla eşleştirin.
Eşleşmeler:
- nf1: 1NF => atomic: Her hücre tek (atomik) değer tutar; tekrar eden gruplar yoktur
- nf2: 2NF => fullKey: Anahtar olmayan sütunlar bileşik anahtarın tamamına bağlıdır
- nf3: 3NF => noTransitive: Anahtar olmayan sütunlar başka bir anahtar olmayan sütuna bağlı değildir
Fazladan seçenekler:
- decoy: Tablodaki tüm sütunlar indekslenmiştir
İpucu: Her form bir öncekinin üzerine bir kural ekler.
Kısa açıklama: 1NF atomik değer, 2NF tam anahtar bağımlılığı, 3NF geçişli bağımlılığın olmamasıdır.
Açıklama: Normalizasyon veri tekrarını ve güncelleme anomalilerini azaltır. Raporlama gibi okuma ağırlıklı senaryolarda bazen bilinçli olarak denormalizasyon yapılır.
Etiketler: veritabanı, normalizasyon

## S35-02 · Doğru / Yanlış
Konu: Index
Soru: Bir sütuna index eklemek, o sütuna göre filtreleyen sorguları hızlandırdığı gibi aynı tablodaki INSERT ve UPDATE işlemlerini de hızlandırır.
Şıklar:
- [ ] Doğru
  Neden: Index okuma sorgularını hızlandırabilir ama her INSERT ve UPDATE'te index de güncellendiği için yazma maliyeti artar.
- [x] Yanlış
  Neden: Doğru; yazma ağırlıklı veya düşük seçicilikli sütunlarda index zararlı olabilir.
İpucu: Yeni bir satır eklendiğinde index'e ne olur?
Kısa açıklama: Index okumayı hızlandırır ama yazmayı yavaşlatır ve yer kaplar.
Açıklama: B-tree index aramayı log n'e indirir. Ancak her yazma işleminde index de güncellenir; çok az farklı değer içeren (düşük seçicilikli) bir sütundaki index ise tablo taramasından daha faydalı olmayabilir.
Etiketler: veritabanı, index

# S36 · Orta · Teori

Alan: Veritabanı ve uygulama

Transaction ve ACID nedir? Isolation seviyeleri hangi anomalileri engeller?

Nerede soruldu: klasik veritabanı sorusu.

Anahtar noktalar:
- Atomicity: işlemlerin hepsi uygulanır ya da hiçbiri
- Consistency: kurallara uyan bir durumdan yine kurallara uyan bir duruma geçiş
- Isolation: eşzamanlı işlemler birbirinin ara sonuçlarını görmez
- Durability: onaylanan değişiklik çökmeden sonra da kalıcıdır
- Isolation seviyeleri ve anomaliler: dirty read, non-repeatable read, phantom read

## S36-01 · Eşleştirme
Konu: ACID
Soru: ACID özelliklerini tanımlarıyla eşleştirin.
Eşleşmeler:
- a: Atomicity => allOrNothing: İşlemlerin hepsi uygulanır ya da hiçbiri uygulanmaz
- c: Consistency => rules: İşlem veritabanını kurallara uyan bir durumdan yine kurallara uyan bir duruma taşır
- i: Isolation => concurrent: Eşzamanlı işlemler birbirinin ara sonuçlarını görmeden çalışır
- d: Durability => persisted: Onaylanan değişiklik çökmeden sonra da kalıcıdır
Fazladan seçenekler:
- decoy: İşlemin en kısa sürede tamamlanacağını garanti eder
İpucu: Para transferinde yarım kalan işlem ne olmalı?
Kısa açıklama: ACID; bölünmezlik, tutarlılık, yalıtım ve kalıcılıktır.
Açıklama: Bir hesaptan para çekip diğerine yatırmak tek bir transaction olmalıdır: ya ikisi birden olur ya hiçbiri. Kalıcılık genellikle yazma önce günlüğe (write-ahead log) kaydedilerek sağlanır.
Etiketler: veritabanı, acid, transaction

## S36-02 · Tek seçim
Konu: Isolation seviyeleri
Soru: Dirty read nedir?
Şıklar:
- [ ] a: Bir işlemin aynı sorguyu iki kez çalıştırınca araya giren eklemeler yüzünden farklı sayıda satır görmesi
  Neden: Bu phantom read'dir.
- [ ] b: Bir işlemin aynı satırı iki kez okuyup arada başka bir işlemin onayladığı güncelleme yüzünden farklı değer görmesi
  Neden: Bu non-repeatable read'dir.
- [x] c: Başka bir işlemin henüz onaylanmamış (commit edilmemiş) değişikliğini okumak
- [ ] d: Bozuk bir disk sektöründen okunan veri
  Neden: Dirty read bir eşzamanlılık anomalisidir, donanım hatası değildir.
İpucu: Okunan değer geri alınırsa ne olur?
Kısa açıklama: Dirty read, commit edilmemiş veriyi okumaktır.
Açıklama: READ UNCOMMITTED dirty read'e izin verir; READ COMMITTED bunu engeller, REPEATABLE READ non-repeatable read'i, SERIALIZABLE phantom read'i de engeller. Daha yüksek yalıtım daha fazla kilitleme veya yeniden deneme maliyeti getirir.
Etiketler: veritabanı, isolation

# S37 · Orta · Karşılaştırma

Alan: Veritabanı ve uygulama
Şirket: HAVELSAN

Mikroservis ile monolit mimari arasındaki fark nedir? Hangi durumda hangisini seçersiniz?

Nerede soruldu: HAVELSAN (Spring ve mikroservis, aday beyanı).

Anahtar noktalar:
- Monolit tek dağıtım birimidir; geliştirme ve hata ayıklama daha basittir
- Mikroservisler bağımsız olarak dağıtılır ve ölçeklenir
- Bedeli: ağ gecikmesi, dağıtık veri tutarlılığı, izleme ve operasyon yükü
- Küçük ekip ve belirsiz sınırlarda modüler monolitle başlamak
- Servis sınırlarını iş alanına göre belirlemek

## S37-01 · Çoklu seçim
Konu: Mikroservis ve monolit
Soru: Mikroservis ve monolit mimariler için doğru ifadeleri seçin.
Şıklar:
- [x] a: Mikroservisler bağımsız olarak dağıtılabilir ve ölçeklenebilir
  Neden: Doğru; her servis ayrı yaşam döngüsüne sahiptir.
- [x] b: Mikroservislerde servisler arası ağ çağrıları gecikme ve hata yönetimi maliyeti getirir
  Neden: Doğru; bir fonksiyon çağrısı artık başarısız olabilen bir ağ isteğidir.
- [ ] c: Mikroservis mimarisi izleme ve işletim yükünü monolite göre azaltır
  Neden: Dağıtık sistemler izleme, veri tutarlılığı ve dağıtım yükünü artırır.
- [x] d: Küçük bir ekip ve belirsiz alan sınırlarıyla başlarken iyi modüllere ayrılmış bir monolit çoğu zaman daha uygundur
  Neden: Doğru; sınırlar netleştikçe servislere ayırmak daha az risklidir.
- [x] e: Monolitte modüller arası çağrılar ağ yerine süreç içinde yapılır
  Neden: Doğru; bu yüzden ağ kaynaklı gecikme ve kısmi hata sorunları oluşmaz.
İpucu: Dağıtık sistemin bedeli nedir?
Kısa açıklama: Mikroservis bağımsızlık kazandırır ama dağıtık sistem karmaşıklığı getirir.
Açıklama: Mikroservislerin faydası ekiplerin ve bileşenlerin bağımsız ilerleyebilmesidir; bedeli ağ hataları, dağıtık veri tutarlılığı, izleme ve operasyon yüküdür. Bu yüzden çoğu proje modüler bir monolitle başlayıp ihtiyaç doğdukça ayrışır.
Etiketler: mikroservis, mimari

# S38 · Kolay · Teori

Alan: Veritabanı ve uygulama
Şirket: HAVELSAN

Linux'ta süreçleri ve portları nasıl izlersiniz? Dosya izinleri ve sinyaller nasıl çalışır? Basit bir shell script yazın.

Nerede soruldu: HAVELSAN (aday beyanı).

Anahtar noktalar:
- Süreçler: `ps aux`, `top`; portlar: `ss -tlnp`
- İzinler: sahip, grup ve diğerleri için `rwx`; `chmod` ve `chown`
- Sinyaller: `kill -15` temiz kapanış, `kill -9` zorla sonlandırma
- Servisler ve loglar: `systemctl`, `journalctl`
- Basit shell script: değişken, döngü, koşul ve çıkış kodu

## S38-01 · Eşleştirme
Konu: Linux komutları
Soru: İhtiyaçları komutlarla eşleştirin.
Eşleşmeler:
- ps: Çalışan süreçleri listelemek => psCmd: ps aux
- port: Bir portu dinleyen süreci bulmak => ssCmd: ss -tlnp
- perm: Dosyaya sahibi için okuma-yazma-çalıştırma, grup ve diğerleri için yalnız okuma izni vermek => chmodCmd: chmod 744 dosya
- signal: Sürece sonlandırma (SIGTERM) sinyali göndermek => killCmd: kill -15 PID
Fazladan seçenekler:
- decoy: chown 744 dosya
İpucu: İzinler chmod ile, sahiplik chown ile değiştirilir.
Kısa açıklama: ps süreçleri, ss portları gösterir; chmod izin verir, kill sinyal gönderir.
Açıklama: chmod'daki her rakam sahip, grup ve diğerleri için okuma (4), yazma (2) ve çalıştırma (1) toplamıdır. kill -15 sürece temiz kapanma şansı tanır; kill -9 (SIGKILL) ise yakalanamaz ve süreci hemen sonlandırır.
Etiketler: linux, komut-satırı

## S38-02 · Boşluk doldurma
Konu: Linux izinleri
Soru: `chmod 640 rapor.txt` sonrasında grup üyelerinin bu dosya üzerindeki iznini rwx biçiminde yazın (ör. r-x).
Cevap: r--
İpucu: Ortadaki rakam grubun iznidir.
Kısa açıklama: 4 yalnız okuma demektir: r--.
Açıklama: 640'ta sahip 6 (rw-), grup 4 (r--) ve diğerleri 0 (---) alır. Bu, sahibin düzenleyebildiği, grubun okuyabildiği ve diğerlerinin hiç erişemediği bir dosyadır.
Etiketler: linux, chmod

# S39 · Orta · Kod okuma

Alan: Veritabanı ve uygulama
Şirket: Baykar

JavaScript'te closure nedir? Bir örnekle açıklayın.

Nerede soruldu: Baykar (aday beyanı).

Anahtar noktalar:
- Closure, tanımlandığı kapsamdaki değişkenleri hatırlayan fonksiyondur
- Dış fonksiyon dönse de yakalanan değişken yaşamaya devam eder
- Kullanım: sayaç ve fabrika fonksiyonları, olay işleyicileri, veriyi gizleme
- Döngüde `var` tuzağı; `let` her tur için yeni bir bağlama oluşturur

## S39-01 · Boşluk doldurma
Konu: Closure
Soru: `function counter() { let n = 0; return () => ++n; } const next = counter(); next(); next();` sonrasında üçüncü `next()` çağrısı ne döndürür?
Cevap: 3
Kabul: üç
İpucu: `n` her çağrıda aynı kapsamda yaşar.
Kısa açıklama: Closure `n` değişkenini tuttuğu için üçüncü çağrı 3 döndürür.
Açıklama: `counter` dönse de döndürdüğü fonksiyon `n`'yi yakaladığı için değişken yaşamaya devam eder. Her `next()` çağrısı aynı `n`'yi artırır: 1, 2 ve 3. `counter()` tekrar çağrılırsa yeni ve bağımsız bir `n` oluşur.
Etiketler: javascript, closure

## S39-02 · Tek seçim
Konu: Closure
Soru: Closure nedir?
Şıklar:
- [x] a: Tanımlandığı kapsamdaki değişkenleri hatırlayan fonksiyon
- [ ] b: Bir fonksiyonun çalışması bittiğinde yerel değişkenlerinin bellekten silinmesini sağlayan mekanizma
  Neden: Tersine, closure'ın yakaladığı değişkenler fonksiyon dönse de yaşamaya devam eder.
- [ ] c: Bir nesnenin metotlarını dışarıdan erişime kapatıp sınıf içinden çağrılmasını sağlayan erişim belirleyicisi
  Neden: Closure bir erişim belirleyicisi değil, kapsam yakalamadır.
- [ ] d: Bir döngüyü erken sonlandırmak için kullanılan ve break'e benzeyen bir anahtar kelime
  Neden: Closure bir anahtar kelime değildir.
İpucu: Fonksiyon döndükten sonra yerel değişkene hâlâ erişilebiliyor mu?
Kısa açıklama: Closure, tanımlandığı kapsamı yakalayan fonksiyondur.
Açıklama: Closure'lar olay işleyicilerinde, fabrika fonksiyonlarında ve veriyi dışarıdan gizlemek (modül deseni) için kullanılır. Döngüde var ile tanımlanan değişkeni yakalayan closure'ların hepsinin aynı değeri görmesi bilinen bir tuzaktır; let her tur için yeni bir bağlama oluşturur.
Etiketler: javascript, closure

# S40 · Orta · Karşılaştırma

Alan: Ağ ve güvenlik

Simetrik ve asimetrik şifreleme arasındaki fark nedir? Hash ile şifreleme arasındaki fark nedir?

Nerede soruldu: klasik siber güvenlik sorusu.

Anahtar noktalar:
- Simetrik (ör. AES): tek anahtar, hızlı; büyük veri için
- Asimetrik (ör. RSA, ECC): açık ve özel anahtar; anahtar değişimi ve dijital imza
- Pratikte ikisi birlikte kullanılır: oturum anahtarı asimetrik yolla paylaşılır (TLS)
- Hash (ör. SHA-256) tek yönlüdür, şifreleme değildir; bütünlük kontrolünde kullanılır
- Parolalar tuzlanıp bcrypt veya Argon2 gibi yavaş fonksiyonlarla hash'lenir

## S40-01 · Eşleştirme
Konu: Kriptografi
Soru: Algoritmaları türleriyle eşleştirin.
Eşleşmeler:
- aes: AES => symmetric: Aynı anahtarla şifreleme ve çözme; hızlıdır, büyük veri için kullanılır
- rsa: RSA => asymmetric: Açık anahtarla şifrelenip özel anahtarla çözülür; anahtar değişimi ve imza için kullanılır
- sha: SHA-256 => hashFn: Tek yönlü özet; geri çevrilemez, bütünlük kontrolü için kullanılır
Fazladan seçenekler:
- decoy: Veriyi sıkıştırıp boyutunu küçültür
İpucu: Hangisinin anahtarı yoktur?
Kısa açıklama: AES simetrik, RSA asimetrik şifrelemedir; SHA-256 tek yönlü bir hash fonksiyonudur.
Açıklama: Pratikte ikisi birlikte kullanılır: asimetrik şifreleme (veya Diffie-Hellman) bir oturum anahtarını güvenle paylaşır, veri ise bu anahtarla simetrik olarak şifrelenir; TLS böyle çalışır. Hash fonksiyonları şifreleme değildir, çünkü çözülecek bir anahtar yoktur.
Etiketler: kriptografi, aes, rsa

## S40-02 · Doğru / Yanlış
Konu: Parola saklama
Soru: Parolaları saklarken tuz (salt) eklenmiş, yavaş bir parola hash fonksiyonu (ör. bcrypt) kullanmak, onları AES ile şifreleyip saklamaktan daha uygundur.
Şıklar:
- [x] Doğru
  Neden: Doğru; hash geri çevrilemez, salt ise hazır tablo saldırılarını engeller.
- [ ] Yanlış
  Neden: Şifrelenmiş parola anahtar ele geçirilince çözülür; doğrulama için parolanın kendisini saklamaya gerek yoktur.
İpucu: Parolayı sonradan geri okumaya ihtiyaç var mı?
Kısa açıklama: Parolalar şifrelenmez, tuzlanıp yavaş bir fonksiyonla hash'lenir.
Açıklama: Doğrulama için kullanıcının girdiği parola aynı tuzla hash'lenip saklanan değerle karşılaştırılır. bcrypt, scrypt veya Argon2 gibi bilerek yavaş fonksiyonlar kaba kuvvet denemelerini pahalı hâle getirir.
Etiketler: parola, hash

# S41 · Orta · Teori

Alan: Ağ ve güvenlik

SQL injection, XSS ve buffer overflow nasıl oluşur, nasıl önlenir?

Nerede soruldu: klasik siber güvenlik sorusu.

Anahtar noktalar:
- SQL injection: girdi sorgu metnine eklenir; önlem parametreli sorgu
- XSS: girdi kodlanmadan sayfaya yazılır; önlem bağlama uygun çıktı kodlaması
- Buffer overflow: sınır kontrolü olmadan yazmak; `strcpy` yerine boyut alan fonksiyonlar
- Girdi doğrulama ve en az yetki ilkesi
- Ek savunmalar: stack canary, ASLR ve DEP

## S41-01 · Eşleştirme
Konu: Güvenlik açıkları
Soru: Açıkları temel önlemleriyle eşleştirin.
Eşleşmeler:
- sqli: SQL injection => params: Parametreli sorgu (prepared statement)
- xss: XSS => encode: Kullanıcı verisini HTML'e yazmadan önce bağlama uygun kodlamak
- bof: Buffer overflow => bounds: Yazmadan önce sınır kontrolü ve boyut parametresi alan fonksiyonlar
Fazladan seçenekler:
- decoy: Sunucuya daha fazla bellek eklemek
İpucu: Üçünde de kök neden, güvenilmeyen girdiye fazla güvenmektir.
Kısa açıklama: SQL injection parametreli sorguyla, XSS çıktı kodlamasıyla, buffer overflow sınır kontrolüyle önlenir.
Açıklama: SQL injection girdi sorgu metnine eklendiğinde, XSS girdi kodlanmadan sayfaya yazıldığında oluşur. Buffer overflow'da hedef tampondan uzun veri yazılır ve bitişik bellek, hatta dönüş adresi bozulabilir. Girdi doğrulama yardımcıdır ama asıl önlem doğru katmandaki kodlama ve sınır kontrolüdür.
Etiketler: güvenlik, sql-injection, xss

## S41-02 · Tek seçim
Konu: Buffer overflow
Soru: `char buf[16]; strcpy(buf, input);` satırı neden tehlikelidir?
Şıklar:
- [x] a: input 15 karakterden uzunsa strcpy hedefin sınırını kontrol etmeden yazar ve bitişik belleği bozar
- [ ] b: strcpy yalnız sabit metinleri kopyalayabilir; değişken içerikli girdilerde derleme hatası verir
  Neden: strcpy her karakter dizisini kopyalar; sorun sınır kontrolü olmamasıdır.
- [ ] c: strcpy kopyalarken metni şifrelemediği için girdinin içeriği bellekte okunabilir kalır
  Neden: Şifreleme ile ilgisi yoktur; tehlike taşma ve bellek bozulmasıdır.
- [ ] d: strcpy çok yavaştır
  Neden: Asıl risk performans değil, sınırsız yazmadır.
İpucu: strcpy hedefin boyutunu biliyor mu?
Kısa açıklama: strcpy sınır kontrolü yapmadığı için taşma oluşabilir.
Açıklama: 16 baytlık tampona sonlandırıcı dahil en fazla 15 karakter sığar. Daha uzun girdi stack'teki diğer değişkenleri ve dönüş adresini ezebilir; bu, saldırganın kod yürütmesine kadar gidebilir. snprintf veya boyutu kontrol eden kopyalama fonksiyonları kullanılmalıdır.
Etiketler: c, buffer-overflow

# S42 · Orta · Teori

Alan: Yapay zekâ ve görü
Şirket: ASELSAN

Vanishing gradient nedir, nasıl çözülür?

Nerede soruldu: ASELSAN (aday beyanı).

Anahtar noktalar:
- Geri yayılımda küçük türevler çarpılınca gradyan ilk katmanlara ulaşamaz
- Sigmoid ve tanh doyuma girince türev çok küçülür
- Çözümler: ReLU ailesi, residual bağlantılar, batch veya layer normalization
- Uygun ağırlık başlatma (He, Xavier)
- RNN'lerde LSTM/GRU; tersi olan exploding gradient için gradient clipping

## S42-01 · Çoklu seçim
Konu: Derin öğrenme
Soru: Vanishing gradient sorununu azaltan yöntemleri seçin.
Şıklar:
- [x] a: Sigmoid yerine ReLU ailesinden aktivasyonlar kullanmak
  Neden: Doğru; ReLU'nun pozitif bölgede türevi 1'dir.
- [x] b: Residual (skip) bağlantılar eklemek
  Neden: Doğru; gradyan kısa yoldan geri akabilir.
- [x] c: Batch veya layer normalization kullanmak
  Neden: Doğru; aktivasyonları sağlıklı bir aralıkta tutar.
- [ ] d: Ağırlıkları sıfırla başlatmak
  Neden: Yanlış; sıfır başlatma nöronları simetrik bırakır ve öğrenmeyi bozar; He veya Xavier gibi ölçekli başlatma kullanılır.
- [ ] e: Ağa daha fazla sigmoid katmanı eklemek
  Neden: Sigmoid'in türevi en fazla 0,25'tir; katman eklemek gradyanı daha da küçültür.
İpucu: Zincir kuralında birden küçük sayılar çarpılınca ne olur?
Kısa açıklama: Uygun aktivasyon, residual bağlantı ve normalizasyon gradyanın sönmesini azaltır.
Açıklama: Geri yayılımda her katmanın türevi çarpılır; türevler küçükse ilk katmanlara ulaşan gradyan sıfıra yaklaşır ve bu katmanlar öğrenemez. ReLU, residual bağlantılar, normalizasyon, uygun ağırlık başlatma (He/Xavier) ve RNN'lerde LSTM/GRU bu sorunu azaltır.
Etiketler: derin-öğrenme, gradyan

## S42-02 · Doğru / Yanlış
Konu: Derin öğrenme
Soru: LSTM'nin kapı (gate) yapısı, uzun dizilerde gradyanın sönmesini klasik RNN'e göre azaltır.
Şıklar:
- [x] Doğru
  Neden: Doğru; hücre durumu boyunca gradyan daha az sönümlenerek akabilir.
- [ ] Yanlış
  Neden: LSTM tam da bu sorunu hafifletmek için tasarlanmıştır.
İpucu: LSTM neden icat edildi?
Kısa açıklama: LSTM, kapıları sayesinde uzun bağımlılıkları klasik RNN'den iyi öğrenir.
Açıklama: LSTM'de unutma kapısı hücre durumunu büyük ölçüde toplama yoluyla günceller; bu, gradyanın uzun zaman adımları boyunca akmasını kolaylaştırır. Sorun tamamen ortadan kalkmaz; çok uzun dizilerde Transformer gibi dikkat tabanlı modeller daha başarılıdır.
Etiketler: lstm, rnn

# S43 · Kolay · Karşılaştırma

Alan: Yapay zekâ ve görü
Şirket: Baykar

Aktivasyon fonksiyonlarını (sigmoid, tanh, ReLU, softmax) karşılaştırın.

Nerede soruldu: Baykar (aday beyanı).

Anahtar noktalar:
- Sigmoid: 0–1 çıktı; ikili sınıflandırma çıkışı; doyumda gradyan söner
- tanh: -1–1 çıktı, sıfır merkezli
- ReLU: `max(0, x)`, hızlı; negatif bölgede ölü nöron sorunu (çözüm: Leaky ReLU)
- Softmax: çok sınıflı çıkışta olasılık dağılımı üretir
- Gizli katmanlarda genellikle ReLU ailesi tercih edilir

## S43-01 · Eşleştirme
Konu: Aktivasyon fonksiyonları
Soru: Aktivasyon fonksiyonlarını özellikleriyle eşleştirin.
Eşleşmeler:
- sigmoid: Sigmoid => zeroOne: Çıktı 0–1 aralığında; ikili sınıflandırma çıkışında kullanılır
- tanh: tanh => minusOne: Çıktı -1–1 aralığında ve sıfır merkezli
- relu: ReLU => positive: max(0, x); hızlıdır ama negatif bölgede nöron ölebilir
- softmax: Softmax => distribution: Çıktıları toplamı 1 olan olasılık dağılımına çevirir
Fazladan seçenekler:
- decoy: Girdiyi değiştirmeden aynen geçirir; doğrusal olmayanlık katmaz
İpucu: Çıktı aralıklarına bakın.
Kısa açıklama: Sigmoid 0–1, tanh -1–1 aralığındadır; ReLU negatifleri sıfırlar, softmax olasılık dağılımı üretir.
Açıklama: Sigmoid ve tanh uç değerlerde doyuma girip gradyanı söndürür; ReLU bu yüzden gizli katmanlarda varsayılan tercihtir. Ölü ReLU sorununa karşı Leaky ReLU veya GELU kullanılabilir. Softmax çok sınıflı sınıflandırmanın çıkış katmanındadır.
Etiketler: aktivasyon, derin-öğrenme

# S44 · Orta · Teori

Alan: Yapay zekâ ve görü
Şirket: Baykar

Bir dizi modeli (RNN) için uçtan uca pipeline nasıl kurulur? LSTM/GRU'dan Transformer'a geçişin gerekçesi nedir?

Nerede soruldu: Baykar (aday beyanı).

Anahtar noktalar:
- Veriyi eğitim, doğrulama ve test olarak ayırmak
- Tokenizasyon ve sözlüğü yalnız eğitim verisinden kurmak (veri sızıntısı olmaması)
- Padding ve mask; embedding, LSTM/GRU ve çıkış katmanı
- Doğrulama kaybını izleyip early stopping; test kümesini en sonda bir kez kullanmak
- Transformer: self-attention ile paralel işleme ve uzak bağımlılıklar; konum kodlaması gerekir

## S44-01 · Sıralama
Konu: Dizi modelleri
Soru: Bir metin sınıflandırma modelinin geliştirme adımlarını doğru sırayla dizin.
Sıra:
1. split: Veriyi eğitim, doğrulama ve test olarak ayır
2. tokenize: Sözlüğü yalnız eğitim verisinden kurup metinleri token'lara çevir
3. pad: Dizileri aynı uzunluğa getir (padding ve mask)
4. train: Modeli eğit ve doğrulama kaybını izle
5. evaluate: Test kümesinde son değerlendirmeyi yap
İpucu: Test verisinin bilgisi eğitime sızmamalıdır.
Kısa açıklama: Önce ayır, sonra yalnız eğitim verisine göre ön işle, eğit ve en son testte ölç.
Açıklama: Sözlüğü veya normalizasyon istatistiklerini tüm veriden çıkarmak test bilgisini eğitime sızdırır (data leakage). Test kümesi yalnız en sonda, bir kez kullanılmalıdır; model seçimi doğrulama kümesiyle yapılır.
Etiketler: nlp, rnn, pipeline

## S44-02 · Tek seçim
Konu: Transformer
Soru: Transformer'ın RNN'e göre temel avantajı nedir?
Şıklar:
- [ ] a: Transformer'lar parametre içermez; bu yüzden eğitim verisine ihtiyaç duymadan doğrudan kullanılabilir
  Neden: Transformer'lar çok sayıda parametre içerir ve eğitim gerektirir.
- [x] b: Self-attention ile dizinin tüm konumlarını paralel işler ve uzak bağımlılıkları doğrudan yakalar
- [ ] c: Daha az bellek kullanır
  Neden: Self-attention bellek kullanımı dizi uzunluğunun karesiyle büyür.
- [ ] d: Konum bilgisine ihtiyaç duymaz
  Neden: Sırayı bilmediği için konum kodlaması (positional encoding) eklenir.
İpucu: RNN neden adım adım çalışmak zorunda?
Kısa açıklama: Self-attention paralel çalışır ve uzak konumları doğrudan ilişkilendirir.
Açıklama: RNN her adımda önceki gizli duruma bağlı olduğu için eğitimde paralelleşemez ve uzak bağımlılıklar birçok adımdan geçerek zayıflar. Transformer her konumun diğer tüm konumlara doğrudan baktığı dikkat katmanlarıyla bu iki sorunu çözer; bedeli dizi uzunluğunun karesiyle büyüyen hesaplamadır.
Etiketler: transformer, attention

# S45 · Zorlayıcı · Teori

Alan: Yapay zekâ ve görü
Şirket: Baykar

LLM'lerde fine-tuning, optimizasyon ve RAG'i açıklayın. Hangi durumda hangisini seçersiniz?

Nerede soruldu: Baykar LLM rolü (aday beyanı).

Anahtar noktalar:
- Fine-tuning modele görev, format veya üslup öğretir; LoRA gibi yöntemler maliyeti düşürür
- RAG: belgeleri parçala, embedding çıkar, soruya en yakın parçaları getirip modele ver
- Sık değişen ya da kaynağı gösterilmesi gereken bilgi için RAG
- Değerlendirme: cevabın kaynağa dayanması ve uydurma (hallucination) kontrolü
- Çıkarım optimizasyonu: quantization, önbellekleme ve daha küçük model

## S45-01 · Sıralama
Konu: RAG
Soru: Bir RAG sisteminin adımlarını doğru sırayla dizin.
Sıra:
1. chunk: Belgeleri parçalara böl
2. embed: Parçaların embedding'lerini çıkarıp vektör veritabanına yaz
3. retrieve: Soru gelince ona en yakın parçaları getir
4. augment: Getirilen parçaları soruyla birlikte modele ver
5. generate: Model bu bağlama dayanarak cevabı üretir
İpucu: İndeks önceden kurulur, arama soru gelince yapılır.
Kısa açıklama: Parçala, vektörleştir, getir, bağlama ekle, üret.
Açıklama: RAG, modelin parametrelerini değiştirmeden ona güncel ve kuruma özel bilgi sağlar. Kalitesini parça boyutu, embedding modeli, getirilen parça sayısı ve yeniden sıralama belirler; cevapların kaynağa dayandığı ayrıca değerlendirilmelidir.
Etiketler: llm, rag

## S45-02 · Tek seçim
Konu: RAG ve fine-tuning
Soru: Sık değişen kurum içi dokümanlara dayalı bir soru-cevap sistemi için ilk tercih hangisidir?
Şıklar:
- [ ] a: Modeli her doküman değişikliğinde baştan, tüm parametreleriyle yeniden eğitmek
  Neden: Pahalı ve yavaştır; bilgi her değişiklikte güncel tutulamaz.
- [ ] b: Daha büyük bir model seçip dokümanları hiç kullanmadan genel bilgisine güvenmek
  Neden: Model kurum içi bilgiyi bilmez ve uydurma (hallucination) riski artar.
- [x] c: RAG; dokümanlar güncellendikçe yalnız indeks yenilenir
- [ ] d: Sıcaklığı (temperature) artırmak
  Neden: Sıcaklık çıktının çeşitliliğini etkiler; modele yeni bilgi kazandırmaz.
İpucu: Bilgi sık değişiyorsa onu nerede tutmak mantıklı?
Kısa açıklama: Sık değişen bilgi için RAG, davranış veya üslup için fine-tuning uygundur.
Açıklama: Fine-tuning modele bir görevi, formatı veya üslubu öğretmek için iyidir; LoRA gibi parametre verimli yöntemler maliyeti düşürür. Güncel ve kaynağı gösterilmesi gereken bilgi ise indekste tutulur ve RAG ile getirilir; iki yöntem birlikte de kullanılabilir.
Etiketler: llm, rag, fine-tuning

# S46 · Kolay · Teori

Alan: Yapay zekâ ve görü

Overfitting nasıl anlaşılır, nasıl önlenir?

Nerede soruldu: klasik makine öğrenmesi sorusu.

Anahtar noktalar:
- Belirti: eğitim kaybı düşerken doğrulama kaybının artması
- Underfitting'te iki kayıp da yüksek kalır
- Önlemler: daha çok ve çeşitli veri, veri artırma
- Dropout, L2 regularization ve early stopping
- Model kapasitesini veriye göre seçmek; çapraz doğrulama

## S46-01 · Tek seçim
Konu: Overfitting
Soru: Overfitting'in tipik belirtisi hangisidir?
Şıklar:
- [x] a: Eğitim kaybı düşmeye devam ederken doğrulama kaybının bir noktadan sonra yükselmeye başlaması
- [ ] b: Eğitim ve doğrulama kayıplarının ikisinin de yüksek kalması ve modelin hiçbir şey öğrenememesi
  Neden: Bu underfitting'dir.
- [ ] c: Doğrulama doğruluğunun eğitim doğruluğundan biraz yüksek olması
  Neden: Bu genellikle dropout veya veri farkından kaynaklanır; overfitting'in tersine işarettir.
- [ ] d: Eğitimin çok kısa sürmesi
  Neden: Süre tek başına overfitting göstergesi değildir.
İpucu: Eğitim ve doğrulama eğrilerini karşılaştırın.
Kısa açıklama: Eğitim kaybı düşerken doğrulama kaybının artması overfitting'dir.
Açıklama: Model eğitim verisindeki gürültüyü ezberlemeye başlayınca genelleme bozulur ve doğrulama kaybı artar. Bu ayrışmanın başladığı yer early stopping için kullanılır.
Etiketler: makine-öğrenmesi, overfitting

## S46-02 · Çoklu seçim
Konu: Overfitting
Soru: Overfitting'i azaltan yöntemleri seçin.
Şıklar:
- [x] a: Dropout
  Neden: Doğru; nöronların birbirine aşırı uyum sağlamasını engeller.
- [x] b: L2 regularization (weight decay)
  Neden: Doğru; büyük ağırlıkları cezalandırır.
- [x] c: Veri artırma (augmentation)
  Neden: Doğru; eğitim verisini çeşitlendirir.
- [x] d: Early stopping
  Neden: Doğru; doğrulama kaybı artmaya başlayınca eğitimi durdurur.
- [ ] e: Eğitim verisini azaltmak
  Neden: Daha az veri ezberlemeyi kolaylaştırır.
- [ ] f: Modeli büyütüp eğitimi uzatmak
  Neden: Kapasite ve süre arttıkça overfitting riski de artar.
İpucu: Modelin ezberlemesini zorlaştıran yöntemleri seçin.
Kısa açıklama: Dropout, regularization, veri artırma ve early stopping overfitting'i azaltır.
Açıklama: Overfitting'e karşı en etkili çözüm çoğu zaman daha fazla ve daha çeşitli veridir. Modelin kapasitesini sınırlamak ve doğrulama kaybını izleyerek eğitimi zamanında durdurmak da genellemeyi iyileştirir.
Etiketler: makine-öğrenmesi, regularization

# S47 · Orta · Teori

Alan: Yapay zekâ ve görü

Nesne tespitinde precision, recall, IoU ve mAP nedir? Eşik seçimi yanlış alarmların maliyetini nasıl etkiler?

Nerede soruldu: klasik bilgisayarlı görü sorusu (STM bilgisayarlı görü alanı).

Anahtar noktalar:
- Precision = TP / (TP + FP): tespitlerin ne kadarı doğru
- Recall = TP / (TP + FN): gerçek hedeflerin ne kadarı bulundu
- IoU: kutuların kesişimi bölü birleşimi; tespit IoU eşiğini geçince doğru sayılır
- mAP: sınıflar ve eşikler üzerinden ortalama precision
- Eşik, yanlış alarm ile kaçırılan hedefin maliyetine göre seçilir

## S47-01 · Boşluk doldurma
Konu: Precision ve recall
Soru: Bir dedektör 10 hedef içeren bir görüntüde 8 tespit yapıyor; bunların 6'sı doğru. Precision değerini ondalık olarak yazın.
Cevap: 0.75
Kabul: 0,75
Kabul: 3/4
Kabul: %75
Kabul: 75%
Kabul: .75
İpucu: Precision = TP / (TP + FP).
Kısa açıklama: Precision 6 / 8 = 0,75'tir.
Açıklama: 8 tespitin 6'sı doğru (TP), 2'si yanlış alarmdır (FP); precision 6 / 8 = 0,75 olur. Recall ise gerçek 10 hedeften 6'sının bulunduğunu gösterir: 6 / 10 = 0,6. Eşiği yükseltmek genellikle precision'ı artırıp recall'u düşürür.
Etiketler: precision, recall, görü

## S47-02 · Eşleştirme
Konu: Tespit metrikleri
Soru: Metrikleri tanımlarıyla eşleştirin.
Eşleşmeler:
- precision: Precision => tpOverPred: TP / (TP + FP); yapılan tespitlerin ne kadarı doğru
- recall: Recall => tpOverActual: TP / (TP + FN); gerçek hedeflerin ne kadarı bulundu
- iou: IoU => overlap: Tahmin kutusu ile gerçek kutunun kesişiminin birleşimine oranı
- map: mAP => avgPrecision: Sınıflar ve eşikler üzerinden ortalama precision
Fazladan seçenekler:
- decoy: TN / (TN + FP); negatiflerin ne kadarı doğru reddedildi
İpucu: Paydada neyin olduğuna bakın.
Kısa açıklama: Precision doğruluk, recall kapsama oranıdır; IoU kutu örtüşmesini, mAP genel başarımı ölçer.
Açıklama: Bir tespit genellikle IoU belirli bir eşiği (ör. 0,5) geçerse doğru sayılır. Savunma uygulamalarında yanlış alarmın ve kaçırılan hedefin maliyeti farklı olduğu için eşik bu maliyetlere göre seçilir. Fazladan seçenek specificity'yi anlatır.
Etiketler: map, iou, görü

# S48 · Orta · Kod okuma

Alan: Yapay zekâ ve görü

CNN'de convolution, stride ve padding çıktı boyutunu nasıl etkiler? Tek aşamalı ve iki aşamalı dedektörleri (YOLO, Faster R-CNN) karşılaştırın.

Nerede soruldu: klasik bilgisayarlı görü sorusu.

Anahtar noktalar:
- Çıktı boyutu: (girdi − çekirdek + 2 × padding) / stride + 1
- Padding kenarları korur; stride çözünürlüğü düşürür
- Pooling ve derinleşen katmanlarla özellik hiyerarşisi
- YOLO tek aşamalı ve hızlı; Faster R-CNN önce bölge önerir, genellikle daha doğru
- Gömülü çıkarımda hız ve doğruluk dengesi

## S48-01 · Boşluk doldurma
Konu: CNN çıktı boyutu
Soru: 32×32 girdiye 5×5 çekirdek, stride 1 ve padding 0 uygulanırsa çıktının kenar uzunluğu kaçtır?
Cevap: 28
İpucu: Çıktı = (girdi - çekirdek + 2 × padding) / stride + 1.
Kısa açıklama: (32 - 5 + 0) / 1 + 1 = 28.
Açıklama: Padding olmadan çekirdek her kenardan (5 - 1) / 2 = 2 piksel kaybettirir; bu yüzden 32'den 28'e iner. Boyutu korumak için 5×5 çekirdekte padding 2 kullanılır.
Etiketler: cnn, convolution

## S48-02 · Boşluk doldurma
Konu: CNN çıktı boyutu
Soru: 224×224 girdiye 3×3 çekirdek, stride 2 ve padding 1 uygulanırsa çıktının kenar uzunluğu kaçtır?
Cevap: 112
İpucu: Bölme sonucunun tam kısmı alınır.
Kısa açıklama: (224 - 3 + 2) / 2 + 1 = 111 + 1 = 112.
Açıklama: 223 / 2 işleminin tam kısmı 111'dir; bir eklenince 112 olur. Stride 2 çözünürlüğü yaklaşık yarıya indirir; birçok mimari aşağı örneklemeyi pooling yerine böyle yapar.
Etiketler: cnn, stride

## S48-03 · Tek seçim
Konu: Nesne tespiti
Soru: YOLO ile Faster R-CNN arasındaki temel fark hangisidir?
Şıklar:
- [x] a: YOLO tek geçişte tahmin eder; Faster R-CNN önce bölge önerir
- [ ] b: Faster R-CNN, görüntüyü tek seferde ızgaraya bölüp hücreler için kutu tahmin ettiği için daha hızlıdır
  Neden: Izgara tabanlı tek geçiş YOLO'nun yaklaşımıdır; iki aşamalı Faster R-CNN genellikle daha yavaştır.
- [ ] c: YOLO sınıflandırma yapmaz
  Neden: YOLO kutularla birlikte sınıf olasılıklarını da tahmin eder.
- [ ] d: İkisi de gri tonlamalı görüntü gerektirir; renkli görüntüyü işleyemez
  Neden: İkisi de renkli görüntülerle çalışır.
İpucu: Kaç aşamada tahmin yapılıyor?
Kısa açıklama: YOLO tek aşamalı, Faster R-CNN iki aşamalıdır.
Açıklama: Tek aşamalı dedektörler hız gerektiren gerçek zamanlı uygulamalarda (ör. İHA'da gömülü çıkarım) öne çıkar. İki aşamalı dedektörler önce bölge önerip sonra bu bölgeleri sınıflandırdığı için genellikle daha doğru ama daha yavaştır; güncel tek aşamalı modeller bu farkı büyük ölçüde kapatmıştır.
Etiketler: yolo, nesne-tespiti

# S49 · Zorlayıcı · Teori

Alan: Sinyal, kontrol ve navigasyon

Kalman filtresi ne işe yarar? Tahmin ve güncelleme adımlarını açıklayın.

Nerede soruldu: klasik takip ve navigasyon sorusu.

Anahtar noktalar:
- Gürültülü ölçümlerden durumu (ör. konum ve hız) en iyi doğrusal kestirimle izler
- Tahmin adımı: hareket modeliyle durumu ve belirsizliği ilerletmek
- Güncelleme adımı: Kalman kazancıyla ölçümü tahminle birleştirmek
- Ölçüm gürültüsü büyükse kazanç küçülür ve model tahminine daha çok güvenilir
- Doğrusal olmayan sistemlerde EKF veya UKF

## S49-01 · Sıralama
Konu: Kalman filtresi
Soru: Kalman filtresinin bir döngüsündeki adımları doğru sırayla dizin.
Sıra:
1. predict: Durumu hareket modeliyle bir sonraki zamana taşı
2. predictCov: Belirsizliği (kovaryans) süreç gürültüsüyle büyüt
3. gain: Kalman kazancını hesapla
4. update: Ölçümü tahminle kazanca göre birleştir
5. updateCov: Güncellenmiş belirsizliği küçült
İpucu: Önce tahmin, sonra ölçümle düzeltme.
Kısa açıklama: Tahmin, belirsizliği büyütme, kazanç, ölçümle güncelleme ve belirsizliği küçültme.
Açıklama: Kalman filtresi gürültülü ölçümlerle bir sistemin durumunu, örneğin bir hedefin konum ve hızını, en iyi doğrusal kestirimle izler. Doğrusal olmayan sistemlerde Extended veya Unscented Kalman filtresi kullanılır.
Etiketler: kalman, takip, navigasyon

## S49-02 · Doğru / Yanlış
Konu: Kalman filtresi
Soru: Kalman filtresinde ölçüm gürültüsü kovaryansı (R) büyüdükçe kazanç da büyür; filtre bu durumda modelin tahmininden çok yeni ölçümlere ağırlık verir.
Şıklar:
- [ ] Doğru
  Neden: R büyüdükçe kazanç küçülür; filtre gürültülü ölçüm yerine modelin tahminine güvenir.
- [x] Yanlış
  Neden: Doğru; kazanç ölçüm gürültüsü arttıkça küçülür.
İpucu: Güvenilmez bir ölçüme ne kadar ağırlık verilmeli?
Kısa açıklama: Ölçüm gürültüsü arttıkça Kalman kazancı küçülür.
Açıklama: Kazanç, tahmin belirsizliği ile ölçüm belirsizliğinin oranına göre belirlenir. Ölçüm çok gürültülüyse kazanç sıfıra yaklaşır ve tahmin pek değişmez; model belirsizliği büyükse kazanç bire yaklaşır ve ölçüm baskın gelir.
Etiketler: kalman

# S50 · Orta · Teori

Alan: Sinyal, kontrol ve navigasyon
Şirket: Roketsan

Nyquist teoremi ve aliasing nedir? FFT ne işe yarar? FIR ile IIR filtrelerini karşılaştırın.

Nerede soruldu: Roketsan ilanı (sinyal işleme, DSP ve MATLAB).

Anahtar noktalar:
- Nyquist: örnekleme hızı en yüksek frekansın en az iki katı olmalı
- Aliasing ve örneklemeden önce anti-aliasing filtre
- FFT, DFT'yi O(n log n) sürede hesaplar; spektrum analizinde kullanılır
- FIR: geri beslemesiz, her zaman kararlı, doğrusal faz sağlanabilir
- IIR: geri beslemeli, daha az katsayı ister ama kararsız olabilir

## S50-01 · Boşluk doldurma
Konu: Örnekleme
Soru: En yüksek frekans bileşeni 5 kHz olan bir sinyali aliasing olmadan örneklemek için gereken teorik minimum örnekleme hızı nedir? Birimiyle yazın (ör. 3 kHz).
Cevap: 10 kHz
Kabul: 10kHz
Kabul: 10000 Hz
Kabul: 10000Hz
Kabul: 10.000 Hz
İpucu: En yüksek frekansın en az iki katı.
Kısa açıklama: Nyquist'e göre minimum örnekleme hızı 2 × 5 kHz = 10 kHz'dir.
Açıklama: Örnekleme hızı en yüksek frekansın iki katından düşükse yüksek frekanslar düşük frekans gibi görünür (aliasing). Pratikte örnekleme bu sınırın belirgin üzerinde seçilir ve örneklemeden önce analog bir alçak geçiren (anti-aliasing) filtre kullanılır.
Etiketler: nyquist, aliasing, dsp

## S50-02 · Eşleştirme
Konu: Filtreler ve FFT
Soru: Kavramları özellikleriyle eşleştirin.
Eşleşmeler:
- fir: FIR filtre => finite: Geri besleme yok; her zaman kararlıdır ve doğrusal faz sağlanabilir
- iir: IIR filtre => feedback: Geri beslemelidir; aynı keskinlik için daha az katsayı ister ama kararsız olabilir
- fft: FFT => spectrum: Ayrık sinyalin frekans bileşenlerini O(n log n) sürede hesaplar
Fazladan seçenekler:
- decoy: Sinyali her zaman kayıpsız sıkıştırır
İpucu: Filtre çıkışı geçmiş çıkışlara bağlı mı?
Kısa açıklama: FIR kararlı ve doğrusal fazlıdır, IIR verimli ama kararsız olabilir; FFT spektrumu hızlı hesaplar.
Açıklama: FIR filtre yalnız girdilerin ağırlıklı toplamıdır; IIR filtre geçmiş çıkışları da kullanır ve kutupları birim çemberin dışına çıkarsa kararsızlaşır. FFT, ayrık Fourier dönüşümünü n² yerine n log n işlemle hesaplar ve spektrum analizi ile hızlı konvolüsyonda kullanılır.
Etiketler: fir, iir, fft

# S51 · Zorlayıcı · Teori

Alan: Sinyal, kontrol ve navigasyon
Şirket: Baykar

Rotasyon matrisleri ve koordinat dönüşümlerini açıklayın. Euler açıları, gimbal lock ve quaternion arasındaki ilişki nedir?

Nerede soruldu: Baykar havacılık (aday beyanı).

Anahtar noktalar:
- Rotasyon matrisi ortogonaldir: tersi transpozudur, determinantı 1'dir
- Koordinat dönüşümleri (ör. gövde ve dünya eksenleri) matris çarpımıyla zincirlenir; sıra önemlidir
- Euler açıları (yaw, pitch, roll) sezgiseldir ama gimbal lock yaşar
- Gimbal lock: iki eksen hizalanınca bir serbestlik derecesi kaybolur
- Quaternion tekillik yaşamaz ve ara değerleme (slerp) için uygundur

## S51-01 · Tek seçim
Konu: Rotasyonlar
Soru: Gimbal lock nedir?
Şıklar:
- [ ] a: Quaternion kullanıldığında dönüşlerin birbirine kilitlenip tek eksende kalmasıdır; bu yüzden Euler açıları tercih edilir
  Neden: Tersine, gimbal lock Euler açılarında görülür; quaternion bu sorunu yaşamaz.
- [ ] b: Rotasyon matrisinin determinantının sıfır olması ve bu yüzden tersinin alınamamasıdır
  Neden: Rotasyon matrislerinin determinantı her zaman 1'dir.
- [x] c: Euler açılarında iki eksen hizalanınca bir serbestlik derecesinin kaybolmasıdır
- [ ] d: Jiroskobun ısınması
  Neden: Gimbal lock matematiksel bir temsil sorunudur.
İpucu: Pitch 90 derece olduğunda yaw ve roll ne olur?
Kısa açıklama: Gimbal lock, Euler açılarında iki eksenin çakışıp bir serbestlik derecesinin kaybolmasıdır.
Açıklama: Örneğin pitch ±90° olduğunda yaw ve roll aynı eksen etrafında dönmeye başlar ve bazı yönelimler arasında yumuşak geçiş yapılamaz. Quaternion'lar dört bileşenle bu tekilliği yaşamaz ve ara değerleme (slerp) için uygundur; bu yüzden uçuş yazılımlarında yaygındır.
Etiketler: rotasyon, quaternion, havacılık

## S51-02 · Doğru / Yanlış
Konu: Rotasyonlar
Soru: Bir rotasyon matrisinin tersi, transpozuna eşittir.
Şıklar:
- [x] Doğru
  Neden: Doğru; rotasyon matrisleri ortogonaldir (RᵀR = I).
- [ ] Yanlış
  Neden: Rotasyon matrisleri ortogonal olduğu için tersleri transpozlarıdır.
İpucu: Ortogonal matrislerin özelliğini düşünün.
Kısa açıklama: Rotasyon matrisinin tersi transpozudur.
Açıklama: Rotasyon uzunlukları ve açıları korur; bu yüzden matrisin sütunları birim ve birbirine dik vektörlerdir. Ters dönüşümü bulmak için matris tersini hesaplamaya gerek yoktur; transpoz yeterlidir.
Etiketler: rotasyon, lineer-cebir

# S52 · Orta · Teori

Alan: Sinyal, kontrol ve navigasyon
Şirket: HAVELSAN

PID formülünü yazın ve terimlerin etkisini açıklayın. Integral windup nedir?

Nerede soruldu: HAVELSAN sistem mühendisliği (aday beyanı).

Anahtar noktalar:
- `u = Kp·e + Ki·∫e dt + Kd·de/dt`
- P mevcut hataya tepki verir; tek başına kalıcı hata bırakabilir
- I kalıcı hatayı giderir; D aşmayı azaltır ama ölçüm gürültüsünü büyütür
- Integral windup: aktüatör doyumdayken integralin birikmesi; clamping ile önlenir
- Ayar: önce P, sonra I ve D; Ziegler–Nichols gibi yöntemler

## S52-01 · Eşleştirme
Konu: PID
Soru: PID terimlerini etkileriyle eşleştirin.
Eşleşmeler:
- p: Oransal (P) => present: Mevcut hataya orantılı tepki verir; tek başına kalıcı hata bırakabilir
- i: İntegral (I) => past: Geçmiş hataların toplamıyla kalıcı hatayı giderir
- d: Türev (D) => future: Hatanın değişim hızına tepki vererek aşmayı (overshoot) azaltır
Fazladan seçenekler:
- decoy: Çıkışı sabit bir değerde tutar ve hatayı hiç kullanmaz
İpucu: Şimdiki, geçmiş ve gelecekteki hata eğilimi.
Kısa açıklama: P mevcut hataya, I birikmiş hataya, D hatanın değişim hızına tepki verir.
Açıklama: Kontrol çıkışı u = Kp·e + Ki·∫e dt + Kd·de/dt şeklindedir. Kp'yi artırmak tepkiyi hızlandırır ama salınımı artırır; Ki kalıcı hatayı yok eder; Kd sönümleme sağlar ama ölçüm gürültüsünü büyütür, bu yüzden genellikle filtrelenir.
Etiketler: pid, kontrol

## S52-02 · Tek seçim
Konu: PID
Soru: Integral windup nedir?
Şıklar:
- [x] a: Aktüatör doyumdayken integral teriminin büyümeye devam etmesi
- [ ] b: Türev teriminin gürültüyü büyütmesi yüzünden çıkışın yüksek frekanslı titreşim yapması
  Neden: Bu türev teriminin gürültü hassasiyetidir.
- [ ] c: Oransal kazanç çok küçük seçildiğinde sistemin hedefe hiç ulaşamaması ve yavaş kalması
  Neden: Bu yetersiz kazançtır; windup integral birikimiyle ilgilidir.
- [ ] d: Örnekleme süresinin değişken olması nedeniyle türev ve integral hesaplarının bozulması
  Neden: Bu ayrıklaştırma hatasıdır; windup doyumdayken integralin birikmesidir.
İpucu: Motor zaten maksimumdayken integral ne yapıyor?
Kısa açıklama: Windup, doyum sırasında integralin aşırı birikmesidir.
Açıklama: Aktüatör sınırına ulaştığında hata sürer ve integral büyümeye devam eder; hata işaret değiştirdiğinde bu birikim boşalana kadar sistem büyük bir aşma yapar. Integral sınırlama (clamping) veya geri hesaplama (back-calculation) ile önlenir.
Etiketler: pid, windup

# S53 · Kolay · Karşılaştırma

Alan: Test, süreç ve standartlar
Şirket: ASELSAN

Blackbox ve whitebox test arasındaki fark nedir? Sınır değer analizi ve eşdeğer bölümleme nedir?

Nerede soruldu: ASELSAN test mühendisliği ("blackbox whitebox testing duydun mu?", aday beyanı).

Anahtar noktalar:
- Blackbox: spesifikasyona göre, iç yapıyı bilmeden test
- Whitebox: kodun yapısına göre; statement, branch ve MC/DC kapsaması
- Eşdeğer bölümleme: her sınıftan bir temsilci
- Sınır değer analizi: sınırın kendisi, hemen altı ve hemen üstü
- İki yaklaşım birbirini tamamlar

## S53-01 · Tek seçim
Konu: Test teknikleri
Soru: Blackbox ve whitebox test arasındaki fark hangisidir?
Şıklar:
- [x] a: Blackbox test spesifikasyona göre, whitebox test kodun iç yapısına ve kapsamasına göre tasarlanır
- [ ] b: Blackbox test yalnız kullanıcı arayüzünde, whitebox test yalnız veritabanında yapılır
  Neden: Fark test edilen katman değil, testin neye dayanarak tasarlandığıdır.
- [ ] c: Blackbox otomatik, whitebox elle yapılan testtir
  Neden: İkisi de elle veya otomatik yapılabilir.
- [ ] d: Aynı şeydir
  Neden: Biri dış davranışı, diğeri iç yapıyı esas alır.
İpucu: Test tasarlarken kodu görüyor musunuz?
Kısa açıklama: Blackbox spesifikasyona, whitebox kodun yapısına dayanır.
Açıklama: Blackbox teknikleri sınır değer analizi, eşdeğer bölümleme ve karar tablolarıdır. Whitebox testte statement, branch ve MC/DC gibi kapsama ölçütleri hedeflenir. İkisi birbirini tamamlar: biri eksik gereksinimleri, diğeri hiç çalıştırılmamış kodu ortaya çıkarır.
Etiketler: test, blackbox, whitebox

## S53-02 · Boşluk doldurma
Konu: Sınır değer analizi
Soru: 1–100 aralığını kabul eden bir alan için sınır değer analizinde, geçerli aralığın hemen altındaki geçersiz değer nedir?
Cevap: 0
Kabul: sıfır
İpucu: Alt sınırın bir eksiği.
Kısa açıklama: Alt sınırın hemen altındaki değer 0'dır.
Açıklama: Sınır değer analizi hataların en çok sınırlarda çıktığı gözlemine dayanır; bu alan için tipik test değerleri 0, 1, 2, 99, 100 ve 101'dir.
Etiketler: test, sınır-değer

## S53-03 · Doğru / Yanlış
Konu: Eşdeğer bölümleme
Soru: Eşdeğer bölümlemede her sınıftan bir temsilci değer test etmek yeterli kabul edilir.
Şıklar:
- [x] Doğru
  Neden: Doğru; aynı sınıftaki değerlerin sistemi aynı şekilde etkilediği varsayılır ve test sayısı böylece azalır.
- [ ] Yanlış
  Neden: Eşdeğer bölümlemenin amacı tam olarak her sınıftan bir temsilci seçmektir.
İpucu: Aynı sınıftaki iki değer farklı bir hata ortaya çıkarır mı?
Kısa açıklama: Eşdeğer bölümleme her sınıftan bir temsilci test eder.
Açıklama: 1–100 aralığı için sınıflar 1'den küçük, 1–100 arası ve 100'den büyük değerlerdir. Bölümleme sınır değer analiziyle birlikte kullanılır, çünkü sınıfların kenarları ayrıca risklidir.
Etiketler: test, eşdeğer-bölümleme

# S54 · Kolay · Teori

Alan: Test, süreç ve standartlar

Unit, integration, system ve acceptance test seviyelerini açıklayın. Regresyon testi nedir?

Nerede soruldu: klasik test sorusu.

Anahtar noktalar:
- Unit test: tek bir birim izole edilerek test edilir
- Integration test: birimlerin birlikte çalışması ve arayüzler
- System test: bütün sistem gereksinimlere göre
- Acceptance test: müşterinin ihtiyacına göre kabul
- Regresyon testi: değişiklikten sonra eski özelliklerin bozulmadığını otomatik doğrulamak

## S54-01 · Sıralama
Konu: Test seviyeleri
Soru: Test seviyelerini kapsamı en küçükten en büyüğe doğru sıralayın.
Sıra:
1. unit: Unit test
2. integration: Integration test
3. system: System test
4. acceptance: Acceptance test
İpucu: Tek fonksiyondan müşterinin kabulüne kadar.
Kısa açıklama: Unit, integration, system ve acceptance.
Açıklama: Unit test tek bir birimi izole eder; integration test birimlerin birlikte çalışmasını, system test bütün sistemi gereksinimlere göre, acceptance test ise müşterinin ihtiyacına göre doğrular. V-modelde her seviye bir tasarım aşamasının karşılığıdır.
Etiketler: test, v-model

## S54-02 · Tek seçim
Konu: Regresyon testi
Soru: Regresyon testi nedir?
Şıklar:
- [ ] a: Yeni bir özelliğin performansını rakip ürünlerle karşılaştırmak için yapılan kıyaslama testidir
  Neden: Bu bir benchmark çalışmasıdır.
- [x] b: Değişiklikten sonra daha önce çalışan özelliklerin bozulmadığını doğrulamak
- [ ] c: Yalnız son sürümde yapılır
  Neden: Her değişiklikte, ideal olarak otomatik olarak koşturulur.
- [ ] d: İstatistiksel regresyon modeli testi
  Neden: Adı benzese de istatistikle ilgisi yoktur.
İpucu: Yeni kod eski özellikleri bozdu mu?
Kısa açıklama: Regresyon testi değişikliklerin mevcut davranışı bozmadığını doğrular.
Açıklama: Regresyon test takımı sürekli entegrasyonda her değişiklikte otomatik koşturulur. Bulunan her hata için yazılan test bu takıma eklenir; böylece aynı hata geri dönerse hemen yakalanır.
Etiketler: test, regresyon

# S55 · Kolay · Karşılaştırma

Alan: Test, süreç ve standartlar
Şirket: HAVELSAN

Verification ile validation arasındaki fark nedir?

Nerede soruldu: HAVELSAN üzerinden TUSAŞ projelerine simülatör ilanı.

Anahtar noktalar:
- Verification: ürünü doğru mu yapıyoruz? Spesifikasyona uygunluk
- Validation: doğru ürünü mü yapıyoruz? Kullanıcı ihtiyacına uygunluk
- Verification yöntemleri: test, analiz, inceleme ve gösterim
- Validation genellikle gerçek kullanım koşullarında ve kullanıcıyla yapılır
- Örnek: bir simülatörün gerçek sisteme yeterince benzediğini göstermek

## S55-01 · Eşleştirme
Konu: Verification ve validation
Soru: Kavramları tanımlarıyla eşleştirin.
Eşleşmeler:
- verification: Verification => buildRight: Ürünü doğru mu yapıyoruz? Spesifikasyona uygunluk
- validation: Validation => rightThing: Doğru ürünü mü yapıyoruz? Kullanıcı ihtiyacına uygunluk
Fazladan seçenekler:
- decoy: Ürünü zamanında mı yapıyoruz? Takvime uygunluk
İpucu: Biri spesifikasyona, diğeri kullanıcıya bakar.
Kısa açıklama: Verification spesifikasyona, validation gerçek ihtiyaca uygunluğu kontrol eder.
Açıklama: Bir sistem tüm gereksinimleri karşılayıp (verification) yine de kullanıcının işini görmeyebilir (validation); örneğin yanlış anlaşılmış bir gereksinim titizlikle uygulanmış olabilir. Savunma projelerinde ikisi de ayrı planlarla kanıtlanır.
Etiketler: verification, validation

## S55-02 · Doğru / Yanlış
Konu: Verification ve validation
Soru: Verification yalnız ürün çalıştırılarak, yani test koşularak yapılabilir; inceleme ve analiz verification sayılmaz.
Şıklar:
- [ ] Doğru
  Neden: Gereksinim ve kod incelemeleri ile analizler de verification faaliyetidir.
- [x] Yanlış
  Neden: Doğru; verification test, inceleme, analiz ve gösterim yöntemlerinin hepsini kapsar.
İpucu: Kod incelemesi neyi doğrular?
Kısa açıklama: Verification test dışında inceleme ve analizle de yapılır.
Açıklama: Doğrulama yöntemleri genellikle test, analiz, inceleme ve gösterim olarak sınıflandırılır. Ürün çalıştırılmadan yapılan incelemeler hataları en ucuz aşamada yakalar.
Etiketler: verification

# S56 · Orta · Teori

Alan: Test, süreç ve standartlar
Şirket: HAVELSAN

İyi bir gereksinim nasıl yazılır? İzlenebilirlik (traceability) nedir?

Nerede soruldu: HAVELSAN iş analistliği ve simülatör ilanı.

Anahtar noktalar:
- İyi gereksinim tek anlamlı, ölçülebilir ve test edilebilirdir
- Her gereksinim tek bir şeyi söyler; "-malıdır/-melidir" zorunluluk ifade eder
- "Hızlı", "kolay" gibi kelimeler yerine ölçülebilir değerler
- İzlenebilirlik: gereksinim, tasarım ve test arasında iki yönlü bağ
- İzlenebilirlik matrisi test edilmemiş gereksinimleri ortaya çıkarır

## S56-01 · Tek seçim
Konu: Gereksinimler
Soru: Hangisi iyi yazılmış bir gereksinimdir?
Şıklar:
- [ ] a: Sistem kullanıcı dostu olmalı ve operatörlerin işini mümkün olduğunca kolaylaştırmalıdır
  Neden: "Kullanıcı dostu" ölçülemez ve test edilemez.
- [ ] b: Sistem hızlı çalışmalı, hatasız olmalı ve gelecekteki tüm ihtiyaçlara uyum sağlayabilmelidir
  Neden: Belirsizdir, birden fazla şartı tek cümlede toplar ve doğrulanamaz.
- [x] c: Sistem, radar verisini aldıktan sonra en geç 200 ms içinde ekranda göstermelidir
- [ ] d: Sistem iyi olmalıdır
  Neden: Ölçülebilir ve test edilebilir bir ölçüt içermez.
İpucu: Gereksinimin karşılandığını nasıl test edersiniz?
Kısa açıklama: İyi gereksinim tek anlamlı, ölçülebilir ve test edilebilirdir.
Açıklama: Her gereksinim tek bir şeyi söylemeli ve kabul ölçütü net olmalıdır. "-malıdır/-melidir" kalıbı zorunluluk ifade eder; "hızlı" ve "kolay" gibi kelimeler ölçülebilir değerlerle değiştirilmelidir.
Etiketler: gereksinim

## S56-02 · Doğru / Yanlış
Konu: İzlenebilirlik
Soru: İzlenebilirlik, her gereksinimin hangi tasarım öğesine ve hangi testlere bağlandığının iki yönlü olarak takip edilebilmesidir.
Şıklar:
- [x] Doğru
  Neden: Doğru; gereksinimden teste ve testten gereksinime gidilebilmelidir.
- [ ] Yanlış
  Neden: İzlenebilirlik tam olarak gereksinim, tasarım ve test arasındaki bu iki yönlü bağdır.
İpucu: Test edilmemiş bir gereksinim nasıl bulunur?
Kısa açıklama: İzlenebilirlik gereksinim, tasarım ve test arasındaki iki yönlü bağdır.
Açıklama: İzlenebilirlik matrisi test edilmemiş gereksinimleri ve hiçbir gereksinime dayanmayan kodu ortaya çıkarır. DO-178C gibi standartlar bu bağların kanıtlanmasını açıkça ister.
Etiketler: izlenebilirlik

# S57 · Orta · Karşılaştırma

Alan: Test, süreç ve standartlar
Şirket: Roketsan

Yazılım yaşam döngüsünü anlatın. V-model ile Agile/Scrum arasındaki farklar nelerdir?

Nerede soruldu: Roketsan ilanı (yazılım yaşam döngüsü).

Anahtar noktalar:
- Yaşam döngüsü: gereksinim, tasarım, gerçekleştirme, test ve bakım
- Şelale: aşamalar sırayla yapılır; geri dönmek maliyetlidir
- V-model: her geliştirme aşamasının karşısında bir test seviyesi
- Agile/Scrum: kısa sprintler ve sık geri bildirim
- Savunmada aşama geçitleri (SRR, PDR, CDR) ve dokümantasyon; Agile bu çerçevede uygulanabilir

## S57-01 · Eşleştirme
Konu: Yaşam döngüsü modelleri
Soru: Modelleri özellikleriyle eşleştirin.
Eşleşmeler:
- vmodel: V-model => staged: Her geliştirme aşamasının karşısında bir test seviyesi; aşama geçitleri ve yoğun dokümantasyon
- scrum: Scrum => sprint: Kısa, sabit süreli sprintlerle çalışan ürün parçaları teslim edilir
- waterfall: Şelale (waterfall) => sequential: Aşamalar sırayla bir kez yapılır; geri dönmek maliyetlidir
Fazladan seçenekler:
- decoy: Gereksinim yazılmadan doğrudan kodlamayla başlanır
İpucu: Testlerin aşamalarla eşleştiği model hangisi?
Kısa açıklama: V-model aşama–test eşlemesi, Scrum kısa sprintler, şelale sıralı aşamalardır.
Açıklama: Savunma projeleri sözleşme gereği aşama geçitleri (ör. SRR, PDR, CDR) ve dokümantasyon ister; bu yüzden V-model yaygındır. Birçok ekip bu çerçevenin içinde Scrum pratiklerini de kullanır.
Etiketler: v-model, scrum, yaşam-döngüsü

## S57-02 · Doğru / Yanlış
Konu: Yaşam döngüsü modelleri
Soru: Savunma projelerinde DO-178C ve MIL-STD-498 gibi standartlar şelale modelini şart koştuğu için Agile yöntemler bu projelerde kullanılamaz.
Şıklar:
- [ ] Doğru
  Neden: Birçok savunma projesi Agile pratiklerini aşama geçitleri ve dokümantasyon şartlarıyla birlikte uygular.
- [x] Yanlış
  Neden: Doğru; standartlar dokümantasyon ister ama yöntemi tek bir modele bağlamaz.
İpucu: Standartlar yöntemi mi, çıktıları mı tanımlar?
Kısa açıklama: Savunma projelerinde Agile, aşama geçitleri ve dokümantasyonla birlikte kullanılabilir.
Açıklama: DO-178C ve MIL-STD-498 gibi standartlar hangi çıktıların ve kanıtların üretileceğini tanımlar; bunların hangi yaşam döngüsü modeliyle üretileceğini dayatmaz.
Etiketler: agile, savunma

# S58 · Zorlayıcı · Teori

Alan: Test, süreç ve standartlar

DO-178C nedir? Yazılım seviyeleri neye göre belirlenir?

Nerede soruldu: klasik aviyonik sorusu.

Anahtar noktalar:
- Havacılık yazılımı sertifikasyonu için rehber standart
- Seviyeler arızanın sonucuna göre: A felaket, B tehlikeli, C büyük, D küçük, E etkisiz
- Seviye yükseldikçe hedef sayısı ve bağımsız doğrulama şartı artar
- Yapısal kapsama: C statement, B decision, A ayrıca MC/DC
- Gereksinimden koda ve teste izlenebilirlik

## S58-01 · Eşleştirme
Konu: DO-178C
Soru: DO-178C yazılım seviyelerini arızanın olası sonucuyla eşleştirin.
Eşleşmeler:
- levelA: Seviye A => catastrophic: Felaket (catastrophic) sonuçlu arıza
- levelB: Seviye B => hazardous: Tehlikeli (hazardous) sonuçlu arıza
- levelC: Seviye C => major: Büyük (major) sonuçlu arıza
- levelE: Seviye E => noEffect: Emniyete etkisi olmayan arıza
Fazladan seçenekler:
- decoy: Küçük (minor) sonuçlu arıza
İpucu: Seviye, yazılımın arızalanmasının uçuş emniyetine etkisine göre belirlenir.
Kısa açıklama: Seviye A felaket, B tehlikeli, C büyük, D küçük, E etkisiz arıza sonucuna karşılık gelir.
Açıklama: Seviye yükseldikçe karşılanması gereken hedef sayısı ve bağımsız doğrulama şartı artar; seviye A'da 71 hedef vardır. Fazladan seçenek, listede yer almayan seviye D'yi anlatır.
Etiketler: do-178c, aviyonik

## S58-02 · Tek seçim
Konu: DO-178C
Soru: DO-178C seviye A yazılımı için istenen yapısal kapsama ölçütü hangisidir?
Şıklar:
- [x] a: MC/DC; her koşulun karara bağımsız olarak etki ettiği gösterilmelidir
- [ ] b: Statement kapsaması; her satırın bir kez çalışması yeter
  Neden: Statement kapsaması daha düşük seviyeler içindir; seviye A MC/DC ister.
- [ ] c: Kapsama ölçülmez, yalnız gereksinim testleri yapılır
  Neden: DO-178C yapısal kapsama analizini açıkça ister.
- [ ] d: Fonksiyon kapsaması
  Neden: Seviye A için yetersizdir.
İpucu: Kararın içindeki her koşulun etkisi ayrı ayrı gösterilmeli.
Kısa açıklama: Seviye A, MC/DC kapsaması ister.
Açıklama: Seviye C statement, seviye B ayrıca decision kapsaması, seviye A ise bunlara ek olarak MC/DC ister. MC/DC'de her koşul, diğerleri sabitken kararın sonucunu tek başına değiştirebildiği bir test çiftiyle gösterilir.
Etiketler: do-178c, mc-dc

# S59 · Zorlayıcı · Teori

Alan: Test, süreç ve standartlar

MIL-STD-498 hangi dokümanları tanımlar?

Nerede soruldu: klasik savunma yazılımı sorusu.

Anahtar noktalar:
- ABD askeri yazılım geliştirme ve dokümantasyon standardı (1994)
- SRS gereksinimleri, SDD tasarımı; IRS ve IDD arayüzleri tanımlar
- STP test planı, STD test tanımı, STR test raporudur
- 1998'de yürürlükten kalktı ama doküman şablonları hâlâ yaygın
- Türk savunma projelerinde doküman seti olarak sık kullanılır

## S59-01 · Eşleştirme
Konu: MIL-STD-498
Soru: MIL-STD-498 dokümanlarını içerikleriyle eşleştirin.
Eşleşmeler:
- srs: SRS => requirements: Yazılım gereksinimleri spesifikasyonu
- sdd: SDD => design: Yazılım tasarım tanımı
- irs: IRS => interfaces: Arayüz gereksinimleri spesifikasyonu
- std: STD => testDesc: Yazılım test tanımı (test senaryoları ve prosedürleri)
Fazladan seçenekler:
- decoy: Satın alma sözleşmesinin fiyat eki
İpucu: Kısaltmaların son harfleri doküman türünü verir: S (specification), D (description).
Kısa açıklama: SRS gereksinimleri, SDD tasarımı, IRS arayüzleri, STD testleri tanımlar.
Açıklama: Standart ayrıca STP (test planı), STR (test raporu) ve IDD (arayüz tasarımı) gibi dokümanları tanımlar. Türk savunma projelerinde bu doküman seti hâlâ yaygın bir şablon olarak kullanılır.
Etiketler: mil-std-498, dokümantasyon

## S59-02 · Doğru / Yanlış
Konu: MIL-STD-498
Soru: MIL-STD-498 1994'te yayımlandı; 1998'de yürürlükten kalkıp yerini başka standartlara bıraksa da birçok projede doküman şablonu olarak kullanılmaya devam ediyor.
Şıklar:
- [x] Doğru
  Neden: Doğru; doküman tanımları hâlâ yaygın biçimde referans alınıyor.
- [ ] Yanlış
  Neden: Standart resmî olarak yerini başkalarına bıraksa da şablonları hâlâ kullanılıyor.
İpucu: Yürürlükten kalkmak kullanımın bittiği anlamına gelir mi?
Kısa açıklama: MIL-STD-498 resmî olarak yerini başka standartlara bıraksa da şablonları hâlâ kullanılıyor.
Açıklama: Standart 1998'de J-STD-016'ya devredildi; yine de tanımladığı SRS, SDD, IRS ve test dokümanları birçok savunma projesinde ve şirket içi süreçte referans olarak yaşamaya devam ediyor.
Etiketler: mil-std-498

# S60 · Kolay · Karşılaştırma

Alan: Test, süreç ve standartlar

Git'te merge ile rebase arasındaki fark nedir? Conflict nasıl çözülür?

Nerede soruldu: klasik yazılım geliştirme sorusu.

Anahtar noktalar:
- Merge geçmişi korur ve bir birleştirme commit'i oluşturur
- Rebase commit'leri yeni tabanın üzerine yeniden yazar; doğrusal geçmiş verir
- Paylaşılmış dalı rebase edip zorla push etmemek; gerekirse `--force-with-lease`
- Conflict: dosyayı düzelt, `git add`, sonra commit ya da `git rebase --continue`
- Küçük ve açıklayıcı commit'ler

## S60-01 · Tek seçim
Konu: Git
Soru: Merge ile rebase arasındaki temel fark hangisidir?
Şıklar:
- [x] a: Merge geçmişi korur; rebase commit'leri yeni tabanın üzerine yeniden yazar
- [ ] b: Rebase, iki dalı birleştiren bir merge commit'i oluşturur ve iki dalın geçmişini olduğu gibi korur
  Neden: Birleştirme commit'ini merge oluşturur; rebase commit'leri yeni tabanın üzerine yeniden uygular.
- [ ] c: Merge uzak depoda, rebase yerel depoda çalışır; ikisi aynı dalda kullanılamaz
  Neden: İkisi de yerel işlemlerdir ve aynı dalda kullanılabilir.
- [ ] d: Merge conflict üretmez, rebase üretir; conflict yaşamamak için merge tercih edilir
  Neden: İkisi de çakışan değişikliklerde conflict üretebilir.
İpucu: Hangisi commit kimliklerini değiştirir?
Kısa açıklama: Merge geçmişi olduğu gibi birleştirir; rebase doğrusal bir geçmiş için commit'leri yeniden yazar.
Açıklama: Rebase temiz ve doğrusal bir geçmiş verir ama commit kimliklerini değiştirir. Conflict'te dosyalar düzenlenir, git add ile işaretlenir ve merge için commit, rebase için git rebase --continue ile devam edilir.
Etiketler: git, merge, rebase

## S60-02 · Doğru / Yanlış
Konu: Git
Soru: Başkalarıyla paylaşılmış (push edilmiş) bir dalı rebase edip zorla push etmek, ekip arkadaşlarının yerel geçmişiyle çakışma yaratabilir.
Şıklar:
- [x] Doğru
  Neden: Doğru; onların dalı artık var olmayan eski commit'lere dayanır.
- [ ] Yanlış
  Neden: Rebase commit kimliklerini değiştirdiği için paylaşılmış dallarda sorun çıkarır.
İpucu: Rebase commit kimliklerine ne yapar?
Kısa açıklama: Paylaşılmış dalların geçmişi yeniden yazılmamalıdır.
Açıklama: Yaygın kural, rebase'i yalnız henüz paylaşılmamış yerel dallarda kullanmaktır. Zorla push gerekiyorsa --force-with-lease, başkasının bu arada gönderdiği commit'leri yanlışlıkla silmeyi engeller.
Etiketler: git, rebase

# S61 · Orta · Teori

Alan: Test, süreç ve standartlar
Şirket: STM

Konfigürasyon yönetimi nedir? Baseline ve değişiklik kontrolü ne işe yarar?

Nerede soruldu: STM (PLM ve Konfigürasyon Mühendisliği alanı).

Anahtar noktalar:
- Neyin, hangi sürümle ve hangi onayla teslim edildiğini kayıt altına alır
- Konfigürasyon öğeleri: kod, dokümanlar, araçlar ve donanım tanımları
- Baseline: onaylanmış ve değişiklik kontrolü altındaki yapılandırma
- Değişiklik talebi, etki analizi ve değişiklik kontrol kurulu (CCB)
- Sahadaki her sistemin yazılımının yeniden üretilebilmesi

## S61-01 · Tek seçim
Konu: Konfigürasyon yönetimi
Soru: Konfigürasyon yönetiminde baseline nedir?
Şıklar:
- [ ] a: Projenin başlangıcında yazılan ve bir daha hiç değiştirilmeyen ilk kod sürümüdür; sonraki tüm sürümler ondan bağımsızdır
  Neden: Baseline proje boyunca onaylı noktalarda birden çok kez oluşturulur ve değişiklikler ona göre izlenir.
- [x] b: Resmî olarak onaylanmış ve değişiklikleri kontrollü yapılan yapılandırma öğeleri kümesi
- [ ] c: Bir performans ölçüm sonucu
  Neden: Baseline bir yapılandırma referansıdır, performans ölçümü değildir.
- [ ] d: Ana dalın adı
  Neden: Dal adı değil, onaylı bir yapılandırmanın anlık görüntüsüdür.
İpucu: Değişiklik talepleri neye göre değerlendirilir?
Kısa açıklama: Baseline, onaylı ve değişiklik kontrolü altındaki yapılandırmadır.
Açıklama: Konfigürasyon yönetimi neyin, hangi sürümle, hangi onayla teslim edildiğini kayıt altına alır. Baseline'dan sonraki her değişiklik bir değişiklik talebiyle değerlendirilir ve izlenir; böylece sahadaki her sistemin yazılımı yeniden üretilebilir.
Etiketler: konfigürasyon-yönetimi

# S62 · Kolay · Teori

Alan: Test, süreç ve standartlar

Code review'da nelere bakarsınız?

Nerede soruldu: klasik yazılım geliştirme sorusu.

Anahtar noktalar:
- Doğruluk ve sınır durumları
- Değişikliği kapsayan testler
- Okunabilirlik, isimlendirme ve gereksiz karmaşıklık
- Güvenlik ve hata yönetimi
- Küçük değişiklikler, yapıcı ve somut yorumlar; biçim kontrolü araçlara bırakılır

## S62-01 · Çoklu seçim
Konu: Code review
Soru: Bir code review'da öncelikle bakılması gerekenleri seçin.
Şıklar:
- [x] a: Kodun gereksinimi doğru karşılayıp karşılamadığı ve sınır durumları
  Neden: Doğru; incelemenin ilk amacı doğruluktur.
- [x] b: Değişikliği kapsayan testlerin varlığı
  Neden: Doğru; test edilmeyen değişiklik riskli kalır.
- [x] c: Okunabilirlik, isimlendirme ve gereksiz karmaşıklık
  Neden: Doğru; kod yazıldığından çok okunur.
- [x] d: Girdi doğrulama gibi güvenlik açıkları
  Neden: Doğru; güvenlik açıkları incelemede en ucuz yakalanır.
- [ ] e: Kodu yazan kişinin kıdemine göre onay vermek
  Neden: İnceleme kişiye değil koda yöneliktir; kıdem kalite garantisi değildir.
- [ ] f: Yalnız biçimlendirme farklarına odaklanmak
  Neden: Biçimlendirme otomatik araçlara bırakılır; asıl değer mantık ve tasarım incelemesidir.
İpucu: Araçların yakalayamadığı şeylere odaklanın.
Kısa açıklama: Doğruluk, test, okunabilirlik ve güvenlik incelemenin odağıdır.
Açıklama: İyi bir inceleme küçük değişiklikler üzerinde, yapıcı ve somut yorumlarla yapılır. Biçim ve stil kontrolleri otomatik araçlara bırakılarak insan dikkati mantık, tasarım ve risklere ayrılır.
Etiketler: code-review

# S63 · Kolay · Davranışsal

Alan: Davranışsal ve işe alım
Şirket: TÜBİTAK SAGE, HAVELSAN, ASELSAN, Baykar

Kendinizi ve projelerinizi anlatın. Karşılaştığınız teknik bir problemi ve nasıl çözdüğünüzü anlatın.

Nerede soruldu: TÜBİTAK SAGE, HAVELSAN, ASELSAN ve Baykar (aday beyanları).

Anahtar noktalar:
- STAR yapısı: durum, görev, eylem ve sonuç
- Kendi rolünü takımın işinden ayırarak anlatmak
- Teknik kararların gerekçesi ve değerlendirilen alternatifler
- Ölçülebilir sonuç ve çıkarılan ders
- CV'deki her konunun arkasında durabilmek; derin sorulara hazırlıklı olmak

## S63-01 · Eşleştirme
Konu: STAR yapısı
Soru: STAR yapısının adımlarını içerikleriyle eşleştirin.
Eşleşmeler:
- situation: Situation => context: Problemin yaşandığı bağlam ve proje
- task: Task => responsibility: Senin sorumluluğun ve hedefin
- action: Action => steps: Senin attığın somut adımlar ve teknik kararlar
- result: Result => outcome: Ölçülebilir sonuç ve çıkardığın ders
Fazladan seçenekler:
- decoy: Şirketin vizyonu ve sektörün genel durumu
İpucu: Hikâye bağlamdan başlar, sonuçla biter.
Kısa açıklama: STAR; durum, görev, eylem ve sonuçtur.
Açıklama: Teknik bir problemi anlatırken bağlamı kısa tutup en çok zamanı kendi eylemlerine ve kararlarının gerekçesine ayırmak gerekir. Sonuç mümkünse ölçülebilir olmalı ve öğrenilen ders eklenmelidir.
Etiketler: star, davranışsal

## S63-02 · Tek seçim
Konu: Proje anlatımı
Soru: Bir projeyi mülakatta anlatırken hangi yaklaşım en güçlü izlenimi bırakır?
Şıklar:
- [ ] a: Takımın yaptıklarını "biz yaptık" diye anlatıp kendi rolünü ayırmamak, böylece takım oyuncusu görünmek
  Neden: Görüşmeci senin katkını ölçmek ister; rolün belirsiz kalırsa değerlendirilemezsin.
- [ ] b: CV'deki teknolojileri sayıp nasıl kullanıldıklarına girmeden geniş bilgi izlenimi vermek
  Neden: Derin sorular geldiğinde yüzeysel bilgi ortaya çıkar; adaylar "sakın sallamayın" diye uyarıyor.
- [x] c: Kendi rolünü, teknik kararların gerekçesini ve ölçülebilir sonucu anlatmak
- [ ] d: Projeyi kısaca geçmek
  Neden: Teknik mülakatın büyük kısmı projeler üzerinden ilerler; derinlik beklenir.
İpucu: Görüşmeci senin katkını ve muhakemeni görmek ister.
Kısa açıklama: Rolünü, kararlarının gerekçesini ve sonucu anlat.
Açıklama: Savunma şirketlerinde teknik mülakat büyük ölçüde CV'deki projeler üzerinden yürüyor; "neden bu teknolojiyi seçtin, alternatifler neydi?" gibi sorularla derinlemesine iniliyor. CV'de yazan her şeyin arkasında durabilmek gerekir.
Etiketler: proje, davranışsal

# S64 · Kolay · Davranışsal

Alan: Davranışsal ve işe alım
Şirket: ASELSAN, Baykar

Neden bizimle çalışmak istiyorsunuz? Şirketimiz hakkında neler biliyorsunuz?

Nerede soruldu: ASELSAN (Temmuz 2025) ve Baykar yüz yüze İK görüşmesi (aday beyanları).

Anahtar noktalar:
- Şirketin ürünlerini ve güncel projelerini somut olarak bilmek
- Başvurulan birimin işini anlatabilmek
- Kendi projelerini ve becerilerini bu işe bağlamak
- Uzun vadeli hedef ve motivasyon
- Her şirkete söylenebilecek genel cevaplardan kaçınmak

## S64-01 · Tek seçim
Konu: Şirket motivasyonu
Soru: Bu soruya hangisi en güçlü cevaptır?
Şıklar:
- [x] a: Başvurduğum birimin ürünlerinden ve güncel projelerinden somut örnekler verip kendi becerilerimle ilişkilendirmek
- [ ] b: Savunma sanayiinin ülkemiz için çok önemli olduğunu ve büyük bir şirkette çalışmak istediğimi söylemek
  Neden: Geneldir ve her şirkete söylenebilir; şirketi araştırdığını göstermez.
- [ ] c: Maaş ve yan hakların sektördeki en iyi seçeneklerden biri olduğunu öne çıkarmak
  Neden: Motivasyonu yalnız maddi göstermek, uzun vadeli kalma niyeti konusunda soru işareti bırakır.
- [ ] d: Şirketi pek araştırmadığımı ama hızlı öğrendiğimi söylemek
  Neden: Bu sektörde şirketi ve ürünlerini bilmek özellikle bekleniyor.
İpucu: Cevap başka bir şirkete de aynen söylenebiliyor mu?
Kısa açıklama: Şirketin ürünlerini ve birimin işini somut anlatıp kendi becerilerinle bağla.
Açıklama: Baykar İK görüşmelerinde şirketin ürünleri, sahadaki kullanımı ve vizyonu ayrıntılı soruluyor. Başvurulan birimin bir ürününü veya projesini adıyla anmak ve kendi projelerinden bir bağlantı kurmak cevabı inandırıcı yapar.
Etiketler: ik, motivasyon

# S65 · Kolay · Teori

Alan: Davranışsal ve işe alım
Şirket: ASELSAN

Kişi Güvenlik Belgesi (KGB) nedir, süreç nasıl işler? Askerlik durumunuz nedir?

Nerede soruldu: gizli projeler için genel şart; ASELSAN genel şartları.

Anahtar noktalar:
- Gizli projelere erişim için Kişi Güvenlik Belgesi gerekir
- Başvuruyu şirket yapar; soruşturmayı MİT, Emniyet ve mülki amirlikler yürütür
- Süreç aylar sürebilir; teklif ile işe başlama arası uzayabilir
- Erkek adaylardan askerliğini yapmış ya da en az iki yıl tecilli olmaları beklenebilir
- Askerlik durumunu net ve dürüst anlatmak

## S65-01 · Doğru / Yanlış
Konu: Güvenlik belgesi
Soru: Kişi Güvenlik Belgesi başvurusunu aday kendisi yapar ve belge işe başlamadan önce birkaç gün içinde çıkar.
Şıklar:
- [ ] Doğru
  Neden: Başvuruyu işveren şirket yapar; soruşturma MİT, Emniyet ve mülki amirliklerce yürütülür ve aylar sürebilir.
- [x] Yanlış
  Neden: Doğru; bu yüzden teklif ile işe başlama arasındaki süre uzayabilir.
İpucu: Gizli projelere erişim için kim kimi soruşturur?
Kısa açıklama: KGB'yi şirket ister, soruşturma aylar sürebilir.
Açıklama: Gizli projelere erişim için Kişi Güvenlik Belgesi gerekir; başvuru şirket üzerinden yapılır ve soruşturmayı devlet kurumları yürütür. ASELSAN gibi şirketler erkek adaylardan askerliğini yapmış veya en az iki yıl tecilli olmalarını bekliyor.
Etiketler: kgb, işe-alım

# S66 · Kolay · Kod yazma

Alan: Veri yapıları ve algoritmalar
Şirket: ASELSAN, HAVELSAN

Bir tamsayının palindrom olup olmadığını, sayıyı String'e çevirmeden bulun. Negatif sayıları, sonu 0 olan sayıları ve taşmayı nasıl ele alırsınız? Zaman ve bellek karmaşıklığı nedir?

Nerede soruldu: ASELSAN gömülü yazılım (LeetCode palindrom sayı) ve HAVELSAN ("java ile palindrom problemi"); İşteMülakat aday beyanları.

Anahtar noktalar:
- Basamakları `% 10` ve `/ 10` ile alıp sayıyı String'e çevirmeden ters çevirmek
- Negatif sayılar palindrom değildir; `-121` tersten `121-` okunur
- Sonu 0 olan sayılar (0 hariç) palindrom olamaz
- Sayının tamamını ters çevirmek `int` sınırında taşabilir; yalnız yarısını ters çevirmek bu riski kaldırır
- Zaman O(log₁₀ n), yani basamak sayısı kadar; ek bellek O(1)

## S66-01 · Kod çıktısı
Konu: Palindrom sayı
Soru: Kod 1230 için ne yazdırır?
Kod:
```java
int x = 1230;
int original = x;
int reversed = 0;
while (x > 0) {
    reversed = reversed * 10 + x % 10;
    x /= 10;
}
System.out.println(reversed + " " + (original == reversed));
```
Cevap: 321 false
İpucu: Sondaki 0 ters çevrilince başa geçer ve sayının değerine katkı yapmaz.
Kısa açıklama: Basamaklar ters çevrilince 321 elde edilir; 1230'a eşit olmadığı için sonuç false'tur.
Açıklama: Döngü her turda son basamağı `x % 10` ile alıp `reversed` sonuna ekler ve `x /= 10` ile o basamağı atar: 0, 3, 32, 321. Sondaki 0 baştaki sıfıra dönüştüğü için kaybolur; bu yüzden sonu 0 olan pozitif sayılar palindrom olamaz ve bu durum döngüden önce kısa yoldan elenebilir.
Etiketler: palindrom, java, basamak

## S66-02 · Tek seçim
Konu: Palindrom sayı
Soru: Negatif sayılar için doğru davranış hangisidir?
Şıklar:
- [ ] a: Önce mutlak değer alınmalı; bu yüzden `-121` palindrom kabul edilir
  Neden: Eksi işareti de sayının bir parçasıdır; `-121` tersten `121-` okunur.
- [x] b: Negatif sayılar palindrom değildir; `-121` tersten `121-` okunur
- [ ] c: `x % 10` negatif sayıda istisna fırlattığı için önce try-catch eklenmelidir
  Neden: Java'da `%` negatif sayıda istisna fırlatmaz, negatif bir kalan döndürür.
- [ ] d: Yalnız tek basamaklı negatif sayılar palindromdur
  Neden: Tek basamaklı negatif sayıda da eksi işareti tersten okununca sona geçer.
İpucu: Sayıyı yazı olarak tersten okumayı düşünün.
Kısa açıklama: Eksi işareti tersten okunduğunda sona geçtiği için negatif sayılar palindrom değildir.
Açıklama: Problemin standart tanımında `-121` tersten `121-` olarak okunur ve palindrom sayılmaz. Bu yüzden çözüm `x < 0` için hemen false döndürür; böylece negatif sayılarda `%` operatörünün negatif kalan üretmesi de sorun olmaktan çıkar.
Etiketler: palindrom, negatif-sayı

## S66-03 · Doğru / Yanlış
Konu: Palindrom sayı
Soru: Palindrom kontrolünde sayının yalnız yarısını ters çevirmek, tamamını ters çevirirken oluşabilecek `int` taşmasını önler.
Şıklar:
- [x] Doğru
  Neden: Doğru; ters çevrilen yarı en fazla orijinal sayının yarısı kadar basamak taşır ve taşmaz.
- [ ] Yanlış
  Neden: Örneğin 2147483647'nin tersi `int` sınırını aşar; yarısını ters çevirmek bu durumu önler.
İpucu: 2147483647 sayısının tersi `int`'e sığar mı?
Kısa açıklama: Doğru. Yarısını ters çevirmek taşmayı önler ve işi yarı yarıya azaltır.
Açıklama: Döngü, ters çevrilen kısım kalan kısımdan büyük ya da ona eşit olunca durur. Çift basamaklı sayılarda iki yarı eşit olmalı, tek basamaklı sayılarda ortadaki basamak `reversed / 10` ile atılır. Bu yöntem hem taşmayı önler hem de yalnız basamakların yarısını işler.
Etiketler: palindrom, taşma, optimizasyon

# S67 · Orta · Teori

Alan: Veritabanı ve uygulama
Şirket: HAVELSAN

JVM'de nesil tabanlı (generational) çöp toplama nasıl çalışır? Java'da bellek sızıntısı olur mu? Bir örnek verin.

Nerede soruldu: HAVELSAN, Java ağırlıklı teknik mülakat (İşteMülakat aday beyanı).

Anahtar noktalar:
- Heap genç nesil (Eden ve survivor alanları) ile yaşlı nesle ayrılır
- Nesnelerin çoğu kısa ömürlüdür; genç nesildeki minor GC sık çalışır ve ucuzdur
- Birkaç minor GC'den sağ çıkan nesne yaşlı nesle terfi eder; yaşlı nesil dolunca daha pahalı toplama çalışır
- GC köklerden erişilebilirliğe bakar; erişilemeyen döngüleri de toplar
- Java'da sızıntı: kullanılmadığı hâlde erişilebilir kalan nesneler (statik koleksiyon, kaldırılmayan listener, sınırsız önbellek)

## S67-01 · Sıralama
Konu: Nesil tabanlı GC
Soru: Uzun yaşayan bir nesnenin nesil tabanlı GC içindeki yolculuğunu sıraya koyun.
Sıra:
1. eden: Nesne genç nesildeki Eden alanında oluşturulur
2. minor: Minor GC'den sağ çıkınca survivor alanına taşınır
3. promote: Birkaç minor GC'den daha sağ çıkınca yaşlı nesle terfi eder
4. major: Yaşlı nesil dolduğunda daha pahalı bir toplama onu da inceler
İpucu: Nesneler genç başlar, hayatta kaldıkça yaşlanır.
Kısa açıklama: Eden, survivor, yaşlı nesil ve en sonda yaşlı nesil toplaması.
Açıklama: Nesil tabanlı toplama, nesnelerin çoğunun genç öldüğü gözlemine dayanır. Genç nesil sık ve hızlı toplanır; hayatta kalan nesneler survivor alanları arasında kopyalanır ve belirli bir yaşa gelince yaşlı nesle terfi eder. Yaşlı nesil daha seyrek ama daha maliyetli toplanır.
Etiketler: gc, jvm, generational

## S67-02 · Çoklu seçim
Konu: Java'da bellek sızıntısı
Soru: Java'da bellek sızıntısına yol açabilecek durumları seçin.
Şıklar:
- [x] a: Statik bir koleksiyona eklenip hiç çıkarılmayan nesneler
  Neden: Doğru; statik alan bir GC köküdür, eklenen nesneler erişilebilir kalır.
- [x] b: Kaydedilip hiç kaldırılmayan dinleyiciler (listener) ve callback'ler
  Neden: Doğru; olay kaynağı dinleyiciyi ve onun tuttuğu nesneleri yaşatır.
- [x] c: Boyut sınırı veya süre aşımı olmayan bir önbellek
  Neden: Doğru; önbellek büyüdükçe kullanılmayan girdiler de tutulur.
- [ ] d: Bir metodun yerel değişkeninde oluşturulan ve metot dönünce erişilemeyen nesneler
  Neden: Metot dönünce nesneye giden referans kalmaz; GC onu toplayabilir.
- [ ] e: Birbirini gösteren ama köklerden erişilemeyen iki nesne
  Neden: Java'nın GC'si erişilebilirliğe bakar; erişilemeyen döngüler de toplanır.
- [ ] f: `System.gc()` çağrılmadığı için toplanmayan nesneler
  Neden: GC kendiliğinden çalışır; `System.gc()` yalnız bir öneridir ve sızıntının nedeni değildir.
İpucu: GC neyi toplayamaz: kullanılmayan nesneyi mi, erişilebilir nesneyi mi?
Kısa açıklama: Java'da sızıntı, artık kullanılmayan ama hâlâ erişilebilir kalan nesnelerdir.
Açıklama: Java'nın GC'si referans sayısına değil, köklerden (stack'teki referanslar, statik alanlar, aktif thread'ler) erişilebilirliğe bakar. Bu yüzden döngüsel referanslar sorun değildir; asıl sızıntı, unutulan referansların nesneleri erişilebilir tutmasıdır. Heap dump ve profil araçlarıyla hangi kökün nesneleri tuttuğu bulunur.
Etiketler: gc, memory-leak, jvm

## S67-03 · Doğru / Yanlış
Konu: Java'da bellek sızıntısı
Soru: Java'da iki nesne birbirini referans ediyorsa, köklerden erişilemez olsalar bile çöp toplayıcı onları toplayamaz.
Şıklar:
- [ ] Doğru
  Neden: Java'nın GC'si referans sayısına bakmaz; köklerden erişilemeyen döngüler de toplanır.
- [x] Yanlış
  Neden: Doğru; erişilebilirlik esas alındığı için döngüsel referans sızıntı yaratmaz.
İpucu: GC referans mı sayıyor, yoksa köklerden başlayıp erişilebilir nesneleri mi işaretliyor?
Kısa açıklama: Yanlış. Erişilemeyen döngüler de toplanır; Java'nın GC'si erişilebilirliğe bakar.
Açıklama: Referans sayan sistemlerde (ör. C++ `shared_ptr`) döngüler sızıntıya yol açar. Java ise köklerden başlayıp erişilebilir nesneleri işaretler; işaretlenmeyen her şey, döngü içinde olsa bile toplanabilir.
Etiketler: gc, reachability

# S68 · Kolay · Karşılaştırma

Alan: C/C++
Şirket: Baykar

C'de değerle ve adresle geçirme arasındaki fark nedir? C'de "call by reference" var mı? C++'taki referans bu durumu nasıl değiştirir?

Nerede soruldu: Baykar gömülü yazılım (Glassdoor aday beyanı).

Anahtar noktalar:
- C'de her argüman değerle geçer; fonksiyon kopyayla çalışır
- İşaretçi geçirmek adresin kopyasını verir; `*p` ile çağıranın değişkeni değiştirilebilir
- Dizi parametresi ilk elemanın işaretçisine dönüşür; boyut bilgisi kaybolur
- C++ referansı (`int&`) çağıranın değişkenine doğrudan bağlanır, null olamaz ve yeniden bağlanamaz
- Büyük nesneler kopyalanmadan okunmak için `const T&` ile geçirilir

## S68-01 · Kod çıktısı
Konu: Değerle ve adresle geçirme
Soru: Programın çıktısını satır sırasıyla yazın.
Kod:
```c
#include <stdio.h>

void by_value(int n) {
    n = 10;
}

void by_pointer(int *n) {
    *n = 20;
}

int main(void) {
    int a = 1;
    by_value(a);
    printf("%d\n", a);
    by_pointer(&a);
    printf("%d\n", a);
    return 0;
}
```
Cevap:
```
1
20
```
İpucu: Hangi fonksiyon `a`'nın kendisine, hangisi yalnız kopyasına erişiyor?
Kısa açıklama: `by_value` kopyayı değiştirir ve `a` 1 kalır; `by_pointer` adres üzerinden `a`'yı 20 yapar.
Açıklama: `by_value(a)` çağrısında `n`, `a`'nın kopyasıdır; ona atama çağıranı etkilemez. `by_pointer(&a)` ise `a`'nın adresini geçirir; adres de kopyalanır ama `*n = 20` bu adresteki değişkeni, yani `a`'yı değiştirir.
Etiketler: c, işaretçi, parametre

## S68-02 · Tek seçim
Konu: Değerle ve adresle geçirme
Soru: C'de "call by reference" var mıdır?
Şıklar:
- [x] a: Hayır; her argüman değerle geçer, işaretçi geçirmek adresin kopyasını vererek aynı etkiyi sağlar
- [ ] b: Evet; dizi parametreleri referansla geçer ve fonksiyon dizinin kendisini, boyutuyla birlikte alır
  Neden: Dizi parametresi ilk elemanın işaretçisine dönüşür; işaretçi de değerle geçer ve boyut bilgisi kaybolur.
- [ ] c: Evet; parametre `int &x` biçiminde bildirilirse referansla geçer
  Neden: `&` ile referans parametresi C++ özelliğidir; C'de derlenmez.
- [ ] d: Hayır; C'de bir fonksiyon çağıranın değişkenini hiçbir yolla değiştiremez
  Neden: Değişkenin adresi geçirilirse fonksiyon `*p` ile onu değiştirebilir.
İpucu: İşaretçi parametresinin kendisi nasıl geçirilir?
Kısa açıklama: C'de yalnız değerle geçirme vardır; referans etkisi işaretçinin değerle geçirilmesiyle elde edilir.
Açıklama: C standardında bütün argümanlar değerle geçer. Bir fonksiyonun çağıranın değişkenini değiştirmesi için o değişkenin adresi geçirilir; adres kopyalanır ama gösterdiği yer aynıdır. Gerçek referans parametreleri C++ ile gelir.
Etiketler: c, cpp, parametre

## S68-03 · Eşleştirme
Konu: Parametre geçirme biçimleri
Soru: C/C++ parametre bildirimlerini anlamlarıyla eşleştirin.
Eşleşmeler:
- value: `void f(int x)` => copy: Kopya alır; çağıranın değişkeni değişmez
- pointer: `void f(int *x)` => address: Adresin kopyasını alır; `*x` ile çağıranın değişkeni değişebilir ve `x` null olabilir
- reference: `void f(int &x)` => alias: C++ referansı; çağıranın değişkenine doğrudan bağlanır ve null olamaz
- constRef: `void f(const std::string &s)` => readOnly: Büyük nesneyi kopyalamadan ve değiştirmeden okur
Fazladan seçenekler:
- constant: Argümanı derleme zamanında sabit bir değere çevirir
İpucu: Kopya, adres, takma ad ve salt okunur takma ad.
Kısa açıklama: Değerle kopya, işaretçiyle adres, referansla takma ad, const referansla kopyasız okuma.
Açıklama: İşaretçi ile referans arasındaki temel farklar: referans null olamaz, tanımlanınca başka değişkene bağlanamaz ve sözdiziminde `*` gerektirmez. `const T&` kopyalama maliyetinden kaçınırken fonksiyonun nesneyi değiştirmeyeceğini de garanti eder.
Etiketler: cpp, referans, işaretçi

# S69 · Orta · Teori

Alan: Veritabanı ve uygulama
Şirket: HAVELSAN

Spring'de IoC ve Dependency Injection nedir? Bean scope'ları nelerdir ve varsayılan scope uygulamayı nasıl etkiler?

Nerede soruldu: HAVELSAN (Glassdoor aday beyanı).

Anahtar noktalar:
- IoC: nesneleri oluşturma ve birbirine bağlama işini Spring konteynerine bırakmak
- DI: bağımlılık sınıfa dışarıdan verilir; constructor injection önerilir
- Bean tanımlama: `@Component`, `@Service`, `@Repository` veya `@Configuration` içinde `@Bean`
- Scope'lar: singleton (varsayılan), prototype, request, session
- Singleton bean'ler eşzamanlı isteklerde paylaşılır; durumsuz ve thread-safe tutulmalıdır

## S69-01 · Eşleştirme
Konu: Bean scope
Soru: Spring bean scope'larını davranışlarıyla eşleştirin.
Eşleşmeler:
- singleton: singleton => one: Varsayılan; konteyner başına tek örnek
- prototype: prototype => each: Konteynerden her istendiğinde yeni örnek
- request: request => perRequest: Her HTTP isteği için bir örnek
- session: session => perSession: Her HTTP oturumu için bir örnek
Fazladan seçenekler:
- persisted: Uygulama yeniden başlatılsa da diskte saklanıp geri yüklenen örnek
İpucu: Örnek kaç kez ve hangi kapsamda oluşturuluyor?
Kısa açıklama: Singleton tek, prototype her istekte yeni; request ve session web isteği ve oturumu başına bir örnektir.
Açıklama: Scope, konteynerin bir bean'den kaç örnek oluşturacağını belirler. Varsayılan singleton'dır. Prototype her enjeksiyonda veya `getBean` çağrısında yeni örnek üretir. Request ve session scope'ları yalnız web uygulamalarında anlamlıdır.
Etiketler: spring, bean, scope

## S69-02 · Tek seçim
Konu: Dependency Injection
Soru: Constructor injection'ın alana `@Autowired` yazmaya (field injection) göre temel avantajı nedir?
Şıklar:
- [x] a: Bağımlılıklar `final` olabilir ve sınıf testte Spring olmadan elle oluşturulabilir
- [ ] b: Daha az kod gerektirir ve döngüsel bağımlılıkları kendiliğinden çözer
  Neden: Daha az kod field injection'ın özelliğidir; constructor injection döngüsel bağımlılığı çözmez, açılışta görünür kılar.
- [ ] c: Uygulamanın açılışını belirgin biçimde hızlandırır, çünkü bean'ler daha geç oluşturulur
  Neden: Enjeksiyon yönteminin açılış hızına anlamlı bir etkisi yoktur.
- [ ] d: Bean'lerin singleton olabilmesi için constructor injection gerekir
  Neden: Scope, enjeksiyon yönteminden bağımsızdır.
İpucu: Sınıfı birim testinde `new` ile oluşturmak isteseniz hangisi kolaylaştırır?
Kısa açıklama: Constructor injection bağımlılıkları açık ve değiştirilemez yapar; test etmeyi kolaylaştırır.
Açıklama: Bağımlılıklar kurucu parametresi olunca sınıfın neye ihtiyaç duyduğu imzasından görünür, alanlar `final` olabilir ve nesne her zaman tam kurulmuş hâlde oluşur. Testte sahte bağımlılıklar kurucuya verilerek sınıf Spring konteyneri olmadan oluşturulabilir.
Etiketler: spring, di, test

## S69-03 · Doğru / Yanlış
Konu: Bean scope
Soru: Varsayılan singleton scope'taki bir Spring bean'inde isteğe özel, değişebilir bir alan tutmak thread güvenli değildir.
Şıklar:
- [x] Doğru
  Neden: Doğru; aynı singleton örneği bütün isteklerde paylaşılır ve alan thread'ler arasında karışır.
- [ ] Yanlış
  Neden: Singleton bean tek örnektir; isteğe özel durum yerel değişkenlerde veya uygun scope'lu bean'lerde tutulmalıdır.
İpucu: Aynı anda gelen iki istek aynı bean örneğini mi kullanır?
Kısa açıklama: Doğru. Singleton bean'ler paylaşılır; durumsuz ve thread-safe tutulmalıdır.
Açıklama: Web uygulamasında her istek ayrı bir thread'de işlenir ama singleton bean tek örnektir. İsteğe özel veri bir alanda tutulursa bir isteğin verisi diğerine karışabilir. Durum yerel değişkenlerde, parametrelerde veya request scope'lu bean'lerde tutulmalıdır.
Etiketler: spring, singleton, thread-safety

# S70 · Orta · Karşılaştırma

Alan: Veritabanı ve uygulama
Şirket: HAVELSAN

Java'da `synchronized` ne yapar? `HashMap`, `Collections.synchronizedMap` ve `ConcurrentHashMap` arasındaki farklar nelerdir?

Nerede soruldu: HAVELSAN (Glassdoor aday beyanı).

Anahtar noktalar:
- `synchronized`, nesnenin monitor kilidini alır; aynı kilit için tek thread girer ve görünürlük sağlanır
- `HashMap` thread-safe değildir; eşzamanlı yazmalarda güncellemeler kaybolabilir
- `Collections.synchronizedMap` her işlemi tek bir kilitle korur; basit ama yoğun erişimde darboğaz olur
- `ConcurrentHashMap` okumaları çoğunlukla kilitsiz yapar, yazmalarda yalnız ilgili bucket'ı kilitler
- `ConcurrentHashMap` null anahtar ve değer kabul etmez; `computeIfAbsent` gibi atomik işlemler sunar

## S70-01 · Çoklu seçim
Konu: ConcurrentHashMap
Soru: `ConcurrentHashMap` için doğru ifadeleri seçin.
Şıklar:
- [x] a: Okumalar çoğunlukla kilitsiz yapılır; yazmalar yalnız ilgili bucket'ı kilitler
  Neden: Doğru; bu yüzden eşzamanlı erişimde tek kilitli map'ten çok daha iyi ölçeklenir.
- [ ] b: `null` anahtar ve `null` değer kabul eder
  Neden: `ConcurrentHashMap` null anahtar ve değeri reddeder; null, "anahtar yok" sonucuyla karışırdı.
- [x] c: `putIfAbsent`, `computeIfAbsent` ve `merge` gibi atomik bileşik işlemler sunar
  Neden: Doğru; "yoksa ekle" gibi işlemler ayrı `get` ve `put` çağrılarına bölünmeden atomik yapılır.
- [ ] d: Her işlemde bütün map'i tek bir kilitle korur
  Neden: Bu `Collections.synchronizedMap` davranışıdır.
- [ ] e: Elemanları eklenme sırasıyla dolaşır
  Neden: Sıra garantisi yoktur; eklenme sırası için `LinkedHashMap` kullanılır.
İpucu: Eşzamanlılıkta ölçeklenmek için kilit ne kadar küçük olmalı?
Kısa açıklama: `ConcurrentHashMap` ince taneli kilitleme ve atomik bileşik işlemler sunar; null kabul etmez.
Açıklama: Java 8'den itibaren `ConcurrentHashMap` boş bucket'lara CAS ile yazar, dolu bucket'ın yalnız ilk düğümünü kilitler; okumalar kilit almaz. Iterator'ları zayıf tutarlıdır ve `ConcurrentModificationException` fırlatmaz. `get` ardından `put` yazmak yerine `computeIfAbsent` kullanmak yarış durumunu önler.
Etiketler: concurrenthashmap, concurrency, java

## S70-02 · Tek seçim
Konu: HashMap ve thread güvenliği
Soru: İki thread aynı `HashMap`'e senkronizasyon olmadan aynı anda yazıyor. Ne olabilir?
Şıklar:
- [x] a: Güncellemeler kaybolabilir ve yeniden boyutlandırma sırasında map tutarsız hâle gelebilir
- [ ] b: Java, `HashMap` erişimlerini arka planda kendisi senkronize ettiği için sorun çıkmaz
  Neden: `HashMap` hiçbir senkronizasyon yapmaz; thread güvenliği çağırana bırakılmıştır.
- [ ] c: Derleyici, birden fazla thread'in eriştiği bir `HashMap` için derleme hatası verir
  Neden: Derleyici çalışma zamanındaki thread erişimini bilemez; kod derlenir.
- [ ] d: İkinci thread, ilk thread map ile işini bitirene kadar beklemeye alınır
  Neden: Böyle bir bekleme yalnız bir kilit kullanılırsa olur; `HashMap` kilit almaz.
İpucu: `HashMap` hangi senkronizasyonu yapar?
Kısa açıklama: `HashMap` thread-safe değildir; eşzamanlı yazmalar veri kaybına ve tutarsız yapıya yol açar.
Açıklama: İki thread aynı bucket'a aynı anda yazarsa birinin girdisi kaybolabilir; yeniden boyutlandırma sırasında yapı tutarsız kalabilir. Paylaşılan map için `ConcurrentHashMap` kullanılır ya da erişim bir kilitle korunur.
Etiketler: hashmap, race-condition, concurrency

## S70-03 · Doğru / Yanlış
Konu: synchronized
Soru: Bir nesnenin `synchronized` örnek metotlarını aynı anda yalnız bir thread çalıştırabilir; diğer thread'ler o nesnenin kilidini bekler.
Şıklar:
- [x] Doğru
  Neden: Doğru; `synchronized` örnek metotları aynı nesnenin monitor kilidini paylaşır.
- [ ] Yanlış
  Neden: Aynı nesnenin `synchronized` örnek metotları aynı kilidi kullandığı için birbirini dışlar.
İpucu: `synchronized` örnek metodu hangi nesnenin kilidini alır?
Kısa açıklama: Doğru. Aynı nesnenin `synchronized` örnek metotları aynı monitor kilidiyle birbirini dışlar.
Açıklama: `synchronized` örnek metodu `this` nesnesinin kilidini, `static synchronized` metot ise sınıf nesnesinin kilidini alır. Kilit karşılıklı dışlamanın yanında görünürlük de sağlar: kilidi bırakan thread'in yazdıkları, aynı kilidi sonra alan thread tarafından görülür. Kilitsiz (`synchronized` olmayan) metotlar bu kilidi beklemez.
Etiketler: synchronized, monitor, concurrency
