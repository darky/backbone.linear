(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.Backbone || (g.Backbone = {})).LinearModel = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var global = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : {},
    factory = function factory(_, Backbone) {

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
  },
      LinearModel = Backbone.Model.extend({
    /* ********************
         BACKBONE 1.2.1
    ******************** */
    parse: function parse(resp, options) {
      var parentCall = LinearModel.__super__.parse.call(this, resp, options),
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
    },

    sync: function sync(method, model) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      if (method === "create" || method === "update" || method === "patch") {
        var opts = _.extend({}, options, method === "patch" ? { attrs: LinearModel.unflatten(options.attrs, _.result(this, "flatOptions")) } : { unflat: true });
        return LinearModel.__super__.sync.call(this, method, model, opts);
      } else {
        return LinearModel.__super__.sync.call(this, method, model, options);
      }
    },

    toJSON: function toJSON() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (options.unflat) {
        return LinearModel.unflatten(LinearModel.__super__.toJSON.call(this, options), _.result(this, "flatOptions"));
      } else {
        return LinearModel.__super__.toJSON.call(this, options);
      }
    },

    /* ****************************
         BACKBONE-LINEAR-PUBLIC
    **************************** */
    flatOptions: function flatOptions() {
      return { safe: true };
    }

  }, {
    /* ****************
         FLAT 1.6.0
    **************** */
    flatten: function flatten(target) {
      var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (opts.safe == null) {
        opts.safe = true;
      }
      return flat.flatten(target, opts);
    },

    unflatten: function unflatten(target) {
      var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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
  var _ = global._ || require("underscore"),
      Backbone = global.Backbone || require("backbone");
  module.exports = factory(_, Backbone);
}

},{"backbone":undefined,"flat":2,"underscore":undefined}],2:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGFya3kvRGVza3RvcC9iYWNrYm9uZS5saW5lYXIvYmFja2JvbmUubGluZWFyLmVzIiwibm9kZV9tb2R1bGVzL2ZsYXQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxZQUFZLENBQUM7Ozs7QUFFYixJQUFJLE1BQU0sR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLEdBQUcsTUFBTSxHQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsR0FBRyxNQUFNLEdBQUcsRUFBRTtJQUMvRixPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksQ0FBQyxFQUFFLFFBQVEsRUFBSzs7Ozs7QUFLekIsTUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztNQUN4QixnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBSSxNQUFNLEVBQUUsVUFBVSxFQUFLO0FBQ3pDLEtBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQzNCLFVBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUMzQixlQUFPO09BQ1IsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDL0IsY0FBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7T0FDL0IsTUFBTTs7QUFDTCxjQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDbkIsZ0JBQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUNyQixLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFVLEVBQUs7dUNBQWYsSUFBVTs7Z0JBQVQsR0FBRztnQkFBRSxHQUFHOztBQUNyQixnQkFBSSxHQUFHLENBQUMs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IihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBnbG9iYWwgPSB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LFxuICBmYWN0b3J5ID0gKF8sIEJhY2tib25lKSA9PiB7XG5cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgQkFDS0JPTkUtTElORUFSLVBSSVZBVEVcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIHZhciBmbGF0ID0gcmVxdWlyZShcImZsYXRcIiksXG4gICAgICB0cmFuc2Zvcm1Ub0FycmF5ID0gKG9iamVjdCwgZm9yY2VBcnJheSkgPT4ge1xuICAgICAgICBfLmVhY2goZm9yY2VBcnJheSwgKHBhdGgpID0+IHtcbiAgICAgICAgICBpZiAoXy5pc0FycmF5KG9iamVjdFtwYXRoXSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9iamVjdFtwYXRoXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBvYmplY3RbcGF0aF0gPSBbb2JqZWN0W3BhdGhdXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG9iakluUGF0aCA9IHt9O1xuICAgICAgICAgICAgb2JqZWN0ID0gXy5jaGFpbihvYmplY3QpXG4gICAgICAgICAgICAgIC5wYWlycygpLm1hcCgoW2tleSwgdmFsXSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChrZXkubWF0Y2goUmVnRXhwKGBeJHtwYXRofWApKSkge1xuICAgICAgICAgICAgICAgICAgb2JqSW5QYXRoW2Ake2tleS5tYXRjaCgvXFwuKFxcdyspJC8pWzFdfWBdID0gdmFsO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBba2V5LCB2YWxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmNvbXBhY3QoKS5vYmplY3QoKS52YWx1ZSgpO1xuICAgICAgICAgICAgaWYgKF8uc2l6ZShvYmpJblBhdGgpKSB7XG4gICAgICAgICAgICAgIG9iamVjdFtwYXRoXSA9IFtvYmpJblBhdGhdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb2JqZWN0W3BhdGhdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH0sXG5cbiAgICAgIExpbmVhck1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICBCQUNLQk9ORSAxLjIuMVxuICAgICAgICAqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICBwYXJzZSAocmVzcCwgb3B0aW9ucykge1xuICAgICAgICAgIHZhciBwYXJlbnRDYWxsID0gTGluZWFyTW9kZWwuX19zdXBlcl9fLnBhcnNlLmNhbGwodGhpcywgcmVzcCwgb3B0aW9ucyksXG4gICAgICAgICAgICBmbGF0T3B0aW9ucywgcmVzdWx0LCBoYXNGb3JjZUFycmF5O1xuICAgICAgICAgIGlmIChwYXJlbnRDYWxsID09IG51bGwgfHwgcGFyZW50Q2FsbCA9PT0gXCJcIiB8fCBwYXJlbnRDYWxsIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIHBhcmVudENhbGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZsYXRPcHRpb25zID0gXy5jbG9uZShfLnJlc3VsdCh0aGlzLCBcImZsYXRPcHRpb25zXCIpKTtcbiAgICAgICAgICBoYXNGb3JjZUFycmF5ID0gXy5pc0FycmF5KGZsYXRPcHRpb25zLmZvcmNlQXJyYXkpO1xuICAgICAgICAgIGlmIChoYXNGb3JjZUFycmF5KSB7XG4gICAgICAgICAgICBmbGF0T3B0aW9ucy5zYWZlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0ID0gTGluZWFyTW9kZWwuZmxhdHRlbihwYXJlbnRDYWxsLCBmbGF0T3B0aW9ucyk7XG4gICAgICAgICAgaWYgKGhhc0ZvcmNlQXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm1Ub0FycmF5KHJlc3VsdCwgZmxhdE9wdGlvbnMuZm9yY2VBcnJheSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN5bmMgKG1ldGhvZCwgbW9kZWwsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICAgIGlmIChtZXRob2QgPT09IFwiY3JlYXRlXCIgfHwgbWV0aG9kID09PSBcInVwZGF0ZVwiIHx8IG1ldGhvZCA9PT0gXCJwYXRjaFwiKSB7XG4gICAgICAgICAgICBsZXQgb3B0cyA9IF8uZXh0ZW5kKHt9LCBvcHRpb25zLFxuICAgICAgICAgICAgICBtZXRob2QgPT09IFwicGF0Y2hcIiA/IHthdHRycyA6IExpbmVhck1vZGVsLnVuZmxhdHRlbihcbiAgICAgICAgICAgICAgICBvcHRpb25zLmF0dHJzLFxuICAgICAgICAgICAgICAgIF8ucmVzdWx0KHRoaXMsIFwiZmxhdE9wdGlvbnNcIilcbiAgICAgICAgICAgICAgKX0gOiB7dW5mbGF0IDogdHJ1ZX1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gTGluZWFyTW9kZWwuX19zdXBlcl9fLnN5bmMuY2FsbCh0aGlzLCBtZXRob2QsIG1vZGVsLCBvcHRzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIExpbmVhck1vZGVsLl9fc3VwZXJfXy5zeW5jLmNhbGwodGhpcywgbWV0aG9kLCBtb2RlbCwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHRvSlNPTiAob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMudW5mbGF0KSB7XG4gICAgICAgICAgICByZXR1cm4gTGluZWFyTW9kZWwudW5mbGF0dGVuKFxuICAgICAgICAgICAgICBMaW5lYXJNb2RlbC5fX3N1cGVyX18udG9KU09OLmNhbGwodGhpcywgb3B0aW9ucyksXG4gICAgICAgICAgICAgIF8ucmVzdWx0KHRoaXMsIFwiZmxhdE9wdGlvbnNcIilcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBMaW5lYXJNb2RlbC5fX3N1cGVyX18udG9KU09OLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG5cbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIEJBQ0tCT05FLUxJTkVBUi1QVUJMSUNcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICBmbGF0T3B0aW9ucyAoKSB7XG4gICAgICAgICAgcmV0dXJuIHtzYWZlIDogdHJ1ZX07XG4gICAgICAgIH1cblxuICAgICAgfSwge1xuICAgICAgICAvKiAqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgRkxBVCAxLjYuMFxuICAgICAgICAqKioqKioqKioqKioqKioqICovXG4gICAgICAgIGZsYXR0ZW4gKHRhcmdldCwgb3B0cyA9IHt9KSB7XG4gICAgICAgICAgaWYgKG9wdHMuc2FmZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBvcHRzLnNhZmUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmxhdC5mbGF0dGVuKHRhcmdldCwgb3B0cyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5mbGF0dGVuICh0YXJnZXQsIG9wdHMgPSB7fSkge1xuICAgICAgICAgIHJldHVybiBmbGF0LnVuZmxhdHRlbih0YXJnZXQsIG9wdHMpO1xuICAgICAgICB9XG5cbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIEJhY2tib25lLkxpbmVhck1vZGVsID0gTGluZWFyTW9kZWw7XG4gIH07XG5cbmlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICBkZWZpbmUoW1widW5kZXJzY29yZVwiLCBcImJhY2tib25lXCJdLCAoXywgQmFja2JvbmUpID0+IHtcbiAgICBnbG9iYWwuQmFja2JvbmUuTGluZWFyTW9kZWwgPSBmYWN0b3J5KF8sIEJhY2tib25lKTtcbiAgfSk7XG59IGVsc2UgaWYgKG1vZHVsZSAhPSBudWxsICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIGxldCBfID0gZ2xvYmFsLl8gfHwgcmVxdWlyZShcInVuZGVyc2NvcmVcIiksXG4gICAgQmFja2JvbmUgPSBnbG9iYWwuQmFja2JvbmUgfHwgcmVxdWlyZShcImJhY2tib25lXCIpO1xuICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoXywgQmFja2JvbmUpO1xufVxuIiwidmFyIGZsYXQgPSBtb2R1bGUuZXhwb3J0cyA9IGZsYXR0ZW5cbmZsYXR0ZW4uZmxhdHRlbiA9IGZsYXR0ZW5cbmZsYXR0ZW4udW5mbGF0dGVuID0gdW5mbGF0dGVuXG5cbmZ1bmN0aW9uIGZsYXR0ZW4odGFyZ2V0LCBvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9XG5cbiAgdmFyIGRlbGltaXRlciA9IG9wdHMuZGVsaW1pdGVyIHx8ICcuJ1xuICB2YXIgbWF4RGVwdGggPSBvcHRzLm1heERlcHRoXG4gIHZhciBjdXJyZW50RGVwdGggPSAxXG4gIHZhciBvdXRwdXQgPSB7fVxuXG4gIGZ1bmN0aW9uIHN0ZXAob2JqZWN0LCBwcmV2KSB7XG4gICAgT2JqZWN0LmtleXMob2JqZWN0KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHZhbHVlID0gb2JqZWN0W2tleV1cbiAgICAgIHZhciBpc2FycmF5ID0gb3B0cy5zYWZlICYmIEFycmF5LmlzQXJyYXkodmFsdWUpXG4gICAgICB2YXIgdHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSlcbiAgICAgIHZhciBpc2J1ZmZlciA9IGlzQnVmZmVyKHZhbHVlKVxuICAgICAgdmFyIGlzb2JqZWN0ID0gKFxuICAgICAgICB0eXBlID09PSBcIltvYmplY3QgT2JqZWN0XVwiIHx8XG4gICAgICAgIHR5cGUgPT09IFwiW29iamVjdCBBcnJheV1cIlxuICAgICAgKVxuXG4gICAgICB2YXIgbmV3S2V5ID0gcHJldlxuICAgICAgICA/IHByZXYgKyBkZWxpbWl0ZXIgKyBrZXlcbiAgICAgICAgOiBrZXlcblxuICAgICAgaWYgKCFvcHRzLm1heERlcHRoKSB7XG4gICAgICAgIG1heERlcHRoID0gY3VycmVudERlcHRoICsgMTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc2FycmF5ICYmICFpc2J1ZmZlciAmJiBpc29iamVjdCAmJiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoICYmIGN1cnJlbnREZXB0aCA8IG1heERlcHRoKSB7XG4gICAgICAgICsrY3VycmVudERlcHRoXG4gICAgICAgIHJldHVybiBzdGVwKHZhbHVlLCBuZXdLZXkpXG4gICAgICB9XG5cbiAgICAgIG91dHB1dFtuZXdLZXldID0gdmFsdWVcbiAgICB9KVxuICB9XG5cbiAgc3RlcCh0YXJnZXQpXG5cbiAgcmV0dXJuIG91dHB1dFxufVxuXG5mdW5jdGlvbiB1bmZsYXR0ZW4odGFyZ2V0LCBvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9XG5cbiAgdmFyIGRlbGltaXRlciA9IG9wdHMuZGVsaW1pdGVyIHx8ICcuJ1xuICB2YXIgb3ZlcndyaXRlID0gb3B0cy5vdmVyd3JpdGUgfHwgZmFsc2VcbiAgdmFyIHJlc3VsdCA9IHt9XG5cbiAgdmFyIGlzYnVmZmVyID0gaXNCdWZmZXIodGFyZ2V0KVxuICBpZiAoaXNidWZmZXIgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRhcmdldCkgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIHRhcmdldFxuICB9XG5cbiAgLy8gc2FmZWx5IGVuc3VyZSB0aGF0IHRoZSBrZXkgaXNcbiAgLy8gYW4gaW50ZWdlci5cbiAgZnVuY3Rpb24gZ2V0a2V5KGtleSkge1xuICAgIHZhciBwYXJzZWRLZXkgPSBOdW1iZXIoa2V5KVxuXG4gICAgcmV0dXJuIChcbiAgICAgIGlzTmFOKHBhcnNlZEtleSkgfHxcbiAgICAgIGtleS5pbmRleE9mKCcuJykgIT09IC0xXG4gICAgKSA/IGtleVxuICAgICAgOiBwYXJzZWRLZXlcbiAgfVxuXG4gIE9iamVjdC5rZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgc3BsaXQgPSBrZXkuc3BsaXQoZGVsaW1pdGVyKVxuICAgIHZhciBrZXkxID0gZ2V0a2V5KHNwbGl0LnNoaWZ0KCkpXG4gICAgdmFyIGtleTIgPSBnZXRrZXkoc3BsaXRbMF0pXG4gICAgdmFyIHJlY2lwaWVudCA9IHJlc3VsdFxuXG4gICAgd2hpbGUgKGtleTIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHR5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocmVjaXBpZW50W2tleTFdKVxuICAgICAgdmFyIGlzb2JqZWN0ID0gKFxuICAgICAgICB0eXBlID09PSBcIltvYmplY3QgT2JqZWN0XVwiIHx8XG4gICAgICAgIHR5cGUgPT09IFwiW29iamVjdCBBcnJheV1cIlxuICAgICAgKVxuXG4gICAgICBpZiAoKG92ZXJ3cml0ZSAmJiAhaXNvYmplY3QpIHx8ICghb3ZlcndyaXRlICYmIHJlY2lwaWVudFtrZXkxXSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICByZWNpcGllbnRba2V5MV0gPSAoXG4gICAgICAgICAgdHlwZW9mIGtleTIgPT09ICdudW1iZXInICYmXG4gICAgICAgICAgIW9wdHMub2JqZWN0ID8gW10gOiB7fVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHJlY2lwaWVudCA9IHJlY2lwaWVudFtrZXkxXVxuICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAga2V5MSA9IGdldGtleShzcGxpdC5zaGlmdCgpKVxuICAgICAgICBrZXkyID0gZ2V0a2V5KHNwbGl0WzBdKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVuZmxhdHRlbiBhZ2FpbiBmb3IgJ21lc3N5IG9iamVjdHMnXG4gICAgcmVjaXBpZW50W2tleTFdID0gdW5mbGF0dGVuKHRhcmdldFtrZXldLCBvcHRzKVxuICB9KVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBCdWZmZXIgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcih2YWx1ZSlcbn1cbiJdfQ==
