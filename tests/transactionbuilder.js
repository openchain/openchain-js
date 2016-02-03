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

var assert = require("assert");
var bitcore = require("bitcore-lib");
var ByteBuffer = require("protobufjs").ByteBuffer;
var Long = require("protobufjs").Long;
var q = require("q");
var openchain = require("../index");
var TransactionBuilder = openchain.TransactionBuilder;
var RecordKey = openchain.RecordKey;
var MutationSigner = openchain.MutationSigner;
var encoding = openchain.encoding;

describe("TransactionBuilder", function () {
    
    it("constructor success", function () {
        var builder = new TransactionBuilder(new ApiClientMock());
        
        assert.deepEqual(builder.records, []);
        assert.equal(builder.client.namespace.toHex(), "abcdef");
        assert.equal(builder.metadata.toHex(), "");
    });
    
    it('constructor no namespace', function () {
        var client = new ApiClientMock();
        client.namespace = null;
        
        assert.throws(function () { new TransactionBuilder(client); }, Error);
    });
    
    it("addRecord", function () {
        var builder = new TransactionBuilder(new ApiClientMock());
        
        builder.addRecord(ByteBuffer.fromHex("ab"), ByteBuffer.fromHex("cd"), ByteBuffer.fromHex("ef"));
        builder.addRecord(ByteBuffer.fromHex("12"), null, ByteBuffer.fromHex("34"));
        
        assert.deepEqual(builder.records, [
            { "key": ByteBuffer.fromHex("ab"), "value": { "data": ByteBuffer.fromHex("cd") }, "version": ByteBuffer.fromHex("ef") },
            { "key": ByteBuffer.fromHex("12"), "value": null, "version": ByteBuffer.fromHex("34") }
        ]);
    });
    
    it("setMetadata", function () {
        var builder = new TransactionBuilder(new ApiClientMock());
        
        builder.setMetadata({ "hello": "world" });
        
        assert.equal(builder.metadata.toHex(), "7b2268656c6c6f223a22776f726c64227d");
    });
    
    it("updateAccountRecord no alias no goto", function () {
        var api = new ApiClientMock();
        var builder = new TransactionBuilder(api);
        api.accountRecords["/path/"] = "200";
        
        return builder.updateAccountRecord("/path/", "/asset/", 50).then(function () {
            assert.equal(builder.records[0].key.toHex(), "2f706174682f3a4143433a2f61737365742f");
            assert.equal(builder.records[0].value.data.toHex(), "00000000000000fa");
            assert.equal(builder.records[0].version.toHex(), "bbbb");
        });
    });
    
    it("updateAccountRecord goto", function () {
        var api = new ApiClientMock();
        var builder = new TransactionBuilder(api);
        api.gotoRecords["/path/"] = "/target/";
        api.accountRecords["/target/"] = "200";
        
        return builder.updateAccountRecord("/path/", "/asset/", 50).then(function () {
            // goto record
            assert.equal(builder.records[0].key.toHex(), "2f706174682f3a444154413a676f746f");
            assert.equal(builder.records[0].value, null);
            assert.equal(builder.records[0].version.toHex(), "aaaa");
            // ACC record
            assert.equal(builder.records[1].key.toHex(), "2f7461726765742f3a4143433a2f61737365742f");
            assert.equal(builder.records[1].value.data.toHex(), "00000000000000fa");
            assert.equal(builder.records[1].version.toHex(), "bbbb");
        });
    });
    
    it("updateAccountRecord alias", function () {
        var api = new ApiClientMock();
        var builder = new TransactionBuilder(api);
        api.accountRecords["/aka/alias/"] = "200";
        
        return builder.updateAccountRecord("@alias", "/asset/", 50).then(function () {
            assert.equal(builder.records[0].key.toHex(), "2f616b612f616c6961732f3a4143433a2f61737365742f");
            assert.equal(builder.records[0].value.data.toHex(), "00000000000000fa");
            assert.equal(builder.records[0].version.toHex(), "bbbb");
        });
    });
    
    it("build", function () {
        var builder = new TransactionBuilder(new ApiClientMock());
        
        builder.addRecord(ByteBuffer.fromHex("ab"), ByteBuffer.fromHex("cd"), ByteBuffer.fromHex("ef"));
        builder.addRecord(ByteBuffer.fromHex("12"), null, ByteBuffer.fromHex("34"));
        builder.setMetadata({ "hello": "world" });
        
        var result = builder.build();
        
        assert.equal(result.toHex(), "0a03abcdef120b0a01ab12030a01cd1a01ef12060a01121a01341a117b2268656c6c6f223a22776f726c64227d");
    });
    
    it("submit", function () {
        var client = new SubmitClientMock();
        var builder = new TransactionBuilder(client);
        
        builder.addRecord(ByteBuffer.fromHex("ab"), ByteBuffer.fromHex("cd"), ByteBuffer.fromHex("ef"));
        builder.addSigningKey(new MutationSigner(new bitcore.HDPrivateKey("xprv9s21ZrQH143K2JF8RafpqtKiTbsbaxEeUaMnNHsm5o6wCW3z8ySyH4UxFVSfZ8n7ESu7fgir8imbZKLYVBxFPND1pniTZ81vKfd45EHKX73")));
        
        builder.submit();
        
        assert.equal(client.mutation.toHex(), "0a03abcdef120b0a01ab12030a01cd1a01ef");
        assert.equal(client.signatures.length, 1);
        assert.equal(client.signatures[0].pub_key, "023e4740d0ba639e28963f3476157b7cf2fb7c6fdf4254f97099cf8670b505ea59");
        assert.notEqual(client.signatures[0].signature.length, 0);
    });
});

var ApiClientMock = function () {
    this.namespace = ByteBuffer.fromHex("abcdef");
    this.gotoRecords = {};
    this.accountRecords = {};
    
    var _this = this;
    
    this.getDataRecord = function (path, recordName) {
        var key = new RecordKey(path, "DATA", recordName).toByteBuffer();
        
        var result;
        if (recordName == "goto" && _this.gotoRecords[path]) {
            result = _this.gotoRecords[path];
        }
        else {
            result = null;
        }
        
        return q.resolve({ data: result, key: key, version: ByteBuffer.fromHex("aaaa") });
    };
    
    this.getAccountRecord = function (path, asset) {
        var key = new RecordKey(path, "ACC", asset).toByteBuffer();
        
        var result;
        if (_this.accountRecords[path]) {
            result = Long.fromString(_this.accountRecords[path]);
        }
        else {
            result = Long.ZERO;
        }
        
        return q.resolve({ balance: result, key: key, version: ByteBuffer.fromHex("bbbb") });
    };
};

var SubmitClientMock = function () {
    this.namespace = ByteBuffer.fromHex("abcdef");
    
    this.submit = function (mutation, signatures) {
        this.mutation = mutation;
        this.signatures = signatures;
        
        return q.resolve("success");
    };
};