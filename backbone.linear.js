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
        if (opts.safe == null) {
          opts.safe = true;
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
            if (!isarray && isobject && Object.keys(value).length) {
              return step(value, newKey);
            }
            return output[newKey] = value;
          });
        };
        step(target);
        return output;
      };

      Linear_Model.unflatten = unflatten = function(target, opts) {
        var delimiter, getkey, overwrite, result;
        if (opts == null) {
          opts = {};
        }
        delimiter = opts.delimiter || ".";
        overwrite = opts.overwrite || false;
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
          var isobject, key1, key2, recipient, split, type;
          split = key.split(delimiter);
          key1 = getkey(split.shift());
          key2 = getkey(split[0]);
          recipient = result;
          while (key2 !== void 0) {
            type = Object.prototype.toString.call(recipient[key1]);
            isobject = type === "[object Object]" || type === "[object Array]";
            if ((overwrite && !isobject) || (!overwrite && recipient[key1] === void 0)) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2tib25lLmxpbmVhci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBO21TQUFBOztBQUFBLEVBQUcsQ0FBQSxTQUNDLE1BREQsRUFFQyxPQUZELEdBQUE7QUFzTEMsUUFBQSxXQUFBO0FBQUEsSUFBQSxJQUFHLE1BQUEsQ0FBQSxNQUFBLEtBQWlCLFVBQWpCLElBQWtDLE1BQU0sQ0FBQyxHQUE1QzthQUNJLE1BQUEsQ0FBTyxDQUFDLFlBQUQsRUFBZSxVQUFmLENBQVAsRUFBbUMsU0FBQyxDQUFELEVBQUksUUFBSixHQUFBO2VBQy9CLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBaEIsR0FBK0IsT0FBQSxDQUFRLENBQVIsRUFBVyxRQUFYLEVBREE7TUFBQSxDQUFuQyxFQURKO0tBQUEsTUFJSyxJQUFHLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQW5CLElBQXFDLE1BQU0sQ0FBQyxPQUEvQztBQUNELE1BQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBQUosQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBRFgsQ0FBQTthQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsQ0FBUSxDQUFSLEVBQVcsUUFBWCxFQUhoQjtLQUFBLE1BQUE7YUFNRCxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQWhCLEdBQStCLE9BQUEsQ0FBUSxNQUFNLENBQUMsQ0FBZixFQUFrQixNQUFNLENBQUMsUUFBekIsRUFOOUI7S0ExTE47RUFBQSxDQUFBLENBQUgsQ0FDYSxJQURiLEVBRWMsU0FBQyxDQUFELEVBQUksUUFBSixHQUFBO1dBRUEsUUFBUSxDQUFDO0FBS1gsVUFBQSx1Q0FBQTs7QUFBQSxxQ0FBQSxDQUFBOzs7O09BQUE7O0FBQUEsTUFBQSxZQUFDLENBQUEsT0FBRCxHQUFXLE9BQUEsR0FBVSxTQUFDLE1BQUQsRUFBUyxJQUFULEdBQUE7QUFDakIsWUFBQSx1QkFBQTs7VUFEMEIsT0FBTztTQUNqQztB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QUMsTUFBWDtpQkFDSSxTQUFBLENBQVUsMENBQUEsU0FBQSxDQUFWLEVBQWlCLElBQUMsQ0FBQSxZQUFsQixFQURKO1NBQUEsTUFBQTtpQkFHSSwwQ0FBQSxTQUFBLEVBSEo7U0FESztNQUFBLENBN0hULENBQUE7O0FBQUEsTUF1SUEsbUJBQUEsR0FBc0IsU0FBQyxNQUFELEVBQVMsV0FBVCxHQUFBO0FBQ2xCLFlBQUEsMkJBQUE7QUFBQSxhQUFBLGtEQUFBO2lDQUFBO0FBQ0ksVUFBQSxJQUFHLENBQUMsQ0FBQyxPQUFGLENBQVUsTUFBTyxDQUFBLElBQUEsQ0FBakIsQ0FBSDtBQUNJLHFCQURKO1dBQUEsTUFFSyxJQUFHLG9CQUFIO0FBQ0QsWUFBQSxNQUFPLENBQUEsSUFBQSxDQUFQLEdBQWUsQ0FBQyxNQUFPLENBQUEsSUFBQSxDQUFSLENBQWYsQ0FEQztXQUFBLE1BQUE7QUFHRCxZQUFBLFdBQUEsR0FBYyxFQUFkLENBQUE7QUFBQSxZQUNBLE1BQUEsR0FDSSxDQUFDLENBQUMsS0FBRixDQUFRLE1BQVIsQ0FDQSxDQUFDLEtBREQsQ0FBQSxDQUVBLENBQUMsR0FGRCxDQUVLLFNBQUMsSUFBRCxHQUFBO0FBQ0Qsa0JBQUEsUUFBQTtBQUFBLGNBREcsZUFBSyxhQUNSLENBQUE7QUFBQSxjQUFBLElBQUcsR0FBRyxDQUFDLEtBQUosQ0FBVSxNQUFBLENBQVEsR0FBQSxHQUFwRCxJQUE0QyxDQUFWLENBQUg7QUFDSSxnQkFBQSxXQUFZLENBQUEsRUFBQSxHQUFFLENBQ1YsR0FBRyxDQUFDLEtBQUosQ0FBVSxVQUFWLENBQXNCLENBQUEsQ0FBQSxDQURaLENBQUYsQ0FBWixHQUVNLEdBRk4sQ0FBQTt1QkFHQSxLQUpKO2VBQUEsTUFBQTt1QkFNSSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBTko7ZUFEQztZQUFBLENBRkwsQ0FVQSxDQUFDLE9BVkQsQ0FBQSxDQVdBLENBQUMsTUFYRCxDQUFBLENBWUEsQ0FBQyxLQVpELENBQUEsQ0FGSixDQUFBO0FBQUEsWUFlQSxNQUFPLENBQUEsSUFBQSxDQUFQLEdBQ08sQ0FBQyxDQUFDLElBQUYsQ0FBTyxXQUFQLENBQUgsR0FDSSxDQUFDLFdBQUQsQ0FESixHQUdJLEVBbkJSLENBSEM7V0FIVDtBQUFBLFNBQUE7ZUEwQkEsT0EzQmtCO01BQUEsQ0F2SXRCLENBQUE7O0FBQUEsNkJBd0tBLFlBQUEsR0FDSTtBQUFBLFFBQUEsSUFBQSxFQUFPLElBQVA7T0F6S0osQ0FBQTs7MEJBQUE7O09BTGdDLFFBQVEsQ0FBQyxPQUZ2QztFQUFBLENBRmQsQ0FBQSxDQUFBO0FBQUEiLCJmaWxlIjoiYmFja2JvbmUubGluZWFyLmpzIiwic291cmNlUm9vdCI6Ii4vIn0=