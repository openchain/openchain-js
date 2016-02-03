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
var openchain = require("../index");
var MutationSigner = openchain.MutationSigner;

describe("MutationSigner", function () {
    it("sign", function () {
        var privateKey = new bitcore.HDPrivateKey();
        var signer = new MutationSigner(privateKey);
        
        var result = signer.sign(ByteBuffer.fromHex("abcdef01234567"));
        
        assert.notEqual(result.toHex(), "");
    });
});
