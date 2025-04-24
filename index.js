const bech32 = require('@savingsatoshi/bech32js');
const { hashedPublicKey } = require('./utils');
// Insert checksum and metadata, encode using bech32 and return a string
// See the library source code for the exact API.
// https://github.com/saving-satoshi/bech32js/blob/main/bech32.js
function hashToAddress(hash) {
  const pubKeyHash = Buffer.from(hash, 'hex');

  return bech32.encode('tc', 0, pubKeyHash);
}
console.log({ hashedPublicKey });

const bech = hashToAddress(hashedPublicKey);
console.log({ bech });
