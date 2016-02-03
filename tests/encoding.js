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
var Long = require("protobufjs").Long;
var openchain = require("../index");

describe("encoding", function () {
    it("encodeString", function () {
        var result = openchain.encoding.encodeString("ABC");
        assert.equal(result.toHex(), "414243");
    });
    
    it("encodeInt64", function () {
        var result = openchain.encoding.encodeInt64(Long.fromString("25000"));
        assert.equal(result.toHex(), "00000000000061a8");
    });
    
    it("decodeString", function () {
        var result = openchain.encoding.decodeString(ByteBuffer.fromHex("414243"));
        assert.equal(result, "ABC");
    });
    
    it("decodeInt64", function () {
        var result1 = openchain.encoding.decodeInt64(ByteBuffer.fromHex("00000000000061a8"));
        var result2 = openchain.encoding.decodeInt64(ByteBuffer.fromHex(""));
        
        assert.deepEqual(result1, Long.fromString("25000", false));
        assert.deepEqual(result2, Long.fromString("0", false));
    });
});
