const xrpl = require('xrpl');
  
async function burnXRP(seed, amount) {
    console.log("ye");
    // Connect to XRPL Testnet
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    results = "Connecting to ye ....\n"
    await client.connect()

    // const standby_wallet = xrpl.Wallet.fromSeed("sEd7Lhy7e22CdmpGH6UUyffUS6y3uQr")
    // const sendAmount = "100"; // Amount to send
    const standby_wallet = xrpl.Wallet.fromSeed(seed)
    const sendAmount = amount;

    const recipientAddress = "rPFaJ1Y5jhCf74cPSapMZZcYcHQ5uX3mZk" // Recipient's address
        

  
  // -------------------------------------------------------- Prepare transaction
  function toHex(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    let hex = '';
    data.forEach((byte) => {
      hex += byte.toString(16).padStart(2, '0');
    });
    return hex.toUpperCase();
  }      

  const prepared = await client.autofill({
    "TransactionType": "Payment",
    "Account": standby_wallet.address,
    "Amount": xrpl.xrpToDrops(sendAmount),
    "Destination": recipientAddress
  });
  
  
        
  // ------------------------------------------------- Sign prepared instructions
    const signed = standby_wallet.sign(prepared)
    
  // -------------------------------------------------------- Submit signed blob
    const tx = await client.submitAndWait(signed.tx_blob)
  
    // standbyBalanceField.value =  (await client.getXrpBalance(standby_wallet.address))
    // operationalBalanceField.value = (await client.getXrpBalance(operational_wallet.address))             
    console.log("burn successful");    
    client.disconnect()    
  } // End of sendXRP()
     

module.exports = {burnXRP};

