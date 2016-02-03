// Copyright 2015 Coinprism, Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

var ByteBuffer = require("protobufjs").ByteBuffer;
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
function RecordKey(path, recordType, name) {
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