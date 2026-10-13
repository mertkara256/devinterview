(function () {
  "use strict";

  function choices(values) {
    return values.map(function (text, index) {
      return { id: String.fromCharCode(97 + index), text: text };
    });
  }

  function card(spec) {
    return {
      id: spec.id,
      sourceId: spec.sourceId,
      section: "Algoritma",
      topic: spec.topic,
      difficulty: spec.difficulty,
      type: spec.type,
      prompt: spec.prompt,
      code: spec.code || "",
      options: spec.options || [],
      items: spec.items || [],
      pairs: spec.pairs || { left: [], right: [] },
      answer: spec.answer,
      acceptedAnswers: spec.acceptedAnswers || [],
      caseSensitive: spec.caseSensitive === true,
      hint: spec.hint,
      explanationShort: spec.explanationShort,
      explanationLong: spec.explanationLong,
      optionExplanations: spec.optionExplanations || {},
      assumptions: spec.assumptions,
      tags: spec.tags || [],
      version: "1.0.0"
    };
  }

  var questions = [
    card({
      id: "A01-01", sourceId: "A01", topic: "Karmaşıklık analizi", difficulty: "Kolay", type: "single",
      prompt: "Big O notasyonu bir algoritma için öncelikle neyi ifade eder?",
      options: choices(["Girdi büyürken kaynak kullanımının asimptotik üst sınırını", "Algoritmanın her makinedeki kesin çalışma süresini", "Yalnızca en iyi durumdaki işlem sayısını", "Programın kaç satır kaynak kod içerdiğini"]),
      answer: "a", hint: "Sabit donanım hızından bağımsız, büyüme eğrisini düşünün.",
      explanationShort: "Big O, girdi boyutu büyürken zaman veya alan kullanımının asimptotik üst sınırını anlatır.",
      explanationLong: "Big O sabit çarpanları ve düşük dereceli terimleri göz ardı ederek büyüme hızına odaklanır. Tek başına kesin süreyi veya mutlaka en kötü durumu söylemez; analiz edilen durum ayrıca belirtilir. Sıkı asimptotik sınır için Θ notasyonu kullanılır.",
      optionExplanations: { b: "Donanım, JVM ve girdi ayrıntıları kesin süreyi değiştirir.", c: "En iyi durum ayrıca belirtilir; Big O yalnız ona özgü değildir.", d: "Kod satırı sayısı asimptotik maliyet ölçüsü değildir." },
      assumptions: "Kavramsal sorudur; null/boş girdi ve sayısal taşma yoktur. n negatif olmayan girdi boyutudur; belirli bir algoritmanın sıkı maliyeti ayrıca Θ ile ifade edilmelidir.",
      tags: ["big-o", "asimptotik-analiz"]
    }),
    card({
      id: "A01-02", sourceId: "A01", topic: "Karmaşıklık analizi", difficulty: "Kolay", type: "match",
      prompt: "Analiz türlerini tanımlarıyla eşleştirin.",
      pairs: {
        left: [{ id: "best", text: "En iyi durum" }, { id: "average", text: "Ortalama durum" }, { id: "worst", text: "En kötü durum" }],
        right: [{ id: "min", text: "Boyutu n olan girdilerde en az maliyet" }, { id: "expected", text: "Belirtilen girdi dağılımı altındaki beklenen maliyet" }, { id: "max", text: "Boyutu n olan girdilerde en fazla maliyet" }]
      },
      answer: { best: "min", average: "expected", worst: "max" },
      hint: "Minimum, beklenen ve maksimum maliyet ayrımını kullanın.",
      explanationShort: "En iyi durum minimumu, ortalama durum bir dağılıma göre bekleneni, en kötü durum maksimumu ölçer.",
      explanationLong: "Ortalama durum ifadesi bir olasılık dağılımı belirtilmeden eksiktir. Her üç durum da O, Ω veya Θ ile sınırlandırılabilir; örneğin doğrusal aramanın en iyi durumu Θ(1), en kötü durumu Θ(n)'dir.",
      assumptions: "Aynı girdi boyutundaki geçerli girdiler karşılaştırılır; null/boş girdi ve taşma bu kavramsal eşleştirmeyi etkilemez. Verilen örnekte sıkı sınırlar Θ ile belirtilir.",
      tags: ["best-case", "average-case", "worst-case"]
    }),
    card({
      id: "A02-01", sourceId: "A02", topic: "Karmaşıklık analizi", difficulty: "Kolay", type: "order",
      prompt: "n büyürken karmaşıklık sınıflarını en yavaş büyüyenden en hızlı büyüyene sıralayın.",
      items: [{ id: "constant", text: "O(1)" }, { id: "log", text: "O(log n)" }, { id: "linear", text: "O(n)" }, { id: "nlogn", text: "O(n log n)" }, { id: "quadratic", text: "O(n²)" }, { id: "exponential", text: "O(2ⁿ)" }],
      answer: ["constant", "log", "linear", "nlogn", "quadratic", "exponential"],
      hint: "Önce sabit ve logaritmik, en sona üstel büyümeyi yerleştirin.",
      explanationShort: "Doğru sıra O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)'dir.",
      explanationLong: "Yeterince büyük n için sabitler ve logaritmalar polinomlardan; polinomlar da 2ⁿ gibi üstel fonksiyonlardan daha yavaş büyür. Logaritmanın tabanı asimptotik sınıfı değiştirmez.",
      assumptions: "n pozitif tam sayı olarak sonsuza gider; null/boş koleksiyon ve aritmetik taşma yoktur. Bunlar büyüme sınıflarıdır; belirli bir algoritmanın sıkı sınırı ancak ek bilgiyle Θ olarak verilebilir.",
      tags: ["big-o", "buyume-sirasi"]
    }),
    card({
      id: "A03-01", sourceId: "A03", topic: "Döngü analizi", difficulty: "Kolay", type: "single",
      prompt: "process çağrısı sabit süreliyse iki ardışık döngünün sıkı zaman karmaşıklığı nedir?",
      code: `for (int i = 0; i < n; i++) { process(i); }\nfor (int j = 0; j < n; j++) { process(j); }`,
      options: choices(["Θ(1)", "Θ(n)", "Θ(n²)", "Θ(2ⁿ)"]), answer: "b",
      hint: "Ardışık blokların işlem sayılarını toplayın.",
      explanationShort: "n + n = 2n çağrı yapılır; sabit çarpan atılınca sıkı sınır Θ(n)'dir.",
      explanationLong: "Döngüler iç içe değildir. Bu nedenle maliyetler çarpılmaz, T(n)=cn+cn+O(1) biçiminde toplanır ve Θ(n) elde edilir. Yardımcı alan Θ(1)'dir.",
      optionExplanations: { a: "Çağrı sayısı n ile büyür.", c: "Θ(n²) ancak n kez çalışan döngüler iç içe olsaydı oluşurdu.", d: "Kodda üstel dallanma yoktur." },
      assumptions: "n >= 0, process Θ(1) zaman ve Θ(1) ek alan kullanır; sayaç taşmaz. n=0 boş çalışmadır. Toplam zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["dongu", "ardisik-bloklar", "theta"]
    }),
    card({
      id: "A03-02", sourceId: "A03", topic: "Döngü analizi", difficulty: "Kolay", type: "boolean",
      prompt: "Birbiri ardına çalışan, her biri n kez dönen iki bağımsız döngünün maliyetleri çarpılır ve sonuç Θ(n²) olur.",
      options: choices(["Doğru", "Yanlış"]), answer: false,
      hint: "Aynı anda iç içe mi, yoksa sırayla mı çalışıyorlar?",
      explanationShort: "Yanlış. Ardışık maliyetler toplanır: Θ(n)+Θ(n)=Θ(n).",
      explanationLong: "Çarpma kuralı, bir döngünün her yinelemesinde diğer döngünün tamamı çalışıyorsa uygulanır. Ardışık iki döngüde toplam çağrı 2n'dir; bu da sıkı olarak Θ(n)'dir.",
      optionExplanations: { a: "Yanlış seçimdir; ardışık döngülerin maliyetleri çarpılmaz, toplanır.", b: "Doğru seçimdir; Θ(n) + Θ(n) toplamı Θ(n) kalır." },
      assumptions: "n >= 0 ve her gövde Θ(1)'dir; null girdi ve taşma yoktur. Zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["dongu", "toplama-kurali"]
    }),
    card({
      id: "A04-01", sourceId: "A04", topic: "Döngü analizi", difficulty: "Kolay", type: "fill",
      prompt: "n >= 0 için process çağrılarının tam sayısını n cinsinden yazın.",
      code: `for (int i = 0; i < n; i++) {\n    for (int j = 0; j <= i; j++) {\n        process(i, j);\n    }\n}`,
      answer: "n(n+1)/2", acceptedAnswers: ["n*(n+1)/2", "n * (n + 1) / 2", "(n^2+n)/2", "(n²+n)/2"],
      hint: "İç döngü sırasıyla 1, 2, ..., n kez çalışır.",
      explanationShort: "Çağrı sayısı 1+2+...+n = n(n+1)/2'dir.",
      explanationLong: "i değeri 0 iken 1, n-1 iken n çağrı yapılır. Aritmetik seri toplamı n(n+1)/2 olduğundan zamanın sıkı sınırı Θ(n²), yardımcı alan Θ(1)'dir.",
      assumptions: "n negatif değildir; process Θ(1)'dir ve çağrı sayısını temsil eden matematiksel ifade taşmaz. n=0 için sonuç 0'dır. Zaman Θ(n²), yardımcı alan Θ(1)'dir.",
      tags: ["ic-ice-dongu", "aritmetik-seri"]
    }),
    card({
      id: "A04-02", sourceId: "A04", topic: "Döngü analizi", difficulty: "Kolay", type: "single",
      prompt: "Üçgensel iç içe döngünün sıkı zaman karmaşıklığı nedir?",
      code: `for (int i = 0; i < n; i++)\n    for (int j = 0; j <= i; j++)\n        process(i, j);`,
      options: choices(["Θ(log n)", "Θ(n)", "Θ(n log n)", "Θ(n²)"]), answer: "d",
      hint: "Tam çağrı sayısındaki baskın terime bakın.",
      explanationShort: "n(n+1)/2 ifadesinin baskın terimi n²/2 olduğundan zaman Θ(n²)'dir.",
      explanationLong: "İç döngünün sınırı sabit n değil i olsa da toplam yineleme üçgensel sayıdır. Üst ve alt sınırlar sabit katlarla n²'ye bağlı olduğu için yalnız O(n²) değil, sıkı olarak Θ(n²) denir.",
      optionExplanations: { a: "Arama alanını yarıya indiren bir işlem yoktur.", b: "Toplam çağrı doğrusal değildir.", c: "Toplam n log n değil, aritmetik seridir." },
      assumptions: "n >= 0, process Θ(1), sayaçlar taşmaz; boş n=0 girdisi sıfır çağrı yapar. Zaman Θ(n²), yardımcı alan Θ(1)'dir.",
      tags: ["ic-ice-dongu", "theta"]
    }),
    card({
      id: "A05-01", sourceId: "A05", topic: "Zaman ve alan", difficulty: "Kolay", type: "match",
      prompt: "n elemanlı bir diziyi kopyalama ile aynı diziyi yerinde ters çevirme özelliklerini eşleştirin.",
      pairs: {
        left: [{ id: "copy", text: "Yeni diziye kopyalama" }, { id: "inplace", text: "İki uçtan yerinde ters çevirme" }],
        right: [{ id: "copy-cost", text: "Θ(n) zaman, Θ(n) yardımcı alan" }, { id: "inplace-cost", text: "Θ(n) zaman, Θ(1) yardımcı alan" }]
      },
      answer: { copy: "copy-cost", inplace: "inplace-cost" },
      hint: "Her iki yöntem de elemanları işler; fark yeni depolamadadır.",
      explanationShort: "Kopyalama yeni n elemanlık alan ister; yerinde ters çevirme yalnız birkaç değişken kullanır.",
      explanationLong: "Zaman karmaşıklığı çalışmanın büyümesini, yardımcı alan karmaşıklığı girdi dışında kullanılan ek belleği ölçer. İki yöntem de n ile orantılı iş yapar; yerinde yöntem girdi dizisini değiştirerek Θ(1) yardımcı alan sağlar.",
      assumptions: "Dizi null değildir; boş ve tek elemanlı diziler geçerlidir. Eleman kopyalama/swap Θ(1), indisler taşmaz. İki yöntemin sıkı zaman sınırı Θ(n); alanları sırasıyla Θ(n) ve Θ(1)'dir.",
      tags: ["alan-karmasikligi", "yerinde-algoritma"]
    }),
    card({
      id: "A06-01", sourceId: "A06", topic: "Diziler", difficulty: "Kolay", type: "single",
      prompt: "Bir int[] dizisinde geçerli arr[i] erişiminin sıkı zaman maliyeti neden Θ(1)'dir?",
      options: choices(["Adres, başlangıç adresi + i × sabit eleman boyutuyla doğrudan hesaplanır", "JVM önce i elemanı dolaşır", "Dizi her erişimde sıralanır", "Hash tablosunda bucket aranır"]), answer: "a",
      hint: "Bitişik bellek ve sabit eleman boyutunu düşünün.",
      explanationShort: "Dizi elemanları indekslenebilir düzende tutulduğu için adres doğrudan hesaplanır.",
      explanationLong: "Java sınır kontrolü yapar ancak bu da sabit zamanlıdır. Geçerli bir indeks için önceki elemanları dolaşmak gerekmez; dolayısıyla erişim sıkı olarak Θ(1) zaman ve Θ(1) yardımcı alandır.",
      optionExplanations: { b: "Dolaşma linked list erişiminde gerekir.", c: "Erişim sıralama yapmaz.", d: "Dizi indekslemesi hash kullanmaz." },
      assumptions: "arr null değildir ve 0 <= i < arr.length; boş dizide geçerli indeks yoktur. Adres hesabında model düzeyinde taşma yoktur. Zaman Θ(1), yardımcı alan Θ(1)'dir.",
      tags: ["dizi", "rastgele-erisim"]
    }),
    card({
      id: "A06-02", sourceId: "A06", topic: "Diziler", difficulty: "Kolay", type: "multi",
      prompt: "Sabit uzunluklu n elemanlı bir dizinin başına eleman eklemek veya ilk elemanı silmek hakkında doğru ifadeleri seçin.",
      options: choices(["Kalan elemanların konumları kaydırılmalıdır", "İndeksle erişim artık Θ(n) olur", "En kötü durumda taşıma maliyeti Θ(n)'dir", "Bitişik yerleşim kaydırma gereksinimini ortadan kaldırır"]), answer: ["a", "c"],
      hint: "İşlemden sonra eski ikinci elemanın hangi indekste bulunacağını düşünün.",
      explanationShort: "Baştaki değişiklik n ile orantılı sayıda elemanı kaydırabilir; maliyet Θ(n)'dir.",
      explanationLong: "Dizinin bitişik ve indekslenebilir yapısını korumak için elemanlar bir konum taşınır. Bu, indeks erişiminin Θ(1) olmasını değiştirmez; yalnız ekleme/silme işleminin en kötü ve sıkı maliyeti Θ(n)'dir.",
      optionExplanations: { b: "Dizi var olduktan sonra indeks erişimi Θ(1) kalır.", d: "Tam tersine, bitişik ve sıralı konumlar kaydırmayı gerekli kılar." },
      assumptions: "Dizi null değildir; ekleme için yeterli kapasite olduğu veya aynı boyutta kaydırma yapıldığı varsayılır. n=0 sınır durumu sözleşmeyle ele alınır, taşma yoktur. Taşıma zamanı Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["dizi", "ekleme", "silme"]
    }),
    card({
      id: "A07-01", sourceId: "A07", topic: "Diziler", difficulty: "Kolay", type: "output",
      prompt: "Metot {4, -2, 7, 1} girdisi için hangi metni yazdırır?",
      code: `static void printMinMax(int[] a) {\n    if (a == null || a.length == 0) throw new IllegalArgumentException();\n    int min = a[0], max = a[0];\n    for (int i = 1; i < a.length; i++) {\n        if (a[i] < min) min = a[i];\n        if (a[i] > max) max = a[i];\n    }\n    System.out.print(min + "," + max);\n}`,
      answer: "-2,7", acceptedAnswers: ["-2, 7"],
      hint: "Her eleman için hem mevcut minimumu hem maksimumu güncelleyin.",
      explanationShort: "Tek geçiş sonunda minimum -2, maksimum 7'dir.",
      explanationLong: "Başlangıçta her iki değer 4'tür. -2 minimumu, 7 maksimumu değiştirir; 1 ikisini de değiştirmez. n>0 için zaman Θ(n), yardımcı alan Θ(1)'dir.",
      assumptions: "Metot null veya boş dizide IllegalArgumentException atar; verilen dizi doludur. Yalnız karşılaştırma yapıldığı için aritmetik taşma yoktur. Zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["min-max", "tek-gecis", "dizi"]
    }),
    card({
      id: "A07-02", sourceId: "A07", topic: "Diziler", difficulty: "Kolay", type: "single",
      prompt: "Tek geçişli min/max metodunun sözleşmesi 'null veya boş dizide IllegalArgumentException' ise doğru karmaşıklık çifti hangisidir?",
      options: choices(["Θ(n) zaman, Θ(1) yardımcı alan", "Θ(n log n) zaman, Θ(1) yardımcı alan", "Θ(n) zaman, Θ(n) yardımcı alan", "Θ(1) zaman, Θ(n) yardımcı alan"]), answer: "a",
      hint: "Dizi sıralanmıyor ve yalnız iki sonuç değişkeni tutuluyor.",
      explanationShort: "Her eleman en az bir kez incelenir ve sabit sayıda değişken tutulur.",
      explanationLong: "Minimum ve maksimumu bulmak için genel durumda tüm elemanlar okunmalıdır; bu nedenle alt ve üst sınır birlikte Θ(n)'dir. Girdi dışında kullanılan bellek n ile büyümez, Θ(1)'dir.",
      optionExplanations: { b: "Sıralama gereksizdir.", c: "Ek dizi kullanılmaz.", d: "Tüm elemanları görmeden genel sonucu belirlemek mümkün değildir." },
      assumptions: "arr null veya boşsa istisna sabit zamanda atılır; analiz n>0 geçerli girdiler içindir. Karşılaştırmalar taşmaz. Geçerli girdide zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["min-max", "karmasiklik"]
    }),
    card({
      id: "A08-01", sourceId: "A08", topic: "Diziler", difficulty: "Kolay", type: "order",
      prompt: "{1,2,3,4} dizisini iki uçlu yerinde ters çevirme algoritmasının adımlarını sıralayın.",
      items: [{ id: "swap-outer", text: "0 ve 3 indekslerindeki elemanları değiştir" }, { id: "move-outer", text: "Sol indeksi 1'e artır, sağ indeksi 2'ye azalt" }, { id: "swap-inner", text: "1 ve 2 indekslerindeki elemanları değiştir" }, { id: "move-inner", text: "Sol indeksi 2'ye artır, sağ indeksi 1'e azalt" }, { id: "stop", text: "Sol indeks sağ indeksi geçtiği için dur" }],
      answer: ["swap-outer", "move-outer", "swap-inner", "move-inner", "stop"],
      hint: "Uçlardan merkeze doğru ilerleyin.",
      explanationShort: "Önce dış çift, sonra iç çift değiştirilir ve indisler kesişince işlem biter.",
      explanationLong: "Her swap iki simetrik elemanı nihai yerine koyar. floor(n/2) swap yapılır; dolayısıyla zaman Θ(n), yalnız indisler ve geçici değer kullanıldığı için yardımcı alan Θ(1)'dir.",
      assumptions: "Dizi null değildir; boş ve tek elemanlı diziler değişmeden kalır. İndisler ve int değerleri üzerinde aritmetik işlem taşması yoktur. Zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["dizi-ters-cevirme", "two-pointer", "yerinde"]
    }),
    card({
      id: "A08-02", sourceId: "A08", topic: "Diziler", difficulty: "Kolay", type: "multi",
      prompt: "İki uçlu, ek dizi kullanmayan ters çevirme için doğru özellikleri seçin.",
      options: choices(["Girdi dizisini değiştirir", "Yardımcı alanı Θ(1)'dir", "Zamanı Θ(log n)'dir", "Boş dizi için mutlaka hata verir"]), answer: ["a", "b"],
      hint: "'Yerinde' sözcüğünün yan etkisini ve bellek anlamını düşünün.",
      explanationShort: "Algoritma diziyi yerinde değiştirir, Θ(n) zaman ve Θ(1) yardımcı alan kullanır.",
      explanationLong: "Dizinin yarısı kadar swap yine de n ile doğrusal büyür. Döngü koşulu left < right ise boş dizi için hiç swap yapılmadan güvenle tamamlanabilir.",
      optionExplanations: { c: "n/2 işlem Θ(n)'dir, Θ(log n) değildir.", d: "Uygun sözleşme ve döngüyle boş dizi doğal olarak işlenebilir." },
      assumptions: "arr null değildir; boş/tek elemanlı dizi geçerlidir, null için sözleşme ayrı tanımlanır. Swap taşma üretmez. Zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["dizi-ters-cevirme", "yan-etki", "karmasiklik"]
    }),
    card({
      id: "A09-01", sourceId: "A09", topic: "Doğrusal arama", difficulty: "Kolay", type: "output",
      prompt: "find({8,3,5,3}, 3) çağrısının dönüş değeri nedir?",
      code: `static int find(int[] a, int target) {\n    for (int i = 0; i < a.length; i++) {\n        if (a[i] == target) return i;\n    }\n    return -1;\n}`,
      answer: "1", acceptedAnswers: ["1\n"],
      hint: "Metot ilk eşleşmede hemen döner.",
      explanationShort: "3 değerinin ilk görüldüğü indeks 1'dir.",
      explanationLong: "İndeks 0 eşleşmez, indeks 1 eşleşir ve sonraki 3 incelenmeden 1 döndürülür. Bu özel çağrı sabit sayıda adım sürse de algoritmanın en kötü sıkı zamanı Θ(n)'dir.",
      assumptions: "Dizi null değildir; boş dizide -1 döner. int eşitliği taşma yapmaz. En iyi zaman Θ(1), en kötü zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["linear-search", "ilk-indeks"]
    }),
    card({
      id: "A09-02", sourceId: "A09", topic: "Doğrusal arama", difficulty: "Kolay", type: "single",
      prompt: "Sıralı olduğu garanti edilmeyen n elemanlı dizide, hedef yokken linear search'ün sıkı maliyeti nedir?",
      options: choices(["Θ(1) zaman", "Θ(log n) zaman", "Θ(n) zaman", "Θ(n²) zaman"]), answer: "c",
      hint: "Hedefin olmadığını kanıtlamak için kaç eleman görülmelidir?",
      explanationShort: "Hedef yoksa n elemanın tamamı incelenir; zaman Θ(n)'dir.",
      explanationLong: "Erken dönüş yalnız hedef bulunduğunda yardımcı olur. Sırasız dizide yokluğu belirlemek için her konum kontrol edilir. Ek veri yapısı kullanılmadığından yardımcı alan Θ(1)'dir.",
      optionExplanations: { a: "Yalnız ilk eleman eşleşirse en iyi durum Θ(1)'dir.", b: "Binary search için sıralılık gerekir.", d: "İç içe tarama yoktur." },
      assumptions: "arr null değildir; n=0 için -1 sabit zamanda döner ve genel formül Θ(n) ile uyumludur. Karşılaştırma taşmaz. En kötü zaman Θ(n), alan Θ(1)'dir.",
      tags: ["linear-search", "worst-case"]
    }),
    card({
      id: "A10-01", sourceId: "A10", topic: "Doğrusal arama", difficulty: "Kolay", type: "fill",
      prompt: "Sınır hatasını düzeltmek için döngü koşulunu yazın: for (int i = 0; _____; i++).",
      code: `static int find(int[] arr, int target) {\n    for (int i = 0; i <= arr.length; i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`,
      answer: "i < arr.length", acceptedAnswers: ["i<arr.length", "i < arr.length;", "i<arr.length;"], caseSensitive: true,
      hint: "Son geçerli indeks length - 1'dir.",
      explanationShort: "Koşul i < arr.length olmalıdır.",
      explanationLong: "i == arr.length olduğunda arr[i] erişimi sınır dışıdır. Sıkı üst sınır kullanmak tüm geçerli 0..length-1 indekslerini kapsar ve geçersiz indekse ulaşmaz.",
      assumptions: "arr null değildir; boş dizide döngü çalışmaz ve -1 döner. İndis sayacı pratik dizi sınırlarında taşmaz. En kötü zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["off-by-one", "linear-search", "hata-bulma"]
    }),
    card({
      id: "A10-02", sourceId: "A10", topic: "Doğrusal arama", difficulty: "Kolay", type: "output",
      prompt: "Hatalı metot find(new int[]{4, 7}, 9) çağrısında hangi istisna sınıfı oluşur?",
      code: `static int find(int[] arr, int target) {\n    for (int i = 0; i <= arr.length; i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;\n}`,
      answer: "ArrayIndexOutOfBoundsException", acceptedAnswers: ["java.lang.ArrayIndexOutOfBoundsException"], caseSensitive: true,
      hint: "Hedef bulunmazsa i sonunda arr.length değerini alır.",
      explanationShort: "arr[2] erişimi geçersiz olduğu için ArrayIndexOutOfBoundsException oluşur.",
      explanationLong: "İki elemanlı dizinin son geçerli indeksi 1'dir. <= koşulu i=2 yinelemesine izin verir ve if koşulundaki arr[2] daha -1 satırına ulaşmadan istisna üretir.",
      assumptions: "arr null değildir ve hedef dizide yoktur; boş dizi de ilk erişimde aynı istisnayı üretir. Taşma yoktur. Hata oluşana kadar zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["off-by-one", "exception", "kod-ciktisi"]
    }),
    card({
      id: "A11-01", sourceId: "A11", topic: "String işlemleri", difficulty: "Kolay", type: "output",
      prompt: "reverse(\"Java\") çağrısının dönüş değeri nedir?",
      code: `static String reverse(String s) {\n    char[] chars = s.toCharArray();\n    for (int l = 0, r = chars.length - 1; l < r; l++, r--) {\n        char t = chars[l]; chars[l] = chars[r]; chars[r] = t;\n    }\n    return new String(chars);\n}`,
      answer: "avaJ", caseSensitive: true,
      hint: "İlk ve son karakterden merkeze ilerleyin.",
      explanationShort: "Karakter çiftleri yer değiştirdiğinde sonuç avaJ olur.",
      explanationLong: "char dizisine dönüştürme ve çiftleri değiştirme n ile doğrusal çalışır. Java char UTF-16 kod birimidir; bu yöntem BMP dışındaki bazı Unicode karakterlerin vekil çiftlerini bozabilir.",
      assumptions: "s null değildir; boş ve tek char içeren metin değişmeden döner. Bu karttaki girdi yalnız BMP karakterleridir, uzunluk taşmaz. Zaman Θ(n), yeni char[] ve sonuç nedeniyle yardımcı/çıktı alanı Θ(n)'dir.",
      tags: ["string", "reverse", "two-pointer"]
    }),
    card({
      id: "A11-02", sourceId: "A11", topic: "String işlemleri", difficulty: "Kolay", type: "single",
      prompt: "BMP dışındaki Unicode karakterlerini de bozmadan String ters çevirmek için en güvenli yaklaşım hangisidir?",
      options: choices(["UTF-16 char değerlerini tek tek ters çevirmek", "codePoints() ile Unicode kod noktalarını alıp sıralarını ters çevirmek", "String.hashCode() değerini ters çevirmek", "Yalnız toLowerCase() çağırmak"]), answer: "b",
      hint: "Bir görünen karakter bazı durumlarda iki char ile temsil edilir.",
      explanationShort: "Kod noktaları üzerinden ilerlemek surrogate çiftlerini parçalamaz.",
      explanationLong: "String.codePoints() int kod noktaları üretir; bunlar ters sırada StringBuilder.appendCodePoint ile eklenebilir. Bu yaklaşım kod noktalarını korur. Birleşik grapheme kümelerini tam kullanıcı algısına göre ters çevirmek ise daha ileri bir segmentasyon problemi olabilir.",
      optionExplanations: { a: "Tek char tersleme surrogate çiftlerini bölebilir.", c: "Hash kodu metni geri üretmez.", d: "Harf dönüşümü sıralamayı değiştirmez." },
      assumptions: "s null değildir; boş metin geçerlidir. Ters çevirme birimi Unicode kod noktasıdır, grapheme kümesi değildir; boyut taşmaz. Zaman Θ(n) UTF-16 birimi, yardımcı alan Θ(n)'dir.",
      tags: ["unicode", "code-point", "string"]
    }),
    card({
      id: "A12-01", sourceId: "A12", topic: "Palindrome", difficulty: "Kolay", type: "boolean",
      prompt: "Tam karakter eşitliği kullanan standart tanımda boş String ve tek karakterli String palindrome kabul edilir.",
      options: choices(["Doğru", "Yanlış"]), answer: true,
      hint: "Karşılaştırılacak ters bir çift var mı?",
      explanationShort: "Doğru. Her ikisinde de simetriyi bozan karakter çifti yoktur.",
      explanationLong: "İki uçlu algoritmada left < right koşulu baştan false olur ve true döner. Bu, boş dizinin ve tek elemanlı dizinin tersine eşit olmasıyla da uyumludur.",
      optionExplanations: { a: "Doğru seçimdir; karşılaştırılacak ters bir çift olmadığından simetri bozulmaz.", b: "Yanlış seçimdir; palindrome tanımı en az iki karakter şartı koymaz." },
      assumptions: "s null değildir; karşılaştırma büyük-küçük harfe duyarlı UTF-16 char eşitliğidir. null için sözleşme ayrıca belirlenmelidir; taşma yoktur. Zaman en kötü Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["palindrome", "sinir-durumu"]
    }),
    card({
      id: "A12-02", sourceId: "A12", topic: "Palindrome", difficulty: "Kolay", type: "output",
      prompt: "isPalindrome(\"abca\") çağrısının çıktısı nedir?",
      code: `static boolean isPalindrome(String s) {\n    for (int l = 0, r = s.length() - 1; l < r; l++, r--) {\n        if (s.charAt(l) != s.charAt(r)) return false;\n    }\n    return true;\n}`,
      answer: "false", acceptedAnswers: ["False", "FALSE"],
      hint: "Dıştaki a çifti eşleşir; sonra içteki çifte bakın.",
      explanationShort: "İçte b ve c farklı olduğu için false döner.",
      explanationLong: "Metot ilk uyuşmazlıkta erken döner. Bu girdi iki çift kontrolünde biter; genel en kötü durumda n/2 karşılaştırma yapılır ve sıkı zaman Θ(n)'dir.",
      assumptions: "s null değildir; boş/tek karakter true, karşılaştırma büyük-küçük harfe duyarlı UTF-16 char düzeyindedir. Uzunluk taşmaz. En kötü zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["palindrome", "two-pointer", "kod-ciktisi"]
    }),
    card({
      id: "A13-01", sourceId: "A13", topic: "Frekans tablosu", difficulty: "Kolay", type: "output",
      prompt: "Kod \"abaca\" için ne yazdırır?",
      code: `int[] freq = new int[26];\nfor (char c : "abaca".toCharArray()) {\n    freq[c - 'a']++;\n}\nSystem.out.print(freq[0] + "," + freq[1] + "," + freq[2]);`,
      answer: "3,1,1", acceptedAnswers: ["3, 1, 1"],
      hint: "0, 1 ve 2 indeksleri sırasıyla a, b ve c'dir.",
      explanationShort: "a üç, b bir ve c bir kez görülür.",
      explanationLong: "c-'a' ifadesi küçük İngilizce harflerini 0..25 aralığına eşler. Tüm karakterler bir kez işlendiği için zaman Θ(n), 26 sabit hücre nedeniyle yardımcı alan Θ(1)'dir.",
      assumptions: "Metin null değildir ve yalnız 'a'..'z' içerir; boş metinde tüm sayaçlar 0'dır. Her frekans int sınırını aşmayacak uzunluktadır. Zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["frekans", "dizi", "karakter"]
    }),
    card({
      id: "A13-02", sourceId: "A13", topic: "Frekans tablosu", difficulty: "Kolay", type: "match",
      prompt: "Karakter kümesi varsayımını uygun frekans yapısıyla eşleştirin.",
      pairs: {
        left: [{ id: "lower", text: "Yalnız 26 küçük İngilizce harfi" }, { id: "unicode", text: "Önceden sınırlandırılmamış Unicode kod noktaları" }],
        right: [{ id: "array", text: "int[26] ve c - 'a' indeksi" }, { id: "map", text: "Map<Integer, Integer> ve codePoints()" }]
      },
      answer: { lower: "array", unicode: "map" },
      hint: "Sabit ve küçük alfabe doğrudan indekslenebilir; geniş alfabe seyrek olabilir.",
      explanationShort: "Sabit küçük alfabe için dizi, genel Unicode için kod noktası anahtarlı Map uygundur.",
      explanationLong: "int[26] hızlı ve sabit alanlıdır ama aralık dışı karakterde geçersiz indeks üretir. Map yalnız görülen kod noktalarını tutar; beklenen zaman Θ(n), yardımcı alan farklı kod noktası sayısı k için Θ(k)'dir.",
      assumptions: "Girdi null değildir; boş girdi geçerlidir. Unicode yaklaşımı kod noktalarını sayar, grapheme kümelerini değil; frekans sayaçları taşmaz. Dizi çözümü Θ(n)/Θ(1), Map çözümü beklenen Θ(n)/Θ(k)'dir.",
      tags: ["unicode", "hashmap", "frekans"]
    }),
    card({
      id: "A14-01", sourceId: "A14", topic: "Set", difficulty: "Kolay", type: "boolean",
      prompt: "Bir HashSet'e sırayla 2, 1, 2 eklenirken add metodunun üçüncü çağrıda false dönmesi, tekrar eden eleman bulunduğunu gösterir.",
      options: choices(["Doğru", "Yanlış"]), answer: true,
      hint: "Set.add, küme değişmediyse ne döndürür?",
      explanationShort: "Doğru. İkinci 2 zaten bulunduğu için add false döner.",
      explanationLong: "Her elemanda if (!seen.add(value)) return true kalıbı kullanılabilir. HashSet'in iyi dağılımlı ortalama işlemleri sabit zamanlı olduğundan beklenen toplam zaman Θ(n)'dir.",
      optionExplanations: { a: "Doğru seçimdir; üçüncü ekleme kümenin içeriğini değiştirmez ve false döner.", b: "Yanlış seçimdir; HashSet.add yinelenen eşit elemanda false döndürür." },
      assumptions: "Dizi null değildir; boş/tek eleman için sonuç false'tur. Integer hash/eşitliği kullanılır ve sayaç taşması yoktur. Beklenen zaman Θ(n), kötü durum üst sınırı O(n²), yardımcı alan en kötü Θ(n)'dir.",
      tags: ["set", "duplicate", "hashing"]
    }),
    card({
      id: "A14-02", sourceId: "A14", topic: "Set", difficulty: "Kolay", type: "single",
      prompt: "n farklı int içeren dizide HashSet tabanlı tekrar kontrolünün beklenen sıkı zaman ve yardımcı alanı nedir?",
      options: choices(["Θ(1) zaman, Θ(1) alan", "Θ(n) zaman, Θ(n) alan", "Θ(n log n) zaman, Θ(1) alan", "Θ(n²) zaman, Θ(n²) alan"]), answer: "b",
      hint: "Her eleman bir kez eklenir ve tümü farklıysa Set'te kalır.",
      explanationShort: "Ortalama sabit hash işlemleriyle beklenen zaman Θ(n), saklanan n değerle alan Θ(n)'dir.",
      explanationLong: "Erken tekrar yoksa n ekleme yapılır. Hash dağılımı iyi ve yeniden boyutlandırmanın amortize maliyeti hesaba katıldığında beklenen toplam Θ(n)'dir; tüm değerler saklandığı için yardımcı alan sıkı Θ(n)'dir.",
      optionExplanations: { a: "Set n farklı elemanı saklar.", c: "Sıralama yapılmaz ve alan sabit değildir.", d: "Normal hash varsayımında kareli maliyet beklenmez." },
      assumptions: "arr null değildir; n=0 geçerlidir. HashSet ortalama/amortize davranışı ve yeterli bellek varsayılır; int değerler taşmaz. Beklenen zaman Θ(n), patolojik çakışmada O(n²), alan Θ(n)'dir.",
      tags: ["hashset", "karmasiklik", "duplicate"]
    }),
    card({
      id: "A15-01", sourceId: "A15", topic: "Anagram", difficulty: "Kolay", type: "boolean",
      prompt: "Politika: boşlukları yok say ve Locale.ROOT ile küçük harfe dönüştür. Bu politikada \"Dormitory\" ile \"Dirty room\" anagramdır.",
      options: choices(["Doğru", "Yanlış"]), answer: true,
      hint: "Normalize edilmiş iki metindeki harf frekanslarını karşılaştırın.",
      explanationShort: "Doğru. Her ikisi de aynı harfleri aynı sayıda içerir.",
      explanationLong: "Normalize edildiğinde metinler dormitory ve dirtyroom olur. Sıra farklı olsa da karakter çoklukları aynıdır. Açık bir boşluk ve büyük-küçük harf politikası sonuç belirsizliğini kaldırır.",
      optionExplanations: { a: "Doğru seçimdir; belirtilen normalizasyondan sonra karakter çoklukları aynıdır.", b: "Yanlış seçimdir; boşluk kaldırılıp harfler küçültüldüğünde frekanslar eşittir." },
      assumptions: "Girdiler null değildir; boş+boş true kabul edilir. Yalnız ASCII İngilizce harfleri vardır, sayaçlar taşmaz. int[26] ile zaman Θ(n+m), yardımcı alan Θ(1)'dir.",
      tags: ["anagram", "normalizasyon", "frekans"]
    }),
    card({
      id: "A15-02", sourceId: "A15", topic: "Anagram", difficulty: "Kolay", type: "multi",
      prompt: "Yalnız küçük İngilizce harfleri kabul eden int[26] anagram çözümü için doğru ifadeleri seçin.",
      options: choices(["Uzunluklar farklıysa hemen false dönülebilir", "İlk metinde artırıp ikincide azaltmak yeterlidir", "Sonunda her sayaç sıfır olmalıdır", "Çözüm her Unicode metinde değişikliksiz güvenlidir"]), answer: ["a", "b", "c"],
      hint: "Aynı çokluk kümesi toplam uzunluğu ve tüm frekansları eşit kılar.",
      explanationShort: "Uzunluk kontrolü, tek frekans tablosunda artırma/azaltma ve sıfır doğrulaması doğru yaklaşımdır.",
      explanationLong: "İki metin aynı uzunluktaysa ilkini sayıp ikincisini düşmek, tüm hücrelerin sıfır olmasıyla eşit frekansları kanıtlar. Sabit 26 hücre alanı Θ(1)'dir; genel Unicode için farklı yapı gerekir.",
      optionExplanations: { d: "c-'a' yalnız dar bir alfabe için güvenlidir; genel Unicode kod noktaları için Map gibi bir yapı gerekir." },
      assumptions: "İki girdi null değildir, yalnız 'a'..'z' içerir; boş metinler anagramdır. Uzunluk/frekans int sınırını aşmaz. Zaman Θ(n+m), yardımcı alan Θ(1)'dir.",
      tags: ["anagram", "frekans-tablosu", "sinir-durumu"]
    }),
    card({
      id: "A16-01", sourceId: "A16", topic: "Sayı algoritmaları", difficulty: "Kolay", type: "output",
      prompt: "Kod sırasıyla digitSumAndCount(508) ve digitSumAndCount(0) için ne yazdırır?",
      code: `static String digitSumAndCount(int n) {\n    if (n < 0) throw new IllegalArgumentException();\n    if (n == 0) return "0:1";\n    int sum = 0, count = 0;\n    while (n > 0) { sum += n % 10; count++; n /= 10; }\n    return sum + ":" + count;\n}\nSystem.out.print(digitSumAndCount(508) + "," + digitSumAndCount(0));`,
      answer: "13:3,0:1", acceptedAnswers: ["13:3, 0:1"],
      hint: "508 üç rakamlıdır; 0 sayısının rakam sayısı özel olarak 1 kabul edilir.",
      explanationShort: "5+0+8=13 ve üç rakam vardır; 0 için toplam 0, rakam sayısı 1'dir.",
      explanationLong: "Pozitif sayıda her /10 işlemi bir ondalık basamağı kaldırır. 0 döngüye girmediği için sözleşme onu ayrı ele alır. d rakam için sıkı zaman Θ(d), yardımcı alan Θ(1)'dir.",
      assumptions: "n int aralığında ve negatif değildir; negatifte IllegalArgumentException atılır. sum en fazla 90 olduğundan int taşması yoktur. 0 özel durumu 0 toplam/1 rakamdır. Zaman Θ(d), alan Θ(1)'dir.",
      tags: ["rakam-toplami", "basamak-sayisi", "sayi"]
    }),
    card({
      id: "A17-01", sourceId: "A17", topic: "Faktoriyel", difficulty: "Kolay", type: "fill",
      prompt: "long türünde faktoriyeli taşmadan saklanabilen en büyük negatif olmayan n değerini yazın.",
      answer: "20", acceptedAnswers: ["20L"],
      hint: "20! yaklaşık 2,43 × 10^18; long üst sınırı yaklaşık 9,22 × 10^18'dir.",
      explanationShort: "20! long aralığına sığar, 21! sığmaz; cevap 20'dir.",
      explanationLong: "20! = 2.432.902.008.176.640.000 değeridir. 21 ile bir sonraki çarpım Long.MAX_VALUE değerini aşar. Bu nedenle sözleşme n>20 için taşmayı açıkça reddetmelidir.",
      assumptions: "n tam sayı ve n>=0'dır; 0!=1. Sonuç signed 64-bit long ile tutulur; n>20 geçersiz/taşan girdidir. Döngülü hesaplama zamanı Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["faktoriyel", "overflow", "long"]
    }),
    card({
      id: "A17-02", sourceId: "A17", topic: "Faktoriyel", difficulty: "Kolay", type: "multi",
      prompt: "Güvenli döngülü long faktoriyel sözleşmesi için doğru davranışları seçin.",
      options: choices(["n < 0 ise IllegalArgumentException at", "n == 0 ise 1 döndür", "Her çarpımda Math.multiplyExact kullanarak taşmayı yakala", "n > 20 iken sarılmış negatif değeri geçerli sonuç say"]), answer: ["a", "b", "c"],
      hint: "Matematiksel tanım, geçersiz alan ve Java taşmasını ayrı ele alın.",
      explanationShort: "Negatif girdi reddedilir, 0! bir kabul edilir ve taşma sessizce geçilmez.",
      explanationLong: "Java long taşması varsayılan olarak sessiz sarılır. Math.multiplyExact bunu ArithmeticException'a dönüştürür. Döngü 2..n aralığında ilerlediğinde geçerli n için Θ(n) zaman ve Θ(1) alan kullanır.",
      optionExplanations: { d: "Sarılmış değer matematiksel faktoriyel değildir ve sessiz veri hatasıdır." },
      assumptions: "n int türündedir; n<0 geçersiz, n=0 geçerli, n>20 long için taşar. Null girdi yoktur. Geçerli girdide zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["faktoriyel", "exception", "overflow"]
    }),
    card({
      id: "A18-01", sourceId: "A18", topic: "Fibonacci", difficulty: "Kolay", type: "output",
      prompt: "Kod fib(0), fib(1) ve fib(6) değerlerini hangi sırayla yazdırır?",
      code: `static int fib(int n) {\n    int a = 0, b = 1;\n    for (int i = 0; i < n; i++) {\n        int next = a + b; a = b; b = next;\n    }\n    return a;\n}\nSystem.out.print(fib(0) + "," + fib(1) + "," + fib(6));`,
      answer: "0,1,8", acceptedAnswers: ["0, 1, 8"],
      hint: "Döngü başında a, mevcut Fibonacci değerini temsil eder.",
      explanationShort: "F0=0, F1=1 ve F6=8'dir.",
      explanationLong: "Her yinelemede (a,b) çifti (F_i,F_{i+1}) durumundan bir sonraki çifte geçer. n yineleme sonunda a=F_n olur.",
      assumptions: "Bu çağrılarda 0 <= n <= 6 ve int taşması yoktur; negatif girdi reddedilir. Genel olarak metot F46'yı doğru döndürse de n=46'nın son b güncellemesinde F47 int'i taşır; tüm ara değerlerin taşmasız olması için n<=45 veya long kullanılmalıdır. Null yoktur. Zaman Θ(n), alan Θ(1)'dir.",
      tags: ["fibonacci", "iterasyon", "kod-ciktisi"]
    }),
    card({
      id: "A18-02", sourceId: "A18", topic: "Fibonacci", difficulty: "Kolay", type: "match",
      prompt: "Döngülü Fibonacci metodunun özelliklerini eşleştirin.",
      pairs: {
        left: [{ id: "time", text: "0 <= n <= 46 için zaman" }, { id: "space", text: "Yardımcı alan" }, { id: "largest", text: "int içinde doğru kalan en büyük n" }],
        right: [{ id: "theta-n", text: "Θ(n)" }, { id: "theta-1", text: "Θ(1)" }, { id: "forty-six", text: "46" }]
      },
      answer: { time: "theta-n", space: "theta-1", largest: "forty-six" },
      hint: "Döngü n kez çalışır ve yalnız üç sayı tutulur; F47 int sınırını aşar.",
      explanationShort: "Zaman Θ(n), alan Θ(1); int için son güvenli indeks 46'dır.",
      explanationLong: "Metot n yineleme yapar fakat geçmiş diziyi saklamaz. Dönen değer olarak F46=1.836.311.903 sığar; F47=2.971.215.073 Integer.MAX_VALUE değerinden büyüktür. Kaynaktaki döngü n=46'da b için F47'yi de hesapladığından ara taşmayı tamamen önleyen uygulama long kullanmalı veya son gereksiz toplamı yapmamalıdır.",
      assumptions: "n negatif değildir; int dönüş değeri olarak son doğru Fibonacci indeksi 46'dır, ancak kaynak döngünün n=46 son b güncellemesi ara taşma yapar. Taşmasız sözleşmede long kullanılmalı ya da döngü uyarlanmalıdır; null yoktur. Sıkı zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["fibonacci", "karmasiklik", "overflow"]
    }),
    card({
      id: "A19-01", sourceId: "A19", topic: "Asal sayı", difficulty: "Kolay", type: "output",
      prompt: "isPrime(1), isPrime(2) ve isPrime(49) hangi çıktıyı verir?",
      code: `static boolean isPrime(int n) {\n    if (n < 2) return false;\n    for (int d = 2; d <= n / d; d++) {\n        if (n % d == 0) return false;\n    }\n    return true;\n}`,
      answer: "false,true,false", acceptedAnswers: ["false, true, false", "False,True,False"],
      hint: "1 asal değildir; 49'un 7 çarpanı vardır.",
      explanationShort: "Sonuçlar sırasıyla false, true ve false'tur.",
      explanationLong: "n<2 doğrudan reddedilir. 2 için döngü çalışmaz. 49'da d=7 iken kalan sıfır olur. n/d karşılaştırması d*d taşması riskini önler.",
      assumptions: "n herhangi bir int olabilir; negatif, 0 ve 1 asal değildir. d*d yerine n/d kullanıldığı için çarpma taşması yoktur. En kötü zaman Θ(√n) (n>=2), alan Θ(1)'dir.",
      tags: ["asal-sayi", "sqrt", "kod-ciktisi"]
    }),
    card({
      id: "A19-02", sourceId: "A19", topic: "Asal sayı", difficulty: "Kolay", type: "single",
      prompt: "Asallık testinde bölenleri √n sınırına kadar denemek neden yeterlidir?",
      options: choices(["Her bileşik n=a×b için en az bir çarpan √n'den büyük değildir", "√n her zaman n'nin tam bölenidir", "Java yalnız √n kez mod işlemi yapabilir", "√n'den büyük tüm sayılar asaldır"]), answer: "a",
      hint: "İki çarpanın ikisi de √n'den büyük olsaydı çarpımları ne olurdu?",
      explanationShort: "Bileşik sayının çarpan çiftinden en az biri √n'yi aşamaz.",
      explanationLong: "a>√n ve b>√n aynı anda olsaydı a×b>n olurdu. Bu yüzden küçük çarpan bulunmadıysa daha büyük eşinin de bulunması mümkün değildir. Asal n için tüm adaylar denenir ve sıkı maliyet Θ(√n)'dir.",
      optionExplanations: { b: "Örneğin √10 tam sayı veya bölen değildir.", c: "Bu matematiksel bir sınırdır, Java kısıtı değildir.", d: "√n'den büyük bileşik sayılar vardır." },
      assumptions: "n int ve n>=2 analiz edilir; negatif/0/1 false'tur. d<=n/d kullanılarak overflow önlenir. En kötü sıkı zaman Θ(√n), yardımcı alan Θ(1)'dir.",
      tags: ["asal-sayi", "carpan-cifti", "karmasiklik"]
    }),
    card({
      id: "A20-01", sourceId: "A20", topic: "Eksik sayı", difficulty: "Kolay", type: "output",
      prompt: "XOR tabanlı missing(new int[]{3,0,1}) çağrısı ne döndürür?",
      code: `static int missing(int[] a) {\n    int x = a.length;\n    for (int i = 0; i < a.length; i++) {\n        x ^= i;\n        x ^= a[i];\n    }\n    return x;\n}`,
      answer: "2",
      hint: "Aynı sayılar XOR işleminde birbirini götürür.",
      explanationShort: "0..3 aralığında eksik olan tek değer 2'dir.",
      explanationLong: "İndekslerden 0..n-1, başlangıçtan n ve diziden mevcut değerler XOR'lanır. İki kez görülen her değer sıfırlanır; yalnız eksik değer kalır.",
      assumptions: "a null değildir; uzunluğu n ve elemanları 0..n aralığında benzersizdir, tam bir değer eksiktir. n int dizi sınırındadır; XOR aritmetik overflow üretmez. Zaman Θ(n), alan Θ(1)'dir.",
      tags: ["xor", "eksik-sayi", "dizi"]
    }),
    card({
      id: "A20-02", sourceId: "A20", topic: "Eksik sayı", difficulty: "Kolay", type: "multi",
      prompt: "Geçerli 0..n eksik sayı girdisinde toplam formülü ile XOR yaklaşımını karşılaştıran doğru ifadeleri seçin.",
      options: choices(["İkisi de Θ(n) zaman ve Θ(1) yardımcı alan kullanabilir", "int ile n(n+1)/2 hesabı taşabilir", "XOR yaklaşımı toplamsal aritmetik taşma riskini taşımaz", "Her iki yöntem de yinelenen ve iki eksikli bozuk girdiyi her zaman teşhis eder"]), answer: ["a", "b", "c"],
      hint: "Geçerli girdi varsayımı ile doğrulama yeteneğini karıştırmayın.",
      explanationShort: "İki yaklaşım da doğrusal/sabit alanlıdır; toplam taşabilir, XOR bu toplama taşmasını önler.",
      explanationLong: "Toplam çözümünde long kullanmak veya işlem sırasını güvenli kurmak gerekir. XOR yalnız bit işlemi yapar. Ancak her iki formül de giriş sözleşmesi bozuksa bunu güvenilir biçimde doğrulayan genel bir denetleyici değildir.",
      optionExplanations: { d: "Formüller doğru girdi sözleşmesine dayanır; tekrar/çoklu eksikliği ayrı doğrulama olmadan garanti edemez." },
      assumptions: "a null değildir; n+1 olası değerden tam biri eksik, diğerleri benzersiz ve aralıktadır; boş dizi n=0 için eksik 0 verir. Toplam int ile taşabilir, long ile önlenir. Her iki yöntem Θ(n) zaman/Θ(1) alandır.",
      tags: ["xor", "toplam-formulu", "overflow"]
    }),
    card({
      id: "A21-01", sourceId: "A21", topic: "Set ve Map", difficulty: "Kolay", type: "match",
      prompt: "İhtiyacı uygun veri yapısıyla eşleştirin.",
      pairs: {
        left: [{ id: "seen", text: "Bir değer daha önce görüldü mü?" }, { id: "count", text: "Her değer kaç kez görüldü?" }],
        right: [{ id: "set", text: "Set<T>" }, { id: "map", text: "Map<T, Integer>" }]
      },
      answer: { seen: "set", count: "map" },
      hint: "İlk ihtiyaç üyelik, ikincisi anahtar yanında sayaç ister.",
      explanationShort: "Üyelik için Set; frekans için anahtarı sayıya bağlayan Map kullanılır.",
      explanationLong: "Set yalnız benzersiz anahtarları saklar ve contains/add ile görülme bilgisini verir. Map her anahtarı bir frekans değeriyle ilişkilendirir. Hash tabanlı uygulamalarda her ikisinin işlemleri ortalama sabit sürelidir.",
      assumptions: "Girdi null değildir; null eleman politikası seçilen uygulamaya göre önceden belirlenir, boş girdi boş yapı üretir. Sayaçlar taşmaz. n öğe için beklenen zaman Θ(n), en kötü saklama alanı Θ(k) (k farklı öğe)'dir.",
      tags: ["set", "map", "veri-yapisi-secimi"]
    }),
    card({
      id: "A22-01", sourceId: "A22", topic: "Hash table", difficulty: "Kolay", type: "match",
      prompt: "Hash table terimlerini tanımlarıyla eşleştirin.",
      pairs: {
        left: [{ id: "hash", text: "Hash değeri" }, { id: "bucket", text: "Bucket" }, { id: "collision", text: "Collision" }],
        right: [{ id: "derived", text: "Anahtardan hesaplanan sayısal özet" }, { id: "slot", text: "Tabloda kayıtların yönlendirildiği bölüm" }, { id: "same", text: "Farklı anahtarların aynı bölüme yönlenmesi" }]
      },
      answer: { hash: "derived", bucket: "slot", collision: "same" },
      hint: "Hash yönlendirme bilgisidir; bucket hedeftir; collision hedef çakışmasıdır.",
      explanationShort: "Hash anahtardan üretilir, bucket kayıtları barındırır, collision aynı bucketa yönlenmedir.",
      explanationLong: "Hash table önce hash'i hesaplar, kapasiteye göre bucket seçer, sonra eşitliği kontrol ederek doğru anahtarı bulur. Collision normaldir ve zincirleme/ağaçlama/açık adresleme gibi yöntemlerle çözülür.",
      assumptions: "Anahtar sözleşmesi equals ile uyumlu hashCode sağlar; null anahtar politikası uygulamaya bağlıdır. Boş tabloda arama başarısızdır, kapasite hesabı taşmaz. Ortalama işlem Θ(1), kötü çakışmalı soyut modelde Θ(n)'dir.",
      tags: ["hash-table", "bucket", "collision"]
    }),
    card({
      id: "A22-02", sourceId: "A22", topic: "Hash table", difficulty: "Kolay", type: "single",
      prompt: "İyi dağılan hash değerleri ve kontrollü yük faktörü altında aramanın beklenen; tüm anahtarların tek zincirde toplandığı durumda sıkı maliyeti hangisidir?",
      options: choices(["Beklenen Θ(1), zincirli kötü durum Θ(n)", "Beklenen Θ(log n), kötü durum Θ(1)", "Her durumda Θ(1)", "Her durumda Θ(n²)"]), answer: "a",
      hint: "İyi dağılım kısa bucket, tam çakışma uzun zincir oluşturur.",
      explanationShort: "Beklenen arama Θ(1), tek zincirli patolojik durumda Θ(n)'dir.",
      explanationLong: "Yük faktörü sabit tutulduğunda beklenen bucket uzunluğu sabittir. Tüm anahtarlar aynı bucketa gider ve zincir doğrusal aranırsa hedefe/yokluğa göre n kayıt incelenebilir. Java 8 HashMap'in bazı büyük bucketları ağaçlaştırması uygulama ayrıntısıdır; kart soyut zincirleme modelini sorar.",
      optionExplanations: { b: "Beklenen hash erişimi logaritmik değil sabittir.", c: "Çakışma çözümü kötü durumda ek karşılaştırmalar ister.", d: "Tek arama için kareli tarama gerekmez." },
      assumptions: "n kayıt, uyumlu equals/hashCode ve zincirleme modeli vardır; null anahtar ve boş tablo özel davranışı sonucu değiştirmez. Boyut taşmaz. Beklenen zaman Θ(1), tümü çakışan zincirde sıkı zaman Θ(n), tablo alanı Θ(n)'dir.",
      tags: ["hash-table", "average-case", "worst-case"]
    }),
    card({
      id: "A23-01", sourceId: "A23", topic: "Frekans Map'i", difficulty: "Kolay", type: "output",
      prompt: "Döngüden sonra belirtilen anahtarlar hangi değerleri yazdırır?",
      code: `Map<String, Integer> counts = new HashMap<>();\nfor (String word : Arrays.asList("java", "oop", "java", "array")) {\n    counts.put(word, counts.getOrDefault(word, 0) + 1);\n}\nSystem.out.print(counts.get("java") + "," + counts.get("oop") + "," + counts.get("array"));`,
      answer: "2,1,1", acceptedAnswers: ["2, 1, 1"],
      hint: "getOrDefault ilk görülmede 0, sonraki görülmede mevcut sayıyı verir.",
      explanationShort: "java iki; oop ve array birer kez sayılır.",
      explanationLong: "HashMap'in yazdırma sırası garanti edilmediği için kart doğrudan anahtarları sorgular. Her kelimede mevcut frekans bir artırılır.",
      assumptions: "Liste ve kelimeler null değildir; boş listede Map boş kalır. Frekanslar Integer.MAX_VALUE değerini aşmaz. Beklenen zaman Θ(n), k farklı kelime için alan Θ(k)'dir.",
      tags: ["hashmap", "getOrDefault", "frekans"]
    }),
    card({
      id: "A23-02", sourceId: "A23", topic: "Frekans Map'i", difficulty: "Kolay", type: "single",
      prompt: "n kelime ve k farklı kelime için HashMap frekans döngüsünün beklenen sıkı zaman/alanı nedir?",
      options: choices(["Θ(n) zaman, Θ(k) yardımcı alan", "Θ(k) zaman, Θ(1) alan", "Θ(n²) zaman, Θ(n²) alan", "Θ(log n) zaman, Θ(k) alan"]), answer: "a",
      hint: "Her girdi kelimesi bir kez işlenir; Map yalnız farklı anahtarları tutar.",
      explanationShort: "Beklenen zaman Θ(n), yardımcı alan Θ(k)'dir.",
      explanationLong: "get ve put işlemleri ortalama sabit zamanlı kabul edilir. Döngü n kez çalışır; frekans Map'inde her farklı kelime için bir kayıt bulunur.",
      optionExplanations: { b: "Tekrarlı kelimeler de döngüde işlenir.", c: "Normal hash varsayımında iç içe tarama yoktur.", d: "HashMap erişimi beklenen logaritmik değildir." },
      assumptions: "Girdi koleksiyonu null değildir; null kelimeye izin verilip verilmediği sözleşmede sabitlenir, boş koleksiyon geçerlidir. Sayaç taşmaz. Beklenen zaman Θ(n), patolojik zincirde O(n²), alan Θ(k)'dir.",
      tags: ["hashmap", "karmasiklik", "frekans"]
    }),
    card({
      id: "A24-01", sourceId: "A24", topic: "Binary search", difficulty: "Kolay", type: "boolean",
      prompt: "Standart binary search'ün doğru sonuç vermesi için dizi, kullanılan karşılaştırıcıya göre monoton sıralı olmalıdır.",
      options: choices(["Doğru", "Yanlış"]), answer: true,
      hint: "Orta elemanın hedefe göre yön göstermesi hangi özelliğe dayanır?",
      explanationShort: "Doğru. Sıralılık, hedefin hangi yarıda olabileceğini güvenle belirler.",
      explanationLong: "Sıralı değilse arr[mid] < target bilgisi sol yarının elenmesini haklı çıkarmaz. Artan veya azalan sıra kullanılabilir, fakat karşılaştırma ve sınır güncellemeleri aynı düzene uygun olmalıdır.",
      optionExplanations: { a: "Doğru seçimdir; orta eleman ancak sıralılık sayesinde arama yönünü belirler.", b: "Yanlış seçimdir; sırasız girdide yarıyı elemek geçerli bir çıkarım değildir." },
      assumptions: "arr null değildir ve artan sıradadır; boş dizi -1 verir, tekrar varsa herhangi bir eşleşme kabul edilir. mid hesabı taşma güvenlidir. Zaman en kötü Θ(log n), alan iteratifte Θ(1)'dir.",
      tags: ["binary-search", "sirali-dizi", "on-kosul"]
    }),
    card({
      id: "A24-02", sourceId: "A24", topic: "Binary search", difficulty: "Kolay", type: "single",
      prompt: "Her adımda kalan arama alanı yaklaşık yarıya indiriliyorsa en kötü sıkı zaman neden Θ(log n)'dir?",
      options: choices(["n/2^k yaklaşık 1 olduğunda k yaklaşık log₂n olur", "Her adım tam n eleman inceler", "Yalnız sabit boyutlu diziler aranabilir", "Logaritma yalnız recursive kodda oluşur"]), answer: "a",
      hint: "Kaç kez ikiye böldüğünüzde n'den 1'e ulaşırsınız?",
      explanationShort: "Kalan boyut n/2^k olur; 1'e ulaşmak yaklaşık log₂n adım gerektirir.",
      explanationLong: "Her karşılaştırma aralığın en az yarısını eler. En kötü durumda hedef bulunana veya aralık boşalana kadar floor(log₂n)+1 karşılaştırma yapılır; bu sıkı olarak Θ(log n)'dir.",
      optionExplanations: { b: "Her adım yalnız orta elemanı karşılaştırır.", c: "Binary search değişken boyutlarda çalışır.", d: "İteratif binary search de aynı logaritmik adım sayısına sahiptir." },
      assumptions: "n>=1 sıralı, null olmayan dizi boyutudur; n=0 sabit zamanda başarısızdır. İndis hesabı taşmaz. En kötü zaman Θ(log n), iteratif yardımcı alan Θ(1)'dir.",
      tags: ["binary-search", "logaritma", "karmasiklik"]
    }),
    card({
      id: "A25-01", sourceId: "A25", topic: "Stack", difficulty: "Kolay", type: "output",
      prompt: "Deque stack olarak kullanıldığında kod ne yazdırır?",
      code: `Deque<Integer> stack = new ArrayDeque<>();\nstack.push(10);\nstack.push(20);\nint removed = stack.pop();\nint top = stack.peek();\nSystem.out.print(removed + "," + top);`,
      answer: "20,10", acceptedAnswers: ["20, 10"],
      hint: "Son eklenen 20 önce çıkar.",
      explanationShort: "LIFO nedeniyle pop 20'yi çıkarır; tepede 10 kalır.",
      explanationLong: "push elemanı tepeye koyar, pop tepedekini çıkarıp döndürür, peek çıkarmadan gösterir. ArrayDeque üzerinde bu uç işlemleri amortize/sıkı pratikte sabit zamanlıdır.",
      assumptions: "Stack null değildir ve pop öncesi boş değildir; ArrayDeque null eleman kabul etmez. Boyut taşmaz. Her işlem amortize Θ(1), toplam verilen dizi Θ(1), saklama alanı eleman sayısı için Θ(n)'dir.",
      tags: ["stack", "lifo", "deque"]
    }),
    card({
      id: "A25-02", sourceId: "A25", topic: "Stack", difficulty: "Kolay", type: "multi",
      prompt: "LIFO stack için doğal kullanım örneklerini seçin.",
      options: choices(["Dengeli parantez kontrolü", "Geri al (undo) geçmişi", "BFS'de katman sırasını koruma", "Recursive çağrı çerçeveleri"]), answer: ["a", "b", "d"],
      hint: "En son açılan/eklenen işin önce kapanması gereken durumları arayın.",
      explanationShort: "Parantez, undo ve çağrı çerçeveleri LIFO düzeninden yararlanır.",
      explanationLong: "En son açılan parantez önce kapanır; en son işlem önce geri alınır; en son fonksiyon çağrısı önce döner. Standart BFS ise FIFO queue kullanır.",
      optionExplanations: { c: "BFS'nin keşif sırası için doğal yapı FIFO queue'dur." },
      assumptions: "Kavramsal sorudur; boş stackte pop/peek davranışı API sözleşmesine göre ele alınır, null ve taşma yoktur. Her temel stack işlemi uygun uygulamada amortize Θ(1), n öğe alanı Θ(n)'dir.",
      tags: ["stack", "kullanim-alani", "lifo"]
    }),
    card({
      id: "A26-01", sourceId: "A26", topic: "Queue", difficulty: "Kolay", type: "output",
      prompt: "FIFO queue işlemlerinden sonra çıktı nedir?",
      code: `Queue<String> q = new ArrayDeque<>();\nq.offer("A");\nq.offer("B");\nString removed = q.poll();\nq.offer("C");\nSystem.out.print(removed + "," + q.peek());`,
      answer: "A,B", acceptedAnswers: ["A, B"], caseSensitive: true,
      hint: "poll en uzun süredir bekleyen elemanı çıkarır; peek yenisini çıkarmaz.",
      explanationShort: "A çıkarılır ve sıranın başında B kalır.",
      explanationLong: "Offer sırasıyla A ve B'yi sona ekler. Poll A'yı çıkarır, C sona gelir ve peek B'yi gösterir. Kalan sıra B,C'dir.",
      assumptions: "Queue null değildir; ArrayDeque null kabul etmez. poll/peek boşta null döner fakat burada kuyruk doludur; boyut taşmaz. Her işlem amortize Θ(1), n eleman için alan Θ(n)'dir.",
      tags: ["queue", "fifo", "arraydeque"]
    }),
    card({
      id: "A26-02", sourceId: "A26", topic: "Queue", difficulty: "Kolay", type: "match",
      prompt: "Davranış veya kullanım örneğini uygun yapıyla eşleştirin.",
      pairs: {
        left: [{ id: "stack", text: "Stack" }, { id: "queue", text: "Queue" }],
        right: [{ id: "lifo", text: "LIFO; undo veya çağrı yığını" }, { id: "fifo", text: "FIFO; görev kuyruğu veya BFS" }]
      },
      answer: { stack: "lifo", queue: "fifo" },
      hint: "Stack son ekleneni, queue ilk ekleneni önce işler.",
      explanationShort: "Stack LIFO, queue FIFO davranır.",
      explanationLong: "İki yapı da uç işlemlerini verimli sağlayabilir; ayırıcı özellik çıkarma sırasıdır. Stack'te push/pop aynı uçtan, queue'da offer sonda ve poll başta çalışır.",
      assumptions: "Yapılar null değildir; boş yapı işlemlerinin sonucu kullanılan API ile tanımlanır, kapasite taşmaz. Uygun Deque uygulamasında temel işlemler amortize Θ(1), n öğe alanı Θ(n)'dir.",
      tags: ["queue", "stack", "fifo", "lifo"]
    }),
    card({
      id: "A27-01", sourceId: "A27", topic: "Linked list", difficulty: "Kolay", type: "match",
      prompt: "n elemanlı dizi ile tek yönlü linked list özelliklerini eşleştirin.",
      pairs: {
        left: [{ id: "array-access", text: "Dizide i indeksine erişim" }, { id: "list-access", text: "Linked listte i. düğüme erişim" }, { id: "list-head", text: "Linked list başına ekleme" }, { id: "memory", text: "Linked list düğümünün ek maliyeti" }],
        right: [{ id: "constant", text: "Θ(1)" }, { id: "linear", text: "Θ(n) en kötü" }, { id: "head-constant", text: "Yeni head bağlantısıyla Θ(1)" }, { id: "pointer", text: "Her düğümde next referansı ve nesne yükü" }]
      },
      answer: { "array-access": "constant", "list-access": "linear", "list-head": "head-constant", memory: "pointer" },
      hint: "Dizi adres hesaplar; linked list bağlantıları izler.",
      explanationShort: "Dizi rastgele erişimde sabit; liste erişimde doğrusal, başa eklemede sabittir ve bağlantı belleği taşır.",
      explanationLong: "Node tipik olarak value ve next alanlarıyla modellenir. Linked list bitişik bellek istemez ve head biliniyorsa başa ekleme Θ(1)'dir; ancak i. düğüm için baştan i bağlantı izlenir.",
      assumptions: "Yapılar null referans değil; boş listede head=null ve geçerli indeks yoktur. İndis/boyut taşmaz. Dizi erişimi Θ(1), liste erişimi en kötü Θ(n), başa ekleme Θ(1), toplam bellek Θ(n)'dir.",
      tags: ["linked-list", "array", "node"]
    }),
    card({
      id: "A28-01", sourceId: "A28", topic: "Binary search", difficulty: "Orta", type: "multi",
      prompt: "Verilen binary search kodundaki doğruluk veya ilerleme sorunlarını seçin.",
      code: `int left = 0;\nint right = arr.length;\nwhile (left <= right) {\n    int mid = (left + right) / 2;\n    if (arr[mid] == target) return mid;\n    else if (arr[mid] < target) left = mid;\n    else right = mid;\n}`,
      options: choices(["right başlangıçta arr.length - 1 olmalı", "Hedef büyükse left = mid + 1 olmalı", "Hedef küçükse right = mid - 1 olmalı", "(left + right) toplamı çok büyük indislerde taşabilir"]), answer: ["a", "b", "c", "d"],
      hint: "Aralık kapsayıcıysa son geçerli indeksi ve her adımda mid'in dışlanmasını kontrol edin.",
      explanationShort: "Başlangıç sınırı hatalıdır; iki güncelleme mid'i dışlamaz ve orta hesaplaması overflow riski taşır.",
      explanationLong: "Kapsayıcı [left,right] aralığında right=length-1'dir. Karşılaştırılan mid eşit değilse yeniden aday olamaz, bu yüzden +1/-1 gerekir; aksi halde sonsuz döngü olabilir. Güvenli orta left+(right-left)/2'dir.",
      assumptions: "arr null değildir ve artan sıralıdır; boş dizi -1 vermelidir. İndis toplama taşması güvenli formülle önlenir. Düzeltilmiş algoritma Θ(log n) zaman, Θ(1) alan kullanır.",
      tags: ["binary-search", "off-by-one", "sonsuz-dongu", "overflow"]
    }),
    card({
      id: "A28-02", sourceId: "A28", topic: "Binary search", difficulty: "Orta", type: "single",
      prompt: "Kapsayıcı [left,right] aralığı kullanan doğru ve overflow-güvenli binary search parçası hangisidir?",
      options: choices(["right=arr.length-1; mid=left+(right-left)/2; küçükse left=mid+1; büyükse right=mid-1", "right=arr.length; mid=(left+right)/2; küçükse left=mid; büyükse right=mid", "right=arr.length-1; mid=right-left/2; küçükse right=mid-1; büyükse left=mid+1", "right=arr.length; mid=left; iki durumda da left++"]), answer: "a",
      hint: "Geçerli son indeks length-1 ve elenen orta nokta bir sonraki aralıkta bulunmamalıdır.",
      explanationShort: "Doğru parça son geçerli sınırı kullanır, mid'i dışlar ve toplam taşmasını önler.",
      explanationLong: "left+(right-left)/2, left ve right geçerliyken güvenli fark üzerinden hesaplanır. Her başarısız karşılaştırma aralığı kesin küçültür; algoritma sonlanır ve logaritmik çalışır.",
      optionExplanations: { b: "length geçersiz indeks ve mid'i koruyan güncellemeler ilerlememe üretir.", c: "Orta formülü parantezsiz yanlış ve yönler ters.", d: "Doğrusal ilerler, right geçersizdir ve binary search mantığını kullanmaz." },
      assumptions: "arr null değildir, artan sıralı ve int ile indekslenebilir; boş dizi right=-1 ile doğal olarak -1 döner. Güvenli mid hesabı overflow'u önler. Zaman Θ(log n), alan Θ(1)'dir.",
      tags: ["binary-search", "guvenli-mid", "sinir"]
    }),
    card({
      id: "A29-01", sourceId: "A29", topic: "Binary search", difficulty: "Orta", type: "output",
      prompt: "firstIndex({1,2,2,2,5}, 2) çağrısı ne döndürür?",
      code: `static int firstIndex(int[] a, int target) {\n    int left=0, right=a.length-1, result=-1;\n    while (left<=right) {\n        int mid=left+(right-left)/2;\n        if (a[mid] >= target) {\n            if (a[mid] == target) result=mid;\n            right=mid-1;\n        } else { left=mid+1; }\n    }\n    return result;\n}`,
      answer: "1",
      hint: "Eşleşme bulunduğunda durmak yerine daha solda eşleşme arayın.",
      explanationShort: "2'nin ilk görüldüğü indeks 1'dir.",
      explanationLong: "İlk eşleşme result'a kaydedilir ve right sola çekilir. Böylece daha küçük eşleşen indeks varsa bulunur; yoksa son kaydedilen indeks döner.",
      assumptions: "a null değildir ve artan sıralıdır; boş dizi veya bulunamayan hedef -1 verir. Güvenli mid hesabı taşmaz. Zaman Θ(log n), yardımcı alan Θ(1)'dir.",
      tags: ["binary-search", "first-occurrence", "duplicate"]
    }),
    card({
      id: "A29-02", sourceId: "A29", topic: "Binary search", difficulty: "Orta", type: "order",
      prompt: "Hedefin ilk indeksini bulan binary search'te bir eşleşme görüldüğünde yapılacak işlemleri sıralayın.",
      items: [{ id: "save", text: "mid indeksini geçici sonuç olarak kaydet" }, { id: "left-half", text: "right = mid - 1 ile sol yarıda aramayı sürdür" }, { id: "finish", text: "Döngü bitince son kaydedilen indeksi döndür" }],
      answer: ["save", "left-half", "finish"],
      hint: "Eşleşmeyi kaybetmeden daha küçük indeks aramalısınız.",
      explanationShort: "Eşleşme kaydedilir, sol yarı aranır ve sonunda en soldaki kayıt döner.",
      explanationLong: "İlk eşleşmede dönmek herhangi bir kopyayı verir. result değişkeni bulunan adayı korur; sağ sınırı azaltmak daha soldaki olası eşleşmeleri araştırır. Aralık her seferinde yarıya iner.",
      assumptions: "Dizi null değildir, artan sıralıdır; tekrar olabilir, boş veya hedef yoksa -1 döner. İndis hesabı taşmaz. Zaman Θ(log n), yardımcı alan Θ(1)'dir.",
      tags: ["binary-search", "ilk-indeks", "invariant"]
    }),
    card({
      id: "A30-01", sourceId: "A30", topic: "Stack", difficulty: "Orta", type: "boolean",
      prompt: "Yalnız ()[]{} karakterlerini kabul eden dengeli parantez denetiminde \"{[()]}\" geçerli, \"([)]\" geçersizdir.",
      options: choices(["Doğru", "Yanlış"]), answer: true,
      hint: "Kapanış karakteri, en son açılan türle eşleşmelidir.",
      explanationShort: "Doğru. İlk ifade düzgün iç içedir; ikincide ] geldiğinde tepede ( vardır.",
      explanationLong: "Stack LIFO olduğu için en içte/en son açılan parantez önce kapanır. Tür eşleşmezse ifade hemen reddedilir; tüm girdi bitince stack de boş olmalıdır.",
      optionExplanations: { a: "Doğru seçimdir; ilk ifade düzgün iç içedir, ikincisinde kapanış türü stack tepesine uymaz.", b: "Yanlış seçimdir; ([)] ifadesinde kapanış sırası açılışların ters sırasına uymaz." },
      assumptions: "s null değildir ve yalnız altı parantez karakterini içerir; boş String dengeli kabul edilir. Uzunluk taşmaz. Zaman Θ(n), en kötü yardımcı alan Θ(n)'dir.",
      tags: ["balanced-brackets", "stack", "lifo"]
    }),
    card({
      id: "A30-02", sourceId: "A30", topic: "Stack", difficulty: "Orta", type: "order",
      prompt: "Dengeli parantez algoritmasının temel adımlarını sıralayın.",
      items: [{ id: "scan", text: "Karakterleri soldan sağa tara" }, { id: "push", text: "Açılış karakterini stack'e koy" }, { id: "close", text: "Kapanışta stack boşsa veya tepe türü uymuyorsa false dön; uyarsa pop yap" }, { id: "end", text: "Tarama sonunda stack boşsa true dön" }],
      answer: ["scan", "push", "close", "end"],
      hint: "Açılışlar bekleyen işleri, kapanışlar son bekleyeni tamamlar.",
      explanationShort: "Açılışlar push edilir, kapanışlar eşleşen tepeyi pop eder, sonunda stack boş olmalıdır.",
      explanationLong: "Her karakter en fazla bir push ve bir pop işlemine neden olur. Erken hatalar hemen dönebilir; tamamen açılışlardan oluşan girdi n öğe stack alanı gerektirir.",
      assumptions: "s null değildir; boş metin true'dur, yalnız ()[]{} geçerlidir ve diğer karakter politikası reddetmedir. Boyut taşmaz. Zaman Θ(n), en kötü alan Θ(n)'dir.",
      tags: ["balanced-brackets", "stack", "algoritma-adimlari"]
    }),
    card({
      id: "A31-01", sourceId: "A31", topic: "Queue", difficulty: "Orta", type: "output",
      prompt: "Kod first, next ve kuyruğun kalan sırası için ne yazdırır?",
      code: `Queue<Integer> queue = new ArrayDeque<>();\nqueue.offer(10);\nqueue.offer(20);\nint first = queue.poll();\nqueue.offer(30);\nint next = queue.peek();\nSystem.out.print(first + "," + next + "," + queue);`,
      answer: "10,20,[20, 30]", acceptedAnswers: ["10, 20, [20, 30]"],
      hint: "poll başı çıkarır; peek yeni başı çıkarmadan okur.",
      explanationShort: "first=10, next=20 ve kalan FIFO sırası [20, 30]'dur.",
      explanationLong: "10 ve 20 eklendikten sonra poll 10'u çıkarır. 30 sona eklenir; peek baştaki 20'yi döndürür ama silmez. ArrayDeque'nin toString'i yineleme sırasını gösterir.",
      assumptions: "Queue ArrayDeque ve null değildir; null eleman yoktur, poll/peek çağrılarında kuyruk boş değildir. Boyut taşmaz. Her işlem amortize Θ(1), toplam bu sabit program için Θ(1), genel saklama alanı Θ(n)'dir.",
      tags: ["queue", "offer", "poll", "peek"]
    }),
    card({
      id: "A31-02", sourceId: "A31", topic: "Queue", difficulty: "Orta", type: "match",
      prompt: "Queue metotlarını davranışlarıyla eşleştirin.",
      pairs: {
        left: [{ id: "offer", text: "offer(e)" }, { id: "poll", text: "poll()" }, { id: "peek", text: "peek()" }],
        right: [{ id: "append", text: "Elemanı sona eklemeyi dener ve boolean döndürür" }, { id: "remove", text: "Baştakini çıkarır; boşsa null döndürür" }, { id: "inspect", text: "Baştakini çıkarmadan verir; boşsa null döndürür" }]
      },
      answer: { offer: "append", poll: "remove", peek: "inspect" },
      hint: "poll değiştirir, peek yalnız bakar.",
      explanationShort: "offer ekler, poll çıkarır, peek çıkarmadan gösterir.",
      explanationLong: "Bu metotlar exception atan add/remove/element ailesinden farklı olarak kapasite/boşluk durumunu özel dönüşlerle bildirir. ArrayDeque sınırsız büyüyebildiği ölçüde offer genellikle true döner.",
      assumptions: "Queue null değildir; ArrayDeque null eleman kabul etmez. Boş kuyrukta poll/peek null döner, boyut taşmaz. Temel uç işlemleri amortize Θ(1), n öğe alanı Θ(n)'dir.",
      tags: ["queue-api", "offer", "poll", "peek"]
    }),
    card({
      id: "A32-01", sourceId: "A32", topic: "Linked list", difficulty: "Orta", type: "output",
      prompt: "head 4 -> 7 -> 9 -> null listesini gösterdiğinde traverse(head) ne yazdırır?",
      code: `static void traverse(Node head) {\n    int count = 0;\n    Node current = head, last = null;\n    while (current != null) {\n        count++; last = current; current = current.next;\n    }\n    System.out.print(count + "," + (last == null ? "empty" : last.value));\n}`,
      answer: "3,9", acceptedAnswers: ["3, 9"],
      hint: "current null olana kadar düğümleri sayın; last son ziyaret edileni tutar.",
      explanationShort: "Üç düğüm vardır ve son düğümün değeri 9'dur.",
      explanationLong: "Dolaşma her düğümü tam bir kez ziyaret eder. last, current ilerletilmeden önce güncellendiği için döngü sonunda tail düğümünü gösterir.",
      assumptions: "Liste sonlu, döngüsüz ve head null olabilir; bu kartta üç düğüm vardır. value int taşmasıyla işlenmez, düğüm sayısı int sınırını aşmaz. Zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["linked-list", "traversal", "tail"]
    }),
    card({
      id: "A32-02", sourceId: "A32", topic: "Linked list", difficulty: "Orta", type: "single",
      prompt: "Aynı dolaşma sözleşmesinde head == null için doğru sonuç hangisidir?",
      options: choices(["count=0 ve son değer yok", "count=1 ve son değer 0", "NullPointerException zorunludur", "count=-1 ve son değer head"]), answer: "a",
      hint: "while (current != null) döngüsü kaç kez çalışır?",
      explanationShort: "Boş listede düğüm sayısı 0'dır ve son düğüm yoktur.",
      explanationLong: "last başlangıçta null tutulur ve döngü hiç çalışmaz. API son değer için OptionalInt.empty, null sarmalayıcı veya ayrı bir sonuç nesnesi kullanabilir; 0 değerini 'yok' anlamında kullanmak belirsizdir.",
      optionExplanations: { b: "Boş listede düğüm yoktur; 0 geçerli bir düğüm değeri olabilir.", c: "Null head döngü koşuluyla güvenle ele alınabilir.", d: "Negatif sayım için gerekçe yoktur." },
      assumptions: "head null boş listeyi temsil eder; liste döngüsüzdür. Sayım taşmaz. Boş durumda zaman Θ(1), genel n düğüm için Θ(n); yardımcı alan Θ(1)'dir.",
      tags: ["linked-list", "empty-list", "contract"]
    }),
    card({
      id: "A33-01", sourceId: "A33", topic: "Linked list silme", difficulty: "Orta", type: "multi",
      prompt: "Verilen remove metodundaki sorunları seçin.",
      code: `static Node remove(Node head, int target) {\n    Node current = head;\n    while (current.next != null) {\n        if (current.next.value == target) {\n            current.next = current.next.next; return head;\n        }\n        current = current.next;\n    }\n    return head;\n}`,
      options: choices(["head null ise current.next erişimi NullPointerException üretir", "İlk düğüm hedefse hiçbir zaman kontrol edilmez", "Son düğüm hiçbir koşulda silinemez", "Metot ilk eşleşmeyi sildikten sonra dönmeyi unutur"]), answer: ["a", "b"],
      hint: "current'ın kendisi değil current.next kontrol ediliyor; current başlangıçta ne olabilir?",
      explanationShort: "Boş liste korunmamıştır ve head düğümünün değeri hiç sınanmaz.",
      explanationLong: "Önce head==null kontrolü, sonra head.value==target ise head.next dönüşü gerekir. Sonraki düğümler current.next üzerinden güvenle silinebilir; tail de current.next olarak kontrol edildiği için silinebilir.",
      optionExplanations: { c: "current sondan bir önceki düğümdeyken current.next tail'dir ve silinebilir.", d: "Silme dalında return head zaten vardır." },
      assumptions: "Liste sonlu/döngüsüzdür; hedef int karşılaştırması taşmaz. Amaç yalnız ilk eşleşmeyi silmektir. Düzeltilmiş metot en kötü Θ(n) zaman, Θ(1) yardımcı alan kullanır.",
      tags: ["linked-list", "remove", "null", "head"]
    }),
    card({
      id: "A33-02", sourceId: "A33", topic: "Linked list silme", difficulty: "Orta", type: "single",
      prompt: "İlk eşleşen düğümü silen metot için doğru başlangıç kontrolleri hangisidir?",
      options: choices(["if (head == null) return null; if (head.value == target) return head.next;", "if (head == null) return new Node(0); if (head.value == target) return head;", "if (head.next == null) return null;", "head = head.next; ardından her zaman head döndür"]), answer: "a",
      hint: "Boş listeyi ve head'in bizzat hedef olduğu durumu ayrı ele alın.",
      explanationShort: "Null head null kalır; hedef head ise yeni head eski head.next olur.",
      explanationLong: "Tek yönlü listede ilk düğümün öncülü olmadığı için head silme özel durumdur. Diğer düğümlerde predecessor.next bağlantısı atlanacak düğümün next'ine bağlanabilir.",
      optionExplanations: { b: "Boş listede sahte düğüm eklenmez ve hedef head değişmeden bırakılamaz.", c: "Tek düğümlü hedef listeyi ve boş head'i doğru ayırmaz.", d: "Hedef olmasa bile ilk düğümü kaybeder." },
      assumptions: "Liste null head ile boş olabilir, sonlu ve döngüsüzdür; yalnız ilk eşleşme silinir. Değer karşılaştırması taşmaz. En kötü zaman Θ(n), alan Θ(1)'dir.",
      tags: ["linked-list", "head-removal", "guard-clause"]
    }),
    card({
      id: "A34-01", sourceId: "A34", topic: "Slow/fast pointer", difficulty: "Orta", type: "output",
      prompt: "fast=head ve fast iki adım ilerlerken slow bir adım ilerliyorsa 1 -> 2 -> 3 -> 4 listesinde döndürülen orta değer nedir? Çift uzunlukta ikinci orta seçilir.",
      code: `Node slow = head, fast = head;\nwhile (fast != null && fast.next != null) {\n    slow = slow.next;\n    fast = fast.next.next;\n}\nreturn slow;`,
      answer: "3",
      hint: "fast sona ulaştığında slow iki adım ilerlemiş olur.",
      explanationShort: "Dört düğümde ikinci orta olan 3 döndürülür.",
      explanationLong: "İlk yineleme sonrası slow=2, fast=3; ikinci sonrası slow=3, fast=null olur. Başlangıç düzeni çift listelerde n/2 indeksli, yani ikinci orta düğümü seçer.",
      assumptions: "Liste sonlu/döngüsüz ve head null olabilir; null head için null döner. Düğüm sayısı taşmaz. Zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["linked-list", "slow-fast", "middle"]
    }),
    card({
      id: "A34-02", sourceId: "A34", topic: "Slow/fast pointer", difficulty: "Orta", type: "fill",
      prompt: "Slow/fast pointer ile orta düğüm bulmanın sıkı zaman ve yardımcı alan karmaşıklığını 'zaman, alan' biçiminde yazın.",
      answer: "Θ(n), Θ(1)", acceptedAnswers: ["Theta(n), Theta(1)", "theta(n), theta(1)"],
      hint: "Liste bir kez geçilir; düğümler kopyalanmaz.",
      explanationShort: "Sıkı zaman Θ(n), yardımcı alan Θ(1)'dir.",
      explanationLong: "fast yaklaşık n/2 yineleme yapar; bu doğrusal büyümedir. slow, fast ve birkaç referans dışında ek yapı tutulmaz.",
      assumptions: "Liste null olabilir, sonlu ve döngüsüzdür; boş liste null döndürür. Sayaç aritmetiği kullanılmadığı için taşma yoktur. Zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["slow-fast", "karmasiklik", "linked-list"]
    }),
    card({
      id: "A35-01", sourceId: "A35", topic: "Linked list ters çevirme", difficulty: "Orta", type: "order",
      prompt: "Tek yönlü linked list'i iteratif ters çeviren döngünün adımlarını sıralayın.",
      items: [{ id: "save", text: "next = current.next ile kalan listeyi kaydet" }, { id: "reverse", text: "current.next = previous ile bağlantıyı ters çevir" }, { id: "advance-prev", text: "previous = current yap" }, { id: "advance-current", text: "current = next ile eski listede ilerle" }, { id: "return", text: "current null olduğunda previous'ı yeni head olarak döndür" }],
      answer: ["save", "reverse", "advance-prev", "advance-current", "return"],
      hint: "Bağlantıyı değiştirmeden önce eski next referansını kaybetmeyin.",
      explanationShort: "Önce next saklanır, ok ters çevrilir, iki işaretçi ilerletilir ve previous döner.",
      explanationLong: "Döngü değişmezi: previous işlenmiş ters öneki, current işlenmemiş son eki gösterir. next önce saklanmazsa listenin geri kalanına erişim kaybedilir.",
      assumptions: "Liste null head ile boş olabilir, sonlu ve döngüsüzdür; boşta null, tek düğümde aynı head döner. Değer aritmetiği/taşma yoktur. Zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["linked-list", "reverse", "iterative", "invariant"]
    }),
    card({
      id: "A36-01", sourceId: "A36", topic: "Bubble sort", difficulty: "Orta", type: "output",
      prompt: "Tek bubble sort geçişinden sonra 'dizi; karşılaştırma; swap' çıktısı nedir?",
      code: `int[] arr = {5, 1, 4, 2};\nint comparisons = 0, swaps = 0;\nfor (int j = 0; j < arr.length - 1; j++) {\n    comparisons++;\n    if (arr[j] > arr[j + 1]) {\n        int t=arr[j]; arr[j]=arr[j+1]; arr[j+1]=t; swaps++;\n    }\n}`,
      answer: "[1, 4, 2, 5]; 3; 3", acceptedAnswers: ["[1,4,2,5];3;3", "1,4,2,5;3;3"],
      hint: "5 her komşu karşılaştırmada sağa taşınır.",
      explanationShort: "Dizi [1,4,2,5] olur; 3 karşılaştırma ve 3 swap yapılır.",
      explanationLong: "Sırasıyla (5,1), (5,4), (5,2) çiftleri yer değiştirir. Tek tam geçiş en büyük elemanı sona yerleştirir; tüm diziyi mutlaka sıralamaz.",
      assumptions: "arr null değildir ve dört elemanlıdır; boş/tek elemanda sıfır işlem yapılır. Karşılaştırma/swap sayaçları taşmaz. Tek geçiş zamanı Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["bubble-sort", "trace", "swap"]
    }),
    card({
      id: "A37-01", sourceId: "A37", topic: "Bubble sort", difficulty: "Orta", type: "multi",
      prompt: "Swap bayrağıyla erken çıkan standart bubble sort için doğru özellikleri seçin.",
      options: choices(["Sıralı girdide en iyi zaman Θ(n)'dir", "Ters sıralı girdide kötü zaman Θ(n²)'dir", "Komşu eşit elemanlar değiştirilmezse kararlıdır", "Yardımcı alanı Θ(n)'dir"]), answer: ["a", "b", "c"],
      hint: "İlk geçişte swap yoksa durur; swap yalnız > karşılaştırmasında yapılır.",
      explanationShort: "Optimize bubble sort sıralıda doğrusal, kötü durumda karesel, standart biçimde kararlı ve yerindedir.",
      explanationLong: "İlk geçiş n-1 karşılaştırma yapıp swap görmezse sonlanır. Ters sırada üçgensel sayıda karşılaştırma/swap oluşur. Eşitlerin sırası korunur ve yalnız sabit geçici bellek kullanılır.",
      optionExplanations: { d: "Yerinde uygulama bayrak ve geçici değer dışında sabit yardımcı alan kullanır." },
      assumptions: "arr null değildir; boş/tek eleman zaten sıralıdır. Karşılaştırıcı tutarlı, sayaçlar taşmaz. En iyi Θ(n), ortalama/kötü Θ(n²), yardımcı alan Θ(1)'dir.",
      tags: ["bubble-sort", "early-exit", "stable"]
    }),
    card({
      id: "A37-02", sourceId: "A37", topic: "Bubble sort", difficulty: "Orta", type: "output",
      prompt: "Erken çıkışlı bubble sort {1,2,3,4} için tamamlandığında 'dış geçiş, karşılaştırma, swap' sayaçları nedir?",
      code: `int passes=0, comparisons=0, swaps=0;\nfor (int end=arr.length-1; end>0; end--) {\n    boolean swapped=false; passes++;\n    for (int j=0; j<end; j++) {\n        comparisons++;\n        if (arr[j] > arr[j+1]) { /* swap */ swaps++; swapped=true; }\n    }\n    if (!swapped) break;\n}`,
      answer: "1,3,0", acceptedAnswers: ["1, 3, 0"],
      hint: "İlk geçişte hiçbir ters komşu yoktur.",
      explanationShort: "Bir geçiş, üç karşılaştırma, sıfır swap yapılır.",
      explanationLong: "swapped false kaldığı için ilk dış yineleme sonunda break çalışır. n elemanlı sıralı girdide n-1 karşılaştırma yapılması en iyi sıkı zamanı Θ(n) yapar.",
      assumptions: "arr null değildir ve artan sıralı dört elemanlıdır; boş/tek elemanda döngü yoktur. Sayaçlar taşmaz. Bu girdi için ve genel sıralı n için zaman Θ(n), alan Θ(1)'dir.",
      tags: ["bubble-sort", "best-case", "trace"]
    }),
    card({
      id: "A38-01", sourceId: "A38", topic: "Selection sort", difficulty: "Orta", type: "order",
      prompt: "Selection sort'un her dış döngü yinelemesindeki adımları sıralayın.",
      items: [{ id: "start", text: "minIndex = i ile sıralanmamış bölümün başını aday seç" }, { id: "scan", text: "i+1..n-1 aralığını tarayıp en küçük elemanın indeksini bul" }, { id: "swap", text: "minIndex farklıysa a[i] ile a[minIndex]'i değiştir" }, { id: "invariant", text: "0..i önekinin nihai ve sıralı olduğunu kabul ederek ilerle" }],
      answer: ["start", "scan", "swap", "invariant"],
      hint: "Önce minimum bulunur, sonra sıralı önekin sonuna yerleştirilir.",
      explanationShort: "Sıralanmamış bölümün minimumu bulunup i konumuna alınır; doğru önek bir büyür.",
      explanationLong: "Döngü değişmezi, i öncesindeki elemanların nihai konumunda olmasıdır. Her yineleme kalan minimumu seçtiği için bu değişmez korunur.",
      assumptions: "arr null değildir; boş/tek eleman değişmez. Karşılaştırıcı tutarlı ve indisler taşmaz. Her durumda zaman Θ(n²), yardımcı alan Θ(1)'dir.",
      tags: ["selection-sort", "invariant", "order"]
    }),
    card({
      id: "A38-02", sourceId: "A38", topic: "Selection sort", difficulty: "Orta", type: "output",
      prompt: "Selection sort {4,3,2,1} dizisinde i=0 ve i=1 dış yinelemeleri tamamlandıktan sonra dizi nedir?",
      answer: "[1, 2, 3, 4]", acceptedAnswers: ["[1,2,3,4]", "1,2,3,4"],
      hint: "İlkinde 1 başa, ikincide kalan bölümün minimumu 2 indeks 1'e gelir.",
      explanationShort: "İlk geçiş [1,3,2,4], ikinci geçiş [1,2,3,4] üretir.",
      explanationLong: "i=0 için minIndex=3 ve 4 ile 1 swap edilir. i=1 için {3,2,4} bölümünün minimumu 2'dir ve 3 ile değiştirilir. Son kısım tesadüfen de sıralanmış olur.",
      assumptions: "Dizi null değildir ve karşılaştırma doğal int sırasıdır; boş/tek eleman değişmez. Swap taşma yapmaz. İki geçişin bu sabit girdide maliyeti Θ(1), genel tam algoritma Θ(n²) zaman/Θ(1) alandır.",
      tags: ["selection-sort", "trace", "dizi"]
    }),
    card({
      id: "A39-01", sourceId: "A39", topic: "Insertion sort", difficulty: "Orta", type: "output",
      prompt: "Insertion sort {4,1,3,2} dizisinde i=2 yinelemesi tamamlandığında dizi nedir?",
      code: `for (int i=1; i<a.length; i++) {\n    int key=a[i], j=i-1;\n    while (j>=0 && a[j]>key) { a[j+1]=a[j]; j--; }\n    a[j+1]=key;\n}`,
      answer: "[1, 3, 4, 2]", acceptedAnswers: ["[1,3,4,2]", "1,3,4,2"],
      hint: "i=1 sonrasında [1,4,3,2]; sonra 3 sıralı önekte yerine eklenir.",
      explanationShort: "i=2 sonunda sıralı önek [1,3,4] olur; dizi [1,3,4,2]'dir.",
      explanationLong: "key=3 iken 4 bir sağa kayar ve 3 indeks 1'e yazılır. Döngü değişmezi, i yinelemesi sonunda 0..i önekinin sıralı olmasıdır.",
      assumptions: "arr null değildir; boş/tek eleman değişmez. Karşılaştırıcı tutarlı, değer atamaları taşma üretmez. Genel en iyi Θ(n), kötü Θ(n²), yardımcı alan Θ(1)'dir.",
      tags: ["insertion-sort", "trace", "sorted-prefix"]
    }),
    card({
      id: "A39-02", sourceId: "A39", topic: "Insertion sort", difficulty: "Orta", type: "single",
      prompt: "Insertion sort neredeyse sıralı dizilerde neden avantajlı olabilir?",
      options: choices(["Çalışması Θ(n + k) olabilir; k ters çift sayısı azsa doğrusal sınıra yaklaşır", "Her zaman tam n² swap yapmak zorundadır", "Ek olarak Θ(n) boyutlu hash table kurar", "Yalnızca tüm elemanlar farklıysa çalışır"]), answer: "a",
      hint: "İç döngü yalnız key'den büyük önceki elemanları kaydırır.",
      explanationShort: "Maliyet terslik sayısıyla ilişkilidir; az terslik az kaydırma demektir.",
      explanationLong: "Dış döngünün Θ(n) taban maliyetine ek olarak her inversion yaklaşık bir kaydırma doğurur. Bu nedenle ince analiz Θ(n+k)'dır; k=0 iken Θ(n), k=Θ(n²) iken Θ(n²) olur.",
      optionExplanations: { b: "Sıralı girdide iç döngü hemen durur.", c: "Standart insertion sort yerindedir.", d: "Eşit değerlerle de çalışır ve uygun karşılaştırmayla kararlı kalır." },
      assumptions: "arr null değildir; eşit elemanlara izin verilir, karşılaştırma tutarlıdır. Boş/tek eleman geçerlidir, indis taşması yoktur. Zaman sıkı Θ(n+k), yardımcı alan Θ(1)'dir.",
      tags: ["insertion-sort", "nearly-sorted", "inversion"]
    }),
    card({
      id: "A40-01", sourceId: "A40", topic: "Sıralama karşılaştırması", difficulty: "Orta", type: "match",
      prompt: "Standart yerinde uygulamaları özellik kümeleriyle eşleştirin.",
      pairs: {
        left: [{ id: "bubble", text: "Erken çıkışlı bubble sort" }, { id: "selection", text: "Selection sort" }, { id: "insertion", text: "Insertion sort" }],
        right: [{ id: "b-props", text: "Kararlı; en iyi Θ(n), kötü Θ(n²); kötü durumda Θ(n²) swap" }, { id: "s-props", text: "Genelde kararsız; her durumda Θ(n²) karşılaştırma; en fazla n-1 swap" }, { id: "i-props", text: "Kararlı; en iyi Θ(n), kötü Θ(n²); terslik kadar kaydırma" }]
      },
      answer: { bubble: "b-props", selection: "s-props", insertion: "i-props" },
      hint: "Selection minimumu uzağa swap eder; insertion sıralı öneğe ekler.",
      explanationShort: "Bubble ve insertion standart biçimde kararlı; selection az swap yapar ama genelde kararsızdır.",
      explanationLong: "Üçü de Θ(1) yardımcı alanla yerinde uygulanabilir. Optimize bubble ve insertion sıralı girdide Θ(n)'e iner. Selection minimumu bulmak için girdi düzeninden bağımsız üçgensel sayıda karşılaştırma yapar, fakat dış tur başına en çok bir swap gerekir.",
      assumptions: "Diziler null değildir; boş/tek eleman geçerlidir, karşılaştırıcı tutarlıdır ve sayaçlar taşmaz. Standart implementasyonlar sorulur: bubble yalnız > ile swap, insertion eşitleri kaydırmaz, selection uzak swap yapar. Alanların tümü Θ(1)'dir.",
      tags: ["sorting", "stability", "in-place", "comparison"]
    }),
    card({
      id: "A41-01", sourceId: "A41", topic: "Recursion", difficulty: "Orta", type: "fill",
      prompt: "Recursion'da daha fazla recursive çağrı yapmadan doğrudan sonuç döndüren koşulun adını yazın.",
      answer: "base case", acceptedAnswers: ["temel durum", "taban durum", "base-case"],
      hint: "Çağrı zincirinin durmasını sağlayan durumdur.",
      explanationShort: "Bu koşula base case (temel/taban durum) denir.",
      explanationLong: "Base case probleme ait en küçük doğrudan çözülebilir girdiyi tanımlar. Recursive adım girdiyi bu duruma yaklaştırmalıdır; yalnız base case yazmak, erişilebilir değilse sonlanmayı garanti etmez.",
      assumptions: "Kavramsal sorudur; recursive fonksiyonun girdisi kendi geçerli alanındadır, null/boş durum gerekiyorsa base case içinde tanımlanır. Taşma yoktur. Zaman/alan bağıntısı probleme bağlıdır; çağrı derinliği d ise stack alanı sıkı Θ(d)'dir.",
      tags: ["recursion", "base-case", "termination"]
    }),
    card({
      id: "A41-02", sourceId: "A41", topic: "Recursion", difficulty: "Orta", type: "single",
      prompt: "Çok derin veya sonlanmayan recursive çağrılar Java'da neden StackOverflowError üretebilir?",
      options: choices(["Her çağrı yerel durum ve dönüş adresi için bir stack frame tüketir", "Heap her çağrıda zorunlu olarak sıfırlanır", "JVM recursive metotları hiç desteklemez", "Base case sonucu int türüne sığmaz"]), answer: "a",
      hint: "Henüz dönmemiş her çağrının bilgisinin nerede tutulduğunu düşünün.",
      explanationShort: "Her aktif çağrı call stackte bir frame tutar; sınırlı stack tükenebilir.",
      explanationLong: "Çağrılar base case'e ulaşana kadar frame'ler birikir ve dönüşlerde LIFO sırasıyla çözülür. Derinlik stack sınırını aşarsa, matematiksel sonuç doğru olsa bile StackOverflowError oluşur. Java genel olarak tail-call optimizasyonu garantilemez.",
      optionExplanations: { b: "Heap sıfırlanması çağrı mekanizması değildir.", c: "Java recursion'ı destekler.", d: "Sayısal taşma farklı bir hata sınıfıdır." },
      assumptions: "Girdi null/boş durumu sözleşmeyle base case'e bağlanır; sayısal taşma bu kartın konusu değildir. Çağrı derinliği d için sıkı stack alanı Θ(d); zaman, çağrı sayısı c için Θ(c)'dir.",
      tags: ["recursion", "call-stack", "stack-overflow"]
    }),
    card({
      id: "A42-01", sourceId: "A42", topic: "Recursive faktoriyel", difficulty: "Orta", type: "multi",
      prompt: "Verilen recursive faktoriyel metodunun sorunlarını seçin.",
      code: `static long factorial(int n) {\n    if (n == 1) return 1;\n    return n * factorial(n - 1);\n}`,
      options: choices(["n=0 için base case'e ulaşmaz ve stack taşar", "Negatif n için de çağrılar 1'e yaklaşmaz", "Yeterince büyük pozitif n için long aritmetiği taşar", "n=1 için yanlışlıkla 0 döndürür"]), answer: ["a", "b", "c"],
      hint: "0!, geçerli girdi alanı ve long üst sınırını ayrı kontrol edin.",
      explanationShort: "0 ve negatif girdiler sonlanmaz; büyük pozitif sonuçlar long'u taşır.",
      explanationLong: "Doğru temel durum n==0 veya n<=1 olabilir, ancak negatif değerler önce reddedilmelidir. long ile 20!'ye kadar doğru sonuç alınır; daha büyüğü kontrol edilmezse sessizce sarılır.",
      optionExplanations: { d: "n=1 koşulu doğrudan 1 döndürür." },
      assumptions: "n int'tir; hedef sözleşme n>=0, 0!=1 ve n>20 için taşma hatasıdır. Null girdi yoktur. Düzeltilmiş algoritma Θ(n) zaman ve recursive olduğu için Θ(n) stack alanı kullanır.",
      tags: ["recursion", "factorial", "base-case", "overflow"]
    }),
    card({
      id: "A42-02", sourceId: "A42", topic: "Recursive faktoriyel", difficulty: "Orta", type: "output",
      prompt: "Düzeltilmiş metot factorial(5) için ne döndürür?",
      code: `static long factorial(int n) {\n    if (n < 0) throw new IllegalArgumentException();\n    if (n <= 1) return 1L;\n    return Math.multiplyExact((long) n, factorial(n - 1));\n}`,
      answer: "120", acceptedAnswers: ["120L"],
      hint: "5 × 4 × 3 × 2 × 1 işlemini izleyin.",
      explanationShort: "5! = 120'dir.",
      explanationLong: "Çağrılar 5'ten 1'e iner, sonra dönüşte çarpımlar yapılır. Math.multiplyExact long taşmasını ArithmeticException ile görünür kılar; 5 için taşma yoktur.",
      assumptions: "n>=0 geçerlidir; negatifte IllegalArgumentException, n>20 için ArithmeticException oluşur; 0!=1. Null yoktur. Geçerli n için zaman Θ(n), çağrı stack alanı Θ(n)'dir.",
      tags: ["recursive-factorial", "multiplyExact", "kod-ciktisi"]
    }),
    card({
      id: "A43-01", sourceId: "A43", topic: "Recursive Fibonacci", difficulty: "Orta", type: "single",
      prompt: "Naif recursive fib(n) için sıkı asimptotik zaman ve en büyük çağrı-stack alanı hangisidir?",
      code: `if (n <= 1) return n;\nreturn fib(n - 1) + fib(n - 2);`,
      options: choices(["Θ(φⁿ) zaman, Θ(n) stack", "Θ(n) zaman, Θ(1) stack", "Θ(n²) zaman, Θ(n²) stack", "Θ(log n) zaman, Θ(log n) stack"]), answer: "a",
      hint: "Çağrı ağacı dallanır; tek bir kökten yaprağa yolun uzunluğu n'dir.",
      explanationShort: "Naif çağrı sayısı Fibonacci gibi büyür: Θ(φⁿ); maksimum derinlik Θ(n)'dir.",
      explanationLong: "fib(n-1) ve fib(n-2) aynı alt problemleri tekrar tekrar hesaplar. Toplam çağrı sayısı Θ(F_n)=Θ(φⁿ) iken aynı anda aktif olan en uzun zincir n seviyelidir. O(2ⁿ) geçerli fakat sıkı olmayan yaygın bir üst sınırdır.",
      optionExplanations: { b: "Memoization olmadan alt problemler tekrar edilir.", c: "Çağrı sayısı polinom değil üsteldir; aynı anda tüm ağaç stackte tutulmaz.", d: "Girdi yarıya indirilmiyor." },
      assumptions: "0<=n<=46 ile int sonucu taşmaz; negatif girdi reddedilir, null yoktur. φ altın orandır. Sıkı zaman Θ(φⁿ), stack yardımcı alanı Θ(n)'dir.",
      tags: ["fibonacci", "recursion", "exponential", "stack"]
    }),
    card({
      id: "A43-02", sourceId: "A43", topic: "Recursive Fibonacci", difficulty: "Orta", type: "output",
      prompt: "Naif fib(5) değerlendirilirken fib(2) metodu toplam kaç kez çağrılır?",
      code: `static int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}`,
      answer: "3",
      hint: "fib(5) ağacını fib(4)+fib(3), sonra alt dallar olarak açın.",
      explanationShort: "fib(2) üç ayrı dalda yeniden hesaplanır.",
      explanationLong: "fib(4) içinde iki, fib(3) içinde bir fib(2) çağrısı vardır. Bu tekrar memoization ile her n değeri bir kez hesaplanarak giderilebilir ve zaman Θ(n)'e düşürülebilir.",
      assumptions: "n=5 negatif olmayan ve int taşması üretmeyen sabit girdidir; null yoktur. Bu çağrı için sayı sabittir; genel naif algoritma Θ(φⁿ) zaman, Θ(n) stack alanı kullanır.",
      tags: ["fibonacci", "repeated-subproblem", "trace"]
    }),
    card({
      id: "A44-01", sourceId: "A44", topic: "Two sum", difficulty: "Orta", type: "output",
      prompt: "Metot twoSum(new int[]{2,7,11,15}, 9) için hangi indeksleri döndürür?",
      code: `static int[] twoSum(int[] a, int target) {\n    Map<Integer,Integer> seen = new HashMap<>();\n    for (int i=0; i<a.length; i++) {\n        int need = target - a[i];\n        if (seen.containsKey(need)) return new int[]{seen.get(need), i};\n        seen.put(a[i], i);\n    }\n    return new int[0];\n}`,
      answer: "[0, 1]", acceptedAnswers: ["[0,1]", "0,1"],
      hint: "7 işlenirken gerekli tamamlayıcı 2 daha önce görülmüştür.",
      explanationShort: "2 + 7 = 9 olduğundan indeksler [0,1]'dir.",
      explanationLong: "Map yalnız önceki indeksleri içerdiği için aynı eleman iki kez kullanılmaz. i=1 anında need=2 bulunur ve kayıtlı indeks 0 ile mevcut indeks 1 döner.",
      assumptions: "a null değildir; çözüm yoksa boş int[] döner, birden çok çözümde taramada ilk bulunan döner. target-a[i] int taşması oluşturmayacak aralıktadır. Beklenen zaman Θ(n), alan Θ(n)'dir.",
      tags: ["two-sum", "hashmap", "indices"]
    }),
    card({
      id: "A44-02", sourceId: "A44", topic: "Two sum", difficulty: "Orta", type: "multi",
      prompt: "Tek geçişli Map tabanlı two-sum için doğru ifadeleri seçin.",
      options: choices(["Mevcut değeri Map'e koymadan önce tamamlayıcıyı aramak aynı indeksi iki kez kullanmayı önler", "Tek çözüm garantisi yoksa döndürülecek çift politikası belirtilmelidir", "Beklenen zaman Θ(n), yardımcı alan en kötü Θ(n)'dir", "target - value işlemi int türünde hiçbir zaman taşmaz"]), answer: ["a", "b", "c"],
      hint: "Algoritma sözleşmesi, işlem sırası ve sayısal aralığı ayrı değerlendirin.",
      explanationShort: "Arama-önce-ekleme doğru indeksleri korur; sonuç politikası ve doğrusal/bellek maliyeti açıktır.",
      explanationLong: "Map daha önce görülen değerleri indeksleriyle tutar. Birden çok çift varsa tarama sırasındaki ilk eşleşme doğal politikadır. int çıkarma taşabileceği için geniş aralıkta long tamamlayıcı veya açık sınır gerekir.",
      optionExplanations: { d: "Örneğin target pozitif ve value çok negatif olduğunda çıkarma int aralığını aşabilir." },
      assumptions: "a null değildir; çözüm olmayabilir ve tekrar eden değerlere izin verilir. Bu kartta çıkarma taşmayacak girdiler veya long hesap kullanılır. Beklenen zaman Θ(n), patolojik hashte O(n²), alan Θ(n)'dir.",
      tags: ["two-sum", "hashmap", "overflow", "contract"]
    }),
    card({
      id: "A45-01", sourceId: "A45", topic: "Two pointer", difficulty: "Orta", type: "output",
      prompt: "Artan sıralı {-2,1,4,6,9} dizisinde hedef 10 için two-pointer metodu hangi indeksleri döndürür?",
      code: `int left=0, right=a.length-1;\nwhile (left<right) {\n    long sum=(long)a[left]+a[right];\n    if (sum==target) return new int[]{left,right};\n    if (sum<target) left++; else right--;\n}\nreturn new int[0];`,
      answer: "[1, 4]", acceptedAnswers: ["[1,4]", "1,4"],
      hint: "Önce -2+9=7 küçük olduğu için solu ilerletin.",
      explanationShort: "İndeks 1'deki 1 ile indeks 4'teki 9 toplamı 10'dur.",
      explanationLong: "Sıralılık sayesinde küçük toplamda sol değer artırılır. İlk adımın ardından 1+9=10 bulunur. long toplam int ekleme taşmasını önler.",
      assumptions: "a null değildir ve artan sıralıdır; çözüm yoksa boş dizi, birden çok çözümde dıştan ilk bulunan çift döner. Toplam long hesaplanır. Zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["two-pointer", "two-sum", "sorted-array"]
    }),
    card({
      id: "A45-02", sourceId: "A45", topic: "Two pointer", difficulty: "Orta", type: "single",
      prompt: "Artan sıralı dizide toplam hedeften küçükse neden left artırılır?",
      options: choices(["Mevcut left ile daha küçük/eşit bir sağ değer toplamı büyütemez; daha büyük sol aday gerekir", "right artırılırsa dizi uzar", "left her zaman hedefin indeksidir", "Bu hareket yalnız tüm sayılar pozitifse doğrudur"]), answer: "a",
      hint: "Sıralılık altında sabit sol değerle sağ işaretçiyi sola çekmenin etkisini düşünün.",
      explanationShort: "Mevcut en büyük sağ adayla toplam bile küçükse mevcut sol hiçbir çözümde kullanılamaz.",
      explanationLong: "right o anda kalan en büyük değerdir. a[left]+a[right]<target ise aynı left ile daha soldaki tüm sağ değerler daha küçük toplam verir; left güvenle elenir. Argüman negatif sayılarda da sıralılık sayesinde geçerlidir.",
      optionExplanations: { b: "İşaretçi hareketi dizinin boyutunu değiştirmez.", c: "left yalnız aday sınırdır.", d: "Monotonluk pozitiflikten değil sıralı değerlerden gelir." },
      assumptions: "Dizi null değildir ve artan sıralıdır; boş/tek elemanda çift yoktur. Toplam long ile overflow-güvenlidir. Her indeks en fazla bir kez geçildiği için sıkı zaman Θ(n), alan Θ(1)'dir.",
      tags: ["two-pointer", "monotonicity", "proof"]
    }),
    card({
      id: "A46-01", sourceId: "A46", topic: "Tekrar kaldırma", difficulty: "Orta", type: "output",
      prompt: "removeDuplicates({1,1,2,2,3}) çağrısı yeni uzunluk ve geçerli önek olarak ne üretir?",
      code: `static int removeDuplicates(int[] a) {\n    if (a.length == 0) return 0;\n    int write=1;\n    for (int read=1; read<a.length; read++) {\n        if (a[read] != a[write-1]) a[write++] = a[read];\n    }\n    return write;\n}`,
      answer: "3; [1, 2, 3]", acceptedAnswers: ["3;[1,2,3]", "3,1,2,3"],
      hint: "write yalnız yeni bir değer görüldüğünde ilerler.",
      explanationShort: "Yeni uzunluk 3, geçerli önek [1,2,3]'tür.",
      explanationLong: "Sıralılık tekrarları bitişik yapar. read yeni değer bulduğunda onu bir sonraki write konumuna yazar. Yeni uzunluktan sonraki hücrelerin içeriği sözleşme dışıdır.",
      assumptions: "a null değildir ve artan sıralıdır; boş dizi 0 döner, tekrar/eşitlik int düzeyindedir. İndisler taşmaz. Zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["two-pointer", "remove-duplicates", "in-place"]
    }),
    card({
      id: "A46-02", sourceId: "A46", topic: "Tekrar kaldırma", difficulty: "Orta", type: "fill",
      prompt: "Sıralı dizide read/write işaretçileriyle yerinde tekrar kaldırmanın sıkı zaman ve yardımcı alanını 'zaman, alan' biçiminde yazın.",
      answer: "Θ(n), Θ(1)", acceptedAnswers: ["Theta(n), Theta(1)", "theta(n), theta(1)"],
      hint: "read diziyi bir kez tarar; yeni dizi kurulmaz.",
      explanationShort: "Zaman Θ(n), yardımcı alan Θ(1)'dir.",
      explanationLong: "Her eleman read tarafından bir kez görülür ve en fazla bir kez yazılır. Sonuç aynı dizinin önek bölgesinde tutulduğu için birkaç indeks dışında ek bellek yoktur.",
      assumptions: "Dizi null değildir, artan sıralı ve boş olabilir. Değer/indis taşması yoktur. n>0 için sıkı zaman Θ(n), yardımcı alan Θ(1)'dir; n=0 sabit özel durumdur.",
      tags: ["remove-duplicates", "karmasiklik", "in-place"]
    }),
    card({
      id: "A47-01", sourceId: "A47", topic: "Sıfırları taşıma", difficulty: "Orta", type: "output",
      prompt: "moveZeroes({0,1,0,3,12}) tamamlandığında dizi nedir?",
      code: `static void moveZeroes(int[] a) {\n    int write=0;\n    for (int value : a) if (value != 0) a[write++] = value;\n    while (write < a.length) a[write++] = 0;\n}`,
      answer: "[1, 3, 12, 0, 0]", acceptedAnswers: ["[1,3,12,0,0]", "1,3,12,0,0"],
      hint: "Önce sıfır olmayanları sırayla öne yazın, kalan hücreleri sıfırla doldurun.",
      explanationShort: "Sıfır olmayanların sırası korunur ve iki sıfır sona gelir.",
      explanationLong: "write bir sonraki sıfır olmayan değer konumudur. İlk geçiş [1,3,12,...] önekini kurar; ikinci geçiş kalan iki hücreyi sıfırlar.",
      assumptions: "a null değildir; boş/tümü sıfır/tümü sıfır olmayan diziler geçerlidir. Yalnız atama yapıldığından sayısal taşma yoktur. Zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["two-pointer", "move-zeroes", "stable"]
    }),
    card({
      id: "A47-02", sourceId: "A47", topic: "Sıfırları taşıma", difficulty: "Orta", type: "multi",
      prompt: "Sıfırları sona taşıyan read/write çözümü için doğru özellikleri seçin.",
      options: choices(["Sıfır olmayan elemanların göreli sırasını korur", "Girdi dizisini yerinde değiştirir", "Sıkı zaman Θ(n), yardımcı alan Θ(1)'dir", "Sonuçtan sonra dizinin uzunluğu azalır"]), answer: ["a", "b", "c"],
      hint: "Değerler silinmez; yalnız yeniden düzenlenir.",
      explanationShort: "Çözüm kararlı, yerinde, doğrusal zamanlı ve sabit alanlıdır.",
      explanationLong: "Sıfır olmayanlar okuma sırasıyla yazıldığı için kendi aralarındaki düzen korunur. Kalan hücrelere sıfır yazılır; Java dizisinin sabit uzunluğu değişmez.",
      optionExplanations: { d: "Dizi uzunluğu sabittir; yalnız elemanların konumu değişir." },
      assumptions: "Dizi null değildir ve boş olabilir; int değerler yalnız eşitlik testinden geçer, taşma yoktur. Her hücre en az okunur/yazılır: zaman Θ(n), alan Θ(1)'dir.",
      tags: ["move-zeroes", "in-place", "stability"]
    }),
    card({
      id: "A48-01", sourceId: "A48", topic: "Sliding window", difficulty: "Zorlayıcı", type: "output",
      prompt: "maxWindowSum({2,1,5,1,3,2}, 3) hangi long değeri döndürür?",
      code: `static long maxWindowSum(int[] a, int k) {\n    if (a == null || k <= 0 || k > a.length) throw new IllegalArgumentException();\n    long sum=0;\n    for (int i=0; i<k; i++) sum += a[i];\n    long best=sum;\n    for (int r=k; r<a.length; r++) {\n        sum += a[r]; sum -= a[r-k]; best=Math.max(best,sum);\n    }\n    return best;\n}`,
      answer: "9", acceptedAnswers: ["9L"],
      hint: "Uzunluk 3 pencereleri: 2+1+5, 1+5+1, 5+1+3, 1+3+2.",
      explanationShort: "En büyük pencere 5+1+3=9'dur.",
      explanationLong: "İlk toplam 8'dir; her kaymada çıkan değer çıkarılıp giren eklenir. Toplamlar 8,7,9,6 olur. Her eleman sabit sayıda işlenir.",
      assumptions: "a null değildir ve 1<=k<=a.length; boş dizi/geçersiz k IllegalArgumentException üretir. Toplam long ile hesaplanır ve long'u aşmayacak girdi kabul edilir. Zaman Θ(n), alan Θ(1)'dir.",
      tags: ["sliding-window", "fixed-window", "max-sum"]
    }),
    card({
      id: "A48-02", sourceId: "A48", topic: "Sliding window", difficulty: "Zorlayıcı", type: "match",
      prompt: "Uzunluğu k olan maksimum alt dizi toplamı yaklaşımlarını maliyetleriyle eşleştirin.",
      pairs: {
        left: [{ id: "brute", text: "Her başlangıçta k elemanı yeniden topla" }, { id: "window", text: "Çıkanı çıkarıp gireni ekleyen sliding window" }],
        right: [{ id: "nk", text: "Θ((n-k+1)k) zaman, Θ(1) alan" }, { id: "n", text: "Θ(n) zaman, Θ(1) alan" }]
      },
      answer: { brute: "nk", window: "n" },
      hint: "Pencere toplamını baştan kurmakla yalnız iki değerle güncellemeyi karşılaştırın.",
      explanationShort: "Kaba kuvvet her pencereyi yeniden toplar; sliding window toplamı Θ(n)'de günceller.",
      explanationLong: "n-k+1 pencerenin her biri k toplama isterse sıkı maliyet Θ((n-k+1)k)'dır; k n ile orantılıysa Θ(n²) olur. Sliding window ilk k toplamdan sonra her kaymayı sabit zamanda yapar.",
      assumptions: "a null değildir, 1<=k<=n ve n>0; toplam long sınırındadır. İki çözüm de Θ(1) yardımcı alan kullanır. Sıkı zamanlar kaba kuvvette Θ((n-k+1)k), sliding window'da Θ(n)'dir.",
      tags: ["sliding-window", "brute-force", "complexity"]
    }),
    card({
      id: "A49-01", sourceId: "A49", topic: "Değişken sliding window", difficulty: "Zorlayıcı", type: "output",
      prompt: "Tekrar etmeyen en uzun alt String algoritması lengthOfLongest(\"abcabcbb\") için ne döndürür?",
      code: `static int lengthOfLongest(String s) {\n    Map<Character,Integer> last = new HashMap<>();\n    int left=0, best=0;\n    for (int right=0; right<s.length(); right++) {\n        char c=s.charAt(right);\n        if (last.containsKey(c) && last.get(c)>=left) left=last.get(c)+1;\n        last.put(c,right);\n        best=Math.max(best,right-left+1);\n    }\n    return best;\n}`,
      answer: "3",
      hint: "abc tekrar içermeyen uzunluk 3 bir penceredir.",
      explanationShort: "En uzun tekrar etmeyen pencerelerin uzunluğu 3'tür.",
      explanationLong: "abc, bca ve cab uzunluk 3'tür. Tekrar görüldüğünde left yalnız mevcut pencere içindeki önceki konumun bir sağına ilerler; geriye gitmez.",
      assumptions: "s null değildir; boş metin 0 döndürür. Karakter birimi UTF-16 char'dır; genel Unicode kod noktaları için uyarlanmalıdır, indeksler taşmaz. Beklenen zaman Θ(n), alan Θ(min(n, alfabe))'dir.",
      tags: ["sliding-window", "longest-substring", "hashmap"]
    }),
    card({
      id: "A49-02", sourceId: "A49", topic: "Değişken sliding window", difficulty: "Zorlayıcı", type: "order",
      prompt: "Son görülen indeks Map'i kullanan tekrar etmeyen en uzun alt String döngüsünün adımlarını sıralayın.",
      items: [{ id: "read", text: "right konumundaki karakteri oku" }, { id: "shrink", text: "Karakter mevcut pencere içinde görülmüşse left'i önceki indeks + 1'e ilerlet" }, { id: "remember", text: "Karakterin son indeksini right olarak güncelle" }, { id: "best", text: "best'i right - left + 1 ile büyüt" }],
      answer: ["read", "shrink", "remember", "best"],
      hint: "Önce eski konumla pencereyi düzeltin, sonra yeni konumu kaydedin.",
      explanationShort: "Karakter okunur, gerekirse sol sınır ilerler, son konum kaydedilir ve maksimum güncellenir.",
      explanationLong: "left=Math.max(left,last+1) eşdeğer koruması sol sınırın geriye gitmesini engeller. Her right bir kez, left yalnız ileri gider; hash işlemleri ortalama sabitse toplam beklenen zaman doğrusaldır.",
      assumptions: "s null değildir; boşta 0 döner. Birim UTF-16 char'dır, Map sayaç/indeksleri taşmaz. Beklenen sıkı zaman Θ(n), k farklı pencere karakteri için alan Θ(k), hash kötü durumu O(n²)'dir.",
      tags: ["variable-window", "invariant", "last-seen"]
    }),
    card({
      id: "A50-01", sourceId: "A50", topic: "Linked list döngüsü", difficulty: "Zorlayıcı", type: "boolean",
      prompt: "1 -> 2 -> 3 -> 4 listesinin 4 düğümü tekrar 2'yi gösteriyorsa Floyd slow/fast algoritması sonunda slow == fast eşitliği görür.",
      options: choices(["Doğru", "Yanlış"]), answer: true,
      hint: "Döngü içinde hızlı işaretçi yavaşa göre her tur bir düğüm kazanır.",
      explanationShort: "Doğru. İki işaretçi döngü içinde sonlu sayıda adımda buluşur.",
      explanationLong: "fast her tur iki, slow bir adım gider. İkisi cycle'a girdikten sonra aralarındaki modüler mesafe her tur bir azalır; cycle uzunluğu kadar tur içinde aynı düğüme gelirler.",
      optionExplanations: { a: "Doğru seçimdir; işaretçiler döngüye girdikten sonra modüler göreli mesafe kapanır.", b: "Yanlış seçimdir; sonlu bir döngüde göreli hız farkı buluşmayı garanti eder." },
      assumptions: "head null olabilir; düğümler sonlu sayıdadır ve next ya null ya aynı listedeki düğümdür. Değerler kullanılmaz, aritmetik taşma yoktur. Zaman Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["cycle-detection", "floyd", "slow-fast"]
    }),
    card({
      id: "A50-02", sourceId: "A50", topic: "Linked list döngüsü", difficulty: "Zorlayıcı", type: "match",
      prompt: "Linked list döngüsü algılama yaklaşımlarını maliyetleriyle eşleştirin.",
      pairs: {
        left: [{ id: "set", text: "Ziyaret edilen Node referanslarını Set'te tutma" }, { id: "floyd", text: "Slow/fast Floyd yaklaşımı" }],
        right: [{ id: "set-cost", text: "Beklenen Θ(n) zaman, Θ(n) yardımcı alan" }, { id: "floyd-cost", text: "Θ(n) zaman, Θ(1) yardımcı alan" }]
      },
      answer: { set: "set-cost", floyd: "floyd-cost" },
      hint: "İki yöntem de düğümleri izler; yalnız biri geçmişin tamamını saklar.",
      explanationShort: "Set yaklaşımı doğrusal bellek, Floyd sabit bellek kullanır; ikisi de doğrusal zamanda bulabilir.",
      explanationLong: "Set aynı Node referansı ikinci kez görüldüğünde cycle bildirir ve açıklaması doğrudandır. Floyd geçmişi saklamaz; farklı hızlarla buluşmayı kullanır. Identity tabanlı düğüm karşılaştırması önemlidir; yalnız value eşitliği cycle kanıtı değildir.",
      assumptions: "head null olabilir, erişilebilir düğüm sayısı n sonludur. Set Node kimliğini kullanır; değer/indis taşması yoktur. Set beklenen Θ(n) zaman/Θ(n) alan, Floyd sıkı Θ(n) zaman/Θ(1) alandır.",
      tags: ["cycle-detection", "hashset", "floyd", "space"]
    }),
    card({
      id: "A50-03", sourceId: "A50", topic: "Linked list döngüsü", difficulty: "Zorlayıcı", type: "order",
      prompt: "Floyd ile yalnız döngü varlığını belirleyen algoritmanın adımlarını sıralayın.",
      items: [{ id: "init", text: "slow = head ve fast = head olarak başlat" }, { id: "guard", text: "fast != null ve fast.next != null olduğu sürece döngüye gir" }, { id: "move", text: "slow'u bir, fast'i iki düğüm ilerlet" }, { id: "meet", text: "slow == fast ise true döndür" }, { id: "end", text: "Döngü null sınıra ulaşıp biterse false döndür" }],
      answer: ["init", "guard", "move", "meet", "end"],
      hint: "İki adım ilerlemeden önce fast ve fast.next güvenli olmalıdır.",
      explanationShort: "İşaretçiler başlatılır, güvenli koşulla farklı hızlarda ilerler; buluşma true, null'a ulaşma false'tur.",
      explanationLong: "Guard kısa devre sırası fast.next erişimini null'a karşı korur. Acyclic listede fast sona ulaşır; cyclic listede göreli hız nedeniyle işaretçiler buluşur. Döngü girişini bulmak ayrı bir ikinci aşamadır ve bu kartın kapsamı değildir.",
      assumptions: "head null boş liste olabilir ve false verir; erişilebilir düğümler sonludur, next bağlantıları okuma sırasında değişmez. Sayısal taşma yoktur. Zaman sıkı Θ(n), yardımcı alan Θ(1)'dir.",
      tags: ["floyd", "cycle-detection", "algorithm-steps"]
    }),
    // __CARDS__
  ];

  window.ALGORITHM_QUESTIONS = questions;
})();
