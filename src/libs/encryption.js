// libs/encryption.js

// Feistel Cipher Round Function
function feistelRound(left, right, key) {
  const roundResult = (right ^ key) >>> 0; // XOR right with the key
  return {
    left: right, // The new left half is the old right half
    right: left ^ roundResult, // The new right half is XOR of the old left half and round result
  };
}

// Encrypt using the Feistel Cipher
const encryptFeistel = (message, key, rounds = 4) => {
  let messageStr = message.toString();
  const n = messageStr.length;

  // Ensure an even number of digits
  if (n % 2 !== 0) {
    messageStr = '0' + messageStr;
  }

  let left = parseInt(messageStr.slice(0, n / 2), 10); // Left half
  let right = parseInt(messageStr.slice(n / 2), 10); // Right half

  // Apply rounds of the Feistel cipher
  for (let round = 0; round < rounds; round++) {
    const result = feistelRound(left, right, key);
    left = result.left;
    right = result.right;
  }

  // Combine the halves
  return `${left}${right}`;
};

// Decrypt using the Feistel Cipher
const decryptFeistel = (encryptedMessage, key, rounds = 4) => {
  let messageStr = encryptedMessage.toString();
  const n = messageStr.length;

  // Ensure an even number of digits
  if (n % 2 !== 0) {
    messageStr = '0' + messageStr;
  }

  let left = parseInt(messageStr.slice(0, n / 2), 10);
  let right = parseInt(messageStr.slice(n / 2), 10);

  // Reverse the rounds of the Feistel cipher
  for (let round = 0; round < rounds; round++) {
    const result = feistelRound(right, left, key); // Reverse the operation order
    right = result.left;
    left = result.right;
  }

  return `${left}${right}`;
};

module.exports = {
  encryptFeistel,
  decryptFeistel,
};
