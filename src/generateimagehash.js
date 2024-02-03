const fs = require('fs');
const crypto = require('crypto');

// Function to generate a hash for a given file
function generateImageHash(filePath) {
  // Read the file content
  const fileData = fs.readFileSync(filePath);
  // Create a hash using SHA-256
  const hash = crypto.createHash('sha256');
  hash.update(fileData);
  // Return the hash in hexadecimal format
  return hash.digest('hex');
}

// Path to the image file
const filePath = 'images/image0.jpg';

// Generate and print the hash
// const fileHash = generateImageHash(filePath);
// console.log(`Hash for ${filePath}: ${fileHash}`);

module.exports = {generateImageHash};
