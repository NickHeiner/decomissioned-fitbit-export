'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jshint: {
            options: {
                node: true,
                esversion: 6
            },
            grunt: ['Gruntfile.js'],
            app: ['app/**/*.js'],
            test: {
                options: {
                    mocha: true
                },
                src: ['test/**/*.js']
            }
        },
        mochaTest: {
            test: {
                src: ['test/unit/**/*.js']
            }
        }
    });

    grunt.registerTask('test', ['jshint', 'mochaTest']);
};
