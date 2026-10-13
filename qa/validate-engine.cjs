const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const context = { window: {}, console, Intl, URLSearchParams, Blob: global.Blob, setTimeout };
context.window.window = context.window;
vm.createContext(context);
for (const relative of ['assets/source-questions.js', 'assets/questions-java.js', 'assets/questions-oop.js', 'assets/questions-algorithms.js', 'assets/engine.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, relative), 'utf8'), context, { filename: relative });
}

const E = context.window.ExamEngine;
const failures = [];
let testCount = 0;
function check(condition, message) {
  testCount += 1;
  if (!condition) failures.push(message);
}

check(E.normalizeText('  O(N²)  ', false) === 'o(n²)', 'Boşluk/case normalizasyonu başarısız.');
check(E.normalizeOutput(' 3 \n 8  ', true) === '3\n8', 'Çıktı satır kenarı normalizasyonu başarısız.');

const multi = { type: 'multi', answer: ['a', 'c'] };
check(E.grade(multi, ['c', 'a']).score === 1, 'Çoklu seçim sıra bağımsız olmalı.');
check(E.grade(multi, ['a']).score === 0, 'Çoklu seçim kısmi cevaba puan vermemeli.');

const order = { type: 'order', answer: ['a', 'b', 'c', 'd'] };
check(E.grade(order, ['a', 'c', 'b', 'd']).score === 0.5, 'Sıralama öğe bazında kısmi puanlamalı.');

const match = { type: 'match', answer: { a: '1', b: '2', c: '3' } };
check(Math.abs(E.grade(match, { a: '1', b: '9', c: '3' }).score - 2 / 3) < 0.0001, 'Eşleştirme kısmi puanlamalı.');

const fill = { type: 'fill', answer: 'O(n²)', acceptedAnswers: ['O(n^2)'], caseSensitive: false };
check(E.grade(fill, ' o(N^2) ').score === 1, 'Kabul edilen boşluk alternatifi puanlanmadı.');

const booleanFalse = { type: 'boolean', answer: false };
check(E.grade(booleanFalse, 'false').score === 1, 'İngilizce false boolean cevabı puanlanmadı.');
check(E.grade(booleanFalse, 'yanlış').score === 1, 'Türkçe yanlış boolean cevabı puanlanmadı.');
check(E.grade(booleanFalse, 'hayır').score === 1, 'Türkçe hayır boolean eşdeğeri puanlanmadı.');
check(E.grade(booleanFalse, 'rastgele metin').score === 0, 'Geçersiz boolean metni false kabul edilmemeli.');
check(E.formatAnswer(booleanFalse, 'false') === 'Yanlış', 'Boolean false sonuç görünümünde Yanlış yazılmalı.');

const baseDate = '2026-07-17T10:00:00.000Z';
let progress = E.nextProgress(null, { sourceId: 'J01', kind: 'unaided', at: baseDate });
check(progress.reviewStage === 0 && progress.dueAt === '2026-07-18T10:00:00.000Z', 'İlk desteksiz doğru 1 günlük aralığı kullanmalı.');
progress = E.nextProgress(progress, { sourceId: 'J01', kind: 'unaided', at: '2026-07-18T10:00:00.000Z' });
progress = E.nextProgress(progress, { sourceId: 'J01', kind: 'unaided', at: '2026-07-18T11:00:00.000Z' });
check(progress.mastered === true, 'Üç desteksiz doğru ve iki farklı gün ustalık sağlamalı.');
progress = E.nextProgress(progress, { sourceId: 'J01', kind: 'wrong', at: '2026-07-19T10:00:00.000Z' });
check(progress.reviewStage === 0 && progress.lastResult === 'wrong', 'Yanlış cevap tekrar aşamasını sıfırlamalı.');

let review = E.nextReviewState(null, { questionId: 'J01-C01', kind: 'wrong', at: baseDate });
check(review.id === 'J01-C01' && review.dueAt === '2026-07-18T10:00:00.000Z', 'Kart tekrarı yanlışta 1 güne sıfırlanmalı.');
review = E.nextReviewState(review, { questionId: 'J01-C01', kind: 'unaided', at: '2026-07-18T10:00:00.000Z' });
check(review.reviewStage === 1 && review.dueAt === '2026-07-21T10:00:00.000Z', 'Kart tekrarı doğru sonrası 3 günlük aralığa ilerlemeli.');

const session = { id: 'same', status: 'completed' };
const firstResponses = [{ id: 'same::J01-C01', attemptId: 'same', questionId: 'J01-C01', firstScore: 1 }];
const identicalOtherId = [{ id: 'copy::J01-C01', attemptId: 'copy', questionId: 'J01-C01', firstScore: 1 }];
const differingResponses = [{ id: 'same::J01-C01', attemptId: 'same', questionId: 'J01-C01', firstScore: 0 }];
check(E.sessionsEquivalent(session, session, firstResponses, identicalOtherId), 'Oturum karşılaştırması kimlik yeniden yazımını yok saymalı.');
check(!E.sessionsEquivalent(session, session, firstResponses, differingResponses), 'Aynı metadata fakat farklı cevaplar ayrı oturum sayılmalı.');

const sampleCards = E.getBank().filter((card) => card.sourceId === 'J01').slice(0, 2);
const attempt = {
  id: 'attempt',
  items: sampleCards.map((card) => ({ questionId: card.id, sourceId: card.sourceId, snapshot: card }))
};
const responses = {};
responses[`attempt::${sampleCards[0].id}`] = { firstScore: 1, finalScore: 1, completed: true, currentAnswer: sampleCards[0].answer };
responses[`attempt::${sampleCards[1].id}`] = { firstScore: 0, finalScore: 0, completed: true, currentAnswer: '' };
check(E.summarizeAttempt(attempt, responses).firstPercent === 50, 'Aynı kaynak alt kartları kaynak başına ortalanmalı.');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, tests: testCount }, null, 2));
