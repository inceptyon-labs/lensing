import{fileURLToPath as __esbuild_fURL}from'node:url';import{dirname as __esbuild_dN}from'node:path';const __filename=__esbuild_fURL(import.meta.url);const __dirname=__esbuild_dN(__filename);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/constants.js"(exports, module) {
    "use strict";
    var BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
    var hasBlob = typeof Blob !== "undefined";
    if (hasBlob) BINARY_TYPES.push("blob");
    module.exports = {
      BINARY_TYPES,
      CLOSE_TIMEOUT: 3e4,
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      hasBlob,
      kForOnEventAttribute: /* @__PURE__ */ Symbol("kIsForOnEventAttribute"),
      kListener: /* @__PURE__ */ Symbol("kListener"),
      kStatusCode: /* @__PURE__ */ Symbol("status-code"),
      kWebSocket: /* @__PURE__ */ Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// ../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/buffer-util.js"(exports, module) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    function concat(list, totalLength) {
      if (list.length === 0) return EMPTY_BUFFER;
      if (list.length === 1) return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength) {
        return new FastBuffer(target.buffer, target.byteOffset, offset);
      }
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.length === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data)) return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = new FastBuffer(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    module.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = __require("bufferutil");
        module.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48) _mask(source, mask, output, offset, length);
          else bufferUtil.mask(source, mask, output, offset, length);
        };
        module.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32) _unmask(buffer, mask);
          else bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
    }
  }
});

// ../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/limiter.js"(exports, module) {
    "use strict";
    var kDone = /* @__PURE__ */ Symbol("kDone");
    var kRun = /* @__PURE__ */ Symbol("kRun");
    var Limiter = class {
      /**
       * Creates a new `Limiter`.
       *
       * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
       *     to run concurrently
       */
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      /**
       * Adds a job to the queue.
       *
       * @param {Function} job The job to run
       * @public
       */
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      /**
       * Removes a job from the queue and runs it if possible.
       *
       * @private
       */
      [kRun]() {
        if (this.pending === this.concurrency) return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module.exports = Limiter;
  }
});

// ../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/permessage-deflate.js"(exports, module) {
    "use strict";
    var zlib = __require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var FastBuffer = Buffer[Symbol.species];
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = /* @__PURE__ */ Symbol("permessage-deflate");
    var kTotalLength = /* @__PURE__ */ Symbol("total-length");
    var kCallback = /* @__PURE__ */ Symbol("callback");
    var kBuffers = /* @__PURE__ */ Symbol("buffers");
    var kError = /* @__PURE__ */ Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate = class {
      /**
       * Creates a PerMessageDeflate instance.
       *
       * @param {Object} [options] Configuration options
       * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
       *     for, or request, a custom client window size
       * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
       *     acknowledge disabling of client context takeover
       * @param {Number} [options.concurrencyLimit=10] The number of concurrent
       *     calls to zlib
       * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
       *     use of a custom server window size
       * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
       *     disabling of server context takeover
       * @param {Number} [options.threshold=1024] Size (in bytes) below which
       *     messages should not be compressed if context takeover is disabled
       * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
       *     deflate
       * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
       *     inflate
       * @param {Boolean} [isServer=false] Create the instance in either server or
       *     client mode
       * @param {Number} [maxPayload=0] The maximum allowed message length
       */
      constructor(options, isServer, maxPayload) {
        this._maxPayload = maxPayload | 0;
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._isServer = !!isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      /**
       * @type {String}
       */
      static get extensionName() {
        return "permessage-deflate";
      }
      /**
       * Create an extension negotiation offer.
       *
       * @return {Object} Extension parameters
       * @public
       */
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      /**
       * Accept an extension negotiation offer/response.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Object} Accepted configuration
       * @public
       */
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      /**
       * Releases all resources used by the extension.
       *
       * @public
       */
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      /**
       *  Accept an extension negotiation offer.
       *
       * @param {Array} offers The extension negotiation offers
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      /**
       * Accept the extension negotiation response.
       *
       * @param {Array} response The extension negotiation response
       * @return {Object} Accepted configuration
       * @private
       */
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      /**
       * Normalize parameters.
       *
       * @param {Array} configurations The extension negotiation offers/reponse
       * @return {Array} The offers/response with normalized parameters
       * @private
       */
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      /**
       * Decompress data. Concurrency limited.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Compress data. Concurrency limited.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @public
       */
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      /**
       * Decompress data.
       *
       * @param {Buffer} data Compressed data
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin) this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      /**
       * Compress data.
       *
       * @param {(Buffer|String)} data Data to compress
       * @param {Boolean} fin Specifies whether or not this is the last fragment
       * @param {Function} callback Callback
       * @private
       */
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin) {
            data2 = new FastBuffer(data2.buffer, data2.byteOffset, data2.length - 4);
          }
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module.exports = PerMessageDeflate;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      if (this[kError]) {
        this[kCallback](this[kError]);
        return;
      }
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// ../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/validation.js"(exports, module) {
    "use strict";
    var { isUtf8 } = __require("buffer");
    var { hasBlob } = require_constants();
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 0 - 15
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      // 16 - 31
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      // 32 - 47
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      // 48 - 63
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 64 - 79
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      // 80 - 95
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      // 96 - 111
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
      // 112 - 127
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || // Overlong
          buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || // Overlong
          buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    function isBlob(value) {
      return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
    }
    module.exports = {
      isBlob,
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (isUtf8) {
      module.exports.isValidUTF8 = function(buf) {
        return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
      };
    } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = __require("utf-8-validate");
        module.exports.isValidUTF8 = function(buf) {
          return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
    }
  }
});

// ../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/receiver.js"(exports, module) {
    "use strict";
    var { Writable } = __require("stream");
    var PerMessageDeflate = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var FastBuffer = Buffer[Symbol.species];
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var DEFER_EVENT = 6;
    var Receiver2 = class extends Writable {
      /**
       * Creates a Receiver instance.
       *
       * @param {Object} [options] Options object
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {String} [options.binaryType=nodebuffer] The type for binary data
       * @param {Object} [options.extensions] An object containing the negotiated
       *     extensions
       * @param {Boolean} [options.isServer=false] Specifies whether to operate in
       *     client or server mode
       * @param {Number} [options.maxPayload=0] The maximum allowed message length
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       */
      constructor(options = {}) {
        super();
        this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragments = [];
        this._errored = false;
        this._loop = false;
        this._state = GET_INFO;
      }
      /**
       * Implements `Writable.prototype._write()`.
       *
       * @param {Buffer} chunk The chunk of data to write
       * @param {String} encoding The character encoding of `chunk`
       * @param {Function} cb Callback
       * @private
       */
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO) return cb();
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      /**
       * Consumes `n` bytes from the buffered data.
       *
       * @param {Number} n The number of bytes to consume
       * @return {Buffer} The consumed bytes
       * @private
       */
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length) return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = new FastBuffer(
            buf.buffer,
            buf.byteOffset + n,
            buf.length - n
          );
          return new FastBuffer(buf.buffer, buf.byteOffset, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n
            );
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      /**
       * Starts the parsing loop.
       *
       * @param {Function} cb Callback
       * @private
       */
      startLoop(cb) {
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              this.getInfo(cb);
              break;
            case GET_PAYLOAD_LENGTH_16:
              this.getPayloadLength16(cb);
              break;
            case GET_PAYLOAD_LENGTH_64:
              this.getPayloadLength64(cb);
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              this.getData(cb);
              break;
            case INFLATING:
            case DEFER_EVENT:
              this._loop = false;
              return;
          }
        } while (this._loop);
        if (!this._errored) cb();
      }
      /**
       * Reads the first two bytes of a frame.
       *
       * @param {Function} cb Callback
       * @private
       */
      getInfo(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          const error = this.createError(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
          cb(error);
          return;
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
          const error = this.createError(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
          cb(error);
          return;
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (!this._fragmented) {
            const error = this.createError(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            const error = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
            cb(error);
            return;
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            const error = this.createError(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
            cb(error);
            return;
          }
          if (compressed) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
            cb(error);
            return;
          }
          if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
            const error = this.createError(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
            cb(error);
            return;
          }
        } else {
          const error = this.createError(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
          cb(error);
          return;
        }
        if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            const error = this.createError(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
            cb(error);
            return;
          }
        } else if (this._masked) {
          const error = this.createError(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
          cb(error);
          return;
        }
        if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
        else this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+16).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength16(cb) {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        this.haveLength(cb);
      }
      /**
       * Gets extended payload length (7+64).
       *
       * @param {Function} cb Callback
       * @private
       */
      getPayloadLength64(cb) {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          const error = this.createError(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
          cb(error);
          return;
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        this.haveLength(cb);
      }
      /**
       * Payload length has been read.
       *
       * @param {Function} cb Callback
       * @private
       */
      haveLength(cb) {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            const error = this.createError(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
            cb(error);
            return;
          }
        }
        if (this._masked) this._state = GET_MASK;
        else this._state = GET_DATA;
      }
      /**
       * Reads mask bytes.
       *
       * @private
       */
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      /**
       * Reads data bytes.
       *
       * @param {Function} cb Callback
       * @private
       */
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7) {
          this.controlMessage(data, cb);
          return;
        }
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        this.dataMessage(cb);
      }
      /**
       * Decompresses data.
       *
       * @param {Buffer} data Compressed data
       * @param {Function} cb Callback
       * @private
       */
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err) return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              const error = this.createError(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
              );
              cb(error);
              return;
            }
            this._fragments.push(buf);
          }
          this.dataMessage(cb);
          if (this._state === GET_INFO) this.startLoop(cb);
        });
      }
      /**
       * Handles a data message.
       *
       * @param {Function} cb Callback
       * @private
       */
      dataMessage(cb) {
        if (!this._fin) {
          this._state = GET_INFO;
          return;
        }
        const messageLength = this._messageLength;
        const fragments = this._fragments;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragmented = 0;
        this._fragments = [];
        if (this._opcode === 2) {
          let data;
          if (this._binaryType === "nodebuffer") {
            data = concat(fragments, messageLength);
          } else if (this._binaryType === "arraybuffer") {
            data = toArrayBuffer(concat(fragments, messageLength));
          } else if (this._binaryType === "blob") {
            data = new Blob(fragments);
          } else {
            data = fragments;
          }
          if (this._allowSynchronousEvents) {
            this.emit("message", data, true);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", data, true);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        } else {
          const buf = concat(fragments, messageLength);
          if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
            const error = this.createError(
              Error,
              "invalid UTF-8 sequence",
              true,
              1007,
              "WS_ERR_INVALID_UTF8"
            );
            cb(error);
            return;
          }
          if (this._state === INFLATING || this._allowSynchronousEvents) {
            this.emit("message", buf, false);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit("message", buf, false);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }
      }
      /**
       * Handles a control message.
       *
       * @param {Buffer} data Data to handle
       * @return {(Error|RangeError|undefined)} A possible error
       * @private
       */
      controlMessage(data, cb) {
        if (this._opcode === 8) {
          if (data.length === 0) {
            this._loop = false;
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              const error = this.createError(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
              cb(error);
              return;
            }
            const buf = new FastBuffer(
              data.buffer,
              data.byteOffset + 2,
              data.length - 2
            );
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
              cb(error);
              return;
            }
            this._loop = false;
            this.emit("conclude", code, buf);
            this.end();
          }
          this._state = GET_INFO;
          return;
        }
        if (this._allowSynchronousEvents) {
          this.emit(this._opcode === 9 ? "ping" : "pong", data);
          this._state = GET_INFO;
        } else {
          this._state = DEFER_EVENT;
          setImmediate(() => {
            this.emit(this._opcode === 9 ? "ping" : "pong", data);
            this._state = GET_INFO;
            this.startLoop(cb);
          });
        }
      }
      /**
       * Builds an error object.
       *
       * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
       * @param {String} message The error message
       * @param {Boolean} prefix Specifies whether or not to add a default prefix to
       *     `message`
       * @param {Number} statusCode The status code
       * @param {String} errorCode The exposed error code
       * @return {(Error|RangeError)} The error
       * @private
       */
      createError(ErrorCtor, message, prefix, statusCode, errorCode) {
        this._loop = false;
        this._errored = true;
        const err = new ErrorCtor(
          prefix ? `Invalid WebSocket frame: ${message}` : message
        );
        Error.captureStackTrace(err, this.createError);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    };
    module.exports = Receiver2;
  }
});

// ../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/sender.js"(exports, module) {
    "use strict";
    var { Duplex } = __require("stream");
    var { randomFillSync } = __require("crypto");
    var PerMessageDeflate = require_permessage_deflate();
    var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
    var { isBlob, isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = /* @__PURE__ */ Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var RANDOM_POOL_SIZE = 8 * 1024;
    var randomPool;
    var randomPoolPointer = RANDOM_POOL_SIZE;
    var DEFAULT = 0;
    var DEFLATING = 1;
    var GET_BLOB_DATA = 2;
    var Sender2 = class _Sender {
      /**
       * Creates a Sender instance.
       *
       * @param {Duplex} socket The connection socket
       * @param {Object} [extensions] An object containing the negotiated extensions
       * @param {Function} [generateMask] The function used to generate the masking
       *     key
       */
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._queue = [];
        this._state = DEFAULT;
        this.onerror = NOOP;
        this[kWebSocket] = void 0;
      }
      /**
       * Frames a piece of data according to the HyBi WebSocket protocol.
       *
       * @param {(Buffer|String)} data The data to frame
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @return {(Buffer|String)[]} The framed data
       * @public
       */
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            if (randomPoolPointer === RANDOM_POOL_SIZE) {
              if (randomPool === void 0) {
                randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
              }
              randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
              randomPoolPointer = 0;
            }
            mask[0] = randomPool[randomPoolPointer++];
            mask[1] = randomPool[randomPoolPointer++];
            mask[2] = randomPool[randomPoolPointer++];
            mask[3] = randomPool[randomPoolPointer++];
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1) target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask) return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking) return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      /**
       * Sends a close message to the other peer.
       *
       * @param {Number} [code] The status code component of the body
       * @param {(String|Buffer)} [data] The message component of the body
       * @param {Boolean} [mask=false] Specifies whether or not to mask the message
       * @param {Function} [cb] Callback
       * @public
       */
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else {
            buf.set(data, 2);
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(buf, options), cb);
        }
      }
      /**
       * Sends a ping message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a pong message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback
       * @public
       */
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, false, options, cb]);
          } else {
            this.getBlobData(data, false, options, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(_Sender.frame(data, options), cb);
        }
      }
      /**
       * Sends a data message to the other peer.
       *
       * @param {*} data The message to send
       * @param {Object} options Options object
       * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
       *     or text
       * @param {Boolean} [options.compress=false] Specifies whether or not to
       *     compress `data`
       * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Function} [cb] Callback
       * @public
       */
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else if (isBlob(data)) {
          byteLength = data.size;
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin) this._firstFragment = true;
        const opts = {
          [kByteLength]: byteLength,
          fin: options.fin,
          generateMask: this._generateMask,
          mask: options.mask,
          maskBuffer: this._maskBuffer,
          opcode,
          readOnly,
          rsv1
        };
        if (isBlob(data)) {
          if (this._state !== DEFAULT) {
            this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
          } else {
            this.getBlobData(data, this._compress, opts, cb);
          }
        } else if (this._state !== DEFAULT) {
          this.enqueue([this.dispatch, data, this._compress, opts, cb]);
        } else {
          this.dispatch(data, this._compress, opts, cb);
        }
      }
      /**
       * Gets the contents of a blob as binary data.
       *
       * @param {Blob} blob The blob
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     the data
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      getBlobData(blob, compress, options, cb) {
        this._bufferedBytes += options[kByteLength];
        this._state = GET_BLOB_DATA;
        blob.arrayBuffer().then((arrayBuffer) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while the blob was being read"
            );
            process.nextTick(callCallbacks, this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          const data = toBuffer(arrayBuffer);
          if (!compress) {
            this._state = DEFAULT;
            this.sendFrame(_Sender.frame(data, options), cb);
            this.dequeue();
          } else {
            this.dispatch(data, compress, options, cb);
          }
        }).catch((err) => {
          process.nextTick(onError, this, err, cb);
        });
      }
      /**
       * Dispatches a message.
       *
       * @param {(Buffer|String)} data The message to send
       * @param {Boolean} [compress=false] Specifies whether or not to compress
       *     `data`
       * @param {Object} options Options object
       * @param {Boolean} [options.fin=false] Specifies whether or not to set the
       *     FIN bit
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Boolean} [options.mask=false] Specifies whether or not to mask
       *     `data`
       * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
       *     key
       * @param {Number} options.opcode The opcode
       * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
       *     modified
       * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
       *     RSV1 bit
       * @param {Function} [cb] Callback
       * @private
       */
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(_Sender.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._state = DEFLATING;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            callCallbacks(this, err, cb);
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._state = DEFAULT;
          options.readOnly = false;
          this.sendFrame(_Sender.frame(buf, options), cb);
          this.dequeue();
        });
      }
      /**
       * Executes queued send operations.
       *
       * @private
       */
      dequeue() {
        while (this._state === DEFAULT && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      /**
       * Enqueues a send operation.
       *
       * @param {Array} params Send operation parameters.
       * @private
       */
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      /**
       * Sends a frame.
       *
       * @param {(Buffer | String)[]} list The frame to send
       * @param {Function} [cb] Callback
       * @private
       */
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module.exports = Sender2;
    function callCallbacks(sender, err, cb) {
      if (typeof cb === "function") cb(err);
      for (let i = 0; i < sender._queue.length; i++) {
        const params = sender._queue[i];
        const callback = params[params.length - 1];
        if (typeof callback === "function") callback(err);
      }
    }
    function onError(sender, err, cb) {
      callCallbacks(sender, err, cb);
      sender.onerror(err);
    }
  }
});

// ../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/event-target.js"(exports, module) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = /* @__PURE__ */ Symbol("kCode");
    var kData = /* @__PURE__ */ Symbol("kData");
    var kError = /* @__PURE__ */ Symbol("kError");
    var kMessage = /* @__PURE__ */ Symbol("kMessage");
    var kReason = /* @__PURE__ */ Symbol("kReason");
    var kTarget = /* @__PURE__ */ Symbol("kTarget");
    var kType = /* @__PURE__ */ Symbol("kType");
    var kWasClean = /* @__PURE__ */ Symbol("kWasClean");
    var Event = class {
      /**
       * Create a new `Event`.
       *
       * @param {String} type The name of the event
       * @throws {TypeError} If the `type` argument is not specified
       */
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      /**
       * @type {*}
       */
      get target() {
        return this[kTarget];
      }
      /**
       * @type {String}
       */
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      /**
       * Create a new `CloseEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {Number} [options.code=0] The status code explaining why the
       *     connection was closed
       * @param {String} [options.reason=''] A human-readable string explaining why
       *     the connection was closed
       * @param {Boolean} [options.wasClean=false] Indicates whether or not the
       *     connection was cleanly closed
       */
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      /**
       * @type {Number}
       */
      get code() {
        return this[kCode];
      }
      /**
       * @type {String}
       */
      get reason() {
        return this[kReason];
      }
      /**
       * @type {Boolean}
       */
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      /**
       * Create a new `ErrorEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.error=null] The error that generated this event
       * @param {String} [options.message=''] The error message
       */
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      /**
       * @type {*}
       */
      get error() {
        return this[kError];
      }
      /**
       * @type {String}
       */
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      /**
       * Create a new `MessageEvent`.
       *
       * @param {String} type The name of the event
       * @param {Object} [options] A dictionary object that allows for setting
       *     attributes via object members of the same name
       * @param {*} [options.data=null] The message content
       */
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      /**
       * @type {*}
       */
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      /**
       * Register an event listener.
       *
       * @param {String} type A string representing the event type to listen for
       * @param {(Function|Object)} handler The listener to add
       * @param {Object} [options] An options object specifies characteristics about
       *     the event listener
       * @param {Boolean} [options.once=false] A `Boolean` indicating that the
       *     listener should be invoked at most once after being added. If `true`,
       *     the listener would be automatically removed when invoked.
       * @public
       */
      addEventListener(type, handler, options = {}) {
        for (const listener of this.listeners(type)) {
          if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            return;
          }
        }
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            callListener(handler, this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = handler;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      /**
       * Remove an event listener.
       *
       * @param {String} type A string representing the event type to remove
       * @param {(Function|Object)} handler The listener to remove
       * @public
       */
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
    function callListener(listener, thisArg, event) {
      if (typeof listener === "object" && listener.handleEvent) {
        listener.handleEvent.call(listener, event);
      } else {
        listener.call(thisArg, event);
      }
    }
  }
});

// ../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/extension.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0) dest[name] = [elem];
      else dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1) start = i;
            else if (!mustUnescape) mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1) end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1) end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1) end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension) => {
        let configurations = extensions[extension];
        if (!Array.isArray(configurations)) configurations = [configurations];
        return configurations.map((params) => {
          return [extension].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values)) values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module.exports = { format, parse };
  }
});

// ../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/websocket.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var https = __require("https");
    var http2 = __require("http");
    var net = __require("net");
    var tls = __require("tls");
    var { randomBytes, createHash } = __require("crypto");
    var { Duplex, Readable } = __require("stream");
    var { URL: URL2 } = __require("url");
    var PerMessageDeflate = require_permessage_deflate();
    var Receiver2 = require_receiver();
    var Sender2 = require_sender();
    var { isBlob } = require_validation();
    var {
      BINARY_TYPES,
      CLOSE_TIMEOUT,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var kAborted = /* @__PURE__ */ Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket3 = class _WebSocket extends EventEmitter {
      /**
       * Create a new `WebSocket`.
       *
       * @param {(String|URL)} address The URL to which to connect
       * @param {(String|String[])} [protocols] The subprotocols
       * @param {Object} [options] Connection options
       */
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._errorEmitted = false;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = _WebSocket.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._autoPong = options.autoPong;
          this._closeTimeout = options.closeTimeout;
          this._isServer = true;
        }
      }
      /**
       * For historical reasons, the custom "nodebuffer" type is used by the default
       * instead of "blob".
       *
       * @type {String}
       */
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type)) return;
        this._binaryType = type;
        if (this._receiver) this._receiver._binaryType = type;
      }
      /**
       * @type {Number}
       */
      get bufferedAmount() {
        if (!this._socket) return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      /**
       * @type {String}
       */
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      /**
       * @type {Boolean}
       */
      get isPaused() {
        return this._paused;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onclose() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onerror() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onopen() {
        return null;
      }
      /**
       * @type {Function}
       */
      /* istanbul ignore next */
      get onmessage() {
        return null;
      }
      /**
       * @type {String}
       */
      get protocol() {
        return this._protocol;
      }
      /**
       * @type {Number}
       */
      get readyState() {
        return this._readyState;
      }
      /**
       * @type {String}
       */
      get url() {
        return this._url;
      }
      /**
       * Set up the socket and the internal resources.
       *
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Object} options Options object
       * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.maxPayload=0] The maximum allowed message size
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      setSocket(socket, head, options) {
        const receiver = new Receiver2({
          allowSynchronousEvents: options.allowSynchronousEvents,
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        const sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._sender = sender;
        this._socket = socket;
        receiver[kWebSocket] = this;
        sender[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        sender.onerror = senderOnError;
        if (socket.setTimeout) socket.setTimeout(0);
        if (socket.setNoDelay) socket.setNoDelay();
        if (head.length > 0) socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = _WebSocket.OPEN;
        this.emit("open");
      }
      /**
       * Emit the `'close'` event.
       *
       * @private
       */
      emitClose() {
        if (!this._socket) {
          this._readyState = _WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate.extensionName]) {
          this._extensions[PerMessageDeflate.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = _WebSocket.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      /**
       * Start a closing handshake.
       *
       *          +----------+   +-----------+   +----------+
       *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
       *    |     +----------+   +-----------+   +----------+     |
       *          +----------+   +-----------+         |
       * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
       *          +----------+   +-----------+   |
       *    |           |                        |   +---+        |
       *                +------------------------+-->|fin| - - - -
       *    |         +---+                      |   +---+
       *     - - - - -|fin|<---------------------+
       *              +---+
       *
       * @param {Number} [code] Status code explaining why the connection is closing
       * @param {(String|Buffer)} [data] The reason why the connection is
       *     closing
       * @public
       */
      close(code, data) {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this.readyState === _WebSocket.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = _WebSocket.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err) return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        setCloseTimer(this);
      }
      /**
       * Pause the socket.
       *
       * @public
       */
      pause() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      /**
       * Send a ping.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the ping is sent
       * @public
       */
      ping(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Send a pong.
       *
       * @param {*} [data] The data to send
       * @param {Boolean} [mask] Indicates whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when the pong is sent
       * @public
       */
      pong(data, mask, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0) mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      /**
       * Resume the socket.
       *
       * @public
       */
      resume() {
        if (this.readyState === _WebSocket.CONNECTING || this.readyState === _WebSocket.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain) this._socket.resume();
      }
      /**
       * Send a data message.
       *
       * @param {*} data The message to send
       * @param {Object} [options] Options object
       * @param {Boolean} [options.binary] Specifies whether `data` is binary or
       *     text
       * @param {Boolean} [options.compress] Specifies whether or not to compress
       *     `data`
       * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
       *     last one
       * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
       * @param {Function} [cb] Callback which is executed when data is written out
       * @public
       */
      send(data, options, cb) {
        if (this.readyState === _WebSocket.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number") data = data.toString();
        if (this.readyState !== _WebSocket.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      /**
       * Forcibly close the connection.
       *
       * @public
       */
      terminate() {
        if (this.readyState === _WebSocket.CLOSED) return;
        if (this.readyState === _WebSocket.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          abortHandshake(this, this._req, msg);
          return;
        }
        if (this._socket) {
          this._readyState = _WebSocket.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket3, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket3.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket3, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket3.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket3, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket3.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket3, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket3.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket3.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket3.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function") return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket3.prototype.addEventListener = addEventListener;
    WebSocket3.prototype.removeEventListener = removeEventListener;
    module.exports = WebSocket3;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        allowSynchronousEvents: true,
        autoPong: true,
        closeTimeout: CLOSE_TIMEOUT,
        protocolVersion: protocolVersions[1],
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      websocket._autoPong = opts.autoPong;
      websocket._closeTimeout = opts.closeTimeout;
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL2) {
        parsedUrl = address;
      } else {
        try {
          parsedUrl = new URL2(address);
        } catch (e) {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
      }
      if (parsedUrl.protocol === "http:") {
        parsedUrl.protocol = "ws:";
      } else if (parsedUrl.protocol === "https:") {
        parsedUrl.protocol = "wss:";
      }
      websocket._url = parsedUrl.href;
      const isSecure = parsedUrl.protocol === "wss:";
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https.request : http2.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate(
          opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
          false,
          opts.maxPayload
        );
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost) delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted]) return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location = res.headers.location;
        const statusCode = res.statusCode;
        if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL2(location, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket3.CONNECTING) return;
        req = websocket._req = null;
        const upgrade = res.headers.upgrade;
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt) websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          allowSynchronousEvents: opts.allowSynchronousEvents,
          generateMask: opts.generateMask,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      if (opts.finishRequest) {
        opts.finishRequest(req, websocket);
      } else {
        req.end();
      }
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket3.CLOSING;
      websocket._errorEmitted = true;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket3.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = isBlob(data) ? data.size : toBuffer(data).length;
        if (websocket._socket) websocket._sender._bufferedBytes += length;
        else websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        process.nextTick(cb, err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0) return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005) websocket.close();
      else websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused) websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function senderOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket.readyState === WebSocket3.CLOSED) return;
      if (websocket.readyState === WebSocket3.OPEN) {
        websocket._readyState = WebSocket3.CLOSING;
        setCloseTimer(websocket);
      }
      this._socket.end();
      if (!websocket._errorEmitted) {
        websocket._errorEmitted = true;
        websocket.emit("error", err);
      }
    }
    function setCloseTimer(websocket) {
      websocket._closeTimer = setTimeout(
        websocket._socket.destroy.bind(websocket._socket),
        websocket._closeTimeout
      );
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket3.CLOSING;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
        const chunk = this.read(this._readableState.length);
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket3.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket3.CLOSING;
        this.destroy();
      }
    }
  }
});

