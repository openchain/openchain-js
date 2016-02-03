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

var openchain = require("../index");
var assert = require("assert");
var ByteBuffer = require("protobufjs").ByteBuffer;
var Long = require("protobufjs").Long;
var RecordKey = openchain.RecordKey;

describe('ApiClient', function () {
    
    var client = new openchain.ApiClient("https://test.openchain.org/");
    
    it('getRecord ByteBuffer', function () {
        return client.getRecord(ByteBuffer.fromHex("0000")).then(function (result) {
            assert.equal(result.key.toHex(), "0000");
            assert.equal(result.value.toHex(), "");
            assert.equal(result.version.toHex(), "");
        });
    });
    
    it('getRecord string', function () {
        return client.getRecord("/:DATA:info").then(function (result) {
            assert.equal(result.key.toHex(), "2f3a444154413a696e666f");
            assert.notEqual(result.value.toHex(), "");
        });
    });
    
    it('getRecord RecordKey', function () {
        return client.getRecord(new RecordKey("/", "DATA", "info")).then(function (result) {
            assert.equal(result.key.toHex(), "2f3a444154413a696e666f");
            assert.notEqual(result.value.toHex(), "");
        });
    });
    
    it('getRecord with version', function () {
        return client.getRecord("/:DATA:info", ByteBuffer.fromHex("")).then(function (result) {
            assert.equal(result.key.toHex(), "2f3a444154413a696e666f");
            assert.equal(result.value.toHex(), "");
            assert.equal(result.version.toHex(), "");
        });
    });
    
    it('getRecord fail', function () {
        return client.getRecord("/:DATA:info", ByteBuffer.fromHex("abcd")).then(function (result) {
            assert.fail();
        }, function (err) {
            assert.equal(404, err.statusCode);
        });
    });
    
    it('getDataRecord', function () {
        return client.getDataRecord("/", "info").then(function (result) {
            assert.equal(result.key.toHex(), "2f3a444154413a696e666f");
            assert.notEqual(result.value.toHex(), "");
            assert.notEqual(result.data, null);
        });
    });
    
    it('getDataRecord with version', function () {
        return client.getDataRecord("/", "info", ByteBuffer.fromHex("")).then(function (result) {
            assert.equal(result.key.toHex(), "2f3a444154413a696e666f");
            assert.equal(result.value.toHex(), "");
            assert.equal(result.version.toHex(), "");
            assert.equal(result.data, null);
        });
    });
    
    it('getAccountRecord', function () {
        return client.getAccountRecord("/path/", "/asset/").then(function (result) {
            assert.equal(result.key.toHex(), "2f706174682f3a4143433a2f61737365742f");
            assert.equal(result.value.toHex(), "");
            assert.equal(result.balance, Long.ZERO);
        });
    });
    
    it('initialize', function () {
        return client.initialize().then(function (result) {
            assert.notEqual(client.namespace.toHex(), "");
        });
    });
    
    it('submit error', function () {
        var mutation = ByteBuffer.fromHex("0a03abcdef120b0a01ab12030a01cd1a01ef");
        return client.submit(mutation, []).then(function (result) {
            assert.fail();
        }, function (result) {
            assert.equal(result.data.error_code, "InvalidNamespace");
            assert.equal(result.statusCode, 400);
        });
    });
    
    it('getSubAccounts', function () {
        return client.getSubAccounts("/").then(function (result) {
            assert.notEqual(result.length, 0);
            assert.notEqual(result[0].key.toHex(), "");
            assert.notEqual(result[0].value.toHex(), "");
            assert.notEqual(result[0].version.toHex(), "");
        });
    });
    
    it('getRecordMutations string', function () {
        return client.getRecordMutations("/:DATA:info").then(function (result) {
            assert.notEqual(result.length, 0);
            assert.notEqual(result[0].toHex(), "");
        });
    });
    
    it('getRecordMutations RecordKey', function () {
        return client.getRecordMutations(new RecordKey("/", "DATA", "info")).then(function (result) {
            assert.notEqual(result.length, 0);
            assert.notEqual(result[0].toHex(), "");
        });
    });
    
    it('getTransaction ByteBuffer', function () {
        return client.getRecordMutations("/:DATA:info").then(function (result) {
            return client.getTransaction(result[0]);
        }).then(function (result) {
            assert.notEqual(result.mutation.namespace.toHex(), "");
            assert.notEqual(result.transaction.mutation.toHex(), "");
            assert.notEqual(result.mutationHash.toHex(), "");
            assert.notEqual(result.transactionHash.toHex(), "");
        });
    });
    
    it('getTransaction string', function () {
        return client.getRecordMutations("/:DATA:info").then(function (result) {
            return client.getTransaction(result[0].toHex());
        }).then(function (result) {
            assert.notEqual(result.mutation.namespace.toHex(), "");
            assert.notEqual(result.transaction.mutation.toHex(), "");
            assert.notEqual(result.mutationHash.toHex(), "");
            assert.notEqual(result.transactionHash.toHex(), "");
        });
    });
});
