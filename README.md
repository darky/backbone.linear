# Backbone.Linear

[![](https://travis-ci.org/darrrk/backbone.linear.svg?branch=master)](https://travis-ci.org/darrrk/backbone.linear)

Easiest way to work with your Backbone.Model nested array-object attributes.

## Idea

Unlike other similar libraries, `Backbone.Linear` not fighting versus Backbone API and hardly rewrite them.
`Backbone.Linear` - little extension, that extend only `parse` and `sync` methods in `Backbone.Model`
For example if server responds:

```json
{
    "Cats": {
        "Boris": {
            "age": 3,
            "weight": 4
        },
        "Milla": {
            "age": 1,
            "weight": 2
        }
    }
}
```
    
In `parse` method it transforms in:

```json
{
    "Cats.Boris.age": 3,
    "Cats.Boris.weight": 4,
    "Cats.Milla.age": 1,
    "Cats.Milla.weight": 2
}
```
    
And you can use all Backbone API power with linear attributes.
Then you save it back to server, it transforms backward to:

```json
{
    "Cats": {
        "Boris": {
            "age": 3,
            "weight": 8,
            "note": "Oh, Boris look plumped"
        },
        "Milla": {
            "age": 1,
            "weight": 2
        }
    }
}
```

## Simple using

All similar `Backbone`, only using `Backbone.LinearModel` class

```javascript
var MyLinearModelClass = Backbone.LinearModel.extend(
    // bla-bla
)
```
    
## Extend using

You can define `flatOptions` settings (object or function, that return object) to manipulate server <-> client transform behavior:

### delimiter (default: ".")

```javascript
var MyLinearModelClass = Backbone.LinearModel.extend({
    flatOptions : {
        delimiter : "-"
    }
});
```
    
Server response:

```json
{
    "Cats": {
        "Boris": {
            "age": 3,
            "weight": 4
        },
        "Milla": {
            "age": 1,
            "weight": 2
        }
    }
}
```
    
Transforms to:

```json
{
    "Cats-Boris-age": 3,
    "Cats-Boris-weight": 4,
    "Cats-Milla-age": 1,
    "Cats-Milla-weight": 2
}
```
    
And vice versa...

### safe (default: true)
    
By default server response:

```json
{
    "Cats": {
        "Boris": {
            "age": 3,
            "weight": 4,
            "toys": [
                "ball",
                "mouse"
            ]
        },
        "Milla": {
            "age": 1,
            "weight": 2
        }
    }
}
```
    
Transforms with preservation array structure:

```json
{
    "Cats.Boris.age": 3,
    "Cats.Boris.weight": 4,
    "Cats.Boris.toys": ["ball", "mouse"],
    "Cats.Milla.age": 1,
    "Cats.Milla.weight": 2
}
```
    
Use `safe : false`:

```javascript
var MyLinearModelClass = Backbone.LinearModel.extend({
    flatOptions : {
        safe : false
    }
});
```

And server response will be with objectify arrays:

```json
{
    "Cats.Boris.age": 3,
    "Cats.Boris.weight": 4,
    "Cats.Boris.toys.0": "ball",
    "Cats.Boris.toys.1": "mouse",
    "Cats.Milla.age": 1,
    "Cats.Milla.weight": 2
}
```
    
### object (default: false)

```javascript
var MyLinearModelClass = Backbone.LinearModel.extend({
    flatOptions : {
        object : true
    }
});
```

When your client data:

```json
{
    "Cats.Boris.age": 3,
    "Cats.Boris.weight": 4,
    "Cats.Boris.toys.0": "ball",
    "Cats.Boris.toys.1": "mouse",
    "Cats.Milla.age": 1,
    "Cats.Milla.weight": 2
}
```
    
Will save on server, array not be created automatically:

```json
{
    "Cats": {
        "Boris": {
            "age": 3,
            "weight": 4,
            "toys": {
                "0": "ball",
                "1": "mouse"
            }
        },
        "Milla": {
            "age": 1,
            "weight": 2
        }
    }
}
```
    
Instead:

```json
{
    "Cats": {
        "Boris": {
            "age": 3,
            "weight": 4,
            "toys": [
                "ball",
                "mouse"
            ]
        },
        "Milla": {
            "age": 1,
            "weight": 2
        }
    }
}
```

### overwrite (default: false)

```javascript
var MyLinearModelClass = Backbone.LinearModel.extend({
    flatOptions : {
        overwrite : true
    }
});
```

When your client data:

```json
{
    "Cats.Boris.toys": true,
    "Cats.Boris.toys.0": "ball",
    "Cats.Boris.toys.1": "mouse"
}
```
    
Will save on server - internal array, with collision by key, will be included:

```json
{
    "Cats": {
        "Boris": {
            "toys" : [
                "ball",
                "mouse"
            ]
        }
    }
}
```
    
Instead:

```json
{
    "Cats": {
        "Boris": {
            "toys" : true
        }
    }
}
```

### maxDepth (default: undefined)

```javascript
var MyLinearModelClass = Backbone.LinearModel.extend({
    flatOptions : {
        maxDepth : 2
    }
});
```

Server response:

```json
{
    "Cats": {
        "Boris": {
            "age": 3,
            "weight": 4
        },
        "Milla": {
            "age": 1,
            "weight": 2
        }
    }
}
```
    
Transforms to:

```json
{
    "Cats.Boris": {
        "age": 3,
        "weight": 4
    },
    "Cats.Milla": {
        "age": 1,
        "weight": 2
    }
}
```

### forceArray (default: undefined)

```javascript
var MyLinearModelClass = Backbone.LinearModel.extend({
    flatOptions : {
        forceArray : [
            "Cats.Boris.age",
            "Cats.Boris.eyes",
            "Cats.Boris.toys",
            "Cats.Milla.toys"
        ]
    }
});
```
    
And server response:

```json
{
    "Cats": {
        "Boris": {
            "age": 3,
            "weight": 4,
            "toys": {
                "item": "ball"
            },
            "eyes": [
                "left_eye"
                "right_eye"
            ]
        },
        "Milla": {
            "age": 1,
            "weight": 2
        }
    }
}
```
    
Guarantees the creation of array:

```json
{
    "Cats.Boris.age": [3],
    "Cats.Boris.weight": 4,
    "Cats.Boris.toys": [{"item": "ball"}],
    "Cats.Boris.eyes": ["left_eye", "right_eye"],
    "Cats.Milla.age": 1,
    "Cats.Milla.weight": 2,
    "Cats.Milla.toys": []
}
```
    
**Note: When using `forceArray` - option `safe` force set to `true`**

## Helpers

You can manually flatten, unflatten objects via static helpers:

```javascript
Backbone.LinearModel.flatten(target, options);
Backbone.LinearModel.unflatten(target, options);
```

As options you can use `delimiter`, `safe`, `object`, that described above

## Dependencies

```coffeescript
switch Backbone.VERSION
    when "1.1.2", "1.2.0"
        "Yep, all tests passing"
    else
        "Maybe, but not testing"
```

## License 

(The MIT License)

Copyright (c) 2014-2015 Vladislav Botvin &lt;darkvlados@gmail.com&gt;

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


### License of Flat

Copyright (c) 2014, Hugh Kennedy
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the  nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

HIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
