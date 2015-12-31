Openchain is an open source distributed ledger technology. It is suited for organizations wishing to issue and manage digital assets in a robust, secure and scalable way. Visit [openchain.org](https://www.openchain.org/) for more information.

The full documentation for Openchain is available at [docs.openchain.org](https://docs.openchain.org/).

This module is a NodeJS client library to use in conjunction with the Openchain [server](https://github.com/openchain/openchain/).

## Installation

``` bash
$ npm install openchain
```

## Usage

### Import the module

``` js
var openchain = require("openchain");
```

### Submit a transaction

``` js
var openchain = require("openchain");
var bitcore = require("bitcore-lib");

var seed = "0123456789abcdef0123456789abcdef";

// Load a private key from a seed
var privateKey = bitcore.HDPrivateKey.fromSeed(seed, "openchain");
var address = privateKey.publicKey.toAddress();

// Calculate the accounts corresponding to the private key
var issuancePath = "/asset/p2pkh/" + address + "/";
var assetPath = issuancePath;
var walletPath = "/p2pkh/" + address + "/";

console.log("Issuance path: " + issuancePath);
console.log("Wallet path: " + walletPath);

// Create an Openchain client and signer
var client = new openchain.ApiClient("http://localhost:8080/");
var signer = new openchain.MutationSigner(privateKey);

// Initialize the client
client.initialize().then(function () {

    return new openchain.TransactionBuilder(client)
        // Add the key to the transaction builder
        .addSigningKey(signer)
        // Add some metadata to the transaction
        .setMetadata({ "memo": "Issued through NodeJS" })
        // Take 100 units of the asset from the issuance path
        .updateAccountRecord(issuancePath, assetPath, -100);

}).then(function (transactionBuilder) {
    
    // Add 100 units of the asset to the target wallet path
    return transactionBuilder.updateAccountRecord(walletPath, assetPath, 100);

}).then(function (transactionBuilder) {
    
    // Submit the transaction
    return transactionBuilder.submit();

}).then(function (result) {
    
    console.log(result);
});
```

## License

Copyright 2015 Coinprism, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
