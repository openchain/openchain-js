var assert = require("assert");
var ByteBuffer = require("bytebuffer");

var openchain = require("../index");
var TransactionBuilder = openchain.TransactionBuilder;

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
        
        assert.throws(function () { new TransactionBuilder(client) }, Error);
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

    it("updateAccountRecord", function () {
        var builder = new TransactionBuilder(new ApiClientMock());
        
        builder.updateAccountRecord("/path/", "/asset/", 100);
        
        assert.equal(builder.metadata.toHex(), "7b2268656c6c6f223a22776f726c64227d");
    });
});

var ApiClientMock = function() {
    this.namespace = ByteBuffer.fromHex("abcdef");
}