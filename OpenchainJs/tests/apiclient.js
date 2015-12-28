var assert = require("assert");
var openchain = require("../index");

describe('ApiClient', function () {
    
    it('getRecord', function () {
        var client = new openchain.ApiClient("https://test.openchain.org/");
        return client.getRecord("0000").then(function (result) {
            assert.equal(result.key, "0000");
            assert.equal(result.value, "");
            assert.equal(result.version, "");
        });
    });

});
