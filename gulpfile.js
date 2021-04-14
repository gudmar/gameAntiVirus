/// Probably index.html cannot be dest to the same folder that source exists
// !! Run sequence cannot be nested!! It cannot call a task already runnuing sun Sequence



const {watch, dest} = require('gulp')
const gulp = require('gulp');
// const terser = require('gulp-terser');
// const gulpif = require('gulp-if');
// const scss = require('gulp-sass');
// const runSequence = require('gulp4-run-sequence')
// const inline = require('gulp-inline')
// const tsc = require('gulp-ts')  // dicky  :)
// const tsc = require('gulp-typescript')
// const cssnano = require('gulp-cssnano')
// const concat = require('gulp-concat')
const inline = require('gulp-inline')
// const inlineSvg = require('gulp-inline-svg')
// const inlineImages = require('gulp-inline-images');
// const base64 = require('gulp-base64-inline')
// const inlineImageHTML = require('gulp-inline-image-html')



// gulp.task('translateScss', () => {
//     return gulp.src('styles/**.scss', { sourcemaps: true })
//     .pipe(scss())
//     .pipe(dest('styles'), { sourcemaps: true })
// })
// gulp.task('translateTs', () => {
//     return gulp.src('script/**.ts', { sourcemaps: true })
//     .pipe(tsc({
//         "target": "es6",
//         "lib": ["ES2015", "ES2015.Proxy", "DOM", "ScriptHost" ,"DOM.Iterable", "ES6", "ESNext.Array"],
//         "strict": true, 
//         "strictPropertyInitialization": false,
//         "noImplicitThis": false,
//         "baseUrl": "./script",
//         "esModuleInterop": true,
//         "skipLibCheck": true,
//         "forceConsistentCasingInFileNames": true       
//     }))
//     .pipe(dest('script'), { sourcemaps: true })
// })
// const watchScss = watch(['styles/*.scss']);
// const watchTs = watch(['script/*.ts']);

// gulp.task('watch', function() {
//     watchScss.on('change', function() {
//         runSequence('translateScss');
//     })
//     watchTs.on('change', function() {
//         runSequence('translateTs')
//     })
// })

// gulp.task('translate', function() {
//     runSequence('translateScss', 'translateTs')
// })
// gulp.task('copyCss', function() {
//     return gulp.src('./styles/**/*.css')
//         .pipe(gulp.dest('../dst/styles'))
// })
// gulp.task('copyHtml', function() {
//     return gulp.src('./index.html')
//         .pipe(gulp.dest('../dst'))
// })
// gulp.task('copyJs', function() {
//     return gulp.src('./script/**/*.js', '!"content.js"')
//         .pipe(gulp.dest('../dst/script'))
// })
gulp.task('make', function() {
    return gulp.src('index.html')
    .pipe(inline(
        {
            base: './',
//            js: terser,
            // css: cssnano
        }
    ))
    .pipe(gulp.dest('./compiled'))
})

// gulp.task('inlineImages', function() {
//     //return gulp.src(['script/**/*.js'])//, '!script/index.js'])
//     //.pipe(concat('index.js'))
//     return gulp.src('script/content.js')
//     .pipe(inline(
//         {
//             base: './',
//         }
//     ))
//     .pipe(gulp.dest('../dst/script/'))
// })

// gulp.task('build', function() {
//     runSequence('translateTs', 'translateScss', 'copyJs', 'copyCss', 'copyHtml', 'inlineImages', 'make')
// })
