const express = require('express');
const { executeCreate, executeFinish } = require('./will'); // Ensure executeFinish is exported from test.js
const { generateUniqueID, generateImage } = require('./utils'); // Adjust the path accordingly
const { sendXRP } = require('./sendxrp');
const { burnXRP } = require('./burn');


const app = express();
const port = 3000;

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // This saves files to the 'uploads' directory

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(__dirname + '/images'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/profile.html');
});

app.get('/newFuneral', (req, res) => {
    res.sendFile(__dirname + '/newfuneral.html');
});

app.get('/burn', (req, res) => {
    res.sendFile(__dirname + '/burn.html');
});

// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        // Check if it's receiver mode based on the presence of specific fields
        const isReceiverMode = req.body.receiverSeedInput && req.body.originalAddressInput && req.body.sequenceNumberInput;

        let result, successMessage;

        if (isReceiverMode) {
            // Receiver mode
            const { receiverSeedInput, originalAddressInput, sequenceNumberInput } = req.body;
            // Assuming executeFinish needs these parameters
            result = await executeFinish(receiverSeedInput, originalAddressInput, sequenceNumberInput);
            successMessage = `TRANSACTION FINISHED SUCCESSFULLY`;
        } else {
            // Sender mode
            const { seedInput, receiverAddressInput, escrowAmountInput } = req.body;
            result = await executeCreate(seedInput, receiverAddressInput, escrowAmountInput);
            successMessage = `TRANSACTION CREATED SUCCESSFULLY. SEQUENCE NUMBER: ${result}`;
        }

        // Send back the success message
        res.json({ success: true, message: successMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error processing transaction", error: error.message });
    }
});

app.post('/newFuneral', upload.single('picture'), async (req, res) => {
    try {
        // Extract data from the form submission
        const { firstName, lastName, dateOfBirth, dateOfDeath, aiBackground, story } = req.body;

        // console.log(aiBackground);
        // Convert dates from YYYY-MM-DD to MM/DD/YY
        const convertDate = (dateString) => {
            const [year, month, day] = dateString.split("-");
            return `${month}/${day}/${year.substring(2)}`; // Convert YYYY-MM-DD to MM/DD/YY
        };

        const birthDateFormatted = convertDate(dateOfBirth);
        const dateOfDeathFormatted = convertDate(dateOfDeath);

        const uniqueID = generateUniqueID(lastName, firstName, birthDateFormatted, dateOfDeathFormatted);
        // Include your logic to save the funeral information to a database

        await generateImage(aiBackground);

        await sendXRP(uniqueID, "testingCID");
        
        res.json({ success: true, message: `Funeral created successfully with ID: ${uniqueID}` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating funeral", error: error.message });
    }
});

app.post('/burnXRP', upload.none(), async (req, res) => {
    try {
        const { seed, amount } = req.body;
        
        // Validate input
        if (!seed || !amount) {
            return res.status(400).json({ success: false, message: "Seed and amount are required." });
        }

        // Call the burnXRP function
        const result = await burnXRP(seed, amount);

        // Depending on your burnXRP function's implementation, you might want to adjust the response
        res.json({ success: true, message: "XRP burn request processed.", result: result });
    } catch (error) {
        console.error("Error burning XRP:", error);
        res.status(500).json({ success: false, message: "Error processing XRP burn request.", error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


app._router.stack.forEach((middleware) => {
    if (middleware.route) { // if it's a route handler
        console.log(`${Object.keys(middleware.route.methods)[0].toUpperCase()} ${middleware.route.path}`);
    }
});
