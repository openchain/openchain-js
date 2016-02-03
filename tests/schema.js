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
var openchain = require("../index");

describe("Schema", function () {
    it("Record", function () {
        var record = new openchain.Schema.Record();
        
        record.key = openchain.ByteBuffer.fromHex("abcd");
        record.value = openchain.ByteBuffer.fromHex("0123");
        record.version = openchain.ByteBuffer.fromHex("4567");
        
        assert.equal(record.key.toHex(), "abcd");
        assert.equal(record.value.toHex(), "0123");
        assert.equal(record.version.toHex(), "4567");
    });
    
    it("Mutation", function () {
        var mutation = new openchain.Schema.Mutation();
        
        mutation.namespace = openchain.ByteBuffer.fromHex("abcd");
        
        assert.equal(mutation.namespace.toHex(), "abcd");
    });
    
    it("Transaction", function () {
        var transaction = new openchain.Schema.Transaction();
        
        transaction.mutation = openchain.ByteBuffer.fromHex("abcd");
        
        assert.equal(transaction.mutation.toHex(), "abcd");
    });
});
