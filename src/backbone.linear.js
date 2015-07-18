/* eslint-env amd, browser, node */
/* eslint no-mixed-requires: 0 */

"use strict";

var flat = require("flat"), global, factory = function (_, Backbone) {
  /* *****************************
       BACKBONE-LINEAR-PRIVATE
  ***************************** */
  var transformToArray = function (object, forceArray) {
    var objInPath;
    _.each(forceArray, function (path) {
      if (_.isArray(object[path])) {
        return;
      } else if (object[path] != null) {
        object[path] = [object[path]];
      } else {
        objInPath = {};
        object = _.chain(object).pairs().map(function (pair) {
          var key = pair[0], val = pair[1];
          if (key.match(RegExp("^" + path))) {
            objInPath[key.match(/\.(\w+)$/)[1]] = val;
            return null;
          } else {
            return [key, val];
          }
        }).compact().object().value();
        if (_.size(objInPath)) {
          object[path] = [objInPath];
        } else {
          object[path] = [];
        }
      }
    });
    return object;
  },

  LinearModel = Backbone.Model.extend({

    /* ********************
         BACKBONE 1.2.1
    ******************** */
    parse: function (resp, options) {
      var parentCall = Backbone.Model.prototype.parse.call(this, resp, options),
        flatOptions;
      switch (true) {
        case parentCall == null:
        case parentCall === "":
        case parentCall instanceof this.constructor:
          return parentCall;
      }
      flatOptions = _.clone(_.result(this, "flatOptions"));
      if (_.isArray(flatOptions.forceArray)) {
        flatOptions.safe = true;
        return transformToArray(
          LinearModel.flatten(parentCall, flatOptions),
          flatOptions.forceArray
        );
      } else {
        return LinearModel.flatten(parentCall, flatOptions);
      }
    },

    sync: function (method, model, options) {
      var opts;
      if (options == null) {
        options = {};
      }
      if (method === "create" || method === "update" || method === "patch") {
        opts = _.extend({}, options,
          method === "patch" ? {attrs: LinearModel.unflatten(
            options.attrs,
            _.result(this, "flatOptions")
          )} : {unflat: true}
        );
      }
      return Backbone.Model.prototype.sync.call(this, method, model, opts || options);
    },

    toJSON: function (options) {
      if (options == null) {
        options = {};
      }
      if (options.unflat) {
        return LinearModel.unflatten(
          Backbone.Model.prototype.toJSON.call(this, options),
          _.result(this, "flatOptions")
        );
      } else {
        return Backbone.Model.prototype.toJSON.call(this, options);
      }
    },


    /* ****************************
         BACKBONE-LINEAR-PUBLIC
    **************************** */
    flatOptions: function () {
      return {safe: true};
    }

  }, {

    /* ****************
         FLAT 1.6.0
    **************** */
    flatten: function (target, opts) {
      if (opts == null) {
        opts = {};
      }
      if (opts.safe == null) {
        opts.safe = true;
      }
      return flat.flatten(target, opts);
    },

    unflatten: function (target, opts) {
      if (opts == null) {
        opts = {};
      }
      return flat.unflatten(target, opts);
    }

  });

  Backbone.LinearModel = LinearModel;
  return LinearModel;
};

if (typeof global !== "undefined") {
  global = global;
} else if (typeof window !== "undefined") {
  global = window;
} else {
  global = {};
}

if (typeof define === "function" && define.amd) {
  define(["underscore", "backbone"], function (_, Backbone) {
    global.Backbone.LinearModel = factory(_, Backbone);
  });
} else if (module != null && module.exports) {
  module.exports = factory(
    global._ || require("underscore"),
    global.Backbone || require("backbone")
  );
}
