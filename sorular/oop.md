<!-- OOP soruları. Biçim için README.md içindeki "Soru ekleme ve düzenleme" bölümüne bakın. -->

# O01 · Kolay · Teori

Class ile object arasındaki fark nedir? `Car` örneğinde hangisi şablon, hangisi çalışma zamanında oluşturulan örnektir?

## O01-01 · Tek seçim
Konu: Class ve Object
Soru: Car örneğinde class ile object ayrımını doğru açıklayan seçenek hangisidir?
Şıklar:
- [x] a: Car bir şablondur; new Car() ile çalışma zamanında oluşturulan değer bir object'tir.
  Neden: Doğru: şablon ve örnek ayrımı doğru kurulmuştur.
- [ ] b: Car çalışma zamanındaki nesnedir; new Car() ise sıradan bir metot çağrısıdır.
  Neden: new Car() sıradan bir metot çağrısı değil, nesne oluşturma ifadesidir.
- [ ] c: Class ve object aynı kavramdır; fark yazım biçimindedir.
  Neden: Class bir tür tanımı, object ise o türün örneğidir.
- [ ] d: Car c; gibi bir referans değişkeni tanımlamak yeni bir object oluşturur.
  Neden: Referans tanımlamak tek başına nesne oluşturmaz.
İpucu: Tanım ile bu tanımdan üretilen çalışma zamanı örneğini ayırın.
Kısa açıklama: Class, nesnelerin yapısını ve davranışını tanımlar; object bu tanımın çalışma zamanındaki örneğidir.
Açıklama: Car alanları, metotları ve kuralları tanımlayan sınıftır. new Car() heap üzerinde bir Car nesnesi oluşturur ve ifade bu nesneye bir referans üretir. Yalnızca Car car; yazmak ise nesne oluşturmaz.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: class, object, instance

# O02 · Kolay · Teori

Bir nesnenin state ve behavior özellikleri ne anlama gelir? Bir `BankAccount` nesnesi için örnekler verin.

## O02-01 · Çoklu seçim
Konu: State ve Behavior
Soru: Bir BankAccount nesnesinin state bilgisini temsil eden öğeleri seçin.
Şıklar:
- [x] ownerId: ownerId alanı
  Neden: Doğru: hesap sahibini tanımlayan veri state'tir.
- [x] balance: balance alanı
  Neden: Doğru: mevcut bakiye nesnenin state bilgisidir.
- [ ] deposit: deposit(amount) metodu
  Neden: deposit bir davranıştır.
- [ ] withdraw: withdraw(amount) metodu
  Neden: withdraw bir davranıştır.
İpucu: State nesnenin belirli bir andaki verisidir; behavior ise yapabildiği işlemdir.
Kısa açıklama: ownerId ve balance state; deposit ve withdraw behavior örnekleridir.
Açıklama: Alanlar hesabın belirli bir andaki durumunu taşır. Metotlar bu durum üzerinde kontrollü işlem yapan davranışları tanımlar. Çoklu seçim tam eşleşmeyle puanlanır.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: state, behavior, bank-account

## O02-02 · Kod çıktısı
Konu: State ve Behavior
Soru: deposit davranışı state'i değiştirdikten sonra ekrana ne yazılır?
Kod:
```java
class BankAccount {
    private int balance = 100;

    void deposit(int amount) {
        balance += amount;
    }

    int getBalance() {
        return balance;
    }
}

BankAccount account = new BankAccount();
account.deposit(25);
System.out.println(account.getBalance());
```
Cevap: 125
Büyük/küçük harf duyarlı: evet
İpucu: Başlangıç bakiyesine yatırılan tutarı ekleyin.
Kısa açıklama: deposit(25), balance değerini 100'den 125'e çıkarır.
Açıklama: balance nesnenin state'idir. deposit metodu bu state'i değiştiren behavior'dır; getBalance son durumu döndürür.
Varsayım: Kod tek iş parçacığında ve gösterilen sırayla çalışır.
Varsayım: Çıktının satır başı ve sonundaki boşluklar önemsenmez.
Etiketler: state, behavior, output

# O03 · Kolay · Kod okuma

İki referansın aynı nesneyi göstermesi kodun sonucunu nasıl etkiler?

```java
class Counter {
    int value;
}

Counter a = new Counter();
a.value = 5;

Counter b = a;
b.value++;

System.out.println(a.value);
System.out.println(a == b);
```

## O03-01 · Kod çıktısı
Konu: Nesne Referansları
Soru: İki referans aynı Counter nesnesini gösterirken kodun çıktısını satır sırasıyla yazın.
Kod:
```java
class Counter {
    int value;
}

Counter a = new Counter();
a.value = 5;
Counter b = a;
b.value++;

System.out.println(a.value);
System.out.println(a == b);
```
Cevap:
```
6
true
```
İpucu: b'ye yeni nesne değil, a'daki referans atanıyor.
Kısa açıklama: Her iki değişken aynı nesneyi gösterir; artış a üzerinden de görülür ve referans karşılaştırması true olur.
Açıklama: b = a ataması Counter nesnesini kopyalamaz. Aynı nesneye ikinci bir referans oluşturur. b.value++ ortak nesnenin value alanını 6 yapar; a == b aynı referansı karşılaştırdığı için true'dur.
Varsayım: Çıktı satır sırası korunarak değerlendirilir; satır kenarı boşlukları önemsenmez.
Etiketler: reference, aliasing, identity, output

## O03-02 · Doğru / Yanlış
Konu: Nesne Referansları
Soru: Counter b = a; ifadesi b için a'nın bağımsız bir kopyasını oluşturur; bu yüzden b.value değişikliği a.value üzerinden gözlenmez.
Şıklar:
- [ ] Doğru
  Neden: Yanlış: b için ayrı bir Counter nesnesi oluşturulmaz.
- [x] Yanlış
  Neden: Doğru: iki referans aynı nesneyi gösterir.
İpucu: Atama bir nesne kopyası mı, referans kopyası mı üretir?
Kısa açıklama: Yanlış. Atama referansı kopyalar; a ve b aynı nesneyi gösterir ve değişiklik ikisinden de görülür.
Açıklama: Java'da reference type değişken ataması nesnenin alanlarını kopyalamaz; referans değerini kopyalar. Bu nedenle iki değişken üzerinden de aynı mutable nesnenin state'i görülür.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: reference, aliasing, mutation

# O04 · Kolay · Teori

Constructor nedir ve normal bir metottan hangi yönleriyle ayrılır? Bir sınıfta constructor yazılmazsa ne olur?

## O04-01 · Çoklu seçim
Konu: Constructor
Soru: Java constructor'ları için doğru ifadeleri seçin.
Şıklar:
- [x] sameName: Adı sınıf adıyla aynıdır.
  Neden: Doğru: constructor sınıfla aynı adı taşır.
- [ ] noReturn: Dönüş tipi olarak void yazılmalıdır.
  Neden: Yanlış: constructor'a dönüş tipi yazılmaz; void yazılırsa aynı adlı sıradan bir metot olur.
- [x] newCall: Nesne oluşturulurken çalışır.
  Neden: Doğru: nesne oluşturma zincirinin parçası olarak çalışır.
- [ ] inherited: Alt sınıflar constructor'ı normal bir metot gibi miras alır.
  Neden: Yanlış: constructor'lar miras alınmaz.
İpucu: Constructor sözdizimini ve miras davranışını normal metotlarla karşılaştırın.
Kısa açıklama: Constructor sınıf adını taşır, dönüş tipi yoktur ve nesne kurulurken çalışır; miras alınmaz.
Açıklama: Constructor nesnenin ilk geçerli durumunu kurar. Alt sınıf constructor'ı super(...) ile üst constructor'ı çağırabilir ancak constructor üyeleri miras alınan metotlar değildir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: constructor, initialization

## O04-02 · Doğru / Yanlış
Konu: Constructor
Soru: Bir sınıfta hiçbir constructor bildirilmezse derleyici constructor eklemez; bu yüzden o sınıftan new ile nesne oluşturulamaz.
Şıklar:
- [ ] Doğru
  Neden: Yanlış: Java bu koşulda default constructor sağlar.
- [x] Yanlış
  Neden: Doğru: default constructor eklendiği için new ile nesne oluşturulabilir.
İpucu: Sınıfta hiç constructor yazılmadığında derleyici ne yapar?
Kısa açıklama: Yanlış. Hiç constructor yoksa derleyici parametresiz bir default constructor ekler.
Açıklama: Sınıfta hiç constructor bildirilmemişse derleyici parametresiz bir default constructor ekler; bu yüzden new ile nesne oluşturulabilir. Herhangi bir constructor açıkça bildirilirse derleyici artık parametresiz constructor üretmez. Default constructor'ın erişim düzeyi sınıfın erişim düzeyiyle aynıdır.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: constructor, default-constructor

# O05 · Kolay · Hata bulma

Kod neden derlenir veya derlenmez? Hem parametresiz hem isim alan nesneler oluşturmak için sınıfı düzenleyin.

```java
class User {
    User(String name) {
        System.out.println(name);
    }
}

User user = new User();
```

## O05-01 · Tek seçim
Konu: Constructor
Soru: Gösterilen sınıfta new User() ifadesinin derlenmemesinin nedeni nedir?
Kod:
```java
class User {
    User(String name) {
        System.out.println(name);
    }
}

User user = new User();
```
Şıklar:
- [x] a: Derleyici bu durumda User() eklemez.
  Neden: Doğru: new User() için uygun imza yoktur.
- [ ] b: Constructor içinde System.out.println kullanılamaz.
  Neden: println constructor içinde kullanılabilir.
- [ ] c: User sınıfı public olarak bildirilmediği için new User() ifadesi aynı paketten bile çağrılamaz.
  Neden: Paket erişimli sınıf aynı paketten oluşturulabilir; sorun eksik parametresiz constructor'dır.
- [ ] d: Java'da constructor overloading yasaktır.
  Neden: Constructor overloading geçerlidir.
İpucu: Derleyicinin default constructor'ı hangi koşulda sağladığını düşünün.
Kısa açıklama: Açık bir constructor bulunduğundan new User() ile eşleşecek parametresiz constructor yoktur.
Açıklama: User(String) bildirildiğinde otomatik User() üretilmez. Hem parametresiz hem isimli oluşturma isteniyorsa User() ayrıca yazılmalı ve gerekirse this(...) ile isimli constructor'a yönlendirilmelidir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: constructor, compile-error, default-constructor

## O05-02 · Boşluk doldurma
Konu: Constructor
Soru: Hem new User() hem new User("Ada") çağrılarının geçerli olması için eksik parametresiz constructor imzasını yazın. Yalnızca imzayı yazın.
Kod:
```java
class User {
    __________ {
        this("Misafir");
    }

    User(String name) {
        System.out.println(name);
    }
}
```
Cevap: User()
Kabul: User ()
Büyük/küçük harf duyarlı: evet
İpucu: Constructor'da dönüş tipi bulunmaz.
Kısa açıklama: Eksik imza User() biçimindedir.
Açıklama: User() parametresiz overload'dur ve ilk ifade olarak this("Misafir") ile User(String) constructor'ına yönlenir. Constructor adında büyük-küçük harf sınıf adıyla aynı olmalıdır.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: constructor, overloading, this

# O06 · Kolay · Teori

Encapsulation nedir? Alanları `private` yapıp otomatik getter ve setter eklemek neden her zaman yeterli değildir?

## O06-01 · Tek seçim
Konu: Encapsulation
Soru: Bir BankAccount sınıfında gerçek encapsulation'ı en iyi sağlayan tasarım hangisidir?
Şıklar:
- [x] a: balance private tutulur; deposit ve withdraw geçersiz tutarları reddedip invariant'ları korur.
  Neden: Doğru: veri gizleme ile iş kuralları birlikte korunur.
- [ ] b: balance private tutulur; setBalance gelen değeri kontrol etmeden doğrudan atar.
  Neden: Kuralsız setter invariant'ı korumaz.
- [ ] c: balance public tutulur; çağıranların kurallara uyması beklenir.
  Neden: Public mutable alan dış müdahaleyi engellemez.
- [ ] d: Alanlara kuralsız getter ve setter üretmek encapsulation için yeterlidir.
  Neden: Otomatik erişimciler tek başına davranış ve kural tasarımı değildir.
İpucu: Amaç yalnızca veriyi gizlemek değil, nesnenin geçerli kalmasını sağlamaktır.
Kısa açıklama: Encapsulation, state'e erişimi davranışlar üzerinden kontrol ederek sınıf kurallarını korur.
Açıklama: Private alan başlangıçtır; asıl değer kontrollü bir API'dedir. Kuralsız setBalance nesnenin negatif bakiye gibi geçersiz state'lere sokulmasına izin veriyorsa encapsulation hedefi karşılanmaz.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: encapsulation, invariant, bank-account

# O07 · Kolay · Kod yazma

Bakiyesi dışarıdan doğrudan değiştirilemeyen bir `BankAccount` sınıfı yazın. Para yatırma ve çekme kurallarını nesnenin içinde koruyun.

Örnek çözüm:
```java
class BankAccount {
    private int balance;  // Başlangıç bakiyesi 0; dışarıdan yalnız okunabilir.

    public boolean deposit(int amount) {
        if (amount <= 0) return false;
        balance += amount;
        return true;
    }

    public boolean withdraw(int amount) {
        // Kredili mevduat yok: bakiyeyi aşan çekim reddedilir, bakiye eksiye düşmez.
        if (amount <= 0 || amount > balance) return false;
        balance -= amount;
        return true;
    }

    public int getBalance() {
        return balance;
    }
}
```

