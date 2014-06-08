'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jshint: {
            options: {
                node: true
            },
            grunt: ['Gruntfile.js']
        }
    });

    grunt.registerTask('test', ['jshint']);
};
