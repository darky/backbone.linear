/* *****************
     DEFINE-VARS
***************** */
var gulp = require("gulp"),
  babelify = require("babelify"),
  browserify = require("browserify"),
  coffeelint = require("gulp-coffeelint"),
  fs = require("fs"),
  mocha = require("gulp-mocha"),
  mochaPhantomjs = require("gulp-mocha-phantomjs"),
  qunit = require("gulp-qunit"),
  runSequence = require("run-sequence");


/* *****************
    CONCAT-TASKS
***************** */
gulp.task("default", function (cb) {
  runSequence("build", "test", cb);
});
gulp.task("test", function (cb) {
  runSequence("test-backbone", "test-own", "test-flat", cb);
});
gulp.task("build", ["lint", "compile"]);


/* **********
     TEST
********** */
gulp.task("test-flat", function () {
  return gulp.src("flat-test/test.js")
    .pipe(mocha({
      reporter : "nyan",
      ui       : "tdd"   
    }));
});
        
gulp.task("test-backbone", function () {
  return gulp.src("backbone-test/index.html")
    .pipe(qunit());
});

gulp.task("test-own", ["compile"], function () {
  return gulp.src("test/index.html")
    .pipe(mochaPhantomjs());
});


/* ************
     BUILD
************ */
gulp.task("lint", function () {
  return gulp.src(["*.coffee", "test/*.coffee"])
    .pipe(coffeelint())
    .pipe(coffeelint.reporter());
});
    
gulp.task("compile", function () {
  return browserify({debug : true, detectGlobals : false, standalone : "Backbone.LinearModel"})
    .transform(babelify)
    .require("./backbone.linear.es", {entry : true})
    .exclude("backbone")
    .exclude("underscore")
    .bundle()
    .pipe(fs.createWriteStream("backbone.linear.js"));
});


/* *********
     DEV
********* */
gulp.task("dev", function () {
  gulp.watch(["*.coffee", "test/*.coffee"], ["build"]);
});
