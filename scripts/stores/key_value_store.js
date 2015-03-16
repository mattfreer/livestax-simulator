"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var EventEmitter = require("events").EventEmitter;
var Constants = require("../constants/app_constants");
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = Constants.ChangeTypes.KEYVAL_CHANGE;
var AppStore = require("./app_store");
var ListenerStore = require("../lib/listener_store");
var Store = require("../lib/store");
var safeJSONParse = require("../lib/safe_json_parse");

class KeyValueStore extends EventEmitter {
  constructor() {
    this._store = new ListenerStore(new Store());
    this._registerInterests();
  }

  emitChange(data) {
    this.emit(CHANGE_EVENT, data);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  getValues() {
    return this._store.getAll();
  }

  reset() {
    this._store.clear();
    this._store.unset();
  }

  _receiveAppConfiguration() {
    this._store.clear();
  }

  _receiveStoreConfiguration(payload) {
    var key = payload.get("key").split(".");
    var options = {
      namespace: key[0],
      key: key[1],
      value: safeJSONParse(payload.get("value"))
    };
    this._store.set(options);
    this.emitChange();
  }

  _receivePostMessage(event) {
    if(event.type === "store") {
      var callback = (val) => {
        this.emitChange({
          type: event.payload.type,
          data: {
            key: event.payload.data.key,
            value: val
          }
        });
      };

      var namespace = AppStore.getApp().getIn(["app", "namespace"]);

      var options = {
        namespace: namespace,
        key: event.payload.data.key,
        value: event.payload.data.value,
        callback: callback
      };

      if (typeof options.key === "string") {
        this._store[event.payload.type](options);
      }
    this.emitChange();
    }
  }

  _registerInterests() {
    AppDispatcher.register((action) => {
      AppDispatcher.waitFor([AppStore.dispatchIndex]);
      switch(action.type) {
        case ActionTypes.RECEIVE_POST_MESSAGE:
          this._receivePostMessage(action.payload);
        break;
        case ActionTypes.RECEIVE_APP_CONFIGURATION:
          this._receiveAppConfiguration(action.payload);
        break;
        case ActionTypes.RECEIVE_STORE_CONFIGURATION:
          this._receiveStoreConfiguration(action.payload);
        break;
      }
      return true;
    });
  }
}

module.exports = new KeyValueStore();
