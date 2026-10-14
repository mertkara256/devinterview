(function () {
  'use strict';

  var E = window.ExamEngine;
  var DB = window.ExamDB;
  var app = document.getElementById('app');
  var shell = document.getElementById('app-shell');
  var storageIndicator = document.getElementById('storage-indicator');
  var liveRegion = document.getElementById('sr-live');
  var toastRegion = document.getElementById('toast-region');
  var saveTimers = {
    draft: null,
    builder: null,
    explorer: null,
    interview: null,
    interviewForm: null
  };
  var timerCheckpointing = false;

  var DEFAULT_SETTINGS = {
    id: 'app',
    theme: 'system',
    density: 'comfortable',
    fontScale: 'normal',
    highContrast: false,
    reducedMotion: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    dailyGoal: 10,
    onboardingComplete: false,
    focusMode: false,
    codeFontSize: 'normal',
    lastBackupAt: null,
    updatedAt: new Date().toISOString()
  };

  var state = {
    bank: [],
    bankById: {},
    validation: null,
    settings: Object.assign({}, DEFAULT_SETTINGS),
    route: null,
    routeToken: 0,
    currentAttempt: null,
    responseMap: {},
    timer: null,
    onboardingStep: 0,
    pendingImport: null,
    explorerLimit: 60,
    explorerFilters: { search: '', section: 'all', difficulty: 'all', type: 'all' },
    builderDefaults: null,
    interviewBank: [],
    interviewById: {},
    interview: null,
    interviewClock: null,
    interviewDefaults: null,
    interviewFocusReveal: false
  };

  function routeInfo() {
    var raw = location.hash.replace(/^#\/?/, '') || 'dashboard';
    var pieces = raw.split('?');
    return { name: pieces[0] || 'dashboard', params: new URLSearchParams(pieces[1] || '') };
  }

  function navigate(path) {
    location.hash = '#/' + path.replace(/^\//, '');
  }

  function toast(message, type) {
    var element = document.createElement('div');
    element.className = 'toast ' + (type || '');
    element.textContent = message;
    toastRegion.appendChild(element);
    setTimeout(function () {
      element.style.opacity = '0';
      element.style.transform = 'translateY(8px)';
      setTimeout(function () { element.remove(); }, 180);
    }, 3600);
  }

  function announce(message) {
    liveRegion.textContent = '';
    setTimeout(function () { liveRegion.textContent = message; }, 20);
  }

  function focusableElements(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')).filter(function (element) {
      return !element.disabled && !element.closest('[hidden]');
    });
  }

  function captureFocus(container) {
    var active = document.activeElement;
    if (!active || !container || !container.contains(active)) return null;
    var elements = focusableElements(container);
    return {
      id: active.id || '',
      tagName: active.tagName,
      name: active.getAttribute('name') || '',
      value: 'value' in active ? String(active.value) : '',
      action: active.dataset ? active.dataset.action || '' : '',
      dataId: active.dataset ? active.dataset.id || active.dataset.source || '' : '',
      cardId: active.dataset ? active.dataset.cardId || '' : '',
      index: elements.indexOf(active),
      selectionStart: typeof active.selectionStart === 'number' ? active.selectionStart : null,
      selectionEnd: typeof active.selectionEnd === 'number' ? active.selectionEnd : null
    };
  }

  function restoreFocus(container, snapshot) {
    if (!container || !snapshot) return;
    var elements = focusableElements(container);
    var target = snapshot.id ? document.getElementById(snapshot.id) : null;
    if (target && !container.contains(target)) target = null;
    if (!target && snapshot.action) {
      target = elements.find(function (element) {
        var dataId = element.dataset ? element.dataset.id || element.dataset.source || '' : '';
        var cardId = element.dataset ? element.dataset.cardId || '' : '';
        return element.dataset && element.dataset.action === snapshot.action && dataId === snapshot.dataId && cardId === snapshot.cardId;
      });
    }
    if (!target && snapshot.name) {
      target = elements.find(function (element) {
        return element.tagName === snapshot.tagName && element.getAttribute('name') === snapshot.name &&
          (element.type !== 'radio' && element.type !== 'checkbox' || String(element.value) === snapshot.value);
      });
    }
    if (!target && snapshot.index >= 0) target = elements[Math.min(snapshot.index, elements.length - 1)];
    if (!target) return;
    target.focus({ preventScroll: true });
    if (snapshot.selectionStart !== null && typeof target.setSelectionRange === 'function') {
      var length = String(target.value || '').length;
      target.setSelectionRange(Math.min(snapshot.selectionStart, length), Math.min(snapshot.selectionEnd, length));
    }
  }

  async function refreshPreservingFocus(renderer, container) {
    var root = container || app;
    var snapshot = captureFocus(root);
    app.setAttribute('aria-busy', 'true');
    var rendered = false;
    try {
      await renderer();
      rendered = true;
    } finally {
      app.setAttribute('aria-busy', 'false');
    }
    if (rendered) restoreFocus(root, snapshot);
  }

  function applySettings() {
    var root = document.documentElement;
    root.dataset.theme = state.settings.theme;
    var resolved = state.settings.theme === 'system'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : state.settings.theme;
    root.dataset.resolvedTheme = resolved;
    root.dataset.density = state.settings.density;
    root.dataset.fontScale = state.settings.fontScale;
    root.dataset.contrast = state.settings.highContrast ? 'high' : 'normal';
    root.dataset.reducedMotion = state.settings.reducedMotion ? 'true' : 'false';
    shell.classList.toggle('focus-mode', !!state.settings.focusMode);
    var focusToggle = document.getElementById('focus-toggle');
    if (focusToggle) {
      focusToggle.setAttribute('aria-pressed', state.settings.focusMode ? 'true' : 'false');
      focusToggle.setAttribute('aria-label', state.settings.focusMode ? 'Odak modunu kapat' : 'Odak modunu aç');
    }
    var themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      var themeLabel = state.settings.theme === 'system' ? 'sistem' : state.settings.theme === 'light' ? 'açık' : 'koyu';
      themeToggle.setAttribute('aria-label', 'Temayı değiştir. Geçerli tema: ' + themeLabel);
    }
    try { localStorage.setItem('jmis.theme', state.settings.theme); } catch (error) { /* non-fatal */ }
  }

  async function saveSettings() {
    state.settings.updatedAt = new Date().toISOString();
    await DB.put('settings', state.settings);
    applySettings();
  }

  function setActiveNav(name) {
    var aliases = { session: 'builder', result: 'history', settings: 'settings', 'interview-session': 'interview' };
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      if (link.dataset.nav === (aliases[name] || name)) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  async function recordsMap(storeName, keyField) {
    var records = await DB.all(storeName);
    var map = {};
    records.forEach(function (record) { map[record[keyField || 'id']] = record; });
    return map;
  }

  function pageHeader(eyebrow, title, description, actions) {
    return '<header class="page-head">' +
      '<div><span class="eyebrow">' + E.escapeHtml(eyebrow) + '</span><h1>' + E.escapeHtml(title) + '</h1><p>' + E.escapeHtml(description) + '</p></div>' +
      '<div class="page-actions">' + (actions || '') + '</div>' +
      '</header>';
  }

  function emptyState(symbol, title, text, action) {
    return '<div class="empty-state"><div class="empty-icon" aria-hidden="true">' + E.escapeHtml(symbol) + '</div>' +
      '<h2>' + E.escapeHtml(title) + '</h2><p class="muted">' + E.escapeHtml(text) + '</p>' + (action || '') + '</div>';
  }

  function difficultyBadge(value) {
    var kind = value === 'Zorlayıcı' ? 'danger' : value === 'Orta' ? 'warning' : 'success';
    return '<span class="badge ' + kind + '">' + E.escapeHtml(value) + '</span>';
  }

  function typeLabel(type) {
    return E.TYPE_LABELS[type] || type;
  }

  function percent(value) {
    return Math.max(0, Math.min(100, Math.round(value || 0)));
  }

  function progressHtml(value, label, kind) {
    var rounded = percent(value);
    return '<div class="progress-track" role="progressbar" aria-label="' + E.escapeHtml(label) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + rounded + '">' +
      '<div class="progress-fill' + (kind ? ' ' + kind : '') + '" style="width:' + rounded + '%"></div></div>';
  }

  function storageWarning() {
    if (DB.mode() === 'indexeddb') return '';
    return '<div class="storage-warning"><strong>Sınırlı depolama modu:</strong> IndexedDB kullanılamadı. Düzenli JSON yedeği alman önemli.</div>';
  }

  async function confirmAction(title, message, actionLabel) {
    var dialog = document.getElementById('confirm-dialog');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    document.getElementById('confirm-action').textContent = actionLabel || 'Onayla';
    dialog.returnValue = '';
    return new Promise(function (resolve) {
      function close() {
        dialog.removeEventListener('close', close);
        resolve(dialog.returnValue === 'confirm');
      }
      dialog.addEventListener('close', close);
      dialog.showModal();
    });
  }

  function responseId(attemptId, questionId) {
    return attemptId + '::' + questionId;
  }

  function currentItem() {
    if (!state.currentAttempt) return null;
    return state.currentAttempt.items[state.currentAttempt.currentIndex || 0];
  }

  function currentCard() {
    var item = currentItem();
    return item ? (state.bankById[item.questionId] || item.snapshot) : null;
  }

  function currentResponse() {
    var item = currentItem();
    if (!item || !state.currentAttempt) return null;
    return state.responseMap[responseId(state.currentAttempt.id, item.questionId)] || null;
  }

  function responseIsBlank(card, response) {
    if (!response) return true;
    if (card.type === 'order' && !response.touched) return true;
    return E.isBlankAnswer(card, response.currentAnswer);
  }

  function countsTowardDaily(response) {
    return !!(response && (response.seenAt || !response.blank));
  }

  async function ensureResponse(item) {
    var id = responseId(state.currentAttempt.id, item.questionId);
    var response = state.responseMap[id];
    if (response) return response;
    response = {
      id: id,
      attemptId: state.currentAttempt.id,
      questionId: item.questionId,
      sourceId: item.sourceId,
      section: item.snapshot.section,
      difficulty: item.snapshot.difficulty,
      type: item.snapshot.type,
      currentAnswer: item.snapshot.type === 'order' ? item.itemOrder.slice() : item.snapshot.type === 'match' ? {} : '',
      confidence: '',
      stage: 'answering',
      trials: [],
      timeMs: 0,
      flagged: false,
      scratch: '',
      touched: false,
      blank: true,
      completed: false,
      outcomeRecorded: false,
      seenAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    state.responseMap[id] = response;
    await DB.put('responses', response);
    var cardState = await DB.get('cardState', item.questionId) || { id: item.questionId, questionId: item.questionId, timesSeen: 0, favorite: false };
    cardState.timesSeen += 1;
    cardState.lastSeenAt = new Date().toISOString();
    cardState.updatedAt = cardState.lastSeenAt;
    await DB.put('cardState', cardState);
    return response;
  }

  async function loadAttempt(attemptId) {
    var attempt = await DB.get('attempts', attemptId);
    if (!attempt) return null;
    var responses = await DB.all('responses');
    state.responseMap = {};
    responses.filter(function (response) { return response.attemptId === attemptId; }).forEach(function (response) {
      state.responseMap[response.id] = response;
    });
    state.currentAttempt = attempt;
    return attempt;
  }

  async function flushTimer() {
    if (!state.timer || !state.timer.running) return;
    var elapsed = Math.max(0, performance.now() - state.timer.startedAt);
    state.timer.running = false;
    var response = state.responseMap[state.timer.responseId];
    if (response) {
      response.timeMs = (response.timeMs || 0) + elapsed;
      response.updatedAt = new Date().toISOString();
      await DB.put('responses', response);
    }
  }

  function startTimer(response) {
    state.timer = { responseId: response.id, startedAt: performance.now(), running: !document.hidden };
  }

  async function checkpointTimer() {
    if (timerCheckpointing || !state.timer || !state.timer.running || document.hidden) return;
    timerCheckpointing = true;
    var responseIdBeforeFlush = state.timer.responseId;
    try {
      await flushTimer();
      var response = state.responseMap[responseIdBeforeFlush];
      if (response && state.route && state.route.name === 'session' && currentResponse() && currentResponse().id === responseIdBeforeFlush && !document.hidden && (!state.timer || !state.timer.running)) {
        startTimer(response);
      }
    } finally {
      timerCheckpointing = false;
    }
  }

  function persistSessionOnExit() {
    if (state.route && state.route.name === 'session' && currentResponse()) {
      saveCurrentDraft().catch(function (error) { console.error(error); });
    }
    flushTimer().catch(function (error) { console.error(error); });
  }

  async function setQuestionIndex(index) {
    if (!state.currentAttempt) return;
    await saveCurrentDraft();
    await flushTimer();
    state.currentAttempt.currentIndex = Math.max(0, Math.min(state.currentAttempt.items.length - 1, index));
    state.currentAttempt.updatedAt = new Date().toISOString();
    await DB.put('attempts', state.currentAttempt);
    await renderSession(state.currentAttempt.id);
    document.getElementById('main-content').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: state.settings.reducedMotion ? 'auto' : 'smooth' });
  }

  async function render() {
    var token = ++state.routeToken;
    app.setAttribute('aria-busy', 'true');
    var route = routeInfo();
    if (route.name !== 'builder') { clearTimeout(saveTimers.builder); saveTimers.builder = null; }
    if (route.name !== 'explorer') { clearTimeout(saveTimers.explorer); saveTimers.explorer = null; }
    if (route.name !== 'interview') { clearTimeout(saveTimers.interviewForm); saveTimers.interviewForm = null; }
    if (state.interview) {
      stopInterviewClock();
      clearTimeout(saveTimers.interview);
      await saveInterview();
      if (route.name !== 'interview-session') state.interview = null;
    }
    if (route.name !== 'session' && state.currentAttempt && document.getElementById('question-form')) {
      await saveCurrentDraft();
    }
    state.route = route;
    setActiveNav(route.name);
    if (route.name !== 'session') {
      await flushTimer();
      state.timer = null;
      state.currentAttempt = null;
      state.responseMap = {};
    }
    try {
      if (route.name === 'dashboard') await renderDashboard();
      else if (route.name === 'builder') await renderBuilder();
      else if (route.name === 'session') await renderSession(route.params.get('id'));
      else if (route.name === 'result') await renderResult(route.params.get('id'));
      else if (route.name === 'review') await renderReview();
      else if (route.name === 'history') await renderHistory();
      else if (route.name === 'analytics') await renderAnalytics();
      else if (route.name === 'explorer') await renderExplorer();
      else if (route.name === 'interview') await renderInterview();
      else if (route.name === 'interview-session') await renderInterviewSession();
      else if (route.name === 'settings') await renderSettings();
      else navigate('dashboard');
      if (token !== state.routeToken) {
        setTimeout(function () { if (token !== state.routeToken) render(); }, 0);
        return;
      }
      app.setAttribute('aria-busy', 'false');
      var heading = app.querySelector('h1');
      document.title = (heading ? heading.textContent + ' · ' : '') + 'DevInterview';
      if (!document.querySelector('dialog[open]')) {
        document.getElementById('main-content').focus({ preventScroll: true });
      }
      if (heading) announce(heading.textContent);
    } catch (error) {
      if (token !== state.routeToken) {
        setTimeout(function () { if (token !== state.routeToken) render(); }, 0);
        return;
      }
      console.error(error);
      app.innerHTML = pageHeader('BEKLENMEYEN HATA', 'Bu ekran hazırlanamadı', 'Yerel verilerin korunuyor. Ana panele dönüp yeniden deneyebilirsin.') +
        '<div class="card pad-lg"><p>' + E.escapeHtml(error.message || error) + '</p><a class="button primary" href="#/dashboard">Ana panele dön</a></div>';
      app.setAttribute('aria-busy', 'false');
      document.title = 'Bu ekran hazırlanamadı · DevInterview';
      document.getElementById('main-content').focus({ preventScroll: true });
      announce('Bu ekran hazırlanamadı.');
    }
  }

  async function init() {
    await DB.init();
    storageIndicator.textContent = DB.mode() === 'indexeddb' ? 'IndexedDB ile otomatik kayıt etkin' : 'Yedek yerel kayıt etkin';
    state.bank = E.getBank();
    state.validation = E.validateBank(state.bank);
    state.bank.forEach(function (card) { state.bankById[card.id] = card; });
    state.interviewBank = E.buildInterviewBank(state.bank);
    state.interviewBank.forEach(function (item) { state.interviewById[item.sourceId] = item; });
    if (!state.validation.valid) {
      app.innerHTML = pageHeader('Soru bankası', 'Bankada doğrulama sorunu var', 'Uygulama hatalı cevap anahtarıyla başlamadı.') +
        '<div class="card pad"><ul>' + state.validation.errors.slice(0, 30).map(function (error) { return '<li>' + E.escapeHtml(error) + '</li>'; }).join('') + '</ul></div>';
      app.setAttribute('aria-busy', 'false');
      storageIndicator.textContent = 'Soru bankası doğrulanamadı';
      return;
    }
    await removeUnseenPlaceholders();
    var savedSettings = await DB.get('settings', 'app');
    state.settings = Object.assign({}, DEFAULT_SETTINGS, savedSettings || {});
    await saveSettings();
    bindGlobalEvents();
    if (!location.hash) location.hash = '#/dashboard';
    await render();
    if (!state.settings.onboardingComplete) openOnboarding();
  }

  function computeStreak(dailyRecords) {
    var map = {};
    dailyRecords.forEach(function (record) { map[record.id] = record; });
    var cursor = new Date();
    var todayKey = E.dateKey(cursor);
    var today = map[todayKey];
    if (!today || (today.uniqueCards || []).length < state.settings.dailyGoal) cursor.setDate(cursor.getDate() - 1);
    var streak = 0;
    while (true) {
      var key = E.dateKey(cursor);
      var record = map[key];
      if (!record || (record.uniqueCards || []).length < state.settings.dailyGoal) break;
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  async function renderDashboard() {
    var attempts = await DB.all('attempts');
    var progressMap = await recordsMap('progress');
    var cardStateMap = await recordsMap('cardState');
    var dailyRecords = await DB.all('daily');
    var interviewSummary = interviewStats(await recordsMap('interview'), progressMap);
    var now = Date.now();
    var due = Object.keys(cardStateMap).filter(function (id) {
      var card = state.bankById[id];
      var sourceProgress = card ? progressMap[card.sourceId] || {} : {};
      return cardStateMap[id].dueAt && new Date(cardStateMap[id].dueAt).getTime() <= now && !sourceProgress.excluded;
    });
    var active = attempts.filter(function (attempt) { return attempt.status === 'active'; }).sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
    var completed = attempts.filter(function (attempt) { return attempt.status === 'completed'; }).sort(function (a, b) { return String(b.completedAt).localeCompare(String(a.completedAt)); });
    var todayRecord = dailyRecords.find(function (record) { return record.id === E.dateKey(); }) || { uniqueCards: [] };
    var dailyCount = (todayRecord.uniqueCards || []).length;
    var streak = computeStreak(dailyRecords);
    var allSources = {};
    state.bank.forEach(function (card) { allSources[card.sourceId] = card.section; });
    var sections = ['Java', 'OOP', 'Algoritma'];
    var mastery = {};
    sections.forEach(function (section) {
      var ids = Object.keys(allSources).filter(function (id) { return allSources[id] === section; });
      var mastered = ids.filter(function (id) { return progressMap[id] && progressMap[id].mastered; }).length;
      mastery[section] = { mastered: mastered, total: ids.length, percent: ids.length ? Math.round(mastered / ids.length * 100) : 0 };
    });
    var lastBackup = state.settings.lastBackupAt ? new Date(state.settings.lastBackupAt).getTime() : 0;
    var backupDue = completed.length >= 5 && Date.now() - lastBackup > 7 * 86400000;

    var activeHtml = active.length ? active.slice(0, 4).map(function (attempt) {
      return '<div class="list-item"><div class="list-item-main"><strong>' + E.escapeHtml(attempt.title) + '</strong>' +
        '<small>' + E.escapeHtml(attempt.mode === 'practice' ? 'Pratik' : 'Sınav') + ' · ' + attempt.items.length + ' soru · ' + E.formatDate(attempt.updatedAt, true) + '</small></div>' +
        '<div class="list-item-actions"><span class="badge primary">' + (attempt.currentIndex + 1) + '/' + attempt.items.length + '</span>' +
        '<a class="button small ghost" href="#/session?id=' + encodeURIComponent(attempt.id) + '">Devam et</a></div></div>';
    }).join('') : emptyState('▷', 'Yarım oturum yok', 'Başladığın testler burada kaldığın yerle görünür.', '<a class="button small soft" href="#/builder">Yeni test oluştur</a>');

    var recentHtml = completed.length ? completed.slice(0, 5).map(function (attempt) {
      var score = attempt.summary ? attempt.summary.firstPercent : 0;
      return '<div class="list-item"><div class="list-item-main"><strong>' + E.escapeHtml(attempt.title) + '</strong>' +
        '<small>' + E.formatDate(attempt.completedAt, true) + ' · ' + attempt.items.length + ' soru</small></div>' +
        '<div class="list-item-actions"><span class="badge ' + (score >= 70 ? 'success' : score >= 45 ? 'warning' : 'danger') + '">%' + score + '</span>' +
        '<a class="button small ghost" href="#/result?id=' + encodeURIComponent(attempt.id) + '">İncele</a></div></div>';
    }).join('') : '<p class="muted">Henüz tamamlanmış bir oturum yok.</p>';

    app.innerHTML = storageWarning() + (backupDue ? '<div class="storage-warning" style="margin-top:.75rem"><strong>Yedek zamanı:</strong> Son çalışmalarını korumak için JSON yedeği al. <button class="button small warning" data-action="export-json">Yedekle</button></div>' : '') +
      '<section class="hero-grid" style="margin-top:1rem">' +
        '<div class="hero-card"><span class="eyebrow">BUGÜNÜN ODAĞI</span><h1>Tekrar kuyruğunu temizle, sonra yeni kavramlara geç.</h1>' +
        '<p>Her cevap cihazında otomatik saklanır. İpucu kullanımı, eminlik ve aktif süre tekrar planına katılır.</p>' +
        '<div class="hero-actions"><button class="button secondary" data-action="start-due" ' + (due.length ? '' : 'disabled') + '>' + due.length + ' tekrarı başlat</button>' +
        '<a class="button primary" href="#/builder">Yeni test oluştur</a><a class="button ghost" href="#/explorer">Soru gezgini</a></div></div>' +
        '<div class="card due-card"><div><span class="eyebrow">GÜNLÜK HEDEF</span><div class="due-number">' + Math.min(dailyCount, state.settings.dailyGoal) + '<small style="font-size:1rem;color:var(--text-faint)">/' + state.settings.dailyGoal + '</small></div>' +
        '<p class="muted">Bugün benzersiz soru</p>' + progressHtml(dailyCount / state.settings.dailyGoal * 100, 'Günlük hedef ilerlemesi', 'success') + '</div>' +
        '<div class="badge-row"><span class="badge primary">' + streak + ' gün seri</span><span class="badge warning">' + due.length + ' tekrar bekliyor</span></div></div>' +
      '</section>' +
      '<section class="stats-grid">' +
        '<div class="card stat-card"><span class="stat-label">Tamamlanan oturum</span><div class="stat-value">' + completed.length + '</div><span class="stat-meta">Tüm zamanlar</span></div>' +
        '<div class="card stat-card"><span class="stat-label">Öğrenilen kaynak</span><div class="stat-value">' + Object.keys(progressMap).filter(function (id) { return progressMap[id].mastered; }).length + '</div><span class="stat-meta">135 kaynak konudan</span></div>' +
        '<div class="card stat-card"><span class="stat-label">Soru bankası</span><div class="stat-value">' + state.bank.length + '</div><span class="stat-meta">Atomik kart</span></div>' +
        '<div class="card stat-card"><span class="stat-label">Aktif oturum</span><div class="stat-value">' + active.length + '</div><span class="stat-meta">Kaldığın yer korunuyor</span></div>' +
      '</section>' +
      '<section class="content-grid">' +
        '<div class="stack"><div class="card pad"><div class="card-head"><div><span class="eyebrow">USTALIK</span><h2>Bölüm ilerlemesi</h2></div><a href="#/analytics" class="button small ghost">Tüm analiz</a></div>' +
        '<div class="section-grid">' + sections.map(function (section) { var item = mastery[section]; return '<div class="section-tile"><strong>' + section + '</strong>' + progressHtml(item.percent, section + ' ustalığı') + '<p class="tiny muted" style="margin:.55rem 0 0">' + item.mastered + '/' + item.total + ' kaynak · %' + item.percent + '</p></div>'; }).join('') + '</div></div>' +
        '<div class="card pad"><div class="card-head"><div><span class="eyebrow">DEVAM ET</span><h2>Yarım oturumlar</h2></div><a href="#/history" class="button small ghost">Tümünü gör</a></div><div class="list">' + activeHtml + '</div></div></div>' +
        '<aside class="stack"><div class="card pad"><span class="eyebrow">MÜLAKAT MODU</span><h2>Anlatarak çalış</h2><p class="muted tiny">Soruyu sesli ya da yazılı açıkla, örnek cevapla karşılaştır ve kendini puanla.</p>' +
          '<div class="badge-row" style="margin-bottom:.8rem"><span class="badge warning">' + interviewSummary.due + ' anlatım tekrarı</span><span class="badge">' + interviewSummary.rated + '/' + interviewSummary.total + ' soru anlatıldı</span></div>' +
          '<div class="page-actions" style="justify-content:flex-start">' + (interviewSummary.due ? '<button class="button small secondary" data-action="start-interview-due">Tekrarları anlat</button>' : '') + '<a class="button small soft" href="#/interview">Mülakat başlat</a></div></div>' +
        '<div class="card pad"><span class="eyebrow">SON ÇALIŞMALAR</span><h2>Geçmiş</h2><div class="list">' + recentHtml + '</div></div>' +
        '<div class="card pad"><span class="eyebrow">YEREL VE ÖZEL</span><h3>Verin cihazından çıkmaz</h3><p class="muted tiny">Bu uygulama hiçbir ağ isteği göndermez. Klasörü taşımadan önce JSON yedeği al.</p><a class="button small ghost" href="#/settings">Yedekleme ayarları</a></div></aside>' +
      '</section>';
  }

  function builderFormDefaults() {
    return {
      mode: 'practice',
      path: 'mixed',
      sections: ['Java', 'OOP', 'Algoritma'],
      difficulties: ['Kolay', 'Orta', 'Zorlayıcı'],
      types: Object.keys(E.TYPE_LABELS),
      topic: 'all',
      status: 'all',
      size: '20',
      customSize: 20
    };
  }

  async function renderBuilder() {
    var progressMap = await recordsMap('progress');
    var cardStateMap = await recordsMap('cardState');
    var defaults = state.builderDefaults || builderFormDefaults();
    state.builderDefaults = defaults;
    var topics = Array.from(new Set(state.bank.map(function (card) { return card.topic; }))).sort(function (a, b) { return a.localeCompare(b, 'tr'); });
    var filtered = E.filterBank(state.bank, defaults, progressMap, cardStateMap);
    var sizeValue = defaults.size === 'all' ? filtered.length : defaults.size === 'custom' ? Number(defaults.customSize) : Number(defaults.size);
    var expected = Math.min(filtered.length, Math.max(1, sizeValue));

    function chips(values, selected, name, labels) {
      var groupLabels = { sections: 'Bölümler', difficulties: 'Zorluklar', types: 'Soru türleri' };
      return '<div class="check-grid" role="group" aria-label="' + groupLabels[name] + '">' + values.map(function (value) {
        return '<label class="choice-chip"><input type="checkbox" name="' + name + '" value="' + E.escapeHtml(value) + '" ' + (selected.indexOf(value) !== -1 ? 'checked' : '') + '><span>' + E.escapeHtml(labels && labels[value] || value) + '</span></label>';
      }).join('') + '</div>';
    }

    app.innerHTML = pageHeader('TEST OLUŞTURUCU', 'Bugün neyi çalışmak istiyorsun?', 'Bölüm, zorluk, soru türü ve geçmiş durumuna göre kendi oturumunu hazırla.', '<a class="button ghost" href="#/dashboard">Panele dön</a>') +
      '<form id="builder-form" class="builder-layout">' +
        '<div class="card">' +
          '<section class="form-section"><span class="eyebrow">1 · MOD</span><h2>Geri bildirim zamanı</h2><div class="segmented" role="radiogroup" aria-label="Geri bildirim zamanı">' +
            '<label><input type="radio" name="mode" value="practice" ' + (defaults.mode === 'practice' ? 'checked' : '') + '><span>Pratik</span></label>' +
            '<label><input type="radio" name="mode" value="exam" ' + (defaults.mode === 'exam' ? 'checked' : '') + '><span>Sınav</span></label></div>' +
            '<p class="tiny muted" style="margin:.65rem 0 0">Pratikte ipucu ve çözüm soru bazında; sınavda tüm geri bildirim finalde gösterilir.</p></section>' +
          '<section class="form-section"><span class="eyebrow">2 · SIRA</span><h2>Çalışma akışı</h2><div class="segmented" role="radiogroup" aria-label="Çalışma akışı">' +
            '<label><input type="radio" name="path" value="mixed" ' + (defaults.path === 'mixed' ? 'checked' : '') + '><span>Karışık</span></label>' +
            '<label><input type="radio" name="path" value="learning" ' + (defaults.path === 'learning' ? 'checked' : '') + '><span>Kaynak sırası</span></label></div></section>' +
          '<section class="form-section"><span class="eyebrow">3 · KAPSAM</span><h2>Bölümler</h2>' + chips(['Java', 'OOP', 'Algoritma'], defaults.sections, 'sections') + '</section>' +
          '<section class="form-section"><h2>Zorluk</h2>' + chips(['Kolay', 'Orta', 'Zorlayıcı'], defaults.difficulties, 'difficulties') + '</section>' +
          '<section class="form-section"><h2>Soru türleri</h2>' + chips(Object.keys(E.TYPE_LABELS), defaults.types, 'types', E.TYPE_LABELS) + '</section>' +
          '<section class="form-section"><div class="check-grid"><label class="field"><span>Alt konu</span><select name="topic"><option value="all">Tüm konular</option>' + topics.map(function (topic) { return '<option value="' + E.escapeHtml(topic) + '" ' + (defaults.topic === topic ? 'selected' : '') + '>' + E.escapeHtml(topic) + '</option>'; }).join('') + '</select></label>' +
          '<label class="field"><span>Geçmiş durumu</span><select name="status">' + [
            ['all', 'Tüm uygun sorular'], ['new', 'Henüz görülmeyen'], ['wrong', 'Yanlış / boş'], ['due', 'Tekrar zamanı gelen'], ['favorite', 'Favoriler'], ['mastered', 'Öğrenilen'], ['excluded', 'Hariç tutulan']
          ].map(function (option) { return '<option value="' + option[0] + '" ' + (defaults.status === option[0] ? 'selected' : '') + '>' + option[1] + '</option>'; }).join('') + '</select></label></div></section>' +
          '<section class="form-section"><span class="eyebrow">4 · BOYUT</span><h2>Kaç ekran sorusu?</h2><div class="segmented" role="radiogroup" aria-label="Test boyutu">' + ['10', '20', '40', 'all', 'custom'].map(function (value) {
            var label = value === 'all' ? 'Tümü' : value === 'custom' ? 'Özel' : value;
            return '<label><input type="radio" name="size" value="' + value + '" ' + (defaults.size === value ? 'checked' : '') + '><span>' + label + '</span></label>';
          }).join('') + '</div><label class="field" id="custom-size-field" style="margin-top:.8rem;' + (defaults.size === 'custom' ? '' : 'display:none') + '"><span>Özel soru sayısı</span><input type="number" name="customSize" min="1" max="259" value="' + defaults.customSize + '"></label></section>' +
        '</div>' +
        '<aside class="card pad summary-panel"><span class="eyebrow">OTURUM ÖZETİ</span><h2>' + (defaults.mode === 'practice' ? 'Pratik oturumu' : 'Sınav denemesi') + '</h2>' +
          '<div class="summary-number">' + expected + '</div><p class="muted">ekran sorusu</p><div class="summary-list">' +
          '<div><span>Uygun havuz</span><strong>' + filtered.length + '</strong></div><div><span>Kaynak çeşitliliği</span><strong>Öncelikli</strong></div><div><span>Geri sayım</span><strong>Yok</strong></div><div><span>Kayıt</span><strong>Otomatik</strong></div></div>' +
          '<button class="button primary full" type="submit" ' + (filtered.length ? '' : 'disabled') + '>Oturumu başlat</button><p class="tiny muted" style="margin:.75rem 0 0">Kısa testlerde aynı kaynak kimliği havuz izin verdiği sürece tekrarlanmaz.</p></aside>' +
      '</form>';
  }

  function readBuilderForm(form) {
    var data = new FormData(form);
    return {
      mode: data.get('mode') || 'practice',
      path: data.get('path') || 'mixed',
      sections: data.getAll('sections'),
      difficulties: data.getAll('difficulties'),
      types: data.getAll('types'),
      topic: data.get('topic') || 'all',
      status: data.get('status') || 'all',
      size: data.get('size') || '20',
      customSize: Math.max(1, Math.min(259, Number(data.get('customSize')) || 20))
    };
  }

  async function createAttemptFromCards(cards, options) {
    if (!cards.length) return toast('Seçtiğin filtrelere uygun soru bulunamadı.', 'warning');
    await flushTimer();
    var seed = E.uuid();
    var progressMap = await recordsMap('progress');
    var cardStateMap = await recordsMap('cardState');
    var selected = options.preserveOrder ? cards.slice() : E.selectCards(cards, options.count, options.path, seed, progressMap, cardStateMap);
    var attempt = {
      id: E.uuid(),
      title: options.title || (options.mode === 'practice' ? 'Kişisel pratik' : 'Teknik mülakat denemesi'),
      mode: options.mode,
      path: options.path,
      seed: seed,
      filters: options.filters || {},
      status: 'active',
      currentIndex: 0,
      items: selected.map(function (card, index) { return E.makeAttemptItem(card, seed, index); }),
      scratch: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bankVersion: window.SOURCE_BANK_META.version,
      sourceSha256: window.SOURCE_BANK_META.sourceSha256
    };
    await DB.put('attempts', attempt);
    state.currentAttempt = attempt;
    state.responseMap = {};
    navigate('session?id=' + encodeURIComponent(attempt.id));
  }

  async function createFromBuilder(form) {
    var filters = readBuilderForm(form);
    state.builderDefaults = filters;
    var progressMap = await recordsMap('progress');
    var cardStateMap = await recordsMap('cardState');
    var candidates = E.filterBank(state.bank, filters, progressMap, cardStateMap);
    var count = filters.size === 'all' ? candidates.length : filters.size === 'custom' ? filters.customSize : Number(filters.size);
    await createAttemptFromCards(candidates, {
      count: Math.min(count, candidates.length),
      mode: filters.mode,
      path: filters.path,
      filters: filters,
      title: filters.mode === 'practice' ? 'Kişisel pratik' : 'Teknik mülakat denemesi'
    });
  }

  function orderedOptions(card, item) {
    var map = {};
    (card.options || []).forEach(function (option) { map[option.id] = option; });
    var ids = item.optionOrder && item.optionOrder.length ? item.optionOrder : Object.keys(map);
    return ids.map(function (id) { return map[id]; }).filter(Boolean);
  }

  function renderCode(code) {
    if (!code) return '';
    return '<div class="code-wrap"><div class="code-toolbar" role="group" aria-label="Kod görünümü araçları"><button class="code-button" type="button" data-action="code-smaller" title="Kodu küçült" aria-label="Kod yazısını küçült">A−</button><button class="code-button" type="button" data-action="code-larger" title="Kodu büyüt" aria-label="Kod yazısını büyüt">A+</button><button class="code-button" type="button" data-action="copy-code" title="Kodu kopyala">Kopyala</button></div>' +
      '<pre class="code-block" tabindex="0" aria-label="Java kodu"><code>' + E.highlightJava(code) + '</code></pre></div>';
  }

  function renderAnswerInput(card, item, response, locked) {
    var answer = response.currentAnswer;
    if (card.type === 'single' || card.type === 'multi') {
      var selected = card.type === 'multi' ? (Array.isArray(answer) ? answer : []) : [String(answer || '')];
      return '<div class="options" role="' + (card.type === 'multi' ? 'group' : 'radiogroup') + '" aria-label="' + (card.type === 'multi' ? 'Bir veya daha fazla cevap seç' : 'Bir cevap seç') + '">' + orderedOptions(card, item).map(function (option, index) {
        var inputType = card.type === 'multi' ? 'checkbox' : 'radio';
        var checked = selected.indexOf(String(option.id)) !== -1 || selected.indexOf(option.id) !== -1;
        var trial = response.trials && response.trials.length ? response.trials[response.trials.length - 1] : null;
        var optionClass = '';
        if (response.completed && card.type === 'single') {
          if (String(option.id) === String(card.answer)) optionClass = ' correct';
          else if (trial && String(trial.answer) === String(option.id)) optionClass = ' incorrect';
        }
        var optionStatus = optionClass === ' correct' ? '<span class="sr-only"> — doğru seçenek</span>' : optionClass === ' incorrect' ? '<span class="sr-only"> — verdiğin yanlış cevap</span>' : '';
        return '<label class="option' + optionClass + '"><input type="' + inputType + '" name="answer" value="' + E.escapeHtml(option.id) + '" aria-keyshortcuts="' + (index + 1) + '" ' + (checked ? 'checked' : '') + ' ' + (locked ? 'disabled' : '') + '>' +
          '<span class="option-key" aria-hidden="true">' + (index + 1) + '</span><span class="option-text">' + E.escapeHtml(option.text) + optionStatus + '</span></label>';
      }).join('') + '</div>';
    }
    if (card.type === 'boolean') {
      var actual = answer === true || answer === 'true' ? 'true' : answer === false || answer === 'false' ? 'false' : '';
      return '<div class="options" role="radiogroup" aria-label="Doğru veya yanlış">' + [
        { id: 'true', text: 'Doğru' }, { id: 'false', text: 'Yanlış' }
      ].map(function (option, index) {
        return '<label class="option"><input type="radio" name="answer" value="' + option.id + '" aria-keyshortcuts="' + (index + 1) + '" ' + (actual === option.id ? 'checked' : '') + ' ' + (locked ? 'disabled' : '') + '><span class="option-key" aria-hidden="true">' + (index + 1) + '</span><span class="option-text">' + option.text + '</span></label>';
      }).join('') + '</div>';
    }
    if (card.type === 'fill') {
      return '<label class="field"><span>Cevabın</span><input type="text" name="answerText" autocomplete="off" value="' + E.escapeHtml(answer || '') + '" ' + (locked ? 'disabled' : '') + ' placeholder="Kısa ve kesin cevabı yaz"></label>';
    }
    if (card.type === 'output') {
      return '<label class="field"><span>Program çıktısı</span><textarea name="answerText" rows="4" spellcheck="false" ' + (locked ? 'disabled' : '') + ' placeholder="Her satırı ayrı yaz">' + E.escapeHtml(answer || '') + '</textarea></label>';
    }
    if (card.type === 'order') {
      var order = Array.isArray(answer) && answer.length ? answer : item.itemOrder;
      var itemMap = {};
      (card.items || []).forEach(function (entry) { itemMap[entry.id] = entry; });
      return '<div class="ordering-list" role="list" aria-label="Sıralanacak adımlar">' + order.map(function (id, index) {
        var entry = itemMap[id] || { text: id };
        return '<div class="ordering-item" role="listitem" data-order-id="' + E.escapeHtml(id) + '"><span class="ordering-index">' + (index + 1) + '</span><span>' + E.escapeHtml(entry.text) + '</span><span class="ordering-actions">' +
          '<button type="button" data-action="move-order" data-dir="up" aria-label="' + E.escapeHtml(entry.text) + ' adımını yukarı taşı" ' + (locked || index === 0 ? 'disabled' : '') + '>↑</button>' +
          '<button type="button" data-action="move-order" data-dir="down" aria-label="' + E.escapeHtml(entry.text) + ' adımını aşağı taşı" ' + (locked || index === order.length - 1 ? 'disabled' : '') + '>↓</button></span></div>';
      }).join('') + '</div>';
    }
    if (card.type === 'match') {
      var mapping = answer && typeof answer === 'object' && !Array.isArray(answer) ? answer : {};
      var rightMap = {};
      ((card.pairs && card.pairs.right) || []).forEach(function (entry) { rightMap[entry.id] = entry; });
      var rightOrder = item.rightOrder && item.rightOrder.length ? item.rightOrder : Object.keys(rightMap);
      return '<div class="matching-list" role="group" aria-label="Eşleştirilecek öğeler">' + ((card.pairs && card.pairs.left) || []).map(function (left) {
        return '<label class="matching-row"><span class="matching-left">' + E.escapeHtml(left.text) + '</span><span aria-hidden="true">→</span><select name="match-' + E.escapeHtml(left.id) + '" ' + (locked ? 'disabled' : '') + ' aria-label="' + E.escapeHtml(left.text) + ' için eşleşme"><option value="">Seç…</option>' +
          rightOrder.map(function (rightId) { var right = rightMap[rightId]; return '<option value="' + E.escapeHtml(rightId) + '" ' + (mapping[left.id] === rightId ? 'selected' : '') + '>' + E.escapeHtml(right ? right.text : rightId) + '</option>'; }).join('') + '</select></label>';
      }).join('') + '</div>';
    }
    return '<p class="muted">Bu soru türü gösterilemiyor.</p>';
  }

  function renderConfidence(response, locked) {
    return '<div class="confidence" role="radiogroup" aria-labelledby="confidence-label"><span id="confidence-label">Eminlik (isteğe bağlı)</span>' + [
      ['sure', 'Eminim'], ['uncertain', 'Kararsızım'], ['guess', 'Tahmin ettim']
    ].map(function (entry) {
      return '<label><input type="radio" name="confidence" value="' + entry[0] + '" ' + (response.confidence === entry[0] ? 'checked' : '') + ' ' + (locked ? 'disabled' : '') + '><span>' + entry[1] + '</span></label>';
    }).join('') + '</div>';
  }

  function renderFeedback(card, response) {
    if (response.stage === 'hint' && !response.completed) {
      return '<div class="feedback hint" id="answer-feedback" tabindex="-1"><h3>Küçük ipucu</h3><p>' + E.escapeHtml(card.hint) + '</p><p class="tiny">Cevabını değiştirip bir kez daha dene.</p></div>';
    }
    if (!response.completed) return '';
    var score = typeof response.finalScore === 'number' ? response.finalScore : response.firstScore;
    var correct = score === 1;
    var className = correct ? 'correct' : 'incorrect';
    var heading = correct ? (response.supported ? 'Destekli doğru' : 'Doğru cevap') : score > 0 ? 'Kısmen doğru' : 'Henüz değil';
    var optionDetails = Object.keys(card.optionExplanations || {}).map(function (id) {
      var option = (card.options || []).find(function (entry) { return String(entry.id) === String(id); });
      return '<div class="option-explanation"><strong>' + E.escapeHtml(option ? option.text : id) + '</strong><br>' + E.escapeHtml(card.optionExplanations[id]) + '</div>';
    }).join('');
    return '<div class="feedback ' + className + '" id="answer-feedback" tabindex="-1"><h3>' + heading + (score > 0 && score < 1 ? ' · %' + Math.round(score * 100) : '') + '</h3><p>' + E.escapeHtml(card.explanationShort) + '</p>' +
      '<div class="answer-comparison"><p><strong>Verdiğin cevap</strong><br><span style="white-space:pre-wrap">' + E.escapeHtml(E.formatAnswer(card, response.currentAnswer)) + '</span></p>' +
      '<p><strong>Doğru cevap</strong><br><span style="white-space:pre-wrap">' + E.escapeHtml(E.formatAnswer(card, card.answer)) + '</span></p></div>' +
      '<details class="explanation-details"><summary>Ayrıntılı açıklama</summary><p>' + E.escapeHtml(card.explanationLong) + '</p>' + (optionDetails ? '<div class="option-explanations">' + optionDetails + '</div>' : '') + '</details>' +
      '<details class="explanation-details source-question"><summary>Kaynak soruyu gör · ' + E.escapeHtml(card.sourceId) + '</summary><pre>' + E.escapeHtml(card.originalPrompt) + '</pre></details></div>';
  }

  function paletteHtml(attempt, responseMap) {
    return '<div class="palette" role="group" aria-label="Soru paleti">' + attempt.items.map(function (item, index) {
      var response = responseMap[responseId(attempt.id, item.questionId)] || {};
      var classes = [];
      if (index === attempt.currentIndex) classes.push('current');
      if (response.completed) classes.push('completed');
      else if (!responseIsBlank(item.snapshot, response)) classes.push('answered');
      if (response.flagged) classes.push('flagged');
      var states = [];
      if (index === attempt.currentIndex) states.push('mevcut soru');
      if (response.completed) states.push('tamamlandı');
      else if (!responseIsBlank(item.snapshot, response)) states.push('cevaplandı');
      if (response.flagged) states.push('sonra dön işaretli');
      return '<button type="button" class="' + classes.join(' ') + '" data-action="jump-question" data-index="' + index + '" ' + (index === attempt.currentIndex ? 'aria-current="step" ' : '') + 'aria-label="' + (index + 1) + '. soruya git' + (states.length ? ', ' + states.join(', ') : '') + '">' + (index + 1) + '</button>';
    }).join('') + '</div><div class="palette-legend"><span><i class="legend-dot answered" aria-hidden="true"></i>Cevaplı</span><span><i class="legend-dot flagged" aria-hidden="true"></i>İşaretli</span></div>';
  }

  async function renderSession(attemptId) {
    if (state.currentAttempt && document.getElementById('question-form')) await saveCurrentDraft();
    await flushTimer();
    var attempt = state.currentAttempt && state.currentAttempt.id === attemptId ? state.currentAttempt : await loadAttempt(attemptId);
    if (!attempt) {
      app.innerHTML = emptyState('!', 'Oturum bulunamadı', 'Bu kayıt silinmiş veya başka bir yedekte olabilir.', '<a class="button primary" href="#/history">Geçmişe dön</a>');
      return;
    }
    if (attempt.status === 'completed') return navigate('result?id=' + encodeURIComponent(attempt.id));
    var item = currentItem();
    var card = state.bankById[item.questionId] || item.snapshot;
    var response = await ensureResponse(item);
    var cardState = await DB.get('cardState', card.id) || {};
    var note = await DB.get('notes', card.id) || { text: '' };
    var locked = attempt.mode === 'practice' && response.completed;
    var answeredCount = attempt.items.filter(function (entry) {
      var answer = state.responseMap[responseId(attempt.id, entry.questionId)];
      return answer && !responseIsBlank(entry.snapshot, answer);
    }).length;
    var flaggedCount = Object.keys(state.responseMap).filter(function (id) { return state.responseMap[id].flagged; }).length;
    var showMeta = attempt.mode === 'practice';
    var assumptions = (card.assumptions || []).length ? '<div class="question-assumption"><strong>Varsayım:</strong> ' + E.escapeHtml(card.assumptions.join(' · ')) + '</div>' : '';
    var progressValue = (attempt.currentIndex + 1) / attempt.items.length * 100;

    app.innerHTML = '<section class="session-page">' +
      '<div class="session-top"><div class="session-top-main"><a class="button small ghost" href="#/history">Çıkış</a><div class="session-progress"><div class="session-progress-meta"><span>' + E.escapeHtml(attempt.title) + '</span><strong>' + (attempt.currentIndex + 1) + ' / ' + attempt.items.length + '</strong></div>' + progressHtml(progressValue, 'Oturum ilerlemesi') + '</div></div>' +
      '<div class="badge-row"><span class="badge ' + (attempt.mode === 'practice' ? 'primary' : 'warning') + '">' + (attempt.mode === 'practice' ? 'Pratik' : 'Sınav') + '</span><span class="badge">Otomatik kayıt</span></div></div>' +
      '<div class="session-layout"><article class="card question-card"><div class="question-meta"><div class="question-meta-left">' +
        (showMeta ? '<span class="badge primary">' + E.escapeHtml(card.sourceId) + '</span>' + difficultyBadge(card.difficulty) + '<span class="badge">' + E.escapeHtml(card.topic) + '</span>' : '<span class="badge">Soru ' + (attempt.currentIndex + 1) + '</span>') +
        '</div><div class="question-meta-right"><span class="badge">' + E.escapeHtml(typeLabel(card.type)) + '</span></div></div>' +
        '<h1 class="question-title">' + E.escapeHtml(card.prompt) + '</h1>' + assumptions + renderCode(card.code) +
        '<form id="question-form" class="answer-area" data-question-id="' + E.escapeHtml(item.questionId) + '" autocomplete="off">' + renderAnswerInput(card, item, response, locked) + renderConfidence(response, locked) + '</form>' +
        renderFeedback(card, response) +
        '<div class="question-actions"><div class="question-actions-left"><button class="button ghost" type="button" data-action="previous-question" ' + (attempt.currentIndex === 0 ? 'disabled' : '') + '>← Önceki</button>' +
          '<button class="button ' + (response.flagged ? 'warning' : 'ghost') + '" type="button" data-action="toggle-flag" aria-label="' + (response.flagged ? 'İşaretli: sonra dön durumu' : 'Sonra dön olarak işaretle') + '" aria-pressed="' + (response.flagged ? 'true' : 'false') + '" aria-keyshortcuts="F">' + (response.flagged ? 'İşaretli' : 'Sonra dön') + '</button>' +
          '<button class="button ' + (cardState.favorite ? 'soft' : 'ghost') + '" type="button" data-action="toggle-favorite" aria-label="Favori olarak işaretle" aria-pressed="' + (cardState.favorite ? 'true' : 'false') + '" aria-keyshortcuts="V">' + (cardState.favorite ? '★ Favori' : '☆ Favori') + '</button></div>' +
          '<div class="question-actions-right"><button class="button ghost" type="button" data-action="open-issue">Sorun bildir</button>' +
          (locked ? '<button class="button ghost" type="button" data-action="retry-question">Yeni tek soru denemesi</button><button class="button primary" type="button" data-action="next-question">Sonraki →</button>' :
            '<button class="button ghost" type="button" data-action="next-question">Geç</button><button class="button primary" type="button" data-action="submit-answer" aria-keyshortcuts="Enter">' + (attempt.mode === 'practice' ? 'Cevabı gönder' : 'Cevabı kaydet') + '</button>') + '</div></div></article>' +
        '<aside class="session-side"><div class="card pad"><div class="card-head"><div><span class="eyebrow">SORULAR</span><h3>Oturum paleti</h3></div><span class="badge primary">' + answeredCount + '/' + attempt.items.length + '</span></div>' + paletteHtml(attempt, state.responseMap) +
          '<button class="button primary full" style="margin-top:1rem" type="button" data-action="finish-attempt">Oturumu bitir</button><p class="tiny muted" style="margin:.65rem 0 0">' + flaggedCount + ' işaretli soru · Bitirmeden önce özet gösterilir.</p></div>' +
          '<div class="card pad"><div class="note-tabs" role="group" aria-label="Not türü"><button type="button" class="active" data-note-tab="scratch" aria-pressed="true" aria-controls="scratch-panel">Karalama</button><button type="button" data-note-tab="note" aria-pressed="false" aria-controls="note-panel">Kalıcı not</button></div>' +
          '<label class="field note-panel" id="scratch-panel" data-note-panel="scratch"><span class="sr-only">Oturum karalaması</span><textarea id="scratch-input" rows="5" placeholder="Bu oturuma ait geçici not…">' + E.escapeHtml(attempt.scratch || '') + '</textarea></label>' +
          '<label class="field note-panel" id="note-panel" data-note-panel="note" hidden><span class="sr-only">Kalıcı soru notu</span><textarea id="note-input" rows="5" placeholder="Bu soruyla ilgili kalıcı not…">' + E.escapeHtml(note.text || '') + '</textarea></label><p class="tiny muted">Her iki alan da otomatik kaydedilir.</p></div></aside></div></section>';
    startTimer(response);
    var feedback = document.getElementById('answer-feedback');
    if (feedback && response.justUpdated) {
      feedback.focus();
      delete response.justUpdated;
      await DB.put('responses', response);
    }
  }

  function collectCurrentAnswer(card) {
    var form = document.getElementById('question-form');
    if (!form) return '';
    if (card.type === 'single') {
      var radio = form.querySelector('input[name="answer"]:checked');
      return radio ? radio.value : '';
    }
    if (card.type === 'multi') {
      return Array.from(form.querySelectorAll('input[name="answer"]:checked')).map(function (input) { return input.value; });
    }
    if (card.type === 'boolean') {
      var bool = form.querySelector('input[name="answer"]:checked');
      return bool ? bool.value === 'true' : '';
    }
    if (card.type === 'fill' || card.type === 'output') {
      var text = form.querySelector('[name="answerText"]');
      return text ? text.value : '';
    }
    if (card.type === 'order') {
      return Array.from(form.querySelectorAll('[data-order-id]')).map(function (element) { return element.dataset.orderId; });
    }
    if (card.type === 'match') {
      var mapping = {};
      ((card.pairs && card.pairs.left) || []).forEach(function (left) {
        var select = form.querySelector('[name="match-' + CSS.escape(left.id) + '"]');
        if (select && select.value) mapping[left.id] = select.value;
      });
      return mapping;
    }
    return '';
  }

  function collectConfidence() {
    var selected = document.querySelector('#question-form input[name="confidence"]:checked');
    return selected ? selected.value : '';
  }

  async function saveCurrentDraft(markTouched) {
    if (!state.currentAttempt || !currentItem()) return null;
    var form = document.getElementById('question-form');
    if (!form || form.dataset.questionId !== currentItem().questionId) return currentResponse();
    clearTimeout(saveTimers.draft);
    saveTimers.draft = null;
    var card = currentCard();
    var response = await ensureResponse(currentItem());
    if (!(state.currentAttempt.mode === 'practice' && response.completed)) {
      if (markTouched) response.touched = true;
      response.currentAnswer = collectCurrentAnswer(card);
      response.confidence = collectConfidence();
      response.blank = responseIsBlank(card, response);
      response.updatedAt = new Date().toISOString();
      state.responseMap[response.id] = response;
      await DB.put('responses', response);
    }
    return response;
  }

  function scheduleDraftSave(markTouched) {
    var response = currentResponse();
    if (!response) return;
    if (markTouched) response.touched = true;
    var card = currentCard();
    response.currentAnswer = collectCurrentAnswer(card);
    response.confidence = collectConfidence();
    response.blank = responseIsBlank(card, response);
    response.updatedAt = new Date().toISOString();
    state.responseMap[response.id] = response;
    clearTimeout(saveTimers.draft);
    saveTimers.draft = setTimeout(function () {
      saveTimers.draft = null;
      DB.put('responses', response).catch(function (error) { console.error(error); });
    }, 180);
  }

  async function isSlow(card, response) {
    var records = await DB.all('responses');
    var times = records.filter(function (entry) {
      return entry.id !== response.id && entry.section === card.section && entry.difficulty === card.difficulty && entry.completed && entry.timeMs > 0;
    }).map(function (entry) { return entry.timeMs; }).sort(function (a, b) { return a - b; });
    if (times.length < 5) return false;
    var middle = Math.floor(times.length / 2);
    var median = times.length % 2 ? times[middle] : (times[middle - 1] + times[middle]) / 2;
    return response.timeMs > Math.max(90000, median * 2);
  }

  async function updateDaily(questionId, at) {
    var id = E.dateKey(at);
    var record = await DB.get('daily', id) || { id: id, uniqueCards: [], completedAttempts: 0, updatedAt: at || new Date().toISOString() };
    if (record.uniqueCards.indexOf(questionId) === -1) record.uniqueCards.push(questionId);
    record.updatedAt = at || new Date().toISOString();
    await DB.put('daily', record);
  }

  async function recordOutcome(card, response) {
    if (response.outcomeRecorded) return response;
    var kind = response.blank ? 'blank' : response.firstScore === 1 && !response.hintUsed ? 'unaided' : response.finalScore === 1 ? 'supported' : 'wrong';
    var slow = await isSlow(card, response);
    var previous = await DB.get('progress', card.sourceId);
    var next = E.nextProgress(previous, {
      sourceId: card.sourceId,
      kind: kind,
      at: response.completedAt || new Date().toISOString(),
      lowConfidence: response.confidence === 'uncertain' || response.confidence === 'guess',
      slow: slow
    });
    await DB.put('progress', next);
    var previousReview = await DB.get('cardState', card.id) || { id: card.id, questionId: card.id, timesSeen: 0, favorite: false };
    var nextReview = E.nextReviewState(previousReview, {
      questionId: card.id,
      kind: kind,
      at: response.completedAt || new Date().toISOString(),
      lowConfidence: response.confidence === 'uncertain' || response.confidence === 'guess',
      slow: slow
    });
    await DB.put('cardState', nextReview);
    response.outcomeKind = kind;
    response.slow = slow;
    response.outcomeRecorded = true;
    await DB.put('responses', response);
    if (countsTowardDaily(response)) await updateDaily(card.id, response.completedAt);
    return response;
  }

  async function submitCurrentAnswer() {
    var attempt = state.currentAttempt;
    var item = currentItem();
    var card = currentCard();
    var response = await saveCurrentDraft(true);
    await flushTimer();
    if (E.isBlankAnswer(card, response.currentAnswer)) {
      toast('Cevap boş. İstersen "Geç" ile daha sonra dönebilirsin.', 'warning');
      startTimer(response);
      return;
    }

    if (attempt.mode === 'exam') {
      response.saved = true;
      response.blank = false;
      response.updatedAt = new Date().toISOString();
      response.trials = response.trials || [];
      response.trials.push({ answer: E.clone(response.currentAnswer), at: response.updatedAt, phase: 'draft' });
      await DB.put('responses', response);
      toast('Cevap kaydedildi.', 'success');
      if (attempt.currentIndex < attempt.items.length - 1) await setQuestionIndex(attempt.currentIndex + 1);
      else await renderSession(attempt.id);
      return;
    }

    var result = E.grade(card, response.currentAnswer);
    var trial = {
      answer: E.clone(response.currentAnswer),
      score: result.score,
      correct: result.correct,
      hintUsed: response.stage === 'hint',
      confidence: response.confidence,
      at: new Date().toISOString()
    };
    response.trials = response.trials || [];
    response.trials.push(trial);
    if (response.stage === 'hint') {
      response.finalScore = result.score;
      response.supported = result.correct;
      response.completed = true;
      response.completedAt = trial.at;
      response.stage = 'completed';
      response.blank = false;
      await recordOutcome(card, response);
    } else if (result.correct) {
      response.firstScore = result.score;
      response.finalScore = result.score;
      response.supported = false;
      response.completed = true;
      response.completedAt = trial.at;
      response.stage = 'completed';
      response.blank = false;
      await recordOutcome(card, response);
    } else {
      response.firstScore = result.score;
      response.stage = 'hint';
      response.hintUsed = true;
      response.blank = false;
      await DB.put('responses', response);
    }
    response.justUpdated = true;
    state.responseMap[response.id] = response;
    await DB.put('responses', response);
    await renderSession(attempt.id);
    announce(response.completed ? (response.finalScore === 1 ? 'Doğru cevap.' : 'Cevap tamamlandı; açıklama gösterildi.') : 'İlk deneme yanlış. İpucu gösterildi.');
  }

  async function retryCurrentQuestion() {
    var card = currentCard();
    if (!card) return;
    await createAttemptFromCards([card], {
      count: 1,
      mode: 'practice',
      path: 'learning',
      title: card.sourceId + ' · yeni tek soru denemesi',
      preserveOrder: true
    });
  }

  async function finalizeAttempt() {
    var attempt = state.currentAttempt;
    if (!attempt) return;
    await saveCurrentDraft();
    await flushTimer();
    var unanswered = attempt.items.filter(function (item) {
      var response = state.responseMap[responseId(attempt.id, item.questionId)];
      return responseIsBlank(item.snapshot, response);
    }).length;
    var flagged = Object.keys(state.responseMap).filter(function (id) { return state.responseMap[id].flagged; }).length;
    var approved = await confirmAction('Oturumu bitir', unanswered + ' boş ve ' + flagged + ' işaretli soru var. Bitirilen oturumun cevapları sonradan değiştirilemez.', 'Oturumu bitir');
    if (!approved) {
      var current = currentResponse();
      if (current) startTimer(current);
      return;
    }
    for (var index = 0; index < attempt.items.length; index += 1) {
      var item = attempt.items[index];
      var card = state.bankById[item.questionId] || item.snapshot;
      var id = responseId(attempt.id, item.questionId);
      var response = state.responseMap[id];
      // A card that was never opened says nothing about what the user knows, so it stays out of progress and review scheduling.
      if (!response) continue;
      if (attempt.mode === 'exam') {
        var examBlank = responseIsBlank(card, response);
        var result = examBlank ? { score: 0, correct: false, blank: true } : E.grade(card, response.currentAnswer);
        response.firstScore = result.score;
        response.finalScore = result.score;
        response.blank = result.blank;
        response.supported = false;
        response.completed = true;
        response.stage = 'completed';
        response.completedAt = new Date().toISOString();
        response.trials = response.trials || [];
        if (!result.blank) response.trials.push({ answer: E.clone(response.currentAnswer), score: result.score, correct: result.correct, at: response.completedAt, phase: 'final' });
      } else if (!response.completed) {
        var practiceBlank = responseIsBlank(card, response);
        var finalResult = practiceBlank ? { score: 0, correct: false, blank: true } : E.grade(card, response.currentAnswer);
        response.blank = finalResult.blank;
        response.firstScore = typeof response.firstScore === 'number' ? response.firstScore : finalResult.score;
        response.finalScore = finalResult.score;
        response.supported = response.hintUsed && finalResult.correct;
        response.completed = true;
        response.stage = 'completed';
        response.completedAt = new Date().toISOString();
        response.trials = response.trials || [];
        if (!finalResult.blank) response.trials.push({ answer: E.clone(response.currentAnswer), score: finalResult.score, correct: finalResult.correct, at: response.completedAt, phase: 'final' });
      }
      state.responseMap[id] = response;
      await DB.put('responses', response);
      await recordOutcome(card, response);
    }
    attempt.status = 'completed';
    attempt.completedAt = new Date().toISOString();
    attempt.updatedAt = attempt.completedAt;
    attempt.summary = E.summarizeAttempt(attempt, state.responseMap);
    delete attempt.summary.itemResults;
    await DB.put('attempts', attempt);
    var daily = await DB.get('daily', E.dateKey()) || { id: E.dateKey(), uniqueCards: [], completedAttempts: 0 };
    daily.completedAttempts = (daily.completedAttempts || 0) + 1;
    daily.updatedAt = attempt.completedAt;
    await DB.put('daily', daily);
    navigate('result?id=' + encodeURIComponent(attempt.id));
  }

  function resultState(result) {
    if (!result.response.id || result.response.blank) return { label: 'Boş', className: 'blank', symbol: '—' };
    if (result.response.supported && result.response.finalScore === 1) return { label: 'Destekli doğru', className: 'correct', symbol: '✓' };
    if (result.score === 1) return { label: 'Doğru', className: 'correct', symbol: '✓' };
    return { label: result.score > 0 ? 'Kısmen doğru' : 'Yanlış', className: 'incorrect', symbol: '×' };
  }

  function reviewItemHtml(result, index) {
    var card = result.item.snapshot;
    var response = result.response;
    var status = resultState(result);
    var optionDetails = Object.keys(card.optionExplanations || {}).map(function (id) {
      var option = (card.options || []).find(function (entry) { return String(entry.id) === String(id); });
      return '<div class="option-explanation"><strong>' + E.escapeHtml(option ? option.text : id) + '</strong><br>' + E.escapeHtml(card.optionExplanations[id]) + '</div>';
    }).join('');
    return '<details class="card review-item"><summary class="review-summary"><span class="review-state ' + status.className + '" aria-hidden="true">' + status.symbol + '</span><span><strong>' + (index + 1) + '. ' + E.escapeHtml(card.prompt) + '</strong><span class="badge-row" style="margin-top:.35rem"><span class="badge primary">' + E.escapeHtml(card.sourceId) + '</span><span class="badge">' + E.escapeHtml(typeLabel(card.type)) + '</span><span class="badge">Kart v' + E.escapeHtml(card.version || '1.0.0') + '</span></span></span><span class="status-pill ' + (status.className === 'correct' ? 'success' : status.className === 'blank' ? 'warning' : 'danger') + '">' + status.label + '</span></summary>' +
      '<div class="review-body">' + renderCode(card.code) + '<div class="card pad" style="background:var(--surface-soft);margin-bottom:.75rem"><p><strong>Verdiğin cevap</strong><br><span style="white-space:pre-wrap">' + E.escapeHtml(response.blank || !response.id ? 'Boş' : E.formatAnswer(card, response.currentAnswer)) + '</span></p><p><strong>Doğru cevap</strong><br><span style="white-space:pre-wrap">' + E.escapeHtml(E.formatAnswer(card, card.answer)) + '</span></p><p class="tiny muted">Aktif süre: ' + E.formatDuration(response.timeMs) + (response.confidence ? ' · Eminlik: ' + E.escapeHtml(response.confidence) : '') + '</p></div>' +
      '<div class="feedback ' + (status.className === 'correct' ? 'correct' : 'incorrect') + '"><h3>' + E.escapeHtml(card.explanationShort) + '</h3><p>' + E.escapeHtml(card.explanationLong) + '</p>' + (optionDetails ? '<div class="option-explanations">' + optionDetails + '</div>' : '') +
      '<details class="explanation-details"><summary>Kaynak soruyu gör</summary><pre style="white-space:pre-wrap;font-family:inherit">' + E.escapeHtml(card.originalPrompt) + '</pre></details></div></div></details>';
  }

  async function renderResult(attemptId) {
    var attempt = await DB.get('attempts', attemptId);
    if (!attempt) {
      app.innerHTML = emptyState('!', 'Sonuç bulunamadı', 'Bu oturum silinmiş olabilir.', '<a class="button primary" href="#/history">Geçmişe dön</a>');
      return;
    }
    if (attempt.status !== 'completed') {
      navigate('session?id=' + encodeURIComponent(attempt.id));
      return;
    }
    var responses = await DB.all('responses');
    var map = {};
    responses.filter(function (response) { return response.attemptId === attemptId; }).forEach(function (response) { map[response.id] = response; });
    var summary = E.summarizeAttempt(attempt, map);
    function groupedBreakdown(field) {
      var groups = {};
      summary.itemResults.forEach(function (result) {
        var card = result.item.snapshot;
        var label = typeof field === 'function' ? field(card) : card[field];
        if (!groups[label]) groups[label] = { sources: {}, itemCount: 0 };
        if (!groups[label].sources[result.item.sourceId]) groups[label].sources[result.item.sourceId] = [];
        groups[label].sources[result.item.sourceId].push(result.score);
        groups[label].itemCount += 1;
      });
      return Object.keys(groups).map(function (label) {
        var sourceIds = Object.keys(groups[label].sources);
        var total = sourceIds.reduce(function (sum, sourceId) {
          var values = groups[label].sources[sourceId];
          return sum + values.reduce(function (inner, value) { return inner + value; }, 0) / values.length;
        }, 0);
        return { label: label, value: sourceIds.length ? Math.round(total / sourceIds.length * 100) : 0, itemCount: groups[label].itemCount };
      }).sort(function (a, b) { return a.value - b.value || a.label.localeCompare(b.label, 'tr'); });
    }
    function breakdownHtml(items) {
      return items.map(function (data) {
        return '<div class="progress-row"><strong>' + E.escapeHtml(data.label) + '<small class="muted" style="display:block;font-weight:400">' + data.itemCount + ' kart</small></strong>' + progressHtml(data.value, data.label + ' başarısı') + '<span>%' + data.value + '</span></div>';
      }).join('');
    }
    var sectionHtml = breakdownHtml(groupedBreakdown('section'));
    var topicHtml = breakdownHtml(groupedBreakdown('topic'));
    var difficultyHtml = breakdownHtml(groupedBreakdown('difficulty'));
    var typeHtml = breakdownHtml(groupedBreakdown(function (card) { return typeLabel(card.type); }));
    var unaidedFull = summary.itemResults.filter(function (result) { return result.score === 1 && !result.response.supported && !result.response.blank; }).length;
    var weak = {};
    summary.itemResults.forEach(function (result) {
      if (!weak[result.item.sourceId]) weak[result.item.sourceId] = [];
      weak[result.item.sourceId].push(result.score);
    });
    var weakIds = Object.keys(weak).filter(function (id) {
      return weak[id].reduce(function (sum, score) { return sum + score; }, 0) / weak[id].length < 1;
    });
    var recommendedIds = [];
    summary.itemResults.forEach(function (result) {
      var response = result.response;
      if (response.blank || result.score < 1 || response.supported || response.confidence === 'uncertain' || response.confidence === 'guess' || response.slow) {
        if (recommendedIds.indexOf(result.item.questionId) === -1) recommendedIds.push(result.item.questionId);
      }
    });
    var recommendedSources = [];
    summary.itemResults.forEach(function (result) {
      if (recommendedIds.indexOf(result.item.questionId) !== -1 && recommendedSources.indexOf(result.item.sourceId) === -1) recommendedSources.push(result.item.sourceId);
    });
    if (recommendedSources.length) weakIds = recommendedSources;
    var weakHtml = weakIds.length ? weakIds.slice(0, 12).map(function (id) {
      var representative = summary.itemResults.find(function (result) { return result.item.sourceId === id; });
      return '<span class="badge warning">' + E.escapeHtml(id) + ' · ' + E.escapeHtml(representative ? representative.item.snapshot.topic : 'Tekrar') + '</span>';
    }).join('') : '<span class="badge success">Bu oturumda eksik kaynak yok</span>';

    app.innerHTML = pageHeader('OTURUM TAMAMLANDI', attempt.title, E.formatDate(attempt.completedAt, true) + ' · ' + attempt.items.length + ' ekran sorusu',
      '<button class="button ghost" data-action="print-result">Yazdır / PDF</button><button class="button ghost" data-action="retake-same" data-id="' + E.escapeHtml(attempt.id) + '">Aynısını çöz</button><button class="button primary" data-action="retake-new" data-id="' + E.escapeHtml(attempt.id) + '">Yeni karışım</button>') +
      '<section class="card pad-lg result-hero"><div class="score-ring" style="--score:' + summary.firstPercent + '" role="img" aria-label="İlk deneme başarısı yüzde ' + summary.firstPercent + '"><strong aria-hidden="true">%' + summary.firstPercent + '</strong></div><div><span class="eyebrow">İLK DENEME BAŞARISI</span><h2>' + (summary.firstPercent >= 80 ? 'Güçlü bir oturum.' : summary.firstPercent >= 55 ? 'Temel sağlam; tekrar alanları belli.' : 'Tekrar kuyruğu için iyi bir başlangıç.') + '</h2>' +
      '<p class="muted">Geçti/kaldı yok. İpucuyla bulunan cevaplar ayrı tutulur ve ustalık puanını doğrudan artırmaz.</p><div class="metric-grid"><div class="metric"><strong>' + unaidedFull + '</strong><span>Desteksiz tam doğru</span></div><div class="metric"><strong>' + summary.supported + '</strong><span>Destekli doğru</span></div><div class="metric"><strong>' + summary.wrong + '</strong><span>Yanlış / kısmi</span></div><div class="metric"><strong>' + summary.blank + '</strong><span>Boş</span></div></div></div></section>' +
      '<section class="content-grid"><div class="stack"><div class="card pad"><div class="card-head"><div><span class="eyebrow">BÖLÜMLER</span><h2>Kaynak-eşit başarı kırılımı</h2></div><span class="badge">' + E.formatDuration(summary.timeMs) + '</span></div>' + sectionHtml + '</div>' +
      '<div class="card pad"><div class="card-head"><div><span class="eyebrow">KONULAR</span><h2>Alt konu kırılımı</h2></div></div>' + topicHtml + '</div>' +
      '<div><div class="card-head"><div><span class="eyebrow">SORU İNCELEMESİ</span><h2>Tüm cevaplar</h2></div></div><div class="review-list">' + summary.itemResults.map(reviewItemHtml).join('') + '</div></div></div>' +
      '<aside class="stack"><div class="card pad"><span class="eyebrow">ZORLUK</span><h2>Zorluk kırılımı</h2>' + difficultyHtml + '</div><div class="card pad"><span class="eyebrow">SORU TÜRLERİ</span><h2>Tür kırılımı</h2>' + typeHtml + '</div>' +
      '<div class="card pad"><span class="eyebrow">EKSİK KONULAR</span><h2>Bu oturuma özel tekrar</h2><div class="badge-row">' + weakHtml + '</div><button class="button secondary full" style="margin-top:1rem" data-action="start-recommended" data-id="' + E.escapeHtml(attempt.id) + '" ' + (recommendedIds.length ? '' : 'disabled') + '>' + (recommendedIds.length ? recommendedIds.length + ' kartlık tekrar başlat' : 'Tekrar gerekmiyor') + '</button></div>' +
      '<div class="card pad"><span class="eyebrow">KAYIT</span><h3>Sonuç değişmez</h3><p class="tiny muted">Bu oturumun soru, şık ve cevap anlık görüntüleri saklandı. Yeniden çözme ayrı bir geçmiş kaydı oluşturur.</p><a class="button small ghost" href="#/history">Tüm geçmiş</a></div></aside></section>';
  }

  async function retakeAttempt(attemptId, sameOrder) {
    var original = await DB.get('attempts', attemptId);
    if (!original) return toast('Oturum bulunamadı.', 'error');
    var seed = sameOrder ? original.seed : E.uuid();
    var cards = original.items.map(function (item) { return state.bankById[item.questionId] || item.snapshot; });
    var items = sameOrder
      ? original.items.map(function (item) { var copy = E.clone(item); copy.snapshot = E.clone(state.bankById[item.questionId] || item.snapshot); return copy; })
      : E.shuffled(cards, seed).map(function (card, index) { return E.makeAttemptItem(card, seed, index); });
    var attempt = {
      id: E.uuid(), title: original.title + ' · Tekrar', mode: original.mode, path: original.path,
      seed: seed, filters: E.clone(original.filters || {}), status: 'active', currentIndex: 0, items: items,
      scratch: '',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), bankVersion: window.SOURCE_BANK_META.version,
      sourceSha256: window.SOURCE_BANK_META.sourceSha256, retakeOf: original.id
    };
    await DB.put('attempts', attempt);
    navigate('session?id=' + encodeURIComponent(attempt.id));
  }

  async function renderHistory() {
    var attempts = await DB.all('attempts');
    attempts.sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
    var active = attempts.filter(function (attempt) { return attempt.status === 'active'; });
    var completed = attempts.filter(function (attempt) { return attempt.status === 'completed'; });
    var activeHtml = active.length ? active.map(function (attempt) {
      return '<div class="list-item"><div class="list-item-main"><strong>' + E.escapeHtml(attempt.title) + '</strong><small>' + (attempt.mode === 'practice' ? 'Pratik' : 'Sınav') + ' · ' + attempt.items.length + ' soru · Son kayıt ' + E.formatDate(attempt.updatedAt, true) + '</small></div><div class="list-item-actions"><span class="badge primary">' + (attempt.currentIndex + 1) + '/' + attempt.items.length + '</span><a class="button small primary" href="#/session?id=' + encodeURIComponent(attempt.id) + '">Devam</a><button class="button small ghost" data-action="delete-attempt" data-id="' + E.escapeHtml(attempt.id) + '">Sil</button></div></div>';
    }).join('') : emptyState('▷', 'Yarım oturum yok', 'Yeni bir test başladığında otomatik olarak burada görünür.');
    var completedHtml = completed.length ? completed.map(function (attempt) {
      var score = attempt.summary ? attempt.summary.firstPercent : 0;
      return '<div class="list-item"><div class="list-item-main"><strong>' + E.escapeHtml(attempt.title) + '</strong><small>' + E.formatDate(attempt.completedAt, true) + ' · ' + attempt.items.length + ' soru · ' + (attempt.mode === 'practice' ? 'Pratik' : 'Sınav') + '</small></div><div class="list-item-actions"><span class="badge ' + (score >= 70 ? 'success' : score >= 45 ? 'warning' : 'danger') + '">%' + score + '</span><a class="button small ghost" href="#/result?id=' + encodeURIComponent(attempt.id) + '">İncele</a><button class="button small ghost" data-action="retake-same" data-id="' + E.escapeHtml(attempt.id) + '">Tekrar</button><button class="button small ghost" data-action="delete-attempt" data-id="' + E.escapeHtml(attempt.id) + '">Sil</button></div></div>';
    }).join('') : emptyState('✓', 'Henüz tamamlanan oturum yok', 'İlk oturumunu bitirdiğinde ayrıntılı sonucu burada kalır.');

    app.innerHTML = pageHeader('GEÇMİŞ', 'Oturumların', 'Yarım testlere devam et, tamamlanan sonuçları incele veya yeni bir tekrar oluştur.', '<a class="button primary" href="#/builder">Yeni test</a>') +
      '<div class="stack"><section class="card pad"><div class="card-head"><div><span class="eyebrow">DEVAM EDEN</span><h2>Yarım oturumlar</h2></div><span class="badge primary">' + active.length + '</span></div><div class="list">' + activeHtml + '</div></section>' +
      '<section class="card pad"><div class="card-head"><div><span class="eyebrow">TAMAMLANAN</span><h2>Değişmez sonuçlar</h2></div><span class="badge">' + completed.length + '</span></div><div class="list">' + completedHtml + '</div></section></div>';
  }

  async function dueCards() {
    var progressMap = await recordsMap('progress');
    var now = Date.now();
    var cardStateMap = await recordsMap('cardState');
    return Object.keys(cardStateMap).filter(function (questionId) {
      var card = state.bankById[questionId];
      var review = cardStateMap[questionId];
      var sourceProgress = card ? progressMap[card.sourceId] || {} : {};
      return card && review.dueAt && new Date(review.dueAt).getTime() <= now && !sourceProgress.excluded;
    }).map(function (questionId) { return state.bankById[questionId]; });
  }

  async function startDueReview() {
    var cards = await dueCards();
    if (!cards.length) return toast('Zamanı gelmiş tekrar bulunmuyor.', 'success');
    await createAttemptFromCards(cards, {
      count: cards.length,
      mode: 'practice',
      path: 'mixed',
      title: 'Zamanı gelen tekrarlar',
      filters: { status: 'due' },
      preserveOrder: false
    });
  }

  async function startRecommendedReview(attemptId) {
    var attempt = await DB.get('attempts', attemptId);
    if (!attempt || attempt.status !== 'completed') return toast('Tamamlanmış oturum bulunamadı.', 'error');
    var responses = await DB.all('responses');
    var responseMap = {};
    responses.filter(function (response) { return response.attemptId === attemptId; }).forEach(function (response) { responseMap[response.id] = response; });
    var cards = [];
    attempt.items.forEach(function (item) {
      var response = responseMap[responseId(attempt.id, item.questionId)] || {};
      var score = typeof response.firstScore === 'number' ? response.firstScore : 0;
      var needsReview = response.blank || score < 1 || response.supported || response.confidence === 'uncertain' || response.confidence === 'guess' || response.slow;
      if (needsReview && !cards.some(function (card) { return card.id === item.questionId; })) cards.push(state.bankById[item.questionId] || item.snapshot);
    });
    if (!cards.length) return toast('Bu oturum için önerilen tekrar yok.', 'success');
    await createAttemptFromCards(cards, {
      count: cards.length,
      mode: 'practice',
      path: 'mixed',
      title: attempt.title + ' · Önerilen tekrar',
      filters: { recommendedFrom: attempt.id },
      preserveOrder: false
    });
  }

  async function renderReview() {
    var cardStates = await DB.all('cardState');
    var cards = await dueCards();
    var now = Date.now();
    var progressMap = await recordsMap('progress');
    var upcoming = cardStates.filter(function (entry) {
      var card = state.bankById[entry.questionId || entry.id];
      return card && entry.dueAt && new Date(entry.dueAt).getTime() > now && !(progressMap[card.sourceId] || {}).excluded;
    }).sort(function (a, b) { return String(a.dueAt).localeCompare(String(b.dueAt)); });
    var dueHtml = cards.length ? cards.map(function (card) {
      var record = cardStates.find(function (entry) { return entry.id === card.id; }) || {};
      return '<div class="list-item"><div class="list-item-main"><div class="badge-row"><span class="badge primary">' + E.escapeHtml(card.sourceId) + '</span>' + difficultyBadge(card.difficulty) + '</div><strong style="margin-top:.45rem">' + E.escapeHtml(card.topic) + '</strong><small>Sonuç: ' + E.escapeHtml(record.lastResult || 'yeni') + ' · Aşama ' + (record.reviewStage || 0) + '</small></div><div class="list-item-actions"><button class="button small ghost" data-action="practice-card" data-id="' + E.escapeHtml(card.id) + '">Tek soru çalış</button></div></div>';
    }).join('') : emptyState('✓', 'Kuyruk temiz', 'Bugün için zamanı gelmiş tekrar yok. Yeni bir pratik oturumu başlatabilirsin.', '<a class="button soft" href="#/builder">Yeni pratik</a>');
    var upcomingHtml = upcoming.length ? upcoming.slice(0, 20).map(function (record) {
      var card = state.bankById[record.questionId || record.id];
      var sourceProgress = card ? progressMap[card.sourceId] || {} : {};
      return '<div class="list-item"><div class="list-item-main"><strong>' + E.escapeHtml(card ? card.id + ' · ' + card.sourceId : record.id) + '</strong><small>' + E.escapeHtml(record.lastResult || '') + ' · ' + (sourceProgress.mastered ? 'Öğrenildi' : 'Öğreniliyor') + '</small></div><span class="badge">' + E.formatDate(record.dueAt, false) + '</span></div>';
    }).join('') : '<p class="muted">Planlanmış ileri tarihli tekrar yok.</p>';
    app.innerHTML = pageHeader('AKILLI TEKRAR', 'Tekrar kuyruğu', 'Yanlış, boş, destekli ve düşük eminlikli cevaplar 1–3–7–14–30 gün aralıklarıyla geri gelir.', '<button class="button secondary" data-action="start-due" ' + (cards.length ? '' : 'disabled') + '>' + cards.length + ' tekrarı başlat</button>') +
      '<section class="content-grid"><div class="card pad"><div class="card-head"><div><span class="eyebrow">BUGÜN</span><h2>Zamanı gelenler</h2></div><span class="badge warning">' + cards.length + '</span></div><div class="list">' + dueHtml + '</div></div>' +
      '<aside class="stack"><div class="card pad"><span class="eyebrow">YAKLAŞAN</span><h2>Takvim</h2><div class="list">' + upcomingHtml + '</div></div><div class="card pad"><span class="eyebrow">USTALIK KURALI</span><p class="muted">Bir kaynak konu, en az iki farklı günde üç desteksiz doğru sonrasında öğrenildi sayılır.</p></div></aside></section>';
  }

  async function renderAnalytics() {
    var attempts = (await DB.all('attempts')).filter(function (attempt) { return attempt.status === 'completed'; }).sort(function (a, b) { return String(a.completedAt).localeCompare(String(b.completedAt)); });
    var progress = await DB.all('progress');
    var cardStates = await DB.all('cardState');
    var responses = await DB.all('responses');
    var allSources = {};
    state.bank.forEach(function (card) { allSources[card.sourceId] = card.section; });
    var sections = ['Java', 'OOP', 'Algoritma'];
    var sourceProgress = {};
    progress.forEach(function (entry) { sourceProgress[entry.id] = entry; });
    var sectionData = sections.map(function (section) {
      var ids = Object.keys(allSources).filter(function (id) { return allSources[id] === section; });
      var mastered = ids.filter(function (id) { return sourceProgress[id] && sourceProgress[id].mastered; }).length;
      var answeredResponses = responses.filter(function (response) { return response.section === section && response.completed; });
      var avg = answeredResponses.length ? answeredResponses.reduce(function (sum, response) { return sum + (response.firstScore || 0); }, 0) / answeredResponses.length * 100 : 0;
      return { section: section, total: ids.length, mastered: mastered, mastery: ids.length ? mastered / ids.length * 100 : 0, accuracy: avg };
    });
    var completedResponses = responses.filter(function (response) { return response.completed; });
    var firstAccuracy = completedResponses.length ? completedResponses.reduce(function (sum, response) { return sum + (response.firstScore || 0); }, 0) / completedResponses.length * 100 : 0;
    var supported = completedResponses.filter(function (response) { return response.supported && response.finalScore === 1; }).length;
    var masteredTotal = progress.filter(function (entry) { return entry.mastered; }).length;
    var dueTotal = cardStates.filter(function (entry) {
      var card = state.bankById[entry.questionId || entry.id];
      return card && entry.dueAt && new Date(entry.dueAt) <= new Date() && !(sourceProgress[card.sourceId] || {}).excluded;
    }).length;
    var trend = attempts.slice(-12);
    var topicMap = {};
    completedResponses.forEach(function (response) {
      var card = state.bankById[response.questionId];
      var topic = card ? card.topic : 'Diğer';
      if (!topicMap[topic]) topicMap[topic] = [];
      topicMap[topic].push(response.firstScore || 0);
    });
    var weakest = Object.keys(topicMap).map(function (topic) {
      var scores = topicMap[topic];
      return { topic: topic, count: scores.length, value: scores.reduce(function (sum, score) { return sum + score; }, 0) / scores.length * 100 };
    }).filter(function (item) { return item.count >= 2; }).sort(function (a, b) { return a.value - b.value; }).slice(0, 8);

    app.innerHTML = pageHeader('ANALİZ', 'Bölüm bazlı ustalık', 'Tek bir hazırlık puanı yerine ilk-deneme başarısını, tekrar durumunu ve konu gelişimini ayrı gör.', '<button class="button ghost" data-action="export-csv">CSV indir</button>') +
      '<section class="stats-grid"><div class="card stat-card"><span class="stat-label">İlk-deneme başarısı</span><div class="stat-value">%' + Math.round(firstAccuracy) + '</div><span class="stat-meta">' + completedResponses.length + ' tamamlanan cevap</span></div>' +
      '<div class="card stat-card"><span class="stat-label">Destekli doğru</span><div class="stat-value">' + supported + '</div><span class="stat-meta">İpucu sonrası</span></div>' +
      '<div class="card stat-card"><span class="stat-label">Öğrenilen kaynak</span><div class="stat-value">' + masteredTotal + '</div><span class="stat-meta">135 kaynak konudan</span></div>' +
      '<div class="card stat-card"><span class="stat-label">Bekleyen tekrar</span><div class="stat-value">' + dueTotal + '</div><span class="stat-meta">Bugün veya gecikmiş</span></div></section>' +
      '<section class="content-grid"><div class="stack"><div class="card pad"><div class="card-head"><div><span class="eyebrow">BÖLÜM USTALIĞI</span><h2>Java, OOP ve algoritma</h2></div></div><div class="chart-list">' + sectionData.map(function (item) {
        return '<div><div class="progress-row"><strong>' + item.section + '</strong>' + progressHtml(item.mastery, item.section + ' ustalığı') + '<span>%' + Math.round(item.mastery) + '</span></div><p class="tiny muted" style="margin:-.35rem 0 .7rem">' + item.mastered + '/' + item.total + ' kaynak öğrenildi · İlk cevap ortalaması %' + Math.round(item.accuracy) + '</p></div>';
      }).join('') + '</div></div>' +
      '<div class="card pad"><div class="card-head"><div><span class="eyebrow">EĞİLİM</span><h2>Son oturumlar</h2></div></div>' + (trend.length ? '<div class="trend-bars" role="list" aria-label="Oturum başarı trendi">' + trend.map(function (attempt) { var value = attempt.summary ? attempt.summary.firstPercent : 0; return '<div class="trend-bar" role="listitem" aria-label="' + E.escapeHtml(attempt.title) + ': yüzde ' + value + '" style="--value:' + Math.max(3, value) + '" data-label="%' + value + '" title="' + E.escapeHtml(attempt.title) + ': %' + value + '"></div>'; }).join('') + '</div>' : '<p class="muted">Trend için tamamlanmış oturum gerekiyor.</p>') + '</div></div>' +
      '<aside class="stack"><div class="card pad"><span class="eyebrow">ODAK ALANLARI</span><h2>En düşük konular</h2>' + (weakest.length ? '<div class="chart-list">' + weakest.map(function (item) { return '<div class="chart-row"><span class="tiny">' + E.escapeHtml(item.topic) + '</span>' + progressHtml(item.value, item.topic + ' başarısı', 'warning') + '<strong>%' + Math.round(item.value) + '</strong></div>'; }).join('') + '</div>' : '<p class="muted">Yeterli konu verisi henüz oluşmadı.</p>') + '</div>' +
      '<div class="card pad"><span class="eyebrow">YORUM</span><p class="muted">Destekli doğrular öğrenme ilerlemesini gösterir fakat ilk-deneme başarısına eklenmez.</p><a class="button secondary full" href="#/review">Tekrar kuyruğuna git</a></div></aside></section>';
  }

  async function renderExplorer() {
    var filters = state.explorerFilters;
    var progressMap = await recordsMap('progress');
    var cardStateMap = await recordsMap('cardState');
    var search = filters.search.toLocaleLowerCase('tr-TR');
    var cards = state.bank.filter(function (card) {
      if (filters.section !== 'all' && card.section !== filters.section) return false;
      if (filters.difficulty !== 'all' && card.difficulty !== filters.difficulty) return false;
      if (filters.type !== 'all' && card.type !== filters.type) return false;
      if (search && (card.id + ' ' + card.sourceId + ' ' + card.topic + ' ' + card.prompt + ' ' + card.tags.join(' ')).toLocaleLowerCase('tr-TR').indexOf(search) === -1) return false;
      return true;
    });
    var shown = cards.slice(0, state.explorerLimit);
    app.innerHTML = pageHeader('SORU GEZGİNİ', '259 atomik kart', 'Soruları kaynak kimliği, konu, zorluk ve türe göre bul. Cevap anahtarı çözümden önce gösterilmez.', '<a class="button primary" href="#/builder">Test oluştur</a>') +
      '<div class="filter-bar"><label class="field"><span class="sr-only">Sorularda ara</span><input type="search" id="explorer-search" placeholder="Kimlik, konu veya soru metninde ara…" value="' + E.escapeHtml(filters.search) + '"></label>' +
      '<label class="field"><span class="sr-only">Bölüm</span><select id="explorer-section"><option value="all">Tüm bölümler</option>' + ['Java', 'OOP', 'Algoritma'].map(function (value) { return '<option ' + (filters.section === value ? 'selected' : '') + '>' + value + '</option>'; }).join('') + '</select></label>' +
      '<label class="field"><span class="sr-only">Zorluk</span><select id="explorer-difficulty"><option value="all">Tüm zorluklar</option>' + ['Kolay', 'Orta', 'Zorlayıcı'].map(function (value) { return '<option ' + (filters.difficulty === value ? 'selected' : '') + '>' + value + '</option>'; }).join('') + '</select></label>' +
      '<label class="field"><span class="sr-only">Soru türü</span><select id="explorer-type"><option value="all">Tüm türler</option>' + Object.keys(E.TYPE_LABELS).map(function (type) { return '<option value="' + type + '" ' + (filters.type === type ? 'selected' : '') + '>' + E.TYPE_LABELS[type] + '</option>'; }).join('') + '</select></label></div>' +
      '<p class="muted tiny" role="status">' + cards.length + ' sonuç · ' + shown.length + ' kart gösteriliyor</p><section class="question-grid">' + shown.map(function (card) {
        var progress = progressMap[card.sourceId] || {};
        var cardState = cardStateMap[card.id] || {};
        return '<article class="card explorer-card"><div class="badge-row"><span class="badge primary">' + E.escapeHtml(card.id) + '</span>' + difficultyBadge(card.difficulty) + '<span class="badge">' + E.escapeHtml(typeLabel(card.type)) + '</span>' + (progress.mastered ? '<span class="badge success">Öğrenildi</span>' : '') + '</div>' +
          '<h3>' + E.escapeHtml(card.prompt) + '</h3><p>' + E.escapeHtml(card.topic) + ' · Kaynak ' + E.escapeHtml(card.sourceId) + '</p><div class="explorer-actions"><button class="button small primary" data-action="practice-card" data-id="' + E.escapeHtml(card.id) + '">Çalış</button>' +
          '<button class="button small ' + (cardState.favorite ? 'soft' : 'ghost') + '" data-action="explorer-favorite" data-id="' + E.escapeHtml(card.id) + '" aria-label="Favori olarak işaretle" aria-pressed="' + (cardState.favorite ? 'true' : 'false') + '">' + (cardState.favorite ? '★' : '☆') + ' Favori</button>' +
          '<button class="button small ' + (progress.known ? 'soft' : 'ghost') + '" data-action="toggle-known" data-source="' + E.escapeHtml(card.sourceId) + '" data-card-id="' + E.escapeHtml(card.id) + '" aria-label="' + (progress.known ? 'Biliniyor: zaten biliyorum durumu' : 'Zaten biliyorum olarak işaretle') + '" aria-pressed="' + (progress.known ? 'true' : 'false') + '">' + (progress.known ? 'Biliniyor' : 'Zaten biliyorum') + '</button>' +
          '<button class="button small ' + (progress.excluded ? 'warning' : 'ghost') + '" data-action="toggle-excluded" data-source="' + E.escapeHtml(card.sourceId) + '" data-card-id="' + E.escapeHtml(card.id) + '" aria-label="' + (progress.excluded ? 'Dahil et: kaynak şu anda hariç tutuluyor' : 'Hariç tut: kaynağı şimdilik hariç bırak') + '" aria-pressed="' + (progress.excluded ? 'true' : 'false') + '">' + (progress.excluded ? 'Dahil et' : 'Hariç tut') + '</button>' +
          '<button class="button small ghost" data-action="delete-question-history" data-id="' + E.escapeHtml(card.id) + '">Geçmişi sil</button></div></article>';
      }).join('') + '</section>' + (shown.length < cards.length ? '<div style="text-align:center;margin-top:1rem"><button class="button ghost" data-action="explorer-more">Daha fazla göster</button></div>' : '');
  }

  var INTERVIEW_ORDER = ['again', 'partial', 'good'];
  var interviewTicker = null;

  function interviewFormDefaults() {
    return { sections: ['Java', 'OOP', 'Algoritma'], difficulties: ['Kolay', 'Orta', 'Zorlayıcı'], status: 'all', size: '10' };
  }

  function readInterviewForm(form) {
    var data = new FormData(form);
    return {
      sections: data.getAll('sections'),
      difficulties: data.getAll('difficulties'),
      status: data.get('status') || 'all',
      size: data.get('size') || '10'
    };
  }

  function interviewIsDue(record, now) {
    return !!(record && record.dueAt && new Date(record.dueAt).getTime() <= (now || Date.now()));
  }

  function filterInterviewItems(filters, recordMap, progressMap) {
    var now = Date.now();
    return state.interviewBank.filter(function (item) {
      var record = recordMap[item.sourceId];
      if ((progressMap[item.sourceId] || {}).excluded) return false;
      if (filters.sections && filters.sections.indexOf(item.section) === -1) return false;
      if (filters.difficulties && filters.difficulties.indexOf(item.difficulty) === -1) return false;
      if (filters.status === 'new' && record) return false;
      if (filters.status === 'due' && !interviewIsDue(record, now)) return false;
      if (filters.status === 'weak' && !(record && record.lastRating && record.lastRating !== 'good')) return false;
      return true;
    });
  }

  function interviewStats(recordMap, progressMap) {
    var now = Date.now();
    var ids = Object.keys(recordMap).filter(function (id) { return state.interviewById[id] && recordMap[id].lastRating; });
    return {
      total: state.interviewBank.length,
      rated: ids.length,
      due: ids.filter(function (id) { return interviewIsDue(recordMap[id], now) && !(progressMap[id] || {}).excluded; }).length,
      good: ids.filter(function (id) { return recordMap[id].lastRating === 'good'; }).length
    };
  }

  function newInterviewCurrent(sourceId) {
    return { sourceId: sourceId, revealed: false, answerText: '', checked: [], elapsedMs: 0 };
  }

  async function saveInterview() {
    if (!state.interview) return;
    state.interview.updatedAt = new Date().toISOString();
    await DB.put('meta', state.interview);
  }

  function clockText(milliseconds) {
    var total = Math.floor(Math.max(0, milliseconds || 0) / 1000);
    return String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
  }

  function interviewElapsed() {
    var current = state.interview && state.interview.current;
    if (!current) return 0;
    return (current.elapsedMs || 0) + (state.interviewClock ? performance.now() - state.interviewClock.startedAt : 0);
  }

  function interviewOverTime(item, elapsed) {
    return elapsed > (E.INTERVIEW_MINUTES[item.difficulty] || 3) * 60000;
  }

  function updateInterviewTimer() {
    var element = document.getElementById('interview-timer');
    var current = state.interview && state.interview.current;
    if (!element || !current || !state.interviewById[current.sourceId]) return;
    var elapsed = interviewElapsed();
    element.textContent = clockText(elapsed);
    element.classList.toggle('over', interviewOverTime(state.interviewById[current.sourceId], elapsed));
  }

  function stopInterviewClock() {
    if (state.interviewClock && state.interview && state.interview.current) state.interview.current.elapsedMs = interviewElapsed();
    state.interviewClock = null;
    clearInterval(interviewTicker);
    interviewTicker = null;
  }

  function startInterviewClock() {
    stopInterviewClock();
    if (document.hidden) return;
    state.interviewClock = { startedAt: performance.now() };
    interviewTicker = setInterval(updateInterviewTimer, 1000);
    updateInterviewTimer();
  }

  async function renderInterview() {
    var recordMap = await recordsMap('interview');
    var progressMap = await recordsMap('progress');
    var session = await DB.get('meta', 'interviewSession');
    var defaults = state.interviewDefaults || interviewFormDefaults();
    state.interviewDefaults = defaults;
    var pool = filterInterviewItems(defaults, recordMap, progressMap);
    var expected = defaults.size === 'all' ? pool.length : Math.min(pool.length, Number(defaults.size));
    var stats = interviewStats(recordMap, progressMap);
    var unfinished = session && !session.finishedAt && session.current;

    function chips(values, selected, name, label) {
      return '<div class="check-grid" role="group" aria-label="' + label + '">' + values.map(function (value) {
        return '<label class="choice-chip"><input type="checkbox" name="' + name + '" value="' + E.escapeHtml(value) + '" ' + (selected.indexOf(value) !== -1 ? 'checked' : '') + '><span>' + E.escapeHtml(value) + '</span></label>';
      }).join('') + '</div>';
    }

    function segmented(name, label, options) {
      return '<div class="segmented" role="radiogroup" aria-label="' + label + '">' + options.map(function (option) {
        return '<label><input type="radio" name="' + name + '" value="' + option[0] + '" ' + (defaults[name] === option[0] ? 'checked' : '') + '><span>' + option[1] + '</span></label>';
      }).join('') + '</div>';
    }

    var sessionHtml = '';
    if (unfinished) {
      sessionHtml = '<div class="card pad"><span class="eyebrow">YARIM MÜLAKAT</span><h2>' + (session.index + 1) + ' / ' + session.queue.length + '. soru</h2><p class="tiny muted">Puanladığın sorular kaydedildi. Kaldığın sorudan devam edebilirsin.</p><a class="button primary full" href="#/interview-session">Devam et</a></div>';
    } else if (session && session.finishedAt) {
      sessionHtml = '<div class="card pad"><span class="eyebrow">SON MÜLAKAT</span><h2>' + Object.keys(session.results || {}).length + ' soru</h2><p class="tiny muted">' + E.formatDate(session.finishedAt, true) + '</p><a class="button ghost full" href="#/interview-session">Özeti gör</a></div>';
    }

    app.innerHTML = pageHeader('MÜLAKAT MODU', 'Anlatarak çalış', 'Soruyu mülakattaymış gibi sesli ya da yazılı açıkla, örnek cevapla karşılaştır ve kendini puanla.', '<a class="button ghost" href="#/dashboard">Panele dön</a>') +
      '<form id="interview-form" class="builder-layout">' +
        '<div class="card">' +
          '<section class="form-section"><span class="eyebrow">NASIL ÇALIŞIR</span><h2>Önce anlat, sonra karşılaştır</h2><ol class="interview-steps">' +
            '<li>Soruyu oku; süre işlemeye başlar.</li>' +
            '<li>Cevabını sesli anlat ya da yazarak açıkla.</li>' +
            '<li>Örnek cevabı aç ve kontrol listesinde değindiğin noktaları işaretle.</li>' +
            '<li>Kendini puanla; soru buna göre 1–30 gün sonra yeniden gelir.</li></ol></section>' +
          '<section class="form-section"><span class="eyebrow">1 · KAPSAM</span><h2>Bölümler</h2>' + chips(['Java', 'OOP', 'Algoritma'], defaults.sections, 'sections', 'Bölümler') + '</section>' +
          '<section class="form-section"><h2>Zorluk</h2>' + chips(['Kolay', 'Orta', 'Zorlayıcı'], defaults.difficulties, 'difficulties', 'Zorluklar') + '</section>' +
          '<section class="form-section"><span class="eyebrow">2 · HAVUZ</span><h2>Hangi sorular?</h2>' + segmented('status', 'Soru havuzu', [['all', 'Tümü'], ['new', 'Yeni'], ['due', 'Tekrar zamanı'], ['weak', 'Zayıf']]) +
            '<p class="tiny muted" style="margin:.65rem 0 0">Zayıf: son puanı "Anlatamadım" veya "Eksik kaldı" olan sorular.</p></section>' +
          '<section class="form-section"><span class="eyebrow">3 · BOYUT</span><h2>Kaç soru?</h2>' + segmented('size', 'Soru sayısı', [['5', '5'], ['10', '10'], ['20', '20'], ['all', 'Tümü']]) + '</section>' +
        '</div>' +
        '<aside class="stack">' + sessionHtml +
          '<div class="card pad summary-panel"><span class="eyebrow">MÜLAKAT ÖZETİ</span><h2>Anlatım oturumu</h2><div class="summary-number">' + expected + '</div><p class="muted">soru</p><div class="summary-list">' +
            '<div><span>Uygun havuz</span><strong>' + pool.length + '</strong></div>' +
            '<div><span>Anlatılan soru</span><strong>' + stats.rated + '/' + stats.total + '</strong></div>' +
            '<div><span>Tekrar bekleyen</span><strong>' + stats.due + '</strong></div>' +
            '<div><span>Rahat anlatılan</span><strong>' + stats.good + '</strong></div></div>' +
            '<button class="button primary full" type="submit" ' + (pool.length ? '' : 'disabled') + '>Mülakatı başlat</button>' +
            (unfinished ? '<p class="tiny muted" style="margin:.75rem 0 0">Yeni mülakat yarım olanın yerini alır; puanladığın sorular korunur.</p>' : '') + '</div>' +
        '</aside>' +
      '</form>';
  }

  async function beginInterview(sourceIds, filters) {
    stopInterviewClock();
    state.interview = {
      id: 'interviewSession',
      queue: sourceIds,
      index: 0,
      results: {},
      current: newInterviewCurrent(sourceIds[0]),
      filters: filters || {},
      startedAt: new Date().toISOString(),
      finishedAt: null
    };
    await saveInterview();
    if (routeInfo().name !== 'interview-session') return navigate('interview-session');
    await renderInterviewSession();
    afterInterviewStep();
  }

  async function startInterview(form) {
    var filters = readInterviewForm(form);
    state.interviewDefaults = filters;
    var pool = filterInterviewItems(filters, await recordsMap('interview'), await recordsMap('progress'));
    if (!pool.length) return toast('Seçtiğin filtrelere uygun soru bulunamadı.', 'warning');
    var count = filters.size === 'all' ? pool.length : Math.min(pool.length, Number(filters.size));
    await beginInterview(E.shuffled(pool, E.uuid()).slice(0, count).map(function (item) { return item.sourceId; }), filters);
  }

  async function startDueInterview() {
    var due = filterInterviewItems({ status: 'due' }, await recordsMap('interview'), await recordsMap('progress'));
    if (!due.length) return toast('Zamanı gelmiş mülakat tekrarı yok.', 'success');
    await beginInterview(E.shuffled(due, E.uuid()).map(function (item) { return item.sourceId; }), { status: 'due' });
  }

  async function retryWeakInterview() {
    var session = state.interview;
    if (!session) return;
    var weak = session.queue.filter(function (id) { return session.results[id] === 'again' || session.results[id] === 'partial'; });
    if (!weak.length) return toast('Yeniden anlatılacak zayıf soru yok.', 'success');
    await beginInterview(E.shuffled(weak, E.uuid()), session.filters);
  }

  function afterInterviewStep() {
    document.getElementById('main-content').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: state.settings.reducedMotion ? 'auto' : 'smooth' });
    var heading = app.querySelector('h1');
    if (heading) {
      document.title = heading.textContent + ' · DevInterview';
      announce(heading.textContent);
    }
  }

  function interviewPromptHtml(item) {
    var blocks = E.promptBlocks(item.prompt);
    var titleIndex = blocks.findIndex(function (block) { return block.type === 'text'; });
    var html = blocks.map(function (block, index) {
      if (block.type === 'code') return renderCode(block.text);
      if (index === titleIndex) return '<h1 class="question-title">' + E.inlineMarkdown(block.text) + '</h1>';
      return '<p>' + E.inlineMarkdown(block.text) + '</p>';
    }).join('');
    return titleIndex === -1 ? '<h1 class="question-title">' + E.escapeHtml(item.sourceId) + '</h1>' + html : html;
  }

  function interviewRevealHtml(item, current, record) {
    var checklist = item.keyPoints.map(function (point, index) {
      return '<label class="option"><input type="checkbox" name="interview-point" value="' + index + '" ' + (current.checked.indexOf(index) !== -1 ? 'checked' : '') + '><span class="option-text">' + E.inlineMarkdown(point) + '</span></label>';
    }).join('');
    var outputs = item.expectedOutputs.length ? '<h3>Beklenen çıktı</h3>' + item.expectedOutputs.map(function (output) { return '<pre class="interview-output">' + E.escapeHtml(output) + '</pre>'; }).join('') : '';
    var examples = item.examples.length ? '<h3>Örnek kod</h3>' + item.examples.map(function (example) {
      return '<div class="interview-example">' + renderCode(example.code) +
        (example.output ? '<p class="tiny muted">Çıktı</p><pre class="interview-output">' + E.escapeHtml(example.output) + '</pre>' : '') +
        (example.blank ? '<p>Eksik parça: <code>' + E.escapeHtml(example.blank) + '</code></p>' : '') +
        '<p><strong>' + E.inlineMarkdown(example.caption) + '</strong> ' + E.inlineMarkdown(example.detail) + '</p></div>';
    }).join('') : '';
    var steps = item.steps.map(function (list) {
      return '<h3>Çözüm adımları</h3><ol class="interview-steps">' + list.map(function (step) { return '<li>' + E.inlineMarkdown(step) + '</li>'; }).join('') + '</ol>';
    }).join('');
    var previous = record && record.lastRating
      ? '<p class="tiny muted">Önceki değerlendirmen: ' + E.escapeHtml(E.INTERVIEW_RATINGS[record.lastRating]) + ' · ' + E.formatDate(record.lastRatedAt) + '</p>'
      : '';
    var ratingButtons = INTERVIEW_ORDER.map(function (rating, index) {
      var days = E.INTERVALS[E.nextInterviewState(record, { sourceId: item.sourceId, rating: rating }).reviewStage];
      return '<button type="button" class="rating-button ' + rating + '" data-action="interview-rate" data-rating="' + rating + '" aria-keyshortcuts="' + (index + 1) + '">' +
        '<span class="rating-key" aria-hidden="true">' + (index + 1) + '</span><strong>' + E.INTERVIEW_RATINGS[rating] + '</strong><small>' + days + ' gün sonra tekrar</small></button>';
    }).join('');
    return '<section class="feedback interview-reveal" id="interview-reveal" tabindex="-1" aria-labelledby="interview-reveal-title">' +
        '<h2 id="interview-reveal-title">Örnek cevap</h2>' +
        '<h3>Kontrol listesi</h3><p class="tiny muted">Anlatırken bu noktalara değindin mi? İşaretlemek isteğe bağlı.</p><div class="options interview-checklist">' + checklist + '</div>' +
        (item.explanations.length ? '<h3>Açıklama</h3>' + item.explanations.map(function (text) { return '<p>' + E.inlineMarkdown(text) + '</p>'; }).join('') : '') + outputs + steps + examples + previous +
      '</section>' +
      '<section class="interview-rating" aria-labelledby="interview-rating-title"><h2 id="interview-rating-title">Kendini puanla</h2><div class="rating-grid">' + ratingButtons + '</div></section>';
  }

  async function renderInterviewSession() {
    stopInterviewClock();
    if (!state.interview) state.interview = await DB.get('meta', 'interviewSession') || null;
    var session = state.interview;
    if (!session || !session.queue || !session.queue.length) {
      app.innerHTML = emptyState('?', 'Aktif mülakat yok', 'Yeni bir mülakat başlatarak soruları anlatmaya başlayabilirsin.', '<a class="button primary" href="#/interview">Mülakat modu</a>');
      return;
    }
    if (!session.current) return renderInterviewSummary(session);
    var current = session.current;
    var item = state.interviewById[current.sourceId];
    if (!item) {
      session.results[current.sourceId] = 'skipped';
      return advanceInterview();
    }
    var record = await DB.get('interview', item.sourceId);
    var counts = { good: 0, partial: 0, again: 0, skipped: 0 };
    Object.keys(session.results).forEach(function (id) { counts[session.results[id]] = (counts[session.results[id]] || 0) + 1; });

    app.innerHTML = '<section class="session-page">' +
      '<div class="session-top"><div class="session-top-main"><a class="button small ghost" href="#/interview">Çıkış</a><div class="session-progress"><div class="session-progress-meta"><span>Mülakat modu</span><strong>' + (session.index + 1) + ' / ' + session.queue.length + '</strong></div>' + progressHtml((session.index + 1) / session.queue.length * 100, 'Mülakat ilerlemesi') + '</div></div>' +
      '<div class="badge-row"><span class="badge primary">Mülakat</span><span class="badge">Otomatik kayıt</span></div></div>' +
      '<div class="session-layout"><article class="card question-card">' +
        '<div class="question-meta"><div class="question-meta-left"><span class="badge primary">' + E.escapeHtml(item.sourceId) + '</span>' + difficultyBadge(item.difficulty) + (item.kind ? '<span class="badge">' + E.escapeHtml(item.kind) + '</span>' : '') + '<span class="badge">' + E.escapeHtml(item.topic) + '</span></div>' +
        '<div class="question-meta-right"><span class="badge interview-timer' + (interviewOverTime(item, current.elapsedMs) ? ' over' : '') + '" id="interview-timer" role="timer" title="Geçen süre">' + clockText(current.elapsedMs) + '</span></div></div>' +
        '<div class="interview-prompt">' + interviewPromptHtml(item) + '</div>' +
        '<p class="tiny muted">Önerilen süre: ' + (E.INTERVIEW_MINUTES[item.difficulty] || 3) + ' dk · Mülakattaymış gibi sesli anlat ya da aşağıya yaz.</p>' +
        '<label class="field"><span>Yazılı cevabın (isteğe bağlı)</span><textarea id="interview-answer" rows="7" maxlength="6000" spellcheck="false" placeholder="Ana fikirleri, örnek kodu veya karmaşıklığı yaz…" ' + (current.revealed ? 'readonly' : '') + '>' + E.escapeHtml(current.answerText || '') + '</textarea></label>' +
        (current.revealed ? interviewRevealHtml(item, current, record) :
          '<div class="question-actions"><div class="question-actions-left"><button class="button ghost" type="button" data-action="interview-skip">Atla</button></div>' +
          '<div class="question-actions-right"><button class="button primary" type="button" data-action="interview-reveal" aria-keyshortcuts="Enter">Örnek cevabı göster</button></div></div>') +
      '</article>' +
      '<aside class="session-side"><div class="card pad"><span class="eyebrow">BU MÜLAKAT</span><h3>' + Object.keys(session.results).length + ' / ' + session.queue.length + ' soru tamamlandı</h3><div class="summary-list">' +
          '<div><span>Rahat anlattım</span><strong>' + counts.good + '</strong></div>' +
          '<div><span>Eksik kaldı</span><strong>' + counts.partial + '</strong></div>' +
          '<div><span>Anlatamadım</span><strong>' + counts.again + '</strong></div>' +
          '<div><span>Atlanan</span><strong>' + counts.skipped + '</strong></div></div>' +
          '<button class="button ghost full" style="margin-top:1rem" type="button" data-action="interview-finish">Mülakatı bitir</button></div>' +
        '<div class="card pad"><span class="eyebrow">KISAYOLLAR</span><p class="tiny muted" style="margin:0">Enter örnek cevabı açar; yazarken Cmd/Ctrl + Enter. Cevap açıkken 1, 2 ve 3 puan verir.</p></div></aside></div></section>';

    if (!current.revealed) {
      startInterviewClock();
    } else if (state.interviewFocusReveal) {
      state.interviewFocusReveal = false;
      document.getElementById('interview-reveal').focus();
    }
  }

  async function renderInterviewSummary(session) {
    var records = await recordsMap('interview');
    var done = session.queue.filter(function (id) { return session.results[id]; });
    var counts = { good: 0, partial: 0, again: 0, skipped: 0 };
    done.forEach(function (id) { counts[session.results[id]] += 1; });
    var weakCount = counts.again + counts.partial;
    var listHtml = done.map(function (id) {
      var item = state.interviewById[id] || { topic: '' };
      var rating = session.results[id];
      var badge = rating === 'good' ? 'success' : rating === 'partial' ? 'warning' : rating === 'again' ? 'danger' : '';
      var record = records[id];
      return '<div class="list-item"><div class="list-item-main"><strong>' + E.escapeHtml(id + (item.topic ? ' · ' + item.topic : '')) + '</strong><small>' +
        (rating !== 'skipped' && record && record.dueAt ? 'Sonraki tekrar: ' + E.formatDate(record.dueAt) : 'Puanlanmadı') + '</small></div>' +
        '<span class="badge ' + badge + '">' + E.escapeHtml(E.INTERVIEW_RATINGS[rating] || 'Atlandı') + '</span></div>';
    }).join('');
    app.innerHTML = pageHeader('MÜLAKAT TAMAMLANDI', 'Mülakat özeti', E.formatDate(session.finishedAt || session.updatedAt, true) + ' · ' + done.length + ' soru', '<a class="button primary" href="#/interview">Yeni mülakat</a>') +
      '<section class="card pad-lg"><div class="metric-grid">' +
        '<div class="metric"><strong>' + counts.good + '</strong><span>Rahat anlattım</span></div>' +
        '<div class="metric"><strong>' + counts.partial + '</strong><span>Eksik kaldı</span></div>' +
        '<div class="metric"><strong>' + counts.again + '</strong><span>Anlatamadım</span></div>' +
        '<div class="metric"><strong>' + counts.skipped + '</strong><span>Atlanan</span></div></div></section>' +
      '<section class="content-grid"><div class="card pad"><div class="card-head"><div><span class="eyebrow">SORULAR</span><h2>Bu mülakattaki puanların</h2></div></div><div class="list">' + (listHtml || '<p class="muted">Puanlanan soru yok.</p>') + '</div></div>' +
        '<aside class="stack"><div class="card pad"><span class="eyebrow">TEKRAR</span><h2>Zayıf kalanlar</h2><p class="muted tiny">Anlatamadığın ve eksik kaldığın sorular takvime göre yeniden gelir. İstersen hemen bir kez daha anlatabilirsin.</p>' +
          '<button class="button secondary full" type="button" data-action="interview-retry-weak" ' + (weakCount ? '' : 'disabled') + '>' + (weakCount ? weakCount + ' soruyu yeniden anlat' : 'Zayıf soru yok') + '</button></div>' +
          '<div class="card pad"><span class="eyebrow">NOT</span><p class="tiny muted" style="margin:0">Mülakat puanları kendi tekrar takvimini kullanır; test sonuçlarını ve ustalık hesabını etkilemez.</p></div></aside></section>';
  }

  async function advanceInterview() {
    var session = state.interview;
    stopInterviewClock();
    clearTimeout(saveTimers.interview);
    session.index += 1;
    session.current = session.index < session.queue.length ? newInterviewCurrent(session.queue[session.index]) : null;
    if (!session.current) session.finishedAt = new Date().toISOString();
    await saveInterview();
    await renderInterviewSession();
    afterInterviewStep();
  }

  async function revealInterviewAnswer() {
    var current = state.interview && state.interview.current;
    if (!current || current.revealed) return;
    stopInterviewClock();
    var answer = document.getElementById('interview-answer');
    if (answer) current.answerText = answer.value;
    current.revealed = true;
    state.interviewFocusReveal = true;
    clearTimeout(saveTimers.interview);
    await saveInterview();
    await renderInterviewSession();
  }

  async function rateInterview(rating) {
    var session = state.interview;
    var current = session && session.current;
    if (!current || !current.revealed || !E.INTERVIEW_RATINGS[rating]) return;
    var item = state.interviewById[current.sourceId];
    var previous = await DB.get('interview', current.sourceId);
    await DB.put('interview', E.nextInterviewState(previous, {
      sourceId: current.sourceId,
      rating: rating,
      covered: current.checked.length,
      total: item ? item.keyPoints.length : 0,
      timeMs: current.elapsedMs,
      answerText: String(current.answerText || '').trim()
    }));
    session.results[current.sourceId] = rating;
    await advanceInterview();
  }

  async function skipInterview() {
    var session = state.interview;
    if (!session || !session.current) return;
    session.results[session.current.sourceId] = 'skipped';
    await advanceInterview();
  }

  async function finishInterview() {
    var session = state.interview;
    if (!session) return;
    var remaining = session.queue.length - Object.keys(session.results).length;
    if (remaining > 0) {
      var approved = await confirmAction('Mülakatı bitir', remaining + ' soru puanlanmadan kalacak. Puanladığın sorular kayıtlı kalır.', 'Mülakatı bitir');
      if (!approved) return;
    }
    stopInterviewClock();
    session.queue = session.queue.filter(function (id) { return session.results[id]; });
    session.current = null;
    session.finishedAt = new Date().toISOString();
    if (!session.queue.length) {
      await DB.remove('meta', 'interviewSession');
      state.interview = null;
      return navigate('interview');
    }
    await saveInterview();
    await renderInterviewSession();
    afterInterviewStep();
  }

  function handleInterviewKey(event, active) {
    var current = state.interview && state.interview.current;
    if (!current) return;
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && active && active.id === 'interview-answer' && !current.revealed) {
      event.preventDefault();
      revealInterviewAnswer();
      return;
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    var editing = active && (active.tagName === 'TEXTAREA' || active.tagName === 'SELECT' || active.isContentEditable || (active.tagName === 'INPUT' && !/^(checkbox|radio)$/.test(active.type)));
    if (editing) return;
    if (event.key === 'Enter' && !current.revealed) {
      if (active && /^(BUTTON|A|SUMMARY)$/.test(active.tagName)) return;
      event.preventDefault();
      revealInterviewAnswer();
    } else if (/^[1-3]$/.test(event.key) && current.revealed) {
      event.preventDefault();
      rateInterview(INTERVIEW_ORDER[Number(event.key) - 1]);
    }
  }

  async function renderSettings() {
    var issues = (await DB.all('issues')).sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
    var dump = await DB.dump();
    var recordCount = Object.keys(dump.stores).reduce(function (sum, store) { return sum + dump.stores[store].length; }, 0);
    var importPreview = state.pendingImport ? '<div class="card pad" style="margin-top:1rem;border-color:var(--primary)"><span class="eyebrow">İÇE AKTARMA ÖNİZLEMESİ</span><h3>' + E.escapeHtml(state.pendingImport.fileName) + '</h3><p class="muted">' + state.pendingImport.recordCount + ' kayıt · Şema v' + state.pendingImport.data.schemaVersion + ' · ' + E.formatDate(state.pendingImport.data.exportedAt, true) + '</p><div class="page-actions" style="justify-content:flex-start"><button class="button primary" data-action="merge-import">Yedek al ve birleştir</button><button class="button ghost" data-action="cancel-import">İptal</button></div></div>' : '';
    var issueHtml = issues.length ? issues.slice(0, 12).map(function (issue) {
      return '<div class="list-item"><div class="list-item-main"><strong>' + E.escapeHtml(issue.questionId) + '</strong><small>' + E.escapeHtml(issue.text) + '<br>' + E.formatDate(issue.createdAt, true) + '</small></div><button class="button small ghost" data-action="delete-issue" data-id="' + E.escapeHtml(issue.id) + '">Sil</button></div>';
    }).join('') : '<p class="muted">Kaydedilmiş soru bildirimi yok.</p>';

    app.innerHTML = pageHeader('AYARLAR', 'Çalışma alanın', 'Tema, okunabilirlik, günlük hedef ve yerel verilerini tek yerden yönet.', '<button class="button ghost" id="help-settings" data-action="open-help">Kısayollar</button>') +
      '<section class="settings-grid"><div class="stack"><form id="settings-form" class="card pad"><span class="eyebrow">GÖRÜNÜM</span><h2>Arayüz tercihleri</h2>' +
        '<label class="setting-row"><span class="setting-copy"><strong>Tema</strong><small>Sistem, açık veya koyu</small></span><select name="theme" style="width:auto"><option value="system" ' + (state.settings.theme === 'system' ? 'selected' : '') + '>Sistem</option><option value="light" ' + (state.settings.theme === 'light' ? 'selected' : '') + '>Açık</option><option value="dark" ' + (state.settings.theme === 'dark' ? 'selected' : '') + '>Koyu</option></select></label>' +
        '<label class="setting-row"><span class="setting-copy"><strong>Bilgi yoğunluğu</strong><small>Rahat veya kompakt</small></span><select name="density" style="width:auto"><option value="comfortable" ' + (state.settings.density === 'comfortable' ? 'selected' : '') + '>Rahat</option><option value="compact" ' + (state.settings.density === 'compact' ? 'selected' : '') + '>Kompakt</option></select></label>' +
        '<label class="setting-row"><span class="setting-copy"><strong>Yazı boyutu</strong><small>Küçük, normal veya büyük</small></span><select name="fontScale" style="width:auto"><option value="small" ' + (state.settings.fontScale === 'small' ? 'selected' : '') + '>Küçük</option><option value="normal" ' + (state.settings.fontScale === 'normal' ? 'selected' : '') + '>Normal</option><option value="large" ' + (state.settings.fontScale === 'large' ? 'selected' : '') + '>Büyük</option></select></label>' +
        '<label class="setting-row"><span class="setting-copy"><strong>Yüksek kontrast</strong><small>Durumlar renk dışında metinle de anlatılır</small></span><span class="switch"><input type="checkbox" name="highContrast" ' + (state.settings.highContrast ? 'checked' : '') + '><span></span></span></label>' +
        '<label class="setting-row"><span class="setting-copy"><strong>Azaltılmış hareket</strong><small>Geçişleri ve animasyonları en aza indir</small></span><span class="switch"><input type="checkbox" name="reducedMotion" ' + (state.settings.reducedMotion ? 'checked' : '') + '><span></span></span></label>' +
        '<label class="setting-row"><span class="setting-copy"><strong>Günlük hedef</strong><small>Seri için gereken benzersiz kart sayısı</small></span><input type="number" name="dailyGoal" min="1" max="100" value="' + state.settings.dailyGoal + '" style="width:86px"></label></form>' +
        '<div class="card pad"><span class="eyebrow">SORU BİLDİRİMLERİ</span><h2>Yerel inceleme listesi</h2><div class="list">' + issueHtml + '</div></div></div>' +
      '<div class="stack"><div class="card pad"><span class="eyebrow">YEDEKLEME</span><h2>Verini taşı ve koru</h2><p class="muted">Chrome yerel verisi bu dosya konumuna ve tarayıcı profiline bağlıdır. Klasörü taşımadan önce JSON yedeği al.</p>' +
        '<div class="summary-list"><div><span>Depolama</span><strong>' + (DB.mode() === 'indexeddb' ? 'IndexedDB' : 'Yerel yedek') + '</strong></div><div><span>Kayıt sayısı</span><strong>' + recordCount + '</strong></div><div><span>Son JSON yedeği</span><strong>' + (state.settings.lastBackupAt ? E.formatDate(state.settings.lastBackupAt, true) : 'Henüz yok') + '</strong></div></div>' +
        '<div class="page-actions" style="justify-content:flex-start"><button class="button primary" data-action="export-json">JSON yedeği</button><button class="button ghost" data-action="export-csv">CSV indir</button><label class="button ghost file-picker">JSON içe aktar<input class="file-picker-input" type="file" id="import-file" accept="application/json,.json"></label></div>' + importPreview + '</div>' +
        '<div class="card pad"><span class="eyebrow">BANKA BİLGİSİ</span><h2>Kaynak doğrulaması</h2><div class="summary-list"><div><span>Atomik kart</span><strong>' + state.validation.cardCount + '</strong></div><div><span>Kaynak soru</span><strong>' + state.validation.sourceCount + '</strong></div><div><span>Sürüm</span><strong>' + E.escapeHtml(window.SOURCE_BANK_META.version) + '</strong></div></div><p class="tiny muted" style="word-break:break-all">SHA-256: ' + E.escapeHtml(window.SOURCE_BANK_META.sourceSha256) + '</p><p class="tiny muted">Cevap anahtarı statik uygulamanın yerel dosyalarında bulunur; bu bir kişisel öğrenme aracıdır.</p></div>' +
        '<div class="card pad danger-zone"><span class="eyebrow" style="color:var(--danger)">TEHLİKELİ ALAN</span><h2>Yerel veriyi temizle</h2><p class="muted">Tek soru ve oturum geçmişini ilgili ekranlardan silebilirsin. Buradaki işlem tüm ayar, not ve geçmişi kaldırır.</p><button class="button danger" data-action="reset-all">Tüm veriyi kalıcı sil</button></div></div></section>';
  }

  async function exportJson(silentName) {
    var data = await DB.dump();
    data.questionBank = {
      version: window.SOURCE_BANK_META.version,
      sourceSha256: window.SOURCE_BANK_META.sourceSha256,
      cardCount: state.bank.length
    };
    var filename = (silentName || 'java-mulakat-yedek-' + E.dateKey()) + '.json';
    E.download(filename, JSON.stringify(data, null, 2), 'application/json;charset=utf-8');
    state.settings.lastBackupAt = new Date().toISOString();
    await saveSettings();
    toast('JSON yedeği indirildi.', 'success');
  }

  async function exportCsv() {
    var attempts = await recordsMap('attempts');
    var responses = await DB.all('responses');
    var rows = [['Oturum ID', 'Oturum', 'Mod', 'Tarih', 'Soru ID', 'Kaynak ID', 'Bölüm', 'Zorluk', 'Tür', 'Cevap', 'İlk puan', 'Son puan', 'Destekli', 'Eminlik', 'Süre ms']];
    responses.forEach(function (response) {
      var attempt = attempts[response.attemptId] || {};
      var card = state.bankById[response.questionId] || {};
      rows.push([
        response.attemptId, attempt.title || '', attempt.mode || '', response.completedAt || response.updatedAt || '', response.questionId,
        response.sourceId, response.section, response.difficulty, response.type, E.formatAnswer(card, response.currentAnswer),
        response.firstScore == null ? '' : response.firstScore, response.finalScore == null ? '' : response.finalScore,
        response.supported ? 'Evet' : 'Hayır', response.confidence || '', Math.round(response.timeMs || 0)
      ]);
    });
    E.download('java-mulakat-analiz-' + E.dateKey() + '.csv', '\ufeff' + E.toCsv(rows), 'text/csv;charset=utf-8');
    toast('CSV analiz dosyası indirildi.', 'success');
  }

  async function readImportFile(file) {
    try {
      var data = JSON.parse(await file.text());
      if (data.app !== 'Yerel Java Mülakat Sınavı' || data.schemaVersion !== 1 || !data.stores) throw new Error('Bu dosya geçerli bir DevInterview yedeği değil.');
      DB.stores.forEach(function (storeName) {
        if (data.stores[storeName] != null && !Array.isArray(data.stores[storeName])) throw new Error(storeName + ' kayıt grubu geçerli bir dizi değil.');
        (data.stores[storeName] || []).forEach(function (record) {
          if (!record || typeof record.id !== 'string' || !record.id) throw new Error(storeName + ' içinde kimliği eksik kayıt var.');
        });
      });
      var count = Object.keys(data.stores).reduce(function (sum, name) { return sum + (Array.isArray(data.stores[name]) ? data.stores[name].length : 0); }, 0);
      state.pendingImport = { data: data, fileName: file.name, recordCount: count };
      await refreshPreservingFocus(renderSettings);
      toast('İçe aktarma önizlemesi hazır.', 'success');
    } catch (error) {
      toast(error.message || 'Yedek okunamadı.', 'error');
    }
  }

  async function mergeImport() {
    if (!state.pendingImport) return;
    await exportJson('java-mulakat-otomatik-on-yedek-' + E.dateKey());
    var incoming = state.pendingImport.data.stores;
    var attemptIdMap = {};
    var existingAttempts = await recordsMap('attempts');
    var existingResponseRecords = await DB.all('responses');
    var incomingResponseRecords = incoming.responses || [];

    function responseGroups(records) {
      var groups = {};
      records.forEach(function (response) {
        if (!groups[response.attemptId]) groups[response.attemptId] = [];
        groups[response.attemptId].push(response);
      });
      return groups;
    }

    var existingByAttempt = responseGroups(existingResponseRecords);
    var incomingByAttempt = responseGroups(incomingResponseRecords);
    var reservedAttemptIds = Object.assign({}, existingAttempts);
    var importedAttempts = (incoming.attempts || []).map(function (rawAttempt) {
      var attempt = E.clone(rawAttempt);
      var originalId = attempt.id;
      var sameSession = E.sessionsEquivalent(existingAttempts[originalId], attempt, existingByAttempt[originalId], incomingByAttempt[originalId]);
      if ((existingAttempts[originalId] || (existingByAttempt[originalId] || []).length) && !sameSession) {
        do { attempt.id = E.uuid(); } while (reservedAttemptIds[attempt.id]);
        attempt.importedFromId = originalId;
      }
      attemptIdMap[originalId] = attempt.id;
      reservedAttemptIds[attempt.id] = attempt;
      return attempt;
    });
    for (var index = 0; index < importedAttempts.length; index += 1) {
      var attempt = importedAttempts[index];
      if (attempt.retakeOf && attemptIdMap[attempt.retakeOf]) attempt.retakeOf = attemptIdMap[attempt.retakeOf];
      await DB.put('attempts', attempt);
    }
    var existingResponses = await recordsMap('responses');
    for (var responseIndex = 0; responseIndex < (incoming.responses || []).length; responseIndex += 1) {
      var response = E.clone(incoming.responses[responseIndex]);
      if (isUnseenPlaceholder(response)) continue;
      response.attemptId = attemptIdMap[response.attemptId] || response.attemptId;
      response.id = responseId(response.attemptId, response.questionId);
      if (existingResponses[response.id] && JSON.stringify(existingResponses[response.id]) !== JSON.stringify(response)) {
        throw new Error('İçe aktarma çakışması güvenli bir oturum kimliğine ayrılamadı: ' + response.questionId);
      }
      await DB.put('responses', response);
      existingResponses[response.id] = response;
    }
    for (var settingsIndex = 0; settingsIndex < (incoming.settings || []).length; settingsIndex += 1) {
      var importedSettings = E.clone(incoming.settings[settingsIndex]);
      if (importedSettings.id === 'app') {
        importedSettings.lastBackupAt = state.settings.lastBackupAt;
        importedSettings.updatedAt = new Date().toISOString();
        state.settings = Object.assign({}, DEFAULT_SETTINGS, state.settings, importedSettings);
        await DB.put('settings', state.settings);
        applySettings();
      } else if (importedSettings.id) {
        await DB.put('settings', importedSettings);
      }
    }
    for (var storeIndex = 0; storeIndex < ['cardState', 'notes', 'issues', 'daily', 'meta', 'interview'].length; storeIndex += 1) {
      var storeName = ['cardState', 'notes', 'issues', 'daily', 'meta', 'interview'][storeIndex];
      var existing = await recordsMap(storeName);
      var records = incoming[storeName] || [];
      for (var recordIndex = 0; recordIndex < records.length; recordIndex += 1) {
        var record = E.clone(records[recordIndex]);
        if (storeName === 'daily' && existing[record.id]) {
          record.uniqueCards = Array.from(new Set((existing[record.id].uniqueCards || []).concat(record.uniqueCards || [])));
          record.completedAttempts = Math.max(existing[record.id].completedAttempts || 0, record.completedAttempts || 0);
        } else if (existing[record.id] && new Date(existing[record.id].updatedAt || 0) > new Date(record.updatedAt || 0)) {
          continue;
        }
        await DB.put(storeName, record);
      }
    }
    await rebuildProgress(incoming.progress || []);
    state.pendingImport = null;
    toast('Yedek mevcut verilerle birleştirildi.', 'success');
    await refreshPreservingFocus(renderSettings);
  }

  function isUnseenPlaceholder(response) {
    return !response.seenAt && !!response.blank;
  }

  async function removeUnseenPlaceholders() {
    var placeholders = (await DB.all('responses')).filter(isUnseenPlaceholder);
    if (!placeholders.length) return;
    for (var index = 0; index < placeholders.length; index += 1) {
      await DB.remove('responses', placeholders[index].id);
    }
    await rebuildProgress([]);
  }

  async function rebuildProgress(importedProgress) {
    var flags = {};
    (await DB.all('progress')).concat(importedProgress || []).forEach(function (record) {
      flags[record.id] = {
        known: !!(record.known || flags[record.id] && flags[record.id].known),
        excluded: !!(record.excluded || flags[record.id] && flags[record.id].excluded)
      };
    });
    await DB.clear('progress');
    var responses = (await DB.all('responses')).filter(function (response) { return response.outcomeKind; }).sort(function (a, b) { return String(a.completedAt || a.updatedAt).localeCompare(String(b.completedAt || b.updatedAt)); });
    var map = {};
    var preservedCardStates = {};
    (await DB.all('cardState')).forEach(function (record) {
      var base = E.clone(record);
      ['reviewStage', 'dueAt', 'lastResult', 'lastAnsweredAt', 'unaidedCorrect', 'supportedCorrect', 'wrong', 'blank'].forEach(function (field) { delete base[field]; });
      preservedCardStates[record.id] = base;
    });
    var reviewMap = Object.assign({}, preservedCardStates);
    for (var index = 0; index < responses.length; index += 1) {
      var response = responses[index];
      var outcome = {
        sourceId: response.sourceId, kind: response.outcomeKind,
        at: response.completedAt || response.updatedAt,
        lowConfidence: response.confidence === 'uncertain' || response.confidence === 'guess', slow: !!response.slow
      };
      map[response.sourceId] = E.nextProgress(map[response.sourceId], outcome);
      reviewMap[response.questionId] = E.nextReviewState(reviewMap[response.questionId], {
        questionId: response.questionId,
        kind: outcome.kind,
        at: outcome.at,
        lowConfidence: outcome.lowConfidence,
        slow: outcome.slow
      });
    }
    Object.keys(flags).forEach(function (id) {
      map[id] = Object.assign({ id: id, sourceId: id }, map[id] || {}, flags[id]);
    });
    await DB.putMany('progress', Object.keys(map).map(function (id) { return map[id]; }));
    await DB.clear('cardState');
    await DB.putMany('cardState', Object.keys(reviewMap).map(function (id) { return reviewMap[id]; }));
    await rebuildDailyAndSummaries();
  }

  async function rebuildDailyAndSummaries() {
    var attempts = await DB.all('attempts');
    var responses = await DB.all('responses');
    var dailyMap = {};
    function dailyRecord(at) {
      var id = E.dateKey(at);
      if (!dailyMap[id]) dailyMap[id] = { id: id, uniqueCards: [], completedAttempts: 0, updatedAt: at };
      if (String(at || '') > String(dailyMap[id].updatedAt || '')) dailyMap[id].updatedAt = at;
      return dailyMap[id];
    }
    responses.filter(function (response) {
      return response.outcomeKind && (response.completedAt || response.updatedAt) && countsTowardDaily(response);
    }).forEach(function (response) {
      var record = dailyRecord(response.completedAt || response.updatedAt);
      if (record.uniqueCards.indexOf(response.questionId) === -1) record.uniqueCards.push(response.questionId);
    });
    attempts.filter(function (attempt) { return attempt.status === 'completed' && attempt.completedAt; }).forEach(function (attempt) {
      dailyRecord(attempt.completedAt).completedAttempts += 1;
    });
    await DB.clear('daily');
    await DB.putMany('daily', Object.keys(dailyMap).map(function (id) { return dailyMap[id]; }));

    var responseMaps = {};
    responses.forEach(function (response) {
      if (!responseMaps[response.attemptId]) responseMaps[response.attemptId] = {};
      responseMaps[response.attemptId][response.id] = response;
    });
    for (var index = 0; index < attempts.length; index += 1) {
      var attempt = attempts[index];
      if (attempt.status !== 'completed') continue;
      attempt.summary = E.summarizeAttempt(attempt, responseMaps[attempt.id] || {});
      delete attempt.summary.itemResults;
      await DB.put('attempts', attempt);
    }
  }

  async function deleteAttempt(attemptId) {
    var attempt = await DB.get('attempts', attemptId);
    if (!attempt) return;
    var approved = await confirmAction('Oturumu sil', '"' + attempt.title + '" ve bu oturuma ait tüm cevap denemeleri silinecek.', 'Oturumu sil');
    if (!approved) return;
    var responses = await DB.all('responses');
    for (var index = 0; index < responses.length; index += 1) {
      if (responses[index].attemptId === attemptId) await DB.remove('responses', responses[index].id);
    }
    await DB.remove('attempts', attemptId);
    await rebuildProgress([]);
    toast('Oturum silindi.', 'success');
    await render();
  }

  async function deleteQuestionHistory(questionId) {
    var card = state.bankById[questionId];
    var approved = await confirmAction('Soru geçmişini sil', questionId + ' için cevaplar, favori ve not silinecek. Oturumların kendisi korunacak.', 'Geçmişi sil');
    if (!approved) return;
    var responses = await DB.all('responses');
    for (var index = 0; index < responses.length; index += 1) {
      if (responses[index].questionId === questionId) await DB.remove('responses', responses[index].id);
    }
    await DB.remove('cardState', questionId);
    await DB.remove('notes', questionId);
    await rebuildProgress([]);
    toast((card ? card.id : questionId) + ' geçmişi silindi.', 'success');
    await refreshPreservingFocus(renderExplorer);
  }

  async function toggleFavorite(questionId) {
    var record = await DB.get('cardState', questionId) || { id: questionId, questionId: questionId, timesSeen: 0, favorite: false };
    record.favorite = !record.favorite;
    record.updatedAt = new Date().toISOString();
    await DB.put('cardState', record);
    toast(record.favorite ? 'Favorilere eklendi.' : 'Favorilerden çıkarıldı.', 'success');
  }

  async function toggleProgressFlag(sourceId, field) {
    var record = await DB.get('progress', sourceId) || { id: sourceId, sourceId: sourceId, known: false, excluded: false };
    record[field] = !record[field];
    record.updatedAt = new Date().toISOString();
    await DB.put('progress', record);
    toast(field === 'known' ? (record[field] ? 'Kaynak "zaten biliyorum" olarak işaretlendi.' : 'Biliniyor işareti kaldırıldı.') : (record[field] ? 'Kaynak otomatik testlerden hariç tutuldu.' : 'Kaynak yeniden testlere dahil edildi.'), 'success');
  }

  async function resetAllData() {
    var approved = await confirmAction('Tüm yerel veriyi sil', 'Önce otomatik JSON yedeği indirilecek; ardından oturum, cevap, not, ilerleme ve ayarlar kalıcı olarak temizlenecek.', 'Yedekle ve tümünü sil');
    if (!approved) return;
    await exportJson('java-mulakat-silme-oncesi-' + E.dateKey());
    await DB.clearAll();
    state.settings = Object.assign({}, DEFAULT_SETTINGS, { onboardingComplete: false });
    state.pendingImport = null;
    await saveSettings();
    toast('Yerel veriler temizlendi.', 'success');
    navigate('dashboard');
    await render();
    openOnboarding();
  }

  async function saveIssue(event) {
    event.preventDefault();
    var questionId = document.getElementById('issue-question-id').value;
    var text = document.getElementById('issue-text').value.trim();
    if (!questionId || !text) return;
    await DB.put('issues', { id: E.uuid(), questionId: questionId, text: text, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    document.getElementById('issue-dialog').close();
    document.getElementById('issue-text').value = '';
    toast('Bildirim yerel inceleme listesine eklendi.', 'success');
  }

  async function handleAppClick(event) {
    var target = event.target.closest('[data-action]');
    if (!target || target.disabled) return;
    var action = target.dataset.action;
    if (action === 'start-due') return startDueReview();
    if (action === 'start-recommended') return startRecommendedReview(target.dataset.id);
    if (action === 'jump-question') return setQuestionIndex(Number(target.dataset.index));
    if (action === 'previous-question') return setQuestionIndex(state.currentAttempt.currentIndex - 1);
    if (action === 'next-question') {
      await saveCurrentDraft();
      if (state.currentAttempt.currentIndex < state.currentAttempt.items.length - 1) return setQuestionIndex(state.currentAttempt.currentIndex + 1);
      return toast('Son sorudasın. Hazır olduğunda oturumu bitir.', 'warning');
    }
    if (action === 'submit-answer') return submitCurrentAnswer();
    if (action === 'retry-question') return retryCurrentQuestion();
    if (action === 'finish-attempt') return finalizeAttempt();
    if (action === 'toggle-flag') {
      var response = await ensureResponse(currentItem());
      response.flagged = !response.flagged;
      response.updatedAt = new Date().toISOString();
      await DB.put('responses', response);
      return refreshPreservingFocus(function () { return renderSession(state.currentAttempt.id); });
    }
    if (action === 'toggle-favorite') {
      await toggleFavorite(currentCard().id);
      return refreshPreservingFocus(function () { return renderSession(state.currentAttempt.id); });
    }
    if (action === 'open-issue') {
      document.getElementById('issue-question-id').value = currentCard().id;
      document.getElementById('issue-dialog').showModal();
      document.getElementById('issue-text').focus();
      return;
    }
    if (action === 'move-order') {
      var row = target.closest('[data-order-id]');
      var sibling = target.dataset.dir === 'up' ? row.previousElementSibling : row.nextElementSibling;
      if (sibling) {
        if (target.dataset.dir === 'up') row.parentNode.insertBefore(row, sibling);
        else row.parentNode.insertBefore(sibling, row);
        Array.from(row.parentNode.children).forEach(function (element, index, rows) {
          element.querySelector('.ordering-index').textContent = index + 1;
          element.querySelector('[data-dir="up"]').disabled = index === 0;
          element.querySelector('[data-dir="down"]').disabled = index === rows.length - 1;
        });
        scheduleDraftSave(true);
        var newIndex = Array.from(row.parentNode.children).indexOf(row);
        var itemText = row.children[1].textContent;
        announce(itemText + ', ' + (newIndex + 1) + '. sıraya taşındı.');
        if (target.disabled) {
          var fallback = row.querySelector('[data-dir="' + (target.dataset.dir === 'up' ? 'down' : 'up') + '"]:not(:disabled)');
          if (fallback) fallback.focus();
        }
      }
      return;
    }
    if (action === 'copy-code') {
      var code = target.closest('.code-wrap').querySelector('code').textContent;
      try { await navigator.clipboard.writeText(code); toast('Kod kopyalandı.', 'success'); }
      catch (error) { toast('Chrome panoya erişemedi.', 'error'); }
      return;
    }
    if (action === 'code-larger' || action === 'code-smaller') {
      var block = target.closest('.code-wrap').querySelector('.code-block');
      var current = parseFloat(getComputedStyle(block).fontSize);
      block.style.setProperty('--code-font-size', Math.max(11, Math.min(24, current + (action === 'code-larger' ? 1 : -1))) + 'px');
      return;
    }
    if (action === 'print-result') return window.print();
    if (action === 'retake-same') return retakeAttempt(target.dataset.id, true);
    if (action === 'retake-new') return retakeAttempt(target.dataset.id, false);
    if (action === 'delete-attempt') return deleteAttempt(target.dataset.id);
    if (action === 'practice-card') {
      var card = state.bankById[target.dataset.id];
      return createAttemptFromCards([card], { count: 1, mode: 'practice', path: 'learning', title: card.sourceId + ' tek soru pratiği', preserveOrder: true });
    }
    if (action === 'explorer-favorite') { await toggleFavorite(target.dataset.id); return refreshPreservingFocus(renderExplorer); }
    if (action === 'toggle-known') { await toggleProgressFlag(target.dataset.source, 'known'); return refreshPreservingFocus(renderExplorer); }
    if (action === 'toggle-excluded') { await toggleProgressFlag(target.dataset.source, 'excluded'); return refreshPreservingFocus(renderExplorer); }
    if (action === 'delete-question-history') return deleteQuestionHistory(target.dataset.id);
    if (action === 'explorer-more') { state.explorerLimit += 60; return refreshPreservingFocus(renderExplorer); }
    if (action === 'export-json') return exportJson();
    if (action === 'export-csv') return exportCsv();
    if (action === 'merge-import') return mergeImport();
    if (action === 'cancel-import') { state.pendingImport = null; return refreshPreservingFocus(renderSettings); }
    if (action === 'delete-issue') { await DB.remove('issues', target.dataset.id); toast('Bildirim silindi.', 'success'); return refreshPreservingFocus(renderSettings); }
    if (action === 'reset-all') return resetAllData();
    if (action === 'open-help') return document.getElementById('help-dialog').showModal();
    if (action === 'start-interview-due') return startDueInterview();
    if (action === 'interview-reveal') return revealInterviewAnswer();
    if (action === 'interview-rate') return rateInterview(target.dataset.rating);
    if (action === 'interview-skip') return skipInterview();
    if (action === 'interview-finish') return finishInterview();
    if (action === 'interview-retry-weak') return retryWeakInterview();
  }

  function handleAppChange(event) {
    if (event.target.closest('#question-form')) scheduleDraftSave(event.target.name !== 'confidence');
    if (event.target.closest('#builder-form')) {
      state.builderDefaults = readBuilderForm(document.getElementById('builder-form'));
      if (event.target.name === 'size') {
        document.getElementById('custom-size-field').style.display = event.target.value === 'custom' ? '' : 'none';
      }
      clearTimeout(saveTimers.builder);
      saveTimers.builder = setTimeout(function () {
        refreshPreservingFocus(renderBuilder);
      }, 120);
    }
    if (event.target.closest('#settings-form')) {
      var form = new FormData(document.getElementById('settings-form'));
      state.settings.theme = form.get('theme');
      state.settings.density = form.get('density');
      state.settings.fontScale = form.get('fontScale');
      state.settings.highContrast = form.get('highContrast') === 'on';
      state.settings.reducedMotion = form.get('reducedMotion') === 'on';
      state.settings.dailyGoal = Math.max(1, Math.min(100, Number(form.get('dailyGoal')) || 10));
      saveSettings().then(function () { toast('Ayarlar kaydedildi.', 'success'); });
    }
    if (event.target.closest('#interview-form')) {
      state.interviewDefaults = readInterviewForm(document.getElementById('interview-form'));
      clearTimeout(saveTimers.interviewForm);
      saveTimers.interviewForm = setTimeout(function () {
        refreshPreservingFocus(renderInterview);
      }, 120);
    }
    if (event.target.name === 'interview-point' && state.interview && state.interview.current) {
      state.interview.current.checked = Array.from(document.querySelectorAll('input[name="interview-point"]:checked')).map(function (input) { return Number(input.value); });
      saveInterview().catch(function (error) { console.error(error); });
    }
    if (event.target.id === 'import-file' && event.target.files[0]) readImportFile(event.target.files[0]);
    if (['explorer-section', 'explorer-difficulty', 'explorer-type'].indexOf(event.target.id) !== -1) {
      state.explorerFilters.section = document.getElementById('explorer-section').value;
      state.explorerFilters.difficulty = document.getElementById('explorer-difficulty').value;
      state.explorerFilters.type = document.getElementById('explorer-type').value;
      state.explorerLimit = 60;
      refreshPreservingFocus(renderExplorer);
    }
  }

  function handleAppInput(event) {
    if (event.target.closest('#question-form')) scheduleDraftSave(event.target.name !== 'confidence');
    if (event.target.id === 'scratch-input') {
      var attempt = state.currentAttempt;
      if (attempt) {
        attempt.scratch = event.target.value;
        attempt.updatedAt = new Date().toISOString();
        DB.put('attempts', attempt).catch(function (error) { console.error(error); });
      }
    }
    if (event.target.id === 'note-input') {
      var questionId = currentCard().id;
      var value = event.target.value;
      DB.put('notes', { id: questionId, questionId: questionId, text: value, updatedAt: new Date().toISOString() }).catch(function (error) { console.error(error); });
    }
    if (event.target.id === 'interview-answer' && state.interview && state.interview.current && !state.interview.current.revealed) {
      state.interview.current.answerText = event.target.value;
      clearTimeout(saveTimers.interview);
      saveTimers.interview = setTimeout(function () {
        saveTimers.interview = null;
        saveInterview().catch(function (error) { console.error(error); });
      }, 400);
    }
    if (event.target.id === 'explorer-search') {
      state.explorerFilters.search = event.target.value;
      state.explorerLimit = 60;
      clearTimeout(saveTimers.explorer);
      saveTimers.explorer = setTimeout(function () { refreshPreservingFocus(renderExplorer); }, 180);
    }
  }

  function openOnboarding() {
    state.onboardingStep = 0;
    renderOnboardingStep();
    var dialog = document.getElementById('onboarding-dialog');
    if (!dialog.open) dialog.showModal();
  }

  function renderOnboardingStep() {
    var steps = [
      { symbol: '{ }', title: 'Öğrenme ve sınav aynı yerde', text: 'Pratik modunda ilk yanlışta ipucu alırsın. Sınav modunda cevaplar ve çözümler final gönderimine kadar gizli kalır.' },
      { symbol: '⎈', title: 'Her şey bu Chrome profilinde', text: 'Cevaplar otomatik kaydedilir; fakat klasörü taşımak veya tarayıcı verisini temizlemek kayda erişimi etkileyebilir. Düzenli JSON yedeği al.' },
      { symbol: '⌨', title: 'Klavye ile hızlı çalış', text: '1–9 ile şık seç, Enter ile gönder, F ile işaretle, V ile favoriye ekle. ? tuşu yardım panelini açar.' }
    ];
    var step = steps[state.onboardingStep];
    document.getElementById('onboarding-content').innerHTML = '<div class="onboarding-visual"><div class="onboarding-symbol" aria-hidden="true">' + E.escapeHtml(step.symbol) + '</div></div><h2 id="onboarding-title">' + E.escapeHtml(step.title) + '</h2><p class="muted">' + E.escapeHtml(step.text) + '</p>';
    var dots = document.getElementById('onboarding-dots');
    dots.setAttribute('role', 'progressbar');
    dots.setAttribute('aria-valuemin', '1');
    dots.setAttribute('aria-valuemax', String(steps.length));
    dots.setAttribute('aria-valuenow', String(state.onboardingStep + 1));
    dots.setAttribute('aria-valuetext', (state.onboardingStep + 1) + ' / ' + steps.length + '. adım');
    dots.innerHTML = steps.map(function (_, index) { return '<i aria-hidden="true" class="' + (index === state.onboardingStep ? 'active' : '') + '"></i>'; }).join('');
    document.getElementById('onboarding-back').style.visibility = state.onboardingStep === 0 ? 'hidden' : 'visible';
    document.getElementById('onboarding-next').textContent = state.onboardingStep === steps.length - 1 ? 'Başla' : 'Devam';
  }

  async function completeOnboarding() {
    state.settings.onboardingComplete = true;
    await saveSettings();
    document.getElementById('onboarding-dialog').close();
  }

  function bindGlobalEvents() {
    window.addEventListener('hashchange', render);
    app.addEventListener('click', handleAppClick);
    app.addEventListener('change', handleAppChange);
    app.addEventListener('input', handleAppInput);
    app.addEventListener('submit', function (event) {
      if (event.target.id === 'builder-form') { event.preventDefault(); createFromBuilder(event.target); }
      if (event.target.id === 'question-form') { event.preventDefault(); submitCurrentAnswer(); }
      if (event.target.id === 'interview-form') { event.preventDefault(); startInterview(event.target); }
    });
    document.getElementById('issue-form').addEventListener('submit', saveIssue);
    document.querySelectorAll('[data-close-dialog]').forEach(function (button) {
      button.addEventListener('click', function () { document.getElementById(button.dataset.closeDialog).close(); });
    });
    document.getElementById('help-open').addEventListener('click', function () { document.getElementById('help-dialog').showModal(); });
    document.getElementById('focus-toggle').addEventListener('click', async function () {
      state.settings.focusMode = !state.settings.focusMode;
      await saveSettings();
      toast(state.settings.focusMode ? 'Odak modu açıldı.' : 'Odak modu kapatıldı.', 'success');
    });
    document.getElementById('theme-toggle').addEventListener('click', async function () {
      var themes = ['system', 'light', 'dark'];
      state.settings.theme = themes[(themes.indexOf(state.settings.theme) + 1) % themes.length];
      await saveSettings();
      announce('Tema: ' + (state.settings.theme === 'system' ? 'sistem' : state.settings.theme === 'light' ? 'açık' : 'koyu'));
    });
    document.getElementById('onboarding-back').addEventListener('click', function () { state.onboardingStep = Math.max(0, state.onboardingStep - 1); renderOnboardingStep(); });
    document.getElementById('onboarding-next').addEventListener('click', function () {
      if (state.onboardingStep < 2) { state.onboardingStep += 1; renderOnboardingStep(); }
      else completeOnboarding();
    });
    document.getElementById('onboarding-dialog').addEventListener('close', function () {
      if (!state.settings.onboardingComplete) { state.settings.onboardingComplete = true; saveSettings(); }
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { if (state.settings.theme === 'system') applySettings(); });
    document.addEventListener('visibilitychange', async function () {
      if (document.hidden) {
        await saveCurrentDraft();
        await flushTimer();
        if (state.interview) {
          stopInterviewClock();
          await saveInterview();
        }
      }
      else if (state.route && state.route.name === 'session' && currentResponse()) startTimer(currentResponse());
      else if (state.route && state.route.name === 'interview-session' && state.interview && state.interview.current && !state.interview.current.revealed) startInterviewClock();
    });
    window.addEventListener('beforeunload', persistSessionOnExit);
    window.addEventListener('pagehide', persistSessionOnExit);
    setInterval(function () { checkpointTimer().catch(function (error) { console.error(error); }); }, 15000);
    document.addEventListener('click', function (event) {
      var tab = event.target.closest('[data-note-tab]');
      if (!tab) return;
      document.querySelectorAll('[data-note-tab]').forEach(function (button) {
        button.classList.toggle('active', button === tab);
        button.setAttribute('aria-pressed', button === tab ? 'true' : 'false');
      });
      document.querySelectorAll('[data-note-panel]').forEach(function (panel) { panel.hidden = panel.dataset.notePanel !== tab.dataset.noteTab; });
    });
    document.addEventListener('keydown', handleKeyboard);
  }

  function handleKeyboard(event) {
    var active = document.activeElement;
    var typing = active && (/^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName) || active.isContentEditable);
    var openDialog = document.querySelector('dialog[open]');
    if (event.key === '?' && !typing && !openDialog) { event.preventDefault(); document.getElementById('help-dialog').showModal(); return; }
    if (state.route && state.route.name === 'interview-session' && !openDialog) return handleInterviewKey(event, active);
    if (typing || !state.route || state.route.name !== 'session' || openDialog) return;
    if (/^[1-9]$/.test(event.key)) {
      var options = document.querySelectorAll('#question-form .option input:not(:disabled)');
      var input = options[Number(event.key) - 1];
      if (input) { event.preventDefault(); input.click(); scheduleDraftSave(); }
    } else if (event.key === 'Enter') {
      if (active && /^(BUTTON|A|SUMMARY)$/.test(active.tagName)) return;
      var submit = document.querySelector('[data-action="submit-answer"]') || document.querySelector('[data-action="next-question"]');
      if (submit) { event.preventDefault(); submit.click(); }
    } else if (event.key === 'ArrowLeft' && state.currentAttempt.currentIndex > 0) {
      event.preventDefault(); setQuestionIndex(state.currentAttempt.currentIndex - 1);
    } else if (event.key === 'ArrowRight' && state.currentAttempt.currentIndex < state.currentAttempt.items.length - 1) {
      event.preventDefault(); saveCurrentDraft().then(function () { setQuestionIndex(state.currentAttempt.currentIndex + 1); });
    } else if (event.key.toLowerCase() === 'f') {
      event.preventDefault(); var flag = document.querySelector('[data-action="toggle-flag"]'); if (flag) flag.click();
    } else if (event.key.toLowerCase() === 'v') {
      event.preventDefault(); var favorite = document.querySelector('[data-action="toggle-favorite"]'); if (favorite) favorite.click();
    } else if (event.key.toLowerCase() === 'h') {
      var response = currentResponse();
      if (response && response.stage === 'hint') { event.preventDefault(); var feedback = document.getElementById('answer-feedback'); if (feedback) feedback.focus(); }
    }
  }

  init().catch(function (error) {
    console.error(error);
    app.setAttribute('aria-busy', 'false');
    app.innerHTML = '<section class="loading-state" role="alert"><h1>Uygulama başlatılamadı</h1><p>' + E.escapeHtml(error.message || error) + '</p></section>';
    document.title = 'Uygulama başlatılamadı · DevInterview';
  });
})();
