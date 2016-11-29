'use strict';

let
	chalk = require('chalk'),
	glob = require('glob'),
	gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	merge = require('merge2'),
	path = require('path'),
	rollup = require('rollup'),
	runSequence = require('run-sequence'),

	plugins = gulpLoadPlugins(),
	pkg = require('./package.json'),
	assets = require('./config/assets');


// Banner to append to generated files
let bannerString = '/*! ' + pkg.name + '-' + pkg.version + ' - ' + pkg.copyright + '*/'


/**
 * Validation Tasks
 */

gulp.task('validate-ts', () => {

	// Grab the tslint config
	var config = require(path.resolve('./config/tslint.conf.js'));
	config.formatter = 'prose';

	return gulp.src(assets.src.ts)
		// Lint the Typescript
		.pipe(plugins.tslint(config))
		.pipe(plugins.tslint.report({
			summarizeFailureOutput: true,
			emitError: true
		}));

});


/**
 * Build
 */

// Build JS from the TS source
var tsProject = plugins.typescript.createProject('tsconfig.json');
gulp.task('build-ts', () => {

	let tsResult = gulp.src(assets.src.ts, { base: './src' })
		.pipe(plugins.sourcemaps.init())
		.pipe(tsProject());

	return merge([
			tsResult.js
				.pipe(plugins.sourcemaps.write('./'))
				.pipe(gulp.dest(assets.dist.dir)),
			tsResult.dts.pipe(gulp.dest(assets.dist.dir))
		]).on('error', plugins.util.log);

});

// Bundle the generated JS (rollup and then uglify)
gulp.task('build-js', ['rollup-js'], () => {

	// Uglify
	return gulp.src(path.join(assets.dist.bundleDir, (pkg.artifactName + '.js')))
		.pipe(plugins.uglify({ preserveComments: 'license' }))
		.pipe(plugins.rename(pkg.artifactName + '.min.js'))
		.pipe(gulp.dest(assets.dist.bundleDir));

});

// Rollup the generated JS
gulp.task('rollup-js', () => {

	return rollup.rollup({
			entry: path.join(assets.dist.dir, '/index.js')
		})
		.then((bundle) => {
			return bundle.write({
				dest: path.join(assets.dist.bundleDir, (pkg.artifactName + '.js')),
				format: 'umd',
				moduleName: 'angular2Sentio',
				sourceMap: true,
				banner: bannerString,
				globals: {
					'@angular/core': 'ng.core',
					'@asymmetrik/sentio': 'sentio',
					'd3': 'd3'
				}
			});
		});

});



/**
 * --------------------------
 * Main Tasks
 * --------------------------
 */

gulp.task('build', (done) => { runSequence('validate-ts', 'build-ts', 'build-js', done); } );

// Default task builds and tests
gulp.task('default', [ 'test' ]);