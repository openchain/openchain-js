Openchain is an open source distributed ledger technology. It is suited for organizations wishing to issue and manage digital assets in a robust, secure and scalable way. Visit [openchain.org](https://www.openchain.org/) for more information.

The full documentation for Openchain is available at [docs.openchain.org](https://docs.openchain.org/).

This module is a NodeJS client library to use in conjunction with the Openchain [server](https://github.com/openchain/openchain/).

## Getting started

### Node.js

Install the module through NPM:

``` bash
$ npm install openchain
```

Import the module:

``` js
var openchain = require("openchain");
```

### In the browser

Install the module through Bower:

``` bash
$ bower install openchain
```

Reference the scripts:

``` html
<script src="bower_components/bitcore-lib/bitcore-lib.min.js"></script>
<script src="bower_components/openchain/dist/openchain.min.js"></script>
```

Import the module:

``` js
var openchain = require("openchain");
```

## Modules

The ``openchain`` module exports the following objects:

- ``ApiClient``: A class wrapping the Openchain API calls.
- ``Schema``: A set of classes (``Schema.Record``, ``Schema.Mutation`` and ``Schema.Transaction``) that can be used for serialization and deserialization of transactions and mutations.
- ``TransactionBuilder``: A class facilitating the construction, signature and submission of transactions to an Openchain instance.
- ``LedgerPath``: A class representing a path within the Openchain structure.
- ``RecordKey``: A class representing a record key.
- ``encoding``: A submodule that contains methods that can be used for encoding and decoding integers and string to/from a ``ByteBuffer`` object.
- ``MutationSigner``: A class that can be used to sign a mutation.
- ``ByteBuffer``: A buffer of raw bytes.
- ``Long``: A class for representing a 64 bit integer value.

## Code samples

### Query the balance of an account

This code queries an Openchain server for the balance of the account represented by the path ``/p2pkh/Xat6UaXpQE9Dxv6rLtxY1peBkzC1SQDiEX/`` for the asset represented by the path ``/asset/p2pkh/XcDCGPMtdrKxodQ4soFyYfDmr78gTvJ9jN/``.

``` js
var openchain = require("openchain");
        
var client = new openchain.ApiClient("http://localhost:8080/");

client.getAccountRecord(
    // Account path
    "/p2pkh/Xat6UaXpQE9Dxv6rLtxY1peBkzC1SQDiEX/",
    // Asset path
    "/asset/p2pkh/XcDCGPMtdrKxodQ4soFyYfDmr78gTvJ9jN/")
.then(function (result) {
    console.log("Balance: " + result.balance.toString());
});
```

### Submit a transaction

This code submits a transaction that transfers 100 units of an asset from an issuance account (e.g. ``/asset/p2pkh/Xat6UaXpQE9Dxv6rLtxY1peBkzC1SQDiEX/``) to a normal wallet account (e.g. ``/p2pkh/Xat6UaXpQE9Dxv6rLtxY1peBkzC1SQDiEX/``).

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
client.initialize()
.then(function () {
    // Create a new transaction builder
    return new openchain.TransactionBuilder(client)
        // Add the key to the transaction builder
        .addSigningKey(signer)
        // Add some metadata to the transaction
        .setMetadata({ "memo": "Issued through NodeJS" })
        // Take 100 units of the asset from the issuance path
        .updateAccountRecord(issuancePath, assetPath, -100);
})
.then(function (transactionBuilder) {
    // Add 100 units of the asset to the target wallet path
    return transactionBuilder.updateAccountRecord(walletPath, assetPath, 100);
})
.then(function (transactionBuilder) {
    // Submit the transaction
    return transactionBuilder.submit();
})
.then(function (result) { console.log(result); });
```

### Store data on the chain

This code submits a transaction recording a piece of arbitrary data (the ``storedData`` variable) into the chain. The data may be anything: arbitrary text, JSON data, XML data or even binary data.

[Asset definition records](https://docs.openchain.org/en/latest/ledger-rules/general.html#asset-definition-record-asdef), [ACL records](https://docs.openchain.org/en/latest/ledger-rules/dynamic-permissions.html) and [goto records](https://docs.openchain.org/en/latest/ledger-rules/general.html#goto-records-goto) use this approach.

``` js
var openchain = require("openchain");
var bitcore = require("bitcore-lib");

var seed = "0123456789abcdef0123456789abcdef";

// Load a private key from a seed
var privateKey = bitcore.HDPrivateKey.fromSeed(seed, "openchain");
var address = privateKey.publicKey.toAddress();

// Calculate the accounts corresponding to the private key
var dataPath = "/asset/p2pkh/" + address + "/metadata/";
var recordName = "datarecord";
var storedData = "This is the data to store in the chain";

console.log("Account path: " + dataPath);
console.log("Record name: " + recordName);

// Create an Openchain client and signer
var client = new openchain.ApiClient("http://localhost:8080/");
var signer = new openchain.MutationSigner(privateKey);

// Initialize the client
client.initialize()
.then(function () {
    // Retrieve the record being modified
    return client.getDataRecord(dataPath, recordName)
})
.then(function (dataRecord) {
    // Encode the data into a ByteBuffer
    var newValue = openchain.encoding.encodeString(storedData);

    // Create a new transaction builder
    return new openchain.TransactionBuilder(client)
        // Add the key to the transaction builder
        .addSigningKey(signer)
        // Modify the record
        .addRecord(dataRecord.key, newValue, dataRecord.version)
        // Submit the transaction
        .submit();
})
.then(function (result) { console.log(result); });
```

### Other use

The Openchain JavaScript client library is also used by the Openchain web-wallet available on [GitHub](https://github.com/openchain/wallet/).

## License

Copyright 2015 Coinprism, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
