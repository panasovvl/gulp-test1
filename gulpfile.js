// function defaultTask(cb) {
//     // place code for your default task here
//     cb();
//   }

//   exports.default = defaultTask

import gulp from "gulp";
import less from "gulp-less";
import del from "del";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import concat from "gulp-concat";
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "gulp-autoprefixer";
import imagemin from "gulp-imagemin";
import htmlmin from "gulp-htmlmin";
import newer from "gulp-newer";
import browsersync from "browser-sync";
import destclean from "gulp-dest-clean";
import pug from "gulp-pug";

const paths = {
  styles: {
    src: "src/styles/**/*.less",
    dest: "dist/css/",
  },
  scripts: {
    src: "src/scripts/**/*.js",
    dest: "dist/js/",
  },
  imgs: {
    src: "src/img/**",
    dest: "dist/img/",
  },
  html: {
    src: "src/**/*.html",
    dest: "dist/",
  },
  pug: {
    src: "src/**/*.pug",
    dest: "dist/",
  },
};

gulp.task("clean", () => {
  return del(["dist/*", "!dist/img/"]);
});

gulp.task("styles", () => {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(
      rename({
        basename: "main",
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream());
});

gulp.task("scripts", () => {
  // return gulp.src(paths.scripts.src, {
  //     sourcemaps: true
  // })
  return gulp
    .src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(concat("main.min.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream());
});

gulp.task("imagemin", () => {
  return gulp
    .src(paths.imgs.src, { encoding: false })
    .pipe(destclean(paths.imgs.dest))
    .pipe(newer(paths.imgs.dest))
    .pipe(
      imagemin({
        //        progressive: true
      })
    )
    .pipe(gulp.dest(paths.imgs.dest))
    .pipe(browsersync.stream());
});

gulp.task("htmlmin", () => {
  return gulp
    .src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browsersync.stream());
});

gulp.task("pug", () => {
  return gulp
    .src(paths.pug.src)
    .pipe(pug({}))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browsersync.stream());
});

gulp.task("watch", () => {
  browsersync.init({
    server: paths.html.dest,
    browser: "chrome"
  });
  gulp.watch(paths.styles.src, gulp.series("styles"));
  gulp.watch(paths.scripts.src, gulp.series("scripts"));
  gulp.watch(paths.imgs.src, gulp.series("imagemin"));
  gulp.watch(paths.html.src, gulp.series("htmlmin"));
  gulp.watch(paths.pug.src, gulp.series("pug"));
});

gulp.task(
  "build",
  gulp.series(
    "clean",
    gulp.parallel("htmlmin", "pug", "styles", "scripts", "imagemin"),
    "watch"
  )
);

gulp.task("default", gulp.series("build"));
