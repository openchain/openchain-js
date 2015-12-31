"use strict";

var ByteBuffer = require("bytebuffer");
var LedgerPath = require("./ledgerpath");
var encoding = require("./encoding");

/**
 * Represents the key to a record.
 * 
 * @constructor
 * @param {string} path The path of the record.
 * @param {string} recordType The type of the record.
 * @param {string} name The name of the record.
 */
var RecordKey = function (path, recordType, name) {
    this.path = LedgerPath.parse(path);
    this.recordType = recordType;
    this.name = name;
}

/** 
 * Returns the string representation of the record key.
 * 
 * @return {string} The string representation of the record key.
 */
RecordKey.prototype.toString = function () {
    return this.path.toString() + ":" + this.recordType + ":" + this.name;
};

/** 
 * Returns the binary representation of the record key.
 * 
 * @return {!ByteBuffer} The binary representation of the record key.
 */
RecordKey.prototype.toByteBuffer = function () {
    return encoding.encodeString(this.toString());
};

/** 
 * Parses a record key from a string.
 * 
 * @param {string} value The value to parse.
 * @return {!RecordKey} The parsed record key.
 */
RecordKey.parse = function (value) {
    var text = value;
    if (typeof text !== "string") {
        text = encoding.decodeString(text);
    }
    
    var parts = text.split(":");
    
    if (parts.length < 3) {
        throw new Error("Invalid record key");
    }
    
    return new RecordKey(parts[0], parts[1], parts.slice(2, parts.length).join(":"));
};

module.exports = RecordKey;