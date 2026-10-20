const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const context = { window: {}, console, Intl, URLSearchParams, Blob: global.Blob, setTimeout };
context.window.window = context.window;
vm.createContext(context);
for (const relative of ['assets/bank.js', 'assets/engine.js']) {
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

const twinMatch = E.getBank().find((card) => card.id === 'J33-01');
check(E.grade(twinMatch, Object.assign({}, twinMatch.answer, { state: 'aclass', single: 'abstract' })).score === 1, 'Aynı metni taşıyan eşleştirme seçenekleri birbirinin yerine kabul edilmeli.');
check(E.grade(twinMatch, Object.assign({}, twinMatch.answer, { state: 'decoy' })).score === 0.75, 'Yanıltıcı seçenek yine yanlış sayılmalı.');

const spacedFill = { type: 'fill', answer: 'Θ(n), Θ(1)', acceptedAnswers: [], caseSensitive: false };
check(E.grade(spacedFill, 'Θ(n),Θ(1)').correct && E.grade(spacedFill, 'Θ (n) , Θ (1)').correct, 'Noktalama çevresindeki boşluk farkı boşluk doldurmada yanlış sayılmamalı.');
check(!E.grade({ type: 'fill', answer: 'OrderRepository repository', acceptedAnswers: [], caseSensitive: true }, 'OrderRepositoryrepository').correct, 'Kelimeler arasındaki boşluk boşluk doldurmada yine gerekli olmalı.');
const spacedOutput = { type: 'output', answer: 'Salı Çarşamba\n[1, 2, 3]', acceptedAnswers: [], caseSensitive: true };
check(E.grade(spacedOutput, 'Salı  Çarşamba\n[1, 2, 3]').correct, 'Kod çıktısında kelimeler arasındaki fazladan boşluk yanlış sayılmamalı.');
check(!E.grade(spacedOutput, 'Salı Çarşamba\n[1,2,3]').correct, 'Kod çıktısında biçim farkı yine önemli olmalı.');

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

check(E.isLearned({ known: true }) && E.isLearned({ mastered: true }) && !E.isLearned({}) && !E.isLearned(undefined), '"Zaten biliyorum" ve ustalık öğrenildi sayılmalı.');
check(E.skipsReview({ known: true }) && E.skipsReview({ excluded: true }) && !E.skipsReview({ mastered: true }), 'Bilinen ve hariç tutulan kaynaklar tekrar kuyruğuna girmemeli.');
const knownProgress = { J01: { known: true } };
const javaCards = E.getBank().filter((card) => card.section === 'Java');
// One fewer than the number of Java sources fits without J01; one more needs it.
const javaSourceCount = new Set(javaCards.map((card) => card.sourceId)).size;
const mixedPick = E.selectCards(javaCards, javaSourceCount - 1, 'mixed', 'known-seed', knownProgress, {});
check(mixedPick.length === javaSourceCount - 1 && mixedPick.every((card) => card.sourceId !== 'J01'), 'Bilinen kaynak, havuzda başka kaynak varken karışık teste seçilmemeli.');
const learningPick = E.selectCards(javaCards, 3, 'learning', 'known-seed', knownProgress, {});
check(learningPick.map((card) => card.sourceId).join(',') === 'J02,J03,J04', 'Bilinen kaynak kaynak sırasında da en sona kalmalı.');
const fullPick = E.selectCards(javaCards, javaSourceCount + 1, 'mixed', 'known-seed', knownProgress, {});
check(fullPick.some((card) => card.sourceId === 'J01') && fullPick.slice(0, javaSourceCount - 1).every((card) => card.sourceId !== 'J01'), 'Havuz yetmediğinde bilinen kaynak en sonda kullanılabilmeli.');
const pastDue = {};
javaCards.filter((card) => card.sourceId === 'J01' || card.sourceId === 'J02').forEach((card) => { pastDue[card.id] = { dueAt: '2000-01-01T00:00:00.000Z', timesSeen: 1 }; });
check(E.filterBank(javaCards, { status: 'due' }, knownProgress, pastDue).every((card) => card.sourceId === 'J02'), 'Bilinen kaynak "Tekrar zamanı gelen" filtresine girmemeli.');
check(!E.filterBank(javaCards, { status: 'new' }, knownProgress, {}).some((card) => card.sourceId === 'J01'), 'Bilinen kaynak "Henüz görülmeyen" filtresine girmemeli.');
check(E.filterBank(javaCards, { status: 'mastered' }, knownProgress, {}).every((card) => card.sourceId === 'J01'), 'Bilinen kaynak "Öğrenilen" filtresiyle bilerek çalışılabilmeli.');

const sampleCards = E.getBank().filter((card) => card.sourceId === 'J01').slice(0, 2);
const attempt = {
  id: 'attempt',
  items: sampleCards.map((card) => ({ questionId: card.id, sourceId: card.sourceId, snapshot: card }))
};
const responses = {};
responses[`attempt::${sampleCards[0].id}`] = { firstScore: 1, finalScore: 1, completed: true, currentAnswer: sampleCards[0].answer };
responses[`attempt::${sampleCards[1].id}`] = { firstScore: 0, finalScore: 0, completed: true, currentAnswer: '' };
check(E.summarizeAttempt(attempt, responses).firstPercent === 50, 'Aynı kaynak alt kartları kaynak başına ortalanmalı.');

check(E.highlightJava('int x = 1; // return x') === '<span class="tok-type">int</span> x = <span class="tok-number">1</span>; <span class="tok-comment">// return x</span>', 'Yorum satırı vurgusu iç içe etiket üretmemeli.');
check(E.highlightJava("c - 'a'") === 'c - <span class="tok-string">&#039;a&#039;</span>', 'Char literal kaçış kodu bozulmadan vurgulanmalı.');
const decodeHighlight = (html) => html.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const snippets = E.getBank().filter((card) => card.code).map((card) => card.code)
  .concat(Object.values(context.window.SOURCE_QUESTIONS).flatMap((source) => E.promptBlocks(source.prompt).filter((block) => block.type === 'code').map((block) => block.text)));
check(snippets.every((code) => {
  const html = E.highlightJava(code);
  return decodeHighlight(html) === code && /^(?:[^<]|<span class="tok-\w+">[^<]*<\/span>)*$/.test(html);
}), 'Her kod parçası vurgulandıktan sonra aynı metni ve düz span yapısını korumalı.');

// The answer must not be guessable from the shape of the options alone.
const singleCards = E.getBank().filter((card) => card.type === 'single');
const answerRanks = [0, 0, 0, 0];
singleCards.forEach((card) => {
  const answerLength = card.options.find((option) => option.id === card.answer).text.length;
  answerRanks[card.options.filter((option) => option.text.length > answerLength).length] += 1;
});
check(answerRanks.every((count) => count / singleCards.length <= 0.35), `Doğru şıkkın uzunluk sırası tek bir konumda yığılmamalı: ${answerRanks.join('/')}.`);
const booleanCards = E.getBank().filter((card) => card.type === 'boolean');
const trueShare = booleanCards.filter((card) => card.answer === true).length / booleanCards.length;
check(trueShare >= 0.35 && trueShare <= 0.65, `Doğru/Yanlış cevapları dengeli olmalı: Doğru oranı %${Math.round(trueShare * 100)}.`);
check(E.getBank().filter((card) => card.type === 'match').every((card) => card.pairs.right.length > card.pairs.left.length), 'Her eşleştirmede son eşleşmeyi eleme ile bedava yapmayan en az bir yanıltıcı seçenek olmalı.');

// In choice cards, absolute wording must not mark the wrong options; in multi-choice no correct-answer count may dominate.
const ABSOLUTE = /(?<!\p{L})(her zaman|hiçbir zaman|her durumda|her türlü|asla|daima|hiçbir|hiç|kesinlikle|tamamen|mutlaka|yalnızca|yalnız|sadece|tüm|bütün|hepsi|hep|her)(?!\p{L})/iu;
const isRightOption = (card, option) => (card.type === 'multi' ? card.answer.includes(option.id) : option.id === card.answer);
[['single', 'Tek seçimde'], ['multi', 'Çoklu seçimde']].forEach(([type, label]) => {
  const cards = E.getBank().filter((card) => card.type === type);
  const absoluteShare = (right) => {
    const options = cards.flatMap((card) => card.options.filter((option) => isRightOption(card, option) === right));
    return options.filter((option) => ABSOLUTE.test(option.text)).length / options.length;
  };
  const absoluteGap = absoluteShare(false) - absoluteShare(true);
  check(absoluteGap <= 0.10, `${label} kesin ifadeler ("her zaman", "yalnız" gibi) yanlış şıklarda yığılmamalı: fark ${Math.round(absoluteGap * 100)} puan.`);
});
const multiCards = E.getBank().filter((card) => card.type === 'multi');
const correctCounts = {};
multiCards.forEach((card) => { correctCounts[card.answer.length] = (correctCounts[card.answer.length] || 0) + 1; });
check(Object.values(correctCounts).every((count) => count / multiCards.length <= 0.5), `Çoklu seçimde aynı doğru şık sayısı kartların yarısından fazlasında olmamalı: ${JSON.stringify(correctCounts)}.`);

const interviewBank = E.buildInterviewBank(E.getBank());
check(interviewBank.length === Object.keys(context.window.SOURCE_QUESTIONS).length, 'Mülakat bankası her kaynak soruyu içermeli.');
check(interviewBank.every((item) => item.keyPoints.length > 0 && item.explanations.length + item.examples.length > 0), 'Her mülakat sorusunun kontrol listesi ve açıklaması olmalı.');
const o24 = interviewBank.find((item) => item.sourceId === 'O24');
check(o24.keyPoints.length === 1 && o24.examples.length === 1 && o24.examples[0].code && o24.examples[0].output, 'Soruda görünmeyen koda dayanan kart kontrol listesine değil, koduyla örneğe girmeli.');
check(interviewBank.every((item) => ['Kolay', 'Orta', 'Zorlayıcı'].includes(item.difficulty)), 'Mülakat zorluğu kaynak tanımından okunmalı.');
const j03 = interviewBank.find((item) => item.sourceId === 'J03');
check(j03.expectedOutputs.length === 1 && j03.expectedOutputs[0] === '10\n99', 'Aynı kodu çalıştıran çıktı kartı beklenen çıktı olarak gösterilmeli.');
check(interviewBank.every((item) => item.keyPoints.every((point) => !/^(Doğru|Yanlış)\./.test(point))), 'Kontrol listesi Doğru/Yanlış önekini taşımamalı.');
check(JSON.stringify(E.promptBlocks('Soru\n\n```java\nint a;\n```\nSon').map((block) => block.type)) === '["text","code","text"]', 'Soru metni ve kod blokları ayrılmalı.');
check(E.inlineMarkdown('`<T>` tipi') === '<code>&lt;T&gt;</code> tipi', 'Satır içi kod kaçışlı biçimde işlenmeli.');

let interview = E.nextInterviewState(null, { sourceId: 'J01', rating: 'good', at: baseDate });
check(interview.reviewStage === 1 && interview.dueAt === '2026-07-20T10:00:00.000Z', 'İlk rahat anlatım 3 gün sonra tekrar gelmeli.');
interview = E.nextInterviewState(interview, { sourceId: 'J01', rating: 'good', at: '2026-07-20T10:00:00.000Z' });
check(interview.reviewStage === 2 && interview.dueAt === '2026-07-27T10:00:00.000Z', 'Art arda rahat anlatım aralığı büyütmeli.');
interview = E.nextInterviewState(interview, { sourceId: 'J01', rating: 'partial', at: '2026-07-27T10:00:00.000Z' });
check(interview.reviewStage === 1 && interview.dueAt === '2026-07-30T10:00:00.000Z', 'Eksik anlatım bir aşama geri gitmeli.');
interview = E.nextInterviewState(interview, { sourceId: 'J01', rating: 'again', at: '2026-07-30T10:00:00.000Z', answerText: 'cevap' });
check(interview.reviewStage === 0 && interview.dueAt === '2026-07-31T10:00:00.000Z', 'Anlatamama ertesi güne almalı.');
check(interview.ratings.length === 4 && interview.ratings[3].answerText === 'cevap' && interview.lastRating === 'again', 'Mülakat geçmişi ve son puan saklanmalı.');

const areaCards = [
  { id: 'S90-01', sourceId: 'S90', section: 'Savunma', area: 'Gömülü', difficulty: 'Kolay', type: 'single' },
  { id: 'S91-01', sourceId: 'S91', section: 'Savunma', area: 'Ağ', difficulty: 'Kolay', type: 'single' },
  { id: 'J90-01', sourceId: 'J90', section: 'Java', area: '', difficulty: 'Kolay', type: 'single' }
];
const areaIds = (filters) => E.filterBank(areaCards, filters, {}, {}).map((card) => card.id).join(',');
check(areaIds({ areas: ['Gömülü'] }) === 'S90-01,J90-01', 'Alan filtresi seçili alanı ve alanı olmayan kartları bırakmalı.');
check(areaIds({}) === 'S90-01,S91-01,J90-01', 'Alan filtresi verilmezse hiçbir kart elenmemeli.');
check(areaIds({ areas: [] }) === 'J90-01', 'Hiç alan seçilmezse alanı olan kartlar elenmeli.');
check(areaIds({ sections: [] }) === '' && areaIds({ difficulties: [] }) === '' && areaIds({ types: [] }) === '', 'Boş bölüm, zorluk veya tür seçimi hiçbir kartla eşleşmemeli.');
check(JSON.stringify(E.areasBySection(areaCards)) === JSON.stringify({ Savunma: ['Gömülü', 'Ağ'] }), 'Alanlar bölüme göre ve banka sırasıyla listelenmeli.');

const interviewItems = E.buildInterviewBank(E.getBank());
const sourceQuestions = context.window.SOURCE_QUESTIONS;
check(interviewItems.every((item) => {
  const written = sourceQuestions[item.sourceId].keyPoints;
  return written ? JSON.stringify(item.keyPoints) === JSON.stringify(written) : item.keyPoints.length > 0;
}), 'Mülakat kontrol listesi yazılmış anahtar noktaları, yoksa kart özetlerini kullanmalı.');

check(E.highlightCode('#include <stdio.h>\nint x = 0x0F; // not', 'c') === '<span class="tok-keyword">#include &lt;stdio.h&gt;</span>\n<span class="tok-type">int</span> x = <span class="tok-number">0x0F</span>; <span class="tok-comment">// not</span>', 'C renklendirmesi önişlemci satırı, onaltılık sayı ve yorumu tanımalı.');
check(E.highlightCode("select 'a--b' -- yorum", 'sql') === '<span class="tok-keyword">select</span> <span class="tok-string">&#039;a--b&#039;</span> <span class="tok-comment">-- yorum</span>', 'SQL renklendirmesi büyük/küçük harf duyarsız olmalı ve dize içindeki -- işaretini yorum saymamalı.');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, tests: testCount }, null, 2));
