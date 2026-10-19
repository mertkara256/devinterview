'use strict';

// Builds assets/bank.js from the question files in sorular/.
//   node build.cjs          writes assets/bank.js
//   node build.cjs --check  fails when assets/bank.js does not match sorular/

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const QUESTION_DIR = path.join(ROOT, 'sorular');
const OUTPUT = path.join(ROOT, 'assets', 'bank.js');
const TITLE = 'Yeni Mezun Java–OOP–Algoritma Teknik Mülakat Soru Bankası';
const SECTIONS = { J: 'Java', O: 'OOP', A: 'Algoritma', S: 'Savunma' };
const SECTION_ORDER = Object.keys(SECTIONS);
const DIFFICULTIES = ['Kolay', 'Orta', 'Zorlayıcı'];
const TYPES = {
  'Tek seçim': 'single',
  'Çoklu seçim': 'multi',
  'Doğru / Yanlış': 'boolean',
  'Boşluk doldurma': 'fill',
  'Kod çıktısı': 'output',
  'Sıralama': 'order',
  'Eşleştirme': 'match'
};
const ID = '[A-Za-z0-9_-]+';
const SINGLE_FIELDS = ['Konu', 'Soru', 'İpucu', 'Kısa açıklama', 'Açıklama', 'Etiketler', 'Büyük/küçük harf duyarlı'];
const FIELD = /^(Konu|Soru|İpucu|Kısa açıklama|Açıklama|Varsayım|Etiketler|Büyük\/küçük harf duyarlı|Cevap|Kabul|Kod|Şıklar|Sıra|Eşleşmeler|Fazladan seçenekler):(.*)$/;
const FENCE = /^\s*```/;

function idParts(id) {
  const match = /^([A-Z]+)(\d+)(?:-(\d+))?$/.exec(id);
  return match ? [SECTION_ORDER.indexOf(match[1]), Number(match[2]), Number(match[3] || 0)] : [99, 0, 0];
}

function compareIds(a, b) {
  const left = idParts(a);
  const right = idParts(b);
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return a.localeCompare(b);
}

function shortHash(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 8);
}

// Splits a file into source and card blocks. Fenced code and <!-- --> comments never start a block.
function splitBlocks(text, file, errors) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let current = null;
  let inFence = false;
  let inComment = false;
  lines.forEach((line, index) => {
    if (!inFence && (inComment || /^\s*<!--/.test(line))) {
      inComment = !/-->/.test(line);
      return;
    }
    if (FENCE.test(line)) inFence = !inFence;
    const sourceHeader = !inFence && /^# /.test(line);
    const cardHeader = !inFence && /^## /.test(line);
    if (sourceHeader || cardHeader) {
      current = { kind: sourceHeader ? 'source' : 'card', header: line, line: index, body: [] };
      blocks.push(current);
      return;
    }
    if (current) current.body.push({ text: line, line: index });
    else if (line.trim()) errors.push(`${file}:${index + 1}: İlk "# " soru başlığından önce yalnızca boş satır veya <!-- --> yorumu olabilir.`);
  });
  if (inFence) errors.push(`${file}: Kapatılmamış \`\`\` kod bloğu var.`);
  return blocks;
}

function readFence(body, start, file, errors, label) {
  let index = start;
  while (index < body.length && !body[index].text.trim()) index += 1;
  if (index >= body.length || !FENCE.test(body[index].text)) {
    errors.push(`${file}:${(body[start - 1] || body[0]).line + 1}: "${label}:" satırından sonra \`\`\` ile başlayan bir blok bekleniyor.`);
    return { text: '', next: start };
  }
  const lines = [];
  index += 1;
  while (index < body.length && !FENCE.test(body[index].text)) {
    lines.push(body[index].text);
    index += 1;
  }
  return { text: lines.join('\n'), next: index + 1 };
}

