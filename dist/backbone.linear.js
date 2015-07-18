(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.Backbone || (g.Backbone = {})).LinearModel = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var flat = module.exports = flatten
flatten.flatten = flatten
flatten.unflatten = unflatten

function flatten(target, opts) {
  opts = opts || {}

  var delimiter = opts.delimiter || '.'
  var maxDepth = opts.maxDepth
  var currentDepth = 1
  var output = {}

  function step(object, prev) {
    Object.keys(object).forEach(function(key) {
      var value = object[key]
      var isarray = opts.safe && Array.isArray(value)
      var type = Object.prototype.toString.call(value)
      var isbuffer = isBuffer(value)
      var isobject = (
        type === "[object Object]" ||
        type === "[object Array]"
      )

      var newKey = prev
        ? prev + delimiter + key
        : key

      if (!opts.maxDepth) {
        maxDepth = currentDepth + 1;
      }

      if (!isarray && !isbuffer && isobject && Object.keys(value).length && currentDepth < maxDepth) {
        ++currentDepth
        return step(value, newKey)
      }

      output[newKey] = value
    })
  }

  step(target)

  return output
}

function unflatten(target, opts) {
  opts = opts || {}

  var delimiter = opts.delimiter || '.'
  var overwrite = opts.overwrite || false
  var result = {}

  var isbuffer = isBuffer(target)
  if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
    return target
  }

  // safely ensure that the key is
  // an integer.
  function getkey(key) {
    var parsedKey = Number(key)

    return (
      isNaN(parsedKey) ||
      key.indexOf('.') !== -1
    ) ? key
      : parsedKey
  }

  Object.keys(target).forEach(function(key) {
    var split = key.split(delimiter)
    var key1 = getkey(split.shift())
    var key2 = getkey(split[0])
    var recipient = result

    while (key2 !== undefined) {
      var type = Object.prototype.toString.call(recipient[key1])
      var isobject = (
        type === "[object Object]" ||
        type === "[object Array]"
      )

      if ((overwrite && !isobject) || (!overwrite && recipient[key1] === undefined)) {
        recipient[key1] = (
          typeof key2 === 'number' &&
          !opts.object ? [] : {}
        )
      }

      recipient = recipient[key1]
      if (split.length > 0) {
        key1 = getkey(split.shift())
        key2 = getkey(split[0])
      }
    }

    // unflatten again for 'messy objects'
    recipient[key1] = unflatten(target[key], opts)
  })

  return result
}

function isBuffer(value) {
  if (typeof Buffer === 'undefined') return false
  return Buffer.isBuffer(value)
}

},{}],2:[function(require,module,exports){
"use strict";

var _, Backbone,
  global = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : {},
  factory = function (_, Backbone) {

    /* *****************************
         BACKBONE-LINEAR-PRIVATE
    ***************************** */
    var flat = require("flat"),
      transformToArray = function (object, forceArray) {
        var objInPath;
        _.each(forceArray, function (path) {
          if (_.isArray(object[path])) {
            return;
          } else if (object[path] != null) {
            object[path] = [object[path]];
          } else {
            objInPath = {};
            object = _.chain(object)
              .pairs().map(function (pair) {
                var key = pair[0],
                  val = pair[1];
                if (key.match(RegExp("^" + path))) {
                  objInPath[key.match(/\.(\w+)$/)[1]] = val;
                  return null;
                } else {
                  return [key, val];
                }
              })
              .compact().object().value();
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
        parse : function (resp, options) {
          var parentCall = LinearModel.__super__.parse.call(this, resp, options),
            flatOptions, result, hasForceArray;
          if (parentCall == null || parentCall === "" || parentCall instanceof this.constructor) {
            return parentCall;
          }
          flatOptions = _.clone(_.result(this, "flatOptions"));
          hasForceArray = _.isArray(flatOptions.forceArray);
          if (hasForceArray) {
            flatOptions.safe = true;
          }
          result = LinearModel.flatten(parentCall, flatOptions);
          if (hasForceArray) {
            return transformToArray(result, flatOptions.forceArray);
          } else {
            return result;
          }
        },

        sync : function (method, model, options) {
          var opts;
          if (options == null) {
            options = {};
          }
          if (method === "create" || method === "update" || method === "patch") {
            opts = _.extend({}, options,
              method === "patch" ? {attrs : LinearModel.unflatten(
                options.attrs,
                _.result(this, "flatOptions")
              )} : {unflat : true}
            );
            return LinearModel.__super__.sync.call(this, method, model, opts);
          } else {
            return LinearModel.__super__.sync.call(this, method, model, options);
          }
        },

        toJSON : function (options) {
          if (options == null) {
            options = {};
          }
          if (options.unflat) {
            return LinearModel.unflatten(
              LinearModel.__super__.toJSON.call(this, options),
              _.result(this, "flatOptions")
            );
          } else {
            return LinearModel.__super__.toJSON.call(this, options);
          }
        },


        /* ****************************
             BACKBONE-LINEAR-PUBLIC
        **************************** */
        flatOptions : function () {
          return {safe : true};
        }

      }, {
        /* ****************
             FLAT 1.6.0
        **************** */
        flatten : function (target, opts) {
          if (opts == null) {
            opts = {};
          }
          if (opts.safe == null) {
            opts.safe = true;
          }
          return flat.flatten(target, opts);
        },

        unflatten : function (target, opts) {
          if (opts == null) {
            opts = {};
          }
          return flat.unflatten(target, opts);
        }

      });

    return Backbone.LinearModel = LinearModel;
  };

if (typeof define === "function" && define.amd) {
  define(["underscore", "backbone"], function (_, Backbone) {
    global.Backbone.LinearModel = factory(_, Backbone);
  });
} else if (module != null && module.exports) {
  _ = global._ || require("underscore"),
  Backbone = global.Backbone || require("backbone");
  module.exports = factory(_, Backbone);
}

},{"backbone":undefined,"flat":1,"underscore":undefined}]},{},[2])(2)
});