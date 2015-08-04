/* eslint-env amd, jquery, mocha */
/* global Backbone, chai, requirejs */

describe("Backbone.Linear test api", function () { // eslint-disable-line
  "use strict";

  /* ***************************
       FAKE-SERVER-RESPONSES
  *************************** */
  $.ajax.fake.registerWebservice("/fake_data/simple", function (data) {
    if (data != null) {
      return JSON.parse(data);
    } else {
      return {
        Cats: {
          Boris: {
            age: 3,
            weight: 4
          },
          Milla: {
            age: 1,
            weight: 2
          }
        }
      };
    }
  });

  $.ajax.fake.registerWebservice("/fake_data/safe", function (data) {
    if (data != null) {
      return JSON.parse(data);
    } else {
      return {
        Cats: {
          Boris: {
            toys: [
              "ball",
              "mouse"
            ]
          }
        }
      };
    }
  });

  $.ajax.fake.registerWebservice("/fake_data/force_array", function (data) {
    if (data != null) {
      return JSON.parse(data);
    } else {
      return {
        Cats: {
          Boris: {
            age: 3,
            weight: 3,
            toys: {
              item: "ball"
            },
            eyes: [
              "left_eye",
              "right_eye"
            ]
          },
          Milla: {
            age: 1,
            weight: 2
          }
        }
      };
    }
  });


  /* ************
       DEFINE
  ************ */
  beforeEach(function () {
    var LinearModelClass = Backbone.LinearModel.extend({
      urlRoot: "/fake_data"
    });

    this.linearModel = new LinearModelClass();
    this.linearModel.set("id", "simple");
  });


  /* ***********
       TESTS
  *********** */
  it("simple parse from server", function (done) {
    this.linearModel.fetch({
      fake: true,
      wait: 30,

      success: function (model) {
        var attrs = model.attributes;

        chai.expect(attrs).have.property("Cats.Boris.age", 3);
        chai.expect(attrs).have.property("Cats.Boris.weight", 4);
        chai.expect(attrs).have.property("Cats.Milla.age", 1);
        chai.expect(attrs).have.property("Cats.Milla.weight", 2);

        done();
      }
    });
  });

  it("simple send to server", function (done) {
    this.linearModel.set({
      "Cats.Boris.age": 3,
      "Cats.Boris.weight": 4,
      "Cats.Milla.age": 1,
      "Cats.Milla.weight": 2
    });

    this.linearModel.save(null, {
      fake: true,
      wait: 30,

      success: function (model, mirrored) {
        chai.expect(mirrored).have.deep.property("Cats.Boris.age", 3);
        chai.expect(mirrored).have.deep.property("Cats.Boris.weight", 4);
        chai.expect(mirrored).have.deep.property("Cats.Milla.age", 1);
        chai.expect(mirrored).have.deep.property("Cats.Milla.weight", 2);

        done();
      }
    });
  });

  it("parse by `delimiter` from server", function (done) {
    this.linearModel.flatOptions = {delimiter: "-"};

    this.linearModel.fetch({
      fake: true,
      wait: 30,

      success: function (model) {
        var attrs = model.attributes;

        chai.expect(attrs).have.property("Cats-Boris-age", 3);
        chai.expect(attrs).have.property("Cats-Boris-weight", 4);
        chai.expect(attrs).have.property("Cats-Milla-age", 1);
        chai.expect(attrs).have.property("Cats-Milla-weight", 2);

        done();
      }
    });
  });

  it("send to server with `delimiter`", function (done) {
    this.linearModel.set({
      "Cats-Boris-age": 3,
      "Cats-Boris-weight": 4,
      "Cats-Milla-age": 1,
      "Cats-Milla-weight": 2
    });
    this.linearModel.flatOptions = {delimiter: "-"};

    this.linearModel.save(null, {
      fake: true,
      wait: 30,

      success: function (model, mirrored) {
        chai.expect(mirrored).have.deep.property("Cats.Boris.age", 3);
        chai.expect(mirrored).have.deep.property("Cats.Boris.weight", 4);
        chai.expect(mirrored).have.deep.property("Cats.Milla.age", 1);
        chai.expect(mirrored).have.deep.property("Cats.Milla.weight", 2);

        done();
      }
    });
  });

  it("parse without `safe` from server", function (done) {
    this.linearModel.set("id", "safe");
    this.linearModel.flatOptions = {safe: false};
    this.linearModel.fetch({
      fake: true,
      wait: 30,

      success: function (model) {
        var attrs = model.attributes;

        chai.expect(attrs).have.property("Cats.Boris.toys.0", "ball");
        chai.expect(attrs).have.property("Cats.Boris.toys.1", "mouse");

        done();
      }
    });
  });

  it("parse by `safe` from server", function (done) {
    this.linearModel.set("id", "safe");
    this.linearModel.fetch({
      fake: true,
      wait: 30,

      success: function (model) {
        chai.expect(model.attributes["Cats.Boris.toys"])
        .have.members(["ball", "mouse"]);

        done();
      }
    });
  });

  it("send to server without `object`", function (done) {
    this.linearModel.set({
      "Cats.Boris.toys.0": "ball",
      "Cats.Boris.toys.1": "mouse"
    });
    this.linearModel.save(null, {
      fake: true,
      wait: 30,

      success: function (model, mirrored) {
        chai.expect(mirrored.Cats.Boris.toys)
        .have.members(["ball", "mouse"]);

        done();
      }
    });
  });

  it("send to server with `object`", function (done) {
    this.linearModel.set({
      "Cats.Boris.toys.0": "ball",
      "Cats.Boris.toys.1": "mouse"
    });
    this.linearModel.flatOptions = {object: true};
    this.linearModel.save(null, {
      fake: true,
      wait: 30,

      success: function (model, mirrored) {
        var object = mirrored.Cats.Boris.toys;

        chai.expect(object).a("object");
        chai.expect(object).not.a("array");
        chai.expect(object["0"]).equal("ball");
        chai.expect(object["1"]).equal("mouse");

        done();
      }
    });
  });

  it("`force_array` server repsonse", function (done) {
    this.linearModel.set("id", "force_array");
    this.linearModel.flatOptions = {
      forceArray: [
        "Cats.Boris.age",
        "Cats.Boris.eyes",
        "Cats.Boris.toys",
        "Cats.Milla.toys"
      ]
    };
    this.linearModel.fetch({
      fake: true,
      wait: 30,

      success: function (model) {
        var attrs = model.attributes;

        chai.expect([
          attrs["Cats.Boris.age"],
          attrs["Cats.Boris.eyes"],
          attrs["Cats.Boris.toys"],
          attrs["Cats.Milla.toys"]
        ])
        .all.a("array");

        chai.expect(attrs["Cats.Boris.age"]).have.members([3]);
        chai.expect(attrs["Cats.Boris.eyes"])
        .have.members(["left_eye", "right_eye"]);
        chai.expect(attrs["Cats.Boris.toys"][0])
        .have.property("item", "ball");
        chai.expect(attrs["Cats.Milla.toys"]).length(0);

        done();
      }
    });
  });

  it("send to server without `overwrite`", function (done) {
    this.linearModel.set({
      "Cats.Boris.toys": "exists",
      "Cats.Boris.toys.0": "ball"
    });
    this.linearModel.save(null, {
      fake: true,
      wait: true,

      success: function (model, mirrored) {
        chai.expect(mirrored.Cats.Boris.toys)
        .equal("exists");
        done();
      }
    });
  });

  it("send to server with `overwrite`", function (done) {
    this.linearModel.set({
      "Cats.Boris.toys": "exists",
      "Cats.Boris.toys.0": "ball"
    });
    this.linearModel.flatOptions = {overwrite: true};
    this.linearModel.save(null, {
      fake: true,
      wait: true,

      success: function (model, mirrored) {
        chai.expect(mirrored.Cats.Boris.toys[0])
        .equal("ball");
        done();
      }
    });
  });

  it("server response with `maxDepth`", function (done) {
    this.linearModel.flatOptions = {maxDepth: 2};
    this.linearModel.fetch({
      fake: true,
      wait: true,

      success: function (model) {
        var attrs = model.attributes;
        chai.expect(attrs["Cats.Boris"].age).equal(3);
        chai.expect(attrs["Cats.Boris"].weight).equal(4);
        chai.expect(attrs["Cats.Milla"].age).equal(1);
        chai.expect(attrs["Cats.Milla"].weight).equal(2);
        done();
      }
    });
  });

  it("check AMD", function (done) {
    requirejs.config({
      paths: {
        backbone: "base/bower_components/backbone/backbone",
        jquery: "base/bower_components/jquery/dist/jquery",
        underscore: "base/bower_components/underscore/underscore"
      }
    });

    require(["base/dist/backbone.linear.js"], function (LinearModelAMD) {
      chai.expect(LinearModelAMD)
      .equal(Backbone.LinearModel);
      done();
    });
  });
});
