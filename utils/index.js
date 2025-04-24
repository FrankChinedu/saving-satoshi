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

exports.hashedPublicKey = hashedPublicKey;
exports.publicKey = publicKey;
