'use strict';

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

const context = { window: {}, console, Intl, URLSearchParams, Blob: global.Blob, setTimeout };
context.window.window = context.window;
vm.createContext(context);
for (const relative of [
  'assets/source-questions.js',
  'assets/questions-java.js',
  'assets/questions-oop.js',
  'assets/questions-algorithms.js',
  'assets/engine.js'
]) {
  vm.runInContext(fs.readFileSync(path.join(root, relative), 'utf8'), context, { filename: relative });
}

const E = context.window.ExamEngine;
const bank = E.getBank();
const cardsWithCode = bank.filter((card) => typeof card.code === 'string' && card.code.trim());
const templateCards = cardsWithCode.filter((card) => /_{4,}/.test(card.code));
const expectedTemplateIds = ['O05-02', 'O16-02', 'O23-02', 'O33-02'];
const expectedInvalid = {
  'J02-01': { mode: 'main', diagnostic: /might not have been initialized/i },
  'J19-01': { mode: 'static-members', diagnostic: /non-static variable/i },
  'J22-01': { mode: 'members', diagnostic: /already defined/i },
  'J31-01': { mode: 'members', diagnostic: /unreported exception/i },
  'O05-01': { mode: 'main', diagnostic: /cannot be applied/i },
  'O16-01': { mode: 'main', diagnostic: /cannot be applied/i },
  'O17-01': { mode: 'main', diagnostic: /recursive constructor invocation/i },
  'O23-01': { mode: 'static-members', diagnostic: /inherits unrelated defaults|types A and B are incompatible/i }
};

check(cardsWithCode.length === 103, `Kod içeren kart sayısı 103 yerine ${cardsWithCode.length}.`);
check(JSON.stringify(templateCards.map((card) => card.id).sort()) === JSON.stringify(expectedTemplateIds), `Boşluk şablonu kartları değişti: ${templateCards.map((card) => card.id).join(', ')}.`);

const memberIds = new Set([
  'J08-02', 'J12-02',
  'O26-01', 'O26-02', 'O33-01',
  'A07-01', 'A09-01', 'A10-01', 'A10-02', 'A11-01', 'A12-02', 'A19-01', 'A20-01',
  'A29-01', 'A32-01', 'A33-01', 'A42-01', 'A42-02', 'A43-02', 'A44-01', 'A46-01',
  'A47-01', 'A48-01', 'A49-01'
]);

const helperMembers = `
  static int n = 4;
  static int target = 0;
  static int[] arr = {1, 2, 3, 4};
  static int[] a = {1, 2, 3, 4};
  static Node head;

  static class Node {
    int value;
    Node next;
    Node(int value) { this.value = value; }
  }

  static class Key {
    int id;
    Key(int id) { this.id = id; }
    @Override public boolean equals(Object other) {
      return other instanceof Key && ((Key) other).id == id;
    }
    @Override public int hashCode() { return Integer.hashCode(id); }
  }

  static class EmailSender {
    void send(String message) { }
  }

  static class MySqlOrderRepository { }

  static void process(int... values) { }
`;

function staticizeClasses(source) {
  return source.replace(/(^|\n)(\s*)class\s+/g, '$1$2static class ');
}

function splitAt(source, token, cardId) {
  const index = source.indexOf(token);
  if (index < 0) {
    failures.push(`${cardId}: Java QA ayırma işareti bulunamadı: ${JSON.stringify(token)}.`);
    return { members: source, main: '' };
  }
  return { members: source.slice(0, index), main: source.slice(index).trim() };
}

function specialParts(card) {
  let parts;
  if (card.id === 'J13-01') return splitAt(card.code, '\nint a =', card.id);
  if (card.id === 'J30-01') return splitAt(card.code, '\nSystem.out.println(calculate());', card.id);
  if (card.id === 'J38-01') return { members: staticizeClasses(card.code), main: '' };
  if (card.id === 'O11-01') {
    parts = splitAt(card.code, '\n\nPaymentMethod[] methods', card.id);
    parts.members = staticizeClasses(parts.members);
    return parts;
  }
  if (card.id === 'O29-02' || card.id === 'O35-02') {
    parts = splitAt(card.code, '\n\nSystem.out.println', card.id);
    parts.members = staticizeClasses(parts.members);
    return parts;
  }
  if (card.id === 'O40-01') {
    parts = splitAt(card.code, '\n\nEmployee[] employees', card.id);
    parts.members = staticizeClasses(parts.members);
    return parts;
  }
  if (card.id === 'A16-01' || card.id === 'A18-01') return splitAt(card.code, '\nSystem.out.print', card.id);
  if (card.id === 'A28-01') return { members: `static int probe(int[] arr, int target) {\n${card.code}\nreturn -1;\n}`, main: '' };
  if (card.id === 'A34-01') return { members: `static Node probe(Node head) {\n${card.code}\n}`, main: '' };
  if (card.id === 'A43-01') return { members: `static int fib(int n) {\n${card.code}\n}`, main: '' };
  if (card.id === 'A45-01') return { members: `static int[] probe(int[] a, int target) {\n${card.code}\n}`, main: '' };
  return null;
}

function partsFor(card) {
  const special = specialParts(card);
  if (special) return special;
  if (memberIds.has(card.id)) return { members: card.code, main: '' };
  return { members: '', main: card.code };
}