## O07-01 · Çoklu seçim
Konu: Encapsulation ve Invariant
Soru: Başlangıç bakiyesi 0 olan, kredili mevduat sunmayan bir BankAccount için invariant'ı koruyan kuralları seçin.
Şıklar:
- [x] depositPositive: deposit tutarı sıfırdan büyük olmalıdır.
  Neden: Doğru: sıfır veya negatif yatırma reddedilir.
- [ ] withdrawPositive: withdraw sonrası bakiye sıfıra inecekse işlem reddedilmelidir.
  Neden: Yanlış: invariant bakiyenin negatife düşmemesidir; sıfır bakiye geçerli bir durumdur.
- [x] withinBalance: withdraw tutarı mevcut bakiyeyi aşmamalıdır.
  Neden: Doğru: kredili mevduat yoksa negatif bakiye engellenir.
- [ ] publicBalance: balance çağıran kodun hızlı değiştirmesi için public olmalıdır.
  Neden: Yanlış: public alan invariant'ı dış müdahaleye açar.
İpucu: Her başarılı işlemden sonra bakiyenin negatif olmaması ve anlamsız tutarların reddedilmesi gerekir.
Kısa açıklama: Pozitif tutar kontrolleri ve yeterli bakiye koşulu nesnenin kurallarını korur; sıfır bakiye geçerlidir.
Açıklama: Sınıf, geçersiz para yatırma/çekme girişlerini kendi sınırında reddetmelidir. balance alanını public yapmak tüm bu kuralları atlanabilir hâle getirir.
Varsayım: Hesap kredili mevduat veya eksi bakiye desteklemez.
Varsayım: Tutarlar kuruş hassasiyeti tartışılmadan tam sayı olarak ele alınır.
Etiketler: encapsulation, invariant, validation

## O07-02 · Kod çıktısı
Konu: Encapsulation ve Invariant
Soru: Sınıfın çekme kuralına göre kodun çıktısı nedir?
Kod:
```java
class BankAccount {
    private int balance = 100;

    boolean withdraw(int amount) {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }

    int getBalance() { return balance; }
}

BankAccount account = new BankAccount();
System.out.println(account.withdraw(120));
System.out.println(account.getBalance());
```
Cevap:
```
false
100
```
İpucu: Başarısız işlem state'i değiştirmez.
Kısa açıklama: 120 mevcut bakiyeyi aştığı için işlem false döner ve bakiye 100 kalır.
Açıklama: withdraw önce tüm önkoşulları sınar. Koşul sağlanmadığında balance güncellenmeden dönülür; böylece negatif bakiye invariant'ı korunur.
Varsayım: Kod tek iş parçacığında çalışır; çıktı satır sırası korunur.
Etiketler: encapsulation, invariant, output

# O08 · Kolay · Teori

Inheritance hangi problemi çözebilir? “Is-a” ilişkisini kullanarak uygun ve uygun olmayan birer kalıtım örneği verin.

## O08-01 · Tek seçim
Konu: Inheritance
Soru: Aşağıdaki ilişkilerden hangisi kalıtım için geçerli bir is-a örneğidir?
Şıklar:
- [x] a: Dog extends Animal
  Neden: Doğru: Dog, Animal'ın uzmanlaşmış bir türüdür.
- [ ] b: Car extends Engine
  Neden: Car bir Engine değildir; engine içerir.
- [ ] c: Order extends Customer
  Neden: Order bir Customer değildir.
- [ ] d: Library extends Book
  Neden: Library bir Book değildir; kitapları yönetir.
İpucu: Cümleyi 'X bir Y'dir' şeklinde okuyun.
Kısa açıklama: Dog bir Animal'dır; diğerleri has-a veya ilişki örnekleridir.
Açıklama: Kalıtım yalnızca alt tür üst türün sözleşmesine uyduğunda anlamlıdır. Arabanın motoru vardır, siparişin müşterisi vardır ve kütüphane kitapları içerir; bunlar composition/association ile modellenir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: inheritance, is-a, has-a

## O08-02 · Doğru / Yanlış
Konu: Inheritance
Soru: Car ile Engine ilişkisini Car extends Engine şeklinde modellemek yerine Car'ın bir Engine alanı tutması semantik olarak daha uygundur.
Şıklar:
- [x] Doğru
  Neden: Doğru: ilişki has-a niteliğindedir.
- [ ] Yanlış
  Neden: Yanlış: is-a ilişkisi kurulamadığı için kalıtım uygun değildir.
İpucu: Araba bir motor mudur, yoksa motora mı sahiptir?
Kısa açıklama: Doğru. Car has-an Engine ilişkisi composition ile ifade edilir.
Açıklama: Kalıtım substitutability gerektirir; bir Car, Engine beklenen her yerde anlamlı değildir. Composition bağımsız bileşen değişimini ve daha doğru alan modelini destekler.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: inheritance, composition, is-a, has-a

# O09 · Kolay · Teori

Method overloading nedir? Aynı işlemin farklı parametrelerle sunulmasının yararlı ve kafa karıştırıcı olabileceği durumlara örnek verin.

## O09-01 · Çoklu seçim
Konu: Method Overloading
Soru: Sınıfta void send(String message) varken aynı sınıfta geçerli bir overload oluşturacak imzaları seçin.
Şıklar:
- [x] object: void send(Object message)
  Neden: Doğru: parametre tipi farklıdır.
- [x] stringInt: void send(String message, int retryCount)
  Neden: Doğru: parametre sayısı farklıdır.
- [ ] int: static void send(String message)
  Neden: Yanlış: static eklemek parametre listesini değiştirmez; aynı imza ikinci kez bildirilmiş olur.
- [ ] returnOnly: boolean send(String message)
  Neden: Yanlış: aynı ad ve aynı parametre listesi tekrar bildirilmiştir.
İpucu: Overload ayrımında metot adı ve parametre listesi kullanılır; dönüş tipi tek başına yetmez.
Kısa açıklama: Parametre tipi veya sayısı değişen imzalar overload'dur; yalnız dönüş tipi veya static belirteci değişen imzalar çakışır.
Açıklama: Java metot imzası overload çözümlemesi açısından ad ve parametre tiplerinden oluşur. Dönüş tipi çağrı yerinde overload seçmek için kullanılmaz.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: overloading, method-signature, compile-time

## O09-02 · Kod çıktısı
Konu: Method Overloading
Soru: Overload çözümlemesine göre ekrana ne yazılır?
Kod:
```java
class Notifier {
    void notify(Object value) { System.out.println("Object"); }
    void notify(String value) { System.out.println("String"); }
}

new Notifier().notify(null);
```
Cevap: String
Büyük/küçük harf duyarlı: evet
İpucu: null iki reference type'a da uyar; derleyici daha özel olan uygulanabilir imzayı seçer.
Kısa açıklama: String, Object'ten daha özel olduğu için notify(String) seçilir.
Açıklama: Overload seçimi derleme zamanında yapılır. null hem Object hem String parametresine aktarılabilir; iki aday arasında String daha spesifik olduğundan çağrı belirsiz değildir.
Varsayım: Sınıfta yalnızca gösterilen iki overload vardır.
Varsayım: Çıktı kenarı boşlukları önemsenmez.
Etiketler: overloading, null, most-specific, output

# O10 · Kolay · Teori

Method overriding nedir? Alt sınıfın üst sınıf davranışını değiştirmesi gereken bir senaryo anlatın.

## O10-01 · Kod çıktısı
Konu: Method Overriding
Soru: Override ve dinamik dispatch sonucunda çıktı nedir?
Kod:
```java
class Notification {
    void send() { System.out.println("generic"); }
}
class EmailNotification extends Notification {
    @Override
    void send() { System.out.println("email"); }
}

Notification notification = new EmailNotification();
notification.send();
```
Cevap: email
Büyük/küçük harf duyarlı: evet
İpucu: Instance metot gövdesini nesnenin çalışma zamanı tipi belirler.
Kısa açıklama: Nesne EmailNotification olduğu için override edilmiş send çalışır.
Açıklama: Referansın bildirilen tipi erişilebilir metot kümesini sınırlar; seçilen instance metot uygulaması çalışma zamanındaki EmailNotification türünden gelir.
Varsayım: Metotlar instance metodudur; static değildir.
Varsayım: Çıktı kenarı boşlukları önemsenmez.
Etiketler: overriding, dynamic-dispatch, polymorphism, output

## O10-02 · Çoklu seçim
Konu: Method Overriding
Soru: Bir alt sınıf instance metodunun üst sınıftaki metodu geçerli biçimde override etmesi için doğru kuralları seçin.
Şıklar:
- [x] signature: Ad ve parametre listesi aynı olmalıdır.
  Neden: Doğru: override edilen metotla aynı parametre listesi gerekir.
- [x] covariant: Reference dönüş tipi aynı veya covariant olabilir.
  Neden: Doğru: reference dönüş tipi alt tür olabilir.
- [ ] visibility: Erişim seviyesi daraltılabilir; public bir metot protected olarak override edilebilir.
  Neden: Yanlış: override erişimi daraltamaz; public metot alt sınıfta da public kalmalıdır.
- [ ] returnOnly: Aynı parametre listesiyle farklı bir dönüş tipi yazmak yeni bir overload oluşturur.
  Neden: Yanlış: dönüş tipi imzanın parçası değildir; uyumsuz dönüş tipi derleme hatasıdır.
İpucu: @Override ile derleyicinin denetlediği sözleşmeyi düşünün.
Kısa açıklama: Aynı imza, uyumlu dönüş tipi ve daraltılmayan erişim gerekir.
Açıklama: Override alt tür sözleşmesini korur. Checked exception kuralları gibi ek koşullar da vardır. Erişim seviyesi daraltılamaz ve dönüş tipi tek başına metot imzasını farklılaştırmaz.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: overriding, covariant-return, access

# O11 · Kolay · Teori

Polymorphism nedir? Farklı ödeme yöntemlerinin tek bir ortak tip üzerinden kullanılmasını örnek göstererek açıklayın.

## O11-01 · Kod çıktısı
Konu: Polymorphism
Soru: Ortak PaymentMethod tipi üzerinden yapılan çağrıların çıktısını yazın.
Kod:
```java
interface PaymentMethod {
    String pay();
}
class CardPayment implements PaymentMethod {
    public String pay() { return "card"; }
}
class TransferPayment implements PaymentMethod {
    public String pay() { return "transfer"; }
}

PaymentMethod[] methods = {new CardPayment(), new TransferPayment()};
for (PaymentMethod method : methods) {
    System.out.println(method.pay());
}
```
Cevap:
```
card
transfer
```
Büyük/küçük harf duyarlı: evet
İpucu: Her dizi elemanında çalışma zamanı türünün pay uygulaması çağrılır.
Kısa açıklama: İlk nesne CardPayment, ikinci nesne TransferPayment uygulamasını çalıştırır.
Açıklama: İstemci somut sınıfları ayıran koşul kullanmadan PaymentMethod sözleşmesine çağrı yapar. Dynamic dispatch her nesne için doğru pay uygulamasını seçer.
Varsayım: Dizi sırası gösterildiği gibidir.
Varsayım: Çıktı satır sırası korunur.
Etiketler: polymorphism, interface, dynamic-dispatch, output

## O11-02 · Tek seçim
Konu: Polymorphism
Soru: CheckoutService'in CardPayment, TransferPayment ve WalletPayment nesnelerini PaymentMethod olarak kabul etmesinin temel yararı nedir?
Şıklar:
- [x] a: İstemci ortak sözleşmeye bağlı kalır ve somut davranış çalışma zamanında seçilir.
  Neden: Doğru: ortak tip ve dinamik davranış seçimi polymorphism'in özüdür.
- [ ] b: Ödeme sınıflarının aynı alanlara sahip olması zorunlu hâle gelir.
  Neden: Interface ortak alan düzenini zorunlu kılmaz.
- [ ] c: Ödeme nesneleri new ile oluşturulamaz hâle gelir.
  Neden: Polymorphism nesne oluşturmayı yasaklamaz.
- [ ] d: Ödeme türünü ayırt etmek için instanceof koşulları yazmak gerekir.
  Neden: Amaç tür koşullarını azaltmaktır.
İpucu: İstemcinin somut türleri bilmeden çalışabilmesini düşünün.
Kısa açıklama: Polymorphism ortak sözleşme üzerinden farklı uygulamaları değiştirilebilir kılar.
Açıklama: CheckoutService PaymentMethod'e bağlı olduğunda yeni ödeme türleri aynı sözleşmeyi uygulayarak sisteme katılabilir. Nesnelerin aynı alanları taşıması gerekmez ve instanceof dalları hedef değildir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: polymorphism, payment, extensibility

# O12 · Kolay · Teori

Abstraction ile encapsulation arasındaki farkı bir ödeme sistemi üzerinden açıklayın.

## O12-01 · Tek seçim
Konu: Abstraction ve Encapsulation
Soru: Bir ödeme sistemi için abstraction ile encapsulation ayrımını doğru kuran seçenek hangisidir?
Şıklar:
- [x] a: pay ortak sözleşmeyi soyutlar; kart verisi CardPayment içinde korunur.
  Neden: Doğru: sözleşme ve iç durum koruması ayrılmıştır.
- [ ] b: Abstraction alanları public yapar; encapsulation sınıfları abstract yapar.
  Neden: Kavramların anlamları ters ve hatalı verilmiştir.
