"use strict";

class DialogProjections {
  orderedButtons(buttons) {
    var order = [ "cancel", "default", "info", "ok", "danger"];

    return buttons.sort(function(a,b) {
      var aIndex = order.indexOf(a.get("type"));
      var bIndex = order.indexOf(b.get("type"));

      if(aIndex === bIndex) {
        return 0;
      }
      if(aIndex < bIndex) {
        return -1;
      }
      if(aIndex > bIndex) {
        return 1;
      }
    });
  }
}

module.exports = new DialogProjections();
