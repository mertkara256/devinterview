'use strict';

// Compiles every "Örnek çözüm:" block and runs it against the checks below, so no sample solution ships untested.
const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

const context = { window: {} };
context.window.window = context.window;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'assets/bank.js'), 'utf8'), context, { filename: 'assets/bank.js' });
const sources = context.window.SOURCE_QUESTIONS;
const solved = Object.keys(sources).filter((id) => sources[id].solution);

// Checks run inside main(). "support" adds what the question takes as given, such as the Order class of J28.
// Java checks may use check(condition, label) and expectThrows(type, () -> ..., label); C and C++ checks use CHECK(condition).
// SQL tests give the rows to insert ("data") and, in order, the rows each SELECT must return ("results").
const tests = {
  A08: {
    checks: `
      int[] even = {1, 2, 3, 4};
      reverse(even);
      check(Arrays.equals(even, new int[] {4, 3, 2, 1}), "çift uzunluk");
      int[] odd = {1, 2, 3};
      reverse(odd);
      check(Arrays.equals(odd, new int[] {3, 2, 1}), "tek uzunluk");
      int[] empty = {};
      reverse(empty);
      int[] single = {7};
      reverse(single);
      check(single[0] == 7, "tek eleman");`
  },
  A14: {
    checks: `
      check(hasDuplicate(new int[] {2, 1, 2}), "tekrar var");
      check(!hasDuplicate(new int[] {1, 2, 3}), "tekrar yok");
      check(!hasDuplicate(new int[] {}), "boş dizi");
      check(!hasDuplicate(new int[] {5}), "tek eleman");`
  },
  A15: {
    checks: `
      check(isAnagram("Dormitory", "Dirty room"), "boşluk ve büyük harf yok sayılır");
      check(isAnagram("listen", "silent"), "aynı harfler");
      check(isAnagram("", ""), "iki boş metin");
      check(!isAnagram("abc", "abd"), "farklı harf");
      check(!isAnagram("ab", "abc"), "farklı uzunluk");
      expectThrows(IllegalArgumentException.class, () -> isAnagram("a1", "1a"), "harf dışı karakter");`
  },
  A17: {
    checks: `
      check(factorial(0) == 1 && factorial(1) == 1 && factorial(5) == 120, "küçük değerler");
      check(factorial(20) == 2432902008176640000L, "20! long'a sığar");
      expectThrows(ArithmeticException.class, () -> factorial(21), "21! taşar");
      expectThrows(IllegalArgumentException.class, () -> factorial(-1), "negatif girdi");`
  },
  A30: {
    checks: `
      check(isBalanced("{[()]}") && isBalanced("()[]{}") && isBalanced(""), "dengeli ifadeler");
      check(!isBalanced("([)]"), "çapraz kapanış");
      check(!isBalanced("(") && !isBalanced(")"), "eşi olmayan parantez");
      check(!isBalanced("(a)"), "parantez dışı karakter");`
  },
  A35: {
    checks: `
      check(reverse(null) == null, "boş liste");
      Node single = new Node(1);
      check(reverse(single) == single && single.next == null, "tek düğüm");
      Node head = new Node(1);
      head.next = new Node(2);
      head.next.next = new Node(3);
      Node reversed = reverse(head);
      check(reversed.value == 3 && reversed.next.value == 2 && reversed.next.next.value == 1 && reversed.next.next.next == null, "üç düğüm");`
  },
  A37: {
    checks: `
      int[] mixed = {5, 1, 4, 2, 8};
      bubbleSort(mixed);
      check(Arrays.equals(mixed, new int[] {1, 2, 4, 5, 8}), "karışık dizi");
      int[] descending = {4, 3, 2, 1};
      bubbleSort(descending);
      check(Arrays.equals(descending, new int[] {1, 2, 3, 4}), "ters sıralı dizi");
      int[] sorted = {1, 2, 3};
      bubbleSort(sorted);
      check(Arrays.equals(sorted, new int[] {1, 2, 3}), "sıralı dizi");
      int[] empty = {};
      bubbleSort(empty);
      int[] single = {7};
      bubbleSort(single);
      check(single[0] == 7, "tek eleman");`
  },
  A38: {
    checks: `
      int[] descending = {4, 3, 2, 1};
      selectionSort(descending);
      check(Arrays.equals(descending, new int[] {1, 2, 3, 4}), "ters sıralı dizi");
      int[] repeated = {3, 1, 2, 1};
      selectionSort(repeated);
      check(Arrays.equals(repeated, new int[] {1, 1, 2, 3}), "tekrarlı değerler");
      int[] empty = {};
      selectionSort(empty);
      int[] single = {9};
      selectionSort(single);
      check(single[0] == 9, "tek eleman");`
  },
  A50: {
    checks: `
      Node head = new Node(1);
      head.next = new Node(2);
      head.next.next = new Node(3);
      head.next.next.next = new Node(4);
      check(!hasCycle(head) && !hasCycleWithSet(head), "döngüsüz liste");
      head.next.next.next.next = head.next;
      check(hasCycle(head) && hasCycleWithSet(head), "4. düğüm 2. düğümü gösterir");
      check(!hasCycle(null) && !hasCycleWithSet(null), "boş liste");
      Node self = new Node(1);
      self.next = self;
      check(hasCycle(self) && hasCycleWithSet(self), "kendini gösteren düğüm");`
  },
  J16: {
    checks: `
      check(joinWithComma(new String[] {"Java", "OOP", "Algoritma"}).equals("Java,OOP,Algoritma"), "üç eleman");
      check(joinWithComma(new String[] {"Java"}).equals("Java"), "tek eleman");
      check(joinWithComma(new String[] {}).isEmpty(), "boş dizi");`
  },
  J28: {
    support: `
      static class Order {
        private final int customerId;
        Order(int customerId) { this.customerId = customerId; }
        int getCustomerId() { return customerId; }
      }`,
    checks: `
      Order first = new Order(1);
      Order second = new Order(2);
      Order third = new Order(1);
      Map<Integer, List<Order>> groups = groupByCustomer(Arrays.asList(first, second, third));
      check(groups.size() == 2, "iki müşteri");
      check(groups.get(1).equals(Arrays.asList(first, third)), "müşterinin siparişleri geliş sırasıyla");
      check(groups.get(2).equals(Arrays.asList(second)), "tek siparişli müşteri");
      check(groupByCustomer(new ArrayList<Order>()).isEmpty(), "boş liste");`
  },
  J32: {
    checks: `
      check(Exception.class.isAssignableFrom(InvalidAgeException.class) && !RuntimeException.class.isAssignableFrom(InvalidAgeException.class), "checked exception");
      RegistrationService service = new RegistrationService();
      service.register(0);
      service.register(30);
      expectThrows(InvalidAgeException.class, () -> service.register(-1), "negatif yaş");`
  },
  J40: {
    checks: `
      Candidate first = new Candidate(1, "Ada");
      Candidate sameId = new Candidate(1, "Grace");
      Candidate other = new Candidate(2, "Ada");
      check(first.equals(sameId) && sameId.equals(first), "aynı id eşit ve simetrik");
      check(first.hashCode() == sameId.hashCode(), "eşit nesneler aynı hash");
      check(!first.equals(other), "farklı id");
      check(!first.equals(null) && !first.equals("1"), "null ve başka tür");
      check(new HashSet<>(Arrays.asList(first, sameId, other)).size() == 2, "HashSet aynı id'yi bir kez tutar");
      Map<Candidate, String> stages = new HashMap<>();
      stages.put(first, "mülakat");
      check("mülakat".equals(stages.get(sameId)), "HashMap eşit anahtarla bulur");`
  },
  J42: {
    checks: `
      List<String> roles = new ArrayList<>(Arrays.asList("admin", "editor"));
      User user = new User("Ada", roles);
      roles.add("guest");
      check(user.getRoles().equals(Arrays.asList("admin", "editor")), "dıştaki liste değişince etkilenmez");
      expectThrows(UnsupportedOperationException.class, () -> user.getRoles().add("guest"), "getter'daki liste değiştirilemez");
      expectThrows(NullPointerException.class, () -> new User(null, roles), "null ad");
      expectThrows(NullPointerException.class, () -> new User("Ada", null), "null roller");
      check(Modifier.isFinal(User.class.getModifiers()), "sınıf final");
      for (Field field : User.class.getDeclaredFields()) {
        check(Modifier.isPrivate(field.getModifiers()) && Modifier.isFinal(field.getModifiers()), field.getName() + " alanı private final");
      }`
  },
  O07: {
    checks: `
      BankAccount account = new BankAccount();
      check(account.getBalance() == 0, "başlangıç bakiyesi 0");
      check(!account.deposit(0) && !account.deposit(-5) && account.getBalance() == 0, "pozitif olmayan yatırma reddedilir");
      check(account.deposit(100) && account.getBalance() == 100, "yatırma");
      check(!account.withdraw(120) && account.getBalance() == 100, "bakiyeyi aşan çekim reddedilir");
      check(!account.withdraw(0) && !account.withdraw(-1), "pozitif olmayan çekim reddedilir");
      check(account.withdraw(30) && account.getBalance() == 70, "çekim");
      check(account.withdraw(70) && account.getBalance() == 0, "sıfır bakiye geçerli");
      check(Modifier.isPrivate(BankAccount.class.getDeclaredField("balance").getModifiers()), "bakiye alanı private");`
  },
  O25: {
    checks: `
      Order order = new Order();
      check(order.total() == 0.0, "boş sipariş");
      order.addItem(new Product("Kalem", 15.0), 3);
      order.addItem(new Product("Defter", 2.5), 2);
      check(order.getItems().size() == 2, "iki satır");
      check(order.getItems().get(0).total() == 45.0, "satır toplamı");
      check(order.total() == 50.0, "sipariş toplamı");
      expectThrows(UnsupportedOperationException.class, () -> order.getItems().clear(), "satırlar dışarıdan değiştirilemez");`
  },
  O35: {
    checks: `
      CheckoutService service = new CheckoutService();
      check(service.checkout(250.0, new CreditCardPayment()).equals("credit:250.0"), "kredi kartı");
      check(service.checkout(99.5, new BankTransferPayment()).equals("transfer:99.5"), "havale");
      check(service.checkout(10.0, new WalletPayment()).equals("wallet:10.0"), "dijital cüzdan");
      PaymentMethod voucher = amount -> "voucher:" + amount;
      check(service.checkout(5.0, voucher).equals("voucher:5.0"), "yeni tür CheckoutService değişmeden eklenir");`
  },
  S09: {
    checks: `
      uint32_t reg = 0x0Fu;
      bit_clear(&reg, 2);
      CHECK(reg == 0x0Bu);
      bit_set(&reg, 7);
      CHECK(reg == 0x8Bu);
      bit_toggle(&reg, 0);
      CHECK(reg == 0x8Au);
      bit_toggle(&reg, 0);
      CHECK(reg == 0x8Bu);
      CHECK(bit_read(&reg, 7) && !bit_read(&reg, 2));
      bit_set(&reg, 31);
      CHECK(reg == 0x8000008Bu);
      union { uint32_t word; uint8_t bytes[4]; } probe = { 0x01020304u };
      CHECK(is_little_endian() == (probe.bytes[0] == 0x04u));`
  },
  S11: {
    checks: `
      static_assert(!std::is_copy_constructible<Logger>::value, "kopyalanamamalı");
      static_assert(!std::is_copy_assignable<Logger>::value, "atanamamalı");
      static_assert(!std::is_default_constructible<Logger>::value, "dışarıdan oluşturulamamalı");
      Logger* seen[8];
      std::vector<std::thread> threads;
      for (int i = 0; i < 8; i++) threads.emplace_back([&seen, i] { seen[i] = &Logger::instance(); });
      for (std::thread& thread : threads) thread.join();
      for (int i = 0; i < 8; i++) CHECK(seen[i] == &Logger::instance());`
  },
  S16: {
    checks: `
      RingBuffer rb = { {0}, 0, 0 };
      uint8_t value = 0;
      CHECK(!ring_get(&rb, &value));
      for (uint8_t i = 0; i < RING_SIZE - 1u; i++) CHECK(ring_put(&rb, i));
      CHECK(!ring_put(&rb, 99));
      for (uint8_t i = 0; i < RING_SIZE - 1u; i++) {
        CHECK(ring_get(&rb, &value));
        CHECK(value == i);
      }
      CHECK(!ring_get(&rb, &value));
      for (int round = 0; round < 40; round++) {
        CHECK(ring_put(&rb, (uint8_t)round));
        CHECK(ring_get(&rb, &value));
        CHECK(value == round);
      }`
  },
  S34: {
    data: `
      INSERT INTO departments VALUES (1, 'Ar-Ge'), (2, 'Test'), (3, 'İK');
      INSERT INTO employees VALUES (1, 'Ada', 40000, 1), (2, 'Berk', 35000, 1), (3, 'Ece', 25000, 2), (4, 'Ozan', 50000, NULL);
      INSERT INTO projects VALUES (1, 'Radar'), (2, 'Simülatör'), (3, 'Uydu');
      INSERT INTO employee_projects VALUES (1, 1), (2, 1), (3, 2), (1, 2);`,
    results: [
      [{ name: 'Ada', department: 'Ar-Ge' }, { name: 'Berk', department: 'Ar-Ge' }, { name: 'Ece', department: 'Test' }],
      [{ name: 'Ar-Ge', employee_count: 2 }, { name: 'Test', employee_count: 1 }, { name: 'İK', employee_count: 0 }],
      [{ name: 'Radar', member_count: 2 }, { name: 'Simülatör', member_count: 2 }, { name: 'Uydu', member_count: 0 }],
      [{ name: 'Ar-Ge', senior_count: 2 }]
    ]
  },
  S66: {
    checks: `
      check(isPalindrome(121) && isPalindrome(1221) && isPalindrome(12321), "palindrom sayılar");
      check(isPalindrome(0) && isPalindrome(7), "tek basamak");
      check(!isPalindrome(-121), "negatif sayı");
      check(!isPalindrome(10) && !isPalindrome(1230), "sonu 0 olan sayı");
      check(!isPalindrome(123), "palindrom olmayan sayı");
      check(isPalindrome(2147447412) && !isPalindrome(Integer.MAX_VALUE), "int sınırına yakın değerler");`
  }
};

