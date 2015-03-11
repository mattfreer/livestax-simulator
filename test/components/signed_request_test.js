"use strict";

require("../test_helper");
var React = require("react/addons");
var Immutable = require("immutable");
var TestUtils = React.addons.TestUtils;
var AppStore = require("../../scripts/stores/app_store");
var SignedRequest = require("../../scripts/components/signed_request");

describe("SignedRequest", () => {
  var signedRequest, inputs, form;

  beforeEach(() => {
    AppStore.reset();
    AppStore.setState(["post_data", "use_post"], false);
    AppStore.setState(["post_data", "payload", "is_admin"], false);
    AppStore.setState(["post_data", "payload", "is_guest"], true);
    signedRequest = TestUtils.renderIntoDocument(<SignedRequest />);
    form = TestUtils.findRenderedDOMComponentWithTag(signedRequest, "form");
    inputs = Immutable.Map({
      "use_post": null,
      "secret_key": null,
      "instance_id": null,
      "timestamp": null,
      "user_id": null
    })
    .map((field, key) => {
      return signedRequest.getDOMNode().querySelector(`input[name="${key}"]`);
    });
    var radios = signedRequest.getDOMNode().querySelectorAll(`input[name="user_type"]`);

    inputs = inputs.set("is_guest", radios[0]);
    inputs = inputs.set("is_admin", radios[1]);
  });

  it("toggles the user_id field depending on the value of user_type", function() {
    expect(inputs.get("user_id").disabled).to.eql(true);
    TestUtils.Simulate.change(inputs.get("is_admin"), {
      target: {
        value: "is_admin"
      }
    });
    expect(inputs.get("user_id").disabled).to.eql(false);
  });

  it("displays a form with the default store values", () => {
    var app = AppStore.getApp();
    expect(inputs.get("use_post").checked).to.eql(app.getIn(["post_data", "use_post"]));
    expect(inputs.get("secret_key").value).to.eql(app.getIn(["post_data", "secret_key"]));
    expect(inputs.get("instance_id").value).to.eql(app.getIn(["post_data", "payload", "instance_id"]));
    expect(inputs.get("timestamp").value).to.eql(app.getIn(["post_data", "payload", "timestamp"]));
    expect(inputs.get("user_id").value).to.eql(app.getIn(["post_data", "payload", "user_id"]));
    expect(inputs.get("is_admin").checked).to.eql(app.getIn(["post_data", "payload", "is_admin"]));
    expect(inputs.get("is_guest").checked).to.eql(app.getIn(["post_data", "payload", "is_guest"]));
  });

  describe("when the form is changed with valid data", () => {
    beforeEach(() => {
      Immutable.Map({
        secret_key: "bbbbb",
        instance_id: "instance",
        timestamp: "12345",
        user_id: "aaaaaaaa-aaaa-5aaa-9aaa-aaaaaaaaaaab"
      })
      .map((value, key) => {
        TestUtils.Simulate.change(inputs.get(key), {
          target: {
            name: key,
            value: value
          }
        });
      });
    });

    it("shows the new value in the input box", () => {
      expect(inputs.get("secret_key").value).to.eql("bbbbb");
      expect(inputs.get("instance_id").value).to.eql("instance");
      expect(inputs.get("timestamp").value).to.eql("12345");
      expect(inputs.get("user_id").value).to.eql("aaaaaaaa-aaaa-5aaa-9aaa-aaaaaaaaaaab");
    });

    it("updates the use post checkbox", function() {
      expect(inputs.get("use_post").checked).to.eql(false);
      TestUtils.Simulate.change(inputs.get("use_post"), {});
      expect(inputs.get("use_post").checked).to.eql(true);
    });

    it("updates the user type", function() {
      expect(inputs.get("is_guest").checked).to.eql(true);
      expect(inputs.get("is_admin").checked).to.eql(false);
      TestUtils.Simulate.change(inputs.get("is_admin"), {
        target: {
          value: "is_admin"
        }
      });
      expect(inputs.get("is_guest").checked).to.eql(false);
      expect(inputs.get("is_admin").checked).to.eql(true);
    });


    it("Updates the store with the new state on submit", () => {
      var oldPostData = AppStore.getApp().get("post_data");
      TestUtils.Simulate.submit(form.getDOMNode());
      var newPostData = AppStore.getApp().get("post_data");
      expect(Immutable.is(oldPostData, newPostData)).to.eql(false);
      expect(newPostData.get("secret_key")).to.eql("bbbbb");
      expect(newPostData.getIn(["payload", "instance_id"])).to.eql("instance");
    });

    it("doesn't show any errors", function() {
      TestUtils.Simulate.submit(form.getDOMNode());
      expect(form.getDOMNode().textContent).to.not.include("Can't be blank");
    });
  });

  describe("when the form is changed with invalid data", () => {
    beforeEach(() => {
      Immutable.Map({
        secret_key: "",
        instance_id: ""
      })
      .map((value, key) => {
        TestUtils.Simulate.change(inputs.get(key), {
          target: {
            name: key,
            value: value
          }
        });
      });
    });

    it("highlights the errors to the fields", () => {
      TestUtils.Simulate.submit(form.getDOMNode());
      var errors = Immutable.List(signedRequest.getDOMNode().querySelectorAll(".help-block"))
        .map((item) => { return item.textContent; })
        .filter((item) => { return item === "Can't be blank"; });
      expect(errors.length).to.eql(2);
    });
  });
});
