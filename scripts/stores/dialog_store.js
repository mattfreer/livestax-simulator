"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var EventEmitter = require("events").EventEmitter;
var Constants = require("../constants/app_constants");
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = Constants.ChangeTypes.APP_CHANGE;
var Immutable = require("immutable");

class DialogStore extends EventEmitter {
  constructor() {
    this.reset();
    this._registerInterests();
  }

  reset() {
    this.replaceState(Immutable.fromJS({
      dialog: null
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

  getDialog() {
    return this._state.get("dialog");
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  _receivePostMessage(data) {
    if(data.type === "dialog") {
      this.setState(["dialog"], Immutable.fromJS(data.payload.data));
    }
  }

  _receiveDialogInteraction(data) {
    this.reset();
    this.emitChange(data.interaction);
  }

  _registerInterests() {
    AppDispatcher.register((action) => {
      switch(action.type) {
        case ActionTypes.RECEIVE_POST_MESSAGE:
          this._receivePostMessage(action.payload);
        break;
        case ActionTypes.DIALOG_INTERACTION:
          this._receiveDialogInteraction(action.payload);
        break;
      }
    });
  }
}

module.exports = new DialogStore();
