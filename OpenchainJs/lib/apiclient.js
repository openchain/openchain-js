"use strict";

var q = require("q");
var request = require("request-promise");

function ApiClient(endpoint) {
    this.endpoint = endpoint;
};

ApiClient.prototype.getRecord = function (key) {
    
    return request({
        uri: this.endpoint + "record",
        qs: { key: key },
        json: true
    });
};

module.exports = ApiClient;