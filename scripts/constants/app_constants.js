"use strict";
var keyMirror = require("react/lib/keyMirror");

module.exports = {
  ActionTypes: keyMirror({
    RECEIVE_POST_MESSAGE: null,
    RECEIVE_SIGNED_REQUEST: null,
    RECEIVE_APP_CONFIGURATION: null,
    RECEIVE_GENERATED_MESSAGE: null,
    START_APP_TIMEOUT: null,
    DELETE_HISTORY_ITEM: null
  }),
  ChangeTypes: keyMirror({
    APP_CHANGE: null,
    HISTORY_CHANGE: null
  }),
  History: {
    APPS: "apps",
    MESSAGES: "messages"
  },
  Timer: {
    DURATION: 10000,
  }
};
