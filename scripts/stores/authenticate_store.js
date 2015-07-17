"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var EventEmitter = require("events").EventEmitter;
var Constants = require("../constants/app_constants");
var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = Constants.ChangeTypes.AUTHENTICATE_CHANGE;
var Immutable = require("immutable");
var AuthenticateIncident = require("../incidents/authenticate_incident");

class AuthenticateStore extends EventEmitter {
  constructor() {
    this.reset();
    this._registerInterests();
  }

  reset() {
    this.replaceState(Immutable.fromJS({
      authRequest: null
    }));
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

  getAuthRequest() {
    return this._state.get("authRequest");
  }

  _receivePostMessage(data) {
    if(data.type === "authenticate") {
      if(data.payload.type === "response") {
        AuthenticateIncident.responded();
        this.reset();
        this.emitChange(data.payload);

      } else {
        this.setState(["authRequest"], Immutable.fromJS(data.payload.data));
      }
    }
  }

  _registerInterests() {
    AppDispatcher.register((action) => {
      switch(action.type) {
        case ActionTypes.RECEIVE_POST_MESSAGE:
          this._receivePostMessage(action.payload);
        break;
        case ActionTypes.RECEIVE_APP_CONFIGURATION:
          this.reset();
        break;
        case ActionTypes.OPEN_AUTHENTICATE_WINDOW:
          AuthenticateIncident.openWindow(action.payload.url)
        break;
      }
    });
  }
}

module.exports = new AuthenticateStore();
