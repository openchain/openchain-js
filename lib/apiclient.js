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
var ByteBuffer = require("protobufjs").ByteBuffer;
var Long = require("protobufjs").Long;
var httpinvoke = require("httpinvoke");
var bitcore = require("bitcore-lib");
var Schema = require("./schema.js");

/**
 * Represents an Openchain client bound to a specific Openchain endpoint.
 * 
 * @constructor
 * @param {string} endpoint The base URL of the endpoint.
 */
function ApiClient(endpoint) {
    if (endpoint.length > 0 && endpoint.slice(-1) != "/") {
        endpoint += "/";
    }
    
    this.endpoint = endpoint;
    this.namespace = null;
}

/**
 * Initializes the client.
 * 
 * @return {!Promise} A promise representing the completion of the operation.
 */
ApiClient.prototype.initialize = function () {
    var _this = this;
    return this.getInfo().then(function (result) {
        _this.namespace = ByteBuffer.fromHex(result.namespace);
    });
};

/*
 * Retrieves a record from the Openchain endpoint.
 * 
 * @param {(string|!RecordKey|!ByteBuffer)} key The key of the record to retrieve.
 * @param {ByteBuffer=} version The version of the record to retrieve, or the latest if omitted.
 * @return {!Promise<!{ key: !ByteBuffer, value: !ByteBuffer, version: !ByteBuffer }>} The record retrieved from the endpoint.
 */
ApiClient.prototype.getRecord = function (key, version) {
    
    if (typeof key === "string") {
        key = encoding.encodeString(key);
    }
    else if (typeof key.toByteBuffer === "function") {
        key = key.toByteBuffer();
    }
    
    var getRecord;
    if (typeof version === "undefined" || version === null) {
        getRecord = this.httpGet(this.endpoint + "record?key=" + key.toHex());
    }
    else {
        getRecord = this.httpGet(this.endpoint + "query/recordversion?key=" + key.toHex() + "&version=" + version.toHex());
    }
    
    return getRecord.then(parseRecord);
};

/*
 * Retrieves a data record from the Openchain endpoint.
 * 
 * @param {string} path The path of the record to retrieve.
 * @param {string} recordName The name of the record to retrieve.
 * @param {ByteBuffer=} version The version of the record to retrieve, or the latest if omitted.
 * @return {!Promise<!{ key: !ByteBuffer, value: !ByteBuffer, version: !ByteBuffer, data: ?string }>} The record retrieved from the endpoint.
 */
