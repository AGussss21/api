import midtransClient from "midtrans-client";
import dotenv from "dotenv";
dotenv.config();

(async () => {
  const snap = new midtransClient.Snap({ isProduction: false, serverKey: process.env.MIDTRANS_SERVER_KEY, clientKey: process.env.MIDTRANS_CLIENT_KEY });
  try {
    const param = {
      transaction_details: { order_id: "TEST-"+Date.now(), gross_amount: 10000 },
      item_details: [{ id: "t1", price: 10000, quantity: 1, name: "Test" }],
    };
    const r = await snap.createTransaction(param);
    console.log("snap ok:", r);
  } catch (e) {
    console.error("midtrans error:", e && e.response ? e.response : e);
  }
})();
