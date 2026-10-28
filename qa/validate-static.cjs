'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const assetsDir = path.join(root, 'assets');
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function sortedEntries(directory) {
  return fs.readdirSync(directory).sort();
}

function sameList(actual, expected, label) {
  const left = actual.slice().sort();
  const right = expected.slice().sort();
  check(JSON.stringify(left) === JSON.stringify(right), `${label}: ${JSON.stringify(left)}; beklenen ${JSON.stringify(right)}.`);
}

const expectedRoot = ['.github', '.gitignore', 'README.md', 'assets', 'build.cjs', 'index.html', 'qa', 'sorular'];
const expectedAssets = [
  'app.js',
  'bank.js',
  'engine.js',
  'storage.js',
  'styles.css'
];
const expectedQa = ['validate-bank.cjs', 'validate-c.cjs', 'validate-engine.cjs', 'validate-java.cjs', 'validate-runtime.cjs', 'validate-static.cjs'];

sameList(sortedEntries(root).filter((name) => name !== '.git'), expectedRoot, 'Teslimat kök dosyaları değişti');
sameList(sortedEntries(assetsDir), expectedAssets, 'Çalışma zamanı varlıkları değişti');
sameList(sortedEntries(__dirname), expectedQa, 'QA dosyaları değişti');
sameList(sortedEntries(path.join(root, '.github')), ['workflows'], 'GitHub klasörü değişti');
sameList(sortedEntries(path.join(root, '.github', 'workflows')), ['qa.yml'], 'GitHub Actions iş akışları değişti');

