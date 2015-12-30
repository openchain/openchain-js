var openchain = require("../index");

var assert = require("assert");
var ByteBuffer = require("bytebuffer");
var Long = require("long");

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

    it('getDataRecord', function () {
        return client.getDataRecord("/", "info").then(function (result) {
            assert.equal(result.key.toHex(), "2f3a444154413a696e666f");
            assert.notEqual(result.value.toHex(), "");
            assert.notEqual(result.data, null);
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
