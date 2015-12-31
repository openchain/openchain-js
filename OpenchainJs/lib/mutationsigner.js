﻿// Copyright 2015 Coinprism, Inc.
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

var bitcore = require("bitcore-lib");
var ByteBuffer = require("bytebuffer");

/**
 * Provides the ability to sign a mutation.
 * 
 * @constructor
 * @param {!HDPrivateKey} privateKey The private key used to sign the mutations.
 */
var MutationSigner = function (privateKey) {
    this.privateKey = privateKey;
};

/** 
 * Signs a mutatation.
 * 
 * @param {!ByteBuffer} mutation The mutation to sign.
 * @return {!ByteBuffer} The signature.
 */
MutationSigner.prototype.sign = function (mutation) {
    var transactionBuffer = new Uint8Array(mutation.toArrayBuffer());
    var hash = bitcore.crypto.Hash.sha256(bitcore.crypto.Hash.sha256(transactionBuffer));
    
    var signatureBuffer = bitcore.crypto.ECDSA().set({
        hashbuf: hash,
        endian: "big",
        privkey: this.privateKey.privateKey
    }).sign().sig.toBuffer();
    
    return ByteBuffer.wrap(signatureBuffer);
}

/** 
 * Get the public key associated to the signer.
 * 
 * @return {!ByteBuffer} The public key.
 */
MutationSigner.prototype.getPublicKey = function () {
    return ByteBuffer.wrap(this.privateKey.publicKey.toBuffer());
}

module.exports = MutationSigner;