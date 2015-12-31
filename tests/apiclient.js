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
var ByteBuffer = require("bytebuffer");
var Long = require("long");
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

});
