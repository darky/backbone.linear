/* eslint-env node */

"use strict";

/* *****************
     DEFINE-VARS
***************** */
var gulp = require("gulp"),
  browserify = require("browserify"),
  eslint = require("gulp-eslint"),
  fs = require("fs"),
  KarmaServer = require("karma").Server,
  mocha = require("gulp-mocha"),
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
  return gulp.src("flat-test/test.js").pipe(mocha({
    reporter: "nyan",
    ui: "tdd"
  }));
});

gulp.task("test-backbone", function () {
  return gulp.src("backbone-test/index.html").pipe(qunit());
});

gulp.task("test-own", ["compile"], function (cb) {
  new KarmaServer({
    browsers: ["Firefox"],
    coverageReporter: {
      dir: "coverage-own"
    },
    files: [
      "bower_components/underscore/underscore.js",
      "bower_components/jquery/dist/jquery.js",
      "bower_components/jquery.ajax.fake/jquery.ajax.fake.js",
      "bower_components/backbone/backbone.js",
      "dist/backbone.linear.js",
      "test/linear_model.js"
    ],
    frameworks: ["chai", "mocha"],
    preprocessors: {
      "dist/backbone.linear.js": "coverage"
    },
    reporters: ["progress", "coverage"],
    singleRun: true
  }, cb).start();
});


/* ************
     BUILD
************ */
gulp.task("lint", function () {
  return gulp.src(["*.js", "src/*.js", "test/*.js"])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task("compile", function () {
  return browserify({detectGlobals: false, standalone: "Backbone.LinearModel"})
    .require("./src/backbone.linear.js", {entry: true})
    .exclude("backbone")
    .exclude("underscore")
    .bundle()
    .pipe(fs.createWriteStream("./dist/backbone.linear.js"));
});


/* *********
     DEV
********* */
gulp.task("dev", function () {
  gulp.watch(["src/*.js"], ["build"]);
});
