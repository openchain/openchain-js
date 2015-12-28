var assert = require('assert');
var openchain = require("../index");

describe('Schema', function () {
    it('Record', function () {
        var record = new openchain.Schema.Record();
        
        record.key = openchain.Schema.ByteBuffer.fromHex("abcd");
        record.value = openchain.Schema.ByteBuffer.fromHex("0123");
        record.version = openchain.Schema.ByteBuffer.fromHex("4567");

        assert.equal(record.key.toHex(), "abcd");
        assert.equal(record.value.toHex(), "0123");
        assert.equal(record.version.toHex(), "4567");
    });

    it('Mutation', function () {
        var mutation = new openchain.Schema.Mutation();
        
        mutation.namespace = openchain.Schema.ByteBuffer.fromHex("abcd");
        
        assert.equal(mutation.namespace.toHex(), "abcd");
    });

    it('Transaction', function () {
        var transaction = new openchain.Schema.Transaction();
        
        transaction.mutation = openchain.Schema.ByteBuffer.fromHex("abcd");
        
        assert.equal(transaction.mutation.toHex(), "abcd");
    });
});
