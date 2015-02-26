"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var EventEmitter = require("events").EventEmitter;
var Constants = require("../constants/app_constants");
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = Constants.ChangeTypes.APP_CHANGE;
var State = require("./state");

class AppStore extends EventEmitter {
  constructor() {
    this.registerInterests();
    this._state = State.initial();
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

  reset() {
    this.replaceState(State.initial());
  }

  replaceState(state) {
    this._state = state;
    this.emitChange();
  }

  getApp() {
    return this._state;
  }

  registerInterests() {
    AppDispatcher.register((action) => {
      switch(action.type) {
        case ActionTypes.RECEIVE_POST_MESSAGE:
          this.replaceState({ status: "ready" });
        break;
      }
      return true;
    });
  }
}

module.exports = new AppStore();
