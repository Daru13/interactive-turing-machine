module.exports = function (grunt) {

  /***************************************************************************/
  /* Configuration of Grunt & the tasks
  /***************************************************************************/

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    // Command line tasks
    // They allow to run external commands (as in a terminal).
    exec: {
      clean: "rm -Rf build .tscache",
      mkDirs: "mkdir -p build/icons build/img build/svg build/css",
      copyHTML: "cp -f ./src/index.html build/index.html",
      copyImg: "cp -f ./src/img/* build/img/",
      copyCSS: "cp -f ./src/css/*.css build/css/"
    },

    // Typescript task
    // It compiles each TypeScript souce file into a JavaScript file.
    ts: {
      default : {
        tsconfig: "./tsconfig.json"
      }
    },

    // Browserify task
    // It aggregates all compiled JavaScript files into a single file.
    browserify: {
      bundle: {
        src: "./build/modules/index.js",
        dest: "./build/itm.js"
      }
    }

  });


  /***************************************************************************/
  /* npm plugin loading
  /***************************************************************************/

  grunt.loadNpmTasks("grunt-exec");
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-browserify");

  /***************************************************************************/
  /* Task registering
  /***************************************************************************/

  grunt.registerTask("clean",
    "Delete the build directory as well as temporary files and caches.",
    "exec:clean"
  );

  grunt.registerTask("copy-static-files",
    "Copy static files into the build directory.",
    ["exec:mkDirs", "exec:copyHTML", "exec:copyCSS", "exec:copyImg"]
  );

  grunt.registerTask("compile",
    "Compile Typescript sources (using browserify) into the build directory.",
    ["ts", "browserify"]
  );

  grunt.registerTask("build",
    "Copy static files and compile Typescript sources into the build directory.",
    ["copy-static-files", "compile"]
  );


  grunt.registerTask("default", "build");
};
