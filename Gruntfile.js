module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['js/*/*.js', 'js/app.js'],
                dest: 'dist/app.js'
            }
        },
        ngAnnotate: {
            options: {
                // Task-specific options go here.
            },
            app: {
                files: {
                    'dist/app.annotated.js': ['dist/app.js']
                }
            },
        },
        uglify: {
            dist: {
                files: {
                    'dist/app.min.js': ['dist/app.annotated.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.registerTask('default', ['concat', 'ngAnnotate','uglify']);

};