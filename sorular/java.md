<!-- Java soruları. Biçim için README.md içindeki "Soru ekleme ve düzenleme" bölümüne bakın. -->

# J01 · Kolay · Teori

Java’daki sekiz primitive veri tipini sayın. Her birinin hangi tür değerleri temsil ettiğini ve değişken tanımlama ile değer atama arasındaki farkı açıklayın.

## J01-01 · Çoklu seçim
Konu: Primitive tipler
Soru: Aşağıdakilerden Java'nın sekiz primitive tipinin tamamını ve yalnızca onları seçin.
Şıklar:
- [x] a: byte, short, int, long
  Neden: Dört işaretli tamsayı primitive tipidir.
- [x] b: float, double
  Neden: İki kayan noktalı primitive tipidir.
- [x] c: char, boolean
  Neden: Kalan iki primitive tiptir.
- [ ] d: String, BigDecimal
  Neden: İkisi de reference type'tır.
- [ ] e: Integer, Boolean
  Neden: Bunlar primitive tiplerin wrapper sınıflarıdır.
İpucu: Küçük harfle yazılan ve sınıf olmayan yerleşik değer tiplerini düşünün.
Kısa açıklama: Sekiz primitive tip byte, short, int, long, float, double, char ve boolean'dır.
Açıklama: İlk dört tip tamsayıları, float ve double kayan noktalı sayıları, char tek bir UTF-16 kod birimini, boolean ise true/false değerini temsil eder. String, BigDecimal ve wrapper tipleri sınıftır.
Varsayım: Java dilindeki yerleşik primitive tipler sorulmaktadır; void bir veri tipi olarak sayılmaz.
Etiketler: primitive, tipler

## J01-02 · Eşleştirme
Konu: Primitive tipler
Soru: Primitive tip gruplarını temsil ettikleri değerlerle eşleştirin.
Eşleşmeler:
- ints: byte / short / int / long => r1: İşaretli tamsayılar
- fp: float / double => r2: IEEE 754 kayan noktalı sayılar
- ch: char => r3: Tek bir UTF-16 kod birimi
- bool: boolean => r4: true veya false
Fazladan seçenekler:
- decoy: Değiştirilemez Unicode metin nesnesi
İpucu: char, kullanıcıya görünen her Unicode karakteri değil, 16 bitlik bir kod birimini tutar.
Kısa açıklama: Her primitive grubun temsil ettiği değer alanı farklıdır.
Açıklama: Java tamsayı primitive tipleri işaretlidir. float ve double IEEE 754 biçimindedir. char 16 bitlik unsigned bir UTF-16 code unit'tir; bazı Unicode karakterleri iki char gerektirir. boolean yalnızca true/false alır.
Varsayım: char açıklamasında Unicode code point değil UTF-16 code unit kastedilir.
Etiketler: primitive, unicode, değer-atama

# J02 · Kolay · Hata bulma

Aşağıdaki kod derlenir mi? Yerel değişkenlerle instance değişkenlerinin başlangıç değerleri arasındaki farkı açıklayın.

```java
class Demo {
    int field;

    void printValues() {
        int local;
        System.out.println(field);
        System.out.println(local);
    }
}
```

## J02-01 · Tek seçim
Konu: Değişken başlangıç değerleri
Soru: Bu sınıf olduğu gibi derlenmeye çalışıldığında ne olur?
Kod:
```java
class Demo {
    int field;

    void printValues() {
        int local;
        System.out.println(field);
        System.out.println(local);
    }
}
```
Şıklar:
- [ ] a: field ve local varsayılan değer aldığı için 0 ve 0 yazdırır
  Neden: Yalnız alanlar varsayılan değer alır; yerel local otomatik 0 olmaz.
- [ ] b: field satırında derleme hatası verir
  Neden: field bir instance alanıdır ve varsayılanı 0'dır.
- [x] c: local değişkeni başlatılmadığı için derleme hatası verir
  Neden: Doğru; definite assignment kontrolü derleme aşamasındadır.
- [ ] d: Kod derlenir, fakat local okunduğu anda çalışma zamanında NullPointerException oluşur
  Neden: Sorun derleme zamanındaki atama kontrolüdür; int primitive olduğu için NPE de söz konusu değildir.
İpucu: Alanlar ile yerel değişkenler için definite assignment kuralları aynı değildir.
Kısa açıklama: Instance alanı 0 alır; başlatılmamış yerel değişken okunamadığı için kod derlenmez.
Açıklama: int türündeki instance field, nesne oluşturulurken varsayılan olarak 0 yapılır. Yerel değişkenlere otomatik varsayılan değer verilmez; derleyici local'ın okunmadan önce kesin olarak atanmış olmasını ister.
Varsayım: Kodun tamamı javac ile derlenmektedir; printValues çağrılmasa bile metot gövdesi kontrol edilir.
Etiketler: local, field, derleme

## J02-02 · Doğru / Yanlış
Konu: Değişken başlangıç değerleri
Soru: Bir sınıfın açıkça değer atanmamış boolean instance alanı varsayılan olarak false değerini alır.
Şıklar:
- [x] Doğru
  Neden: Instance alanları türe özgü varsayılan değer alır.
- [ ] Yanlış
  Neden: false seçeneği, yerel değişken kuralıyla karıştırılmış olur.
İpucu: Nesne alanlarının sıfır değerlerini düşünün.
Kısa açıklama: Evet. boolean instance alanının varsayılan değeri false'tur.
Açıklama: Instance ve static alanlar türe özgü varsayılan değerle başlatılır: sayısal tiplerde sıfır, char için \u0000, boolean için false, reference tiplerde null. Bu kural yerel değişkenlere uygulanmaz.
Varsayım: Alan bir instance field'dır; local variable değildir.
Etiketler: field, boolean, varsayılan-değer

# J03 · Kolay · Kod okuma

Çıktıyı tahmin edin. Primitive ve reference type atamalarının sonuçlarını açıklayın.

```java
int a = 10;
int b = a;
b = 20;

int[] first = {1, 2};
int[] second = first;
second[0] = 99;

System.out.println(a);
System.out.println(first[0]);
```

## J03-01 · Kod çıktısı
Konu: Değer ve referans ataması
Soru: Kodun standart çıktısını satır sırasını koruyarak yazın.
Kod:
```java
int a = 10;
int b = a;
b = 20;

int[] first = {1, 2};
int[] second = first;
second[0] = 99;

System.out.println(a);
System.out.println(first[0]);
```
Cevap:
```
10
99
```
Büyük/küçük harf duyarlı: evet
İpucu: b kendi primitive kopyasını; second ise aynı diziye giden referans değerinin kopyasını alır.
Kısa açıklama: Çıktı 10 ve 99'dur.
Açıklama: b = a, 10 değerini kopyalar; b'nin sonradan 20 olması a'yı etkilemez. second = first ise aynı dizi nesnesine yönelen referans değerini kopyalar. second[0] üzerinden yapılan değişiklik first[0] ile de görünür.
Varsayım: Çıktı karşılaştırmasında satır sonu biçimi LF veya CRLF olabilir; satırların sırası değişmez.
Etiketler: primitive, reference, array, output

## J03-02 · Tek seçim
Konu: Değer ve referans ataması
Soru: `int[] second = first;` ifadesinin en doğru açıklaması hangisidir?
Şıklar:
- [ ] a: Dizinin elemanları yeni bir diziye derin kopyalanır; iki değişken bağımsız dizileri gösterir
  Neden: Java dizi atamasında otomatik kopya üretmez; iki değişken aynı diziyi gösterir.
- [x] b: Referans değeri kopyalanır; iki değişken aynı dizi nesnesini gösterebilir
  Neden: Doğru; aliasing oluşur.
- [ ] c: `first` null yapılır ve sahiplik `second`'a taşınır
  Neden: Java'da move semantics uygulanmaz.
- [ ] d: Dizi salt okunur hâle gelir; `second` üzerinden eleman değiştirmek derleme hatası verir
  Neden: Atama mutability'yi değiştirmez; `second[0] = 99` geçerlidir.
İpucu: Java ataması nesnenin sahipliğini taşımaz ve otomatik deep copy yapmaz.
Kısa açıklama: Kopyalanan şey referans değeridir; dizi nesnesi kopyalanmaz.
Açıklama: Her iki değişken de ayrı değişkenlerdir fakat içlerinde aynı heap nesnesine erişen referans değerleri bulunabilir. Bir değişken yeniden atanırsa diğeri değişmez; ortak nesne mutasyona uğrarsa değişiklik ikisinden de gözlenebilir.
Varsayım: `first` başlangıçta null olmayan bir `int[]` referansı tutar.
Etiketler: reference, aliasing, array

# J04 · Kolay · Teori

Primitive type ile reference type arasındaki farkları; saklanan değer, `null` alabilme, karşılaştırma ve metot çağrısı açısından açıklayın.

## J04-01 · Çoklu seçim
Konu: Primitive ve reference tipler
Soru: Primitive ve reference tipler hakkında doğru ifadeleri seçin.
Şıklar:
- [x] a: Bir primitive değişken primitive değerini doğrudan tutar
  Neden: Doğru primitive değer semantiğidir.
- [x] b: Bir reference değişken null tutabilir
  Neden: Doğru; null bir reference değeridir.
- [x] c: Primitive bir değerde örnek metodu doğrudan çağrılamaz
  Neden: Doğru; autoboxing ayrı bir dönüşüm bağlamıdır.
- [ ] d: İki reference değişkeni `==` ile karşılaştırmak her zaman içerik eşitliğini sınar
  Neden: Yanlış; `==` nesne kimliğini karşılaştırır.
- [ ] e: Her reference ataması nesnenin bağımsız kopyasını üretir
  Neden: Yanlış; yalnız referans değeri kopyalanır.
İpucu: `==` operatörünün reference operandlarda hangi değeri karşılaştırdığını düşünün.
Kısa açıklama: Primitive değer doğrudan tutulur; reference null olabilir ve bir nesneye erişim değeridir.
Açıklama: Primitive tipler dilce tanımlı yalın değerlerdir. Reference değişken, nesneye/diziye erişen bir referans veya null tutar. Reference operandlarda `==` çoğunlukla aynı nesne kimliğini sorgular; içerik semantiği uygun `equals` uygulamasına bağlıdır. Atama nesneyi kopyalamaz.
Varsayım: Wrapper autoboxing mekanizması, primitive üzerinde doğrudan örnek metodu çağrıldığı anlamına gelmez.
Etiketler: primitive, reference, null, equals

## J04-02 · Eşleştirme
Konu: Primitive ve reference tipler
Soru: İşlemleri tip kategorisindeki temel anlamlarıyla eşleştirin.
Eşleşmeler:
- passign: Primitive ataması => r1: Primitive değeri kopyalar
- rassign: Reference ataması => r2: Referans değerini kopyalar
- peq: int değerlerinde == => r3: Sayısal değer eşitliğini sınar
- req: Nesne referanslarında == => r4: Aynı nesne/null kimliğini sınar
Fazladan seçenekler:
- decoy: Nesnelerin alan değerlerini karşılaştırır
İpucu: Atama her iki durumda da değişkendeki değeri kopyalar; değerin türü farklıdır.
Kısa açıklama: Primitive ataması primitive değeri, reference ataması referans değerini kopyalar.
Açıklama: Reference atamasında hedef nesnenin klonu oluşturulmaz. int için == sayısal değeri karşılaştırır. İki nesne referansında ==, iki referansın aynı nesneyi göstermesini veya ikisinin de null olmasını sınar.
Varsayım: Reference karşılaştırmasında boxing veya String pool gibi ek dönüşüm örnekleri yoktur.
Etiketler: atama, karşılaştırma, reference

# J05 · Kolay · Kod okuma

Aşağıdaki ifadelerin sonucunu ve sonuç tipini belirtin.

```java
int a = 7;
int b = 2;

System.out.println(a / b);
System.out.println(a % b);
System.out.println((double) a / b);
```

## J05-01 · Kod çıktısı
Konu: Aritmetik operatörler ve cast
Soru: Kodun standart çıktısını yazın.
Kod:
```java
int a = 7;
int b = 2;

System.out.println(a / b);
System.out.println(a % b);
System.out.println((double) a / b);
```
Cevap:
```
3
1
3.5
```
Büyük/küçük harf duyarlı: evet
İpucu: İlk bölmede her iki operand int; son bölmede operandlardan biri double'dır.
Kısa açıklama: Çıktı sırasıyla 3, 1 ve 3.5'tir.
Açıklama: int / int işlemi sıfıra doğru kesilen tamsayı bölmesidir: 7/2 = 3. Kalan 1'dir. a önce double'a çevrilince ikili sayısal yükseltme b'yi de double yapar ve sonuç 3.5 olur.
Varsayım: Ondalık ayırıcı Java'nın Double.toString çıktısındaki noktadır; locale biçimleme yapılmaz.
Etiketler: division, modulo, casting, output

## J05-02 · Tek seçim
Konu: Aritmetik operatörler ve cast
Soru: 7 ve 2 değerleriyle 3.5 sonucunu üreten ifade hangisidir?
Kod:
```java
int a = 7;
int b = 2;
```
Şıklar:
- [ ] a: (double) (a / b)
  Neden: Tamsayı bölme kaybı cast'ten önce gerçekleşir.
- [x] b: (double) a / b
  Neden: Doğru; bölmenin bir operandı double olur.
- [ ] c: a / b
  Neden: Sonuç int 3'tür.
- [ ] d: (int) ((double) a / b)
  Neden: Son cast sonucu tekrar int 3'e keser.
İpucu: Cast bölmeden önce operandlardan birine uygulanmalı.
Kısa açıklama: `(double) a / b` kayan noktalı bölme yapar.
Açıklama: `(double)(a / b)` ifadesinde tamsayı bölmesi önce 3 üretir, sonra 3.0'a çevrilir. `(double) a / b` ise bölme öncesinde a'yı double yapar ve 3.5 üretir.
Varsayım: a ve b int, b sıfır değildir.
Etiketler: cast, division, precedence

# J06 · Kolay · Kod okuma

Prefix ve postfix artırma operatörlerinin farkını açıklayın.

```java
int x = 5;
int y = x++;
int z = ++x;

System.out.println(x + " " + y + " " + z);
```

## J06-01 · Kod çıktısı
Konu: Artırma operatörleri
Soru: Kodun çıktısını tek satır olarak yazın.
Kod:
```java
int x = 5;
int y = x++;
int z = ++x;

System.out.println(x + " " + y + " " + z);
```
Cevap: 7 5 7
Büyük/küçük harf duyarlı: evet
İpucu: Postfix eski değeri üretip sonra artırır; prefix önce artırır.
Kısa açıklama: Çıktı `7 5 7` olur.
Açıklama: `y = x++` sırasında `y` 5 alır ve `x` 6 olur. `z = ++x` sırasında `x` önce 7 olur, ifade 7 üretir ve `z` 7 alır.
Varsayım: İfadeler verilen sırayla ayrı statement olarak çalışır; overflow yoktur.
Etiketler: prefix, postfix, output

## J06-02 · Sıralama
Konu: Artırma operatörleri
Soru: `int y = x++;` statement'ında x başlangıçta 5 iken gerçekleşen adımları sıraya koyun.
Sıra:
1. read: İfadenin değeri olarak x'in eski değeri 5 üretilir
2. inc: x bir artırılarak 6 yapılır
3. assign: Üretilen 5 değeri y'ye atanır
İpucu: Postfix ifadenin ürettiği değer eskidir; statement bittiğinde x artmıştır.
Kısa açıklama: Eski değer yakalanır, x artırılır; atama hedefi eski değeri alır.
Açıklama: Java'nın değerlendirme modelinde postfix increment ifadesi x'in eski değerini üretirken x'i artırma yan etkisini de tamamlar. Sağ tarafın ürettiği eski değer daha sonra basit atamayla y'ye saklanır; sonuç y=5 ve x=6'dır.
Varsayım: Adımlar Java expression değerlendirme sırasını temsil eder: sağ taraftaki postfix işlem, y'ye atama tamamlanmadan değerlendirilir.
Etiketler: postfix, evaluation, order

# J07 · Kolay · Kod okuma

Aşağıdaki koşul neden güvenlidir? `&&` yerine `&` kullanılırsa ne değişebilir?

```java
String username = null;

if (username != null && username.length() >= 3) {
    System.out.println("Geçerli");
}
```

## J07-01 · Doğru / Yanlış
Konu: Kısa devreli mantıksal işleçler
Soru: username null iken bu koşul, `&&` iki operandı da değerlendirdiği için NullPointerException üretir.
Kod:
```java
String username = null;
if (username != null && username.length() >= 3) {
    System.out.println("Geçerli");
}
```
Şıklar:
- [ ] Doğru
  Neden: Sağ taraf yalnız sol taraf true ise değerlendirilir; NPE oluşmaz.
- [x] Yanlış
  Neden: Doğru; `&&` kısa devre yaptığı için null guard güvenlidir.
