/* https://github.com/verekia/js-stack-from-scratch/tree/master/tutorial/3-es6-babel-gulp */

const gulp = require('gulp'),
      babel = require('gulp-babel'),
      del = require('del'),
      exec = require('child_process').exec();

/* First we define a paths object to store all our different file paths and keep things DRY. */
const paths = {
    sourceJs: 'src/**/*.js',
    libDirectory: 'lib'
}

/* Then we define 5 tasks: build, clean, main, watch, and default. */

/* clean is a task that simply deletes our entire auto-generated lib folder before every build. 
This is typically useful to get rid of old compiled files after renaming or deleting some in src, 
or to make sure the lib folder is in sync with the src folder if your build fails and you don't notice. 
We use the del package to delete files in a way that integrates well with Gulp's stream (this is the recommended way to delete files with Gulp).*/
gulp.task('clean', () => {
    return del(paths.libDir);
});

/* build is where Babel is called to transform all of our source files located under src and write the transformed ones to lib. */
gulp.task('build', ['clean'], () => {
    return gulp.src(paths.sourceJs)
    .pipe(babel())
    .pipe(gulp.dest(paths.libDirectory));
});

/* The require('child_process').exec and exec part in the task is a native Node function that executes a shell command. 
We forward stdout to console.log() and return a potential error using gulp.task's callback function. */
gulp.task('main', ['build'], (callback) => {
    exec(`node ${paths.libDirectory}`, (error, stdout) => {
        console.log(stdout);
        return callback(error);
    });
});

/* Watch the directory and execute the main task again when filesystem changes occur */
gulp.task('watch', () => {
    gulp.watch(paths.sourceJs, ['main']);
});

/* default is a special task that will be run if you simply call gulp from the CLI. In our case we want it to run both watch and main (for the first execution).*/
gulp.task('default', ['watch', 'main']);
