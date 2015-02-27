"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var EventEmitter = require("events").EventEmitter;
var Constants = require("../constants/app_constants");
var ActionTypes = Constants.ActionTypes;
var AppActions = require("../actions/app_actions");
var CHANGE_EVENT = Constants.ChangeTypes.APP_CHANGE;
var State = require("./state");
var Timer = require("./timer");

class AppStore extends EventEmitter {
  constructor() {
    this._registerInterests();
    this._timer = new Timer();
    this._subscribeToTimer();
    this.reset();
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
    AppActions.startAppTimeout({ duration: Constants.Timer.DURATION });
  }

  replaceState(state) {
    this._state = state;
    this.emitChange();
  }

  getApp() {
    return this._state;
  }

  _startTimer(data) {
    this._timer.start(data.duration);
  }

  _subscribeToTimer() {
    this._timer.on("complete", () => {
      this.replaceState({ status: "timeout" });
    });
  }

  _receivePostMessage(data) {
    if(data.type === "ready") {
      this._timer.cancel();
      this.replaceState({ status: "ready" });
    }
  }

  _registerInterests() {
    AppDispatcher.register((action) => {
      switch(action.type) {
        case ActionTypes.RECEIVE_POST_MESSAGE:
          this._receivePostMessage(action.payload);
        break;

        case ActionTypes.START_APP_TIMEOUT:
          this._startTimer(action.payload);
        break;
      }
      return true;
    });
  }
}

module.exports = new AppStore();
