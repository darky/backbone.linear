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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvZGFya3kvRGVza3RvcC9iYWNrYm9uZS5saW5lYXIvYmFja2JvbmUubGluZWFyLmVzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9mbGF0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLFlBQVksQ0FBQzs7OztBQUViLElBQUksT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLENBQUMsRUFBRSxRQUFRLEVBQUs7Ozs7O0FBSzNCLE1BQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7TUFDeEIsZ0JBQWdCLEdBQUcsU0FBbkIsZ0JBQWdCLENBQUksTUFBTSxFQUFFLFVBQVUsRUFBSztBQUN6QyxLQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFDLElBQUksRUFBSztBQUMzQixVQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDM0IsZUFBTztPQUNSLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO0FBQy9CLGNBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO09BQy9CLE1BQU07O0FBQ0wsY0FBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ25CLGdCQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FDckIsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBVSxFQUFLO3VDQUFmLElBQVU7O2dCQUFULEdBQUc7Z0JBQUUsR0FBRzs7QUFDckIsZ0JBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLE9BQUssSUFBSSxDQUFHLENBQUMsRUFBRTtBQUNqQyx1QkFB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LENBQUM7Q0FDSixNQUFNLElBQUksTUFBTSxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQzNDLE1BQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQztNQUN2QyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEQsUUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0NBQ3ZDOzs7OztBQ3hIRDs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZmFjdG9yeSA9IChfLCBCYWNrYm9uZSkgPT4ge1xuXG4gICAgLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgIEJBQ0tCT05FLUxJTkVBUi1QUklWQVRFXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICB2YXIgZmxhdCA9IHJlcXVpcmUoXCJmbGF0XCIpLFxuICAgICAgdHJhbnNmb3JtVG9BcnJheSA9IChvYmplY3QsIGZvcmNlQXJyYXkpID0+IHtcbiAgICAgICAgXy5lYWNoKGZvcmNlQXJyYXksIChwYXRoKSA9PiB7XG4gICAgICAgICAgaWYgKF8uaXNBcnJheShvYmplY3RbcGF0aF0pKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIGlmIChvYmplY3RbcGF0aF0gIT0gbnVsbCkge1xuICAgICAgICAgICAgb2JqZWN0W3BhdGhdID0gW29iamVjdFtwYXRoXV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBvYmpJblBhdGggPSB7fTtcbiAgICAgICAgICAgIG9iamVjdCA9IF8uY2hhaW4ob2JqZWN0KVxuICAgICAgICAgICAgICAucGFpcnMoKS5tYXAoKFtrZXksIHZhbF0pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5Lm1hdGNoKFJlZ0V4cChgXiR7cGF0aH1gKSkpIHtcbiAgICAgICAgICAgICAgICAgIG9iakluUGF0aFtgJHtrZXkubWF0Y2goL1xcLihcXHcrKSQvKVsxXX1gXSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gW2tleSwgdmFsXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jb21wYWN0KCkub2JqZWN0KCkudmFsdWUoKTtcbiAgICAgICAgICAgIGlmIChfLnNpemUob2JqSW5QYXRoKSkge1xuICAgICAgICAgICAgICBvYmplY3RbcGF0aF0gPSBbb2JqSW5QYXRoXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG9iamVjdFtwYXRoXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgICB9LFxuXG4gICAgICBMaW5lYXJNb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgQkFDS0JPTkUgMS4yLjFcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgcGFyc2UgKHJlc3AsIG9wdGlvbnMpIHtcbiAgICAgICAgICB2YXIgcGFyZW50Q2FsbCA9IExpbmVhck1vZGVsLl9fc3VwZXJfXy5wYXJzZS5jYWxsKHRoaXMsIHJlc3AsIG9wdGlvbnMpLFxuICAgICAgICAgICAgZmxhdE9wdGlvbnMsIHJlc3VsdCwgaGFzRm9yY2VBcnJheTtcbiAgICAgICAgICBpZiAocGFyZW50Q2FsbCA9PSBudWxsIHx8IHBhcmVudENhbGwgPT09IFwiXCIgfHwgcGFyZW50Q2FsbCBpbnN0YW5jZW9mIHRoaXMuY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRDYWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBmbGF0T3B0aW9ucyA9IF8uY2xvbmUoXy5yZXN1bHQodGhpcywgXCJmbGF0T3B0aW9uc1wiKSk7XG4gICAgICAgICAgaGFzRm9yY2VBcnJheSA9IF8uaXNBcnJheShmbGF0T3B0aW9ucy5mb3JjZUFycmF5KTtcbiAgICAgICAgICBpZiAoaGFzRm9yY2VBcnJheSkge1xuICAgICAgICAgICAgZmxhdE9wdGlvbnMuc2FmZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc3VsdCA9IExpbmVhck1vZGVsLmZsYXR0ZW4ocGFyZW50Q2FsbCwgZmxhdE9wdGlvbnMpO1xuICAgICAgICAgIGlmIChoYXNGb3JjZUFycmF5KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhbnNmb3JtVG9BcnJheShyZXN1bHQsIGZsYXRPcHRpb25zLmZvcmNlQXJyYXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzeW5jIChtZXRob2QsIG1vZGVsLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgICBpZiAobWV0aG9kID09PSBcImNyZWF0ZVwiIHx8IG1ldGhvZCA9PT0gXCJ1cGRhdGVcIiB8fCBtZXRob2QgPT09IFwicGF0Y2hcIikge1xuICAgICAgICAgICAgbGV0IG9wdHMgPSBfLmV4dGVuZCh7fSwgb3B0aW9ucyxcbiAgICAgICAgICAgICAgbWV0aG9kID09PSBcInBhdGNoXCIgPyB7YXR0cnMgOiBMaW5lYXJNb2RlbC51bmZsYXR0ZW4oXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5hdHRycyxcbiAgICAgICAgICAgICAgICBfLnJlc3VsdCh0aGlzLCBcImZsYXRPcHRpb25zXCIpXG4gICAgICAgICAgICAgICl9IDoge3VuZmxhdCA6IHRydWV9XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIExpbmVhck1vZGVsLl9fc3VwZXJfXy5zeW5jLmNhbGwodGhpcywgbWV0aG9kLCBtb2RlbCwgb3B0cyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBMaW5lYXJNb2RlbC5fX3N1cGVyX18uc3luYy5jYWxsKHRoaXMsIG1ldGhvZCwgbW9kZWwsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB0b0pTT04gKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnVuZmxhdCkge1xuICAgICAgICAgICAgcmV0dXJuIExpbmVhck1vZGVsLnVuZmxhdHRlbihcbiAgICAgICAgICAgICAgTGluZWFyTW9kZWwuX19zdXBlcl9fLnRvSlNPTi5jYWxsKHRoaXMsIG9wdGlvbnMpLFxuICAgICAgICAgICAgICBfLnJlc3VsdCh0aGlzLCBcImZsYXRPcHRpb25zXCIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTGluZWFyTW9kZWwuX19zdXBlcl9fLnRvSlNPTi5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qICoqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICBCQUNLQk9ORS1MSU5FQVItUFVCTElDXG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cbiAgICAgICAgZmxhdE9wdGlvbnMgKCkge1xuICAgICAgICAgIHJldHVybiB7c2FmZSA6IHRydWV9O1xuICAgICAgICB9XG5cbiAgICAgIH0sIHtcbiAgICAgICAgLyogKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgIEZMQVQgMS42LjBcbiAgICAgICAgKioqKioqKioqKioqKioqKiAqL1xuICAgICAgICBmbGF0dGVuICh0YXJnZXQsIG9wdHMgPSB7fSkge1xuICAgICAgICAgIGlmIChvcHRzLnNhZmUgPT0gbnVsbCkge1xuICAgICAgICAgICAgb3B0cy5zYWZlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZsYXQuZmxhdHRlbih0YXJnZXQsIG9wdHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVuZmxhdHRlbiAodGFyZ2V0LCBvcHRzID0ge30pIHtcbiAgICAgICAgICByZXR1cm4gZmxhdC51bmZsYXR0ZW4odGFyZ2V0LCBvcHRzKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcblxuICAgIHJldHVybiBCYWNrYm9uZS5MaW5lYXJNb2RlbCA9IExpbmVhck1vZGVsO1xuICB9O1xuXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKFtcInVuZGVyc2NvcmVcIiwgXCJiYWNrYm9uZVwiXSwgKF8sIEJhY2tib25lKSA9PiB7XG4gICAgZ2xvYmFsLkJhY2tib25lLkxpbmVhck1vZGVsID0gZmFjdG9yeShfLCBCYWNrYm9uZSk7XG4gIH0pO1xufSBlbHNlIGlmIChtb2R1bGUgIT0gbnVsbCAmJiBtb2R1bGUuZXhwb3J0cykge1xuICBsZXQgXyA9IGdsb2JhbC5fIHx8IHJlcXVpcmUoXCJ1bmRlcnNjb3JlXCIpLFxuICAgIEJhY2tib25lID0gZ2xvYmFsLkJhY2tib25lIHx8IHJlcXVpcmUoXCJiYWNrYm9uZVwiKTtcbiAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KF8sIEJhY2tib25lKTtcbn1cbiIsbnVsbCwidmFyIGZsYXQgPSBtb2R1bGUuZXhwb3J0cyA9IGZsYXR0ZW5cbmZsYXR0ZW4uZmxhdHRlbiA9IGZsYXR0ZW5cbmZsYXR0ZW4udW5mbGF0dGVuID0gdW5mbGF0dGVuXG5cbmZ1bmN0aW9uIGZsYXR0ZW4odGFyZ2V0LCBvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9XG5cbiAgdmFyIGRlbGltaXRlciA9IG9wdHMuZGVsaW1pdGVyIHx8ICcuJ1xuICB2YXIgbWF4RGVwdGggPSBvcHRzLm1heERlcHRoXG4gIHZhciBjdXJyZW50RGVwdGggPSAxXG4gIHZhciBvdXRwdXQgPSB7fVxuXG4gIGZ1bmN0aW9uIHN0ZXAob2JqZWN0LCBwcmV2KSB7XG4gICAgT2JqZWN0LmtleXMob2JqZWN0KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHZhbHVlID0gb2JqZWN0W2tleV1cbiAgICAgIHZhciBpc2FycmF5ID0gb3B0cy5zYWZlICYmIEFycmF5LmlzQXJyYXkodmFsdWUpXG4gICAgICB2YXIgdHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSlcbiAgICAgIHZhciBpc2J1ZmZlciA9IGlzQnVmZmVyKHZhbHVlKVxuICAgICAgdmFyIGlzb2JqZWN0ID0gKFxuICAgICAgICB0eXBlID09PSBcIltvYmplY3QgT2JqZWN0XVwiIHx8XG4gICAgICAgIHR5cGUgPT09IFwiW29iamVjdCBBcnJheV1cIlxuICAgICAgKVxuXG4gICAgICB2YXIgbmV3S2V5ID0gcHJldlxuICAgICAgICA/IHByZXYgKyBkZWxpbWl0ZXIgKyBrZXlcbiAgICAgICAgOiBrZXlcblxuICAgICAgaWYgKCFvcHRzLm1heERlcHRoKSB7XG4gICAgICAgIG1heERlcHRoID0gY3VycmVudERlcHRoICsgMTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc2FycmF5ICYmICFpc2J1ZmZlciAmJiBpc29iamVjdCAmJiBPYmplY3Qua2V5cyh2YWx1ZSkubGVuZ3RoICYmIGN1cnJlbnREZXB0aCA8IG1heERlcHRoKSB7XG4gICAgICAgICsrY3VycmVudERlcHRoXG4gICAgICAgIHJldHVybiBzdGVwKHZhbHVlLCBuZXdLZXkpXG4gICAgICB9XG5cbiAgICAgIG91dHB1dFtuZXdLZXldID0gdmFsdWVcbiAgICB9KVxuICB9XG5cbiAgc3RlcCh0YXJnZXQpXG5cbiAgcmV0dXJuIG91dHB1dFxufVxuXG5mdW5jdGlvbiB1bmZsYXR0ZW4odGFyZ2V0LCBvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9XG5cbiAgdmFyIGRlbGltaXRlciA9IG9wdHMuZGVsaW1pdGVyIHx8ICcuJ1xuICB2YXIgb3ZlcndyaXRlID0gb3B0cy5vdmVyd3JpdGUgfHwgZmFsc2VcbiAgdmFyIHJlc3VsdCA9IHt9XG5cbiAgdmFyIGlzYnVmZmVyID0gaXNCdWZmZXIodGFyZ2V0KVxuICBpZiAoaXNidWZmZXIgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRhcmdldCkgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgcmV0dXJuIHRhcmdldFxuICB9XG5cbiAgLy8gc2FmZWx5IGVuc3VyZSB0aGF0IHRoZSBrZXkgaXNcbiAgLy8gYW4gaW50ZWdlci5cbiAgZnVuY3Rpb24gZ2V0a2V5KGtleSkge1xuICAgIHZhciBwYXJzZWRLZXkgPSBOdW1iZXIoa2V5KVxuXG4gICAgcmV0dXJuIChcbiAgICAgIGlzTmFOKHBhcnNlZEtleSkgfHxcbiAgICAgIGtleS5pbmRleE9mKCcuJykgIT09IC0xXG4gICAgKSA/IGtleVxuICAgICAgOiBwYXJzZWRLZXlcbiAgfVxuXG4gIE9iamVjdC5rZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgc3BsaXQgPSBrZXkuc3BsaXQoZGVsaW1pdGVyKVxuICAgIHZhciBrZXkxID0gZ2V0a2V5KHNwbGl0LnNoaWZ0KCkpXG4gICAgdmFyIGtleTIgPSBnZXRrZXkoc3BsaXRbMF0pXG4gICAgdmFyIHJlY2lwaWVudCA9IHJlc3VsdFxuXG4gICAgd2hpbGUgKGtleTIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHR5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocmVjaXBpZW50W2tleTFdKVxuICAgICAgdmFyIGlzb2JqZWN0ID0gKFxuICAgICAgICB0eXBlID09PSBcIltvYmplY3QgT2JqZWN0XVwiIHx8XG4gICAgICAgIHR5cGUgPT09IFwiW29iamVjdCBBcnJheV1cIlxuICAgICAgKVxuXG4gICAgICBpZiAoKG92ZXJ3cml0ZSAmJiAhaXNvYmplY3QpIHx8ICghb3ZlcndyaXRlICYmIHJlY2lwaWVudFtrZXkxXSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICByZWNpcGllbnRba2V5MV0gPSAoXG4gICAgICAgICAgdHlwZW9mIGtleTIgPT09ICdudW1iZXInICYmXG4gICAgICAgICAgIW9wdHMub2JqZWN0ID8gW10gOiB7fVxuICAgICAgICApXG4gICAgICB9XG5cbiAgICAgIHJlY2lwaWVudCA9IHJlY2lwaWVudFtrZXkxXVxuICAgICAgaWYgKHNwbGl0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAga2V5MSA9IGdldGtleShzcGxpdC5zaGlmdCgpKVxuICAgICAgICBrZXkyID0gZ2V0a2V5KHNwbGl0WzBdKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVuZmxhdHRlbiBhZ2FpbiBmb3IgJ21lc3N5IG9iamVjdHMnXG4gICAgcmVjaXBpZW50W2tleTFdID0gdW5mbGF0dGVuKHRhcmdldFtrZXldLCBvcHRzKVxuICB9KVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBCdWZmZXIgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcih2YWx1ZSlcbn1cbiJdfQ==
