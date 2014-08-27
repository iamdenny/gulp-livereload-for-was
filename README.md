gulp-livereload-for-was
===

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Dependency Status][depstat-image]][depstat-url]
[![Livereload downloads][npm-download-image]][npm-download-url]
[![MIT Licensed][license-image]](#license)

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

use with WAS:
* start WAS such as Tomcat, Nginx, IIS first.
* ```gulp watch```
* use ```Ctrl + c``` for exiting from watch.
    * all the files should be saved before ```Ctrl + c```, because Livereload-for-was load source code and rewrite them.
    * use VCS such as git, svn after ```Ctrl + c```, because the livereload script is included in all source code.

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

Copyright (c) 2014 NAVER Corp.

Copyright (c) 2014 Cyrus David

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



[npm-url]: https://npmjs.org/package/gulp-livereload-for-was
[npm-image]: https://badge.fury.io/js/gulp-livereload-for-was.png

[travis-url]: http://travis-ci.org/iamdenny/gulp-livereload-for-was
[travis-image]: https://secure.travis-ci.org/iamdenny/gulp-livereload-for-was.png?branch=master

[coveralls-url]: https://coveralls.io/r/iamdenny/gulp-livereload-for-was?branch=master
[coveralls-image]: https://img.shields.io/coveralls/iamdenny/gulp-livereload-for-was.svg

[depstat-url]: https://david-dm.org/iamdenny/gulp-livereload-for-was
[depstat-image]: https://david-dm.org/iamdenny/gulp-livereload-for-was.png

[npm-download-url]: https://www.npmjs.org/package/gulp-livereload-for-was
[npm-download-image]: http://img.shields.io/npm/dm/gulp-livereload-for-was.svg?style=flat

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat