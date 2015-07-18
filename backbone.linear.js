(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.Backbone || (g.Backbone = {})).LinearModel = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

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
  },
      LinearModel = Backbone.Model.extend({
    /* ********************
         BACKBONE 1.2.1
    ******************** */
    parse: function parse(resp, options) {
      var parentCall = this.constructor.__super__.parse(resp, options),
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
        return this.constructor.__super__.sync(method, model, opts);
      } else {
        return this.constructor.__super__.sync(method, model, options);
      }
    },

    toJSON: function toJSON() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (options.unflat) {
        return LinearModel.unflatten(this.constructor.__super__.toJSON(options), _.result(this, "flatOptions"));
      } else {
        this.constructor.__super__.toJSON(options);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGFya3kvRGVza3RvcC9iYWNrYm9uZS5saW5lYXIvYmFja2JvbmUubGluZWFyLmVzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9mbGF0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLFlBQVksQ0FBQzs7OztBQUViLElBQUksT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLENBQUMsRUFBRSxRQUFRLEVBQUs7Ozs7O0FBSzNCLE1BQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7TUFDeEIsZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLENBQUksTUFBTSxFQUFFLFVBQVUsRUFBSztBQUN6QyxLQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFDLElBQUksRUFBSztBQUMzQixVQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDM0IsZUFBTztPQUNSLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO0FBQy9CLGNBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO09BQy9CLE1BQU07O0FBQ0wsY0FBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ25CLGdCQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FDckIsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBVSxFQUFLO3VDQUFmLElBQVU7O2dCQUFULEdBQUc7Z0JBQUUsR0FBRzs7QUFDckIsZ0JBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLE9BQUssSUFBSSxDQUFHLENBQUMsRUFBRTtBQUNqQyx1QkFB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LEVBQUU7QUFDM0MsTUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDO01BQ3ZDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwRCxRQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7Q0FDdkM7Ozs7O0FDeEhEOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBmYWN0b3J5ID0gKF8sIEJhY2tib25lKSA9PiB7XG5cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgQkFDS0JPTkUtTElORUFSLVBSSVZBVEVcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgIHZhciBmbGF0ID0gcmVxdWlyZShcImZsYXRcIiksXG4gICAgICB0cmFuc2Zvcm1Ub0FycmF5ID0gKG9iamVjdCwgZm9yY2VBcnJheSkgPT4ge1xuICAgICAgICBfLmVhY2goZm9yY2VBcnJheSwgKHBhdGgpID0+IHtcbiAgICAgICAgICBpZiAoXy5pc0FycmF5KG9iamVjdFtwYXRoXSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9iamVjdFtwYXRoXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBvYmplY3RbcGF0aF0gPSBbb2JqZWN0W3BhdGhdXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IG9iakluUGF0aCA9IHt9O1xuICAgICAgICAgICAgb2JqZWN0ID0gXy5jaGFpbihvYmplY3QpXG4gICAgICAgICAgICAgIC5wYWlycygpLm1hcCgoW2tleSwgdmFsXSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChrZXkubWF0Y2goUmVnRXhwKGBeJHtwYXRofWApKSkge1xuICAgICAgICAgICAgICAgICAgb2JqSW5QYXRoW2Ake2tleS5tYXRjaCgvXFwuKFxcdyspJC8pWzFdfWBdID0gdmFsO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBba2V5LCB2YWxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmNvbXBhY3QoKS5vYmplY3QoKS52YWx1ZSgpO1xuICAgICAgICAgICAgaWYgKF8uc2l6ZShvYmpJblBhdGgpKSB7XG4gICAgICAgICAgICAgIG9iamVjdFtwYXRoXSA9IFtvYmpJblBhdGhdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgb2JqZWN0W3BhdGhdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgIH0sXG5cbiAgICAgIExpbmVhck1vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICBCQUNLQk9ORSAxLjIuMVxuICAgICAgICAqKioqKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICBwYXJzZSAocmVzcCwgb3B0aW9ucykge1xuICAgICAgICAgIHZhciBwYXJlbnRDYWxsID0gdGhpcy5jb25zdHJ1Y3Rvci5fX3N1cGVyX18ucGFyc2UocmVzcCwgb3B0aW9ucyksXG4gICAgICAgICAgICBmbGF0T3B0aW9ucywgcmVzdWx0LCBoYXNGb3JjZUFycmF5O1xuICAgICAgICAgIGlmIChwYXJlbnRDYWxsID09IG51bGwgfHwgcGFyZW50Q2FsbCA9PT0gXCJcIiB8fCBwYXJlbnRDYWxsIGluc3RhbmNlb2YgdGhpcy5jb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIHBhcmVudENhbGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZsYXRPcHRpb25zID0gXy5jbG9uZShfLnJlc3VsdCh0aGlzLCBcImZsYXRPcHRpb25zXCIpKTtcbiAgICAgICAgICBoYXNGb3JjZUFycmF5ID0gXy5pc0FycmF5KGZsYXRPcHRpb25zLmZvcmNlQXJyYXkpO1xuICAgICAgICAgIGlmIChoYXNGb3JjZUFycmF5KSB7XG4gICAgICAgICAgICBmbGF0T3B0aW9ucy5zYWZlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzdWx0ID0gTGluZWFyTW9kZWwuZmxhdHRlbihwYXJlbnRDYWxsLCBmbGF0T3B0aW9ucyk7XG4gICAgICAgICAgaWYgKGhhc0ZvcmNlQXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFuc2Zvcm1Ub0FycmF5KHJlc3VsdCwgZmxhdE9wdGlvbnMuZm9yY2VBcnJheSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN5bmMgKG1ldGhvZCwgbW9kZWwsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICAgIGlmIChtZXRob2QgPT09IFwiY3JlYXRlXCIgfHwgbWV0aG9kID09PSBcInVwZGF0ZVwiIHx8IG1ldGhvZCA9PT0gXCJwYXRjaFwiKSB7XG4gICAgICAgICAgICBsZXQgb3B0cyA9IF8uZXh0ZW5kKHt9LCBvcHRpb25zLFxuICAgICAgICAgICAgICBtZXRob2QgPT09IFwicGF0Y2hcIiA/IHthdHRycyA6IExpbmVhck1vZGVsLnVuZmxhdHRlbihcbiAgICAgICAgICAgICAgICBvcHRpb25zLmF0dHJzLFxuICAgICAgICAgICAgICAgIF8ucmVzdWx0KHRoaXMsIFwiZmxhdE9wdGlvbnNcIilcbiAgICAgICAgICAgICAgKX0gOiB7dW5mbGF0IDogdHJ1ZX1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5fX3N1cGVyX18uc3luYyhtZXRob2QsIG1vZGVsLCBvcHRzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuX19zdXBlcl9fLnN5bmMobWV0aG9kLCBtb2RlbCwgb3B0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHRvSlNPTiAob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMudW5mbGF0KSB7XG4gICAgICAgICAgICByZXR1cm4gTGluZWFyTW9kZWwudW5mbGF0dGVuKFxuICAgICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLl9fc3VwZXJfXy50b0pTT04ob3B0aW9ucyksXG4gICAgICAgICAgICAgIF8ucmVzdWx0KHRoaXMsIFwiZmxhdE9wdGlvbnNcIilcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IuX19zdXBlcl9fLnRvSlNPTihvcHRpb25zKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgQkFDS0JPTkUtTElORUFSLVBVQkxJQ1xuICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXG4gICAgICAgIGZsYXRPcHRpb25zICgpIHtcbiAgICAgICAgICByZXR1cm4ge3NhZmUgOiB0cnVlfTtcbiAgICAgICAgfVxuXG4gICAgICB9LCB7XG4gICAgICAgIC8qICoqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICBGTEFUIDEuNi4wXG4gICAgICAgICoqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgZmxhdHRlbiAodGFyZ2V0LCBvcHRzID0ge30pIHtcbiAgICAgICAgICBpZiAob3B0cy5zYWZlID09IG51bGwpIHtcbiAgICAgICAgICAgIG9wdHMuc2FmZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmbGF0LmZsYXR0ZW4odGFyZ2V0LCBvcHRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICB1bmZsYXR0ZW4gKHRhcmdldCwgb3B0cyA9IHt9KSB7XG4gICAgICAgICAgcmV0dXJuIGZsYXQudW5mbGF0dGVuKHRhcmdldCwgb3B0cyk7XG4gICAgICAgIH1cblxuICAgICAgfSk7XG5cbiAgICByZXR1cm4gQmFja2JvbmUuTGluZWFyTW9kZWwgPSBMaW5lYXJNb2RlbDtcbiAgfTtcblxuaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShbXCJ1bmRlcnNjb3JlXCIsIFwiYmFja2JvbmVcIl0sIChfLCBCYWNrYm9uZSkgPT4ge1xuICAgIGdsb2JhbC5CYWNrYm9uZS5MaW5lYXJNb2RlbCA9IGZhY3RvcnkoXywgQmFja2JvbmUpO1xuICB9KTtcbn0gZWxzZSBpZiAobW9kdWxlICE9IG51bGwgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgbGV0IF8gPSBnbG9iYWwuXyB8fCByZXF1aXJlKFwidW5kZXJzY29yZVwiKSxcbiAgICBCYWNrYm9uZSA9IGdsb2JhbC5CYWNrYm9uZSB8fCByZXF1aXJlKFwiYmFja2JvbmVcIik7XG4gIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShfLCBCYWNrYm9uZSk7XG59XG4iLG51bGwsInZhciBmbGF0ID0gbW9kdWxlLmV4cG9ydHMgPSBmbGF0dGVuXG5mbGF0dGVuLmZsYXR0ZW4gPSBmbGF0dGVuXG5mbGF0dGVuLnVuZmxhdHRlbiA9IHVuZmxhdHRlblxuXG5mdW5jdGlvbiBmbGF0dGVuKHRhcmdldCwgb3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fVxuXG4gIHZhciBkZWxpbWl0ZXIgPSBvcHRzLmRlbGltaXRlciB8fCAnLidcbiAgdmFyIG1heERlcHRoID0gb3B0cy5tYXhEZXB0aFxuICB2YXIgY3VycmVudERlcHRoID0gMVxuICB2YXIgb3V0cHV0ID0ge31cblxuICBmdW5jdGlvbiBzdGVwKG9iamVjdCwgcHJldikge1xuICAgIE9iamVjdC5rZXlzKG9iamVjdCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IG9iamVjdFtrZXldXG4gICAgICB2YXIgaXNhcnJheSA9IG9wdHMuc2FmZSAmJiBBcnJheS5pc0FycmF5KHZhbHVlKVxuICAgICAgdmFyIHR5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpXG4gICAgICB2YXIgaXNidWZmZXIgPSBpc0J1ZmZlcih2YWx1ZSlcbiAgICAgIHZhciBpc29iamVjdCA9IChcbiAgICAgICAgdHlwZSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIiB8fFxuICAgICAgICB0eXBlID09PSBcIltvYmplY3QgQXJyYXldXCJcbiAgICAgIClcblxuICAgICAgdmFyIG5ld0tleSA9IHByZXZcbiAgICAgICAgPyBwcmV2ICsgZGVsaW1pdGVyICsga2V5XG4gICAgICAgIDoga2V5XG5cbiAgICAgIGlmICghb3B0cy5tYXhEZXB0aCkge1xuICAgICAgICBtYXhEZXB0aCA9IGN1cnJlbnREZXB0aCArIDE7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNhcnJheSAmJiAhaXNidWZmZXIgJiYgaXNvYmplY3QgJiYgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCAmJiBjdXJyZW50RGVwdGggPCBtYXhEZXB0aCkge1xuICAgICAgICArK2N1cnJlbnREZXB0aFxuICAgICAgICByZXR1cm4gc3RlcCh2YWx1ZSwgbmV3S2V5KVxuICAgICAgfVxuXG4gICAgICBvdXRwdXRbbmV3S2V5XSA9IHZhbHVlXG4gICAgfSlcbiAgfVxuXG4gIHN0ZXAodGFyZ2V0KVxuXG4gIHJldHVybiBvdXRwdXRcbn1cblxuZnVuY3Rpb24gdW5mbGF0dGVuKHRhcmdldCwgb3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fVxuXG4gIHZhciBkZWxpbWl0ZXIgPSBvcHRzLmRlbGltaXRlciB8fCAnLidcbiAgdmFyIG92ZXJ3cml0ZSA9IG9wdHMub3ZlcndyaXRlIHx8IGZhbHNlXG4gIHZhciByZXN1bHQgPSB7fVxuXG4gIHZhciBpc2J1ZmZlciA9IGlzQnVmZmVyKHRhcmdldClcbiAgaWYgKGlzYnVmZmVyIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0YXJnZXQpICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiB0YXJnZXRcbiAgfVxuXG4gIC8vIHNhZmVseSBlbnN1cmUgdGhhdCB0aGUga2V5IGlzXG4gIC8vIGFuIGludGVnZXIuXG4gIGZ1bmN0aW9uIGdldGtleShrZXkpIHtcbiAgICB2YXIgcGFyc2VkS2V5ID0gTnVtYmVyKGtleSlcblxuICAgIHJldHVybiAoXG4gICAgICBpc05hTihwYXJzZWRLZXkpIHx8XG4gICAgICBrZXkuaW5kZXhPZignLicpICE9PSAtMVxuICAgICkgPyBrZXlcbiAgICAgIDogcGFyc2VkS2V5XG4gIH1cblxuICBPYmplY3Qua2V5cyh0YXJnZXQpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIHNwbGl0ID0ga2V5LnNwbGl0KGRlbGltaXRlcilcbiAgICB2YXIga2V5MSA9IGdldGtleShzcGxpdC5zaGlmdCgpKVxuICAgIHZhciBrZXkyID0gZ2V0a2V5KHNwbGl0WzBdKVxuICAgIHZhciByZWNpcGllbnQgPSByZXN1bHRcblxuICAgIHdoaWxlIChrZXkyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHJlY2lwaWVudFtrZXkxXSlcbiAgICAgIHZhciBpc29iamVjdCA9IChcbiAgICAgICAgdHlwZSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIiB8fFxuICAgICAgICB0eXBlID09PSBcIltvYmplY3QgQXJyYXldXCJcbiAgICAgIClcblxuICAgICAgaWYgKChvdmVyd3JpdGUgJiYgIWlzb2JqZWN0KSB8fCAoIW92ZXJ3cml0ZSAmJiByZWNpcGllbnRba2V5MV0gPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgcmVjaXBpZW50W2tleTFdID0gKFxuICAgICAgICAgIHR5cGVvZiBrZXkyID09PSAnbnVtYmVyJyAmJlxuICAgICAgICAgICFvcHRzLm9iamVjdCA/IFtdIDoge31cbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICByZWNpcGllbnQgPSByZWNpcGllbnRba2V5MV1cbiAgICAgIGlmIChzcGxpdC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGtleTEgPSBnZXRrZXkoc3BsaXQuc2hpZnQoKSlcbiAgICAgICAga2V5MiA9IGdldGtleShzcGxpdFswXSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1bmZsYXR0ZW4gYWdhaW4gZm9yICdtZXNzeSBvYmplY3RzJ1xuICAgIHJlY2lwaWVudFtrZXkxXSA9IHVuZmxhdHRlbih0YXJnZXRba2V5XSwgb3B0cylcbiAgfSlcblxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgQnVmZmVyID09PSAndW5kZWZpbmVkJykgcmV0dXJuIGZhbHNlXG4gIHJldHVybiBCdWZmZXIuaXNCdWZmZXIodmFsdWUpXG59XG4iXX0=
