// Use the JWT key
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({ pinataJWTKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMWZiMzQ4NS05ZGIwLTRlY2YtYWU3My0yYzk2MDRkZDMyN2UiLCJlbWFpbCI6ImFhbmRyZXdjaHVuZ0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYmVmNjUzNWJlMGZjODVlYTZmZTUiLCJzY29wZWRLZXlTZWNyZXQiOiI2MmY5MmFkNDI1N2ZiNjI0NmQ3OGNjMzA1NTg0MjQxYzY2NTMzZTAzOTM3MTIyNDc0MDFhYTk1MDgwN2ZiZmJiIiwiaWF0IjoxNzA2ODk5MTg2fQ.YdXB35NJCDZrWRurhSGYwPJoMmWzAdJig6HOSoFz-AY'});

// Define an async function to perform the operation
async function testPinataAuthentication() {
    try {
      const res = await pinata.testAuthentication();
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }
  
// Call the async function
// testPinataAuthentication();\

const fs = require('fs');

// Define an async function to perform file pinning
async function pinFileToIPFS() {
    const filePath = 'images/image1.jpg';
    const readableStreamForFile = fs.createReadStream(filePath);

    // Ensure MyCustomName is defined as a string
    const MyCustomName = "tylerpicture"; // Define or replace with your actual name

    const options = {
        pinataMetadata: {
            name: MyCustomName,
            keyvalues: {
                customKey: 'customValue',
                customKey2: 'customValue2'
            }
        },
        pinataOptions: {
            cidVersion: 0
        }
    };

    try {
        const res = await pinata.pinFileToIPFS(readableStreamForFile, options);
        console.log(res);
    } catch (error) {
        console.error(error);
    }
}

// Call the async function to pin file
pinFileToIPFS();