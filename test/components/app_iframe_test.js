"use strict";

require("../test_helper");
var React = require("react/addons");
var TestUtils = React.addons.TestUtils;
var MessageStore = require("../../scripts/stores/message_store");
var AppIframe = require("../../scripts/components/app_iframe");
var MessageActions = require("../../scripts/actions/message_actions");
var Immutable = require("immutable");

describe("AppIframe", () => {
  var appIframe, iframe, contentWindow;

  beforeEach(() => {
    MessageStore.reset();
  });

  describe("postMessage", () => {

    beforeEach(() => {
      appIframe = TestUtils.renderIntoDocument(<AppIframe postData={Immutable.Map()} />);
      iframe = TestUtils.findRenderedDOMComponentWithTag(appIframe, "iframe");
      contentWindow = iframe.getDOMNode().contentWindow;

      if(contentWindow.hasOwnProperty("postMessage")) {
        sinon.spy(contentWindow, "postMessage");
      } else {
        contentWindow.postMessage = sinon.stub();
      }
    });

    describe("when a message is received with a JSON value", () => {
      beforeEach(() => {
        MessageActions.receiveGeneratedMessage(Immutable.Map({
          namespace: "another-app",
          key: "some-data",
          value: "{\"foo\": [1, 2, \"bar\"]}"
        }));
      });

      it("sends a trigger postMessage", () => {
        expect(contentWindow.postMessage).to.have.been.calledWith({
          type: "trigger",
          payload: {
            type: "another-app.some-data",
            data: { foo: [1, 2, "bar"] }
          }
        });
      });
    });

    describe("when a message is received with a non-JSON value", () => {
      beforeEach(() => {
        MessageActions.receiveGeneratedMessage(Immutable.Map({
          namespace: "another-app",
          key: "selected",
          value: 3
        }));
      });

      it("sends a trigger postMessage", () => {
        expect(contentWindow.postMessage).to.have.been.calledWith({
          type: "trigger",
          payload: {
            type: "another-app.selected",
            data: 3
          }
        });
      });
    });
  });

  describe("When use_post is true", () => {
    it("renders a form and an iframe", () => {
      var postData = Immutable.fromJS({use_post: true, payload: {}, secret_key: "key"});
      appIframe = TestUtils.renderIntoDocument(<AppIframe postData={postData} />);
      iframe = TestUtils.findRenderedDOMComponentWithTag(appIframe, "iframe");
      var form = TestUtils.findRenderedDOMComponentWithTag(appIframe, "form");
      expect(iframe.getDOMNode()).to.not.eql(null);
      expect(form.getDOMNode()).to.not.eql(null);
    });
  });

  describe("When use_post is false", () => {
    it("doesn't render a form", () => {
      var postData = Immutable.fromJS({use_post: false, payload: {}, secret_key: "key"});
      appIframe = TestUtils.renderIntoDocument(<AppIframe postData={postData} />);
      iframe = TestUtils.findRenderedDOMComponentWithTag(appIframe, "iframe");
      var forms = TestUtils.scryRenderedDOMComponentsWithTag(appIframe, "form");
      expect(iframe.getDOMNode()).to.not.eql(null);
      expect(forms.length).to.eql(0);
    });
  });
});
