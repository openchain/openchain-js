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

var bitcore = require("bitcore-lib");
var ByteBuffer = require("protobufjs").ByteBuffer;

/**
 * Provides the ability to sign a mutation.
 * 
 * @constructor
 * @param {!HDPrivateKey} privateKey The private key used to sign the mutations.
 */
function MutationSigner(privateKey) {
    this.publicKey = ByteBuffer.wrap(privateKey.publicKey.toBuffer());
    this._signer = bitcore.crypto.ECDSA().set({
        endian: "big",
        privkey: privateKey.privateKey
    });
}

/** 
 * Signs a mutatation.
 * 
 * @param {!ByteBuffer} mutation The mutation to sign.
 * @return {!ByteBuffer} The signature.
 */
MutationSigner.prototype.sign = function (mutation) {
    var transactionBuffer = new Uint8Array(mutation.toArrayBuffer());
    var hash = bitcore.crypto.Hash.sha256(bitcore.crypto.Hash.sha256(transactionBuffer));
    
    var signatureBuffer = this._signer.set({ hashbuf: hash }).sign().sig.toBuffer();
    
    return ByteBuffer.wrap(signatureBuffer);
};

module.exports = MutationSigner;