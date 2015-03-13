"use strict";

var ListenerStore = function(store) {
  this.watchCallbacks = {};
  this.store = store;
};

ListenerStore.prototype._namespaceKey = function(options) {
  var key = options.key;
  if (key.indexOf(".") === -1) {
    key = options.namespace + "." + key;
  }
  return key;
};

ListenerStore.prototype.set = function(options) {
  this.store.set(options.namespace + "." + options.key, options.value);
};

ListenerStore.prototype.unset = function(options) {
  if (options) {
    this.store.unset(options.namespace + "." + options.key);
  } else {
    this.store.unset();
  }
};

ListenerStore.prototype.get = function(options) {
  var key = this._namespaceKey(options);
  options.callback(this.store.get(key));
};

ListenerStore.prototype.watch = function(options) {
  var key = this._namespaceKey(options);
  this.watchCallbacks[key] = options.callback;
  this.store.watch(key, options.callback);
};

ListenerStore.prototype.unwatch = function(options) {
  var key, callback;
  if (options) {
    key = this._namespaceKey(options);
    callback = this.watchCallbacks[key];
  }
  this.store.unwatch(key, callback);

  delete this.watchCallbacks[key];
};

ListenerStore.prototype.clear = function() {
  for(var key in this.watchCallbacks) {
    if (this.watchCallbacks.hasOwnProperty(key)) {
      var callback = this.watchCallbacks[key];
      this.store.unwatch(key, callback);
    }
  }
  this.watchCallbacks = {};
};

module.exports = ListenerStore;
