const crypto = require('crypto');

const uncompressedKey = [
  '52351505842cdb808c0f29b8ca897d41e4a484cf15a33c7edf7f047ecef9da9d',
  'c18601862d09fb778cec7f04ef3376ad360523cf081297400334882815d5f067',
];

// Determine if the y coordinate is even or odd and prepend the
// corresponding header byte to the x coordinate.
// Return a hex string
function compressPublicKey(publicKey) {
  const header_byte = {
    y_is_even: '02',
    y_is_odd: '03',
  };
  // YOUR CODE HERE
  const x = publicKey[0];
  const y = publicKey[1];

  // Convert the y coordinate (hex string) to a BigInt
  const yBigInt = BigInt(`0x${y}`);

  // Check if y is even or odd
  const isYEven = yBigInt % 2n === 0n;

  // Determine the header byte
  const header = isYEven ? header_byte.y_is_even : header_byte.y_is_odd;

  // Return the compressed public key as a hex string
  return header + x;
}

compressedPublicKey =
  '0352351505842cdb808c0f29b8ca897d41e4a484cf15a33c7edf7f047ecef9da9d';

// Get the sha256 digest of the compressed public key.
// Then get the ripemd160 digest of that sha256 hash
// Return 20-byte array
function hashCompressed(compressedPublicKey) {
  const compressBuffer = Buffer.from(compressedPublicKey, 'hex');
  const sha256Hash = crypto
    .createHash('sha256')
    .update(compressBuffer)
    .digest();

  // 3. RIPEMD-160 hash
  const ripemd160Hash = crypto
    .createHash('ripemd160')
    .update(sha256Hash)
    .digest();

  return ripemd160Hash.toString('hex');
}

const hashedPublicKey = hashCompressed(
  '0352351505842cdb808c0f29b8ca897d41e4a484cf15a33c7edf7f047ecef9da9d'
);
const publicKey = compressPublicKey(uncompressedKey);

const msg =
  '0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd37040000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3acffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac0000000001000000';

const sha256 = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest();
};

function msg_to_integer(msg) {
  console.log({ msg });
  const buffer = Buffer.from(msg, 'hex');
  const sha256Hash = sha256(sha256(buffer));
  return BigInt(`0x${sha256Hash.toString('hex')}`);
  // Given a hex string to sign, convert that string to a Buffer of bytes,
  // double-SHA256 the bytes and then return a BigInt() from the 32-byte digest.
}

exports.hashedPublicKey = hashedPublicKey;
exports.publicKey = publicKey;