function parseSource(block, file, errors) {
  const match = /^# ([A-Z]+\d+) · (.+?) · (.+)$/.exec(block.header);
  if (!match) {
    errors.push(`${file}:${block.line + 1}: Soru başlığı "# J01 · Kolay · Teori" biçiminde olmalı.`);
    return null;
  }
  const [, id, difficulty, kind] = match;
  if (!SECTIONS[id.replace(/\d+$/, '')]) errors.push(`${file}:${block.line + 1}: ${id}: kimlik ${SECTION_ORDER.join(', ')} harflerinden biriyle başlamalı.`);
  if (!DIFFICULTIES.includes(difficulty)) errors.push(`${file}:${block.line + 1}: ${id}: zorluk ${DIFFICULTIES.join(', ')} değerlerinden biri olmalı.`);
  const body = block.body.slice();
  while (body.length && !body[0].text.trim()) body.shift();
  // An optional "Alan:" first line groups the question under an area of its section.
  let area = '';
  const areaLine = body.length ? /^Alan:(.*)$/.exec(body[0].text) : null;
  if (areaLine) {
    area = areaLine[1].trim();
    if (!area) errors.push(`${file}:${body[0].line + 1}: ${id}: "Alan:" satırı boş.`);
    body.shift();
  }
  // An optional "Anahtar noktalar:" list closes the block; interview mode uses it as its checklist.
  const keyPoints = [];
  let inFence = false;
  const listAt = body.findIndex((entry) => {
    if (FENCE.test(entry.text)) inFence = !inFence;
    return !inFence && entry.text.trim() === 'Anahtar noktalar:';
  });
  if (listAt !== -1) {
    body.slice(listAt + 1).forEach((entry) => {
      if (!entry.text.trim()) return;
      const point = /^- (.+)$/.exec(entry.text);
      if (point) keyPoints.push(point[1].trim());
      else errors.push(`${file}:${entry.line + 1}: ${id}: "Anahtar noktalar:" listesindeki her satır "- " ile başlamalı.`);
    });
    if (!keyPoints.length) errors.push(`${file}:${body[listAt].line + 1}: ${id}: "Anahtar noktalar:" listesi boş.`);
    body.splice(listAt);
  }
  const lines = body.map((entry) => entry.text);
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  if (!lines.length) errors.push(`${file}:${block.line + 1}: ${id}: soru metni boş.`);
  return { id, difficulty, kind: kind.trim(), area, keyPoints, prompt: lines.join('\n'), file, line: block.line };
}

