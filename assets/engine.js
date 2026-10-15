(function () {
  'use strict';

  var TYPE_LABELS = {
    single: 'Tek seçim',
    multi: 'Çoklu seçim',
    boolean: 'Doğru / Yanlış',
    fill: 'Boşluk doldurma',
    output: 'Kod çıktısı',
    order: 'Sıralama',
    match: 'Eşleştirme'
  };
  var SECTION_ORDER = { Java: 0, OOP: 1, Algoritma: 2 };
  var INTERVALS = [1, 3, 7, 14, 30];
  var INTERVIEW_RATINGS = {
    again: 'Anlatamadım',
    partial: 'Eksik kaldı',
    good: 'Rahat anlattım'
  };
  var INTERVIEW_MINUTES = { Kolay: 2, Orta: 3, Zorlayıcı: 5 };

  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 11);
  }

  function hashString(text) {
    var hash = 2166136261;
    for (var index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function mulberry32(seed) {
    return function () {
      var value = seed += 0x6D2B79F5;
      value = Math.imul(value ^ value >>> 15, value | 1);
      value ^= value + Math.imul(value ^ value >>> 7, value | 61);
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }

  function shuffled(list, seed) {
    var output = list.slice();
    var random = mulberry32(typeof seed === 'number' ? seed : hashString(String(seed)));
    for (var index = output.length - 1; index > 0; index -= 1) {
      var swapIndex = Math.floor(random() * (index + 1));
      var temp = output[index];
      output[index] = output[swapIndex];
      output[swapIndex] = temp;
    }
    return output;
  }

  function stableOptionOrder(options, seed) {
    if (!options || options.length < 2) return (options || []).map(function (option) { return option.id; });
    var fixed = [];
    var movable = [];
    options.forEach(function (option) {
      if (option.fixed || /hepsi|hiçbiri|yukarıdakilerin/i.test(option.text || '')) fixed.push(option);
      else movable.push(option);
    });
    return shuffled(movable, seed).concat(fixed).map(function (option) { return option.id; });
  }

  function asArray(value) {
    if (Array.isArray(value)) return value;
    if (value == null || value === '') return [];
    return [value];
  }

  function normalizeCard(card) {
    var normalized = Object.assign({
      section: card.sourceId && card.sourceId.charAt(0) === 'J' ? 'Java' : card.sourceId && card.sourceId.charAt(0) === 'O' ? 'OOP' : 'Algoritma',
      topic: 'Genel',
      difficulty: 'Kolay',
      type: 'single',
      prompt: '',
      code: '',
      options: [],
      items: [],
      pairs: { left: [], right: [] },
      acceptedAnswers: [],
      caseSensitive: false,
      hint: 'Sorudaki temel kuralı ve veri akışını yeniden düşün.',
      explanationShort: '',
      explanationLong: '',
      optionExplanations: {},
      assumptions: [],
      tags: [],
      version: '1.0.0'
    }, card);
    normalized.options = asArray(normalized.options).map(function (option, index) {
      return typeof option === 'string' ? { id: String.fromCharCode(97 + index), text: option } : option;
    });
    normalized.assumptions = asArray(normalized.assumptions);
    normalized.items = asArray(normalized.items).map(function (item, index) {
      return typeof item === 'string' ? { id: 'i' + (index + 1), text: item } : item;
    });
    if (Array.isArray(normalized.pairs)) {
      normalized.pairs = {
        left: normalized.pairs.map(function (pair, index) { return { id: pair.leftId || 'l' + (index + 1), text: pair.left || pair.term }; }),
        right: normalized.pairs.map(function (pair, index) { return { id: pair.rightId || 'r' + (index + 1), text: pair.right || pair.definition }; })
      };
    }
    normalized.originalPrompt = window.SOURCE_QUESTIONS && window.SOURCE_QUESTIONS[normalized.sourceId]
      ? window.SOURCE_QUESTIONS[normalized.sourceId].prompt
      : '';
    return normalized;
  }

  function getBank() {
    return (window.QUESTION_CARDS || []).map(normalizeCard);
  }

  function validateBank(bank) {
    var errors = [];
    var ids = {};
    var sources = {};
    var allowedTypes = Object.keys(TYPE_LABELS);
    bank.forEach(function (card) {
      if (!card.id || ids[card.id]) errors.push('Tekrarlanan veya eksik kart kimliği: ' + (card.id || '(boş)'));
      ids[card.id] = true;
      sources[card.sourceId] = true;
      ['sourceId', 'section', 'topic', 'difficulty', 'type', 'prompt', 'hint', 'explanationShort', 'explanationLong', 'version'].forEach(function (field) {
        if (card[field] == null || card[field] === '') errors.push(card.id + ': ' + field + ' eksik.');
      });
      if (allowedTypes.indexOf(card.type) === -1) errors.push(card.id + ': geçersiz tür ' + card.type);
      if (card.answer == null) errors.push(card.id + ': cevap anahtarı eksik.');
      if (!card.originalPrompt) errors.push(card.id + ': kaynak soru bulunamadı.');
    });
    if (!bank.length) errors.push('Soru bankası boş; sorular/ klasöründen assets/bank.js üretilmeli.');
    return { valid: errors.length === 0, errors: errors, cardCount: bank.length, sourceCount: Object.keys(sources).length };
  }

  function normalizeText(value, caseSensitive) {
    var text = String(value == null ? '' : value)
      .replace(/\r\n?/g, '\n')
      .trim()
      .replace(/[ \t]+/g, ' ')
      // Spacing next to punctuation carries no meaning in a short answer: "Θ(n),Θ(1)" equals "Θ(n), Θ(1)".
      .replace(/\s*([()[\]{}<>,;:.=+\-*\/%!&|^?"'])\s*/g, '$1');
    return caseSensitive ? text : text.toLocaleLowerCase('tr-TR');
  }

  function normalizeOutput(value, caseSensitive) {
    var text = String(value == null ? '' : value)
      .replace(/\r\n?/g, '\n')
      .trim()
      .split('\n')
      .map(function (line) { return line.trim().replace(/[ \t]+/g, ' '); })
      .join('\n');
    return caseSensitive ? text : text.toLocaleLowerCase('tr-TR');
  }

  function sameSet(first, second) {
    var left = asArray(first).slice().sort();
    var right = asArray(second).slice().sort();
    return left.length === right.length && left.every(function (value, index) { return value === right[index]; });
  }

  function parseBoolean(value) {
    if (typeof value === 'boolean') return value;
    var normalized = normalizeText(value, false);
    if (['true', 'doğru', 'a', 'yes', 'evet'].indexOf(normalized) !== -1) return true;
    if (['false', 'yanlış', 'b', 'no', 'hayır'].indexOf(normalized) !== -1) return false;
    return null;
  }

  function grade(card, answer) {
    var score = 0;
    var correct = false;
    if (card.type === 'single') {
      correct = String(answer || '') === String(card.answer);
      score = correct ? 1 : 0;
    } else if (card.type === 'multi') {
      correct = sameSet(answer, card.answer);
      score = correct ? 1 : 0;
    } else if (card.type === 'boolean') {
      var expected = parseBoolean(card.answer);
      var actual = parseBoolean(answer);
      correct = actual !== null && expected !== null && actual === expected;
      score = correct ? 1 : 0;
    } else if (card.type === 'fill' || card.type === 'output') {
      var normalizer = card.type === 'output' ? normalizeOutput : normalizeText;
      var candidates = [card.answer].concat(card.acceptedAnswers || []).map(function (candidate) {
        return normalizer(candidate, card.caseSensitive);
      });
      var normalized = normalizer(answer, card.caseSensitive);
      correct = normalized !== '' && candidates.indexOf(normalized) !== -1;
      score = correct ? 1 : 0;
    } else if (card.type === 'order') {
      var actualOrder = asArray(answer);
      var expectedOrder = asArray(card.answer);
      var correctPositions = expectedOrder.reduce(function (sum, id, index) {
        return sum + (actualOrder[index] === id ? 1 : 0);
      }, 0);
      score = expectedOrder.length ? correctPositions / expectedOrder.length : 0;
      correct = score === 1;
    } else if (card.type === 'match') {
      var expectedMap = card.answer || {};
      var keys = Object.keys(expectedMap);
      // Two right-hand options with the same text look identical, so either one counts.
      var rightText = {};
      ((card.pairs && card.pairs.right) || []).forEach(function (item) { rightText[item.id] = normalizeText(item.text, false); });
      var correctPairs = keys.reduce(function (sum, key) {
        var chosen = answer && answer[key];
        var same = chosen === expectedMap[key] || (!!chosen && rightText[chosen] !== undefined && rightText[chosen] === rightText[expectedMap[key]]);
        return sum + (same ? 1 : 0);
      }, 0);
      score = keys.length ? correctPairs / keys.length : 0;
      correct = score === 1;
    }
    return { score: Number(score.toFixed(4)), correct: correct, blank: isBlankAnswer(card, answer) };
  }

  function isBlankAnswer(card, answer) {
    if (card.type === 'multi' || card.type === 'order') return !Array.isArray(answer) || answer.length === 0;
    if (card.type === 'match') return !answer || Object.keys(answer).length === 0 || Object.keys(answer).every(function (key) { return !answer[key]; });
    return answer == null || String(answer).trim() === '';
  }

  function learningRank(sourceId) {
    var prefix = sourceId.charAt(0);
    var number = Number(sourceId.slice(1));
    if (prefix === 'J' && number <= 18) return 1000 + number;
    if (prefix === 'O' && number <= 13) return 2000 + number;
    if (prefix === 'A' && number <= 27) return 3000 + number;
    if (prefix === 'J' && number <= 36) return 4000 + number;
    if (prefix === 'O' && number <= 30) return 5000 + number;
    if (prefix === 'A' && number <= 47) return 6000 + number;
    return 7000 + (SECTION_ORDER[prefix === 'J' ? 'Java' : prefix === 'O' ? 'OOP' : 'Algoritma'] * 100) + number;
  }

  function isLearned(progress) {
    return !!(progress && (progress.mastered || progress.known));
  }

  function skipsReview(progress) {
    return !!(progress && (progress.excluded || progress.known));
  }

  function filterBank(bank, filters, progressMap, cardStateMap) {
    var now = Date.now();
    return bank.filter(function (card) {
      var progress = progressMap[card.sourceId] || {};
      var state = cardStateMap[card.id] || {};
      if (filters.sections && filters.sections.length && filters.sections.indexOf(card.section) === -1) return false;
      if (filters.difficulties && filters.difficulties.length && filters.difficulties.indexOf(card.difficulty) === -1) return false;
      if (filters.types && filters.types.length && filters.types.indexOf(card.type) === -1) return false;
      if (filters.topic && filters.topic !== 'all' && card.topic !== filters.topic) return false;
      if (progress.excluded && filters.status !== 'excluded') return false;
      if (filters.status === 'new' && (state.timesSeen || progress.known)) return false;
      if (filters.status === 'wrong' && state.lastResult !== 'wrong' && state.lastResult !== 'blank') return false;
      if (filters.status === 'favorite' && !state.favorite) return false;
      if (filters.status === 'due' && (!state.dueAt || new Date(state.dueAt).getTime() > now || progress.known)) return false;
      if (filters.status === 'mastered' && !isLearned(progress)) return false;
      if (filters.status === 'excluded' && !progress.excluded) return false;
      return true;
    });
  }

  function selectCards(bank, count, mode, seed, progressMap, cardStateMap) {
    if (count >= bank.length) {
      return mode === 'learning'
        ? bank.slice().sort(function (a, b) { return learningRank(a.sourceId) - learningRank(b.sourceId) || a.id.localeCompare(b.id); })
        : shuffled(bank, seed);
    }
    var groups = {};
    bank.forEach(function (card) {
      if (!groups[card.sourceId]) groups[card.sourceId] = [];
      groups[card.sourceId].push(card);
    });
    var sourceIds = Object.keys(groups);
    if (mode === 'learning') sourceIds.sort(function (a, b) { return learningRank(a) - learningRank(b); });
    else sourceIds = shuffled(sourceIds, seed);
    // Sources marked "Zaten biliyorum" are only used once every other source in the pool is in.
    var isKnown = function (sourceId) { return !!((progressMap || {})[sourceId] || {}).known; };
    sourceIds = sourceIds.filter(function (sourceId) { return !isKnown(sourceId); }).concat(sourceIds.filter(isKnown));

    var selected = [];
    sourceIds.forEach(function (sourceId, sourceIndex) {
      if (selected.length >= count) return;
      var candidates = groups[sourceId].slice().sort(function (a, b) {
        var first = cardStateMap[a.id] || {};
        var second = cardStateMap[b.id] || {};
        return (first.timesSeen || 0) - (second.timesSeen || 0) || String(first.lastSeenAt || '').localeCompare(String(second.lastSeenAt || ''));
      });
      if (mode !== 'learning') candidates = shuffled(candidates, seed + ':' + sourceId + ':' + sourceIndex).sort(function (a, b) {
        return ((cardStateMap[a.id] || {}).timesSeen || 0) - ((cardStateMap[b.id] || {}).timesSeen || 0);
      });
      selected.push(candidates[0]);
    });

    if (selected.length < count) {
      var selectedIds = {};
      selected.forEach(function (card) { selectedIds[card.id] = true; });
      var remainder = bank.filter(function (card) { return !selectedIds[card.id]; });
      remainder = mode === 'learning'
        ? remainder.sort(function (a, b) { return learningRank(a.sourceId) - learningRank(b.sourceId) || a.id.localeCompare(b.id); })
        : shuffled(remainder, seed + ':remainder');
      remainder = remainder.filter(function (card) { return !isKnown(card.sourceId); }).concat(remainder.filter(function (card) { return isKnown(card.sourceId); }));
      selected = selected.concat(remainder.slice(0, count - selected.length));
    }
    return selected;
  }

  function makeAttemptItem(card, seed, index) {
    var itemSeed = seed + ':' + card.id + ':' + index;
    var optionOrder = card.shuffleOptions === false
      ? (card.options || []).map(function (option) { return option.id; })
      : stableOptionOrder(card.options || [], itemSeed + ':options');
    var itemOrder = card.type === 'order'
      ? shuffled((card.items || []).map(function (item) { return item.id; }), itemSeed + ':items')
      : [];
    var rightOrder = card.type === 'match'
      ? shuffled(((card.pairs && card.pairs.right) || []).map(function (item) { return item.id; }), itemSeed + ':right')
      : [];
    return {
      questionId: card.id,
      sourceId: card.sourceId,
      optionOrder: optionOrder,
      itemOrder: itemOrder,
      rightOrder: rightOrder,
      snapshot: clone(card)
    };
  }

  function formatDate(value, includeTime) {
    if (!value) return '—';
    var date = new Date(value);
    return new Intl.DateTimeFormat('tr-TR', includeTime ? {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    } : { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  }

  function formatDuration(milliseconds) {
    var totalSeconds = Math.max(0, Math.round((milliseconds || 0) / 1000));
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    if (minutes >= 60) return Math.floor(minutes / 60) + ' sa ' + (minutes % 60) + ' dk';
    return minutes ? minutes + ' dk ' + seconds + ' sn' : seconds + ' sn';
  }

  function formatAnswer(card, answer) {
    if (isBlankAnswer(card, answer)) return 'Boş';
    if (card.type === 'single') {
      var option = (card.options || []).find(function (item) { return String(item.id) === String(answer); });
      return option ? option.text : String(answer);
    }
    if (card.type === 'multi') {
      return asArray(answer).map(function (id) {
        var option = (card.options || []).find(function (item) { return item.id === id; });
        return option ? option.text : id;
      }).join(', ');
    }
    if (card.type === 'boolean') return parseBoolean(answer) === true ? 'Doğru' : 'Yanlış';
    if (card.type === 'order') {
      return asArray(answer).map(function (id, index) {
        var item = (card.items || []).find(function (entry) { return entry.id === id; });
        return (index + 1) + '. ' + (item ? item.text : id);
      }).join(' → ');
    }
    if (card.type === 'match') {
      return Object.keys(answer || {}).map(function (leftId) {
        var left = ((card.pairs && card.pairs.left) || []).find(function (item) { return item.id === leftId; });
        var right = ((card.pairs && card.pairs.right) || []).find(function (item) { return item.id === answer[leftId]; });
        return (left ? left.text : leftId) + ' → ' + (right ? right.text : answer[leftId]);
      }).join('; ');
    }
    return String(answer);
  }

  function summarizeAttempt(attempt, responseMap) {
    var sourceScores = {};
    var itemResults = [];
    attempt.items.forEach(function (item) {
      var response = responseMap[attempt.id + '::' + item.questionId] || {};
      var score = typeof response.firstScore === 'number' ? response.firstScore : 0;
      if (!sourceScores[item.sourceId]) sourceScores[item.sourceId] = [];
      sourceScores[item.sourceId].push(score);
      itemResults.push({ item: item, response: response, score: score });
    });
    var sourceIds = Object.keys(sourceScores);
    var totalScore = sourceIds.reduce(function (sum, sourceId) {
      var values = sourceScores[sourceId];
      return sum + values.reduce(function (inner, value) { return inner + value; }, 0) / values.length;
    }, 0);
    var firstPercent = sourceIds.length ? Math.round(totalScore / sourceIds.length * 100) : 0;
    var completed = itemResults.filter(function (result) { return result.response.completed || attempt.status === 'completed'; });
    var supported = itemResults.filter(function (result) { return result.response.supported && result.response.finalScore === 1; }).length;
    var wrong = itemResults.filter(function (result) { return !result.response.blank && typeof result.response.finalScore === 'number' && result.response.finalScore < 1; }).length;
    var blank = itemResults.filter(function (result) { return result.response.blank || !result.response.currentAnswer && result.response.currentAnswer !== false; }).length;
    var timeMs = itemResults.reduce(function (sum, result) { return sum + (result.response.timeMs || 0); }, 0);
    return {
      firstPercent: firstPercent,
      sourceCount: sourceIds.length,
      itemCount: attempt.items.length,
      completedCount: completed.length,
      supported: supported,
      wrong: wrong,
      blank: blank,
      timeMs: timeMs,
      itemResults: itemResults
    };
  }

  function addDays(date, days) {
    var output = new Date(date);
    output.setDate(output.getDate() + days);
    return output.toISOString();
  }

  function dateKey(value) {
    var date = value ? new Date(value) : new Date();
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  function nextProgress(previous, outcome) {
    var now = outcome.at || new Date().toISOString();
    var progress = Object.assign({
      id: outcome.sourceId,
      sourceId: outcome.sourceId,
      unaidedCorrect: 0,
      supportedCorrect: 0,
      wrong: 0,
      blank: 0,
      reviewStage: 0,
      correctDates: [],
      mastered: false,
      known: false,
      excluded: false
    }, previous || {});
    if (outcome.kind === 'unaided') {
      progress.unaidedCorrect += 1;
      if (progress.correctDates.indexOf(dateKey(now)) === -1) progress.correctDates.push(dateKey(now));
      progress.reviewStage = previous && typeof previous.reviewStage === 'number'
        ? Math.min(previous.reviewStage + 1, INTERVALS.length - 1)
        : 0;
      progress.dueAt = addDays(now, INTERVALS[progress.reviewStage]);
      progress.lastResult = 'correct';
    } else if (outcome.kind === 'supported') {
      progress.supportedCorrect += 1;
      progress.reviewStage = 0;
      progress.dueAt = addDays(now, 1);
      progress.lastResult = 'supported';
    } else if (outcome.kind === 'blank') {
      progress.blank += 1;
      progress.reviewStage = 0;
      progress.dueAt = addDays(now, 1);
      progress.lastResult = 'blank';
    } else {
      progress.wrong += 1;
      progress.reviewStage = 0;
      progress.dueAt = addDays(now, 1);
      progress.lastResult = 'wrong';
    }
    if (outcome.lowConfidence || outcome.slow) {
      var shorterDue = addDays(now, outcome.kind === 'unaided' ? 3 : 1);
      if (!progress.dueAt || new Date(shorterDue) < new Date(progress.dueAt)) progress.dueAt = shorterDue;
    }
    progress.mastered = progress.unaidedCorrect >= 3 && progress.correctDates.length >= 2;
    progress.lastAnsweredAt = now;
    progress.updatedAt = now;
    return progress;
  }

  function nextReviewState(previous, outcome) {
    var now = outcome.at || new Date().toISOString();
    var review = Object.assign({
      id: outcome.questionId,
      questionId: outcome.questionId,
      reviewStage: 0,
      unaidedCorrect: 0,
      supportedCorrect: 0,
      wrong: 0,
      blank: 0
    }, previous || {});
    if (outcome.kind === 'unaided') {
      review.unaidedCorrect += 1;
      review.reviewStage = previous && typeof previous.reviewStage === 'number'
        ? Math.min(previous.reviewStage + 1, INTERVALS.length - 1)
        : 0;
      review.dueAt = addDays(now, INTERVALS[review.reviewStage]);
      review.lastResult = 'correct';
    } else if (outcome.kind === 'supported') {
      review.supportedCorrect += 1;
      review.reviewStage = 0;
      review.dueAt = addDays(now, 1);
      review.lastResult = 'supported';
    } else if (outcome.kind === 'blank') {
      review.blank += 1;
      review.reviewStage = 0;
      review.dueAt = addDays(now, 1);
      review.lastResult = 'blank';
    } else {
      review.wrong += 1;
      review.reviewStage = 0;
      review.dueAt = addDays(now, 1);
      review.lastResult = 'wrong';
    }
    if (outcome.lowConfidence || outcome.slow) {
      var shorterDue = addDays(now, outcome.kind === 'unaided' ? 3 : 1);
      if (!review.dueAt || new Date(shorterDue) < new Date(review.dueAt)) review.dueAt = shorterDue;
    }
    review.lastAnsweredAt = now;
    review.updatedAt = now;
    return review;
  }

  // One pass over the raw source, so later rules never match inside markup or entities produced by earlier ones.
  var JAVA_TOKEN = new RegExp([
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',
    '("(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\')',
    '\\b(public|private|protected|static|final|class|interface|abstract|extends|implements|new|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|this|super|instanceof|void|default|synchronized)\\b',
    '\\b(int|long|short|byte|double|float|boolean|char|String|Integer|Object|List|Set|Map|ArrayList|LinkedList|HashMap|HashSet)\\b',
    '\\b(\\d+(?:\\.\\d+)?[fFdDlL]?)\\b'
  ].join('|'), 'g');

  function highlightJava(code) {
    var source = String(code || '');
    var html = '';
    var last = 0;
    source.replace(JAVA_TOKEN, function (match, comment, string, keyword, type, number, offset) {
      var kind = comment ? 'comment' : string ? 'string' : keyword ? 'keyword' : type ? 'type' : 'number';
      html += escapeHtml(source.slice(last, offset)) + '<span class="tok-' + kind + '">' + escapeHtml(match) + '</span>';
      last = offset + match.length;
      return match;
    });
    return html + escapeHtml(source.slice(last));
  }

  function toCsv(rows) {
    return rows.map(function (row) {
      return row.map(function (cell) {
        var value = String(cell == null ? '' : cell).replace(/"/g, '""');
        return '"' + value + '"';
      }).join(',');
    }).join('\r\n');
  }

  function sessionResponseSignature(records) {
    return JSON.stringify((records || []).map(function (response) {
      var copy = clone(response);
      copy.id = copy.questionId;
      copy.attemptId = '@attempt';
      return copy;
    }).sort(function (a, b) { return String(a.questionId).localeCompare(String(b.questionId)); }));
  }

  function sessionsEquivalent(existingAttempt, incomingAttempt, existingResponses, incomingResponses) {
    return !!existingAttempt && JSON.stringify(existingAttempt) === JSON.stringify(incomingAttempt) &&
      sessionResponseSignature(existingResponses) === sessionResponseSignature(incomingResponses);
  }

  function unique(values) {
    return values.filter(function (value, index) { return value && values.indexOf(value) === index; });
  }

  function compactCode(code) {
    return String(code || '').replace(/\s+/g, ' ').trim();
  }

  function promptBlocks(text) {
    var blocks = [];
    var pattern = /```\w*\n([\s\S]*?)```/g;
    var source = String(text || '');
    var last = 0;
    var match;
    while ((match = pattern.exec(source))) {
      blocks.push({ type: 'text', text: source.slice(last, match.index).trim() });
      blocks.push({ type: 'code', text: match[1].replace(/\s+$/, '') });
      last = pattern.lastIndex;
    }
    blocks.push({ type: 'text', text: source.slice(last).trim() });
    return blocks.filter(function (block) { return block.text; });
  }

  function inlineMarkdown(text) {
    return escapeHtml(text).replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function buildInterviewBank(bank) {
    var sources = window.SOURCE_QUESTIONS || {};
    var groups = {};
    bank.forEach(function (card) {
      if (!groups[card.sourceId]) groups[card.sourceId] = [];
      groups[card.sourceId].push(card);
    });
    return Object.keys(sources).filter(function (sourceId) { return groups[sourceId]; }).map(function (sourceId) {
      var source = sources[sourceId];
      var cards = groups[sourceId].slice().sort(function (a, b) { return a.id.localeCompare(b.id); });
      var descriptor = String(source.descriptor || '').split(' · ');
      var sourceCode = compactCode(promptBlocks(source.prompt).filter(function (block) { return block.type === 'code'; }).map(function (block) { return block.text; })[0]);
      // Cards built on a snippet the question does not show only make sense next to that snippet.
      var shown = cards.filter(function (card) { return !card.code || compactCode(card.code) === sourceCode; });
      var shortText = function (card) { return String(card.explanationShort || '').replace(/^(Doğru|Yanlış)\.\s*/, ''); };
      return {
        sourceId: sourceId,
        section: cards[0].section,
        difficulty: INTERVIEW_MINUTES[descriptor[0]] ? descriptor[0] : cards[0].difficulty,
        kind: descriptor.slice(1).join(' · '),
        topic: cards[0].topic,
        prompt: source.prompt,
        keyPoints: unique((shown.length ? shown : cards).map(shortText)),
        explanations: unique(shown.map(function (card) { return card.explanationLong; })),
        expectedOutputs: unique(shown.filter(function (card) { return card.type === 'output'; }).map(function (card) { return card.answer; })),
        examples: cards.filter(function (card) { return shown.indexOf(card) === -1 && card.type !== 'order'; }).map(function (card) {
          return {
            code: card.code,
            caption: shortText(card),
            detail: card.explanationLong,
            output: card.type === 'output' ? card.answer : '',
            blank: card.type === 'fill' ? card.answer : ''
          };
        }),
        steps: cards.filter(function (card) { return card.type === 'order'; }).map(function (card) {
          return asArray(card.answer).map(function (id) {
            var item = (card.items || []).find(function (entry) { return entry.id === id; });
            return item ? item.text : id;
          });
        })
      };
    });
  }

  function nextInterviewState(previous, outcome) {
    var now = outcome.at || new Date().toISOString();
    var record = Object.assign({ id: outcome.sourceId, sourceId: outcome.sourceId, reviewStage: 0, ratings: [] }, clone(previous) || {});
    var rated = !!(previous && previous.ratings && previous.ratings.length && typeof previous.reviewStage === 'number');
    if (outcome.rating === 'good') record.reviewStage = rated ? Math.min(previous.reviewStage + 1, INTERVALS.length - 1) : 1;
    else if (outcome.rating === 'partial') record.reviewStage = rated ? Math.max(previous.reviewStage - 1, 0) : 0;
    else record.reviewStage = 0;
    record.dueAt = addDays(now, INTERVALS[record.reviewStage]);
    record.ratings = record.ratings.concat([{
      rating: outcome.rating,
      at: now,
      covered: outcome.covered || 0,
      total: outcome.total || 0,
      timeMs: Math.round(outcome.timeMs || 0),
      answerText: outcome.answerText || ''
    }]);
    record.lastRating = outcome.rating;
    record.lastRatedAt = now;
    record.updatedAt = now;
    return record;
  }

  function download(filename, content, mime) {
    var blob = content instanceof Blob ? content : new Blob([content], { type: mime || 'application/octet-stream' });
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  window.ExamEngine = {
    TYPE_LABELS: TYPE_LABELS,
    INTERVALS: INTERVALS,
    clone: clone,
    escapeHtml: escapeHtml,
    uuid: uuid,
    hashString: hashString,
    shuffled: shuffled,
    getBank: getBank,
    validateBank: validateBank,
    isLearned: isLearned,
    skipsReview: skipsReview,
    normalizeText: normalizeText,
    normalizeOutput: normalizeOutput,
    grade: grade,
    isBlankAnswer: isBlankAnswer,
    filterBank: filterBank,
    selectCards: selectCards,
    makeAttemptItem: makeAttemptItem,
    learningRank: learningRank,
    formatDate: formatDate,
    formatDuration: formatDuration,
    formatAnswer: formatAnswer,
    summarizeAttempt: summarizeAttempt,
    nextProgress: nextProgress,
    nextReviewState: nextReviewState,
    addDays: addDays,
    dateKey: dateKey,
    highlightJava: highlightJava,
    toCsv: toCsv,
    sessionResponseSignature: sessionResponseSignature,
    sessionsEquivalent: sessionsEquivalent,
    INTERVIEW_RATINGS: INTERVIEW_RATINGS,
    INTERVIEW_MINUTES: INTERVIEW_MINUTES,
    promptBlocks: promptBlocks,
    inlineMarkdown: inlineMarkdown,
    buildInterviewBank: buildInterviewBank,
    nextInterviewState: nextInterviewState,
    download: download
  };
})();
