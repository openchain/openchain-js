"use strict";

var Schema = require("./schema");
var ByteBuffer = Schema.ByteBuffer;
var ApiClient = require("./apiclient");

function TransactionBuilder(url) {
    this.client = new ApiClient(url);
    this.records = [];
    this.metadata = ByteBuffer.fromHex(""),
    this.namespace = null;
};

TransactionBuilder.prototype.addRecord = function (key, value, version) {
    var newRecord = {
        "key": key,
        "version": version
    };
    
    if (value != null) {
        newRecord["value"] = { "data": value };
    }
    else {
        newRecord["value"] = null;
    }
    
    this.records.push(newRecord);

    return this;
};

TransactionBuilder.prototype.setMetadata = function (data) {
    this.metadata = encodingService.encodeString(JSON.stringify(data));
}

TransactionBuilder.prototype.addAccountRecord = function (path, delta) {

}

TransactionBuilder.prototype.fetchAndAddAccountRecord = function (account, asset, delta) {
    // Resolve name accounts
    if (account.slice(0, 1) == "@") {
        account = "/aka/" + account.slice(1, account.length) + "/";
    }
    
    return this.client.getDataRecord(account, "goto").then(function (result) {
        if (result.data == null) {
            return account;
        }
        else {
            // If a goto DATA record exists, we use the redirected path
            this.addRecord(result.key, null, result.version);
            return result.data;
        }
    }).then(function (accountResult) {
        return this.client.getAccountRecord(accountResult, asset);
    })
    .then(function (currentRecord) {
        this.addAccountRecord(currentRecord, change);
    });
}

TransactionBuilder.prototype.submit = function () {
    var constructedTransaction = new protobufBuilder.Mutation({
        "namespace": this.namespace,
        "records": this.records,
        "metadata": this.metadata
    });
    
    return apiService.postTransaction(_this.endpoint, constructedTransaction.encode(), key);
}

module.exports = TransactionBuilder;