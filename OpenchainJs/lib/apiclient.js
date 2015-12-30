"use strict";

var RecordKey = require("./recordkey");
var encoding = require("./encoding");

var ByteBuffer = require("bytebuffer");
var Long = require("long");
var request = require("request-promise");

function ApiClient(endpoint) {
    this.endpoint = endpoint;
    this.namespace = null;
};

ApiClient.prototype.initialize = function () {
    return this.getInfo().then(function (result) {
        this.namespace = ByteBuffer.fromHex(result.namespace);
    });
};

ApiClient.prototype.getRecord = function (key) {
    
    if (typeof key === "string") {
        key = ByteBuffer.wrap(key, "utf8", true);
    }

    return request({
        uri: this.endpoint + "record",
        qs: { key: key.toHex() },
        json: true
    }).then(function (result) {
        return {
            key: ByteBuffer.fromHex(result.key),
            value: ByteBuffer.fromHex(result.value),
            version: ByteBuffer.fromHex(result.value)
        };
    });
};

ApiClient.prototype.getDataRecord = function (path, recordName) {
    var key = new RecordKey(path, "DATA", recordName).toByteBuffer();
    
    return this.getRecord(key).then(function (result) {
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

ApiClient.prototype.getAccountRecord = function (path, asset) {
    var key = new RecordKey(path, "ACC", asset).toByteBuffer();
    
    return this.getRecord(key).then(function (result) {
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

ApiClient.prototype.getInfo = function () {
    return request({
        uri: this.endpoint + "info",
        json: true
    });
};

module.exports = ApiClient;