"use strict";

require("../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var AppStore = require("../../scripts/stores/app_store");
var AppConfigurator = require("../../scripts/components/app_configurator");
var AppActions = require("../../scripts/actions/app_actions");
var Immutable = require("immutable");

describe("AppConfigurator", () => {
  var appConfigurator, inputs, form;

  beforeEach(() => {
    AppStore.reset();
    appConfigurator = TestUtils.renderIntoDocument(React.createElement(AppConfigurator));
    inputs = TestUtils.scryRenderedDOMComponentsWithTag(appConfigurator, "input");
    form = TestUtils.findRenderedDOMComponentWithTag(appConfigurator, "form");
  });

  afterEach(() => {
    React.unmountComponentAtNode(appConfigurator.getDOMNode().parentNode);
  });

  it("displays a form with the store values", () => {
    var app = AppStore.getApp();
    expect(inputs[0].getDOMNode().value).to.eql(app.getIn(["app", "name"]));
    expect(inputs[1].getDOMNode().value).to.eql(app.getIn(["app", "namespace"]));
    expect(inputs[2].getDOMNode().value).to.eql(app.getIn(["app", "url"]));
  });

  it("doesn't display the signed request form", () => {
    var element = appConfigurator.getDOMNode().querySelector("#signed-request-form");
    expect(element.className).to.include("hidden");
  });

  describe("when the form is changed with valid data", () => {
    beforeEach(() => {
      TestUtils.Simulate.change(inputs[0].getDOMNode(), {
        target: {
          name: "name",
          value: "New Value"
        }
      });
    });

    it("shows the new value in the input box", () => {
      expect(inputs[0].getDOMNode().value).to.eql("New Value");
    });

    it("doesn't show any errors", function() {
      TestUtils.Simulate.submit(form.getDOMNode());
      expect(appConfigurator.getDOMNode().textContent).to.not.include("Can't be blank");
    });

    it("Updates the store with the new state on submit", () => {
      var oldName = AppStore.getApp().getIn(["app", "name"]);
      TestUtils.Simulate.submit(form.getDOMNode());
      var newName = AppStore.getApp().getIn(["app", "name"]);
      expect(oldName).to.not.equal(newName);
      expect(newName).to.eql("New Value");
    });
  });

  describe("when the form is changed with invalid data", () => {
    beforeEach(() => {
      TestUtils.Simulate.change(inputs[0].getDOMNode(), {
        target: {
          name: "name",
          value: ""
        }
      });

      TestUtils.Simulate.change(inputs[1].getDOMNode(), {
        target: {
          name: "namespace",
          value: "invalid namespace"
        }
      });
    });

    it("highlights the errors to the fields", () => {
      expect(appConfigurator.getDOMNode().textContent).to.not.include("Can't be blank");
      expect(appConfigurator.getDOMNode().textContent).to.not.include("Must only contain lowercase letters, numbers and dashes");
      TestUtils.Simulate.submit(form.getDOMNode());
      expect(appConfigurator.getDOMNode().textContent).to.include("Can't be blank");
      expect(appConfigurator.getDOMNode().textContent).to.include("Must only contain lowercase letters, numbers and dashes");
    });

    it("updates the use post checkbox", function() {
      var usePostInput = appConfigurator.getDOMNode().querySelector(`input[name="use_post"]`);
      expect(usePostInput.checked).to.eql(false);
      TestUtils.Simulate.change(usePostInput, {});
      expect(usePostInput.checked).to.eql(true);
    });
  });

  describe("when app is configured to use post", () => {
    var inputs;

    beforeEach(() => {
      AppActions.receiveAppConfiguration(
        Immutable.fromJS({
          app: {
            name: "Test App",
            namespace: "test-app",
            url: "examples/app.html",
            use_post: true,
          },
          post_data: {
            secret_key: "293da16e7a31cd27666f3332675d644d",
            payload: {
              instance_id: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
              timestamp: "0",
              user_id: "aaaaaaaa-aaaa-5aaa-9aaa-aaaaaaaaaaaa",
              is_admin: false,
              is_guest: true,
            }
          }
        })
      );

      inputs = Immutable.Map({
        "name": null,
        "namespace": null,
        "url": null,
        "use_post": null,
        "secret_key": null,
        "instance_id": null,
        "timestamp": null,
        "user_id": null
      })
      .map((field, key) => {
        return appConfigurator.getDOMNode().querySelector(`input[name="${key}"]`);
      });
      var radios = appConfigurator.getDOMNode().querySelectorAll(`input[name="user_type"]`);

      inputs = inputs.set("is_guest", radios[0]);
      inputs = inputs.set("is_admin", radios[1]);
    });

    it("displays the signed request form", () => {
      var element = appConfigurator.getDOMNode().querySelector("#signed-request-form");
      expect(element.className).to.not.include("hidden");
    });

    it("populates the signed request form fields", () => {
      var app = AppStore.getApp();
      expect(inputs.get("use_post").checked).to.eql(app.getIn(["app", "use_post"]));
      expect(inputs.get("secret_key").value).to.eql(app.getIn(["post_data", "secret_key"]));
      expect(inputs.get("instance_id").value).to.eql(app.getIn(["post_data", "payload", "instance_id"]));
      expect(inputs.get("timestamp").value).to.eql(app.getIn(["post_data", "payload", "timestamp"]));
      expect(inputs.get("user_id").value).to.eql(app.getIn(["post_data", "payload", "user_id"]));
      expect(inputs.get("is_admin").checked).to.eql(app.getIn(["post_data", "payload", "is_admin"]));
      expect(inputs.get("is_guest").checked).to.eql(app.getIn(["post_data", "payload", "is_guest"]));
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
            target: { name: key, value: value }
          });
        });
      });

      it("shows the new value in the input box", () => {
        expect(inputs.get("secret_key").value).to.eql("bbbbb");
        expect(inputs.get("instance_id").value).to.eql("instance");
        expect(inputs.get("timestamp").value).to.eql("12345");
        expect(inputs.get("user_id").value).to.eql("aaaaaaaa-aaaa-5aaa-9aaa-aaaaaaaaaaab");
      });

      it("updates the user type", function() {
        expect(inputs.get("is_guest").checked).to.eql(true);
        expect(inputs.get("is_admin").checked).to.eql(false);
        TestUtils.Simulate.change(inputs.get("is_admin"), {
          target: { value: "is_admin" }
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
        var errors = Immutable.List(appConfigurator.getDOMNode().querySelectorAll(".help-block"))
          .map((item) => { return item.textContent; })
          .filter((item) => { return item === "Can't be blank"; });
        expect(errors.size).to.eql(2);
      });
    });
  });
});
