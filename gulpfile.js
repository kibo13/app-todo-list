var gulp          = require('gulp'),
    sass          = require('gulp-sass'),                   // *gulp-sass (для транспиляции sass -> css)
    browserSync   = require('browser-sync'),                // *browser-sync (для автообновления страниц)
    sourcemaps    = require('gulp-sourcemaps'),             // *gulp-sourcemaps (для генерации sourcemap)
    concat        = require('gulp-concat'),                 // *gulp-concat (для конкатенации файлов)
    uglify        = require('gulp-uglify-es').default,      // *gulp-uglify (для минификации js)
    cleanCss      = require('gulp-clean-css'),              // *gulp-clean-css (для минификации css)
    autoprefixer  = require('gulp-autoprefixer'),           // *gulp-autoprefixer (для расстановки префиксов)
    del           = require('del');                         // *del (для удаления файлов и папок)
   
var PATHS = {
  src: 'src',
  dist: 'dist'
}


/**
    * LOCAL SERVER
    * 1. создание таска 'browser-sync'
    * 2. директория для сервера 
    * 3. отключение всплывающих уведомлений в браузере
 */

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: `${PATHS.dist}`
    },
    notify: false
  })
})


/**
    * SCRIPTS
    * 1. создание таска 'scripts'
    * 2. исходная директория (all files.js)
    * 3. конкатенация files.js -> script.min.js
    * 4. инициализация sourcemap 
    * 5. минификация файла script.min.js
    * 6. запись sourcemap в конец файла script.min.js
    * 7. выгрузка файла script.min.js в 'dist/js'
 */

gulp.task('scripts', function () {
  return gulp.src(`${PATHS.src}/scripts/*.js`)
    .pipe(concat('script.min.js'))
    // .pipe(sourcemaps.init())
    .pipe(uglify())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${PATHS.dist}/js`))
    .pipe(browserSync.reload({ stream: true }))
})


/**
    * STYLES
    * 1. создание таска 'styles'
    * 2. исходная директория (all files.sass)
    * 3. конкатенация files.sass -> style.min.sass
    * 4. инициализация sourcemap
    * 5. транспиляция style.min.sass -> style.min.css
    * 6. расстановка префиксов в style.min.css
    * 7. минификация файла style.min.css
    * 8. запись sourcemap в конец файла script.min.js
    * 9. выгрузка файла style.min.css в 'dist/css'
 */

gulp.task('styles', function () {
  return gulp.src(`${PATHS.src}/styles/**/*.sass`)
    .pipe(concat('style.min.sass'))
    // .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 versions'],
      cascade: false
    }))
    .pipe(cleanCss())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${PATHS.dist}/css`))
    .pipe(browserSync.reload({ stream: true }))
})


/**
    * HTML
    * выгрузка html в 'dist'
 */

gulp.task('html', function () {
  return gulp.src(`${PATHS.src}/*.html`)
    .pipe(gulp.dest(`${PATHS.dist}`))
    .pipe(browserSync.reload({ stream: true }))
})


/**
   * FONTS
   * выгрузка шрифтов в 'dist'
*/

gulp.task('fonts', function () {
  return gulp.src(`${PATHS.src}/fonts/**/*`)
    .pipe(gulp.dest(`${PATHS.dist}/fonts`))
})


/**
   * CLEAN
   * удаление директории 'dist'
*/

gulp.task('clean', function () {
  return del.sync(`${PATHS.dist}`)
})


/**
   * WATCH
   * наблюдение за изменениями в файлах
*/

gulp.task('watch', function () {
  gulp.watch(`${PATHS.src}/*.html`, gulp.parallel('html'));
  gulp.watch(`${PATHS.src}/styles/**/*.sass`, gulp.parallel('styles'));
  gulp.watch(`${PATHS.src}/scripts/**/*.js`, gulp.parallel('scripts'));
})


/**
   * DEFAULT
   * запуск тасков по умолчанию 
*/

gulp.task('default', gulp.parallel('clean', 'html', 'styles', 'scripts', 'fonts', 'browser-sync', 'watch'))

