const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
let source = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const initIndex = source.lastIndexOf('\n  init().catch(function');
if (initIndex < 0) throw new Error('app.js test kancası için init bloğu bulunamadı.');
source = source.slice(0, initIndex) + `
  window.__AppRuntimeTest = {
    state: state,
    responseIsBlank: responseIsBlank,
    countsTowardDaily: countsTowardDaily,
    renderResult: renderResult
  };
})();
`;

const elements = {};
function element(id) {
  if (!elements[id]) {
    elements[id] = {
      id,
      innerHTML: '',
      textContent: '',
      dataset: {},
      classList: { toggle() {} },
      setAttribute() {},
      removeAttribute() {},
      addEventListener() {},
      querySelectorAll() { return []; },
    };
  }
  return elements[id];
}

let attempt = { id: 'active-attempt', status: 'active' };
const context = {
  window: {
    ExamEngine: {
      TYPE_LABELS: {},
      isBlankAnswer(card, answer) {
        if (card.type === 'order') return !Array.isArray(answer) || answer.length === 0;
        return answer == null || String(answer).trim() === '';
      },
      escapeHtml(value) { return String(value == null ? '' : value); },
    },
    ExamDB: { async get() { return attempt; }, async all() { return []; } },
    matchMedia() { return { matches: false }; },
  },
  document: {
    hidden: false,
    getElementById: element,
    querySelectorAll() { return []; },
  },
  location: { hash: '' },
  URLSearchParams,
  console,
  setTimeout,
  clearTimeout,
  performance: { now: () => 0 },
};
context.window.window = context.window;
context.window.document = context.document;
context.window.location = context.location;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'assets/app.js' });

const T = context.window.__AppRuntimeTest;
const failures = [];
function check(condition, message) { if (!condition) failures.push(message); }

const orderCard = { type: 'order' };
check(T.responseIsBlank(orderCard, { currentAnswer: ['i2', 'i1'], touched: false }) === true,
  'Dokunulmamış sıralama kartı boş kalmalı.');
check(T.responseIsBlank(orderCard, { currentAnswer: ['i2', 'i1'], touched: true }) === false,
  'Açıkça gönderilen/değiştirilen sıralama kartı cevaplı olmalı.');
check(T.countsTowardDaily({ blank: true }) === false,
  'Hiç görülmemiş boş kart günlük hedefi artırmamalı.');
check(T.countsTowardDaily({ blank: true, seenAt: '2026-07-18T10:00:00.000Z' }) === true,
  'Görülüp boş geçilen kart günlük çalışmaya sayılmalı.');

T.renderResult('active-attempt').then(() => {
  check(context.location.hash === '#/session?id=active-attempt',
    'Aktif oturum sonuç/çözüm rotasından soru ekranına yönlendirilmeli.');
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exit(1);
  }
  console.log(JSON.stringify({ ok: true, tests: 5 }, null, 2));
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
