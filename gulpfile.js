const { src, dest, watch, series } = require("gulp");
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();

// ============================
// CSS
// ============================
function cssTask() {
    return src("css/*.css")
        .pipe(cssnano())
        .pipe(dest("dist/css"))
        .pipe(browserSync.stream());
}

// ============================
// JS
// ============================
function jsTask() {
    return src("js/*.js")
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(dest("dist/js"))
        .pipe(browserSync.stream());
}

// ============================
// SERVIDOR
// ============================
function serve() {

    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    watch("css/*.css", cssTask);
    watch("js/*.js", jsTask);
    watch("*.html").on("change", browserSync.reload);
}

// ============================
// EXPORT
// ============================
exports.default = series(cssTask, jsTask, serve);