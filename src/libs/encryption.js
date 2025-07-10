
function gcd(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}


function modInverse(a, m) {
  let m0 = m, x0 = 0, x1 = 1;
  if (m === 1) return 0;

  while (a > 1) {
    let q = Math.floor(a / m);
    let t = m;
    m = a % m;
    a = t;
    t = x0;
    x0 = x1 - q * x0;
    x1 = t;
  }

  if (x1 < 0) x1 += m0;
  return x1;
}

function modPow(base, exponent, modulus) {
  let result = 1;
  base = base % modulus;

  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }

  return result;
}


function generateRSAKeys() {
  const p = 61; // Prime number p
  const q = 53; // Prime number q
  const n = p * q; // n = p * q
  const phi = (p - 1) * (q - 1); // Euler's Totient function
  let e = 17; // Common public exponent

  while (gcd(e, phi) !== 1) {
    e++;
  }

  const d = modInverse(e, phi); // Private exponent

  return {
    publicKey: { e, n },
    privateKey: { d, n },
  };
}

// Encrypt using RSA
function encryptRSA(message, publicKey) {
  const { e, n } = publicKey;
  const m = parseInt(message, 10); // Convert string to integer
  const c = modPow(m, e, n); // Encrypt using RSA formula
  return c.toString(); // Return the encrypted number as string
}

// Decrypt using RSA
function decryptRSA(encryptedMessage, privateKey) {
  const { d, n } = privateKey;
  const c = parseInt(encryptedMessage, 10); // Convert the encrypted message back to integer
  const m = modPow(c, d, n); // Decrypt using RSA formula
  return m.toString(); // Return the decrypted number as string
}

module.exports = { generateRSAKeys, encryptRSA, decryptRSA };
