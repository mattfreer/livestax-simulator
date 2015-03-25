"use strict";

require("../test_helper");
var React = require("react/addons");
var jwt = require("jwt-simple");
var Immutable = require("immutable");
var TestUtils = React.addons.TestUtils;
var SignedRequestApp = require("../../scripts/components/signed_request_app");

describe("SignedRequestAll", () => {
  var payload, app;

  beforeEach(() => {
    payload = Immutable.Map({
      instance_id: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      timestamp: 1425988009,
      user_id: "aaaaaaaa-aaaa-5aaa-9aaa-aaaaaaaaaaaa",
      is_admin: true,
      is_guest: false
    });
  });

  afterEach(() => {
    React.unmountComponentAtNode(app.getDOMNode().parentNode);
  });

  it("populates the signed request input", () => {
    var postData = Immutable.fromJS({
      secret_key: "bananas",
      payload: payload
    });
    app = TestUtils.renderIntoDocument(<SignedRequestApp src="examples/test_app.html" postData={postData} />);
    var input = TestUtils.findRenderedDOMComponentWithTag(app, "input");
    var expected = jwt.encode(payload, "bananas");
    expect(input.getDOMNode().value).to.eql(expected);
  });

  describe("for a guest user", () => {
    it("sets the user id to null", () => {
      var guestPayload = payload.set("is_admin", false).set("is_guest", true);
      var postData = Immutable.fromJS({
        secret_key: "bananas",
        payload: guestPayload
      });
      app = TestUtils.renderIntoDocument(<SignedRequestApp src="examples/test_app.html" postData={postData} />);
      var input = TestUtils.findRenderedDOMComponentWithTag(app, "input");
      var expected = jwt.encode(guestPayload.set("user_id", null), "bananas");
      expect(input.getDOMNode().value).to.eql(expected);
    });
  });
});
