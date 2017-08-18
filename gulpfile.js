var gulp = require('gulp'),
		stylus = require('gulp-stylus'),
		browserSync = require('browser-sync'),
		del = require('del'),
		run = require('run-sequence'), // порядок загрузки
		mincss = require('gulp-csso'), // минификация CSS
		rename = require("gulp-rename"); // переименование файлов



// for Production

gulp.task('stylus', function() {
	return gulp.src('stylus/style.styl')
		.pipe(stylus())
		.pipe(gulp.dest('build/css'))

		.pipe(mincss())
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('build/css'))

		.pipe(browserSync.reload({stream: true}))

});

gulp.task('bs', function() {
	browserSync({
		server: {
			baseDir: 'build'
		}
	});
})

gulp.task('wt', ['bs'], function() {
	gulp.watch('stylus/**/*.styl', ['stylus']);
	gulp.watch('build/*.html', browserSync.reload);
	gulp.watch('js/**/*.js', browserSync.reload);
})

gulp.task('copy', function() {
	return gulp.src([
		'fonts/**/*.{woof,woff2}',
		'img/**',
		'js/**',
		'*.html',
		], {
			base: '.'
		})
	.pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
	return del('build');
});

gulp.task('build', function(fn) {
	run('clean', 'copy', 'stylus', fn);
});








// task for Developers

gulp.task('dev-stylus', function() {
	return gulp.src('stylus/style.styl')
		.pipe(stylus())
		.pipe(gulp.dest('css'))
		.pipe(browserSync.reload({stream: true}))

});

gulp.task('dev-bs', function() {
	browserSync({
		server: {
			baseDir: '.'
		}
	})
});

gulp.task('dev', ['dev-bs', 'dev-stylus'],  function() {
	// gulp.watch('stylus/style.styl', ['stylus']);
	gulp.watch('stylus/**/*.styl', ['dev-stylus']);
	gulp.watch('*.html', browserSync.reload);
	gulp.watch('js/**/*.js', browserSync.reload);
});


