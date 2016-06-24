var merge = require('merge-stream'),
	gulp = require('gulp'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	cleanCSS = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer'),
	realFavicon = require('gulp-real-favicon'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer');

var index = './src/scripts/index.js',
	scripts = './src/scripts',
	styles = './src/styles',
	buildScripts = './build/scripts',
	buildStyles = './build/styles',
	buildImg = './build/img',
	FAVICON_DATA_FILE = 'faviconData.json';


gulp.task('default', ['watch']);

gulp.task('build', ['scripts', 'styles', 'img', 'generate-favicon', 'inject-favicon-markups']);

gulp.task('watch', [], function() {
	gulp.watch(['src/scripts/*.js'], ['scripts']);
	gulp.watch(['src/styles/*.css'], ['styles']);
	gulp.watch(['src/img/*'], ['img']);
});

gulp.task('scripts', function() {
    return browserify(index)
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest(buildScripts))
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest(buildScripts));
    
});

gulp.task('styles', function() {
	gulp.src('src/styles/*.css')
		.pipe(autoprefixer({browsers: '> 1%'}))
		.pipe(concat('main.css'))
		.pipe(gulp.dest(buildStyles))
		.pipe(cleanCSS({
			'compatibility': 'ie8',
			'debug': true
		}, function(details) {
			console.log(details.name + ': ' + details.stats.originalSize + ' to ' + details.stats.minifiedSize);
		}))
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest(buildStyles));
});

gulp.task('img', function() {
	gulp.src('src/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest(buildImg));
});


// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
	realFavicon.generateFavicon({
		masterPicture: 'src/img/tr_logo.png',
		dest: 'build/img/icons',
		iconsPath: 'build/img/icons',
		design: {
			ios: {
				pictureAspect: 'noChange'
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'whiteSilhouette',
				backgroundColor: '#da532c',
				onConflict: 'override'
			},
			androidChrome: {
				pictureAspect: 'noChange',
				themeColor: '#ffffff',
				manifest: {
					name: 'translationRecorder',
					display: 'browser',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				}
			},
			safariPinnedTab: {
				pictureAspect: 'silhouette',
				themeColor: '#5bbad5'
			}
		},
		settings: {
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false
		},
		markupFile: FAVICON_DATA_FILE
	}, function() {
		done();
	});
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function() {
	gulp.src(['*.html'])
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(gulp.dest('.'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
	realFavicon.checkForUpdates(currentVersion, function(err) {
		if (err) {
			throw err;
		}
	});
});