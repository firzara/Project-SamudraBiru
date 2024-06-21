require("dotenv").config();
const midtransClient = require("midtrans-client");
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

async function CreateTransaction(orderId, price) {
  let parameters = {
    transaction_details: {
      order_id: orderId,
      gross_amount: price,
    },
  };
  try {
    const result = await snap.createTransaction(parameters);
    let snap_url = result.redirect_url;
    console.log(snap_url);
    return snap_url;
  } catch (error) {
    console.log(error);
    throw error; 
  }
}

module.exports = { CreateTransaction };
