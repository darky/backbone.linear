describe "Backbone.Linear test api", ->

    # ***************************
    #    FAKE-SERVER-RESPONSES
    # ***************************
    $.ajax.fake.registerWebservice "/fake_data/simple", (data)->
        if data?
            JSON.parse data
        else
            Cats:
                Boris:
                    age: 3,
                    weight: 4
                Milla:
                    age: 1,
                    weight: 2
                    
    $.ajax.fake.registerWebservice "/fake_data/safe", (data)->
        if data?
            JSON.parse data
        else
            Cats:
                Boris:
                    toys: [
                        "ball"
                        "mouse"
                    ]
                    
    $.ajax.fake.registerWebservice "/fake_data/force_array", (data)->
        if data?
            JSON.parse data
        else
            Cats:
                Boris:
                    age: 3,
                    weight: 3,
                    toys:
                        "item": "ball"
                    eyes: [
                        "left_eye"
                        "right_eye"
                    ]
                Milla:
                    age: 1,
                    weight: 2


    # ************
    #    DEFINE
    # ************
    beforeEach ->
        class Linear_Model_Class extends Backbone.Linear_Model

            urlRoot : "/fake_data"


        @linear_model = new Linear_Model_Class
        @linear_model.set "id", "simple"


    # ***********
    #    TESTS
    # ***********
    it "simple parse from server", (done)->
        @linear_model.fetch
            fake : true
            wait : 30
            
            success : (model)->
                attrs = model.attributes
                
                chai.expect(attrs).have.property "Cats.Boris.age", 3
                chai.expect(attrs).have.property "Cats.Boris.weight", 4
                chai.expect(attrs).have.property "Cats.Milla.age", 1
                chai.expect(attrs).have.property "Cats.Milla.weight", 2
                    
                done()
                
                
    it "simple send to server", (done)->
        @linear_model.set
            "Cats.Boris.age"    : 3
            "Cats.Boris.weight" : 4
            "Cats.Milla.age"    : 1
            "Cats.Milla.weight" : 2
            
        @linear_model.save null,
            fake : true
            wait : 30
            
            success : (model, mirrored)->
                chai.expect(mirrored).have.deep.property "Cats.Boris.age", 3
                chai.expect(mirrored).have.deep.property "Cats.Boris.weight", 4
                chai.expect(mirrored).have.deep.property "Cats.Milla.age", 1
                chai.expect(mirrored).have.deep.property "Cats.Milla.weight", 2
                
                done()
                
                
    it "parse by `delimiter` from server", (done)->
        @linear_model.flat_options = delimiter : "-"
        
        @linear_model.fetch
            fake : true
            wait : 30
            
            success : (model)->
                attrs = model.attributes
                
                chai.expect(attrs).have.property "Cats-Boris-age", 3
                chai.expect(attrs).have.property "Cats-Boris-weight", 4
                chai.expect(attrs).have.property "Cats-Milla-age", 1
                chai.expect(attrs).have.property "Cats-Milla-weight", 2
                    
                done()
                
                
    it "send to server with `delimiter`", (done)->
        @linear_model.set
            "Cats-Boris-age"    : 3
            "Cats-Boris-weight" : 4
            "Cats-Milla-age"    : 1
            "Cats-Milla-weight" : 2
        @linear_model.flat_options = delimiter : "-"
        
        @linear_model.save null,
            fake : true
            wait : 30
            
            success : (model, mirrored)->
                chai.expect(mirrored).have.deep.property "Cats.Boris.age", 3
                chai.expect(mirrored).have.deep.property "Cats.Boris.weight", 4
                chai.expect(mirrored).have.deep.property "Cats.Milla.age", 1
                chai.expect(mirrored).have.deep.property "Cats.Milla.weight", 2
                
                done()
                
                
    it "parse without `safe` from server", (done)->
        @linear_model.set "id", "safe"
        @linear_model.fetch
            fake : true
            wait : 30
            
            success : (model)->
                attrs = model.attributes
                
                chai.expect(attrs).have.property "Cats.Boris.toys.0", "ball"
                chai.expect(attrs).have.property "Cats.Boris.toys.1", "mouse"
                
                done()
                
                
    it "parse by `safe` from server", (done)->
        @linear_model.set "id", "safe"
        @linear_model.flat_options = safe : true
        @linear_model.fetch
            fake : true
            wait : 30
            
            success : (model)->
                chai.expect model.attributes["Cats.Boris.toys"]
                .have.members ["ball", "mouse"]
                    
                done()
                
                
    it "send to server without `object`", (done)->
        @linear_model.set
            "Cats.Boris.toys.0" : "ball"
            "Cats.Boris.toys.1" : "mouse"
        @linear_model.save null,
            fake : true
            wait : 30
            
            success : (model, mirrored)->
                chai.expect mirrored.Cats.Boris.toys
                .have.members ["ball", "mouse"]
                
                done()
                
                
    it "send to server with `object`", (done)->
        @linear_model.set
            "Cats.Boris.toys.0" : "ball"
            "Cats.Boris.toys.1" : "mouse"
        @linear_model.flat_options = object : true
        @linear_model.save null,
            fake : true
            wait : 30
            
            success : (model, mirrored)->
                object = mirrored.Cats.Boris.toys
                
                chai.expect(object).a "object"
                chai.expect(object).not.a "array"
                chai.expect(object["0"]).equal "ball"
                chai.expect(object["1"]).equal "mouse"
                
                done()
                
                
    it "`force_array` server repsonse", (done)->
        @linear_model.set "id", "force_array"
        @linear_model.flat_options =
            force_array : [
                "Cats.Boris.age",
                "Cats.Boris.eyes",
                "Cats.Boris.toys",
                "Cats.Milla.toys"
            ]
        @linear_model.fetch
            fake : true
            wait : 30
            
            success : (model)->
                attrs = model.attributes
                
                chai.expect(attrs["Cats.Boris.age"]).a "array"
                chai.expect(attrs["Cats.Boris.eyes"]).a "array"
                chai.expect(attrs["Cats.Boris.toys"]).a "array"
                chai.expect(attrs["Cats.Milla.toys"]).a "array"
                
                chai.expect(attrs["Cats.Boris.age"]).have.members [3]
                chai.expect(attrs["Cats.Boris.eyes"])
                .have.members ["left_eye", "right_eye"]
                chai.expect(attrs["Cats.Boris.toys"][0])
                .have.property "toys", "ball"
                chai.expect(attrs["Cats.Milla.toys"]).be.empty
                    
                done()