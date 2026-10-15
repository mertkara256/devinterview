(function () {
  "use strict";

  function makeCard(sourceId, number, data) {
    var suffix = number < 10 ? "0" + number : String(number);
    var card = Object.assign({
      id: sourceId + "-" + suffix,
      sourceId: sourceId,
      section: "OOP",
      topic: "",
      difficulty: "easy",
      type: "single",
      prompt: "",
      code: "",
      options: [],
      items: [],
      pairs: null,
      answer: null,
      acceptedAnswers: [],
      caseSensitive: false,
      hint: "",
      explanationShort: "",
      explanationLong: "",
      optionExplanations: {},
      assumptions: [
        "Java 8 veya sonrası kullanılır; gerekli importlar ve çevreleyen metot mevcuttur.",
        "Aksi belirtilmedikçe null ve geçersiz girdiler kapsam dışıdır."
      ],
      tags: [],
      version: "1.0.0"
    }, data);
    card.difficulty = {
      easy: "Kolay",
      medium: "Orta",
      hard: "Zorlayıcı"
    }[card.difficulty] || card.difficulty;
    return card;
  }

  window.OOP_QUESTIONS = [
    makeCard("O01", 1, {
      topic: "Class ve Object",
      difficulty: "easy",
      type: "single",
      prompt: "Car örneğinde class ile object ayrımını doğru açıklayan seçenek hangisidir?",
      options: [
        { id: "a", text: "Car bir şablondur; new Car() ile çalışma zamanında oluşturulan değer bir object'tir." },
        { id: "b", text: "Car çalışma zamanındaki nesnedir; new Car() yalnızca bir metot çağrısıdır." },
        { id: "c", text: "Class ve object aynı kavramdır; yalnızca yazım biçimleri farklıdır." },
        { id: "d", text: "Bir referans değişkeni tanımlandığı anda mutlaka yeni bir object oluşur." }
      ],
      answer: "a",
      hint: "Tanım ile bu tanımdan üretilen çalışma zamanı örneğini ayırın.",
      explanationShort: "Class, nesnelerin yapısını ve davranışını tanımlar; object bu tanımın çalışma zamanındaki örneğidir.",
      explanationLong: "Car alanları, metotları ve kuralları tanımlayan sınıftır. new Car() heap üzerinde bir Car nesnesi oluşturur ve ifade bu nesneye bir referans üretir. Yalnızca Car car; yazmak ise nesne oluşturmaz.",
      optionExplanations: {
        a: "Doğru: şablon ve örnek ayrımı doğru kurulmuştur.",
        b: "new Car() sıradan bir metot çağrısı değil, nesne oluşturma ifadesidir.",
        c: "Class bir tür tanımı, object ise o türün örneğidir.",
        d: "Referans tanımlamak tek başına nesne oluşturmaz."
      },
      tags: ["class", "object", "instance"]
    }),

    makeCard("O02", 1, {
      topic: "State ve Behavior",
      difficulty: "easy",
      type: "multi",
      prompt: "Bir BankAccount nesnesinin state bilgisini temsil eden öğeleri seçin.",
      options: [
        { id: "ownerId", text: "ownerId alanı" },
        { id: "balance", text: "balance alanı" },
        { id: "deposit", text: "deposit(amount) metodu" },
        { id: "withdraw", text: "withdraw(amount) metodu" }
      ],
      answer: ["ownerId", "balance"],
      hint: "State nesnenin belirli bir andaki verisidir; behavior ise yapabildiği işlemdir.",
      explanationShort: "ownerId ve balance state; deposit ve withdraw behavior örnekleridir.",
      explanationLong: "Alanlar hesabın belirli bir andaki durumunu taşır. Metotlar bu durum üzerinde kontrollü işlem yapan davranışları tanımlar. Çoklu seçim tam eşleşmeyle puanlanır.",
      optionExplanations: {
        ownerId: "Doğru: hesap sahibini tanımlayan veri state'tir.",
        balance: "Doğru: mevcut bakiye nesnenin state bilgisidir.",
        deposit: "deposit bir davranıştır.",
        withdraw: "withdraw bir davranıştır."
      },
      tags: ["state", "behavior", "bank-account"]
    }),

    makeCard("O02", 2, {
      topic: "State ve Behavior",
      difficulty: "easy",
      type: "output",
      prompt: "deposit davranışı state'i değiştirdikten sonra ekrana ne yazılır?",
      code: "class BankAccount {\n    private int balance = 100;\n\n    void deposit(int amount) {\n        balance += amount;\n    }\n\n    int getBalance() {\n        return balance;\n    }\n}\n\nBankAccount account = new BankAccount();\naccount.deposit(25);\nSystem.out.println(account.getBalance());",
      answer: "125",
      acceptedAnswers: ["125"],
      caseSensitive: true,
      hint: "Başlangıç bakiyesine yatırılan tutarı ekleyin.",
      explanationShort: "deposit(25), balance değerini 100'den 125'e çıkarır.",
      explanationLong: "balance nesnenin state'idir. deposit metodu bu state'i değiştiren behavior'dır; getBalance son durumu döndürür.",
      assumptions: [
        "Kod tek iş parçacığında ve gösterilen sırayla çalışır.",
        "Çıktının satır başı ve sonundaki boşluklar önemsenmez."
      ],
      tags: ["state", "behavior", "output"]
    }),

    makeCard("O03", 1, {
      topic: "Nesne Referansları",
      difficulty: "easy",
      type: "output",
      prompt: "İki referans aynı Counter nesnesini gösterirken kodun çıktısını satır sırasıyla yazın.",
      code: "class Counter {\n    int value;\n}\n\nCounter a = new Counter();\na.value = 5;\nCounter b = a;\nb.value++;\n\nSystem.out.println(a.value);\nSystem.out.println(a == b);",
      answer: "6\ntrue",
      acceptedAnswers: ["6\ntrue"],
      caseSensitive: false,
      hint: "b'ye yeni nesne değil, a'daki referans atanıyor.",
      explanationShort: "Her iki değişken aynı nesneyi gösterir; artış a üzerinden de görülür ve referans karşılaştırması true olur.",
      explanationLong: "b = a ataması Counter nesnesini kopyalamaz. Aynı nesneye ikinci bir referans oluşturur. b.value++ ortak nesnenin value alanını 6 yapar; a == b aynı referansı karşılaştırdığı için true'dur.",
      assumptions: ["Çıktı satır sırası korunarak değerlendirilir; satır kenarı boşlukları önemsenmez."],
      tags: ["reference", "aliasing", "identity", "output"]
    }),

    makeCard("O03", 2, {
      version: "1.1.0",
      topic: "Nesne Referansları",
      difficulty: "easy",
      type: "boolean",
      prompt: "Counter b = a; ifadesi b için a'nın bağımsız bir kopyasını oluşturur; bu yüzden b.value değişikliği a.value üzerinden gözlenmez.",
      answer: false,
      hint: "Atama bir nesne kopyası mı, referans kopyası mı üretir?",
      explanationShort: "Yanlış. Atama referansı kopyalar; a ve b aynı nesneyi gösterir ve değişiklik ikisinden de görülür.",
      explanationLong: "Java'da reference type değişken ataması nesnenin alanlarını kopyalamaz; referans değerini kopyalar. Bu nedenle iki değişken üzerinden de aynı mutable nesnenin state'i görülür.",
      optionExplanations: {
        true: "Yanlış: b için ayrı bir Counter nesnesi oluşturulmaz.",
        false: "Doğru: iki referans aynı nesneyi gösterir."
      },
      tags: ["reference", "aliasing", "mutation"]
    }),

    makeCard("O04", 1, {
      topic: "Constructor",
      difficulty: "easy",
      type: "multi",
      prompt: "Java constructor'ları için doğru ifadeleri seçin.",
      options: [
        { id: "sameName", text: "Adı sınıf adıyla aynıdır." },
        { id: "noReturn", text: "Dönüş tipi bildirilmez; void bile yazılmaz." },
        { id: "newCall", text: "Nesne oluşturulurken çalışır." },
        { id: "inherited", text: "Alt sınıflar constructor'ı normal bir metot gibi miras alır." }
      ],
      answer: ["sameName", "noReturn", "newCall"],
      hint: "Constructor sözdizimini ve miras davranışını normal metotlarla karşılaştırın.",
      explanationShort: "Constructor sınıf adını taşır, dönüş tipi yoktur ve nesne kurulurken çalışır; miras alınmaz.",
      explanationLong: "Constructor nesnenin ilk geçerli durumunu kurar. Alt sınıf constructor'ı super(...) ile üst constructor'ı çağırabilir ancak constructor üyeleri miras alınan metotlar değildir.",
      optionExplanations: {
        sameName: "Doğru: constructor sınıfla aynı adı taşır.",
        noReturn: "Doğru: dönüş tipi bildirilmez.",
        newCall: "Doğru: nesne oluşturma zincirinin parçası olarak çalışır.",
        inherited: "Yanlış: constructor'lar miras alınmaz."
      },
      tags: ["constructor", "initialization"]
    }),

    makeCard("O04", 2, {
      version: "1.1.0",
      topic: "Constructor",
      difficulty: "easy",
      type: "boolean",
      prompt: "Bir sınıfta hiçbir constructor bildirilmezse derleyici constructor eklemez; bu yüzden o sınıftan new ile nesne oluşturulamaz.",
      answer: false,
      hint: "Sınıfta hiç constructor yazılmadığında derleyici ne yapar?",
      explanationShort: "Yanlış. Hiç constructor yoksa derleyici parametresiz bir default constructor ekler.",
      explanationLong: "Sınıfta hiç constructor bildirilmemişse derleyici parametresiz bir default constructor ekler; bu yüzden new ile nesne oluşturulabilir. Herhangi bir constructor açıkça bildirilirse derleyici artık parametresiz constructor üretmez. Default constructor'ın erişim düzeyi sınıfın erişim düzeyiyle aynıdır.",
      optionExplanations: {
        true: "Yanlış: Java bu koşulda default constructor sağlar.",
        false: "Doğru: default constructor eklendiği için new ile nesne oluşturulabilir."
      },
      tags: ["constructor", "default-constructor"]
    }),

    makeCard("O05", 1, {
      version: "1.1.0",
      topic: "Constructor",
      difficulty: "easy",
      type: "single",
      prompt: "Gösterilen sınıfta new User() ifadesinin derlenmemesinin nedeni nedir?",
      code: "class User {\n    User(String name) {\n        System.out.println(name);\n    }\n}\n\nUser user = new User();",
      options: [
        { id: "a", text: "Derleyici bu durumda User() eklemez." },
        { id: "b", text: "Constructor içinde System.out.println kullanılamaz." },
        { id: "c", text: "User sınıfı public olarak bildirilmediği için new User() ifadesi aynı paketten bile çağrılamaz." },
        { id: "d", text: "Java'da constructor overloading yasaktır." }
      ],
      answer: "a",
      hint: "Derleyicinin default constructor'ı hangi koşulda sağladığını düşünün.",
      explanationShort: "Açık bir constructor bulunduğundan new User() ile eşleşecek parametresiz constructor yoktur.",
      explanationLong: "User(String) bildirildiğinde otomatik User() üretilmez. Hem parametresiz hem isimli oluşturma isteniyorsa User() ayrıca yazılmalı ve gerekirse this(...) ile isimli constructor'a yönlendirilmelidir.",
      optionExplanations: {
        a: "Doğru: new User() için uygun imza yoktur.",
        b: "println constructor içinde kullanılabilir.",
        c: "Paket erişimli sınıf aynı paketten oluşturulabilir; sorun eksik parametresiz constructor'dır.",
        d: "Constructor overloading geçerlidir."
      },
      tags: ["constructor", "compile-error", "default-constructor"]
    }),

    makeCard("O05", 2, {
      topic: "Constructor",
      difficulty: "easy",
      type: "fill",
      prompt: "Hem new User() hem new User(\"Ada\") çağrılarının geçerli olması için eksik parametresiz constructor imzasını yazın. Yalnızca imzayı yazın.",
      code: "class User {\n    __________ {\n        this(\"Misafir\");\n    }\n\n    User(String name) {\n        System.out.println(name);\n    }\n}",
      answer: "User()",
      acceptedAnswers: ["User()", "User ()"],
      caseSensitive: true,
      hint: "Constructor'da dönüş tipi bulunmaz.",
      explanationShort: "Eksik imza User() biçimindedir.",
      explanationLong: "User() parametresiz overload'dur ve ilk ifade olarak this(\"Misafir\") ile User(String) constructor'ına yönlenir. Constructor adında büyük-küçük harf sınıf adıyla aynı olmalıdır.",
      tags: ["constructor", "overloading", "this"]
    }),

    makeCard("O06", 1, {
      topic: "Encapsulation",
      difficulty: "easy",
      type: "single",
      prompt: "Bir BankAccount sınıfında gerçek encapsulation'ı en iyi sağlayan tasarım hangisidir?",
      options: [
        { id: "a", text: "balance private tutulur; deposit ve withdraw geçersiz tutarları reddedip invariant'ları korur." },
        { id: "b", text: "balance private tutulur; setBalance her double değeri doğrudan kabul eder." },
        { id: "c", text: "balance public tutulur; çağıranların kurallara uyması beklenir." },
        { id: "d", text: "Tüm alanlar için kuralsız getter ve setter üretmek tek başına yeterlidir." }
      ],
      answer: "a",
      hint: "Amaç yalnızca veriyi gizlemek değil, nesnenin geçerli kalmasını sağlamaktır.",
      explanationShort: "Encapsulation, state'e erişimi davranışlar üzerinden kontrol ederek sınıf kurallarını korur.",
      explanationLong: "Private alan başlangıçtır; asıl değer kontrollü bir API'dedir. Kuralsız setBalance nesnenin negatif bakiye gibi geçersiz state'lere sokulmasına izin veriyorsa encapsulation hedefi karşılanmaz.",
      optionExplanations: {
        a: "Doğru: veri gizleme ile iş kuralları birlikte korunur.",
        b: "Kuralsız setter invariant'ı korumaz.",
        c: "Public mutable alan dış müdahaleyi engellemez.",
        d: "Otomatik erişimciler tek başına davranış ve kural tasarımı değildir."
      },
      tags: ["encapsulation", "invariant", "bank-account"]
    }),

    makeCard("O07", 1, {
      topic: "Encapsulation ve Invariant",
      difficulty: "easy",
      type: "multi",
      prompt: "Başlangıç bakiyesi 0 olan, kredili mevduat sunmayan bir BankAccount için invariant'ı koruyan kuralları seçin.",
      options: [
        { id: "depositPositive", text: "deposit tutarı sıfırdan büyük olmalıdır." },
        { id: "withdrawPositive", text: "withdraw tutarı sıfırdan büyük olmalıdır." },
        { id: "withinBalance", text: "withdraw tutarı mevcut bakiyeyi aşmamalıdır." },
        { id: "publicBalance", text: "balance çağıran kodun hızlı değiştirmesi için public olmalıdır." }
      ],
      answer: ["depositPositive", "withdrawPositive", "withinBalance"],
      hint: "Her başarılı işlemden sonra bakiyenin negatif olmaması ve anlamsız tutarların reddedilmesi gerekir.",
      explanationShort: "Pozitif tutar kontrolleri ve yeterli bakiye koşulu nesnenin kurallarını korur.",
      explanationLong: "Sınıf, geçersiz para yatırma/çekme girişlerini kendi sınırında reddetmelidir. balance alanını public yapmak tüm bu kuralları atlanabilir hâle getirir.",
      optionExplanations: {
        depositPositive: "Doğru: sıfır veya negatif yatırma reddedilir.",
        withdrawPositive: "Doğru: sıfır veya negatif çekme reddedilir.",
        withinBalance: "Doğru: kredili mevduat yoksa negatif bakiye engellenir.",
        publicBalance: "Yanlış: public alan invariant'ı dış müdahaleye açar."
      },
      assumptions: [
        "Hesap kredili mevduat veya eksi bakiye desteklemez.",
        "Tutarlar kuruş hassasiyeti tartışılmadan tam sayı olarak ele alınır."
      ],
      tags: ["encapsulation", "invariant", "validation"]
    }),

    makeCard("O07", 2, {
      topic: "Encapsulation ve Invariant",
      difficulty: "easy",
      type: "output",
      prompt: "Sınıfın çekme kuralına göre kodun çıktısı nedir?",
      code: "class BankAccount {\n    private int balance = 100;\n\n    boolean withdraw(int amount) {\n        if (amount <= 0 || amount > balance) {\n            return false;\n        }\n        balance -= amount;\n        return true;\n    }\n\n    int getBalance() { return balance; }\n}\n\nBankAccount account = new BankAccount();\nSystem.out.println(account.withdraw(120));\nSystem.out.println(account.getBalance());",
      answer: "false\n100",
      acceptedAnswers: ["false\n100"],
      caseSensitive: false,
      hint: "Başarısız işlem state'i değiştirmez.",
      explanationShort: "120 mevcut bakiyeyi aştığı için işlem false döner ve bakiye 100 kalır.",
      explanationLong: "withdraw önce tüm önkoşulları sınar. Koşul sağlanmadığında balance güncellenmeden dönülür; böylece negatif bakiye invariant'ı korunur.",
      assumptions: ["Kod tek iş parçacığında çalışır; çıktı satır sırası korunur."],
      tags: ["encapsulation", "invariant", "output"]
    }),

    makeCard("O08", 1, {
      topic: "Inheritance",
      difficulty: "easy",
      type: "single",
      prompt: "Aşağıdaki ilişkilerden hangisi kalıtım için geçerli bir is-a örneğidir?",
      options: [
        { id: "a", text: "Dog extends Animal" },
        { id: "b", text: "Car extends Engine" },
        { id: "c", text: "Order extends Customer" },
        { id: "d", text: "Library extends Book" }
      ],
      answer: "a",
      hint: "Cümleyi 'X bir Y'dir' şeklinde okuyun.",
      explanationShort: "Dog bir Animal'dır; diğerleri has-a veya ilişki örnekleridir.",
      explanationLong: "Kalıtım yalnızca alt tür üst türün sözleşmesine uyduğunda anlamlıdır. Arabanın motoru vardır, siparişin müşterisi vardır ve kütüphane kitapları içerir; bunlar composition/association ile modellenir.",
      optionExplanations: {
        a: "Doğru: Dog, Animal'ın uzmanlaşmış bir türüdür.",
        b: "Car bir Engine değildir; engine içerir.",
        c: "Order bir Customer değildir.",
        d: "Library bir Book değildir; kitapları yönetir."
      },
      tags: ["inheritance", "is-a", "has-a"]
    }),

    makeCard("O08", 2, {
      topic: "Inheritance",
      difficulty: "easy",
      type: "boolean",
      prompt: "Car ile Engine ilişkisini Car extends Engine şeklinde modellemek yerine Car'ın bir Engine alanı tutması genellikle semantik olarak daha uygundur.",
      answer: true,
      hint: "Araba bir motor mudur, yoksa motora mı sahiptir?",
      explanationShort: "Doğru. Car has-an Engine ilişkisi composition ile ifade edilir.",
      explanationLong: "Kalıtım substitutability gerektirir; bir Car, Engine beklenen her yerde anlamlı değildir. Composition bağımsız bileşen değişimini ve daha doğru alan modelini destekler.",
      optionExplanations: {
        true: "Doğru: ilişki has-a niteliğindedir.",
        false: "Yanlış: is-a ilişkisi kurulamadığı için kalıtım uygun değildir."
      },
      tags: ["inheritance", "composition", "is-a", "has-a"]
    }),

    makeCard("O09", 1, {
      topic: "Method Overloading",
      difficulty: "easy",
      type: "multi",
      prompt: "Sınıfta void send(String message) varken aynı sınıfta geçerli bir overload oluşturacak imzaları seçin.",
      options: [
        { id: "object", text: "void send(Object message)" },
        { id: "stringInt", text: "void send(String message, int retryCount)" },
        { id: "int", text: "void send(int code)" },
        { id: "returnOnly", text: "boolean send(String message)" }
      ],
      answer: ["object", "stringInt", "int"],
      hint: "Overload ayrımında metot adı ve parametre listesi kullanılır; dönüş tipi tek başına yetmez.",
      explanationShort: "Parametre tipi veya sayısı değişen ilk üç imza overload'dur; yalnız dönüş tipi değişen son imza çakışır.",
      explanationLong: "Java metot imzası overload çözümlemesi açısından ad ve parametre tiplerinden oluşur. Dönüş tipi çağrı yerinde overload seçmek için kullanılmaz.",
      optionExplanations: {
        object: "Doğru: parametre tipi farklıdır.",
        stringInt: "Doğru: parametre sayısı farklıdır.",
        int: "Doğru: parametre tipi farklıdır.",
        returnOnly: "Yanlış: aynı ad ve aynı parametre listesi tekrar bildirilmiştir."
      },
      tags: ["overloading", "method-signature", "compile-time"]
    }),

    makeCard("O09", 2, {
      topic: "Method Overloading",
      difficulty: "easy",
      type: "output",
      prompt: "Overload çözümlemesine göre ekrana ne yazılır?",
      code: "class Notifier {\n    void notify(Object value) { System.out.println(\"Object\"); }\n    void notify(String value) { System.out.println(\"String\"); }\n}\n\nnew Notifier().notify(null);",
      answer: "String",
      acceptedAnswers: ["String"],
      caseSensitive: true,
      hint: "null iki reference type'a da uyar; derleyici daha özel olan uygulanabilir imzayı seçer.",
      explanationShort: "String, Object'ten daha özel olduğu için notify(String) seçilir.",
      explanationLong: "Overload seçimi derleme zamanında yapılır. null hem Object hem String parametresine aktarılabilir; iki aday arasında String daha spesifik olduğundan çağrı belirsiz değildir.",
      assumptions: ["Sınıfta yalnızca gösterilen iki overload vardır.", "Çıktı kenarı boşlukları önemsenmez."],
      tags: ["overloading", "null", "most-specific", "output"]
    }),

    makeCard("O10", 1, {
      topic: "Method Overriding",
      difficulty: "easy",
      type: "output",
      prompt: "Override ve dinamik dispatch sonucunda çıktı nedir?",
      code: "class Notification {\n    void send() { System.out.println(\"generic\"); }\n}\nclass EmailNotification extends Notification {\n    @Override\n    void send() { System.out.println(\"email\"); }\n}\n\nNotification notification = new EmailNotification();\nnotification.send();",
      answer: "email",
      acceptedAnswers: ["email"],
      caseSensitive: true,
      hint: "Instance metot gövdesini nesnenin çalışma zamanı tipi belirler.",
      explanationShort: "Nesne EmailNotification olduğu için override edilmiş send çalışır.",
      explanationLong: "Referansın bildirilen tipi erişilebilir metot kümesini sınırlar; seçilen instance metot uygulaması çalışma zamanındaki EmailNotification türünden gelir.",
      assumptions: ["Metotlar instance metodudur; static değildir.", "Çıktı kenarı boşlukları önemsenmez."],
      tags: ["overriding", "dynamic-dispatch", "polymorphism", "output"]
    }),

    makeCard("O10", 2, {
      topic: "Method Overriding",
      difficulty: "easy",
      type: "multi",
      prompt: "Bir alt sınıf instance metodunun üst sınıftaki metodu geçerli biçimde override etmesi için doğru kuralları seçin.",
      options: [
        { id: "signature", text: "Ad ve parametre listesi aynı olmalıdır." },
        { id: "covariant", text: "Reference dönüş tipi aynı veya covariant olabilir." },
        { id: "visibility", text: "Erişim seviyesi daraltılmamalıdır." },
        { id: "returnOnly", text: "Yalnızca dönüş tipini değiştirerek farklı parametreli gibi davranabilir." }
      ],
      answer: ["signature", "covariant", "visibility"],
      hint: "@Override ile derleyicinin denetlediği sözleşmeyi düşünün.",
      explanationShort: "Aynı imza, uyumlu dönüş tipi ve daraltılmayan erişim gerekir.",
      explanationLong: "Override alt tür sözleşmesini korur. Checked exception kuralları gibi ek koşullar da vardır; seçeneklerdeki üç ifade temel doğru kurallardır. Dönüş tipi tek başına metot imzasını farklılaştırmaz.",
      optionExplanations: {
        signature: "Doğru: override edilen metotla aynı parametre listesi gerekir.",
        covariant: "Doğru: reference dönüş tipi alt tür olabilir.",
        visibility: "Doğru: istemcilerin erişimi daraltılamaz.",
        returnOnly: "Yanlış: dönüş tipi tek başına yeni imza oluşturmaz."
      },
      tags: ["overriding", "covariant-return", "access"]
    }),

    makeCard("O11", 1, {
      topic: "Polymorphism",
      difficulty: "easy",
      type: "output",
      prompt: "Ortak PaymentMethod tipi üzerinden yapılan çağrıların çıktısını yazın.",
      code: "interface PaymentMethod {\n    String pay();\n}\nclass CardPayment implements PaymentMethod {\n    public String pay() { return \"card\"; }\n}\nclass TransferPayment implements PaymentMethod {\n    public String pay() { return \"transfer\"; }\n}\n\nPaymentMethod[] methods = {new CardPayment(), new TransferPayment()};\nfor (PaymentMethod method : methods) {\n    System.out.println(method.pay());\n}",
      answer: "card\ntransfer",
      acceptedAnswers: ["card\ntransfer"],
      caseSensitive: true,
      hint: "Her dizi elemanında çalışma zamanı türünün pay uygulaması çağrılır.",
      explanationShort: "İlk nesne CardPayment, ikinci nesne TransferPayment uygulamasını çalıştırır.",
      explanationLong: "İstemci somut sınıfları ayıran koşul kullanmadan PaymentMethod sözleşmesine çağrı yapar. Dynamic dispatch her nesne için doğru pay uygulamasını seçer.",
      assumptions: ["Dizi sırası gösterildiği gibidir.", "Çıktı satır sırası korunur."],
      tags: ["polymorphism", "interface", "dynamic-dispatch", "output"]
    }),

    makeCard("O11", 2, {
      topic: "Polymorphism",
      difficulty: "easy",
      type: "single",
      prompt: "CheckoutService'in CardPayment, TransferPayment ve WalletPayment nesnelerini PaymentMethod olarak kabul etmesinin temel yararı nedir?",
      options: [
        { id: "a", text: "İstemci ortak sözleşmeye bağlı kalır ve somut davranış çalışma zamanında seçilir." },
        { id: "b", text: "Tüm ödeme sınıflarının aynı alanlara sahip olması zorunlu olur." },
        { id: "c", text: "new kullanımı Java tarafından tamamen yasaklanır." },
        { id: "d", text: "Her ödeme türü için instanceof koşulu yazmak zorunlu hâle gelir." }
      ],
      answer: "a",
      hint: "İstemcinin somut türleri bilmeden çalışabilmesini düşünün.",
      explanationShort: "Polymorphism ortak sözleşme üzerinden farklı uygulamaları değiştirilebilir kılar.",
      explanationLong: "CheckoutService PaymentMethod'e bağlı olduğunda yeni ödeme türleri aynı sözleşmeyi uygulayarak sisteme katılabilir. Nesnelerin aynı alanları taşıması gerekmez ve instanceof dalları hedef değildir.",
      optionExplanations: {
        a: "Doğru: ortak tip ve dinamik davranış seçimi polymorphism'in özüdür.",
        b: "Interface ortak alan düzenini zorunlu kılmaz.",
        c: "Polymorphism nesne oluşturmayı yasaklamaz.",
        d: "Amaç tür koşullarını azaltmaktır."
      },
      tags: ["polymorphism", "payment", "extensibility"]
    }),

    makeCard("O12", 1, {
      version: "1.1.0",
      topic: "Abstraction ve Encapsulation",
      difficulty: "easy",
      type: "single",
      prompt: "Bir ödeme sistemi için abstraction ile encapsulation ayrımını doğru kuran seçenek hangisidir?",
      options: [
        { id: "a", text: "pay ortak sözleşmeyi soyutlar; kart verisi CardPayment içinde korunur." },
        { id: "b", text: "Abstraction tüm alanları public yapar; encapsulation her sınıfı abstract yapar." },
        { id: "c", text: "İki kavram tamamen aynıdır ve her zaman aynı Java anahtar sözcüğüyle uygulanır." },
        { id: "d", text: "Encapsulation yalnızca interface'lerde, abstraction ise yalnızca private alanlarda kullanılabildiği için ikisi aynı sınıfta birlikte bulunamaz." }
      ],
      answer: "a",
      hint: "Bir kavram gereksiz ayrıntıyı gizleyen sözleşmeye, diğeri state ve kuralların sınırına odaklanır.",
      explanationShort: "Abstraction gerekli sözleşmeyi sunar; encapsulation iç state'i ve invariant'ları korur.",
      explanationLong: "PaymentMethod istemciye ödeme davranışını uygulama ayrıntısından bağımsız gösterir. CardPayment ise hassas state'i ve geçerlilik kurallarını kontrollü metotlarla kapsüller. Kavramlar ilişkili fakat aynı değildir.",
      optionExplanations: {
        a: "Doğru: sözleşme ve iç durum koruması ayrılmıştır.",
        b: "Kavramların anlamları ters ve hatalı verilmiştir.",
        c: "Abstraction ile encapsulation farklı tasarım amaçlarıdır.",
        d: "Her iki kavram da farklı Java yapılarıyla ve aynı sınıfta birlikte uygulanabilir."
      },
      tags: ["abstraction", "encapsulation", "payment"]
    }),

    makeCard("O13", 1, {
      topic: "Interface ve Abstract Class",
      difficulty: "easy",
      type: "single",
      prompt: "Birbirine yakın alt sınıfların ortak protected state'i, constructor mantığı ve uygulanmış metotları paylaşması gerekiyorsa en uygun başlangıç tercihi hangisidir?",
      options: [
        { id: "a", text: "Abstract class" },
        { id: "b", text: "Yalnızca marker interface" },
        { id: "c", text: "Her alt sınıfta kodu kopyalamak" },
        { id: "d", text: "Global mutable değişkenler" }
      ],
      answer: "a",
      hint: "Ortak instance state ve constructor hangi yapıda doğal olarak bulunur?",
      explanationShort: "Abstract class ortak state, constructor ve kısmi uygulama paylaşımına uygundur.",
      explanationLong: "Interface bağımsız yetenek sözleşmeleri için güçlüdür; abstract class ise yakın bir hiyerarşide ortak state ve temel uygulamayı merkezileştirebilir. Seçim bağlama bağlıdır.",
      optionExplanations: {
        a: "Doğru: belirtilen üç ihtiyacı doğrudan karşılar.",
        b: "Marker interface state veya uygulama sağlamaz.",
        c: "Kod tekrarı bakım riskini artırır.",
        d: "Global mutable state kapsüllemeyi ve testi zorlaştırır."
      },
      tags: ["abstract-class", "interface", "shared-state"]
    }),

    makeCard("O13", 2, {
      topic: "Interface ve Abstract Class",
      difficulty: "easy",
      type: "multi",
      prompt: "Bir sınıfın kalıtım hiyerarşisinden bağımsız olarak birden fazla yeteneği paylaşması gereken durumlarda interface kullanımının sağladığı özellikleri seçin.",
      options: [
        { id: "multiple", text: "Bir sınıf birden fazla interface uygulayabilir." },
        { id: "contract", text: "İstemciler somut sınıf yerine davranış sözleşmesine bağlanabilir." },
        { id: "unrelated", text: "İlişkisiz sınıflar aynı yetenek sözleşmesini uygulayabilir." },
        { id: "ctor", text: "Interface instance constructor'ı ile ortak nesne state'i kurar." }
      ],
      answer: ["multiple", "contract", "unrelated"],
      hint: "Interface'i ortak state taşıyan bir üst sınıftan çok, takılabilir bir yetenek olarak düşünün.",
      explanationShort: "Interface birden fazla ve bağımsız davranış sözleşmesini farklı sınıflara taşıyabilir.",
      explanationLong: "Java sınıflarda tek kalıtım kullanır fakat bir sınıf birden fazla interface uygulayabilir. Interface'in instance constructor'ı yoktur ve ortak mutable instance state kurmaz.",
      optionExplanations: {
        multiple: "Doğru: çoklu interface uygulaması desteklenir.",
        contract: "Doğru: bağımlılık soyut sözleşmeye yöneltilebilir.",
        unrelated: "Doğru: ortak ata sınıf gerektirmez.",
        ctor: "Yanlış: interface instance constructor'ı yoktur."
      },
      tags: ["interface", "capability", "multiple-inheritance"]
    }),

    makeCard("O14", 1, {
      version: "1.1.0",
      topic: "Nesne Modelleme",
      difficulty: "medium",
      type: "match",
      prompt: "Üniversite kayıt modelindeki gereksinimleri en uygun sınıf veya ilişkiyle eşleştirin.",
      pairs: {
        left: [
          { id: "studentIdentity", text: "Öğrenci numarası ve öğrenciye ait bilgiler" },
          { id: "courseIdentity", text: "Ders kodu, ad ve kredi" },
          { id: "enrollmentData", text: "Kayıt tarihi ve o derse ait not" },
          { id: "manyToMany", text: "Öğrenci ile ders arasındaki çoktan çoğa bağ" }
        ],
        right: [
          { id: "Student", text: "Student" },
          { id: "Course", text: "Course" },
          { id: "Enrollment", text: "Enrollment association entity" },
          { id: "EnrollmentLinks", text: "Student ve Course'u referanslayan Enrollment kayıtları" },
          { id: "decoy", text: "Course sınıfından kalıtan Student" }
        ]
      },
      answer: {
        studentIdentity: "Student",
        courseIdentity: "Course",
        enrollmentData: "Enrollment",
        manyToMany: "EnrollmentLinks"
      },
      hint: "İlişkinin kendisine ait veri varsa ayrı bir association entity düşünün.",
      explanationShort: "Student ve Course kimlikleri ayrı; ilişkiye ait tarih/not ise Enrollment içinde modellenir.",
      explanationLong: "Enrollment hem Student hem Course referansı taşır ve ilişkiye özgü state'i kapsüller. Böylece doğrudan iki listeyi senkron tutma yükü yerine kayıt kavramı açık bir domain nesnesi olur.",
      tags: ["modeling", "many-to-many", "association-entity"]
    }),

    makeCard("O14", 2, {
      version: "1.1.0",
      topic: "Nesne Modelleme",
      difficulty: "medium",
      type: "single",
      prompt: "Student–Course çoktan çoğa ilişkisinde kayıt tarihi ve not da saklanacaksa en uygun model hangisidir?",
      options: [
        { id: "a", text: "Tarih ve notu taşıyan Enrollment ilişki sınıfı" },
        { id: "b", text: "Tüm öğrencileri Course adının içine metin olarak yazmak" },
        { id: "c", text: "Student sınıfını Course'tan kalıtıp kayıt tarihini ve notu Student alanı olarak saklamak" },
        { id: "d", text: "Tek bir global String listesinde tüm verileri tutmak" }
      ],
      answer: "a",
      hint: "İlişkinin kendisine ait alanlar hangi nesnede yaşayabilir?",
      explanationShort: "İlişkiye ait state bulunduğunda Enrollment ayrı bir ilişki nesnesi olmalıdır.",
      explanationLong: "Enrollment modelin anlamını görünür kılar, not ve tarih kurallarını tek yerde tutar ve sorgulamayı kolaylaştırır. Student bir Course değildir; kalıtım semantik olarak yanlıştır.",
      optionExplanations: {
        a: "Doğru: ilişki ve ilişkiye ait veri birlikte modellenir.",
        b: "Metin içine gömmek kimlik ve kural yönetimini kaybettirir.",
        c: "Student ile Course arasında is-a ilişkisi yoktur; ilişkiye ait veri öğrenciye gömülmemelidir.",
        d: "Global metin listesi tür güvenliği ve kapsülleme sağlamaz."
      },
      tags: ["modeling", "many-to-many", "enrollment"]
    }),

    makeCard("O15", 1, {
      topic: "Constructor Zinciri",
      difficulty: "medium",
      type: "output",
      prompt: "new C() çağrısında constructor zincirinin çıktısını satır sırasıyla yazın.",
      code: "class A {\n    A() { System.out.println(\"A\"); }\n}\nclass B extends A {\n    B() { System.out.println(\"B\"); }\n}\nclass C extends B {\n    C() { System.out.println(\"C\"); }\n}\n\nnew C();",
      answer: "A\nB\nC",
      acceptedAnswers: ["A\nB\nC"],
      caseSensitive: true,
      hint: "Her constructor'ın başına derleyicinin eklediği örtük super() çağrısını izleyin.",
      explanationShort: "Önce en üst sınıf A, sonra B, son olarak C constructor'ı tamamlanır.",
      explanationLong: "C() örtük super() ile B()'yi; B() da örtük super() ile A()'yı çağırır. Üst nesne kısmı kurulmadan alt sınıf constructor gövdesi çalışmaz.",
      assumptions: ["Sınıflarda gösterilenlerden başka constructor veya initializer yoktur.", "Çıktı satır sırası korunur."],
      tags: ["constructor", "inheritance", "initialization-order", "output"]
    }),

    makeCard("O16", 1, {
      version: "1.1.0",
      topic: "Constructor Zinciri",
      difficulty: "medium",
      type: "single",
      prompt: "Employee constructor'ının derlenmemesinin doğrudan nedeni nedir?",
      code: "class Person {\n    Person(String name) { }\n}\nclass Employee extends Person {\n    Employee(int id) { }\n}",
      options: [
        { id: "a", text: "Örtük super() için Person() yok." },
        { id: "b", text: "Alt sınıf constructor'ı, üst sınıf constructor'ıyla aynı parametre tipini almak zorundadır." },
        { id: "c", text: "Person constructor'ı String alamaz." },
        { id: "d", text: "Constructor'lar yalnızca public olabilir." }
      ],
      answer: "a",
      hint: "Açık this(...) veya super(...) yoksa ilk satıra ne eklenir?",
      explanationShort: "Örtük super(), bulunmayan Person() constructor'ını çağırmaya çalışır.",
      explanationLong: "Person yalnız Person(String) bildirmiştir. Employee(int) ilk ifade olarak super(\"bir ad\") çağırmalı ya da Person'a uygun parametresiz constructor eklenmelidir.",
      optionExplanations: {
        a: "Doğru: derleme hatasının nedeni eşleşen üst constructor olmamasıdır.",
        b: "Alt sınıf constructor'ı farklı parametreler alabilir; sorun uygun bir super(...) çağrısının olmamasıdır.",
        c: "Gösterilen Person(String) geçerlidir.",
        d: "Constructor erişimi public olmak zorunda değildir."
      },
      tags: ["constructor", "super", "compile-error"]
    }),

    makeCard("O16", 2, {
      topic: "Constructor Zinciri",
      difficulty: "medium",
      type: "fill",
      prompt: "Person adının \"Ada\" olması için Employee(int) constructor'ının ilk ifadesine yazılması gereken çağrıyı girin.",
      code: "class Person {\n    Person(String name) { }\n}\nclass Employee extends Person {\n    Employee(int id) {\n        __________;\n    }\n}",
      answer: "super(\"Ada\")",
      acceptedAnswers: ["super(\"Ada\")", "super (\"Ada\")", "super(\"Ada\");", "super (\"Ada\");"],
      caseSensitive: true,
      hint: "Üst sınıf constructor'ı super anahtar sözcüğüyle çağrılır.",
      explanationShort: "İlk ifade super(\"Ada\") olmalıdır.",
      explanationLong: "Üst sınıfta yalnız Person(String) bulunduğu için String argümanlı super çağrısı gerekir. Java kaynak kodunda String literal çift tırnakla yazılır.",
      assumptions: ["Boşluğa noktalı virgül yazılması isteğe bağlıdır; arayüz son noktalı virgülü normalize eder."],
      tags: ["constructor", "super", "fill"]
    }),

    makeCard("O17", 1, {
      version: "1.1.0",
      topic: "Constructor Zinciri",
      difficulty: "medium",
      type: "single",
      prompt: "Product constructor'larının derlenmeme nedeni nedir?",
      code: "class Product {\n    Product() {\n        this(\"Unknown\");\n    }\n    Product(String name) {\n        this();\n    }\n}",
      options: [
        { id: "a", text: "İki this() çağrısı döngü oluşturur." },
        { id: "b", text: "this(...) yalnız static metotlarda kullanılabilir." },
        { id: "c", text: "String constructor parametresi olamaz." },
        { id: "d", text: "this(...) çağrısı constructor'ın ilk satırında yer aldığı için ikinci constructor'daki this() çağrısı geçersiz sayılır." }
      ],
      answer: "a",
      hint: "Çağrı oklarını Product() → Product(String) → ... şeklinde izleyin.",
      explanationShort: "İki constructor arasında taban constructor'a ulaşmayan döngü vardır.",
      explanationLong: "Java constructor zincirinin sonsuz döngüye dönüşmesini derleme zamanında reddeder. Constructor'lardan biri this(...) çağırmadan alanları başlatan son nokta olmalıdır.",
      optionExplanations: {
        a: "Doğru: doğrudan bir çağrı döngüsü oluşur.",
        b: "this(...) yalnız constructor içinde kullanılabilir ve burada bağlam doğrudur.",
        c: "Constructor String parametresi alabilir.",
        d: "this(...) ilk ifade olarak yazılabilir; buradaki hata iki constructor'ın birbirini sonsuza kadar çağırmasıdır."
      },
      tags: ["constructor", "this", "recursive-invocation", "compile-error"]
    }),

    makeCard("O17", 2, {
      topic: "Constructor Zinciri",
      difficulty: "medium",
      type: "order",
      prompt: "Aşağıdaki geçerli tasarımda new Product() çağrısının izlediği constructor gövdelerini çalışma sırasına koyun.",
      code: "class Product {\n    Product() {\n        this(\"Unknown\");\n        System.out.println(\"no-arg body\");\n    }\n    Product(String name) {\n        this(name, 0);\n        System.out.println(\"name body\");\n    }\n    Product(String name, int stock) {\n        System.out.println(\"master body\");\n    }\n}",
      items: [
        { id: "master", text: "Product(String, int) gövdesi" },
        { id: "name", text: "Product(String) gövdesinin this(...) sonrasındaki kısmı" },
        { id: "noArg", text: "Product() gövdesinin this(...) sonrasındaki kısmı" }
      ],
      answer: ["master", "name", "noArg"],
      hint: "this(...) hedef constructor'ı tamamlanmadan çağıran gövde devam etmez.",
      explanationShort: "En derindeki master constructor tamamlanır; sonra String, ardından parametresiz gövde devam eder.",
      explanationLong: "new Product() önce Product(String)'e, o da Product(String,int)'e yönlenir. Dönüş sırasında gövdelerin kalan bölümleri içten dışa çalışır.",
      assumptions: ["Sıralama constructor gövdelerinin çıktı üreten bölümleri içindir; çağrı ifadeleri ayrı öğe değildir."],
      tags: ["constructor", "this", "order"]
    }),

    makeCard("O18", 1, {
      topic: "Polymorphism",
      difficulty: "medium",
      type: "output",
      prompt: "Yalnızca derlenebilen start çağrısı çalıştırıldığında çıktı nedir?",
      code: "class Vehicle {\n    void start() { System.out.println(\"Vehicle started\"); }\n}\nclass Car extends Vehicle {\n    @Override\n    void start() { System.out.println(\"Car started\"); }\n    void openTrunk() { System.out.println(\"Trunk opened\"); }\n}\n\nVehicle vehicle = new Car();\nvehicle.start();",
      answer: "Car started",
      acceptedAnswers: ["Car started"],
      caseSensitive: true,
      hint: "Erişim bildirilen tipten doğrulanır; override gövdesi çalışma zamanı tipinden seçilir.",
      explanationShort: "vehicle bir Car nesnesini gösterdiği için Car.start çalışır.",
      explanationLong: "Derleyici Vehicle üzerinde start bulunduğunu doğrular. Çalışma zamanında dinamik dispatch nesnenin gerçek türü Car olduğu için override edilmiş uygulamayı seçer.",
      assumptions: ["start instance metodudur ve kodda başka çıktı yoktur."],
      tags: ["declared-type", "runtime-type", "overriding", "output"]
    }),

    makeCard("O18", 2, {
      topic: "Polymorphism",
      difficulty: "medium",
      type: "boolean",
      prompt: "Vehicle vehicle = new Car(); bildiriminden sonra vehicle.openTrunk() çağrısı, nesne çalışma zamanında Car olduğu için doğrudan derlenir.",
      answer: false,
      hint: "Üye erişiminin varlığı önce hangi tip üzerinden denetlenir?",
      explanationShort: "Yanlış. openTrunk, Vehicle'ın bildirilen API'sinde olmadığı için çağrı derlenmez.",
      explanationLong: "Çalışma zamanı tipi override edilmiş mevcut metot gövdesini seçer; derleme zamanında erişilebilir metot kümesini genişletmez. Güvenli bir tür kontrolü ve cast olmadan Car'a özgü openTrunk çağrılamaz.",
      optionExplanations: {
        true: "Yanlış: çalışma zamanı türü derleyicinin Vehicle API kontrolünü kaldırmaz.",
        false: "Doğru: bildirilen Vehicle tipinde openTrunk yoktur."
      },
      tags: ["declared-type", "runtime-type", "compile-error"]
    }),

    makeCard("O19", 1, {
      topic: "Method Overriding",
      difficulty: "medium",
      type: "multi",
      prompt: "Parent.getValue metodunu geçerli biçimde override eden Child imzalarını seçin.",
      code: "class Parent {\n    public Number getValue() { return 1; }\n}",
      options: [
        { id: "same", text: "public Number getValue()" },
        { id: "covariant", text: "public Integer getValue()" },
        { id: "protected", text: "protected Integer getValue()" },
        { id: "object", text: "public Object getValue()" }
      ],
      answer: ["same", "covariant"],
      hint: "Dönüş tipi aynı ya da daha özel; erişim aynı ya da daha geniş olmalıdır.",
      explanationShort: "public Number ve public Integer geçerlidir; protected erişimi daraltır, Object dönüşü genişletir.",
      explanationLong: "Integer, Number'ın alt türü olduğundan covariant return olarak kullanılabilir. public metodu protected yapmak istemci sözleşmesini daraltır. Object ise Number'dan daha genel olduğu için uyumlu override dönüşü değildir.",
      optionExplanations: {
        same: "Doğru: aynı dönüş tipi ve erişim korunmuştur.",
        covariant: "Doğru: Integer covariant dönüş tipidir.",
        protected: "Yanlış: public erişim protected'a daraltılamaz.",
        object: "Yanlış: Object daha genel bir dönüş tipidir."
      },
      tags: ["overriding", "covariant-return", "visibility"]
    }),

    makeCard("O19", 2, {
      topic: "Method Overriding",
      difficulty: "medium",
      type: "boolean",
      prompt: "public Number getValue() metodunu protected Integer getValue() olarak override etmek, Integer covariant olsa bile erişim daraltıldığı için geçersizdir.",
      answer: true,
      hint: "Dönüş tipi ve erişim kuralını birbirinden bağımsız kontrol edin.",
      explanationShort: "Doğru. Covariant dönüş geçerli olsa da public erişim protected'a indirilemez.",
      explanationLong: "Override bütün kuralları aynı anda sağlamalıdır. Integer dönüşü tek başına uygundur; ancak üst tip istemcilerinin public erişebildiği bir operasyon alt tipte daha az erişilebilir yapılamaz.",
      optionExplanations: {
        true: "Doğru: erişim daraltma derleme hatasıdır.",
        false: "Yanlış: covariant dönüş erişim ihlalini telafi etmez."
      },
      tags: ["overriding", "covariant-return", "access"]
    }),

    makeCard("O20", 1, {
      topic: "Method Overloading",
      difficulty: "medium",
      type: "output",
      prompt: "Üç print çağrısının çıktısını satır sırasıyla yazın.",
      code: "class Printer {\n    void print(Object value) { System.out.println(\"Object\"); }\n    void print(String value) { System.out.println(\"String\"); }\n}\n\nPrinter printer = new Printer();\nString text = null;\nObject object = text;\nprinter.print(text);\nprinter.print(object);\nprinter.print(null);",
      answer: "String\nObject\nString",
      acceptedAnswers: ["String\nObject\nString"],
      caseSensitive: true,
      hint: "İlk iki çağrıda değişkenlerin bildirilen tipine; çıplak null için en özel uygulanabilir imzaya bakın.",
      explanationShort: "Sırasıyla String, Object ve daha özel overload olan String seçilir.",
      explanationLong: "Overload seçimi derleme zamanında yapılır. text String, object Object olarak bildirilmiştir. null iki overload'a da uygulanabilir fakat String, Object'ten daha spesifiktir.",
      assumptions: ["Sınıfta yalnızca gösterilen overload'lar vardır.", "Çıktı satır sırası korunur."],
      tags: ["overloading", "declared-type", "null", "output"]
    }),

    makeCard("O20", 2, {
      version: "1.1.0",
      topic: "Method Overloading",
      difficulty: "medium",
      type: "single",
      prompt: "Object object = (String) null; sonrasında printer.print(object) çağrısında print(Object) seçilmesinin nedeni nedir?",
      options: [
        { id: "a", text: "Derleyici bildirilen Object tipine bakar." },
        { id: "b", text: "null yalnız Object parametresine aktarılabilir." },
        { id: "c", text: "Overload seçimi çalışma zamanında yapılır; null değerinin gerçek tipi bilinmediği için JVM print(Object) metoduna düşer." },
        { id: "d", text: "Java her zaman kaynakta ilk yazılan overload'u seçer." }
      ],
      answer: "a",
      hint: "Overloading ile overriding'in seçim zamanlarını ayırın.",
      explanationShort: "object değişkeninin bildirilen tipi Object olduğu için print(Object) derleme zamanında bağlanır.",
      explanationLong: "Atanan değerin null veya başlangıçta String cast'iyle üretilmiş olması overload adayını değiştirmez. Çağrıdaki ifadenin statik tipi Object'tir.",
      optionExplanations: {
        a: "Doğru: overload çözümlemesi statik tip üzerinden yapılır.",
        b: "null her reference type'a aktarılabilir.",
        c: "Overload seçimi derleme zamanında yapılır; çalışma zamanındaki değer seçimi etkilemez.",
        d: "Kaynak sırası overload seçme kuralı değildir."
      },
      tags: ["overloading", "compile-time", "declared-type"]
    }),

    makeCard("O21", 1, {
      topic: "Upcasting ve Downcasting",
      difficulty: "medium",
      type: "multi",
      prompt: "Gösterilen kod için doğru değerlendirmeleri seçin.",
      code: "class Animal { }\nclass Dog extends Animal { }\nclass Cat extends Animal { }\n\nAnimal animal = new Dog();\nDog dog = (Dog) animal;\nCat cat = (Cat) animal;",
      options: [
        { id: "upcast", text: "new Dog() değerinin Animal referansına atanması güvenli bir upcasting işlemidir." },
        { id: "dogSuccess", text: "(Dog) animal cast'i çalışma zamanında başarılıdır." },
        { id: "catCompiles", text: "(Cat) animal cast'i derlenir." },
        { id: "catFails", text: "(Cat) animal satırı çalışma zamanında ClassCastException fırlatır." },
        { id: "catCreated", text: "Cat cast'i mevcut Dog nesnesini bir Cat nesnesine dönüştürür." }
      ],
      answer: ["upcast", "dogSuccess", "catCompiles", "catFails"],
      hint: "Cast nesnenin gerçek türünü değiştirmez; yalnız referansın nasıl ele alınacağını belirtir.",
      explanationShort: "Upcast ve Dog downcast güvenlidir; Cat cast'i derlenir fakat çalışma zamanında başarısız olur.",
      explanationLong: "animal değişkeni gerçekte Dog nesnesini gösterir. İlişkili sınıflar arasında explicit cast derlenebilir, ancak JVM gerçek nesnenin hedef tipe uygunluğunu denetler. Dog, Cat olmadığı için ClassCastException oluşur.",
      optionExplanations: {
        upcast: "Doğru: her Dog bir Animal'dır.",
        dogSuccess: "Doğru: gerçek nesne Dog'dur.",
        catCompiles: "Doğru: kardeş alt tür cast'i statik olarak mümkün kabul edilir.",
        catFails: "Doğru: gerçek Dog nesnesi Cat değildir.",
        catCreated: "Yanlış: cast yeni nesne üretmez ve nesnenin sınıfını değiştirmez."
      },
      tags: ["upcasting", "downcasting", "class-cast-exception"]
    }),

    makeCard("O21", 2, {
      topic: "Upcasting ve Downcasting",
      difficulty: "medium",
      type: "output",
      prompt: "Çalışma zamanı tür kontrolü sonucunda kodun çıktısı nedir?",
      code: "class Animal { }\nclass Dog extends Animal { }\nclass Cat extends Animal { }\n\nAnimal animal = new Dog();\nif (animal instanceof Cat) {\n    Cat cat = (Cat) animal;\n    System.out.println(\"cat\");\n} else {\n    System.out.println(\"not a cat\");\n}",
      answer: "not a cat",
      acceptedAnswers: ["not a cat"],
      caseSensitive: true,
      hint: "instanceof gerçek nesnenin Cat ile uyumlu olup olmadığını sınar.",
      explanationShort: "Nesne Dog olduğu için instanceof Cat false olur ve else dalı çalışır.",
      explanationLong: "instanceof güvenli downcast öncesinde çalışma zamanı türünü kontrol eder. animal null olsaydı da sonuç false olurdu; bu senaryoda referans açıkça Dog nesnesini gösterir.",
      assumptions: ["animal, kodda gösterildiği gibi null olmayan bir Dog nesnesini gösterir."],
      tags: ["instanceof", "downcasting", "runtime-type", "output"]
    }),

    makeCard("O22", 1, {
      version: "1.1.0",
      topic: "Interface ve Abstract Class",
      difficulty: "medium",
      type: "match",
      prompt: "Tasarım gereksinimlerini en uygun başlangıç yapısıyla eşleştirin.",
      pairs: {
        left: [
          { id: "sharedState", text: "Yakın alt türlerde ortak instance state, constructor ve temel uygulama" },
          { id: "independentCapability", text: "İlişkisiz sınıflara takılabilen bağımsız davranış sözleşmesi" },
          { id: "singleBase", text: "Tek bir ortak temel sınıf hiyerarşisi" },
          { id: "manyCapabilities", text: "Bir sınıfta birden fazla bağımsız yetenek" }
        ],
        right: [
          { id: "abstractPrimary", text: "Abstract class öncelikli" },
          { id: "interfacePrimary", text: "Interface öncelikli" },
          { id: "abstractHierarchy", text: "Abstract class hiyerarşisi" },
          { id: "multipleInterfaces", text: "Birden fazla interface" },
          { id: "decoy", text: "Static yardımcı (utility) sınıf" }
        ]
      },
      answer: {
        sharedState: "abstractPrimary",
        independentCapability: "interfacePrimary",
        singleBase: "abstractHierarchy",
        manyCapabilities: "multipleInterfaces"
      },
      hint: "Ortak state ile bağımsız yetenek ihtiyacını ayırın.",
      explanationShort: "Abstract class ortak state ve temel uygulamada; interface bağımsız ve çoklu yeteneklerde öne çıkar.",
      explanationLong: "Bu bir mekanik kural değil tasarım başlangıç noktasıdır. Abstract class sıkı akraba türlerde ortak temsil sağlar; interface istemcinin bir yetenek sözleşmesine bağlanmasını ve farklı hiyerarşilerin aynı yeteneği uygulamasını sağlar.",
      tags: ["abstract-class", "interface", "design-choice"]
    }),

    makeCard("O22", 2, {
      topic: "Interface ve Abstract Class",
      difficulty: "medium",
      type: "single",
      prompt: "Zaten başka bir sınıftan kalıtım alan Report sınıfına Exportable ve Printable gibi bağımsız yetenekler eklemek için en uygun yaklaşım hangisidir?",
      options: [
        { id: "a", text: "Exportable ve Printable interface'lerini uygulamak" },
        { id: "b", text: "Java'da iki ek sınıftan daha extends etmek" },
        { id: "c", text: "Bütün davranışları Object sınıfına eklemek" },
        { id: "d", text: "Her çağrıda sınıf adını String olarak karşılaştırmak" }
      ],
      answer: "a",
      hint: "Java sınıflarda tek kalıtım, interface'lerde çoklu uygulama destekler.",
      explanationShort: "Bağımsız yetenekler birden fazla interface ile ifade edilebilir.",
      explanationLong: "Report mevcut sınıf kalıtımını korurken Exportable ve Printable sözleşmelerini aynı anda uygulayabilir. Tür adına göre koşul yazmak polymorphism'i ve tür güvenliğini kaybettirir.",
      optionExplanations: {
        a: "Doğru: çoklu bağımsız yetenek sözleşmesi sağlar.",
        b: "Java sınıflarda çoklu extends desteklemez.",
        c: "Object'a alan davranışı eklenemez ve eklenmesi de doğru sorumluluk değildir.",
        d: "String tür kontrolleri genişletilebilir bir nesne modeli değildir."
      },
      tags: ["interface", "capability", "multiple-interfaces"]
    }),

    makeCard("O23", 1, {
      topic: "Interface Default Metotları",
      difficulty: "medium",
      type: "boolean",
      prompt: "A ve B interface'leri aynı imzalı label() default metodunu sağlarken C implements A, B sınıfı label() metodunu override etmeden derlenir.",
      code: "interface A {\n    default String label() { return \"A\"; }\n}\ninterface B {\n    default String label() { return \"B\"; }\n}\nclass C implements A, B { }",
      answer: false,
      hint: "Derleyici iki eşit öncelikli varsayılan uygulamadan birini kendiliğinden seçmez.",
      explanationShort: "Yanlış. C çakışmayı açık bir override ile çözmelidir.",
      explanationLong: "İki ilişkisiz interface aynı imzalı default metot sağladığında sınıf kendi label uygulamasını bildirmek zorundadır. İster yeni davranış yazar, ister InterfaceName.super.method() ile birini seçer.",
      optionExplanations: {
        true: "Yanlış: eşit öncelikli iki default uygulama belirsizdir.",
        false: "Doğru: açık override olmadan derleme hatası oluşur."
      },
      tags: ["interface", "default-method", "conflict"]
    }),

    makeCard("O23", 2, {
      topic: "Interface Default Metotları",
      difficulty: "medium",
      type: "fill",
      prompt: "C.label() içinde özellikle A interface'inin default uygulamasını çağıran ifadeyi yazın. Yalnızca return değerinin sağındaki ifadeyi girin.",
      code: "class C implements A, B {\n    @Override\n    public String label() {\n        return __________;\n    }\n}",
      answer: "A.super.label()",
      acceptedAnswers: ["A.super.label()", "A . super . label ()", "A.super.label();", "A . super . label ();"],
      caseSensitive: true,
      hint: "Üst sınıf değil, belirli bir interface adı nitelendirici olarak kullanılır.",
      explanationShort: "İfade A.super.label() olmalıdır.",
      explanationLong: "InterfaceName.super.method() sözdizimi, çakışan default metotlardan belirli olanı seçer. C yine de çakışmayı kendi override'ı içinde açıkça çözmüş olur.",
      assumptions: ["A ve B, kaynak sorudaki public label() default metotlarını sağlar."],
      tags: ["interface", "default-method", "super", "fill"]
    }),

    makeCard("O24", 1, {
      topic: "Composition",
      difficulty: "medium",
      type: "multi",
      prompt: "Genel amaçlı List sınıfından kalıtım almak yerine listeyi private alan olarak kullanan bir Stack tasarımının yararlarını seçin.",
      options: [
        { id: "api", text: "Stack yalnız push, pop ve peek gibi geçerli operasyonları açabilir." },
        { id: "invariant", text: "İstemcinin listeye özgü rastgele ekleme/silme işlemleriyle LIFO kuralını bozması engellenebilir." },
        { id: "replace", text: "İç veri yapısı istemci API'si değişmeden değiştirilebilir." },
        { id: "isList", text: "Stack'in her List beklenen yerde substitutable olması garanti edilir." }
      ],
      answer: ["api", "invariant", "replace"],
      hint: "Composition'ın saklayabildiği API yüzeyini ve implementasyon ayrıntısını düşünün.",
      explanationShort: "Composition kontrollü API, invariant koruması ve implementasyon değiştirme özgürlüğü sağlar.",
      explanationLong: "Stack bir List'in bütün davranış sözleşmesini taşımak zorunda değildir. Private bileşen yalnız ihtiyaç duyulan operasyonlarla çevrelenir. Stack'in List yerine her yerde kullanılabilmesi hedeflenmez.",
      optionExplanations: {
        api: "Doğru: dış API alan ihtiyacına göre daraltılır.",
        invariant: "Doğru: LIFO'yu bozan liste operasyonları açılmaz.",
        replace: "Doğru: ArrayDeque gibi başka yapı içeride kullanılabilir.",
        isList: "Yanlış: composition is-a substitutability iddiası kurmaz."
      },
      tags: ["composition", "inheritance", "stack", "invariant"]
    }),

    makeCard("O24", 2, {
      topic: "Composition",
      difficulty: "medium",
      type: "output",
      prompt: "Deque bileşenini kapsülleyen Stack sınıfının çıktısı nedir?",
      code: "class Stack {\n    private final java.util.Deque<Integer> data = new java.util.ArrayDeque<>();\n    void push(int value) { data.push(value); }\n    int pop() { return data.pop(); }\n    int size() { return data.size(); }\n}\n\nStack stack = new Stack();\nstack.push(10);\nstack.push(20);\nSystem.out.println(stack.pop());\nSystem.out.println(stack.size());",
      answer: "20\n1",
      acceptedAnswers: ["20\n1"],
      caseSensitive: true,
      hint: "Deque.push öğeyi başa ekler; pop en son push edilen öğeyi alır.",
      explanationShort: "LIFO gereği 20 çıkar ve stack'te bir öğe kalır.",
      explanationLong: "Stack içindeki Deque'yi composition ile kullanır ve yalnız alan davranışlarını sunar. İstemci doğrudan Deque'ye erişemez.",
      assumptions: ["Deque başlangıçta boştur.", "Çıktı satır sırası korunur."],
      tags: ["composition", "stack", "lifo", "output"]
    }),

    makeCard("O25", 1, {
      version: "1.1.0",
      topic: "Composition ile Modelleme",
      difficulty: "medium",
      type: "match",
      prompt: "Order composition modelindeki sorumlulukları uygun sınıfla eşleştirin.",
      pairs: {
        left: [
          { id: "productIdentity", text: "Ürün kimliği, adı ve birim fiyatı" },
          { id: "quantity", text: "Siparişteki ürün adedi" },
          { id: "lineTotal", text: "Birim fiyat × adet satır toplamı" },
          { id: "orderTotal", text: "Tüm satır toplamlarının toplamı" }
        ],
        right: [
          { id: "Product", text: "Product" },
          { id: "OrderItemQuantity", text: "OrderItem.quantity" },
          { id: "OrderItemTotal", text: "OrderItem.getTotal()" },
          { id: "OrderTotal", text: "Order.getTotal()" },
          { id: "decoy", text: "Product.quantity" }
        ]
      },
      answer: {
        productIdentity: "Product",
        quantity: "OrderItemQuantity",
        lineTotal: "OrderItemTotal",
        orderTotal: "OrderTotal"
      },
      hint: "Satıra ait hesap ile tüm siparişe ait toplamayı ayırın.",
      explanationShort: "Product ürün verisini, OrderItem adet ve satır toplamını, Order ise satır koleksiyonu ve genel toplamı yönetir.",
      explanationLong: "Order, OrderItem nesnelerinden oluşur. Her OrderItem bir Product ve quantity taşır; kendi satır toplamını hesaplar. Order bu sonuçları toplayarak genel tutarı verir.",
      tags: ["composition", "order", "responsibility"]
    }),

    makeCard("O25", 2, {
      topic: "Composition ile Modelleme",
      difficulty: "medium",
      type: "output",
      prompt: "OrderItem'ın satır toplamı çıktısı nedir?",
      code: "class Product {\n    final double unitPrice;\n    Product(double unitPrice) { this.unitPrice = unitPrice; }\n}\nclass OrderItem {\n    final Product product;\n    final int quantity;\n    OrderItem(Product product, int quantity) {\n        this.product = product;\n        this.quantity = quantity;\n    }\n    double total() { return product.unitPrice * quantity; }\n}\n\nOrderItem item = new OrderItem(new Product(15.0), 3);\nSystem.out.println(item.total());",
      answer: "45.0",
      acceptedAnswers: ["45.0", "45"],
      caseSensitive: true,
      hint: "Birim fiyatı adetle çarpın.",
      explanationShort: "15.0 × 3 sonucu 45.0'dır.",
      explanationLong: "OrderItem bir Product'a sahiptir ve quantity bilgisini kendi satır bağlamında tutar. Satır toplamı bu iki veriden hesaplanır; genel sipariş toplamı Order'ın sorumluluğudur.",
      assumptions: ["Fiyat gösterimi ve parasal yuvarlama kapsam dışıdır; örnek yalnız sorumluluk dağılımını ölçer."],
      tags: ["composition", "order-item", "output"]
    }),

    makeCard("O26", 1, {
      topic: "Dependency Injection",
      difficulty: "medium",
      type: "single",
      prompt: "Kaynak tasarımda CheckoutService'in doğrudan bağımlı olduğu somut sınıf hangisidir?",
      code: "class CheckoutService {\n    private final EmailSender sender = new EmailSender();\n\n    void checkout() {\n        sender.send(\"Order completed\");\n    }\n}",
      options: [
        { id: "email", text: "EmailSender" },
        { id: "string", text: "String" },
        { id: "checkout", text: "CheckoutService'in kendisi" },
        { id: "none", text: "Hiçbir sınıf; new bağımlılık oluşturmaz" }
      ],
      answer: "email",
      hint: "Sınıf gövdesindeki new ifadesini bulun.",
      explanationShort: "CheckoutService somut EmailSender'ı kendisi oluşturur ve ona sıkı bağlıdır.",
      explanationLong: "Bağımlılığın içeride new ile kurulması farklı gönderici veya test doubles kullanmayı zorlaştırır. Sender sözleşmesi constructor üzerinden dışarıdan aktarılabilir.",
      optionExplanations: {
        email: "Doğru: alan doğrudan new EmailSender() ile oluşturulur.",
        string: "String mesaj verisidir; tasarımda değiştirilecek gönderici bağımlılığı değildir.",
        checkout: "Sınıfın kendisi bu bağlamda dış bağımlılık değildir.",
        none: "Yanlış: nesne oluşturmak somut tipe bağımlılık kurar."
      },
      tags: ["dependency", "dependency-injection", "testability"]
    }),

    makeCard("O26", 2, {
      topic: "Dependency Injection",
      difficulty: "medium",
      type: "multi",
      prompt: "MessageSender interface'inin CheckoutService constructor'ından alınmasının sağladığı yararları seçin.",
      code: "interface MessageSender { void send(String message); }\nclass CheckoutService {\n    private final MessageSender sender;\n    CheckoutService(MessageSender sender) {\n        this.sender = sender;\n    }\n}",
      options: [
        { id: "fake", text: "Testte kayıt tutan fake sender verilebilir." },
        { id: "replace", text: "Email yerine SMS uygulaması istemci sınıf değiştirilmeden takılabilir." },
        { id: "visible", text: "Zorunlu bağımlılık constructor imzasında görünür olur." },
        { id: "noValidation", text: "Artık null veya geçersiz dependency kontrolüne hiç gerek kalmaz." }
      ],
      answer: ["fake", "replace", "visible"],
      hint: "Nesne oluşturma kararı sınıfın dışına taşındığında test ve değiştirilebilirlik nasıl etkilenir?",
      explanationShort: "Constructor injection bağımlılığı görünür, değiştirilebilir ve testte ikame edilebilir yapar.",
      explanationLong: "CheckoutService MessageSender sözleşmesine bağlı kalır. Composition root uygun gerçek veya sahte uygulamayı verir. Constructor injection geçersiz null değerini kendiliğinden engellemez; sınıf gerekirse doğrulamalıdır.",
      optionExplanations: {
        fake: "Doğru: yan etki üretmeyen test double kullanılabilir.",
        replace: "Doğru: ortak sözleşmenin başka uygulaması takılabilir.",
        visible: "Doğru: dependency API'de açık hâle gelir.",
        noValidation: "Yanlış: injection doğrulama ihtiyacını otomatik kaldırmaz."
      },
      tags: ["dependency-injection", "constructor-injection", "testability"]
    }),

    makeCard("O27", 1, {
      topic: "Cohesion ve Coupling",
      difficulty: "medium",
      type: "single",
      prompt: "Yüksek cohesion ve düşük coupling hedefini en iyi karşılayan tasarım hangisidir?",
      options: [
        { id: "a", text: "InvoiceCalculator yalnız fatura hesaplar ve TaxPolicy interface'ini constructor'dan alır." },
        { id: "b", text: "InvoiceManager hesaplama, veritabanı, e-posta ve raporlama işlerinin tümünü yapıp somut sınıfları kendi oluşturur." },
        { id: "c", text: "Tüm sınıflar ortak global mutable state'i doğrudan değiştirir." },
        { id: "d", text: "Her sınıf diğer sınıfların private ayrıntılarını reflection ile kullanır." }
      ],
      answer: "a",
      hint: "Tek ve ilişkili bir amaç ile değiştirilebilir bağımlılığı birlikte arayın.",
      explanationShort: "Odaklı sorumluluk cohesion'ı yükseltir; soyut bağımlılığın dışarıdan verilmesi coupling'i düşürür.",
      explanationLong: "Yüksek cohesion bir sınıfın üyelerinin tek, anlamlı bir amaç etrafında toplanmasıdır. Düşük coupling ise sınıfların birbirlerinin somut ayrıntılarına az bağımlı olmasıdır; bu bakım ve izole testi kolaylaştırır.",
      optionExplanations: {
        a: "Doğru: sorumluluk odaklı, bağımlılık soyuttur.",
        b: "Birbiriyle ilgisiz sorumluluklar düşük cohesion; içeride new kullanımı sıkı coupling üretir.",
        c: "Global mutable state güçlü ve gizli coupling oluşturur.",
        d: "İç ayrıntılara bağımlılık coupling'i artırır."
      },
      tags: ["cohesion", "coupling", "maintainability", "testability"]
    }),

    makeCard("O28", 1, {
      topic: "SOLID · Single Responsibility",
      difficulty: "medium",
      type: "multi",
      prompt: "UserService içinde birbirinden bağımsız değişim nedenleri oluşturan sorumlulukları seçin.",
      code: "class UserService {\n    void registerUser() { }\n    void saveToDatabase() { }\n    void sendWelcomeEmail() { }\n    void generateMonthlyUserReport() { }\n}",
      options: [
        { id: "registration", text: "Kullanıcı kayıt iş akışı" },
        { id: "persistence", text: "Veritabanına kalıcılık" },
        { id: "email", text: "E-posta gönderimi" },
        { id: "report", text: "Aylık rapor üretimi" }
      ],
      answer: ["registration", "persistence", "email", "report"],
      hint: "İş kuralı, altyapı ve raporlama farklı nedenlerle değişebilir.",
      explanationShort: "Dört operasyon da ayrı değişim nedeni taşır; tek sınıfta toplanmaları SRP ihlalidir.",
      explanationLong: "Kayıt akışı ürün kuralıyla, persistence veri teknolojisiyle, e-posta sağlayıcıyla ve raporlama analitik ihtiyaçlarla değişir. SRP her metot için ayrı sınıf demek değil, aynı değişim eksenindeki davranışları birlikte tutmak demektir.",
      optionExplanations: {
        registration: "Doğru: domain/use-case akışıdır.",
        persistence: "Doğru: veri erişimi ayrı bir değişim eksenidir.",
        email: "Doğru: bildirim altyapısı ayrı değişir.",
        report: "Doğru: raporlama gereksinimleri bağımsız değişir."
      },
      tags: ["solid", "srp", "responsibility"]
    }),

    makeCard("O28", 2, {
      version: "1.1.0",
      topic: "SOLID · Single Responsibility",
      difficulty: "medium",
      type: "match",
      prompt: "UserService operasyonlarını önerilen odaklı bileşenlerle eşleştirin.",
      pairs: {
        left: [
          { id: "register", text: "Kayıt iş akışını orkestre etme" },
          { id: "save", text: "User verisini saklama" },
          { id: "welcome", text: "Hoş geldin mesajı gönderme" },
          { id: "monthly", text: "Aylık kullanıcı raporu üretme" }
        ],
        right: [
          { id: "RegistrationService", text: "RegistrationService" },
          { id: "UserRepository", text: "UserRepository" },
          { id: "WelcomeNotifier", text: "WelcomeNotifier" },
          { id: "UserReportGenerator", text: "UserReportGenerator" },
          { id: "decoy", text: "UserManager (tüm işler tek sınıfta)" }
        ]
      },
      answer: {
        register: "RegistrationService",
        save: "UserRepository",
        welcome: "WelcomeNotifier",
        monthly: "UserReportGenerator"
      },
      hint: "Bileşen adlarını tek değişim nedeni etrafında okuyun.",
      explanationShort: "İş akışı, kalıcılık, bildirim ve raporlama odaklı sınıflara ayrılır.",
      explanationLong: "RegistrationService diğer soyut bileşenleri orkestre edebilir; persistence ve dış iletişim ayrıntılarını kendi içine almaz. Ayrım, testlerde her değişim eksenini izole etmeyi kolaylaştırır.",
      tags: ["solid", "srp", "refactoring"]
    }),

    makeCard("O29", 1, {
      topic: "SOLID · Open/Closed",
      difficulty: "medium",
      type: "single",
      prompt: "Yeni müşteri türleri eklendiğinde mevcut indirim hesaplayıcıdaki if/else zincirini değiştirmemeyi sağlayan tasarım hangisidir?",
      options: [
        { id: "a", text: "DiscountPolicy interface'i ve her politika için calculate(amount) uygulaması" },
        { id: "b", text: "customerType String karşılaştırmalarını tek, daha uzun metoda eklemeye devam etmek" },
        { id: "c", text: "Her müşteri türü için global boolean alan eklemek" },
        { id: "d", text: "Bütün indirimleri çağıran kod içinde tekrar hesaplamak" }
      ],
      answer: "a",
      hint: "Değişen algoritmayı ortak bir sözleşmenin arkasına alın.",
      explanationShort: "Strategy benzeri DiscountPolicy uygulamaları mevcut hesaplayıcıyı değiştirmeden genişletilebilir.",
      explanationLong: "Checkout/DiscountCalculator bir DiscountPolicy'ye delegasyon yapar. Yeni politika interface'i uygulayarak eklenir; istemcide tür String'lerine göre büyüyen koşullar gerekmez.",
      optionExplanations: {
        a: "Doğru: değişen indirim davranışı polymorphic stratejilere ayrılır.",
        b: "Her yeni tür mevcut metodu değiştirmeyi gerektirir.",
        c: "Global bayraklar kombinasyon ve durum karmaşası üretir.",
        d: "Kod tekrarına ve tutarsızlığa yol açar."
      },
      tags: ["solid", "ocp", "strategy", "discount"]
    }),

    makeCard("O29", 2, {
      topic: "SOLID · Open/Closed",
      difficulty: "medium",
      type: "output",
      prompt: "Enjekte edilen PremiumDiscount politikasıyla hesaplanan indirim çıktısı nedir?",
      code: "interface DiscountPolicy {\n    double discount(double amount);\n}\nclass PremiumDiscount implements DiscountPolicy {\n    public double discount(double amount) { return amount * 0.10; }\n}\nclass DiscountCalculator {\n    private final DiscountPolicy policy;\n    DiscountCalculator(DiscountPolicy policy) { this.policy = policy; }\n    double calculate(double amount) { return policy.discount(amount); }\n}\n\nSystem.out.println(new DiscountCalculator(new PremiumDiscount()).calculate(200.0));",
      answer: "20.0",
      acceptedAnswers: ["20.0", "20"],
      caseSensitive: true,
      hint: "Premium politika tutarın yüzde 10'unu döndürüyor.",
      explanationShort: "200.0 × 0.10 = 20.0.",
      explanationLong: "Calculator somut müşteri türünü sorgulamaz; seçilen DiscountPolicy'ye delegasyon yapar. Yeni politika eklendiğinde calculator'ın kaynak kodu değişmez.",
      assumptions: ["Negatif tutar, para birimi ve yuvarlama bu örneğin kapsamı dışındadır."],
      tags: ["solid", "ocp", "strategy", "output"]
    }),

    makeCard("O30", 1, {
      version: "1.1.0",
      topic: "DRY, KISS ve YAGNI",
      difficulty: "medium",
      type: "match",
      prompt: "Kodlama kararlarını en doğrudan ilgili prensiple eşleştirin.",
      pairs: {
        left: [
          { id: "duplicateValidation", text: "Aynı e-posta doğrulamasını beş yerde kopyalamak yerine tek bileşende toplamak" },
          { id: "simpleRule", text: "İki açık koşul yeterliyken anlaşılır, küçük çözümü seçmek" },
          { id: "futureEngine", text: "Henüz gereksinim yokken genel amaçlı kural motoru yazmamak" }
        ],
        right: [
          { id: "DRY", text: "DRY" },
          { id: "KISS", text: "KISS" },
          { id: "YAGNI", text: "YAGNI" },
          { id: "decoy", text: "Open/Closed Principle" }
        ]
      },
      answer: {
        duplicateValidation: "DRY",
        simpleRule: "KISS",
        futureEngine: "YAGNI"
      },
      hint: "Tekrar, gereksiz karmaşıklık ve spekülatif özellikleri ayrı ayrı düşünün.",
      explanationShort: "Tekrarlı bilgi DRY, basit çözüm KISS, gerekmeyen gelecek özelliği YAGNI ile ilgilidir.",
      explanationLong: "DRY aynı bilginin birden fazla doğruluk kaynağına dönüşmesini önler. KISS mevcut problemi anlaşılır en basit tasarımla çözmeyi, YAGNI ise yalnız gelecekte gerekebilir diye özellik üretmemeyi öğütler.",
      tags: ["dry", "kiss", "yagni", "principles"]
    }),

    makeCard("O31", 1, {
      version: "1.1.0",
      topic: "SOLID · Liskov Substitution",
      difficulty: "hard",
      type: "single",
      prompt: "Penguin.fly() metodunun UnsupportedOperationException fırlatması neden Liskov Substitution Principle ihlalidir?",
      code: "class Bird {\n    void fly() { }\n}\nclass Penguin extends Bird {\n    @Override\n    void fly() {\n        throw new UnsupportedOperationException();\n    }\n}",
      options: [
        { id: "a", text: "Penguin, Bird'ün sözleşmesini bozar." },
        { id: "b", text: "Alt sınıflar hiçbir metodu override edemez." },
        { id: "c", text: "Override edilen metotta unchecked exception fırlatmak Java derleyicisi tarafından her zaman engellenir." },
        { id: "d", text: "Penguin sınıfında constructor bulunmadığı için." }
      ],
      answer: "a",
      hint: "Bird bekleyen istemcinin geçerli varsayımı Penguin ile bozuluyor mu?",
      explanationShort: "Penguin, Bird'ün vaat ettiği fly davranışını sağlayamadığı için yerine geçebilirliği bozar.",
      explanationLong: "Üst tür API'si tüm Bird örneklerinin fly çağrısını desteklediği izlenimini verir. Penguin bu geçerli operasyonu reddettiğinde istemci alt tür bilgisi kullanmak zorunda kalır; hiyerarşinin sözleşmesi yanlıştır.",
      optionExplanations: {
        a: "Doğru: alt tür üst türün davranış sözleşmesini karşılamaz.",
        b: "Override yasak değildir; sözleşmeyle uyumlu olmalıdır.",
        c: "Override eden metot unchecked exception fırlatabilir; sorun derleme değil, beklenen davranışın reddedilmesidir.",
        d: "Derleyici parametresiz constructor sağlayabilir; LSP ile ilgisi yoktur."
      },
      tags: ["solid", "lsp", "substitutability", "bird-penguin"]
    }),

    makeCard("O31", 2, {
      topic: "SOLID · Liskov Substitution",
      difficulty: "hard",
      type: "multi",
      prompt: "Bird–Penguin modelini substitutability açısından iyileştiren kararları seçin.",
      options: [
        { id: "baseBird", text: "Bird temel türü yalnız tüm kuşlarda geçerli davranışları içersin." },
        { id: "flyable", text: "fly davranışı ayrı Flyable interface'ine taşınsın." },
        { id: "flyingBird", text: "Sparrow gibi uçan türler Flyable uygulasın; Penguin uygulamasın." },
        { id: "empty", text: "Penguin.fly hiçbir şey yapmadan sessizce dönsün ama yine Flyable sayılsın." }
      ],
      answer: ["baseBird", "flyable", "flyingBird"],
      hint: "Uçamayan nesneye uçma sözleşmesi vermeyin.",
      explanationShort: "Ortak kuş özellikleri Bird'de, uçma yeteneği Flyable'da tutulmalıdır.",
      explanationLong: "Yetenek tabanlı modelde yalnız gerçekten uçabilen türler Flyable sözleşmesini verir. Sessiz no-op uygulama da istemcinin uçuş gerçekleştiği beklentisini bozabileceği için çözüm değildir.",
      optionExplanations: {
        baseBird: "Doğru: temel sözleşme tüm alt türlerce karşılanabilir olur.",
        flyable: "Doğru: uçuş ayrı ve doğru bir yetenek sözleşmesine dönüşür.",
        flyingBird: "Doğru: yalnız uygun türler yeteneği uygular.",
        empty: "Yanlış: hiçbir şey yapmamak davranış beklentisini yine bozabilir."
      },
      tags: ["solid", "lsp", "interface", "refactoring"]
    }),

    makeCard("O32", 1, {
      version: "1.1.0",
      topic: "SOLID · Interface Segregation",
      difficulty: "hard",
      type: "match",
      prompt: "Worker interface'indeki operasyonları ayrıştırılmış yetenek interface'leriyle eşleştirin.",
      pairs: {
        left: [
          { id: "work", text: "work()" },
          { id: "eat", text: "eat()" },
          { id: "sleep", text: "sleep()" },
          { id: "recharge", text: "recharge()" }
        ],
        right: [
          { id: "Workable", text: "Workable" },
          { id: "Eatable", text: "Eatable" },
          { id: "Sleepable", text: "Sleepable" },
          { id: "Rechargeable", text: "Rechargeable" },
          { id: "decoy", text: "Worker (tüm operasyonları içeren geniş interface)" }
        ]
      },
      answer: {
        work: "Workable",
        eat: "Eatable",
        sleep: "Sleepable",
        recharge: "Rechargeable"
      },
      hint: "Her interface'i tek, uyumlu bir istemci ihtiyacına göre adlandırın.",
      explanationShort: "Büyük Worker sözleşmesi dört küçük yetenek interface'ine ayrılır.",
      explanationLong: "Interface Segregation, istemcilerin kullanmadıkları operasyonlara bağımlı bırakılmamasını ister. İnsan ve robot gibi türler yalnız gerçekten sağladıkları yetenekleri uygular.",
      tags: ["solid", "isp", "interface-segregation"]
    }),

    makeCard("O32", 2, {
      topic: "SOLID · Interface Segregation",
      difficulty: "hard",
      type: "multi",
      prompt: "Workable, Eatable, Sleepable ve Rechargeable interface'lerine ayrılmış tasarımda doğru uygulama seçimlerini işaretleyin.",
      options: [
        { id: "humanWork", text: "HumanWorker, Workable uygular." },
        { id: "humanEat", text: "HumanWorker, Eatable ve Sleepable uygular." },
        { id: "robotWork", text: "RobotWorker, Workable ve Rechargeable uygular." },
        { id: "robotEat", text: "RobotWorker, kullanmayacağı Eatable'ı da zorunlu olarak uygular." }
      ],
      answer: ["humanWork", "humanEat", "robotWork"],
      hint: "Her tür yalnız anlamlı şekilde yerine getirebildiği sözleşmeleri almalıdır.",
      explanationShort: "İnsan çalışma/yeme/uyuma, robot çalışma/şarj yeteneklerini uygular.",
      explanationLong: "Küçük interface'ler implementasyonları anlamsız no-op veya UnsupportedOperationException metotlarından kurtarır ve istemcilerin yalnız kullandıkları sözleşmeye bağlanmasını sağlar.",
      optionExplanations: {
        humanWork: "Doğru: insan çalışan work davranışı sağlar.",
        humanEat: "Doğru: örnek alan modelinde insan bu yetenekleri sağlar.",
        robotWork: "Doğru: robot çalışır ve şarj edilir.",
        robotEat: "Yanlış: ayrıştırmanın amacı kullanılmayan sözleşmeyi zorunlu kılmamaktır."
      },
      assumptions: ["Senaryodaki robot enerji için recharge kullanır; eat ve sleep davranışları yoktur."],
      tags: ["solid", "isp", "capability"]
    }),

    makeCard("O33", 1, {
      topic: "SOLID · Dependency Inversion",
      difficulty: "hard",
      type: "single",
      prompt: "OrderService tasarımını Dependency Inversion Principle'a uygun hâle getiren temel değişiklik hangisidir?",
      code: "class OrderService {\n    private final MySqlOrderRepository repository =\n            new MySqlOrderRepository();\n}",
      options: [
        { id: "a", text: "OrderRepository abstraction'ı tanımlayıp OrderService'e constructor'dan vermek" },
        { id: "b", text: "MySqlOrderRepository alanını public static yapmak" },
        { id: "c", text: "save çağrısını tüm controller'lara kopyalamak" },
        { id: "d", text: "Somut sınıf adını String alanında saklayıp if ile seçmek" }
      ],
      answer: "a",
      hint: "Yüksek seviyeli iş akışı somut veritabanı ayrıntısını oluşturmamalıdır.",
      explanationShort: "OrderService soyut OrderRepository'ye, MySQL sınıfı da bu sözleşmeye bağımlı olmalıdır.",
      explanationLong: "DIP yüksek ve düşük seviyeli modüllerin abstraction'a yönelmesini ister. Constructor injection composition root'a MySQL, in-memory veya test uygulaması seçme olanağı verir.",
      optionExplanations: {
        a: "Doğru: bağımlılığın yönü abstraction'a çevrilir.",
        b: "Global somut bağımlılığı daha da güçlendirir.",
        c: "Tekrar ve coupling oluşturur.",
        d: "String tabanlı tür seçimi soyut sözleşme sağlamaz."
      },
      tags: ["solid", "dip", "repository", "dependency-injection"]
    }),

    makeCard("O33", 2, {
      topic: "SOLID · Dependency Inversion",
      difficulty: "hard",
      type: "fill",
      prompt: "OrderService constructor'ındaki eksik parametre bildirimini yazın.",
      code: "interface OrderRepository {\n    void save(Order order);\n}\nclass OrderService {\n    private final OrderRepository repository;\n\n    OrderService(________________________) {\n        this.repository = repository;\n    }\n}",
      answer: "OrderRepository repository",
      acceptedAnswers: ["OrderRepository repository", "final OrderRepository repository", "OrderRepository  repository"],
      caseSensitive: true,
      hint: "Alan somut MySQL sınıfı değil, interface türündedir.",
      explanationShort: "Parametre OrderRepository repository olmalıdır.",
      explanationLong: "Constructor soyut repository sözleşmesini alır. final parametre niteleyicisi isteğe bağlı ve eşdeğer kabul edilmiştir; alan zaten final olduğundan constructor'da bir kez atanır.",
      assumptions: ["Order türü tanımlıdır; soru yalnız bağımlılık bildiriminin tipini ölçer."],
      tags: ["solid", "dip", "constructor-injection", "fill"]
    }),

    makeCard("O34", 1, {
      version: "1.1.0",
      topic: "SOLID · Liskov Substitution",
      difficulty: "hard",
      type: "single",
      prompt: "Üst sınıf withdraw(1..balance) aralığındaki tüm tutarları kabul ederken alt sınıfın minimum 100 koşulu ekleyip daha küçük tutarlarda exception fırlatması hangi sözleşme sorununu oluşturur?",
      options: [
        { id: "a", text: "Alt sınıf önkoşulu güçlendirip LSP'yi bozar." },
        { id: "b", text: "Alt sınıf yalnızca postcondition'ı güçlendirdiği için üst türün yerine her durumda güvenle kullanılabilir; sözleşme sorunu yoktur." },
        { id: "c", text: "Yalnız performans sorunudur; davranış sözleşmesi etkilenmez." },
        { id: "d", text: "Overloading sorunudur çünkü parametre adı değişmiştir." }
      ],
      answer: "a",
      hint: "Üst tür istemcisinin geçerli kabul ettiği 50 tutarını düşünün.",
      explanationShort: "Yeni minimum, kabul edilen girdi kümesini daraltır ve LSP'yi ihlal eder.",
      explanationLong: "Alt tür üst türden daha güçlü bir önkoşul dayatamaz; aksi hâlde BaseAccount ile çalışan istemci SpecialAccount verildiğinde bozulur. Parametre adının overload ile ilgisi yoktur.",
      optionExplanations: {
        a: "Doğru: geçerli üst tür çağrısı alt türde reddedilir.",
        b: "Burada güçlenen postcondition değil precondition'dır; küçük tutarlar artık reddedilir.",
        c: "İstemci davranışı exception ile değişir.",
        d: "Parametre adı metot imzasının parçası değildir."
      },
      assumptions: ["Üst sınıf sözleşmesi pozitif ve bakiyeyi aşmayan her tutarı kabul ettiğini açıkça vaat eder."],
      tags: ["solid", "lsp", "precondition", "contract"]
    }),

    makeCard("O34", 2, {
      topic: "SOLID · Liskov Substitution",
      difficulty: "hard",
      type: "multi",
      prompt: "Minimum çekim tutarı zorunlu olan hesap türünü substitutability'yi bozmadan modelleyebilecek seçenekleri seçin.",
      options: [
        { id: "commonContract", text: "Ortak Account sözleşmesine minimum kuralını açıkça dahil edip tüm implementasyonların aynı sözleşmeye uymasını sağlamak" },
        { id: "separateCapability", text: "Farklı çekim sözleşmelerini ayrı interface veya ayrı hiyerarşilerle ifade etmek" },
        { id: "policy", text: "WithdrawalPolicy composition kullanıp kabul kuralını açık ve enjekte edilebilir yapmak" },
        { id: "surprise", text: "Alt sınıfta belgelenmemiş yeni exception fırlatıp istemcinin yakalamasını ummak" }
      ],
      answer: ["commonContract", "separateCapability", "policy"],
      hint: "İstemciye verilen sözleşmeyle gerçek kabul kurallarını uyumlu hâle getirin.",
      explanationShort: "Sözleşme uyumlandırılabilir, yetenekler ayrılabilir veya değişen kural policy olarak bileşime taşınabilir.",
      explanationLong: "Doğru çözüm domain'e bağlıdır. Önemli olan üst türün vaat ettiği geçerli girdilerin alt türde sürpriz biçimde reddedilmemesidir. Gizli exception istemciye alt tür bilgisi sızdırır.",
      optionExplanations: {
        commonContract: "Doğru: tüm alt türlerin karşılayabildiği ortak sözleşme kurulur.",
        separateCapability: "Doğru: farklı davranışlar yanlış bir ortak tipe zorlanmaz.",
        policy: "Doğru: değişen kabul kuralı açık bir collaborator olur.",
        surprise: "Yanlış: asıl substitutability ihlalini sürdürür."
      },
      tags: ["solid", "lsp", "composition", "contract"]
    }),

    makeCard("O35", 1, {
      topic: "Ödeme Sistemi Tasarımı",
      difficulty: "hard",
      type: "multi",
      prompt: "Yeni ödeme türlerinde koşul bloklarının büyümesini engelleyen checkout tasarımının parçalarını seçin.",
      options: [
        { id: "contract", text: "PaymentMethod adında pay(amount) sözleşmesi" },
        { id: "implementations", text: "CreditCardPayment, BankTransferPayment ve WalletPayment uygulamaları" },
        { id: "inject", text: "CheckoutService'e seçilen PaymentMethod'ı dışarıdan verme" },
        { id: "typeString", text: "CheckoutService içinde paymentType String'i için sürekli büyüyen switch" }
      ],
      answer: ["contract", "implementations", "inject"],
      hint: "Değişen ödeme davranışını polymorphic nesnelere taşıyın.",
      explanationShort: "Ortak sözleşme, somut stratejiler ve injection genişletilebilir bir tasarım sağlar.",
      explanationLong: "CheckoutService yalnız PaymentMethod.pay çağrısını bilir. Yeni ödeme türü yeni bir implementation olarak eklenir; ana iş akışında tür String'ine göre dallanma büyümez.",
      optionExplanations: {
        contract: "Doğru: istemci için kararlı abstraction sağlar.",
        implementations: "Doğru: kanala özgü davranış kendi sınıfında yaşar.",
        inject: "Doğru: strateji seçimi checkout dışına taşınır.",
        typeString: "Yanlış: her yeni tür mevcut koşul bloğunu değiştirir."
      },
      tags: ["payment", "strategy", "polymorphism", "ocp"]
    }),

    makeCard("O35", 2, {
      topic: "Ödeme Sistemi Tasarımı",
      difficulty: "hard",
      type: "output",
      prompt: "PaymentMethod polymorphism'i kullanıldığında checkout çıktısı nedir?",
      code: "interface PaymentMethod {\n    String pay(double amount);\n}\nclass CreditCardPayment implements PaymentMethod {\n    public String pay(double amount) { return \"credit:\" + amount; }\n}\nclass CheckoutService {\n    String checkout(double amount, PaymentMethod method) {\n        return method.pay(amount);\n    }\n}\n\nSystem.out.println(new CheckoutService().checkout(250.0, new CreditCardPayment()));",
      answer: "credit:250.0",
      acceptedAnswers: ["credit:250.0"],
      caseSensitive: true,
      hint: "CheckoutService tutarı aldığı stratejinin pay metoduna aynen iletir.",
      explanationShort: "CreditCardPayment.pay 250.0 için credit:250.0 döndürür.",
      explanationLong: "CheckoutService somut ödeme sınıfını sorgulamaz. Interface çağrısı çalışma zamanındaki CreditCardPayment uygulamasına yönlenir.",
      assumptions: ["Ödeme başarısızlığı, para birimi ve hassas kart verisi bu küçük örneğin kapsamı dışındadır."],
      tags: ["payment", "strategy", "polymorphism", "output"]
    }),

    makeCard("O36", 1, {
      version: "1.1.0",
      topic: "Bildirim Sistemi Modelleme",
      difficulty: "hard",
      type: "match",
      prompt: "Bildirim sistemindeki verileri ve davranışları en uygun sahibine eşleştirin.",
      pairs: {
        left: [
          { id: "messageBody", text: "Başlık ve mesaj gövdesi" },
          { id: "emailValidation", text: "E-posta adresi biçim doğrulaması" },
          { id: "smsValidation", text: "Telefon numarası ve SMS uzunluk doğrulaması" },
          { id: "pushValidation", text: "Cihaz token'ı doğrulaması" }
        ],
        right: [
          { id: "Message", text: "Message value object" },
          { id: "EmailChannel", text: "EmailChannel" },
          { id: "SmsChannel", text: "SmsChannel" },
          { id: "PushChannel", text: "PushChannel" },
          { id: "decoy", text: "NotificationService içinde tek büyük switch" }
        ]
      },
      answer: {
        messageBody: "Message",
        emailValidation: "EmailChannel",
        smsValidation: "SmsChannel",
        pushValidation: "PushChannel"
      },
      hint: "Kanaldan bağımsız veri ile kanalın hedef/taşıma kurallarını ayırın.",
      explanationShort: "Ortak içerik Message'da, hedefe özgü doğrulama ve gönderim ilgili channel'da tutulur.",
      explanationLong: "NotificationService bir NotificationChannel sözleşmesine delegasyon yapabilir. Email, SMS ve push implementasyonları kendi adresleme kısıtlarını ve sağlayıcı entegrasyonlarını kapsüller.",
      tags: ["notification", "modeling", "strategy", "responsibility"]
    }),

    makeCard("O36", 2, {
      topic: "Bildirim Sistemi Modelleme",
      difficulty: "hard",
      type: "multi",
      prompt: "E-posta, SMS ve push kanalları için sağlam sorumluluk dağılımını seçin.",
      options: [
        { id: "commonContract", text: "Kanallar send(Message, Recipient) benzeri ortak bir sözleşme uygular." },
        { id: "channelRules", text: "Her kanal kendi hedef biçimini ve kanal limitlerini doğrular." },
        { id: "orchestrator", text: "NotificationService kanal seçimi/orkestrasyon yapar, sağlayıcı ayrıntısını kanala bırakır." },
        { id: "oneHuge", text: "Tüm doğrulama ve gönderim koşulları tek dev static metoda konur." }
      ],
      answer: ["commonContract", "channelRules", "orchestrator"],
      hint: "Ortak kullanım biçimini korurken değişen ayrıntıları ilgili sınıfta tutun.",
      explanationShort: "Ortak channel sözleşmesi ile kanala özgü doğrulama/gönderim ayrılmalıdır.",
      explanationLong: "Bu dağılım yeni kanal eklemeyi kolaylaştırır ve her entegrasyonu izole test edilebilir kılar. Büyük koşul metodu birden fazla değişim nedenini birleştirir.",
      optionExplanations: {
        commonContract: "Doğru: istemci kanalları polymorphic kullanır.",
        channelRules: "Doğru: kanal invariant'ı ilgili implementasyonda yaşar.",
        orchestrator: "Doğru: akış ile teknik gönderim ayrıntısı ayrılır.",
        oneHuge: "Yanlış: düşük cohesion ve büyüyen koşullar üretir."
      },
      assumptions: ["Recipient, kanal hedeflerini tür güvenli biçimde sağlayan bir model veya kanal özel value object'leriyle temsil edilir."],
      tags: ["notification", "polymorphism", "cohesion"]
    }),

    makeCard("O37", 1, {
      topic: "Kütüphane Sistemi Modelleme",
      difficulty: "hard",
      type: "single",
      prompt: "Aynı ISBN'e ait üç fiziksel kopyanın farklı barkod, konum ve ödünç durumları varsa en uygun model hangisidir?",
      options: [
        { id: "a", text: "Bibliyografik bilgi için Book, her fiziksel örnek için BookCopy nesnesi" },
        { id: "b", text: "Üç kopyayı tek boolean available alanıyla tek Book nesnesinde temsil etmek" },
        { id: "c", text: "Her ödünçte ISBN metnini değiştirerek kopyayı ayırt etmek" },
        { id: "d", text: "Book sınıfını Member sınıfından kalıtmak" }
      ],
      answer: "a",
      hint: "Paylaşılan eser kimliği ile tek tek izlenen envanter örneğini ayırın.",
      explanationShort: "Book eseri, BookCopy ise ayrı fiziksel envanter örneğini temsil etmelidir.",
      explanationLong: "Kopyalar bağımsız barkod, konum ve durum taşır. Loan belirli BookCopy ile Member'ı bağlar; Reservation çoğu modelde eser düzeyinde uygun bir sonraki kopyayı bekleyebilir.",
      optionExplanations: {
        a: "Doğru: ortak metadata ile kopya state'i ayrılır.",
        b: "Tek boolean üç bağımsız kopyanın durumunu ifade edemez.",
        c: "ISBN eser kimliğidir; kopya kimliği olarak değiştirilmez.",
        d: "Book ile Member arasında is-a ilişkisi yoktur."
      },
      tags: ["library", "modeling", "entity", "book-copy"]
    }),

    makeCard("O37", 2, {
      version: "1.1.0",
      topic: "Kütüphane Sistemi Modelleme",
      difficulty: "hard",
      type: "match",
      prompt: "Kütüphane alanındaki sorumlulukları uygun nesneyle eşleştirin.",
      pairs: {
        left: [
          { id: "metadata", text: "ISBN, başlık ve yazar bilgisi" },
          { id: "copyState", text: "Barkod, raf ve AVAILABLE/LOANED durumu" },
          { id: "loanDates", text: "Ödünç alan üye, alış tarihi ve son iade tarihi" },
          { id: "lateFee", text: "Gecikme gününden ücret hesaplama politikası" }
        ],
        right: [
          { id: "Book", text: "Book" },
          { id: "BookCopy", text: "BookCopy" },
          { id: "Loan", text: "Loan" },
          { id: "LateFeePolicy", text: "LateFeePolicy" },
          { id: "decoy", text: "Member" }
        ]
      },
      answer: {
        metadata: "Book",
        copyState: "BookCopy",
        loanDates: "Loan",
        lateFee: "LateFeePolicy"
      },
      hint: "Varlık state'i, ilişki state'i ve değişebilen hesaplama politikasını ayırın.",
      explanationShort: "Eser, fiziksel kopya, ödünç işlemi ve ücret politikası ayrı sorumluluklardır.",
      explanationLong: "Loan belirli bir Member ile BookCopy arasındaki zamanlı ilişkiyi modeller. LateFeePolicy composition ile değişen ceza kurallarını Loan/Service sınıfından ayırır.",
      tags: ["library", "modeling", "composition", "policy"]
    }),

    makeCard("O38", 1, {
      topic: "Sipariş Durum Modelleme",
      difficulty: "hard",
      type: "order",
      prompt: "Başarılı bir siparişin normal yaşam döngüsü durumlarını sıralayın.",
      items: [
        { id: "CREATED", text: "CREATED" },
        { id: "PAID", text: "PAID" },
        { id: "PREPARING", text: "PREPARING" },
        { id: "SHIPPED", text: "SHIPPED" }
      ],
      answer: ["CREATED", "PAID", "PREPARING", "SHIPPED"],
      hint: "Ödeme hazırlıktan, hazırlık kargodan önce gelir.",
      explanationShort: "Normal sıra CREATED → PAID → PREPARING → SHIPPED biçimindedir.",
      explanationLong: "Durum geçişleri Order içindeki davranış metotları veya ayrı bir transition policy tarafından doğrulanmalıdır. State alanını kuralsız setter ile açmak sıralamayı atlanabilir kılar.",
      assumptions: [
        "Başarılı akışta iptal veya ödeme hatası yoktur.",
        "Teslim edildi durumu bu kaynak senaryonun kapsamına dahil edilmemiştir."
      ],
      tags: ["order", "state-machine", "lifecycle"]
    }),

    makeCard("O38", 2, {
      topic: "Sipariş Durum Modelleme",
      difficulty: "hard",
      type: "boolean",
      prompt: "Sözleşme yalnız CREATED ve PAID durumlarında iptale izin veriyorsa SHIPPED durumundaki cancel() çağrısı state'i değiştirmeden reddedilmelidir.",
      answer: true,
      hint: "Geçiş tablosunda SHIPPED → CANCELLED oku bulunmuyor.",
      explanationShort: "Doğru. Geçersiz geçiş engellenmeli ve sipariş SHIPPED kalmalıdır.",
      explanationLong: "Order kendi state machine invariant'ını korur. Geçersiz geçiş exception veya başarısız sonuçla bildirilebilir; önemli olan state'in kuralsız değiştirilmemesidir.",
      optionExplanations: {
        true: "Doğru: tanımlı geçiş sözleşmesi SHIPPED iptalini yasaklar.",
        false: "Yanlış: her durumdan iptal, verilen geçiş sözleşmesine aykırıdır."
      },
      assumptions: ["İzin verilen iptal başlangıç durumları açıkça yalnız CREATED ve PAID'dir."],
      tags: ["order", "state-machine", "invariant", "cancellation"]
    }),

    makeCard("O39", 1, {
      version: "1.1.0",
      topic: "Otopark Sistemi Modelleme",
      difficulty: "hard",
      type: "match",
      prompt: "Otopark sistemi sorumluluklarını uygun bileşenle eşleştirin.",
      pairs: {
        left: [
          { id: "vehicleData", text: "Plaka ve araç türü" },
          { id: "spotFit", text: "Park yerinin araç boyutunu kabul edip etmediği" },
          { id: "assignment", text: "Uygun boş yeri seçip işgal etmek" },
          { id: "fee", text: "Süre ve araç türüne göre ücret hesaplamak" }
        ],
        right: [
          { id: "Vehicle", text: "Vehicle" },
          { id: "ParkingSpot", text: "ParkingSpot.canFit(vehicle)" },
          { id: "ParkingLotService", text: "ParkingLotService" },
          { id: "FeePolicy", text: "FeePolicy" },
          { id: "decoy", text: "Vehicle.parkSelf()" }
        ]
      },
      answer: {
        vehicleData: "Vehicle",
        spotFit: "ParkingSpot",
        assignment: "ParkingLotService",
        fee: "FeePolicy"
      },
      hint: "Varlık bilgisi, yer invariant'ı, orkestrasyon ve değişen fiyat politikasını ayırın.",
      explanationShort: "Vehicle veri taşır, ParkingSpot uygunluğu korur, servis atar, FeePolicy ücreti hesaplar.",
      explanationLong: "EntryTicket giriş zamanı, araç ve park yeri bağını kaydedebilir. Çıkış akışı ticket'ı kullanıp FeePolicy'ye delegasyon yapar ve yeri tekrar boşaltır.",
      tags: ["parking-lot", "modeling", "strategy", "responsibility"]
    }),

    makeCard("O39", 2, {
      topic: "Otopark Sistemi Modelleme",
      difficulty: "hard",
      type: "single",
      prompt: "Yer boyutları SMALL < MEDIUM < LARGE, araç gereksinimleri motosiklet=SMALL, otomobil=MEDIUM, kamyon=LARGE ve politika 'uygun en küçük boş yeri seç' ise bir otomobil hangi yere atanır?",
      options: [
        { id: "a", text: "Boş MEDIUM yer varsa MEDIUM yere" },
        { id: "b", text: "Her zaman SMALL yere" },
        { id: "c", text: "MEDIUM boş olsa bile her zaman LARGE yere" },
        { id: "d", text: "Araç türünden bağımsız rastgele bir yere" }
      ],
      answer: "a",
      hint: "Otomobil en az MEDIUM ister ve politika en küçük uygun yeri seçer.",
      explanationShort: "MEDIUM boşsa otomobil için uygun en küçük yer MEDIUM'dur.",
      explanationLong: "SMALL fiziksel gereksinimi karşılamaz; LARGE uygundur ancak daha küçük araçlar için kaynak verimliliğini düşürür. Açık politika deterministik atama sağlar.",
      optionExplanations: {
        a: "Doğru: gereksinimi karşılayan en küçük boş boyuttur.",
        b: "SMALL otomobil için yetersizdir.",
        c: "Verilen en küçük uygun yer politikasına aykırıdır.",
        d: "Politika rastgele seçim yapmaz."
      },
      assumptions: ["En az bir boş MEDIUM ve bir boş LARGE yer vardır; yerler aynı konum önceliğindedir."],
      tags: ["parking-lot", "allocation-policy", "deterministic"]
    }),

    makeCard("O40", 1, {
      topic: "Bordro Sistemi Modelleme",
      difficulty: "hard",
      type: "output",
      prompt: "Polymorphic grossPay çağrılarının toplam çıktısı nedir?",
      code: "interface Employee {\n    double grossPay();\n}\nclass HourlyEmployee implements Employee {\n    private final double hours, rate;\n    HourlyEmployee(double hours, double rate) { this.hours = hours; this.rate = rate; }\n    public double grossPay() { return hours * rate; }\n}\nclass SalariedEmployee implements Employee {\n    private final double monthlySalary;\n    SalariedEmployee(double monthlySalary) { this.monthlySalary = monthlySalary; }\n    public double grossPay() { return monthlySalary; }\n}\n\nEmployee[] employees = {\n    new HourlyEmployee(10.0, 20.0),\n    new SalariedEmployee(1000.0)\n};\ndouble total = 0;\nfor (Employee employee : employees) total += employee.grossPay();\nSystem.out.println(total);",
      answer: "1200.0",
      acceptedAnswers: ["1200.0", "1200"],
      caseSensitive: true,
      hint: "Saatlik ücret 10 × 20; maaşlı ücret 1000.",
      explanationShort: "Saatlik 200.0 ve maaşlı 1000.0 toplamı 1200.0'dır.",
      explanationLong: "Döngü Employee sözleşmesine çağrı yapar; çalışma zamanı türü her ücret algoritmasını seçer. Komisyonlu çalışan aynı sözleşmeyle yeni bir uygulama olabilir.",
      assumptions: ["Fazla mesai, para yuvarlama ve vergi bu brüt ücret örneğinin kapsamı dışındadır."],
      tags: ["payroll", "polymorphism", "output"]
    }),

    makeCard("O40", 2, {
      version: "1.1.0",
      topic: "Bordro Sistemi Modelleme",
      difficulty: "hard",
      type: "match",
      prompt: "Bordro tasarımındaki değişen davranışları uygun mekanizma veya bileşenle eşleştirin.",
      pairs: {
        left: [
          { id: "hourlyGross", text: "Saat × saatlik ücret brüt hesaplama" },
          { id: "salaryGross", text: "Aylık sabit brüt ücret hesaplama" },
          { id: "commissionGross", text: "Taban ücret + satış komisyonu hesaplama" },
          { id: "tax", text: "Çalışan türünden bağımsız değişebilen vergi kuralı" },
          { id: "bonus", text: "Kampanyaya göre değişebilen prim kuralı" }
        ],
        right: [
          { id: "HourlyEmployee", text: "HourlyEmployee.grossPay()" },
          { id: "SalariedEmployee", text: "SalariedEmployee.grossPay()" },
          { id: "CommissionEmployee", text: "CommissionEmployee.grossPay()" },
          { id: "TaxPolicy", text: "TaxPolicy composition" },
          { id: "BonusPolicy", text: "BonusPolicy composition" },
          { id: "decoy", text: "Employee.calculateTax() override'ı" }
        ]
      },
      answer: {
        hourlyGross: "HourlyEmployee",
        salaryGross: "SalariedEmployee",
        commissionGross: "CommissionEmployee",
        tax: "TaxPolicy",
        bonus: "BonusPolicy"
      },
      hint: "Çalışan türüne özgü ücret formülünü polymorphism'e, bağımsız politikaları composition'a verin.",
      explanationShort: "Brüt ücret alt tür davranışıdır; vergi ve prim ayrı policy nesneleri olarak bileşimle kullanılır.",
      explanationLong: "Employee.grossPay farklı çalışan türlerince uygulanır. Vergi ve prim eksenleri çalışan hiyerarşisinden bağımsız değiştiği için TaxPolicy ve BonusPolicy collaborator'ları kombinasyon patlamasını önler.",
      tags: ["payroll", "polymorphism", "composition", "policy"]
    })
  ];
}());
