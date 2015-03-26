(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

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
  })((function() {
    return this;
  })(), function(_, Backbone) {
    return Backbone.Linear_Model = (function(superClass) {
      var _transform_to_array, flatten, isBuffer, unflatten;

      extend(Linear_Model, superClass);

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
            var isarray, isbuffer, isobject, newKey, type, value;
            value = object[key];
            isarray = opts.safe && Array.isArray(value);
            type = Object.prototype.toString.call(value);
            isbuffer = isBuffer(value);
            isobject = type === "[object Object]" || type === "[object Array]";
            newKey = prev ? prev + delimiter + key : key;
            if (!isarray && !isbuffer && isobject && Object.keys(value).length) {
              return step(value, newKey);
            }
            return output[newKey] = value;
          });
        };
        step(target);
        return output;
      };

      Linear_Model.unflatten = unflatten = function(target, opts) {
        var delimiter, getkey, isbuffer, overwrite, result;
        if (opts == null) {
          opts = {};
        }
        delimiter = opts.delimiter || ".";
        overwrite = opts.overwrite || false;
        result = {};
        isbuffer = isBuffer(target);
        if (isbuffer || Object.prototype.toString.call(target) !== "[object Object]") {
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

      isBuffer = function(value) {
        if (typeof Buffer === "undefined" || Buffer === null) {
          return false;
        }
        return Buffer.isBuffer(value);
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
        var i, len, obj_in_path, path;
        for (i = 0, len = force_array.length; i < len; i++) {
          path = force_array[i];
          if (_.isArray(object[path])) {
            continue;
          } else if (object[path] != null) {
            object[path] = [object[path]];
          } else {
            obj_in_path = {};
            object = _.chain(object).pairs().map(function(arg) {
              var key, val;
              key = arg[0], val = arg[1];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2tib25lLmxpbmVhci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOytCQUFBOztBQUFBLEVBQUcsQ0FBQSxTQUNDLE1BREQsRUFFQyxPQUZELEdBQUE7QUFpTUMsUUFBQSxXQUFBO0FBQUEsSUFBQSxJQUFHLE1BQUEsQ0FBQSxNQUFBLEtBQWlCLFVBQWpCLElBQWtDLE1BQU0sQ0FBQyxHQUE1QzthQUNJLE1BQUEsQ0FBTyxDQUFDLFlBQUQsRUFBZSxVQUFmLENBQVAsRUFBbUMsU0FBQyxDQUFELEVBQUksUUFBSixHQUFBO2VBQy9CLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBaEIsR0FBK0IsT0FBQSxDQUFRLENBQVIsRUFBVyxRQUFYLEVBREE7TUFBQSxDQUFuQyxFQURKO0tBQUEsTUFJSyxJQUFHLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQW5CLElBQXFDLE1BQU0sQ0FBQyxPQUEvQztBQUNELE1BQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBQUosQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBRFgsQ0FBQTthQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsQ0FBUSxDQUFSLEVBQVcsUUFBWCxFQUhoQjtLQUFBLE1BQUE7YUFNRCxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQWhCLEdBQStCLE9BQUEsQ0FBUSxNQUFNLENBQUMsQ0FBZixFQUFrQixNQUFNLENBQUMsUUFBekIsRUFOOUI7S0FyTU47RUFBQSxDQUFBLENBQUgsQ0FDZ0IsQ0FBQSxTQUFBLEdBQUE7V0FBRyxLQUFIO0VBQUEsQ0FBQSxDQUFILENBQUEsQ0FEYixFQUVjLFNBQUMsQ0FBRCxFQUFJLFFBQUosR0FBQTtXQUVBLFFBQVEsQ0FBQztBQUtYLFVBQUEsaURBQUE7O0FBQUEsc0NBQUEsQ0FBQTs7OztPQUFBOztBQUFBLE1BQUEsWUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFBLEdBQVUsU0FBQyxNQUFELEVBQVMs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Q0FBTyxHQUFBLEdBQUssSUFBWixDQUFWLENBQUg7QUFDSSxnQkFBQSxXQUFZLENBQUEsRUFBQSxHQUFFLENBQ1YsR0FBRyxDQUFDLEtBQUosQ0FBVSxVQUFWLENBQXNCLENBQUEsQ0FBQSxDQURaLENBQUYsQ0FBWixHQUVNLEdBRk4sQ0FBQTt1QkFHQSxLQUpKO2VBQUEsTUFBQTt1QkFNSSxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBTko7ZUFEQztZQUFBLENBRkwsQ0FVQSxDQUFDLE9BVkQsQ0FBQSxDQVdBLENBQUMsTUFYRCxDQUFBLENBWUEsQ0FBQyxLQVpELENBQUEsQ0FGSixDQUFBO0FBQUEsWUFlQSxNQUFPLENBQUEsSUFBQSxDQUFQLEdBQ08sQ0FBQyxDQUFDLElBQUYsQ0FBTyxXQUFQLENBQUgsR0FDSSxDQUFDLFdBQUQsQ0FESixHQUdJLEVBbkJSLENBSEM7V0FIVDtBQUFBLFNBQUE7ZUEwQkEsT0EzQmtCO01BQUEsQ0FsSnRCLENBQUE7O0FBQUEsNkJBbUxBLFlBQUEsR0FDSTtBQUFBLFFBQUEsSUFBQSxFQUFPLElBQVA7T0FwTEosQ0FBQTs7MEJBQUE7O09BTGdDLFFBQVEsQ0FBQyxPQUZ2QztFQUFBLENBRmQsQ0FBQSxDQUFBO0FBQUEiLCJmaWxlIjoiYmFja2JvbmUubGluZWFyLmpzIiwic291cmNlUm9vdCI6Ii4vIn0=