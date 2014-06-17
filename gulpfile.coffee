# *****************
#    DEFINE-VARS
# *****************
gulp = require "gulp"
coffee = require "gulp-coffee"
coffeelint = require "gulp-coffeelint"
exec = require("child_process").exec
mocha = require "gulp-mocha"
qunit = require "gulp-qunit"
sourcemaps = require "gulp-sourcemaps"


# ******************
#    CONCAT-TASKS
# ******************
gulp.task "default", ["test", "build"]
gulp.task "test", ["test-flat", "test-backbone", "test-backbone-extend"]
gulp.task "build", ["lint", "compile"]


# **********
#    TEST
# **********
gulp.task "test-flat", ->
    gulp
    .src "flat-test/test.js"
    .pipe mocha
        reporter : "nyan"
        ui       : "tdd"
        
gulp.task "test-backbone", ->
    gulp
    .src "backbone-test/index.html"
    .pipe qunit()

gulp.task "test-backbone-extend-pre", ->
    gulp
    .src "backbone-test/model.coffee"
    .pipe coffee()
    .pipe gulp.dest "tmp/"

gulp.task "test-backbone-extend", ["test-backbone-extend-pre"], (cb)->
    exec "node tmp/model.js", (err, stdout, stderr)->
        console.log stdout
        console.log stderr
        cb err
        
        
# ***********
#    BUILD
# ***********
gulp.task "lint", ->
    gulp.src "*.coffee"
    .pipe coffeelint()
    .pipe coffeelint.reporter()
    
gulp.task "compile", ->
    gulp.src "backbone.linear.coffee"
    .pipe sourcemaps.init()
    .pipe coffee()
    .pipe sourcemaps.write()
    .pipe gulp.dest "./"