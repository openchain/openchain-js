module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  grunt.registerTask('default', ['jshint', 'browserify']);

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
    }
  });
}