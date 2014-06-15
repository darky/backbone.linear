do (
    global = @
    _
    Backbone
    factory = (_, Backbone)->

        class Backbone.Linear_Model extends Backbone.Model

            # ****************
            #    FLAT 1.2.1
            # ****************
            flatten = (target, opts)->
                delimiter = opts.delimiter  or  "."
                output = {}

                step = (object, prev)->
                    Object.keys object
                    .forEach (key)->
                        value = object[key]
                        isarray = opts.safe  and  Array.isArray value
                        type = Object::toString.call value
                        isobject =
                            type is "[object Object]"  or
                            type is "[object Array]"

                        newKey =
                            if prev
                                prev + delimiter + key
                            else
                                key

                        if not isarray  and  isobject
                            return step value, newKey

                        output[newKey] = value

                step target
                output

            unflatten = (target, opts)->
                delimiter = opts.delimiter  or  "."
                result = {}

                if Object::toString.call(target) isnt "[object Object]"
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
                        if recipient[key1] is undefined
                            recipient[key1] =
                                typeof key2 is "number"  and
                                unless opts.object  then []  else {}

                        recipient = recipient[key1]
                        if split.length > 0
                            key1 = getkey split.shift()
                            key2 = getkey split[0]

                        # unflatten again for 'messy objects'
                        recipient[key1] = unflatten target[key], opts

                    return result


            # ********************
            #    BACKBONE 1.1.2
            # ********************
            parse : ->
                flatten super, @flat_options

            sync : (method, model, options)->
                attrs = unflatten(
                    options.attrs  or  model.toJSON(options)
                    @flat_options
                )
                opts = _.extend(
                    options
                    attrs : attrs
                )

                super method, model, opts


            # **********************
            #    BACKBONE-LINEAR
            # **********************
            flat_options : {}

) ->
    
    if typeof define is "function"  and  define.amd
        define ["underscore", "backbone"], (_, Backbone)->
            global.Backbone.Linear_Model = factory _, Backbone

    else if typeof module isnt "undefined"  and  module.exports
        _ = require "undescore"
        Backbone = require "backbone"
        module.exports = factory _, Backbone

    else
        global.Backbone.Linear_Model = factory _, Backbone