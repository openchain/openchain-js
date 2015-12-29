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

ApiClient.prototype.getDataRecord = function (account, recordName) {

};

ApiClient.prototype.getAccount = function (account, asset) {

}

module.exports = ApiClient;