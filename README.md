# Backbone.Linear

Easiest way to work with your Backbone.Model nested array-object attributes.

## Idea

Unlike other similar libraries, `Backbone.Linear` not fighting versus Backbone API and hardly rewrite them.
`Backbone.Linear` - little extension, that extend only `parse` and `sync` methods in `Backbone.Model`
For example if server responds:

    {
        Cats:
            Boris: {
                age: 3,
                weight: 4
            },
            Milla: {
                age: 1,
                weight: 2
            }
    }
    
In `parse` method it transforms in:
    
    {
        "Cats.Boris.age": 3,
        "Cats.Boris.weight": 3,
        "Cats.Milla.age": 1,
        "Cats.Milla.weight": 2
    }
    
And you can use all Backbone API power with linear attributes.
Then you save it back to server, it transforms backward to:

    {
        Cats:
            Boris: {
                age: 3,
                weight: 8,
                note: "Oh, Boris look plumped"
            },
            Milla: {
                age: 1,
                weight: 2
            }
    }

## Simple using

All similar `Backbone`, only using `Backbone.Linear_Model` class

    var My_Linear_Model_Class = Backbone.Linear_Model.extend(
        // bla-bla
    )
    
## Extend using

You can define `flat_options` settings to manipulate server <-> client transform behavior:

### delimiter (default: ".")

    var My_Linear_Model_Class = Backbone.Linear_Model.extend({
        flat_options : {
            delimiter : "-"
        }
    });
    
Server response:
    
    {
        Cats:
            Boris: {
                age: 3,
                weight: 4
            },
            Milla: {
                age: 1,
                weight: 2
            }
    }
    
Transforms to:

    {
        "Cats-Boris-age": 3,
        "Cats-Boris-weight": 3,
        "Cats-Milla-age": 1,
        "Cats-Milla-weight": 2
    }
    
And vice versa...

### safe (default: false)

    var My_Linear_Model_Class = Backbone.Linear_Model.extend({
        flat_options : {
            safe : true
        }
    });
    
Server response:
    
    {
        Cats:
            Boris: {
                age: 3,
                weight: 4,
                toys: [
                    "ball",
                    "mouse"
                ]
            },
            Milla: {
                age: 1,
                weight: 2
            }
    }
    
Transforms with preservation array structure:

    {
        "Cats.Boris.age": 3,
        "Cats.Boris.weight": 3,
        "Cats.Boris.toys": ["ball", "mouse"],
        "Cats.Milla.age": 1,
        "Cats.Milla.weight": 2
    }
    
Instead:

    {
        "Cats.Boris.age": 3,
        "Cats.Boris.weight": 3,
        "Cats.Boris.toys.0": "ball",
        "Cats.Boris.toys.1": "mouse",
        "Cats.Milla.age": 1,
        "Cats.Milla.weight": 2
    }
    
### object (default: false)

    var My_Linear_Model_Class = Backbone.Linear_Model.extend({
        flat_options : {
            object : true
        }
    });

When your client data:

    {
        "Cats.Boris.age": 3,
        "Cats.Boris.weight": 3,
        "Cats.Boris.toys.0": "ball",
        "Cats.Boris.toys.1": "mouse",
        "Cats.Milla.age": 1,
        "Cats.Milla.weight": 2
    }
    
Will save on server, array not be created automatically:

    {
        "Cats.Boris.age": 3,
        "Cats.Boris.weight": 3,
        "Cats.Boris.toys": {
            0: "ball",
            1: "mouse"
        },
        "Cats.Milla.age": 1,
        "Cats.Milla.weight": 2
    }
    
Instead:

    {
        "Cats.Boris.age": 3,
        "Cats.Boris.weight": 3,
        "Cats.Boris.toys": ["ball", "mouse"],
        "Cats.Milla.age": 1,
        "Cats.Milla.weight": 2
    }
    
### force_array (default: undefined)

    var My_Linear_Model_Class = Backbone.Linear_Model.extend({
        flat_options : {
            force_array : [
                "Cats.Boris.age",
                "Cats.Boris.eyes",
                "Cats.Boris.toys",
                "Cats.Milla.toys"
            ]
        }
    });
    
And server response:

    {
        "Cats.Boris.age": 3,
        "Cats.Boris.weight": 3,
        "Cats.Boris.toys": {
            item: "ball"
        },
        "Cats.Boris.eyes": [
            "left_eye",
            "right_eye"
        ],
        "Cats.Milla.age": 1,
        "Cats.Milla.weight": 2
    }
    
Guarantees the creation of array:

    {
        "Cats.Boris.age": [3],
        "Cats.Boris.weight": 3,
        "Cats.Boris.toys": [{item: "ball"}],
        "Cats.Boris.eyes: ["left_eye", "right_eye"]
        "Cats.Milla.age": 1,
        "Cats.Milla.weight": 2,
        "Cats.Milla.toys": []
    }
    
**Note: When using `force_array` - option `safe` set to `true` automatically**

## Helpers

You can manually flatten, unflatten objects via static helpers:

    Backbone.Linear_Model.flatten(target, options)
    Backbone.Linear_Model.unflatten(target, options)

As options you can use `delimiter`, `safe`, `object`, that described above

## Dependencies

    switch Backbone.VERSION
        when "1.1.2"
            "Yep, all tests passing"
        else
            "Maybe, but not testing"

## License 

(The MIT License)

Copyright (c) 2014 Vladislav Botvin &lt;darkvlados@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.