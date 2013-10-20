module.exports = function(grunt) {

	grunt.file.readJSON('package.json');

	grunt.initConfig({

		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'dist/css/main.css': 'src/styles/main.scss'
				}
			},
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'dist/css/main.min.css': 'src/styles/main.scss'
				}
			}
		},

		notify: {
			sass: {
				options: {
					title: 'SASS',
					message: "Your Sass/Scss Has Successfully Compiled"
				}
			}
		},

		watch: {

			sass: {
				files: 'src/styles/**/*.scss',
				tasks: ['sass:dev', 'notify:sass']
			},

			livereload: {
				options: {
					livereload: true
				},
				files: [
					'dist/css/*.css'
				]
			}

		}

	});

	grunt.registerTask('default', [
		'sass:dev',
		'notify:sass'
	]);

	grunt.registerTask('dist', [
		'sass:dist',
		'notify:sass'
	]);

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-notify');

}