"use strict";

var RecordKey = require("recordkey");
var ByteBuffer = require("bytebuffer");
var request = require("request-promise");

function ApiClient(endpoint) {
    this.endpoint = endpoint;
};

ApiClient.prototype.getRecord = function (key) {
    return request({
        uri: this.endpoint + "record",
        qs: { key: key.toHex() },
        json: true
    }).then(function (result) {
        return {
            key: RecordKey.parse(result.key),
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
            result["data"] = encodingService.decodeString(result.value);
        }
        
        return accountResult;
    });
};

ApiClient.prototype.getAccountRecord = function (path, asset) {
    var key = new RecordKey(path, "ACC", asset).toByteBuffer();
    
    return this.getRecord(key).then(function (result) {
        var result = result;
        
        if (result.value.remaining() == 0) {
            // Unset value
            result["data"] = null;
        }
        else {
            result["data"] = encodingService.decodeString(result.value);
        }
        
        return accountResult;
    });
}

module.exports = ApiClient;