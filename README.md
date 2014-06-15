# Backbone.Linear

Easiest way to work with your Backbone.Model nested array-object attributes.

## Using

All similar `Backbone`, only using `Backbone.Linear_Model` class

    var My_Linear_Model_Class = Backbone.Linear_Model.extend(
        // bla-bla
    )
    
Or coffee:
    
    class My_Linear_Model_Class extends Backbone.Linear_Model
    
        # bla-bla

## Idea

Unlike other similar libraries, `Backbone.Linear` not fighting versus Backbone API and hardly rewrite them.
`Backbone.Linear` - little extension, that extend only `parse` and `sync` methods in `Backbone.Model`
For example if server respond:

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
    
`Backbone.Linear` use as engine [flat](//github.com/hughsk/flat) inside.
If you want to rewrite default flat options, simply define `flat_options` object in your `Backbone.Linear_Model` class.

## Dependencies

Backbone >= 0.9.9

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