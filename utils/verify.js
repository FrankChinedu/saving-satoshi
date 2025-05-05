const crypto = require('crypto');
const secp256k1 = require('@savingsatoshi/secp256k1js');
// View the library source code
// https://github.com/saving-satoshi/secp256k1js/blob/main/secp256k1.js

const GE = secp256k1.GE;
const FE = secp256k1.FE;
const ORDER = secp256k1.ORDER;
// Message digest from step 5:
const msg = 0x7a05c6145f10101e9d6325494245adf1297d80f8f38d4d576d57cdba220bcb19n;

// Signature values from step 6:
const sig_r =
  0x4e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd41n;
const sig_s =
  0x181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d09n;

// Public key values from step 7:
const pubkey_x =
  0x11db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cn;
const pubkey_y =
  0xb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3n;

function verify(sig_r, sig_s, pubkey_x, pubkey_y, msg) {
  // Verify an ECDSA signature given a public key and a message.
  // All input values will be 32-byte integers.

  // Start by creating a curve point representation of the public key
  const key = new GE(new FE(pubkey_x), new FE(pubkey_y));

  // Next, check the range limits of the signature values
  if (sig_r === 0n || sig_r >= ORDER) {
    console.log('invalid r value');
    return false;
  }
  if (sig_s === 0n || sig_s >= ORDER) {
    console.log('invalid s value');
    return false;
  }

  // Helper function:
  // Find modular multiplicative inverse using Extended Euclidean Algorithm
  function invert(value, modulus = ORDER) {
    let x0 = 0n;
    let x1 = 1n;
    let a = value;
    let m = modulus;

    while (a > 1n) {
      const q = a / m;
      let t = m;
      m = a % m;
      a = t;
      t = x0;
      x0 = x1 - q * x0;
      x1 = t;
    }

    if (x1 < 0n) x1 += modulus;

    return x1;
  }

  // Implement ECDSA and return a boolean
  // The Math:
  //   u1 = m / s mod n
  //   u2 = r / s mod n
  //   R = G * u1 + A * u2
  //   r == x(R) mod n
  // Hints:
  //   n = the order of the curve secp256k1.ORDER
  //   s, r = sig_s and sig_r, the two components of an ECDSA signature
  //   m = msg, the message to sign
  //   A = key, a key point constructed from pubkey_x and pubkey_y
  //   Use the invert() function above turn division into multiplication!
  // YOUR CODE HERE!
  const u1 = (msg * invert(sig_s)) % ORDER;
  const u2 = (sig_r * invert(sig_s)) % ORDER;
  const R = secp256k1.G.mul(u1).add(key.mul(u2));
  if (R.inf) return false;

  // 4) check R.x mod n == r
  // R.x is an FE; its .val is the raw BigInt
  return R.x.val % ORDER === sig_r;
}

// console.log(verify(sig_r, sig_s, pubkey_x, pubkey_y, msg));

// Provided by Vanderpoole
let text = 'I am Vanderpoole and I have control of the private key Satoshi\n';
text +=
  'used to sign the first-ever Bitcoin transaction confirmed in block #170.\n';
text += 'This message is signed with the same private key.';

function encode_message(text) {
  // Given an ascii-encoded text message, serialize a byte array
  // with the Bitcoin protocol prefix string followed by the text
  // and both components preceded by a length byte.
  // Returns a 32-byte hex value.
  const prefix = Buffer.from('Bitcoin Signed Message:\n', 'ascii');
  const message = Buffer.from(text, 'ascii');

  function compactSize(n) {
    if (n < 0xfd) return Buffer.from([n]);
    throw new Error('message too long');
  }

  const buf = Buffer.concat([
    compactSize(prefix.length),
    prefix,
    compactSize(message.length),
    message,
  ]);
  console.log({ buf });

  // 4) double‑SHA256
  const hash1 = crypto.createHash('sha256').update(buf).digest();
  const hash2 = crypto.createHash('sha256').update(hash1).digest();

  // 5) return 32‑byte result as hex
  return hash2.toString('hex');
}

console.log(encode_message(text));

// const byteArray = new Uint8Array([72, 101, 108, 108, 111]);
// const decoder = new TextDecoder();
// const val = decoder.decode(byteArray); // "Hello"
// const encoder = new TextEncoder();
// const encodedByteArray = encoder.encode(val);
// console.log({ encodedByteArray, val });
