'use strict';

module.exports = function(grunt) {

  // Auto load tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    // Read package.json
    pkg: grunt.file.readJSON('package.json'),


    /**
     * Project details
     */

    // Banner to be used on compiled files
    banner: '/*!\n' +
            ' * <%= pkg.title %> v<%= pkg.version %>\n' +
            ' * Copyright <%= pkg.author.name %> (<%= pkg.author.url %>) <%= grunt.template.today("yyyy") %>\n' +
            ' */\n',

    // Root dir setup
    src:  'src',
    dist: 'dist',

    // Project setup
    scripts: {
      src: {
        dir: '<%= src %>/scripts',
        files: [
          '<%= scripts.src.dir %>/main.js'
        ],
      },
      dist: {
        dir: '<%= dist %>/assets/js',
        uncompressed: '<%= scripts.dist.dir %>/main.js',
        compressed:   '<%= scripts.dist.dir %>/main.min.js'
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
        dir: '<%= dist %>/assets/css',
        uncompressed: '<%= styles.dist.dir %>/main.css',
        compressed:   '<%= styles.dist.dir %>/main.min.css'
      }
    },

    images: {
      src: {
        dir: '<%= src %>/images',
      },
      dist: {
        dir: '<%= dist %>/assets/img',
      }
    },


    /**
     * Scripts Tasks
     */

    // JShint
    jshint: {
      gruntfile: 'Gruntfile.js',
      files: ['<%= scripts.src.files %>'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Concatenate JS
    concat: {
      options: {
        stripBanners: true,
        banner: '<%= banner %>'
      },
      js: {
        nonull: true,
        src: '<%= jshint.files %>',
        dest: '<%= scripts.dist.uncompressed %>'
      }
    },

    // Uglify
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: ['<%= concat.js.dest %>'],
        dest: '<%= scripts.dist.compressed %>'
      },
    },


    /**
     * Styles Tasks
     */

    // Sass compile
    sass: {
      dev: {
        options: {
          banner: '<%= banner %>',
          style: 'expanded',
          sourcemap: true, // Requires Sass 3.3.0 alpha: `sudo gem install sass --pre`
          trace: true
        },
        files: {
          '<%= styles.dist.uncompressed %>': '<%= styles.src.files %>'
        }
      }
    },

    // Autoprefixer
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

    // Minify CSS
    cssmin: {
      combine: {
        options: {
          banner: '<%= banner %>',
          keepSpecialComments: 0,
          report: 'min'
        },
        files: {
          '<%= styles.dist.compressed %>': '<%= styles.dist.uncompressed %>'
        }
      }
    },


    /**
     * Image Tasks
     */

    // imagemin
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3, // PNG
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


    /**
     * Misc Tasks
     */

    // Clean
    clean: {
      img: [
        '<%= images.dist.dir %>/**/*'
      ],
      js: [
        '<%= scripts.dist.dir %>/**/*'
      ],
      css: [
        '<%= styles.dist.dir %>/**/*'
      ],
    },

    // Notify
    notify: {
      sass: {
        options: {
          title: 'Success!',
          message: 'Your SCSS has successfully compiled'
        }
      },
      scripts: {
        options: {
          title: 'Success!',
          message: 'Your scripts have successfully compiled'
        }
      },
      gruntfile: {
        options: {
          title: 'Success!',
          message: 'Your Gruntfile is awesome'
        }
      },
      images: {
        options: {
          title: 'Success!',
          message: 'Your images have been compressed'
        }
      },
    },

    // Watch
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
          livereload: true
        },
        files: [
          'Gruntfile.js',      // reload on Gruntfile change
          '<%= dist %>/**/*'   // reload any change in dist
        ]
      }
    }

  });


  /**
   * Tasks
   */

  // Default: $ grunt
  grunt.registerTask('default', [
    'clean',
    'jshint',
    'concat',
    'uglify',
    'sass:dev',
    'autoprefixer',
    'cssmin',
    'imagemin',
    'notify'
  ]);

  // Run default task then watch: $ grunt w
  grunt.registerTask('w', [
    'default',
    'watch'
  ]);

};
