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

var Schema = require("./schema");
var ApiClient = require("./apiclient");
var encoding = require("./encoding");
var ByteBuffer = require("protobufjs").ByteBuffer;

/**
 * Provides the ability to build an Openchain mutation.
 * 
 * @constructor
 * @param {!ApiClient} apiClient The API client representing the endpoint on which the mutation should be submitted.
 */
function TransactionBuilder(apiClient) {
    
    if (typeof apiClient.namespace === "undefined" || apiClient.namespace === null) {
        throw new Error("The API client has not been initialized");
    }
    
    this.client = apiClient;
    this.records = [];
    this.keys = [];
    this.metadata = ByteBuffer.fromHex("");
}

/**
 * Adds a record to the mutation.
 * 
 * @param {!ByteBuffer} key The key of the record being added.
 * @param {ByteBuffer} value The value of the record being added.
 * @param {!ByteBuffer} version The last known version of the record being added.
 * @return {!TransactionBuilder} The transaction builder.
 */
TransactionBuilder.prototype.addRecord = function (key, value, version) {
    var newRecord = {
        "key": key,
        "version": version
    };
    
    if (value !== null) {
        newRecord.value = { "data": value };
    }
    else {
        newRecord.value = null;
    }
    
    this.records.push(newRecord);
    
    return this;
};

/**
 * Sets the transaction metadata.
 * 
 * @param {!ByteBuffer} data The metadata.
 * @return {!TransactionBuilder} The transaction builder.
 */
TransactionBuilder.prototype.setMetadata = function (data) {
    this.metadata = encoding.encodeString(JSON.stringify(data));
    return this;
};

/**
 * Adds an account record to the mutation.
 * 
 * @param {{ key: !ByteBuffer, balance: !Long, version: !ByteBuffer }} previous The current record being modified.
 * @param {!Long} delta The change in balance that the mutation is causing.
 * @return {!TransactionBuilder} The transaction builder.
 */
TransactionBuilder.prototype.addAccountRecord = function (previous, delta) {
    return this.addRecord(
        previous.key,
        encoding.encodeInt64(previous.balance.add(delta)),
        previous.version);
};

/**
 * Adds an account record to the mutation, based on the current version.
 * 
 * @param {string} account The path or alias being modified. Aliases should start with the "@" character.
 * @param {string} asset The asset being modified.
 * @param {!Long} delta The change in balance that the mutation is causing.
 * @return {Promise<!TransactionBuilder>} The transaction builder.
 */
TransactionBuilder.prototype.updateAccountRecord = function (account, asset, delta) {
    // Resolve name accounts
    if (account.slice(0, 1) == "@") {
        account = "/aka/" + account.slice(1, account.length) + "/";
    }
    
    var _this = this;

    return this.client.getDataRecord(account, "goto").then(function (result) {
        if (result.data === null) {
            return account;
        }
        else {
            // If a goto DATA record exists, we use the redirected path
            _this.addRecord(result.key, null, result.version);
            return result.data;
        }
    }).then(function (accountResult) {
        return _this.client.getAccountRecord(accountResult, asset);
    }).then(function (currentRecord) {
        return _this.addAccountRecord(currentRecord, delta);
    });
};

/**
 * Adds a signing key to the transaction builder.
 * 
 * @param {!MutationSigner} key The signer to add.
 * @return {!TransactionBuilder} The transaction builder.
 */
TransactionBuilder.prototype.addSigningKey = function (key) {
    this.keys.push(key);
    return this;
};

/**
 * Builds the transaction.
 * 
 * @return {!ByteBuffer} The built transaction.
 */
TransactionBuilder.prototype.build = function () {
    var constructedTransaction = new Schema.Mutation({
        "namespace": this.client.namespace,
        "records": this.records,
        "metadata": this.metadata
    });
    
    return constructedTransaction.encode();
};

/**
 * Sign and submit the transaction to the Openchain instance.
 * 
 * @return {Promise<!{ transaction_hash: string, mutation_hash: string }>} The result of the operation.
 */
TransactionBuilder.prototype.submit = function () {
    var mutation = this.build();
    var signatures = [];
    
    for (var i = 0; i < this.keys.length; i++) {
        signatures.push({
            signature: this.keys[i].sign(mutation).toHex(),
            pub_key: this.keys[i].publicKey.toHex()
        });
    }
    
    return this.client.submit(mutation, signatures);
};

module.exports = TransactionBuilder;