"use strict";

var ByteBuffer = require("bytebuffer");
var Long = require("long");

module.exports = {};

module.exports.encodeString = function (value) {
    return ByteBuffer.wrap(value, "utf8", true);
};

module.exports.encodeInt64 = function (value, usage) {
    var result = new ByteBuffer(null, true);
    result.BE();
    result.writeInt64(value);
    result.flip();
    return result;
};

module.exports.decodeInt64 = function (buffer) {
    if (buffer.limit == 0)
        return Long.ZERO;
    
    buffer.BE();
    var result = buffer.readInt64();
    buffer.flip();
    return result;
};

module.exports.decodeString = function (buffer) {
    var result = buffer.readUTF8String(buffer.remaining());
    buffer.flip();
    return result;
};