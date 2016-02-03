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
var ByteBuffer = require("protobufjs").ByteBuffer;
var openchain = require("../index");
var RecordKey = openchain.RecordKey;

describe("RecordKey", function () {
    it("toString", function () {
        assert.equal(new RecordKey("/account/path/", "ACC", "/asset/path/").toString(), "/account/path/:ACC:/asset/path/");
    });
    
    it("toByteBuffer", function () {
        assert.equal(
            new RecordKey("/account/path/", "ACC", "/asset/path/").toByteBuffer().toHex(),
            "2f6163636f756e742f706174682f3a4143433a2f61737365742f706174682f");
    });
    
    it("parse string", function () {
        var result1 = RecordKey.parse("/account/path/:ACC:/asset/path/");
        var result2 = RecordKey.parse("/account/path/:DATA:record:name");
        
        assert.equal(result1.path.toString(), "/account/path/");
        assert.equal(result1.recordType, "ACC");
        assert.equal(result1.name, "/asset/path/");
        assert.equal(result2.path.toString(), "/account/path/");
        assert.equal(result2.recordType, "DATA");
        assert.equal(result2.name, "record:name");
    });
    
    it("parse ByteBuffer", function () {
        var result = RecordKey.parse(ByteBuffer.fromHex("2f6163636f756e742f706174682f3a4143433a2f61737365742f706174682f"));
        
        assert.equal(result.path.toString(), "/account/path/");
        assert.equal(result.recordType, "ACC");
        assert.equal(result.name, "/asset/path/");
    });
    
    it("parse invalid", function () {
        assert.throws(function () { RecordKey.parse("/account/path/:ACC"); }, Error);
    });
});
