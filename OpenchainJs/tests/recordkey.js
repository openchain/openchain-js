var assert = require('assert');
var openchain = require("../index");
var RecordKey = openchain.RecordKey;

describe('RecordKey', function () {
    it('toString', function () {
        assert.equal(new RecordKey("/account/path/", "ACC", "/asset/path/").toString(), "/account/path/:ACC:/asset/path/");
    });

    it('toByteBuffer', function () {
        assert.equal(
            new RecordKey("/account/path/", "ACC", "/asset/path/").toByteBuffer().toHex(),
            "2f6163636f756e742f706174682f3a4143433a2f61737365742f706174682f");
    });

    it('parse string', function () {
        var result = RecordKey.parse("/account/path/:ACC:/asset/path/");

        assert.equal(result.path.toString(), "/account/path/");
        assert.equal(result.recordType, "ACC");
        assert.equal(result.name, "/asset/path/");
    });
});
