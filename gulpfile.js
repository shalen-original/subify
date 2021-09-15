'use strict';

/* Modules import */
const gulp = require('gulp');
const path = require('path');
const del = require('del');
const argv = require('minimist')(process.argv.slice(2));

const sass = require('gulp-sass');
const ts = require('gulp-typescript');
const imagemin = require('gulp-imagemin');

const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const sourcemaps = require('gulp-sourcemaps');

/* Useful constants */
const DEV_PATH = 'src';
const BUILD_PATH = 'dist';
const PORT = 8000;


/* Easy access to dev and build folders*/
const dev = function(subpath) {
    return !subpath ? DEV_PATH : path.join(DEV_PATH, subpath);
};

const build = function(subpath) {
    return !subpath ? BUILD_PATH : path.join(BUILD_PATH, subpath);
};

const TS_SERVER_BLOB = [dev('**/*.ts'), '!' + dev('public/**/*.ts')];
const TS_CLIENT_BLOB = [dev('public/**/*.ts')];
const SCSS_BLOB = [dev('public/css/main.scss')];
const ASSETS_BLOB = [
    dev('public/assets/*.png'),
    dev('public/assets/*.jpg'),
    dev('public/assets/*.svg'),
    dev('public/assets/*.webm')
];
const FONTS_BLOB = ['node_modules/font-awesome/fonts/*'];
const MANIFEST_BLOB = [dev('public/manifest.json')];

const TS_SERVER_BLOB_WATCH = TS_SERVER_BLOB;
const TS_CLIENT_BLOB_WATCH = TS_CLIENT_BLOB;
const SCSS_BLOB_WATCH = [dev('public/css/*.scss'), dev('public/css/**/*.scss')];
const ASSETS_BLOB_WATCH = ASSETS_BLOB;
const MANIFEST_BLOB_WATCH = MANIFEST_BLOB;

/* Live reload */
const browserSyncStart = function() {

  browserSync({
      port: PORT,
      notify: false,
      logPrefix: 'BrowserSync',
      snippetOptions: {
        rule: {
          match: '<span id="browser-sync-binding"></span>',
          fn: function(snippet) {
            return snippet;
          }
        }
      },
      injectChanges: true,
      proxy:'localhost:8080',
      online: true
  });

};


/* Cleaning deploy folder */
const clean = function () {
    return del(build('**/*'), {force:true, read:false});
};

const scss = function(f) {
    // https://github.com/sass/node-sass#options
    const opts = {
      outputStyle: (argv.dev ? 'nested' : 'compressed'),
      includePaths: ['node_modules']
    };

    // Fetch the files to modify
    let ans = gulp.src(SCSS_BLOB);

    // If the --dev flag is given, start source maps
    if (argv.dev)
      ans = ans.pipe(sourcemaps.init())

    // Process the files
    ans = ans.pipe(sass(opts).on('error', sass.logError));

    // If the --dev flag is given, write the source maps
    if (argv.dev)
      ans = ans.pipe(sourcemaps.write('.'))

    // Write the processed files
    ans = ans.pipe(gulp.dest(f('public/css')));

    return ans;
};

const tsServer = function(f){
    const tsProject = ts.createProject('tsconfig.server.json');
    
    let ans = tsProject.src();
    if (argv.dev) ans = ans.pipe(sourcemaps.init())
    ans = ans.pipe(tsProject());
    if (argv.dev) ans = ans.pipe(sourcemaps.write('.'))
    ans = ans.pipe(gulp.dest(f()));

    return ans;
}

const tsClient = function(f){
    const tsProject = ts.createProject('tsconfig.client.json');
    
    let ans = tsProject.src();
    if (argv.dev) ans = ans.pipe(sourcemaps.init())
    ans = ans.pipe(tsProject());
    if (argv.dev) ans = ans.pipe(sourcemaps.write('.'))
    ans = ans.pipe(gulp.dest(f('public/js')));

    return ans;
}

const assets = function(f) {
    return gulp.src(ASSETS_BLOB)
              .pipe(imagemin())
              .pipe(gulp.dest(f('public/assets')));
};

const fonts = function(f) {
    return gulp.src(FONTS_BLOB)
            .pipe(gulp.dest(f('public/fonts')));
};

const copyManifest = function(f) {
    return gulp.src(MANIFEST_BLOB)
            .pipe(gulp.dest(f('public')));
};



const TheWatchHasBegun = function (f) {
    const opts = {
        script: f('server.js'),
        ignore: [f('public')],
    };

    nodemon(opts)
      .on('start', browserSyncStart);

    gulp.watch(TS_CLIENT_BLOB_WATCH, ['watch-ts-client']);
    gulp.watch(TS_SERVER_BLOB_WATCH, ['watch-ts-server']);
    gulp.watch(SCSS_BLOB_WATCH, ['watch-scss']);
    gulp.watch(ASSETS_BLOB_WATCH, ['watch-assets']);
    gulp.watch(ASSETS_BLOB_WATCH, ['watch-fonts']);
    gulp.watch(MANIFEST_BLOB_WATCH, ['watch-manifest']);
};


// Partial builds, not depending on "clean"
gulp.task('build-scss', _ => scss(build));
gulp.task('build-ts-server', _ => tsServer(build));
gulp.task('build-ts-client', _ => tsClient(build));
gulp.task('build-assets', _ => assets(build));
gulp.task('build-fonts', _ => fonts(build));
gulp.task('build-manifest', _ => copyManifest(build));

// Watch tasks, use partial builds
gulp.task('watch-scss', ['build-scss'], done => {browserSync.reload(); done();});
gulp.task('watch-ts-server', ['build-ts-server'], done => {browserSync.reload(); done();});
gulp.task('watch-ts-client', ['build-ts-client'], done => {browserSync.reload(); done();});
gulp.task('watch-assets', ['build-assets'], done => {browserSync.reload(); done();});
gulp.task('watch-fonts', ['build-fonts'], done => {browserSync.reload(); done();});
gulp.task('watch-manifest', ['build-manifest'], done => {browserSync.reload(); done();});

// Full build tasks, depending on "clean"
gulp.task('clean', clean);
gulp.task('build-clean-scss', ['clean'], _ => scss(build));
gulp.task('build-clean-ts-server', ['clean'], _ => tsServer(build));
gulp.task('build-clean-ts-client', ['clean'], _ => tsClient(build));
gulp.task('build-clean-assets', ['clean'], _ => assets(build));
gulp.task('build-clean-fonts', ['clean'], _ => fonts(build));
gulp.task('build-clean-manifest', ['clean'], _ => copyManifest(build));
gulp.task('build-clean', ['build-clean-scss', 'build-clean-ts-server', 'build-clean-ts-client', 'build-clean-assets', 'build-clean-fonts', 'build-clean-manifest'], function(){});

// Main tasks
gulp.task('dev', ['build-clean'], _ => TheWatchHasBegun(build));
gulp.task('build', ['build-clean'], function(){});
gulp.task('default', ['build-clean'], function(){});
