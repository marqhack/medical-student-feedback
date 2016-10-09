var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');


gulp.task('bundle', function() {
  return browserify('src/index.js')
    .transform('babelify', {presets: 'react'})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('static/'));
});

//admin js bundle
gulp.task('adminbundle', function(){
  return browserify('src/admin.js')
    .transform('babelify', {presets: 'react'})
    .bundle()
    .pipe(source('adminbundle.js'))
    .pipe(gulp.dest('static/'));
});


gulp.task('watch', function() {

  var b = browserify({
    entries: ['src/index.js'],
    cache: {}, packageCache: {},
    plugin: ['watchify']
  });

  b.on('update', makeBundle);

  function makeBundle() {
    b.transform('babelify', {presets: 'react'})
      .bundle()
      .on('error', function(err) {
        console.error(err.message);
        console.error(err.codeFrame);
        console.log("Bundle updated, success"); 
      })


      .pipe(source('bundle.js'))
      .pipe(gulp.dest('static/'));
  }

  // we have to call bundle once to kick it off.
  makeBundle();

  return b;
});