// ../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/stream.js"(exports, module) {
    "use strict";
    var WebSocket3 = require_websocket();
    var { Duplex } = __require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream2(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data)) ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed) return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed) return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called) callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy) ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null) return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted) duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused) ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module.exports = createWebSocketStream2;
  }
});

// ../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/subprotocol.js"(exports, module) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1) end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1) end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module.exports = { parse };
  }
});

// ../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/lib/websocket-server.js"(exports, module) {
    "use strict";
    var EventEmitter = __require("events");
    var http2 = __require("http");
    var { Duplex } = __require("stream");
    var { createHash } = __require("crypto");
    var extension = require_extension();
    var PerMessageDeflate = require_permessage_deflate();
    var subprotocol = require_subprotocol();
    var WebSocket3 = require_websocket();
    var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer2 = class extends EventEmitter {
      /**
       * Create a `WebSocketServer` instance.
       *
       * @param {Object} options Configuration options
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
       *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
       *     multiple times in the same tick
       * @param {Boolean} [options.autoPong=true] Specifies whether or not to
       *     automatically send a pong in response to a ping
       * @param {Number} [options.backlog=511] The maximum length of the queue of
       *     pending connections
       * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
       *     track clients
       * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
       *     wait for the closing handshake to finish after `websocket.close()` is
       *     called
       * @param {Function} [options.handleProtocols] A hook to handle protocols
       * @param {String} [options.host] The hostname where to bind the server
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Boolean} [options.noServer=false] Enable no server mode
       * @param {String} [options.path] Accept only connections matching this path
       * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.port] The port where to bind the server
       * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
       *     server to use
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @param {Function} [options.verifyClient] A hook to reject connections
       * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
       *     class to use. It must be the `WebSocket` class or class that extends it
       * @param {Function} [callback] A listener for the `listening` event
       */
      constructor(options, callback) {
        super();
        options = {
          allowSynchronousEvents: true,
          autoPong: true,
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          closeTimeout: CLOSE_TIMEOUT,
          verifyClient: null,
          noServer: false,
          backlog: null,
          // use default (511 as implemented in net.js)
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket3,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http2.createServer((req, res) => {
            const body = http2.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true) options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      /**
       * Returns the bound address, the address family name, and port of the server
       * as reported by the operating system if listening on an IP socket.
       * If the server is listening on a pipe or UNIX domain socket, the name is
       * returned as a string.
       *
       * @return {(Object|String|null)} The address of the server
       * @public
       */
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server) return null;
        return this._server.address();
      }
      /**
       * Stop the server from accepting new connections and emit the `'close'` event
       * when all existing connections are closed.
       *
       * @param {Function} [cb] A one-time listener for the `'close'` event
       * @public
       */
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb) this.once("close", cb);
        if (this._state === CLOSING) return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      /**
       * See if a given request should be handled by this server instance.
       *
       * @param {http.IncomingMessage} req Request object to inspect
       * @return {Boolean} `true` if the request is valid, else `false`
       * @public
       */
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path) return false;
        }
        return true;
      }
      /**
       * Handle a HTTP Upgrade request.
       *
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @public
       */
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const upgrade = req.headers.upgrade;
        const version = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (key === void 0 || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version !== 13 && version !== 8) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
            "Sec-WebSocket-Version": "13, 8"
          });
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate(
            this.options.perMessageDeflate,
            true,
            this.options.maxPayload
          );
          try {
            const offers = extension.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
              extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      /**
       * Upgrade the connection to WebSocket.
       *
       * @param {Object} extensions The accepted extensions
       * @param {String} key The value of the `Sec-WebSocket-Key` header
       * @param {Set} protocols The subprotocols
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The network socket between the server and client
       * @param {Buffer} head The first packet of the upgraded stream
       * @param {Function} cb Callback
       * @throws {Error} If called more than once with the same socket
       * @private
       */
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable) return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING) return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null, void 0, this.options);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate.extensionName]) {
          const params = extensions[PerMessageDeflate.extensionName].params;
          const value = extension.format({
            [PerMessageDeflate.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          allowSynchronousEvents: this.options.allowSynchronousEvents,
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module.exports = WebSocketServer2;
    function addListeners(server, map) {
      for (const event of Object.keys(map)) server.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http2.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http2.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
      if (server.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message, headers);
      }
    }
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/util/constants.js
var require_constants2 = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/util/constants.js"(exports, module) {
    module.exports = {
      /* The local file header */
      LOCHDR: 30,
      // LOC header size
      LOCSIG: 67324752,
      // "PK\003\004"
      LOCVER: 4,
      // version needed to extract
      LOCFLG: 6,
      // general purpose bit flag
      LOCHOW: 8,
      // compression method
      LOCTIM: 10,
      // modification time (2 bytes time, 2 bytes date)
      LOCCRC: 14,
      // uncompressed file crc-32 value
      LOCSIZ: 18,
      // compressed size
      LOCLEN: 22,
      // uncompressed size
      LOCNAM: 26,
      // filename length
      LOCEXT: 28,
      // extra field length
      /* The Data descriptor */
      EXTSIG: 134695760,
      // "PK\007\008"
      EXTHDR: 16,
      // EXT header size
      EXTCRC: 4,
      // uncompressed file crc-32 value
      EXTSIZ: 8,
      // compressed size
      EXTLEN: 12,
      // uncompressed size
      /* The central directory file header */
      CENHDR: 46,
      // CEN header size
      CENSIG: 33639248,
      // "PK\001\002"
      CENVEM: 4,
      // version made by
      CENVER: 6,
      // version needed to extract
      CENFLG: 8,
      // encrypt, decrypt flags
      CENHOW: 10,
      // compression method
      CENTIM: 12,
      // modification time (2 bytes time, 2 bytes date)
      CENCRC: 16,
      // uncompressed file crc-32 value
      CENSIZ: 20,
      // compressed size
      CENLEN: 24,
      // uncompressed size
      CENNAM: 28,
      // filename length
      CENEXT: 30,
      // extra field length
      CENCOM: 32,
      // file comment length
      CENDSK: 34,
      // volume number start
      CENATT: 36,
      // internal file attributes
      CENATX: 38,
      // external file attributes (host system dependent)
      CENOFF: 42,
      // LOC header offset
      /* The entries in the end of central directory */
      ENDHDR: 22,
      // END header size
      ENDSIG: 101010256,
      // "PK\005\006"
      ENDSUB: 8,
      // number of entries on this disk
      ENDTOT: 10,
      // total number of entries
      ENDSIZ: 12,
      // central directory size in bytes
      ENDOFF: 16,
      // offset of first CEN header
      ENDCOM: 20,
      // zip file comment length
      END64HDR: 20,
      // zip64 END header size
      END64SIG: 117853008,
      // zip64 Locator signature, "PK\006\007"
      END64START: 4,
      // number of the disk with the start of the zip64
      END64OFF: 8,
      // relative offset of the zip64 end of central directory
      END64NUMDISKS: 16,
      // total number of disks
      ZIP64SIG: 101075792,
      // zip64 signature, "PK\006\006"
      ZIP64HDR: 56,
      // zip64 record minimum size
      ZIP64LEAD: 12,
      // leading bytes at the start of the record, not counted by the value stored in ZIP64SIZE
      ZIP64SIZE: 4,
      // zip64 size of the central directory record
      ZIP64VEM: 12,
      // zip64 version made by
      ZIP64VER: 14,
      // zip64 version needed to extract
      ZIP64DSK: 16,
      // zip64 number of this disk
      ZIP64DSKDIR: 20,
      // number of the disk with the start of the record directory
      ZIP64SUB: 24,
      // number of entries on this disk
      ZIP64TOT: 32,
      // total number of entries
      ZIP64SIZB: 40,
      // zip64 central directory size in bytes
      ZIP64OFF: 48,
      // offset of start of central directory with respect to the starting disk number
      ZIP64EXTRA: 56,
      // extensible data sector
      /* Compression methods */
      STORED: 0,
      // no compression
      SHRUNK: 1,
      // shrunk
      REDUCED1: 2,
      // reduced with compression factor 1
      REDUCED2: 3,
      // reduced with compression factor 2
      REDUCED3: 4,
      // reduced with compression factor 3
      REDUCED4: 5,
      // reduced with compression factor 4
      IMPLODED: 6,
      // imploded
      // 7 reserved for Tokenizing compression algorithm
      DEFLATED: 8,
      // deflated
      ENHANCED_DEFLATED: 9,
      // enhanced deflated
      PKWARE: 10,
      // PKWare DCL imploded
      // 11 reserved by PKWARE
      BZIP2: 12,
      //  compressed using BZIP2
      // 13 reserved by PKWARE
      LZMA: 14,
      // LZMA
      // 15-17 reserved by PKWARE
      IBM_TERSE: 18,
      // compressed using IBM TERSE
      IBM_LZ77: 19,
      // IBM LZ77 z
      AES_ENCRYPT: 99,
      // WinZIP AES encryption method
      /* General purpose bit flag */
      // values can obtained with expression 2**bitnr
      FLG_ENC: 1,
      // Bit 0: encrypted file
      FLG_COMP1: 2,
      // Bit 1, compression option
      FLG_COMP2: 4,
      // Bit 2, compression option
      FLG_DESC: 8,
      // Bit 3, data descriptor
      FLG_ENH: 16,
      // Bit 4, enhanced deflating
      FLG_PATCH: 32,
      // Bit 5, indicates that the file is compressed patched data.
      FLG_STR: 64,
      // Bit 6, strong encryption (patented)
      // Bits 7-10: Currently unused.
      FLG_EFS: 2048,
      // Bit 11: Language encoding flag (EFS)
      // Bit 12: Reserved by PKWARE for enhanced compression.
      // Bit 13: encrypted the Central Directory (patented).
      // Bits 14-15: Reserved by PKWARE.
      FLG_MSK: 4096,
      // mask header values
      /* Load type */
      FILE: 2,
      BUFFER: 1,
      NONE: 0,
      /* 4.5 Extensible data fields */
      EF_ID: 0,
      EF_SIZE: 2,
      /* Header IDs */
      ID_ZIP64: 1,
      ID_AVINFO: 7,
      ID_PFS: 8,
      ID_OS2: 9,
      ID_NTFS: 10,
      ID_OPENVMS: 12,
      ID_UNIX: 13,
      ID_FORK: 14,
      ID_PATCH: 15,
      ID_X509_PKCS7: 20,
      ID_X509_CERTID_F: 21,
      ID_X509_CERTID_C: 22,
      ID_STRONGENC: 23,
      ID_RECORD_MGT: 24,
      ID_X509_PKCS7_RL: 25,
      ID_IBM1: 101,
      ID_IBM2: 102,
      ID_POSZIP: 18064,
      EF_ZIP64_OR_32: 4294967295,
      EF_ZIP64_OR_16: 65535,
      EF_ZIP64_SUNCOMP: 0,
      EF_ZIP64_SCOMP: 8,
      EF_ZIP64_RHO: 16,
      EF_ZIP64_DSN: 24
    };
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/util/errors.js
var require_errors = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/util/errors.js"(exports) {
    var errors = {
      /* Header error messages */
      INVALID_LOC: "Invalid LOC header (bad signature)",
      INVALID_CEN: "Invalid CEN header (bad signature)",
      INVALID_END: "Invalid END header (bad signature)",
      /* Descriptor */
      DESCRIPTOR_NOT_EXIST: "No descriptor present",
      DESCRIPTOR_UNKNOWN: "Unknown descriptor format",
      DESCRIPTOR_FAULTY: "Descriptor data is malformed",
      /* ZipEntry error messages*/
      NO_DATA: "Nothing to decompress",
      BAD_CRC: "CRC32 checksum failed {0}",
      FILE_IN_THE_WAY: "There is a file in the way: {0}",
      UNKNOWN_METHOD: "Invalid/unsupported compression method",
      /* Inflater error messages */
      AVAIL_DATA: "inflate::Available inflate data did not terminate",
      INVALID_DISTANCE: "inflate::Invalid literal/length or distance code in fixed or dynamic block",
      TO_MANY_CODES: "inflate::Dynamic block code description: too many length or distance codes",
      INVALID_REPEAT_LEN: "inflate::Dynamic block code description: repeat more than specified lengths",
      INVALID_REPEAT_FIRST: "inflate::Dynamic block code description: repeat lengths with no first length",
      INCOMPLETE_CODES: "inflate::Dynamic block code description: code lengths codes incomplete",
      INVALID_DYN_DISTANCE: "inflate::Dynamic block code description: invalid distance code lengths",
      INVALID_CODES_LEN: "inflate::Dynamic block code description: invalid literal/length code lengths",
      INVALID_STORE_BLOCK: "inflate::Stored block length did not match one's complement",
      INVALID_BLOCK_TYPE: "inflate::Invalid block type (type == 3)",
      /* ADM-ZIP error messages */
      CANT_EXTRACT_FILE: "Could not extract the file",
      CANT_OVERRIDE: "Target file already exists",
      DISK_ENTRY_TOO_LARGE: "Number of disk entries is too large",
      NO_ZIP: "No zip file was loaded",
      NO_ENTRY: "Entry doesn't exist",
      DIRECTORY_CONTENT_ERROR: "A directory cannot have content",
      FILE_NOT_FOUND: 'File not found: "{0}"',
      NOT_IMPLEMENTED: "Not implemented",
      INVALID_FILENAME: "Invalid filename",
      INVALID_FORMAT: "Invalid or unsupported zip format. No END header found",
      INVALID_PASS_PARAM: "Incompatible password parameter",
      WRONG_PASSWORD: "Wrong Password",
      /* ADM-ZIP */
      COMMENT_TOO_LONG: "Comment is too long",
      // Comment can be max 65535 bytes long (NOTE: some non-US characters may take more space)
      EXTRA_FIELD_PARSE_ERROR: "Extra field parsing error"
    };
    function E(message) {
      return function(...args) {
        if (args.length) {
          message = message.replace(/\{(\d)\}/g, (_, n) => args[n] || "");
        }
        return new Error("ADM-ZIP: " + message);
      };
    }
    for (const msg of Object.keys(errors)) {
      exports[msg] = E(errors[msg]);
    }
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/util/utils.js
var require_utils = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/util/utils.js"(exports, module) {
    var fsystem = __require("fs");
    var pth = __require("path");
    var Constants = require_constants2();
    var Errors = require_errors();
    var isWin = typeof process === "object" && "win32" === process.platform;
    var is_Obj = (obj) => typeof obj === "object" && obj !== null;
    var crcTable = new Uint32Array(256).map((t, c) => {
      for (let k = 0; k < 8; k++) {
        if ((c & 1) !== 0) {
          c = 3988292384 ^ c >>> 1;
        } else {
          c >>>= 1;
        }
      }
      return c >>> 0;
    });
    function Utils(opts) {
      this.sep = pth.sep;
      this.fs = fsystem;
      if (is_Obj(opts)) {
        if (is_Obj(opts.fs) && typeof opts.fs.statSync === "function") {
          this.fs = opts.fs;
        }
      }
    }
    module.exports = Utils;
    Utils.prototype.makeDir = function(folder) {
      const self = this;
      function mkdirSync3(fpath) {
        let resolvedPath = fpath.split(self.sep)[0];
        fpath.split(self.sep).forEach(function(name) {
          if (!name || name.substr(-1, 1) === ":") return;
          resolvedPath += self.sep + name;
          var stat;
          try {
            stat = self.fs.statSync(resolvedPath);
          } catch (e) {
            self.fs.mkdirSync(resolvedPath);
          }
          if (stat && stat.isFile()) throw Errors.FILE_IN_THE_WAY(`"${resolvedPath}"`);
        });
      }
      mkdirSync3(folder);
    };
    Utils.prototype.writeFileTo = function(path5, content, overwrite, attr) {
      const self = this;
      if (self.fs.existsSync(path5)) {
        if (!overwrite) return false;
        var stat = self.fs.statSync(path5);
        if (stat.isDirectory()) {
          return false;
        }
      }
      var folder = pth.dirname(path5);
      if (!self.fs.existsSync(folder)) {
        self.makeDir(folder);
      }
      var fd;
      try {
        fd = self.fs.openSync(path5, "w", 438);
      } catch (e) {
        self.fs.chmodSync(path5, 438);
        fd = self.fs.openSync(path5, "w", 438);
      }
      if (fd) {
        try {
          self.fs.writeSync(fd, content, 0, content.length, 0);
        } finally {
          self.fs.closeSync(fd);
        }
      }
      self.fs.chmodSync(path5, attr || 438);
      return true;
    };
    Utils.prototype.writeFileToAsync = function(path5, content, overwrite, attr, callback) {
      if (typeof attr === "function") {
        callback = attr;
        attr = void 0;
      }
      const self = this;
      self.fs.exists(path5, function(exist) {
        if (exist && !overwrite) return callback(false);
        self.fs.stat(path5, function(err, stat) {
          if (exist && stat.isDirectory()) {
            return callback(false);
          }
          var folder = pth.dirname(path5);
          self.fs.exists(folder, function(exists) {
            if (!exists) self.makeDir(folder);
            self.fs.open(path5, "w", 438, function(err2, fd) {
              if (err2) {
                self.fs.chmod(path5, 438, function() {
                  self.fs.open(path5, "w", 438, function(err3, fd2) {
                    self.fs.write(fd2, content, 0, content.length, 0, function() {
                      self.fs.close(fd2, function() {
                        self.fs.chmod(path5, attr || 438, function() {
                          callback(true);
                        });
                      });
                    });
                  });
                });
              } else if (fd) {
                self.fs.write(fd, content, 0, content.length, 0, function() {
                  self.fs.close(fd, function() {
                    self.fs.chmod(path5, attr || 438, function() {
                      callback(true);
                    });
                  });
                });
              } else {
                self.fs.chmod(path5, attr || 438, function() {
                  callback(true);
                });
              }
            });
          });
        });
      });
    };
    Utils.prototype.findFiles = function(path5) {
      const self = this;
      function findSync(dir, pattern, recursive) {
        if (typeof pattern === "boolean") {
          recursive = pattern;
          pattern = void 0;
        }
        let files = [];
        self.fs.readdirSync(dir).forEach(function(file) {
          const path6 = pth.join(dir, file);
          const stat = self.fs.statSync(path6);
          if (!pattern || pattern.test(path6)) {
            files.push(pth.normalize(path6) + (stat.isDirectory() ? self.sep : ""));
          }
          if (stat.isDirectory() && recursive) files = files.concat(findSync(path6, pattern, recursive));
        });
        return files;
      }
      return findSync(path5, void 0, true);
    };
    Utils.prototype.findFilesAsync = function(dir, cb) {
      const self = this;
      let results = [];
      self.fs.readdir(dir, function(err, list) {
        if (err) return cb(err);
        let list_length = list.length;
        if (!list_length) return cb(null, results);
        list.forEach(function(file) {
          file = pth.join(dir, file);
          self.fs.stat(file, function(err2, stat) {
            if (err2) return cb(err2);
            if (stat) {
              results.push(pth.normalize(file) + (stat.isDirectory() ? self.sep : ""));
              if (stat.isDirectory()) {
                self.findFilesAsync(file, function(err3, res) {
                  if (err3) return cb(err3);
                  results = results.concat(res);
                  if (!--list_length) cb(null, results);
                });
              } else {
                if (!--list_length) cb(null, results);
              }
            }
          });
        });
      });
    };
    Utils.prototype.getAttributes = function() {
    };
    Utils.prototype.setAttributes = function() {
    };
    Utils.crc32update = function(crc, byte) {
      return crcTable[(crc ^ byte) & 255] ^ crc >>> 8;
    };
    Utils.crc32 = function(buf) {
      if (typeof buf === "string") {
        buf = Buffer.from(buf, "utf8");
      }
      let len = buf.length;
      let crc = ~0;
      for (let off = 0; off < len; ) crc = Utils.crc32update(crc, buf[off++]);
      return ~crc >>> 0;
    };
    Utils.methodToString = function(method) {
      switch (method) {
        case Constants.STORED:
          return "STORED (" + method + ")";
        case Constants.DEFLATED:
          return "DEFLATED (" + method + ")";
        default:
          return "UNSUPPORTED (" + method + ")";
      }
    };
    Utils.canonical = function(path5) {
      if (!path5) return "";
      const safeSuffix = pth.posix.normalize("/" + path5.split("\\").join("/"));
      return pth.join(".", safeSuffix);
    };
    Utils.zipnamefix = function(path5) {
      if (!path5) return "";
      const safeSuffix = pth.posix.normalize("/" + path5.split("\\").join("/"));
      return pth.posix.join(".", safeSuffix);
    };
    Utils.findLast = function(arr, callback) {
      if (!Array.isArray(arr)) throw new TypeError("arr is not array");
      const len = arr.length >>> 0;
      for (let i = len - 1; i >= 0; i--) {
        if (callback(arr[i], i, arr)) {
          return arr[i];
        }
      }
      return void 0;
    };
    Utils.sanitize = function(prefix, name) {
      prefix = pth.resolve(pth.normalize(prefix));
      var parts = name.split("/");
      for (var i = 0, l = parts.length; i < l; i++) {
        var path5 = pth.normalize(pth.join(prefix, parts.slice(i, l).join(pth.sep)));
        if (path5.indexOf(prefix) === 0) {
          return path5;
        }
      }
      return pth.normalize(pth.join(prefix, pth.basename(name)));
    };
    Utils.toBuffer = function toBuffer(input, encoder) {
      if (Buffer.isBuffer(input)) {
        return input;
      } else if (input instanceof Uint8Array) {
        return Buffer.from(input);
      } else {
        return typeof input === "string" ? encoder(input) : Buffer.alloc(0);
      }
    };
    Utils.readBigUInt64LE = function(buffer, index) {
      var slice = Buffer.from(buffer.slice(index, index + 8));
      slice.swap64();
      return parseInt(`0x${slice.toString("hex")}`);
    };
    Utils.fromDOS2Date = function(val) {
      return new Date((val >> 25 & 127) + 1980, Math.max((val >> 21 & 15) - 1, 0), Math.max(val >> 16 & 31, 1), val >> 11 & 31, val >> 5 & 63, (val & 31) << 1);
    };
    Utils.fromDate2DOS = function(val) {
      let date = 0;
      let time = 0;
      if (val.getFullYear() > 1979) {
        date = (val.getFullYear() - 1980 & 127) << 9 | val.getMonth() + 1 << 5 | val.getDate();
        time = val.getHours() << 11 | val.getMinutes() << 5 | val.getSeconds() >> 1;
      }
      return date << 16 | time;
    };
    Utils.isWin = isWin;
    Utils.crcTable = crcTable;
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/util/fattr.js
var require_fattr = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/util/fattr.js"(exports, module) {
    var pth = __require("path");
    module.exports = function(path5, { fs: fs5 }) {
      var _path = path5 || "", _obj = newAttr(), _stat = null;
      function newAttr() {
        return {
          directory: false,
          readonly: false,
          hidden: false,
          executable: false,
          mtime: 0,
          atime: 0
        };
      }
      if (_path && fs5.existsSync(_path)) {
        _stat = fs5.statSync(_path);
        _obj.directory = _stat.isDirectory();
        _obj.mtime = _stat.mtime;
        _obj.atime = _stat.atime;
        _obj.executable = (73 & _stat.mode) !== 0;
        _obj.readonly = (128 & _stat.mode) === 0;
        _obj.hidden = pth.basename(_path)[0] === ".";
      } else {
        console.warn("Invalid path: " + _path);
      }
      return {
        get directory() {
          return _obj.directory;
        },
        get readOnly() {
          return _obj.readonly;
        },
        get hidden() {
          return _obj.hidden;
        },
        get mtime() {
          return _obj.mtime;
        },
        get atime() {
          return _obj.atime;
        },
        get executable() {
          return _obj.executable;
        },
        decodeAttributes: function() {
        },
        encodeAttributes: function() {
        },
        toJSON: function() {
          return {
            path: _path,
            isDirectory: _obj.directory,
            isReadOnly: _obj.readonly,
            isHidden: _obj.hidden,
            isExecutable: _obj.executable,
            mTime: _obj.mtime,
            aTime: _obj.atime
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/util/decoder.js
var require_decoder = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/util/decoder.js"(exports, module) {
    module.exports = {
      efs: true,
      encode: (data) => Buffer.from(data, "utf8"),
      decode: (data) => data.toString("utf8")
    };
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/util/index.js
var require_util = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/util/index.js"(exports, module) {
    module.exports = require_utils();
    module.exports.Constants = require_constants2();
    module.exports.Errors = require_errors();
    module.exports.FileAttr = require_fattr();
    module.exports.decoder = require_decoder();
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/headers/entryHeader.js
var require_entryHeader = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/headers/entryHeader.js"(exports, module) {
    var Utils = require_util();
    var Constants = Utils.Constants;
    module.exports = function() {
      var _verMade = 20, _version = 10, _flags = 0, _method = 0, _time = 0, _crc = 0, _compressedSize = 0, _size = 0, _fnameLen = 0, _extraLen = 0, _comLen = 0, _diskStart = 0, _inattr = 0, _attr = 0, _offset = 0;
      _verMade |= Utils.isWin ? 2560 : 768;
      _flags |= Constants.FLG_EFS;
      const _localHeader = {
        extraLen: 0
      };
      const uint32 = (val) => Math.max(0, val) >>> 0;
      const uint16 = (val) => Math.max(0, val) & 65535;
      const uint8 = (val) => Math.max(0, val) & 255;
      _time = Utils.fromDate2DOS(/* @__PURE__ */ new Date());
      return {
        get made() {
          return _verMade;
        },
        set made(val) {
          _verMade = val;
        },
        get version() {
          return _version;
        },
        set version(val) {
          _version = val;
        },
        get flags() {
          return _flags;
        },
        set flags(val) {
          _flags = val;
        },
        get flags_efs() {
          return (_flags & Constants.FLG_EFS) > 0;
        },
        set flags_efs(val) {
          if (val) {
            _flags |= Constants.FLG_EFS;
          } else {
            _flags &= ~Constants.FLG_EFS;
          }
        },
        get flags_desc() {
          return (_flags & Constants.FLG_DESC) > 0;
        },
        set flags_desc(val) {
          if (val) {
            _flags |= Constants.FLG_DESC;
          } else {
            _flags &= ~Constants.FLG_DESC;
          }
        },
        get method() {
          return _method;
        },
        set method(val) {
          switch (val) {
            case Constants.STORED:
              this.version = 10;
            case Constants.DEFLATED:
            default:
              this.version = 20;
          }
          _method = val;
        },
        get time() {
          return Utils.fromDOS2Date(this.timeval);
        },
        set time(val) {
          this.timeval = Utils.fromDate2DOS(val);
        },
        get timeval() {
          return _time;
        },
        set timeval(val) {
          _time = uint32(val);
        },
        get timeHighByte() {
          return uint8(_time >>> 8);
        },
        get crc() {
          return _crc;
        },
        set crc(val) {
          _crc = uint32(val);
        },
        get compressedSize() {
          return _compressedSize;
        },
        set compressedSize(val) {
          _compressedSize = uint32(val);
        },
        get size() {
          return _size;
        },
        set size(val) {
          _size = uint32(val);
        },
        get fileNameLength() {
          return _fnameLen;
        },
        set fileNameLength(val) {
          _fnameLen = val;
        },
        get extraLength() {
          return _extraLen;
        },
        set extraLength(val) {
          _extraLen = val;
        },
        get extraLocalLength() {
          return _localHeader.extraLen;
        },
        set extraLocalLength(val) {
          _localHeader.extraLen = val;
        },
        get commentLength() {
          return _comLen;
        },
        set commentLength(val) {
          _comLen = val;
        },
        get diskNumStart() {
          return _diskStart;
        },
        set diskNumStart(val) {
          _diskStart = uint32(val);
        },
        get inAttr() {
          return _inattr;
        },
        set inAttr(val) {
          _inattr = uint32(val);
        },
        get attr() {
          return _attr;
        },
        set attr(val) {
          _attr = uint32(val);
        },
        // get Unix file permissions
        get fileAttr() {
          return (_attr || 0) >> 16 & 4095;
        },
        get offset() {
          return _offset;
        },
        set offset(val) {
          _offset = uint32(val);
        },
        get encrypted() {
          return (_flags & Constants.FLG_ENC) === Constants.FLG_ENC;
        },
        get centralHeaderSize() {
          return Constants.CENHDR + _fnameLen + _extraLen + _comLen;
        },
        get realDataOffset() {
          return _offset + Constants.LOCHDR + _localHeader.fnameLen + _localHeader.extraLen;
        },
        get localHeader() {
          return _localHeader;
        },
        loadLocalHeaderFromBinary: function(input) {
          var data = input.slice(_offset, _offset + Constants.LOCHDR);
          if (data.readUInt32LE(0) !== Constants.LOCSIG) {
            throw Utils.Errors.INVALID_LOC();
          }
          _localHeader.version = data.readUInt16LE(Constants.LOCVER);
          _localHeader.flags = data.readUInt16LE(Constants.LOCFLG);
          _localHeader.method = data.readUInt16LE(Constants.LOCHOW);
          _localHeader.time = data.readUInt32LE(Constants.LOCTIM);
          _localHeader.crc = data.readUInt32LE(Constants.LOCCRC);
          _localHeader.compressedSize = data.readUInt32LE(Constants.LOCSIZ);
          _localHeader.size = data.readUInt32LE(Constants.LOCLEN);
          _localHeader.fnameLen = data.readUInt16LE(Constants.LOCNAM);
          _localHeader.extraLen = data.readUInt16LE(Constants.LOCEXT);
          const extraStart = _offset + Constants.LOCHDR + _localHeader.fnameLen;
          const extraEnd = extraStart + _localHeader.extraLen;
          return input.slice(extraStart, extraEnd);
        },
        loadFromBinary: function(data) {
          if (data.length !== Constants.CENHDR || data.readUInt32LE(0) !== Constants.CENSIG) {
            throw Utils.Errors.INVALID_CEN();
          }
          _verMade = data.readUInt16LE(Constants.CENVEM);
          _version = data.readUInt16LE(Constants.CENVER);
          _flags = data.readUInt16LE(Constants.CENFLG);
          _method = data.readUInt16LE(Constants.CENHOW);
          _time = data.readUInt32LE(Constants.CENTIM);
          _crc = data.readUInt32LE(Constants.CENCRC);
          _compressedSize = data.readUInt32LE(Constants.CENSIZ);
          _size = data.readUInt32LE(Constants.CENLEN);
          _fnameLen = data.readUInt16LE(Constants.CENNAM);
          _extraLen = data.readUInt16LE(Constants.CENEXT);
          _comLen = data.readUInt16LE(Constants.CENCOM);
          _diskStart = data.readUInt16LE(Constants.CENDSK);
          _inattr = data.readUInt16LE(Constants.CENATT);
          _attr = data.readUInt32LE(Constants.CENATX);
          _offset = data.readUInt32LE(Constants.CENOFF);
        },
        localHeaderToBinary: function() {
          var data = Buffer.alloc(Constants.LOCHDR);
          data.writeUInt32LE(Constants.LOCSIG, 0);
          data.writeUInt16LE(_version, Constants.LOCVER);
          data.writeUInt16LE(_flags, Constants.LOCFLG);
          data.writeUInt16LE(_method, Constants.LOCHOW);
          data.writeUInt32LE(_time, Constants.LOCTIM);
          data.writeUInt32LE(_crc, Constants.LOCCRC);
          data.writeUInt32LE(_compressedSize, Constants.LOCSIZ);
          data.writeUInt32LE(_size, Constants.LOCLEN);
          data.writeUInt16LE(_fnameLen, Constants.LOCNAM);
          data.writeUInt16LE(_localHeader.extraLen, Constants.LOCEXT);
          return data;
        },
        centralHeaderToBinary: function() {
          var data = Buffer.alloc(Constants.CENHDR + _fnameLen + _extraLen + _comLen);
          data.writeUInt32LE(Constants.CENSIG, 0);
          data.writeUInt16LE(_verMade, Constants.CENVEM);
          data.writeUInt16LE(_version, Constants.CENVER);
          data.writeUInt16LE(_flags, Constants.CENFLG);
          data.writeUInt16LE(_method, Constants.CENHOW);
          data.writeUInt32LE(_time, Constants.CENTIM);
          data.writeUInt32LE(_crc, Constants.CENCRC);
          data.writeUInt32LE(_compressedSize, Constants.CENSIZ);
          data.writeUInt32LE(_size, Constants.CENLEN);
          data.writeUInt16LE(_fnameLen, Constants.CENNAM);
          data.writeUInt16LE(_extraLen, Constants.CENEXT);
          data.writeUInt16LE(_comLen, Constants.CENCOM);
          data.writeUInt16LE(_diskStart, Constants.CENDSK);
          data.writeUInt16LE(_inattr, Constants.CENATT);
          data.writeUInt32LE(_attr, Constants.CENATX);
          data.writeUInt32LE(_offset, Constants.CENOFF);
          return data;
        },
        toJSON: function() {
          const bytes = function(nr) {
            return nr + " bytes";
          };
          return {
            made: _verMade,
            version: _version,
            flags: _flags,
            method: Utils.methodToString(_method),
            time: this.time,
            crc: "0x" + _crc.toString(16).toUpperCase(),
            compressedSize: bytes(_compressedSize),
            size: bytes(_size),
            fileNameLength: bytes(_fnameLen),
            extraLength: bytes(_extraLen),
            commentLength: bytes(_comLen),
            diskNumStart: _diskStart,
            inAttr: _inattr,
            attr: _attr,
            offset: _offset,
            centralHeaderSize: bytes(Constants.CENHDR + _fnameLen + _extraLen + _comLen)
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/headers/mainHeader.js
var require_mainHeader = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/headers/mainHeader.js"(exports, module) {
    var Utils = require_util();
    var Constants = Utils.Constants;
    module.exports = function() {
      var _volumeEntries = 0, _totalEntries = 0, _size = 0, _offset = 0, _commentLength = 0;
      return {
        get diskEntries() {
          return _volumeEntries;
        },
        set diskEntries(val) {
          _volumeEntries = _totalEntries = val;
        },
        get totalEntries() {
          return _totalEntries;
        },
        set totalEntries(val) {
          _totalEntries = _volumeEntries = val;
        },
        get size() {
          return _size;
        },
        set size(val) {
          _size = val;
        },
        get offset() {
          return _offset;
        },
        set offset(val) {
          _offset = val;
        },
        get commentLength() {
          return _commentLength;
        },
        set commentLength(val) {
          _commentLength = val;
        },
        get mainHeaderSize() {
          return Constants.ENDHDR + _commentLength;
        },
        loadFromBinary: function(data) {
          if ((data.length !== Constants.ENDHDR || data.readUInt32LE(0) !== Constants.ENDSIG) && (data.length < Constants.ZIP64HDR || data.readUInt32LE(0) !== Constants.ZIP64SIG)) {
            throw Utils.Errors.INVALID_END();
          }
          if (data.readUInt32LE(0) === Constants.ENDSIG) {
            _volumeEntries = data.readUInt16LE(Constants.ENDSUB);
            _totalEntries = data.readUInt16LE(Constants.ENDTOT);
            _size = data.readUInt32LE(Constants.ENDSIZ);
            _offset = data.readUInt32LE(Constants.ENDOFF);
            _commentLength = data.readUInt16LE(Constants.ENDCOM);
          } else {
            _volumeEntries = Utils.readBigUInt64LE(data, Constants.ZIP64SUB);
            _totalEntries = Utils.readBigUInt64LE(data, Constants.ZIP64TOT);
            _size = Utils.readBigUInt64LE(data, Constants.ZIP64SIZE);
            _offset = Utils.readBigUInt64LE(data, Constants.ZIP64OFF);
            _commentLength = 0;
          }
        },
        toBinary: function() {
          var b = Buffer.alloc(Constants.ENDHDR + _commentLength);
          b.writeUInt32LE(Constants.ENDSIG, 0);
          b.writeUInt32LE(0, 4);
          b.writeUInt16LE(_volumeEntries, Constants.ENDSUB);
          b.writeUInt16LE(_totalEntries, Constants.ENDTOT);
          b.writeUInt32LE(_size, Constants.ENDSIZ);
          b.writeUInt32LE(_offset, Constants.ENDOFF);
          b.writeUInt16LE(_commentLength, Constants.ENDCOM);
          b.fill(" ", Constants.ENDHDR);
          return b;
        },
        toJSON: function() {
          const offset = function(nr, len) {
            let offs = nr.toString(16).toUpperCase();
            while (offs.length < len) offs = "0" + offs;
            return "0x" + offs;
          };
          return {
            diskEntries: _volumeEntries,
            totalEntries: _totalEntries,
            size: _size + " bytes",
            offset: offset(_offset, 4),
            commentLength: _commentLength
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/headers/index.js
var require_headers = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/headers/index.js"(exports) {
    exports.EntryHeader = require_entryHeader();
    exports.MainHeader = require_mainHeader();
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/methods/deflater.js
var require_deflater = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/methods/deflater.js"(exports, module) {
    module.exports = function(inbuf) {
      var zlib = __require("zlib");
      var opts = { chunkSize: (parseInt(inbuf.length / 1024) + 1) * 1024 };
      return {
        deflate: function() {
          return zlib.deflateRawSync(inbuf, opts);
        },
        deflateAsync: function(callback) {
          var tmp = zlib.createDeflateRaw(opts), parts = [], total = 0;
          tmp.on("data", function(data) {
            parts.push(data);
            total += data.length;
          });
          tmp.on("end", function() {
            var buf = Buffer.alloc(total), written = 0;
            buf.fill(0);
            for (var i = 0; i < parts.length; i++) {
              var part = parts[i];
              part.copy(buf, written);
              written += part.length;
            }
            callback && callback(buf);
          });
          tmp.end(inbuf);
        }
      };
    };
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/methods/inflater.js
var require_inflater = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/methods/inflater.js"(exports, module) {
    var version = +(process.versions ? process.versions.node : "").split(".")[0] || 0;
    module.exports = function(inbuf, expectedLength) {
      var zlib = __require("zlib");
      const option = version >= 15 && expectedLength > 0 ? { maxOutputLength: expectedLength } : {};
      return {
        inflate: function() {
          return zlib.inflateRawSync(inbuf, option);
        },
        inflateAsync: function(callback) {
          var tmp = zlib.createInflateRaw(option), parts = [], total = 0;
          tmp.on("data", function(data) {
            parts.push(data);
            total += data.length;
          });
          tmp.on("end", function() {
            var buf = Buffer.alloc(total), written = 0;
            buf.fill(0);
            for (var i = 0; i < parts.length; i++) {
              var part = parts[i];
              part.copy(buf, written);
              written += part.length;
            }
            callback && callback(buf);
          });
          tmp.end(inbuf);
        }
      };
    };
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/methods/zipcrypto.js
var require_zipcrypto = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/methods/zipcrypto.js"(exports, module) {
    "use strict";
    var { randomFillSync } = __require("crypto");
    var Errors = require_errors();
    var crctable = new Uint32Array(256).map((t, crc) => {
      for (let j = 0; j < 8; j++) {
        if (0 !== (crc & 1)) {
          crc = crc >>> 1 ^ 3988292384;
        } else {
          crc >>>= 1;
        }
      }
      return crc >>> 0;
    });
    var uMul = (a, b) => Math.imul(a, b) >>> 0;
    var crc32update = (pCrc32, bval) => {
      return crctable[(pCrc32 ^ bval) & 255] ^ pCrc32 >>> 8;
    };
    var genSalt = () => {
      if ("function" === typeof randomFillSync) {
        return randomFillSync(Buffer.alloc(12));
      } else {
        return genSalt.node();
      }
    };
    genSalt.node = () => {
      const salt = Buffer.alloc(12);
      const len = salt.length;
      for (let i = 0; i < len; i++) salt[i] = Math.random() * 256 & 255;
      return salt;
    };
    var config = {
      genSalt
    };
    function Initkeys(pw) {
      const pass = Buffer.isBuffer(pw) ? pw : Buffer.from(pw);
      this.keys = new Uint32Array([305419896, 591751049, 878082192]);
      for (let i = 0; i < pass.length; i++) {
        this.updateKeys(pass[i]);
      }
    }
    Initkeys.prototype.updateKeys = function(byteValue) {
      const keys = this.keys;
      keys[0] = crc32update(keys[0], byteValue);
      keys[1] += keys[0] & 255;
      keys[1] = uMul(keys[1], 134775813) + 1;
      keys[2] = crc32update(keys[2], keys[1] >>> 24);
      return byteValue;
    };
    Initkeys.prototype.next = function() {
      const k = (this.keys[2] | 2) >>> 0;
      return uMul(k, k ^ 1) >> 8 & 255;
    };
    function make_decrypter(pwd) {
      const keys = new Initkeys(pwd);
      return function(data) {
        const result = Buffer.alloc(data.length);
        let pos = 0;
        for (let c of data) {
          result[pos++] = keys.updateKeys(c ^ keys.next());
        }
        return result;
      };
    }
    function make_encrypter(pwd) {
      const keys = new Initkeys(pwd);
      return function(data, result, pos = 0) {
        if (!result) result = Buffer.alloc(data.length);
        for (let c of data) {
          const k = keys.next();
          result[pos++] = c ^ k;
          keys.updateKeys(c);
        }
        return result;
      };
    }
    function decrypt(data, header, pwd) {
      if (!data || !Buffer.isBuffer(data) || data.length < 12) {
        return Buffer.alloc(0);
      }
      const decrypter = make_decrypter(pwd);
      const salt = decrypter(data.slice(0, 12));
      const verifyByte = (header.flags & 8) === 8 ? header.timeHighByte : header.crc >>> 24;
      if (salt[11] !== verifyByte) {
        throw Errors.WRONG_PASSWORD();
      }
      return decrypter(data.slice(12));
    }
    function _salter(data) {
      if (Buffer.isBuffer(data) && data.length >= 12) {
        config.genSalt = function() {
          return data.slice(0, 12);
        };
      } else if (data === "node") {
        config.genSalt = genSalt.node;
      } else {
        config.genSalt = genSalt;
      }
    }
    function encrypt(data, header, pwd, oldlike = false) {
      if (data == null) data = Buffer.alloc(0);
      if (!Buffer.isBuffer(data)) data = Buffer.from(data.toString());
      const encrypter = make_encrypter(pwd);
      const salt = config.genSalt();
      salt[11] = header.crc >>> 24 & 255;
      if (oldlike) salt[10] = header.crc >>> 16 & 255;
      const result = Buffer.alloc(data.length + 12);
      encrypter(salt, result);
      return encrypter(data, result, 12);
    }
    module.exports = { decrypt, encrypt, _salter };
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/methods/index.js
var require_methods = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/methods/index.js"(exports) {
    exports.Deflater = require_deflater();
    exports.Inflater = require_inflater();
    exports.ZipCrypto = require_zipcrypto();
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/zipEntry.js
var require_zipEntry = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/zipEntry.js"(exports, module) {
    var Utils = require_util();
    var Headers = require_headers();
    var Constants = Utils.Constants;
    var Methods = require_methods();
    module.exports = function(options, input) {
      var _centralHeader = new Headers.EntryHeader(), _entryName = Buffer.alloc(0), _comment = Buffer.alloc(0), _isDirectory = false, uncompressedData = null, _extra = Buffer.alloc(0), _extralocal = Buffer.alloc(0), _efs = true;
      const opts = options;
      const decoder = typeof opts.decoder === "object" ? opts.decoder : Utils.decoder;
      _efs = decoder.hasOwnProperty("efs") ? decoder.efs : false;
      function getCompressedDataFromZip() {
        if (!input || !(input instanceof Uint8Array)) {
          return Buffer.alloc(0);
        }
        _extralocal = _centralHeader.loadLocalHeaderFromBinary(input);
        return input.slice(_centralHeader.realDataOffset, _centralHeader.realDataOffset + _centralHeader.compressedSize);
      }
      function crc32OK(data) {
        if (!_centralHeader.flags_desc) {
          if (Utils.crc32(data) !== _centralHeader.localHeader.crc) {
            return false;
          }
        } else {
          const descriptor = {};
          const dataEndOffset = _centralHeader.realDataOffset + _centralHeader.compressedSize;
          if (input.readUInt32LE(dataEndOffset) == Constants.LOCSIG || input.readUInt32LE(dataEndOffset) == Constants.CENSIG) {
            throw Utils.Errors.DESCRIPTOR_NOT_EXIST();
          }
          if (input.readUInt32LE(dataEndOffset) == Constants.EXTSIG) {
            descriptor.crc = input.readUInt32LE(dataEndOffset + Constants.EXTCRC);
            descriptor.compressedSize = input.readUInt32LE(dataEndOffset + Constants.EXTSIZ);
            descriptor.size = input.readUInt32LE(dataEndOffset + Constants.EXTLEN);
          } else if (input.readUInt16LE(dataEndOffset + 12) === 19280) {
            descriptor.crc = input.readUInt32LE(dataEndOffset + Constants.EXTCRC - 4);
            descriptor.compressedSize = input.readUInt32LE(dataEndOffset + Constants.EXTSIZ - 4);
            descriptor.size = input.readUInt32LE(dataEndOffset + Constants.EXTLEN - 4);
          } else {
            throw Utils.Errors.DESCRIPTOR_UNKNOWN();
          }
          if (descriptor.compressedSize !== _centralHeader.compressedSize || descriptor.size !== _centralHeader.size || descriptor.crc !== _centralHeader.crc) {
            throw Utils.Errors.DESCRIPTOR_FAULTY();
          }
          if (Utils.crc32(data) !== descriptor.crc) {
            return false;
          }
        }
        return true;
      }
      function decompress(async, callback, pass) {
        if (typeof callback === "undefined" && typeof async === "string") {
          pass = async;
          async = void 0;
        }
        if (_isDirectory) {
          if (async && callback) {
            callback(Buffer.alloc(0), Utils.Errors.DIRECTORY_CONTENT_ERROR());
          }
          return Buffer.alloc(0);
        }
        var compressedData = getCompressedDataFromZip();
        if (compressedData.length === 0) {
          if (async && callback) callback(compressedData);
          return compressedData;
        }
        if (_centralHeader.encrypted) {
          if ("string" !== typeof pass && !Buffer.isBuffer(pass)) {
            throw Utils.Errors.INVALID_PASS_PARAM();
          }
          compressedData = Methods.ZipCrypto.decrypt(compressedData, _centralHeader, pass);
        }
        var data = Buffer.alloc(_centralHeader.size);
        switch (_centralHeader.method) {
          case Utils.Constants.STORED:
            compressedData.copy(data);
            if (!crc32OK(data)) {
              if (async && callback) callback(data, Utils.Errors.BAD_CRC());
              throw Utils.Errors.BAD_CRC();
            } else {
              if (async && callback) callback(data);
              return data;
            }
          case Utils.Constants.DEFLATED:
            var inflater = new Methods.Inflater(compressedData, _centralHeader.size);
            if (!async) {
              const result = inflater.inflate(data);
              result.copy(data, 0);
              if (!crc32OK(data)) {
                throw Utils.Errors.BAD_CRC(`"${decoder.decode(_entryName)}"`);
              }
              return data;
            } else {
              inflater.inflateAsync(function(result) {
                result.copy(result, 0);
                if (callback) {
                  if (!crc32OK(result)) {
                    callback(result, Utils.Errors.BAD_CRC());
                  } else {
                    callback(result);
                  }
                }
              });
            }
            break;
          default:
            if (async && callback) callback(Buffer.alloc(0), Utils.Errors.UNKNOWN_METHOD());
            throw Utils.Errors.UNKNOWN_METHOD();
        }
      }
      function compress(async, callback) {
        if ((!uncompressedData || !uncompressedData.length) && Buffer.isBuffer(input)) {
          if (async && callback) callback(getCompressedDataFromZip());
          return getCompressedDataFromZip();
        }
        if (uncompressedData.length && !_isDirectory) {
          var compressedData;
          switch (_centralHeader.method) {
            case Utils.Constants.STORED:
              _centralHeader.compressedSize = _centralHeader.size;
              compressedData = Buffer.alloc(uncompressedData.length);
              uncompressedData.copy(compressedData);
              if (async && callback) callback(compressedData);
              return compressedData;
            default:
            case Utils.Constants.DEFLATED:
              var deflater = new Methods.Deflater(uncompressedData);
              if (!async) {
                var deflated = deflater.deflate();
                _centralHeader.compressedSize = deflated.length;
                return deflated;
              } else {
                deflater.deflateAsync(function(data) {
                  compressedData = Buffer.alloc(data.length);
                  _centralHeader.compressedSize = data.length;
                  data.copy(compressedData);
                  callback && callback(compressedData);
                });
              }
              deflater = null;
              break;
          }
        } else if (async && callback) {
          callback(Buffer.alloc(0));
        } else {
          return Buffer.alloc(0);
        }
      }
      function readUInt64LE(buffer, offset) {
        return (buffer.readUInt32LE(offset + 4) << 4) + buffer.readUInt32LE(offset);
      }
      function parseExtra(data) {
        try {
          var offset = 0;
          var signature, size, part;
          while (offset + 4 < data.length) {
            signature = data.readUInt16LE(offset);
            offset += 2;
            size = data.readUInt16LE(offset);
            offset += 2;
            part = data.slice(offset, offset + size);
            offset += size;
            if (Constants.ID_ZIP64 === signature) {
              parseZip64ExtendedInformation(part);
            }
          }
        } catch (error) {
          throw Utils.Errors.EXTRA_FIELD_PARSE_ERROR();
        }
      }
      function parseZip64ExtendedInformation(data) {
        var size, compressedSize, offset, diskNumStart;
        if (data.length >= Constants.EF_ZIP64_SCOMP) {
          size = readUInt64LE(data, Constants.EF_ZIP64_SUNCOMP);
          if (_centralHeader.size === Constants.EF_ZIP64_OR_32) {
            _centralHeader.size = size;
          }
        }
        if (data.length >= Constants.EF_ZIP64_RHO) {
          compressedSize = readUInt64LE(data, Constants.EF_ZIP64_SCOMP);
          if (_centralHeader.compressedSize === Constants.EF_ZIP64_OR_32) {
            _centralHeader.compressedSize = compressedSize;
          }
        }
        if (data.length >= Constants.EF_ZIP64_DSN) {
          offset = readUInt64LE(data, Constants.EF_ZIP64_RHO);
          if (_centralHeader.offset === Constants.EF_ZIP64_OR_32) {
            _centralHeader.offset = offset;
          }
        }
        if (data.length >= Constants.EF_ZIP64_DSN + 4) {
          diskNumStart = data.readUInt32LE(Constants.EF_ZIP64_DSN);
          if (_centralHeader.diskNumStart === Constants.EF_ZIP64_OR_16) {
            _centralHeader.diskNumStart = diskNumStart;
          }
        }
      }
      return {
        get entryName() {
          return decoder.decode(_entryName);
        },
        get rawEntryName() {
          return _entryName;
        },
        set entryName(val) {
          _entryName = Utils.toBuffer(val, decoder.encode);
          var lastChar = _entryName[_entryName.length - 1];
          _isDirectory = lastChar === 47 || lastChar === 92;
          _centralHeader.fileNameLength = _entryName.length;
        },
        get efs() {
          if (typeof _efs === "function") {
            return _efs(this.entryName);
          } else {
            return _efs;
          }
        },
        get extra() {
          return _extra;
        },
        set extra(val) {
          _extra = val;
          _centralHeader.extraLength = val.length;
          parseExtra(val);
        },
        get comment() {
          return decoder.decode(_comment);
        },
        set comment(val) {
          _comment = Utils.toBuffer(val, decoder.encode);
          _centralHeader.commentLength = _comment.length;
          if (_comment.length > 65535) throw Utils.Errors.COMMENT_TOO_LONG();
        },
        get name() {
          var n = decoder.decode(_entryName);
          return _isDirectory ? n.substr(n.length - 1).split("/").pop() : n.split("/").pop();
        },
        get isDirectory() {
          return _isDirectory;
        },
        getCompressedData: function() {
          return compress(false, null);
        },
        getCompressedDataAsync: function(callback) {
          compress(true, callback);
        },
        setData: function(value) {
          uncompressedData = Utils.toBuffer(value, Utils.decoder.encode);
          if (!_isDirectory && uncompressedData.length) {
            _centralHeader.size = uncompressedData.length;
            _centralHeader.method = Utils.Constants.DEFLATED;
            _centralHeader.crc = Utils.crc32(value);
            _centralHeader.changed = true;
          } else {
            _centralHeader.method = Utils.Constants.STORED;
          }
        },
        getData: function(pass) {
          if (_centralHeader.changed) {
            return uncompressedData;
          } else {
            return decompress(false, null, pass);
          }
        },
        getDataAsync: function(callback, pass) {
          if (_centralHeader.changed) {
            callback(uncompressedData);
          } else {
            decompress(true, callback, pass);
          }
        },
        set attr(attr) {
          _centralHeader.attr = attr;
        },
        get attr() {
          return _centralHeader.attr;
        },
        set header(data) {
          _centralHeader.loadFromBinary(data);
        },
        get header() {
          return _centralHeader;
        },
        packCentralHeader: function() {
          _centralHeader.flags_efs = this.efs;
          _centralHeader.extraLength = _extra.length;
          var header = _centralHeader.centralHeaderToBinary();
          var addpos = Utils.Constants.CENHDR;
          _entryName.copy(header, addpos);
          addpos += _entryName.length;
          _extra.copy(header, addpos);
          addpos += _centralHeader.extraLength;
          _comment.copy(header, addpos);
          return header;
        },
        packLocalHeader: function() {
          let addpos = 0;
          _centralHeader.flags_efs = this.efs;
          _centralHeader.extraLocalLength = _extralocal.length;
          const localHeaderBuf = _centralHeader.localHeaderToBinary();
          const localHeader = Buffer.alloc(localHeaderBuf.length + _entryName.length + _centralHeader.extraLocalLength);
          localHeaderBuf.copy(localHeader, addpos);
          addpos += localHeaderBuf.length;
          _entryName.copy(localHeader, addpos);
          addpos += _entryName.length;
          _extralocal.copy(localHeader, addpos);
          addpos += _extralocal.length;
          return localHeader;
        },
        toJSON: function() {
          const bytes = function(nr) {
            return "<" + (nr && nr.length + " bytes buffer" || "null") + ">";
          };
          return {
            entryName: this.entryName,
            name: this.name,
            comment: this.comment,
            isDirectory: this.isDirectory,
            header: _centralHeader.toJSON(),
            compressedData: bytes(input),
            data: bytes(uncompressedData)
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/zipFile.js
var require_zipFile = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/zipFile.js"(exports, module) {
    var ZipEntry = require_zipEntry();
    var Headers = require_headers();
    var Utils = require_util();
    module.exports = function(inBuffer, options) {
      var entryList = [], entryTable = {}, _comment = Buffer.alloc(0), mainHeader = new Headers.MainHeader(), loadedEntries = false;
      var password = null;
      const temporary = /* @__PURE__ */ new Set();
      const opts = options;
      const { noSort, decoder } = opts;
      if (inBuffer) {
        readMainHeader(opts.readEntries);
      } else {
        loadedEntries = true;
      }
      function makeTemporaryFolders() {
        const foldersList = /* @__PURE__ */ new Set();
        for (const elem of Object.keys(entryTable)) {
          const elements = elem.split("/");
          elements.pop();
          if (!elements.length) continue;
          for (let i = 0; i < elements.length; i++) {
            const sub = elements.slice(0, i + 1).join("/") + "/";
            foldersList.add(sub);
          }
        }
        for (const elem of foldersList) {
          if (!(elem in entryTable)) {
            const tempfolder = new ZipEntry(opts);
            tempfolder.entryName = elem;
            tempfolder.attr = 16;
            tempfolder.temporary = true;
            entryList.push(tempfolder);
            entryTable[tempfolder.entryName] = tempfolder;
            temporary.add(tempfolder);
          }
        }
      }
      function readEntries() {
        loadedEntries = true;
        entryTable = {};
        if (mainHeader.diskEntries > (inBuffer.length - mainHeader.offset) / Utils.Constants.CENHDR) {
          throw Utils.Errors.DISK_ENTRY_TOO_LARGE();
        }
        entryList = new Array(mainHeader.diskEntries);
        var index = mainHeader.offset;
        for (var i = 0; i < entryList.length; i++) {
          var tmp = index, entry = new ZipEntry(opts, inBuffer);
          entry.header = inBuffer.slice(tmp, tmp += Utils.Constants.CENHDR);
          entry.entryName = inBuffer.slice(tmp, tmp += entry.header.fileNameLength);
          if (entry.header.extraLength) {
            entry.extra = inBuffer.slice(tmp, tmp += entry.header.extraLength);
          }
          if (entry.header.commentLength) entry.comment = inBuffer.slice(tmp, tmp + entry.header.commentLength);
          index += entry.header.centralHeaderSize;
          entryList[i] = entry;
          entryTable[entry.entryName] = entry;
        }
        temporary.clear();
        makeTemporaryFolders();
      }
      function readMainHeader(readNow) {
        var i = inBuffer.length - Utils.Constants.ENDHDR, max = Math.max(0, i - 65535), n = max, endStart = inBuffer.length, endOffset = -1, commentEnd = 0;
        const trailingSpace = typeof opts.trailingSpace === "boolean" ? opts.trailingSpace : false;
        if (trailingSpace) max = 0;
        for (i; i >= n; i--) {
          if (inBuffer[i] !== 80) continue;
          if (inBuffer.readUInt32LE(i) === Utils.Constants.ENDSIG) {
            endOffset = i;
            commentEnd = i;
            endStart = i + Utils.Constants.ENDHDR;
            n = i - Utils.Constants.END64HDR;
            continue;
          }
          if (inBuffer.readUInt32LE(i) === Utils.Constants.END64SIG) {
            n = max;
            continue;
          }
          if (inBuffer.readUInt32LE(i) === Utils.Constants.ZIP64SIG) {
            endOffset = i;
            endStart = i + Utils.readBigUInt64LE(inBuffer, i + Utils.Constants.ZIP64SIZE) + Utils.Constants.ZIP64LEAD;
            break;
          }
        }
        if (endOffset == -1) throw Utils.Errors.INVALID_FORMAT();
        mainHeader.loadFromBinary(inBuffer.slice(endOffset, endStart));
        if (mainHeader.commentLength) {
          _comment = inBuffer.slice(commentEnd + Utils.Constants.ENDHDR);
        }
        if (readNow) readEntries();
      }
      function sortEntries() {
        if (entryList.length > 1 && !noSort) {
          entryList.sort((a, b) => a.entryName.toLowerCase().localeCompare(b.entryName.toLowerCase()));
        }
      }
      return {
        /**
         * Returns an array of ZipEntry objects existent in the current opened archive
         * @return Array
         */
        get entries() {
          if (!loadedEntries) {
            readEntries();
          }
          return entryList.filter((e) => !temporary.has(e));
        },
        /**
         * Archive comment
         * @return {String}
         */
        get comment() {
          return decoder.decode(_comment);
        },
        set comment(val) {
          _comment = Utils.toBuffer(val, decoder.encode);
          mainHeader.commentLength = _comment.length;
        },
        getEntryCount: function() {
          if (!loadedEntries) {
            return mainHeader.diskEntries;
          }
          return entryList.length;
        },
        forEach: function(callback) {
          this.entries.forEach(callback);
        },
        /**
         * Returns a reference to the entry with the given name or null if entry is inexistent
         *
         * @param entryName
         * @return ZipEntry
         */
        getEntry: function(entryName) {
          if (!loadedEntries) {
            readEntries();
          }
          return entryTable[entryName] || null;
        },
        /**
         * Adds the given entry to the entry list
         *
         * @param entry
         */
        setEntry: function(entry) {
          if (!loadedEntries) {
            readEntries();
          }
          entryList.push(entry);
          entryTable[entry.entryName] = entry;
          mainHeader.totalEntries = entryList.length;
        },
        /**
         * Removes the file with the given name from the entry list.
         *
         * If the entry is a directory, then all nested files and directories will be removed
         * @param entryName
         * @returns {void}
         */
        deleteFile: function(entryName, withsubfolders = true) {
          if (!loadedEntries) {
            readEntries();
          }
          const entry = entryTable[entryName];
          const list = this.getEntryChildren(entry, withsubfolders).map((child) => child.entryName);
          list.forEach(this.deleteEntry);
        },
        /**
         * Removes the entry with the given name from the entry list.
         *
         * @param {string} entryName
         * @returns {void}
         */
        deleteEntry: function(entryName) {
          if (!loadedEntries) {
            readEntries();
          }
          const entry = entryTable[entryName];
          const index = entryList.indexOf(entry);
          if (index >= 0) {
            entryList.splice(index, 1);
            delete entryTable[entryName];
            mainHeader.totalEntries = entryList.length;
          }
        },
        /**
         *  Iterates and returns all nested files and directories of the given entry
         *
         * @param entry
         * @return Array
         */
        getEntryChildren: function(entry, subfolders = true) {
          if (!loadedEntries) {
            readEntries();
          }
          if (typeof entry === "object") {
            if (entry.isDirectory && subfolders) {
              const list = [];
              const name = entry.entryName;
              for (const zipEntry of entryList) {
                if (zipEntry.entryName.startsWith(name)) {
                  list.push(zipEntry);
                }
              }
              return list;
            } else {
              return [entry];
            }
          }
          return [];
        },
        /**
         *  How many child elements entry has
         *
         * @param {ZipEntry} entry
         * @return {integer}
         */
        getChildCount: function(entry) {
          if (entry && entry.isDirectory) {
            const list = this.getEntryChildren(entry);
            return list.includes(entry) ? list.length - 1 : list.length;
          }
          return 0;
        },
        /**
         * Returns the zip file
         *
         * @return Buffer
         */
        compressToBuffer: function() {
          if (!loadedEntries) {
            readEntries();
          }
          sortEntries();
          const dataBlock = [];
          const headerBlocks = [];
          let totalSize = 0;
          let dindex = 0;
          mainHeader.size = 0;
          mainHeader.offset = 0;
          let totalEntries = 0;
          for (const entry of this.entries) {
            const compressedData = entry.getCompressedData();
            entry.header.offset = dindex;
            const localHeader = entry.packLocalHeader();
            const dataLength = localHeader.length + compressedData.length;
            dindex += dataLength;
            dataBlock.push(localHeader);
            dataBlock.push(compressedData);
            const centralHeader = entry.packCentralHeader();
            headerBlocks.push(centralHeader);
            mainHeader.size += centralHeader.length;
            totalSize += dataLength + centralHeader.length;
            totalEntries++;
          }
          totalSize += mainHeader.mainHeaderSize;
          mainHeader.offset = dindex;
          mainHeader.totalEntries = totalEntries;
          dindex = 0;
          const outBuffer = Buffer.alloc(totalSize);
          for (const content of dataBlock) {
            content.copy(outBuffer, dindex);
            dindex += content.length;
          }
          for (const content of headerBlocks) {
            content.copy(outBuffer, dindex);
            dindex += content.length;
          }
          const mh = mainHeader.toBinary();
          if (_comment) {
            _comment.copy(mh, Utils.Constants.ENDHDR);
          }
          mh.copy(outBuffer, dindex);
          inBuffer = outBuffer;
          loadedEntries = false;
          return outBuffer;
        },
        toAsyncBuffer: function(onSuccess, onFail, onItemStart, onItemEnd) {
          try {
            if (!loadedEntries) {
              readEntries();
            }
            sortEntries();
            const dataBlock = [];
            const centralHeaders = [];
            let totalSize = 0;
            let dindex = 0;
            let totalEntries = 0;
            mainHeader.size = 0;
            mainHeader.offset = 0;
            const compress2Buffer = function(entryLists) {
              if (entryLists.length > 0) {
                const entry = entryLists.shift();
                const name = entry.entryName + entry.extra.toString();
                if (onItemStart) onItemStart(name);
                entry.getCompressedDataAsync(function(compressedData) {
                  if (onItemEnd) onItemEnd(name);
                  entry.header.offset = dindex;
                  const localHeader = entry.packLocalHeader();
                  const dataLength = localHeader.length + compressedData.length;
                  dindex += dataLength;
                  dataBlock.push(localHeader);
                  dataBlock.push(compressedData);
                  const centalHeader = entry.packCentralHeader();
                  centralHeaders.push(centalHeader);
                  mainHeader.size += centalHeader.length;
                  totalSize += dataLength + centalHeader.length;
                  totalEntries++;
                  compress2Buffer(entryLists);
                });
              } else {
                totalSize += mainHeader.mainHeaderSize;
                mainHeader.offset = dindex;
                mainHeader.totalEntries = totalEntries;
                dindex = 0;
                const outBuffer = Buffer.alloc(totalSize);
                dataBlock.forEach(function(content) {
                  content.copy(outBuffer, dindex);
                  dindex += content.length;
                });
                centralHeaders.forEach(function(content) {
                  content.copy(outBuffer, dindex);
                  dindex += content.length;
                });
                const mh = mainHeader.toBinary();
                if (_comment) {
                  _comment.copy(mh, Utils.Constants.ENDHDR);
                }
                mh.copy(outBuffer, dindex);
                inBuffer = outBuffer;
                loadedEntries = false;
                onSuccess(outBuffer);
              }
            };
            compress2Buffer(Array.from(this.entries));
          } catch (e) {
            onFail(e);
          }
        }
      };
    };
  }
});

// ../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/adm-zip.js
var require_adm_zip = __commonJS({
  "../../node_modules/.pnpm/adm-zip@0.5.16/node_modules/adm-zip/adm-zip.js"(exports, module) {
    var Utils = require_util();
    var pth = __require("path");
    var ZipEntry = require_zipEntry();
    var ZipFile = require_zipFile();
    var get_Bool = (...val) => Utils.findLast(val, (c) => typeof c === "boolean");
    var get_Str = (...val) => Utils.findLast(val, (c) => typeof c === "string");
    var get_Fun = (...val) => Utils.findLast(val, (c) => typeof c === "function");
    var defaultOptions = {
      // option "noSort" : if true it disables files sorting
      noSort: false,
      // read entries during load (initial loading may be slower)
      readEntries: false,
      // default method is none
      method: Utils.Constants.NONE,
      // file system
      fs: null
    };
    module.exports = function(input, options) {
      let inBuffer = null;
      const opts = Object.assign(/* @__PURE__ */ Object.create(null), defaultOptions);
      if (input && "object" === typeof input) {
        if (!(input instanceof Uint8Array)) {
          Object.assign(opts, input);
          input = opts.input ? opts.input : void 0;
          if (opts.input) delete opts.input;
        }
        if (Buffer.isBuffer(input)) {
          inBuffer = input;
          opts.method = Utils.Constants.BUFFER;
          input = void 0;
        }
      }
      Object.assign(opts, options);
      const filetools = new Utils(opts);
      if (typeof opts.decoder !== "object" || typeof opts.decoder.encode !== "function" || typeof opts.decoder.decode !== "function") {
        opts.decoder = Utils.decoder;
      }
      if (input && "string" === typeof input) {
        if (filetools.fs.existsSync(input)) {
          opts.method = Utils.Constants.FILE;
          opts.filename = input;
          inBuffer = filetools.fs.readFileSync(input);
        } else {
          throw Utils.Errors.INVALID_FILENAME();
        }
      }
      const _zip = new ZipFile(inBuffer, opts);
      const { canonical, sanitize, zipnamefix } = Utils;
      function getEntry(entry) {
        if (entry && _zip) {
          var item;
          if (typeof entry === "string") item = _zip.getEntry(pth.posix.normalize(entry));
          if (typeof entry === "object" && typeof entry.entryName !== "undefined" && typeof entry.header !== "undefined") item = _zip.getEntry(entry.entryName);
          if (item) {
            return item;
          }
        }
        return null;
      }
      function fixPath(zipPath) {
        const { join: join3, normalize, sep } = pth.posix;
        return join3(".", normalize(sep + zipPath.split("\\").join(sep) + sep));
      }
      function filenameFilter(filterfn) {
        if (filterfn instanceof RegExp) {
          return /* @__PURE__ */ (function(rx) {
            return function(filename) {
              return rx.test(filename);
            };
          })(filterfn);
        } else if ("function" !== typeof filterfn) {
          return () => true;
        }
        return filterfn;
      }
      const relativePath = (local, entry) => {
        let lastChar = entry.slice(-1);
        lastChar = lastChar === filetools.sep ? filetools.sep : "";
        return pth.relative(local, entry) + lastChar;
      };
      return {
        /**
         * Extracts the given entry from the archive and returns the content as a Buffer object
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @param {Buffer|string} [pass] - password
         * @return Buffer or Null in case of error
         */
        readFile: function(entry, pass) {
          var item = getEntry(entry);
          return item && item.getData(pass) || null;
        },
        /**
         * Returns how many child elements has on entry (directories) on files it is always 0
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @returns {integer}
         */
        childCount: function(entry) {
          const item = getEntry(entry);
          if (item) {
            return _zip.getChildCount(item);
          }
        },
        /**
         * Asynchronous readFile
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @param {callback} callback
         *
         * @return Buffer or Null in case of error
         */
        readFileAsync: function(entry, callback) {
          var item = getEntry(entry);
          if (item) {
            item.getDataAsync(callback);
          } else {
            callback(null, "getEntry failed for:" + entry);
          }
        },
        /**
         * Extracts the given entry from the archive and returns the content as plain text in the given encoding
         * @param {ZipEntry|string} entry - ZipEntry object or String with the full path of the entry
         * @param {string} encoding - Optional. If no encoding is specified utf8 is used
         *
         * @return String
         */
        readAsText: function(entry, encoding) {
          var item = getEntry(entry);
          if (item) {
            var data = item.getData();
            if (data && data.length) {
              return data.toString(encoding || "utf8");
            }
          }
          return "";
        },
        /**
         * Asynchronous readAsText
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @param {callback} callback
         * @param {string} [encoding] - Optional. If no encoding is specified utf8 is used
         *
         * @return String
         */
        readAsTextAsync: function(entry, callback, encoding) {
          var item = getEntry(entry);
          if (item) {
            item.getDataAsync(function(data, err) {
              if (err) {
                callback(data, err);
                return;
              }
              if (data && data.length) {
                callback(data.toString(encoding || "utf8"));
              } else {
                callback("");
              }
            });
          } else {
            callback("");
          }
        },
        /**
         * Remove the entry from the file or the entry and all it's nested directories and files if the given entry is a directory
         *
         * @param {ZipEntry|string} entry
         * @returns {void}
         */
        deleteFile: function(entry, withsubfolders = true) {
          var item = getEntry(entry);
          if (item) {
            _zip.deleteFile(item.entryName, withsubfolders);
          }
        },
        /**
         * Remove the entry from the file or directory without affecting any nested entries
         *
         * @param {ZipEntry|string} entry
         * @returns {void}
         */
        deleteEntry: function(entry) {
          var item = getEntry(entry);
          if (item) {
            _zip.deleteEntry(item.entryName);
          }
        },
        /**
         * Adds a comment to the zip. The zip must be rewritten after adding the comment.
         *
         * @param {string} comment
         */
        addZipComment: function(comment) {
          _zip.comment = comment;
        },
        /**
         * Returns the zip comment
         *
         * @return String
         */
        getZipComment: function() {
          return _zip.comment || "";
        },
        /**
         * Adds a comment to a specified zipEntry. The zip must be rewritten after adding the comment
         * The comment cannot exceed 65535 characters in length
         *
         * @param {ZipEntry} entry
         * @param {string} comment
         */
        addZipEntryComment: function(entry, comment) {
          var item = getEntry(entry);
          if (item) {
            item.comment = comment;
          }
        },
        /**
         * Returns the comment of the specified entry
         *
         * @param {ZipEntry} entry
         * @return String
         */
        getZipEntryComment: function(entry) {
          var item = getEntry(entry);
          if (item) {
            return item.comment || "";
          }
          return "";
        },
        /**
         * Updates the content of an existing entry inside the archive. The zip must be rewritten after updating the content
         *
         * @param {ZipEntry} entry
         * @param {Buffer} content
         */
        updateFile: function(entry, content) {
          var item = getEntry(entry);
          if (item) {
            item.setData(content);
          }
        },
        /**
         * Adds a file from the disk to the archive
         *
         * @param {string} localPath File to add to zip
         * @param {string} [zipPath] Optional path inside the zip
         * @param {string} [zipName] Optional name for the file
         * @param {string} [comment] Optional file comment
         */
        addLocalFile: function(localPath2, zipPath, zipName, comment) {
          if (filetools.fs.existsSync(localPath2)) {
            zipPath = zipPath ? fixPath(zipPath) : "";
            const p = pth.win32.basename(pth.win32.normalize(localPath2));
            zipPath += zipName ? zipName : p;
            const _attr = filetools.fs.statSync(localPath2);
            const data = _attr.isFile() ? filetools.fs.readFileSync(localPath2) : Buffer.alloc(0);
            if (_attr.isDirectory()) zipPath += filetools.sep;
            this.addFile(zipPath, data, comment, _attr);
          } else {
            throw Utils.Errors.FILE_NOT_FOUND(localPath2);
          }
        },
        /**
         * Callback for showing if everything was done.
         *
         * @callback doneCallback
         * @param {Error} err - Error object
         * @param {boolean} done - was request fully completed
         */
        /**
         * Adds a file from the disk to the archive
         *
         * @param {(object|string)} options - options object, if it is string it us used as localPath.
         * @param {string} options.localPath - Local path to the file.
         * @param {string} [options.comment] - Optional file comment.
         * @param {string} [options.zipPath] - Optional path inside the zip
         * @param {string} [options.zipName] - Optional name for the file
         * @param {doneCallback} callback - The callback that handles the response.
         */
        addLocalFileAsync: function(options2, callback) {
          options2 = typeof options2 === "object" ? options2 : { localPath: options2 };
          const localPath2 = pth.resolve(options2.localPath);
          const { comment } = options2;
          let { zipPath, zipName } = options2;
          const self = this;
          filetools.fs.stat(localPath2, function(err, stats) {
            if (err) return callback(err, false);
            zipPath = zipPath ? fixPath(zipPath) : "";
            const p = pth.win32.basename(pth.win32.normalize(localPath2));
            zipPath += zipName ? zipName : p;
            if (stats.isFile()) {
              filetools.fs.readFile(localPath2, function(err2, data) {
                if (err2) return callback(err2, false);
                self.addFile(zipPath, data, comment, stats);
                return setImmediate(callback, void 0, true);
              });
            } else if (stats.isDirectory()) {
              zipPath += filetools.sep;
              self.addFile(zipPath, Buffer.alloc(0), comment, stats);
              return setImmediate(callback, void 0, true);
            }
          });
        },
        /**
         * Adds a local directory and all its nested files and directories to the archive
         *
         * @param {string} localPath - local path to the folder
         * @param {string} [zipPath] - optional path inside zip
         * @param {(RegExp|function)} [filter] - optional RegExp or Function if files match will be included.
         */
        addLocalFolder: function(localPath2, zipPath, filter) {
          filter = filenameFilter(filter);
          zipPath = zipPath ? fixPath(zipPath) : "";
          localPath2 = pth.normalize(localPath2);
          if (filetools.fs.existsSync(localPath2)) {
            const items = filetools.findFiles(localPath2);
            const self = this;
            if (items.length) {
              for (const filepath of items) {
                const p = pth.join(zipPath, relativePath(localPath2, filepath));
                if (filter(p)) {
                  self.addLocalFile(filepath, pth.dirname(p));
                }
              }
            }
          } else {
            throw Utils.Errors.FILE_NOT_FOUND(localPath2);
          }
        },
        /**
         * Asynchronous addLocalFolder
         * @param {string} localPath
         * @param {callback} callback
         * @param {string} [zipPath] optional path inside zip
         * @param {RegExp|function} [filter] optional RegExp or Function if files match will
         *               be included.
         */
        addLocalFolderAsync: function(localPath2, callback, zipPath, filter) {
          filter = filenameFilter(filter);
          zipPath = zipPath ? fixPath(zipPath) : "";
          localPath2 = pth.normalize(localPath2);
          var self = this;
          filetools.fs.open(localPath2, "r", function(err) {
            if (err && err.code === "ENOENT") {
              callback(void 0, Utils.Errors.FILE_NOT_FOUND(localPath2));
            } else if (err) {
              callback(void 0, err);
            } else {
              var items = filetools.findFiles(localPath2);
              var i = -1;
              var next = function() {
                i += 1;
                if (i < items.length) {
                  var filepath = items[i];
                  var p = relativePath(localPath2, filepath).split("\\").join("/");
                  p = p.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "");
                  if (filter(p)) {
                    filetools.fs.stat(filepath, function(er0, stats) {
                      if (er0) callback(void 0, er0);
                      if (stats.isFile()) {
                        filetools.fs.readFile(filepath, function(er1, data) {
                          if (er1) {
                            callback(void 0, er1);
                          } else {
                            self.addFile(zipPath + p, data, "", stats);
                            next();
                          }
                        });
                      } else {
                        self.addFile(zipPath + p + "/", Buffer.alloc(0), "", stats);
                        next();
                      }
                    });
                  } else {
                    process.nextTick(() => {
                      next();
                    });
                  }
                } else {
                  callback(true, void 0);
                }
              };
              next();
            }
          });
        },
        /**
         * Adds a local directory and all its nested files and directories to the archive
         *
         * @param {object | string} options - options object, if it is string it us used as localPath.
         * @param {string} options.localPath - Local path to the folder.
         * @param {string} [options.zipPath] - optional path inside zip.
         * @param {RegExp|function} [options.filter] - optional RegExp or Function if files match will be included.
         * @param {function|string} [options.namefix] - optional function to help fix filename
         * @param {doneCallback} callback - The callback that handles the response.
         *
         */
        addLocalFolderAsync2: function(options2, callback) {
          const self = this;
          options2 = typeof options2 === "object" ? options2 : { localPath: options2 };
          localPath = pth.resolve(fixPath(options2.localPath));
          let { zipPath, filter, namefix } = options2;
          if (filter instanceof RegExp) {
            filter = /* @__PURE__ */ (function(rx) {
              return function(filename) {
                return rx.test(filename);
              };
            })(filter);
          } else if ("function" !== typeof filter) {
            filter = function() {
              return true;
            };
          }
          zipPath = zipPath ? fixPath(zipPath) : "";
          if (namefix == "latin1") {
            namefix = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "");
          }
          if (typeof namefix !== "function") namefix = (str) => str;
          const relPathFix = (entry) => pth.join(zipPath, namefix(relativePath(localPath, entry)));
          const fileNameFix = (entry) => pth.win32.basename(pth.win32.normalize(namefix(entry)));
          filetools.fs.open(localPath, "r", function(err) {
            if (err && err.code === "ENOENT") {
              callback(void 0, Utils.Errors.FILE_NOT_FOUND(localPath));
            } else if (err) {
              callback(void 0, err);
            } else {
              filetools.findFilesAsync(localPath, function(err2, fileEntries) {
                if (err2) return callback(err2);
                fileEntries = fileEntries.filter((dir) => filter(relPathFix(dir)));
                if (!fileEntries.length) callback(void 0, false);
                setImmediate(
                  fileEntries.reverse().reduce(function(next, entry) {
                    return function(err3, done) {
                      if (err3 || done === false) return setImmediate(next, err3, false);
                      self.addLocalFileAsync(
                        {
                          localPath: entry,
                          zipPath: pth.dirname(relPathFix(entry)),
                          zipName: fileNameFix(entry)
                        },
                        next
                      );
                    };
                  }, callback)
                );
              });
            }
          });
        },
        /**
         * Adds a local directory and all its nested files and directories to the archive
         *
         * @param {string} localPath - path where files will be extracted
         * @param {object} props - optional properties
         * @param {string} [props.zipPath] - optional path inside zip
         * @param {RegExp|function} [props.filter] - optional RegExp or Function if files match will be included.
         * @param {function|string} [props.namefix] - optional function to help fix filename
         */
        addLocalFolderPromise: function(localPath2, props) {
          return new Promise((resolve3, reject) => {
            this.addLocalFolderAsync2(Object.assign({ localPath: localPath2 }, props), (err, done) => {
              if (err) reject(err);
              if (done) resolve3(this);
            });
          });
        },
        /**
         * Allows you to create a entry (file or directory) in the zip file.
         * If you want to create a directory the entryName must end in / and a null buffer should be provided.
         * Comment and attributes are optional
         *
         * @param {string} entryName
         * @param {Buffer | string} content - file content as buffer or utf8 coded string
         * @param {string} [comment] - file comment
         * @param {number | object} [attr] - number as unix file permissions, object as filesystem Stats object
         */
        addFile: function(entryName, content, comment, attr) {
          entryName = zipnamefix(entryName);
          let entry = getEntry(entryName);
          const update = entry != null;
          if (!update) {
            entry = new ZipEntry(opts);
            entry.entryName = entryName;
          }
          entry.comment = comment || "";
          const isStat = "object" === typeof attr && attr instanceof filetools.fs.Stats;
          if (isStat) {
            entry.header.time = attr.mtime;
          }
          var fileattr = entry.isDirectory ? 16 : 0;
          let unix = entry.isDirectory ? 16384 : 32768;
          if (isStat) {
            unix |= 4095 & attr.mode;
          } else if ("number" === typeof attr) {
            unix |= 4095 & attr;
          } else {
            unix |= entry.isDirectory ? 493 : 420;
          }
          fileattr = (fileattr | unix << 16) >>> 0;
          entry.attr = fileattr;
          entry.setData(content);
          if (!update) _zip.setEntry(entry);
          return entry;
        },
        /**
         * Returns an array of ZipEntry objects representing the files and folders inside the archive
         *
         * @param {string} [password]
         * @returns Array
         */
        getEntries: function(password) {
          _zip.password = password;
          return _zip ? _zip.entries : [];
        },
        /**
         * Returns a ZipEntry object representing the file or folder specified by ``name``.
         *
         * @param {string} name
         * @return ZipEntry
         */
        getEntry: function(name) {
          return getEntry(name);
        },
        getEntryCount: function() {
          return _zip.getEntryCount();
        },
        forEach: function(callback) {
          return _zip.forEach(callback);
        },
        /**
         * Extracts the given entry to the given targetPath
         * If the entry is a directory inside the archive, the entire directory and it's subdirectories will be extracted
         *
         * @param {string|ZipEntry} entry - ZipEntry object or String with the full path of the entry
         * @param {string} targetPath - Target folder where to write the file
         * @param {boolean} [maintainEntryPath=true] - If maintainEntryPath is true and the entry is inside a folder, the entry folder will be created in targetPath as well. Default is TRUE
         * @param {boolean} [overwrite=false] - If the file already exists at the target path, the file will be overwriten if this is true.
         * @param {boolean} [keepOriginalPermission=false] - The file will be set as the permission from the entry if this is true.
         * @param {string} [outFileName] - String If set will override the filename of the extracted file (Only works if the entry is a file)
         *
         * @return Boolean
         */
        extractEntryTo: function(entry, targetPath, maintainEntryPath, overwrite, keepOriginalPermission, outFileName) {
          overwrite = get_Bool(false, overwrite);
          keepOriginalPermission = get_Bool(false, keepOriginalPermission);
          maintainEntryPath = get_Bool(true, maintainEntryPath);
          outFileName = get_Str(keepOriginalPermission, outFileName);
          var item = getEntry(entry);
          if (!item) {
            throw Utils.Errors.NO_ENTRY();
          }
          var entryName = canonical(item.entryName);
          var target = sanitize(targetPath, outFileName && !item.isDirectory ? outFileName : maintainEntryPath ? entryName : pth.basename(entryName));
          if (item.isDirectory) {
            var children = _zip.getEntryChildren(item);
            children.forEach(function(child) {
              if (child.isDirectory) return;
              var content2 = child.getData();
              if (!content2) {
                throw Utils.Errors.CANT_EXTRACT_FILE();
              }
              var name = canonical(child.entryName);
              var childName = sanitize(targetPath, maintainEntryPath ? name : pth.basename(name));
              const fileAttr2 = keepOriginalPermission ? child.header.fileAttr : void 0;
              filetools.writeFileTo(childName, content2, overwrite, fileAttr2);
            });
            return true;
          }
          var content = item.getData(_zip.password);
          if (!content) throw Utils.Errors.CANT_EXTRACT_FILE();
          if (filetools.fs.existsSync(target) && !overwrite) {
            throw Utils.Errors.CANT_OVERRIDE();
          }
          const fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
          filetools.writeFileTo(target, content, overwrite, fileAttr);
          return true;
        },
        /**
         * Test the archive
         * @param {string} [pass]
         */
        test: function(pass) {
          if (!_zip) {
            return false;
          }
          for (var entry in _zip.entries) {
            try {
              if (entry.isDirectory) {
                continue;
              }
              var content = _zip.entries[entry].getData(pass);
              if (!content) {
                return false;
              }
            } catch (err) {
              return false;
            }
          }
          return true;
        },
        /**
         * Extracts the entire archive to the given location
         *
         * @param {string} targetPath Target location
         * @param {boolean} [overwrite=false] If the file already exists at the target path, the file will be overwriten if this is true.
         *                  Default is FALSE
         * @param {boolean} [keepOriginalPermission=false] The file will be set as the permission from the entry if this is true.
         *                  Default is FALSE
         * @param {string|Buffer} [pass] password
         */
        extractAllTo: function(targetPath, overwrite, keepOriginalPermission, pass) {
          keepOriginalPermission = get_Bool(false, keepOriginalPermission);
          pass = get_Str(keepOriginalPermission, pass);
          overwrite = get_Bool(false, overwrite);
          if (!_zip) throw Utils.Errors.NO_ZIP();
          _zip.entries.forEach(function(entry) {
            var entryName = sanitize(targetPath, canonical(entry.entryName));
            if (entry.isDirectory) {
              filetools.makeDir(entryName);
              return;
            }
            var content = entry.getData(pass);
            if (!content) {
              throw Utils.Errors.CANT_EXTRACT_FILE();
            }
            const fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
            filetools.writeFileTo(entryName, content, overwrite, fileAttr);
            try {
              filetools.fs.utimesSync(entryName, entry.header.time, entry.header.time);
            } catch (err) {
              throw Utils.Errors.CANT_EXTRACT_FILE();
            }
          });
        },
        /**
         * Asynchronous extractAllTo
         *
         * @param {string} targetPath Target location
         * @param {boolean} [overwrite=false] If the file already exists at the target path, the file will be overwriten if this is true.
         *                  Default is FALSE
         * @param {boolean} [keepOriginalPermission=false] The file will be set as the permission from the entry if this is true.
         *                  Default is FALSE
         * @param {function} callback The callback will be executed when all entries are extracted successfully or any error is thrown.
         */
        extractAllToAsync: function(targetPath, overwrite, keepOriginalPermission, callback) {
          callback = get_Fun(overwrite, keepOriginalPermission, callback);
          keepOriginalPermission = get_Bool(false, keepOriginalPermission);
          overwrite = get_Bool(false, overwrite);
          if (!callback) {
            return new Promise((resolve3, reject) => {
              this.extractAllToAsync(targetPath, overwrite, keepOriginalPermission, function(err) {
                if (err) {
                  reject(err);
                } else {
                  resolve3(this);
                }
              });
            });
          }
          if (!_zip) {
            callback(Utils.Errors.NO_ZIP());
            return;
          }
          targetPath = pth.resolve(targetPath);
          const getPath = (entry) => sanitize(targetPath, pth.normalize(canonical(entry.entryName)));
          const getError = (msg, file) => new Error(msg + ': "' + file + '"');
          const dirEntries = [];
          const fileEntries = [];
          _zip.entries.forEach((e) => {
            if (e.isDirectory) {
              dirEntries.push(e);
            } else {
              fileEntries.push(e);
            }
          });
          for (const entry of dirEntries) {
            const dirPath = getPath(entry);
            const dirAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
            try {
              filetools.makeDir(dirPath);
              if (dirAttr) filetools.fs.chmodSync(dirPath, dirAttr);
              filetools.fs.utimesSync(dirPath, entry.header.time, entry.header.time);
            } catch (er) {
              callback(getError("Unable to create folder", dirPath));
            }
          }
          fileEntries.reverse().reduce(function(next, entry) {
            return function(err) {
              if (err) {
                next(err);
              } else {
                const entryName = pth.normalize(canonical(entry.entryName));
                const filePath = sanitize(targetPath, entryName);
                entry.getDataAsync(function(content, err_1) {
                  if (err_1) {
                    next(err_1);
                  } else if (!content) {
                    next(Utils.Errors.CANT_EXTRACT_FILE());
                  } else {
                    const fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
                    filetools.writeFileToAsync(filePath, content, overwrite, fileAttr, function(succ) {
                      if (!succ) {
                        next(getError("Unable to write file", filePath));
                      }
                      filetools.fs.utimes(filePath, entry.header.time, entry.header.time, function(err_2) {
                        if (err_2) {
                          next(getError("Unable to set times", filePath));
                        } else {
                          next();
                        }
                      });
                    });
                  }
                });
              }
            };
          }, callback)();
        },
        /**
         * Writes the newly created zip file to disk at the specified location or if a zip was opened and no ``targetFileName`` is provided, it will overwrite the opened zip
         *
         * @param {string} targetFileName
         * @param {function} callback
         */
        writeZip: function(targetFileName, callback) {
          if (arguments.length === 1) {
            if (typeof targetFileName === "function") {
              callback = targetFileName;
              targetFileName = "";
            }
          }
          if (!targetFileName && opts.filename) {
            targetFileName = opts.filename;
          }
          if (!targetFileName) return;
          var zipData = _zip.compressToBuffer();
          if (zipData) {
            var ok = filetools.writeFileTo(targetFileName, zipData, true);
            if (typeof callback === "function") callback(!ok ? new Error("failed") : null, "");
          }
        },
        /**
                 *
                 * @param {string} targetFileName
                 * @param {object} [props]
                 * @param {boolean} [props.overwrite=true] If the file already exists at the target path, the file will be overwriten if this is true.
                 * @param {boolean} [props.perm] The file will be set as the permission from the entry if this is true.
        
                 * @returns {Promise<void>}
                 */
        writeZipPromise: function(targetFileName, props) {
          const { overwrite, perm } = Object.assign({ overwrite: true }, props);
          return new Promise((resolve3, reject) => {
            if (!targetFileName && opts.filename) targetFileName = opts.filename;
            if (!targetFileName) reject("ADM-ZIP: ZIP File Name Missing");
            this.toBufferPromise().then((zipData) => {
              const ret = (done) => done ? resolve3(done) : reject("ADM-ZIP: Wasn't able to write zip file");
              filetools.writeFileToAsync(targetFileName, zipData, overwrite, perm, ret);
            }, reject);
          });
        },
        /**
         * @returns {Promise<Buffer>} A promise to the Buffer.
         */
        toBufferPromise: function() {
          return new Promise((resolve3, reject) => {
            _zip.toAsyncBuffer(resolve3, reject);
          });
        },
        /**
         * Returns the content of the entire zip file as a Buffer object
         *
         * @prop {function} [onSuccess]
         * @prop {function} [onFail]
         * @prop {function} [onItemStart]
         * @prop {function} [onItemEnd]
         * @returns {Buffer}
         */
        toBuffer: function(onSuccess, onFail, onItemStart, onItemEnd) {
          if (typeof onSuccess === "function") {
            _zip.toAsyncBuffer(onSuccess, onFail, onItemStart, onItemEnd);
            return null;
          }
          return _zip.compressToBuffer();
        }
      };
    };
  }
});

// src/bin/dev-host.ts
import { fileURLToPath } from "node:url";
import { resolve as resolve2, dirname as dirname2 } from "node:path";
import { mkdirSync as mkdirSync2 } from "node:fs";

// ../../node_modules/.pnpm/ws@8.19.0/node_modules/ws/wrapper.mjs
var import_stream = __toESM(require_stream(), 1);
var import_receiver = __toESM(require_receiver(), 1);
var import_sender = __toESM(require_sender(), 1);
var import_websocket = __toESM(require_websocket(), 1);
var import_websocket_server = __toESM(require_websocket_server(), 1);

// ../core/dist/ws-server.js
function createWsServer(options = {}) {
  const { port = 0, server, heartbeatInterval = 3e4 } = options;
  const clients = /* @__PURE__ */ new Set();
  const listeners = {};
  let heartbeatTimer = null;
  let listeningPort = 0;
  let wss;
  let onReady;
  let onError;
  const readyPromise = new Promise((resolve3, reject) => {
    onReady = resolve3;
    onError = reject;
  });
  if (server) {
    wss = new import_websocket_server.default({ server });
    listeningPort = port;
    onReady();
  } else {
    wss = new import_websocket_server.default({ port }, () => {
      const addr = wss.address();
      if (typeof addr === "object" && addr) {
        listeningPort = addr.port;
      }
      onReady();
    });
    wss.on("error", (err) => {
      onError(err);
    });
  }
  wss.on("connection", (ws, _req) => {
    clients.add(ws);
    emit("connection");
    ws.on("message", (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === "ping") {
          ws.send(JSON.stringify({
            type: "pong",
            payload: {},
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }));
        }
      } catch {
      }
    });
    ws.on("ping", () => {
      ws.pong();
    });
    ws.on("close", () => {
      clients.delete(ws);
      emit("disconnection");
    });
    ws.on("error", () => {
      clients.delete(ws);
    });
  });
  if (heartbeatInterval > 0) {
    heartbeatTimer = setInterval(() => {
      for (const client of clients) {
        if (client.readyState === import_websocket.default.OPEN) {
          client.ping();
        }
      }
    }, heartbeatInterval);
  }
  function emit(event) {
    const handlers = listeners[event];
    if (handlers) {
      for (const handler of handlers) {
        handler();
      }
    }
  }
  return {
    get clientCount() {
      return clients.size;
    },
    get port() {
      return listeningPort;
    },
    ready() {
      return readyPromise;
    },
    broadcast(message) {
      const serialized = JSON.stringify(message);
      for (const client of clients) {
        if (client.readyState === import_websocket.default.OPEN) {
          client.send(serialized);
        }
      }
    },
    on(event, listener) {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(listener);
    },
    async close() {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
      for (const client of clients) {
        client.close();
      }
      clients.clear();
      return new Promise((resolve3) => {
        wss.close(() => resolve3());
      });
    }
  };
}

// ../core/dist/rest-server.js
import http from "node:http";
import fs from "node:fs";
import nodePath from "node:path";
function writeJson(res, status, data) {
  const payload = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload)
  });
  res.end(payload);
}
function readBinaryBody(req, maxBytes = 10 * 1024 * 1024) {
  return new Promise((resolve3, reject) => {
    let totalBytes = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > maxBytes) {
        req.pause();
        reject(new Error("Payload too large"));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      resolve3(Buffer.concat(chunks));
    });
    req.on("error", reject);
  });
}
function readBody(req, maxBytes = 1024 * 100) {
  return new Promise((resolve3, reject) => {
    let totalBytes = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > maxBytes) {
        req.pause();
        reject(new Error("Payload too large"));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const data = Buffer.concat(chunks).toString("utf8");
        resolve3(data);
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}
var STATIC_MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};
function tryServeStatic(dir, urlPath, res) {
  const safePath = nodePath.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = nodePath.join(dir, safePath);
  if (!filePath.startsWith(nodePath.resolve(dir)))
    return false;
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile())
      return false;
    const ext = nodePath.extname(filePath).toLowerCase();
    const contentType = STATIC_MIME_TYPES[ext] ?? "application/octet-stream";
    const headers = {
      "Content-Type": contentType,
      "Content-Length": stat.size
    };
    if (urlPath.startsWith("/_app/immutable/")) {
      headers["Cache-Control"] = "public, max-age=31536000, immutable";
    }
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
    return true;
  } catch {
    return false;
  }
}
function createRestServer(handlers, options = {}) {
  const { port = 0, corsOrigins, logger, photoDir, staticDir } = options;
  const startedAt = Date.now();
  let boundPort = 0;
  let closed = false;
  const corsOrigin = corsOrigins && corsOrigins.length > 0 ? corsOrigins[0] : "*";
  const corsHeaders = {
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  const routes = /* @__PURE__ */ new Map();
  function addRoute(path5, method, handler) {
    if (!routes.has(path5)) {
      routes.set(path5, /* @__PURE__ */ new Map());
    }
    routes.get(path5).set(method.toUpperCase(), handler);
  }
  addRoute("/health", "GET", async (_req, res) => {
    writeJson(res, 200, { status: "ok", uptime: (Date.now() - startedAt) / 1e3 });
  });
  addRoute("/settings", "GET", async (_req, res) => {
    const settings = await handlers.getSettings();
    writeJson(res, 200, settings);
  });
  addRoute("/settings", "PUT", async (_req, res, body) => {
    let settings;
    try {
      settings = JSON.parse(body);
    } catch {
      writeJson(res, 400, { error: "Invalid JSON" });
      return;
    }
    await handlers.putSettings(settings);
    writeJson(res, 200, { ok: true });
  });
  addRoute("/layout", "GET", async (_req, res) => {
    const layout = await handlers.getLayout();
    writeJson(res, 200, layout);
  });
  addRoute("/layout", "PUT", async (_req, res, body) => {
    let layout;
    try {
      layout = JSON.parse(body);
    } catch {
      writeJson(res, 400, { error: "Invalid JSON" });
      return;
    }
    await handlers.putLayout(layout);
    if (handlers.syncModules) {
      const parsed = layout;
      const widgetIds = Array.isArray(parsed.widgets) ? parsed.widgets.map((w) => w.id) : [];
      handlers.syncModules(widgetIds);
    }
    writeJson(res, 200, { ok: true });
  });
  addRoute("/ask", "POST", async (_req, res, body) => {
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      writeJson(res, 400, { error: "Invalid JSON" });
      return;
    }
    const question = parsed["question"];
    if (typeof question !== "string" || question.trim() === "") {
      writeJson(res, 400, { error: "question is required" });
      return;
    }
    const entry = await handlers.postAsk(question);
    writeJson(res, 200, entry);
  });
  const server = http.createServer((req, res) => {
    const method = (req.method ?? "GET").toUpperCase();
    const path5 = req.url ?? "/";
    const start = Date.now();
    for (const [key, value] of Object.entries(corsHeaders)) {
      res.setHeader(key, value);
    }
    if (method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      try {
        logger?.({ method, path: path5, status: 204, duration_ms: Date.now() - start });
      } catch {
      }
      return;
    }
    (async () => {
      try {
        const cleanPath = path5.split("?")[0];
        const moduleMatch = cleanPath.match(/^\/modules\/([^/]+)\/restart$/);
        if (moduleMatch && method === "POST") {
          if (!handlers.restartModule) {
            writeJson(res, 404, { error: "Not Found" });
            try {
              logger?.({ method, path: path5, status: 404, duration_ms: Date.now() - start });
            } catch {
            }
            return;
          }
          try {
            const moduleId = decodeURIComponent(moduleMatch[1]);
            const result = await handlers.restartModule(moduleId);
            writeJson(res, 200, result);
            try {
              logger?.({ method, path: path5, status: 200, duration_ms: Date.now() - start });
            } catch {
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Restart failed";
            writeJson(res, 500, { error: msg });
            try {
              logger?.({ method, path: path5, status: 500, duration_ms: Date.now() - start });
            } catch {
            }
          }
          return;
        }
        if (cleanPath === "/plugins/install" && method === "POST") {
          if (!handlers.installPlugin) {
            writeJson(res, 404, { error: "Not Found" });
            try {
              logger?.({ method, path: path5, status: 404, duration_ms: Date.now() - start });
            } catch {
            }
            return;
          }
          try {
            const zipBuffer = await readBinaryBody(req);
            const plugin = await handlers.installPlugin(zipBuffer);
            writeJson(res, 201, { ok: true, plugin });
            try {
              logger?.({ method, path: path5, status: 201, duration_ms: Date.now() - start });
            } catch {
            }
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Install failed";
            writeJson(res, 400, { error: msg });
            try {
              logger?.({ method, path: path5, status: 400, duration_ms: Date.now() - start });
            } catch {
            }
          }
          return;
        }
        if (cleanPath === "/plugins/reload" && method === "POST") {
          if (!handlers.reloadPlugins) {
            writeJson(res, 404, { error: "Not Found" });
            try {
              logger?.({ method, path: path5, status: 404, duration_ms: Date.now() - start });
            } catch {
            }
            return;
          }
          await handlers.reloadPlugins();
          writeJson(res, 200, { ok: true });
          try {
            logger?.({ method, path: path5, status: 200, duration_ms: Date.now() - start });
          } catch {
          }
          return;
        }
        const pluginMatch = cleanPath.match(/^\/plugins\/([^/]+)(?:\/(.+))?$/);
        if (pluginMatch) {
          const pluginId = decodeURIComponent(pluginMatch[1]);
          const action = pluginMatch[2];
          if (!action && method === "GET") {
            if (!handlers.getPlugin) {
              writeJson(res, 404, { error: "Not Found" });
              try {
                logger?.({ method, path: path5, status: 404, duration_ms: Date.now() - start });
              } catch {
              }
              return;
            }
            const plugin = await handlers.getPlugin(pluginId);
            if (!plugin) {
              writeJson(res, 404, { error: `Plugin '${pluginId}' not found` });
            } else {
              writeJson(res, 200, plugin);
            }
            try {
              logger?.({ method, path: path5, status: res.statusCode, duration_ms: Date.now() - start });
            } catch {
            }
            return;
          }
          if (action === "enabled" && method === "PUT") {
            if (!handlers.setPluginEnabled) {
              writeJson(res, 404, { error: "Not Found" });
              try {
                logger?.({ method, path: path5, status: 404, duration_ms: Date.now() - start });
              } catch {
              }
              return;
            }
            const body = await readBody(req);
            let parsed;
            try {
              parsed = JSON.parse(body);
            } catch {
              writeJson(res, 400, { error: "Invalid JSON" });
              try {
                logger?.({ method, path: path5, status: 400, duration_ms: Date.now() - start });
              } catch {
              }
              return;
            }
            if (typeof parsed["enabled"] !== "boolean") {
              writeJson(res, 400, { error: "enabled (boolean) is required" });
              try {
                logger?.({ method, path: path5, status: 400, duration_ms: Date.now() - start });
              } catch {
              }
              return;
            }
            await handlers.setPluginEnabled(pluginId, parsed["enabled"]);
            writeJson(res, 200, { ok: true });
            try {
              logger?.({ method, path: path5, status: 200, duration_ms: Date.now() - start });
            } catch {
            }
            return;
          }
          if (action === "config" && method === "PUT") {
            if (!handlers.updatePluginConfig) {
              writeJson(res, 404, { error: "Not Found" });
              try {
                logger?.({ method, path: path5, status: 404, duration_ms: Date.now() - start });
              } catch {
              }
              return;
            }
            const body = await readBody(req);
            let parsed;
            try {
              parsed = JSON.parse(body);
            } catch {
              writeJson(res, 400, { error: "Invalid JSON" });
              try {
                logger?.({ method, path: path5, status: 400, duration_ms: Date.now() - start });
              } catch {
              }
              return;
            }
            if (!parsed["config"] || typeof parsed["config"] !== "object" || Array.isArray(parsed["config"])) {
              writeJson(res, 400, { error: "config (object) is required" });
              try {
                logger?.({ method, path: path5, status: 400, duration_ms: Date.now() - start });
              } catch {
              }
              return;
            }
            await handlers.updatePluginConfig(pluginId, parsed["config"]);
            writeJson(res, 200, { ok: true });
            try {
              logger?.({ method, path: path5, status: 200, duration_ms: Date.now() - start });
            } catch {
            }
            return;
          }
          if (action === "zone" && method === "PUT") {
            if (!handlers.assignPluginZone) {
              writeJson(res, 404, { error: "Not Found" });
              try {
                logger?.({ method, path: path5, status: 404, duration_ms: Date.now() - start });
              } catch {
              }
              return;
            }
            const body = await readBody(req);
            let parsed;
            try {
              parsed = JSON.parse(body);
            } catch {
              writeJson(res, 400, { error: "Invalid JSON" });
              try {
                logger?.({ method, path: path5, status: 400, duration_ms: Date.now() - start });
              } catch {
              }
              return;
            }
            if (!Object.prototype.hasOwnProperty.call(parsed, "zone")) {
              writeJson(res, 400, { error: "zone is required" });
              try {
                logger?.({ method, path: path5, status: 400, duration_ms: Date.now() - start });
              } catch {
              }
              return;
            }
            const zone = parsed["zone"] === null ? void 0 : parsed["zone"];
            await handlers.assignPluginZone(pluginId, zone);
            writeJson(res, 200, { ok: true });
            try {
              logger?.({ method, path: path5, status: 200, duration_ms: Date.now() - start });
            } catch {
            }
            return;
          }
          writeJson(res, 404, { error: "Not Found" });
          try {
            logger?.({ method, path: path5, status: 404, duration_ms: Date.now() - start });
          } catch {
          }
          return;
        }
        if (cleanPath.startsWith("/photos/") && method === "GET") {
          if (!photoDir) {
            writeJson(res, 404, { error: "Not Found" });
            return;
          }
          const filename = decodeURIComponent(cleanPath.slice("/photos/".length));
          const resolved = nodePath.resolve(photoDir, filename);
          if (!resolved.startsWith(nodePath.resolve(photoDir))) {
            res.writeHead(403);
            res.end();
            return;
          }
          if (!fs.existsSync(resolved)) {
            res.writeHead(404);
            res.end();
            return;
          }
          const ext = nodePath.extname(resolved).toLowerCase();
          const mimeTypes = {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".webp": "image/webp",
            ".gif": "image/gif"
          };
          const contentType = mimeTypes[ext] ?? "application/octet-stream";
          const data = fs.readFileSync(resolved);
          res.writeHead(200, { "Content-Type": contentType, "Content-Length": data.length });
          res.end(data);
          return;
        }
        if (cleanPath === "/plugins" && method === "GET") {
          if (!handlers.getPlugins) {
            writeJson(res, 404, { error: "Not Found" });
            try {
              logger?.({ method, path: path5, status: 404, duration_ms: Date.now() - start });
            } catch {
            }
            return;
          }
          const plugins = await handlers.getPlugins();
          writeJson(res, 200, plugins);
          try {
            logger?.({ method, path: path5, status: 200, duration_ms: Date.now() - start });
          } catch {
          }
          return;
        }
        const pathRoutes = routes.get(cleanPath);
        if (pathRoutes) {
          const handler = pathRoutes.get(method);
          if (!handler) {
            writeJson(res, 405, { error: "Method Not Allowed" });
            try {
              logger?.({ method, path: path5, status: 405, duration_ms: Date.now() - start });
            } catch {
            }
            return;
          }
          const body = await readBody(req);
          await handler(req, res, body);
        } else if (staticDir && method === "GET") {
          const served = tryServeStatic(staticDir, cleanPath, res) || tryServeStatic(staticDir, "index.html", res);
          if (!served) {
            writeJson(res, 404, { error: "Not Found" });
          }
        } else {
          writeJson(res, 404, { error: "Not Found" });
          try {
            logger?.({ method, path: path5, status: 404, duration_ms: Date.now() - start });
          } catch {
          }
          return;
        }
        const status = res.statusCode;
        try {
          logger?.({ method, path: path5, status, duration_ms: Date.now() - start });
        } catch {
        }
      } catch (err) {
        if (!res.headersSent) {
          const status = err instanceof Error && err.message === "Payload too large" ? 413 : 500;
          const errorMsg = status === 413 ? "Payload Too Large" : "Internal Server Error";
          writeJson(res, status, { error: errorMsg });
        }
        try {
          logger?.({
            method,
            path: path5,
            status: res.statusCode ?? 500,
            duration_ms: Date.now() - start
          });
        } catch {
        }
      }
    })();
  });
  let onReady;
  let onError;
  const readyPromise = new Promise((resolve3, reject) => {
    onReady = resolve3;
    onError = reject;
  });
  server.listen(port, "127.0.0.1", () => {
    const addr = server.address();
    if (typeof addr === "object" && addr) {
      boundPort = addr.port;
    }
    onReady();
  });
  server.on("error", (err) => {
    onError(err);
  });
  return {
    get port() {
      return boundPort;
    },
    get server() {
      return server;
    },
    ready() {
      return readyPromise;
    },
    async close() {
      if (closed)
        return;
      closed = true;
      return new Promise((resolve3, reject) => {
        server.close((err) => {
          if (err)
            reject(err);
          else
            resolve3();
        });
      });
    }
  };
}

// ../core/dist/plugin-scheduler.js
var DEFAULT_INTERVAL = 6e4;
var MIN_INTERVAL = 100;
var BURST_WINDOW_MS = 6e4;
function clampInterval(value, floor) {
  if (!Number.isFinite(value) || value <= 0)
    return floor;
  return Math.max(value, floor);
}
function createPluginScheduler(options = {}) {
  const rawDefault = options.defaultInterval ?? DEFAULT_INTERVAL;
  const defaultInterval = clampInterval(rawDefault, MIN_INTERVAL);
  const plugins = /* @__PURE__ */ new Map();
  let closed = false;
  function clearTimer(record) {
    if (record.timerId !== null) {
      clearTimeout(record.timerId);
      record.timerId = null;
    }
    record.entry.nextRun = void 0;
  }
  function scheduleNext(record, capturedGeneration) {
    if (closed || record.generation !== capturedGeneration || record.entry.status === "stopped") {
      return;
    }
    const interval = record.entry.interval;
    record.entry.nextRun = Date.now() + interval;
    record.timerId = setTimeout(async () => {
      record.entry.nextRun = void 0;
      if (closed || record.generation !== capturedGeneration || record.entry.status === "stopped") {
        return;
      }
      const maxBurst = record.manifest.permissions?.max_request_burst;
      if (maxBurst !== void 0 && maxBurst > 0 && Number.isFinite(maxBurst)) {
        const now = Date.now();
        record.burstWindow = record.burstWindow.filter((t) => now - t < BURST_WINDOW_MS);
        if (record.burstWindow.length >= maxBurst) {
          scheduleNext(record, capturedGeneration);
          return;
        }
        record.burstWindow.push(now);
      }
      try {
        await record.handler();
        if (record.generation !== capturedGeneration || closed)
          return;
        record.entry.lastRun = Date.now();
        record.entry.runCount++;
        if (record.entry.status !== "stopped") {
          record.entry.status = "running";
          record.entry.error = void 0;
        }
      } catch (err) {
        if (record.generation !== capturedGeneration || closed)
          return;
        record.entry.status = "error";
        record.entry.error = err instanceof Error ? err.message : String(err);
        record.entry.lastRun = Date.now();
        record.entry.runCount++;
      }
      scheduleNext(record, capturedGeneration);
    }, interval);
  }
  return {
    register(pluginId, manifest, handler, overrideInterval) {
      const existing = plugins.get(pluginId);
      if (existing) {
        existing.generation++;
        clearTimer(existing);
      }
      const manifestInterval = manifest.permissions?.max_refresh_ms;
      const floorInterval = manifestInterval !== void 0 && Number.isFinite(manifestInterval) && manifestInterval > 0 ? manifestInterval : defaultInterval;
      let interval;
      if (overrideInterval !== void 0) {
        interval = clampInterval(overrideInterval, floorInterval);
      } else {
        interval = floorInterval;
      }
      const entry = {
        pluginId,
        interval,
        status: "stopped",
        runCount: 0
      };
      plugins.set(pluginId, {
        manifest,
        handler,
        entry,
        timerId: null,
        generation: 0,
        burstWindow: []
      });
    },
    unregister(pluginId) {
      const record = plugins.get(pluginId);
      if (!record)
        return;
      record.generation++;
      clearTimer(record);
      plugins.delete(pluginId);
    },
    start(pluginId) {
      const record = plugins.get(pluginId);
      if (!record)
        return;
      record.generation++;
      clearTimer(record);
      record.entry.status = "running";
      record.entry.error = void 0;
      scheduleNext(record, record.generation);
    },
    stop(pluginId) {
      const record = plugins.get(pluginId);
      if (!record)
        return;
      record.generation++;
      clearTimer(record);
      record.entry.status = "stopped";
    },
    restart(pluginId) {
      const record = plugins.get(pluginId);
      if (!record)
        return;
      record.generation++;
      clearTimer(record);
      record.entry.status = "running";
      record.entry.error = void 0;
      record.burstWindow = [];
      scheduleNext(record, record.generation);
    },
    startAll() {
      for (const pluginId of plugins.keys()) {
        this.start(pluginId);
      }
    },
    stopAll() {
      for (const pluginId of plugins.keys()) {
        this.stop(pluginId);
      }
    },
    getState() {
      const result = /* @__PURE__ */ new Map();
      for (const [pluginId, record] of plugins) {
        result.set(pluginId, { ...record.entry });
      }
      return result;
    },
    getPluginState(pluginId) {
      const record = plugins.get(pluginId);
      if (!record)
        return void 0;
      return { ...record.entry };
    },
    close() {
      if (closed)
        return;
      closed = true;
      for (const record of plugins.values()) {
        record.generation++;
        clearTimer(record);
        record.entry.status = "stopped";
      }
    }
  };
}

// ../core/dist/weather-server.js
var WMO_CODE_MAP = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Fog",
  51: "Drizzle",
  53: "Drizzle",
  55: "Drizzle",
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Rain",
  63: "Rain",
  65: "Rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Snow",
  73: "Snow",
  75: "Snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Rain showers",
  82: "Rain showers",
  85: "Snow showers",
  86: "Snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm"
};
function wmoToConditions(code) {
  return WMO_CODE_MAP[code] ?? "Unknown";
}
function transformOpenMeteoCurrent(c) {
  return {
    temp: c.temperature_2m,
    feelsLike: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    conditions: wmoToConditions(c.weather_code),
    icon: ""
  };
}
function transformOpenMeteoForecast(daily) {
  return daily.time.map((date, i) => ({
    date,
    high: daily.temperature_2m_max[i],
    low: daily.temperature_2m_min[i],
    conditions: wmoToConditions(daily.weather_code[i]),
    icon: ""
  }));
}
function buildOpenMeteoUrl(location, units) {
  const tempUnit = units === "imperial" ? "fahrenheit" : "celsius";
  return `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5&temperature_unit=${tempUnit}`;
}
function transformCurrent(c) {
  const w = c.weather[0] ?? { description: "unknown", icon: "" };
  return {
    temp: c.temp,
    feelsLike: c.feels_like,
    humidity: c.humidity,
    conditions: w.description,
    icon: w.icon
  };
}
function transformForecast(daily) {
  return daily.map((d) => {
    const w = d.weather[0] ?? { description: "unknown", icon: "" };
    return {
      date: new Date(d.dt * 1e3).toISOString().split("T")[0],
      high: d.temp.max,
      low: d.temp.min,
      conditions: w.description,
      icon: w.icon
    };
  });
}
function createWeatherServer(options) {
  const { provider = "open-meteo", apiKey, location, units = "imperial", fetchFn = fetch, dataBus } = options;
  if (provider === "openweathermap" && !apiKey) {
    throw new Error("WeatherServer: apiKey is required for OpenWeatherMap provider");
  }
  if (!location) {
    throw new Error("WeatherServer: location is required");
  }
  const maxStale_ms = options.maxStale_ms ?? 36e5;
  let lastData = null;
  let lastFetchedAt = null;
  const updateListeners = [];
  const errorListeners = [];
  let closed = false;
  function notifyUpdate(data) {
    for (const cb of updateListeners) {
      try {
        cb(data);
      } catch {
      }
    }
  }
  function notifyError(message) {
    for (const cb of errorListeners) {
      try {
        cb(message);
      } catch {
      }
    }
  }
  function buildUrl() {
    if (provider === "open-meteo") {
      return buildOpenMeteoUrl(location, units);
    }
    const base = "https://api.openweathermap.org/data/3.0/onecall";
    return `${base}?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${apiKey}&exclude=minutely,hourly,alerts`;
  }
  function transformResponse2(raw) {
    if (provider === "open-meteo") {
      const om = raw;
      if (!om.current || !om.daily) {
        notifyError("Weather response missing required fields: current or daily");
        return null;
      }
      return {
        current: transformOpenMeteoCurrent(om.current),
        forecast: transformOpenMeteoForecast(om.daily),
        lastUpdated: Date.now()
      };
    }
    const owm = raw;
    if (!owm.current || !Array.isArray(owm.daily)) {
      notifyError("Weather response missing required fields: current or daily");
      return null;
    }
    return {
      current: transformCurrent(owm.current),
      forecast: transformForecast(owm.daily),
      lastUpdated: Date.now()
    };
  }
  async function refresh() {
    if (closed)
      return;
    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }
    let response;
    try {
      response = await fetchFn(buildUrl());
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Weather fetch failed: ${message}`);
      return;
    }
    if (!response.ok) {
      notifyError(`Weather API error ${response.status ?? ""}: ${response.statusText ?? "unknown"}`);
      return;
    }
    let raw;
    try {
      raw = await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Weather response parse error: ${message}`);
      return;
    }
    const data = transformResponse2(raw);
    if (!data)
      return;
    lastData = data;
    lastFetchedAt = Date.now();
    notifyUpdate(data);
    if (dataBus) {
      dataBus.publish("weather.current", "weather-server", data);
    }
  }
  return {
    refresh,
    getWeatherData() {
      return lastData;
    },
    onUpdate(callback) {
      updateListeners.push(callback);
      return () => {
        const idx = updateListeners.indexOf(callback);
        if (idx !== -1)
          updateListeners.splice(idx, 1);
      };
    },
    onError(callback) {
      errorListeners.push(callback);
    },
    close() {
      closed = true;
    }
  };
}

// ../core/dist/caldav-client.js
var DEFAULT_RANGE_DAYS = 7;
var DEFAULT_MAX_STALE_MS = 36e5;
var MAX_RETRIES = 2;
var RETRY_BASE_DELAY_MS = 50;
function buildBasicAuth(username, password) {
  return "Basic " + Buffer.from(`${username}:${password}`).toString("base64");
}
function formatICalDate(d) {
  return d.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
}
function buildCalendarQuery(start, end) {
  return `<?xml version="1.0" encoding="utf-8"?>
<C:calendar-query xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
  <D:prop>
    <D:getetag/>
    <C:calendar-data/>
  </D:prop>
  <C:filter>
    <C:comp-filter name="VCALENDAR">
      <C:comp-filter name="VEVENT">
        <C:time-range DTSTART="${formatICalDate(start)}" DTEND="${formatICalDate(end)}"/>
      </C:comp-filter>
    </C:comp-filter>
  </C:filter>
</C:calendar-query>`;
}
function deriveCalendarName(calendarPath) {
  const segments = calendarPath.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "calendar";
}
function extractCalendarData(xml) {
  const results = [];
  const re = /<[a-zA-Z]*:?calendar-data[^>]*>([\s\S]*?)<\/[a-zA-Z]*:?calendar-data>/gi;
  let match;
  while ((match = re.exec(xml)) !== null) {
    const content = match[1].trim();
    if (content)
      results.push(content);
  }
  return results;
}
function getICalProp(vevent, prop) {
  const re = new RegExp(`^${prop}(?:;[^:]*)?:(.*)$`, "m");
  const m = vevent.match(re);
  return m ? m[1].trim() : void 0;
}
function parseICalDate(val, params) {
  const isDate = params.includes("VALUE=DATE");
  if (isDate) {
    const y2 = val.slice(0, 4);
    const mo2 = val.slice(4, 6);
    const d2 = val.slice(6, 8);
    return { isoStr: `${y2}-${mo2}-${d2}`, allDay: true };
  }
  const y = val.slice(0, 4);
  const mo = val.slice(4, 6);
  const d = val.slice(6, 8);
  const h = val.slice(9, 11);
  const min = val.slice(11, 13);
  const s = val.slice(13, 15);
  const utc = val.endsWith("Z") ? "Z" : "";
  return { isoStr: `${y}-${mo}-${d}T${h}:${min}:${s}${utc}`, allDay: false };
}
function parseVEvent(veventStr, calendarName) {
  const uid = getICalProp(veventStr, "UID") ?? "";
  const summary = getICalProp(veventStr, "SUMMARY") ?? "Untitled";
  const location = getICalProp(veventStr, "LOCATION");
  const dtStartRaw = veventStr.match(/^DTSTART(?:;([^:]*))?: *(.*)$/m);
  const dtEndRaw = veventStr.match(/^DTEND(?:;([^:]*))?: *(.*)$/m);
  const startParams = dtStartRaw?.[1] ?? "";
  const startVal = dtStartRaw?.[2]?.trim() ?? "";
  const endParams = dtEndRaw?.[1] ?? "";
  const endVal = dtEndRaw?.[2]?.trim() ?? "";
  const { isoStr: start, allDay } = parseICalDate(startVal, startParams);
  const { isoStr: end } = parseICalDate(endVal, endParams);
  const event = { id: uid, title: summary, start, end, calendar: calendarName };
  if (location)
    event.location = location;
  if (allDay)
    event.allDay = true;
  return event;
}
function parseCalendarData(icalData, calendarName) {
  const veventBlocks = icalData.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) ?? [];
  return veventBlocks.map((block) => parseVEvent(block, calendarName));
}
function sleep(ms) {
  return new Promise((resolve3) => setTimeout(resolve3, ms));
}
function createCalendarServer(options) {
  const { username, password, serverUrl, calendarPath, dataBus } = options;
  if (!username)
    throw new Error("CalendarServer: username is required");
  if (!password)
    throw new Error("CalendarServer: password is required");
  if (!serverUrl)
    throw new Error("CalendarServer: serverUrl is required");
  if (!calendarPath)
    throw new Error("CalendarServer: calendarPath is required");
  if (!serverUrl.startsWith("https://"))
    throw new Error("CalendarServer: serverUrl must use HTTPS");
  const rangeDays = options.rangeDays ?? DEFAULT_RANGE_DAYS;
  const maxStale_ms = options.maxStale_ms ?? DEFAULT_MAX_STALE_MS;
  const fetchFn = options.fetchFn ?? fetch;
  const calendarName = deriveCalendarName(calendarPath);
  const authHeader = buildBasicAuth(username, password);
  let lastEvents = null;
  let lastFetchedAt = null;
  let closed = false;
  let refreshInFlight = null;
  const updateListeners = [];
  const errorListeners = [];
  function notifyUpdate(events) {
    for (const cb of updateListeners) {
      try {
        cb(events);
      } catch {
      }
    }
  }
  function notifyError(message) {
    for (const cb of errorListeners) {
      try {
        cb(message);
      } catch {
      }
    }
  }
  async function doFetch(attempt = 0) {
    const now = /* @__PURE__ */ new Date();
    const end = new Date(now.getTime() + rangeDays * 24 * 60 * 60 * 1e3);
    const url = `${serverUrl}${calendarPath}`;
    const body = buildCalendarQuery(now, end);
    let response;
    try {
      response = await fetchFn(url, {
        method: "REPORT",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/xml; charset=utf-8",
          Depth: "1"
        },
        body
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_BASE_DELAY_MS * Math.pow(2, attempt));
        return doFetch(attempt + 1);
      }
      notifyError(`CalDAV fetch failed: ${message}`);
      return;
    }
    if (response.status === 401 || response.status === 403) {
      notifyError(`CalDAV auth error ${response.status}: ${response.statusText}`);
      return;
    }
    if (response.status === 429) {
      notifyError(`CalDAV rate limited ${response.status}: ${response.statusText}`);
      return;
    }
    if (!response.ok) {
      notifyError(`CalDAV error ${response.status}: ${response.statusText}`);
      return;
    }
    let xml;
    try {
      xml = await response.text();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`CalDAV response parse error: ${message}`);
      return;
    }
    const events = [];
    const calDataBlocks = extractCalendarData(xml);
    for (const block of calDataBlocks) {
      const parsed = parseCalendarData(block, calendarName);
      events.push(...parsed);
    }
    lastEvents = events;
    lastFetchedAt = Date.now();
    notifyUpdate(events);
    if (dataBus) {
      dataBus.publish("calendar.events", "calendar-server", {
        events: [...events],
        lastUpdated: Date.now()
      });
    }
  }
  async function refresh() {
    if (closed)
      return;
    if (refreshInFlight) {
      await refreshInFlight;
      return;
    }
    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }
    const fetchPromise = doFetch();
    refreshInFlight = fetchPromise;
    try {
      await fetchPromise;
    } finally {
      refreshInFlight = null;
    }
  }
  return {
    refresh,
    getEvents() {
      return lastEvents ? [...lastEvents] : null;
    },
    onUpdate(callback) {
      updateListeners.push(callback);
      return () => {
        const idx = updateListeners.indexOf(callback);
        if (idx !== -1)
          updateListeners.splice(idx, 1);
      };
    },
    onError(callback) {
      errorListeners.push(callback);
      return () => {
        const idx = errorListeners.indexOf(callback);
        if (idx !== -1)
          errorListeners.splice(idx, 1);
      };
    },
    close() {
      closed = true;
      updateListeners.length = 0;
      errorListeners.length = 0;
    }
  };
}

