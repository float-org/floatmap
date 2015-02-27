module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        options: {
          paths: ['floatmap/static/css']
        },
        files: {
          'floatmap/static/css/main.css': 'floatmap/static/css/main.less'
        }
      }
    },
    coffee: {
      compileWithMapsDir: {
        files: {
          'floatmap/static/js/main.js': 'floatmap/static/js/main.coffee'
        },
        options: {
          sourceMap: true,
          sourceMapDir: 'floatmap/static/js' // source map files will be created here
        }
      }
    },
    watch: {
      coffee: {
        files: ['floatmap/static/js/*.coffee'],
        tasks: ['coffee', 'watch-dev']
      },
      less: {
        files: ['floatmap/static/css/*.less'],
        tasks: ['less', 'watch-dev'],
      },
      livereload: {
        // Here we watch the files the sass task will compile to
        // These files are sent to the live reload server after sass compiles to them
        options: { livereload: true },
        files: ['floatmap/static/css/main.css', 'floatmap/static/js/main.js'],
      },
    },
    concat: {
      options: {
        separator: ';'
      },
      js: {
        src: ['floatmap/static/js/main.js', 'floatmap/static/js/vendor/*.js'],
        dest: 'floatmap/static/js/<%= pkg.name %>.js'
      },
      css: {
        src: ['floatmap/static/css/main.css', 'floatmap/static/css/vendor/*.css'],
        dest: 'floatmap/static/css/<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'floatmap/static/js/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
        }
      }
    },
    cssmin: {
      target: {
        files: {
          'floatmap/static/css/floatmap.min.css': ['<%= concat.css.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('watch-dev', ['concat']);
  grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
}