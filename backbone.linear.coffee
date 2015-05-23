global = do -> @
factory = (_, Backbone)->

    class Backbone.Linear_Model extends Backbone.Model

        # ****************
        #    FLAT 1.5.1
        # ****************
        @flatten = flatten = (target, opts = {})->
            unless opts.safe?
                opts.safe = true

            delimiter = opts.delimiter  or  "."
            output = {}

            step = (object, prev)->
                Object.keys object
                .forEach (key)->
                    value = object[key]
                    isarray = opts.safe  and  Array.isArray value
                    type = Object::toString.call value
                    isbuffer = isBuffer value
                    isobject =
                        type is "[object Object]"  or
                        type is "[object Array]"

                    newKey =
                        if prev
                            prev + delimiter + key
                        else
                            key

                    if (
                        not isarray  and
                        not isbuffer  and
                        isobject  and
                        Object.keys(value).length
                    )
                        return step value, newKey

                    output[newKey] = value

            step target
            output

        @unflatten = unflatten = (target, opts = {})->
            delimiter = opts.delimiter  or  "."
            overwrite = opts.overwrite  or  false
            result = {}

            isbuffer = isBuffer target
            if (
                isbuffer  or
                Object::toString.call(target) isnt "[object Object]"
            )
                return target

            # safely ensure that the key is
            # an integer.
            getkey = (key)->
                parsedKey = Number(key)

                if (
                    isNaN(parsedKey)  or
                    key.indexOf(".") isnt -1
                )
                    key
                else
                    parsedKey

            Object.keys target
            .forEach (key)->
                split = key.split delimiter
                key1 = getkey split.shift()
                key2 = getkey split[0]
                recipient = result

                while key2 isnt undefined
                    type = Object.prototype.toString.call recipient[key1]
                    isobject =
                        type is "[object Object]"  or
                        type is "[object Array]"
                    if (
                        (overwrite  and  not isobject)  or
                        (not overwrite  and  recipient[key1] is undefined)
                    )
                        recipient[key1] =
                            if typeof key2 is "number"  and  not opts.object
                                []
                            else
                                {}

                    recipient = recipient[key1]
                    if split.length > 0
                        key1 = getkey split.shift()
                        key2 = getkey split[0]

                # unflatten again for 'messy objects'
                recipient[key1] = unflatten target[key], opts

            result

        isBuffer = (value)->
            unless Buffer?
                return false
            return Buffer.isBuffer value


        # ********************
        #    BACKBONE 1.1.2
        # ********************
        parse : ->
            parent_call = super
            if (
                not parent_call?  or
                parent_call is ""  or
                parent_call instanceof @constructor
            )
                return parent_call

            flat_options = _.clone @flat_options
            if has_force_array = _.isArray flat_options.force_array
                flat_options.safe = true

            result = flatten parent_call, flat_options

            if has_force_array
                _transform_to_array result, flat_options.force_array
            else
                result

        sync : (method, model, options = {})->
            switch method
                when "create", "update", "patch"
                    opts = _.extend {}, options,
                        if method is "patch"
                            attrs : unflatten options.attrs, @flat_options
                        else
                            unflat : true

                    super method, model, opts
                else
                    super

        toJSON : (options = {})->
            if options.unflat
                unflatten super, @flat_options
            else
                super


        # *****************************
        #    BACKBONE-LINEAR-PRIVATE
        # *****************************
        _transform_to_array = (object, force_array)->
            for path in force_array
                if _.isArray object[path]
                    continue
                else if object[path]?
                    object[path] = [object[path]]
                else
                    obj_in_path = {}
                    object =
                        _.chain object
                        .pairs()
                        .map ([key, val])->
                            if key.match RegExp "^#{ path }"
                                obj_in_path["#{
                                    key.match(/\.(\w+)$/)[1]
                                }"] = val
                                null
                            else
                                [key, val]
                        .compact()
                        .object()
                        .value()
                    object[path] =
                        if _.size obj_in_path
                            [obj_in_path]
                        else
                            []
            object


        # ****************************
        #    BACKBONE-LINEAR-PUBLIC
        # ****************************
        flat_options :
            safe : true

    
if typeof define is "function"  and  define.amd
    define ["underscore", "backbone"], (_, Backbone)->
        global.Backbone.Linear_Model = factory _, Backbone

else if typeof module isnt "undefined"  and  module.exports
    _ = require "underscore"
    Backbone = require "backbone"
    module.exports = factory _, Backbone

else
    global.Backbone.Linear_Model = factory global._, global.Backbone
