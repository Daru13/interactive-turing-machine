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
      mkDirs: "mkdir -p build/icons build/css",
      copyHTML: "cp -f ./src/index.html build/index.html",
      copyIcons: "cp -f ./src/icons/* build/icons/",
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
    "Remove the 'build' directory and clean temp/cache directories.",
    "exec:clean"
  );

  grunt.registerTask("build",
    "Compile Typescript sources, Browserify them and copy static sources into the 'build' directory.",
    ["ts", "browserify", "exec:mkDirs", "exec:copyHTML", "exec:copyCSS", "exec:copyIcons"]
  );


  grunt.registerTask("default", "build");
};
