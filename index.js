var gulp = require('vinyl-fs');
var es = require('event-stream');

var svgmin = require('gulp-svgmin');
var svgScaler = require('./lib/svg-scaler');
var svg2png = require('gulp-svg2png');


gulp.src('src/*.svg')
    .pipe(svgmin())
    .pipe(svgScaler({ width: 512, scale: 5 }))
    .pipe(gulp.dest('./dest/svg'))// have to , because the svg2png need the path.
    .pipe(svg2png())
    .pipe(gulp.dest('./dest/png/512x512'));

