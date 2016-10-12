module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    typescript: {
      dev: {
        src:['src/webapp/**/*.ts'],
        dest: 'public/js/app.js',
        options: {
          target: 'es5',
          sourcemap: true
        }
      }
    },
    bower_concat: {
        all: {
            dest: 'public/js/resources.js',
            cssDest: 'public/css/resources.css',
            bowerOptions: false
        }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/server/**/*.js'],
        dest: 'server.js',
      },
    },
  });

  // Default task(s).
  grunt.registerTask('default', [
    'typescript:dev',
    'bower_concat:all'
  ]);
};
