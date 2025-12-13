// routes/payments.js (pastikan import include createSnapTransaction)
import express from "express";
import { createOrder, getOrder, confirmPayment, midtransNotification, createSnapTransaction } from "../controllers/paymentController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ ok: true, message: "Payments router alive" });
});

router.post("/orders", createOrder);
router.get("/orders/:order_id", getOrder);
router.post("/orders/confirm", confirmPayment);
router.post("/midtrans/webhook", midtransNotification);

// tambahkan route ini:
router.post("/midtrans/create-transaction", createSnapTransaction);

export default router;
