const xrpl = require('xrpl')

const cc = require('five-bells-condition')
const crypto = require('crypto')

const { generateImageHash } = require('./generateimagehash.js'); // Adjust the path according to your file structure


async function createConditionalEscrow(condition, originSeed, receiver, amount) {
    // Connect to XRPL Testnet
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    // Define the will creator's wallet using a seed
    const creatorWallet = xrpl.Wallet.fromSeed(originSeed) // Replace with actual seed

    // Define the beneficiary address and escrow details
    const beneficiaryAddress = receiver // Replace with actual beneficiary address
    const escrowAmount = amount; // Correct amount in drops for 1 XRP
    
    // Set the escrow release condition - CancelAfter
    let cancelAfter = xrpl.isoTimeToRippleTime(new Date(Date.now() + 86400000)) // 86400000 ms = 1 day

    // Prepare the escrow transaction
    const escrowTx = {
        "TransactionType": "EscrowCreate",
        "Account": creatorWallet.address,
        "Amount": escrowAmount,
        "Destination": beneficiaryAddress,
        "CancelAfter": cancelAfter,
        "Condition": condition // Use the condition generated from your preimage
    };

    // Autofill transaction to get the current sequence and fee
    const preparedTx = await client.autofill(escrowTx);
    // After autofilling the transaction, manually adjust LastLedgerSequence
    // preparedTx.LastLedgerSequence += 5; // Adds a buffer of 5 ledgers

    const signedTx = creatorWallet.sign(preparedTx);

    // Submit the transaction
    const tx = await client.submitAndWait(signedTx.tx_blob);
    console.log(tx);

    // Extract and return the sequence number of the escrow transaction
    const sequenceNumber = tx.result.Sequence || tx.result.tx_json.Sequence;

    // Disconnect from the client
    client.disconnect();
    
    return sequenceNumber;
}

async function finishConditionalEscrow(condition, fulfillment, sequence_number, receiverSeed, origin) {
    // Connect to XRPL Testnet
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    results = "Connecting to ye ....\n"
    await client.connect()
    results  += "Connected. Finishing escrow.\n"

    // Initialize the wallet attempting to finish the escrow
    // Replace "yourOperationalWalletSeedHere" with the actual operational wallet seed
    const operational_wallet = xrpl.Wallet.fromSeed(receiverSeed);

    // Replace these placeholders with the actual values retrieved from your application's state or inputs
    const ownerAddress = origin; // The address that created the escrow
    const escrowSequence = parseInt(sequence_number); // Escrow sequence number from when it was created

    // Prepare the EscrowFinish transaction
    const prepared = await client.autofill({
        "TransactionType": "EscrowFinish",
        "Account": operational_wallet.address, // The address attempting to finish the escrow
        "Owner": ownerAddress, // The address that created the escrow
        "OfferSequence": escrowSequence, // The sequence number of the escrow creation transaction
        "Condition": condition, // Condition that was used to create the escrow
        "Fulfillment": fulfillment // The preimage in hex format that satisfies the condition
    });

    // Sign prepared instructions
    const signed = operational_wallet.sign(prepared);

    // Submit signed blob
    const tx = await client.submitAndWait(signed.tx_blob);
    results += "\nTransaction result: " + 
        JSON.stringify(tx, null, 2);

    // Fetch and display the updated balances (optional, depending on your application's needs)
    // This assumes you have methods or a way to display these balances
    console.log("Transaction completed. Check balances accordingly.");

    client.disconnect();
}

function generateConditionAndFulfillmentFromImage(filePath) {
    // Use the hash of the image as the preimage data
    const preimageHex = generateImageHash(filePath);
    const preimageData = Buffer.from(preimageHex, 'hex');

    // Create a fulfillment object for a PREIMAGE-SHA-256 condition
    const fulfillment = new cc.PreimageSha256();
    fulfillment.setPreimage(preimageData);

    // Get the condition binary and convert it to a hex string, uppercase
    const condition = fulfillment.getConditionBinary().toString('hex').toUpperCase();

    // Serialize the fulfillment to binary and convert to a hex string, uppercase
    const fulfillment_hex = fulfillment.serializeBinary().toString('hex').toUpperCase();

    // Return both the condition and the fulfillment hex string
    return { condition, fulfillment_hex };
}

async function executeCreate(seedInput, receiverAddressInput, escrowAmountInput) {
    try {
        const filePath = 'images/image0.jpg';
        const { condition, fulfillment_hex } = generateConditionAndFulfillmentFromImage(filePath);

        // const originSeed = "sEd7Lhy7e22CdmpGH6UUyffUS6y3uQr";
        // const receiver = "rPFaJ1Y5jhCf74cPSapMZZcYcHQ5uX3mZk";
        // const amount = "1000000";
        const originSeed = seedInput;
        const receiver = receiverAddressInput;
        const amount = escrowAmountInput;
        const sequenceNumber = await createConditionalEscrow(condition, originSeed, receiver, amount);
        console.log("Escrow created with Sequence Number:", sequenceNumber);
        // Now you can use sequenceNumber for further operations

        return sequenceNumber;

    } catch (error) {
        console.error("Error creating escrow:", error);
    }
}

// executeCreate();

async function executeFinish(receiverSeedInput, originalAddressInput, sequenceNumber) {
    try {
        const filePath = 'images/image0.jpg';
        const { condition, fulfillment_hex } = generateConditionAndFulfillmentFromImage(filePath);

        // const receiverSeed = "sEdVozpABEJJNhrzA3LRUtbLXbvCsU1";
        // const origin = "rG1YJWcJ1nXPBncfHkoDfuLU7Cut5vS52b";
        const receiverSeed = receiverSeedInput;
        const origin = originalAddressInput
        finishConditionalEscrow(condition, fulfillment_hex, sequenceNumber, receiverSeed, origin).catch(console.error);

    } catch (error) {
        console.error("Error creating escrow:", error);
    }
}

// executeFinish();

module.exports = { executeCreate, executeFinish };