- [ ] c: İki kavram aynıdır ve aynı Java anahtar sözcüğüyle uygulanır.
  Neden: Abstraction ile encapsulation farklı tasarım amaçlarıdır.
- [ ] d: Encapsulation interface'lerle, abstraction private alanlarla uygulandığı için ikisi aynı sınıfta birlikte bulunamaz.
  Neden: Her iki kavram da farklı Java yapılarıyla ve aynı sınıfta birlikte uygulanabilir.
İpucu: Bir kavram gereksiz ayrıntıyı gizleyen sözleşmeye, diğeri state ve kuralların sınırına odaklanır.
Kısa açıklama: Abstraction gerekli sözleşmeyi sunar; encapsulation iç state'i ve invariant'ları korur.
Açıklama: PaymentMethod istemciye ödeme davranışını uygulama ayrıntısından bağımsız gösterir. CardPayment ise hassas state'i ve geçerlilik kurallarını kontrollü metotlarla kapsüller. Kavramlar ilişkili fakat aynı değildir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: abstraction, encapsulation, payment

# O13 · Kolay · Teori

Interface ve abstract class ne amaçla kullanılır? Her biri için uygun birer kullanım örneği verin.

## O13-01 · Tek seçim
Konu: Interface ve Abstract Class
Soru: Birbirine yakın alt sınıfların ortak protected state'i, constructor mantığı ve uygulanmış metotları paylaşması gerekiyorsa en uygun başlangıç tercihi hangisidir?
Şıklar:
- [x] a: Abstract class
  Neden: Doğru: belirtilen üç ihtiyacı doğrudan karşılar.
- [ ] b: Metot içermeyen bir marker interface
  Neden: Marker interface state veya uygulama sağlamaz.
- [ ] c: Ortak kodu alt sınıflara kopyalamak
  Neden: Kod tekrarı bakım riskini artırır.
- [ ] d: Global mutable değişkenler
  Neden: Global mutable state kapsüllemeyi ve testi zorlaştırır.
İpucu: Ortak instance state ve constructor hangi yapıda doğal olarak bulunur?
Kısa açıklama: Abstract class ortak state, constructor ve kısmi uygulama paylaşımına uygundur.
Açıklama: Interface bağımsız yetenek sözleşmeleri için güçlüdür; abstract class ise yakın bir hiyerarşide ortak state ve temel uygulamayı merkezileştirebilir. Seçim bağlama bağlıdır.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: abstract-class, interface, shared-state

## O13-02 · Çoklu seçim
Konu: Interface ve Abstract Class
Soru: Bir sınıfın kalıtım hiyerarşisinden bağımsız olarak birden fazla yeteneği paylaşması gereken durumlarda interface kullanımının sağladığı özellikleri seçin.
Şıklar:
- [x] multiple: Bir sınıf birden fazla interface uygulayabilir.
  Neden: Doğru: çoklu interface uygulaması desteklenir.
- [x] contract: İstemciler somut sınıf yerine davranış sözleşmesine bağlanabilir.
  Neden: Doğru: bağımlılık soyut sözleşmeye yöneltilebilir.
- [ ] unrelated: Aynı interface'i uygulayan sınıflar ortak bir üst sınıftan türemelidir.
  Neden: Yanlış: interface ortak ata sınıf gerektirmez; ilişkisiz sınıflar aynı sözleşmeyi uygulayabilir.
- [ ] ctor: Interface instance constructor'ı ile ortak nesne state'i kurar.
  Neden: Yanlış: interface instance constructor'ı yoktur.
İpucu: Interface'i ortak state taşıyan bir üst sınıftan çok, takılabilir bir yetenek olarak düşünün.
Kısa açıklama: Interface birden fazla ve bağımsız davranış sözleşmesini farklı sınıflara taşıyabilir.
Açıklama: Java sınıflarda tek kalıtım kullanır fakat bir sınıf birden fazla interface uygulayabilir. Interface'in instance constructor'ı yoktur ve ortak mutable instance state kurmaz.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: interface, capability, multiple-inheritance

# O14 · Orta · Modelleme

Öğrencilerin birden fazla derse, derslerin de birden fazla öğrenciye sahip olduğu üniversite kayıt sistemini modelleyin. Temel sınıfları, sorumlulukları ve ilişkileri belirtin.

## O14-01 · Eşleştirme
Konu: Nesne Modelleme
Soru: Üniversite kayıt modelindeki gereksinimleri en uygun sınıf veya ilişkiyle eşleştirin.
Eşleşmeler:
- studentIdentity: Öğrenci numarası ve öğrenciye ait bilgiler => Student: Student
- courseIdentity: Ders kodu, ad ve kredi => Course: Course
- enrollmentData: Kayıt tarihi ve o derse ait not => Enrollment: Enrollment association entity
- manyToMany: Öğrenci ile ders arasındaki çoktan çoğa bağ => EnrollmentLinks: Student ve Course'u referanslayan Enrollment kayıtları
Fazladan seçenekler:
- decoy: Course sınıfından kalıtan Student
İpucu: İlişkinin kendisine ait veri varsa ayrı bir association entity düşünün.
Kısa açıklama: Student ve Course kimlikleri ayrı; ilişkiye ait tarih/not ise Enrollment içinde modellenir.
Açıklama: Enrollment hem Student hem Course referansı taşır ve ilişkiye özgü state'i kapsüller. Böylece doğrudan iki listeyi senkron tutma yükü yerine kayıt kavramı açık bir domain nesnesi olur.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: modeling, many-to-many, association-entity

## O14-02 · Tek seçim
Konu: Nesne Modelleme
Soru: Student–Course çoktan çoğa ilişkisinde kayıt tarihi ve not da saklanacaksa en uygun model hangisidir?
Şıklar:
- [x] a: Tarih ve notu taşıyan Enrollment ilişki sınıfı
  Neden: Doğru: ilişki ve ilişkiye ait veri birlikte modellenir.
- [ ] b: Öğrenci adlarını Course adının içine metin olarak yazmak
  Neden: Metin içine gömmek kimlik ve kural yönetimini kaybettirir.
- [ ] c: Student sınıfını Course'tan kalıtıp kayıt tarihini ve notu Student alanı olarak saklamak
  Neden: Student ile Course arasında is-a ilişkisi yoktur; ilişkiye ait veri öğrenciye gömülmemelidir.
- [ ] d: Kayıt verilerini tek bir global String listesinde tutmak
  Neden: Global metin listesi tür güvenliği ve kapsülleme sağlamaz.
İpucu: İlişkinin kendisine ait alanlar hangi nesnede yaşayabilir?
Kısa açıklama: İlişkiye ait state bulunduğunda Enrollment ayrı bir ilişki nesnesi olmalıdır.
Açıklama: Enrollment modelin anlamını görünür kılar, not ve tarih kurallarını tek yerde tutar ve sorgulamayı kolaylaştırır. Student bir Course değildir; kalıtım semantik olarak yanlıştır.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: modeling, many-to-many, enrollment

# O15 · Orta · Kod okuma

Constructor çağrı sırasını bulun.

```java
class A {
    A() {
        System.out.println("A");
    }
}

class B extends A {
    B() {
        System.out.println("B");
    }
}

class C extends B {
    C() {
        System.out.println("C");
    }
}

new C();
```

## O15-01 · Kod çıktısı
Konu: Constructor Zinciri
Soru: new C() çağrısında constructor zincirinin çıktısını satır sırasıyla yazın.
Kod:
```java
class A {
    A() { System.out.println("A"); }
}
class B extends A {
    B() { System.out.println("B"); }
}
class C extends B {
    C() { System.out.println("C"); }
}

new C();
```
Cevap:
```
A
B
C
```
Büyük/küçük harf duyarlı: evet
İpucu: Her constructor'ın başına derleyicinin eklediği örtük super() çağrısını izleyin.
Kısa açıklama: Önce en üst sınıf A, sonra B, son olarak C constructor'ı tamamlanır.
Açıklama: C() örtük super() ile B()'yi; B() da örtük super() ile A()'yı çağırır. Üst nesne kısmı kurulmadan alt sınıf constructor gövdesi çalışmaz.
Varsayım: Sınıflarda gösterilenlerden başka constructor veya initializer yoktur.
Varsayım: Çıktı satır sırası korunur.
Etiketler: constructor, inheritance, initialization-order, output

# O16 · Orta · Hata bulma

Alt sınıf constructor’ındaki sorunu bulun ve düzeltin.

```java
class Person {
    Person(String name) {
    }
}

class Employee extends Person {
    Employee(int id) {
    }
}
```

## O16-01 · Tek seçim
Konu: Constructor Zinciri
Soru: Employee constructor'ının derlenmemesinin doğrudan nedeni nedir?
Kod:
```java
class Person {
    Person(String name) { }
}
class Employee extends Person {
    Employee(int id) { }
}
```
Şıklar:
- [x] a: Örtük super() için Person() yok.
  Neden: Doğru: derleme hatasının nedeni eşleşen üst constructor olmamasıdır.
- [ ] b: Alt sınıf constructor'ı, üst sınıf constructor'ıyla aynı parametre tipini almak zorundadır.
  Neden: Alt sınıf constructor'ı farklı parametreler alabilir; sorun uygun bir super(...) çağrısının olmamasıdır.
- [ ] c: Person constructor'ı String alamaz.
  Neden: Gösterilen Person(String) geçerlidir.
- [ ] d: Constructor'lar yalnızca public olabilir.
  Neden: Constructor erişimi public olmak zorunda değildir.
İpucu: Açık this(...) veya super(...) yoksa ilk satıra ne eklenir?
Kısa açıklama: Örtük super(), bulunmayan Person() constructor'ını çağırmaya çalışır.
Açıklama: Person yalnız Person(String) bildirmiştir. Employee(int) ilk ifade olarak super("bir ad") çağırmalı ya da Person'a uygun parametresiz constructor eklenmelidir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: constructor, super, compile-error

## O16-02 · Boşluk doldurma
Konu: Constructor Zinciri
Soru: Person adının "Ada" olması için Employee(int) constructor'ının ilk ifadesine yazılması gereken çağrıyı girin.
Kod:
```java
class Person {
    Person(String name) { }
}
class Employee extends Person {
    Employee(int id) {
        __________;
    }
}
```
Cevap: super("Ada")
Kabul: super ("Ada")
Kabul: super("Ada");
Kabul: super ("Ada");
Büyük/küçük harf duyarlı: evet
İpucu: Üst sınıf constructor'ı super anahtar sözcüğüyle çağrılır.
Kısa açıklama: İlk ifade super("Ada") olmalıdır.
Açıklama: Üst sınıfta yalnız Person(String) bulunduğu için String argümanlı super çağrısı gerekir. Java kaynak kodunda String literal çift tırnakla yazılır.
Varsayım: Boşluğa noktalı virgül yazılması isteğe bağlıdır; arayüz son noktalı virgülü normalize eder.
Etiketler: constructor, super, fill

# O17 · Orta · Hata bulma

Constructor zincirindeki problemi bulun. `this(...)` kullanım kurallarına uygun şekilde yeniden düzenleyin.

```java
class Product {
    Product() {
        this("Unknown");
    }

    Product(String name) {
        this();
    }
}
```

## O17-01 · Tek seçim
Konu: Constructor Zinciri
Soru: Product constructor'larının derlenmeme nedeni nedir?
Kod:
```java
class Product {
    Product() {
        this("Unknown");
    }
    Product(String name) {
        this();
    }
}
```
Şıklar:
- [x] a: İki this() çağrısı döngü oluşturur.
  Neden: Doğru: doğrudan bir çağrı döngüsü oluşur.
- [ ] b: this(...) yalnız static metotlarda kullanılabilir.
  Neden: this(...) yalnız constructor içinde kullanılabilir ve burada bağlam doğrudur.
- [ ] c: String constructor parametresi olamaz.
  Neden: Constructor String parametresi alabilir.
- [ ] d: this(...) çağrısı constructor'ın ilk satırında yer aldığı için ikinci constructor'daki this() çağrısı geçersiz sayılır.
  Neden: this(...) ilk ifade olarak yazılabilir; buradaki hata iki constructor'ın birbirini sonsuza kadar çağırmasıdır.
İpucu: Çağrı oklarını Product() → Product(String) → ... şeklinde izleyin.
Kısa açıklama: İki constructor arasında taban constructor'a ulaşmayan döngü vardır.
Açıklama: Java constructor zincirinin sonsuz döngüye dönüşmesini derleme zamanında reddeder. Constructor'lardan biri this(...) çağırmadan alanları başlatan son nokta olmalıdır.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: constructor, this, recursive-invocation, compile-error

## O17-02 · Sıralama
Konu: Constructor Zinciri
Soru: Aşağıdaki geçerli tasarımda new Product() çağrısının izlediği constructor gövdelerini çalışma sırasına koyun.
Kod:
```java
class Product {
    Product() {
        this("Unknown");
        System.out.println("no-arg body");
    }
    Product(String name) {
        this(name, 0);
        System.out.println("name body");
    }
    Product(String name, int stock) {
        System.out.println("master body");
    }
}
```
Sıra:
1. master: Product(String, int) gövdesi
2. name: Product(String) gövdesinin this(...) sonrasındaki kısmı
3. noArg: Product() gövdesinin this(...) sonrasındaki kısmı
İpucu: this(...) hedef constructor'ı tamamlanmadan çağıran gövde devam etmez.
Kısa açıklama: En derindeki master constructor tamamlanır; sonra String, ardından parametresiz gövde devam eder.
Açıklama: new Product() önce Product(String)'e, o da Product(String,int)'e yönlenir. Dönüş sırasında gövdelerin kalan bölümleri içten dışa çalışır.
Varsayım: Sıralama constructor gövdelerinin çıktı üreten bölümleri içindir; çağrı ifadeleri ayrı öğe değildir.
Etiketler: constructor, this, order