// ../core/dist/notification-queue.js
var DEFAULT_TTL_MS = 36e5;
var DEFAULT_SWEEP_INTERVAL_MS = 6e4;
var DEFAULT_DEDUPE_WINDOW_MS = 3e5;
var PRIORITY_ORDER = {
  urgent: 0,
  warning: 1,
  info: 2
};
function generateId() {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function createNotificationQueue(options = {}) {
  const defaultTtl_ms = options.defaultTtl_ms ?? DEFAULT_TTL_MS;
  const sweepInterval_ms = options.sweepInterval_ms ?? DEFAULT_SWEEP_INTERVAL_MS;
  const dedupeWindow_ms = options.dedupeWindow_ms ?? DEFAULT_DEDUPE_WINDOW_MS;
  const notifications = /* @__PURE__ */ new Map();
  const listeners = [];
  let closed = false;
  let sweepTimer = null;
  sweepTimer = setInterval(() => {
    const now = Date.now();
    for (const [id, entry] of notifications) {
      const age = now - new Date(entry.created_at).getTime();
      if (age > entry.ttl_ms) {
        notifications.delete(id);
      }
    }
  }, sweepInterval_ms);
  function notifyListeners(entry) {
    for (const cb of listeners) {
      try {
        cb({ ...entry });
      } catch {
      }
    }
  }
  function doEmit(opts) {
    if (closed)
      return "";
    const ttl = opts.ttl_ms ?? defaultTtl_ms;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (opts.dedupe_key) {
      for (const [id2, existing] of notifications) {
        if (existing.dedupe_key === opts.dedupe_key && existing.source === opts.source) {
          const age = Date.now() - new Date(existing.created_at).getTime();
          if (age <= dedupeWindow_ms && age <= existing.ttl_ms) {
            const updated = {
              ...existing,
              priority: opts.priority,
              title: opts.title,
              body: opts.body,
              ttl_ms: ttl,
              created_at: now
            };
            notifications.set(id2, updated);
            notifyListeners(updated);
            return id2;
          }
        }
      }
    }
    const id = generateId();
    const entry = {
      id,
      source: opts.source,
      priority: opts.priority,
      title: opts.title,
      body: opts.body,
      ttl_ms: ttl,
      created_at: now,
      read: false,
      dismissed: false,
      dedupe_key: opts.dedupe_key
    };
    notifications.set(id, entry);
    notifyListeners(entry);
    return id;
  }
  return {
    emit(opts) {
      return doEmit(opts);
    },
    list(filter) {
      const now = Date.now();
      let entries = Array.from(notifications.values()).filter((e) => {
        const age = now - new Date(e.created_at).getTime();
        return age <= e.ttl_ms;
      });
      if (filter) {
        if (filter.priority !== void 0) {
          entries = entries.filter((e) => e.priority === filter.priority);
        }
        if (filter.source !== void 0) {
          entries = entries.filter((e) => e.source === filter.source);
        }
        if (filter.read !== void 0) {
          entries = entries.filter((e) => e.read === filter.read);
        }
      }
      entries.sort((a, b) => {
        const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        if (pDiff !== 0)
          return pDiff;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      return entries.map((e) => ({ ...e }));
    },
    markRead(id) {
      const entry = notifications.get(id);
      if (entry) {
        notifications.set(id, { ...entry, read: true });
      }
    },
    dismiss(id) {
      notifications.delete(id);
    },
    clear() {
      notifications.clear();
    },
    emitSystemEvent(event, detail) {
      const titles = {
        plugin_error: "Plugin Error",
        connectivity_loss: "Connectivity Lost"
      };
      const priorities = {
        plugin_error: "warning",
        connectivity_loss: "urgent"
      };
      return doEmit({
        source: "system",
        priority: priorities[event],
        title: titles[event],
        body: detail,
        dedupe_key: `system:${event}`
      });
    },
    onNotification(callback) {
      listeners.push(callback);
      return () => {
        const idx = listeners.indexOf(callback);
        if (idx !== -1)
          listeners.splice(idx, 1);
      };
    },
    close() {
      closed = true;
      if (sweepTimer !== null) {
        clearInterval(sweepTimer);
        sweepTimer = null;
      }
      notifications.clear();
      listeners.length = 0;
    }
  };
}

// ../core/dist/plugin-loader.js
import * as fs2 from "fs";
import * as path from "path";
import { pathToFileURL } from "url";
function validateManifestData(input) {
  const errors = [];
  const requiredFields = ["id", "name", "version"];
  for (const field of requiredFields) {
    if (!(field in input)) {
      errors.push(`Missing required field: ${field}`);
    } else if (typeof input[field] !== "string") {
      errors.push(`Field "${field}" must be a string`);
    } else if (input[field].length === 0) {
      errors.push(`Field "${field}" must not be empty`);
    }
  }
  const optionalStringFields = ["ui_entry", "server_entry"];
  for (const field of optionalStringFields) {
    if (field in input && typeof input[field] !== "string") {
      errors.push(`Field "${field}" must be a string`);
    }
  }
  if ("dependencies" in input) {
    if (!Array.isArray(input.dependencies)) {
      errors.push('Field "dependencies" must be an array of strings');
    } else if (!input.dependencies.every((dep) => typeof dep === "string")) {
      errors.push('Field "dependencies" must be an array of strings');
    }
  }
  if ("widget_sizes" in input) {
    if (!Array.isArray(input.widget_sizes)) {
      errors.push('Field "widget_sizes" must be an array');
    } else if (!input.widget_sizes.every((size) => typeof size === "string")) {
      errors.push('Field "widget_sizes" must be an array of strings');
    }
  }
  if ("permissions" in input) {
    if (typeof input.permissions !== "object" || input.permissions === null) {
      errors.push('Field "permissions" must be an object');
    } else {
      const perms = input.permissions;
      if ("allowed_domains" in perms) {
        if (!Array.isArray(perms.allowed_domains)) {
          errors.push("permissions.allowed_domains must be an array of strings");
        } else if (!perms.allowed_domains.every((d) => typeof d === "string")) {
          errors.push("permissions.allowed_domains must be an array of strings");
        }
      }
      if ("max_refresh_ms" in perms) {
        if (typeof perms.max_refresh_ms !== "number" || !Number.isFinite(perms.max_refresh_ms) || perms.max_refresh_ms < 0) {
          errors.push("permissions.max_refresh_ms must be a positive number");
        }
      }
      if ("max_request_burst" in perms) {
        if (typeof perms.max_request_burst !== "number" || !Number.isFinite(perms.max_request_burst) || perms.max_request_burst < 0) {
          errors.push("permissions.max_request_burst must be a positive number");
        }
      }
      if ("secrets" in perms) {
        if (!Array.isArray(perms.secrets)) {
          errors.push("permissions.secrets must be an array of strings");
        } else if (!perms.secrets.every((s) => typeof s === "string")) {
          errors.push("permissions.secrets must be an array of strings");
        }
      }
    }
  }
  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return { valid: true, errors: [], manifest: input };
}
function scanDirectory(pluginsDir, errors) {
  const valid = [];
  if (!fs2.existsSync(pluginsDir))
    return valid;
  const entries = fs2.readdirSync(pluginsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory())
      continue;
    const manifestPath = path.join(pluginsDir, entry.name, "plugin.json");
    if (!fs2.existsSync(manifestPath))
      continue;
    try {
      const content = fs2.readFileSync(manifestPath, "utf-8");
      const parsed = JSON.parse(content);
      const idKey = typeof parsed.id === "string" ? parsed.id : entry.name;
      const result = validateManifestData(parsed);
      if (result.valid && result.manifest) {
        valid.push({
          id: result.manifest.id,
          manifest: result.manifest,
          pluginDir: path.join(pluginsDir, entry.name)
        });
      } else {
        errors.set(idKey, result.errors.join(", "));
      }
    } catch (err) {
      errors.set(entry.name, `Failed to parse plugin.json: ${String(err)}`);
    }
  }
  return valid;
}
function createPluginLoader(options) {
  const { pluginsDir } = options;
  const registry = /* @__PURE__ */ new Map();
  const errors = /* @__PURE__ */ new Map();
  let loaded = false;
  async function load() {
    registry.clear();
    errors.clear();
    loaded = true;
    const scanned = scanDirectory(pluginsDir, errors);
    for (const { id, manifest, pluginDir } of scanned) {
      const loadedPlugin = {
        manifest,
        status: "loading"
      };
      try {
        if (manifest.ui_entry) {
          const uiPath = path.resolve(pluginDir, manifest.ui_entry);
          loadedPlugin.ui_module = await import(pathToFileURL(uiPath).href);
        }
        if (manifest.server_entry) {
          const serverPath = path.resolve(pluginDir, manifest.server_entry);
          loadedPlugin.server_module = await import(pathToFileURL(serverPath).href);
        }
        loadedPlugin.status = "loaded";
        registry.set(id, loadedPlugin);
      } catch (err) {
        loadedPlugin.status = "error";
        loadedPlugin.error = `Failed to load module: ${String(err)}`;
        errors.set(id, loadedPlugin.error);
      }
    }
    return Array.from(registry.values());
  }
  async function ensureLoaded() {
    if (!loaded) {
      await load();
    }
  }
  return {
    async discover() {
      const localErrors = /* @__PURE__ */ new Map();
      const scanned = scanDirectory(pluginsDir, localErrors);
      return scanned.map(({ id, manifest, pluginDir }) => ({
        id,
        manifest,
        manifestPath: path.join(pluginDir, "plugin.json")
      }));
    },
    load,
    async reload() {
      loaded = false;
      return load();
    },
    getPlugin(id) {
      return registry.get(id);
    },
    getAllPlugins() {
      return Array.from(registry.values());
    },
    async unload(id) {
      registry.delete(id);
      errors.delete(id);
    },
    async getErrors() {
      await ensureLoaded();
      return errors;
    }
  };
}

// ../core/dist/data-bus.js
function makeMessage(channel, pluginId, data) {
  const frozenData = Object.freeze(typeof data === "object" && data !== null ? { ...data } : data);
  return Object.freeze({
    channel,
    plugin_id: pluginId,
    data: frozenData,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}
function safeCall(cb, ...args) {
  try {
    cb(...args);
  } catch {
  }
}
function createDataBus() {
  const channels = /* @__PURE__ */ new Map();
  const subscribers = /* @__PURE__ */ new Map();
  const globalListeners = /* @__PURE__ */ new Set();
  let closed = false;
  return {
    publish(channel, pluginId, data) {
      if (closed)
        return;
      const msg = makeMessage(channel, pluginId, data);
      channels.set(channel, msg);
      const subs = subscribers.get(channel);
      if (subs) {
        for (const cb of [...subs]) {
          safeCall(cb, msg);
        }
      }
      for (const cb of [...globalListeners]) {
        safeCall(cb, msg);
      }
    },
    subscribe(channel, callback) {
      if (!subscribers.has(channel)) {
        subscribers.set(channel, /* @__PURE__ */ new Set());
      }
      subscribers.get(channel).add(callback);
      return () => {
        subscribers.get(channel)?.delete(callback);
      };
    },
    getLatest(channel) {
      return channels.get(channel);
    },
    getChannels() {
      return Array.from(channels.keys());
    },
    onMessage(callback) {
      globalListeners.add(callback);
      return () => {
        globalListeners.delete(callback);
      };
    },
    clear() {
      channels.clear();
      subscribers.clear();
      globalListeners.clear();
    },
    close() {
      closed = true;
      channels.clear();
      subscribers.clear();
      globalListeners.clear();
    }
  };
}

// ../core/dist/database.js
import Database from "better-sqlite3";
var DEFAULT_PATH = "data/lensing.db";
var MIGRATIONS = [
  {
    version: 1,
    description: "initial schema",
    sql: `
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS layouts (
        name TEXT PRIMARY KEY,
        config TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS plugin_state (
        plugin_id TEXT PRIMARY KEY,
        state TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `
  },
  {
    version: 2,
    description: "add scene schedules table",
    sql: `
      CREATE TABLE IF NOT EXISTS scene_schedules (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        schedule TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `
  }
];
function createDatabase(options = {}) {
  const path5 = options.path ?? DEFAULT_PATH;
  const db = new Database(path5);
  db.pragma("journal_mode = WAL");
  const currentVersion = db.pragma("user_version", { simple: true }) ?? 0;
  const maxKnownVersion = MIGRATIONS[MIGRATIONS.length - 1]?.version ?? 0;
  if (currentVersion > maxKnownVersion) {
    db.close();
    throw new Error(`Database schema version ${currentVersion} is higher than known version ${maxKnownVersion}. This binary is too old to open this database.`);
  }
  for (const migration of MIGRATIONS) {
    if (migration.version > currentVersion) {
      try {
        db.exec("BEGIN TRANSACTION");
        db.exec(migration.sql);
        db.pragma(`user_version = ${migration.version}`);
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        db.close();
        throw error;
      }
    }
  }
  const instance = {
    getSchemaVersion() {
      return db.pragma("user_version", { simple: true });
    },
    getMigrations() {
      const version = db.pragma("user_version", { simple: true });
      return MIGRATIONS.filter((m) => m.version <= version).map(({ version: v, description }) => ({
        version: v,
        description
      }));
    },
    // --- Settings ---
    getSetting(key) {
      const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(key);
      return row?.value;
    },
    setSetting(key, value) {
      db.prepare(`
        INSERT INTO settings (key, value, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).run(key, value);
    },
    getAllSettings() {
      const rows = db.prepare("SELECT key, value FROM settings").all();
      const result = /* @__PURE__ */ Object.create(null);
      for (const row of rows) {
        result[row.key] = row.value;
      }
      return result;
    },
    deleteSetting(key) {
      const info = db.prepare("DELETE FROM settings WHERE key = ?").run(key);
      return info.changes > 0;
    },
    // --- Layouts ---
    getLayout(name) {
      const row = db.prepare("SELECT config FROM layouts WHERE name = ?").get(name);
      if (!row)
        return void 0;
      return JSON.parse(row.config);
    },
    setLayout(name, zones) {
      db.prepare(`
        INSERT INTO layouts (name, config, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(name) DO UPDATE SET config = excluded.config, updated_at = excluded.updated_at
      `).run(name, JSON.stringify(zones));
    },
    getAllLayouts() {
      const rows = db.prepare("SELECT name, config FROM layouts").all();
      const result = /* @__PURE__ */ Object.create(null);
      for (const row of rows) {
        result[row.name] = JSON.parse(row.config);
      }
      return result;
    },
    deleteLayout(name) {
      const info = db.prepare("DELETE FROM layouts WHERE name = ?").run(name);
      return info.changes > 0;
    },
    // --- Plugin state ---
    getPluginState(pluginId) {
      const row = db.prepare("SELECT state FROM plugin_state WHERE plugin_id = ?").get(pluginId);
      if (!row)
        return void 0;
      return JSON.parse(row.state);
    },
    setPluginState(pluginId, state) {
      db.prepare(`
        INSERT INTO plugin_state (plugin_id, state, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(plugin_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at
      `).run(pluginId, JSON.stringify(state));
    },
    getAllPluginStates() {
      const rows = db.prepare("SELECT plugin_id, state FROM plugin_state").all();
      const result = /* @__PURE__ */ Object.create(null);
      for (const row of rows) {
        result[row.plugin_id] = JSON.parse(row.state);
      }
      return result;
    },
    deletePluginState(pluginId) {
      const info = db.prepare("DELETE FROM plugin_state WHERE plugin_id = ?").run(pluginId);
      return info.changes > 0;
    },
    // --- Scene Schedules ---
    getSchedule(id) {
      const row = db.prepare("SELECT schedule, created_at FROM scene_schedules WHERE id = ?").get(id);
      if (!row)
        return void 0;
      const parsed = JSON.parse(row.schedule);
      return {
        ...parsed,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(parsed.updatedAt)
      };
    },
    setSchedule(schedule) {
      db.prepare(`
        INSERT INTO scene_schedules (id, name, schedule, created_at, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET name = excluded.name, schedule = excluded.schedule, updated_at = excluded.updated_at
      `).run(schedule.id, schedule.name, JSON.stringify({
        id: schedule.id,
        name: schedule.name,
        entries: schedule.entries,
        updatedAt: schedule.updatedAt
      }), schedule.createdAt.toISOString());
    },
    getAllSchedules() {
      const rows = db.prepare("SELECT id, schedule, created_at FROM scene_schedules").all();
      const result = /* @__PURE__ */ Object.create(null);
      for (const row of rows) {
        const parsed = JSON.parse(row.schedule);
        result[row.id] = {
          ...parsed,
          createdAt: new Date(row.created_at),
          updatedAt: new Date(parsed.updatedAt)
        };
      }
      return result;
    },
    deleteSchedule(id) {
      const info = db.prepare("DELETE FROM scene_schedules WHERE id = ?").run(id);
      return info.changes > 0;
    },
    close() {
      db.close();
    }
  };
  return instance;
}

// ../core/dist/allergies-server.js
var PLUGIN_ID = "allergies-server";
var DATA_BUS_CHANNEL = "allergies.current";
var DEFAULT_ALERT_THRESHOLD = 3;
var DEFAULT_MAX_STALE_MS2 = 36e5;
function clampLevel(n) {
  if (!Number.isFinite(n))
    return 0;
  const clamped = Math.max(0, Math.min(5, Math.round(n)));
  return clamped;
}
function normalizeCategory(cat) {
  if (typeof cat !== "string")
    return "other";
  const lower = cat.toLowerCase();
  if (lower === "mold")
    return "mold";
  if (lower === "dust")
    return "dust";
  if (lower === "pollen")
    return "pollen";
  return "other";
}
function transformResponse(raw) {
  const allergens = (raw.current.allergens ?? []).map((a) => ({
    name: a.name,
    level: clampLevel(a.level),
    category: normalizeCategory(a.category)
  }));
  return {
    index: clampLevel(raw.current.idx),
    allergens,
    lastUpdated: Date.now()
  };
}
function createAllergiesServer(options) {
  const { apiKey, location, dataBus, notifications, fetchFn = fetch, alertThreshold = DEFAULT_ALERT_THRESHOLD, maxStale_ms = DEFAULT_MAX_STALE_MS2 } = options;
  if (!apiKey) {
    throw new Error("AllergiesServer: apiKey is required");
  }
  if (!Number.isFinite(location?.lat) || !Number.isFinite(location?.lon)) {
    throw new Error("AllergiesServer: location is required");
  }
  let lastData = null;
  let lastFetchedAt = null;
  let closed = false;
  const updateListeners = [];
  const errorListeners = [];
  const notificationQueue = notifications;
  function notifyUpdate(data) {
    for (const cb of updateListeners) {
      try {
        cb(data);
      } catch {
      }
    }
  }
  function notifyError(message) {
    for (const cb of errorListeners) {
      try {
        cb(message);
      } catch {
      }
    }
  }
  function buildUrl() {
    return `https://api.ambeedata.com/latest/pollen?lat=${location.lat}&lng=${location.lon}&x-api-key=${apiKey}`;
  }
  function checkAndEmitAlert(data) {
    if (data.index >= alertThreshold) {
      const emitOptions = {
        source: PLUGIN_ID,
        priority: data.index >= 4 ? "urgent" : "warning",
        title: `High Pollen Alert \u2014 Level ${data.index}`,
        body: `Overall allergy index: ${data.index}/5`,
        dedupe_key: `${PLUGIN_ID}-alert`
      };
      notificationQueue.emit(emitOptions);
    }
  }
  async function refresh() {
    if (closed)
      return;
    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }
    let response;
    try {
      response = await fetchFn(buildUrl());
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Allergies fetch failed: ${message}`);
      return;
    }
    if (!response.ok) {
      notifyError(`Allergies API error ${response.status ?? ""}: ${response.statusText ?? "unknown"}`);
      return;
    }
    let raw;
    try {
      raw = await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Allergies response parse error: ${message}`);
      return;
    }
    if (!raw?.current) {
      notifyError("Allergies response missing required fields");
      return;
    }
    const data = transformResponse(raw);
    lastData = {
      index: data.index,
      allergens: data.allergens.map((a) => ({ ...a })),
      lastUpdated: data.lastUpdated
    };
    lastFetchedAt = Date.now();
    dataBus.publish(DATA_BUS_CHANNEL, PLUGIN_ID, data);
    checkAndEmitAlert(data);
    notifyUpdate(data);
  }
  return {
    refresh,
    getAllergyData() {
      if (!lastData)
        return null;
      return {
        index: lastData.index,
        allergens: lastData.allergens.map((a) => ({ ...a })),
        lastUpdated: lastData.lastUpdated
      };
    },
    onUpdate(callback) {
      updateListeners.push(callback);
      return () => {
        const idx = updateListeners.indexOf(callback);
        if (idx !== -1)
          updateListeners.splice(idx, 1);
      };
    },
    onError(callback) {
      errorListeners.push(callback);
    },
    close() {
      closed = true;
    }
  };
}

// ../core/dist/crypto-server.js
var PLUGIN_ID2 = "crypto-server";
var DATA_BUS_PRICES_CHANNEL = "crypto.prices";
var DATA_BUS_ALERTS_CHANNEL = "crypto.alerts";
var DEFAULT_MAX_STALE_MS3 = 3e5;
function safeNumber(val) {
  if (typeof val === "number" && Number.isFinite(val))
    return val;
  return 0;
}
function transformCoin(raw) {
  return {
    id: typeof raw.id === "string" ? raw.id : "",
    symbol: typeof raw.symbol === "string" ? raw.symbol : "",
    name: typeof raw.name === "string" ? raw.name : "",
    price: safeNumber(raw.current_price),
    change_1h: safeNumber(raw.price_change_percentage_1h_in_currency),
    change_24h: safeNumber(raw.price_change_percentage_24h_in_currency),
    change_7d: safeNumber(raw.price_change_percentage_7d_in_currency)
  };
}
function copyCoin(coin) {
  return { ...coin };
}
function createCryptoServer(options) {
  const { watchlist, alertConfigs = [], dataBus, notifications, fetchFn = fetch, maxStale_ms = DEFAULT_MAX_STALE_MS3 } = options;
  if (!watchlist || watchlist.length === 0) {
    throw new Error("CryptoServer: watchlist is required and must not be empty");
  }
  let lastData = null;
  let lastFetchedAt = null;
  let closed = false;
  let refreshing = false;
  const updateListeners = [];
  const errorListeners = [];
  const notificationQueue = notifications;
  function notifyUpdate(data) {
    for (const cb of [...updateListeners]) {
      try {
        cb(data);
      } catch {
      }
    }
  }
  function notifyError(message) {
    for (const cb of [...errorListeners]) {
      try {
        cb(message);
      } catch {
      }
    }
  }
  function buildUrl() {
    const ids = watchlist.join(",");
    return `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=1h,24h,7d`;
  }
  function getChangeForWindow(coin, window) {
    if (window === "1h")
      return coin.change_1h;
    if (window === "7d")
      return coin.change_7d;
    return coin.change_24h;
  }
  function checkAndEmitAlerts(coins) {
    for (const config of alertConfigs) {
      const coin = coins.find((c) => c.id === config.coinId);
      if (!coin)
        continue;
      const change = getChangeForWindow(coin, config.window);
      if (Math.abs(change) >= config.threshold_pct) {
        const direction = change >= 0 ? "+" : "";
        const emitOptions = {
          source: PLUGIN_ID2,
          priority: Math.abs(change) >= config.threshold_pct * 2 ? "urgent" : "warning",
          title: `${coin.name} moved ${direction}${change.toFixed(1)}% (${config.window})`,
          body: `${coin.name} is now $${coin.price.toLocaleString()}`,
          dedupe_key: `${PLUGIN_ID2}-alert-${config.coinId}-${config.window}`
        };
        notificationQueue.emit(emitOptions);
        dataBus.publish(DATA_BUS_ALERTS_CHANNEL, PLUGIN_ID2, {
          coinId: config.coinId,
          change,
          window: config.window,
          price: coin.price
        });
      }
    }
  }
  async function refresh() {
    if (closed)
      return;
    if (refreshing)
      return;
    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }
    refreshing = true;
    try {
      let response;
      try {
        response = await fetchFn(buildUrl());
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        notifyError(`Crypto fetch failed: ${message}`);
        return;
      }
      if (!response.ok) {
        notifyError(`Crypto API error ${response.status ?? ""}: ${response.statusText ?? "unknown"}`);
        return;
      }
      let raw;
      try {
        raw = await response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        notifyError(`Crypto response parse error: ${message}`);
        return;
      }
      if (!Array.isArray(raw)) {
        notifyError("Crypto response is not an array");
        return;
      }
      const coins = raw.map(transformCoin);
      const now = Date.now();
      lastData = {
        coins: coins.map(copyCoin),
        lastUpdated: now
      };
      lastFetchedAt = now;
      const publishData = {
        coins: coins.map(copyCoin),
        lastUpdated: now
      };
      dataBus.publish(DATA_BUS_PRICES_CHANNEL, PLUGIN_ID2, publishData);
      checkAndEmitAlerts(coins);
      notifyUpdate(publishData);
    } finally {
      refreshing = false;
    }
  }
  return {
    refresh,
    getPrices() {
      if (!lastData)
        return null;
      return {
        coins: lastData.coins.map(copyCoin),
        lastUpdated: lastData.lastUpdated
      };
    },
    onUpdate(callback) {
      updateListeners.push(callback);
      return () => {
        const idx = updateListeners.indexOf(callback);
        if (idx !== -1)
          updateListeners.splice(idx, 1);
      };
    },
    onError(callback) {
      errorListeners.push(callback);
    },
    close() {
      closed = true;
    }
  };
}

// ../core/dist/plugins/photo-slideshow/index.js
import fs3 from "fs";
import path2 from "path";

// ../types/dist/photo-slideshow.js
var SUPPORTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// ../types/dist/news.js
var DEFAULT_NEWS_MAX_ITEMS = 20;
var DEFAULT_NEWS_MAX_STALE_MS = 6e5;

// ../types/dist/sports.js
var DEFAULT_SPORTS_MAX_STALE_MS = 12e4;

// ../types/dist/home-assistant.js
var DEFAULT_HA_MAX_STALE_MS = 6e4;
var DEFAULT_HA_DOMAINS = [
  "light",
  "switch",
  "lock",
  "climate",
  "sensor",
  "binary_sensor"
];

// ../types/dist/pir-sensor.js
var DEFAULT_PIR_IDLE_TIMEOUT_MS = 5 * 6e4;
var DEFAULT_PIR_GPIO_PIN = 17;

// ../types/dist/module-settings.js
var MODULE_IDS = [
  "weather",
  "crypto",
  "news",
  "sports",
  "calendar",
  "home-assistant",
  "allergies",
  "pir",
  "photo-slideshow"
];
var MODULE_SCHEMAS = [
  {
    id: "weather",
    name: "Weather",
    description: "Current conditions and forecast via Open-Meteo (free) or OpenWeatherMap",
    fields: [
      {
        key: "provider",
        type: "select",
        label: "Provider",
        default: "open-meteo",
        category: "integration",
        options: [
          { label: "Open-Meteo (free, no key required)", value: "open-meteo" },
          { label: "OpenWeatherMap (requires API key)", value: "openweathermap" }
        ]
      },
      {
        key: "apiKey",
        type: "password",
        label: "API Key",
        description: "Required for OpenWeatherMap only",
        category: "integration"
      },
      {
        key: "lat",
        type: "number",
        label: "Latitude",
        required: true,
        min: -90,
        max: 90,
        category: "widget"
      },
      {
        key: "lon",
        type: "number",
        label: "Longitude",
        required: true,
        min: -180,
        max: 180,
        category: "widget"
      },
      {
        key: "units",
        type: "select",
        label: "Units",
        default: "imperial",
        category: "widget",
        options: [
          { label: "Imperial (\xB0F)", value: "imperial" },
          { label: "Metric (\xB0C)", value: "metric" }
        ]
      }
    ]
  },
  {
    id: "crypto",
    name: "Crypto Prices",
    description: "Cryptocurrency price tracker via CoinGecko",
    fields: [
      {
        key: "watchlist",
        type: "string",
        label: "Watchlist",
        description: "Comma-separated coin IDs (e.g. bitcoin,ethereum,solana)",
        default: "bitcoin,ethereum",
        category: "widget"
      }
    ]
  },
  {
    id: "news",
    name: "News Headlines",
    description: "RSS feed aggregator for news headlines",
    fields: [
      {
        key: "feedUrls",
        type: "string",
        label: "Feed URLs",
        description: "Comma-separated RSS feed URLs",
        required: true,
        category: "widget"
      },
      {
        key: "maxItems",
        type: "number",
        label: "Max Items",
        default: 20,
        min: 1,
        max: 100,
        category: "widget"
      }
    ]
  },
  {
    id: "sports",
    name: "Sports Scores",
    description: "Live scores from ESPN",
    fields: [
      {
        key: "leagues",
        type: "string",
        label: "Leagues",
        description: "Comma-separated league IDs (e.g. nfl,nba,mlb)",
        default: "nfl,nba",
        category: "widget"
      }
    ]
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "CalDAV calendar event sync",
    fields: [
      {
        key: "serverUrl",
        type: "string",
        label: "Server URL",
        description: "CalDAV server URL (e.g. https://caldav.icloud.com)",
        required: true,
        category: "integration"
      },
      {
        key: "username",
        type: "string",
        label: "Username",
        required: true,
        category: "integration"
      },
      {
        key: "password",
        type: "password",
        label: "Password",
        required: true,
        category: "integration"
      },
      {
        key: "calendarPath",
        type: "string",
        label: "Calendar Path",
        description: "Collection path (e.g. /calendars/user@icloud.com/calendar/)",
        required: true,
        category: "widget"
      },
      {
        key: "rangeDays",
        type: "number",
        label: "Days Ahead",
        default: 7,
        min: 1,
        max: 90,
        category: "widget"
      }
    ]
  },
  {
    id: "home-assistant",
    name: "Home Assistant",
    description: "Smart home entity state via Home Assistant API",
    fields: [
      {
        key: "url",
        type: "string",
        label: "URL",
        description: "Home Assistant base URL (e.g. http://homeassistant.local:8123)",
        required: true,
        category: "integration"
      },
      {
        key: "token",
        type: "password",
        label: "Access Token",
        description: "Long-lived access token",
        required: true,
        category: "integration"
      },
      {
        key: "domains",
        type: "string",
        label: "Domains",
        description: "Comma-separated entity domains (e.g. light,switch,sensor)",
        default: "light,switch,lock,climate,sensor,binary_sensor",
        category: "widget"
      }
    ]
  },
  {
    id: "allergies",
    name: "Allergies / Pollen",
    description: "Pollen and allergen index monitoring",
    fields: [
      {
        key: "apiKey",
        type: "password",
        label: "API Key",
        required: true,
        category: "integration"
      },
      {
        key: "lat",
        type: "number",
        label: "Latitude",
        required: true,
        min: -90,
        max: 90,
        category: "widget"
      },
      {
        key: "lon",
        type: "number",
        label: "Longitude",
        required: true,
        min: -180,
        max: 180,
        category: "widget"
      },
      {
        key: "alertThreshold",
        type: "number",
        label: "Alert Threshold",
        description: "Notify when index reaches this level (0-5)",
        default: 3,
        min: 0,
        max: 5,
        category: "widget"
      }
    ]
  },
  {
    id: "pir",
    name: "PIR Sensor",
    description: "Motion detection via GPIO PIR sensor",
    fields: [
      {
        key: "idleTimeout_ms",
        type: "number",
        label: "Idle Timeout (ms)",
        description: "Milliseconds without motion before idle state",
        default: 3e5,
        min: 1e3,
        category: "widget"
      }
    ]
  },
  {
    id: "photo-slideshow",
    name: "Photo Slideshow",
    description: "Ambient photo slideshow from a local directory",
    fields: [
      {
        key: "photoDirectory",
        type: "string",
        label: "Photo Directory",
        description: "Absolute path to the directory containing photos",
        required: true,
        category: "integration"
      }
    ]
  }
];
function getIntegrationFields(schema) {
  return schema.fields.filter((f) => f.category === "integration");
}

// ../core/dist/plugins/photo-slideshow/index.js
function discoverPhotos(dir) {
  if (!fs3.existsSync(dir))
    return [];
  const files = fs3.readdirSync(dir);
  return files.filter((f) => SUPPORTED_IMAGE_EXTENSIONS.includes(path2.extname(f).toLowerCase())).map((f) => path2.join(dir, f));
}

// ../core/dist/news-server.js
var PLUGIN_ID3 = "news-server";
var DATA_BUS_HEADLINES_CHANNEL = "news.headlines";
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, "");
}
function decodeEntities(str) {
  return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
}
function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1].trim() : "";
}
function extractCdata(str) {
  const match = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return match ? match[1] : str;
}
function parseDate(pubDate) {
  if (!pubDate)
    return Date.now();
  const ts = Date.parse(pubDate);
  return Number.isFinite(ts) ? ts : Date.now();
}
function parseChannelTitle(xml) {
  const channelMatch = xml.match(/<channel[^>]*>([\s\S]*?)<\/channel>/i);
  if (!channelMatch)
    return "";
  const channelContent = channelMatch[1];
  const beforeFirstItem = channelContent.split(/<item/i)[0];
  return decodeEntities(extractCdata(extractTag(beforeFirstItem, "title"))).trim();
}
function parseItems(xml, feedUrl, category, source) {
  const items = [];
  const itemPattern = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let match;
  let index = 0;
  while ((match = itemPattern.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = decodeEntities(extractCdata(extractTag(itemXml, "title")));
    const rawDesc = extractCdata(extractTag(itemXml, "description"));
    const summary = stripHtml(decodeEntities(rawDesc)).trim();
    const link = extractCdata(extractTag(itemXml, "link")).trim() || extractTag(itemXml, "guid").trim();
    const pubDate = extractCdata(extractTag(itemXml, "pubDate"));
    items.push({
      id: `${feedUrl}#${index++}`,
      title,
      summary,
      link,
      published: parseDate(pubDate),
      source,
      category
    });
  }
  return items;
}
function parseRss(xml, feedUrl, category) {
  const channelTitle = parseChannelTitle(xml) || feedUrl;
  const articles = parseItems(xml, feedUrl, category, channelTitle);
  return { title: channelTitle, articles };
}
function copyArticle(a) {
  return { ...a };
}
function copyData(d) {
  return {
    articles: d.articles.map(copyArticle),
    lastUpdated: d.lastUpdated
  };
}
function createNewsServer(options) {
  const { feedUrls, categories = {}, dataBus, notifications: _notifications, maxItems = DEFAULT_NEWS_MAX_ITEMS, maxStale_ms = DEFAULT_NEWS_MAX_STALE_MS, fetchFn } = options;
  if (!feedUrls || feedUrls.length === 0) {
    throw new Error("NewsServer: feedUrls is required and must not be empty");
  }
  if (!Number.isFinite(maxItems) || maxItems < 1) {
    throw new Error(`NewsServer: maxItems must be a positive number, got ${maxItems}`);
  }
  const effectiveFetch = fetchFn ?? fetch;
  const _notificationQueue = _notifications;
  let lastData = null;
  let lastFetchedAt = null;
  let closed = false;
  let refreshing = false;
  const updateListeners = [];
  const errorListeners = [];
  function notifyUpdate(data) {
    for (const cb of [...updateListeners]) {
      try {
        cb(data);
      } catch {
      }
    }
  }
  function notifyError(message) {
    for (const cb of [...errorListeners]) {
      try {
        cb(message);
      } catch {
      }
    }
  }
  async function fetchFeed(url) {
    let response;
    try {
      response = await effectiveFetch(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`News fetch failed: ${message}`);
      return null;
    }
    if (!response.ok) {
      notifyError(`News feed error ${response.status ?? ""}: ${response.statusText ?? "unknown"}`);
      return null;
    }
    let xml;
    try {
      xml = await response.text();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`News body read failed: ${message}`);
      return null;
    }
    const category = categories[url] ?? "general";
    const { articles } = parseRss(xml, url, category);
    return articles;
  }
  async function refresh() {
    if (closed)
      return;
    if (refreshing)
      return;
    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }
    refreshing = true;
    try {
      const allArticles = [];
      let anySuccess = false;
      for (const url of feedUrls) {
        const articles = await fetchFeed(url);
        if (articles !== null) {
          allArticles.push(...articles);
          anySuccess = true;
        }
      }
      if (!anySuccess) {
        return;
      }
      const now = Date.now();
      const trimmed = allArticles.slice(0, maxItems);
      lastData = {
        articles: trimmed.map(copyArticle),
        lastUpdated: now
      };
      lastFetchedAt = now;
      const publishData = {
        articles: trimmed.map(copyArticle),
        lastUpdated: now
      };
      dataBus.publish(DATA_BUS_HEADLINES_CHANNEL, PLUGIN_ID3, publishData);
      notifyUpdate(publishData);
    } finally {
      refreshing = false;
    }
  }
  return {
    refresh,
    getHeadlines() {
      if (!lastData)
        return null;
      return copyData(lastData);
    },
    onUpdate(callback) {
      updateListeners.push(callback);
      return () => {
        const idx = updateListeners.indexOf(callback);
        if (idx !== -1)
          updateListeners.splice(idx, 1);
      };
    },
    onError(callback) {
      errorListeners.push(callback);
    },
    close() {
      closed = true;
    }
  };
}

// ../core/dist/sports-server.js
var PLUGIN_ID4 = "sports-server";
var DATA_BUS_SCORES_CHANNEL = "sports.scores";
function buildEspnUrl(sport, league) {
  return `https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`;
}
var FETCH_TIMEOUT_MS = 1e4;
function mapStatus(state, completed) {
  if (completed)
    return "final";
  if (state === "in")
    return "in_progress";
  return "scheduled";
}
function safeScore(score) {
  const n = Number(score);
  return Number.isFinite(n) ? n : 0;
}
function transformEvent(event, league) {
  const competition = event.competitions[0];
  const home = competition?.competitors.find((c) => c.homeAway === "home");
  const away = competition?.competitors.find((c) => c.homeAway === "away");
  const statusType = event.status.type;
  const period = competition?.status?.period;
  const clock = competition?.status?.displayClock;
  const periodStr = statusType.state === "in" && period ? `${period > 0 ? period : ""}${clock ? " " + clock : ""}`.trim() : statusType.description;
  return {
    id: event.id,
    league,
    homeTeam: home?.team.displayName ?? "",
    awayTeam: away?.team.displayName ?? "",
    homeScore: safeScore(home?.score),
    awayScore: safeScore(away?.score),
    status: mapStatus(statusType.state, statusType.completed),
    startTime: competition?.date ? Date.parse(competition.date) : Date.now(),
    period: periodStr,
    venue: competition?.venue?.fullName
  };
}
function transformScoreboard(data, league) {
  if (!Array.isArray(data.events))
    return [];
  const games = [];
  for (const event of data.events) {
    try {
      games.push(transformEvent(event, league));
    } catch {
    }
  }
  return games;
}
function copyGame(g) {
  return { ...g };
}
function copyData2(d) {
  return {
    games: d.games.map(copyGame),
    lastUpdated: d.lastUpdated
  };
}
function createSportsServer(options) {
  const { leagues, dataBus, notifications: _notifications, maxStale_ms = DEFAULT_SPORTS_MAX_STALE_MS, fetchFn } = options;
  if (!leagues || leagues.length === 0) {
    throw new Error("SportsServer: leagues is required and must not be empty");
  }
  const effectiveFetch = fetchFn ?? fetch;
  const _notificationQueue = _notifications;
  let lastData = null;
  let lastFetchedAt = null;
  let closed = false;
  let refreshing = false;
  const updateListeners = [];
  const errorListeners = [];
  function notifyUpdate(data) {
    for (const cb of [...updateListeners]) {
      try {
        cb(data);
      } catch {
      }
    }
  }
  function notifyError(message) {
    for (const cb of [...errorListeners]) {
      try {
        cb(message);
      } catch {
      }
    }
  }
  async function fetchLeague(sport, league) {
    const url = buildEspnUrl(sport, league);
    let response;
    try {
      response = await Promise.race([
        effectiveFetch(url),
        new Promise((_, reject) => setTimeout(() => reject(new Error(`timeout after ${FETCH_TIMEOUT_MS}ms`)), FETCH_TIMEOUT_MS))
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Sports fetch failed [${league}]: ${message}`);
      return null;
    }
    if (!response.ok) {
      notifyError(`Sports API error ${response.status ?? ""} [${league}]: ${response.statusText ?? "unknown"}`);
      return null;
    }
    let raw;
    try {
      raw = await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Sports response parse error [${league}]: ${message}`);
      return null;
    }
    return transformScoreboard(raw, league);
  }
  async function refresh() {
    if (closed)
      return;
    if (refreshing)
      return;
    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }
    refreshing = true;
    try {
      const allGames = [];
      let anySuccess = false;
      for (const { sport, league } of leagues) {
        const games = await fetchLeague(sport, league);
        if (games !== null) {
          allGames.push(...games);
          anySuccess = true;
        }
      }
      if (!anySuccess) {
        return;
      }
      const now = Date.now();
      lastData = {
        games: allGames.map(copyGame),
        lastUpdated: now
      };
      lastFetchedAt = now;
      const publishData = {
        games: allGames.map(copyGame),
        lastUpdated: now
      };
      dataBus.publish(DATA_BUS_SCORES_CHANNEL, PLUGIN_ID4, publishData);
      notifyUpdate(publishData);
    } finally {
      refreshing = false;
    }
  }
  return {
    refresh,
    getScores() {
      if (!lastData)
        return null;
      return copyData2(lastData);
    },
    onUpdate(callback) {
      updateListeners.push(callback);
      return () => {
        const idx = updateListeners.indexOf(callback);
        if (idx !== -1)
          updateListeners.splice(idx, 1);
      };
    },
    onError(callback) {
      errorListeners.push(callback);
    },
    close() {
      closed = true;
    }
  };
}

// ../core/dist/home-assistant-server.js
var PLUGIN_ID5 = "home-assistant-server";
var DATA_BUS_DEVICES_CHANNEL = "home.devices";
var DATA_BUS_SENSORS_CHANNEL = "home.sensors";
var SENSOR_DOMAINS = /* @__PURE__ */ new Set(["sensor", "binary_sensor"]);
function transformEntity(raw) {
  const domain = raw.entity_id.split(".")[0] ?? "";
  const friendly_name = typeof raw.attributes.friendly_name === "string" ? raw.attributes.friendly_name : raw.entity_id;
  return {
    entity_id: raw.entity_id,
    state: raw.state,
    domain,
    friendly_name,
    attributes: { ...raw.attributes },
    last_changed: Date.parse(raw.last_changed),
    last_updated: Date.parse(raw.last_updated)
  };
}
function copyEntity(e) {
  return { ...e, attributes: { ...e.attributes } };
}
function copyData3(d) {
  return {
    devices: d.devices.map(copyEntity),
    sensors: d.sensors.map(copyEntity),
    lastUpdated: d.lastUpdated
  };
}
function createHomeAssistantServer(options) {
  const { url, token, dataBus, maxStale_ms = DEFAULT_HA_MAX_STALE_MS, fetchFn, domains, wsFn } = options;
  const effectiveFetch = fetchFn ?? fetch;
  const activeDomains = domains ?? DEFAULT_HA_DOMAINS;
  const activeDomainSet = activeDomains.length > 0 ? new Set(activeDomains) : null;
  let lastData = null;
  let lastFetchedAt = null;
  let closed = false;
  let refreshing = false;
  let currentWs = null;
  const updateListeners = [];
  const errorListeners = [];
  function notifyUpdate(data) {
    for (const cb of [...updateListeners]) {
      try {
        cb(data);
      } catch {
      }
    }
  }
  function notifyError(message) {
    for (const cb of [...errorListeners]) {
      try {
        cb(message);
      } catch {
      }
    }
  }
  function publishAndNotify(data) {
    dataBus.publish(DATA_BUS_DEVICES_CHANNEL, PLUGIN_ID5, data);
    dataBus.publish(DATA_BUS_SENSORS_CHANNEL, PLUGIN_ID5, data);
    notifyUpdate(data);
  }
  function handleStateChanged(raw) {
    if (!lastData) {
      lastData = { devices: [], sensors: [], lastUpdated: Date.now() };
    }
    const entity = transformEntity(raw);
    if (activeDomainSet !== null && !activeDomainSet.has(entity.domain)) {
      return;
    }
    const isSensor = SENSOR_DOMAINS.has(entity.domain);
    if (isSensor) {
      const idx = lastData.sensors.findIndex((e) => e.entity_id === entity.entity_id);
      if (idx !== -1) {
        lastData.sensors[idx] = copyEntity(entity);
      } else {
        lastData.sensors.push(copyEntity(entity));
      }
    } else {
      const idx = lastData.devices.findIndex((e) => e.entity_id === entity.entity_id);
      if (idx !== -1) {
        lastData.devices[idx] = copyEntity(entity);
      } else {
        lastData.devices.push(copyEntity(entity));
      }
    }
    lastData.lastUpdated = Date.now();
    const publishData = copyData3(lastData);
    publishAndNotify(publishData);
  }
  function connectWs() {
    if (!wsFn)
      return;
    if (closed)
      return;
    const wsUrl = url.replace(/^https:\/\//, "wss://").replace(/^http:\/\//, "ws://") + "/api/websocket";
    const ws = wsFn(wsUrl);
    currentWs = ws;
    ws.onopen = () => {
    };
    ws.onmessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }
      const type = msg.type;
      if (type === "auth_required") {
        ws.send(JSON.stringify({ type: "auth", access_token: token }));
      } else if (type === "auth_ok") {
        ws.send(JSON.stringify({ type: "subscribe_events", id: 1, event_type: "state_changed" }));
      } else if (type === "auth_invalid") {
        const message = typeof msg.message === "string" ? msg.message : "Authentication failed";
        notifyError(`Home Assistant auth error: ${message}`);
      } else if (type === "event") {
        const event2 = msg.event;
        if (!event2)
          return;
        const eventType = event2.event_type;
        if (eventType !== "state_changed")
          return;
        const data = event2.data;
        if (!data)
          return;
        const newState = data.new_state;
        if (newState === null || newState === void 0)
          return;
        handleStateChanged(newState);
      }
    };
    ws.onclose = (closeEvent) => {
      const code = closeEvent?.code ?? 1e3;
      if (code !== 1e3 && !closed) {
        setTimeout(() => connectWs(), 3e3);
      }
    };
    ws.onerror = (_event) => {
    };
  }
  async function refresh() {
    if (closed)
      return;
    if (refreshing)
      return;
    if (lastFetchedAt !== null && maxStale_ms > 0 && Date.now() - lastFetchedAt < maxStale_ms) {
      return;
    }
    refreshing = true;
    try {
      let response;
      try {
        response = await effectiveFetch(`${url}/api/states`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        notifyError(`Home Assistant fetch failed: ${message}`);
        return;
      }
      if (!response.ok) {
        notifyError(`Home Assistant API error ${response.status ?? ""}: ${response.statusText ?? "unknown"}`);
        return;
      }
      let raw;
      try {
        raw = await response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        notifyError(`Home Assistant response parse error: ${message}`);
        return;
      }
      if (!Array.isArray(raw)) {
        notifyError("Home Assistant response parse error: expected array of states");
        return;
      }
      const rawStates = raw;
      let entities = rawStates.map(transformEntity);
      if (activeDomainSet !== null) {
        entities = entities.filter((e) => activeDomainSet.has(e.domain));
      }
      const sensors = entities.filter((e) => SENSOR_DOMAINS.has(e.domain));
      const devices = entities.filter((e) => !SENSOR_DOMAINS.has(e.domain));
      const now = Date.now();
      lastData = {
        devices: devices.map(copyEntity),
        sensors: sensors.map(copyEntity),
        lastUpdated: now
      };
      lastFetchedAt = now;
      const publishData = {
        devices: devices.map(copyEntity),
        sensors: sensors.map(copyEntity),
        lastUpdated: now
      };
      dataBus.publish(DATA_BUS_DEVICES_CHANNEL, PLUGIN_ID5, publishData);
      dataBus.publish(DATA_BUS_SENSORS_CHANNEL, PLUGIN_ID5, publishData);
      notifyUpdate(publishData);
    } finally {
      refreshing = false;
    }
  }
  if (wsFn) {
    connectWs();
  }
  return {
    refresh,
    getData() {
      if (!lastData)
        return null;
      return copyData3(lastData);
    },
    onUpdate(callback) {
      updateListeners.push(callback);
      return () => {
        const idx = updateListeners.indexOf(callback);
        if (idx !== -1)
          updateListeners.splice(idx, 1);
      };
    },
    onError(callback) {
      errorListeners.push(callback);
    },
    close() {
      closed = true;
      currentWs?.close();
    }
  };
}

// ../core/dist/pir-server.js
var PLUGIN_ID6 = "pir-sensor";
var DATA_BUS_CHANNEL2 = "presence.pir";
function createPIRServer(options) {
  const { dataBus, gpioFactory, gpioPin = DEFAULT_PIR_GPIO_PIN, idleTimeout_ms = DEFAULT_PIR_IDLE_TIMEOUT_MS } = options;
  let closed = false;
  let watcher = null;
  let idleTimer = null;
  let startupError = null;
  const updateListeners = [];
  const errorListeners = [];
  let presenceData = {
    detected: false,
    lastMotionAt: 0,
    available: false,
    lastUpdated: Date.now()
  };
  function notifyUpdate(data) {
    for (const cb of [...updateListeners]) {
      try {
        cb(data);
      } catch {
      }
    }
  }
  function notifyError(message) {
    for (const cb of [...errorListeners]) {
      try {
        cb(message);
      } catch {
      }
    }
  }
  function copyData4(d) {
    return { ...d };
  }
  function publishAndNotify(data) {
    try {
      dataBus.publish(DATA_BUS_CHANNEL2, PLUGIN_ID6, data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      notifyError(`Data bus publish error: ${message}`);
    }
    notifyUpdate(data);
  }
  function clearIdleTimer() {
    if (idleTimer !== null) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  }
  function scheduleIdle() {
    clearIdleTimer();
    idleTimer = setTimeout(() => {
      if (closed)
        return;
      presenceData = {
        ...presenceData,
        detected: false,
        lastUpdated: Date.now()
      };
      publishAndNotify(copyData4(presenceData));
    }, idleTimeout_ms);
  }
  function handleGpioValue(value) {
    if (closed)
      return;
    if (value === 1) {
      const now = Date.now();
      presenceData = {
        ...presenceData,
        detected: true,
        lastMotionAt: now,
        lastUpdated: now
      };
      publishAndNotify(copyData4(presenceData));
      scheduleIdle();
    }
  }
  if (gpioFactory) {
    try {
      watcher = gpioFactory(gpioPin);
      presenceData = { ...presenceData, available: true };
      watcher.watch(handleGpioValue);
    } catch (err) {
      if (watcher !== null) {
        try {
          watcher.close();
        } catch {
        }
        watcher = null;
      }
      const message = err instanceof Error ? err.message : String(err);
      presenceData = { ...presenceData, available: false };
      startupError = `GPIO error: ${message}`;
    }
  }
  return {
    getData() {
      return copyData4(presenceData);
    },
    onUpdate(callback) {
      updateListeners.push(callback);
      return () => {
        const idx = updateListeners.indexOf(callback);
        if (idx !== -1)
          updateListeners.splice(idx, 1);
      };
    },
    onError(callback) {
      errorListeners.push(callback);
      if (startupError !== null) {
        try {
          callback(startupError);
        } catch {
        }
      }
    },
    close() {
      closed = true;
      clearIdleTimer();
      try {
        watcher?.close();
      } catch {
      }
    }
  };
}

// ../core/dist/module-settings.js
function readModuleConfig(db, schema) {
  const prefix = schema.id;
  const enabledRaw = db.getSetting(`${prefix}.enabled`);
  const enabled = enabledRaw === "true";
  const values = {};
  for (const field of schema.fields) {
    const raw = db.getSetting(`${prefix}.${field.key}`);
    if (raw !== void 0) {
      values[field.key] = coerceValue(raw, field.type);
    } else if (field.default !== void 0) {
      values[field.key] = field.default;
    }
  }
  return { enabled, values };
}
function coerceValue(raw, type) {
  if (type === "number") {
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : 0;
  }
  if (type === "boolean") {
    return raw === "true";
  }
  return raw;
}

// ../core/dist/photo-slideshow-server.js
import path3 from "path";
function createPhotoSlideshowServer(opts) {
  if (!opts.photoDir) {
    throw new Error("photoDir is required");
  }
  let photoPaths = [];
  return {
    async refresh() {
      const fsPaths = discoverPhotos(opts.photoDir);
      photoPaths = fsPaths.map((p) => `/photos/${path3.basename(p)}`);
      opts.dataBus.publish("photos.paths", "photo-slideshow-server", {
        photoPaths,
        lastUpdated: Date.now()
      });
    },
    close() {
    },
    getPhotoPaths() {
      return photoPaths;
    }
  };
}

// ../core/dist/module-boot.js
var MODULE_REFRESH_MS = {
  weather: 36e5,
  // 1 hour
  crypto: 3e5,
  // 5 min
  news: 6e5,
  // 10 min
  sports: 12e4,
  // 2 min
  calendar: 36e5,
  // 1 hour
  "home-assistant": 6e4,
  // 1 min
  allergies: 36e5,
  // 1 hour
  // pir: event-driven, no polling
  "photo-slideshow": 6e5
  // 10 min
};
function rebootModule(id, modules, db, deps, log) {
  const existingIdx = modules.findIndex((m) => m.id === id);
  if (existingIdx !== -1) {
    const existing = modules[existingIdx];
    if (existing.timer !== void 0) {
      clearInterval(existing.timer);
    }
    try {
      existing.instance.close();
    } catch (err) {
      log?.error(`Module close failed: ${id}`, err);
    }
    modules.splice(existingIdx, 1);
  }
  const schema = MODULE_SCHEMAS.find((s) => s.id === id);
  if (!schema)
    return null;
  const config = readModuleConfig(db, schema);
  const instance = bootModule(id, config.values, deps);
  if (!instance)
    return null;
  const booted = { id, instance };
  startPolling(booted, log);
  modules.push(booted);
  log?.info(`Module rebooted: ${id}`);
  return booted;
}
function startPolling(booted, log) {
  const { id, instance } = booted;
  if (!instance.refresh)
    return;
  instance.refresh().catch((err) => log?.error(`Initial refresh failed: ${id}`, err));
  const interval = MODULE_REFRESH_MS[id];
  if (interval !== void 0) {
    booted.timer = setInterval(() => {
      instance.refresh().catch((err) => log?.error(`Refresh failed: ${id}`, err));
    }, interval);
  }
}
function syncModulesWithLayout(layoutIds, modules, db, deps, log) {
  const builtinIds = new Set(MODULE_IDS);
  const desiredIds = new Set(layoutIds.filter((id) => builtinIds.has(id)));
  const runningIds = new Set(modules.map((m) => m.id));
  const kept = [];
  for (const mod of modules) {
    if (desiredIds.has(mod.id)) {
      kept.push(mod);
    } else {
      if (mod.timer !== void 0)
        clearInterval(mod.timer);
      try {
        mod.instance.close();
      } catch (err) {
        log?.error(`Module close failed: ${mod.id}`, err);
      }
      log?.info(`Module stopped (removed from grid): ${mod.id}`);
    }
  }
  for (const id of desiredIds) {
    if (runningIds.has(id))
      continue;
    const schema = MODULE_SCHEMAS.find((s) => s.id === id);
    if (!schema)
      continue;
    try {
      const config = readModuleConfig(db, schema);
      const instance = bootModule(id, config.values, deps);
      if (instance) {
        const booted = { id, instance };
        startPolling(booted, log);
        kept.push(booted);
        log?.info(`Module booted (added to grid): ${id}`);
      }
    } catch (err) {
      log?.error(`Module boot failed: ${id}`, err);
    }
  }
  return kept;
}
var LEAGUE_SPORT_MAP = {
  nfl: "football",
  nba: "basketball",
  mlb: "baseball",
  nhl: "hockey",
  mls: "soccer",
  ncaaf: "football",
  ncaab: "basketball"
};
function csvToArray(val) {
  if (typeof val !== "string" || val.trim() === "")
    return [];
  return val.split(",").map((s) => s.trim()).filter(Boolean);
}
function bootModule(id, values, deps) {
  const { dataBus, notifications } = deps;
  switch (id) {
    case "weather":
      return createWeatherServer({
        provider: values["provider"] ?? "open-meteo",
        apiKey: values["apiKey"] ? String(values["apiKey"]) : void 0,
        location: { lat: Number(values["lat"]), lon: Number(values["lon"]) },
        units: values["units"] ?? "imperial",
        dataBus
      });
    case "crypto":
      return createCryptoServer({
        watchlist: csvToArray(values["watchlist"]),
        dataBus,
        notifications
      });
    case "news":
      return createNewsServer({
        feedUrls: csvToArray(values["feedUrls"]),
        maxItems: values["maxItems"] != null ? Number(values["maxItems"]) : void 0,
        dataBus,
        notifications
      });
    case "sports": {
      const leagueIds = csvToArray(values["leagues"]);
      return createSportsServer({
        leagues: leagueIds.map((l) => ({
          sport: LEAGUE_SPORT_MAP[l] ?? l,
          league: l
        })),
        dataBus,
        notifications
      });
    }
    case "calendar": {
      const calOpts = {
        serverUrl: String(values["serverUrl"] ?? ""),
        username: String(values["username"] ?? ""),
        password: String(values["password"] ?? ""),
        calendarPath: String(values["calendarPath"] ?? ""),
        rangeDays: values["rangeDays"] != null ? Number(values["rangeDays"]) : void 0,
        dataBus
      };
      return createCalendarServer(calOpts);
    }
    case "home-assistant":
      return createHomeAssistantServer({
        url: String(values["url"] ?? ""),
        token: String(values["token"] ?? ""),
        domains: values["domains"] ? csvToArray(values["domains"]) : void 0,
        dataBus,
        notifications
      });
    case "allergies":
      return createAllergiesServer({
        apiKey: String(values["apiKey"] ?? ""),
        location: { lat: Number(values["lat"]), lon: Number(values["lon"]) },
        alertThreshold: values["alertThreshold"] != null ? Number(values["alertThreshold"]) : void 0,
        dataBus,
        notifications
      });
    case "pir":
      return createPIRServer({
        idleTimeout_ms: values["idleTimeout_ms"] != null ? Number(values["idleTimeout_ms"]) : void 0,
        dataBus
      });
    case "photo-slideshow":
      return createPhotoSlideshowServer({
        photoDir: String(values["photoDirectory"] ?? ""),
        dataBus
      });
    default:
      return null;
  }
}

// ../core/dist/plugin-install.js
var import_adm_zip = __toESM(require_adm_zip(), 1);
import * as fs4 from "fs";
import * as path4 from "path";
function installPluginFromZip(zipBuffer, pluginsDir) {
  let zip;
  try {
    zip = new import_adm_zip.default(zipBuffer);
  } catch {
    throw new Error("Invalid zip file");
  }
  const entries = zip.getEntries();
  if (entries.length === 0) {
    throw new Error("Zip is empty \u2014 no plugin.json found");
  }
  let manifestEntry = entries.find((e) => e.entryName === "plugin.json");
  let prefix = "";
  if (!manifestEntry) {
    manifestEntry = entries.find((e) => {
      const parts = e.entryName.split("/");
      return parts.length === 2 && parts[1] === "plugin.json";
    });
    if (manifestEntry) {
      prefix = manifestEntry.entryName.split("/")[0] + "/";
    }
  }
  if (!manifestEntry) {
    throw new Error("Zip does not contain plugin.json");
  }
  let manifest;
  const raw = manifestEntry.getData().toString("utf-8");
  try {
    manifest = JSON.parse(raw);
  } catch {
    throw new Error("plugin.json contains invalid JSON");
  }
  if (!manifest.id || typeof manifest.id !== "string") {
    throw new Error("plugin.json missing required field: id");
  }
  if (!manifest.name || typeof manifest.name !== "string") {
    throw new Error("plugin.json missing required field: name");
  }
  if (!manifest.version || typeof manifest.version !== "string") {
    throw new Error("plugin.json missing required field: version");
  }
  const pluginId = manifest.id;
  const targetDir = path4.join(pluginsDir, pluginId);
  if (fs4.existsSync(targetDir)) {
    throw new Error(`Plugin '${pluginId}' already exists at ${targetDir}`);
  }
  fs4.mkdirSync(targetDir, { recursive: true });
  for (const entry of entries) {
    if (entry.isDirectory)
      continue;
    let relativePath = entry.entryName;
    if (prefix && relativePath.startsWith(prefix)) {
      relativePath = relativePath.slice(prefix.length);
    }
    const destPath = path4.join(targetDir, relativePath);
    const destDir = path4.dirname(destPath);
    fs4.mkdirSync(destDir, { recursive: true });
    fs4.writeFileSync(destPath, entry.getData());
  }
  return { pluginId, manifest };
}

// ../core/dist/plugin-admin-handlers.js
function getPersistedState(db, pluginId) {
  const stored = db.getPluginState(pluginId);
  return stored ?? { enabled: true, config: {} };
}
function buildEntry(pluginId, manifest, loadStatus, loadError, state) {
  const { enabled, config, zone } = state;
  let status;
  if (loadStatus === "error") {
    status = "error";
  } else if (loadStatus === "loading") {
    status = "loading";
  } else {
    status = enabled ? "active" : "disabled";
  }
  const entry = {
    plugin_id: pluginId,
    manifest,
    status,
    enabled,
    config
  };
  if (zone !== void 0)
    entry.zone = zone;
  if (loadError !== void 0)
    entry.error = loadError;
  return entry;
}
var REDACTED = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022";
function buildModuleEntry(db, schema) {
  const config = readModuleConfig(db, schema);
  const zoneState = db.getPluginState(schema.id);
  const manifest = {
    id: schema.id,
    name: schema.name,
    version: "built-in",
    config_schema: { fields: schema.fields }
  };
  const redactedConfig = {};
  for (const [key, value] of Object.entries(config.values)) {
    const field = schema.fields.find((f) => f.key === key);
    if (field?.type === "password" && typeof value === "string" && value !== "") {
      redactedConfig[key] = REDACTED;
    } else {
      redactedConfig[key] = value;
    }
  }
  const integrationFields = getIntegrationFields(schema);
  let integration_status;
  if (integrationFields.length === 0) {
    integration_status = "not_needed";
  } else {
    const requiredFields = integrationFields.filter((f) => f.required);
    const allSet = requiredFields.every((f) => {
      const val = config.values[f.key];
      return val !== void 0 && val !== "";
    });
    integration_status = allSet ? "ready" : "missing";
  }
  const entry = {
    plugin_id: schema.id,
    manifest,
    status: "active",
    config: redactedConfig,
    builtin: true,
    integration_status
  };
  if (zoneState?.zone !== void 0)
    entry.zone = zoneState.zone;
  return entry;
}
function isModuleId(id) {
  return MODULE_IDS.includes(id);
}
function createPluginAdminHandlers(options) {
  const { pluginLoader, db, pluginsDir, onChange } = options;
  return {
    async getPlugins() {
      const pluginEntries = pluginLoader.getAllPlugins().map((plugin) => {
        const state = getPersistedState(db, plugin.manifest.id);
        return buildEntry(plugin.manifest.id, plugin.manifest, plugin.status, plugin.error, state);
      });
      const moduleEntries = MODULE_SCHEMAS.map((s) => buildModuleEntry(db, s));
      return [...pluginEntries, ...moduleEntries];
    },
    async getPlugin(id) {
      const plugin = pluginLoader.getPlugin(id);
      if (plugin) {
        const state = getPersistedState(db, id);
        return buildEntry(id, plugin.manifest, plugin.status, plugin.error, state);
      }
      const schema = MODULE_SCHEMAS.find((s) => s.id === id);
      if (schema)
        return buildModuleEntry(db, schema);
      return void 0;
    },
    async setPluginEnabled(id, enabled) {
      if (isModuleId(id)) {
        return;
      }
      const state = getPersistedState(db, id);
      db.setPluginState(id, { ...state, enabled });
      onChange?.(id, "enabled");
    },
    async updatePluginConfig(id, config) {
      if (isModuleId(id)) {
        for (const [key, value] of Object.entries(config)) {
          if (String(value) === REDACTED)
            continue;
          if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            db.setSetting(`${id}.${key}`, String(value));
          }
        }
        onChange?.(id, "config_updated");
        return;
      }
      const state = getPersistedState(db, id);
      const safe = {};
      for (const [k, v] of Object.entries(config)) {
        if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
          safe[k] = v;
        }
      }
      db.setPluginState(id, { ...state, config: { ...state.config, ...safe } });
      onChange?.(id, "config_updated");
    },
    async assignPluginZone(id, zone) {
      const state = getPersistedState(db, id);
      db.setPluginState(id, { ...state, zone });
      onChange?.(id, "zone_assigned");
    },
    async reloadPlugins() {
      await pluginLoader.reload();
    },
    async installPlugin(zipBuffer) {
      if (!pluginsDir) {
        throw new Error("Plugin installation not configured (no pluginsDir)");
      }
      const { pluginId, manifest } = installPluginFromZip(zipBuffer, pluginsDir);
      await pluginLoader.reload();
      onChange?.(pluginId, "installed");
      const state = getPersistedState(db, pluginId);
      return buildEntry(pluginId, manifest, "loaded", void 0, state);
    }
  };
}

// ../core/dist/host-service.js
function createHostService(options = {}) {
  const { port = 0, pluginsDir = "./plugins", dbPath = ":memory:", logger, staticDir } = options;
  let _db;
  let _rest;
  let _ws;
  let _plugins;
  let _modules = [];
  let _notificationQueue;
  let _port = 0;
  let _dataBus;
  const log = {
    info: (msg, data) => logger?.info(msg, data),
    error: (msg, err) => logger?.error(msg, err)
  };
  const ready = (async () => {
    try {
      _db = createDatabase({ path: dbPath });
      log.info("Database ready");
      _plugins = createPluginLoader({ pluginsDir });
      await _plugins.load();
      log.info("Plugins loaded", { count: _plugins.getAllPlugins().length });
      const dataBus = createDataBus();
      _dataBus = dataBus;
      const pluginHandlers = createPluginAdminHandlers({
        pluginLoader: _plugins,
        db: _db,
        pluginsDir,
        onChange: (_pluginId, _action) => {
          _ws?.broadcast({
            type: "layout_change",
            payload: null,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
        }
      });
      _rest = createRestServer({
        getSettings: async () => {
          const all = _db.getAllSettings();
          const redacted = { ...all };
          for (const schema of MODULE_SCHEMAS) {
            for (const field of schema.fields) {
              if (field.type === "password") {
                const key = `${schema.id}.${field.key}`;
                if (key in redacted) {
                  redacted[key] = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022";
                }
              }
            }
          }
          return redacted;
        },
        putSettings: async (settings) => {
          for (const [key, value] of Object.entries(settings)) {
            if (String(value) === "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022")
              continue;
            _db.setSetting(key, String(value));
          }
        },
        getLayout: async () => _db.getLayout("default") ?? [],
        putLayout: async (layout) => {
          _db.setLayout("default", layout);
        },
        syncModules: (layoutIds) => {
          _modules = syncModulesWithLayout(layoutIds, _modules, _db, { dataBus, notifications: _notificationQueue }, logger);
          _ws?.broadcast({
            type: "layout_change",
            payload: null,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          });
        },
        postAsk: async (question) => ({
          id: crypto.randomUUID(),
          question,
          response: "Ask feature not yet available.",
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          tool_calls_made: 0
        }),
        ...pluginHandlers,
        restartModule: async (id) => {
          const schema = MODULE_SCHEMAS.find((s) => s.id === id);
          if (!schema)
            throw new Error(`Unknown module: ${id}`);
          const result = rebootModule(id, _modules, _db, { dataBus, notifications: _notificationQueue }, logger);
          return { ok: true, running: result !== null };
        }
      }, { port, staticDir });
      await _rest.ready();
      _port = _rest.port;
      log.info("REST server ready", { port: _port });
      _ws = createWsServer({ server: _rest.server });
      await _ws.ready();
      log.info("WebSocket server ready");
      dataBus.onMessage((msg) => {
        _ws.broadcast({ type: "plugin_data", payload: msg, timestamp: (/* @__PURE__ */ new Date()).toISOString() });
      });
      _ws.on("connection", () => {
        for (const channel of dataBus.getChannels()) {
          const latest = dataBus.getLatest(channel);
          if (latest) {
            _ws.broadcast({
              type: "plugin_data",
              payload: latest,
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            });
          }
        }
      });
      createPluginScheduler();
      _notificationQueue = createNotificationQueue();
      const savedLayout = _db.getLayout("default");
      if (savedLayout) {
        const parsed = savedLayout;
        const layoutIds = Array.isArray(parsed.widgets) ? parsed.widgets.map((w) => w.id) : [];
        _modules = syncModulesWithLayout(layoutIds, [], _db, { dataBus, notifications: _notificationQueue }, logger);
      }
      log.info("Host service boot complete");
    } catch (err) {
      log.error("Boot failed, cleaning up", err);
      for (const mod of _modules) {
        try {
          if (mod.timer !== void 0)
            clearInterval(mod.timer);
          mod.instance.close();
        } catch {
        }
      }
      try {
        _notificationQueue?.close();
      } catch {
      }
      try {
        await _ws?.close();
      } catch {
      }
      try {
        await _rest?.close();
      } catch {
      }
      try {
        _db?.close();
      } catch {
      }
      throw err;
    }
  })();
  const shutdownHandler = () => {
    void (async () => {
      try {
        for (const mod of _modules) {
          try {
            if (mod.timer !== void 0)
              clearInterval(mod.timer);
            mod.instance.close();
          } catch {
          }
        }
        _notificationQueue?.close();
        await _ws?.close();
        await _rest?.close();
        _db?.close();
      } catch (err) {
        log.error("Shutdown error", err);
      }
    })();
  };
  process.once("SIGINT", shutdownHandler);
  process.once("SIGTERM", shutdownHandler);
  return {
    ready,
    get port() {
      return _port;
    },
    async close() {
      process.off("SIGINT", shutdownHandler);
      process.off("SIGTERM", shutdownHandler);
      for (const mod of _modules) {
        try {
          if (mod.timer !== void 0)
            clearInterval(mod.timer);
          mod.instance.close();
        } catch {
        }
      }
      _notificationQueue?.close();
      await _ws?.close();
      await _rest?.close();
      _db?.close();
    },
    get db() {
      return _db;
    },
    get rest() {
      return _rest;
    },
    get ws() {
      return _ws;
    },
    get plugins() {
      return _plugins;
    },
    get modules() {
      return _modules;
    },
    get dataBus() {
      return _dataBus;
    }
  };
}

// src/bin/dev-host.ts
var root = resolve2(dirname2(fileURLToPath(import.meta.url)), "../../../..");
var dataDir = resolve2(root, "data");
mkdirSync2(dataDir, { recursive: true });
var host = createHostService({
  port: 3100,
  pluginsDir: resolve2(root, "plugins"),
  dbPath: resolve2(dataDir, "lensing.db"),
  staticDir: resolve2(root, "apps/display/build")
});
await host.ready;
console.log(`Host service listening on http://localhost:${host.port}`);
process.on("SIGINT", async () => {
  await host.close();
  process.exit(0);
});
