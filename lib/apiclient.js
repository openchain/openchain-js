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

var RecordKey = require("./recordkey");
var encoding = require("./encoding");
var ByteBuffer = require("bytebuffer");
var Long = require("long");
var request = require("request-promise");

/**
 * Represents an Openchain client bound to a specific Openchain endpoint.
 * 
 * @constructor
 * @param {string} endpoint The base URL of the endpoint.
 */
function ApiClient(endpoint) {
    this.endpoint = endpoint;
    this.namespace = null;
};

/**
 * Initializes the client.
 * 
 * @return {Promise} A promise representing the completion of the operation.
 */
ApiClient.prototype.initialize = function () {
    return this.getInfo().then(function (result) {
        this.namespace = ByteBuffer.fromHex(result.namespace);
    });
};

/*
 * Retrieves a record from the Openchain endpoint.
 * 
 * @param {(string|RecordKey|ByteBuffer)} key The key of the record to retrieve.
 * @param {ByteBuffer=} version The version of the record to retrieve, or the latest if omitted.
 * @return {Promise<!{ key: !ByteBuffer, value: !ByteBuffer, version: !ByteBuffer }>} The record retrieved from the endpoint.
 */
ApiClient.prototype.getRecord = function (key, version) {
    
    if (typeof key === "string") {
        key = encoding.encodeString(key);
    }
    else if (typeof key.toByteBuffer === "function") {
        key = key.toByteBuffer();
    }
    
    if (typeof version === "undefined" || version == null) {
        var getRecord = request({
            uri: this.endpoint + "record",
            qs: { key: key.toHex() },
            json: true
        });
    }
    else {
        var getRecord = request({
            uri: this.endpoint + "query/recordversion",
            qs: { key: key.toHex(), version: version.toHex() },
            json: true
        });
    }
    
    return getRecord.then(function (result) {
        return {
            key: ByteBuffer.fromHex(result.key),
            value: ByteBuffer.fromHex(result.value),
            version: ByteBuffer.fromHex(result.value)
        };
    });
};

/*
 * Retrieves a data record from the Openchain endpoint.
 * 
 * @param {string} path The path of the record to retrieve.
 * @param {string} recordName The name of the record to retrieve.
 * @param {ByteBuffer=} version The version of the record to retrieve, or the latest if omitted.
 * @return {Promise<!{ key: !ByteBuffer, value: !ByteBuffer, version: !ByteBuffer, data: ?string }>} The record retrieved from the endpoint.
 */
ApiClient.prototype.getDataRecord = function (path, recordName, version) {
    var key = new RecordKey(path, "DATA", recordName);
    
    return this.getRecord(key, version).then(function (result) {
        var result = result;
        
        if (result.value.remaining() == 0) {
            // Unset value
            result["data"] = null;
        }
        else {
            result["data"] = encoding.decodeString(result.value);
        }
        
        return result;
    });
};

/*
 * Retrieves an account record from the Openchain endpoint.
 * 
 * @param {string} path The path of the record to retrieve.
 * @param {string} asset The name of the record to retrieve.
 * @param {ByteBuffer=} version The version of the record to retrieve, or the latest if omitted.
 * @return {Promise<!{ key: !ByteBuffer, value: !ByteBuffer, version: !ByteBuffer, balance: !Long }>} The record retrieved from the endpoint.
 */
ApiClient.prototype.getAccountRecord = function (path, asset, version) {
    var key = new RecordKey(path, "ACC", asset);
    
    return this.getRecord(key, version).then(function (result) {
        var result = result;
        
        if (result.value.remaining() == 0) {
            // Unset value
            result["balance"] = Long.ZERO;
        }
        else {
            result["balance"] = encoding.decodeInt64(result.value);
        }
        
        return result;
    });
}

/*
 * Retrieves the chain information from the endpoint.
 * 
 * @return {Promise<!{ namespace: string }>} The chain information.
 */
ApiClient.prototype.getInfo = function () {
    return request({
        uri: this.endpoint + "info",
        json: true
    });
};

module.exports = ApiClient;