İpucu: `&&` sol operand false olduğunda ne yapar?
Kısa açıklama: Yanlış. `&&` kısa devre yapar; sol taraf false olunca sağ operand değerlendirilmez ve NPE oluşmaz.
Açıklama: Sol operand `username != null` false olunca `&&` sonucunun false olduğu kesinleşir ve sağ operand çalıştırılmaz. Böylece null üzerinde `length()` çağrılmaz.
Varsayım: `username` gerçekten null'dır ve arada başka bir thread tarafından değiştirilen ortak alan değildir; verilen yerel değişken kullanılır.
Etiketler: short-circuit, null, and

## J07-02 · Tek seçim
Konu: Kısa devreli mantıksal işleçler
Soru: Aynı kodda `&&` yerine boolean `&` kullanılırsa username null iken ne olur?
Şıklar:
- [ ] a: Koşul güvenle false olur; davranış değişmez
  Neden: & sağ operandı atlamaz.
- [x] b: Sağ operand da değerlendirilir ve NullPointerException oluşur
  Neden: Doğru; hata length çağrısında oluşur.
- [ ] c: Kod `&` booleanlarla kullanılamadığı için derlenmez
  Neden: & boolean operandlarla geçerlidir.
- [ ] d: username otomatik olarak boş String'e çevrilir
  Neden: Java null reference'ı otomatik boş String yapmaz.
İpucu: Boolean `&`, iki operandı da değerlendirir.
Kısa açıklama: `&` kısa devre yapmaz; null üzerinde length çağrısı NPE üretir.
Açıklama: Java'da & hem bit düzeyinde sayısal işlem hem de boolean AND olarak kullanılabilir. Boolean kullanımında iki operand da değerlendirilir; bu yüzden null guard sağ tarafı korumaz.
Varsayım: İfade boolean `&` olarak uygulanır; username null'dır.
Etiketler: short-circuit, bitwise-and, npe

# J08 · Kolay · Kod yazma

Bir öğrencinin notunu alan ve `0–49`, `50–69`, `70–84`, `85–100` aralıklarına göre sonuç metni döndüren bir metot yazın. `0`–`100` dışındaki değerleri de ele alın.

## J08-01 · Eşleştirme
Konu: Koşullu sınıflandırma
Soru: Not aralıklarını metodun döndürmesi gereken sonuçla eşleştirin. Sonuç etiketleri bu kartta tanımlandığı gibidir.
Eşleşmeler:
- invalid: not < 0 veya not > 100 => r0: Geçersiz
- fail: 0–49 => r1: Başarısız
- pass: 50–69 => r2: Geçer
- good: 70–84 => r3: İyi
- excellent: 85–100 => r4: Pekiyi
Fazladan seçenekler:
- decoy: Orta
İpucu: Sınırlar kapsayıcıdır; önce geçersiz aralığı ayırın.
Kısa açıklama: Her geçerli not tam bir aralığa, dışarıdaki değerler Geçersiz'e gider.
Açıklama: Aralıkların çakışmaması ve 0 ile 100 dahil tüm geçerli int değerlerini kapsaması gerekir. Guard clause ile `<0 || >100` önce ele alınabilir; kalan eşikler artan veya azalan sırada test edilir.
Varsayım: Girdi int'tir; ondalık, null veya parse hatası bu metodun kapsamında değildir.
Varsayım: Aralık uçları dahildir.
Etiketler: if-else, range, validation

## J08-02 · Tek seçim
Konu: Koşullu sınıflandırma
Soru: Aşağıdaki metotta `gradeResult(85)` ne döndürür?
Kod:
```java
static String gradeResult(int grade) {
    if (grade < 0 || grade > 100) return "Geçersiz";
    if (grade < 50) return "Başarısız";
    if (grade < 70) return "Geçer";
    if (grade < 85) return "İyi";
    return "Pekiyi";
}
```
Şıklar:
- [ ] a: Geçersiz
  Neden: 85 geçerli aralıktadır.
- [ ] b: Geçer
  Neden: Geçer 50–69 içindir.
- [ ] c: İyi
  Neden: İyi aralığı 84'te biter.
- [x] d: Pekiyi
  Neden: Doğru; 85–100 Pekiyi'dir.
İpucu: `grade < 85` sınaması 85 için false'tur.
Kısa açıklama: 85, Pekiyi aralığının alt sınırıdır.
Açıklama: 85 geçerlidir; 50, 70 ve 85'ten küçük değildir. Son return çalışır. Bu sıralama 0–49, 50–69, 70–84 ve 85–100 aralıklarını tam olarak oluşturur.
Varsayım: Aralıklar kaynak soruda verildiği gibi uçları dahil olacak şekilde yorumlanır.
Etiketler: if-else, boundary, method

# J09 · Kolay · Kod okuma

Çıktıyı tahmin edin ve `break` kullanılmayan `switch` bloklarının davranışını açıklayın.

```java
int day = 2;

switch (day) {
    case 1:
        System.out.print("Pazartesi ");
    case 2:
        System.out.print("Salı ");
    case 3:
        System.out.print("Çarşamba ");
        break;
    default:
        System.out.print("Geçersiz");
}
```

## J09-01 · Kod çıktısı
Konu: switch fall-through
Soru: Kodun standart çıktısını yazın.
Kod:
```java
int day = 2;
switch (day) {
    case 1: System.out.print("Pazartesi " );
    case 2: System.out.print("Salı " );
    case 3: System.out.print("Çarşamba " ); break;
    default: System.out.print("Geçersiz");
}
```
Cevap: Salı Çarşamba
Büyük/küçük harf duyarlı: evet
İpucu: Eşleşen case 2'den sonra break görülene kadar akış sürer.
Kısa açıklama: `Salı Çarşamba` yazdırılır.
Açıklama: Kontrol doğrudan case 2 etiketine gider. case 2 sonunda break olmadığı için case 3 gövdesine düşer; case 3 sonundaki break switch'i bitirir. case 1 ve default çalışmaz.
Varsayım: Çıktının sağ kenarındaki tek boşluk puanlamada önemsizdir; kelime ve sıra korunur.
Etiketler: switch, fall-through, break, output

## J09-02 · Sıralama
Konu: switch fall-through
Soru: day = 2 için switch içindeki olayları gerçekleşme sırasına koyun.
Sıra:
1. jump: case 2 etiketiyle eşleşilir
2. tue: Salı yazdırılır
3. wed: break olmadığı için case 3'e düşülür ve Çarşamba yazdırılır
4. stop: break switch'i sonlandırır
İpucu: case etiketleri otomatik blok sınırı değildir.
Kısa açıklama: Eşleşme case 2'ye atlar, case 3'e fall-through olur, break'te biter.
Açıklama: switch önce seçiciyi hesaplar ve eşleşen etikete aktarır. Sonraki case etiketi yürütmeyi kendiliğinden kesmez. Bu nedenle case 3 gövdesi çalışır; açık break akışı switch sonrasına taşır.
Varsayım: Klasik Java switch statement kullanılmaktadır; Java 14+ switch expression okları yoktur.
Etiketler: switch, control-flow, order

# J10 · Kolay · Kod okuma

Döngünün hangi sayıları yazdıracağını bulun. `continue` ve `break` arasındaki farkı açıklayın.

```java
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue;
    }
    if (i > 6) {
        break;
    }
    System.out.print(i + " ");
}
```

## J10-01 · Kod çıktısı
Konu: Döngü kontrolü
Soru: Kodun çıktısını yazın.
Kod:
```java
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) continue;
    if (i > 6) break;
    System.out.print(i + " " );
}
```
Cevap: 1 3 5
Büyük/küçük harf duyarlı: evet
İpucu: Çift sayılar continue ile atlanır; 6'dan büyük ilk tek sayı döngüyü bitirir.
Kısa açıklama: 1, 3 ve 5 yazdırılır.
Açıklama: 0,2,4,6 ve çift değerler continue nedeniyle kalan gövdeyi atlar. Tek 1,3,5 yazdırılır. i=7 olduğunda ilk koşul false, ikinci koşul true olur ve break döngüyü bitirir.
Varsayım: Çıktı kenarındaki boşluk yok sayılır; sayılar ve sıraları birebir korunur.
Etiketler: for, continue, break, output

## J10-02 · Eşleştirme
Konu: Döngü kontrolü
Soru: Döngü anahtar sözcüklerini etkileriyle eşleştirin.
Eşleşmeler:
- continue: continue => r1: Geçerli iterasyonun kalanını atlayıp sonraki iterasyona geçer
- break: break => r2: En yakın döngüyü tamamen sonlandırır
Fazladan seçenekler:
- decoy: Metottan çıkıp çağırana değer döndürür
İpucu: Biri yalnız mevcut turu, diğeri tüm döngüyü bırakır.
Kısa açıklama: continue iterasyonu; break döngüyü terk eder.
Açıklama: Etiketsiz continue en yakın döngünün update/condition aşamasına yönelir. Etiketsiz break en yakın switch veya döngünün sonrasına geçer. Etiketli biçimler bu kartın kapsamı dışındadır.
Varsayım: Etiketsiz continue ve break kullanımı sorulmaktadır.
Etiketler: continue, break, control-flow

# J11 · Kolay · Hata bulma

Sorunu bulun ve düzeltin.

```java
int[] numbers = {10, 20, 30};

for (int i = 0; i <= numbers.length; i++) {
    System.out.println(numbers[i]);
}
```

## J11-01 · Tek seçim
Konu: Dizi sınırları
Soru: Tüm elemanları hata vermeden yazdırmak için döngü koşulundaki en küçük doğru düzeltme hangisidir?
Kod:
```java
int[] numbers = {10, 20, 30};
for (int i = 0; i <= numbers.length; i++) {
    System.out.println(numbers[i]);
}
```
Şıklar:
- [x] a: Koşulu `i <= numbers.length` yerine `i < numbers.length` yapmak
  Neden: Doğru; 0'dan `length - 1`'e kadar çalışır.
- [ ] b: Koşulu koruyup döngüyü try-catch ile sarmak ve oluşan hatayı yutmak
  Neden: Hata gizlenir ama `numbers[3]` erişimi yine yapılır; bu bir düzeltme değildir.
- [ ] c: Koşulu `i < numbers.length + 1` yaparak son elemanı da kapsamak
  Neden: `i < length + 1`, `i <= length` ile aynıdır; `numbers[3]` erişimi sürer.
- [ ] d: `i` başlangıcını `-1` yapmak
  Neden: İlk erişimi `numbers[-1]` yapar.
İpucu: Son geçerli indeks `length - 1`'dir.
Kısa açıklama: Koşul `i < numbers.length` olmalıdır.
Açıklama: Üç elemanlı dizinin geçerli indeksleri 0,1,2'dir. `i = 3` olduğunda `i <= length` hâlâ true olur fakat `numbers[3]` erişimi sınır dışıdır. `i < length` standart üst sınırdır.
Varsayım: Dizi null değildir; amaç ileri yönde tüm elemanları bir kez dolaşmaktır.
Etiketler: array, index, off-by-one

## J11-02 · Boşluk doldurma
Konu: Dizi sınırları
Soru: Verilen hatalı döngüde ilk geçersiz dizi indeksini yalnız sayı olarak yazın.
Kod:
```java
int[] numbers = {10, 20, 30};
for (int i = 0; i <= numbers.length; i++) {
    System.out.println(numbers[i]);
}
```
Cevap: 3
Kabul: 03
İpucu: length 3; indeksler sıfırdan başlar.
Kısa açıklama: İlk geçersiz indeks 3'tür.
Açıklama: Geçerli indeks kümesi [0, length) aralığıdır. length=3 için 0,1,2 geçerli; 3 ise ArrayIndexOutOfBoundsException üretir.
Varsayım: Ondalık olmayan int gösterimi beklenir; çevresel boşluklar normalleştirilir.
Etiketler: array, index, exception, fill

# J12 · Kolay · Kod yazma

İki `int` parametre alan ve büyük olan değeri döndüren `max` metodunu yazın. Metot imzasını oluşturan parçaları açıklayın.

## J12-01 · Tek seçim
Konu: Metot tanımlama
Soru: İki int parametreden büyük olanı döndüren geçerli metot hangisidir? Eşitlikte aynı değer döndürülebilir.
Şıklar:
- [x] a: static int max(int a, int b) { return a >= b ? a : b; }
  Neden: Doğru ve tüm int değerlerinde taşmasız karşılaştırır.
- [ ] b: static void max(int a, int b) { return a >= b ? a : b; }
  Neden: void metot değer döndüremez.
- [ ] c: static int max(int a, int b) { System.out.println(a > b); }
  Neden: int dönüşü eksiktir.
- [ ] d: static int max(int a; int b) { return a + b; }
  Neden: Parametre ayırıcı sözdizimi yanlış, gövde de maksimumu bulmuyor.
İpucu: Dönüş tipi int olmalı ve iki parametre virgülle ayrılmalı.
Kısa açıklama: A seçeneği geçerli imza ve doğru karşılaştırmayı içerir.
Açıklama: Metot int döndürdüğünü bildirdiği için her normal akışta int ifade return etmelidir. Parametreler virgülle ayrılır. Ternary ifade a ve b'den büyük olanı seçer; eşitlikte a'yı döndürmek gereksinimi karşılar.
Varsayım: Math.max kullanma zorunluluğu yoktur; int karşılaştırmasında taşma oluşmaz.
Etiketler: method, return, max

## J12-02 · Eşleştirme
Konu: Metot tanımlama
Soru: Metot bildirimindeki parçaları görevleriyle eşleştirin.
Kod:
```java
public static int max(int a, int b) { return a >= b ? a : b; }
```
Eşleşmeler:
- public: public => r1: Erişim belirleyici
- static: static => r2: Sınıf üyesi olduğunu belirten modifier
- intret: max önündeki int => r3: Dönüş tipi
- max: max => r4: Metot adı
- params: (int a, int b) => r5: Parametre listesi
Fazladan seçenekler:
- decoy: Fırlatılabilecek checked exception listesi
İpucu: Bildirim; modifier'lar, dönüş tipi, ad ve parametrelerden oluşur.
Kısa açıklama: Her sözdizim parçası erişim, bağlanma, dönüş veya çağrı sözleşmesine katkı verir.
Açıklama: public erişimi, static üyenin örnek gerektirmediğini, int dönüş değerinin türünü, max adı ve parantez içi parametreleri tanımlar. JLS anlamında metot imzası ise ad ile parametre tiplerinden oluşur; dönüş tipi imzaya dahil değildir.
Varsayım: 'Metot bildirimi parçaları' ile JLS'teki dar 'method signature' terimi ayrıştırılır.
Etiketler: method, signature, modifier

## J12-03 · Çoklu seçim
Konu: Metot imzası
Soru: JLS anlamında `max(int a, int b)` metodunun imzasına dahil olan öğeleri seçin.
Şıklar:
- [x] a: Metot adı: max
  Neden: İmzanın parçasıdır.
- [x] b: Parametre tipleri: int, int
  Neden: Sıralarıyla imzanın parçasıdır.
- [ ] c: Dönüş tipi: int
  Neden: İmzaya dahil değildir.
- [ ] d: Erişim belirleyici: public
  Neden: Modifier imzaya dahil değildir.
- [ ] e: Parametre adları: a, b
  Neden: Parametre isimleri çağrı çözümlemesine katılmaz.
İpucu: Overload çözümlemesinde dönüş tipi veya parametre adı kullanılmaz.
Kısa açıklama: Metot imzası adı ve uyarlanmış type parameter/parameter tiplerini kapsar.
Açıklama: Bu temel örnekte imza `max(int,int)` olarak düşünülebilir. Dönüş tipi, erişim modifier'ı ve parametre değişken adları imzanın parçası değildir; yalnız dönüş tipini değiştirerek overload yapılamamasının nedeni de budur.
Varsayım: Generic substitution ayrıntısı olmayan basit bir Java metodu sorulmaktadır.
Etiketler: method-signature, overload, jls

# J13 · Kolay · Kod okuma

Çağrıdan sonra `a` ve `b` değerlerini tahmin edin. Java’nın parametre geçirme modelini açıklayın.

```java
static void swap(int x, int y) {
    int temp = x;
    x = y;
    y = temp;
}

int a = 3;
int b = 8;
swap(a, b);

System.out.println(a + " " + b);
```

## J13-01 · Kod çıktısı
Konu: Parametre geçirme
Soru: Kodun çıktısını yazın.
Kod:
```java
static void swap(int x, int y) {
    int temp = x; x = y; y = temp;
}
int a = 3;
int b = 8;
swap(a, b);
System.out.println(a + " " + b);
```
Cevap: 3 8
Büyük/küçük harf duyarlı: evet
İpucu: x ve y, a ve b'nin değerlerinin ayrı kopyalarıdır.
Kısa açıklama: Çıktı `3 8` olur.
Açıklama: Java parametreleri her zaman by value geçirir. Primitive argümanların değerleri x ve y'ye kopyalanır. Metot yalnız bu yerel kopyaları değiştirir; çağıranın a ve b değişkenleri yeniden atanmaz.
Varsayım: Kod bir metot gövdesi gibi geçerli bir çevrede çalıştırılır.
Etiketler: pass-by-value, swap, primitive, output

