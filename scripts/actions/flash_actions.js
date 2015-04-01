"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var ActionTypes = require("../constants/app_constants").ActionTypes;

var FlashActions = {
  flashInteraction(data) {
    AppDispatcher.dispatch({
      type: ActionTypes.FLASH_INTERACTION,
      payload: {
        interaction: data.type
      }
    });
  },

  clearFlash() {
    AppDispatcher.dispatch({
      type: ActionTypes.CLEAR_FLASH,
    });
  }
};

module.exports = FlashActions;
