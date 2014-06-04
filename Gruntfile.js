var gulp = require('vinyl-fs');
var es = require('event-stream');
var svgmin = require('gulp-svgmin');
var svgScaler = require('./lib/svg-scaler');


module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-svg2png');

    var sizes = ['64', '128', '256', '512'];

    grunt.registerTask('svg2pngs', function () {

        var self = this;

        sizes.forEach(function (size) {
            gulp.src('src/*.svg')
                .pipe(svgmin())
                .pipe(svgScaler({ width: size}))
                .pipe(gulp.dest('./dest/svg/' + size))
                .on('close', function () {
                    grunt.config('svg2png.' + size, {
                        files: [
                            {
                                src: ['dest/svg/' + size + '/*.svg'],
                                dest: 'dest/png/' + size
                            }
                        ]
                    });
                    grunt.task.run('svg2png:' + size);

                })
                .on('end', self.async());
        });

    });

    grunt.registerTask('default', ['svg2pngs']);
};