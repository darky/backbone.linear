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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZmxhdC9pbmRleC5qcyIsInNyYy9iYWNrYm9uZS5saW5lYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGZsYXQgPSBtb2R1bGUuZXhwb3J0cyA9IGZsYXR0ZW5cbmZsYXR0ZW4uZmxhdHRlbiA9IGZsYXR0ZW5cbmZsYXR0ZW4udW5mbGF0dGVuID0gdW5mbGF0dGVuXG5cbmZ1bmN0aW9uIGZsYXR0ZW4odGFyZ2V0LCBvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9XG5cbiAgdmFyIGRlbGltaXRlciA9IG9wdHMuZGVsaW1pdGVyIHx8ICcuJ1xuICB2YXIgbWF4RGVwdGggPSBvcHRzLm1heERlcHRoXG4gIHZhciBjdXJyZW50RGVwdGggPSAxXG4gIHZhciBvdXRwdXQgPSB7fVxuXG4gIGZ1bmN0aW9uIHN0ZXAob2JqZWN0LCBwcmV2KSB7XG4gICAgT2JqZWN0LmtleXMob2JqZWN0KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHZhbHVlID0gb2JqZWN0W2tleV1cbiAgICAgIHZhciBpc2FycmF5ID0gb3B0cy5zYWZlICYmIEFycmF5LmlzQXJyYXkodmFsdWUpXG4gICAgICB2YXIgdHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSlcbiAgICAgIHZhciBpc2J1ZmZlciA9IGlzQnVmZmVyKHZhbHVlKVxuICAgICAgdmFyIGlzb2JqZWN0ID0gKFxuICAgICAgICB0eXBlID09PSBcIltvYmplY3QgT2JqZWN0XVwiIHx8XG4gICAgICAgIHR5cGUgPT09IFwiW29iamVjdCBBcnJheV1cIlxuICAgICAgKVxuXG4gICAgICB2YXIgbmV3S2V5ID0gcHJldlxuICAgICAgICA/IHByZXYgKyBkZWxpbWl0ZXIgKyBrZXlcbiAgICAgICAgOiBrZXlcblxuICAgICAgaWYgKCFvcHRzLm1heERlcHRoKSB7XG4gICAgICAgIG1heERlcHRoID0gY3VycmVudERlcHRoICsgMTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc2FycmF5ICYmICFpc2J1ZmZlciAmJiBpc29iamVjdCAmJiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoICYmIGN1cnJlbnREZXB0aCA8IG1heERlcHRoKSB7XG4gICAgICAgICsrY3VycmVudERlcHRoXG4gICAgICAgIHJldHVybiBzdGVwKHZhbHVlLCBuZXdLZXkpXG4gICAgICB9XG5cbiAgICAgIG91dHB1dFtuZXdLZXldID0gdmFsdWVcbiAgICB9KVxuICB9XG5cbiAgc3RlcCh0YXJnZXQpXG5cbiAgcmV0dXJuIG91dHB1dFxufVxuXG5mdW5jdGlvbiB1bmZsYXR0ZW4odGFyZ2V0LCBvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9XG5cbiAgdmFyIGRlbGltaXRlciA9IG9wdHMuZGVsaW1pdGVyIHx8ICcuJ1xuICB2YXIgb3ZlcndyaXRlID0gb3B0cy5vdmVyd3JpdGUgfHwgZmFsc2VcbiAgdmFyIHJlc3VsdCA9IHt9XG5cbiAgdmFyIGlzYnVmZmVyID0gaXNCdWZmZXIodGFyZ2V0KVxuICBpZiAoaXNidWZmZXIgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRhcmdldCkgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIHRhcmdldFxuICB9XG5cbiAgLy8gc2FmZWx5IGVuc3VyZSB0aGF0IHRoZSBrZXkgaXNcbiAgLy8gYW4gaW50ZWdlci5cbiAgZnVuY3Rpb24gZ2V0a2V5KGtleSkge1xuICAgIHZhciBwYXJzZWRLZXkgPSBOdW1iZXIoa2V5KVxuXG4gICAgcmV0dXJuIChcbiAgICAgIGlzTmFOKHBhcnNlZEtleSkgfHxcbiAgICAgIGtleS5pbmRleE9mKCcuJykgIT09IC0xXG4gICAgKSA/IGtleVxuICAgICAgOiBwYXJzZWRLZXlcbiAgfVxuXG4gIE9iamVjdC5rZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgc3BsaXQgPSBrZXkuc3BsaXQoZGVsaW1pdGVyKVxuICAgIHZhciBrZXkxID0gZ2V0a2V5KHNwbGl0LnNoaWZ0KCkpXG4gICAgdmFyIGtleTIgPSBnZXRrZXkoc3BsaXRbMF0pXG4gICAgdmFyIHJlY2lwaWVudCA9IHJlc3VsdFxuXG4gICAgd2hpbGUgKGtleTIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHR5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocmVjaXBpZW50W2tleTFdKVxuICAgICAgdmFyIGlzb2JqZWN0ID0gKFxuICAgICAgICB0eXBlID09PSBcIltvYmplY3QgT2JqZWN0XVwiIHx8XG4gICAgICAgIHR5cGUgPT09IFwiW29iamVjdCBBcnJheV1cIlxuICAgICAgKVxuXG4gICAgICBpZiAoKG92ZXJ3cml0ZSAmJiAhaXNvYmplY3QpIHx8ICghb3ZlcndyaXRlICYmIHJlY2lwaWVudFtrZXkxXSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICByZWNpcGllbnRba2V5MV0gPSAoXG4gICAgICAgICAgdHlwZW9mIGtleTIgPT09ICdudW1iZXInICYmXG4gICAgICAgICAgIW9wdHMub2JqZWN0ID8gW10gOiB7fVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHJlY2lwaWVudCA9IHJlY2lwaWVudFtrZXkxXVxuICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAga2V5MSA9IGdldGtleShzcGxpdC5zaGlmdCgpKVxuICAgICAgICBrZXkyID0gZ2V0a2V5KHNwbGl0WzBdKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVuZmxhdHRlbiBhZ2FpbiBmb3IgJ21lc3N5IG9iamVjdHMnXG4gICAgcmVjaXBpZW50W2tleTFdID0gdW5mbGF0dGVuKHRhcmdldFtrZXldLCBvcHRzKVxuICB9KVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBCdWZmZXIgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcih2YWx1ZSlcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgXywgQmFja2JvbmUsXG4gIGdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30sXG4gIGZhY3RvcnkgPSBmdW5jdGlvbiAoXywgQmFja2JvbmUpIHtcblxuICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICBCQUNLQk9ORS1MSU5FQVItUFJJVkFURVxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgdmFyIGZsYXQgPSByZXF1aXJlKFwiZmxhdFwiKSxcbiAgICAgIHRyYW5zZm9ybVRvQXJyYXkgPSBmdW5jdGlvbiAob2JqZWN0LCBmb3JjZUFycmF5KSB7XG4gICAgICAgIHZhciBvYmpJblBhdGg7XG4gICAgICAgIF8uZWFjaChmb3JjZUFycmF5LCBmdW5jdGlvbiAocGF0aCkge1xuICAgICAgICAgIGlmIChfLmlzQXJyYXkob2JqZWN0W3BhdGhdKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBpZiAob2JqZWN0W3BhdGhdICE9IG51bGwpIHtcbiAgICAgICAgICAgIG9iamVjdFtwYXRoXSA9IFtvYmplY3RbcGF0aF1dO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmpJblBhdGggPSB7fTtcbiAgICAgICAgICAgIG9iamVjdCA9IF8uY2hhaW4ob2JqZWN0KVxuICAgICAgICAgICAgICAucGFpcnMoKS5tYXAoZnVuY3Rpb24gKHBhaXIpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gcGFpclswXSxcbiAgICAgICAgICAgICAgICAgIHZhbCA9IHBhaXJbMV07XG4gICAgICAgICAgICAgICAgaWYgKGtleS5tYXRjaChSZWdFeHAoXCJeXCIgKyBwYXRoKSkpIHtcbiAgICAgICAgICAgICAgICAgIG9iakluUGF0aFtrZXkubWF0Y2goL1xcLihcXHcrKSQvKVsxXV0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFtrZXksIHZhbF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuY29tcGFjdCgpLm9iamVjdCgpLnZhbHVlKCk7XG4gICAgICAgICAgICBpZiAoXy5zaXplKG9iakluUGF0aCkpIHtcbiAgICAgICAgICAgICAgb2JqZWN0W3BhdGhdID0gW29iakluUGF0aF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBvYmplY3RbcGF0aF0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgICAgfSxcblxuICAgICAgTGluZWFyTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIEJBQ0tCT05FIDEuMi4xXG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIHBhcnNlIDogZnVuY3Rpb24gKHJlc3AsIG9wdGlvbnMpIHtcbiAgICAgICAgICB2YXIgcGFyZW50Q2FsbCA9IExpbmVhck1vZGVsLl9fc3VwZXJfXy5wYXJzZS5jYWxsKHRoaXMsIHJlc3AsIG9wdGlvbnMpLFxuICAgICAgICAgICAgZmxhdE9wdGlvbnMsIHJlc3VsdCwgaGFzRm9yY2VBcnJheTtcbiAgICAgICAgICBpZiAocGFyZW50Q2FsbCA9PSBudWxsIHx8IHBhcmVudENhbGwgPT09IFwiXCIgfHwgcGFyZW50Q2FsbCBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRDYWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmbGF0T3B0aW9ucyA9IF8uY2xvbmUoXy5yZXN1bHQodGhpcywgXCJmbGF0T3B0aW9uc1wiKSk7XG4gICAgICAgICAgaGFzRm9yY2VBcnJheSA9IF8uaXNBcnJheShmbGF0T3B0aW9ucy5mb3JjZUFycmF5KTtcbiAgICAgICAgICBpZiAoaGFzRm9yY2VBcnJheSkge1xuICAgICAgICAgICAgZmxhdE9wdGlvbnMuc2FmZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdCA9IExpbmVhck1vZGVsLmZsYXR0ZW4ocGFyZW50Q2FsbCwgZmxhdE9wdGlvbnMpO1xuICAgICAgICAgIGlmIChoYXNGb3JjZUFycmF5KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNmb3JtVG9BcnJheShyZXN1bHQsIGZsYXRPcHRpb25zLmZvcmNlQXJyYXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzeW5jIDogZnVuY3Rpb24gKG1ldGhvZCwgbW9kZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgICB2YXIgb3B0cztcbiAgICAgICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtZXRob2QgPT09IFwiY3JlYXRlXCIgfHwgbWV0aG9kID09PSBcInVwZGF0ZVwiIHx8IG1ldGhvZCA9PT0gXCJwYXRjaFwiKSB7XG4gICAgICAgICAgICBvcHRzID0gXy5leHRlbmQoe30sIG9wdGlvbnMsXG4gICAgICAgICAgICAgIG1ldGhvZCA9PT0gXCJwYXRjaFwiID8ge2F0dHJzIDogTGluZWFyTW9kZWwudW5mbGF0dGVuKFxuICAgICAgICAgICAgICAgIG9wdGlvbnMuYXR0cnMsXG4gICAgICAgICAgICAgICAgXy5yZXN1bHQodGhpcywgXCJmbGF0T3B0aW9uc1wiKVxuICAgICAgICAgICAgICApfSA6IHt1bmZsYXQgOiB0cnVlfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBMaW5lYXJNb2RlbC5fX3N1cGVyX18uc3luYy5jYWxsKHRoaXMsIG1ldGhvZCwgbW9kZWwsIG9wdHMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTGluZWFyTW9kZWwuX19zdXBlcl9fLnN5bmMuY2FsbCh0aGlzLCBtZXRob2QsIG1vZGVsLCBvcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9KU09OIDogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChvcHRpb25zLnVuZmxhdCkge1xuICAgICAgICAgICAgcmV0dXJuIExpbmVhck1vZGVsLnVuZmxhdHRlbihcbiAgICAgICAgICAgICAgTGluZWFyTW9kZWwuX19zdXBlcl9fLnRvSlNPTi5jYWxsKHRoaXMsIG9wdGlvbnMpLFxuICAgICAgICAgICAgICBfLnJlc3VsdCh0aGlzLCBcImZsYXRPcHRpb25zXCIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTGluZWFyTW9kZWwuX19zdXBlcl9fLnRvSlNPTi5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICBCQUNLQk9ORS1MSU5FQVItUFVCTElDXG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgZmxhdE9wdGlvbnMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHtzYWZlIDogdHJ1ZX07XG4gICAgICAgIH1cblxuICAgICAgfSwge1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgRkxBVCAxLjYuMFxuICAgICAgICAqKioqKioqKioqKioqKioqICovXG4gICAgICAgIGZsYXR0ZW4gOiBmdW5jdGlvbiAodGFyZ2V0LCBvcHRzKSB7XG4gICAgICAgICAgaWYgKG9wdHMgPT0gbnVsbCkge1xuICAgICAgICAgICAgb3B0cyA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAob3B0cy5zYWZlID09IG51bGwpIHtcbiAgICAgICAgICAgIG9wdHMuc2FmZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmbGF0LmZsYXR0ZW4odGFyZ2V0LCBvcHRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICB1bmZsYXR0ZW4gOiBmdW5jdGlvbiAodGFyZ2V0LCBvcHRzKSB7XG4gICAgICAgICAgaWYgKG9wdHMgPT0gbnVsbCkge1xuICAgICAgICAgICAgb3B0cyA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmxhdC51bmZsYXR0ZW4odGFyZ2V0LCBvcHRzKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgIHJldHVybiBCYWNrYm9uZS5MaW5lYXJNb2RlbCA9IExpbmVhck1vZGVsO1xuICB9O1xuXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKFtcInVuZGVyc2NvcmVcIiwgXCJiYWNrYm9uZVwiXSwgZnVuY3Rpb24gKF8sIEJhY2tib25lKSB7XG4gICAgZ2xvYmFsLkJhY2tib25lLkxpbmVhck1vZGVsID0gZmFjdG9yeShfLCBCYWNrYm9uZSk7XG4gIH0pO1xufSBlbHNlIGlmIChtb2R1bGUgIT0gbnVsbCAmJiBtb2R1bGUuZXhwb3J0cykge1xuICBfID0gZ2xvYmFsLl8gfHwgcmVxdWlyZShcInVuZGVyc2NvcmVcIiksXG4gIEJhY2tib25lID0gZ2xvYmFsLkJhY2tib25lIHx8IHJlcXVpcmUoXCJiYWNrYm9uZVwiKTtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KF8sIEJhY2tib25lKTtcbn1cbiJdfQ==
