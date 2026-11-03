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
const counts = { java: 0, c: 0, cpp: 0 };

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
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

check(counts.java + counts.c + counts.cpp === solved.length || failures.length, 'Bazı örnek çözümler hiç çalıştırılmadı.');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, solutions: solved.length, passed: counts }, null, 2));
