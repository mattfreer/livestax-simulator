"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var EventEmitter = require("events").EventEmitter;
var Constants = require("../constants/app_constants");
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = Constants.ChangeTypes.APP_CHANGE;
var Immutable = require("immutable");

class FlashMessageStore extends EventEmitter {
  constructor() {
    this.reset();
    this._registerInterests();
  }

  reset() {
    this.replaceState(Immutable.fromJS({
      flash: null
    }));
  }

  emitChange(data) {
    this.emit(CHANGE_EVENT, data);
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
      this._receiveFlashPostMessage(data);
    }
  }

  _receiveFlashPostMessage(data) {
    if(data.payload.type === "clear") {
      this.reset();
    } else {
      this.setState(["flash"], Immutable.fromJS(data.payload));
    }
  }

  _receiveFlashInteraction(data) {
    this.reset();
    this.emitChange(data.interaction);
  }

  _registerInterests() {
    AppDispatcher.register((action) => {
      switch(action.type) {
        case ActionTypes.RECEIVE_POST_MESSAGE:
          this._receivePostMessage(action.payload);
        break;

        case ActionTypes.FLASH_INTERACTION:
          this._receiveFlashInteraction(action.payload);
        break;

        case ActionTypes.CLEAR_FLASH:
          this.reset();
        break;

        case ActionTypes.RECEIVE_APP_CONFIGURATION:
          this.reset();
        break;
      }
    });
  }
}

module.exports = new FlashMessageStore();
