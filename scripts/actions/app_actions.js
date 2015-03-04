"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var ActionTypes = require("../constants/app_constants").ActionTypes;

var AppActions = {
  receivePostMessage(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_POST_MESSAGE,
      payload: data
    });
  },
  receiveAppConfiguration(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_APP_CONFIGURATION,
      payload: data
    });
  },
  startAppTimeout(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.START_APP_TIMEOUT,
      payload: data
    });
  },
  receiveGeneratedMessage(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_GENERATED_MESSAGE,
      payload: data
    });
  },
};

module.exports = AppActions;
