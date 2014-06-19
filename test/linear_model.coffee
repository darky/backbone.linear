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
                    age: 3,
                    weight: 4
                    toys: [
                        "ball"
                        "mouse"
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


    # ***********
    #    TESTS
    # ***********
    it "simple parse from server", (done)->
        @linear_model.set "id", "simple"
        
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
            "id"                : "simple"
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
        @linear_model.set "id", "simple"
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
            "id"                : "simple"
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
                
                
    it "parse by `safe` from server", (done)->
        @linear_model.set "id", "safe"
        @linear_model.flat_options = safe : true
        @linear_model.fetch
            fake : true
            wait : 30
            
            success : ->
                done()