/* Generated from the read-only source Markdown. Do not hand-edit. */
window.SOURCE_BANK_META = Object.freeze({
  "title": "Yeni Mezun Java–OOP–Algoritma Teknik Mülakat Soru Bankası",
  "version": "2026-07-17-v1",
  "sourceSha256": "0f0846a1e36ed9f9a1d528f17e49e08e80b0139cb06e1505b735a440b84af06c",
  "sourceQuestionCount": 135
});
window.SOURCE_QUESTIONS = Object.freeze({
  "J01": {
    "id": "J01",
    "descriptor": "Kolay · Teori",
    "prompt": "Java’daki sekiz primitive veri tipini sayın. Her birinin hangi tür değerleri temsil ettiğini ve değişken tanımlama ile değer atama arasındaki farkı açıklayın."
  },
  "J02": {
    "id": "J02",
    "descriptor": "Kolay · Hata bulma",
    "prompt": "Aşağıdaki kod derlenir mi? Yerel değişkenlerle instance değişkenlerinin başlangıç değerleri arasındaki farkı açıklayın.\n\n```java\nclass Demo {\n    int field;\n\n    void printValues() {\n        int local;\n        System.out.println(field);\n        System.out.println(local);\n    }\n}\n```"
  },
  "J03": {
    "id": "J03",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "Çıktıyı tahmin edin. Primitive ve reference type atamalarının sonuçlarını açıklayın.\n\n```java\nint a = 10;\nint b = a;\nb = 20;\n\nint[] first = {1, 2};\nint[] second = first;\nsecond[0] = 99;\n\nSystem.out.println(a);\nSystem.out.println(first[0]);\n```"
  },
  "J04": {
    "id": "J04",
    "descriptor": "Kolay · Teori",
    "prompt": "Primitive type ile reference type arasındaki farkları; saklanan değer, `null` alabilme, karşılaştırma ve metot çağrısı açısından açıklayın."
  },
  "J05": {
    "id": "J05",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "Aşağıdaki ifadelerin sonucunu ve sonuç tipini belirtin.\n\n```java\nint a = 7;\nint b = 2;\n\nSystem.out.println(a / b);\nSystem.out.println(a % b);\nSystem.out.println((double) a / b);\n```"
  },
  "J06": {
    "id": "J06",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "Prefix ve postfix artırma operatörlerinin farkını açıklayın.\n\n```java\nint x = 5;\nint y = x++;\nint z = ++x;\n\nSystem.out.println(x + \" \" + y + \" \" + z);\n```"
  },
  "J07": {
    "id": "J07",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "Aşağıdaki koşul neden güvenlidir? `&&` yerine `&` kullanılırsa ne değişebilir?\n\n```java\nString username = null;\n\nif (username != null && username.length() >= 3) {\n    System.out.println(\"Geçerli\");\n}\n```"
  },
  "J08": {
    "id": "J08",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "Bir öğrencinin notunu alan ve `0–49`, `50–69`, `70–84`, `85–100` aralıklarına göre sonuç metni döndüren bir metot yazın. `0`–`100` dışındaki değerleri de ele alın."
  },
  "J09": {
    "id": "J09",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "Çıktıyı tahmin edin ve `break` kullanılmayan `switch` bloklarının davranışını açıklayın.\n\n```java\nint day = 2;\n\nswitch (day) {\n    case 1:\n        System.out.print(\"Pazartesi \");\n    case 2:\n        System.out.print(\"Salı \");\n    case 3:\n        System.out.print(\"Çarşamba \");\n        break;\n    default:\n        System.out.print(\"Geçersiz\");\n}\n```"
  },
  "J10": {
    "id": "J10",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "Döngünün hangi sayıları yazdıracağını bulun. `continue` ve `break` arasındaki farkı açıklayın.\n\n```java\nfor (int i = 0; i < 10; i++) {\n    if (i % 2 == 0) {\n        continue;\n    }\n    if (i > 6) {\n        break;\n    }\n    System.out.print(i + \" \");\n}\n```"
  },
  "J11": {
    "id": "J11",
    "descriptor": "Kolay · Hata bulma",
    "prompt": "Sorunu bulun ve düzeltin.\n\n```java\nint[] numbers = {10, 20, 30};\n\nfor (int i = 0; i <= numbers.length; i++) {\n    System.out.println(numbers[i]);\n}\n```"
  },
  "J12": {
    "id": "J12",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "İki `int` parametre alan ve büyük olan değeri döndüren `max` metodunu yazın. Metot imzasını oluşturan parçaları açıklayın."
  },
  "J13": {
    "id": "J13",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "Çağrıdan sonra `a` ve `b` değerlerini tahmin edin. Java’nın parametre geçirme modelini açıklayın.\n\n```java\nstatic void swap(int x, int y) {\n    int temp = x;\n    x = y;\n    y = temp;\n}\n\nint a = 3;\nint b = 8;\nswap(a, b);\n\nSystem.out.println(a + \" \" + b);\n```"
  },
  "J14": {
    "id": "J14",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "Sonucu tahmin edin ve `String` nesnelerinin immutable olmasıyla ilişkilendirin.\n\n```java\nString text = \"Java\";\ntext.concat(\" Mülakatı\");\n\nSystem.out.println(text);\n```"
  },
  "J15": {
    "id": "J15",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "Karşılaştırmaların sonuçlarını tahmin edin. `==` ve `equals()` arasındaki farkı açıklayın.\n\n```java\nString first = new String(\"java\");\nString second = new String(\"java\");\n\nSystem.out.println(first == second);\nSystem.out.println(first.equals(second));\n```"
  },
  "J16": {
    "id": "J16",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "`{\"Java\", \"OOP\", \"Algoritma\"}` dizisini `StringBuilder` kullanarak virgülle ayrılmış tek bir metne dönüştürün. `StringBuilder` tercihinin gerekçesini açıklamaya hazırlanın."
  },
  "J17": {
    "id": "J17",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "Enhanced `for` döngüsünden sonra dizi değişir mi?\n\n```java\nint[] numbers = {1, 2, 3};\n\nfor (int number : numbers) {\n    number *= 2;\n}\n\nSystem.out.println(Arrays.toString(numbers));\n```"
  },
  "J18": {
    "id": "J18",
    "descriptor": "Kolay · Teori",
    "prompt": "`public`, `protected`, package-private ve `private` erişim seviyelerini aynı sınıf, aynı paket, alt sınıf ve farklı paket açısından karşılaştırın."
  },
  "J19": {
    "id": "J19",
    "descriptor": "Orta · Hata bulma",
    "prompt": "Aşağıdaki sınıfın neden derlenmediğini açıklayın. `static` üyeler ile instance üyeleri arasındaki farkı belirtin.\n\n```java\nclass Counter {\n    int value = 10;\n\n    static void printValue() {\n        System.out.println(value);\n        System.out.println(this.value);\n    }\n}\n```"
  },
  "J20": {
    "id": "J20",
    "descriptor": "Orta · Teori",
    "prompt": "`final` bir değişken, metot ve sınıf için ne ifade eder? `final` bir referansın gösterdiği nesne yine de değiştirilebilir mi?"
  },
  "J21": {
    "id": "J21",
    "descriptor": "Orta · Kod okuma",
    "prompt": "Constructor çağrı sırasını açıklayın. `this`, `this(...)`, `super` ve `super(...)` kullanımlarının amaçları nelerdir?\n\n```java\nclass Person {\n    Person(String name) {\n        System.out.println(\"Person: \" + name);\n    }\n}\n\nclass Developer extends Person {\n    Developer() {\n        super(\"Ayşe\");\n        System.out.println(\"Developer\");\n    }\n}\n\nnew Developer();\n```"
  },
  "J22": {
    "id": "J22",
    "descriptor": "Orta · Hata bulma",
    "prompt": "Geçerli overload’ları ve derleme hatası oluşturan metodu bulun.\n\n```java\nclass Calculator {\n    int sum(int a, int b) {\n        return a + b;\n    }\n\n    double sum(double a, double b) {\n        return a + b;\n    }\n\n    long sum(int a, int b) {\n        return a + b;\n    }\n}\n```"
  },
  "J23": {
    "id": "J23",
    "descriptor": "Orta · Kod okuma",
    "prompt": "Çıktıyı tahmin edin. Overriding, referans tipi ve çalışma zamanındaki nesne tipi arasındaki ilişkiyi açıklayın.\n\n```java\nclass Animal {\n    void speak() {\n        System.out.println(\"Animal\");\n    }\n}\n\nclass Dog extends Animal {\n    @Override\n    void speak() {\n        System.out.println(\"Dog\");\n    }\n}\n\nAnimal animal = new Dog();\nanimal.speak();\n```"
  },
  "J24": {
    "id": "J24",
    "descriptor": "Orta · Teori",
    "prompt": "Java Collections Framework’ün amacını açıklayın. `Collection`, `Collections` ve `Map` kavramlarının farkı nedir?"
  },
  "J25": {
    "id": "J25",
    "descriptor": "Orta · Teori",
    "prompt": "Şu ihtiyaçlar için uygun yapıyı seçin: eklenme sırasıyla görev saklama, benzersiz e-posta adresleri tutma ve kullanıcı kimliğinden kullanıcı bilgisine erişme. `List`, `Set` ve `Map` tercihlerinizi gerekçelendirin."
  },
  "J26": {
    "id": "J26",
    "descriptor": "Orta · Teori",
    "prompt": "`ArrayList` ile `LinkedList` yapılarını indeksle erişim, ekleme-silme, bellek kullanımı ve gerçek uygulamalardaki performans açısından karşılaştırın."
  },
  "J27": {
    "id": "J27",
    "descriptor": "Orta · Kod okuma",
    "prompt": "Aşağıdaki koleksiyonun boyutunu değerlendirin. Sonucun `equals()` ve `hashCode()` ile ilişkisini açıklayın.\n\n```java\nclass Employee {\n    int id;\n\n    Employee(int id) {\n        this.id = id;\n    }\n}\n\nSet<Employee> employees = new HashSet<>();\nemployees.add(new Employee(10));\nemployees.add(new Employee(10));\n\nSystem.out.println(employees.size());\n```"
  },
  "J28": {
    "id": "J28",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Bir sipariş listesini müşteri kimliğine göre gruplandıran ve `Map<Integer, List<Order>>` döndüren bir metot tasarlayın."
  },
  "J29": {
    "id": "J29",
    "descriptor": "Orta · Teori",
    "prompt": "`HashMap` içinde bir anahtar-değer çifti eklenirken ve aranırken hangi adımlar gerçekleşir? Hash değeri, bucket, collision, `equals()`, kapasite ve yeniden boyutlandırma kavramlarını açıklayın."
  },
  "J30": {
    "id": "J30",
    "descriptor": "Orta · Kod okuma",
    "prompt": "Kontrol akışını ve çıktıyı tahmin edin.\n\n```java\nstatic int calculate() {\n    try {\n        return 10 / 0;\n    } catch (ArithmeticException e) {\n        System.out.println(\"catch\");\n        return -1;\n    } finally {\n        System.out.println(\"finally\");\n    }\n}\n\nSystem.out.println(calculate());\n```"
  },
  "J31": {
    "id": "J31",
    "descriptor": "Orta · Hata bulma",
    "prompt": "Metot neden doğrudan derlenmeyebilir? Checked ve unchecked exception ayrımını kullanarak açıklayın.\n\n```java\nstatic String readFirstLine(String path) {\n    BufferedReader reader =\n            new BufferedReader(new FileReader(path));\n\n    return reader.readLine();\n}\n```"
  },
  "J32": {
    "id": "J32",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Geçersiz yaş bilgisi için `InvalidAgeException` tasarlayın. Bunun checked mı unchecked mı olacağına karar verin; exception’ı `throw` ile üretip gerekiyorsa `throws` ile bildiren metodu yazın ve kararlarınızı gerekçelendirin."
  },
  "J33": {
    "id": "J33",
    "descriptor": "Orta · Teori",
    "prompt": "Interface ile abstract class arasındaki temel farklar nelerdir? Ortak davranış sözleşmesi, ortak durum, constructor, çoklu kalıtım ihtiyacı ve genişletilebilirlik açısından hangisini ne zaman tercih edersiniz?"
  },
  "J34": {
    "id": "J34",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Herhangi bir türde değer saklayabilen `Box<T>` generic sınıfını yazın. Sınıfı `String` ve `Integer` ile kullanın."
  },
  "J35": {
    "id": "J35",
    "descriptor": "Orta · Hata bulma",
    "prompt": "Raw type kullanımından doğan problemi bulun ve kodu tip güvenli hâle getirin.\n\n```java\nList values = new ArrayList();\nvalues.add(\"Java\");\nvalues.add(42);\n\nString first = (String) values.get(1);\n```"
  },
  "J36": {
    "id": "J36",
    "descriptor": "Orta · Hata bulma",
    "prompt": "Listeyi dolaşırken eleman silmenin neden sorun çıkarabileceğini açıklayın ve güvenli bir çözüm yazın.\n\n```java\nList<String> names =\n        new ArrayList<>(Arrays.asList(\"Ali\", \"Ayşe\", \"Ahmet\"));\n\nfor (String name : names) {\n    if (name.startsWith(\"A\")) {\n        names.remove(name);\n    }\n}\n```"
  },
  "J37": {
    "id": "J37",
    "descriptor": "Zorlayıcı · Generics",
    "prompt": "`List<? extends Number>` ile `List<? super Integer>` arasındaki farkı açıklayın. Hangi yapıya güvenle veri eklenebileceğini ve hangisinden hangi tipte veri okunabileceğini kod üzerinden gösterin."
  },
  "J38": {
    "id": "J38",
    "descriptor": "Zorlayıcı · Kod okuma",
    "prompt": "Değişkenlerin, referansların ve nesnelerin stack veya heap ile ilişkisini açıklayın.\n\n```java\nclass User {\n    String name;\n}\n\nstatic void createUser() {\n    int age = 22;\n    User user = new User();\n    user.name = \"Deniz\";\n}\n```"
  },
  "J39": {
    "id": "J39",
    "descriptor": "Zorlayıcı · Kod okuma",
    "prompt": "Hangi nesnelerin Garbage Collector için uygun hâle geldiğini “ulaşılabilirlik” kavramıyla açıklayın.\n\n```java\nObject first = new Object();\nObject second = new Object();\n\nfirst = second;\nsecond = null;\n```"
  },
  "J40": {
    "id": "J40",
    "descriptor": "Zorlayıcı · Kod yazma",
    "prompt": "`Candidate` nesnelerinin yalnızca `id` alanına göre eşit kabul edilmesini sağlayan `equals()` ve `hashCode()` metotlarını yazın. Sözleşmenin bozulmasının `HashSet` ve `HashMap` üzerindeki etkisini açıklayın."
  },
  "J41": {
    "id": "J41",
    "descriptor": "Zorlayıcı · Kod okuma",
    "prompt": "Bir `HashMap` anahtarı eklendikten sonra eşitlikte kullanılan alanının değiştirilmesi aramayı nasıl etkileyebilir?\n\n```java\nclass Key {\n    int id;\n\n    Key(int id) {\n        this.id = id;\n    }\n\n    // equals() ve hashCode() id alanını kullanıyor.\n}\n\nKey key = new Key(1);\nMap<Key, String> map = new HashMap<>();\nmap.put(key, \"value\");\n\nkey.id = 2;\nSystem.out.println(map.get(key));\n```"
  },
  "J42": {
    "id": "J42",
    "descriptor": "Zorlayıcı · Kod yazma",
    "prompt": "`String name` ve `List<String> roles` alanlarına sahip gerçekten immutable bir `User` sınıfı tasarlayın. Mutable listenin dışarıdan değiştirilmesini engelleyin."
  },
  "J43": {
    "id": "J43",
    "descriptor": "Zorlayıcı · Kod okuma",
    "prompt": "`run()` ve `start()` çağrıları arasındaki farkı açıklayın.\n\n```java\nThread worker = new Thread(() ->\n        System.out.println(Thread.currentThread().getName())\n);\n\nworker.run();\nworker.start();\n```"
  },
  "J44": {
    "id": "J44",
    "descriptor": "Zorlayıcı · Hata bulma",
    "prompt": "İki thread aynı sayacı artırdığında sonuç neden beklenenden farklı olabilir? Race condition’ı ve temel çözüm seçeneklerini açıklayın.\n\n```java\nclass Counter {\n    int value = 0;\n\n    void increment() {\n        value++;\n    }\n}\n```"
  },
  "J45": {
    "id": "J45",
    "descriptor": "Zorlayıcı · Kod inceleme",
    "prompt": "Deadlock riskini değerlendirin. Riski azaltacak bir kilitleme yaklaşımı önerin.\n\n```java\nObject lockA = new Object();\nObject lockB = new Object();\n\nThread first = new Thread(() -> {\n    synchronized (lockA) {\n        synchronized (lockB) {\n            System.out.println(\"First\");\n        }\n    }\n});\n\nThread second = new Thread(() -> {\n    synchronized (lockB) {\n        synchronized (lockA) {\n            System.out.println(\"Second\");\n        }\n    }\n});\n\nfirst.start();\nsecond.start();\n```"
  },
  "O01": {
    "id": "O01",
    "descriptor": "Kolay · Teori",
    "prompt": "Class ile object arasındaki fark nedir? `Car` örneğinde hangisi şablon, hangisi çalışma zamanında oluşturulan örnektir?"
  },
  "O02": {
    "id": "O02",
    "descriptor": "Kolay · Teori",
    "prompt": "Bir nesnenin state ve behavior özellikleri ne anlama gelir? Bir `BankAccount` nesnesi için örnekler verin."
  },
  "O03": {
    "id": "O03",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "İki referansın aynı nesneyi göstermesi kodun sonucunu nasıl etkiler?\n\n```java\nclass Counter {\n    int value;\n}\n\nCounter a = new Counter();\na.value = 5;\n\nCounter b = a;\nb.value++;\n\nSystem.out.println(a.value);\nSystem.out.println(a == b);\n```"
  },
  "O04": {
    "id": "O04",
    "descriptor": "Kolay · Teori",
    "prompt": "Constructor nedir ve normal bir metottan hangi yönleriyle ayrılır? Bir sınıfta constructor yazılmazsa ne olur?"
  },
  "O05": {
    "id": "O05",
    "descriptor": "Kolay · Hata bulma",
    "prompt": "Kod neden derlenir veya derlenmez? Hem parametresiz hem isim alan nesneler oluşturmak için sınıfı düzenleyin.\n\n```java\nclass User {\n    User(String name) {\n        System.out.println(name);\n    }\n}\n\nUser user = new User();\n```"
  },
  "O06": {
    "id": "O06",
    "descriptor": "Kolay · Teori",
    "prompt": "Encapsulation nedir? Alanları `private` yapıp otomatik getter ve setter eklemek neden her zaman yeterli değildir?"
  },
  "O07": {
    "id": "O07",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "Bakiyesi dışarıdan doğrudan değiştirilemeyen bir `BankAccount` sınıfı yazın. Para yatırma ve çekme kurallarını nesnenin içinde koruyun."
  },
  "O08": {
    "id": "O08",
    "descriptor": "Kolay · Teori",
    "prompt": "Inheritance hangi problemi çözebilir? “Is-a” ilişkisini kullanarak uygun ve uygun olmayan birer kalıtım örneği verin."
  },
  "O09": {
    "id": "O09",
    "descriptor": "Kolay · Teori",
    "prompt": "Method overloading nedir? Aynı işlemin farklı parametrelerle sunulmasının yararlı ve kafa karıştırıcı olabileceği durumlara örnek verin."
  },
  "O10": {
    "id": "O10",
    "descriptor": "Kolay · Teori",
    "prompt": "Method overriding nedir? Alt sınıfın üst sınıf davranışını değiştirmesi gereken bir senaryo anlatın."
  },
  "O11": {
    "id": "O11",
    "descriptor": "Kolay · Teori",
    "prompt": "Polymorphism nedir? Farklı ödeme yöntemlerinin tek bir ortak tip üzerinden kullanılmasını örnek göstererek açıklayın."
  },
  "O12": {
    "id": "O12",
    "descriptor": "Kolay · Teori",
    "prompt": "Abstraction ile encapsulation arasındaki farkı bir ödeme sistemi üzerinden açıklayın."
  },
  "O13": {
    "id": "O13",
    "descriptor": "Kolay · Teori",
    "prompt": "Interface ve abstract class ne amaçla kullanılır? Her biri için uygun birer kullanım örneği verin."
  },
  "O14": {
    "id": "O14",
    "descriptor": "Orta · Modelleme",
    "prompt": "Öğrencilerin birden fazla derse, derslerin de birden fazla öğrenciye sahip olduğu üniversite kayıt sistemini modelleyin. Temel sınıfları, sorumlulukları ve ilişkileri belirtin."
  },
  "O15": {
    "id": "O15",
    "descriptor": "Orta · Kod okuma",
    "prompt": "Constructor çağrı sırasını bulun.\n\n```java\nclass A {\n    A() {\n        System.out.println(\"A\");\n    }\n}\n\nclass B extends A {\n    B() {\n        System.out.println(\"B\");\n    }\n}\n\nclass C extends B {\n    C() {\n        System.out.println(\"C\");\n    }\n}\n\nnew C();\n```"
  },
  "O16": {
    "id": "O16",
    "descriptor": "Orta · Hata bulma",
    "prompt": "Alt sınıf constructor’ındaki sorunu bulun ve düzeltin.\n\n```java\nclass Person {\n    Person(String name) {\n    }\n}\n\nclass Employee extends Person {\n    Employee(int id) {\n    }\n}\n```"
  },
  "O17": {
    "id": "O17",
    "descriptor": "Orta · Hata bulma",
    "prompt": "Constructor zincirindeki problemi bulun. `this(...)` kullanım kurallarına uygun şekilde yeniden düzenleyin.\n\n```java\nclass Product {\n    Product() {\n        this(\"Unknown\");\n    }\n\n    Product(String name) {\n        this();\n    }\n}\n```"
  },
  "O18": {
    "id": "O18",
    "descriptor": "Orta · Kod okuma",
    "prompt": "Referansın bildirilen tipi ile çalışma zamanı tipi hangi davranışları belirler?\n\n```java\nclass Vehicle {\n    void start() {\n        System.out.println(\"Vehicle started\");\n    }\n}\n\nclass Car extends Vehicle {\n    @Override\n    void start() {\n        System.out.println(\"Car started\");\n    }\n\n    void openTrunk() {\n        System.out.println(\"Trunk opened\");\n    }\n}\n\nVehicle vehicle = new Car();\nvehicle.start();\nvehicle.openTrunk();\n```"
  },
  "O19": {
    "id": "O19",
    "descriptor": "Orta · Hata bulma",
    "prompt": "Overriding sırasında dönüş tipi ve erişim seviyesi bakımından yapılan hatayı bulun.\n\n```java\nclass Parent {\n    public Number getValue() {\n        return 1;\n    }\n}\n\nclass Child extends Parent {\n    @Override\n    protected Integer getValue() {\n        return 2;\n    }\n}\n```"
  },
  "O20": {
    "id": "O20",
    "descriptor": "Orta · Kod okuma",
    "prompt": "Çağrıların hangi overload’a yönleneceğini bulun. Overload seçiminin ne zaman yapıldığını açıklayın.\n\n```java\nclass Printer {\n    void print(Object value) {\n        System.out.println(\"Object\");\n    }\n\n    void print(String value) {\n        System.out.println(\"String\");\n    }\n}\n\nPrinter printer = new Printer();\nString text = null;\nObject object = text;\n\nprinter.print(text);\nprinter.print(object);\nprinter.print(null);\n```"
  },
  "O21": {
    "id": "O21",
    "descriptor": "Orta · Kod okuma",
    "prompt": "Upcasting ve downcasting işlemlerini değerlendirin. Hangi satır çalışma zamanında sorun çıkarabilir?\n\n```java\nclass Animal {}\nclass Dog extends Animal {}\nclass Cat extends Animal {}\n\nAnimal animal = new Dog();\nDog dog = (Dog) animal;\nCat cat = (Cat) animal;\n```"
  },
  "O22": {
    "id": "O22",
    "descriptor": "Orta · Tasarım",
    "prompt": "Ortak alanları ve ortak metot uygulamaları bulunan sınıflarda abstract class mı, interface mi tercih edersiniz? Birden fazla bağımsız davranış paylaşılacaksa kararınız değişir mi?"
  },
  "O23": {
    "id": "O23",
    "descriptor": "Orta · Hata bulma",
    "prompt": "İki interface’ten gelen aynı isimli default metot çakışmasını çözün.\n\n```java\ninterface A {\n    default String label() {\n        return \"A\";\n    }\n}\n\ninterface B {\n    default String label() {\n        return \"B\";\n    }\n}\n\nclass C implements A, B {\n}\n```"
  },
  "O24": {
    "id": "O24",
    "descriptor": "Orta · Teori",
    "prompt": "Composition ve inheritance arasındaki fark nedir? Bir `Stack` sınıfının genel amaçlı bir listeden kalıtım alması yerine listeyi içinde tutması neden daha güvenli olabilir?"
  },
  "O25": {
    "id": "O25",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Bir `Order` nesnesinin birden fazla `OrderItem` içermesini composition kullanarak modelleyin. Ürün, adet ve toplam tutar sorumluluklarını doğru sınıflara dağıtın."
  },
  "O26": {
    "id": "O26",
    "descriptor": "Orta · Kod inceleme",
    "prompt": "`CheckoutService` hangi somut sınıfa bağımlıdır? Tasarımı test edilebilir hâle getirmek için bağımlılığı dışarıdan aktarın.\n\n```java\nclass EmailSender {\n    void send(String message) {\n    }\n}\n\nclass CheckoutService {\n    private final EmailSender sender = new EmailSender();\n\n    void checkout() {\n        sender.send(\"Order completed\");\n    }\n}\n```"
  },
  "O27": {
    "id": "O27",
    "descriptor": "Orta · Teori",
    "prompt": "Cohesion ve coupling nedir? Yüksek cohesion ve düşük coupling hedefinin bakım ve test edilebilirliğe etkisini açıklayın."
  },
  "O28": {
    "id": "O28",
    "descriptor": "Orta · Kod inceleme",
    "prompt": "Sınıfı Single Responsibility Principle açısından değerlendirin ve sorumluluklara ayırın.\n\n```java\nclass UserService {\n    void registerUser() {}\n    void saveToDatabase() {}\n    void sendWelcomeEmail() {}\n    void generateMonthlyUserReport() {}\n}\n```"
  },
  "O29": {
    "id": "O29",
    "descriptor": "Orta · Kod inceleme",
    "prompt": "İndirim hesaplamasını Open/Closed Principle’a uygun şekilde yeniden tasarlayın.\n\n```java\ndouble calculateDiscount(String customerType, double amount) {\n    if (customerType.equals(\"REGULAR\")) {\n        return amount * 0.05;\n    } else if (customerType.equals(\"PREMIUM\")) {\n        return amount * 0.10;\n    }\n\n    return 0;\n}\n```"
  },
  "O30": {
    "id": "O30",
    "descriptor": "Orta · Teori",
    "prompt": "DRY, KISS ve YAGNI prensiplerini açıklayın. Tekrarlanan doğrulama kodu ile henüz gerekmeyen kapsamlı bir kural motorunu bu prensipler açısından değerlendirin."
  },
  "O31": {
    "id": "O31",
    "descriptor": "Zorlayıcı · Kod inceleme",
    "prompt": "Tasarımı Liskov Substitution Principle açısından değerlendirin ve yeniden modelleyin.\n\n```java\nclass Bird {\n    void fly() {\n    }\n}\n\nclass Penguin extends Bird {\n    @Override\n    void fly() {\n        throw new UnsupportedOperationException();\n    }\n}\n```"
  },
  "O32": {
    "id": "O32",
    "descriptor": "Zorlayıcı · Kod inceleme",
    "prompt": "Interface’i Interface Segregation Principle’a göre daha küçük arayüzlere ayırın.\n\n```java\ninterface Worker {\n    void work();\n    void eat();\n    void sleep();\n    void recharge();\n}\n```"
  },
  "O33": {
    "id": "O33",
    "descriptor": "Zorlayıcı · Kod inceleme",
    "prompt": "Tasarımı Dependency Inversion Principle’a uygun hâle getirin.\n\n```java\nclass MySqlOrderRepository {\n    void save(Order order) {\n    }\n}\n\nclass OrderService {\n    private final MySqlOrderRepository repository =\n            new MySqlOrderRepository();\n\n    void createOrder(Order order) {\n        repository.save(order);\n    }\n}\n```"
  },
  "O34": {
    "id": "O34",
    "descriptor": "Zorlayıcı · Tasarım",
    "prompt": "Bir alt sınıfın override ettiği `withdraw` metodunun, üst sınıfta geçerli olan bazı girdiler için yeni bir exception fırlatması hangi substitutability sorununu doğurur? Sözleşmeyi veya sınıf hiyerarşisini yeniden tasarlayın."
  },
  "O35": {
    "id": "O35",
    "descriptor": "Zorlayıcı · Kod yazma",
    "prompt": "Kredi kartı, banka havalesi ve dijital cüzdanla ödeme alabilen bir checkout sistemi tasarlayın. Yeni ödeme türlerinde koşul bloklarının büyümemesini sağlayın."
  },
  "O36": {
    "id": "O36",
    "descriptor": "Zorlayıcı · Modelleme",
    "prompt": "E-posta, SMS ve mobil bildirim gönderen bir sistem modelleyin. Ortak mesaj bilgilerini ve kanala özgü doğrulama/gönderim davranışlarını belirleyin."
  },
  "O37": {
    "id": "O37",
    "descriptor": "Zorlayıcı · Modelleme",
    "prompt": "Ödünç alma, iade, rezervasyon ve gecikme cezasını destekleyen bir kütüphane sistemi modelleyin. Kitap ile fiziksel kitap kopyasının ayrı nesneler olup olmayacağını gerekçelendirin."
  },
  "O38": {
    "id": "O38",
    "descriptor": "Zorlayıcı · Modelleme",
    "prompt": "Bir e-ticaret siparişinin oluşturulma, ödeme, hazırlanma, kargolanma ve iptal durumlarını modelleyin. Geçersiz durum geçişlerini engelleyin."
  },
  "O39": {
    "id": "O39",
    "descriptor": "Zorlayıcı · Modelleme",
    "prompt": "Otomobil, motosiklet ve kamyon kabul eden bir otopark sistemi tasarlayın. Park yeri atama, giriş-çıkış ve ücret hesaplama sorumluluklarını dağıtın."
  },
  "O40": {
    "id": "O40",
    "descriptor": "Zorlayıcı · Modelleme ve kod yazma",
    "prompt": "Saatlik, maaşlı ve komisyonlu çalışanları destekleyen bir bordro sistemi tasarlayın. Ücret hesaplamasında polymorphism; vergi ve prim politikalarında composition kullanın."
  },
  "A01": {
    "id": "A01",
    "descriptor": "Kolay · Teori",
    "prompt": "Big O notasyonu neyi ifade eder? En iyi, ortalama ve en kötü durum karmaşıklıkları arasındaki fark nedir?"
  },
  "A02": {
    "id": "A02",
    "descriptor": "Kolay · Teori",
    "prompt": "`O(1)`, `O(log n)`, `O(n)`, `O(n log n)`, `O(n²)` ve `O(2ⁿ)` karmaşıklıklarını büyüme hızına göre sıralayın."
  },
  "A03": {
    "id": "A03",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "`process()` çağrısının `O(1)` olduğunu varsayarak zaman karmaşıklığını belirleyin. Ardışık döngülerin karmaşıklıkları neden çarpılmaz?\n\n```java\nfor (int i = 0; i < n; i++) {\n    process(i);\n}\n\nfor (int j = 0; j < n; j++) {\n    process(j);\n}\n```"
  },
  "A04": {
    "id": "A04",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "`process()` çağrısının `O(1)` olduğunu varsayarak çağrı sayısını ve zaman karmaşıklığını belirleyin.\n\n```java\nfor (int i = 0; i < n; i++) {\n    for (int j = 0; j <= i; j++) {\n        process(i, j);\n    }\n}\n```"
  },
  "A05": {
    "id": "A05",
    "descriptor": "Kolay · Teori",
    "prompt": "Zaman karmaşıklığı ile alan karmaşıklığı arasındaki fark nedir? Bir diziyi kopyalayan çözümle yerinde değiştiren çözümü karşılaştırın."
  },
  "A06": {
    "id": "A06",
    "descriptor": "Kolay · Teori",
    "prompt": "Dizide indeksle erişim neden hızlıdır? Dizinin başına eleman eklemek veya silmek neden daha maliyetlidir?"
  },
  "A07": {
    "id": "A07",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "Bir dizideki en küçük ve en büyük elemanı tek geçişte bulun. Boş dizi davranışını tanımlayın."
  },
  "A08": {
    "id": "A08",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "Ek dizi kullanmadan bir `int[]` dizisini ters çevirin."
  },
  "A09": {
    "id": "A09",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "Linear search ile hedefin ilk indeksini döndüren, bulunamazsa `-1` veren bir metot yazın."
  },
  "A10": {
    "id": "A10",
    "descriptor": "Kolay · Hata bulma",
    "prompt": "Linear search metodundaki sınır hatasını bulun.\n\n```java\nstatic int find(int[] arr, int target) {\n    for (int i = 0; i <= arr.length; i++) {\n        if (arr[i] == target) {\n            return i;\n        }\n    }\n    return -1;\n}\n```"
  },
  "A11": {
    "id": "A11",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "Hazır bir `reverse()` metodu kullanmadan bir String’i ters çevirin."
  },
  "A12": {
    "id": "A12",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "Bir String’in palindrome olup olmadığını kontrol edin. Boş ve tek karakterli String davranışını belirtin."
  },
  "A13": {
    "id": "A13",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "Küçük İngilizce harflerinden oluşan bir String için `int[26]` frekans tablosu oluşturun. Karakter kümesi genişlerse çözümünüzü nasıl değiştirirsiniz?"
  },
  "A14": {
    "id": "A14",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "Bir dizide tekrar eden herhangi bir eleman olup olmadığını `Set` kullanarak belirleyin."
  },
  "A15": {
    "id": "A15",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "İki String’in anagram olup olmadığını kontrol edin. Büyük-küçük harf ve boşluk politikasını önceden tanımlayın."
  },
  "A16": {
    "id": "A16",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "Negatif olmayan bir sayının rakamları toplamını ve rakam sayısını hesaplayın. `0` girdisini ele alın."
  },
  "A17": {
    "id": "A17",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "Faktoriyeli döngüyle hesaplayın. Negatif girdi ve veri tipi taşması için beklenen davranışı belirtin."
  },
  "A18": {
    "id": "A18",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "Metodu farklı girdilerle izleyin ve zaman/alan karmaşıklığını belirleyin.\n\n```java\nstatic int fib(int n) {\n    int a = 0;\n    int b = 1;\n\n    for (int i = 0; i < n; i++) {\n        int next = a + b;\n        a = b;\n        b = next;\n    }\n\n    return a;\n}\n```"
  },
  "A19": {
    "id": "A19",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "Bir sayının asal olup olmadığını kontrol edin. Kontrollerin neden karekök sınırına kadar yapılabileceğini açıklayın."
  },
  "A20": {
    "id": "A20",
    "descriptor": "Kolay · Kod yazma",
    "prompt": "`0` ile `n` arasındaki sayılardan birinin eksik olduğu dizide eksik sayıyı bulun. Toplam ve XOR yaklaşımlarını karşılaştırın."
  },
  "A21": {
    "id": "A21",
    "descriptor": "Kolay · Teori",
    "prompt": "“Eleman daha önce görüldü mü?” ve “Her eleman kaç kez görüldü?” problemlerinde `Set` ve `Map` arasında nasıl seçim yaparsınız?"
  },
  "A22": {
    "id": "A22",
    "descriptor": "Kolay · Teori",
    "prompt": "Hash table nasıl çalışır? Hash değeri, bucket, collision ve ortalama/kötü durum arama sürelerini açıklayın."
  },
  "A23": {
    "id": "A23",
    "descriptor": "Kolay · Kod okuma",
    "prompt": "`counts` içeriğini ve karmaşıklığı belirleyin.\n\n```java\nMap<String, Integer> counts = new HashMap<>();\n\nfor (String word :\n        Arrays.asList(\"java\", \"oop\", \"java\", \"array\")) {\n    counts.put(word, counts.getOrDefault(word, 0) + 1);\n}\n```"
  },
  "A24": {
    "id": "A24",
    "descriptor": "Kolay · Teori",
    "prompt": "Binary search uygulanabilmesi için girdi hangi koşulu sağlamalıdır? Arama alanının sürekli yarıya düşmesi karmaşıklığı nasıl etkiler?"
  },
  "A25": {
    "id": "A25",
    "descriptor": "Kolay · Teori",
    "prompt": "Stack’in LIFO davranışını `push`, `pop` ve `peek` üzerinden açıklayın. İki kullanım örneği verin."
  },
  "A26": {
    "id": "A26",
    "descriptor": "Kolay · Teori",
    "prompt": "Queue’nun FIFO davranışını açıklayın. Stack’ten farkını ve iki kullanım örneğini belirtin."
  },
  "A27": {
    "id": "A27",
    "descriptor": "Kolay · Teori",
    "prompt": "Tek yönlü linked list düğümü nasıl modellenir? Linked list ile diziyi erişim, başa ekleme ve bellek kullanımı açısından karşılaştırın."
  },
  "A28": {
    "id": "A28",
    "descriptor": "Orta · Hata bulma",
    "prompt": "Binary search kodundaki sınır ve ilerleme hatalarını bulun.\n\n```java\nstatic int search(int[] arr, int target) {\n    int left = 0;\n    int right = arr.length;\n\n    while (left <= right) {\n        int mid = (left + right) / 2;\n\n        if (arr[mid] == target) {\n            return mid;\n        } else if (arr[mid] < target) {\n            left = mid;\n        } else {\n            right = mid;\n        }\n    }\n\n    return -1;\n}\n```"
  },
  "A29": {
    "id": "A29",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Sıralı bir dizide hedef değerin ilk görüldüğü indeksi binary search ile bulun."
  },
  "A30": {
    "id": "A30",
    "descriptor": "Orta · Kod yazma",
    "prompt": "`()`, `[]` ve `{}` karakterlerinden oluşan bir ifadenin dengeli olup olmadığını stack kullanarak kontrol edin."
  },
  "A31": {
    "id": "A31",
    "descriptor": "Orta · Kod okuma",
    "prompt": "İşlemlerden sonra değişkenlerin değerini ve queue’nun kalan sırasını bulun. `offer`, `poll` ve `peek` davranışlarını açıklayın.\n\n```java\nQueue<Integer> queue = new ArrayDeque<>();\nqueue.offer(10);\nqueue.offer(20);\n\nint first = queue.poll();\n\nqueue.offer(30);\nint next = queue.peek();\n```"
  },
  "A32": {
    "id": "A32",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Tek yönlü linked list’i dolaşarak düğüm sayısını ve son düğümün değerini bulun. Boş listeyi ele alın."
  },
  "A33": {
    "id": "A33",
    "descriptor": "Orta · Hata bulma",
    "prompt": "Kodun boş liste ve hedefin ilk düğümde olması durumlarındaki sorunlarını bulun.\n\n```java\nstatic Node remove(Node head, int target) {\n    Node current = head;\n\n    while (current.next != null) {\n        if (current.next.value == target) {\n            current.next = current.next.next;\n            return head;\n        }\n\n        current = current.next;\n    }\n\n    return head;\n}\n```"
  },
  "A34": {
    "id": "A34",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Linked list’in orta düğümünü slow/fast pointer tekniğiyle bulun. Çift uzunlukta hangi orta düğümün döndürüleceğini tanımlayın."
  },
  "A35": {
    "id": "A35",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Tek yönlü linked list’i iteratif olarak ters çevirin ve yeni head’i döndürün."
  },
  "A36": {
    "id": "A36",
    "descriptor": "Orta · Kod okuma",
    "prompt": "Bir bubble sort geçişinden sonra dizinin durumunu, karşılaştırma ve swap sayısını bulun.\n\n```java\nint[] arr = {5, 1, 4, 2};\n\nfor (int j = 0; j < arr.length - 1; j++) {\n    if (arr[j] > arr[j + 1]) {\n        int temp = arr[j];\n        arr[j] = arr[j + 1];\n        arr[j + 1] = temp;\n    }\n}\n```"
  },
  "A37": {
    "id": "A37",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Bubble sort’u yazın. Dizi sıralıysa erken çıkış optimizasyonu ekleyin ve en iyi/kötü durum karmaşıklıklarını belirtin."
  },
  "A38": {
    "id": "A38",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Selection sort’u uygulayın. Her dış döngü sonunda dizinin hangi bölümünün doğru konuma geldiğini açıklayın."
  },
  "A39": {
    "id": "A39",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Insertion sort’u uygulayın. Neredeyse sıralı dizilerde neden avantajlı olabileceğini açıklayın."
  },
  "A40": {
    "id": "A40",
    "descriptor": "Orta · Karşılaştırma",
    "prompt": "Bubble, selection ve insertion sort’u kararlılık, yerinde çalışma, en iyi/kötü durum ve swap sayısı açısından karşılaştırın."
  },
  "A41": {
    "id": "A41",
    "descriptor": "Orta · Teori",
    "prompt": "Recursion’da base case neden gereklidir? Çağrıların stack üzerinde tutulması ve `StackOverflowError` riskini açıklayın."
  },
  "A42": {
    "id": "A42",
    "descriptor": "Orta · Hata bulma",
    "prompt": "Recursive faktoriyel metodundaki problemi bulun.\n\n```java\nstatic long factorial(int n) {\n    if (n == 1) {\n        return 1;\n    }\n\n    return n * factorial(n - 1);\n}\n```"
  },
  "A43": {
    "id": "A43",
    "descriptor": "Orta · Kod okuma",
    "prompt": "Recursive Fibonacci çözümündeki tekrarlanan alt problemleri, zaman karmaşıklığını ve stack alanını değerlendirin.\n\n```java\nstatic int fib(int n) {\n    if (n <= 1) {\n        return n;\n    }\n\n    return fib(n - 1) + fib(n - 2);\n}\n```"
  },
  "A44": {
    "id": "A44",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Sıralı olmayan bir dizide toplamı hedefe eşit iki elemanın indekslerini `Map` kullanarak bulun."
  },
  "A45": {
    "id": "A45",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Artan sıradaki bir dizide toplamı hedefe eşit iki elemanı two pointer tekniğiyle bulun."
  },
  "A46": {
    "id": "A46",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Sıralı bir dizide tekrar eden elemanları ek dizi kullanmadan kaldırın ve benzersiz kısmın yeni uzunluğunu döndürün."
  },
  "A47": {
    "id": "A47",
    "descriptor": "Orta · Kod yazma",
    "prompt": "Bir dizideki tüm sıfırları sona taşıyın; sıfır olmayan elemanların sırasını koruyun ve ek dizi kullanmayın."
  },
  "A48": {
    "id": "A48",
    "descriptor": "Zorlayıcı · Kod yazma",
    "prompt": "Uzunluğu `k` olan ardışık alt diziler arasındaki en büyük toplamı bulun. Kaba kuvvet ve sabit boyutlu sliding window çözümlerini karşılaştırın."
  },
  "A49": {
    "id": "A49",
    "descriptor": "Zorlayıcı · Kod yazma",
    "prompt": "Tekrar etmeyen karakterlerden oluşan en uzun ardışık alt String’in uzunluğunu değişken boyutlu sliding window ile bulun."
  },
  "A50": {
    "id": "A50",
    "descriptor": "Zorlayıcı · Kod yazma",
    "prompt": "Linked list içinde döngü olup olmadığını slow/fast pointer yaklaşımıyla belirleyin. Ek bellek kullanan alternatifle karşılaştırın."
  }
});