## J13-02 · Tek seçim
Konu: Parametre geçirme
Soru: Java'nın parametre geçirme modelini en doğru açıklayan ifade hangisidir?
Şıklar:
- [ ] a: Primitive'ler by value, nesneler by reference geçirilir
  Neden: Yaygın ama teknik olarak yanlış ifadedir.
- [x] b: Her argüman by value geçirilir; nesnelerde kopyalanan değer referanstır
  Neden: Doğru modeldir.
- [ ] c: Her argüman by reference geçirilir
  Neden: Çağıran değişkenler doğrudan alias edilmez.
- [ ] d: Metot, çağıranın reference değişkenini doğrudan yeniden atayabilir
  Neden: Parametre yalnız kendi yerel kopyasını yeniden atar.
İpucu: Bir nesne parametresi içinde mutasyon görülebilir ama parametrenin yeniden atanması çağıranı değiştirmez.
Kısa açıklama: Java yalnız pass-by-value kullanır.
Açıklama: Reference type argümanda da değişkenin tuttuğu referans değeri kopyalanır. Kopya aynı nesneye eriştiği için nesne mutasyonu görünür; fakat parametreyi başka nesneye veya null'a atamak çağıranın değişkenini değiştirmez.
Varsayım: JNI gibi dil dışı mekanizmalar değil, Java dilindeki normal metot çağrısı sorulur.
Etiketler: pass-by-value, reference, parameters

# J14 · Kolay · Kod okuma

Sonucu tahmin edin ve `String` nesnelerinin immutable olmasıyla ilişkilendirin.

```java
String text = "Java";
text.concat(" Mülakatı");

System.out.println(text);
```

## J14-01 · Kod çıktısı
Konu: String immutability
Soru: Kodun çıktısını yazın.
Kod:
```java
String text = "Java";
text.concat(" Mülakatı");
System.out.println(text);
```
Cevap: Java
Büyük/küçük harf duyarlı: evet
İpucu: concat mevcut String'i değiştirmez; yeni bir sonuç döndürür.
Kısa açıklama: `Java` yazdırılır.
Açıklama: String immutable'dır. concat, içerik eklenmiş yeni bir String döndürür; dönüş değeri atanmadığı için text hâlâ başlangıçtaki `Java` nesnesini gösterir.
Varsayım: Standart java.lang.String.concat davranışı kullanılır; text null değildir.
Etiketler: string, immutable, concat, output

## J14-02 · Tek seçim
Konu: String immutability
Soru: `text` değişkeninin `Java Mülakatı` metnini göstermesini sağlayan en doğrudan düzeltme hangisidir?
Kod:
```java
String text = "Java";
```
Şıklar:
- [ ] a: `text.concat(" Mülakatı");`
  Neden: Dönüş değeri kaybolur.
- [x] b: `text = text.concat(" Mülakatı");`
  Neden: Doğru; yeni String saklanır.
- [ ] c: `text[4] = ' ';`
  Neden: String dizi değildir ve immutable'dır.
- [ ] d: `String.concat(text, " Mülakatı");`
  Neden: `concat` static metot değildir.
İpucu: Dönen yeni String referansını saklayın.
Kısa açıklama: `concat` sonucunun `text`'e yeniden atanması gerekir.
Açıklama: String'in içeriği yerinde değiştirilemez. `concat` çağrısının ürettiği yeni String referansı `text`'e atanırsa sonraki okumalar birleşik metni görür.
Varsayım: Amaç değişkeni yeni String sonucuna yeniden atamaktır; aynı nesneyi mutasyona uğratmak mümkün değildir.
Etiketler: string, concat, assignment

# J15 · Kolay · Kod okuma

Karşılaştırmaların sonuçlarını tahmin edin. `==` ve `equals()` arasındaki farkı açıklayın.

```java
String first = new String("java");
String second = new String("java");

System.out.println(first == second);
System.out.println(first.equals(second));
```

## J15-01 · Kod çıktısı
Konu: String karşılaştırma
Soru: Kodun çıktısını satır sırasıyla yazın.
Kod:
```java
String first = new String("java");
String second = new String("java");
System.out.println(first == second);
System.out.println(first.equals(second));
```
Cevap:
```
false
true
```
İpucu: `new String` iki ayrı nesne üretir; içerikleri aynıdır.
Kısa açıklama: `==` false, `equals` true üretir.
Açıklama: Her `new String` ayrı nesne kimliği oluşturur; bu yüzden referans kimliği karşılaştıran `==` false'tur. `String.equals` karakter dizisini karşılaştırır ve aynı içerik nedeniyle true döner.
Varsayım: `String.equals` override'ı kullanılır; iki değişken de null değildir.
Etiketler: string, equals, identity, output

## J15-02 · Çoklu seçim
Konu: String karşılaştırma
Soru: String karşılaştırması hakkında doğru ifadeleri seçin.
Şıklar:
- [x] a: `a == b`, iki referansın aynı nesneyi gösterip göstermediğini sınar
  Neden: Doğru reference kimliği semantiğidir.
- [x] b: `a.equals(b)`, `a` null değilse içerik eşitliğini sınar
  Neden: Doğru; alıcı null değil varsayımı önemlidir.
- [ ] c: String literal pool nedeniyle String içerikleri her zaman `==` ile güvenle karşılaştırılabilir
  Neden: Yanlış; `new String` ve runtime üretimleri özdeş olmayabilir.
- [x] d: `Objects.equals(a, b)` null-safe içerik eşitliği sağlayabilir
  Neden: Doğru null-safe yardımcıdır.
- [ ] e: `equals` her sınıfta otomatik olarak alan bazlı derin karşılaştırma yapar
  Neden: `Object.equals` varsayılanı kimliktir; sınıflar override etmelidir.
İpucu: String pool bir optimizasyon/özdeşleştirme ayrıntısıdır; genel içerik sözleşmesi değildir.
Kısa açıklama: Kimlik için `==`, String içeriği için `equals`; null güvenliği için `Objects.equals` kullanılabilir.
Açıklama: `String.equals` içerik karşılaştıracak şekilde override edilmiştir. Ancak `a.equals(b)` a null ise NPE verir; `Objects.equals` bunu güvenli ele alır. `==` yalnız aynı referans değerini sınar ve literal intern durumuna güvenmek hatalıdır.
Varsayım: `a` ve `b` String reference'larıdır; `b` null olabilir, `a` için ilgili seçenekte null olmadığı belirtilmiştir.
Etiketler: string, equals, objects-equals, null

# J16 · Kolay · Kod yazma

`{"Java", "OOP", "Algoritma"}` dizisini `StringBuilder` kullanarak virgülle ayrılmış tek bir metne dönüştürün. `StringBuilder` tercihinin gerekçesini açıklamaya hazırlanın.

## J16-01 · Tek seçim
Konu: StringBuilder
Soru: Diziyi tam olarak `Java,OOP,Algoritma` metnine dönüştüren, sonda fazladan virgül bırakmayan çözüm hangisidir?
Kod:
```java
String[] topics = {"Java", "OOP", "Algoritma"};
```
Şıklar:
- [ ] a: `StringBuilder sb = new StringBuilder(); for (String s : topics) sb.append(s).append(','); return sb.toString();`
  Neden: Sonuçta fazladan son virgül vardır.
- [x] b: `StringBuilder sb = new StringBuilder(); for (int i=0; i<topics.length; i++) { if (i>0) sb.append(','); sb.append(topics[i]); } return sb.toString();`
  Neden: Doğru ve boş diziyi de ele alır.
- [ ] c: `StringBuilder sb = null; for (String s : topics) sb.append(s); return sb.toString();`
  Neden: İlk `append` NullPointerException üretir.
- [ ] d: `StringBuilder sb = new StringBuilder(); for (int i=0; i<topics.length; i++) { sb.append(topics[i]); if (i>0) sb.append(','); } return sb.toString();`
  Neden: Virgül elemandan sonra eklendiği için ilk ayraç kaybolur ve sonda fazladan virgül kalır.
İpucu: Ayırıcıyı ilk elemandan önce değil, sonraki elemanlardan önce ekleyin.
Kısa açıklama: B seçeneği elemanlar arasına virgül koyar ve sonda ayırıcı bırakmaz.
Açıklama: Tek bir StringBuilder oluşturulur. `i>0` koşulu yalnız ikinci ve sonraki elemanlardan önce virgül ekler. Boş dizi için de güvenle boş String üretir. A sonda virgül bırakır, C null dereference eder, d dizi içeriğini birleştirmez.
Varsayım: topics null değildir; elemanların null olması hâlinde StringBuilder `null` metnini ekler, ancak verilen dizi null eleman içermez.
Etiketler: stringbuilder, array, join

## J16-02 · Doğru / Yanlış
Konu: StringBuilder
Soru: Bir döngüde çok sayıda metin parçası biriktirirken StringBuilder kullanmak, her turda `result = result + part` ile yeni immutable String'ler üretmekten genellikle daha az ara nesne oluşturur.
Şıklar:
- [x] Doğru
  Neden: Tipik döngüsel biriktirmede doğru performans gerekçesidir.
- [ ] Yanlış
  Neden: String immutability nedeniyle tekrar atamalı birleştirme ara sonuçlar üretir.
İpucu: String immutable, StringBuilder mutable bir karakter tamponudur.
Kısa açıklama: Doğru. StringBuilder aynı tamponu büyüterek ara String sayısını azaltır.
Açıklama: String birleştirme tek bir expression içinde derleyici tarafından StringBuilder'a çevrilebilir; ancak bir döngü boyunca biriken String'i tekrar tekrar + ile atamak her turda yeni sonuçlar üretir ve toplam kopyalama maliyetini büyütebilir. StringBuilder bu kullanım için tasarlanmıştır.
Varsayım: Performans iddiası tipik çok parçalı döngü içindir; JVM optimizasyonlarının her özel durumda aynı sonucu vereceği garanti edilmez.
Etiketler: stringbuilder, performance, immutability

# J17 · Kolay · Kod okuma

Enhanced `for` döngüsünden sonra dizi değişir mi?

```java
int[] numbers = {1, 2, 3};

for (int number : numbers) {
    number *= 2;
}

System.out.println(Arrays.toString(numbers));
```

## J17-01 · Kod çıktısı
Konu: Enhanced for
Soru: Kodun çıktısını yazın.
Kod:
```java
int[] numbers = {1, 2, 3};
for (int number : numbers) {
    number *= 2;
}
System.out.println(Arrays.toString(numbers));
```
Cevap: [1, 2, 3]
Büyük/küçük harf duyarlı: evet
İpucu: number her turda dizi elemanının primitive değer kopyasıdır.
Kısa açıklama: Dizi değişmez; `[1, 2, 3]` yazdırılır.
Açıklama: Enhanced for, her int elemanın değerini number yerel değişkenine kopyalar. number'ı ikiyle çarpmak dizi yuvasına geri yazmaz. Diziyi değiştirmek için indeksle `numbers[i] *= 2` yapılmalıdır.
Varsayım: java.util.Arrays import edilmiştir; int taşması bu küçük değerlerde yoktur.
Etiketler: enhanced-for, array, primitive, output

## J17-02 · Tek seçim
Konu: Enhanced for
Soru: Dizinin her elemanını gerçekten ikiyle çarpan çözüm hangisidir?
Kod:
```java
int[] numbers = {1, 2, 3};
```
Şıklar:
- [ ] a: `for (int n : numbers) n *= 2;`
  Neden: Yalnız yerel kopyayı değiştirir.
- [x] b: `for (int i=0; i<numbers.length; i++) numbers[i] *= 2;`
  Neden: Doğru; her dizi hücresine geri yazar.
- [ ] c: `for (int n : numbers) numbers = new int[]{n * 2};`
  Neden: Her turda tüm dizi referansını tek elemanlı başka diziye atar.
- [ ] d: `for (int i=0; i<numbers.length; i++) { int n = numbers[i]; n *= 2; }`
  Neden: Yalnız yerel `n` değişir; değer dizi elemanına geri yazılmaz.
İpucu: Dizi hücresine yazmak için indeks gerekir.
Kısa açıklama: B seçeneği her `numbers[i]` yuvasını günceller.
Açıklama: Primitive enhanced-for değişkeni elemanın kopyasıdır. İndeks tabanlı döngü doğrudan dizi elemanına atama yapar. `length` sabittir ve atanamaz.
Varsayım: Her çarpım int aralığında kalır; taşma beklenmez.
Etiketler: array, loop, mutation

# J18 · Kolay · Teori

`public`, `protected`, package-private ve `private` erişim seviyelerini aynı sınıf, aynı paket, alt sınıf ve farklı paket açısından karşılaştırın.

## J18-01 · Eşleştirme
Konu: Erişim belirleyiciler
Soru: Üye erişim seviyelerini en geniş genel erişim tanımlarıyla eşleştirin.
Eşleşmeler:
- pub: public => r1: Her pakette erişilebilir
- pro: protected => r2: Aynı paket ve ayrıca farklı pakette uygun alt sınıf erişimi
- pkg: package-private (modifier yok) => r3: Yalnız aynı paket
- pri: private => r4: Yalnız bildiren top-level sınıfın gövdesi kapsamındaki erişimler
Fazladan seçenekler:
- decoy: Yalnız alt sınıflar; aynı paketteki diğer sınıflar erişemez
İpucu: protected, package erişimine ek olarak kalıtım bağlamı sağlar.
Kısa açıklama: public en geniş, private en dar; package-private paketle, protected paket ve alt sınıf bağlamıyla sınırlıdır.
Açıklama: Aynı sınıfta dört seviye de erişilebilir. Aynı pakette private dışındakiler erişilebilir. Farklı pakette public genel erişilir; protected ise alt sınıfın kalıtsal üyesine Java'nın nitelikli erişim kısıtlarıyla erişilebilir. package-private paket dışına çıkmaz.
Varsayım: Java 8+ nested class erişim köprüleri gibi derleyici ayrıntıları değil, kaynak dil erişim kuralları sorulur.
Etiketler: access, public, protected, private

## J18-02 · Çoklu seçim
Konu: Erişim belirleyiciler
Soru: `Base` sınıfındaki protected bir instance üye için doğru ifadeleri seçin.
Şıklar:
- [x] a: Base ile aynı paketteki unrelated bir sınıf üyeye erişebilir
  Neden: Doğru; aynı paket kapısı yeterlidir.
- [x] b: Farklı paketteki Base alt sınıfı, kalıtım bağlamında üyeye erişebilir
  Neden: Doğru; alt sınıf korumalı erişim bağlamıdır.
- [ ] c: Farklı paketteki herhangi bir sınıf üyeye erişebilir
  Neden: Yanlış; public değildir.
- [ ] d: protected, private ile tamamen aynıdır
  Neden: Yanlış; kapsamı private'dan geniştir.
- [x] e: Aynı Base sınıfı içinden üyeye erişilebilir
  Neden: Doğru; bildiren sınıf kendi üyesine erişir.
İpucu: protected iki kapı açar: aynı paket veya uygun alt sınıf bağlamı.
Kısa açıklama: Aynı paket erişimi ve farklı pakette alt sınıf erişimi vardır.
Açıklama: protected üye aynı paket içinde package erişimi gibi kullanılabilir. Paket dışındaki alt sınıfta erişim, alt sınıf örneği/kalıtım yolu üzerinden olmalıdır; herhangi bir Base nesnesi üzerinden serbest genel erişim değildir.
Varsayım: Üye instance üyedir; farklı pakette alt sınıf erişimindeki qualifier kısıtları saklıdır ve genel Base referansı üzerinden erişim iddia edilmez.
Etiketler: protected, package, inheritance

# J19 · Orta · Hata bulma

Aşağıdaki sınıfın neden derlenmediğini açıklayın. `static` üyeler ile instance üyeleri arasındaki farkı belirtin.

```java
class Counter {
    int value = 10;

    static void printValue() {
        System.out.println(value);
        System.out.println(this.value);
    }
}
```

## J19-01 · Çoklu seçim
Konu: static ve instance üyeleri
Soru: `printValue` gövdesindeki bağımsız derleme sorunlarını seçin.
Kod:
```java
class Counter {
    int value = 10;
    static void printValue() {
        System.out.println(value);
        System.out.println(this.value);
    }
}
```
Şıklar:
- [x] a: Static bağlamdan instance `value` alanına nesne olmadan erişiliyor
  Neden: Doğru; bir instance seçilmemiştir.
- [x] b: Static bağlamda `this` kullanılıyor
  Neden: Doğru; static context'te this yoktur.
- [ ] c: println static metotta çağrılamaz
  Neden: println çağrısı System.out nesnesi üzerinden geçerlidir.
- [ ] d: int instance alanı 10 ile başlatılamaz
  Neden: Instance int alanı initializer ile 10 olabilir.