# O18 · Orta · Kod okuma

Referansın bildirilen tipi ile çalışma zamanı tipi hangi davranışları belirler?

```java
class Vehicle {
    void start() {
        System.out.println("Vehicle started");
    }
}

class Car extends Vehicle {
    @Override
    void start() {
        System.out.println("Car started");
    }

    void openTrunk() {
        System.out.println("Trunk opened");
    }
}

Vehicle vehicle = new Car();
vehicle.start();
vehicle.openTrunk();
```

## O18-01 · Kod çıktısı
Konu: Polymorphism
Soru: Yalnızca derlenebilen start çağrısı çalıştırıldığında çıktı nedir?
Kod:
```java
class Vehicle {
    void start() { System.out.println("Vehicle started"); }
}
class Car extends Vehicle {
    @Override
    void start() { System.out.println("Car started"); }
    void openTrunk() { System.out.println("Trunk opened"); }
}

Vehicle vehicle = new Car();
vehicle.start();
```
Cevap: Car started
Büyük/küçük harf duyarlı: evet
İpucu: Erişim bildirilen tipten doğrulanır; override gövdesi çalışma zamanı tipinden seçilir.
Kısa açıklama: vehicle bir Car nesnesini gösterdiği için Car.start çalışır.
Açıklama: Derleyici Vehicle üzerinde start bulunduğunu doğrular. Çalışma zamanında dinamik dispatch nesnenin gerçek türü Car olduğu için override edilmiş uygulamayı seçer.
Varsayım: start instance metodudur ve kodda başka çıktı yoktur.
Etiketler: declared-type, runtime-type, overriding, output

## O18-02 · Doğru / Yanlış
Konu: Polymorphism
Soru: Vehicle vehicle = new Car(); bildiriminden sonra vehicle.openTrunk() çağrısı, nesne çalışma zamanında Car olduğu için doğrudan derlenir.
Şıklar:
- [ ] Doğru
  Neden: Yanlış: çalışma zamanı türü derleyicinin Vehicle API kontrolünü kaldırmaz.
- [x] Yanlış
  Neden: Doğru: bildirilen Vehicle tipinde openTrunk yoktur.
İpucu: Üye erişiminin varlığı önce hangi tip üzerinden denetlenir?
Kısa açıklama: Yanlış. openTrunk, Vehicle'ın bildirilen API'sinde olmadığı için çağrı derlenmez.
Açıklama: Çalışma zamanı tipi override edilmiş mevcut metot gövdesini seçer; derleme zamanında erişilebilir metot kümesini genişletmez. Güvenli bir tür kontrolü ve cast olmadan Car'a özgü openTrunk çağrılamaz.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: declared-type, runtime-type, compile-error

# O19 · Orta · Hata bulma

Overriding sırasında dönüş tipi ve erişim seviyesi bakımından yapılan hatayı bulun.

```java
class Parent {
    public Number getValue() {
        return 1;
    }
}

class Child extends Parent {
    @Override
    protected Integer getValue() {
        return 2;
    }
}
```

## O19-01 · Çoklu seçim
Konu: Method Overriding
Soru: Parent.getValue metodunu geçerli biçimde override eden Child imzalarını seçin.
Kod:
```java
class Parent {
    public Number getValue() { return 1; }
}
```
Şıklar:
- [x] same: public Number getValue()
  Neden: Doğru: aynı dönüş tipi ve erişim korunmuştur.
- [x] covariant: public Integer getValue()
  Neden: Doğru: Integer covariant dönüş tipidir.
- [ ] protected: protected Integer getValue()
  Neden: Yanlış: public erişim protected'a daraltılamaz.
- [ ] object: public Object getValue()
  Neden: Yanlış: Object daha genel bir dönüş tipidir.
İpucu: Dönüş tipi aynı ya da daha özel; erişim aynı ya da daha geniş olmalıdır.
Kısa açıklama: public Number ve public Integer geçerlidir; protected erişimi daraltır, Object dönüşü genişletir.
Açıklama: Integer, Number'ın alt türü olduğundan covariant return olarak kullanılabilir. public metodu protected yapmak istemci sözleşmesini daraltır. Object ise Number'dan daha genel olduğu için uyumlu override dönüşü değildir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: overriding, covariant-return, visibility

## O19-02 · Doğru / Yanlış
Konu: Method Overriding
Soru: public Number getValue() metodunu protected Integer getValue() olarak override etmek, Integer covariant olsa bile erişim daraltıldığı için geçersizdir.
Şıklar:
- [x] Doğru
  Neden: Doğru: erişim daraltma derleme hatasıdır.
- [ ] Yanlış
  Neden: Yanlış: covariant dönüş erişim ihlalini telafi etmez.
İpucu: Dönüş tipi ve erişim kuralını birbirinden bağımsız kontrol edin.
Kısa açıklama: Doğru. Covariant dönüş geçerli olsa da public erişim protected'a indirilemez.
Açıklama: Override bütün kuralları aynı anda sağlamalıdır. Integer dönüşü tek başına uygundur; ancak üst tip istemcilerinin public erişebildiği bir operasyon alt tipte daha az erişilebilir yapılamaz.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: overriding, covariant-return, access

# O20 · Orta · Kod okuma

Çağrıların hangi overload’a yönleneceğini bulun. Overload seçiminin ne zaman yapıldığını açıklayın.

```java
class Printer {
    void print(Object value) {
        System.out.println("Object");
    }

    void print(String value) {
        System.out.println("String");
    }
}

Printer printer = new Printer();
String text = null;
Object object = text;

printer.print(text);
printer.print(object);
printer.print(null);
```

## O20-01 · Kod çıktısı
Konu: Method Overloading
Soru: Üç print çağrısının çıktısını satır sırasıyla yazın.
Kod:
```java
class Printer {
    void print(Object value) { System.out.println("Object"); }
    void print(String value) { System.out.println("String"); }
}

Printer printer = new Printer();
String text = null;
Object object = text;
printer.print(text);
printer.print(object);
printer.print(null);
```
Cevap:
```
String
Object
String
```
Büyük/küçük harf duyarlı: evet
İpucu: İlk iki çağrıda değişkenlerin bildirilen tipine; çıplak null için en özel uygulanabilir imzaya bakın.
Kısa açıklama: Sırasıyla String, Object ve daha özel overload olan String seçilir.
Açıklama: Overload seçimi derleme zamanında yapılır. text String, object Object olarak bildirilmiştir. null iki overload'a da uygulanabilir fakat String, Object'ten daha spesifiktir.
Varsayım: Sınıfta yalnızca gösterilen overload'lar vardır.
Varsayım: Çıktı satır sırası korunur.
Etiketler: overloading, declared-type, null, output

## O20-02 · Tek seçim
Konu: Method Overloading
Soru: Object object = (String) null; sonrasında printer.print(object) çağrısında print(Object) seçilmesinin nedeni nedir?
Şıklar:
- [x] a: Derleyici bildirilen Object tipine bakar.
  Neden: Doğru: overload çözümlemesi statik tip üzerinden yapılır.
- [ ] b: null değer String parametresine aktarılamaz.
  Neden: null her reference type'a aktarılabilir.
- [ ] c: Overload seçimi çalışma zamanında yapılır; null değerinin gerçek tipi bilinmediği için JVM print(Object) metoduna düşer.
  Neden: Overload seçimi derleme zamanında yapılır; çalışma zamanındaki değer seçimi etkilemez.
- [ ] d: Java kaynakta ilk yazılan overload'u seçer.
  Neden: Kaynak sırası overload seçme kuralı değildir.
İpucu: Overloading ile overriding'in seçim zamanlarını ayırın.
Kısa açıklama: object değişkeninin bildirilen tipi Object olduğu için print(Object) derleme zamanında bağlanır.
Açıklama: Atanan değerin null veya başlangıçta String cast'iyle üretilmiş olması overload adayını değiştirmez. Çağrıdaki ifadenin statik tipi Object'tir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: overloading, compile-time, declared-type

# O21 · Orta · Kod okuma

Upcasting ve downcasting işlemlerini değerlendirin. Hangi satır çalışma zamanında sorun çıkarabilir?

```java
class Animal {}
class Dog extends Animal {}
class Cat extends Animal {}

Animal animal = new Dog();
Dog dog = (Dog) animal;
Cat cat = (Cat) animal;
```

## O21-01 · Çoklu seçim
Konu: Upcasting ve Downcasting
Soru: Gösterilen kod için doğru değerlendirmeleri seçin.
Kod:
```java
class Animal { }
class Dog extends Animal { }
class Cat extends Animal { }

Animal animal = new Dog();
Dog dog = (Dog) animal;
Cat cat = (Cat) animal;
```
Şıklar:
- [x] upcast: new Dog() değerinin Animal referansına atanması güvenli bir upcasting işlemidir.
  Neden: Doğru: her Dog bir Animal'dır.
- [x] dogSuccess: (Dog) animal cast'i çalışma zamanında başarılıdır.
  Neden: Doğru: gerçek nesne Dog'dur.
- [x] catCompiles: (Cat) animal cast'i derlenir.
  Neden: Doğru: kardeş alt tür cast'i statik olarak mümkün kabul edilir.
- [x] catFails: (Cat) animal satırı çalışma zamanında ClassCastException fırlatır.
  Neden: Doğru: gerçek Dog nesnesi Cat değildir.
- [ ] catCreated: Cat cast'i mevcut Dog nesnesini bir Cat nesnesine dönüştürür.
  Neden: Yanlış: cast yeni nesne üretmez ve nesnenin sınıfını değiştirmez.
İpucu: Cast nesnenin gerçek türünü değiştirmez; yalnız referansın nasıl ele alınacağını belirtir.
Kısa açıklama: Upcast ve Dog downcast güvenlidir; Cat cast'i derlenir fakat çalışma zamanında başarısız olur.
Açıklama: animal değişkeni gerçekte Dog nesnesini gösterir. İlişkili sınıflar arasında explicit cast derlenebilir, ancak JVM gerçek nesnenin hedef tipe uygunluğunu denetler. Dog, Cat olmadığı için ClassCastException oluşur.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: upcasting, downcasting, class-cast-exception

## O21-02 · Kod çıktısı
Konu: Upcasting ve Downcasting
Soru: Çalışma zamanı tür kontrolü sonucunda kodun çıktısı nedir?
Kod:
```java
class Animal { }
class Dog extends Animal { }
class Cat extends Animal { }

Animal animal = new Dog();
if (animal instanceof Cat) {
    Cat cat = (Cat) animal;
    System.out.println("cat");
} else {
    System.out.println("not a cat");
}
```
Cevap: not a cat
Büyük/küçük harf duyarlı: evet
İpucu: instanceof gerçek nesnenin Cat ile uyumlu olup olmadığını sınar.
Kısa açıklama: Nesne Dog olduğu için instanceof Cat false olur ve else dalı çalışır.
Açıklama: instanceof güvenli downcast öncesinde çalışma zamanı türünü kontrol eder. animal null olsaydı da sonuç false olurdu; bu senaryoda referans açıkça Dog nesnesini gösterir.
Varsayım: animal, kodda gösterildiği gibi null olmayan bir Dog nesnesini gösterir.
Etiketler: instanceof, downcasting, runtime-type, output

# O22 · Orta · Tasarım

Ortak alanları ve ortak metot uygulamaları bulunan sınıflarda abstract class mı, interface mi tercih edersiniz? Birden fazla bağımsız davranış paylaşılacaksa kararınız değişir mi?

## O22-01 · Eşleştirme
Konu: Interface ve Abstract Class
Soru: Tasarım gereksinimlerini en uygun başlangıç yapısıyla eşleştirin.
Eşleşmeler:
- sharedState: Yakın alt türlerde ortak instance state, constructor ve temel uygulama => abstractPrimary: Abstract class öncelikli
- independentCapability: İlişkisiz sınıflara takılabilen bağımsız davranış sözleşmesi => interfacePrimary: Interface öncelikli
- singleBase: Tek bir ortak temel sınıf hiyerarşisi => abstractHierarchy: Abstract class hiyerarşisi
- manyCapabilities: Bir sınıfta birden fazla bağımsız yetenek => multipleInterfaces: Birden fazla interface
Fazladan seçenekler:
- decoy: Static yardımcı (utility) sınıf
İpucu: Ortak state ile bağımsız yetenek ihtiyacını ayırın.
Kısa açıklama: Abstract class ortak state ve temel uygulamada; interface bağımsız ve çoklu yeteneklerde öne çıkar.
Açıklama: Bu bir mekanik kural değil tasarım başlangıç noktasıdır. Abstract class sıkı akraba türlerde ortak temsil sağlar; interface istemcinin bir yetenek sözleşmesine bağlanmasını ve farklı hiyerarşilerin aynı yeteneği uygulamasını sağlar.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: abstract-class, interface, design-choice

