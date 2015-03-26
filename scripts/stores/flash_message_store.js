"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var EventEmitter = require("events").EventEmitter;
var Constants = require("../constants/app_constants");
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = Constants.ChangeTypes.APP_CHANGE;
var Immutable = require("immutable");

class FlashMessageStore extends EventEmitter {
  constructor() {
    this._state = Immutable.Map();
    this._registerInterests();
  }

  emitChange() {
    this.emit(CHANGE_EVENT, this._state);
  }

  setState(path, value) {
    this._state = this._state.setIn(path, value);
    this.emitChange();
  }

  replaceState(state) {
    if(!Immutable.is(state, Immutable.fromJS(state))) {
      console.warn("replaceState expects an Immutable data structure");
    }
    this._state = state;
    this.emitChange();
  }

  getFlash() {
    return this._state.get("flash");
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  _receivePostMessage(data) {
    if(data.type === "flash") {
      this.setState(["flash"], Immutable.fromJS(data.payload));
    }
  }

  _registerInterests() {
    AppDispatcher.register((action) => {
      switch(action.type) {
        case ActionTypes.RECEIVE_POST_MESSAGE:
          this._receivePostMessage(action.payload);
        break;
      }
    });
  }
}

module.exports = new FlashMessageStore();