function parseCard(block, source, file, errors) {
  const where = (line) => `${file}:${line + 1}`;
  const header = new RegExp(`^## (${ID}) · (.+)$`).exec(block.header);
  if (!header) {
    errors.push(`${where(block.line)}: Kart başlığı "## J01-01 · Tek seçim" biçiminde olmalı.`);
    return null;
  }
  const id = header[1];
  const type = TYPES[header[2].trim()];
  if (!type) errors.push(`${where(block.line)}: ${id}: bilinmeyen soru türü "${header[2].trim()}". Geçerli türler: ${Object.keys(TYPES).join(', ')}.`);
  if (!source) {
    errors.push(`${where(block.line)}: ${id}: kart bir "# " soru başlığının altında olmalı.`);
    return null;
  }
  if (!id.startsWith(source.id + '-') || !/^[A-Z]+\d+-\d+$/.test(id)) errors.push(`${where(block.line)}: ${id}: kart kimliği "${source.id}-01" biçiminde, sorunun kimliğiyle başlamalı.`);

  const fields = {};
  const assumptions = [];
  const accepted = [];
  let options = null;
  let items = null;
  let pairs = null;
  let extras = null;
  let code = '';
  let answerText = null;
  const body = block.body;
  let index = 0;

  const readList = (pattern, label, onItem) => {
    let cursor = index + 1;
    const found = [];
    while (cursor < body.length) {
      const text = body[cursor].text;
      if (!text.trim()) { cursor += 1; continue; }
      const match = pattern.exec(text);
      if (!match) break;
      onItem(match, body[cursor].line, found);
      cursor += 1;
    }
    if (!found.length) errors.push(`${where(body[index].line)}: ${id}: "${label}:" altında en az bir satır olmalı.`);
    index = cursor;
    return found;
  };

  while (index < body.length) {
    const { text, line } = body[index];
    if (!text.trim()) { index += 1; continue; }
    const match = FIELD.exec(text);
    if (!match) {
      errors.push(`${where(line)}: ${id}: tanınmayan satır: "${text.trim()}"`);
      index += 1;
      continue;
    }
    const label = match[1];
    const value = match[2].trim();
    if (SINGLE_FIELDS.includes(label)) {
      if (fields[label] !== undefined) errors.push(`${where(line)}: ${id}: "${label}" birden fazla kez yazılmış.`);
      if (!value) errors.push(`${where(line)}: ${id}: "${label}" boş olamaz.`);
      fields[label] = value;
      index += 1;
    } else if (label === 'Varsayım') {
      if (!value) errors.push(`${where(line)}: ${id}: "Varsayım" boş olamaz.`);
      assumptions.push(value);
      index += 1;
    } else if (label === 'Cevap' || label === 'Kabul') {
      let content = value;
      if (!value) {
        const fence = readFence(body, index + 1, file, errors, label);
        content = fence.text;
        index = fence.next;
      } else {
        index += 1;
      }
      if (label === 'Cevap') {
        if (answerText !== null) errors.push(`${where(line)}: ${id}: "Cevap" birden fazla kez yazılmış.`);
        answerText = content;
      } else {
        accepted.push(content);
      }
    } else if (label === 'Kod') {
      if (value) errors.push(`${where(line)}: ${id}: kod "Kod:" satırının altında \`\`\` bloğu içinde yazılmalı.`);
      const fence = readFence(body, index + 1, file, errors, label);
      code = fence.text;
      index = fence.next;
    } else if (label === 'Şıklar') {
      const optionPattern = type === 'boolean'
        ? /^- \[( |x)\] (Doğru|Yanlış)$/
        : new RegExp(`^- \\[( |x)\\] (${ID}): (.+)$`);
      const reasonPattern = /^\s{2,}Neden: (.+)$/;
      options = [];
      let cursor = index + 1;
      while (cursor < body.length) {
        const current = body[cursor];
        if (!current.text.trim()) { cursor += 1; continue; }
        const option = optionPattern.exec(current.text);
        const reason = reasonPattern.exec(current.text);
        if (option) {
          const entry = type === 'boolean'
            ? { id: option[2] === 'Doğru' ? 'a' : 'b', text: option[2], correct: option[1] === 'x', line: current.line }
            : { id: option[2], text: option[3].trim(), correct: option[1] === 'x', line: current.line };
          options.push(entry);
        } else if (reason && options.length) {
          if (options[options.length - 1].reason !== undefined) errors.push(`${where(current.line)}: ${id}: bir şıkta en fazla bir "Neden:" satırı olabilir.`);
          options[options.length - 1].reason = reason[1].trim();
        } else {
          break;
        }
        cursor += 1;
      }
      if (!options.length) errors.push(`${where(line)}: ${id}: "Şıklar:" altında ${type === 'boolean' ? '"- [x] Doğru" / "- [ ] Yanlış"' : '"- [ ] a: metin"'} biçiminde şıklar olmalı.`);
      index = cursor;
    } else if (label === 'Sıra') {
      items = readList(new RegExp(`^(\\d+)\\. (${ID}): (.+)$`), label, (m, itemLine, found) => {
        if (Number(m[1]) !== found.length + 1) errors.push(`${where(itemLine)}: ${id}: sıra numaraları 1'den başlayıp birer artmalı.`);
        found.push({ id: m[2], text: m[3].trim() });
      });
    } else if (label === 'Eşleşmeler') {
      pairs = readList(new RegExp(`^- (${ID}): (.+?) => (${ID}): (.+)$`), label, (m, pairLine, found) => {
        found.push({ leftId: m[1], left: m[2].trim(), rightId: m[3], right: m[4].trim(), line: pairLine });
      });
    } else if (label === 'Fazladan seçenekler') {
      extras = readList(new RegExp(`^- (${ID}): (.+)$`), label, (m, extraLine, found) => {
        found.push({ id: m[1], text: m[2].trim(), line: extraLine });
      });
    }
  }

  for (const required of ['Konu', 'Soru', 'İpucu', 'Kısa açıklama', 'Açıklama']) {
    if (!fields[required]) errors.push(`${where(block.line)}: ${id}: "${required}:" alanı eksik.`);
  }
  const caseSensitive = fields['Büyük/küçük harf duyarlı'];
  if (caseSensitive !== undefined && !['evet', 'hayır'].includes(caseSensitive)) errors.push(`${where(block.line)}: ${id}: "Büyük/küçük harf duyarlı" evet veya hayır olmalı.`);

  const allowed = {
    single: ['Şıklar'], multi: ['Şıklar'], boolean: ['Şıklar'],
    fill: ['Cevap'], output: ['Cevap'], order: ['Sıra'], match: ['Eşleşmeler']
  }[type] || [];
  const present = { Şıklar: options, Cevap: answerText, Sıra: items, Eşleşmeler: pairs };
  Object.keys(present).forEach((label) => {
    if (present[label] !== null && !allowed.includes(label)) errors.push(`${where(block.line)}: ${id}: "${label}:" ${header[2].trim()} türünde kullanılmaz.`);
    if (present[label] === null && allowed.includes(label)) errors.push(`${where(block.line)}: ${id}: ${header[2].trim()} türü için "${label}:" alanı gerekli.`);
  });
  if (extras && type !== 'match') errors.push(`${where(block.line)}: ${id}: "Fazladan seçenekler:" yalnız eşleştirmede kullanılır.`);
  if ((accepted.length || caseSensitive !== undefined) && type !== 'fill' && type !== 'output') errors.push(`${where(block.line)}: ${id}: "Kabul:" ve "Büyük/küçük harf duyarlı:" yalnız boşluk doldurma ve kod çıktısında kullanılır.`);

  const card = {
    id,
    sourceId: source.id,
    section: SECTIONS[source.id.replace(/\d+$/, '')] || '',
    topic: fields.Konu || '',
    difficulty: source.difficulty,
    type: type || '',
    prompt: fields.Soru || '',
    code,
    options: [],
    items: [],
    pairs: { left: [], right: [] },
    answer: null,
    acceptedAnswers: [],
    caseSensitive: caseSensitive === 'evet',
    hint: fields['İpucu'] || '',
    explanationShort: fields['Kısa açıklama'] || '',
    explanationLong: fields['Açıklama'] || '',
    optionExplanations: {},
    assumptions,
    tags: fields.Etiketler ? fields.Etiketler.split(',').map((tag) => tag.trim()).filter(Boolean) : []
  };

  if (options) {
    const seen = new Set();
    options.forEach((option) => {
      if (seen.has(option.id)) errors.push(`${where(option.line)}: ${id}: "${option.id}" şık kimliği tekrarlanıyor.`);
      seen.add(option.id);
    });
    const correct = options.filter((option) => option.correct);
    if (type === 'boolean') {
      if (options.length !== 2 || options[0].text !== 'Doğru' || options[1].text !== 'Yanlış') errors.push(`${where(block.line)}: ${id}: Doğru / Yanlış kartında sırasıyla "Doğru" ve "Yanlış" şıkları olmalı.`);
    } else if (options.length < 2) {
      errors.push(`${where(block.line)}: ${id}: en az iki şık olmalı.`);
    }
    if ((type === 'single' || type === 'boolean') && correct.length !== 1) errors.push(`${where(block.line)}: ${id}: tam olarak bir şık [x] ile işaretlenmeli.`);
    if (type === 'multi' && !correct.length) errors.push(`${where(block.line)}: ${id}: en az bir şık [x] ile işaretlenmeli.`);
    options.forEach((option) => {
      if (!option.correct && option.reason === undefined) errors.push(`${where(option.line)}: ${id}: yanlış şık "${option.text}" için altında "  Neden: ..." satırı olmalı.`);
    });
    if (type === 'boolean' && options.some((option) => option.reason === undefined)) errors.push(`${where(block.line)}: ${id}: Doğru / Yanlış kartında iki şıkkın da "Neden:" satırı olmalı.`);
    card.options = options.map((option) => ({ id: option.id, text: option.text }));
    options.forEach((option) => { if (option.reason !== undefined) card.optionExplanations[option.id] = option.reason; });
    if (type === 'single') card.answer = correct.length ? correct[0].id : null;
    if (type === 'multi') card.answer = correct.map((option) => option.id);
    if (type === 'boolean') card.answer = correct.length ? correct[0].id === 'a' : null;
  }
  if (answerText !== null) {
    if (!answerText.trim()) errors.push(`${where(block.line)}: ${id}: "Cevap" boş olamaz.`);
    card.answer = answerText;
    card.acceptedAnswers = accepted;
  }
  if (items) {
    if (items.length < 2) errors.push(`${where(block.line)}: ${id}: sıralamada en az iki adım olmalı.`);
    if (new Set(items.map((item) => item.id)).size !== items.length) errors.push(`${where(block.line)}: ${id}: sıralama kimlikleri tekrarlanıyor.`);
    card.items = items;
    card.answer = items.map((item) => item.id);
  }
  if (pairs) {
    if (pairs.length < 2) errors.push(`${where(block.line)}: ${id}: eşleştirmede en az iki satır olmalı.`);
    const left = [];
    const right = [];
    const rightText = {};
    const addRight = (rightId, textValue, rightLine) => {
      if (rightText[rightId] === undefined) {
        rightText[rightId] = textValue;
        right.push({ id: rightId, text: textValue });
      } else if (rightText[rightId] !== textValue) {
        errors.push(`${where(rightLine)}: ${id}: "${rightId}" sağ kimliği farklı metinlerle kullanılmış.`);
      }
    };
    card.answer = {};
    pairs.forEach((pair) => {
      if (card.answer[pair.leftId] !== undefined) errors.push(`${where(pair.line)}: ${id}: "${pair.leftId}" sol kimliği tekrarlanıyor.`);
      left.push({ id: pair.leftId, text: pair.left });
      addRight(pair.rightId, pair.right, pair.line);
      card.answer[pair.leftId] = pair.rightId;
    });
    (extras || []).forEach((extra) => {
      if (rightText[extra.id] !== undefined) errors.push(`${where(extra.line)}: ${id}: fazladan seçenek "${extra.id}" bir eşleşmede zaten kullanılıyor.`);
      addRight(extra.id, extra.text, extra.line);
    });
    card.pairs = { left, right };
  }
  card.version = shortHash(card);
  return card;
}

