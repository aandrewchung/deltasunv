const crypto = require('crypto');

// Function to generate a unique ID based on the deceased's personal information
function generateUniqueID(lastName, firstName, birthDate, dateOfDeath) {
  // Concatenate the attributes to form a string
  const attributes = `${lastName}${firstName}${birthDate}${dateOfDeath}`;
  // Create a hash of the concatenated string
  const hash = crypto.createHash('sha256');

  hash.update(attributes);

  // Return the hash in hexadecimal format as the unique ID
  return hash.digest('hex');
}

// Example usage
// const lastName = "Chung"
// const firstName = "Andrew"
// const birthDate = "12/06/02"
// const dateOfDeath = "02/02/24"

// Generate and print the unique ID
// const uniqueID = generateUniqueID(lastName, firstName, birthDate, dateOfDeath);
// console.log(`Unique ID for the deceased: ${uniqueID}`);

module.exports = {generateUniqueID};
