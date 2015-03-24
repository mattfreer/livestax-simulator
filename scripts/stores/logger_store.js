"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var Immutable = require("immutable");
var EventEmitter = require("events").EventEmitter;
var Constants = require("../constants/app_constants");
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = Constants.ChangeTypes.LOG_CHANGE;
var whitelist = Immutable.fromJS({
  on: ["*"],
  off: ["*"],
  trigger: ["*"],
  dialog: ["show"],
  menu: ["set", "unset", "clear"],
  store: ["watch", "unwatch", "set", "unset", "get"],
  title: ["set"],
  flash: ["primary", "success", "info", "danger", "warning"]
});

class LoggerStore extends EventEmitter {
  constructor() {
    this.reset();
    this._registerInterests();
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  replaceState(state) {
    this._state = state;
    this.emitChange();
  }

  reset() {
    this._state = Immutable.List();
  }

  getLogs() {
    return this._state;
  }

  hasWildcardSubtype(data) {
    return whitelist.get(data.type).contains("*");
  }

  isSubtypeInWhitelist(data) {
    if (this.hasWildcardSubtype(data)) {
      return true;
    }
    return whitelist.get(data.type).contains(data.payload.type);
  }

  isTypeInWhitelist(data) {
    return whitelist.has(data.type);
  }

  _receivePostMessage(data) {
    if(this.isTypeInWhitelist(data) && this.isSubtypeInWhitelist(data)) {
      data = Immutable.fromJS(data)
        .set("direction", "from");
      this._state = this._state.push(Immutable.Map(data));
    }
  }

  _registerInterests() {
    this.dispatchIndex = AppDispatcher.register((action) => {
      switch(action.type) {
        case ActionTypes.RECEIVE_POST_MESSAGE:
          this._receivePostMessage(action.payload);
        break;
      }
      this.emitChange();
      return true;
    });
  }
}

module.exports = new LoggerStore();
