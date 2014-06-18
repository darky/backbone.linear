describe "Backbone.Linear test api", ->

    # ************
    #    DEFINE
    # ************
    server = sinon.fakeServer.create()
    server.autoRespond = true
    server.respondWith "GET", "/fake_data/1",
        [
            200
            "Content-Type": "application/json"
            """
                {
                    "Cats":
                        "Boris": {
                            "age": 3,
                            "weight": 4
                        },
                        "Milla": {
                            "age": 1,
                            "weight": 2
                        }
                }
            """
        ]

    class Linear_Model_Class extends Backbone.Linear_Model
    
        urlRoot : "/fake_data"


    linear_model = new Linear_Model_Class


    # ***********
    #    TESTS
    # ***********
    it "simple parse", (done)->
        linear_model.id = 1
        linear_model.fetch()