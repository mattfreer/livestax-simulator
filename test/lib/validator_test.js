"use strict";

require("../test_helper");
var Validator = require("../../scripts/lib/validator");
var validate = Validator.validate;
var Immutable = require("immutable");

describe("validate", () => {
  it("returns all keys as empty when there are no errors", function() {
    var state = Immutable.fromJS({
      name: "User",
      age: 23,
      password: "hunter2",
      password_confirm: "hunter2"
    });
    var validations = {
      name: [Validator.required],
      age: [Validator.required]
    };
    var expected = Immutable.fromJS({
      name: [],
      age: []
    });
    expect(Immutable.is(validate(state, validations), expected)).eql(true);
  });

  it("returns Can't be blank for fields that are required", function() {
    var state = Immutable.fromJS({
      name: "",
      age: null,
      password: "hunter2",
      password_confirm: "hunter2"
    });
    var validations = {
      name: [Validator.required],
      age: [Validator.required]
    };
    var expected = Immutable.fromJS({
      name: ["Can't be blank"],
      age: ["Can't be blank"]
    });
    expect(Immutable.is(validate(state, validations), expected)).eql(true);
  });

  it("returns Must be a number for numeric fields", function() {
    var state = Immutable.fromJS({
      name: "User",
      age: "23",
      password: "hunter2",
      password_confirm: "hunter2"
    });
    var validations = {
      age: [Validator.numeric]
    };
    var expected = Immutable.fromJS({
      age: ["Must be a number"]
    });
    expect(Immutable.is(validate(state, validations), expected)).eql(true);
  });

  it("allows a customer validator", function() {
    var state = Immutable.fromJS({
      name: "User",
      age: "23",
      password: "hunter2",
      password_confirm: "hunter3"
    });
    var validations = {
      password: [
        (field) => {
          if (field !== state.get("password_confirm")) {
            return "Must match password_confirm";
          }
        }
      ]
    };
    var expected = Immutable.fromJS({
      password: ["Must match password_confirm"]
    });
    expect(Immutable.is(validate(state, validations), expected)).eql(true);
  });


  it("validates multiple fields", function() {
    var state = Immutable.fromJS({
      name: "",
      age: null,
      password: "hunter2",
      password_confirm: "hunter2"
    });
    var validations = {
      name: [Validator.required],
      age: [Validator.required, Validator.numeric]
    };
    var expected = Immutable.fromJS({
      name: ["Can't be blank"],
      age: ["Can't be blank", "Must be a number"]
    });
    expect(Immutable.is(validate(state, validations), expected)).eql(true);
  });

  it("only performs each validation once", function() {
    var state = Immutable.fromJS({
      name: "",
      age: null,
      password: "hunter2",
      password_confirm: "hunter2"
    });
    var validations = {
      name: [Validator.required, Validator.required],
      age: [Validator.required]
    };
    var expected = Immutable.fromJS({
      name: ["Can't be blank"],
      age: ["Can't be blank"]
    });
    expect(Immutable.is(validate(state, validations), expected)).eql(true);
  });
});