İpucu: Static metot çağrısında örtük bir Counter alıcısı yoktur.
Kısa açıklama: Hem çıplak `value` erişimi hem `this` kullanımı static bağlamda geçersizdir.
Açıklama: Instance alanı belirli bir Counter nesnesine aittir. Static metot sınıfa bağlı çağrılabildiğinden örtük this yoktur. Alanı okumak için bir Counter referansı alınmalı/oluşturulmalı veya alan gerçekten ortaksa static yapılmalıdır.
Varsayım: Kod tam olarak verildiği gibi javac ile derlenir.
Etiketler: static, instance, this, compile-error

## J19-02 · Tek seçim
Konu: static ve instance üyeleri
Soru: Her Counter nesnesinin kendi `value` değerini yazdırmasını sağlayan en uygun düzeltme hangisidir?
Şıklar:
- [x] a: `printValue` metodundan static'i kaldırıp `System.out.println(this.value);` kullanmak
  Neden: Doğru nesne başına davranıştır.
- [ ] b: `value` alanını static yapıp tüm nesnelerin değerini tek ortak alanda tutmak ve metodu static bırakmak
  Neden: Static alan tüm Counter'larda ortaktır; her nesnenin kendi değeri kaybolur.
- [ ] c: Metodu static bırakıp içinde `System.out.println(this.value);` yazmak
  Neden: Static bağlamda this kullanılamaz; kod derlenmez.
- [ ] d: `value` alanını final yapmak
  Neden: final erişim bağlamını değiştirmez.
İpucu: Davranış nesne başına ise metot da bir instance alıcısıyla çalışabilir.
Kısa açıklama: Instance metot örtük this üzerinden o nesnenin alanına erişir.
Açıklama: static kaldırıldığında `counter.printValue()` çağrısı belirli bir nesne seçer ve this o nesneyi gösterir. final yapmak bağlanma sorununu çözmez; static bağlamda this yine yoktur.
Varsayım: value nesne başına farklı olmalıdır; tüm Counter'lar arasında ortak sayaç istenmemektedir.
Etiketler: static, instance-method, this

# J20 · Orta · Teori

`final` bir değişken, metot ve sınıf için ne ifade eder? `final` bir referansın gösterdiği nesne yine de değiştirilebilir mi?

## J20-01 · Eşleştirme
Konu: final
Soru: final kullanım yerlerini temel etkileriyle eşleştirin.
Eşleşmeler:
- var: final değişken => r1: Bir kez atandıktan sonra yeniden atanamaz
- method: final instance metot => r2: Alt sınıfta override edilemez
- class: final sınıf => r3: Extend edilemez
Fazladan seçenekler:
- decoy: Gösterilen nesnenin alanları da değiştirilemez hâle gelir
İpucu: final, uygulandığı bildirimin yeniden bağlanma/genişletme noktasını kapatır.
Kısa açıklama: final değişken yeniden atanmaz, metot override edilmez, sınıf extend edilmez.
Açıklama: Blank final değişken constructor gibi izin verilen bir yerde bir kez atanabilir. final metot kalıtılır ama override edilemez. final sınıfın alt sınıfı oluşturulamaz; üyelerinin otomatik immutable olduğu anlamına gelmez.
Varsayım: Instance metot sorulmaktadır; static metotlarda override yerine hiding kavramı vardır.
Etiketler: final, variable, method, class

## J20-02 · Doğru / Yanlış
Konu: final
Soru: `final List<String> names = new ArrayList<>();` bildirimi listeyi salt okunur yapar; bu yüzden `names.add("Ada")` derleme hatası verir.
Şıklar:
- [ ] Doğru
  Neden: final referans sabitliğidir; gösterilen nesnenin metotlarını salt okunur yapmaz.
- [x] Yanlış
  Neden: Doğru; add çağrısı derlenir ve listeye eleman ekler.
İpucu: final referansın kendisini mi, gösterdiği nesnenin içeriğini mi sabitler?
Kısa açıklama: Yanlış. final yalnız referansın yeniden atanmasını engeller; liste mutable kalır ve add çalışır.
Açıklama: final, names değişkeninin başka bir List referansına veya null'a yeniden atanmasını önler. ArrayList nesnesinin add/remove gibi mutasyonlarını önlemez. Gerçek immutability için kopyalama ve değiştirilemez görünüm/tasarım gerekir.
Varsayım: Liste normal mutable java.util.ArrayList'tir.
Etiketler: final, reference, mutability, list

# J21 · Orta · Kod okuma

Constructor çağrı sırasını açıklayın. `this`, `this(...)`, `super` ve `super(...)` kullanımlarının amaçları nelerdir?

```java
class Person {
    Person(String name) {
        System.out.println("Person: " + name);
    }
}

class Developer extends Person {
    Developer() {
        super("Ayşe");
        System.out.println("Developer");
    }
}

new Developer();
```

## J21-01 · Kod çıktısı
Konu: Constructor zinciri
Soru: Kodun standart çıktısını yazın.
Kod:
```java
class Person {
    Person(String name) { System.out.println("Person: " + name); }
}
class Developer extends Person {
    Developer() {
        super("Ayşe");
        System.out.println("Developer");
    }
}
new Developer();
```
Cevap:
```
Person: Ayşe
Developer
```
Büyük/küçük harf duyarlı: evet
İpucu: Alt sınıf constructor gövdesinden önce üst constructor tamamlanır.
Kısa açıklama: Önce `Person: Ayşe`, sonra `Developer` yazdırılır.
Açıklama: Developer constructor'ının ilk statement'ı `super` çağrısıdır. `Person(String)` tamamlandıktan sonra kontrol Developer constructor gövdesindeki `println`'e döner.
Varsayım: Sınıf initialization blokları veya field initializer'ları yoktur; kod geçerli bir çalıştırma bağlamındadır.
Etiketler: constructor, super, inheritance, output

## J21-02 · Çoklu seçim
Konu: this ve super
Soru: Constructor ve nesne bağlamı hakkında doğru ifadeleri seçin.
Şıklar:
- [x] a: `this` geçerli nesneyi ifade eder
  Neden: Doğru instance alıcısıdır.
- [x] b: `this(...)` aynı sınıftaki başka bir constructor'ı çağırır
  Neden: Doğru constructor chaining biçimidir.
- [x] c: `super(...)` doğrudan üst sınıf constructor'ını çağırır
  Neden: Doğru üst sınıf çağrısıdır.
- [ ] d: Bir constructor içinde `this(...)` ve `super(...)` çağrıları ikisi de ayrı ayrı kullanılabilir
  Neden: Yanlış; ikisi de ilk statement olmak zorunda olduğundan birlikte olamaz.
- [x] e: Açık constructor invocation varsa constructor'ın ilk statement'ı olmalıdır
  Neden: Doğru sözdizim kuralıdır.
İpucu: Bir constructor zinciri ilk statement'ta tek bir yönde başlatılır.
Kısa açıklama: `this` nesneyi, `this(...)` kardeş constructor'ı, `super(...)` üst constructor'ı belirtir; açık çağrı ilk statement'tır.
Açıklama: Bir constructor en fazla bir explicit constructor invocation ile başlar: `this(...)` veya `super(...)`. İkisi birlikte yazılamaz. Çağrı yoksa ve superclass Object değilse derleyici erişilebilir no-arg `super()` eklemeye çalışır.
Varsayım: Java 8–21 ortak explicit constructor invocation kuralları esas alınır.
Etiketler: this, super, constructor

# J22 · Orta · Hata bulma

Geçerli overload’ları ve derleme hatası oluşturan metodu bulun.

```java
class Calculator {
    int sum(int a, int b) {
        return a + b;
    }

    double sum(double a, double b) {
        return a + b;
    }

    long sum(int a, int b) {
        return a + b;
    }
}
```

## J22-01 · Çoklu seçim
Konu: Method overloading
Soru: Calculator bildirimleri hakkında doğru ifadeleri seçin.
Kod:
```java
int sum(int a, int b) { return a + b; }
double sum(double a, double b) { return a + b; }
long sum(int a, int b) { return a + b; }
```
Şıklar:
- [x] a: İlk ve ikinci metot geçerli overload'lardır
  Neden: Doğru; parametre tipleri farklıdır.
- [x] b: Üçüncü metot ilk metotla aynı imzaya sahiptir ve derleme hatasıdır
  Neden: Doğru duplicate method hatasıdır.
- [ ] c: Dönüş tipini değiştirmek tek başına overload için yeterlidir
  Neden: Yanlış; dönüş tipi imzaya dahil değildir.
- [x] d: Parametre tiplerini değiştirmek overload oluşturabilir
  Neden: Doğru overload mekanizmasıdır.
İpucu: Çağrı çözümleme dönüş hedefine bakarak aynı parametre listesini ayırt etmez.
Kısa açıklama: int,int ve double,double overload'dur; yalnız dönüş tipi farklı int,int bildirimi çakışır.
Açıklama: İmza ad ve parametre tipleriyle belirlenir. İlk ve üçüncü `sum(int,int)` aynı imzadır; dönüş tipleri farklı olsa da birlikte bildirilemez. İkinci `sum(double,double)` farklı parametre listesi nedeniyle geçerlidir.
Varsayım: Üç bildirim aynı sınıfta ve aynı generic erasure bağlamındadır.
Etiketler: overload, signature, compile-error

## J22-02 · Doğru / Yanlış
Konu: Method overloading
Soru: Aynı sınıfta yalnız dönüş tipleri farklı olan `int parse(String s)` ve `long parse(String s)` metotları geçerli overload oluşturur.
Şıklar:
- [ ] Doğru
  Neden: Dönüş tipi imzanın parçası değildir.
- [x] Yanlış
  Neden: Doğru; parametre listesi farklı olmalıdır.
İpucu: İki çağrının argüman listesi aynıdır.
Kısa açıklama: Yanlış. Dönüş tipi tek başına overload ayırt etmez.
Açıklama: Her iki metodun imzası `parse(String)`'dir. Çağrı sonucunun atandığı değişken üzerinden overload seçilmez; sınıf duplicate method nedeniyle derlenmez.
Varsayım: Metotlar aynı sınıfta, static/instance ayrımıyla da farklılaştırılmadan bildirilmiştir.
Etiketler: overload, return-type, signature

# J23 · Orta · Kod okuma

Çıktıyı tahmin edin. Overriding, referans tipi ve çalışma zamanındaki nesne tipi arasındaki ilişkiyi açıklayın.

```java
class Animal {
    void speak() {
        System.out.println("Animal");
    }
}

class Dog extends Animal {
    @Override
    void speak() {
        System.out.println("Dog");
    }
}

Animal animal = new Dog();
animal.speak();
```

## J23-01 · Kod çıktısı
Konu: Overriding ve polymorphism
Soru: Kodun çıktısını yazın.
Kod:
```java
class Animal { void speak() { System.out.println("Animal"); } }
class Dog extends Animal { @Override void speak() { System.out.println("Dog"); } }
Animal animal = new Dog();
animal.speak();
```
Cevap: Dog
Büyük/küçük harf duyarlı: evet
İpucu: Override edilmiş instance metot çalışma zamanındaki nesne tipine göre seçilir.
Kısa açıklama: `Dog` yazdırılır.
Açıklama: Referansın derleme zamanı tipi Animal olduğu için Animal'da bildirilen speak çağrısı geçerlidir. Alttaki nesne Dog olduğundan dinamik dispatch Dog override'ını çalıştırır.
Varsayım: speak instance metodudur; static, private veya final değildir.
Etiketler: override, polymorphism, dynamic-dispatch, output

## J23-02 · Eşleştirme
Konu: Overriding ve polymorphism
Soru: `Animal animal = new Dog(); animal.speak();` çağrısındaki rolleri eşleştirin.
Eşleşmeler:
- ref: Referansın derleme zamanı tipi Animal => r1: Çağrının derleme zamanında erişilebilir olup olmadığını sınırlar
- obj: Çalışma zamanı nesnesinin tipi Dog => r2: Dinamik dispatch için gerçek alıcı tipini belirler
- override: Dog.speak override'ı => r3: Çalıştırılan metot gövdesidir
Fazladan seçenekler:
- decoy: Hangi overload'un çağrılacağını çalışma zamanında belirler
İpucu: Derleyici çağrının varlığını, JVM ise override hedefini çözer.
Kısa açıklama: Referans tipi görünür API'yi; nesne tipi override gövdesini belirler.
Açıklama: Animal referansı yalnız Animal sözleşmesindeki erişilebilir üyeleri doğrudan çağırabilir. Virtual instance metot çağrısında gerçek Dog nesnesine en özgül override uygulanır. Dog'a özel başka bir metot cast olmadan görünmez.
Varsayım: Normal virtual instance method dispatch söz konusudur; overload seçimi veya static hiding yoktur.
Etiketler: reference-type, runtime-type, override

# J24 · Orta · Teori

Java Collections Framework’ün amacını açıklayın. `Collection`, `Collections` ve `Map` kavramlarının farkı nedir?

## J24-01 · Eşleştirme
Konu: Collections Framework
Soru: Collections Framework kavramlarını rolleriyle eşleştirin.
Eşleşmeler:
- collection: java.util.Collection => r1: Tekil eleman grupları için kök arayüz
- collections: java.util.Collections => r2: Koleksiyonlar üzerinde sort/reverse gibi static yardımcılar içeren sınıf
- map: java.util.Map => r3: Anahtar-değer eşlemeleri için ayrı kök arayüz
Fazladan seçenekler:
- decoy: Elemanları sıralı ve tekrarsız tutan somut sınıf
İpucu: Tekil ve çoğul yazım iki farklı türdür.
Kısa açıklama: Collection arayüz, Collections yardımcı sınıf, Map ayrı anahtar-değer arayüzüdür.
Açıklama: List, Set ve Queue Collection hiyerarşisindedir. Collections örneklenmeyen bir yardımcı sınıftır. Map, entrySet gibi collection görünümleri sunsa da Collection'ın alt tipi değildir.
Varsayım: Java standart java.util API'si sorulmaktadır.
Etiketler: collection, collections, map, framework

## J24-02 · Tek seçim
Konu: Collections Framework
Soru: Aşağıdaki tür ilişkilerinden hangisi doğrudur?
Şıklar:
- [ ] a: Map, Collection arayüzünü extends eder
  Neden: Yanlış; Map ayrı arayüzdür.
- [ ] b: Collections, Collection'ın somut liste implementasyonudur
  Neden: Yanlış; Collections yardımcı sınıftır.
- [x] c: List ve Set, Collection hiyerarşisindedir; Map ayrı bir hiyerarşidir
  Neden: Doğru hiyerarşidir.
- [ ] d: Collection yalnızca static metotlar içerir
  Neden: Collection arayüzdür ve instance sözleşmesi tanımlar.
İpucu: Anahtar-değer yapısı, tek tek eleman koleksiyonundan ayrı modellenir.
Kısa açıklama: List/Set Collection alt türleridir; Map Collection değildir.
Açıklama: Collection tekil eleman grupları için üst arayüzdür. Map key-value ilişkileri tutar ve Collection'ı extend etmez. Collections ise algoritma ve wrapper yardımcıları sunan final sınıftır.
Varsayım: Standart Java Collections Framework türleri kastedilir.
Etiketler: collections-framework, hierarchy

# J25 · Orta · Teori

Şu ihtiyaçlar için uygun yapıyı seçin: eklenme sırasıyla görev saklama, benzersiz e-posta adresleri tutma ve kullanıcı kimliğinden kullanıcı bilgisine erişme. `List`, `Set` ve `Map` tercihlerinizi gerekçelendirin.

## J25-01 · Eşleştirme
Konu: List Set Map seçimi
Soru: İhtiyaçları en doğrudan temel koleksiyon soyutlamasıyla eşleştirin.
Eşleşmeler:
- tasks: Görevleri eklenme sırasıyla ve tekrarları koruyarak saklama => list: List
- emails: Benzersiz e-posta adresleri tutma => set: Set
- users: Kullanıcı kimliğinden kullanıcı bilgisine erişme => map: Map
Fazladan seçenekler:
- decoy: Iterator
İpucu: Sıra/tekrar, benzersizlik ve anahtar üzerinden erişim gereksinimlerini ayırın.
Kısa açıklama: Sıralı tekrarlar List, benzersizlik Set, anahtar-değer erişimi Map ister.
Açıklama: List pozisyon ve tekrarları korur. Set eşitlik sözleşmesine göre yinelenen öğeleri reddeder. Map benzersiz anahtarları değerlerle eşler. Somut tür seçerken ayrıca sıra ihtiyacı varsa ArrayList, LinkedHashSet veya LinkedHashMap gibi implementasyonlar değerlendirilebilir.
Varsayım: E-posta eşitliğinin normalize edilmiş String eşitliğiyle belirlendiği ve null politikalarının uygulamada ayrıca tanımlanacağı varsayılır.
Etiketler: list, set, map, selection

# J26 · Orta · Teori

