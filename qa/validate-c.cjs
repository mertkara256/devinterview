'use strict';

// Compiles every C and C++ card and runs the output cards, checking their answers against the real output.
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
for (const relative of ['assets/bank.js', 'assets/engine.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, relative), 'utf8'), context, { filename: relative });
}

const E = context.window.ExamEngine;
const cards = E.getBank().filter((card) => card.code && (card.language === 'c' || card.language === 'cpp'));
const compilers = {
  c: { command: 'cc', args: ['-std=c11'], extension: '.c' },
  cpp: { command: 'c++', args: ['-std=c++17'], extension: '.cpp' }
};
const versions = {};
for (const [language, compiler] of Object.entries(compilers)) {
  const result = childProcess.spawnSync(compiler.command, ['--version'], { encoding: 'utf8' });
  versions[language] = result.status === 0 ? result.stdout.split('\n')[0].trim() : '';
  check(result.status === 0 || !cards.some((card) => card.language === language), `${compiler.command} bulunamadı; ${E.CODE_LANGUAGES[language]} kartları derlenemedi.`);
}

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'c-interview-qa-'));
let compiledCount = 0;
let executedCount = 0;

try {
  for (const card of cards) {
    const compiler = compilers[card.language];
    if (!versions[card.language]) continue;
    const sourcePath = path.join(tempRoot, card.id + compiler.extension);
    const binaryPath = path.join(tempRoot, card.id);
    fs.writeFileSync(sourcePath, card.code + '\n', 'utf8');
    // Only output cards need a program to run; the rest just have to compile.
    const run = card.type === 'output';
    const compile = childProcess.spawnSync(compiler.command, compiler.args.concat(run ? ['-o', binaryPath, sourcePath] : ['-c', '-o', binaryPath + '.o', sourcePath]), { encoding: 'utf8' });
    check(compile.status === 0, `${card.id}: ${E.CODE_LANGUAGES[card.language]} kodu derlenmedi:\n${compile.stderr || compile.stdout}`);
    if (compile.status !== 0) continue;
    compiledCount += 1;
    if (!run) continue;
    const result = childProcess.spawnSync(binaryPath, [], { encoding: 'utf8', timeout: 5000 });
    check(result.status === 0, `${card.id}: derlenen program çalıştırılamadı: ${result.stderr || result.error || ''}`);
    if (result.status !== 0) continue;
    const actual = E.normalizeOutput(result.stdout, card.caseSensitive);
    const candidates = [card.answer].concat(card.acceptedAnswers || []).map((answer) => E.normalizeOutput(answer, card.caseSensitive));
    check(candidates.includes(actual), `${card.id}: program çıktısı cevap anahtarıyla uyuşmuyor; gerçek ${JSON.stringify(actual)}, beklenen ${JSON.stringify(candidates)}.`);
    executedCount += 1;
  }
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  cc: versions.c,
  cxx: versions.cpp,
  codeCards: cards.length,
  compiled: compiledCount,
  outputsExecutedAndMatched: executedCount
}, null, 2));
