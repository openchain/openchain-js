"use strict";

var bitcore = require("bitcore-lib");

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