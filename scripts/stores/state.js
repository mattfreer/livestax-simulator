"use strict";

var Immutable = require("immutable");
var moment = require("moment");

module.exports = {
  initial() {
    return Immutable.fromJS({
      status: "loading",
      app: {
        name: "Test App",
        namespace: "test-app",
        url: "examples/app.html"
      },
      post_data: {
        use_post: false,
        secret_key: "293da16e7a31cd27666f3332675d644d",
        payload: {
          instance_id: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          timestamp: moment().unix().toString(),
          user_id: "aaaaaaaa-aaaa-5aaa-9aaa-aaaaaaaaaaaa",
          is_admin: false,
          is_guest: true,
        }
      }
    });
  }
};