function parseFile(text, file) {
  const errors = [];
  const sources = [];
  const cards = [];
  const locations = [];
  let source = null;
  splitBlocks(text, file, errors).forEach((block) => {
    if (block.kind === 'source') {
      source = parseSource(block, file, errors);
      if (source) sources.push(source);
    } else {
      const card = parseCard(block, source, file, errors);
      if (card) {
        cards.push(card);
        locations.push(`${file}:${block.line + 1}`);
      }
    }
  });
  return { sources, cards, locations, errors };
}

function questionFiles(dir) {
  return fs.readdirSync(dir).filter((name) => name.endsWith('.md')).sort().map((name) => path.join(dir, name));
}

function buildBank(dir) {
  const files = questionFiles(dir || QUESTION_DIR);
  const errors = [];
  const sources = [];
  const cards = [];
  const locations = [];
  if (!files.length) errors.push('sorular/ klasöründe hiç .md dosyası yok.');
  files.forEach((filePath) => {
    const parsed = parseFile(fs.readFileSync(filePath, 'utf8'), path.relative(ROOT, filePath));
    errors.push(...parsed.errors);
    sources.push(...parsed.sources);
    cards.push(...parsed.cards);
    locations.push(...parsed.locations);
  });

  const sourceById = {};
  sources.forEach((source) => {
    if (sourceById[source.id]) errors.push(`${source.file}:${source.line + 1}: ${source.id} kimliği ${sourceById[source.id].file} dosyasında da kullanılmış.`);
    sourceById[source.id] = source;
  });
  const cardAt = {};
  cards.forEach((card, index) => {
    if (cardAt[card.id]) errors.push(`${locations[index]}: ${card.id} kart kimliği ${cardAt[card.id]} konumunda da kullanılmış.`);
    else cardAt[card.id] = locations[index];
  });
  sources.forEach((source) => {
    if (!cards.some((card) => card.sourceId === source.id)) errors.push(`${source.file}:${source.line + 1}: ${source.id} sorusunun altında hiç kart yok.`);
  });
  // Areas are all-or-nothing within a section, so an area filter never hides a question silently.
  SECTION_ORDER.forEach((prefix) => {
    const inSection = sources.filter((source) => source.id.replace(/\d+$/, '') === prefix);
    if (!inSection.some((source) => source.area)) return;
    inSection.filter((source) => !source.area).forEach((source) => {
      errors.push(`${source.file}:${source.line + 1}: ${source.id}: ${SECTIONS[prefix]} bölümündeki diğer sorularda "Alan:" var; bu soruya da ekleyin.`);
    });
  });
  if (errors.length) return { errors };

  sources.sort((a, b) => compareIds(a.id, b.id));
  cards.sort((a, b) => compareIds(a.id, b.id));
  const sourceQuestions = {};
  sources.forEach((source) => {
    sourceQuestions[source.id] = { id: source.id, descriptor: `${source.difficulty} · ${source.kind}`, prompt: source.prompt };
    if (source.area) sourceQuestions[source.id].area = source.area;
    if (source.keyPoints.length) sourceQuestions[source.id].keyPoints = source.keyPoints;
  });
  const digest = crypto.createHash('sha256').update(JSON.stringify({ sourceQuestions, cards })).digest('hex');
  const meta = { title: TITLE, version: digest.slice(0, 8), sourceSha256: digest, sourceQuestionCount: sources.length, cardCount: cards.length };
  const output = '/* Generated by build.cjs from the question files in sorular/. Do not edit by hand; run `node build.cjs` after changing a question. */\n' +
    'window.SOURCE_BANK_META = Object.freeze(' + JSON.stringify(meta, null, 2) + ');\n' +
    'window.SOURCE_QUESTIONS = Object.freeze(' + JSON.stringify(sourceQuestions, null, 2) + ');\n' +
    'window.QUESTION_CARDS = ' + JSON.stringify(cards, null, 2) + ';\n';
  return { errors, meta, sourceQuestions, cards, output };
}

function main() {
  const result = buildBank();
  if (result.errors.length) {
    console.error(`Soru dosyalarında ${result.errors.length} hata var:\n` + result.errors.map((error) => '  ' + error).join('\n'));
    process.exit(1);
  }
  const summary = `${result.meta.sourceQuestionCount} soru, ${result.cards.length} kart (sürüm ${result.meta.version})`;
  if (process.argv.includes('--check')) {
    const current = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT, 'utf8') : '';
    if (current !== result.output) {
      console.error('assets/bank.js güncel değil; `node build.cjs` çalıştırın.');
      process.exit(1);
    }
    console.log(`assets/bank.js güncel: ${summary}.`);
    return;
  }
  fs.writeFileSync(OUTPUT, result.output);
  console.log(`assets/bank.js yazıldı: ${summary}.`);
}

module.exports = { buildBank, parseFile, TYPES, SECTIONS, OUTPUT };

if (require.main === module) main();
