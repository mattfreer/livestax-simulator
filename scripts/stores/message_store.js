"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var EventEmitter = require("events").EventEmitter;
var Constants = require("../constants/app_constants");
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = Constants.ChangeTypes.APP_CHANGE;
var State = require("./message_state");
var Immutable = require("immutable");

class MessageStore extends EventEmitter {
  constructor() {
    this.reset();
    this._registerInterests();
  }

  emitChange() {
    this.emit(CHANGE_EVENT, this._state);
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
    if(!Immutable.is(state, Immutable.fromJS(state))) {
      console.warn("replaceState expects an Immutable data structure");
    }
    this._state = state;
    this.emitChange();
  }

  getMessage() {
    return this._state;
  }

  _receiveGeneratedMessage(data) {
    this.replaceState(data);
  }

  _registerInterests() {
    AppDispatcher.register((action) => {
      switch(action.type) {
        case ActionTypes.RECEIVE_GENERATED_MESSAGE:
          this._receiveGeneratedMessage(action.payload);
        break;
      }
    });
  }
}

module.exports = new MessageStore();
