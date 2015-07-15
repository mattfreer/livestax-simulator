"use strict";
var keyMirror = require("react/lib/keyMirror");

module.exports = {
  ActionTypes: keyMirror({
    RECEIVE_POST_MESSAGE: null,
    RECEIVE_APP_CONFIGURATION: null,
    RECEIVE_STORE_CONFIGURATION: null,
    DELETE_STORE_ITEM: null,
    RECEIVE_GENERATED_MESSAGE: null,
    START_APP_TIMEOUT: null,
    CLEAR_LOG: null,
    FLASH_INTERACTION: null,
    CLEAR_FLASH: null,
    MENU_INTERACTION: null,
    DELETE_HISTORY_ITEM: null,
    CLEAR_HISTORY: null,
    DIALOG_INTERACTION: null,
    CLEAR_DIALOG: null
  }),
  ChangeTypes: keyMirror({
    APP_CHANGE: null,
    MENU_CHANGE: null,
    LOG_CHANGE: null,
    HISTORY_CHANGE: null,
    KEYVAL_CHANGE: null,
    AUTHENTICATE_CHANGE: null
  }),
  History: {
    APPS: "apps",
    MESSAGES: "messages"
  },
  Timer: {
    DURATION: 10000,
  }
};
