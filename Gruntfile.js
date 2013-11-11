'use strict';

module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    src:  'src',
    dist: 'dist',

    scripts: {
      src: {
        dir: '<%= src %>/scripts',
        files: [
          '<%= scripts.src.dir %>/main.js'
        ],
      },
      dist: {
        dir: '<%= dist %>/js',
        uncompressed: '<%= scripts.dist.dir %>/main.js',
        compressed:   '<%= scripts.dist.dir %>/compressed/main.min.js'
      }
    },

    styles: {
      src: {
        dir: '<%= src %>/styles',
        files: [
          '<%= styles.src.dir %>/main.scss'
        ],
      },
      dist: {
        dir: '<%= dist %>/css',
        uncompressed: '<%= styles.dist.dir %>/main.css',
        compressed:   '<%= styles.dist.dir %>/compressed/main.min.css'
      }
    },

    images: {
      src: {
        dir: '<%= src %>/images',
      },
      dist: {
        dir: '<%= dist %>/images',
      }
    },

    jshint: {
      gruntfile: 'Gruntfile.js',
      files: ['<%= scripts.src.files %>'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    concat: {
      js: {
        nonull: true,
        src: '<%= scripts.src.files %>',
        dest: '<%= scripts.dist.uncompressed %>'
      }
    },

    uglify: {
      dist: {
        src: ['<%= concat.js.dest %>'],
        dest: '<%= scripts.dist.compressed %>'
      },
    },

    sass: {
      dev: {
        options: {
          style: 'expanded',
        },
        files: {
          '<%= styles.dist.uncompressed %>': '<%= styles.src.files %>'
        }
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
        src: '<%= styles.dist.uncompressed %>',
        dest: '<%= styles.dist.uncompressed %>'
      }
    },

    cssmin: {
      combine: {
        options: {
          keepSpecialComments: 0,
          report: 'min'
        },
        files: {
          '<%= styles.dist.compressed %>': '<%= styles.dist.uncompressed %>'
        }
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
          cwd: '<%= images.src.dir %>',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= images.dist.dir %>',
        }],
      }
    },

    notify: {
      sass: {
        options: {
          title: 'Success!',
          message: 'Your styles have been successfully compiled'
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
        tasks: ['sass:dev', 'autoprefixer', 'cssmin', 'notify:sass']
      },

      scripts: {
        files: '<%= jshint.files %>',
        tasks: ['jshint', 'concat', 'uglify', 'notify:scripts']
      },

      images: {
        files: '<%= images.src.dir %>/**/*.{png,jpg,jpeg,gif}',
        tasks: ['imagemin', 'notify:images']
      },

      livereload: {
        options: {
          livereload: 9000
        },
        files: [
          'Gruntfile.js',      // reload on Gruntfile change
          '<%= dist %>/**/*'   // reload any change in dist
        ]
      }
    }

  });

  grunt.registerTask('default', ['watch']);

};
