(function () {
  'use strict';

  var DB_NAME = 'javaInterviewExamDB';
  var DB_VERSION = 1;
  var FALLBACK_KEY = 'javaInterviewExamDB.fallback.v1';
  var STORE_NAMES = [
    'settings',
    'attempts',
    'responses',
    'progress',
    'cardState',
    'notes',
    'issues',
    'daily',
    'meta'
  ];

  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function requestPromise(request) {
    return new Promise(function (resolve, reject) {
      request.onsuccess = function () { resolve(request.result); };
      request.onerror = function () { reject(request.error || new Error('IndexedDB isteği başarısız.')); };
    });
  }

  function transactionPromise(transaction) {
    return new Promise(function (resolve, reject) {
      transaction.oncomplete = function () { resolve(); };
      transaction.onerror = function () { reject(transaction.error || new Error('IndexedDB işlemi başarısız.')); };
      transaction.onabort = function () { reject(transaction.error || new Error('IndexedDB işlemi iptal edildi.')); };
    });
  }

  function IndexedAdapter(db) {
    this.db = db;
    this.mode = 'indexeddb';
  }

  IndexedAdapter.prototype.get = async function (storeName, id) {
    var tx = this.db.transaction(storeName, 'readonly');
    return requestPromise(tx.objectStore(storeName).get(id));
  };

  IndexedAdapter.prototype.getAll = async function (storeName) {
    var tx = this.db.transaction(storeName, 'readonly');
    var store = tx.objectStore(storeName);
    if (store.getAll) return requestPromise(store.getAll());
    return new Promise(function (resolve, reject) {
      var values = [];
      var cursor = store.openCursor();
      cursor.onsuccess = function () {
        var current = cursor.result;
        if (!current) return resolve(values);
        values.push(current.value);
        current.continue();
      };
      cursor.onerror = function () { reject(cursor.error); };
    });
  };

  IndexedAdapter.prototype.put = async function (storeName, value) {
    var tx = this.db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(clone(value));
    await transactionPromise(tx);
    return value;
  };

  IndexedAdapter.prototype.putMany = async function (storeName, values) {
    if (!values.length) return;
    var tx = this.db.transaction(storeName, 'readwrite');
    var store = tx.objectStore(storeName);
    values.forEach(function (value) { store.put(clone(value)); });
    await transactionPromise(tx);
  };

  IndexedAdapter.prototype.delete = async function (storeName, id) {
    var tx = this.db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(id);
    await transactionPromise(tx);
  };

  IndexedAdapter.prototype.clear = async function (storeName) {
    var tx = this.db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).clear();
    await transactionPromise(tx);
  };

  function LocalAdapter() {
    this.mode = 'localstorage-fallback';
    this.data = {};
    STORE_NAMES.forEach(function (name) { this.data[name] = {}; }, this);
    try {
      var saved = JSON.parse(localStorage.getItem(FALLBACK_KEY) || '{}');
      STORE_NAMES.forEach(function (name) {
        if (saved[name] && typeof saved[name] === 'object') this.data[name] = saved[name];
      }, this);
    } catch (error) {
      // A damaged fallback is intentionally ignored; export/import remains available.
    }
  }

  LocalAdapter.prototype.persist = function () {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(this.data));
  };

  LocalAdapter.prototype.get = async function (storeName, id) {
    return clone(this.data[storeName][id]);
  };

  LocalAdapter.prototype.getAll = async function (storeName) {
    return Object.keys(this.data[storeName]).map(function (key) {
      return clone(this.data[storeName][key]);
    }, this);
  };

  LocalAdapter.prototype.put = async function (storeName, value) {
    this.data[storeName][value.id] = clone(value);
    this.persist();
    return value;
  };

  LocalAdapter.prototype.putMany = async function (storeName, values) {
    values.forEach(function (value) { this.data[storeName][value.id] = clone(value); }, this);
    this.persist();
  };

  LocalAdapter.prototype.delete = async function (storeName, id) {
    delete this.data[storeName][id];
    this.persist();
  };

  LocalAdapter.prototype.clear = async function (storeName) {
    this.data[storeName] = {};
    this.persist();
  };

  var backend = null;

  async function openDatabase() {
    if (!window.indexedDB) return new LocalAdapter();
    try {
      var request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = function () {
        var db = request.result;
        STORE_NAMES.forEach(function (name) {
          if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: 'id' });
        });
      };
      var db = await requestPromise(request);
      db.onversionchange = function () { db.close(); };
      return new IndexedAdapter(db);
    } catch (error) {
      console.warn('IndexedDB kullanılamadı; yerel depolama yedeğine geçildi.', error);
      return new LocalAdapter();
    }
  }

  async function ensure() {
    if (!backend) backend = await openDatabase();
    return backend;
  }

  window.ExamDB = {
    stores: STORE_NAMES.slice(),
    init: ensure,
    mode: function () { return backend ? backend.mode : 'uninitialized'; },
    get: async function (storeName, id) { return (await ensure()).get(storeName, id); },
    all: async function (storeName) { return (await ensure()).getAll(storeName); },
    put: async function (storeName, value) { return (await ensure()).put(storeName, value); },
    putMany: async function (storeName, values) { return (await ensure()).putMany(storeName, values); },
    remove: async function (storeName, id) { return (await ensure()).delete(storeName, id); },
    clear: async function (storeName) { return (await ensure()).clear(storeName); },
    clearAll: async function () {
      var active = await ensure();
      for (var index = 0; index < STORE_NAMES.length; index += 1) {
        await active.clear(STORE_NAMES[index]);
      }
    },
    dump: async function () {
      var active = await ensure();
      var stores = {};
      for (var index = 0; index < STORE_NAMES.length; index += 1) {
        stores[STORE_NAMES[index]] = await active.getAll(STORE_NAMES[index]);
      }
      return {
        app: 'Yerel Java Mülakat Sınavı',
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        stores: stores
      };
    }
  };
})();
