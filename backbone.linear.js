(function() {
  var Backbone, _, factory, global,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  global = (function() {
    return this;
  })();

  factory = function(_, Backbone) {
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
  };

  if (typeof define === "function" && define.amd) {
    define(["underscore", "backbone"], function(_, Backbone) {
      return global.Backbone.Linear_Model = factory(_, Backbone);
    });
  } else if (typeof module !== "undefined" && module.exports) {
    _ = require("underscore");
    Backbone = require("backbone");
    module.exports = factory(_, Backbone);
  } else {
    global.Backbone.Linear_Model = factory(global._, global.Backbone);
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhY2tib25lLmxpbmVhci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDRCQUFBO0lBQUE7OztFQUFBLE1BQUEsR0FBWSxDQUFBLFNBQUE7V0FBRztFQUFILENBQUEsQ0FBSCxDQUFBOztFQUNULE9BQUEsR0FBVSxTQUFDLENBQUQsRUFBSSxRQUFKO1dBRUEsUUFBUSxDQUFDO0FBS1gsVUFBQTs7Ozs7Ozs7TUFBQSxZQUFDLENBQUEsT0FBRCxHQUFXLE9BQUEsR0FBVSxTQUFDLE1BQUQsRUFBUyxJQUFUO0FBQ2pCLFlBQUE7O1VBRDBCLE9BQU87O1FBQ2pDLElBQU8saUJBQVA7VUFDSSxJQUFJLENBQUMsSUFBTCxHQUFZLEtBRGhCOztRQUdBLFNBQUEsR0FBWSxJQUFJLENBQUMsU0FBTCxJQUFvQjtRQUNoQyxNQUFBLEdBQVM7UUFFVCxJQUFBLEdBQU8sU0FBQyxNQUFELEVBQVMsSUFBVDtpQkFDSCxNQUFNLENBQUMsSUFBUCxDQUFZLE1BQVosQ0FDQSxDQUFDLE9BREQsQ0FDUyxTQUFDLEdBQUQ7QUFDTCxnQkFBQTtZQUFBLEtBQUEsR0FBUSxNQUFPLENBQUEsR0FBQTtZQUNmLE9BQUEsR0FBVSxJQUFJLENBQUMsSUFBTCxJQUFnQixLQUFLLENBQUMsT0FBTixDQUFjLEtBQWQ7WUFDMUIsSUFBQSxHQUFPLE1BQU0sQ0FBQSxTQUFFLENBQUEsUUFBUSxDQUFDLElBQWpCLENBQXNCLEtBQXRCO1lBQ1AsUUFBQSxHQUFXLFFBQUEsQ0FBUyxLQUFUO1lBQ1gsUUFBQSxHQUNJLElBQUEsS0FBUSxpQkFBUixJQUNBLElBQUEsS0FBUTtZQUVaLE1BQUEsR0FDTyxJQUFILEdBQ0ksSUFBQSxHQUFPLFNBQVAsR0FBbUIsR0FEdkIsR0FHSTtZQUVSLElBQ0ksQ0FBSSxPQUFKLElBQ0EsQ0FBSSxRQURKLElBRUEsUUFGQSxJQUdBLE1BQU0sQ0FBQyxJQUFQLENBQVksS0FBWixDQUFrQixDQUFDLE1BSnZCO0FBTUkscUJBQU8sSUFB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QVAsR0FBZSxDQUFDLE1BQU8sQ0FBQSxJQUFBLENBQVIsRUFEZDtXQUFBLE1BQUE7WUFHRCxXQUFBLEdBQWM7WUFDZCxNQUFBLEdBQ0ksQ0FBQyxDQUFDLEtBQUYsQ0FBUSxNQUFSLENBQ0EsQ0FBQyxLQURELENBQUEsQ0FFQSxDQUFDLEdBRkQsQ0FFSyxTQUFDLEdBQUQ7QUFDRCxrQkFBQTtjQURHLGNBQUs7Y0FDUixJQUFHLEdBQUcsQ0FBQyxLQUFKLENBQVUsTUFBQSxDQUFPLEdBQUEsR0FBSyxJQUFaLENBQVYsQ0FBSDtnQkFDSSxXQUFZLENBQUEsRUFBQSxHQUFFLENBQ1YsR0FBRyxDQUFDLEtBQUosQ0FBVSxVQUFWLENBQXNCLENBQUEsQ0FBQSxDQURaLENBQUYsQ0FBWixHQUVNO3VCQUNOLEtBSko7ZUFBQSxNQUFBO3VCQU1JLENBQUMsR0FBRCxFQUFNLEdBQU4sRUFOSjs7WUFEQyxDQUZMLENBVUEsQ0FBQyxPQVZELENBQUEsQ0FXQSxDQUFDLE1BWEQsQ0FBQSxDQVlBLENBQUMsS0FaRCxDQUFBO1lBYUosTUFBTyxDQUFBLElBQUEsQ0FBUCxHQUNPLENBQUMsQ0FBQyxJQUFGLENBQU8sV0FBUCxDQUFILEdBQ0ksQ0FBQyxXQUFELENBREosR0FHSSxHQXRCUDs7QUFIVDtlQTBCQTtNQTNCa0I7OzZCQWlDdEIsWUFBQSxHQUNJO1FBQUEsSUFBQSxFQUFPLElBQVA7Ozs7O09Bekw0QixRQUFRLENBQUM7RUFGdkM7O0VBOExWLElBQUcsT0FBTyxNQUFQLEtBQWlCLFVBQWpCLElBQWtDLE1BQU0sQ0FBQyxHQUE1QztJQUNJLE1BQUEsQ0FBTyxDQUFDLFlBQUQsRUFBZSxVQUFmLENBQVAsRUFBbUMsU0FBQyxDQUFELEVBQUksUUFBSjthQUMvQixNQUFNLENBQUMsUUFBUSxDQUFDLFlBQWhCLEdBQStCLE9BQUEsQ0FBUSxDQUFSLEVBQVcsUUFBWDtJQURBLENBQW5DLEVBREo7R0FBQSxNQUlLLElBQUcsT0FBTyxNQUFQLEtBQW1CLFdBQW5CLElBQXFDLE1BQU0sQ0FBQyxPQUEvQztJQUNELENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUjtJQUNKLFFBQUEsR0FBVyxPQUFBLENBQVEsVUFBUjtJQUNYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE9BQUEsQ0FBUSxDQUFSLEVBQVcsUUFBWCxFQUhoQjtHQUFBLE1BQUE7SUFNRCxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQWhCLEdBQStCLE9BQUEsQ0FBUSxNQUFNLENBQUMsQ0FBZixFQUFrQixNQUFNLENBQUMsUUFBekIsRUFOOUI7O0FBbk1MIiwiZmlsZSI6ImJhY2tib25lLmxpbmVhci5qcyIsInNvdXJjZVJvb3QiOiIuLyJ9