## O22-02 · Tek seçim
Konu: Interface ve Abstract Class
Soru: Zaten başka bir sınıftan kalıtım alan Report sınıfına Exportable ve Printable gibi bağımsız yetenekler eklemek için en uygun yaklaşım hangisidir?
Şıklar:
- [x] a: Exportable ve Printable interface'lerini uygulamak
  Neden: Doğru: çoklu bağımsız yetenek sözleşmesi sağlar.
- [ ] b: Java'da iki ek sınıftan daha extends etmek
  Neden: Java sınıflarda çoklu extends desteklemez.
- [ ] c: Export ve print davranışlarını Object sınıfına eklemek
  Neden: Object'a alan davranışı eklenemez ve eklenmesi de doğru sorumluluk değildir.
- [ ] d: Çağrılarda sınıf adını String olarak karşılaştırıp davranış seçmek
  Neden: String tür kontrolleri genişletilebilir bir nesne modeli değildir.
İpucu: Java sınıflarda tek kalıtım, interface'lerde çoklu uygulama destekler.
Kısa açıklama: Bağımsız yetenekler birden fazla interface ile ifade edilebilir.
Açıklama: Report mevcut sınıf kalıtımını korurken Exportable ve Printable sözleşmelerini aynı anda uygulayabilir. Tür adına göre koşul yazmak polymorphism'i ve tür güvenliğini kaybettirir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: interface, capability, multiple-interfaces

# O23 · Orta · Hata bulma

İki interface’ten gelen aynı isimli default metot çakışmasını çözün.

```java
interface A {
    default String label() {
        return "A";
    }
}

interface B {
    default String label() {
        return "B";
    }
}

class C implements A, B {
}
```

## O23-01 · Doğru / Yanlış
Konu: Interface Default Metotları
Soru: A ve B interface'leri aynı imzalı label() default metodunu sağlarken C implements A, B sınıfı label() metodunu override etmeden derlenir.
Kod:
```java
interface A {
    default String label() { return "A"; }
}
interface B {
    default String label() { return "B"; }
}
class C implements A, B { }
```
Şıklar:
- [ ] Doğru
  Neden: Yanlış: eşit öncelikli iki default uygulama belirsizdir.
- [x] Yanlış
  Neden: Doğru: açık override olmadan derleme hatası oluşur.
İpucu: Derleyici iki eşit öncelikli varsayılan uygulamadan birini kendiliğinden seçmez.
Kısa açıklama: Yanlış. C çakışmayı açık bir override ile çözmelidir.
Açıklama: İki ilişkisiz interface aynı imzalı default metot sağladığında sınıf kendi label uygulamasını bildirmek zorundadır. İster yeni davranış yazar, ister InterfaceName.super.method() ile birini seçer.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: interface, default-method, conflict

## O23-02 · Boşluk doldurma
Konu: Interface Default Metotları
Soru: C.label() içinde özellikle A interface'inin default uygulamasını çağıran ifadeyi yazın. Yalnızca return değerinin sağındaki ifadeyi girin.
Kod:
```java
class C implements A, B {
    @Override
    public String label() {
        return __________;
    }
}
```
Cevap: A.super.label()
Kabul: A . super . label ()
Kabul: A.super.label();
Kabul: A . super . label ();
Büyük/küçük harf duyarlı: evet
İpucu: Üst sınıf değil, belirli bir interface adı nitelendirici olarak kullanılır.
Kısa açıklama: İfade A.super.label() olmalıdır.
Açıklama: InterfaceName.super.method() sözdizimi, çakışan default metotlardan belirli olanı seçer. C yine de çakışmayı kendi override'ı içinde açıkça çözmüş olur.
Varsayım: A ve B, kaynak sorudaki public label() default metotlarını sağlar.
Etiketler: interface, default-method, super, fill

# O24 · Orta · Teori

Composition ve inheritance arasındaki fark nedir? Bir `Stack` sınıfının genel amaçlı bir listeden kalıtım alması yerine listeyi içinde tutması neden daha güvenli olabilir?

## O24-01 · Çoklu seçim
Konu: Composition
Soru: Genel amaçlı List sınıfından kalıtım almak yerine listeyi private alan olarak kullanan bir Stack tasarımının yararlarını seçin.
Şıklar:
- [ ] api: Stack, List'in add ve remove gibi metotlarını kendiliğinden devralır.
  Neden: Yanlış: composition metot devralmaz; Stack yalnız push, pop ve peek gibi kendi tanımladığı operasyonları açar.
- [x] invariant: İstemcinin listeye özgü rastgele ekleme/silme işlemleriyle LIFO kuralını bozması engellenebilir.
  Neden: Doğru: LIFO'yu bozan liste operasyonları açılmaz.
- [x] replace: İç veri yapısı istemci API'si değişmeden değiştirilebilir.
  Neden: Doğru: ArrayDeque gibi başka yapı içeride kullanılabilir.
- [ ] isList: Stack, List bekleyen metotlara doğrudan argüman olarak verilebilir.
  Neden: Yanlış: composition is-a ilişkisi kurmaz; Stack bir List değildir.
İpucu: Composition'ın saklayabildiği API yüzeyini ve implementasyon ayrıntısını düşünün.
Kısa açıklama: Composition kontrollü API, invariant koruması ve implementasyon değiştirme özgürlüğü sağlar.
Açıklama: Stack bir List'in bütün davranış sözleşmesini taşımak zorunda değildir. Private bileşen yalnız ihtiyaç duyulan operasyonlarla çevrelenir. Stack'in List yerine her yerde kullanılabilmesi hedeflenmez.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: composition, inheritance, stack, invariant

## O24-02 · Kod çıktısı
Konu: Composition
Soru: Deque bileşenini kapsülleyen Stack sınıfının çıktısı nedir?
Kod:
```java
class Stack {
    private final java.util.Deque<Integer> data = new java.util.ArrayDeque<>();
    void push(int value) { data.push(value); }
    int pop() { return data.pop(); }
    int size() { return data.size(); }
}

Stack stack = new Stack();
stack.push(10);
stack.push(20);
System.out.println(stack.pop());
System.out.println(stack.size());
```
Cevap:
```
20
1
```
Büyük/küçük harf duyarlı: evet
İpucu: Deque.push öğeyi başa ekler; pop en son push edilen öğeyi alır.
Kısa açıklama: LIFO gereği 20 çıkar ve stack'te bir öğe kalır.
Açıklama: Stack içindeki Deque'yi composition ile kullanır ve yalnız alan davranışlarını sunar. İstemci doğrudan Deque'ye erişemez.
Varsayım: Deque başlangıçta boştur.
Varsayım: Çıktı satır sırası korunur.
Etiketler: composition, stack, lifo, output

# O25 · Orta · Kod yazma

Bir `Order` nesnesinin birden fazla `OrderItem` içermesini composition kullanarak modelleyin. Ürün, adet ve toplam tutar sorumluluklarını doğru sınıflara dağıtın.

Örnek çözüm:
```java
class Product {
    private final String name;
    private final double unitPrice;  // Gerçek para hesabında BigDecimal kullanılır.

    public Product(String name, double unitPrice) {
        this.name = name;
        this.unitPrice = unitPrice;
    }

    public String getName() {
        return name;
    }

    public double getUnitPrice() {
        return unitPrice;
    }
}

// Satır, ürünü ve adedi bilir; satır toplamını kendisi hesaplar.
class OrderItem {
    private final Product product;
    private final int quantity;

    public OrderItem(Product product, int quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    public double total() {
        return product.getUnitPrice() * quantity;
    }
}

// Composition: satırları Order oluşturur ve yönetir; satırların ömrü siparişe bağlıdır.
class Order {
    private final List<OrderItem> items = new ArrayList<>();

    public void addItem(Product product, int quantity) {
        items.add(new OrderItem(product, quantity));
    }

    public List<OrderItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    public double total() {
        double sum = 0;
        for (OrderItem item : items) sum += item.total();
        return sum;
    }
}
```

## O25-01 · Eşleştirme
Konu: Composition ile Modelleme
Soru: Order composition modelindeki sorumlulukları uygun sınıfla eşleştirin.
Eşleşmeler:
- productIdentity: Ürün kimliği, adı ve birim fiyatı => Product: Product
- quantity: Siparişteki ürün adedi => OrderItemQuantity: OrderItem.quantity
- lineTotal: Birim fiyat × adet satır toplamı => OrderItemTotal: OrderItem.getTotal()
- orderTotal: Tüm satır toplamlarının toplamı => OrderTotal: Order.getTotal()
Fazladan seçenekler:
- decoy: Product.quantity
İpucu: Satıra ait hesap ile tüm siparişe ait toplamayı ayırın.
Kısa açıklama: Product ürün verisini, OrderItem adet ve satır toplamını, Order ise satır koleksiyonu ve genel toplamı yönetir.
Açıklama: Order, OrderItem nesnelerinden oluşur. Her OrderItem bir Product ve quantity taşır; kendi satır toplamını hesaplar. Order bu sonuçları toplayarak genel tutarı verir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: composition, order, responsibility

## O25-02 · Kod çıktısı
Konu: Composition ile Modelleme
Soru: OrderItem'ın satır toplamı çıktısı nedir?
Kod:
```java
class Product {
    final double unitPrice;
    Product(double unitPrice) { this.unitPrice = unitPrice; }
}
class OrderItem {
    final Product product;
    final int quantity;
    OrderItem(Product product, int quantity) {
        this.product = product;
        this.quantity = quantity;
    }
    double total() { return product.unitPrice * quantity; }
}

OrderItem item = new OrderItem(new Product(15.0), 3);
System.out.println(item.total());
```
Cevap: 45.0
Kabul: 45
Büyük/küçük harf duyarlı: evet
İpucu: Birim fiyatı adetle çarpın.
Kısa açıklama: 15.0 × 3 sonucu 45.0'dır.
Açıklama: OrderItem bir Product'a sahiptir ve quantity bilgisini kendi satır bağlamında tutar. Satır toplamı bu iki veriden hesaplanır; genel sipariş toplamı Order'ın sorumluluğudur.
Varsayım: Fiyat gösterimi ve parasal yuvarlama kapsam dışıdır; örnek yalnız sorumluluk dağılımını ölçer.
Etiketler: composition, order-item, output

# O26 · Orta · Kod inceleme

`CheckoutService` hangi somut sınıfa bağımlıdır? Tasarımı test edilebilir hâle getirmek için bağımlılığı dışarıdan aktarın.

```java
class EmailSender {
    void send(String message) {
    }
}

class CheckoutService {
    private final EmailSender sender = new EmailSender();

    void checkout() {
        sender.send("Order completed");
    }
}
```

## O26-01 · Tek seçim
Konu: Dependency Injection
Soru: Kaynak tasarımda CheckoutService'in doğrudan bağımlı olduğu somut sınıf hangisidir?
Kod:
```java
class CheckoutService {
    private final EmailSender sender = new EmailSender();

    void checkout() {
        sender.send("Order completed");
    }
}
```
Şıklar:
- [x] email: EmailSender
  Neden: Doğru: alan doğrudan new EmailSender() ile oluşturulur.
- [ ] string: String
  Neden: String mesaj verisidir; tasarımda değiştirilecek gönderici bağımlılığı değildir.
- [ ] checkout: CheckoutService'in kendisi
  Neden: Sınıfın kendisi bu bağlamda dış bağımlılık değildir.
- [ ] none: Hiçbir sınıf; new bağımlılık oluşturmaz
  Neden: Yanlış: nesne oluşturmak somut tipe bağımlılık kurar.
İpucu: Sınıf gövdesindeki new ifadesini bulun.
Kısa açıklama: CheckoutService somut EmailSender'ı kendisi oluşturur ve ona sıkı bağlıdır.
Açıklama: Bağımlılığın içeride new ile kurulması farklı gönderici veya test doubles kullanmayı zorlaştırır. Sender sözleşmesi constructor üzerinden dışarıdan aktarılabilir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: dependency, dependency-injection, testability

## O26-02 · Çoklu seçim
Konu: Dependency Injection
Soru: MessageSender interface'inin CheckoutService constructor'ından alınmasının sağladığı yararları seçin.
Kod:
```java
interface MessageSender { void send(String message); }
class CheckoutService {
    private final MessageSender sender;
    CheckoutService(MessageSender sender) {
        this.sender = sender;
    }
}
```
Şıklar:
- [x] fake: Testte kayıt tutan fake sender verilebilir.
  Neden: Doğru: yan etki üretmeyen test double kullanılabilir.
- [x] replace: Email yerine SMS uygulaması istemci sınıf değiştirilmeden takılabilir.
  Neden: Doğru: ortak sözleşmenin başka uygulaması takılabilir.
- [ ] visible: CheckoutService hangi MessageSender uygulamasını kullanacağına kendi içinde karar verir.
  Neden: Yanlış: hangi uygulamanın verileceğine composition root karar verir; CheckoutService yalnız sözleşmeyi bilir.
- [ ] noValidation: Constructor'a null verilmesini derleyici engeller.
  Neden: Yanlış: Java null argümanı derleme zamanında engellemez; gerekirse `Objects.requireNonNull` ile kontrol edilir.
İpucu: Nesne oluşturma kararı sınıfın dışına taşındığında test ve değiştirilebilirlik nasıl etkilenir?
Kısa açıklama: Constructor injection bağımlılığı görünür, değiştirilebilir ve testte ikame edilebilir yapar.
Açıklama: CheckoutService MessageSender sözleşmesine bağlı kalır. Composition root uygun gerçek veya sahte uygulamayı verir. Constructor injection geçersiz null değerini kendiliğinden engellemez; sınıf gerekirse doğrulamalıdır.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: dependency-injection, constructor-injection, testability