function className(cardId) {
  return 'Snippet_' + cardId.replace(/-/g, '_');
}

function sourceFor(card, overrideMode) {
  let parts;
  if (overrideMode === 'members') parts = { members: card.code, main: '' };
  else if (overrideMode === 'static-members') parts = { members: staticizeClasses(card.code), main: '' };
  else if (overrideMode === 'main') parts = { members: '', main: card.code };
  else parts = partsFor(card);

  return {
    className: className(card.id),
    main: parts.main,
    source: `import java.io.*;\nimport java.util.*;\n\npublic class ${className(card.id)} {\n${helperMembers}\n${parts.members}\npublic static void main(String[] args) throws Exception {\n${parts.main}\n}\n}\n`
  };
}

const javacVersion = childProcess.spawnSync('javac', ['-version'], { encoding: 'utf8' });
check(javacVersion.status === 0, 'javac bulunamadı; Java 8 uyumluluk derlemesi çalıştırılamadı.');

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'java-interview-qa-'));
const sourceDir = path.join(tempRoot, 'src');
const classesDir = path.join(tempRoot, 'classes');
fs.mkdirSync(sourceDir, { recursive: true });
fs.mkdirSync(classesDir, { recursive: true });

let compiledCount = 0;
let executedCount = 0;

try {
  const invalidIds = new Set(Object.keys(expectedInvalid));
  const templateIds = new Set(templateCards.map((card) => card.id));
  const validCards = cardsWithCode.filter((card) => !invalidIds.has(card.id) && !templateIds.has(card.id));
  check(validCards.length === 91, `Derlenebilir kabul edilen kart sayısı 91 yerine ${validCards.length}.`);

  const generated = new Map();
  const validSourcePaths = [];
  for (const card of validCards) {
    const item = sourceFor(card);
    const sourcePath = path.join(sourceDir, item.className + '.java');
    fs.writeFileSync(sourcePath, item.source, 'utf8');
    generated.set(card.id, item);
    validSourcePaths.push(sourcePath);
  }

  if (javacVersion.status === 0) {
    const compile = childProcess.spawnSync('javac', [
      '--release', '8',
      '-encoding', 'UTF-8',
      '-Xlint:-options',
      '-d', classesDir
    ].concat(validSourcePaths), { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    check(compile.status === 0, `Java 8 geçerli parça derlemesi başarısız:\n${compile.stderr || compile.stdout}`);
    if (compile.status === 0) compiledCount = validCards.length;

    for (const [id, expectation] of Object.entries(expectedInvalid)) {
      const card = bank.find((candidate) => candidate.id === id);
      check(Boolean(card), `${id}: beklenen derleme hatası kartı bulunamadı.`);
      if (!card) continue;
      const item = sourceFor(card, expectation.mode);
      const invalidPath = path.join(sourceDir, item.className + '_invalid.java');
      const invalidClassName = item.className + '_invalid';
      const invalidSource = item.source.replace(`public class ${item.className}`, `public class ${invalidClassName}`);
      fs.writeFileSync(invalidPath, invalidSource, 'utf8');
      const invalidCompile = childProcess.spawnSync('javac', [
        '--release', '8',
        '-encoding', 'UTF-8',
        '-Xlint:-options',
        '-d', classesDir,
        invalidPath
      ], { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
      const diagnostics = (invalidCompile.stderr || '') + '\n' + (invalidCompile.stdout || '');
      check(invalidCompile.status !== 0, `${id}: derlenmemesi gereken parça Java 8 ile derlendi.`);
      check(expectation.diagnostic.test(diagnostics), `${id}: beklenen türde javac tanısı alınmadı:\n${diagnostics}`);
    }

    if (compile.status === 0) {
      for (const card of validCards) {
        if (card.type !== 'output') continue;
        const item = generated.get(card.id);
        if (!item.main || !/System\.out\s*\./.test(item.main)) continue;
        const run = childProcess.spawnSync('java', ['-cp', classesDir, item.className], {
          encoding: 'utf8',
          timeout: 5000,
          maxBuffer: 2 * 1024 * 1024
        });
        check(run.status === 0, `${card.id}: derlenmiş çıktı parçası çalıştırılamadı: ${run.stderr || run.error || ''}`);
        if (run.status !== 0) continue;
        const actual = E.normalizeOutput(run.stdout, card.caseSensitive);
        const candidates = [card.answer].concat(card.acceptedAnswers || []).map((answer) => E.normalizeOutput(answer, card.caseSensitive));
        check(candidates.includes(actual), `${card.id}: javac/java çıktısı cevap anahtarıyla uyuşmuyor; gerçek ${JSON.stringify(actual)}, beklenen ${JSON.stringify(candidates)}.`);
        executedCount += 1;
      }
    }
  }
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

check(compiledCount === 91, `Java 8 ile derlenen geçerli kart sayısı 91 yerine ${compiledCount}.`);
check(executedCount >= 35, `Çıktısı çalıştırılarak doğrulanan kart sayısı yetersiz: ${executedCount}.`);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  javac: (javacVersion.stderr || javacVersion.stdout || '').trim(),
  codeCards: cardsWithCode.length,
  compiledRelease8: compiledCount,
  expectedCompileFailures: Object.keys(expectedInvalid).length,
  fillTemplatesExcluded: templateCards.length,
  outputsExecutedAndMatched: executedCount
}, null, 2));
