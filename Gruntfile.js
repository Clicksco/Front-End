'use strict';

module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    clean: {
      img: [
        'dist/images/**/*'
      ],
      js: [
        'dist/js/**/*'
      ],
      css: [
        'dist/css/**/*'
      ],
      styleguide: [
        'styleguide'
      ]
    },

    copy: {
      styleguide: {
        files: [
          {src: ['src/styles/styleguide.md'], dest: 'dist/css/styleguide.md'}
        ]
      }
    },

    shell: {
      styleguide: {
        command: 'kss-node dist/css styleguide --css dist/css/main.doc.css'
      }
    },

    jshint: {
      gruntfile: 'Gruntfile.js',
      files: ['dist/js/compressed/main.min.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    uglify: {
      jsModules: {
          files: {
            'dist/js/compressed/main.min.js': ['src/scripts/modules/*.js']
          }
      },
      jsVendor: {
        files: {
          'dist/js/compressed/vendor.min.js': ['src/scripts/vendor/*.js']
        }
      }
    },

    sass: {
      options: {
        cacheLocation: '.sass-cache'
      },
      prod: {
        options: {
           style: 'compressed'
        },
        files: [{
          'dist/css/compressed/main.min.css': 'src/styles/main.scss'
        }]
      },
      dev: {
        options: {
            style: 'nested'
        },
        files: [{
          'dist/css/main.doc.css': 'src/styles/main.scss'
        }]
      }
    },

    autoprefixer: {
      dist: {
        options: {
          browsers: [
            'last 4 version',
            'safari 6',
            'ie 8',
            'ie 9',
            'opera 12.1',
            'ios 6',
            'android 4'
          ]
        },
        src: 'dist/css/main.doc.css',
        dest: 'dist/css/compressed/main.min.css'
      }
    },

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 4, // PNG
          progressive: true     // JPG
        },
        files: [{
          expand: true,
          cwd: 'src/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: 'dist/images',
        }],
      }
    },

    notify: {
      sass: {
        options: {
          title: 'Success!',
          message: 'Your styles have been successfully compiled and your styleguide has been built'
        }
      },
      styleguide: {
        options: {
          title: 'Success!',
          message: 'Your styleguide has been generated'
        }
      },
      scripts: {
        options: {
          title: 'Success!',
          message: 'Your scripts have been successfully compiled'
        }
      },
      gruntfile: {
        options: {
          title: 'Success!',
          message: 'Your Gruntfile has been reloaded'
        }
      },
      images: {
        options: {
          title: 'Success!',
          message: 'Your images have been compressed'
        }
      },
    },

    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile', 'notify:gruntfile']
      },

      sass: {
        files: 'src/styles/**/*.scss',
        tasks: ['clean:css', 'sass:dev', 'sass:prod', 'autoprefixer', 'notify:sass']
      },

      scripts: {
        files: '<%= jshint.files %>',
        tasks: ['uglify', 'jshint', 'notify:scripts']
      },

      images: {
        files: 'src/images/*.{png,jpg,jpeg,gif}',
        tasks: ['imagemin', 'notify:images']
      },

      livereload: {
        options: {
          livereload: 9000
        },
        files: [
          'Gruntfile.js',      // reload on Gruntfile change
          'dist/**/*'          // reload any change in dist
        ]
      }
      
    }

  });
  
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('styleguide', ['clean:css', 'sass:dev', 'sass:prod', 'autoprefixer', 'copy', 'shell', 'notify:styleguide']);

};
