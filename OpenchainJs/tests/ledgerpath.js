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
        assert.throws(function () { LedgerPath.parse("abc/def/") }, Error);
        assert.throws(function () { LedgerPath.parse("abc/") }, Error);
        assert.throws(function () { LedgerPath.parse("/abc/def") }, Error);
        assert.throws(function () { LedgerPath.parse("/abc") }, Error);
        assert.throws(function () { LedgerPath.parse("") }, Error);
        assert.throws(function () { LedgerPath.parse("/abc//def/") }, Error);
        assert.throws(function () { LedgerPath.parse("/abc/def//") }, Error);
    });
});
