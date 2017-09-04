var gulp = require('gulp'),
		stylus = require('gulp-stylus'),
		browserSync = require('browser-sync'),
		del = require('del'),
		run = require('run-sequence'), // порядок загрузки
		mincss = require('gulp-csso'), // минификация CSS
		rename = require("gulp-rename"), // переименование файлов
		notify = require('gulp-notify'), // уведомления
		imagemin = require('gulp-imagemin') // оптимизация img
		prefixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),

		plumber = require('gulp-plumber'); // линтер ошибок




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
			base: "."  // что бы копировались целыми папками
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
		.pipe(mincss())
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
	run('clean', 'copy', 'stylus', 'js-min', 'img-min', 'wt', fn);
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
		.pipe(mincss())
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
