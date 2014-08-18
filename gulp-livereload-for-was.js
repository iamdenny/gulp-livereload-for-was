'use strict';

var gutil = require('gulp-util'),
    path = require('path'),
    tinylr = require('tiny-lr'),
    merge = require('lodash.merge'),
    Transform = require('stream').Transform,
    magenta = gutil.colors.magenta,
    through = require('through2');

/**
 * module.exports
 * @param server
 * @param opts
 * @returns {Transform}
 */
module.exports = exports = function (server, opts) {
    var reload = new Transform({ objectMode:true });

    if (server !== null &&
        typeof server === 'object' &&
        !(server instanceof tinylr.Server) &&
        !opts) {
        merge(exports.options, server);
        server = null;
    } else {
        merge(exports.options, opts);
    }

    reload._transform = function(file, encoding, next) {
        exports.changed(file.path, server);
        this.push(file);
        next();
    };

    reload.changed = exports.changed;

    return reload;
};

exports.options = { auto: true };
exports.servers = {};

/**
 * exprots.listen
 * @param server
 * @param opts
 * @returns {*}
 *
 * @example
 *  livereloadForWas.listen()
 *  livereloadForWas.listen(server)
 *  livereloadForWas.listen(port)
 */
exports.listen = function(server, opts) {
    if (server !== null &&
        typeof server === 'object' &&
        !(server instanceof tinylr.Server) &&
        !opts) {
        merge(exports.options, server);
        server = null;
    } else {
        merge(exports.options, opts);
    }

    server = server || 35729;

    if (typeof server === 'number') {
        var port = exports.port = server;

        if (exports.servers[port]) {
            return exports.servers[port];
        }

        if (!exports.options.auto) {
            return;
        }

        exports.servers[port] = server = tinylr(exports.options);
        server.listen(port, function (err) {
            if (err) {
                throw new gutil.PluginError('gulp-livereload', err.message);
            }
            if (!exports.options.silent) {
                gutil.log('Live reload server listening on: ' + magenta(port));
            }
        });
    }

    return server;
};

/**
 * export.changed
 * @param filePath
 * @param server
 *
 * @example
 *  livereloadForWas.changed(filepath)
 *  livereloadForWas.changed(filepath, server)
 *  livereloadForWas.changed(filepath, port)
 */
exports.changed = function(filePath, server) {
    server = exports.listen(server);
    filePath = (filePath) ? filePath.hasOwnProperty('path') ? filePath.path : filePath : '*';

    if (!server) return;

    if (!exports.options.silent) {
        gutil.log(magenta(path.basename(filePath)) + ' was reloaded.');
    }

    server.changed({ body: { files: [filePath] } });
};

exports.middleware = tinylr.middleware;

/**
 * prepend
 * @param w
 * @param s
 * @returns {*}
 */
function prepend(w, s) {
    return s + w;
}

/**
 * append
 * @param w
 * @param s
 * @returns {*}
 */
function append(w, s) {
    return w + s;
}

/**
 * insert script for was
 * @param contents
 * @returns {*}
 */
var insertScriptForWas = function (contents) {
    var rules = [{
        match: /<\/body>/,
        fn: prepend
    }, {
        match: /<\/html>/,
        fn: prepend
    }, {
        match: /<\!DOCTYPE.+>/,
        fn: append
    }];
    var port = exports.port;
    var src =  "' + (location.protocol || 'http:') + '//' + (location.hostname || 'localhost') + ':" + port + "/livereload.js?snipver=1";
    var snippet = "<!-- livereload -->\n<script type=\"text/javascript\">document.write('<script src=\"" + src + "\" type=\"text/javascript\"><\\/script>')</script>\n<!-- endlivereload -->";

    var _contents = contents;
    rules.some(function(rule) {
        if (rule.match.test(contents)) {
            _contents = contents.replace(rule.match, function(w) {
                return rule.fn(w, snippet);
            });
            return true;
        }
        return false;
    });
    return _contents;
};

/**
 * exports.insertScriptForWas
 * @returns {*}
 */
exports.insertScriptForWas = function () {
    var th = through.obj(function(file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-livereload', 'Streams are not supported!'));
            return cb();
        }
        if (file.isNull()) {
            this.push(file); // Do nothing if no contents
            return cb();
        }

        try {
            file.contents = new Buffer(insertScriptForWas(file.contents.toString()));
            this.push(file);
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-<%= pluginName %>', err));
        }

        // tell the stream engine that we are done with this file
        cb();
    });

    return th;
};

/**
 * remove script for was
 * @param contents
 * @returns {string}
 */
var removeScriptForWas = function (contents) {
    var startReg = /<!--\s*livereload\s*-->/gim;
    var endReg = /<!--\s*endlivereload\s*-->/gim;

    var sections = contents.split(endReg);
    var html = [];

    for (var i = 0, l = sections.length; i < l; ++i) {
        if (sections[i].match(startReg)) {
            var section = sections[i].split(startReg);

            html.push(section[0]);
        } else {
            html.push(sections[i]);
        }
    }

    return html.join('');;
};

/**
 * exports.removeScriptForWas
 * @returns {*}
 */
exports.removeScriptForWas = function () {
    var th = through.obj(function(file, enc, cb) {
        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-livereload', 'Streams are not supported!'));
            return cb();
        }
        if (file.isNull()) {
            this.push(file); // Do nothing if no contents
            return cb();
        }

        try {
            file.contents = new Buffer(removeScriptForWas(file.contents.toString()));
            this.push(file);
        } catch (err) {
            this.emit('error', new gutil.PluginError('gulp-<%= pluginName %>', err));
        }

        // tell the stream engine that we are done with this file
        cb();
    });

    return th;
};

/**
 * exports.exit
 * @returns {*}
 */
exports.exit = function () {
    return through.obj(function(file, enc, cb) {
        process.exit(0);
    });
};