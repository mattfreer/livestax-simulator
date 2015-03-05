"use strict";

module.exports = (data) => {
  try {
    return JSON.parse(data);
  } catch(e) {
    return data;
  }
};
