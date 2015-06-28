var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
$.ngAnnotate = require('gulp-ng-annotate');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var fs = require('graceful-fs');
var modRewrite = require('connect-modrewrite');

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var production = !!$.util.env.production;
$.util.log('Environment', $.util.colors.blue(production ? 'Production' : 'Development'));

// <paths>
var paths = {
  "src": "./src",
  "dev": "./dist",
  "stage": "./dist",
  "bower": "./bower_components/**/*.{js,css,map,woff,woff2,otf,ttf,eot,svg}",
  js: {},
  html: {}
};
paths.ddest = production ? paths.stage : paths.dev;
paths.js.src = paths.src + "/app/**/*";
paths.js.dest = paths.ddest + "/js";
//paths.bower = production ? paths.bower + ".min.js" : paths.bower + ".js";
paths.vendor = paths.ddest + "/libs";
paths.html.src = paths.src + "/index.html";
paths.html.dest = paths.dest + "/index.html";
// </paths>

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
  var f = production ? 'styles.min.css' : 'styles.css';

  return gulp.src('app/styles/*.less')
      .pipe($.changed('styles', {extension: '.less'}))
      .pipe($.less())
      .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
      .pipe($.concat(f))
      .pipe($.if(production, $.csso()))
    // Concatenate And Minify Styles
      .pipe(gulp.dest('dist/css'))
      .pipe($.size({title: 'styles'}));
});

gulp.task('bower', function () {
  var filter = production ? $.filter('**/*.min.{js,css}') : $.filter('**/*.{js,css}');
  var stream = gulp.src(paths.bower);

  if (production) {
    stream
        .pipe(filter)
        .pipe($.rev())
        .pipe(gulp.dest(paths.vendor))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(paths.vendor))
        .pipe(filter.restore());
  }

  return stream.pipe(gulp.dest('dist/libs'))
      .pipe($.size({title: 'bower'}));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('rev', ['html'], function () {
  var assets = $.useref.assets({searchPath: 'dist'});
  var stream = gulp.src('dist/index.html');

  if (production) {
    var manifest = paths.vendor + "/rev-manifest.json";
    var vendorFiles = fs.existsSync(manifest) ? require(manifest) : [];

    for (var file in vendorFiles) {
      if (vendorFiles.hasOwnProperty(file)) {
        stream = stream.pipe($.replace(file, vendorFiles[file]));
      }
    }

    stream.pipe(assets)
        .pipe($.rev())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest('dist'))
        .pipe($.gzip())
        .pipe(gulp.dest('dist'));
  }

  return stream
      .pipe(gulp.dest('dist'))
      .pipe($.size({title: 'rev'}));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', ['bower', 'ng:templates'], function () {
  var stream = gulp.src('app/index.html');

  if (production) {
    stream
        .pipe($.replace('.js', '.min.js'))
        .pipe($.replace('.css', '.min.css'))
        .pipe(
        $.cdnizer({
          allowRev: true,
          allowMin: true,
          fallbackScript: "<script>function cdnizerLoad(u) {document.write('<scr'+'ipt src=\"'+u+'\"></scr'+'ipt>');}</script>",
          fallbackTest: '<script>if(typeof ${ test } === "undefined") cdnizerLoad("${ filepath }");</script>',
          files: [
            'google:angular',
            {
              cdn: 'cdnjs:lodash.js',
              package: 'lodash',
              test: '_'
            }
          ]}))
  }
  return stream
      .pipe(gulp.dest('dist'))
      .pipe($.size({title: 'html'}));
});

gulp.task('js:lint', function () {
  return gulp.src('app/scripts/**/*.js')
      .pipe($.jslint());
});

gulp.task('js:concat', function () {
  var f = production ? 'app.min.js' : 'app.js';
  var jsResult = gulp.src('app/**/*.js');

  return jsResult
      .pipe($.concat(f))
      .pipe($.ngAnnotate())
      .pipe($.if(production, $.uglify()))
      .pipe($.wrap({ src: './iife.txt'}))
      .pipe(gulp.dest('dist/js'))
      .pipe($.size({title: 'javascript'}));
});
// </typescript>

// <ng-templates>
gulp.task('ng:templates', function () {
  var f = production ? 'templates.min.js' : 'templates.js';

  return gulp.src('app/scripts/**/templates/*.html')
      .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe($.ngHtml2js({
        moduleName: function (file) {
          var path = file.path.split('/'),
              folder = path[path.length - 2];
          return folder.replace(/-[a-z]/g, function (match) {
            return match.substr(1).toUpperCase() + 'templates';
          });
        }
      }))
      .pipe($.concat(f))
      .pipe($.if(production, $.uglify()))
      .pipe(gulp.dest('dist/js'))
      .pipe($.size({title: 'ng:templates'}));
});
// </ng-templates>

// Watch Files For Changes & Reload
gulp.task('serve', ['default'], function () {
  var bsOpts = {
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      middleware: [
        modRewrite(['!\\.html|\\images|\\.js|\\.css|\\.png|\\.jpg|\\.woff|\\.ttf|\\.svg /index.html [L]'])
      ],
      baseDir: 'dist'
    }
  };

  browserSync(bsOpts);

  if (!production) {
    gulp.watch(['app/**/*.html'], ['html', reload]);
    gulp.watch(['app/styles/**/*.{less,css}'], ['styles', reload]);
    gulp.watch(['app/scripts/**/*.js'], ['js:lint', 'js:concat', reload]);
    gulp.watch(['app/scripts/**/*.html'], ['ng:templates', reload]);
  }
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  runSequence('styles', ['rev', 'js:concat', 'bower'], cb);
});
