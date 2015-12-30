"use strict";

var LedgerPath = function (parts) {
    this.parts = parts;
}

LedgerPath.prototype.toString = function () {
    return "/" + this.parts.map(function (item) { return item + "/" }).join("");
}

LedgerPath.parse = function (value) {
    var parts = value.split("/");
    
    if (parts.length < 2 || parts[0] != "" || parts[parts.length - 1] != "") {
        throw new Error("Invalid path");
    }
    
    for (var i = 1; i < parts.length - 1; i++) {
        if (parts[i] == "") {
            throw new Error("Invalid path");
        }
    }

    return new LedgerPath(parts.slice(1, parts.length - 1));
};

module.exports = LedgerPath;