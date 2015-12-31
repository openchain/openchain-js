"use strict";

var ByteBuffer = require("bytebuffer");

var LedgerPath = require("./ledgerpath");
var encoding = require("./encoding");

var RecordKey = function (path, recordType, name) {
    this.path = LedgerPath.parse(path);
    this.recordType = recordType;
    this.name = name;
}

RecordKey.prototype.toString = function () {
    return this.path.toString() + ":" + this.recordType + ":" + this.name;
};

RecordKey.prototype.toByteBuffer = function () {
    return encoding.encodeString(this.toString());
};

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