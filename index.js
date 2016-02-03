// Copyright 2015 Coinprism, Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

module.exports.ApiClient = require("./lib/apiclient");
module.exports.Schema = require("./lib/schema");
module.exports.TransactionBuilder = require("./lib/transactionbuilder");
module.exports.LedgerPath = require("./lib/ledgerpath");
module.exports.RecordKey = require("./lib/recordkey");
module.exports.encoding = require("./lib/encoding");
module.exports.MutationSigner = require("./lib/mutationsigner");
module.exports.ByteBuffer = require("protobufjs").ByteBuffer;
module.exports.Long = require("protobufjs").Long;

// Create the "openchain" network
var bitcore = require("bitcore-lib");
var livenet = bitcore.Networks.get("livenet");
bitcore.Networks.add({
    name: "openchain",
    alias: "Openchain",
    pubkeyhash: 76,
    privatekey: livenet.privatekey,
    scripthash: 78,
    xpubkey: livenet.xpubkey,
    xprivkey: livenet.xprivkey,
    networkMagic: 0,
    port: livenet.port,
    dnsSeeds: livenet.dnsSeeds
});