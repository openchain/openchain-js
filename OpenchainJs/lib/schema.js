"use strict";
var ByteBuffer = require("bytebuffer");

function Record(key, value, version) {
    this.key = key;
    this.value = value;
    this.version = version;
};

function Mutation() {

};

function Transaction() {

};

module.exports = {
	Record: Record,
	Mutation: Mutation,
	Transaction: Transaction
};