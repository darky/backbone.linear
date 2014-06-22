(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  (function(global, factory) {
    var Backbone, _;
    if (typeof define === "function" && define.amd) {
      return define(["underscore", "backbone"], function(_, Backbone) {
        return global.Backbone.Linear_Model = factory(_, Backbone);
      });
    } else if (typeof module !== "undefined" && module.exports) {
      _ = require("underscore");
      Backbone = require("backbone");
      return module.exports = factory(_, Backbone);
    } else {
      return global.Backbone.Linear_Model = factory(global._, global.Backbone);
    }
  })(this, function(_, Backbone) {
    return Backbone.Linear_Model = (function(_super) {
      var flatten, unflatten, _transform_to_array;

      __extends(Linear_Model, _super);

      function Linear_Model() {
        return Linear_Model.__super__.constructor.apply(this, arguments);
      }

      Linear_Model.flatten = flatten = function(target, opts) {
        var delimiter, output, step;
        if (opts == null) {
          opts = {};
        }
        delimiter = opts.delimiter || ".";
        output = {};
        step = function(object, prev) {
          return Object.keys(object).forEach(function(key) {
            var isarray, isobject, newKey, type, value;
            value = object[key];
            isarray = opts.safe && Array.isArray(value);
            type = Object.prototype.toString.call(value);
            isobject = type === "[object Object]" || type === "[object Array]";
            newKey = prev ? prev + delimiter + key : key;
            if (!isarray && isobject) {
              return step(value, newKey);
            }
            return output[newKey] = value;
          });
        };
        step(target);
        return output;
      };

      Linear_Model.unflatten = unflatten = function(target, opts) {
        var delimiter, getkey, result;
        if (opts == null) {
          opts = {};
        }
        delimiter = opts.delimiter || ".";
        result = {};
        if (Object.prototype.toString.call(target) !== "[object Object]") {
          return target;
        }
        getkey = function(key) {
          var parsedKey;
          parsedKey = Number(key);
          if (isNaN(parsedKey) || key.indexOf(".") !== -1) {
            return key;
          } else {
            return parsedKey;
          }
        };
        Object.keys(target).forEach(function(key) {
          var key1, key2, recipient, split;
          split = key.split(delimiter);
          key1 = getkey(split.shift());
          key2 = getkey(split[0]);
          recipient = result;
          while (key2 !== void 0) {
            if (recipient[key1] === void 0) {
              recipient[key1] = typeof key2 === "number" && !opts.object ? [] : {};
            }
            recipient = recipient[key1];
            if (split.length > 0) {
              key1 = getkey(split.shift());
              key2 = getkey(split[0]);
            }
          }
          return recipient[key1] = unflatten(target[key], opts);
        });
        return result;
      };

      Linear_Model.prototype.parse = function() {
        var flat_options, has_force_array, parent_call, result;
        parent_call = Linear_Model.__super__.parse.apply(this, arguments);
        if ((parent_call == null) || parent_call === "" || parent_call instanceof this.constructor) {
          return parent_call;
        }
        flat_options = _.clone(this.flat_options);
        if (has_force_array = _.isArray(flat_options.force_array)) {
          flat_options.safe = true;
        }
        result = flatten(parent_call, flat_options);
        if (has_force_array) {
          return _transform_to_array(result, flat_options.force_array);
        } else {
          return result;
        }
      };

      Linear_Model.prototype.sync = function(method, model, options) {
        var opts;
        if (options == null) {
          options = {};
        }
        switch (method) {
          case "create":
          case "update":
          case "patch":
            opts = _.extend({}, options, method === "patch" ? {
              attrs: unflatten(options.attrs, this.flat_options)
            } : {
              unflat: true
            });
            return Linear_Model.__super__.sync.call(this, method, model, opts);
          default:
            return Linear_Model.__super__.sync.apply(this, arguments);
        }
      };

      Linear_Model.prototype.toJSON = function(options) {
        if (options == null) {
          options = {};
        }
        if (options.unflat) {
          return unflatten(Linear_Model.__super__.toJSON.apply(this, arguments), this.flat_options);
        } else {
          return Linear_Model.__super__.toJSON.apply(this, arguments);
        }
      };

      _transform_to_array = function(object, force_array) {
        var obj_in_path, path, _i, _len;
        for (_i = 0, _len = force_array.length; _i < _len; _i++) {
          path = force_array[_i];
          if (_.isArray(object[path])) {
            continue;
          } else if (object[path] != null) {
            object[path] = [object[path]];
          } else {
            obj_in_path = {};
            object = _.chain(object).pairs().map(function(arr) {
              var key, val;
              key = arr[0], val = arr[1];
              if (key.match(RegExp("^" + path))) {
                obj_in_path["" + (path.match(/\.(\w+)$/)[1])] = val;
                return null;
              } else {
                return [key, val];
              }
            }).compact().object().value();
            object[path] = _.size(obj_in_path) ? [obj_in_path] : [];
          }
        }
        return object;
      };

      Linear_Model.prototype.flat_options = {};

      return Linear_Model;

    })(Backbone.Model);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2JvbmUubGluZWFyLmpzIiwic291cmNlcyI6WyJiYWNrYm9uZS5saW5lYXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTttU0FBQTs7QUFBQSxFQUFHLENBQUEsU0FDQyxNQURELEVBRUMsT0FGRCxHQUFBO0FBdUtDLFFBQUEsV0FBQTtBQUFBLElBQUEsSUFBRyxNQUFBLENBQUEsTUFBQSxLQUFpQixVQUFqQixJQUFrQyxNQUFNLENBQUMsR0FBNUM7YUFDSSxNQUFBLENBQU8sQ0FBQyxZQUFELEVBQWUsVUFBZixDQUFQLEVBQW1DLFNBQUMsQ0FBRCxFQUFJLFFBQUosR0FBQTtlQUMvQixNQUFNLENBQUMsUUFBUSxDQUFDLFlBQWhCLEdBQStCLE9BQUEsQ0FBUSxDQUFSLEVBQVcsUUFBWCxFQURBO01BQUEsQ0FBbkMsRUFESjtLQUFBLE1BSUssSUFBRyxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFxQyxNQUFNLENBQUMsT0FBL0M7QUFDRCxNQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUixDQUFKLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsVUFBUixDQURYLENBQUE7YUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixPQUFBLENBQVEsQ0FBUixFQUFXLFFBQVgsRUFIaEI7S0FBQSxNQUFBO2FBTUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFoQixHQUErQixPQUFBLENBQVEsTUFBTSxDQUFDLENBQWYsRUFBa0IsTUFBTSxDQUFDLFFBQXpCLEVBTjlCO0tBM0tOO0VBQUEsQ0FBQSxDQUFILENBQ2EsSUFEYixFQUVjLFNBQUMsQ0FBRCxFQUFJLFFBQUosR0FBQTtXQUVBLFFBQVEsQ0FBQztBQUtYLFVBQUEsdUNBQUE7O0FBQUEscUNBQUEsQ0FBQTs7OztPQUFBOztBQUFBLE1BQUEsWUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFBLEdBQVUsU0FBQyxNQUFELEVBQVMsSUFBVCxHQUFBO0FBQ2pCLFlB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