"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var ActionTypes = require("../constants/app_constants").ActionTypes;

var AppActions = {
  receivePostMessage(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_POST_MESSAGE,
      payload: data
    });
  }
};

module.exports = AppActions;