`ArrayList` ile `LinkedList` yapılarını indeksle erişim, ekleme-silme, bellek kullanımı ve gerçek uygulamalardaki performans açısından karşılaştırın.

## J26-01 · Eşleştirme
Konu: ArrayList ve LinkedList
Soru: İşlemleri tipik tercih veya karmaşıklıkla eşleştirin.
Eşleşmeler:
- random: get(i) ile rastgele indeks erişimi => r1: ArrayList: O(1)
- append: Listenin sonuna ekleme => r2: İkisi de tipik olarak O(1) amortize/bağlantı güncellemesi
- knownnode: Iterator'ın bulunduğu konumda silme => r3: LinkedList: konum zaten biliniyorsa bağlantı güncellemesi O(1)
- memory: Eleman başına daha düşük yapısal bellek yükü => r4: Genellikle ArrayList
Fazladan seçenekler:
- decoy: LinkedList: indeksle erişim O(1)
İpucu: LinkedList'te indeks bulma süresini, bulduktan sonraki bağlantı değişiminden ayırın.
Kısa açıklama: ArrayList indeks erişiminde ve bellek yerelliğinde güçlü; LinkedList bilinen düğüm konumundaki bağlantı değişiminde avantajlıdır.
Açıklama: ArrayList get(i) O(1), LinkedList get(i) O(n)'dir. ArrayList sona ekleme amortize O(1), LinkedList sona ekleme O(1)'dir. LinkedList ortasına indeksle gitmek yine O(n) olduğundan yalnız ekleme/silme ifadesi tek başına üstünlük garantilemez. Düğümler iki bağlantı taşıdığı için LinkedList'in eleman başına yükü yüksektir.
Varsayım: Big-O ortalama/amortize davranıştır; ArrayList kapasite büyümesi ve donanım cache etkileri ayrıca belirtilmiştir.
Etiketler: arraylist, linkedlist, complexity, memory

## J26-02 · Çoklu seçim
Konu: ArrayList ve LinkedList
Soru: Gerçek uygulama performansı açısından doğru ifadeleri seçin.
Şıklar:
- [x] a: LinkedList'te `add(index, x)` indeksi bulmak gerektiğinden genel olarak O(n)'dir
  Neden: Doğru; traversal gerekir.
- [x] b: ArrayList bitişik referans dizisi sayesinde genellikle iyi cache locality sunar
  Neden: Doğru tipik donanım etkisidir.
- [ ] c: LinkedList her türlü ekleme ve silmede daima ArrayList'ten hızlıdır
  Neden: Yanlış mutlak genellemedir.
- [x] d: ArrayList ortasına ekleme eleman kaydırmayı gerektirebilir
  Neden: Doğru; sonraki elemanlar kayar.
- [ ] e: LinkedList `get(i)` her `i` için O(1)'dir
  Neden: Yanlış; bağlantılar boyunca yürünür.
İpucu: Asimptotik maliyetin yanında indeks arama ve bellek yerelliğini düşünün.
Kısa açıklama: İndeks bulma LinkedList'i O(n) yapar; ArrayList kaydırabilir fakat bellek yerelliği güçlüdür.
Açıklama: LinkedList yalnız konum iterator/düğüm olarak zaten eldeyse bağlantı değişimini O(1) yapar. İndeksli API önce düğümü arar. ArrayList orta eklemede `System.arraycopy` benzeri kaydırma yapar, fakat kompakt düzen ve düşük allocation maliyeti pratikte çoğu kullanımda avantajlıdır.
Varsayım: Standart OpenJDK benzeri ArrayList/LinkedList tasarımı ve ortalama uygulama kullanımı ele alınır; mikrobenchmark sonucu garanti edilmez.
Etiketler: arraylist, linkedlist, performance

# J27 · Orta · Kod okuma

Aşağıdaki koleksiyonun boyutunu değerlendirin. Sonucun `equals()` ve `hashCode()` ile ilişkisini açıklayın.

```java
class Employee {
    int id;

    Employee(int id) {
        this.id = id;
    }
}

Set<Employee> employees = new HashSet<>();
employees.add(new Employee(10));
employees.add(new Employee(10));

System.out.println(employees.size());
```

## J27-01 · Kod çıktısı
Konu: HashSet eşitliği
Soru: Kodun çıktısını yazın.
Kod:
```java
class Employee {
    int id;
    Employee(int id) { this.id = id; }
}
Set<Employee> employees = new HashSet<>();
employees.add(new Employee(10));
employees.add(new Employee(10));
System.out.println(employees.size());
```
Cevap: 2
Büyük/küçük harf duyarlı: evet
İpucu: Employee equals/hashCode override etmediği için Object kimlik semantiğini kullanır.
Kısa açıklama: İki ayrı nesne eşit sayılmaz; boyut 2'dir.
Açıklama: Object.equals varsayılan olarak aynı nesne kimliğini gerektirir; her new ayrı nesnedir. Object.hashCode da kimlik sözleşmesiyle uyumludur. Aynı id alanı otomatik değer eşitliği oluşturmaz.
Varsayım: Employee, Object.equals ve Object.hashCode'u override etmez; Set standart HashSet'tir.
Etiketler: hashset, equals, hashcode, output

## J27-02 · Tek seçim
Konu: HashSet eşitliği
Soru: Yalnız id alanı eşit Employee nesnelerinin HashSet'te tek öğe sayılması için ne yapılmalıdır?
Şıklar:
- [ ] a: Yalnız equals id'ye göre override edilmeli
  Neden: Hash sözleşmesini bozabilir.
- [ ] b: Yalnız hashCode id'ye göre override edilmeli; HashSet eşitliği yalnız hash değerine bakarak belirler
  Neden: HashSet hash'i yalnız kovayı bulmak için kullanır; eşitliği equals belirler ve Object.equals ayrı nesneleri reddeder.
- [x] c: equals ve hashCode birlikte, aynı id eşitlik ölçütüne göre override edilmeli
  Neden: Doğru sözleşmedir.
- [ ] d: HashSet yerine ArrayList kullanılmalı
  Neden: Benzersizlik gereksinimini otomatik sağlamaz.
İpucu: Eşit nesneler aynı hash code'u üretmek zorundadır.
Kısa açıklama: equals ve hashCode aynı alanlara dayalı birlikte uygulanmalıdır.
Açıklama: HashSet önce hash ile bucket adaylarını daraltır, sonra equals ile eşitliği doğrular. equals id'yi kullanıyorsa hashCode da id'den türetilmelidir. Yalnız birini override etmek sözleşmeyi veya beklenen aramayı bozar.
Varsayım: id nesne Set içindeyken değişmez veya Employee immutable tasarlanır.
Etiketler: equals, hashcode, hashset, contract

# J28 · Orta · Kod yazma

Bir sipariş listesini müşteri kimliğine göre gruplandıran ve `Map<Integer, List<Order>>` döndüren bir metot tasarlayın.

## J28-01 · Tek seçim
Konu: Map ile gruplama
Soru: Siparişleri `customerId`'ye göre `Map<Integer,List<Order>>` içinde doğru biçimde gruplayan gövde hangisidir? `Order#getCustomerId()` int döndürür.
Şıklar:
- [x] a: `for (Order o : orders) result.computeIfAbsent(o.getCustomerId(), k -> new ArrayList<>()).add(o);`
  Neden: Doğru Java 8 gruplama kalıbıdır.
- [ ] b: `for (Order o : orders) { List<Order> list = new ArrayList<>(); list.add(o); result.put(o.getCustomerId(), list); }`
  Neden: Her siparişte yeni liste açılır; aynı müşterinin önceki siparişleri ezilir.
- [ ] c: `for (Order o : orders) result.get(o.getCustomerId()).add(o);`
  Neden: Liste önceden yoksa NPE verir.
- [ ] d: `for (Order o : orders) result.put(null, Arrays.asList(o));`
  Neden: Müşteri kimliğini kullanmaz ve gruplamaz.
İpucu: Anahtar ilk kez görülürse liste oluşturun; her durumda siparişi o listeye ekleyin.
Kısa açıklama: `computeIfAbsent` her müşteri için listeyi bir kez oluşturup siparişi ekler.
Açıklama: A seçeneğinde mapping function yalnız anahtar için mevcut non-null değer yoksa ArrayList üretir; dönen listeye sipariş eklenir. B her siparişte boş listeyle önceki grubu ezer. C ilk anahtarda `get` null döndürdüğü için `add` çağrısında NPE üretir.
Varsayım: `orders` ve içindeki Order öğeleri null değildir; `getCustomerId` int döndürür; `result` başlangıçta boş mutable HashMap'tir.
Etiketler: map, grouping, computeifabsent

## J28-02 · Sıralama
Konu: Map ile gruplama
Soru: Bir siparişi customerId'ye göre imperative olarak gruplama adımlarını sıraya koyun.
Sıra:
1. key: Siparişin customerId anahtarını oku
2. lookup: Anahtar için mevcut listeyi bul; yoksa yeni liste oluşturup Map'e koy
3. add: Siparişi ilgili listeye ekle
4. return: Tüm siparişler işlendiğinde Map'i döndür
İpucu: Liste hazır olmadan add yapılamaz; Map tüm öğeler bitince döner.
Kısa açıklama: Anahtar alınır, grup listesi sağlanır, sipariş eklenir; döngü bitince Map döner.
Açıklama: Bu sıra computeIfAbsent kalıbının açılmış hâlidir. Her Order tam bir kez bir gruba eklenir. n sipariş için HashMap'in ortalama varsayımları altında toplam süre O(n), ek alan O(n)'dir.
Varsayım: HashMap işlemleri ortalama O(1), iyi dağılan hash ve normal yük faktörü varsayımıyla değerlendirilir; null öğeler kabul edilmez.
Etiketler: grouping, map, algorithm, order

## J28-03 · Doğru / Yanlış
Konu: Map ile gruplama
Soru: Gruplama sonucu `HashMap<Integer,List<Order>>` kullanıyorsa müşteri anahtarlarının iterasyon sırası, siparişlerin ilk görülme sırası olarak garanti edilir.
Şıklar:
- [ ] Doğru
  Neden: HashMap'in böyle bir sıra garantisi yoktur.
- [x] Yanlış
  Neden: Doğru; sıra gerekiyorsa uygun Map implementasyonu seçilmelidir.
İpucu: HashMap bir sıralama sözleşmesi sunar mı?
Kısa açıklama: Yanlış. HashMap iterasyon sırası garantilemez.
Açıklama: İlk görülme anahtar sırasının korunması gerekiyorsa LinkedHashMap kullanılmalıdır. Her grup içindeki ArrayList sipariş ekleme sırasını korur; fakat dış HashMap'in key/entry iterasyon sırası sözleşmesizdir.
Varsayım: Standart java.util.HashMap kullanılır; belirli bir JVM çalıştırmasında gözlenen tesadüfi sıra sözleşme sayılmaz.
Etiketler: hashmap, linkedhashmap, ordering, grouping

# J29 · Orta · Teori

`HashMap` içinde bir anahtar-değer çifti eklenirken ve aranırken hangi adımlar gerçekleşir? Hash değeri, bucket, collision, `equals()`, kapasite ve yeniden boyutlandırma kavramlarını açıklayın.

## J29-01 · Sıralama
Konu: HashMap çalışma mantığı
Soru: HashMap'te `put(key, value)` işleminin kavramsal adımlarını sıraya koyun.
Sıra:
1. hash: Anahtarın hashCode değerinden yayılmış hash hesapla
2. bucket: Tablo kapasitesine göre bucket indeksini belirle
3. scan: Bucket içindeki adaylarda hash ve equals ile eş anahtar ara
4. write: Eş anahtar varsa değeri güncelle; yoksa yeni entry ekle
5. resize: Ekleme eşiği aşarsa tabloyu yeniden boyutlandır/dağıt
İpucu: Önce hash ve bucket; sonra collision adayları ve eşitlik gelir.
Kısa açıklama: Hash bucket'ı daraltır; equals gerçek anahtar eşitliğini doğrular; eşik aşılırsa resize olur.
Açıklama: HashMap hashCode'u işler ve kapasite maskesiyle bucket seçer. Aynı bucket'taki collision'lar hash ve equals ile ayrılır. Eş anahtarda value değiştirilir; yeni anahtarda entry sayısı artar. size threshold'u aşınca kapasite genellikle büyür ve entry'ler yeni tablodaki konumlarına ayrılır.
Varsayım: Açıklama Java 8 HashMap'in kavramsal davranışıdır; null anahtarın özel hash=0 yolu ve tree bin ayrıntıları kartın ana sırasını değiştirmez.
Etiketler: hashmap, hash, bucket, resize

## J29-02 · Çoklu seçim
Konu: HashMap çalışma mantığı
Soru: HashMap hakkında doğru ifadeleri seçin.
Şıklar:
- [x] a: Collision, farklı anahtarların aynı bucket'a düşebilmesidir
  Neden: Doğru collision tanımıdır.
- [ ] b: Aynı hashCode üreten iki anahtar mutlaka equals ile eşittir
  Neden: Yanlış; farklı anahtarlar aynı hash'i paylaşabilir.
- [x] c: Eş anahtarlar aynı hashCode'u üretmelidir
  Neden: Doğru equals/hashCode sözleşmesidir.
- [x] d: Kapasite/yük eşiği aşılınca resize maliyetli olabilir
  Neden: Doğru; tablo yeniden düzenlenir.
- [ ] e: HashMap araması her koşulda kesin O(1)'dir
  Neden: Yanlış; ortalama/amortize beklentidir.
İpucu: Hash aynı olması yalnız adaylığı gösterir; eşitliğin tersi yönlü sözleşmesini düşünün.
Kısa açıklama: Collision normaldir; equals eşitliği aynı hash gerektirir; resize maliyetlidir ve O(1) garanti değildir.
Açıklama: hashCode eşitliği equals eşitliği için yeterli değildir. Ancak equals true ise hashCode aynı olmalıdır. İyi dağılımda get/put ortalama O(1) kabul edilir; kötü collision veya saldırgan anahtarlarda maliyet artar. Java 8 bazı uzun bucket'ları tree'leştirerek en kötü durumu iyileştirebilir.
Varsayım: Karmaşıklık ortalama iyi hash dağılımı için ayrıca belirtilir; kesin worst-case O(1) iddia edilmez.
Etiketler: hashmap, collision, complexity, contract

# J30 · Orta · Kod okuma

Kontrol akışını ve çıktıyı tahmin edin.

```java
static int calculate() {
    try {
        return 10 / 0;
    } catch (ArithmeticException e) {
        System.out.println("catch");
        return -1;
    } finally {
        System.out.println("finally");
    }
}

System.out.println(calculate());
```

## J30-01 · Kod çıktısı
Konu: Exception kontrol akışı
Soru: Kodun standart çıktısını satır sırasıyla yazın.
Kod:
```java
static int calculate() {
    try {
        return 10 / 0;
    } catch (ArithmeticException e) {
        System.out.println("catch");
        return -1;
    } finally {
        System.out.println("finally");
    }
}
System.out.println(calculate());
```
Cevap:
```
catch
finally
-1
```
Büyük/küçük harf duyarlı: evet
İpucu: catch dönüş kararı verse bile finally tamamlanmadan çağrı dönmez.
Kısa açıklama: Sıra `catch`, `finally`, `-1` olur.
Açıklama: 10/0 ArithmeticException üretir ve catch çalışır. catch -1 döndürmeye hazırlanır; ancak normal dönüşten önce finally yürütülür. finally yalnız yazdırıp normal tamamlanınca bekleyen -1 dönüşü çağırana gider ve dış println onu yazdırır.
Varsayım: Bölme int bölmesidir; finally yeni exception atmaz ve return içermez.
Etiketler: try, catch, finally, output

## J30-02 · Sıralama
Konu: Exception kontrol akışı
Soru: `calculate()` çağrısındaki olayları sıraya koyun.
Sıra:
1. throw: 10 / 0 ArithmeticException üretir
2. catch: Uyumlu catch çalışır ve -1 dönüşü hazırlanır
3. finally: finally bloğu çalışır
4. return: -1 çağırana döner
5. outer: Dış println -1'i yazdırır
İpucu: finally, bekleyen normal return'den önce yürütülür.
Kısa açıklama: Exception catch'e gider; finally sonrası bekleyen dönüş tamamlanır.
Açıklama: Exception try'ın geri kalanını atlar. catch dönüş ifadesi değerlendirilir, fakat kontrol finally'a aktarılır. finally normal biterse kaydedilen dönüş gerçekleşir. finally return/throw yapsaydı önceki dönüşü bastırabilirdi; bu kodda yapmaz.
Varsayım: finally içindeki println başarıyla normal tamamlanır; Thread.stop gibi dış asenkron olaylar yoktur.
Etiketler: exception, finally, return, order

# J31 · Orta · Hata bulma

Metot neden doğrudan derlenmeyebilir? Checked ve unchecked exception ayrımını kullanarak açıklayın.

