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
  })((function() {
    return this;
  })(), function(_, Backbone) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2tib25lLmxpbmVhci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBO21TQUFBOztBQUFBLEVBQUcsQ0FBQSxTQUNDLE1BREQsRUFFQyxPQUZELEdBQUE7QUFzTEMsUUFBQSxXQUFBO0FBQUEsSUFBQSxJQUFHLE1BQUEsQ0FBQSxNQUFBLEtBQWlCLFVBQWpCLElBQWtDLE1BQU0sQ0FBQyxHQUE1QzthQUNJLE1BQUEsQ0FBTyxDQUFDLFlBQUQsRUFBZSxVQUFmLENBQVAsRUFBbUMsU0FBQyxDQUFELEVBQUksUUFBSixHQUFBO2VBQy9CLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBaEIsR0FBK0IsT0FBQSxDQUFRLENBQVIsRUFBVyxRQUFYLEVBREE7TUFBQSxDQUFuQyxFQURKO0tBQUEsTUFJSyxJQUFHLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQW5CLElBQXFDLE1BQU0sQ0FBQyxPQUEvQztBQUNELE1BQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxZQUFSLENBQUosQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBRFgsQ0FBQTthQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsQ0FBUSxDQUFSLEVBQVcsUUFBWCxFQUhoQjtLQUFBLE1BQUE7YUFNRCxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQWhCLEdBQStCLE9BQUEsQ0FBUSxNQUFNLENBQUMsQ0FBZixFQUFrQixNQUFNLENBQUMsUUFBekIsRUFOOUI7S0ExTE47RUFBQSxDQUFBLENBQUgsQ0FDZ0IsQ0FBQSxTQUFBLEdBQUE7V0FBRyxLQUFIO0VBQUEsQ0FBQSxDQUFILENBQUEsQ0FEYixFQUVjLFNBQUMsQ0FBRCxFQUFJLFFBQUosR0FBQTtXQUVBLFFBQVEsQ0FBQztBQUtYLFVBQUEsdUNBQUE7O0FBQUEscUNBQUEsQ0FBQTs7OztPQUFBOztBQUFBLE1BQUEsWUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFBLEdBQVUsU0FBQyxNQUFELEVBQVMs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RCxHQUFBOztVQUFDLFVBQVU7U0FDaEI7QUFBQSxRQUFBLElBQUcsT0FBTyxDQUFDLE1BQVg7aUJBQ0ksU0FBQSxDQUFVLDBDQUFBLFNBQUEsQ0FBVixFQUFpQixJQUFDLENBQUEsWUFBbEIsRUFESjtTQUFBLE1BQUE7aUJBR0ksMENBQUEsU0FBQSxFQUhKO1NBREs7TUFBQSxDQTdIVCxDQUFBOztBQUFBLE1BdUlBLG1CQUFBLEdBQXNCLFNBQUMsTUFBRCxFQUFTLFdBQVQsR0FBQTtBQUNsQixZQUFBLDJCQUFBO0FBQUEsYUFBQSxrREFBQTtpQ0FBQTtBQUNJLFVBQUEsSUFBRyxDQUFDLENBQUMsT0FBRixDQUFVLE1BQU8sQ0FBQSxJQUFBLENBQWpCLENBQUg7QUFDSSxxQkFESjtXQUFBLE1BRUssSUFBRyxvQkFBSDtBQUNELFlBQUEsTUFBTyxDQUFBLElBQUEsQ0FBUCxHQUFlLENBQUMsTUFBTyxDQUFBLElBQUEsQ0FBUixDQUFmLENBREM7V0FBQSxNQUFBO0FBR0QsWUFBQSxXQUFBLEdBQWMsRUFBZCxDQUFBO0FBQUEsWUFDQSxNQUFBLEdBQ0ksQ0FBQyxDQUFDLEtBQUYsQ0FBUSxNQUFSLENBQ0EsQ0FBQyxLQURELENBQUEsQ0FFQSxDQUFDLEdBRkQsQ0FFSyxTQUFDLElBQUQsR0FBQTtBQUNELGtCQUFBLFFBQUE7QUFBQSxjQURHLGVBQUssYUFDUixDQUFBO0FBQUEsY0FBQSxJQUFHLEdBQUcsQ0FBQyxLQUFKLENBQVUsTUFBQSxDQUFRLEdBQUEsR0FBcEQsSUFBNEMsQ0FBVixDQUFIO0FBQ0ksZ0JBQUEsV0FBWSxDQUFBLEVBQUEsR0FBRSxDQUNWLEdBQUcsQ0FBQyxLQUFKLENBQVUsVUFBVixDQUFzQixDQUFBLENBQUEsQ0FEWixDQUFGLENBQVosR0FFTSxHQUZOLENBQUE7dUJBR0EsS0FKSjtlQUFBLE1BQUE7dUJBTUksQ0FBQyxHQUFELEVBQU0sR0FBTixFQU5KO2VBREM7WUFBQSxDQUZMLENBVUEsQ0FBQyxPQVZELENBQUEsQ0FXQSxDQUFDLE1BWEQsQ0FBQSxDQVlBLENBQUMsS0FaRCxDQUFBLENBRkosQ0FBQTtBQUFBLFlBZUEsTUFBTyxDQUFBLElBQUEsQ0FBUCxHQUNPLENBQUMsQ0FBQyxJQUFGLENBQU8sV0FBUCxDQUFILEdBQ0ksQ0FBQyxXQUFELENBREosR0FHSSxFQW5CUixDQUhDO1dBSFQ7QUFBQSxTQUFBO2VBMEJBLE9BM0JrQjtNQUFBLENBdkl0QixDQUFBOztBQUFBLDZCQXdLQSxZQUFBLEdBQ0k7QUFBQSxRQUFBLElBQUEsRUFBTyxJQUFQO09BektKLENBQUE7OzBCQUFBOztPQUxnQyxRQUFRLENBQUMsT0FGdkM7RUFBQSxDQUZkLENBQUEsQ0FBQTtBQUFBIiwiZmlsZSI6ImJhY2tib25lLmxpbmVhci5qcyIsInNvdXJjZVJvb3QiOiIuLyJ9