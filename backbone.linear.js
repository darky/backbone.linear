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
            object = _.chain(object).pairs().map(function(_arg) {
              var key, val;
              key = _arg[0], val = _arg[1];
              if (key.match(RegExp("^" + path))) {
                obj_in_path["" + (key.match(/\.(\w+)$/)[1])] = val;
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

      Linear_Model.prototype.flat_options = {
        safe: true
      };

      return Linear_Model;

    })(Backbone.Model);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2tib25lLmxpbmVhci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBO21TQUFBOztBQUFBLEVBQUcsQ0FBQSxTQUNDLE1BREQsRUFFQyxPQUZELEdBQUE7QUF1S0MsUUFBQSxXQUFBO0FBQUEsSUFBQSxJQUFHLE1BQUEsQ0FBQSxNQUFBLEtBQWlCLFVBQWpCLElBQWtDLE1BQU0sQ0FBQyxHQUE1QzthQUNJLE1BQUEsQ0FBTyxDQUFDLFlBQUQsRUFBZSxVQUFmLENBQVAsRUFBbUMsU0FBQyxDQUFELEVBQUksUUFBSixHQUFBO2VBQy9CLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBaEIsR0FBK0IsT0FBQSxDQUFRLENBQVIsRUFBVyxRQUFYLEVBREE7TUFBQSxDQUFuQyxFQURKO0tBQUEsTUFJSyxJQUFHLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQW5CLElBQXFDLE1BQU0sQ0FBQyxPQUEvQztBQUNELE1BQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBQUosQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBRFgsQ0FBQTthQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsQ0FBUSxDQUFSLEVBQVcsUUFBWCxFQUhoQjtLQUFBLE1BQUE7YUFNRCxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQWhCLEdBQStCLE9BQUEsQ0FBUSxNQUFNLENBQUMsQ0FBZixFQUFrQixNQUFNLENBQUMsUUFBekIsRUFOOUI7S0EzS047RUFBQSxDQUFBLENBQUgsQ0FDYSxJQURiLEVBRWMsU0FBQyxDQUFELEVBQUksUUFBSixHQUFBO1dBRUEsUUFBUSxDQUFDO0FBS1gsVUFBQSx1Q0FBQTs7QUFBQSxxQ0FBQSxDQUFBOzs7O09BQUE7O0FBQUEsTUFBQSxZQUFDLENBQUEsT0FBRCxHQUFXLE9BQUEsR0FBVSxTQUFDLE1BQUQsRUFBUyxJQUFULEdBQUE7QUFDakIsWUFBQSx1QkFBQTs7VUFEMEIsT0FBTztTQUNqQztB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