# O27 · Orta · Teori

Cohesion ve coupling nedir? Yüksek cohesion ve düşük coupling hedefinin bakım ve test edilebilirliğe etkisini açıklayın.

## O27-01 · Tek seçim
Konu: Cohesion ve Coupling
Soru: Yüksek cohesion ve düşük coupling hedefini en iyi karşılayan tasarım hangisidir?
Şıklar:
- [x] a: InvoiceCalculator yalnız fatura hesaplar ve TaxPolicy interface'ini constructor'dan alır.
  Neden: Doğru: sorumluluk odaklı, bağımlılık soyuttur.
- [ ] b: InvoiceManager hesaplama, veritabanı, e-posta ve raporlama işlerinin tümünü yapıp somut sınıfları kendi oluşturur.
  Neden: Birbiriyle ilgisiz sorumluluklar düşük cohesion; içeride new kullanımı sıkı coupling üretir.
- [ ] c: Tüm sınıflar ortak global mutable state'i doğrudan değiştirir.
  Neden: Global mutable state güçlü ve gizli coupling oluşturur.
- [ ] d: Her sınıf diğer sınıfların private ayrıntılarını reflection ile kullanır.
  Neden: İç ayrıntılara bağımlılık coupling'i artırır.
İpucu: Tek ve ilişkili bir amaç ile değiştirilebilir bağımlılığı birlikte arayın.
Kısa açıklama: Odaklı sorumluluk cohesion'ı yükseltir; soyut bağımlılığın dışarıdan verilmesi coupling'i düşürür.
Açıklama: Yüksek cohesion bir sınıfın üyelerinin tek, anlamlı bir amaç etrafında toplanmasıdır. Düşük coupling ise sınıfların birbirlerinin somut ayrıntılarına az bağımlı olmasıdır; bu bakım ve izole testi kolaylaştırır.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: cohesion, coupling, maintainability, testability

# O28 · Orta · Kod inceleme

Sınıfı Single Responsibility Principle açısından değerlendirin ve sorumluluklara ayırın.

```java
class UserService {
    void registerUser() {}
    void saveToDatabase() {}
    void sendWelcomeEmail() {}
    void generateMonthlyUserReport() {}
}
```

## O28-01 · Çoklu seçim
Konu: SOLID · Single Responsibility
Soru: UserService içinde birbirinden bağımsız değişim nedenleri oluşturan sorumlulukları seçin.
Kod:
```java
class UserService {
    void registerUser() { }
    void saveToDatabase() { }
    void sendWelcomeEmail() { }
    void generateMonthlyUserReport() { }
}
```
Şıklar:
- [x] registration: Kullanıcı kayıt iş akışı
  Neden: Doğru: domain/use-case akışıdır.
- [x] persistence: Veritabanına kalıcılık
  Neden: Doğru: veri erişimi ayrı bir değişim eksenidir.
- [x] email: E-posta gönderimi
  Neden: Doğru: bildirim altyapısı ayrı değişir.
- [x] report: Aylık rapor üretimi
  Neden: Doğru: raporlama gereksinimleri bağımsız değişir.
İpucu: İş kuralı, altyapı ve raporlama farklı nedenlerle değişebilir.
Kısa açıklama: Dört operasyon da ayrı değişim nedeni taşır; tek sınıfta toplanmaları SRP ihlalidir.
Açıklama: Kayıt akışı ürün kuralıyla, persistence veri teknolojisiyle, e-posta sağlayıcıyla ve raporlama analitik ihtiyaçlarla değişir. SRP her metot için ayrı sınıf demek değil, aynı değişim eksenindeki davranışları birlikte tutmak demektir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: solid, srp, responsibility

## O28-02 · Eşleştirme
Konu: SOLID · Single Responsibility
Soru: UserService operasyonlarını önerilen odaklı bileşenlerle eşleştirin.
Eşleşmeler:
- register: Kayıt iş akışını orkestre etme => RegistrationService: RegistrationService
- save: User verisini saklama => UserRepository: UserRepository
- welcome: Hoş geldin mesajı gönderme => WelcomeNotifier: WelcomeNotifier
- monthly: Aylık kullanıcı raporu üretme => UserReportGenerator: UserReportGenerator
Fazladan seçenekler:
- decoy: UserManager (tüm işler tek sınıfta)
İpucu: Bileşen adlarını tek değişim nedeni etrafında okuyun.
Kısa açıklama: İş akışı, kalıcılık, bildirim ve raporlama odaklı sınıflara ayrılır.
Açıklama: RegistrationService diğer soyut bileşenleri orkestre edebilir; persistence ve dış iletişim ayrıntılarını kendi içine almaz. Ayrım, testlerde her değişim eksenini izole etmeyi kolaylaştırır.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: solid, srp, refactoring

# O29 · Orta · Kod inceleme

İndirim hesaplamasını Open/Closed Principle’a uygun şekilde yeniden tasarlayın.

```java
double calculateDiscount(String customerType, double amount) {
    if (customerType.equals("REGULAR")) {
        return amount * 0.05;
    } else if (customerType.equals("PREMIUM")) {
        return amount * 0.10;
    }

    return 0;
}
```

## O29-01 · Tek seçim
Konu: SOLID · Open/Closed
Soru: Yeni müşteri türleri eklendiğinde mevcut indirim hesaplayıcıdaki if/else zincirini değiştirmemeyi sağlayan tasarım hangisidir?
Şıklar:
- [x] a: DiscountPolicy interface'i ve her politika için calculate(amount) uygulaması
  Neden: Doğru: değişen indirim davranışı polymorphic stratejilere ayrılır.
- [ ] b: customerType String karşılaştırmalarını tek, daha uzun metoda eklemeye devam etmek
  Neden: Her yeni tür mevcut metodu değiştirmeyi gerektirir.
- [ ] c: Her müşteri türü için global boolean alan eklemek
  Neden: Global bayraklar kombinasyon ve durum karmaşası üretir.
- [ ] d: Bütün indirimleri çağıran kod içinde tekrar hesaplamak
  Neden: Kod tekrarına ve tutarsızlığa yol açar.
İpucu: Değişen algoritmayı ortak bir sözleşmenin arkasına alın.
Kısa açıklama: Strategy benzeri DiscountPolicy uygulamaları mevcut hesaplayıcıyı değiştirmeden genişletilebilir.
Açıklama: Checkout/DiscountCalculator bir DiscountPolicy'ye delegasyon yapar. Yeni politika interface'i uygulayarak eklenir; istemcide tür String'lerine göre büyüyen koşullar gerekmez.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: solid, ocp, strategy, discount

## O29-02 · Kod çıktısı
Konu: SOLID · Open/Closed
Soru: Enjekte edilen PremiumDiscount politikasıyla hesaplanan indirim çıktısı nedir?
Kod:
```java
interface DiscountPolicy {
    double discount(double amount);
}
class PremiumDiscount implements DiscountPolicy {
    public double discount(double amount) { return amount * 0.10; }
}
class DiscountCalculator {
    private final DiscountPolicy policy;
    DiscountCalculator(DiscountPolicy policy) { this.policy = policy; }
    double calculate(double amount) { return policy.discount(amount); }
}

System.out.println(new DiscountCalculator(new PremiumDiscount()).calculate(200.0));
```
Cevap: 20.0
Kabul: 20
Büyük/küçük harf duyarlı: evet
İpucu: Premium politika tutarın yüzde 10'unu döndürüyor.
Kısa açıklama: 200.0 × 0.10 = 20.0.
Açıklama: Calculator somut müşteri türünü sorgulamaz; seçilen DiscountPolicy'ye delegasyon yapar. Yeni politika eklendiğinde calculator'ın kaynak kodu değişmez.
Varsayım: Negatif tutar, para birimi ve yuvarlama bu örneğin kapsamı dışındadır.
Etiketler: solid, ocp, strategy, output

# O30 · Orta · Teori

DRY, KISS ve YAGNI prensiplerini açıklayın. Tekrarlanan doğrulama kodu ile henüz gerekmeyen kapsamlı bir kural motorunu bu prensipler açısından değerlendirin.

## O30-01 · Eşleştirme
Konu: DRY, KISS ve YAGNI
Soru: Kodlama kararlarını en doğrudan ilgili prensiple eşleştirin.
Eşleşmeler:
- duplicateValidation: Aynı e-posta doğrulamasını beş yerde kopyalamak yerine tek bileşende toplamak => DRY: DRY
- simpleRule: İki açık koşul yeterliyken anlaşılır, küçük çözümü seçmek => KISS: KISS
- futureEngine: Henüz gereksinim yokken genel amaçlı kural motoru yazmamak => YAGNI: YAGNI
Fazladan seçenekler:
- decoy: Open/Closed Principle
İpucu: Tekrar, gereksiz karmaşıklık ve spekülatif özellikleri ayrı ayrı düşünün.
Kısa açıklama: Tekrarlı bilgi DRY, basit çözüm KISS, gerekmeyen gelecek özelliği YAGNI ile ilgilidir.
Açıklama: DRY aynı bilginin birden fazla doğruluk kaynağına dönüşmesini önler. KISS mevcut problemi anlaşılır en basit tasarımla çözmeyi, YAGNI ise yalnız gelecekte gerekebilir diye özellik üretmemeyi öğütler.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: dry, kiss, yagni, principles

# O31 · Zorlayıcı · Kod inceleme

Tasarımı Liskov Substitution Principle açısından değerlendirin ve yeniden modelleyin.

```java
class Bird {
    void fly() {
    }
}

class Penguin extends Bird {
    @Override
    void fly() {
        throw new UnsupportedOperationException();
    }
}
```

## O31-01 · Tek seçim
Konu: SOLID · Liskov Substitution
Soru: Penguin.fly() metodunun UnsupportedOperationException fırlatması neden Liskov Substitution Principle ihlalidir?
Kod:
```java
class Bird {
    void fly() { }
}
class Penguin extends Bird {
    @Override
    void fly() {
        throw new UnsupportedOperationException();
    }
}
```
Şıklar:
- [x] a: Penguin, Bird'ün sözleşmesini bozar.
  Neden: Doğru: alt tür üst türün davranış sözleşmesini karşılamaz.
- [ ] b: Alt sınıfların metot override etmesi LSP'ye aykırıdır.
  Neden: Override yasak değildir; sözleşmeyle uyumlu olmalıdır.
- [ ] c: Override edilen metotta unchecked exception fırlatmayı Java derleyicisi engeller.
  Neden: Override eden metot unchecked exception fırlatabilir; sorun derleme değil, beklenen davranışın reddedilmesidir.
- [ ] d: Penguin sınıfında constructor bulunmadığı için.
  Neden: Derleyici parametresiz constructor sağlayabilir; LSP ile ilgisi yoktur.
İpucu: Bird bekleyen istemcinin geçerli varsayımı Penguin ile bozuluyor mu?
Kısa açıklama: Penguin, Bird'ün vaat ettiği fly davranışını sağlayamadığı için yerine geçebilirliği bozar.
Açıklama: Üst tür API'si tüm Bird örneklerinin fly çağrısını desteklediği izlenimini verir. Penguin bu geçerli operasyonu reddettiğinde istemci alt tür bilgisi kullanmak zorunda kalır; hiyerarşinin sözleşmesi yanlıştır.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: solid, lsp, substitutability, bird-penguin

## O31-02 · Çoklu seçim
Konu: SOLID · Liskov Substitution
Soru: Bird–Penguin modelini substitutability açısından iyileştiren kararları seçin.
Şıklar:
- [ ] baseBird: Bird temel türü fly metodunu korusun; Penguin bu metotta UnsupportedOperationException fırlatsın.
  Neden: Yanlış: istemci her Bird'ün uçabileceğini varsayar; exception fırlatan alt tür bu beklentiyi bozar.
- [x] flyable: fly davranışı ayrı Flyable interface'ine taşınsın.
  Neden: Doğru: uçuş ayrı ve doğru bir yetenek sözleşmesine dönüşür.
- [x] flyingBird: Sparrow gibi uçan türler Flyable uygulasın; Penguin uygulamasın.
  Neden: Doğru: yalnız uygun türler yeteneği uygular.
- [ ] empty: Penguin.fly boş bir gövdeyle dönsün ve Penguin yine Flyable sayılsın.
  Neden: Yanlış: uçması beklenen bir Flyable'ın sessizce uçmaması davranış beklentisini bozar.
İpucu: Uçamayan nesneye uçma sözleşmesi vermeyin.
Kısa açıklama: Ortak kuş özellikleri Bird'de, uçma yeteneği Flyable'da tutulmalıdır.
Açıklama: Yetenek tabanlı modelde yalnız gerçekten uçabilen türler Flyable sözleşmesini verir. Sessiz no-op uygulama da istemcinin uçuş gerçekleştiği beklentisini bozabileceği için çözüm değildir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: solid, lsp, interface, refactoring

# O32 · Zorlayıcı · Kod inceleme

Interface’i Interface Segregation Principle’a göre daha küçük arayüzlere ayırın.

```java
interface Worker {
    void work();
    void eat();
    void sleep();
    void recharge();
}
```