```java
static String readFirstLine(String path) {
    BufferedReader reader =
            new BufferedReader(new FileReader(path));

    return reader.readLine();
}
```

## J31-01 · Çoklu seçim
Konu: Checked exception
Soru: Metodun derlenmesi ve kaynağın güvenle kapatılması için geçerli yaklaşımları seçin.
Kod:
```java
static String readFirstLine(String path) {
    BufferedReader reader = new BufferedReader(new FileReader(path));
    return reader.readLine();
}
```
Şıklar:
- [x] a: Metoda `throws IOException` ekleyip tercihen try-with-resources ile reader'ı kapatmak
  Neden: Doğru, çağırana checked sözleşmesi verir ve kaynağı kapatabilir.
- [x] b: IOException'ı metot içinde catch edip anlamlı biçimde ele almak ve try-with-resources kullanmak
  Neden: Doğru, yerel kurtarma/çevirme politikası olabilir.
- [ ] c: Hiçbir şey yapmamak; IOException unchecked'dır
  Neden: Yanlış; IOException checked'dır.
- [ ] d: Yalnız `reader = null` atamak
  Neden: Referansı null yapmak işletim sistemi kaynağını deterministik kapatmaz.
- [ ] e: Metoda `throws RuntimeException` eklemek
  Neden: İlgili checked exception'ı bildirmez.
İpucu: FileReader oluşturma ve readLine checked IOException ailesindedir; kapanma da düşünülmelidir.
Kısa açıklama: IOException yakalanmalı veya bildirilmelidir; kaynak try-with-resources ile kapatılmalıdır.
Açıklama: FileNotFoundException IOException alt tipidir ve FileReader constructor'ından gelebilir; BufferedReader.readLine da IOException bildirebilir. Checked exception catch veya throws ister. try-with-resources normal ve exceptional çıkışlarda close çağırır ve close exception'larını da kurallı biçimde işler.
Varsayım: java.io sınıfları import edilmiştir; metot dosya I/O hatasını yutmamalıdır.
Etiketler: checked-exception, ioexception, try-with-resources

## J31-02 · Eşleştirme
Konu: Checked ve unchecked exception
Soru: Exception türlerini derleyici bildirimi gereksinimleriyle eşleştirin.
Eşleşmeler:
- io: IOException => r1: Checked: catch edilmeli veya throws ile bildirilmelidir
- runtime: RuntimeException => r2: Unchecked: catch/throws zorunlu değildir
- error: Error => r3: Unchecked ciddi JVM/sistem problemi ailesi; normalde uygulama kurtarma sözleşmesi değildir
Fazladan seçenekler:
- decoy: Checked: yalnız main metodunda yakalanabilir
İpucu: RuntimeException ve Error, checked exception analizinin dışında tutulur.
Kısa açıklama: IOException checked; RuntimeException ve Error unchecked'dır.
Açıklama: Throwable altında Exception'ın RuntimeException dışındaki yaygın alt tipleri checked'dır. Derleyici bunların kaçışını kontrol eder. RuntimeException programlama/precondition sorunlarını temsil edebilir; Error ise çoğu zaman uygulamanın güvenle düzeltemeyeceği JVM koşullarıdır.
Varsayım: Türler doğrudan belirtilen standart Java sınıflarıdır; özel alt sınıf değişikliği yoktur.
Etiketler: checked, unchecked, exception-hierarchy

# J32 · Orta · Kod yazma

Geçersiz yaş bilgisi için `InvalidAgeException` tasarlayın. Bunun checked mı unchecked mı olacağına karar verin; exception’ı `throw` ile üretip gerekiyorsa `throws` ile bildiren metodu yazın ve kararlarınızı gerekçelendirin.

## J32-01 · Tek seçim
Konu: Özel exception tasarımı
Soru: Geçersiz yaşın çağıranın işlemi düzeltip yeniden deneyebileceği iş kuralı ihlali olarak checked exception ile bildirilmesi isteniyor. Doğru tasarım hangisidir?
Şıklar:
- [x] a: `class InvalidAgeException extends Exception { InvalidAgeException(String m) { super(m); } }` ve `void register(int age) throws InvalidAgeException { if (age < 0) throw new InvalidAgeException("age"); }`
  Neden: Doğru checked exception tasarımıdır.
- [ ] b: `class InvalidAgeException extends Error {}` ve yalnız `return`
  Neden: Error iş kuralı doğrulaması için uygun değildir ve exception fırlatmıyor.
- [ ] c: `class InvalidAgeException extends RuntimeException { InvalidAgeException(String m) { super(m); } }` ve `void register(int age) throws InvalidAgeException { if (age < 0) throw new InvalidAgeException("age"); }`
  Neden: RuntimeException unchecked'tır; `throws` ile bildirilse bile derleyici çağıranı hatayı ele almaya zorlamaz.
- [ ] d: `class InvalidAgeException {}` ve `throw InvalidAgeException;`
  Neden: Throwable alt tipi değildir ve `throw` bir nesne ifadesi ister.
İpucu: Checked tür Exception'dan türemeli; tür bildiriminde `throws`, nesne üretiminde `throw` kullanılır.
Kısa açıklama: A seçeneği checked türü, throws sözleşmesini ve throw ifadesini doğru kurar.
Açıklama: Exception alt sınıfı RuntimeException dışında kaldığı için checked'dır. Constructor mesajı üst sınıfa iletir. `register` metodunun bildirimi olası türü `throws InvalidAgeException` ile açıklar; koşul oluşunca `throw new InvalidAgeException(...)` bir nesneyi fırlatır.
Varsayım: Geçerli yaş aralığının alt sınırı bu kartta 0'dır; üst sınır gereksinimi verilmemiştir.
Varsayım: Checked/unchecked seçimi bağlama bağlıdır; kart açıkça checked politika istemektedir.
Etiketler: custom-exception, throw, throws, checked

## J32-02 · Eşleştirme
Konu: throw ve throws
Soru: Exception ile ilgili öğeleri işlevleriyle eşleştirin.
Eşleşmeler:
- throw: throw => r1: Bir Throwable nesnesini o noktada fırlatır
- throws: throws => r2: Metot/constructor bildiriminde kaçabilecek türleri listeler
- checked: extends Exception (RuntimeException değil) => r3: Derleyici catch-or-declare kuralına tabidir
- unchecked: extends RuntimeException => r4: Catch-or-declare zorunluluğu yoktur
Fazladan seçenekler:
- decoy: Fırlatılan exception'ı yakalayıp işleyen blok
İpucu: Tekil eylem ile metot sözleşmesini ayırın.
Kısa açıklama: throw eylemdir, throws bildirimdir; kalıtım checked niteliğini belirler.
Açıklama: throw'dan sonra Throwable türünde bir expression gelir. throws metot başlığında virgülle türleri listeler. Checked exception kaçarsa bildirilmek/yakalanmak zorundadır; RuntimeException alt tiplerinde bu derleyici zorunluluğu yoktur.
Varsayım: Exception doğrudan Exception veya RuntimeException hiyerarşisinden türetilir; sneaky-throw gibi generic hileler kapsam dışıdır.
Etiketler: throw, throws, exception

# J33 · Orta · Teori

Interface ile abstract class arasındaki temel farklar nelerdir? Ortak davranış sözleşmesi, ortak durum, constructor, çoklu kalıtım ihtiyacı ve genişletilebilirlik açısından hangisini ne zaman tercih edersiniz?

## J33-01 · Eşleştirme
Konu: Interface ve abstract class
Soru: Tasarım ihtiyaçlarını en uygun temel araçla eşleştirin.
Eşleşmeler:
- contract: İlişkisiz sınıflara ortak davranış sözleşmesi ve çoklu tip kalıtımı => interface: Interface
- state: Alt sınıflarla protected ortak mutable durum ve constructor zinciri paylaşma => abstract: Abstract class
- default: Java 8'de sözleşmeye geriye uyumlu varsayılan davranış ekleme => idefault: Interface default method
- single: Tek bir sınıf implementasyon hiyerarşisinde ortak kod/şablon => aclass: Abstract class
Fazladan seçenekler:
- decoy: Final class
İpucu: Sözleşme/çoklu implementasyon ile ortak instance state/constructor ihtiyacını ayırın.
Kısa açıklama: Interface çoklu sözleşme; abstract class ortak durum, constructor ve güçlü ortak implementasyon içindir.
Açıklama: Bir sınıf tek bir sınıfı extend ederken birden çok interface implement edebilir. Abstract class instance field, erişim seviyeleri ve constructor sağlar. Java 8 interface default/static metotları davranış evrimine izin verir; interface field'ları ise public static final sabitlerdir.
Varsayım: Java 8 ortak özellikleri esas alınır; private interface method gibi Java 9+ ekleri sorulmaz.
Etiketler: interface, abstract-class, design

## J33-02 · Çoklu seçim
Konu: Interface ve abstract class
Soru: Java 8 için doğru ifadeleri seçin.
Şıklar:
- [x] a: Bir sınıf birden fazla interface implement edebilir
  Neden: Doğru çoklu tip sözleşmesidir.
- [ ] b: Bir sınıf birden fazla concrete/abstract sınıfı doğrudan extend edebilir
  Neden: Yanlış; sınıf kalıtımı tektir.
- [x] c: Abstract class constructor içerebilir
  Neden: Doğru; super zincirinde çağrılır.
- [ ] d: Interface instance field taşıyabilir
  Neden: Yanlış; bildirilen alanlar sabittir.
- [x] e: Interface default ve static metot tanımlayabilir
  Neden: Doğru Java 8 özelliğidir.
İpucu: Java'da sınıf kalıtımı tekli, interface implementasyonu çokludur.
Kısa açıklama: Çoklu interface, abstract constructor ve Java 8 default/static interface metotları desteklenir.
Açıklama: Java sınıfları tek bir doğrudan superclass'a sahiptir. Abstract class örneklenemese de alt sınıf construction sırasında çalışan constructor'lara sahiptir. Interface alanları örtük public static final'dır; nesne başına mutable state değildir.
Varsayım: Java 8 özellik kümesiyle cevaplanır.
Etiketler: interface, abstract-class, java8

# J34 · Orta · Kod yazma

Herhangi bir türde değer saklayabilen `Box<T>` generic sınıfını yazın. Sınıfı `String` ve `Integer` ile kullanın.

## J34-01 · Boşluk doldurma
Konu: Generic sınıflar
Soru: Boşluğu, herhangi bir referans türünde değer saklayan generic sınıf bildirimi olacak şekilde doldurun: `class Box___ { private T value; }`
Cevap: <T>
Kabul: < T >
Büyük/küçük harf duyarlı: evet
İpucu: Tür parametresi sınıf adından hemen sonra açılı ayraçlarla bildirilir.
Kısa açıklama: Doğru bildirim `class Box<T>` biçimindedir.
Açıklama: T sınıfın type parameter'ıdır ve field, constructor, getter/setter imzalarında kullanılabilir. Kullanımda `Box<String>` veya `Box<Integer>` concrete type argument verir. Primitive doğrudan type argument olamaz; wrapper kullanılır.
Varsayım: Cevap yalnız eksik sözdizim parçasıdır; çevresel boşluklar kontrollü normalleştirilir, T büyük-küçük harfe duyarlıdır.
Etiketler: generics, type-parameter, fill

## J34-02 · Kod çıktısı
Konu: Generic sınıflar
Soru: Kodun çıktısını yazın.
Kod:
```java
class Box<T> {
    private T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
}
Box<String> word = new Box<>("Java");
Box<Integer> number = new Box<>(42);
System.out.println(word.get() + " " + number.get());
```
Cevap: Java 42
Büyük/küçük harf duyarlı: evet
İpucu: Her Box kullanımı kendi type argument'ıyla tip güvenli değer döndürür.
Kısa açıklama: `Java 42` yazdırılır.
Açıklama: word.get derleme zamanında String, number.get Integer döndürür. String birleştirme bağlamında Integer metne çevrilir. Çağıran açık cast yazmaz ve raw type uyarısı oluşmaz.
Varsayım: Kod aynı geçerli çevrede çalışır; diamond inference Java 7+ ile kullanılabilir.
Etiketler: generics, box, type-safety, output

# J35 · Orta · Hata bulma

Raw type kullanımından doğan problemi bulun ve kodu tip güvenli hâle getirin.

```java
List values = new ArrayList();
values.add("Java");
values.add(42);

String first = (String) values.get(1);
```

## J35-01 · Tek seçim
Konu: Raw type ve tip güvenliği
Soru: Kod derleme uyarıları göz ardı edilip çalıştırılırsa son satırda ne olur?
Kod:
```java
List values = new ArrayList();
values.add("Java");
values.add(42);
String first = (String) values.get(1);
```
Şıklar:
- [ ] a: first değeri "42" olur
  Neden: Cast biçim dönüştürme değildir.
- [x] b: ClassCastException oluşur
  Neden: Doğru runtime hatasıdır.
- [ ] c: Integer otomatik String'e çevrilir
  Neden: Cast otomatik toString çağırmaz.
- [ ] d: IndexOutOfBoundsException oluşur
  Neden: İki eleman olduğundan indeks 1 geçerlidir.
İpucu: 1. indeksteki nesne autobox edilmiş Integer'dır.
Kısa açıklama: Integer nesnesi String'e cast edilemediği için ClassCastException oluşur.
Açıklama: Raw List farklı türleri kabul eder ve get sonucu Object olarak görünür. 42 autoboxing ile Integer olur. Explicit String cast derlenir ama runtime type kontrolünde başarısız olur. İndeks 1 geçerlidir.
Varsayım: Unchecked/raw type derleme uyarıları hata olarak yapılandırılmamıştır; kod çalıştırılır.
Etiketler: raw-type, classcastexception, generics

## J35-02 · Tek seçim
Konu: Raw type ve tip güvenliği
Soru: Liste yalnız String saklamalıysa en tip güvenli düzeltme hangisidir?
Şıklar:
- [x] a: `List<String> values = new ArrayList<>();` kullanıp 42 eklemesini kaldırmak veya metne çevirmek
  Neden: Doğru compile-time güvenliktir.
- [ ] b: Raw List'i koruyup her `get` sonucunu String'e cast etmek
  Neden: Raw type riskini sürdürür.
- [ ] c: `List<Object>` kullanıp her `get` sonucunu `(String)` ile cast etmek; 42 eklenirse hata çalışma zamanında yakalanır
  Neden: Tip güvenliği derleme zamanından çalışma zamanına kayar; gereksinim karşılanmaz.
- [ ] d: `List<int>` kullanmak
  Neden: Primitive generic type argument geçersizdir.
İpucu: Yanlış türün eklenmesini derleme zamanında engelleyin.
Kısa açıklama: `List<String>` generic bildirimi yalnız String eklenmesini sağlar.
Açıklama: Generic tür bilgisi `add` çağrısında Integer'ı reddeder ve `get` sonucunu String olarak verir. Raw/Object çözümleri gereksiz cast ve runtime riskini korur. Generics primitive type argument kabul etmez.
Varsayım: Gereksinim listenin heterojen değil yalnız String olmasıdır.
Etiketler: generics, list, type-safety

# J36 · Orta · Hata bulma

Listeyi dolaşırken eleman silmenin neden sorun çıkarabileceğini açıklayın ve güvenli bir çözüm yazın.

```java
List<String> names =
        new ArrayList<>(Arrays.asList("Ali", "Ayşe", "Ahmet"));

for (String name : names) {
    if (name.startsWith("A")) {
        names.remove(name);
    }
}
```

## J36-01 · Tek seçim
Konu: Koleksiyon dolaşırken silme
Soru: Kod standart ArrayList ile çalıştırıldığında tipik olarak ne olur?
Kod:
```java
List<String> names = new ArrayList<>(Arrays.asList("Ali", "Ayşe", "Ahmet"));
for (String name : names) {
    if (name.startsWith("A")) {
        names.remove(name);
    }
}
```
Şıklar:
- [ ] a: Tüm öğeler güvenle silinir
  Neden: Iterator protokolü ihlal edilir.
- [x] b: Iterator dışından yapısal değişiklik nedeniyle ConcurrentModificationException oluşur
  Neden: Doğru standart fail-fast davranıştır.
- [ ] c: Kod yalnız birden fazla thread listeyi aynı anda değiştirirse hata verir; tek thread'de güvenlidir
  Neden: Tek thread'de de for-each sırasında yapılan yapısal değişiklik ConcurrentModificationException tetikler.
- [ ] d: String immutable olduğu için derlenmez
  Neden: Liste yapısı mutable'dır; sorun String mutability değildir.
İpucu: Enhanced for, arka planda Iterator kullanır.
Kısa açıklama: List.remove, aktif iterator'ın beklediği modCount'u bozar ve fail-fast hata doğurur.
Açıklama: Enhanced for ArrayList iterator'ıyla yürür. Iterator'ın kendi remove'u dışında listede yapısal değişiklik yapılınca sonraki iterator işlemi modCount uyuşmazlığını görür ve best-effort ConcurrentModificationException atar. Adı concurrency olsa da tek thread'de de olur.
Varsayım: Standart java.util.ArrayList iterator'ı ve verilen üç öğe kullanılır; fail-fast mekanizması program doğruluğu için garanti edilen senkronizasyon değildir.
Etiketler: concurrentmodificationexception, iterator, remove