check(solved.length > 0, 'Örnek çözümü olan soru bulunamadı.');
solved.forEach((id) => check(tests[id], `${id}: örnek çözümün testi yok; qa/validate-solutions.cjs içine ekleyin.`));
Object.keys(tests).forEach((id) => check(solved.includes(id), `${id}: testi var ama örnek çözümü yok.`));

// The solution shows top-level classes; inside the test class they become static nested classes.
function staticizeClasses(code) {
  return code.replace(/(^|\n)((?:public |abstract |final )*)class /g, '$1$2static class ');
}

const javaHelpers = `
  interface Action { void run() throws Exception; }

  static void check(boolean condition, String label) {
    if (!condition) throw new AssertionError(label);
  }

  static void expectThrows(Class<? extends Throwable> type, Action action, String label) {
    try {
      action.run();
    } catch (Throwable error) {
      if (type.isInstance(error)) return;
      throw new AssertionError(label + ": beklenmeyen " + error);
    }
    throw new AssertionError(label + ": " + type.getSimpleName() + " fırlatılmadı");
  }`;

const checkMacro = [
  '#include <stdio.h>',
  '#include <stdlib.h>',
  '#define CHECK(condition) do { if (!(condition)) { fprintf(stderr, "%s:%d: %s\\n", __FILE__, __LINE__, #condition); exit(1); } } while (0)'
].join('\n');

