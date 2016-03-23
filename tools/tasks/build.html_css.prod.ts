import * as merge from 'merge-stream';
import {join} from 'path';
import {
  APP_SRC,
  TMP_DIR,
  PROD_DEPENDENCIES,
  CSS_PROD_BUNDLE,
  CSS_DEST
} from '../config';

export = function buildJSDev(gulp, plugins) {
  return function () {

    return merge(minifyComponentCss(), prepareTemplates(), processExternalCss(), copyCssFiles(), copyFontsFiles(), copyCkeditorFiles());

    function prepareTemplates() {
      return gulp.src(join(APP_SRC, '**', '*.html'))
        .pipe(gulp.dest(TMP_DIR));
    }

    function minifyComponentCss() {
      return gulp.src([
          join(APP_SRC, '**', '*.css'),
          '!' + join(APP_SRC, 'assets', '**', '*.css')
        ])
        .pipe(plugins.cssnano())
        .pipe(gulp.dest(TMP_DIR));
    }

    function processExternalCss() {
      return gulp.src(getExternalCss().map(r => r.src))
        .pipe(plugins.cssnano())
        .pipe(plugins.concat(CSS_PROD_BUNDLE))
        .pipe(gulp.dest(CSS_DEST));
    }

    function getExternalCss() {
      return PROD_DEPENDENCIES.filter(d => /\.css$/.test(d.src));
    }

    function copyCssFiles() {
      return gulp.src(join(APP_SRC+'/assets/sass/', '**', '*.css'))
      .pipe(gulp.dest('dist/prod/assets/sass/'));
    }

    function copyFontsFiles() {
      return gulp.src(join(APP_SRC + '/assets/components/ProgressButtonStyles/fonts/icomoon', '**', '*.*'))
        .pipe(gulp.dest('dist/prod/fonts/'));
    }

    function copyCkeditorFiles() {
    return gulp.src(join('./node_modules/ckeditor/', '**', '*.*'))
        .pipe(gulp.dest('dist/prod/ckeditor'));
    }
  };
};
