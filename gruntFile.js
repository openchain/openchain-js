module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-browserify');
  
  grunt.registerTask('default', ['browserify']);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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