for (const relative of ['index.html', 'README.md'].concat(expectedAssets.map((name) => `assets/${name}`))) {
  const absolute = path.join(root, relative);
  check(fs.existsSync(absolute) && fs.statSync(absolute).isFile(), `${relative}: gerekli normal dosya bulunamadı.`);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
check(/^<!doctype html>/i.test(html), 'index.html HTML5 doctype ile başlamalı.');
check(/<html\s+lang="tr"/i.test(html), 'index.html Türkçe dil bildirimi içermeli.');
check(/<meta\s+name="viewport"/i.test(html), 'Mobil viewport bildirimi eksik.');
check(/class="skip-link"[^>]+href="#main-content"/i.test(html), 'Ana içeriğe geç bağlantısı eksik.');
check(/<main\s+id="main-content"/i.test(html), 'Semantik ana içerik alanı eksik.');
check(/aria-live=/i.test(html), 'Ekran okuyucu canlı bölgesi eksik.');
check(!/<base\b/i.test(html), 'file:// çalışma yolunu değiştirebilen <base> etiketi kullanılmamalı.');
check(!/<script\b[^>]*\btype\s*=\s*["']module["']/i.test(html), 'ES module script bulundu.');

const scriptSources = Array.from(html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi), (match) => match[1]);
const expectedScripts = [
  'assets/bank.js',
  'assets/storage.js',
  'assets/engine.js',
  'assets/app.js'
];
check(JSON.stringify(scriptSources) === JSON.stringify(expectedScripts), `Klasik script sırası hatalı: ${JSON.stringify(scriptSources)}.`);

const stylesheetSources = Array.from(html.matchAll(/<link\b[^>]*\brel\s*=\s*["']stylesheet["'][^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi), (match) => match[1]);
check(JSON.stringify(stylesheetSources) === JSON.stringify(['assets/styles.css']), 'Tek ve yerel styles.css bağlantısı bekleniyor.');

for (const reference of scriptSources.concat(stylesheetSources)) {
  check(!/^(?:[a-z]+:)?\/\//i.test(reference), `${reference}: uzak varlık bağlantısı kullanılıyor.`);
  check(!path.isAbsolute(reference), `${reference}: mutlak dosya yolu kullanılmamalı.`);
  check(fs.existsSync(path.join(root, reference)), `${reference}: index.html tarafından kullanılan dosya bulunamadı.`);
}

const runtimeFiles = ['index.html'].concat(expectedAssets.map((name) => `assets/${name}`));
const forbiddenRuntimePatterns = [
  { regex: /\bfetch\s*\(/, label: 'fetch()' },
  { regex: /\bXMLHttpRequest\b/, label: 'XMLHttpRequest' },
  { regex: /\bWebSocket\s*\(/, label: 'WebSocket' },
  { regex: /\bEventSource\s*\(/, label: 'EventSource' },
  { regex: /\bsendBeacon\s*\(/, label: 'sendBeacon' },
  { regex: /\bimportScripts\s*\(/, label: 'importScripts' },
  { regex: /\bserviceWorker\s*\.\s*register\s*\(/, label: 'service worker kaydı' },
  { regex: /\bhttps?:\/\//i, label: 'HTTP(S) adresi' },
  { regex: /(?:^|\n)\s*(?:import|export)\s+(?:[^"'\n]+\s+from\s+)?["']/m, label: 'ES module import/export' },
  { regex: /@import\s+(?:url\()?\s*["']?/i, label: 'CSS @import' }
];

for (const relative of runtimeFiles) {
  const source = fs.readFileSync(path.join(root, relative), 'utf8');
  for (const pattern of forbiddenRuntimePatterns) {
    check(!pattern.regex.test(source), `${relative}: yasak uzak/modüler çalışma özelliği bulundu (${pattern.label}).`);
  }
}

const appSource = fs.readFileSync(path.join(assetsDir, 'app.js'), 'utf8');
const storageSource = fs.readFileSync(path.join(assetsDir, 'storage.js'), 'utf8');
check(/hashchange/.test(appSource) && /location\.hash/.test(appSource), 'Hash tabanlı gezinme uygulaması doğrulanamadı.');
check(/indexedDB\.open\s*\(/.test(storageSource), 'Native IndexedDB kullanımı doğrulanamadı.');
check(/localStorage/.test(html), 'İlk boya tema tercihi için küçük localStorage kullanımı doğrulanamadı.');

const context = {
  window: {},
  console,
  Intl,
  URLSearchParams,
  Blob: global.Blob,
  setTimeout
};
context.window.window = context.window;
vm.createContext(context);

for (const relative of [
  'assets/bank.js',
  'assets/engine.js'
]) {
  const absolute = path.join(root, relative);
  vm.runInContext(fs.readFileSync(absolute, 'utf8'), context, { filename: absolute });
}

const E = context.window.ExamEngine;
const bank = E.getBank();
const sources = context.window.SOURCE_QUESTIONS;
const meta = context.window.SOURCE_BANK_META;
const allowedTypes = ['single', 'multi', 'boolean', 'fill', 'output', 'order', 'match'];
const allowedDifficulties = ['Kolay', 'Orta', 'Zorlayıcı'];

// assets/bank.js must be exactly what build.cjs produces from sorular/.
const build = require(path.join(root, 'build.cjs'));
const built = build.buildBank();
check(!built.errors.length, `sorular/ dosyalarında hata var:\n${built.errors.join('\n')}`);
check(built.output === fs.readFileSync(path.join(assetsDir, 'bank.js'), 'utf8'), 'assets/bank.js sorular/ ile güncel değil; `node build.cjs` çalıştırın.');
const buildLabels = {};
Object.keys(build.TYPES).forEach((label) => { buildLabels[build.TYPES[label]] = label; });
check(JSON.stringify(buildLabels, Object.keys(buildLabels).sort()) === JSON.stringify(Object.assign({}, E.TYPE_LABELS), Object.keys(buildLabels).sort()), 'build.cjs tür adları engine.js TYPE_LABELS ile aynı olmalı.');

check(JSON.stringify(E.SECTION_PREFIXES) === JSON.stringify(build.SECTIONS), 'build.cjs SECTIONS ile engine.js SECTION_PREFIXES aynı olmalı.');
check(JSON.stringify(Object.keys(E.CODE_LANGUAGES)) === JSON.stringify(build.CODE_LANGUAGES), 'build.cjs CODE_LANGUAGES ile engine.js CODE_LANGUAGES aynı olmalı.');
check(bank.length > 0, 'Soru bankası boş.');
check(meta.sourceQuestionCount === Object.keys(sources).length && meta.cardCount === bank.length, 'Banka meta sayaçları içerikle uyuşmuyor.');

// Areas come from the source question and are all-or-nothing within a section.
for (const card of bank) check(card.area === ((sources[card.sourceId] || {}).area || ''), `${card.id}: alan kaynak sorusundakiyle aynı olmalı.`);
const areaSample = (id, area) => [
  `# ${id} · Kolay · Teori`, '', area ? `Alan: ${area}` : '', '', 'Deneme sorusu.', '',
  `## ${id}-01 · Doğru / Yanlış`, 'Konu: Deneme', 'Soru: Deneme ifadesi doğrudur.', 'Şıklar:',
  '- [x] Doğru', '  Neden: Doğru.', '- [ ] Yanlış', '  Neden: Yanlış.',
  'İpucu: Deneme.', 'Kısa açıklama: Deneme.', 'Açıklama: Deneme.', ''
].join('\n');
const parsedArea = build.parseFile(areaSample('S98', 'Deneme alanı'), 'deneme.md');
check(!parsedArea.errors.length && parsedArea.sources[0].area === 'Deneme alanı' && parsedArea.sources[0].prompt === 'Deneme sorusu.', '"Alan:" satırı ayrıştırılıp soru metninden çıkarılmalı.');
const areaDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'alan-'));
fs.writeFileSync(path.join(areaDir, 'deneme.md'), areaSample('S98', 'Deneme alanı') + '\n' + areaSample('S99', ''));
const mixedAreas = build.buildBank(areaDir);
fs.rmSync(areaDir, { recursive: true, force: true });
check(mixedAreas.errors.some((error) => error.includes('S99') && error.includes('Alan:')), 'Bir bölümde alanı olmayan soru derlemede hata vermeli.');

// Companies come from the source question; every name in "Şirket:" must also appear in the question text.
for (const card of bank) check(JSON.stringify(card.companies) === JSON.stringify((sources[card.sourceId] || {}).companies || []), `${card.id}: şirketler kaynak sorusundakiyle aynı olmalı.`);
const companySample = areaSample('S98', 'Deneme alanı')
  .replace('Alan: Deneme alanı', 'Alan: Deneme alanı\nŞirket: ASELSAN, Baykar')
  .replace('Deneme sorusu.', 'Deneme sorusu.\n\nNerede soruldu: ASELSAN ve Baykar.');
const parsedCompany = build.parseFile(companySample, 'deneme.md');
check(!parsedCompany.errors.length && JSON.stringify(parsedCompany.sources[0].companies) === JSON.stringify(['ASELSAN', 'Baykar']) && parsedCompany.sources[0].prompt.startsWith('Deneme sorusu.'), '"Şirket:" satırı ayrıştırılıp soru metninden çıkarılmalı.');
const unlistedCompany = build.parseFile(companySample.replace('Şirket: ASELSAN, Baykar', 'Şirket: ASELSAN, Roketsan'), 'deneme.md');
check(unlistedCompany.errors.some((error) => error.includes('Roketsan')), 'Soru metninde geçmeyen şirket derlemede hata vermeli.');

// "Anahtar noktalar:" closes the source block and never leaks into the question text.
const withPoints = areaSample('S98', 'Deneme alanı').replace('Deneme sorusu.\n', 'Deneme sorusu.\n\nAnahtar noktalar:\n- Birinci nokta\n- `kod` içeren ikinci nokta\n');
const parsedPoints = build.parseFile(withPoints, 'deneme.md');
check(!parsedPoints.errors.length && parsedPoints.sources[0].prompt === 'Deneme sorusu.' && JSON.stringify(parsedPoints.sources[0].keyPoints) === JSON.stringify(['Birinci nokta', '`kod` içeren ikinci nokta']), '"Anahtar noktalar:" listesi ayrıştırılıp soru metninden çıkarılmalı.');
const badPoints = build.parseFile(withPoints.replace('- Birinci nokta', 'Birinci nokta'), 'deneme.md');
check(badPoints.errors.some((error) => error.includes('"- " ile başlamalı')), '"Anahtar noktalar:" altındaki madde dışı satır hata vermeli.');
for (const id of Object.keys(sources)) {
  const points = sources[id].keyPoints;
  check(points === undefined || (Array.isArray(points) && points.length && points.every((point) => typeof point === 'string' && point.trim())), `${id}: anahtar noktalar boş olmayan metinlerden oluşmalı.`);
}

const cardIds = new Set();
const usedSources = new Set();
const sectionCounts = {};
const typeCounts = {};

function idsOf(items) {
  return items.map((item) => String(item.id));
}

function unique(values) {
  return new Set(values).size === values.length;
}

for (const card of bank) {
  check(new RegExp(`^[${Object.keys(build.SECTIONS).join('')}]\\d+-\\d+$`).test(card.id), `${card.id}: kart kimliği biçimi geçersiz.`);
  check(!cardIds.has(card.id), `${card.id}: kart kimliği yineleniyor.`);
  cardIds.add(card.id);
  usedSources.add(card.sourceId);

  check(Object.prototype.hasOwnProperty.call(sources, card.sourceId), `${card.id}: ${card.sourceId} kaynak sorusu yok.`);
  check(card.id.startsWith(card.sourceId + '-'), `${card.id}: kart kimliği kaynak kimliğiyle başlamıyor.`);
  check(card.originalPrompt === sources[card.sourceId].prompt, `${card.id}: özgün kaynak soru anlık görüntüsü eşleşmiyor.`);
  check(card.section === build.SECTIONS[card.sourceId[0]], `${card.id}: bölüm/kaynak öneki uyuşmuyor.`);
  check(allowedTypes.includes(card.type), `${card.id}: bilinmeyen soru türü ${card.type}.`);
  check(allowedDifficulties.includes(card.difficulty), `${card.id}: bilinmeyen zorluk ${card.difficulty}.`);
  check(/^[0-9a-f]{8}$/.test(card.version), `${card.id}: kart sürümü içerikten üretilen 8 haneli özet olmalı.`);

  for (const field of ['topic', 'prompt', 'hint', 'explanationShort', 'explanationLong']) {
    check(typeof card[field] === 'string' && card[field].trim().length > 0, `${card.id}: ${field} boş.`);
  }
  const assumptions = Array.isArray(card.assumptions) ? card.assumptions : [card.assumptions];
  check(assumptions.every((value) => typeof value === 'string' && value.trim()), `${card.id}: varsayım bilgisi geçersiz.`);
  check(Array.isArray(card.tags) && card.tags.every((tag) => typeof tag === 'string' && tag.trim()), `${card.id}: etiketler geçersiz.`);
  check(typeof card.caseSensitive === 'boolean', `${card.id}: caseSensitive boolean olmalı.`);
  check(Array.isArray(card.acceptedAnswers), `${card.id}: acceptedAnswers dizi olmalı.`);

  const optionIds = idsOf(card.options || []);
  check(unique(optionIds), `${card.id}: seçenek kimlikleri benzersiz değil.`);
  check((card.options || []).every((option) => option && typeof option.text === 'string' && option.text.trim()), `${card.id}: boş seçenek metni var.`);

  if (card.type === 'single' || card.type === 'multi') {
    check(optionIds.length >= 2, `${card.id}: seçim sorusunda en az iki seçenek olmalı.`);
    const answers = card.type === 'multi' ? card.answer : [card.answer];
    check(Array.isArray(answers) && answers.length > 0, `${card.id}: seçim cevap anahtarı boş.`);
    check(unique(answers.map(String)), `${card.id}: seçim cevap anahtarında tekrar var.`);
    check(answers.every((answer) => optionIds.includes(String(answer))), `${card.id}: seçim cevabı seçeneklerde yok.`);
    const correct = new Set(answers.map(String));
    for (const id of optionIds.filter((id) => !correct.has(id))) {
      check(typeof card.optionExplanations[id] === 'string' && card.optionExplanations[id].trim(), `${card.id}: yanlış ${id} seçeneğinin gerekçesi eksik.`);
    }
  } else if (card.type === 'boolean') {
    check(typeof card.answer === 'boolean', `${card.id}: doğru/yanlış cevap anahtarı boolean değil.`);
    check(optionIds.length === 0 || (optionIds.length === 2 && optionIds.includes('a') && optionIds.includes('b')), `${card.id}: doğru/yanlış seçenek biçimi geçersiz.`);
    if (optionIds.length) {
      for (const id of optionIds) {
        check(typeof card.optionExplanations[id] === 'string' && card.optionExplanations[id].trim(), `${card.id}: ${id} doğru/yanlış seçeneğinin gerekçesi eksik.`);
      }
    }
  } else if (card.type === 'fill' || card.type === 'output') {
    check(typeof card.answer === 'string' && card.answer.length > 0, `${card.id}: metin cevap anahtarı boş.`);
    check(card.acceptedAnswers.every((answer) => typeof answer === 'string' && answer.length > 0), `${card.id}: kabul edilen eşdeğer cevap geçersiz.`);
  } else if (card.type === 'order') {
    const itemIds = idsOf(card.items || []);
    const answerIds = Array.isArray(card.answer) ? card.answer.map(String) : [];
    check(itemIds.length >= 2 && unique(itemIds), `${card.id}: sıralama öğeleri yetersiz veya yineleniyor.`);
    sameList(answerIds, itemIds, `${card.id}: sıralama cevabı tam permütasyon değil`);
  } else if (card.type === 'match') {
    const leftIds = idsOf((card.pairs && card.pairs.left) || []);
    const rightIds = idsOf((card.pairs && card.pairs.right) || []);
    const answerKeys = card.answer && typeof card.answer === 'object' && !Array.isArray(card.answer) ? Object.keys(card.answer) : [];
    check(leftIds.length >= 2 && rightIds.length >= 2, `${card.id}: eşleştirme taraflarında en az iki öğe olmalı.`);
    check(unique(leftIds) && unique(rightIds), `${card.id}: eşleştirme kimlikleri benzersiz değil.`);
    sameList(answerKeys, leftIds, `${card.id}: eşleştirme cevabı tüm sol öğeleri kapsamıyor`);
    check(answerKeys.every((leftId) => rightIds.includes(String(card.answer[leftId]))), `${card.id}: eşleştirme cevabında geçersiz sağ kimlik var.`);
  }

  const selfGrade = E.grade(card, card.answer);
  check(selfGrade.correct === true && selfGrade.score === 1, `${card.id}: kendi cevap anahtarı tam doğru puanlanmıyor.`);
  sectionCounts[card.section] = (sectionCounts[card.section] || 0) + 1;
  typeCounts[card.type] = (typeCounts[card.type] || 0) + 1;
}

sameList(Array.from(usedSources), Object.keys(sources), 'Her kaynak sorunun en az bir kartı olmalı');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  runtimeFiles: runtimeFiles.length,
  cards: bank.length,
  sources: Object.keys(sources).length,
  sections: sectionCounts,
  types: typeCounts,
  bankVersion: meta.version,
  networkApis: 0,
  moduleScripts: 0
}, null, 2));
