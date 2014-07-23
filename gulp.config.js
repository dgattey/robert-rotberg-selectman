/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
  srcFiles: {
    js: [ 'src/**/*.js', '!src/app/vendor/**/*.js' ],
    allJS: ['src/**/*.js'],
    assets: ['src/assets/**/*.*'],
    html: ['src/**/*.html'],
    sass: 'src/**/app.scss'
  },

  dest: 'build',

};
