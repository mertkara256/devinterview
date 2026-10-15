(function (global) {
  "use strict";

  var BASE = {
    section: "Java",
    topic: "",
    difficulty: "Kolay",
    type: "single",
    prompt: "",
    code: "",
    options: [],
    items: [],
    pairs: [],
    answer: "",
    acceptedAnswers: [],
    caseSensitive: false,
    hint: "",
    explanationShort: "",
    explanationLong: "",
    optionExplanations: {},
    assumptions: ["Java 8 veya sonrasının ortak dil davranışı esas alınır."],
    tags: [],
    version: "1.0.0"
  };

  function q(data) {
    var result = {};
    Object.keys(BASE).forEach(function (key) { result[key] = BASE[key]; });
    Object.keys(data).forEach(function (key) { result[key] = data[key]; });
    return result;
  }

  global.JAVA_QUESTIONS = [
    q({
      id: "J01-01", sourceId: "J01", topic: "Primitive tipler", difficulty: "Kolay", type: "multi",
      prompt: "Aşağıdakilerden Java'nın sekiz primitive tipinin tamamını ve yalnızca onları seçin.",
      options: [
        { id: "a", text: "byte, short, int, long" },
        { id: "b", text: "float, double" },
        { id: "c", text: "char, boolean" },
        { id: "d", text: "String, BigDecimal" },
        { id: "e", text: "Integer, Boolean" }
      ],
      answer: ["a", "b", "c"], acceptedAnswers: [], caseSensitive: false,
      hint: "Küçük harfle yazılan ve sınıf olmayan yerleşik değer tiplerini düşünün.",
      explanationShort: "Sekiz primitive tip byte, short, int, long, float, double, char ve boolean'dır.",
      explanationLong: "İlk dört tip tamsayıları, float ve double kayan noktalı sayıları, char tek bir UTF-16 kod birimini, boolean ise true/false değerini temsil eder. String, BigDecimal ve wrapper tipleri sınıftır.",
      optionExplanations: { a: "Dört işaretli tamsayı primitive tipidir.", b: "İki kayan noktalı primitive tipidir.", c: "Kalan iki primitive tiptir.", d: "İkisi de reference type'tır.", e: "Bunlar primitive tiplerin wrapper sınıflarıdır." },
      assumptions: ["Java dilindeki yerleşik primitive tipler sorulmaktadır; void bir veri tipi olarak sayılmaz."], tags: ["primitive", "tipler"]
    }),
    q({
      id: "J01-02", version: "1.1.0", sourceId: "J01", topic: "Primitive tipler", difficulty: "Kolay", type: "match",
      prompt: "Primitive tip gruplarını temsil ettikleri değerlerle eşleştirin.",
      pairs: {
        left: [{ id: "ints", text: "byte / short / int / long" }, { id: "fp", text: "float / double" }, { id: "ch", text: "char" }, { id: "bool", text: "boolean" }],
        right: [{ id: "r1", text: "İşaretli tamsayılar" }, { id: "r2", text: "IEEE 754 kayan noktalı sayılar" }, { id: "r3", text: "Tek bir UTF-16 kod birimi" }, { id: "r4", text: "true veya false" }, { id: "decoy", text: "Değiştirilemez Unicode metin nesnesi" }]
      },
      answer: { ints: "r1", fp: "r2", ch: "r3", bool: "r4" }, acceptedAnswers: [], caseSensitive: false,
      hint: "char, kullanıcıya görünen her Unicode karakteri değil, 16 bitlik bir kod birimini tutar.",
      explanationShort: "Her primitive grubun temsil ettiği değer alanı farklıdır.",
      explanationLong: "Java tamsayı primitive tipleri işaretlidir. float ve double IEEE 754 biçimindedir. char 16 bitlik unsigned bir UTF-16 code unit'tir; bazı Unicode karakterleri iki char gerektirir. boolean yalnızca true/false alır.",
      optionExplanations: {}, assumptions: ["char açıklamasında Unicode code point değil UTF-16 code unit kastedilir."], tags: ["primitive", "unicode", "değer-atama"]
    }),

    q({
      id: "J02-01", version: "1.1.0", sourceId: "J02", topic: "Değişken başlangıç değerleri", difficulty: "Kolay", type: "single",
      prompt: "Bu sınıf olduğu gibi derlenmeye çalışıldığında ne olur?",
      code: "class Demo {\n    int field;\n\n    void printValues() {\n        int local;\n        System.out.println(field);\n        System.out.println(local);\n    }\n}",
      options: [{ id: "a", text: "field ve local varsayılan değer aldığı için 0 ve 0 yazdırır" }, { id: "b", text: "field satırında derleme hatası verir" }, { id: "c", text: "local değişkeni başlatılmadığı için derleme hatası verir" }, { id: "d", text: "Kod derlenir, fakat local okunduğu anda çalışma zamanında NullPointerException oluşur" }],
      answer: "c", acceptedAnswers: [], caseSensitive: false,
      hint: "Alanlar ile yerel değişkenler için definite assignment kuralları aynı değildir.",
      explanationShort: "Instance alanı 0 alır; başlatılmamış yerel değişken okunamadığı için kod derlenmez.",
      explanationLong: "int türündeki instance field, nesne oluşturulurken varsayılan olarak 0 yapılır. Yerel değişkenlere otomatik varsayılan değer verilmez; derleyici local'ın okunmadan önce kesin olarak atanmış olmasını ister.",
      optionExplanations: { a: "Yalnız alanlar varsayılan değer alır; yerel local otomatik 0 olmaz.", b: "field bir instance alanıdır ve varsayılanı 0'dır.", c: "Doğru; definite assignment kontrolü derleme aşamasındadır.", d: "Sorun derleme zamanındaki atama kontrolüdür; int primitive olduğu için NPE de söz konusu değildir." },
      assumptions: ["Kodun tamamı javac ile derlenmektedir; printValues çağrılmasa bile metot gövdesi kontrol edilir."], tags: ["local", "field", "derleme"]
    }),
    q({
      id: "J02-02", sourceId: "J02", topic: "Değişken başlangıç değerleri", difficulty: "Kolay", type: "boolean",
      prompt: "Bir sınıfın açıkça değer atanmamış boolean instance alanı varsayılan olarak false değerini alır.",
      answer: true, acceptedAnswers: [], caseSensitive: false,
      hint: "Nesne alanlarının sıfır değerlerini düşünün.",
      explanationShort: "Evet. boolean instance alanının varsayılan değeri false'tur.",
      explanationLong: "Instance ve static alanlar türe özgü varsayılan değerle başlatılır: sayısal tiplerde sıfır, char için \\u0000, boolean için false, reference tiplerde null. Bu kural yerel değişkenlere uygulanmaz.",
      optionExplanations: { true: "Instance alanları türe özgü varsayılan değer alır.", false: "false seçeneği, yerel değişken kuralıyla karıştırılmış olur." },
      assumptions: ["Alan bir instance field'dır; local variable değildir."], tags: ["field", "boolean", "varsayılan-değer"]
    }),

    q({
      id: "J03-01", sourceId: "J03", topic: "Değer ve referans ataması", difficulty: "Kolay", type: "output",
      prompt: "Kodun standart çıktısını satır sırasını koruyarak yazın.",
      code: "int a = 10;\nint b = a;\nb = 20;\n\nint[] first = {1, 2};\nint[] second = first;\nsecond[0] = 99;\n\nSystem.out.println(a);\nSystem.out.println(first[0]);",
      answer: "10\n99", acceptedAnswers: ["10\r\n99"], caseSensitive: true,
      hint: "b kendi primitive kopyasını; second ise aynı diziye giden referans değerinin kopyasını alır.",
      explanationShort: "Çıktı 10 ve 99'dur.",
      explanationLong: "b = a, 10 değerini kopyalar; b'nin sonradan 20 olması a'yı etkilemez. second = first ise aynı dizi nesnesine yönelen referans değerini kopyalar. second[0] üzerinden yapılan değişiklik first[0] ile de görünür.",
      optionExplanations: {}, assumptions: ["Çıktı karşılaştırmasında satır sonu biçimi LF veya CRLF olabilir; satırların sırası değişmez."], tags: ["primitive", "reference", "array", "output"]
    }),
    q({
      id: "J03-02", version: "1.1.0", sourceId: "J03", topic: "Değer ve referans ataması", difficulty: "Kolay", type: "single",
      prompt: "`int[] second = first;` ifadesinin en doğru açıklaması hangisidir?",
      options: [{ id: "a", text: "Dizinin elemanları yeni bir diziye derin kopyalanır; iki değişken bağımsız dizileri gösterir" }, { id: "b", text: "Referans değeri kopyalanır; iki değişken aynı dizi nesnesini gösterebilir" }, { id: "c", text: "first null yapılır ve sahiplik second'a taşınır" }, { id: "d", text: "Dizi salt okunur hâle gelir; second üzerinden eleman değiştirmek derleme hatası verir" }],
      answer: "b", acceptedAnswers: [], caseSensitive: false,
      hint: "Java ataması nesnenin sahipliğini taşımaz ve otomatik deep copy yapmaz.",
      explanationShort: "Kopyalanan şey referans değeridir; dizi nesnesi kopyalanmaz.",
      explanationLong: "Her iki değişken de ayrı değişkenlerdir fakat içlerinde aynı heap nesnesine erişen referans değerleri bulunabilir. Bir değişken yeniden atanırsa diğeri değişmez; ortak nesne mutasyona uğrarsa değişiklik ikisinden de gözlenebilir.",
      optionExplanations: { a: "Java dizi atamasında otomatik kopya üretmez; iki değişken aynı diziyi gösterir.", b: "Doğru; aliasing oluşur.", c: "Java'da move semantics uygulanmaz.", d: "Atama mutability'yi değiştirmez; second[0] = 99 geçerlidir." }, assumptions: ["first başlangıçta null olmayan bir int[] referansı tutar."], tags: ["reference", "aliasing", "array"]
    }),

    q({
      id: "J04-01", sourceId: "J04", topic: "Primitive ve reference tipler", difficulty: "Kolay", type: "multi",
      prompt: "Primitive ve reference tipler hakkında doğru ifadeleri seçin.",
      options: [{ id: "a", text: "Bir primitive değişken primitive değerini doğrudan tutar" }, { id: "b", text: "Bir reference değişken null tutabilir" }, { id: "c", text: "Primitive bir değerde örnek metodu doğrudan çağrılamaz" }, { id: "d", text: "İki reference değişkeni == ile karşılaştırmak her zaman içerik eşitliğini sınar" }, { id: "e", text: "Her reference ataması nesnenin bağımsız kopyasını üretir" }],
      answer: ["a", "b", "c"], acceptedAnswers: [], caseSensitive: false,
      hint: "`==` operatörünün reference operandlarda hangi değeri karşılaştırdığını düşünün.",
      explanationShort: "Primitive değer doğrudan tutulur; reference null olabilir ve bir nesneye erişim değeridir.",
      explanationLong: "Primitive tipler dilce tanımlı yalın değerlerdir. Reference değişken, nesneye/diziye erişen bir referans veya null tutar. Reference operandlarda == çoğunlukla aynı nesne kimliğini sorgular; içerik semantiği uygun equals uygulamasına bağlıdır. Atama nesneyi kopyalamaz.",
      optionExplanations: { a: "Doğru primitive değer semantiğidir.", b: "Doğru; null bir reference değeridir.", c: "Doğru; autoboxing ayrı bir dönüşüm bağlamıdır.", d: "Yanlış; == nesne kimliğini karşılaştırır.", e: "Yanlış; yalnız referans değeri kopyalanır." }, assumptions: ["Wrapper autoboxing mekanizması, primitive üzerinde doğrudan örnek metodu çağrıldığı anlamına gelmez."], tags: ["primitive", "reference", "null", "equals"]
    }),
    q({
      id: "J04-02", version: "1.1.0", sourceId: "J04", topic: "Primitive ve reference tipler", difficulty: "Kolay", type: "match",
      prompt: "İşlemleri tip kategorisindeki temel anlamlarıyla eşleştirin.",
      pairs: { left: [{ id: "passign", text: "Primitive ataması" }, { id: "rassign", text: "Reference ataması" }, { id: "peq", text: "int değerlerinde ==" }, { id: "req", text: "Nesne referanslarında ==" }], right: [{ id: "r1", text: "Primitive değeri kopyalar" }, { id: "r2", text: "Referans değerini kopyalar" }, { id: "r3", text: "Sayısal değer eşitliğini sınar" }, { id: "r4", text: "Aynı nesne/null kimliğini sınar" }, { id: "decoy", text: "Nesnelerin alan değerlerini karşılaştırır" }] },
      answer: { passign: "r1", rassign: "r2", peq: "r3", req: "r4" }, acceptedAnswers: [], caseSensitive: false,
      hint: "Atama her iki durumda da değişkendeki değeri kopyalar; değerin türü farklıdır.",
      explanationShort: "Primitive ataması primitive değeri, reference ataması referans değerini kopyalar.",
      explanationLong: "Reference atamasında hedef nesnenin klonu oluşturulmaz. int için == sayısal değeri karşılaştırır. İki nesne referansında ==, iki referansın aynı nesneyi göstermesini veya ikisinin de null olmasını sınar.",
      optionExplanations: {}, assumptions: ["Reference karşılaştırmasında boxing veya String pool gibi ek dönüşüm örnekleri yoktur."], tags: ["atama", "karşılaştırma", "reference"]
    }),

    q({
      id: "J05-01", sourceId: "J05", topic: "Aritmetik operatörler ve cast", difficulty: "Kolay", type: "output",
      prompt: "Kodun standart çıktısını yazın.",
      code: "int a = 7;\nint b = 2;\n\nSystem.out.println(a / b);\nSystem.out.println(a % b);\nSystem.out.println((double) a / b);",
      answer: "3\n1\n3.5", acceptedAnswers: ["3\r\n1\r\n3.5"], caseSensitive: true,
      hint: "İlk bölmede her iki operand int; son bölmede operandlardan biri double'dır.",
      explanationShort: "Çıktı sırasıyla 3, 1 ve 3.5'tir.",
      explanationLong: "int / int işlemi sıfıra doğru kesilen tamsayı bölmesidir: 7/2 = 3. Kalan 1'dir. a önce double'a çevrilince ikili sayısal yükseltme b'yi de double yapar ve sonuç 3.5 olur.",
      optionExplanations: {}, assumptions: ["Ondalık ayırıcı Java'nın Double.toString çıktısındaki noktadır; locale biçimleme yapılmaz."], tags: ["division", "modulo", "casting", "output"]
    }),
    q({
      id: "J05-02", sourceId: "J05", topic: "Aritmetik operatörler ve cast", difficulty: "Kolay", type: "single",
      prompt: "7 ve 2 değerleriyle 3.5 sonucunu üreten ifade hangisidir?",
      code: "int a = 7;\nint b = 2;",
      options: [{ id: "a", text: "(double) (a / b)" }, { id: "b", text: "(double) a / b" }, { id: "c", text: "a / b" }, { id: "d", text: "(int) ((double) a / b)" }],
      answer: "b", acceptedAnswers: [], caseSensitive: false,
      hint: "Cast bölmeden önce operandlardan birine uygulanmalı.",
      explanationShort: "`(double) a / b` kayan noktalı bölme yapar.",
      explanationLong: "`(double)(a / b)` ifadesinde tamsayı bölmesi önce 3 üretir, sonra 3.0'a çevrilir. `(double) a / b` ise bölme öncesinde a'yı double yapar ve 3.5 üretir.",
      optionExplanations: { a: "Tamsayı bölme kaybı cast'ten önce gerçekleşir.", b: "Doğru; bölmenin bir operandı double olur.", c: "Sonuç int 3'tür.", d: "Son cast sonucu tekrar int 3'e keser." }, assumptions: ["a ve b int, b sıfır değildir."], tags: ["cast", "division", "precedence"]
    }),

    q({
      id: "J06-01", sourceId: "J06", topic: "Artırma operatörleri", difficulty: "Kolay", type: "output",
      prompt: "Kodun çıktısını tek satır olarak yazın.",
      code: "int x = 5;\nint y = x++;\nint z = ++x;\n\nSystem.out.println(x + \" \" + y + \" \" + z);",
      answer: "7 5 7", acceptedAnswers: [], caseSensitive: true,
      hint: "Postfix eski değeri üretip sonra artırır; prefix önce artırır.",
      explanationShort: "Çıktı `7 5 7` olur.",
      explanationLong: "y = x++ sırasında y 5 alır ve x 6 olur. z = ++x sırasında x önce 7 olur, ifade 7 üretir ve z 7 alır.",
      optionExplanations: {}, assumptions: ["İfadeler verilen sırayla ayrı statement olarak çalışır; overflow yoktur."], tags: ["prefix", "postfix", "output"]
    }),
    q({
      id: "J06-02", sourceId: "J06", topic: "Artırma operatörleri", difficulty: "Kolay", type: "order",
      prompt: "`int y = x++;` statement'ında x başlangıçta 5 iken gerçekleşen adımları sıraya koyun.",
      items: [{ id: "read", text: "İfadenin değeri olarak x'in eski değeri 5 üretilir" }, { id: "assign", text: "Üretilen 5 değeri y'ye atanır" }, { id: "inc", text: "x bir artırılarak 6 yapılır" }],
      answer: ["read", "inc", "assign"], acceptedAnswers: [], caseSensitive: false,
      hint: "Postfix ifadenin ürettiği değer eskidir; statement bittiğinde x artmıştır.",
      explanationShort: "Eski değer yakalanır, x artırılır; atama hedefi eski değeri alır.",
      explanationLong: "Java'nın değerlendirme modelinde postfix increment ifadesi x'in eski değerini üretirken x'i artırma yan etkisini de tamamlar. Sağ tarafın ürettiği eski değer daha sonra basit atamayla y'ye saklanır; sonuç y=5 ve x=6'dır.",
      optionExplanations: {}, assumptions: ["Adımlar Java expression değerlendirme sırasını temsil eder: sağ taraftaki postfix işlem, y'ye atama tamamlanmadan değerlendirilir."], tags: ["postfix", "evaluation", "order"]
    }),

    q({
      id: "J07-01", version: "1.1.0", sourceId: "J07", topic: "Kısa devreli mantıksal işleçler", difficulty: "Kolay", type: "boolean",
      prompt: "username null iken bu koşul, `&&` iki operandı da değerlendirdiği için NullPointerException üretir.",
      code: "String username = null;\nif (username != null && username.length() >= 3) {\n    System.out.println(\"Geçerli\");\n}",
      answer: false, acceptedAnswers: [], caseSensitive: false,
      hint: "&& sol operand false olduğunda ne yapar?",
      explanationShort: "Yanlış. && kısa devre yapar; sol taraf false olunca sağ operand değerlendirilmez ve NPE oluşmaz.",
      explanationLong: "Sol operand `username != null` false olunca && sonucunun false olduğu kesinleşir ve sağ operand çalıştırılmaz. Böylece null üzerinde length çağrılmaz.",
      optionExplanations: { true: "Sağ taraf yalnız sol taraf true ise değerlendirilir; NPE oluşmaz.", false: "Doğru; && kısa devre yaptığı için null guard güvenlidir." }, assumptions: ["username gerçekten null'dır ve arada başka bir thread tarafından değiştirilen ortak alan değildir; verilen yerel değişken kullanılır."], tags: ["short-circuit", "null", "and"]
    }),
    q({
      id: "J07-02", sourceId: "J07", topic: "Kısa devreli mantıksal işleçler", difficulty: "Kolay", type: "single",
      prompt: "Aynı kodda `&&` yerine boolean `&` kullanılırsa username null iken ne olur?",
      options: [{ id: "a", text: "Koşul güvenle false olur; davranış değişmez" }, { id: "b", text: "Sağ operand da değerlendirilir ve NullPointerException oluşur" }, { id: "c", text: "Kod `&` booleanlarla kullanılamadığı için derlenmez" }, { id: "d", text: "username otomatik olarak boş String'e çevrilir" }],
      answer: "b", acceptedAnswers: [], caseSensitive: false,
      hint: "Boolean `&`, iki operandı da değerlendirir.",
      explanationShort: "`&` kısa devre yapmaz; null üzerinde length çağrısı NPE üretir.",
      explanationLong: "Java'da & hem bit düzeyinde sayısal işlem hem de boolean AND olarak kullanılabilir. Boolean kullanımında iki operand da değerlendirilir; bu yüzden null guard sağ tarafı korumaz.",
      optionExplanations: { a: "& sağ operandı atlamaz.", b: "Doğru; hata length çağrısında oluşur.", c: "& boolean operandlarla geçerlidir.", d: "Java null reference'ı otomatik boş String yapmaz." }, assumptions: ["İfade boolean `&` olarak uygulanır; username null'dır."], tags: ["short-circuit", "bitwise-and", "npe"]
    }),

    q({
      id: "J08-01", version: "1.1.0", sourceId: "J08", topic: "Koşullu sınıflandırma", difficulty: "Kolay", type: "match",
      prompt: "Not aralıklarını metodun döndürmesi gereken sonuçla eşleştirin. Sonuç etiketleri bu kartta tanımlandığı gibidir.",
      pairs: { left: [{ id: "invalid", text: "not < 0 veya not > 100" }, { id: "fail", text: "0–49" }, { id: "pass", text: "50–69" }, { id: "good", text: "70–84" }, { id: "excellent", text: "85–100" }], right: [{ id: "r0", text: "Geçersiz" }, { id: "r1", text: "Başarısız" }, { id: "r2", text: "Geçer" }, { id: "r3", text: "İyi" }, { id: "r4", text: "Pekiyi" }, { id: "decoy", text: "Orta" }] },
      answer: { invalid: "r0", fail: "r1", pass: "r2", good: "r3", excellent: "r4" }, acceptedAnswers: [], caseSensitive: false,
      hint: "Sınırlar kapsayıcıdır; önce geçersiz aralığı ayırın.",
      explanationShort: "Her geçerli not tam bir aralığa, dışarıdaki değerler Geçersiz'e gider.",
      explanationLong: "Aralıkların çakışmaması ve 0 ile 100 dahil tüm geçerli int değerlerini kapsaması gerekir. Guard clause ile `<0 || >100` önce ele alınabilir; kalan eşikler artan veya azalan sırada test edilir.",
      optionExplanations: {}, assumptions: ["Girdi int'tir; ondalık, null veya parse hatası bu metodun kapsamında değildir.", "Aralık uçları dahildir."], tags: ["if-else", "range", "validation"]
    }),
    q({
      id: "J08-02", sourceId: "J08", topic: "Koşullu sınıflandırma", difficulty: "Kolay", type: "single",
      prompt: "Aşağıdaki metotta `gradeResult(85)` ne döndürür?",
      code: "static String gradeResult(int grade) {\n    if (grade < 0 || grade > 100) return \"Geçersiz\";\n    if (grade < 50) return \"Başarısız\";\n    if (grade < 70) return \"Geçer\";\n    if (grade < 85) return \"İyi\";\n    return \"Pekiyi\";\n}",
      options: [{ id: "a", text: "Geçersiz" }, { id: "b", text: "Geçer" }, { id: "c", text: "İyi" }, { id: "d", text: "Pekiyi" }],
      answer: "d", acceptedAnswers: [], caseSensitive: false,
      hint: "`grade < 85` sınaması 85 için false'tur.",
      explanationShort: "85, Pekiyi aralığının alt sınırıdır.",
      explanationLong: "85 geçerlidir; 50, 70 ve 85'ten küçük değildir. Son return çalışır. Bu sıralama 0–49, 50–69, 70–84 ve 85–100 aralıklarını tam olarak oluşturur.",
      optionExplanations: { a: "85 geçerli aralıktadır.", b: "Geçer 50–69 içindir.", c: "İyi aralığı 84'te biter.", d: "Doğru; 85–100 Pekiyi'dir." }, assumptions: ["Aralıklar kaynak soruda verildiği gibi uçları dahil olacak şekilde yorumlanır."], tags: ["if-else", "boundary", "method"]
    }),

    q({
      id: "J09-01", sourceId: "J09", topic: "switch fall-through", difficulty: "Kolay", type: "output",
      prompt: "Kodun standart çıktısını yazın.",
      code: "int day = 2;\nswitch (day) {\n    case 1: System.out.print(\"Pazartesi \" );\n    case 2: System.out.print(\"Salı \" );\n    case 3: System.out.print(\"Çarşamba \" ); break;\n    default: System.out.print(\"Geçersiz\");\n}",
      answer: "Salı Çarşamba", acceptedAnswers: ["Salı Çarşamba "], caseSensitive: true,
      hint: "Eşleşen case 2'den sonra break görülene kadar akış sürer.",
      explanationShort: "`Salı Çarşamba` yazdırılır.",
      explanationLong: "Kontrol doğrudan case 2 etiketine gider. case 2 sonunda break olmadığı için case 3 gövdesine düşer; case 3 sonundaki break switch'i bitirir. case 1 ve default çalışmaz.",
      optionExplanations: {}, assumptions: ["Çıktının sağ kenarındaki tek boşluk puanlamada önemsizdir; kelime ve sıra korunur."], tags: ["switch", "fall-through", "break", "output"]
    }),
    q({
      id: "J09-02", sourceId: "J09", topic: "switch fall-through", difficulty: "Kolay", type: "order",
      prompt: "day = 2 için switch içindeki olayları gerçekleşme sırasına koyun.",
      items: [{ id: "jump", text: "case 2 etiketiyle eşleşilir" }, { id: "tue", text: "Salı yazdırılır" }, { id: "wed", text: "break olmadığı için case 3'e düşülür ve Çarşamba yazdırılır" }, { id: "stop", text: "break switch'i sonlandırır" }],
      answer: ["jump", "tue", "wed", "stop"], acceptedAnswers: [], caseSensitive: false,
      hint: "case etiketleri otomatik blok sınırı değildir.",
      explanationShort: "Eşleşme case 2'ye atlar, case 3'e fall-through olur, break'te biter.",
      explanationLong: "switch önce seçiciyi hesaplar ve eşleşen etikete aktarır. Sonraki case etiketi yürütmeyi kendiliğinden kesmez. Bu nedenle case 3 gövdesi çalışır; açık break akışı switch sonrasına taşır.",
      optionExplanations: {}, assumptions: ["Klasik Java switch statement kullanılmaktadır; Java 14+ switch expression okları yoktur."], tags: ["switch", "control-flow", "order"]
    }),

    q({
      id: "J10-01", sourceId: "J10", topic: "Döngü kontrolü", difficulty: "Kolay", type: "output",
      prompt: "Kodun çıktısını yazın.",
      code: "for (int i = 0; i < 10; i++) {\n    if (i % 2 == 0) continue;\n    if (i > 6) break;\n    System.out.print(i + \" \" );\n}",
      answer: "1 3 5", acceptedAnswers: ["1 3 5 "], caseSensitive: true,
      hint: "Çift sayılar continue ile atlanır; 6'dan büyük ilk tek sayı döngüyü bitirir.",
      explanationShort: "1, 3 ve 5 yazdırılır.",
      explanationLong: "0,2,4,6 ve çift değerler continue nedeniyle kalan gövdeyi atlar. Tek 1,3,5 yazdırılır. i=7 olduğunda ilk koşul false, ikinci koşul true olur ve break döngüyü bitirir.",
      optionExplanations: {}, assumptions: ["Çıktı kenarındaki boşluk yok sayılır; sayılar ve sıraları birebir korunur."], tags: ["for", "continue", "break", "output"]
    }),
    q({
      id: "J10-02", version: "1.1.0", sourceId: "J10", topic: "Döngü kontrolü", difficulty: "Kolay", type: "match",
      prompt: "Döngü anahtar sözcüklerini etkileriyle eşleştirin.",
      pairs: { left: [{ id: "continue", text: "continue" }, { id: "break", text: "break" }], right: [{ id: "r1", text: "Geçerli iterasyonun kalanını atlayıp sonraki iterasyona geçer" }, { id: "r2", text: "En yakın döngüyü tamamen sonlandırır" }, { id: "decoy", text: "Metottan çıkıp çağırana değer döndürür" }] },
      answer: { continue: "r1", break: "r2" }, acceptedAnswers: [], caseSensitive: false,
      hint: "Biri yalnız mevcut turu, diğeri tüm döngüyü bırakır.",
      explanationShort: "continue iterasyonu; break döngüyü terk eder.",
      explanationLong: "Etiketsiz continue en yakın döngünün update/condition aşamasına yönelir. Etiketsiz break en yakın switch veya döngünün sonrasına geçer. Etiketli biçimler bu kartın kapsamı dışındadır.",
      optionExplanations: {}, assumptions: ["Etiketsiz continue ve break kullanımı sorulmaktadır."], tags: ["continue", "break", "control-flow"]
    }),

    q({
      id: "J11-01", version: "1.1.0", sourceId: "J11", topic: "Dizi sınırları", difficulty: "Kolay", type: "single",
      prompt: "Tüm elemanları hata vermeden yazdırmak için döngü koşulundaki en küçük doğru düzeltme hangisidir?",
      code: "int[] numbers = {10, 20, 30};\nfor (int i = 0; i <= numbers.length; i++) {\n    System.out.println(numbers[i]);\n}",
      options: [{ id: "a", text: "Koşulu i <= numbers.length yerine i < numbers.length yapmak" }, { id: "b", text: "Koşulu koruyup döngüyü try-catch ile sarmak ve oluşan hatayı yutmak" }, { id: "c", text: "Koşulu i < numbers.length + 1 yaparak son elemanı da kapsamak" }, { id: "d", text: "i başlangıcını -1 yapmak" }],
      answer: "a", acceptedAnswers: [], caseSensitive: false,
      hint: "Son geçerli indeks length - 1'dir.",
      explanationShort: "Koşul `i < numbers.length` olmalıdır.",
      explanationLong: "Üç elemanlı dizinin geçerli indeksleri 0,1,2'dir. i=3 olduğunda `i <= length` hâlâ true olur fakat numbers[3] erişimi sınır dışıdır. `i < length` standart üst sınırdır.",
      optionExplanations: { a: "Doğru; 0'dan length-1'e kadar çalışır.", b: "Hata gizlenir ama numbers[3] erişimi yine yapılır; bu bir düzeltme değildir.", c: "i < length + 1, i <= length ile aynıdır; numbers[3] erişimi sürer.", d: "İlk erişimi numbers[-1] yapar." }, assumptions: ["Dizi null değildir; amaç ileri yönde tüm elemanları bir kez dolaşmaktır."], tags: ["array", "index", "off-by-one"]
    }),
    q({
      id: "J11-02", sourceId: "J11", topic: "Dizi sınırları", difficulty: "Kolay", type: "fill",
      prompt: "Verilen hatalı döngüde ilk geçersiz dizi indeksini yalnız sayı olarak yazın.",
      code: "int[] numbers = {10, 20, 30};\nfor (int i = 0; i <= numbers.length; i++) {\n    System.out.println(numbers[i]);\n}",
      answer: "3", acceptedAnswers: ["03"], caseSensitive: false,
      hint: "length 3; indeksler sıfırdan başlar.",
      explanationShort: "İlk geçersiz indeks 3'tür.",
      explanationLong: "Geçerli indeks kümesi [0, length) aralığıdır. length=3 için 0,1,2 geçerli; 3 ise ArrayIndexOutOfBoundsException üretir.",
      optionExplanations: {}, assumptions: ["Ondalık olmayan int gösterimi beklenir; çevresel boşluklar normalleştirilir."], tags: ["array", "index", "exception", "fill"]
    }),

    q({
      id: "J12-01", sourceId: "J12", topic: "Metot tanımlama", difficulty: "Kolay", type: "single",
      prompt: "İki int parametreden büyük olanı döndüren geçerli metot hangisidir? Eşitlikte aynı değer döndürülebilir.",
      options: [{ id: "a", text: "static int max(int a, int b) { return a >= b ? a : b; }" }, { id: "b", text: "static void max(int a, int b) { return a >= b ? a : b; }" }, { id: "c", text: "static int max(int a, int b) { System.out.println(a > b); }" }, { id: "d", text: "static int max(int a; int b) { return a + b; }" }],
      answer: "a", acceptedAnswers: [], caseSensitive: false,
      hint: "Dönüş tipi int olmalı ve iki parametre virgülle ayrılmalı.",
      explanationShort: "A seçeneği geçerli imza ve doğru karşılaştırmayı içerir.",
      explanationLong: "Metot int döndürdüğünü bildirdiği için her normal akışta int ifade return etmelidir. Parametreler virgülle ayrılır. Ternary ifade a ve b'den büyük olanı seçer; eşitlikte a'yı döndürmek gereksinimi karşılar.",
      optionExplanations: { a: "Doğru ve tüm int değerlerinde taşmasız karşılaştırır.", b: "void metot değer döndüremez.", c: "int dönüşü eksiktir.", d: "Parametre ayırıcı sözdizimi yanlış, gövde de maksimumu bulmuyor." }, assumptions: ["Math.max kullanma zorunluluğu yoktur; int karşılaştırmasında taşma oluşmaz."], tags: ["method", "return", "max"]
    }),
    q({
      id: "J12-02", version: "1.1.0", sourceId: "J12", topic: "Metot tanımlama", difficulty: "Kolay", type: "match",
      prompt: "Metot bildirimindeki parçaları görevleriyle eşleştirin.",
      code: "public static int max(int a, int b) { return a >= b ? a : b; }",
      pairs: { left: [{ id: "public", text: "public" }, { id: "static", text: "static" }, { id: "intret", text: "max önündeki int" }, { id: "max", text: "max" }, { id: "params", text: "(int a, int b)" }], right: [{ id: "r1", text: "Erişim belirleyici" }, { id: "r2", text: "Sınıf üyesi olduğunu belirten modifier" }, { id: "r3", text: "Dönüş tipi" }, { id: "r4", text: "Metot adı" }, { id: "r5", text: "Parametre listesi" }, { id: "decoy", text: "Fırlatılabilecek checked exception listesi" }] },
      answer: { public: "r1", static: "r2", intret: "r3", max: "r4", params: "r5" }, acceptedAnswers: [], caseSensitive: false,
      hint: "Bildirim; modifier'lar, dönüş tipi, ad ve parametrelerden oluşur.",
      explanationShort: "Her sözdizim parçası erişim, bağlanma, dönüş veya çağrı sözleşmesine katkı verir.",
      explanationLong: "public erişimi, static üyenin örnek gerektirmediğini, int dönüş değerinin türünü, max adı ve parantez içi parametreleri tanımlar. JLS anlamında metot imzası ise ad ile parametre tiplerinden oluşur; dönüş tipi imzaya dahil değildir.",
      optionExplanations: {}, assumptions: ["'Metot bildirimi parçaları' ile JLS'teki dar 'method signature' terimi ayrıştırılır."], tags: ["method", "signature", "modifier"]
    }),
    q({
      id: "J12-03", sourceId: "J12", topic: "Metot imzası", difficulty: "Kolay", type: "multi",
      prompt: "JLS anlamında `max(int a, int b)` metodunun imzasına dahil olan öğeleri seçin.",
      options: [{ id: "a", text: "Metot adı: max" }, { id: "b", text: "Parametre tipleri: int, int" }, { id: "c", text: "Dönüş tipi: int" }, { id: "d", text: "Erişim belirleyici: public" }, { id: "e", text: "Parametre adları: a, b" }],
      answer: ["a", "b"], acceptedAnswers: [], caseSensitive: false,
      hint: "Overload çözümlemesinde dönüş tipi veya parametre adı kullanılmaz.",
      explanationShort: "Metot imzası adı ve uyarlanmış type parameter/parameter tiplerini kapsar.",
      explanationLong: "Bu temel örnekte imza `max(int,int)` olarak düşünülebilir. Dönüş tipi, erişim modifier'ı ve parametre değişken adları imzanın parçası değildir; yalnız dönüş tipini değiştirerek overload yapılamamasının nedeni de budur.",
      optionExplanations: { a: "İmzanın parçasıdır.", b: "Sıralarıyla imzanın parçasıdır.", c: "İmzaya dahil değildir.", d: "Modifier imzaya dahil değildir.", e: "Parametre isimleri çağrı çözümlemesine katılmaz." }, assumptions: ["Generic substitution ayrıntısı olmayan basit bir Java metodu sorulmaktadır."], tags: ["method-signature", "overload", "jls"]
    }),

    q({
      id: "J13-01", sourceId: "J13", topic: "Parametre geçirme", difficulty: "Kolay", type: "output",
      prompt: "Kodun çıktısını yazın.",
      code: "static void swap(int x, int y) {\n    int temp = x; x = y; y = temp;\n}\nint a = 3;\nint b = 8;\nswap(a, b);\nSystem.out.println(a + \" \" + b);",
      answer: "3 8", acceptedAnswers: [], caseSensitive: true,
      hint: "x ve y, a ve b'nin değerlerinin ayrı kopyalarıdır.",
      explanationShort: "Çıktı `3 8` olur.",
      explanationLong: "Java parametreleri her zaman by value geçirir. Primitive argümanların değerleri x ve y'ye kopyalanır. Metot yalnız bu yerel kopyaları değiştirir; çağıranın a ve b değişkenleri yeniden atanmaz.",
      optionExplanations: {}, assumptions: ["Kod bir metot gövdesi gibi geçerli bir çevrede çalıştırılır."], tags: ["pass-by-value", "swap", "primitive", "output"]
    }),
    q({
      id: "J13-02", sourceId: "J13", topic: "Parametre geçirme", difficulty: "Kolay", type: "single",
      prompt: "Java'nın parametre geçirme modelini en doğru açıklayan ifade hangisidir?",
      options: [{ id: "a", text: "Primitive'ler by value, nesneler by reference geçirilir" }, { id: "b", text: "Her argüman by value geçirilir; nesnelerde kopyalanan değer referanstır" }, { id: "c", text: "Her argüman by reference geçirilir" }, { id: "d", text: "Metot, çağıranın reference değişkenini doğrudan yeniden atayabilir" }],
      answer: "b", acceptedAnswers: [], caseSensitive: false,
      hint: "Bir nesne parametresi içinde mutasyon görülebilir ama parametrenin yeniden atanması çağıranı değiştirmez.",
      explanationShort: "Java yalnız pass-by-value kullanır.",
      explanationLong: "Reference type argümanda da değişkenin tuttuğu referans değeri kopyalanır. Kopya aynı nesneye eriştiği için nesne mutasyonu görünür; fakat parametreyi başka nesneye veya null'a atamak çağıranın değişkenini değiştirmez.",
      optionExplanations: { a: "Yaygın ama teknik olarak yanlış ifadedir.", b: "Doğru modeldir.", c: "Çağıran değişkenler doğrudan alias edilmez.", d: "Parametre yalnız kendi yerel kopyasını yeniden atar." }, assumptions: ["JNI gibi dil dışı mekanizmalar değil, Java dilindeki normal metot çağrısı sorulur."], tags: ["pass-by-value", "reference", "parameters"]
    }),

    q({
      id: "J14-01", sourceId: "J14", topic: "String immutability", difficulty: "Kolay", type: "output",
      prompt: "Kodun çıktısını yazın.",
      code: "String text = \"Java\";\ntext.concat(\" Mülakatı\");\nSystem.out.println(text);",
      answer: "Java", acceptedAnswers: [], caseSensitive: true,
      hint: "concat mevcut String'i değiştirmez; yeni bir sonuç döndürür.",
      explanationShort: "`Java` yazdırılır.",
      explanationLong: "String immutable'dır. concat, içerik eklenmiş yeni bir String döndürür; dönüş değeri atanmadığı için text hâlâ başlangıçtaki `Java` nesnesini gösterir.",
      optionExplanations: {}, assumptions: ["Standart java.lang.String.concat davranışı kullanılır; text null değildir."], tags: ["string", "immutable", "concat", "output"]
    }),
    q({
      id: "J14-02", sourceId: "J14", topic: "String immutability", difficulty: "Kolay", type: "single",
      prompt: "`text` değişkeninin `Java Mülakatı` metnini göstermesini sağlayan en doğrudan düzeltme hangisidir?",
      code: "String text = \"Java\";",
      options: [{ id: "a", text: "text.concat(\" Mülakatı\");" }, { id: "b", text: "text = text.concat(\" Mülakatı\");" }, { id: "c", text: "text[4] = ' ';" }, { id: "d", text: "String.concat(text, \" Mülakatı\");" }],
      answer: "b", acceptedAnswers: [], caseSensitive: false,
      hint: "Dönen yeni String referansını saklayın.",
      explanationShort: "concat sonucunun text'e yeniden atanması gerekir.",
      explanationLong: "String'in içeriği yerinde değiştirilemez. concat çağrısının ürettiği yeni String referansı text'e atanırsa sonraki okumalar birleşik metni görür.",
      optionExplanations: { a: "Dönüş değeri kaybolur.", b: "Doğru; yeni String saklanır.", c: "String dizi değildir ve immutable'dır.", d: "concat static metot değildir." }, assumptions: ["Amaç değişkeni yeni String sonucuna yeniden atamaktır; aynı nesneyi mutasyona uğratmak mümkün değildir."], tags: ["string", "concat", "assignment"]
    }),

    q({
      id: "J15-01", sourceId: "J15", topic: "String karşılaştırma", difficulty: "Kolay", type: "output",
      prompt: "Kodun çıktısını satır sırasıyla yazın.",
      code: "String first = new String(\"java\");\nString second = new String(\"java\");\nSystem.out.println(first == second);\nSystem.out.println(first.equals(second));",
      answer: "false\ntrue", acceptedAnswers: ["false\r\ntrue"], caseSensitive: false,
      hint: "new String iki ayrı nesne üretir; içerikleri aynıdır.",
      explanationShort: "== false, equals true üretir.",
      explanationLong: "Her `new String` ayrı nesne kimliği oluşturur; bu yüzden referans kimliği karşılaştıran == false'tur. String.equals karakter dizisini karşılaştırır ve aynı içerik nedeniyle true döner.",
      optionExplanations: {}, assumptions: ["String.equals override'ı kullanılır; iki değişken de null değildir."], tags: ["string", "equals", "identity", "output"]
    }),
    q({
      id: "J15-02", sourceId: "J15", topic: "String karşılaştırma", difficulty: "Kolay", type: "multi",
      prompt: "String karşılaştırması hakkında doğru ifadeleri seçin.",
      options: [{ id: "a", text: "`a == b`, iki referansın aynı nesneyi gösterip göstermediğini sınar" }, { id: "b", text: "`a.equals(b)`, a null değilse içerik eşitliğini sınar" }, { id: "c", text: "String literal pool nedeniyle String içerikleri her zaman == ile güvenle karşılaştırılabilir" }, { id: "d", text: "`Objects.equals(a, b)` null-safe içerik eşitliği sağlayabilir" }, { id: "e", text: "equals her sınıfta otomatik olarak alan bazlı derin karşılaştırma yapar" }],
      answer: ["a", "b", "d"], acceptedAnswers: [], caseSensitive: false,
      hint: "String pool bir optimizasyon/özdeşleştirme ayrıntısıdır; genel içerik sözleşmesi değildir.",
      explanationShort: "Kimlik için ==, String içeriği için equals; null güvenliği için Objects.equals kullanılabilir.",
      explanationLong: "String.equals içerik karşılaştıracak şekilde override edilmiştir. Ancak `a.equals(b)` a null ise NPE verir; Objects.equals bunu güvenli ele alır. == yalnız aynı referans değerini sınar ve literal intern durumuna güvenmek hatalıdır.",
      optionExplanations: { a: "Doğru reference kimliği semantiğidir.", b: "Doğru; alıcı null değil varsayımı önemlidir.", c: "Yanlış; new String ve runtime üretimleri özdeş olmayabilir.", d: "Doğru null-safe yardımcıdır.", e: "Object.equals varsayılanı kimliktir; sınıflar override etmelidir." }, assumptions: ["a ve b String reference'larıdır; b null olabilir, a için ilgili seçenekte null olmadığı belirtilmiştir."], tags: ["string", "equals", "objects-equals", "null"]
    }),

    q({
      id: "J16-01", version: "1.1.0", sourceId: "J16", topic: "StringBuilder", difficulty: "Kolay", type: "single",
      prompt: "Diziyi tam olarak `Java,OOP,Algoritma` metnine dönüştüren, sonda fazladan virgül bırakmayan çözüm hangisidir?",
      code: "String[] topics = {\"Java\", \"OOP\", \"Algoritma\"};",
      options: [
        { id: "a", text: "StringBuilder sb = new StringBuilder(); for (String s : topics) sb.append(s).append(','); return sb.toString();" },
        { id: "b", text: "StringBuilder sb = new StringBuilder(); for (int i=0; i<topics.length; i++) { if (i>0) sb.append(','); sb.append(topics[i]); } return sb.toString();" },
        { id: "c", text: "StringBuilder sb = null; for (String s : topics) sb.append(s); return sb.toString();" },
        { id: "d", text: "StringBuilder sb = new StringBuilder(); for (int i=0; i<topics.length; i++) { sb.append(topics[i]); if (i>0) sb.append(','); } return sb.toString();" }
      ],
      answer: "b", acceptedAnswers: [], caseSensitive: false,
      hint: "Ayırıcıyı ilk elemandan önce değil, sonraki elemanlardan önce ekleyin.",
      explanationShort: "B seçeneği elemanlar arasına virgül koyar ve sonda ayırıcı bırakmaz.",
      explanationLong: "Tek bir StringBuilder oluşturulur. i>0 koşulu yalnız ikinci ve sonraki elemanlardan önce virgül ekler. Boş dizi için de güvenle boş String üretir. A sonda virgül bırakır, C null dereference eder, d dizi içeriğini birleştirmez.",
      optionExplanations: { a: "Sonuçta fazladan son virgül vardır.", b: "Doğru ve boş diziyi de ele alır.", c: "İlk append NullPointerException üretir.", d: "Virgül elemandan sonra eklendiği için ilk ayraç kaybolur ve sonda fazladan virgül kalır." }, assumptions: ["topics null değildir; elemanların null olması hâlinde StringBuilder `null` metnini ekler, ancak verilen dizi null eleman içermez."], tags: ["stringbuilder", "array", "join"]
    }),
    q({
      id: "J16-02", sourceId: "J16", topic: "StringBuilder", difficulty: "Kolay", type: "boolean",
      prompt: "Bir döngüde çok sayıda metin parçası biriktirirken StringBuilder kullanmak, her turda `result = result + part` ile yeni immutable String'ler üretmekten genellikle daha az ara nesne oluşturur.",
      answer: true, acceptedAnswers: [], caseSensitive: false,
      hint: "String immutable, StringBuilder mutable bir karakter tamponudur.",
      explanationShort: "Doğru. StringBuilder aynı tamponu büyüterek ara String sayısını azaltır.",
      explanationLong: "String birleştirme tek bir expression içinde derleyici tarafından StringBuilder'a çevrilebilir; ancak bir döngü boyunca biriken String'i tekrar tekrar + ile atamak her turda yeni sonuçlar üretir ve toplam kopyalama maliyetini büyütebilir. StringBuilder bu kullanım için tasarlanmıştır.",
      optionExplanations: { true: "Tipik döngüsel biriktirmede doğru performans gerekçesidir.", false: "String immutability nedeniyle tekrar atamalı birleştirme ara sonuçlar üretir." }, assumptions: ["Performans iddiası tipik çok parçalı döngü içindir; JVM optimizasyonlarının her özel durumda aynı sonucu vereceği garanti edilmez."], tags: ["stringbuilder", "performance", "immutability"]
    }),

    q({
      id: "J17-01", sourceId: "J17", topic: "Enhanced for", difficulty: "Kolay", type: "output",
      prompt: "Kodun çıktısını yazın.",
      code: "int[] numbers = {1, 2, 3};\nfor (int number : numbers) {\n    number *= 2;\n}\nSystem.out.println(Arrays.toString(numbers));",
      answer: "[1, 2, 3]", acceptedAnswers: [], caseSensitive: true,
      hint: "number her turda dizi elemanının primitive değer kopyasıdır.",
      explanationShort: "Dizi değişmez; `[1, 2, 3]` yazdırılır.",
      explanationLong: "Enhanced for, her int elemanın değerini number yerel değişkenine kopyalar. number'ı ikiyle çarpmak dizi yuvasına geri yazmaz. Diziyi değiştirmek için indeksle `numbers[i] *= 2` yapılmalıdır.",
      optionExplanations: {}, assumptions: ["java.util.Arrays import edilmiştir; int taşması bu küçük değerlerde yoktur."], tags: ["enhanced-for", "array", "primitive", "output"]
    }),
    q({
      id: "J17-02", version: "1.1.0", sourceId: "J17", topic: "Enhanced for", difficulty: "Kolay", type: "single",
      prompt: "Dizinin her elemanını gerçekten ikiyle çarpan çözüm hangisidir?",
      code: "int[] numbers = {1, 2, 3};",
      options: [{ id: "a", text: "for (int n : numbers) n *= 2;" }, { id: "b", text: "for (int i=0; i<numbers.length; i++) numbers[i] *= 2;" }, { id: "c", text: "for (int n : numbers) numbers = new int[]{n * 2};" }, { id: "d", text: "for (int i=0; i<numbers.length; i++) { int n = numbers[i]; n *= 2; }" }],
      answer: "b", acceptedAnswers: [], caseSensitive: false,
      hint: "Dizi hücresine yazmak için indeks gerekir.",
      explanationShort: "B seçeneği her `numbers[i]` yuvasını günceller.",
      explanationLong: "Primitive enhanced-for değişkeni elemanın kopyasıdır. İndeks tabanlı döngü doğrudan dizi elemanına atama yapar. length sabittir ve atanamaz.",
      optionExplanations: { a: "Yalnız yerel kopyayı değiştirir.", b: "Doğru; her dizi hücresine geri yazar.", c: "Her turda tüm dizi referansını tek elemanlı başka diziye atar.", d: "Yalnız yerel n değişir; değer dizi elemanına geri yazılmaz." }, assumptions: ["Her çarpım int aralığında kalır; taşma beklenmez."], tags: ["array", "loop", "mutation"]
    }),

    q({
      id: "J18-01", version: "1.1.0", sourceId: "J18", topic: "Erişim belirleyiciler", difficulty: "Kolay", type: "match",
      prompt: "Üye erişim seviyelerini en geniş genel erişim tanımlarıyla eşleştirin.",
      pairs: { left: [{ id: "pub", text: "public" }, { id: "pro", text: "protected" }, { id: "pkg", text: "package-private (modifier yok)" }, { id: "pri", text: "private" }], right: [{ id: "r1", text: "Her pakette erişilebilir" }, { id: "r2", text: "Aynı paket ve ayrıca farklı pakette uygun alt sınıf erişimi" }, { id: "r3", text: "Yalnız aynı paket" }, { id: "r4", text: "Yalnız bildiren top-level sınıfın gövdesi kapsamındaki erişimler" }, { id: "decoy", text: "Yalnız alt sınıflar; aynı paketteki diğer sınıflar erişemez" }] },
      answer: { pub: "r1", pro: "r2", pkg: "r3", pri: "r4" }, acceptedAnswers: [], caseSensitive: false,
      hint: "protected, package erişimine ek olarak kalıtım bağlamı sağlar.",
      explanationShort: "public en geniş, private en dar; package-private paketle, protected paket ve alt sınıf bağlamıyla sınırlıdır.",
      explanationLong: "Aynı sınıfta dört seviye de erişilebilir. Aynı pakette private dışındakiler erişilebilir. Farklı pakette public genel erişilir; protected ise alt sınıfın kalıtsal üyesine Java'nın nitelikli erişim kısıtlarıyla erişilebilir. package-private paket dışına çıkmaz.",
      optionExplanations: {}, assumptions: ["Java 8+ nested class erişim köprüleri gibi derleyici ayrıntıları değil, kaynak dil erişim kuralları sorulur."], tags: ["access", "public", "protected", "private"]
    }),
    q({
      id: "J18-02", sourceId: "J18", topic: "Erişim belirleyiciler", difficulty: "Kolay", type: "multi",
      prompt: "`Base` sınıfındaki protected bir instance üye için doğru ifadeleri seçin.",
      options: [{ id: "a", text: "Base ile aynı paketteki unrelated bir sınıf üyeye erişebilir" }, { id: "b", text: "Farklı paketteki Base alt sınıfı, kalıtım bağlamında üyeye erişebilir" }, { id: "c", text: "Farklı paketteki herhangi bir sınıf üyeye erişebilir" }, { id: "d", text: "protected, private ile tamamen aynıdır" }, { id: "e", text: "Aynı Base sınıfı içinden üyeye erişilebilir" }],
      answer: ["a", "b", "e"], acceptedAnswers: [], caseSensitive: false,
      hint: "protected iki kapı açar: aynı paket veya uygun alt sınıf bağlamı.",
      explanationShort: "Aynı paket erişimi ve farklı pakette alt sınıf erişimi vardır.",
      explanationLong: "protected üye aynı paket içinde package erişimi gibi kullanılabilir. Paket dışındaki alt sınıfta erişim, alt sınıf örneği/kalıtım yolu üzerinden olmalıdır; herhangi bir Base nesnesi üzerinden serbest genel erişim değildir.",
      optionExplanations: { a: "Doğru; aynı paket kapısı yeterlidir.", b: "Doğru; alt sınıf korumalı erişim bağlamıdır.", c: "Yanlış; public değildir.", d: "Yanlış; kapsamı private'dan geniştir.", e: "Doğru; bildiren sınıf kendi üyesine erişir." }, assumptions: ["Üye instance üyedir; farklı pakette alt sınıf erişimindeki qualifier kısıtları saklıdır ve genel Base referansı üzerinden erişim iddia edilmez."], tags: ["protected", "package", "inheritance"]
    }),

    q({
      id: "J19-01", sourceId: "J19", topic: "static ve instance üyeleri", difficulty: "Orta", type: "multi",
      prompt: "`printValue` gövdesindeki bağımsız derleme sorunlarını seçin.",
      code: "class Counter {\n    int value = 10;\n    static void printValue() {\n        System.out.println(value);\n        System.out.println(this.value);\n    }\n}",
      options: [{ id: "a", text: "Static bağlamdan instance `value` alanına nesne olmadan erişiliyor" }, { id: "b", text: "Static bağlamda `this` kullanılıyor" }, { id: "c", text: "println static metotta çağrılamaz" }, { id: "d", text: "int instance alanı 10 ile başlatılamaz" }],
      answer: ["a", "b"], acceptedAnswers: [], caseSensitive: false,
      hint: "Static metot çağrısında örtük bir Counter alıcısı yoktur.",
      explanationShort: "Hem çıplak `value` erişimi hem `this` kullanımı static bağlamda geçersizdir.",
      explanationLong: "Instance alanı belirli bir Counter nesnesine aittir. Static metot sınıfa bağlı çağrılabildiğinden örtük this yoktur. Alanı okumak için bir Counter referansı alınmalı/oluşturulmalı veya alan gerçekten ortaksa static yapılmalıdır.",
      optionExplanations: { a: "Doğru; bir instance seçilmemiştir.", b: "Doğru; static context'te this yoktur.", c: "println çağrısı System.out nesnesi üzerinden geçerlidir.", d: "Instance int alanı initializer ile 10 olabilir." }, assumptions: ["Kod tam olarak verildiği gibi javac ile derlenir."], tags: ["static", "instance", "this", "compile-error"]
    }),
    q({
      id: "J19-02", version: "1.1.0", sourceId: "J19", topic: "static ve instance üyeleri", difficulty: "Orta", type: "single",
      prompt: "Her Counter nesnesinin kendi `value` değerini yazdırmasını sağlayan en uygun düzeltme hangisidir?",
      options: [{ id: "a", text: "`printValue` metodundan static'i kaldırıp `System.out.println(this.value);` kullanmak" }, { id: "b", text: "`value` alanını static yapıp tüm nesnelerin değerini tek ortak alanda tutmak ve metodu static bırakmak" }, { id: "c", text: "Metodu static bırakıp içinde `System.out.println(this.value);` yazmak" }, { id: "d", text: "`value` alanını final yapmak" }],
      answer: "a", acceptedAnswers: [], caseSensitive: false,
      hint: "Davranış nesne başına ise metot da bir instance alıcısıyla çalışabilir.",
      explanationShort: "Instance metot örtük this üzerinden o nesnenin alanına erişir.",
      explanationLong: "static kaldırıldığında `counter.printValue()` çağrısı belirli bir nesne seçer ve this o nesneyi gösterir. final yapmak bağlanma sorununu çözmez; static bağlamda this yine yoktur.",
      optionExplanations: { a: "Doğru nesne başına davranıştır.", b: "Static alan tüm Counter'larda ortaktır; her nesnenin kendi değeri kaybolur.", c: "Static bağlamda this kullanılamaz; kod derlenmez.", d: "final erişim bağlamını değiştirmez." }, assumptions: ["value nesne başına farklı olmalıdır; tüm Counter'lar arasında ortak sayaç istenmemektedir."], tags: ["static", "instance-method", "this"]
    }),

    q({
      id: "J20-01", version: "1.1.0", sourceId: "J20", topic: "final", difficulty: "Orta", type: "match",
      prompt: "final kullanım yerlerini temel etkileriyle eşleştirin.",
      pairs: { left: [{ id: "var", text: "final değişken" }, { id: "method", text: "final instance metot" }, { id: "class", text: "final sınıf" }], right: [{ id: "r1", text: "Bir kez atandıktan sonra yeniden atanamaz" }, { id: "r2", text: "Alt sınıfta override edilemez" }, { id: "r3", text: "Extend edilemez" }, { id: "decoy", text: "Gösterilen nesnenin alanları da değiştirilemez hâle gelir" }] },
      answer: { var: "r1", method: "r2", class: "r3" }, acceptedAnswers: [], caseSensitive: false,
      hint: "final, uygulandığı bildirimin yeniden bağlanma/genişletme noktasını kapatır.",
      explanationShort: "final değişken yeniden atanmaz, metot override edilmez, sınıf extend edilmez.",
      explanationLong: "Blank final değişken constructor gibi izin verilen bir yerde bir kez atanabilir. final metot kalıtılır ama override edilemez. final sınıfın alt sınıfı oluşturulamaz; üyelerinin otomatik immutable olduğu anlamına gelmez.",
      optionExplanations: {}, assumptions: ["Instance metot sorulmaktadır; static metotlarda override yerine hiding kavramı vardır."], tags: ["final", "variable", "method", "class"]
    }),
    q({
      id: "J20-02", version: "1.1.0", sourceId: "J20", topic: "final", difficulty: "Orta", type: "boolean",
      prompt: "`final List<String> names = new ArrayList<>();` bildirimi listeyi salt okunur yapar; bu yüzden `names.add(\"Ada\")` derleme hatası verir.",
      answer: false, acceptedAnswers: [], caseSensitive: false,
      hint: "final referansın kendisini mi, gösterdiği nesnenin içeriğini mi sabitler?",
      explanationShort: "Yanlış. final yalnız referansın yeniden atanmasını engeller; liste mutable kalır ve add çalışır.",
      explanationLong: "final, names değişkeninin başka bir List referansına veya null'a yeniden atanmasını önler. ArrayList nesnesinin add/remove gibi mutasyonlarını önlemez. Gerçek immutability için kopyalama ve değiştirilemez görünüm/tasarım gerekir.",
      optionExplanations: { true: "final referans sabitliğidir; gösterilen nesnenin metotlarını salt okunur yapmaz.", false: "Doğru; add çağrısı derlenir ve listeye eleman ekler." }, assumptions: ["Liste normal mutable java.util.ArrayList'tir."], tags: ["final", "reference", "mutability", "list"]
    }),

    q({
      id: "J21-01", sourceId: "J21", topic: "Constructor zinciri", difficulty: "Orta", type: "output",
      prompt: "Kodun standart çıktısını yazın.",
      code: "class Person {\n    Person(String name) { System.out.println(\"Person: \" + name); }\n}\nclass Developer extends Person {\n    Developer() {\n        super(\"Ayşe\");\n        System.out.println(\"Developer\");\n    }\n}\nnew Developer();",
      answer: "Person: Ayşe\nDeveloper", acceptedAnswers: ["Person: Ayşe\r\nDeveloper"], caseSensitive: true,
      hint: "Alt sınıf constructor gövdesinden önce üst constructor tamamlanır.",
      explanationShort: "Önce `Person: Ayşe`, sonra `Developer` yazdırılır.",
      explanationLong: "Developer constructor'ının ilk statement'ı super çağrısıdır. Person(String) tamamlandıktan sonra kontrol Developer constructor gövdesindeki println'e döner.",
      optionExplanations: {}, assumptions: ["Sınıf initialization blokları veya field initializer'ları yoktur; kod geçerli bir çalıştırma bağlamındadır."], tags: ["constructor", "super", "inheritance", "output"]
    }),
    q({
      id: "J21-02", sourceId: "J21", topic: "this ve super", difficulty: "Orta", type: "multi",
      prompt: "Constructor ve nesne bağlamı hakkında doğru ifadeleri seçin.",
      options: [{ id: "a", text: "`this` geçerli nesneyi ifade eder" }, { id: "b", text: "`this(...)` aynı sınıftaki başka bir constructor'ı çağırır" }, { id: "c", text: "`super(...)` doğrudan üst sınıf constructor'ını çağırır" }, { id: "d", text: "Bir constructor içinde `this(...)` ve `super(...)` çağrıları ikisi de ayrı ayrı kullanılabilir" }, { id: "e", text: "Açık constructor invocation varsa constructor'ın ilk statement'ı olmalıdır" }],
      answer: ["a", "b", "c", "e"], acceptedAnswers: [], caseSensitive: false,
      hint: "Bir constructor zinciri ilk statement'ta tek bir yönde başlatılır.",
      explanationShort: "this nesneyi, this(...) kardeş constructor'ı, super(...) üst constructor'ı belirtir; açık çağrı ilk statement'tır.",
      explanationLong: "Bir constructor en fazla bir explicit constructor invocation ile başlar: this(...) veya super(...). İkisi birlikte yazılamaz. Çağrı yoksa ve superclass Object değilse derleyici erişilebilir no-arg super() eklemeye çalışır.",
      optionExplanations: { a: "Doğru instance alıcısıdır.", b: "Doğru constructor chaining biçimidir.", c: "Doğru üst sınıf çağrısıdır.", d: "Yanlış; ikisi de ilk statement olmak zorunda olduğundan birlikte olamaz.", e: "Doğru sözdizim kuralıdır." }, assumptions: ["Java 8–21 ortak explicit constructor invocation kuralları esas alınır."], tags: ["this", "super", "constructor"]
    }),

    q({
      id: "J22-01", sourceId: "J22", topic: "Method overloading", difficulty: "Orta", type: "multi",
      prompt: "Calculator bildirimleri hakkında doğru ifadeleri seçin.",
      code: "int sum(int a, int b) { return a + b; }\ndouble sum(double a, double b) { return a + b; }\nlong sum(int a, int b) { return a + b; }",
      options: [{ id: "a", text: "İlk ve ikinci metot geçerli overload'lardır" }, { id: "b", text: "Üçüncü metot ilk metotla aynı imzaya sahiptir ve derleme hatasıdır" }, { id: "c", text: "Dönüş tipini değiştirmek tek başına overload için yeterlidir" }, { id: "d", text: "Parametre tiplerini değiştirmek overload oluşturabilir" }],
      answer: ["a", "b", "d"], acceptedAnswers: [], caseSensitive: false,
      hint: "Çağrı çözümleme dönüş hedefine bakarak aynı parametre listesini ayırt etmez.",
      explanationShort: "int,int ve double,double overload'dur; yalnız dönüş tipi farklı int,int bildirimi çakışır.",
      explanationLong: "İmza ad ve parametre tipleriyle belirlenir. İlk ve üçüncü `sum(int,int)` aynı imzadır; dönüş tipleri farklı olsa da birlikte bildirilemez. İkinci `sum(double,double)` farklı parametre listesi nedeniyle geçerlidir.",
      optionExplanations: { a: "Doğru; parametre tipleri farklıdır.", b: "Doğru duplicate method hatasıdır.", c: "Yanlış; dönüş tipi imzaya dahil değildir.", d: "Doğru overload mekanizmasıdır." }, assumptions: ["Üç bildirim aynı sınıfta ve aynı generic erasure bağlamındadır."], tags: ["overload", "signature", "compile-error"]
    }),
    q({
      id: "J22-02", sourceId: "J22", topic: "Method overloading", difficulty: "Orta", type: "boolean",
      prompt: "Aynı sınıfta yalnız dönüş tipleri farklı olan `int parse(String s)` ve `long parse(String s)` metotları geçerli overload oluşturur.",
      answer: false, acceptedAnswers: [], caseSensitive: false,
      hint: "İki çağrının argüman listesi aynıdır.",
      explanationShort: "Yanlış. Dönüş tipi tek başına overload ayırt etmez.",
      explanationLong: "Her iki metodun imzası parse(String)'dir. Çağrı sonucunun atandığı değişken üzerinden overload seçilmez; sınıf duplicate method nedeniyle derlenmez.",
      optionExplanations: { true: "Dönüş tipi imzanın parçası değildir.", false: "Doğru; parametre listesi farklı olmalıdır." }, assumptions: ["Metotlar aynı sınıfta, static/instance ayrımıyla da farklılaştırılmadan bildirilmiştir."], tags: ["overload", "return-type", "signature"]
    }),

    q({
      id: "J23-01", sourceId: "J23", topic: "Overriding ve polymorphism", difficulty: "Orta", type: "output",
      prompt: "Kodun çıktısını yazın.",
      code: "class Animal { void speak() { System.out.println(\"Animal\"); } }\nclass Dog extends Animal { @Override void speak() { System.out.println(\"Dog\"); } }\nAnimal animal = new Dog();\nanimal.speak();",
      answer: "Dog", acceptedAnswers: [], caseSensitive: true,
      hint: "Override edilmiş instance metot çalışma zamanındaki nesne tipine göre seçilir.",
      explanationShort: "`Dog` yazdırılır.",
      explanationLong: "Referansın derleme zamanı tipi Animal olduğu için Animal'da bildirilen speak çağrısı geçerlidir. Alttaki nesne Dog olduğundan dinamik dispatch Dog override'ını çalıştırır.",
      optionExplanations: {}, assumptions: ["speak instance metodudur; static, private veya final değildir."], tags: ["override", "polymorphism", "dynamic-dispatch", "output"]
    }),
    q({
      id: "J23-02", version: "1.1.0", sourceId: "J23", topic: "Overriding ve polymorphism", difficulty: "Orta", type: "match",
      prompt: "`Animal animal = new Dog(); animal.speak();` çağrısındaki rolleri eşleştirin.",
      pairs: { left: [{ id: "ref", text: "Referansın derleme zamanı tipi Animal" }, { id: "obj", text: "Çalışma zamanı nesnesinin tipi Dog" }, { id: "override", text: "Dog.speak override'ı" }], right: [{ id: "r1", text: "Çağrının derleme zamanında erişilebilir olup olmadığını sınırlar" }, { id: "r2", text: "Dinamik dispatch için gerçek alıcı tipini belirler" }, { id: "r3", text: "Çalıştırılan metot gövdesidir" }, { id: "decoy", text: "Hangi overload'un çağrılacağını çalışma zamanında belirler" }] },
      answer: { ref: "r1", obj: "r2", override: "r3" }, acceptedAnswers: [], caseSensitive: false,
      hint: "Derleyici çağrının varlığını, JVM ise override hedefini çözer.",
      explanationShort: "Referans tipi görünür API'yi; nesne tipi override gövdesini belirler.",
      explanationLong: "Animal referansı yalnız Animal sözleşmesindeki erişilebilir üyeleri doğrudan çağırabilir. Virtual instance metot çağrısında gerçek Dog nesnesine en özgül override uygulanır. Dog'a özel başka bir metot cast olmadan görünmez.",
      optionExplanations: {}, assumptions: ["Normal virtual instance method dispatch söz konusudur; overload seçimi veya static hiding yoktur."], tags: ["reference-type", "runtime-type", "override"]
    }),

    q({
      id: "J24-01", version: "1.1.0", sourceId: "J24", topic: "Collections Framework", difficulty: "Orta", type: "match",
      prompt: "Collections Framework kavramlarını rolleriyle eşleştirin.",
      pairs: { left: [{ id: "collection", text: "java.util.Collection" }, { id: "collections", text: "java.util.Collections" }, { id: "map", text: "java.util.Map" }], right: [{ id: "r1", text: "Tekil eleman grupları için kök arayüz" }, { id: "r2", text: "Koleksiyonlar üzerinde sort/reverse gibi static yardımcılar içeren sınıf" }, { id: "r3", text: "Anahtar-değer eşlemeleri için ayrı kök arayüz" }, { id: "decoy", text: "Elemanları sıralı ve tekrarsız tutan somut sınıf" }] },
      answer: { collection: "r1", collections: "r2", map: "r3" }, acceptedAnswers: [], caseSensitive: false,
      hint: "Tekil ve çoğul yazım iki farklı türdür.",
      explanationShort: "Collection arayüz, Collections yardımcı sınıf, Map ayrı anahtar-değer arayüzüdür.",
      explanationLong: "List, Set ve Queue Collection hiyerarşisindedir. Collections örneklenmeyen bir yardımcı sınıftır. Map, entrySet gibi collection görünümleri sunsa da Collection'ın alt tipi değildir.",
      optionExplanations: {}, assumptions: ["Java standart java.util API'si sorulmaktadır."], tags: ["collection", "collections", "map", "framework"]
    }),
    q({
      id: "J24-02", sourceId: "J24", topic: "Collections Framework", difficulty: "Orta", type: "single",
      prompt: "Aşağıdaki tür ilişkilerinden hangisi doğrudur?",
      options: [{ id: "a", text: "Map, Collection arayüzünü extends eder" }, { id: "b", text: "Collections, Collection'ın somut liste implementasyonudur" }, { id: "c", text: "List ve Set, Collection hiyerarşisindedir; Map ayrı bir hiyerarşidir" }, { id: "d", text: "Collection yalnızca static metotlar içerir" }],
      answer: "c", acceptedAnswers: [], caseSensitive: false,
      hint: "Anahtar-değer yapısı, tek tek eleman koleksiyonundan ayrı modellenir.",
      explanationShort: "List/Set Collection alt türleridir; Map Collection değildir.",
      explanationLong: "Collection tekil eleman grupları için üst arayüzdür. Map key-value ilişkileri tutar ve Collection'ı extend etmez. Collections ise algoritma ve wrapper yardımcıları sunan final sınıftır.",
      optionExplanations: { a: "Yanlış; Map ayrı arayüzdür.", b: "Yanlış; Collections yardımcı sınıftır.", c: "Doğru hiyerarşidir.", d: "Collection arayüzdür ve instance sözleşmesi tanımlar." }, assumptions: ["Standart Java Collections Framework türleri kastedilir."], tags: ["collections-framework", "hierarchy"]
    }),

    q({
      id: "J25-01", version: "1.1.0", sourceId: "J25", topic: "List Set Map seçimi", difficulty: "Orta", type: "match",
      prompt: "İhtiyaçları en doğrudan temel koleksiyon soyutlamasıyla eşleştirin.",
      pairs: { left: [{ id: "tasks", text: "Görevleri eklenme sırasıyla ve tekrarları koruyarak saklama" }, { id: "emails", text: "Benzersiz e-posta adresleri tutma" }, { id: "users", text: "Kullanıcı kimliğinden kullanıcı bilgisine erişme" }], right: [{ id: "list", text: "List" }, { id: "set", text: "Set" }, { id: "map", text: "Map" }, { id: "decoy", text: "Iterator" }] },
      answer: { tasks: "list", emails: "set", users: "map" }, acceptedAnswers: [], caseSensitive: false,
      hint: "Sıra/tekrar, benzersizlik ve anahtar üzerinden erişim gereksinimlerini ayırın.",
      explanationShort: "Sıralı tekrarlar List, benzersizlik Set, anahtar-değer erişimi Map ister.",
      explanationLong: "List pozisyon ve tekrarları korur. Set eşitlik sözleşmesine göre yinelenen öğeleri reddeder. Map benzersiz anahtarları değerlerle eşler. Somut tür seçerken ayrıca sıra ihtiyacı varsa ArrayList, LinkedHashSet veya LinkedHashMap gibi implementasyonlar değerlendirilebilir.",
      optionExplanations: {}, assumptions: ["E-posta eşitliğinin normalize edilmiş String eşitliğiyle belirlendiği ve null politikalarının uygulamada ayrıca tanımlanacağı varsayılır."], tags: ["list", "set", "map", "selection"]
    }),

    q({
      id: "J26-01", version: "1.1.0", sourceId: "J26", topic: "ArrayList ve LinkedList", difficulty: "Orta", type: "match",
      prompt: "İşlemleri tipik tercih veya karmaşıklıkla eşleştirin.",
      pairs: { left: [{ id: "random", text: "get(i) ile rastgele indeks erişimi" }, { id: "append", text: "Listenin sonuna ekleme" }, { id: "knownnode", text: "Iterator'ın bulunduğu konumda silme" }, { id: "memory", text: "Eleman başına daha düşük yapısal bellek yükü" }], right: [{ id: "r1", text: "ArrayList: O(1)" }, { id: "r2", text: "İkisi de tipik olarak O(1) amortize/bağlantı güncellemesi" }, { id: "r3", text: "LinkedList: konum zaten biliniyorsa bağlantı güncellemesi O(1)" }, { id: "r4", text: "Genellikle ArrayList" }, { id: "decoy", text: "LinkedList: indeksle erişim O(1)" }] },
      answer: { random: "r1", append: "r2", knownnode: "r3", memory: "r4" }, acceptedAnswers: [], caseSensitive: false,
      hint: "LinkedList'te indeks bulma süresini, bulduktan sonraki bağlantı değişiminden ayırın.",
      explanationShort: "ArrayList indeks erişiminde ve bellek yerelliğinde güçlü; LinkedList bilinen düğüm konumundaki bağlantı değişiminde avantajlıdır.",
      explanationLong: "ArrayList get(i) O(1), LinkedList get(i) O(n)'dir. ArrayList sona ekleme amortize O(1), LinkedList sona ekleme O(1)'dir. LinkedList ortasına indeksle gitmek yine O(n) olduğundan yalnız ekleme/silme ifadesi tek başına üstünlük garantilemez. Düğümler iki bağlantı taşıdığı için LinkedList'in eleman başına yükü yüksektir.",
      optionExplanations: {}, assumptions: ["Big-O ortalama/amortize davranıştır; ArrayList kapasite büyümesi ve donanım cache etkileri ayrıca belirtilmiştir."], tags: ["arraylist", "linkedlist", "complexity", "memory"]
    }),
    q({
      id: "J26-02", sourceId: "J26", topic: "ArrayList ve LinkedList", difficulty: "Orta", type: "multi",
      prompt: "Gerçek uygulama performansı açısından doğru ifadeleri seçin.",
      options: [{ id: "a", text: "LinkedList'te `add(index, x)` indeksi bulmak gerektiğinden genel olarak O(n)'dir" }, { id: "b", text: "ArrayList bitişik referans dizisi sayesinde genellikle iyi cache locality sunar" }, { id: "c", text: "LinkedList her türlü ekleme ve silmede daima ArrayList'ten hızlıdır" }, { id: "d", text: "ArrayList ortasına ekleme eleman kaydırmayı gerektirebilir" }, { id: "e", text: "LinkedList get(i) her i için O(1)'dir" }],
      answer: ["a", "b", "d"], acceptedAnswers: [], caseSensitive: false,
      hint: "Asimptotik maliyetin yanında indeks arama ve bellek yerelliğini düşünün.",
      explanationShort: "İndeks bulma LinkedList'i O(n) yapar; ArrayList kaydırabilir fakat bellek yerelliği güçlüdür.",
      explanationLong: "LinkedList yalnız konum iterator/düğüm olarak zaten eldeyse bağlantı değişimini O(1) yapar. İndeksli API önce düğümü arar. ArrayList orta eklemede System.arraycopy benzeri kaydırma yapar, fakat kompakt düzen ve düşük allocation maliyeti pratikte çoğu kullanımda avantajlıdır.",
      optionExplanations: { a: "Doğru; traversal gerekir.", b: "Doğru tipik donanım etkisidir.", c: "Yanlış mutlak genellemedir.", d: "Doğru; sonraki elemanlar kayar.", e: "Yanlış; bağlantılar boyunca yürünür." }, assumptions: ["Standart OpenJDK benzeri ArrayList/LinkedList tasarımı ve ortalama uygulama kullanımı ele alınır; mikrobenchmark sonucu garanti edilmez."], tags: ["arraylist", "linkedlist", "performance"]
    }),

    q({
      id: "J27-01", sourceId: "J27", topic: "HashSet eşitliği", difficulty: "Orta", type: "output",
      prompt: "Kodun çıktısını yazın.",
      code: "class Employee {\n    int id;\n    Employee(int id) { this.id = id; }\n}\nSet<Employee> employees = new HashSet<>();\nemployees.add(new Employee(10));\nemployees.add(new Employee(10));\nSystem.out.println(employees.size());",
      answer: "2", acceptedAnswers: [], caseSensitive: true,
      hint: "Employee equals/hashCode override etmediği için Object kimlik semantiğini kullanır.",
      explanationShort: "İki ayrı nesne eşit sayılmaz; boyut 2'dir.",
      explanationLong: "Object.equals varsayılan olarak aynı nesne kimliğini gerektirir; her new ayrı nesnedir. Object.hashCode da kimlik sözleşmesiyle uyumludur. Aynı id alanı otomatik değer eşitliği oluşturmaz.",
      optionExplanations: {}, assumptions: ["Employee, Object.equals ve Object.hashCode'u override etmez; Set standart HashSet'tir."], tags: ["hashset", "equals", "hashcode", "output"]
    }),
    q({
      id: "J27-02", version: "1.1.0", sourceId: "J27", topic: "HashSet eşitliği", difficulty: "Orta", type: "single",
      prompt: "Yalnız id alanı eşit Employee nesnelerinin HashSet'te tek öğe sayılması için ne yapılmalıdır?",
      options: [{ id: "a", text: "Yalnız equals id'ye göre override edilmeli" }, { id: "b", text: "Yalnız hashCode id'ye göre override edilmeli; HashSet eşitliği yalnız hash değerine bakarak belirler" }, { id: "c", text: "equals ve hashCode birlikte, aynı id eşitlik ölçütüne göre override edilmeli" }, { id: "d", text: "HashSet yerine ArrayList kullanılmalı" }],
      answer: "c", acceptedAnswers: [], caseSensitive: false,
      hint: "Eşit nesneler aynı hash code'u üretmek zorundadır.",
      explanationShort: "equals ve hashCode aynı alanlara dayalı birlikte uygulanmalıdır.",
      explanationLong: "HashSet önce hash ile bucket adaylarını daraltır, sonra equals ile eşitliği doğrular. equals id'yi kullanıyorsa hashCode da id'den türetilmelidir. Yalnız birini override etmek sözleşmeyi veya beklenen aramayı bozar.",
      optionExplanations: { a: "Hash sözleşmesini bozabilir.", b: "HashSet hash'i yalnız kovayı bulmak için kullanır; eşitliği equals belirler ve Object.equals ayrı nesneleri reddeder.", c: "Doğru sözleşmedir.", d: "Benzersizlik gereksinimini otomatik sağlamaz." }, assumptions: ["id nesne Set içindeyken değişmez veya Employee immutable tasarlanır."], tags: ["equals", "hashcode", "hashset", "contract"]
    }),

    q({
      id: "J28-01", version: "1.1.0", sourceId: "J28", topic: "Map ile gruplama", difficulty: "Orta", type: "single",
      prompt: "Siparişleri customerId'ye göre `Map<Integer,List<Order>>` içinde doğru biçimde gruplayan gövde hangisidir? `Order#getCustomerId()` int döndürür.",
      options: [
        { id: "a", text: "for (Order o : orders) result.computeIfAbsent(o.getCustomerId(), k -> new ArrayList<>()).add(o);" },
        { id: "b", text: "for (Order o : orders) { List<Order> list = new ArrayList<>(); list.add(o); result.put(o.getCustomerId(), list); }" },
        { id: "c", text: "for (Order o : orders) result.get(o.getCustomerId()).add(o);" },
        { id: "d", text: "for (Order o : orders) result.put(null, Arrays.asList(o));" }
      ],
      answer: "a", acceptedAnswers: [], caseSensitive: false,
      hint: "Anahtar ilk kez görülürse liste oluşturun; her durumda siparişi o listeye ekleyin.",
      explanationShort: "computeIfAbsent her müşteri için listeyi bir kez oluşturup siparişi ekler.",
      explanationLong: "A seçeneğinde mapping function yalnız anahtar için mevcut non-null değer yoksa ArrayList üretir; dönen listeye sipariş eklenir. B her siparişte boş listeyle önceki grubu ezer. C ilk anahtarda null.get/add nedeniyle NPE üretir.",
      optionExplanations: { a: "Doğru Java 8 gruplama kalıbıdır.", b: "Her siparişte yeni liste açılır; aynı müşterinin önceki siparişleri ezilir.", c: "Liste önceden yoksa NPE verir.", d: "Müşteri kimliğini kullanmaz ve gruplamaz." }, assumptions: ["orders ve içindeki Order öğeleri null değildir; getCustomerId int döndürür; result başlangıçta boş mutable HashMap'tir."], tags: ["map", "grouping", "computeifabsent"]
    }),
    q({
      id: "J28-02", sourceId: "J28", topic: "Map ile gruplama", difficulty: "Orta", type: "order",
      prompt: "Bir siparişi customerId'ye göre imperative olarak gruplama adımlarını sıraya koyun.",
      items: [{ id: "key", text: "Siparişin customerId anahtarını oku" }, { id: "lookup", text: "Anahtar için mevcut listeyi bul; yoksa yeni liste oluşturup Map'e koy" }, { id: "add", text: "Siparişi ilgili listeye ekle" }, { id: "return", text: "Tüm siparişler işlendiğinde Map'i döndür" }],
      answer: ["key", "lookup", "add", "return"], acceptedAnswers: [], caseSensitive: false,
      hint: "Liste hazır olmadan add yapılamaz; Map tüm öğeler bitince döner.",
      explanationShort: "Anahtar alınır, grup listesi sağlanır, sipariş eklenir; döngü bitince Map döner.",
      explanationLong: "Bu sıra computeIfAbsent kalıbının açılmış hâlidir. Her Order tam bir kez bir gruba eklenir. n sipariş için HashMap'in ortalama varsayımları altında toplam süre O(n), ek alan O(n)'dir.",
      optionExplanations: {}, assumptions: ["HashMap işlemleri ortalama O(1), iyi dağılan hash ve normal yük faktörü varsayımıyla değerlendirilir; null öğeler kabul edilmez."], tags: ["grouping", "map", "algorithm", "order"]
    }),
    q({
      id: "J28-03", sourceId: "J28", topic: "Map ile gruplama", difficulty: "Orta", type: "boolean",
      prompt: "Gruplama sonucu `HashMap<Integer,List<Order>>` kullanıyorsa müşteri anahtarlarının iterasyon sırası, siparişlerin ilk görülme sırası olarak garanti edilir.",
      answer: false, acceptedAnswers: [], caseSensitive: false,
      hint: "HashMap bir sıralama sözleşmesi sunar mı?",
      explanationShort: "Yanlış. HashMap iterasyon sırası garantilemez.",
      explanationLong: "İlk görülme anahtar sırasının korunması gerekiyorsa LinkedHashMap kullanılmalıdır. Her grup içindeki ArrayList sipariş ekleme sırasını korur; fakat dış HashMap'in key/entry iterasyon sırası sözleşmesizdir.",
      optionExplanations: { true: "HashMap'in böyle bir sıra garantisi yoktur.", false: "Doğru; sıra gerekiyorsa uygun Map implementasyonu seçilmelidir." }, assumptions: ["Standart java.util.HashMap kullanılır; belirli bir JVM çalıştırmasında gözlenen tesadüfi sıra sözleşme sayılmaz."], tags: ["hashmap", "linkedhashmap", "ordering", "grouping"]
    }),

    q({
      id: "J29-01", sourceId: "J29", topic: "HashMap çalışma mantığı", difficulty: "Orta", type: "order",
      prompt: "HashMap'te `put(key, value)` işleminin kavramsal adımlarını sıraya koyun.",
      items: [{ id: "hash", text: "Anahtarın hashCode değerinden yayılmış hash hesapla" }, { id: "bucket", text: "Tablo kapasitesine göre bucket indeksini belirle" }, { id: "scan", text: "Bucket içindeki adaylarda hash ve equals ile eş anahtar ara" }, { id: "write", text: "Eş anahtar varsa değeri güncelle; yoksa yeni entry ekle" }, { id: "resize", text: "Ekleme eşiği aşarsa tabloyu yeniden boyutlandır/dağıt" }],
      answer: ["hash", "bucket", "scan", "write", "resize"], acceptedAnswers: [], caseSensitive: false,
      hint: "Önce hash ve bucket; sonra collision adayları ve eşitlik gelir.",
      explanationShort: "Hash bucket'ı daraltır; equals gerçek anahtar eşitliğini doğrular; eşik aşılırsa resize olur.",
      explanationLong: "HashMap hashCode'u işler ve kapasite maskesiyle bucket seçer. Aynı bucket'taki collision'lar hash ve equals ile ayrılır. Eş anahtarda value değiştirilir; yeni anahtarda entry sayısı artar. size threshold'u aşınca kapasite genellikle büyür ve entry'ler yeni tablodaki konumlarına ayrılır.",
      optionExplanations: {}, assumptions: ["Açıklama Java 8 HashMap'in kavramsal davranışıdır; null anahtarın özel hash=0 yolu ve tree bin ayrıntıları kartın ana sırasını değiştirmez."], tags: ["hashmap", "hash", "bucket", "resize"]
    }),
    q({
      id: "J29-02", sourceId: "J29", topic: "HashMap çalışma mantığı", difficulty: "Orta", type: "multi",
      prompt: "HashMap hakkında doğru ifadeleri seçin.",
      options: [{ id: "a", text: "Collision, farklı anahtarların aynı bucket'a düşebilmesidir" }, { id: "b", text: "Aynı hashCode üreten iki anahtar mutlaka equals ile eşittir" }, { id: "c", text: "Eş anahtarlar aynı hashCode'u üretmelidir" }, { id: "d", text: "Kapasite/yük eşiği aşılınca resize maliyetli olabilir" }, { id: "e", text: "HashMap araması her koşulda kesin O(1)'dir" }],
      answer: ["a", "c", "d"], acceptedAnswers: [], caseSensitive: false,
      hint: "Hash aynı olması yalnız adaylığı gösterir; eşitliğin tersi yönlü sözleşmesini düşünün.",
      explanationShort: "Collision normaldir; equals eşitliği aynı hash gerektirir; resize maliyetlidir ve O(1) garanti değildir.",
      explanationLong: "hashCode eşitliği equals eşitliği için yeterli değildir. Ancak equals true ise hashCode aynı olmalıdır. İyi dağılımda get/put ortalama O(1) kabul edilir; kötü collision veya saldırgan anahtarlarda maliyet artar. Java 8 bazı uzun bucket'ları tree'leştirerek en kötü durumu iyileştirebilir.",
      optionExplanations: { a: "Doğru collision tanımıdır.", b: "Yanlış; farklı anahtarlar aynı hash'i paylaşabilir.", c: "Doğru equals/hashCode sözleşmesidir.", d: "Doğru; tablo yeniden düzenlenir.", e: "Yanlış; ortalama/amortize beklentidir." }, assumptions: ["Karmaşıklık ortalama iyi hash dağılımı için ayrıca belirtilir; kesin worst-case O(1) iddia edilmez."], tags: ["hashmap", "collision", "complexity", "contract"]
    }),

    q({
      id: "J30-01", sourceId: "J30", topic: "Exception kontrol akışı", difficulty: "Orta", type: "output",
      prompt: "Kodun standart çıktısını satır sırasıyla yazın.",
      code: "static int calculate() {\n    try {\n        return 10 / 0;\n    } catch (ArithmeticException e) {\n        System.out.println(\"catch\");\n        return -1;\n    } finally {\n        System.out.println(\"finally\");\n    }\n}\nSystem.out.println(calculate());",
      answer: "catch\nfinally\n-1", acceptedAnswers: ["catch\r\nfinally\r\n-1"], caseSensitive: true,
      hint: "catch dönüş kararı verse bile finally tamamlanmadan çağrı dönmez.",
      explanationShort: "Sıra `catch`, `finally`, `-1` olur.",
      explanationLong: "10/0 ArithmeticException üretir ve catch çalışır. catch -1 döndürmeye hazırlanır; ancak normal dönüşten önce finally yürütülür. finally yalnız yazdırıp normal tamamlanınca bekleyen -1 dönüşü çağırana gider ve dış println onu yazdırır.",
      optionExplanations: {}, assumptions: ["Bölme int bölmesidir; finally yeni exception atmaz ve return içermez."], tags: ["try", "catch", "finally", "output"]
    }),
    q({
      id: "J30-02", sourceId: "J30", topic: "Exception kontrol akışı", difficulty: "Orta", type: "order",
      prompt: "`calculate()` çağrısındaki olayları sıraya koyun.",
      items: [{ id: "throw", text: "10 / 0 ArithmeticException üretir" }, { id: "catch", text: "Uyumlu catch çalışır ve -1 dönüşü hazırlanır" }, { id: "finally", text: "finally bloğu çalışır" }, { id: "return", text: "-1 çağırana döner" }, { id: "outer", text: "Dış println -1'i yazdırır" }],
      answer: ["throw", "catch", "finally", "return", "outer"], acceptedAnswers: [], caseSensitive: false,
      hint: "finally, bekleyen normal return'den önce yürütülür.",
      explanationShort: "Exception catch'e gider; finally sonrası bekleyen dönüş tamamlanır.",
      explanationLong: "Exception try'ın geri kalanını atlar. catch dönüş ifadesi değerlendirilir, fakat kontrol finally'a aktarılır. finally normal biterse kaydedilen dönüş gerçekleşir. finally return/throw yapsaydı önceki dönüşü bastırabilirdi; bu kodda yapmaz.",
      optionExplanations: {}, assumptions: ["finally içindeki println başarıyla normal tamamlanır; Thread.stop gibi dış asenkron olaylar yoktur."], tags: ["exception", "finally", "return", "order"]
    }),

    q({
      id: "J31-01", sourceId: "J31", topic: "Checked exception", difficulty: "Orta", type: "multi",
      prompt: "Metodun derlenmesi ve kaynağın güvenle kapatılması için geçerli yaklaşımları seçin.",
      code: "static String readFirstLine(String path) {\n    BufferedReader reader = new BufferedReader(new FileReader(path));\n    return reader.readLine();\n}",
      options: [{ id: "a", text: "Metoda `throws IOException` ekleyip tercihen try-with-resources ile reader'ı kapatmak" }, { id: "b", text: "IOException'ı metot içinde catch edip anlamlı biçimde ele almak ve try-with-resources kullanmak" }, { id: "c", text: "Hiçbir şey yapmamak; IOException unchecked'dır" }, { id: "d", text: "Yalnız `reader = null` atamak" }, { id: "e", text: "Metoda `throws RuntimeException` eklemek" }],
      answer: ["a", "b"], acceptedAnswers: [], caseSensitive: false,
      hint: "FileReader oluşturma ve readLine checked IOException ailesindedir; kapanma da düşünülmelidir.",
      explanationShort: "IOException yakalanmalı veya bildirilmelidir; kaynak try-with-resources ile kapatılmalıdır.",
      explanationLong: "FileNotFoundException IOException alt tipidir ve FileReader constructor'ından gelebilir; BufferedReader.readLine da IOException bildirebilir. Checked exception catch veya throws ister. try-with-resources normal ve exceptional çıkışlarda close çağırır ve close exception'larını da kurallı biçimde işler.",
      optionExplanations: { a: "Doğru, çağırana checked sözleşmesi verir ve kaynağı kapatabilir.", b: "Doğru, yerel kurtarma/çevirme politikası olabilir.", c: "Yanlış; IOException checked'dır.", d: "Referansı null yapmak işletim sistemi kaynağını deterministik kapatmaz.", e: "İlgili checked exception'ı bildirmez." }, assumptions: ["java.io sınıfları import edilmiştir; metot dosya I/O hatasını yutmamalıdır."], tags: ["checked-exception", "ioexception", "try-with-resources"]
    }),
    q({
      id: "J31-02", version: "1.1.0", sourceId: "J31", topic: "Checked ve unchecked exception", difficulty: "Orta", type: "match",
      prompt: "Exception türlerini derleyici bildirimi gereksinimleriyle eşleştirin.",
      pairs: { left: [{ id: "io", text: "IOException" }, { id: "runtime", text: "RuntimeException" }, { id: "error", text: "Error" }], right: [{ id: "r1", text: "Checked: catch edilmeli veya throws ile bildirilmelidir" }, { id: "r2", text: "Unchecked: catch/throws zorunlu değildir" }, { id: "r3", text: "Unchecked ciddi JVM/sistem problemi ailesi; normalde uygulama kurtarma sözleşmesi değildir" }, { id: "decoy", text: "Checked: yalnız main metodunda yakalanabilir" }] },
      answer: { io: "r1", runtime: "r2", error: "r3" }, acceptedAnswers: [], caseSensitive: false,
      hint: "RuntimeException ve Error, checked exception analizinin dışında tutulur.",
      explanationShort: "IOException checked; RuntimeException ve Error unchecked'dır.",
      explanationLong: "Throwable altında Exception'ın RuntimeException dışındaki yaygın alt tipleri checked'dır. Derleyici bunların kaçışını kontrol eder. RuntimeException programlama/precondition sorunlarını temsil edebilir; Error ise çoğu zaman uygulamanın güvenle düzeltemeyeceği JVM koşullarıdır.",
      optionExplanations: {}, assumptions: ["Türler doğrudan belirtilen standart Java sınıflarıdır; özel alt sınıf değişikliği yoktur."], tags: ["checked", "unchecked", "exception-hierarchy"]
    }),

    q({
      id: "J32-01", version: "1.1.0", sourceId: "J32", topic: "Özel exception tasarımı", difficulty: "Orta", type: "single",
      prompt: "Geçersiz yaşın çağıranın işlemi düzeltip yeniden deneyebileceği iş kuralı ihlali olarak checked exception ile bildirilmesi isteniyor. Doğru tasarım hangisidir?",
      options: [
        { id: "a", text: "class InvalidAgeException extends Exception { InvalidAgeException(String m) { super(m); } } ve `void register(int age) throws InvalidAgeException { if (age < 0) throw new InvalidAgeException(\"age\"); }`" },
        { id: "b", text: "class InvalidAgeException extends Error {} ve yalnız `return`" },
        { id: "c", text: "class InvalidAgeException extends RuntimeException { InvalidAgeException(String m) { super(m); } } ve `void register(int age) throws InvalidAgeException { if (age < 0) throw new InvalidAgeException(\"age\"); }`" },
        { id: "d", text: "class InvalidAgeException {} ve `throw InvalidAgeException;`" }
      ],
      answer: "a", acceptedAnswers: [], caseSensitive: false,
      hint: "Checked tür Exception'dan türemeli; tür bildiriminde throws, nesne üretiminde throw kullanılır.",
      explanationShort: "A seçeneği checked türü, throws sözleşmesini ve throw ifadesini doğru kurar.",
      explanationLong: "Exception alt sınıfı RuntimeException dışında kaldığı için checked'dır. Constructor mesajı üst sınıfa iletir. register metodunun bildirimi olası türü `throws InvalidAgeException` ile açıklar; koşul oluşunca `throw new InvalidAgeException(...)` bir nesneyi fırlatır.",
      optionExplanations: { a: "Doğru checked exception tasarımıdır.", b: "Error iş kuralı doğrulaması için uygun değildir ve exception fırlatmıyor.", c: "RuntimeException unchecked'tır; throws ile bildirilse bile derleyici çağıranı hatayı ele almaya zorlamaz.", d: "Throwable alt tipi değildir ve throw bir nesne ifadesi ister." }, assumptions: ["Geçerli yaş aralığının alt sınırı bu kartta 0'dır; üst sınır gereksinimi verilmemiştir.", "Checked/unchecked seçimi bağlama bağlıdır; kart açıkça checked politika istemektedir."], tags: ["custom-exception", "throw", "throws", "checked"]
    }),
    q({
      id: "J32-02", version: "1.1.0", sourceId: "J32", topic: "throw ve throws", difficulty: "Orta", type: "match",
      prompt: "Exception ile ilgili öğeleri işlevleriyle eşleştirin.",
      pairs: { left: [{ id: "throw", text: "throw" }, { id: "throws", text: "throws" }, { id: "checked", text: "extends Exception (RuntimeException değil)" }, { id: "unchecked", text: "extends RuntimeException" }], right: [{ id: "r1", text: "Bir Throwable nesnesini o noktada fırlatır" }, { id: "r2", text: "Metot/constructor bildiriminde kaçabilecek türleri listeler" }, { id: "r3", text: "Derleyici catch-or-declare kuralına tabidir" }, { id: "r4", text: "Catch-or-declare zorunluluğu yoktur" }, { id: "decoy", text: "Fırlatılan exception'ı yakalayıp işleyen blok" }] },
      answer: { throw: "r1", throws: "r2", checked: "r3", unchecked: "r4" }, acceptedAnswers: [], caseSensitive: false,
      hint: "Tekil eylem ile metot sözleşmesini ayırın.",
      explanationShort: "throw eylemdir, throws bildirimdir; kalıtım checked niteliğini belirler.",
      explanationLong: "throw'dan sonra Throwable türünde bir expression gelir. throws metot başlığında virgülle türleri listeler. Checked exception kaçarsa bildirilmek/yakalanmak zorundadır; RuntimeException alt tiplerinde bu derleyici zorunluluğu yoktur.",
      optionExplanations: {}, assumptions: ["Exception doğrudan Exception veya RuntimeException hiyerarşisinden türetilir; sneaky-throw gibi generic hileler kapsam dışıdır."], tags: ["throw", "throws", "exception"]
    }),

    q({
      id: "J33-01", version: "1.1.0", sourceId: "J33", topic: "Interface ve abstract class", difficulty: "Orta", type: "match",
      prompt: "Tasarım ihtiyaçlarını en uygun temel araçla eşleştirin.",
      pairs: { left: [{ id: "contract", text: "İlişkisiz sınıflara ortak davranış sözleşmesi ve çoklu tip kalıtımı" }, { id: "state", text: "Alt sınıflarla protected ortak mutable durum ve constructor zinciri paylaşma" }, { id: "default", text: "Java 8'de sözleşmeye geriye uyumlu varsayılan davranış ekleme" }, { id: "single", text: "Tek bir sınıf implementasyon hiyerarşisinde ortak kod/şablon" }], right: [{ id: "interface", text: "Interface" }, { id: "abstract", text: "Abstract class" }, { id: "idefault", text: "Interface default method" }, { id: "aclass", text: "Abstract class" }, { id: "decoy", text: "Final class" }] },
      answer: { contract: "interface", state: "abstract", default: "idefault", single: "aclass" }, acceptedAnswers: [], caseSensitive: false,
      hint: "Sözleşme/çoklu implementasyon ile ortak instance state/constructor ihtiyacını ayırın.",
      explanationShort: "Interface çoklu sözleşme; abstract class ortak durum, constructor ve güçlü ortak implementasyon içindir.",
      explanationLong: "Bir sınıf tek bir sınıfı extend ederken birden çok interface implement edebilir. Abstract class instance field, erişim seviyeleri ve constructor sağlar. Java 8 interface default/static metotları davranış evrimine izin verir; interface field'ları ise public static final sabitlerdir.",
      optionExplanations: {}, assumptions: ["Java 8 ortak özellikleri esas alınır; private interface method gibi Java 9+ ekleri sorulmaz."], tags: ["interface", "abstract-class", "design"]
    }),
    q({
      id: "J33-02", sourceId: "J33", topic: "Interface ve abstract class", difficulty: "Orta", type: "multi",
      prompt: "Java 8 için doğru ifadeleri seçin.",
      options: [{ id: "a", text: "Bir sınıf birden fazla interface implement edebilir" }, { id: "b", text: "Bir sınıf birden fazla concrete/abstract sınıfı doğrudan extend edebilir" }, { id: "c", text: "Abstract class constructor içerebilir" }, { id: "d", text: "Interface instance field taşıyabilir" }, { id: "e", text: "Interface default ve static metot tanımlayabilir" }],
      answer: ["a", "c", "e"], acceptedAnswers: [], caseSensitive: false,
      hint: "Java'da sınıf kalıtımı tekli, interface implementasyonu çokludur.",
      explanationShort: "Çoklu interface, abstract constructor ve Java 8 default/static interface metotları desteklenir.",
      explanationLong: "Java sınıfları tek bir doğrudan superclass'a sahiptir. Abstract class örneklenemese de alt sınıf construction sırasında çalışan constructor'lara sahiptir. Interface alanları örtük public static final'dır; nesne başına mutable state değildir.",
      optionExplanations: { a: "Doğru çoklu tip sözleşmesidir.", b: "Yanlış; sınıf kalıtımı tektir.", c: "Doğru; super zincirinde çağrılır.", d: "Yanlış; bildirilen alanlar sabittir.", e: "Doğru Java 8 özelliğidir." }, assumptions: ["Java 8 özellik kümesiyle cevaplanır."], tags: ["interface", "abstract-class", "java8"]
    }),

    q({
      id: "J34-01", sourceId: "J34", topic: "Generic sınıflar", difficulty: "Orta", type: "fill",
      prompt: "Boşluğu, herhangi bir referans türünde değer saklayan generic sınıf bildirimi olacak şekilde doldurun: `class Box___ { private T value; }`",
      answer: "<T>", acceptedAnswers: ["< T >"], caseSensitive: true,
      hint: "Tür parametresi sınıf adından hemen sonra açılı ayraçlarla bildirilir.",
      explanationShort: "Doğru bildirim `class Box<T>` biçimindedir.",
      explanationLong: "T sınıfın type parameter'ıdır ve field, constructor, getter/setter imzalarında kullanılabilir. Kullanımda `Box<String>` veya `Box<Integer>` concrete type argument verir. Primitive doğrudan type argument olamaz; wrapper kullanılır.",
      optionExplanations: {}, assumptions: ["Cevap yalnız eksik sözdizim parçasıdır; çevresel boşluklar kontrollü normalleştirilir, T büyük-küçük harfe duyarlıdır."], tags: ["generics", "type-parameter", "fill"]
    }),
    q({
      id: "J34-02", sourceId: "J34", topic: "Generic sınıflar", difficulty: "Orta", type: "output",
      prompt: "Kodun çıktısını yazın.",
      code: "class Box<T> {\n    private T value;\n    Box(T value) { this.value = value; }\n    T get() { return value; }\n}\nBox<String> word = new Box<>(\"Java\");\nBox<Integer> number = new Box<>(42);\nSystem.out.println(word.get() + \" \" + number.get());",
      answer: "Java 42", acceptedAnswers: [], caseSensitive: true,
      hint: "Her Box kullanımı kendi type argument'ıyla tip güvenli değer döndürür.",
      explanationShort: "`Java 42` yazdırılır.",
      explanationLong: "word.get derleme zamanında String, number.get Integer döndürür. String birleştirme bağlamında Integer metne çevrilir. Çağıran açık cast yazmaz ve raw type uyarısı oluşmaz.",
      optionExplanations: {}, assumptions: ["Kod aynı geçerli çevrede çalışır; diamond inference Java 7+ ile kullanılabilir."], tags: ["generics", "box", "type-safety", "output"]
    }),

    q({
      id: "J35-01", sourceId: "J35", topic: "Raw type ve tip güvenliği", difficulty: "Orta", type: "single",
      prompt: "Kod derleme uyarıları göz ardı edilip çalıştırılırsa son satırda ne olur?",
      code: "List values = new ArrayList();\nvalues.add(\"Java\");\nvalues.add(42);\nString first = (String) values.get(1);",
      options: [{ id: "a", text: "first değeri \"42\" olur" }, { id: "b", text: "ClassCastException oluşur" }, { id: "c", text: "Integer otomatik String'e çevrilir" }, { id: "d", text: "IndexOutOfBoundsException oluşur" }],
      answer: "b", acceptedAnswers: [], caseSensitive: false,
      hint: "1. indeksteki nesne autobox edilmiş Integer'dır.",
      explanationShort: "Integer nesnesi String'e cast edilemediği için ClassCastException oluşur.",
      explanationLong: "Raw List farklı türleri kabul eder ve get sonucu Object olarak görünür. 42 autoboxing ile Integer olur. Explicit String cast derlenir ama runtime type kontrolünde başarısız olur. İndeks 1 geçerlidir.",
      optionExplanations: { a: "Cast biçim dönüştürme değildir.", b: "Doğru runtime hatasıdır.", c: "Cast otomatik toString çağırmaz.", d: "İki eleman olduğundan indeks 1 geçerlidir." }, assumptions: ["Unchecked/raw type derleme uyarıları hata olarak yapılandırılmamıştır; kod çalıştırılır."], tags: ["raw-type", "classcastexception", "generics"]
    }),
    q({
      id: "J35-02", version: "1.1.0", sourceId: "J35", topic: "Raw type ve tip güvenliği", difficulty: "Orta", type: "single",
      prompt: "Liste yalnız String saklamalıysa en tip güvenli düzeltme hangisidir?",
      options: [{ id: "a", text: "`List<String> values = new ArrayList<>();` kullanıp 42 eklemesini kaldırmak veya metne çevirmek" }, { id: "b", text: "Raw List'i koruyup her get sonucunu String'e cast etmek" }, { id: "c", text: "`List<Object>` kullanıp her get sonucunu `(String)` ile cast etmek; 42 eklenirse hata çalışma zamanında yakalanır" }, { id: "d", text: "`List<int>` kullanmak" }],
      answer: "a", acceptedAnswers: [], caseSensitive: false,
      hint: "Yanlış türün eklenmesini derleme zamanında engelleyin.",
      explanationShort: "List<String> generic bildirimi yalnız String eklenmesini sağlar.",
      explanationLong: "Generic tür bilgisi add çağrısında Integer'ı reddeder ve get sonucunu String olarak verir. Raw/Object çözümleri gereksiz cast ve runtime riskini korur. Generics primitive type argument kabul etmez.",
      optionExplanations: { a: "Doğru compile-time güvenliktir.", b: "Raw type riskini sürdürür.", c: "Tip güvenliği derleme zamanından çalışma zamanına kayar; gereksinim karşılanmaz.", d: "Primitive generic type argument geçersizdir." }, assumptions: ["Gereksinim listenin heterojen değil yalnız String olmasıdır."], tags: ["generics", "list", "type-safety"]
    }),

    q({
      id: "J36-01", version: "1.1.0", sourceId: "J36", topic: "Koleksiyon dolaşırken silme", difficulty: "Orta", type: "single",
      prompt: "Kod standart ArrayList ile çalıştırıldığında tipik olarak ne olur?",
      code: "List<String> names = new ArrayList<>(Arrays.asList(\"Ali\", \"Ayşe\", \"Ahmet\"));\nfor (String name : names) {\n    if (name.startsWith(\"A\")) {\n        names.remove(name);\n    }\n}",
      options: [{ id: "a", text: "Tüm öğeler güvenle silinir" }, { id: "b", text: "Iterator dışından yapısal değişiklik nedeniyle ConcurrentModificationException oluşur" }, { id: "c", text: "Kod yalnız birden fazla thread listeyi aynı anda değiştirirse hata verir; tek thread'de güvenlidir" }, { id: "d", text: "String immutable olduğu için derlenmez" }],
      answer: "b", acceptedAnswers: [], caseSensitive: false,
      hint: "Enhanced for, arka planda Iterator kullanır.",
      explanationShort: "List.remove, aktif iterator'ın beklediği modCount'u bozar ve fail-fast hata doğurur.",
      explanationLong: "Enhanced for ArrayList iterator'ıyla yürür. Iterator'ın kendi remove'u dışında listede yapısal değişiklik yapılınca sonraki iterator işlemi modCount uyuşmazlığını görür ve best-effort ConcurrentModificationException atar. Adı concurrency olsa da tek thread'de de olur.",
      optionExplanations: { a: "Iterator protokolü ihlal edilir.", b: "Doğru standart fail-fast davranıştır.", c: "Tek thread'de de for-each sırasında yapılan yapısal değişiklik ConcurrentModificationException tetikler.", d: "Liste yapısı mutable'dır; sorun String mutability değildir." }, assumptions: ["Standart java.util.ArrayList iterator'ı ve verilen üç öğe kullanılır; fail-fast mekanizması program doğruluğu için garanti edilen senkronizasyon değildir."], tags: ["concurrentmodificationexception", "iterator", "remove"]
    }),
    q({
      id: "J36-02", sourceId: "J36", topic: "Koleksiyon dolaşırken silme", difficulty: "Orta", type: "multi",
      prompt: "`startsWith(\"A\")` olan adları ArrayList'ten güvenle silen yaklaşımları seçin.",
      options: [{ id: "a", text: "`names.removeIf(name -> name.startsWith(\"A\"));`" }, { id: "b", text: "Explicit Iterator ile dolaşıp eşleşmede `iterator.remove()` çağırmak" }, { id: "c", text: "Enhanced for içinde `names.remove(name)` çağırmak" }, { id: "d", text: "İndeksle sondan başa dolaşıp eşleşen indeksi silmek" }, { id: "e", text: "Her turda listeyi null yapmak" }],
      answer: ["a", "b", "d"], acceptedAnswers: [], caseSensitive: false,
      hint: "Silme işlemi iterator protokolüyle veya indeks kaymasını kontrol eden bir yönle yapılmalı.",
      explanationShort: "removeIf, Iterator.remove ve sondan indeksli silme güvenli kalıplardır.",
      explanationLong: "removeIf koleksiyonun kendi toplu işlemini kullanır. Iterator.remove son dönen öğeyi iterator ile uyumlu siler. Sondan başa indeksleme, silmenin henüz ziyaret edilmemiş daha küçük indeksleri kaydırmamasını sağlar.",
      optionExplanations: { a: "Doğru Java 8 çözümüdür.", b: "Doğru iterator protokolüdür.", c: "Fail-fast ihlaldir.", d: "Doğru indeks kayması kontrolüdür.", e: "Gereksinimi karşılamaz ve sonraki erişimleri bozar." }, assumptions: ["names mutable ArrayList'tir ve null eleman içermez."], tags: ["removeif", "iterator", "arraylist"]
    }),

    q({
      id: "J37-01", version: "1.1.0", sourceId: "J37", topic: "Generic wildcard PECS", difficulty: "Zorlayıcı", type: "match",
      prompt: "Wildcard listelerini güvenli okuma/ekleme özellikleriyle eşleştirin. null ekleme özel durumu dışarıda bırakılmıştır.",
      pairs: { left: [{ id: "extread", text: "List<? extends Number> içinden okuma" }, { id: "extwrite", text: "List<? extends Number> içine non-null sayı ekleme" }, { id: "superread", text: "List<? super Integer> içinden okuma" }, { id: "superwrite", text: "List<? super Integer> içine ekleme" }], right: [{ id: "r1", text: "Güvenle Number olarak okunur" }, { id: "r2", text: "Somut alt tip bilinmediği için güvenli değildir" }, { id: "r3", text: "Güvenle yalnız Object olarak okunur" }, { id: "r4", text: "Integer güvenle eklenir" }, { id: "decoy", text: "Herhangi bir Number alt tipi güvenle eklenir" }] },
      answer: { extread: "r1", extwrite: "r2", superread: "r3", superwrite: "r4" }, acceptedAnswers: [], caseSensitive: false,
      hint: "Producer extends, consumer super (PECS).",
      explanationShort: "extends Number üreticidir; super Integer tüketicidir.",
      explanationLong: "`? extends Number` gerçekte List<Integer>, List<Double> vb. olabilir; okunan her öğe Number'dır ama hangi alt tip beklendiği bilinmediğinden non-null eklenemez. `? super Integer` Integer veya üst tip listesi olduğundan Integer kabul eder; okuma ise yalnız Object garantiler.",
      optionExplanations: {}, assumptions: ["Listeler null değildir; wildcard listesine her durumda teknik olarak eklenebilen null, soruda açıkça kapsam dışıdır."], tags: ["generics", "wildcard", "pecs"]
    }),
    q({
      id: "J37-02", sourceId: "J37", topic: "Generic wildcard PECS", difficulty: "Zorlayıcı", type: "multi",
      prompt: "Aşağıdaki işlemlerden derleme zamanı açısından geçerli olanları seçin.",
      code: "List<? extends Number> source = new ArrayList<Integer>();\nList<? super Integer> target = new ArrayList<Number>();",
      options: [{ id: "a", text: "`Number n = source.get(0);`" }, { id: "b", text: "`source.add(1);`" }, { id: "c", text: "`target.add(1);`" }, { id: "d", text: "`Integer i = target.get(0);`" }, { id: "e", text: "`Object o = target.get(0);`" }],
      answer: ["a", "c", "e"], acceptedAnswers: [], caseSensitive: false,
      hint: "source'un alt tipi, target'ın üst tipi tam olarak bilinmiyor.",
      explanationShort: "source Number üretir; target Integer tüketir ve Object üretir.",
      explanationLong: "source.get'in static tipi Number'dır. source.add(1), source'un List<Double> olabilme olasılığı nedeniyle reddedilir. target Integer eklemeyi kabul eder; ancak get sonucu Integer garantili değildir, çünkü hedef List<Object> olabilir ve başka Object'ler içerebilir.",
      optionExplanations: { a: "Geçerli üst sınır okumasıdır; çalışma zamanında liste boşsa ayrı olarak IndexOutOfBounds olabilir.", b: "Derlenmez; capture tipi bilinmez.", c: "Derlenir; Integer alt sınır sözleşmesine uygundur.", d: "Derlenmez; okuma static olarak Object'tir.", e: "Derlenir; Object her olası öğenin üst tipidir." }, assumptions: ["Soru yalnız tip kontrolünü ölçer; `source.get(0)` çalışma zamanında boş liste nedeniyle hata verebilir fakat statement derlenir."], tags: ["extends", "super", "compile-time", "pecs"]
    }),

    q({
      id: "J38-01", version: "1.1.0", sourceId: "J38", topic: "Stack ve heap", difficulty: "Zorlayıcı", type: "match",
      prompt: "Yaygın JVM'in kavramsal bellek modelinde öğeleri ilişkileriyle eşleştirin.",
      code: "class User { String name; }\nstatic void createUser() {\n    int age = 22;\n    User user = new User();\n    user.name = \"Deniz\";\n}",
      pairs: { left: [{ id: "age", text: "Yerel primitive `age`" }, { id: "userref", text: "Yerel `user` referans değişkeni" }, { id: "userobj", text: "`new User()` nesnesi" }, { id: "namefield", text: "User içindeki `name` alanı" }], right: [{ id: "r1", text: "Metot çağrı çerçevesindeki yerel değer" }, { id: "r2", text: "Çağrı çerçevesindeki, nesneye erişen referans değeri" }, { id: "r3", text: "Heap'te erişilebilir nesne" }, { id: "r4", text: "User nesnesinin parçası olan ve String'e referans tutan alan" }, { id: "decoy", text: "Metot alanında tutulan sınıf meta verisi" }] },
      answer: { age: "r1", userref: "r2", userobj: "r3", namefield: "r4" }, acceptedAnswers: [], caseSensitive: false,
      hint: "Referans değişkeni ile gösterdiği nesneyi ayrı düşünün.",
      explanationShort: "Yerel değerler frame ile, nesne ve alanları heap nesnesiyle ilişkilidir.",
      explanationLong: "Pedagojik JVM modelinde method invocation bir frame oluşturur; age ve user değişken değerleri frame'dedir. new User nesnesi heap'tedir. name alanı User nesnesinin durumudur ve intern edilmiş/heap'teki String nesnesine referans taşır. JVM kaçış analiziyle fiziksel yerleşimi optimize edebilir.",
      optionExplanations: {}, assumptions: ["Bu eşleştirme kavramsal JVM modelidir; Java Language Specification fiziksel stack/heap yerleşimini program tarafından gözlenebilir bir garanti yapmaz."], tags: ["stack", "heap", "reference", "object"]
    }),
    q({
      id: "J38-02", sourceId: "J38", topic: "Stack ve heap", difficulty: "Zorlayıcı", type: "boolean",
      prompt: "Bir reference değişkeni ile onun gösterdiği nesne aynı şey değildir; yerel referansın kapsamdan çıkması, nesnenin ancak başka erişilebilir referans yoksa GC adayı olmasına katkı verir.",
      answer: true, acceptedAnswers: [], caseSensitive: false,
      hint: "GC değişken kapsamından çok nesne erişilebilirliğine bakar.",
      explanationShort: "Doğru. Referans bir erişim değeri, nesne ayrı bir runtime varlığıdır.",
      explanationLong: "createUser döndüğünde yerel user artık root değildir. User nesnesine başka bir erişim yolu yoksa erişilemez hâle gelir ve GC için uygun olur. Uygun olmak anında toplanacağı veya fiziksel yerleşimin kesinlikle heap olduğu garantisi değildir.",
      optionExplanations: { true: "Doğru reachability ayrımıdır.", false: "Referans ve nesneyi özdeş saymak bellek modelini yanlış yorumlar." }, assumptions: ["User referansı metottan döndürülmez, static/instance alana yazılmaz ve başka bir canlı yapıya sızdırılmaz."], tags: ["reference", "scope", "gc", "reachability"]
    }),

    q({
      id: "J39-01", sourceId: "J39", topic: "Garbage collection erişilebilirliği", difficulty: "Zorlayıcı", type: "single",
      prompt: "Kod tamamlandıktan hemen sonra, iki başlangıç nesnesinden hangisi GC için erişilemez hâle gelmiştir?",
      code: "Object first = new Object();   // nesne A\nObject second = new Object();  // nesne B\nfirst = second;\nsecond = null;",
      options: [{ id: "a", text: "Yalnız nesne A" }, { id: "b", text: "Yalnız nesne B" }, { id: "c", text: "Hem A hem B" }, { id: "d", text: "Hiçbiri" }],
      answer: "a", acceptedAnswers: [], caseSensitive: false,
      hint: "`first = second` sonrasında A'ya giden yolu ve B'ye kalan yolu izleyin.",
      explanationShort: "Nesne A erişilemez; B hâlâ first üzerinden erişilebilirdir.",
      explanationLong: "first yeniden B referans değeriyle yazılınca A'ya giden tek referans kaybolur. Ardından second null olsa da first B'yi göstermeye devam eder. Dolayısıyla yalnız A GC için uygundur.",
      optionExplanations: { a: "Doğru reachability sonucudur.", b: "B first üzerinden canlıdır.", c: "B erişilebilir olduğu için yanlış.", d: "A'nın hiçbir yolu kalmamıştır." }, assumptions: ["A veya B'ye başka alan, koleksiyon, JNI ya da runtime kökü üzerinden referans yoktur; değişkenler bu satırdan sonra hâlâ kapsam içindedir."], tags: ["gc", "reachability", "reference"]
    }),
    q({
      id: "J39-02", sourceId: "J39", topic: "Garbage collection erişilebilirliği", difficulty: "Zorlayıcı", type: "boolean",
      prompt: "Bir nesnenin GC için uygun hâle gelmesi, o satırın hemen ardından belleğinin kesin olarak geri alınacağı anlamına gelir.",
      answer: false, acceptedAnswers: [], caseSensitive: false,
      hint: "Uygunluk ile koleksiyonun zamanlamasını ayırın.",
      explanationShort: "Yanlış. Erişilemezlik yalnız toplanabilirlik sağlar; zamanlama garanti değildir.",
      explanationLong: "Garbage collector ne zaman çalışacağına JVM politikasıyla karar verir. `System.gc()` bile genellikle yalnız bir istektir. Program doğruluğu, finalization veya kaynak kapatma için GC'nin belirli zamanda çalışmasına bağlanmamalıdır.",
      optionExplanations: { true: "GC zamanlaması deterministik değildir.", false: "Doğru; eligible ile collected farklıdır." }, assumptions: ["Normal JVM garbage collection davranışı kastedilir; process sonlandırılması ayrı bir durumdur."], tags: ["gc", "nondeterminism", "eligibility"]
    }),

    q({
      id: "J40-01", version: "1.1.0", sourceId: "J40", topic: "equals ve hashCode sözleşmesi", difficulty: "Zorlayıcı", type: "single",
      prompt: "Candidate nesneleri yalnız id alanına göre eşit olacaksa en doğru Java 8 uygulaması hangisidir? id constructor'da atanmış final int'tir.",
      options: [
        { id: "a", text: "`public boolean equals(Object o) { if (this == o) return true; if (!(o instanceof Candidate)) return false; Candidate c=(Candidate)o; return id==c.id; } public int hashCode() { return Integer.hashCode(id); }`" },
        { id: "b", text: "`public boolean equals(Object o) { if (this == o) return true; if (!(o instanceof Candidate)) return false; Candidate c=(Candidate)o; return id==c.id; } public int hashCode() { return Objects.hash(id, System.identityHashCode(this)); }`" },
        { id: "c", text: "equals override edilmez; `public int hashCode() { return id; }`" },
        { id: "d", text: "`public boolean equals(Candidate c) { return id==c.id; }` ve `public int hashCode(){ return 1; }`" }
      ],
      answer: "a", acceptedAnswers: [], caseSensitive: false,
      hint: "Object imzasını override edin; null/tür kontrolü yapın ve aynı alanı hashCode'da kullanın.",
      explanationShort: "A, Object.equals'i güvenle override eder ve hashCode'u id ile tutarlı kurar.",
      explanationLong: "Kimlik kısa yolu refleksiviteyi hızlı karşılar. instanceof null için false döner ve güvenli cast sağlar. id eşitliği değer ölçütüdür. Eşit id'ler aynı Integer.hashCode üretir. equals(Candidate) overload olur, Object.equals override'ı olmaz.",
      optionExplanations: { a: "Doğru ve sözleşmeyle uyumludur.", b: "hashCode nesne kimliğini kattığı için eşit iki Candidate farklı hash üretebilir; hash sözleşmesi bozulur.", c: "Eşitliği id bazlı yapmaz.", d: "Object.equals'i override etmez; yalnız overload eder." }, assumptions: ["Candidate final sınıftır veya alt sınıf eşitliği ayrıca kısıtlanmıştır; id immutable'dır.", "Integer.hashCode(int) Java 8'de mevcuttur."], tags: ["equals", "hashcode", "candidate", "immutable-key"]
    }),
    q({
      id: "J40-02", sourceId: "J40", topic: "equals ve hashCode sözleşmesi", difficulty: "Zorlayıcı", type: "multi",
      prompt: "equals/hashCode sözleşmesi hakkında doğru ifadeleri seçin.",
      options: [{ id: "a", text: "x.equals(x) true olmalıdır (x null değilken)" }, { id: "b", text: "x.equals(y) true ise y.equals(x) de true olmalıdır" }, { id: "c", text: "equals ile eşit nesneler aynı hashCode'u üretmelidir" }, { id: "d", text: "Aynı hashCode üreten nesneler mutlaka equals ile eşit olmalıdır" }, { id: "e", text: "x.equals(null) false olmalıdır" }],
      answer: ["a", "b", "c", "e"], acceptedAnswers: [], caseSensitive: false,
      hint: "Hash collision mümkündür; sözleşme tek yönde zorunludur.",
      explanationShort: "Refleksivite, simetri, null-false ve eşit nesnelerde aynı hash zorunludur; aynı hash eşitlik garantilemez.",
      explanationLong: "equals ayrıca transitif ve tutarlı olmalıdır. hashCode, eşitlikte kullanılan durum değişmediği sürece tutarlı olmalıdır. Collision nedeniyle farklı nesneler aynı hash'i paylaşabilir. Sözleşme bozulursa HashSet duplicate/contains ve HashMap get/remove beklenmedik davranabilir.",
      optionExplanations: { a: "Refleksivite kuralıdır.", b: "Simetri kuralıdır.", c: "Hash sözleşmesidir.", d: "Yanlış; collision serbesttir.", e: "Non-null nesne için gereklidir." }, assumptions: ["equals normal Java Object sözleşmesini uygulamak üzere tasarlanır; proxy/framework özel eşitlikleri kapsam dışıdır."], tags: ["equals-contract", "hashcode-contract", "hash-collections"]
    }),

    q({
      id: "J41-01", sourceId: "J41", topic: "Mutable HashMap anahtarı", difficulty: "Zorlayıcı", type: "output",
      prompt: "`equals` ve `hashCode` yalnız id'yi kullanıyor ve hashCode `Integer.hashCode(id)` döndürüyor. Standart HashMap'te kodun çıktısını yazın.",
      code: "Key key = new Key(1);\nMap<Key, String> map = new HashMap<>();\nmap.put(key, \"value\");\nkey.id = 2;\nSystem.out.println(map.get(key));",
      answer: "null", acceptedAnswers: [], caseSensitive: true,
      hint: "Entry eklenirken hesaplanan hash/bucket, anahtar nesnesinin içinde sonradan otomatik güncellenmez.",
      explanationShort: "`null` yazdırılır; mutasyondan sonra arama farklı hash ile yapılır.",
      explanationLong: "put sırasında id=1 hash'i entry'de saklanır ve bucket seçer. id=2 olduktan sonra get yeni hash hesaplar; saklı entry'nin hash'iyle eşleşmez ve entry bulunamaz. Nesne map'in içinde fiziksel olarak kalabilir fakat normal anahtarla erişilemez hâle gelir.",
      optionExplanations: {}, assumptions: ["Key.hashCode tam olarak Integer.hashCode(id), equals id bazlıdır; id 1 ve 2 farklı yayılmış hash üretir; map'te başka eş anahtar/değer yoktur."], tags: ["hashmap", "mutable-key", "hashcode", "output"]
    }),
    q({
      id: "J41-02", sourceId: "J41", topic: "Mutable HashMap anahtarı", difficulty: "Zorlayıcı", type: "single",
      prompt: "HashMap anahtarında bu sorunu en sağlam biçimde önleyen tasarım hangisidir?",
      options: [{ id: "a", text: "Eşitlik/hashCode'da kullanılan id'yi final yapıp anahtarı immutable tasarlamak" }, { id: "b", text: "Anahtarı ekledikten sonra hashCode metodunu rastgele değer döndürecek biçimde değiştirmek" }, { id: "c", text: "Her get öncesi id'yi artırmak" }, { id: "d", text: "equals'i kaldırıp yalnız mutable hashCode bırakmak" }],
      answer: "a", acceptedAnswers: [], caseSensitive: false,
      hint: "Anahtar map içindeyken hash/eşitlik durumu sabit kalmalı.",
      explanationShort: "Eşitlikte kullanılan alanların immutable olması hash koleksiyonlarını güvenli kılar.",
      explanationLong: "HashMap entry'yi her anahtar mutasyonunda otomatik yeniden bucket'lamaz. Bu nedenle anahtarın equals/hashCode'a katılan state'i değişmemelidir. Değişim zorunluysa eski anahtar remove edilip yeni anahtarla tekrar put yapılmalıdır.",
      optionExplanations: { a: "Doğru temel tasarım kuralıdır.", b: "Aramayı daha da kararsız yapar.", c: "Her aramada farklı bucket seçer.", d: "Sözleşmeyi ve değer eşitliğini bozabilir." }, assumptions: ["Anahtar değer semantiği id'ye bağlıdır; identity-based özel map gereksinimi yoktur."], tags: ["immutable", "map-key", "hashmap"]
    }),

    q({
      id: "J42-01", version: "1.1.0", sourceId: "J42", topic: "Immutable sınıf tasarımı", difficulty: "Zorlayıcı", type: "single",
      prompt: "Java 8'de `User(String name, List<String> roles)` sınıfını gerçekten immutable yapmaya en uygun yaklaşım hangisidir?",
      options: [
        { id: "a", text: "Sınıfı final, alanları private final yap; constructor'da `this.roles = Collections.unmodifiableList(new ArrayList<>(roles));`; getter'da bu değiştirilemez listeyi döndür" },
        { id: "b", text: "Sınıfı final, alanları private final yap; constructor'da `this.roles = roles;` ata, getter'da her seferinde `Collections.unmodifiableList(roles)` döndürerek yalnız okunur görünüm ver" },
        { id: "c", text: "roles getter'ında doğrudan mutable internal ArrayList döndür" },
        { id: "d", text: "Sınıfı final yap ama roles alanını public bırak" }
      ],
      answer: "a", acceptedAnswers: [], caseSensitive: false,
      hint: "Hem constructor'a verilen listenin alias'ını hem getter üzerinden mutasyonu kapatın.",
      explanationShort: "Defensive copy + unmodifiable görünüm, mutable listenin iki dış erişim yolunu da kapatır.",
      explanationLong: "Constructor yalnız unmodifiableList(roles) yapsaydı çağıran orijinal listeyi değiştirerek iç durumu etkileyebilirdi. Önce new ArrayList ile snapshot alınır, sonra dış mutasyon kapatılır. final sınıf override ile state sızdırılmasını; private final alanlar yeniden atamayı engeller. String zaten immutable'dır.",
      optionExplanations: { a: "Doğru Java 8 defensive-copy kalıbıdır.", b: "Kopya alınmadığı için çağıran elindeki roles listesini değiştirerek nesnenin iç durumunu değiştirebilir.", c: "Getter iç durumu mutasyona açar.", d: "Public liste doğrudan değiştirilebilir." }, assumptions: ["Constructor Objects.requireNonNull ile name ve roles null durumunu reddeder; roles içinde null kabul politikası ayrıca seçilebilir.", "Role elemanları String olduğu için eleman düzeyinde deep copy gerekmez."], tags: ["immutability", "defensive-copy", "unmodifiable-list"]
    }),
    q({
      id: "J42-02", sourceId: "J42", topic: "Immutable sınıf tasarımı", difficulty: "Zorlayıcı", type: "multi",
      prompt: "Mutable bir `List<String>` alanı bulunan immutable sınıf için gerekli/uygun önlemleri seçin.",
      options: [{ id: "a", text: "Alanı private final yapmak" }, { id: "b", text: "Constructor girdisinin defensive copy'sini almak" }, { id: "c", text: "Getter'dan mutable iç listeyi doğrudan döndürmemek" }, { id: "d", text: "Sınıfın kontrolsüz alt sınıfla davranış/state sızdırmasını engellemek için final yapmak" }, { id: "e", text: "Yalnız referansı final yapmak; başka önleme gerek yok" }],
      answer: ["a", "b", "c", "d"], acceptedAnswers: [], caseSensitive: false,
      hint: "İç state'e giren ve çıkan bütün alias yollarını düşünün.",
      explanationShort: "Alan kapsülleme, giriş/çıkış kopyalama-koruma ve kalıtım kontrolü birlikte gerekir.",
      explanationLong: "final referans yeniden atanmayı önler ama nesneyi dondurmaz. Constructor alias'ı defensive copy ile kesilir. Getter unmodifiable görünüm veya yeni kopya döndürür. final sınıf, override edilen getter veya ek mutasyon davranışlarıyla sözleşmenin bozulmasını önleyen basit yaklaşımdır.",
      optionExplanations: { a: "Durum erişimini ve yeniden bağlamayı sınırlar.", b: "Girdi alias'ını keser.", c: "Çıktı alias'ı üzerinden mutasyonu önler.", d: "Kalıtım yüzeyini kapatır.", e: "Nesne hâlâ mutable olduğundan yetersizdir." }, assumptions: ["List elemanları immutable String'dir; nested mutable elemanlar olsaydı daha derin kopyalama politikası gerekirdi."], tags: ["immutable-class", "encapsulation", "defensive-copy"]
    }),

    q({
      id: "J43-01", sourceId: "J43", topic: "Thread start ve run", difficulty: "Zorlayıcı", type: "output",
      prompt: "Kod bir main thread içinde çalışıyor. Standart çıktıyı satır sırasıyla yazın.",
      code: "Thread.currentThread().setName(\"caller\");\nThread worker = new Thread(\n    () -> System.out.println(Thread.currentThread().getName()),\n    \"worker\"\n);\nworker.run();\nworker.start();\nworker.join();",
      answer: "caller\nworker", acceptedAnswers: ["caller\r\nworker"], caseSensitive: true,
      hint: "run normal metot çağrısıdır; start yeni thread planlar. join tamamlanmayı bekler.",
      explanationShort: "run çağrısı caller'da, start ile başlayan görev worker thread'inde çalışır.",
      explanationLong: "`worker.run()` doğrudan senkron metot çağrısıdır ve currentThread caller'dır. `worker.start()` JVM'den yeni thread başlatmasını ister; o thread run gövdesini yürütür ve adı worker'dır. join, programın ikinci satır tamamlanmadan ilerlememesini sağlar.",
      optionExplanations: {}, assumptions: ["setName izni vardır; start başarıyla gerçekleşir; InterruptedException çevreleyen main tarafından bildirilmiş/yakalanmıştır."], tags: ["thread", "run", "start", "join", "output"]
    }),
    q({
      id: "J43-02", version: "1.1.0", sourceId: "J43", topic: "Thread start ve run", difficulty: "Zorlayıcı", type: "match",
      prompt: "Thread çağrılarını etkileriyle eşleştirin.",
      pairs: { left: [{ id: "run", text: "worker.run()" }, { id: "start", text: "worker.start()" }, { id: "join", text: "worker.join()" }, { id: "restart", text: "Tamamlanmış aynı worker üzerinde ikinci start()" }], right: [{ id: "r1", text: "Çağıran thread'de normal metot çağrısı" }, { id: "r2", text: "Yeni thread yaşam döngüsünü başlatır ve run orada yürür" }, { id: "r3", text: "Çağıran thread worker'ın bitmesini bekler" }, { id: "r4", text: "IllegalThreadStateException" }, { id: "decoy", text: "Thread'i hemen durdurur ve kilitlerini bırakır" }] },
      answer: { run: "r1", start: "r2", join: "r3", restart: "r4" }, acceptedAnswers: [], caseSensitive: false,
      hint: "Bir Thread nesnesi yalnız bir kez start edilebilir.",
      explanationShort: "run çağrıdır; start yeni yürütmedir; join bekler; aynı Thread yeniden başlatılamaz.",
      explanationLong: "start happens-before ve lifecycle kurallarını kurar. run'ı elle çağırmak yeni thread oluşturmaz. join bekleyen thread'i bloklayabilir ve InterruptedException atabilir. Tekrar iş çalıştırmak için yeni Thread veya executor görevi gerekir.",
      optionExplanations: {}, assumptions: ["Etiketsiz normal java.lang.Thread API'si kullanılır; virtual thread gibi Java 21 özellikleri kapsam dışıdır."], tags: ["thread-lifecycle", "start", "run", "join"]
    }),

    q({
      id: "J44-01", version: "1.1.0", sourceId: "J44", topic: "Race condition", difficulty: "Zorlayıcı", type: "single",
      prompt: "İki thread aynı Counter üzerinde `increment()` çağırdığında artışların kaybolabilmesinin temel nedeni nedir?",
      code: "class Counter {\n    int value = 0;\n    void increment() { value++; }\n}",
      options: [{ id: "a", text: "`value++` atomik bir işlem değildir" }, { id: "b", text: "int yalnız tek thread'de kullanılabilen bir tiptir" }, { id: "c", text: "Her thread increment çağırırken Counter nesnesinin ayrı bir kopyasını alır; artışlar farklı kopyalara yazılır" }, { id: "d", text: "Metot void olduğu için artış uygulanmaz" }],
      answer: "a", acceptedAnswers: [], caseSensitive: false,
      hint: "Her thread aynı eski değeri okuyup aynı yeni değeri yazabilir.",
      explanationShort: "value++ birleşik ve atomik olmayan bir read-modify-write işlemidir.",
      explanationLong: "İki thread ikisi de örneğin 5 okuyabilir, 6 hesaplayabilir ve 6 yazabilir; iki çağrıdan yalnız bir net artış görünür. Ayrıca uygun synchronization olmadan visibility garantisi de yoktur. int tek okuma/yazmanın atomik olması, ++ işleminin tamamını atomik yapmaz.",
      optionExplanations: { a: "Doğru lost-update yarışıdır.", b: "int thread'e bağlı değildir.", c: "Thread'ler aynı nesne referansını paylaşır; Java metot çağrısında nesneyi kopyalamaz.", d: "void yalnız dönüş değeri olmadığını belirtir." }, assumptions: ["Aynı Counter nesnesi birden çok thread tarafından paylaşılır; external synchronization yoktur."], tags: ["race-condition", "atomicity", "visibility"]
    }),
    q({
      id: "J44-02", sourceId: "J44", topic: "Race condition", difficulty: "Zorlayıcı", type: "multi",
      prompt: "Paylaşılan sayacı thread-safe artırabilecek temel çözümleri seçin.",
      options: [{ id: "a", text: "`synchronized void increment() { value++; }`" }, { id: "b", text: "`AtomicInteger` kullanıp `incrementAndGet()` çağırmak" }, { id: "c", text: "Tüm erişimleri aynı `ReentrantLock` ile korumak ve finally'da unlock yapmak" }, { id: "d", text: "Alanı yalnız `volatile int` yapmak ve `value++` kullanmaya devam etmek" }, { id: "e", text: "Thread'lere rastgele sleep eklemek" }],
      answer: ["a", "b", "c"], acceptedAnswers: [], caseSensitive: false,
      hint: "Çözüm tüm read-modify-write işlemini tek kritik işlem yapmalı.",
      explanationShort: "synchronized, AtomicInteger veya doğru Lock kullanımı atomikliği sağlar; volatile tek başına ++ için yetmez.",
      explanationLong: "synchronized ve ReentrantLock karşılıklı dışlama ile hem atomiklik hem visibility kurar. AtomicInteger CAS tabanlı atomik artış sağlar. volatile yalnız tekil okuma/yazmaların görünürlüğünü ve sıralamasını iyileştirir; birleşik ++ kayıp güncellemeye açıktır. sleep bir senkronizasyon mekanizması değildir.",
      optionExplanations: { a: "Doğru monitor korumasıdır.", b: "Doğru atomik API'dir.", c: "Doğru, aynı lock disipliniyle.", d: "Yetersiz; ++ atomik olmaz.", e: "Zamanlamayı değiştirir ama doğruluk garantisi vermez." }, assumptions: ["Sayaç okuma/sıfırlama gibi diğer tüm ilişkili işlemler de aynı synchronization politikasına uyar."], tags: ["synchronized", "atomicinteger", "lock", "volatile"]
    }),

    q({
      id: "J45-01", sourceId: "J45", topic: "Deadlock", difficulty: "Zorlayıcı", type: "boolean",
      prompt: "İlk thread lockA'yı, ikinci thread lockB'yi aldıktan sonra her biri diğer kilidi beklerse verilen program deadlock'a girebilir.",
      code: "// first: synchronized(lockA) { synchronized(lockB) { ... } }\n// second: synchronized(lockB) { synchronized(lockA) { ... } }",
      answer: true, acceptedAnswers: [], caseSensitive: false,
      hint: "Karşılıklı bekleme için kilit edinme sıralarını karşılaştırın.",
      explanationShort: "Doğru. Ters kilit sırası dairesel bekleme oluşturabilir.",
      explanationLong: "first A'yı tutup B'yi beklerken second B'yi tutup A'yı bekleyebilir. synchronized kilitleri başka kilit beklerken otomatik bırakılmaz; iki thread de ilerleyemez. Deadlock mümkündür fakat her çalıştırmada oluşması garanti değildir.",
      optionExplanations: { true: "Uygun zamanlamada dört Coffman koşulu oluşur.", false: "JVM ters sırayı otomatik tespit edip çözmez." }, assumptions: ["lockA ve lockB farklı, null olmayan ortak nesnelerdir; başka kod kilitleri zorla bırakmaz."], tags: ["deadlock", "synchronized", "circular-wait"]
    }),
    q({
      id: "J45-02", sourceId: "J45", topic: "Deadlock", difficulty: "Zorlayıcı", type: "order",
      prompt: "Global kilit sıralamasıyla deadlock riskini azaltan adımları sıraya koyun.",
      items: [{ id: "define", text: "Tüm kilitler için tek bir global sıra tanımla (ör. A önce B)" }, { id: "first", text: "Her thread önce sıradaki ilk kilidi A'yı alsın" }, { id: "second", text: "Gerekliyse A tutulurken sonra B'yi alsın" }, { id: "work", text: "Kritik işi yapıp içten dışa kilit kapsamlarından çıksın" }],
      answer: ["define", "first", "second", "work"], acceptedAnswers: [], caseSensitive: false,
      hint: "Dairesel beklemeyi kırmak için bütün kod yolları aynı sıralamaya uymalı.",
      explanationShort: "Tek global sıra belirlenip her yerde A→B uygulanırsa A↔B çevrimi oluşmaz.",
      explanationLong: "Lock ordering dairesel bekleme koşulunu ortadan kaldırır. Yalnız bir thread'i düzeltmek yetmez; aynı kilit çiftine dokunan bütün yollar aynı düzene uymalıdır. synchronized bloklardan çıkarken monitor'lar lexical olarak içten dışa serbest kalır.",
      optionExplanations: {}, assumptions: ["Uygulamadaki bu kilitleri alan tüm kod yolları tanımlanan sıraya uyar; callback'ler bilinmeyen ek kilitler almaz."], tags: ["deadlock-prevention", "lock-ordering", "order"]
    }),
    q({
      id: "J45-03", sourceId: "J45", topic: "Deadlock", difficulty: "Zorlayıcı", type: "multi",
      prompt: "Deadlock riskini azaltan geçerli yaklaşımları seçin.",
      options: [{ id: "a", text: "Tüm kod yollarında tutarlı global kilit sırası kullanmak" }, { id: "b", text: "Mümkünse iki kaynağı tek bir ortak kilitle korumak" }, { id: "c", text: "`ReentrantLock.tryLock` ile timeout/başarısızlıkta alınan kilitleri bırakıp yeniden denemek" }, { id: "d", text: "Ters sırayı koruyup yalnız rastgele sleep eklemek" }, { id: "e", text: "Kilidi tutarken sınırsız bloklayan dış çağrılar yapmak" }],
      answer: ["a", "b", "c"], acceptedAnswers: [], caseSensitive: false,
      hint: "Dairesel beklemeyi kaldıran veya sonsuz beklemeyi geri alınabilir yapan yöntemleri seçin.",
      explanationShort: "Tutarlı sıra, tek kilit veya kontrollü tryLock stratejisi geçerli yaklaşımlardır.",
      explanationLong: "Global sıra cycle'ı kırar. Tek kilit iç içe edinmeyi ortadan kaldırır fakat concurrency'yi azaltabilir. tryLock timeout ile ikinci kilit alınamazsa ilk kilit finally'da bırakılabilir; livelock/backoff da tasarlanmalıdır. sleep doğruluk sağlamaz, kilit altında dış/bloklayan çağrı riski artırır.",
      optionExplanations: { a: "Doğru lock-ordering çözümüdür.", b: "Doğru sadeleştirmedir; throughput bedeli olabilir.", c: "Doğru, başarısızlıkta kesin unlock ve backoff ile.", d: "Zamanlama hilesidir, cycle'ı ortadan kaldırmaz.", e: "Bekleme süresini ve bilinmeyen kilit bağımlılıklarını artırır." }, assumptions: ["tryLock yaklaşımında edinilmiş her kilit finally ile bırakılır ve timeout/backoff sonsuz aktif döngü yaratmayacak biçimde tasarlanır."], tags: ["deadlock", "trylock", "lock-ordering", "concurrency"]
    })
  ];
}(window));
