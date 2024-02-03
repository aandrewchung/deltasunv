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


const https = require('https');
const fs = require('fs');
const path = require('path');

const OpenAI = require("openai");
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Ensure your API key is set as an environment variable
});

// Function to download and save the image from a URL
function downloadImage(url, filePath) {
    const fileStream = fs.createWriteStream(filePath);
    https.get(url, function(response) {
        response.pipe(fileStream);
        fileStream.on('finish', function() {
            fileStream.close();
            console.log('Downloaded and saved image to', filePath);
        });
    }).on('error', function(err) { // Handle errors
        console.error('Error downloading the image:', err.message);
        fs.unlink(filePath, (unlinkErr) => { // Attempt to delete the file on error
            if (unlinkErr) console.error('Error removing file:', unlinkErr.message);
        });
    });
}

// Renamed main to generateImage and added prompt parameter
async function generateImage(prompt) {
    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1, // Number of images to generate
            size: "1792x1024" // Specify the size of the image
        });

        console.log(response.data); // Log the response data to see the output
        
        // Assuming the URL is directly accessible or within a property of response.data
        // You might need to adjust the path according to the actual response structure
        const imageUrl = response.data[0].url; // Access the first element's url property
        console.log(imageUrl)
        const savePath = path.join(__dirname, '../images/background/background.jpg');
        downloadImage(imageUrl, savePath);
    } catch (error) {
        console.error("Error generating image:", error);
    }
}

// Example command-line usage: node script.js "A cute baby sea otter"
// Alternatively, call generateImage directly with a prompt
// const customPrompt = "A beautiful sunset on the beach";
// generateImage(customPrompt);



module.exports = {generateUniqueID, generateImage};
