"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var ActionTypes = require("../constants/app_constants").ActionTypes;

var MessageActions = {
  receiveGeneratedMessage(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_GENERATED_MESSAGE,
      payload: data
    });
  },
};

module.exports = MessageActions;
