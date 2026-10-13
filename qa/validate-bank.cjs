const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const context = {
  window: {},
  console,
  Intl,
  URLSearchParams,
  Blob: global.Blob,
  setTimeout,
};
context.window.window = context.window;
context.window.SOURCE_QUESTIONS = {};
vm.createContext(context);

function load(relativePath) {
  const filePath = path.join(root, relativePath);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
}

load('assets/source-questions.js');
load('assets/questions-java.js');
load('assets/questions-oop.js');
load('assets/questions-algorithms.js');
load('assets/engine.js');

const engine = context.window.ExamEngine;
const bank = engine.getBank();
const validation = engine.validateBank(bank);
const failures = validation.errors.slice();

const expectedSections = { Java: 92, OOP: 74, Algoritma: 93 };
for (const [section, expected] of Object.entries(expectedSections)) {
  const actual = bank.filter((card) => card.section === section).length;
  if (actual !== expected) failures.push(`${section}: ${expected} yerine ${actual} kart.`);
}

const expectedSources = { J: 45, O: 40, A: 50 };
for (const [prefix, expected] of Object.entries(expectedSources)) {
  const actual = new Set(bank.filter((card) => card.sourceId.startsWith(prefix)).map((card) => card.sourceId)).size;
  if (actual !== expected) failures.push(`${prefix}: ${expected} yerine ${actual} kaynak.`);
}

const types = new Set(bank.map((card) => card.type));
for (const type of ['single', 'multi', 'boolean', 'fill', 'output', 'order', 'match']) {
  if (!types.has(type)) failures.push(`Soru türü eksik: ${type}`);
}

for (const card of bank) {
  const result = engine.grade(card, card.answer);
  if (!result.correct || result.score !== 1) failures.push(`${card.id}: kendi cevap anahtarı tam doğru puanlanmadı (${result.score}).`);
  if (card.type === 'single') {
    const ids = new Set((card.options || []).map((option) => String(option.id)));
    if (!ids.has(String(card.answer))) failures.push(`${card.id}: single cevap seçeneklerde yok.`);
  }
  if (card.type === 'multi') {
    const ids = new Set((card.options || []).map((option) => String(option.id)));
    for (const answer of card.answer || []) if (!ids.has(String(answer))) failures.push(`${card.id}: multi cevap ${answer} seçeneklerde yok.`);
  }
  if (card.type === 'order') {
    const ids = new Set((card.items || []).map((item) => String(item.id)));
    if ((card.answer || []).length !== ids.size) failures.push(`${card.id}: sıralama cevabı tüm öğeleri kapsamıyor olmalı.`);
  }
  if (card.type === 'match') {
    const left = new Set(((card.pairs && card.pairs.left) || []).map((item) => String(item.id)));
    const right = new Set(((card.pairs && card.pairs.right) || []).map((item) => String(item.id)));
    for (const [leftId, rightId] of Object.entries(card.answer || {})) {
      if (!left.has(String(leftId)) || !right.has(String(rightId))) failures.push(`${card.id}: geçersiz eşleştirme ${leftId}->${rightId}.`);
    }
  }
}

const originalPath = '/Users/mertkara/Desktop/Mülakat soru dostası.md';
const expectedHash = context.window.SOURCE_BANK_META.sourceSha256;
const actualHash = crypto.createHash('sha256').update(fs.readFileSync(originalPath)).digest('hex');
if (actualHash !== expectedHash) failures.push(`Kaynak SHA-256 değişti: ${actualHash}`);

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const typeCounts = {};
bank.forEach((card) => { typeCounts[card.type] = (typeCounts[card.type] || 0) + 1; });
console.log(JSON.stringify({
  ok: true,
  cards: bank.length,
  sources: validation.sourceCount,
  sections: expectedSections,
  types: typeCounts,
  sourceSha256: actualHash,
}, null, 2));
