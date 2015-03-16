"use strict";

class ListenerStore {
  constructor(store) {
    this.watchCallbacks = {};
    this.store = store;
  }

  _namespaceKey(options) {
    var key = options.key;
    if (key.indexOf(".") === -1) {
      key = options.namespace + "." + key;
    }
    return key;
  }

  set(options) {
    this.store.set(options.namespace + "." + options.key, options.value);
  }

  unset(options) {
    if (options) {
      this.store.unset(options.namespace + "." + options.key);
    } else {
      this.store.unset();
    }
  }

  get(options) {
    var key = this._namespaceKey(options);
    options.callback(this.store.get(key));
  }

  getAll() {
    return this.store.getAll();
  }

  watch(options) {
    var key = this._namespaceKey(options);
    this.watchCallbacks[key] = options.callback;
    this.store.watch(key, options.callback);
  }

  unwatch(options) {
    var key, callback;
    if (options) {
      key = this._namespaceKey(options);
      callback = this.watchCallbacks[key];
    }
    this.store.unwatch(key, callback);

  delete this.watchCallbacks[key];
}

  clear() {
    for(var key in this.watchCallbacks) {
      if (this.watchCallbacks.hasOwnProperty(key)) {
        var callback = this.watchCallbacks[key];
        this.store.unwatch(key, callback);
      }
    }
    this.watchCallbacks = {};
  }
}

module.exports = ListenerStore;
