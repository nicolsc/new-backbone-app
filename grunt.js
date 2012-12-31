module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-sass');

  var adapter;

   // ==========================================================================
  // CUSTOM TASKS
  // ==========================================================================
  // Our own "Joshfire" files optimizer
  grunt.registerMultiTask('joshoptimize', 'Optimize JS and HTML files for project using the Joshfire Framework', function (arg) {

    switch(this.target) {

    default:
      adapter = "googletv";
      break;
    }


    // Tell grunt this task is asynchronous.
    var done = this.async();

    // Gets all the Javascript files - And accepts wildcard patterns
    var jsFiles = this.data.filter(function(i) { return i.match(/\.js/); })

		var ext;
    // Gets all the html files - And accepts wildcard patterns
    var htmlFiles = grunt.file.expandFiles(
      this.data.filter(function(i) { return ext = i.match(/\.x?html/); })
    );

    // Process each JS files
    grunt.utils.async.forEach(jsFiles, optimizeJSFile, function(err) {
      done();
    });

    // Process each HTML files
    grunt.utils.async.forEach(htmlFiles, function (HTMLFile) {
      var dt  = new Date(),
        year  = dt.getFullYear(),
        month = dt.getMonth(),
        day   = dt.getDate(),
        hrs   = dt.getHours(),
        mins  = dt.getMinutes(),
        secs  = dt.getSeconds();

      var HTMLFileSrc = grunt.file.read(HTMLFile),
      HTMLFileDest = HTMLFile.slice(0, - ext[0].length) + '.optimized' + ext ,
      modifiedHTMLFileSrc = HTMLFileSrc.replace(/data-main="([^"]*)" src="[^"]*"/, 'src="$1.' + adapter + '.optimized.js"');

      grunt.file.write(HTMLFileDest, modifiedHTMLFileSrc);
      grunt.log.writeln('Wrote ' + HTMLFileDest);

    }, function(err) {

      done();
    });
  });

  // ==========================================================================
  // CUSTOM FUNCTIONS
  // ==========================================================================
  function optimizeJSFile(JSFile, callback) {
    JSFile = JSFile.slice(0, -3); // (remove ".js")

    // Prepare spawn
    var spawnOptions = {
      cmd: 'node',
      args: [
        'joshfire-framework/scripts/optimize.js',
        adapter, // TODO: should be configurable
        JSFile
      ]
    };

    function doneCallback(error, result, code) {
      if (error) {
        callback(error);
        return;
      }

      // result.stdout = nothing normally
      // result.stderr = what's normally displayed by the optimizer on the Terminal
      // result.code = code = 0 if everything worked

      grunt.log.writeln('Wrote ' + JSFile + '.' + adapter + '.optimized.js');
      callback();
    }

    // Seems to end too soon...
    grunt.utils.spawn(spawnOptions, doneCallback);
  }

  // readOptionalJSON
  // by Ben Alman
  // https://gist.github.com/2876125
  function readOptionalJSON( filepath ) {
    var data = {};
    try {
      data = grunt.file.readJSON( filepath );
      grunt.verbose.write( 'Reading ' + filepath + '...' ).ok();
    } catch(e) {}
    return data;
  }

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: [
        'grunt.js',
        'src/app.js',
        'src/controller.js',
        'src/router.js',
        'src/data/api.js',
        'src/data/model.js'
        ]
    },
    sass: {
      dist: {
        files: {
          'css/style.css': 'scss/style.scss'
        }
      },
      dev: {
        options: {
          style: 'expanded',
          // debugInfo: true,
          // lineNumbers: true,
          compass: true
        },
        files: {
          'css/style.css': 'scss/style.scss'
        }
      }
    },
    jshint: (function() {
      function jshintrc( path ) {
        return readOptionalJSON( (path || '') + '.jshintrc' ) || {};
      }

      return {
        options: jshintrc()
      };
    })(),

    watch: {
      files: ['scss/**/*.scss'],
      tasks: 'sass:dev'
    },

    joshoptimize: {
      app: ['main.js', 'index.html']
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint sass');
};
