var gulp = require('vinyl-fs');
var svgmin = require('gulp-svgmin');
var svgScaler = require('./lib/svg-scaler');


module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-svg2png');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.config('clean.dest', {
        src: ['./dest']
    });

    var sizes = ['16', '32', '64', '128', '256', '512'];

    grunt.registerTask('svg2pngs', function () {

        var done = this.async();
        var svg2pngFiles = [];

        var cnt = 0;

        sizes.forEach(function (size) {

            svg2pngFiles.push({
                src: ['dest/svg/' + size + '/*.svg'],
                dest: 'dest/png/' + size

            });

            gulp.src('src/*.svg')
                .pipe(svgmin())
                .pipe(svgScaler({ width: size}))
                .pipe(gulp.dest('dest/svg/' + size))
                .on('end', function () {
                    cnt++;
                    if (cnt === size.length) {
                        done();

                        grunt.config('svg2png.all', {
                            files: svg2pngFiles
                        });
                        grunt.task.run('svg2png');

                    }
                });
        });


    });

    grunt.registerTask('default', ['clean:dest', 'svg2pngs']);
};