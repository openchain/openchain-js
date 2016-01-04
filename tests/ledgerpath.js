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
var LedgerPath = openchain.LedgerPath;

describe('LedgerPath', function () {
    it('toString', function () {
        assert.equal(new LedgerPath(["a", "b", "c"]).toString(), "/a/b/c/");
        assert.equal(new LedgerPath(["a"]).toString(), "/a/");
        assert.equal(new LedgerPath([]).toString(), "/");
    });
    
    it('parse valid', function () {
        assert.deepEqual(LedgerPath.parse("/a/b/c/").parts, ["a", "b", "c"]);
        assert.deepEqual(LedgerPath.parse("/a/").parts, ["a"]);
        assert.deepEqual(LedgerPath.parse("/").parts, []);
    });
    
    it('parse invalid', function () {
        assert.throws(function () { LedgerPath.parse("abc/def/"); }, Error);
        assert.throws(function () { LedgerPath.parse("abc/"); }, Error);
        assert.throws(function () { LedgerPath.parse("/abc/def"); }, Error);
        assert.throws(function () { LedgerPath.parse("/abc"); }, Error);
        assert.throws(function () { LedgerPath.parse(""); }, Error);
        assert.throws(function () { LedgerPath.parse("/abc//def/"); }, Error);
        assert.throws(function () { LedgerPath.parse("/abc/def//"); }, Error);
    });
});