## J36-02 · Çoklu seçim
Konu: Koleksiyon dolaşırken silme
Soru: `startsWith("A")` olan adları ArrayList'ten güvenle silen yaklaşımları seçin.
Şıklar:
- [x] a: `names.removeIf(name -> name.startsWith("A"));`
  Neden: Doğru Java 8 çözümüdür.
- [x] b: Explicit Iterator ile dolaşıp eşleşmede `iterator.remove()` çağırmak
  Neden: Doğru iterator protokolüdür.
- [ ] c: Enhanced for içinde `names.remove(name)` çağırmak
  Neden: Fail-fast ihlaldir.
- [x] d: İndeksle sondan başa dolaşıp eşleşen indeksi silmek
  Neden: Doğru indeks kayması kontrolüdür.
- [ ] e: Her turda listeyi null yapmak
  Neden: Gereksinimi karşılamaz ve sonraki erişimleri bozar.
İpucu: Silme işlemi iterator protokolüyle veya indeks kaymasını kontrol eden bir yönle yapılmalı.
Kısa açıklama: removeIf, Iterator.remove ve sondan indeksli silme güvenli kalıplardır.
Açıklama: removeIf koleksiyonun kendi toplu işlemini kullanır. Iterator.remove son dönen öğeyi iterator ile uyumlu siler. Sondan başa indeksleme, silmenin henüz ziyaret edilmemiş daha küçük indeksleri kaydırmamasını sağlar.
Varsayım: names mutable ArrayList'tir ve null eleman içermez.
Etiketler: removeif, iterator, arraylist

# J37 · Zorlayıcı · Generics

`List<? extends Number>` ile `List<? super Integer>` arasındaki farkı açıklayın. Hangi yapıya güvenle veri eklenebileceğini ve hangisinden hangi tipte veri okunabileceğini kod üzerinden gösterin.

## J37-01 · Eşleştirme
Konu: Generic wildcard PECS
Soru: Wildcard listelerini güvenli okuma/ekleme özellikleriyle eşleştirin. null ekleme özel durumu dışarıda bırakılmıştır.
Eşleşmeler:
- extread: `List<? extends Number>` içinden okuma => r1: Güvenle Number olarak okunur
- extwrite: `List<? extends Number>` içine non-null sayı ekleme => r2: Somut alt tip bilinmediği için güvenli değildir
- superread: `List<? super Integer>` içinden okuma => r3: Güvenle yalnız Object olarak okunur
- superwrite: `List<? super Integer>` içine ekleme => r4: Integer güvenle eklenir
Fazladan seçenekler:
- decoy: Herhangi bir Number alt tipi güvenle eklenir
İpucu: Producer extends, consumer super (PECS).
Kısa açıklama: `? extends Number` üreticidir; `? super Integer` tüketicidir.
Açıklama: `? extends Number` gerçekte `List<Integer>`, `List<Double>` vb. olabilir; okunan her öğe Number'dır ama hangi alt tip beklendiği bilinmediğinden non-null eklenemez. `? super Integer` Integer veya üst tip listesi olduğundan Integer kabul eder; okuma ise yalnız Object garantiler.
Varsayım: Listeler null değildir; wildcard listesine her durumda teknik olarak eklenebilen null, soruda açıkça kapsam dışıdır.
Etiketler: generics, wildcard, pecs

## J37-02 · Çoklu seçim
Konu: Generic wildcard PECS
Soru: Aşağıdaki işlemlerden derleme zamanı açısından geçerli olanları seçin.
Kod:
```java
List<? extends Number> source = new ArrayList<Integer>();
List<? super Integer> target = new ArrayList<Number>();
```
Şıklar:
- [x] a: `Number n = source.get(0);`
  Neden: Geçerli üst sınır okumasıdır; çalışma zamanında liste boşsa ayrı olarak IndexOutOfBounds olabilir.
- [ ] b: `source.add(1);`
  Neden: Derlenmez; capture tipi bilinmez.
- [x] c: `target.add(1);`
  Neden: Derlenir; Integer alt sınır sözleşmesine uygundur.
- [ ] d: `Integer i = target.get(0);`
  Neden: Derlenmez; okuma static olarak Object'tir.
- [x] e: `Object o = target.get(0);`
  Neden: Derlenir; Object her olası öğenin üst tipidir.
İpucu: `source`'un alt tipi, `target`'ın üst tipi tam olarak bilinmiyor.
Kısa açıklama: `source` Number üretir; `target` Integer tüketir ve Object üretir.
Açıklama: `source.get`'in static tipi Number'dır. `source.add(1)`, `source`'un `List<Double>` olabilme olasılığı nedeniyle reddedilir. `target` Integer eklemeyi kabul eder; ancak `get` sonucu Integer garantili değildir, çünkü hedef `List<Object>` olabilir ve başka Object'ler içerebilir.
Varsayım: Soru yalnız tip kontrolünü ölçer; `source.get(0)` çalışma zamanında boş liste nedeniyle hata verebilir fakat statement derlenir.
Etiketler: extends, super, compile-time, pecs

# J38 · Zorlayıcı · Kod okuma

Değişkenlerin, referansların ve nesnelerin stack veya heap ile ilişkisini açıklayın.

```java
class User {
    String name;
}

static void createUser() {
    int age = 22;
    User user = new User();
    user.name = "Deniz";
}
```

## J38-01 · Eşleştirme
Konu: Stack ve heap
Soru: Yaygın JVM'in kavramsal bellek modelinde öğeleri ilişkileriyle eşleştirin.
Kod:
```java
class User { String name; }
static void createUser() {
    int age = 22;
    User user = new User();
    user.name = "Deniz";
}
```
Eşleşmeler:
- age: Yerel primitive `age` => r1: Metot çağrı çerçevesindeki yerel değer
- userref: Yerel `user` referans değişkeni => r2: Çağrı çerçevesindeki, nesneye erişen referans değeri
- userobj: `new User()` nesnesi => r3: Heap'te erişilebilir nesne
- namefield: User içindeki `name` alanı => r4: User nesnesinin parçası olan ve String'e referans tutan alan
Fazladan seçenekler:
- decoy: Metot alanında tutulan sınıf meta verisi
İpucu: Referans değişkeni ile gösterdiği nesneyi ayrı düşünün.
Kısa açıklama: Yerel değerler frame ile, nesne ve alanları heap nesnesiyle ilişkilidir.
Açıklama: Pedagojik JVM modelinde method invocation bir frame oluşturur; age ve user değişken değerleri frame'dedir. new User nesnesi heap'tedir. name alanı User nesnesinin durumudur ve intern edilmiş/heap'teki String nesnesine referans taşır. JVM kaçış analiziyle fiziksel yerleşimi optimize edebilir.
Varsayım: Bu eşleştirme kavramsal JVM modelidir; Java Language Specification fiziksel stack/heap yerleşimini program tarafından gözlenebilir bir garanti yapmaz.
Etiketler: stack, heap, reference, object

## J38-02 · Doğru / Yanlış
Konu: Stack ve heap
Soru: Bir reference değişkeni ile onun gösterdiği nesne aynı şey değildir; yerel referansın kapsamdan çıkması, nesnenin ancak başka erişilebilir referans yoksa GC adayı olmasına katkı verir.
Şıklar:
- [x] Doğru
  Neden: Doğru reachability ayrımıdır.
- [ ] Yanlış
  Neden: Referans ve nesneyi özdeş saymak bellek modelini yanlış yorumlar.
İpucu: GC değişken kapsamından çok nesne erişilebilirliğine bakar.
Kısa açıklama: Doğru. Referans bir erişim değeri, nesne ayrı bir runtime varlığıdır.
Açıklama: createUser döndüğünde yerel user artık root değildir. User nesnesine başka bir erişim yolu yoksa erişilemez hâle gelir ve GC için uygun olur. Uygun olmak anında toplanacağı veya fiziksel yerleşimin kesinlikle heap olduğu garantisi değildir.
Varsayım: User referansı metottan döndürülmez, static/instance alana yazılmaz ve başka bir canlı yapıya sızdırılmaz.
Etiketler: reference, scope, gc, reachability

# J39 · Zorlayıcı · Kod okuma

Hangi nesnelerin Garbage Collector için uygun hâle geldiğini “ulaşılabilirlik” kavramıyla açıklayın.

```java
Object first = new Object();
Object second = new Object();

first = second;
second = null;
```

## J39-01 · Tek seçim
Konu: Garbage collection erişilebilirliği
Soru: Kod tamamlandıktan hemen sonra, iki başlangıç nesnesinden hangisi GC için erişilemez hâle gelmiştir?
Kod:
```java
Object first = new Object();   // nesne A
Object second = new Object();  // nesne B
first = second;
second = null;
```
Şıklar:
- [x] a: Yalnız nesne A
  Neden: Doğru reachability sonucudur.
- [ ] b: Yalnız nesne B
  Neden: B first üzerinden canlıdır.
- [ ] c: Hem A hem B
  Neden: B erişilebilir olduğu için yanlış.
- [ ] d: Hiçbiri
  Neden: A'nın hiçbir yolu kalmamıştır.
İpucu: `first = second` sonrasında A'ya giden yolu ve B'ye kalan yolu izleyin.
Kısa açıklama: Nesne A erişilemez; B hâlâ first üzerinden erişilebilirdir.
Açıklama: first yeniden B referans değeriyle yazılınca A'ya giden tek referans kaybolur. Ardından second null olsa da first B'yi göstermeye devam eder. Dolayısıyla yalnız A GC için uygundur.
Varsayım: A veya B'ye başka alan, koleksiyon, JNI ya da runtime kökü üzerinden referans yoktur; değişkenler bu satırdan sonra hâlâ kapsam içindedir.
Etiketler: gc, reachability, reference

## J39-02 · Doğru / Yanlış
Konu: Garbage collection erişilebilirliği
Soru: Bir nesnenin GC için uygun hâle gelmesi, o satırın hemen ardından belleğinin kesin olarak geri alınacağı anlamına gelir.
Şıklar:
- [ ] Doğru
  Neden: GC zamanlaması deterministik değildir.
- [x] Yanlış
  Neden: Doğru; eligible ile collected farklıdır.
İpucu: Uygunluk ile koleksiyonun zamanlamasını ayırın.
Kısa açıklama: Yanlış. Erişilemezlik yalnız toplanabilirlik sağlar; zamanlama garanti değildir.
Açıklama: Garbage collector ne zaman çalışacağına JVM politikasıyla karar verir. `System.gc()` bile genellikle yalnız bir istektir. Program doğruluğu, finalization veya kaynak kapatma için GC'nin belirli zamanda çalışmasına bağlanmamalıdır.
Varsayım: Normal JVM garbage collection davranışı kastedilir; process sonlandırılması ayrı bir durumdur.
Etiketler: gc, nondeterminism, eligibility

# J40 · Zorlayıcı · Kod yazma

`Candidate` nesnelerinin yalnızca `id` alanına göre eşit kabul edilmesini sağlayan `equals()` ve `hashCode()` metotlarını yazın. Sözleşmenin bozulmasının `HashSet` ve `HashMap` üzerindeki etkisini açıklayın.

## J40-01 · Tek seçim
Konu: equals ve hashCode sözleşmesi
Soru: Candidate nesneleri yalnız `id` alanına göre eşit olacaksa en doğru Java 8 uygulaması hangisidir? `id` constructor'da atanmış `final int`'tir.
Şıklar:
- [x] a: `public boolean equals(Object o) { if (this == o) return true; if (!(o instanceof Candidate)) return false; Candidate c=(Candidate)o; return id==c.id; } public int hashCode() { return Integer.hashCode(id); }`
  Neden: Doğru ve sözleşmeyle uyumludur.
- [ ] b: `public boolean equals(Object o) { if (this == o) return true; if (!(o instanceof Candidate)) return false; Candidate c=(Candidate)o; return id==c.id; } public int hashCode() { return Objects.hash(id, System.identityHashCode(this)); }`
  Neden: `hashCode` nesne kimliğini kattığı için eşit iki Candidate farklı hash üretebilir; hash sözleşmesi bozulur.
- [ ] c: `equals` override edilmez; `public int hashCode() { return id; }`
  Neden: Eşitliği `id` bazlı yapmaz.
- [ ] d: `public boolean equals(Candidate c) { return id==c.id; }` ve `public int hashCode(){ return 1; }`
  Neden: `Object.equals`'i override etmez; yalnız overload eder.
İpucu: Object imzasını override edin; null/tür kontrolü yapın ve aynı alanı `hashCode`'da kullanın.
Kısa açıklama: A, `Object.equals`'i güvenle override eder ve `hashCode`'u `id` ile tutarlı kurar.
Açıklama: Kimlik kısa yolu refleksiviteyi hızlı karşılar. `instanceof` null için false döner ve güvenli cast sağlar. `id` eşitliği değer ölçütüdür. Eşit `id`'ler aynı `Integer.hashCode` üretir. `equals(Candidate)` overload olur, `Object.equals` override'ı olmaz.
Varsayım: Candidate final sınıftır veya alt sınıf eşitliği ayrıca kısıtlanmıştır; `id` immutable'dır.
Varsayım: `Integer.hashCode(int)` Java 8'de mevcuttur.
Etiketler: equals, hashcode, candidate, immutable-key

## J40-02 · Çoklu seçim
Konu: equals ve hashCode sözleşmesi
Soru: equals/hashCode sözleşmesi hakkında doğru ifadeleri seçin.
Şıklar:
- [x] a: x.equals(x) true olmalıdır (x null değilken)
  Neden: Refleksivite kuralıdır.
- [x] b: x.equals(y) true ise y.equals(x) de true olmalıdır
  Neden: Simetri kuralıdır.
- [x] c: equals ile eşit nesneler aynı hashCode'u üretmelidir
  Neden: Hash sözleşmesidir.
- [ ] d: Aynı hashCode üreten nesneler mutlaka equals ile eşit olmalıdır
  Neden: Yanlış; collision serbesttir.
- [x] e: x.equals(null) false olmalıdır
  Neden: Non-null nesne için gereklidir.
İpucu: Hash collision mümkündür; sözleşme tek yönde zorunludur.
Kısa açıklama: Refleksivite, simetri, null-false ve eşit nesnelerde aynı hash zorunludur; aynı hash eşitlik garantilemez.
Açıklama: equals ayrıca transitif ve tutarlı olmalıdır. hashCode, eşitlikte kullanılan durum değişmediği sürece tutarlı olmalıdır. Collision nedeniyle farklı nesneler aynı hash'i paylaşabilir. Sözleşme bozulursa HashSet duplicate/contains ve HashMap get/remove beklenmedik davranabilir.
Varsayım: equals normal Java Object sözleşmesini uygulamak üzere tasarlanır; proxy/framework özel eşitlikleri kapsam dışıdır.
Etiketler: equals-contract, hashcode-contract, hash-collections

# J41 · Zorlayıcı · Kod okuma

Bir `HashMap` anahtarı eklendikten sonra eşitlikte kullanılan alanının değiştirilmesi aramayı nasıl etkileyebilir?

```java
class Key {
    int id;

    Key(int id) {
        this.id = id;
    }

    // equals() ve hashCode() id alanını kullanıyor.
}

Key key = new Key(1);
Map<Key, String> map = new HashMap<>();
map.put(key, "value");

key.id = 2;
System.out.println(map.get(key));
```

## J41-01 · Kod çıktısı
Konu: Mutable HashMap anahtarı
Soru: `equals` ve `hashCode` yalnız `id`'yi kullanıyor ve `hashCode` `Integer.hashCode(id)` döndürüyor. Standart HashMap'te kodun çıktısını yazın.
Kod:
```java
Key key = new Key(1);
Map<Key, String> map = new HashMap<>();
map.put(key, "value");
key.id = 2;
System.out.println(map.get(key));
```
Cevap: null
Büyük/küçük harf duyarlı: evet
İpucu: Entry eklenirken hesaplanan hash/bucket, anahtar nesnesinin içinde sonradan otomatik güncellenmez.
Kısa açıklama: `null` yazdırılır; mutasyondan sonra arama farklı hash ile yapılır.
Açıklama: `put` sırasında `id = 1` hash'i entry'de saklanır ve bucket seçer. `id = 2` olduktan sonra `get` yeni hash hesaplar; saklı entry'nin hash'iyle eşleşmez ve entry bulunamaz. Nesne map'in içinde fiziksel olarak kalabilir fakat normal anahtarla erişilemez hâle gelir.
Varsayım: `Key.hashCode` tam olarak `Integer.hashCode(id)`, `equals` ise `id` bazlıdır; `id` 1 ve 2 farklı yayılmış hash üretir; map'te başka eş anahtar/değer yoktur.
Etiketler: hashmap, mutable-key, hashcode, output

