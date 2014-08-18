gulp-livereload-for-was
===

[![Build Status](http://img.shields.io/travis/iamdenny/gulp-livereload-for-was/master.svg?style=flat)](https://travis-ci.org/iamdenny/gulp-livereload-for-was) [![Livereload downloads](http://img.shields.io/npm/dm/gulp-livereload-for-was.svg?style=flat)](https://www.npmjs.org/package/gulp-livereload-for-was)) [![MIT Licensed](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](#license)

A [gulp](https://github.com/gulpjs/gulp) plugin for livereload best used with the [livereload chrome extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei).

Install
---

```
npm install --save-dev gulp-livereload-for-was
```

### livereload(port/server)
### livereload(options)
### livereload(port/server, options)
### livereload()


Create a `Transform` stream and listen to the port or a `tiny-lr.Server` instance.  If none is passed, a livereload server is automatically started listening on port `35729`.


**options.silent**

Suppress all debug messages. Default is `false`.

**options.auto**

Automatically start a livereload server. Default is `true`.

**options.key**<br>
**options.cert**

Options are also passed to `tinylr`. Including a `key` and `cert` will create an HTTPS server.

### livereload.listen(port/server)
### livereload.listen(options)
### livereload.listen(port/server, options)
### livereload.listen()

Listen to the port or a `tiny-lr.Server` instance.  If none is passed, a livereload server is automatically started listening on port `35729`. Does not create a stream.

### livereload.changed(filepath, port/server)
### livereload.changed(filepath)
### livereload.changed()

Notify a change.

Sample Usages
---

use with tomcat:

```javascript
// watch
var gulp = require('gulp'),
    notify = require('gulp-notify'),
    livereloadForWas = require('gulp-livereload-for-was');

gulp.task('watch', [ 'removeLivereloadScript' ], function () {
    livereloadForWas.listen();
    gulp
        .src('src/main/webapp/**/*.jsp')
        .pipe(livereloadForWas.insertScriptforWas())
        .pipe(gulp.dest('src/main/webapp'))
        .pipe(notify({
            message : 'livereload script added'
        }));
    gulp.watch('src/main/webapp/**').on('change', livereloadForWas.changed);

    //catches ctrl+c event
    process.on('SIGINT', function () {
        gulp
            .src('src/main/webapp/**/*.jsp')
            .pipe(livereloadForWas.removeScriptforWas())
            .pipe(gulp.dest('src/main/webapp'))
            .pipe(notify({
                message : 'livereload script removed'
            }))
            .pipe(livereloadForWas.exit());
    });
    process.on('exit', function () {
        gulp
            .src('src/main/webapp/**/*.jsp')
            .pipe(livereloadForWas.removeScriptforWas())
            .pipe(gulp.dest('src/main/webapp'))
            .pipe(notify({
                message : 'livereload script removed'
            }))
            .pipe(livereloadForWas.exit());
    });
});

// remove livereload script
gulp.task('removeLivereloadScript', function () {
    gulp
        .src('src/main/webapp/**/*.jsp')
        .pipe(livereloadForWas.removeScriptforWas())
        .pipe(gulp.dest('src/main/webapp'))
        .pipe(notify({
            message : 'livereload script removed'
        }));
});

```

License
---

The MIT License (MIT)

Copyright (c) 2014 NAVER Inc.