const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const gulp = require('gulp');
const zip = require('gulp-zip');
const sass = require('gulp-sass');
const UglifyJS = require("uglify-js");

const componentsValidator = require('@woodwing/csde-components-validator');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// Scripts bundled into a single vendor.js
// You can choose to remove scripts in case they are not needed
// for your components.
const scriptsDir = path.join(__dirname, './scripts')
const scriptFiles = [
  // Adobe AEM library used by fullscreen.support.js
  path.join(scriptsDir, 'dpsHTMLGestureAPI.min.js'),

  // JQuery libraries used by below support scripts
  path.join(scriptsDir, 'jquery.js'),
  path.join(scriptsDir, 'jquery.mobile.options.js'),
  path.join(scriptsDir, 'jquery.mobile.js'),

  // Adds tap handler for fullscreen image support on Adobe AEM
  path.join(scriptsDir, 'fullscreen.support.js'),

  // Support scripts for slideshows components
  path.join(scriptsDir, 'jssor.js'),
  path.join(scriptsDir, 'jssor.slider.js'),
  path.join(scriptsDir, 'slideshow.js'),

  // Support script for parallax effect hero components
  path.join(scriptsDir, 'heroes.js'),

  // HLS video support on non Safari browser.
  path.join(scriptsDir, 'video.js')
]

const scssExt = '.scss';

buildScssString = (filename) => {
    return '@import "' + filename.slice(1, (filename.length-scssExt.length)) + '";\n';
}

gulp.task('default', ['sass', 'vendor-script'], async () => {
    const valid = await componentsValidator.validateFolder('./components');
    if (!valid) {
        throw new Error('Package failed validation. See errors above.');
    }
    const name = require('./components/components-definition.json').name;
    gulp.src('components/**/*')
        .pipe(zip(`${name}.zip`))
        .pipe(gulp.dest('dist'));
});

gulp.task('dev', ['validate', 'vendor-script'], () => {
    const watcher = gulp.watch('components/**/*', ['validate']);
    watcher.on('ready', () => console.log('Watching for changes in components folder...'));
    return watcher;
});

gulp.task('validate', async () => {
    await componentsValidator.validateFolder('./components');
});

gulp.task('sass', ['design-file'], () => {
    return gulp.src('./components/styles/design.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./components/styles/'));
});

gulp.task('vendor-script', async () => {
    // Concat files
    let content = '';
    for (let i = 0; i < scriptFiles.length; i++) {
        content += (await readFileAsync(scriptFiles[i])).toString() + '\n';
    }
    // Uglify result
    const result = UglifyJS.minify(content);
    if (result.error) {
        throw new Error(result.error.message);
    }
    // Write to vendor.js script
    const targetFolder = './components/scripts';
    if (!fs.existsSync(targetFolder)){
        fs.mkdirSync(targetFolder);
    }
    await writeFileAsync(path.join(targetFolder, 'vendor.js'), result.code);
});

gulp.task('design-file', async () => {
    let stylesdir = path.join(__dirname, './components/styles')
    let content = '';

    for (let file of fs.readdirSync(stylesdir) ) {
        if (file.startsWith('_') && path.extname(file) === scssExt ) {
            if (file !== '_common.scss') {
                content += buildScssString(file);
            } else {
                // Common should always be included at the top of the file since other scss files have dependencies on it.
                content = buildScssString(file) + content;
            }
        }
    }
    content = '/* \n\
 * This file has been generated while building the components package. \n\
 * PLEASE DO NOT MODIFY THIS FILE BY HAND. \n\
 */\n' + content;
    await writeFileAsync(path.join(stylesdir, 'design.scss'), content);
});