## J41-02 · Tek seçim
Konu: Mutable HashMap anahtarı
Soru: HashMap anahtarında bu sorunu en sağlam biçimde önleyen tasarım hangisidir?
Şıklar:
- [x] a: Eşitlik/hashCode'da kullanılan id'yi final yapıp anahtarı immutable tasarlamak
  Neden: Doğru temel tasarım kuralıdır.
- [ ] b: Anahtarı ekledikten sonra hashCode metodunu rastgele değer döndürecek biçimde değiştirmek
  Neden: Aramayı daha da kararsız yapar.
- [ ] c: Her get öncesi id'yi artırmak
  Neden: Her aramada farklı bucket seçer.
- [ ] d: equals'i kaldırıp yalnız mutable hashCode bırakmak
  Neden: Sözleşmeyi ve değer eşitliğini bozabilir.
İpucu: Anahtar map içindeyken hash/eşitlik durumu sabit kalmalı.
Kısa açıklama: Eşitlikte kullanılan alanların immutable olması hash koleksiyonlarını güvenli kılar.
Açıklama: HashMap entry'yi her anahtar mutasyonunda otomatik yeniden bucket'lamaz. Bu nedenle anahtarın equals/hashCode'a katılan state'i değişmemelidir. Değişim zorunluysa eski anahtar remove edilip yeni anahtarla tekrar put yapılmalıdır.
Varsayım: Anahtar değer semantiği id'ye bağlıdır; identity-based özel map gereksinimi yoktur.
Etiketler: immutable, map-key, hashmap

# J42 · Zorlayıcı · Kod yazma

`String name` ve `List<String> roles` alanlarına sahip gerçekten immutable bir `User` sınıfı tasarlayın. Mutable listenin dışarıdan değiştirilmesini engelleyin.

## J42-01 · Tek seçim
Konu: Immutable sınıf tasarımı
Soru: Java 8'de `User(String name, List<String> roles)` sınıfını gerçekten immutable yapmaya en uygun yaklaşım hangisidir?
Şıklar:
- [x] a: Sınıfı `final`, alanları `private final` yap; constructor'da `this.roles = Collections.unmodifiableList(new ArrayList<>(roles));`; getter'da bu değiştirilemez listeyi döndür
  Neden: Doğru Java 8 defensive-copy kalıbıdır.
- [ ] b: Sınıfı `final`, alanları `private final` yap; constructor'da `this.roles = roles;` ata, getter'da her seferinde `Collections.unmodifiableList(roles)` döndürerek yalnız okunur görünüm ver
  Neden: Kopya alınmadığı için çağıran elindeki `roles` listesini değiştirerek nesnenin iç durumunu değiştirebilir.
- [ ] c: `roles` getter'ında doğrudan mutable internal ArrayList döndür
  Neden: Getter iç durumu mutasyona açar.
- [ ] d: Sınıfı `final` yap ama `roles` alanını `public` bırak
  Neden: Public liste doğrudan değiştirilebilir.
İpucu: Hem constructor'a verilen listenin alias'ını hem getter üzerinden mutasyonu kapatın.
Kısa açıklama: Defensive copy + unmodifiable görünüm, mutable listenin iki dış erişim yolunu da kapatır.
Açıklama: Constructor yalnız `unmodifiableList(roles)` yapsaydı çağıran orijinal listeyi değiştirerek iç durumu etkileyebilirdi. Önce `new ArrayList` ile snapshot alınır, sonra dış mutasyon kapatılır. `final` sınıf override ile state sızdırılmasını; `private final` alanlar yeniden atamayı engeller. String zaten immutable'dır.
Varsayım: Constructor `Objects.requireNonNull` ile `name` ve `roles` null durumunu reddeder; `roles` içinde null kabul politikası ayrıca seçilebilir.
Varsayım: Role elemanları String olduğu için eleman düzeyinde deep copy gerekmez.
Etiketler: immutability, defensive-copy, unmodifiable-list

## J42-02 · Çoklu seçim
Konu: Immutable sınıf tasarımı
Soru: Mutable bir `List<String>` alanı bulunan immutable sınıf için gerekli/uygun önlemleri seçin.
Şıklar:
- [x] a: Alanı private final yapmak
  Neden: Durum erişimini ve yeniden bağlamayı sınırlar.
- [x] b: Constructor girdisinin defensive copy'sini almak
  Neden: Girdi alias'ını keser.
- [x] c: Getter'dan mutable iç listeyi doğrudan döndürmemek
  Neden: Çıktı alias'ı üzerinden mutasyonu önler.
- [x] d: Sınıfın kontrolsüz alt sınıfla davranış/state sızdırmasını engellemek için final yapmak
  Neden: Kalıtım yüzeyini kapatır.
- [ ] e: Yalnız referansı final yapmak; başka önleme gerek yok
  Neden: Nesne hâlâ mutable olduğundan yetersizdir.
İpucu: İç state'e giren ve çıkan bütün alias yollarını düşünün.
Kısa açıklama: Alan kapsülleme, giriş/çıkış kopyalama-koruma ve kalıtım kontrolü birlikte gerekir.
Açıklama: final referans yeniden atanmayı önler ama nesneyi dondurmaz. Constructor alias'ı defensive copy ile kesilir. Getter unmodifiable görünüm veya yeni kopya döndürür. final sınıf, override edilen getter veya ek mutasyon davranışlarıyla sözleşmenin bozulmasını önleyen basit yaklaşımdır.
Varsayım: List elemanları immutable String'dir; nested mutable elemanlar olsaydı daha derin kopyalama politikası gerekirdi.
Etiketler: immutable-class, encapsulation, defensive-copy

# J43 · Zorlayıcı · Kod okuma

`run()` ve `start()` çağrıları arasındaki farkı açıklayın.

```java
Thread worker = new Thread(() ->
        System.out.println(Thread.currentThread().getName())
);

worker.run();
worker.start();
```

## J43-01 · Kod çıktısı
Konu: Thread start ve run
Soru: Kod bir main thread içinde çalışıyor. Standart çıktıyı satır sırasıyla yazın.
Kod:
```java
Thread.currentThread().setName("caller");
Thread worker = new Thread(
    () -> System.out.println(Thread.currentThread().getName()),
    "worker"
);
worker.run();
worker.start();
worker.join();
```
Cevap:
```
caller
worker
```
Büyük/küçük harf duyarlı: evet
İpucu: run normal metot çağrısıdır; start yeni thread planlar. join tamamlanmayı bekler.
Kısa açıklama: run çağrısı caller'da, start ile başlayan görev worker thread'inde çalışır.
Açıklama: `worker.run()` doğrudan senkron metot çağrısıdır ve currentThread caller'dır. `worker.start()` JVM'den yeni thread başlatmasını ister; o thread run gövdesini yürütür ve adı worker'dır. join, programın ikinci satır tamamlanmadan ilerlememesini sağlar.
Varsayım: setName izni vardır; start başarıyla gerçekleşir; InterruptedException çevreleyen main tarafından bildirilmiş/yakalanmıştır.
Etiketler: thread, run, start, join, output

## J43-02 · Eşleştirme
Konu: Thread start ve run
Soru: Thread çağrılarını etkileriyle eşleştirin.
Eşleşmeler:
- run: worker.run() => r1: Çağıran thread'de normal metot çağrısı
- start: worker.start() => r2: Yeni thread yaşam döngüsünü başlatır ve run orada yürür
- join: worker.join() => r3: Çağıran thread worker'ın bitmesini bekler
- restart: Tamamlanmış aynı worker üzerinde ikinci start() => r4: IllegalThreadStateException
Fazladan seçenekler:
- decoy: Thread'i hemen durdurur ve kilitlerini bırakır
İpucu: Bir Thread nesnesi yalnız bir kez start edilebilir.
Kısa açıklama: run çağrıdır; start yeni yürütmedir; join bekler; aynı Thread yeniden başlatılamaz.
Açıklama: start happens-before ve lifecycle kurallarını kurar. run'ı elle çağırmak yeni thread oluşturmaz. join bekleyen thread'i bloklayabilir ve InterruptedException atabilir. Tekrar iş çalıştırmak için yeni Thread veya executor görevi gerekir.
Varsayım: Etiketsiz normal java.lang.Thread API'si kullanılır; virtual thread gibi Java 21 özellikleri kapsam dışıdır.
Etiketler: thread-lifecycle, start, run, join

# J44 · Zorlayıcı · Hata bulma

İki thread aynı sayacı artırdığında sonuç neden beklenenden farklı olabilir? Race condition’ı ve temel çözüm seçeneklerini açıklayın.

```java
class Counter {
    int value = 0;

    void increment() {
        value++;
    }
}
```

## J44-01 · Tek seçim
Konu: Race condition
Soru: İki thread aynı Counter üzerinde `increment()` çağırdığında artışların kaybolabilmesinin temel nedeni nedir?
Kod:
```java
class Counter {
    int value = 0;
    void increment() { value++; }
}
```
Şıklar:
- [x] a: `value++` atomik bir işlem değildir
  Neden: Doğru lost-update yarışıdır.
- [ ] b: int yalnız tek thread'de kullanılabilen bir tiptir
  Neden: int thread'e bağlı değildir.
- [ ] c: Her thread `increment` çağırırken Counter nesnesinin ayrı bir kopyasını alır; artışlar farklı kopyalara yazılır
  Neden: Thread'ler aynı nesne referansını paylaşır; Java metot çağrısında nesneyi kopyalamaz.
- [ ] d: Metot void olduğu için artış uygulanmaz
  Neden: void yalnız dönüş değeri olmadığını belirtir.
İpucu: Her thread aynı eski değeri okuyup aynı yeni değeri yazabilir.
Kısa açıklama: `value++` birleşik ve atomik olmayan bir read-modify-write işlemidir.
Açıklama: İki thread ikisi de örneğin 5 okuyabilir, 6 hesaplayabilir ve 6 yazabilir; iki çağrıdan yalnız bir net artış görünür. Ayrıca uygun synchronization olmadan visibility garantisi de yoktur. int tek okuma/yazmanın atomik olması, `++` işleminin tamamını atomik yapmaz.
Varsayım: Aynı Counter nesnesi birden çok thread tarafından paylaşılır; external synchronization yoktur.
Etiketler: race-condition, atomicity, visibility

## J44-02 · Çoklu seçim
Konu: Race condition
Soru: Paylaşılan sayacı thread-safe artırabilecek temel çözümleri seçin.
Şıklar:
- [x] a: `synchronized void increment() { value++; }`
  Neden: Doğru monitor korumasıdır.
- [x] b: `AtomicInteger` kullanıp `incrementAndGet()` çağırmak
  Neden: Doğru atomik API'dir.
- [x] c: Tüm erişimleri aynı `ReentrantLock` ile korumak ve finally'da unlock yapmak
  Neden: Doğru, aynı lock disipliniyle.
- [ ] d: Alanı yalnız `volatile int` yapmak ve `value++` kullanmaya devam etmek
  Neden: Yetersiz; ++ atomik olmaz.
- [ ] e: Thread'lere rastgele sleep eklemek
  Neden: Zamanlamayı değiştirir ama doğruluk garantisi vermez.
İpucu: Çözüm tüm read-modify-write işlemini tek kritik işlem yapmalı.
Kısa açıklama: synchronized, AtomicInteger veya doğru Lock kullanımı atomikliği sağlar; volatile tek başına ++ için yetmez.
Açıklama: synchronized ve ReentrantLock karşılıklı dışlama ile hem atomiklik hem visibility kurar. AtomicInteger CAS tabanlı atomik artış sağlar. volatile yalnız tekil okuma/yazmaların görünürlüğünü ve sıralamasını iyileştirir; birleşik ++ kayıp güncellemeye açıktır. sleep bir senkronizasyon mekanizması değildir.
Varsayım: Sayaç okuma/sıfırlama gibi diğer tüm ilişkili işlemler de aynı synchronization politikasına uyar.
Etiketler: synchronized, atomicinteger, lock, volatile

# J45 · Zorlayıcı · Kod inceleme

Deadlock riskini değerlendirin. Riski azaltacak bir kilitleme yaklaşımı önerin.

```java
Object lockA = new Object();
Object lockB = new Object();

Thread first = new Thread(() -> {
    synchronized (lockA) {
        synchronized (lockB) {
            System.out.println("First");
        }
    }
});

Thread second = new Thread(() -> {
    synchronized (lockB) {
        synchronized (lockA) {
            System.out.println("Second");
        }
    }
});

first.start();
second.start();
```

## J45-01 · Doğru / Yanlış
Konu: Deadlock
Soru: İlk thread lockA'yı, ikinci thread lockB'yi aldıktan sonra her biri diğer kilidi beklerse verilen program deadlock'a girebilir.
Kod:
```java
// first: synchronized(lockA) { synchronized(lockB) { ... } }
// second: synchronized(lockB) { synchronized(lockA) { ... } }
```
Şıklar:
- [x] Doğru
  Neden: Uygun zamanlamada dört Coffman koşulu oluşur.
- [ ] Yanlış
  Neden: JVM ters sırayı otomatik tespit edip çözmez.
İpucu: Karşılıklı bekleme için kilit edinme sıralarını karşılaştırın.
Kısa açıklama: Doğru. Ters kilit sırası dairesel bekleme oluşturabilir.
Açıklama: first A'yı tutup B'yi beklerken second B'yi tutup A'yı bekleyebilir. synchronized kilitleri başka kilit beklerken otomatik bırakılmaz; iki thread de ilerleyemez. Deadlock mümkündür fakat her çalıştırmada oluşması garanti değildir.
Varsayım: lockA ve lockB farklı, null olmayan ortak nesnelerdir; başka kod kilitleri zorla bırakmaz.
Etiketler: deadlock, synchronized, circular-wait

## J45-02 · Sıralama
Konu: Deadlock
Soru: Global kilit sıralamasıyla deadlock riskini azaltan adımları sıraya koyun.
Sıra:
1. define: Tüm kilitler için tek bir global sıra tanımla (ör. A önce B)
2. first: Her thread önce sıradaki ilk kilidi A'yı alsın
3. second: Gerekliyse A tutulurken sonra B'yi alsın
4. work: Kritik işi yapıp içten dışa kilit kapsamlarından çıksın
İpucu: Dairesel beklemeyi kırmak için bütün kod yolları aynı sıralamaya uymalı.
Kısa açıklama: Tek global sıra belirlenip her yerde A→B uygulanırsa A↔B çevrimi oluşmaz.
Açıklama: Lock ordering dairesel bekleme koşulunu ortadan kaldırır. Yalnız bir thread'i düzeltmek yetmez; aynı kilit çiftine dokunan bütün yollar aynı düzene uymalıdır. synchronized bloklardan çıkarken monitor'lar lexical olarak içten dışa serbest kalır.
Varsayım: Uygulamadaki bu kilitleri alan tüm kod yolları tanımlanan sıraya uyar; callback'ler bilinmeyen ek kilitler almaz.
Etiketler: deadlock-prevention, lock-ordering, order

## J45-03 · Çoklu seçim
Konu: Deadlock
Soru: Deadlock riskini azaltan geçerli yaklaşımları seçin.
Şıklar:
- [x] a: Tüm kod yollarında tutarlı global kilit sırası kullanmak
  Neden: Doğru lock-ordering çözümüdür.
- [x] b: Mümkünse iki kaynağı tek bir ortak kilitle korumak
  Neden: Doğru sadeleştirmedir; throughput bedeli olabilir.
- [x] c: `ReentrantLock.tryLock` ile timeout/başarısızlıkta alınan kilitleri bırakıp yeniden denemek
  Neden: Doğru, başarısızlıkta kesin unlock ve backoff ile.
- [ ] d: Ters sırayı koruyup yalnız rastgele sleep eklemek
  Neden: Zamanlama hilesidir, cycle'ı ortadan kaldırmaz.
- [ ] e: Kilidi tutarken sınırsız bloklayan dış çağrılar yapmak
  Neden: Bekleme süresini ve bilinmeyen kilit bağımlılıklarını artırır.
İpucu: Dairesel beklemeyi kaldıran veya sonsuz beklemeyi geri alınabilir yapan yöntemleri seçin.
Kısa açıklama: Tutarlı sıra, tek kilit veya kontrollü tryLock stratejisi geçerli yaklaşımlardır.
Açıklama: Global sıra cycle'ı kırar. Tek kilit iç içe edinmeyi ortadan kaldırır fakat concurrency'yi azaltabilir. tryLock timeout ile ikinci kilit alınamazsa ilk kilit finally'da bırakılabilir; livelock/backoff da tasarlanmalıdır. sleep doğruluk sağlamaz, kilit altında dış/bloklayan çağrı riski artırır.
Varsayım: tryLock yaklaşımında edinilmiş her kilit finally ile bırakılır ve timeout/backoff sonsuz aktif döngü yaratmayacak biçimde tasarlanır.
Etiketler: deadlock, trylock, lock-ordering, concurrency
