module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.registerTask('default', ['jshint', 'browserify', 'uglify']);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['index.js', 'lib/**/*.js', 'tests/**/*.js'],
      options: {
        'node': true
      }
    },
    browserify: {
      main: {
        options: {
          external: [
            'bitcore-lib'
          ],
          require: [
            './index.js:openchain'
          ]
        },
        src: 'index.js',
        dest: 'dist/openchain.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/openchain.min.js': ['dist/openchain.js']
        }
      }
    }
  });
}