(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.Backbone || (g.Backbone = {})).LinearModel = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var factory = function factory(_, Backbone) {

  /* *****************************
       BACKBONE-LINEAR-PRIVATE
  ***************************** */
  var flat = require("flat"),
      transformToArray = function transformToArray(object, forceArray) {
    _.each(forceArray, function (path) {
      if (_.isArray(object[path])) {
        return;
      } else if (object[path] != null) {
        object[path] = [object[path]];
      } else {
        (function () {
          var objInPath = {};
          object = _.chain(object).pairs().map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2);

            var key = _ref2[0];
            var val = _ref2[1];

            if (key.match(RegExp("^" + path))) {
              objInPath["" + key.match(/\.(\w+)$/)[1]] = val;
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
        })();
      }
    });
    return object;
  };

  var LinearModel = (function (_Backbone$Model) {
    _inherits(LinearModel, _Backbone$Model);

    function LinearModel() {
      _classCallCheck(this, LinearModel);

      _get(Object.getPrototypeOf(LinearModel.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(LinearModel, [{
      key: "parse",

      /* ********************
           BACKBONE 1.2.1
      ******************** */
      value: function parse(resp, options) {
        var parentCall = _get(Object.getPrototypeOf(LinearModel.prototype), "parse", this).call(this, resp, options),
            flatOptions,
            result,
            hasForceArray;
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
      }
    }, {
      key: "sync",
      value: function sync(method, model) {
        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        if (method === "create" || method === "update" || method === "patch") {
          var opts = _.extend({}, options, method === "patch" ? { attrs: LinearModel.unflatten(options.attrs, _.result(this, "flatOptions")) } : { unflat: true });
          return _get(Object.getPrototypeOf(LinearModel.prototype), "sync", this).call(this, method, model, opts);
        } else {
          return _get(Object.getPrototypeOf(LinearModel.prototype), "sync", this).call(this, method, model, options);
        }
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        if (options.unflat) {
          return LinearModel.unflatten(_get(Object.getPrototypeOf(LinearModel.prototype), "toJSON", this).call(this, options), _.result(this, "flatOptions"));
        } else {
          _get(Object.getPrototypeOf(LinearModel.prototype), "toJSON", this).call(this, options);
        }
      }
    }, {
      key: "flatOptions",

      /* ****************************
           BACKBONE-LINEAR-PUBLIC
      **************************** */
      value: function flatOptions() {
        return { safe: true };
      }
    }], [{
      key: "flatten",

      /* ****************
           FLAT 1.6.0
      **************** */
      value: function flatten(target) {
        var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        if (opts.safe == null) {
          opts.safe = true;
        }
        return flat.flatten(target, opts);
      }
    }, {
      key: "unflatten",
      value: function unflatten(target) {
        var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        return flat.unflatten(target, opts);
      }
    }]);

    return LinearModel;
  })(Backbone.Model);

  return Backbone.LinearModel = LinearModel;
};

if (typeof define === "function" && define.amd) {
  define(["underscore", "backbone"], function (_, Backbone) {
    global.Backbone.LinearModel = factory(_, Backbone);
  });
} else if (module != null && module.exports) {
  var _ = global._ || require("underscore"),
      Backbone = global.Backbone || require("backbone");
  module.exports = factory(_, Backbone);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"backbone":undefined,"flat":3,"underscore":undefined}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (Buffer){
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

}).call(this,require("buffer").Buffer)

},{"buffer":2}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGFya3kvRGVza3RvcC9iYWNrYm9uZS5saW5lYXIvYmFja2JvbmUubGluZWFyLmVzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9mbGF0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7O0FBRWIsSUFBSSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksQ0FBQyxFQUFFLFFBQVEsRUFBSzs7Ozs7QUFLM0IsTUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztNQUN4QixnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBSSxNQUFNLEVBQUUsVUFBVSxFQUFLO0FBQ3pDLEtBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQzNCLFVBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUMzQixlQUFPO09BQ1IsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDL0IsY0FBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7T0FDL0IsTUFBTTs7QUFDTCxjQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDbkIsZ0JBQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUNyQixLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFVLEVBQUs7dUNBQWYsSUFBVTs7Z0JBQVQsR0FBRztnQkFBRSxHQUFHOztBQUNyQixnQkFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sT0FBSyxJQUFJLENBQUcsQ0FBQyxFQUFFO0FBQ2pDLHVCQUFTLE1BQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRyxHQUFHLEdBQUcsQ0FBQztBQUMvQyxxQkFBTyxJQUFJLENBQUM7YUFDYixNQUFNO0FBQ0wscUJBQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDbkI7V0FDRixDQUFDLENBQ0QsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDOUIsY0FBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQ3JCLGtCQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztXQUM1QixNQUFNO0FBQ0wsa0JBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7V0FDbkI7O09BQ0Y7S0FDRixDQUFDLENBQUM7QUFDSCxXQUFPLE1BQU0sQ0FBQztHQUNmLENBQUM7O01BRUUsV0FBVztjQUFYLFdBQVc7O2FBQVgsV0FBVzs0QkFBWCxXQUFXOztpQ0FBWCxXQUFXOzs7aUJBQVgsV0FBVzs7Ozs7O2FBb0JULGVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtBQUNwQixZQUFJLFVBQVUsOEJBckJaLFdBQVcsdUNBcUJnQixJQUFJLEVBQUUsT0FBTyxDQUFDO1lBQUUsV0FBVztZQUFFLE1BQU07WUFBRSxhQUFhLENBQUM7QUFDaEYsWUFBSSxVQUFVLElBQUksSUFBSSxJQUFJLFVBQVUsS0FBSyxFQUFFLElBQUksVUFBVSxZQUFZLElBQUksQ0FBQyxXQUFXLEVBQUU7QUFDckYsaUJBQU8sVUFBVSxDQUFDO1NBQ25CO0FBQ0QsbUJBQVcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFDckQscUJBQWEsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNsRCxZQUFJLGFBQWEsRUFBRTtBQUNqQixxQkFBVyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDekI7QUFDRCxjQUFNLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDdEQsWUFBSSxhQUFhLEVBQUU7QUFDakIsaUJBQU8sZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN6RCxNQUFNO0FBQ0wsaUJBQU8sTUFBTSxDQUFDO1NBQ2Y7T0FDRjs7O2FBRUksY0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFnQjtZQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDL0IsWUFBSSxNQUFNLEtBQUssUUFBUSxJQUFJLE1BQU0sS0FBSyxRQUFRLElBQUksTUFBTSxLQUFLLE9BQU8sRUFBRTtBQUNwRSxjQUFJLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQzdCLE1BQU0sS0FBSyxPQUFPLEdBQUcsRUFBQyxLQUFLLEVBQUcsV0FBVyxDQUFDLFNBQVMsQ0FDakQsT0FBTyxDQUFDLEtBQUssRUFDYixDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FDOUIsRUFBQyxHQUFHLEVBQUMsTUFBTSxFQUFHLElBQUksRUFBQyxDQUNyQixDQUFDO0FBQ0YsNENBOUNBLFdBQVcsc0NBOENPLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO1NBQ3hDLE1BQU07QUFDTCw0Q0FoREEsV0FBVyxzQ0FnRE8sTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7U0FDM0M7T0FDRjs7O2FBRU0sa0JBQWU7WUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQ2xCLFlBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNsQixpQkFBTyxXQUFXLENBQUMsU0FBUyw0QkF0RDVCLFdBQVcsd0NBdURJLE9BQU8sR0FDcEIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQzlCLENBQUM7U0FDSCxNQUFNO0FBQ0wscUNBM0RBLFdBQVcsd0NBMkRFLE9BQU8sRUFBRTtTQUN2QjtPQUNGOzs7Ozs7O2FBTVcsdUJBQUc7QUFDYixlQUFPLEVBQUMsSUFBSSxFQUFHLElBQUksRUFBQyxDQUFDO09BQ3RCOzs7Ozs7O2FBaEVjLGlCQUFDLE1BQU0sRUFBYTtZQUFYLElBQUkseURBQUcsRUFBRTs7QUFDL0IsWUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtBQUNyQixjQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUNsQjtBQUNELGVBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDbkM7OzthQUVnQixtQkFBQyxNQUFNLEVBQWE7WUFBWCxJQUFJLHlEQUFHLEVBQUU7O0FBQ2pDLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDckM7OztXQWRHLFdBQVc7S0FBUyxRQUFRLENBQUMsS0FBSzs7QUF3RXhDLFNBQU8sUUFBUSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7Q0FDM0MsQ0FBQzs7QUFFSixJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFO0FBQzlDLFFBQU0sQ0FBQyxDQUFDLFlBQVksRUFBRSxVQUFVLENBQUMsRUFBRSxVQUFDLENBQUMsRUFBRSxRQUFRLEVBQUs7QUFDbEQsVUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUNwRCxDQUFDLENBQUM7Q0FDSixNQUFNLElBQUksTUFBTSxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQzNDLE1BQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQztNQUN2QyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEQsUUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQ3ZDOzs7OztBQ3ZIRDs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZmFjdG9yeSA9IChfLCBCYWNrYm9uZSkgPT4ge1xuXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgIEJBQ0tCT05FLUxJTkVBUi1QUklWQVRFXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICB2YXIgZmxhdCA9IHJlcXVpcmUoXCJmbGF0XCIpLFxuICAgICAgdHJhbnNmb3JtVG9BcnJheSA9IChvYmplY3QsIGZvcmNlQXJyYXkpID0+IHtcbiAgICAgICAgXy5lYWNoKGZvcmNlQXJyYXksIChwYXRoKSA9PiB7XG4gICAgICAgICAgaWYgKF8uaXNBcnJheShvYmplY3RbcGF0aF0pKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIGlmIChvYmplY3RbcGF0aF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgb2JqZWN0W3BhdGhdID0gW29iamVjdFtwYXRoXV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBvYmpJblBhdGggPSB7fTtcbiAgICAgICAgICAgIG9iamVjdCA9IF8uY2hhaW4ob2JqZWN0KVxuICAgICAgICAgICAgICAucGFpcnMoKS5tYXAoKFtrZXksIHZhbF0pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5Lm1hdGNoKFJlZ0V4cChgXiR7cGF0aH1gKSkpIHtcbiAgICAgICAgICAgICAgICAgIG9iakluUGF0aFtgJHtrZXkubWF0Y2goL1xcLihcXHcrKSQvKVsxXX1gXSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gW2tleSwgdmFsXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jb21wYWN0KCkub2JqZWN0KCkudmFsdWUoKTtcbiAgICAgICAgICAgIGlmIChfLnNpemUob2JqSW5QYXRoKSkge1xuICAgICAgICAgICAgICBvYmplY3RbcGF0aF0gPSBbb2JqSW5QYXRoXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG9iamVjdFtwYXRoXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICB9O1xuXG4gICAgY2xhc3MgTGluZWFyTW9kZWwgZXh0ZW5kcyBCYWNrYm9uZS5Nb2RlbCB7XG5cbiAgICAgIC8qICoqKioqKioqKioqKioqKipcbiAgICAgICAgICAgRkxBVCAxLjYuMFxuICAgICAgKioqKioqKioqKioqKioqKiAqL1xuICAgICAgc3RhdGljIGZsYXR0ZW4gKHRhcmdldCwgb3B0cyA9IHt9KSB7XG4gICAgICAgIGlmIChvcHRzLnNhZmUgPT0gbnVsbCkge1xuICAgICAgICAgIG9wdHMuc2FmZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZsYXQuZmxhdHRlbih0YXJnZXQsIG9wdHMpO1xuICAgICAgfVxuXG4gICAgICBzdGF0aWMgdW5mbGF0dGVuICh0YXJnZXQsIG9wdHMgPSB7fSkge1xuICAgICAgICByZXR1cm4gZmxhdC51bmZsYXR0ZW4odGFyZ2V0LCBvcHRzKTtcbiAgICAgIH1cblxuXG4gICAgICAvKiAqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICBCQUNLQk9ORSAxLjIuMVxuICAgICAgKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgIHBhcnNlIChyZXNwLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBwYXJlbnRDYWxsID0gc3VwZXIucGFyc2UocmVzcCwgb3B0aW9ucyksIGZsYXRPcHRpb25zLCByZXN1bHQsIGhhc0ZvcmNlQXJyYXk7XG4gICAgICAgIGlmIChwYXJlbnRDYWxsID09IG51bGwgfHwgcGFyZW50Q2FsbCA9PT0gXCJcIiB8fCBwYXJlbnRDYWxsIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgIHJldHVybiBwYXJlbnRDYWxsO1xuICAgICAgICB9XG4gICAgICAgIGZsYXRPcHRpb25zID0gXy5jbG9uZShfLnJlc3VsdCh0aGlzLCBcImZsYXRPcHRpb25zXCIpKTtcbiAgICAgICAgaGFzRm9yY2VBcnJheSA9IF8uaXNBcnJheShmbGF0T3B0aW9ucy5mb3JjZUFycmF5KTtcbiAgICAgICAgaWYgKGhhc0ZvcmNlQXJyYXkpIHtcbiAgICAgICAgICBmbGF0T3B0aW9ucy5zYWZlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSBMaW5lYXJNb2RlbC5mbGF0dGVuKHBhcmVudENhbGwsIGZsYXRPcHRpb25zKTtcbiAgICAgICAgaWYgKGhhc0ZvcmNlQXJyYXkpIHtcbiAgICAgICAgICByZXR1cm4gdHJhbnNmb3JtVG9BcnJheShyZXN1bHQsIGZsYXRPcHRpb25zLmZvcmNlQXJyYXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3luYyAobWV0aG9kLCBtb2RlbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwiY3JlYXRlXCIgfHwgbWV0aG9kID09PSBcInVwZGF0ZVwiIHx8IG1ldGhvZCA9PT0gXCJwYXRjaFwiKSB7XG4gICAgICAgICAgbGV0IG9wdHMgPSBfLmV4dGVuZCh7fSwgb3B0aW9ucyxcbiAgICAgICAgICAgIG1ldGhvZCA9PT0gXCJwYXRjaFwiID8ge2F0dHJzIDogTGluZWFyTW9kZWwudW5mbGF0dGVuKFxuICAgICAgICAgICAgICBvcHRpb25zLmF0dHJzLFxuICAgICAgICAgICAgICBfLnJlc3VsdCh0aGlzLCBcImZsYXRPcHRpb25zXCIpXG4gICAgICAgICAgICApfSA6IHt1bmZsYXQgOiB0cnVlfVxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIHN1cGVyLnN5bmMobWV0aG9kLCBtb2RlbCwgb3B0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN1cGVyLnN5bmMobWV0aG9kLCBtb2RlbCwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdG9KU09OIChvcHRpb25zID0ge30pIHtcbiAgICAgICAgaWYgKG9wdGlvbnMudW5mbGF0KSB7XG4gICAgICAgICAgcmV0dXJuIExpbmVhck1vZGVsLnVuZmxhdHRlbihcbiAgICAgICAgICAgIHN1cGVyLnRvSlNPTihvcHRpb25zKSxcbiAgICAgICAgICAgIF8ucmVzdWx0KHRoaXMsIFwiZmxhdE9wdGlvbnNcIilcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN1cGVyLnRvSlNPTihvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG5cbiAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgQkFDS0JPTkUtTElORUFSLVBVQkxJQ1xuICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgZmxhdE9wdGlvbnMgKCkge1xuICAgICAgICByZXR1cm4ge3NhZmUgOiB0cnVlfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gQmFja2JvbmUuTGluZWFyTW9kZWwgPSBMaW5lYXJNb2RlbDtcbiAgfTtcblxuaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShbXCJ1bmRlcnNjb3JlXCIsIFwiYmFja2JvbmVcIl0sIChfLCBCYWNrYm9uZSkgPT4ge1xuICAgIGdsb2JhbC5CYWNrYm9uZS5MaW5lYXJNb2RlbCA9IGZhY3RvcnkoXywgQmFja2JvbmUpO1xuICB9KTtcbn0gZWxzZSBpZiAobW9kdWxlICE9IG51bGwgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgbGV0IF8gPSBnbG9iYWwuXyB8fCByZXF1aXJlKFwidW5kZXJzY29yZVwiKSxcbiAgICBCYWNrYm9uZSA9IGdsb2JhbC5CYWNrYm9uZSB8fCByZXF1aXJlKFwiYmFja2JvbmVcIik7XG4gIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShfLCBCYWNrYm9uZSk7XG59XG4iLG51bGwsInZhciBmbGF0ID0gbW9kdWxlLmV4cG9ydHMgPSBmbGF0dGVuXG5mbGF0dGVuLmZsYXR0ZW4gPSBmbGF0dGVuXG5mbGF0dGVuLnVuZmxhdHRlbiA9IHVuZmxhdHRlblxuXG5mdW5jdGlvbiBmbGF0dGVuKHRhcmdldCwgb3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fVxuXG4gIHZhciBkZWxpbWl0ZXIgPSBvcHRzLmRlbGltaXRlciB8fCAnLidcbiAgdmFyIG1heERlcHRoID0gb3B0cy5tYXhEZXB0aFxuICB2YXIgY3VycmVudERlcHRoID0gMVxuICB2YXIgb3V0cHV0ID0ge31cblxuICBmdW5jdGlvbiBzdGVwKG9iamVjdCwgcHJldikge1xuICAgIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IG9iamVjdFtrZXldXG4gICAgICB2YXIgaXNhcnJheSA9IG9wdHMuc2FmZSAmJiBBcnJheS5pc0FycmF5KHZhbHVlKVxuICAgICAgdmFyIHR5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpXG4gICAgICB2YXIgaXNidWZmZXIgPSBpc0J1ZmZlcih2YWx1ZSlcbiAgICAgIHZhciBpc29iamVjdCA9IChcbiAgICAgICAgdHlwZSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIiB8fFxuICAgICAgICB0eXBlID09PSBcIltvYmplY3QgQXJyYXldXCJcbiAgICAgIClcblxuICAgICAgdmFyIG5ld0tleSA9IHByZXZcbiAgICAgICAgPyBwcmV2ICsgZGVsaW1pdGVyICsga2V5XG4gICAgICAgIDoga2V5XG5cbiAgICAgIGlmICghb3B0cy5tYXhEZXB0aCkge1xuICAgICAgICBtYXhEZXB0aCA9IGN1cnJlbnREZXB0aCArIDE7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNhcnJheSAmJiAhaXNidWZmZXIgJiYgaXNvYmplY3QgJiYgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCAmJiBjdXJyZW50RGVwdGggPCBtYXhEZXB0aCkge1xuICAgICAgICArK2N1cnJlbnREZXB0aFxuICAgICAgICByZXR1cm4gc3RlcCh2YWx1ZSwgbmV3S2V5KVxuICAgICAgfVxuXG4gICAgICBvdXRwdXRbbmV3S2V5XSA9IHZhbHVlXG4gICAgfSlcbiAgfVxuXG4gIHN0ZXAodGFyZ2V0KVxuXG4gIHJldHVybiBvdXRwdXRcbn1cblxuZnVuY3Rpb24gdW5mbGF0dGVuKHRhcmdldCwgb3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fVxuXG4gIHZhciBkZWxpbWl0ZXIgPSBvcHRzLmRlbGltaXRlciB8fCAnLidcbiAgdmFyIG92ZXJ3cml0ZSA9IG9wdHMub3ZlcndyaXRlIHx8IGZhbHNlXG4gIHZhciByZXN1bHQgPSB7fVxuXG4gIHZhciBpc2J1ZmZlciA9IGlzQnVmZmVyKHRhcmdldClcbiAgaWYgKGlzYnVmZmVyIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0YXJnZXQpICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiB0YXJnZXRcbiAgfVxuXG4gIC8vIHNhZmVseSBlbnN1cmUgdGhhdCB0aGUga2V5IGlzXG4gIC8vIGFuIGludGVnZXIuXG4gIGZ1bmN0aW9uIGdldGtleShrZXkpIHtcbiAgICB2YXIgcGFyc2VkS2V5ID0gTnVtYmVyKGtleSlcblxuICAgIHJldHVybiAoXG4gICAgICBpc05hTihwYXJzZWRLZXkpIHx8XG4gICAgICBrZXkuaW5kZXhPZignLicpICE9PSAtMVxuICAgICkgPyBrZXlcbiAgICAgIDogcGFyc2VkS2V5XG4gIH1cblxuICBPYmplY3Qua2V5cyh0YXJnZXQpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIHNwbGl0ID0ga2V5LnNwbGl0KGRlbGltaXRlcilcbiAgICB2YXIga2V5MSA9IGdldGtleShzcGxpdC5zaGlmdCgpKVxuICAgIHZhciBrZXkyID0gZ2V0a2V5KHNwbGl0WzBdKVxuICAgIHZhciByZWNpcGllbnQgPSByZXN1bHRcblxuICAgIHdoaWxlIChrZXkyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHJlY2lwaWVudFtrZXkxXSlcbiAgICAgIHZhciBpc29iamVjdCA9IChcbiAgICAgICAgdHlwZSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIiB8fFxuICAgICAgICB0eXBlID09PSBcIltvYmplY3QgQXJyYXldXCJcbiAgICAgIClcblxuICAgICAgaWYgKChvdmVyd3JpdGUgJiYgIWlzb2JqZWN0KSB8fCAoIW92ZXJ3cml0ZSAmJiByZWNpcGllbnRba2V5MV0gPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgcmVjaXBpZW50W2tleTFdID0gKFxuICAgICAgICAgIHR5cGVvZiBrZXkyID09PSAnbnVtYmVyJyAmJlxuICAgICAgICAgICFvcHRzLm9iamVjdCA/IFtdIDoge31cbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICByZWNpcGllbnQgPSByZWNpcGllbnRba2V5MV1cbiAgICAgIGlmIChzcGxpdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGtleTEgPSBnZXRrZXkoc3BsaXQuc2hpZnQoKSlcbiAgICAgICAga2V5MiA9IGdldGtleShzcGxpdFswXSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1bmZsYXR0ZW4gYWdhaW4gZm9yICdtZXNzeSBvYmplY3RzJ1xuICAgIHJlY2lwaWVudFtrZXkxXSA9IHVuZmxhdHRlbih0YXJnZXRba2V5XSwgb3B0cylcbiAgfSlcblxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgQnVmZmVyID09PSAndW5kZWZpbmVkJykgcmV0dXJuIGZhbHNlXG4gIHJldHVybiBCdWZmZXIuaXNCdWZmZXIodmFsdWUpXG59XG4iXX0=
