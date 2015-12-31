var assert = require("assert");
var bitcore = require("bitcore-lib");
var ByteBuffer = require("bytebuffer");
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
