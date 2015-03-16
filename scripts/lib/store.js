"use strict";

class Store {
  constructor() {
    this._data = {};
    this._listeners = {};
  }

  set(key, value) {
    var changed = (value !== this.get(key));

    this._data[key] = value;
    changed && this._change(key);
  }

  get(key) {
    if (this.has(key)) {
      return this._data[key];
    }

    return null;
  }

  getAll() {
    return this._data;
  }

  unset(arg) {
    if (typeof arg === "function") {
      this._unsetTest(arg);
      return;
    }

    var keys = this.keys();

    if (arg) {
      keys = [arg];
    }

    for(var i = 0; i < keys.length; i++) {
      var key = keys[i];
      this._data[key] = null;
      delete this._data[key];

      this._change(key);
    }
  }

  keys() {
    var keys = [];
    for (var key in this._data) {
      if (this._data.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys;
  }

  _unsetTest(test) {
    for (var key in this._data) {
      if (this._data.hasOwnProperty(key)) {
        test(this._data[key], key) && this.unset(key);
      }
    }
  }

  has(key) {
    return this._data.hasOwnProperty(key);
  }

  watch(key, callback, context) {
    context || (context = this);

    if (!this._listeners[key]) {
      this._listeners[key] = [];
    }

    var listeners = this._listeners[key];

    var duplicate = false;
    for (var i=0;i<listeners.length;i++) {
      if (callback === listeners[i].callback &&
          context === listeners[i].context) {
        duplicate = true;
      }
    }

    if (!duplicate) {
      listeners.push({
        callback: callback,
        context: context
      });

      if (this.has(key)) {
        callback.call(context, this.get(key));
      }
    }
  }

  unwatch(arg, callback) {
    var key;
    if (typeof arg === "function") {
      this._unwatchTest(arg);
      return;
    }

    key = arg;

    if (callback) {
      var index = -1;
      for (var i=0; i<this._listeners[key].length;i++) {
        if (this._listeners[key][i].callback === callback) {
          index = i;
        }
      }

      if (index !== -1) {
        this._listeners[key].splice(index, 1);
      }
    } else if(key) {
      this._listeners[key] = [];
    } else {
      this._unwatchTest(function() {
        return true;
      });
    }
  }

  _unwatchTest(test) {
    var listeners, listener, key, i;

    for (key in this._listeners) {
      if (this._listeners.hasOwnProperty(key)) {
        listeners = this._listeners[key];

        for (i=0; i<listeners.length; i++) {
          listener = listeners[i];

          if (test(this.get(key), key, listener.callback, listener.context)) {
            this.unwatch(key, listener.callback);
          }
        }
      }
    }
  }

  _change(key) {
    var listener;
    if (this._listeners[key] === void 0) {
      return;
    }

    for (var i=0; i<this._listeners[key].length; i++) {
      listener = this._listeners[key][i];
      listener.callback.call(listener.context, this.get(key));
    }
  }
}

module.exports = Store;