## O32-01 · Eşleştirme
Konu: SOLID · Interface Segregation
Soru: Worker interface'indeki operasyonları ayrıştırılmış yetenek interface'leriyle eşleştirin.
Eşleşmeler:
- work: work() => Workable: Workable
- eat: eat() => Eatable: Eatable
- sleep: sleep() => Sleepable: Sleepable
- recharge: recharge() => Rechargeable: Rechargeable
Fazladan seçenekler:
- decoy: Worker (tüm operasyonları içeren geniş interface)
İpucu: Her interface'i tek, uyumlu bir istemci ihtiyacına göre adlandırın.
Kısa açıklama: Büyük Worker sözleşmesi dört küçük yetenek interface'ine ayrılır.
Açıklama: Interface Segregation, istemcilerin kullanmadıkları operasyonlara bağımlı bırakılmamasını ister. İnsan ve robot gibi türler yalnız gerçekten sağladıkları yetenekleri uygular.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: solid, isp, interface-segregation

## O32-02 · Çoklu seçim
Konu: SOLID · Interface Segregation
Soru: Workable, Eatable, Sleepable ve Rechargeable interface'lerine ayrılmış tasarımda doğru uygulama seçimlerini işaretleyin.
Şıklar:
- [x] humanWork: HumanWorker, Workable uygular.
  Neden: Doğru: insan çalışan work davranışı sağlar.
- [x] humanEat: HumanWorker, Eatable ve Sleepable uygular.
  Neden: Doğru: örnek alan modelinde insan bu yetenekleri sağlar.
- [x] robotWork: RobotWorker, Workable ve Rechargeable uygular.
  Neden: Doğru: robot çalışır ve şarj edilir.
- [ ] robotEat: RobotWorker, kullanmayacağı Eatable'ı da zorunlu olarak uygular.
  Neden: Yanlış: ayrıştırmanın amacı kullanılmayan sözleşmeyi zorunlu kılmamaktır.
İpucu: Her tür yalnız anlamlı şekilde yerine getirebildiği sözleşmeleri almalıdır.
Kısa açıklama: İnsan çalışma/yeme/uyuma, robot çalışma/şarj yeteneklerini uygular.
Açıklama: Küçük interface'ler implementasyonları anlamsız no-op veya UnsupportedOperationException metotlarından kurtarır ve istemcilerin yalnız kullandıkları sözleşmeye bağlanmasını sağlar.
Varsayım: Senaryodaki robot enerji için recharge kullanır; eat ve sleep davranışları yoktur.
Etiketler: solid, isp, capability

# O33 · Zorlayıcı · Kod inceleme

Tasarımı Dependency Inversion Principle’a uygun hâle getirin.

```java
class MySqlOrderRepository {
    void save(Order order) {
    }
}

class OrderService {
    private final MySqlOrderRepository repository =
            new MySqlOrderRepository();

    void createOrder(Order order) {
        repository.save(order);
    }
}
```

## O33-01 · Tek seçim
Konu: SOLID · Dependency Inversion
Soru: OrderService tasarımını Dependency Inversion Principle'a uygun hâle getiren temel değişiklik hangisidir?
Kod:
```java
class OrderService {
    private final MySqlOrderRepository repository =
            new MySqlOrderRepository();
}
```
Şıklar:
- [x] a: OrderRepository abstraction'ı tanımlayıp OrderService'e constructor'dan vermek
  Neden: Doğru: bağımlılığın yönü abstraction'a çevrilir.
- [ ] b: MySqlOrderRepository alanını public static yapmak
  Neden: Global somut bağımlılığı daha da güçlendirir.
- [ ] c: save çağrısını tüm controller'lara kopyalamak
  Neden: Tekrar ve coupling oluşturur.
- [ ] d: Somut sınıf adını String alanında saklayıp if ile seçmek
  Neden: String tabanlı tür seçimi soyut sözleşme sağlamaz.
İpucu: Yüksek seviyeli iş akışı somut veritabanı ayrıntısını oluşturmamalıdır.
Kısa açıklama: OrderService soyut OrderRepository'ye, MySQL sınıfı da bu sözleşmeye bağımlı olmalıdır.
Açıklama: DIP yüksek ve düşük seviyeli modüllerin abstraction'a yönelmesini ister. Constructor injection composition root'a MySQL, in-memory veya test uygulaması seçme olanağı verir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: solid, dip, repository, dependency-injection

## O33-02 · Boşluk doldurma
Konu: SOLID · Dependency Inversion
Soru: OrderService constructor'ındaki eksik parametre bildirimini yazın.
Kod:
```java
interface OrderRepository {
    void save(Order order);
}
class OrderService {
    private final OrderRepository repository;

    OrderService(________________________) {
        this.repository = repository;
    }
}
```
Cevap: OrderRepository repository
Kabul: final OrderRepository repository
Kabul: OrderRepository  repository
Büyük/küçük harf duyarlı: evet
İpucu: Alan somut MySQL sınıfı değil, interface türündedir.
Kısa açıklama: Parametre OrderRepository repository olmalıdır.
Açıklama: Constructor soyut repository sözleşmesini alır. final parametre niteleyicisi isteğe bağlı ve eşdeğer kabul edilmiştir; alan zaten final olduğundan constructor'da bir kez atanır.
Varsayım: Order türü tanımlıdır; soru yalnız bağımlılık bildiriminin tipini ölçer.
Etiketler: solid, dip, constructor-injection, fill

# O34 · Zorlayıcı · Tasarım

Bir alt sınıfın override ettiği `withdraw` metodunun, üst sınıfta geçerli olan bazı girdiler için yeni bir exception fırlatması hangi substitutability sorununu doğurur? Sözleşmeyi veya sınıf hiyerarşisini yeniden tasarlayın.

## O34-01 · Tek seçim
Konu: SOLID · Liskov Substitution
Soru: Üst sınıf withdraw(1..balance) aralığındaki tüm tutarları kabul ederken alt sınıfın minimum 100 koşulu ekleyip daha küçük tutarlarda exception fırlatması hangi sözleşme sorununu oluşturur?
Şıklar:
- [x] a: Alt sınıf önkoşulu güçlendirip LSP'yi bozar.
  Neden: Doğru: geçerli üst tür çağrısı alt türde reddedilir.
- [ ] b: Alt sınıf postcondition'ı güçlendirdiği için üst türün yerine güvenle kullanılabilir; sözleşme sorunu yoktur.
  Neden: Burada güçlenen postcondition değil precondition'dır; küçük tutarlar artık reddedilir.
- [ ] c: Bu bir performans sorunudur; davranış sözleşmesi etkilenmez.
  Neden: İstemci davranışı exception ile değişir.
- [ ] d: Overloading sorunudur çünkü parametre adı değişmiştir.
  Neden: Parametre adı metot imzasının parçası değildir.
İpucu: Üst tür istemcisinin geçerli kabul ettiği 50 tutarını düşünün.
Kısa açıklama: Yeni minimum, kabul edilen girdi kümesini daraltır ve LSP'yi ihlal eder.
Açıklama: Alt tür üst türden daha güçlü bir önkoşul dayatamaz; aksi hâlde BaseAccount ile çalışan istemci SpecialAccount verildiğinde bozulur. Parametre adının overload ile ilgisi yoktur.
Varsayım: Üst sınıf sözleşmesi pozitif ve bakiyeyi aşmayan her tutarı kabul ettiğini açıkça vaat eder.
Etiketler: solid, lsp, precondition, contract

## O34-02 · Çoklu seçim
Konu: SOLID · Liskov Substitution
Soru: Minimum çekim tutarı zorunlu olan hesap türünü substitutability'yi bozmadan modelleyebilecek seçenekleri seçin.
Şıklar:
- [x] commonContract: Ortak Account sözleşmesine minimum kuralını açıkça dahil edip tüm implementasyonların aynı sözleşmeye uymasını sağlamak
  Neden: Doğru: tüm alt türlerin karşılayabildiği ortak sözleşme kurulur.
- [x] separateCapability: Farklı çekim sözleşmelerini ayrı interface veya ayrı hiyerarşilerle ifade etmek
  Neden: Doğru: farklı davranışlar yanlış bir ortak tipe zorlanmaz.
- [x] policy: WithdrawalPolicy composition kullanıp kabul kuralını açık ve enjekte edilebilir yapmak
  Neden: Doğru: değişen kabul kuralı açık bir collaborator olur.
- [ ] surprise: Alt sınıfta belgelenmemiş yeni exception fırlatıp istemcinin yakalamasını ummak
  Neden: Yanlış: asıl substitutability ihlalini sürdürür.
İpucu: İstemciye verilen sözleşmeyle gerçek kabul kurallarını uyumlu hâle getirin.
Kısa açıklama: Sözleşme uyumlandırılabilir, yetenekler ayrılabilir veya değişen kural policy olarak bileşime taşınabilir.
Açıklama: Doğru çözüm domain'e bağlıdır. Önemli olan üst türün vaat ettiği geçerli girdilerin alt türde sürpriz biçimde reddedilmemesidir. Gizli exception istemciye alt tür bilgisi sızdırır.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: solid, lsp, composition, contract

# O35 · Zorlayıcı · Kod yazma

Kredi kartı, banka havalesi ve dijital cüzdanla ödeme alabilen bir checkout sistemi tasarlayın. Yeni ödeme türlerinde koşul bloklarının büyümemesini sağlayın.

Örnek çözüm:
```java
// Yeni ödeme türü yeni bir sınıf olarak eklenir; CheckoutService değişmez.
interface PaymentMethod {
    String pay(double amount);
}

class CreditCardPayment implements PaymentMethod {
    public String pay(double amount) {
        return "credit:" + amount;
    }
}

class BankTransferPayment implements PaymentMethod {
    public String pay(double amount) {
        return "transfer:" + amount;
    }
}

class WalletPayment implements PaymentMethod {
    public String pay(double amount) {
        return "wallet:" + amount;
    }
}

class CheckoutService {
    // Ödeme yöntemi dışarıdan verilir; türe bakan if veya switch bloğu yoktur.
    public String checkout(double amount, PaymentMethod method) {
        return method.pay(amount);
    }
}
```

## O35-01 · Çoklu seçim
Konu: Ödeme Sistemi Tasarımı
Soru: Yeni ödeme türlerinde koşul bloklarının büyümesini engelleyen checkout tasarımının parçalarını seçin.
Şıklar:
- [x] contract: PaymentMethod adında pay(amount) sözleşmesi
  Neden: Doğru: istemci için kararlı abstraction sağlar.
- [x] implementations: CreditCardPayment, BankTransferPayment ve WalletPayment uygulamaları
  Neden: Doğru: kanala özgü davranış kendi sınıfında yaşar.
- [ ] inject: CheckoutService'in seçilen PaymentMethod'ı kendi içinde new ile oluşturması
  Neden: Yanlış: hangi sınıfın oluşturulacağına içeride karar vermek yine ödeme türüne göre koşul gerektirir; seçim dışarıda yapılmalıdır.
- [ ] typeString: CheckoutService içinde paymentType String'i için sürekli büyüyen switch
  Neden: Yanlış: her yeni tür mevcut koşul bloğunu değiştirir.
İpucu: Değişen ödeme davranışını polymorphic nesnelere taşıyın.
Kısa açıklama: Ortak sözleşme, somut stratejiler ve injection genişletilebilir bir tasarım sağlar.
Açıklama: CheckoutService yalnız PaymentMethod.pay çağrısını bilir. Yeni ödeme türü yeni bir implementation olarak eklenir; ana iş akışında tür String'ine göre dallanma büyümez.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: payment, strategy, polymorphism, ocp

## O35-02 · Kod çıktısı
Konu: Ödeme Sistemi Tasarımı
Soru: PaymentMethod polymorphism'i kullanıldığında checkout çıktısı nedir?
Kod:
```java
interface PaymentMethod {
    String pay(double amount);
}
class CreditCardPayment implements PaymentMethod {
    public String pay(double amount) { return "credit:" + amount; }
}
class CheckoutService {
    String checkout(double amount, PaymentMethod method) {
        return method.pay(amount);
    }
}

System.out.println(new CheckoutService().checkout(250.0, new CreditCardPayment()));
```
Cevap: credit:250.0
Büyük/küçük harf duyarlı: evet
İpucu: CheckoutService tutarı aldığı stratejinin pay metoduna aynen iletir.
Kısa açıklama: CreditCardPayment.pay 250.0 için credit:250.0 döndürür.
Açıklama: CheckoutService somut ödeme sınıfını sorgulamaz. Interface çağrısı çalışma zamanındaki CreditCardPayment uygulamasına yönlenir.
Varsayım: Ödeme başarısızlığı, para birimi ve hassas kart verisi bu küçük örneğin kapsamı dışındadır.
Etiketler: payment, strategy, polymorphism, output

# O36 · Zorlayıcı · Modelleme

E-posta, SMS ve mobil bildirim gönderen bir sistem modelleyin. Ortak mesaj bilgilerini ve kanala özgü doğrulama/gönderim davranışlarını belirleyin.

## O36-01 · Eşleştirme
Konu: Bildirim Sistemi Modelleme
Soru: Bildirim sistemindeki verileri ve davranışları en uygun sahibine eşleştirin.
Eşleşmeler:
- messageBody: Başlık ve mesaj gövdesi => Message: Message value object
- emailValidation: E-posta adresi biçim doğrulaması => EmailChannel: EmailChannel
- smsValidation: Telefon numarası ve SMS uzunluk doğrulaması => SmsChannel: SmsChannel
- pushValidation: Cihaz token'ı doğrulaması => PushChannel: PushChannel
Fazladan seçenekler:
- decoy: NotificationService içinde tek büyük switch
İpucu: Kanaldan bağımsız veri ile kanalın hedef/taşıma kurallarını ayırın.
Kısa açıklama: Ortak içerik Message'da, hedefe özgü doğrulama ve gönderim ilgili channel'da tutulur.
Açıklama: NotificationService bir NotificationChannel sözleşmesine delegasyon yapabilir. Email, SMS ve push implementasyonları kendi adresleme kısıtlarını ve sağlayıcı entegrasyonlarını kapsüller.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: notification, modeling, strategy, responsibility