ApiClient.prototype.getDataRecord = function (path, recordName, version) {
    var key = new RecordKey(path, "DATA", recordName);
    
    return this.getRecord(key, version).then(function (result) {
        if (result.value.remaining() === 0) {
            // Unset value
            result.data = null;
        }
        else {
            result.data = encoding.decodeString(result.value);
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
 * @return {!Promise<!{ key: !ByteBuffer, value: !ByteBuffer, version: !ByteBuffer, balance: !Long }>} The record retrieved from the endpoint.
 */
ApiClient.prototype.getAccountRecord = function (path, asset, version) {
    var key = new RecordKey(path, "ACC", asset);
    
    return this.getRecord(key, version).then(function (result) {
        if (result.value.remaining() === 0) {
            // Unset value
            result.balance = Long.ZERO;
        }
        else {
            result.balance = encoding.decodeInt64(result.value);
        }
        
        return result;
    });
};

/*
 * Retrieves a record from the Openchain endpoint.
 * 
 * @param {!ByteBuffer} mutation The mutation to submit.
 * @param {Array<{ pub_key: string, signature: string }>} signatures The signatures to submit.
 * @return {!Promise<!{ transaction_hash: string, mutation_hash: string }>} The result of the operation.
 */
ApiClient.prototype.submit = function (mutation, signatures) {
    return this.httpPost(
        this.endpoint + "submit",
        JSON.stringify({ mutation: mutation.toHex(), signatures: signatures }));
};

/*
 * Retrieves all the ACC records at a specific path.
 * 
 * @param {(string|!LedgerPath)} account The path to query records from.
 * @return {!Promise<!Array<!{ account: string, asset: string, balance: string, version: string }>>} The result of the operation.
 */
ApiClient.prototype.getAccountRecords = function (account) {
    return this.httpGet(this.endpoint + "query/account?account=" + encodeURIComponent(account.toString()));
};

/*
 * Retrieves all the record under a given path (includes sub-paths).
 * 
 * @param {(string|!LedgerPath)} account The path to query for.
 * @return {!Promise<!Array<!{ key: !ByteBuffer, value: !ByteBuffer, version: !ByteBuffer, balance: !Long }>>} The result of the operation.
 */
ApiClient.prototype.getSubAccounts = function (account) {
    return this.httpGet(this.endpoint + "query/subaccounts?account=" + encodeURIComponent(account.toString()))
    .then(function (result) {
        var records = [];
        for (var i = 0; i < result.length; i++) {
            records.push(parseRecord(result[i]));
        }
        
        return records;
    });
};

/*
 * Retrieves all the mutations that have affected a given record.
 * 
 * @param {(string|!RecordKey|!ByteBuffer)} key The key of the record of which mutations are being retrieved.
 * @return {!Promise<!Array<!ByteBuffer>>} The result of the operation.
 */
ApiClient.prototype.getRecordMutations = function (key) {
    if (typeof key === "string") {
        key = encoding.encodeString(key);
    }
    else if (typeof key.toByteBuffer === "function") {
        key = key.toByteBuffer();
    }
    
    return this.httpGet(this.endpoint + "query/recordmutations?key=" + key.toHex())
    .then(function (result) {
        var records = [];
        for (var i = 0; i < result.length; i++) {
            records.push(ByteBuffer.fromHex(result[i].mutation_hash));
        }
        
        return records;
    });
};

/*
 * Retrieves a raw transaction given its mutation hash.
 * 
 * @param {(string|!ByteBuffer)} mutationHash The hash of the mutation being retrieved.
 * @return {!Promise<!{ transaction: !Schema.Transaction, mutation: !Schema.Mutation, mutationHash: !ByteBuffer, transactionHash: !ByteBuffer }>} The result of the operation.
 */
ApiClient.prototype.getTransaction = function (mutationHash) {
    if (typeof mutationHash === "string") {
        mutationHash = ByteBuffer.fromHex(mutationHash);
    }
    
    return this.httpGet(this.endpoint + "query/transaction?format=raw&mutation_hash=" + mutationHash.toHex())
    .then(function (result) {
        var buffer = ByteBuffer.fromHex(result.raw);
        var transaction = Schema.Transaction.decode(buffer.clone());
        var mutation = Schema.Mutation.decode(transaction.mutation.clone());
        
        var transactionBuffer = new Uint8Array(buffer.toArrayBuffer());
        var transactionHash = bitcore.crypto.Hash.sha256(bitcore.crypto.Hash.sha256(transactionBuffer));
        var mutationBuffer = new Uint8Array(transaction.mutation.toArrayBuffer());
        var mutationHash = bitcore.crypto.Hash.sha256(bitcore.crypto.Hash.sha256(mutationBuffer));
        
        return {
            transaction: transaction,
            mutation: mutation,
            mutationHash: ByteBuffer.wrap(mutationHash),
            transactionHash: ByteBuffer.wrap(transactionHash)
        };
    });
};

/*
 * Retrieves the chain information from the endpoint.
 * 
 * @return {!Promise<!{ namespace: string }>} The chain information.
 */
ApiClient.prototype.getInfo = function () {
    return this.httpGet(this.endpoint + "info");
};

ApiClient.prototype.httpGet = function (url) {
    return httpinvoke(url, "GET").then(parseResponse);
};

ApiClient.prototype.httpPost = function (url, body) {
    return httpinvoke(url, "POST", { input: body }).then(parseResponse);
};

var parseRecord = function (record) {
    return {
        key: ByteBuffer.fromHex(record.key),
        value: ByteBuffer.fromHex(record.value),
        version: ByteBuffer.fromHex(record.version)
    };
};

var parseResponse = function (result) {
    if (result.statusCode != 200) {
        try {
            result.data = JSON.parse(result.body);
        }
        catch (err) { }
        
        throw result;
    }
    else {
        return JSON.parse(result.body);
    }
};

module.exports = ApiClient;