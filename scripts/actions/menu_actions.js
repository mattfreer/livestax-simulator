"use strict";

var AppDispatcher = require("../dispatchers/app_dispatcher");
var ActionTypes = require("../constants/app_constants").ActionTypes;

var MenuActions = {
  menuInteraction(name) {
    AppDispatcher.dispatch({
      type: ActionTypes.MENU_INTERACTION,
      payload: name
    });
  }
};

module.exports = MenuActions;
