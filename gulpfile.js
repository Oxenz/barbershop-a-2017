var gulp = require('gulp'),
		stylus = require('gulp-stylus'),
		browserSync = require('browser-sync'),
		del = require('del'),
		run = require('run-sequence'),
		mincss = require('gulp-csso'),
		rename = require("gulp-rename")
		notify = require('gulp-notify'),
		imagemin = require('gulp-imagemin')
		prefixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),
		svgSprite = require('gulp-svg-sprite'),

		plumber = require('gulp-plumber');




// for Production

gulp.task('clean', function() {
	return del('build');
});

gulp.task('copy', function() {
	return gulp.src([
		'fonts/**/*.{woof,woff2}',
		'img/**',
		'js/**',
		'*.html',
		], {
			base: "."
		})
	.pipe(gulp.dest('build'));
});

gulp.task('stylus', function() {
	return gulp.src('stylus/style.styl')
		.pipe(stylus())
		.pipe(prefixer({
			browsers: ['last 2 version'],
			cascade: false
		}))
		.pipe(mincss({
			restructure: false,
		}))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.reload({stream: true}))

});

gulp.task('img-min', function() {
	return gulp.src("build/img/**/*.{png,jpg,gif}")
		.pipe(imagemin([
			imagemin.optipng({optinizationLevel: 3}),
			imagemin.jpegtran({progressive: true}),
			imagemin.gifsicle({interlaced: true}),
			imagemin.svgo({plugins: [{removeViewBox: true}]})
		]))
		.pipe(gulp.dest("build/img/opt"));
})

gulp.task('js-min', function() {
	return gulp.src('js/*.js')
			.pipe(uglify())
			.pipe(rename({
				suffix: ".min"
			}))
			.pipe(gulp.dest('build/js'))
});

gulp.task('bs', function() {
	browserSync({
		server: {
			baseDir: 'build'
		}
	});
})

gulp.task('wt',['bs'], function() {
	gulp.watch('stylus/**/*.styl', ['stylus']);
	gulp.watch('build/*.html', browserSync.reload);
	gulp.watch('js/**/*.js', browserSync.reload);
})


gulp.task('build', function(fn) {
	run('clean', 'copy', 'stylus', 'js-min', 'img-min', 'wt', 'svg-sprites', fn);
});

gulp.task('svg-sprites', function() {
	return gulp.src('svg-icons/*.svg')
	.pipe(svgSprite({
		shape: {
			dimension: {
				maxWidth: 500,
				maxHeight: 500
			},
			spacing: {
				padding: 0
			},
		},
		mode: {
			symbol: {
				dest: '.',
				sprite: 'sprite-symbol.svg'
			}
		}
	}))
	.pipe(gulp.dest('build/svg-sprites'));
});





// task for Developers

gulp.task('dev-stylus', function() {
	return gulp.src('stylus/style.styl')
		.pipe(stylus())
		.on('error', notify.onError())
		.pipe(gulp.dest('css'))
		.pipe(prefixer({
			browsers: ['last 2 version'],
			cascade: false
		}))
		.pipe(mincss({
			restructure: false,
		}))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('dev-bs', function() {
	browserSync({
		server: {
			baseDir: '.'
		},
		ui: {
			port: 3336
		},
		port: 3333,
		logPrefix: "BS-DEV",
		logConnections: true
	})
});

gulp.task('dev', ['dev-bs', 'dev-stylus'],  function() {
	gulp.watch('stylus/**/*.styl', ['dev-stylus']);
	gulp.watch('*.html', browserSync.reload);
	gulp.watch('js/**/*.js', browserSync.reload);
});


gulp.task('spr-svg', function() {
	return gulp.src('svg-icons/*.svg')
	.pipe(svgSprite({
		shape: {
			dimension: {
				maxWidth: 500,
				maxHeight: 500
			},
			spacing: {
				padding: 0
			},
		},
		mode: {
			symbol: {
				dest: '.',
				sprite: 'sprite-symbol.svg'
			}
		}
	}))
	.pipe(gulp.dest('svg-sprites'));
});

// gulp.task('spr-bg', function() {
// 	return gulp.src('svg-icons/**/*.svg')
// 		.pipe(svgSprite({
// 			mode: {
// 				css: {
// 					dest: '.',
// 					bust: false,
// 					sprite: 'sprite.svg',
// 					layout: 'vertical',
// 					prefix: '$-',
// 					dimenssions: true,
// 					render: {
// 						styl: {
// 							dest: 'spr-bg.styl'
// 						}
// 					}
// 				}
// 			}
// 		}))
// 		.pipe(gulp.dest('svg-sprites-bg'));
// });
