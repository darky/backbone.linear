/* *****************
     DEFINE-VARS
***************** */
var gulp = require("gulp"),
  babelify = require("babelify"),
  browserify = require("browserify"),
  coffee = require("gulp-coffee"),
  coffeelint = require("gulp-coffeelint"),
  fs = require("fs"),
  mocha = require("gulp-mocha"),
  mochaPhantomjs = require("gulp-mocha-phantomjs"),
  qunit = require("gulp-qunit"),
  sourcemaps = require("gulp-sourcemaps");


/* *****************
    CONCAT-TASKS
***************** */
gulp.task("default", ["test", "build"]);
gulp.task("test", [
  "test-flat",
  "test-backbone",
  "test-own"
]);
gulp.task("build", ["lint", "compile"]);


/* **********
     TEST
********** */
gulp.task("test-flat", () => {
  gulp.src("flat-test/test.js")
  .pipe(mocha({
    reporter : "nyan",
    ui       : "tdd"   
  }));
});
        
gulp.task("test-backbone", () => {
  gulp.src("backbone-test/index.html")
  .pipe(qunit());
});

gulp.task("test-own", ["compile"], () => {
  gulp.src("test/index.html")
  .pipe(mochaPhantomjs());
});


/* ************
     BUILD
************ */
gulp.task("lint", () => {
  gulp.src(["*.coffee", "test/*.coffee"])
  .pipe(coffeelint())
  .pipe(coffeelint.reporter());
});
    
gulp.task("compile", () => {
  gulp.src("test/*.coffee")
  .pipe(sourcemaps.init())
  .pipe(coffee())
  .pipe(sourcemaps.write({
    includeContent : false,
    sourceRoot     : "../../test"
  }))
  .pipe(gulp.dest("tmp/test/"));

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
gulp.task("dev", () => {
  gulp.watch(["*.coffee", "test/*.coffee"], ["build"]);
});
