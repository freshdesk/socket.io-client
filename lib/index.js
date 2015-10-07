
/**
 * Module dependencies.
 */

var url = require('./url');
var parser = require('socket.io-parser');
var Manager = require('./manager');
var debug = require('debug')('socket.io-client');

/**
 * Module exports.
 */

module.exports = exports = IO;

/**
 * Managers cache.
 */

var cache = exports.managers = {};

/**
 * Looks up an existing `Manager` for multiplexing.
 * If the user summons:
 *
 *   `io('http://localhost/a');`
 *   `io('http://localhost/b');`
 *
 * We reuse the existing instance based on same scheme/port/host,
 * and we initialize sockets for each namespace.
 *
 * @api public
 */

function IO (uri, hashedParams, opts) {
  if (!(this instanceof IO)) return new IO(uri, hashedParams, opts);

  if (typeof uri == 'object') {
    opts = uri;
    uri = undefined;
  }

  opts = opts || {};

  var parsed = url(uri);

  this.id = parsed.id;
  this.hashedParams = hashedParams;
  this.opts = opts;
}

IO.prototype.connect = function(nsp) {
  nsp = '/' + nsp;
  var id = this.id;
  var source = id + nsp;
  var io;

  if (!cache[id]) {
      debug('new io instance for %s', source);
      cache[id] = Manager(id, this.hashedParams, this.opts);
  }
  io = cache[id];
  return io.socket(nsp);
};

/**
 * Protocol version.
 *
 * @api public
 */

exports.protocol = parser.protocol;

/**
 * Expose constructors for standalone build.
 *
 * @api public
 */

exports.Manager = require('./manager');
exports.Socket = require('./socket');