const natives = {
  c: { command: 'cc', args: ['-std=c11'], extension: '.c', prelude: checkMacro, main: 'int main(void) {' },
  cpp: { command: 'c++', args: ['-std=c++17', '-pthread'], extension: '.cpp', prelude: checkMacro + '\n#include <thread>\n#include <type_traits>\n#include <vector>', main: 'int main() {' }
};

function run(command, args, label) {
  const result = childProcess.spawnSync(command, args, { encoding: 'utf8', timeout: 20000, maxBuffer: 16 * 1024 * 1024 });
  check(result.status === 0, `${label}:\n${result.stderr || result.stdout || result.error || ''}`);
  return result.status === 0;
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'solution-qa-'));
const counts = { java: 0, c: 0, cpp: 0, sql: 0 };

try {
  const javaIds = solved.filter((id) => tests[id] && sources[id].solution.language === 'java');
  const javaSources = javaIds.map((id) => {
    const file = path.join(tempRoot, `Solution_${id}.java`);
    fs.writeFileSync(file, 'import java.lang.reflect.*;\nimport java.util.*;\nimport java.util.function.*;\nimport java.util.stream.*;\n\n' +
      `public class Solution_${id} {\n${staticizeClasses(sources[id].solution.code)}\n${tests[id].support || ''}\n${javaHelpers}\n\n` +
      `  public static void main(String[] args) throws Exception {${tests[id].checks}\n  }\n}\n`, 'utf8');
    return file;
  });
  if (javaSources.length && run('javac', ['--release', '8', '-encoding', 'UTF-8', '-Xlint:-options', '-d', tempRoot].concat(javaSources), 'Java örnek çözümleri Java 8 ile derlenmedi')) {
    javaIds.forEach((id) => {
      if (run('java', ['-cp', tempRoot, `Solution_${id}`], `${id}: örnek çözüm testlerden geçmedi`)) counts.java += 1;
    });
  }

  solved.filter((id) => tests[id] && natives[sources[id].solution.language]).forEach((id) => {
    const native = natives[sources[id].solution.language];
    const file = path.join(tempRoot, id + native.extension);
    const binary = path.join(tempRoot, id);
    fs.writeFileSync(file, `${native.prelude}\n\n${sources[id].solution.code}\n${tests[id].support || ''}\n\n${native.main}${tests[id].checks}\n  return 0;\n}\n`, 'utf8');
    if (!run(native.command, native.args.concat(['-o', binary, file]), `${id}: örnek çözüm derlenmedi`)) return;
    if (run(binary, [], `${id}: örnek çözüm testlerden geçmedi`)) counts[sources[id].solution.language] += 1;
  });

  // SQL runs on Node's built-in SQLite: the solution creates the tables, the test rows go in, then each SELECT is compared.
  const sqlIds = solved.filter((id) => tests[id] && sources[id].solution.language === 'sql');
  let DatabaseSync = null;
  if (sqlIds.length) {
    try {
      ({ DatabaseSync } = require('node:sqlite'));
    } catch (error) {
      check(false, `node:sqlite bulunamadı; SQL örnek çözümleri için Node.js 22.13 veya sonrası gerekir (${error.message}).`);
    }
  }
  if (DatabaseSync) sqlIds.forEach((id) => {
    const before = failures.length;
    const rows = (list) => list.map((row) => JSON.stringify(row)).sort().join(' ');
    try {
      const db = new DatabaseSync(':memory:');
      const statements = sources[id].solution.code.replace(/--.*$/gm, '').split(';').map((part) => part.trim()).filter(Boolean);
      const queries = statements.filter((statement) => /^select\b/i.test(statement));
      statements.filter((statement) => !queries.includes(statement)).forEach((statement) => db.exec(statement));
      db.exec(tests[id].data);
      check(queries.length === tests[id].results.length, `${id}: çözümde ${queries.length} SELECT var, testte ${tests[id].results.length} beklenen sonuç var.`);
      queries.forEach((query, index) => {
        const actual = rows(db.prepare(query).all());
        check(actual === rows(tests[id].results[index] || []), `${id}: ${index + 1}. SELECT beklenen satırları döndürmedi: ${actual}`);
      });
      db.close();
    } catch (error) {
      check(false, `${id}: SQL örnek çözümü çalışmadı: ${error.message}`);
    }
    if (failures.length === before) counts.sql += 1;
  });
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

check(counts.java + counts.c + counts.cpp + counts.sql === solved.length || failures.length, 'Bazı örnek çözümler hiç çalıştırılmadı.');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, solutions: solved.length, passed: counts }, null, 2));
