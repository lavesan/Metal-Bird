const gulp = require('gulp')
const uglify = require('gulp-uglify')
const uglifycss = require('gulp-uglifycss')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const htmlmin = require('gulp-htmlmin')

gulp.task('app.css', () => 
    gulp.src('src/index.css')
        .pipe(uglifycss({ uglyComments: true }))
        .pipe(gulp.dest('dist'))
)

gulp.task('app.js', () =>
    gulp.src('src/index.js')
        .pipe(babel({
            comments: false,
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
)

gulp.task('app.html', () => 
    gulp.src('src/index.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'))
)

gulp.task('app.assets', () => 
    gulp.src('src/assets/**/*')
        .pipe(gulp.dest('dist/assets'))
)

gulp.task('default', gulp.series('app.css', 'app.js', 'app.html', 'app.assets'));