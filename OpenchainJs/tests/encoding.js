var assert = require("assert");
var ByteBuffer = require("bytebuffer");
var Long = require("long");
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
