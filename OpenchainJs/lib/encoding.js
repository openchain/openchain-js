"use strict";

var ByteBuffer = require("bytebuffer");
var Long = require("long");

/*
 * Encodes a string into a byte buffer.
 * 
 * @param {string} value The string being encoded.
 * @return {!ByteBuffer} The encoded string.
 */
module.exports.encodeString = function (value) {
    return ByteBuffer.wrap(value, "utf8", true);
};

/*
 * Decodes a string from a byte buffer.
 * 
 * @param {!ByteBuffer} buffer The buffer containing the string being decoded.
 * @return {string} The decoded string.
 */
module.exports.decodeString = function (buffer) {
    var result = buffer.readUTF8String(buffer.remaining());
    buffer.flip();
    return result;
};

/*
 * Encodes an integer into a byte buffer.
 * 
 * @param {Number|!Long} value The integer being encoded.
 * @return {!ByteBuffer} The encoded integer.
 */
module.exports.encodeInt64 = function (value) {
    var result = new ByteBuffer(null, true);
    result.BE();
    result.writeInt64(value);
    result.flip();
    return result;
};

/*
 * Decodes an integer from a byte buffer.
 * 
 * @param {!ByteBuffer} buffer The buffer containing the integer being decoded.
 * @return {!Long} The decoded string.
 */
module.exports.decodeInt64 = function (buffer) {
    if (buffer.limit == 0)
        return Long.ZERO;
    
    buffer.BE();
    var result = buffer.readInt64();
    buffer.flip();
    return result;
};