## O36-02 · Çoklu seçim
Konu: Bildirim Sistemi Modelleme
Soru: E-posta, SMS ve push kanalları için sağlam sorumluluk dağılımını seçin.
Şıklar:
- [x] commonContract: Kanallar send(Message, Recipient) benzeri ortak bir sözleşme uygular.
  Neden: Doğru: istemci kanalları polymorphic kullanır.
- [x] channelRules: Her kanal kendi hedef biçimini ve kanal limitlerini doğrular.
  Neden: Doğru: kanal invariant'ı ilgili implementasyonda yaşar.
- [x] orchestrator: NotificationService kanal seçimi/orkestrasyon yapar, sağlayıcı ayrıntısını kanala bırakır.
  Neden: Doğru: akış ile teknik gönderim ayrıntısı ayrılır.
- [ ] oneHuge: Kanal doğrulama ve gönderim koşulları tek bir büyük static metotta if-else zinciriyle toplanır.
  Neden: Yanlış: düşük cohesion ve büyüyen koşullar üretir.
İpucu: Ortak kullanım biçimini korurken değişen ayrıntıları ilgili sınıfta tutun.
Kısa açıklama: Ortak channel sözleşmesi ile kanala özgü doğrulama/gönderim ayrılmalıdır.
Açıklama: Bu dağılım yeni kanal eklemeyi kolaylaştırır ve her entegrasyonu izole test edilebilir kılar. Büyük koşul metodu birden fazla değişim nedenini birleştirir.
Varsayım: Recipient, kanal hedeflerini tür güvenli biçimde sağlayan bir model veya kanal özel value object'leriyle temsil edilir.
Etiketler: notification, polymorphism, cohesion

# O37 · Zorlayıcı · Modelleme

Ödünç alma, iade, rezervasyon ve gecikme cezasını destekleyen bir kütüphane sistemi modelleyin. Kitap ile fiziksel kitap kopyasının ayrı nesneler olup olmayacağını gerekçelendirin.

## O37-01 · Tek seçim
Konu: Kütüphane Sistemi Modelleme
Soru: Aynı ISBN'e ait üç fiziksel kopyanın farklı barkod, konum ve ödünç durumları varsa en uygun model hangisidir?
Şıklar:
- [x] a: Bibliyografik bilgi için Book, her fiziksel örnek için BookCopy nesnesi
  Neden: Doğru: ortak metadata ile kopya state'i ayrılır.
- [ ] b: Üç kopyayı tek boolean available alanıyla tek Book nesnesinde temsil etmek
  Neden: Tek boolean üç bağımsız kopyanın durumunu ifade edemez.
- [ ] c: Her ödünçte ISBN metnini değiştirerek kopyayı ayırt etmek
  Neden: ISBN eser kimliğidir; kopya kimliği olarak değiştirilmez.
- [ ] d: Book sınıfını Member sınıfından kalıtmak
  Neden: Book ile Member arasında is-a ilişkisi yoktur.
İpucu: Paylaşılan eser kimliği ile tek tek izlenen envanter örneğini ayırın.
Kısa açıklama: Book eseri, BookCopy ise ayrı fiziksel envanter örneğini temsil etmelidir.
Açıklama: Kopyalar bağımsız barkod, konum ve durum taşır. Loan belirli BookCopy ile Member'ı bağlar; Reservation çoğu modelde eser düzeyinde uygun bir sonraki kopyayı bekleyebilir.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: library, modeling, entity, book-copy

## O37-02 · Eşleştirme
Konu: Kütüphane Sistemi Modelleme
Soru: Kütüphane alanındaki sorumlulukları uygun nesneyle eşleştirin.
Eşleşmeler:
- metadata: ISBN, başlık ve yazar bilgisi => Book: Book
- copyState: Barkod, raf ve AVAILABLE/LOANED durumu => BookCopy: BookCopy
- loanDates: Ödünç alan üye, alış tarihi ve son iade tarihi => Loan: Loan
- lateFee: Gecikme gününden ücret hesaplama politikası => LateFeePolicy: LateFeePolicy
Fazladan seçenekler:
- decoy: Member
İpucu: Varlık state'i, ilişki state'i ve değişebilen hesaplama politikasını ayırın.
Kısa açıklama: Eser, fiziksel kopya, ödünç işlemi ve ücret politikası ayrı sorumluluklardır.
Açıklama: Loan belirli bir Member ile BookCopy arasındaki zamanlı ilişkiyi modeller. LateFeePolicy composition ile değişen ceza kurallarını Loan/Service sınıfından ayırır.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: library, modeling, composition, policy

# O38 · Zorlayıcı · Modelleme

Bir e-ticaret siparişinin oluşturulma, ödeme, hazırlanma, kargolanma ve iptal durumlarını modelleyin. Geçersiz durum geçişlerini engelleyin.

## O38-01 · Sıralama
Konu: Sipariş Durum Modelleme
Soru: Başarılı bir siparişin normal yaşam döngüsü durumlarını sıralayın.
Sıra:
1. CREATED: CREATED
2. PAID: PAID
3. PREPARING: PREPARING
4. SHIPPED: SHIPPED
İpucu: Ödeme hazırlıktan, hazırlık kargodan önce gelir.
Kısa açıklama: Normal sıra CREATED → PAID → PREPARING → SHIPPED biçimindedir.
Açıklama: Durum geçişleri Order içindeki davranış metotları veya ayrı bir transition policy tarafından doğrulanmalıdır. State alanını kuralsız setter ile açmak sıralamayı atlanabilir kılar.
Varsayım: Başarılı akışta iptal veya ödeme hatası yoktur.
Varsayım: Teslim edildi durumu bu kaynak senaryonun kapsamına dahil edilmemiştir.
Etiketler: order, state-machine, lifecycle

## O38-02 · Doğru / Yanlış
Konu: Sipariş Durum Modelleme
Soru: Sözleşme yalnız CREATED ve PAID durumlarında iptale izin veriyorsa SHIPPED durumundaki cancel() çağrısı state'i değiştirmeden reddedilmelidir.
Şıklar:
- [x] Doğru
  Neden: Doğru: tanımlı geçiş sözleşmesi SHIPPED iptalini yasaklar.
- [ ] Yanlış
  Neden: Yanlış: her durumdan iptal, verilen geçiş sözleşmesine aykırıdır.
İpucu: Geçiş tablosunda SHIPPED → CANCELLED oku bulunmuyor.
Kısa açıklama: Doğru. Geçersiz geçiş engellenmeli ve sipariş SHIPPED kalmalıdır.
Açıklama: Order kendi state machine invariant'ını korur. Geçersiz geçiş exception veya başarısız sonuçla bildirilebilir; önemli olan state'in kuralsız değiştirilmemesidir.
Varsayım: İzin verilen iptal başlangıç durumları açıkça yalnız CREATED ve PAID'dir.
Etiketler: order, state-machine, invariant, cancellation

# O39 · Zorlayıcı · Modelleme

Otomobil, motosiklet ve kamyon kabul eden bir otopark sistemi tasarlayın. Park yeri atama, giriş-çıkış ve ücret hesaplama sorumluluklarını dağıtın.

## O39-01 · Eşleştirme
Konu: Otopark Sistemi Modelleme
Soru: Otopark sistemi sorumluluklarını uygun bileşenle eşleştirin.
Eşleşmeler:
- vehicleData: Plaka ve araç türü => Vehicle: Vehicle
- spotFit: Park yerinin araç boyutunu kabul edip etmediği => ParkingSpot: ParkingSpot.canFit(vehicle)
- assignment: Uygun boş yeri seçip işgal etmek => ParkingLotService: ParkingLotService
- fee: Süre ve araç türüne göre ücret hesaplamak => FeePolicy: FeePolicy
Fazladan seçenekler:
- decoy: Vehicle.parkSelf()
İpucu: Varlık bilgisi, yer invariant'ı, orkestrasyon ve değişen fiyat politikasını ayırın.
Kısa açıklama: Vehicle veri taşır, ParkingSpot uygunluğu korur, servis atar, FeePolicy ücreti hesaplar.
Açıklama: EntryTicket giriş zamanı, araç ve park yeri bağını kaydedebilir. Çıkış akışı ticket'ı kullanıp FeePolicy'ye delegasyon yapar ve yeri tekrar boşaltır.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: parking-lot, modeling, strategy, responsibility

## O39-02 · Tek seçim
Konu: Otopark Sistemi Modelleme
Soru: Yer boyutları SMALL < MEDIUM < LARGE, araç gereksinimleri motosiklet=SMALL, otomobil=MEDIUM, kamyon=LARGE ve politika 'uygun en küçük boş yeri seç' ise bir otomobil hangi yere atanır?
Şıklar:
- [x] a: Boş MEDIUM yer varsa MEDIUM yere
  Neden: Doğru: gereksinimi karşılayan en küçük boş boyuttur.
- [ ] b: Boş SMALL yer varsa SMALL yere
  Neden: SMALL otomobil için yetersizdir.
- [ ] c: MEDIUM boş olsa bile LARGE yere
  Neden: Verilen en küçük uygun yer politikasına aykırıdır.
- [ ] d: Araç türünden bağımsız rastgele bir yere
  Neden: Politika rastgele seçim yapmaz.
İpucu: Otomobil en az MEDIUM ister ve politika en küçük uygun yeri seçer.
Kısa açıklama: MEDIUM boşsa otomobil için uygun en küçük yer MEDIUM'dur.
Açıklama: SMALL fiziksel gereksinimi karşılamaz; LARGE uygundur ancak daha küçük araçlar için kaynak verimliliğini düşürür. Açık politika deterministik atama sağlar.
Varsayım: En az bir boş MEDIUM ve bir boş LARGE yer vardır; yerler aynı konum önceliğindedir.
Etiketler: parking-lot, allocation-policy, deterministic

# O40 · Zorlayıcı · Modelleme ve kod yazma

Saatlik, maaşlı ve komisyonlu çalışanları destekleyen bir bordro sistemi tasarlayın. Ücret hesaplamasında polymorphism; vergi ve prim politikalarında composition kullanın.

## O40-01 · Kod çıktısı
Konu: Bordro Sistemi Modelleme
Soru: Polymorphic grossPay çağrılarının toplam çıktısı nedir?
Kod:
```java
interface Employee {
    double grossPay();
}
class HourlyEmployee implements Employee {
    private final double hours, rate;
    HourlyEmployee(double hours, double rate) { this.hours = hours; this.rate = rate; }
    public double grossPay() { return hours * rate; }
}
class SalariedEmployee implements Employee {
    private final double monthlySalary;
    SalariedEmployee(double monthlySalary) { this.monthlySalary = monthlySalary; }
    public double grossPay() { return monthlySalary; }
}

Employee[] employees = {
    new HourlyEmployee(10.0, 20.0),
    new SalariedEmployee(1000.0)
};
double total = 0;
for (Employee employee : employees) total += employee.grossPay();
System.out.println(total);
```
Cevap: 1200.0
Kabul: 1200
Büyük/küçük harf duyarlı: evet
İpucu: Saatlik ücret 10 × 20; maaşlı ücret 1000.
Kısa açıklama: Saatlik 200.0 ve maaşlı 1000.0 toplamı 1200.0'dır.
Açıklama: Döngü Employee sözleşmesine çağrı yapar; çalışma zamanı türü her ücret algoritmasını seçer. Komisyonlu çalışan aynı sözleşmeyle yeni bir uygulama olabilir.
Varsayım: Fazla mesai, para yuvarlama ve vergi bu brüt ücret örneğinin kapsamı dışındadır.
Etiketler: payroll, polymorphism, output

## O40-02 · Eşleştirme
Konu: Bordro Sistemi Modelleme
Soru: Bordro tasarımındaki değişen davranışları uygun mekanizma veya bileşenle eşleştirin.
Eşleşmeler:
- hourlyGross: Saat × saatlik ücret brüt hesaplama => HourlyEmployee: HourlyEmployee.grossPay()
- salaryGross: Aylık sabit brüt ücret hesaplama => SalariedEmployee: SalariedEmployee.grossPay()
- commissionGross: Taban ücret + satış komisyonu hesaplama => CommissionEmployee: CommissionEmployee.grossPay()
- tax: Çalışan türünden bağımsız değişebilen vergi kuralı => TaxPolicy: TaxPolicy composition
- bonus: Kampanyaya göre değişebilen prim kuralı => BonusPolicy: BonusPolicy composition
Fazladan seçenekler:
- decoy: Employee.calculateTax() override'ı
İpucu: Çalışan türüne özgü ücret formülünü polymorphism'e, bağımsız politikaları composition'a verin.
Kısa açıklama: Brüt ücret alt tür davranışıdır; vergi ve prim ayrı policy nesneleri olarak bileşimle kullanılır.
Açıklama: Employee.grossPay farklı çalışan türlerince uygulanır. Vergi ve prim eksenleri çalışan hiyerarşisinden bağımsız değiştiği için TaxPolicy ve BonusPolicy collaborator'ları kombinasyon patlamasını önler.
Varsayım: Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.
Varsayım: Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır.
Etiketler: payroll, polymorphism, composition, policy
