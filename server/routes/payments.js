import express from "express";
import {
  createOrder,
  getOrder,
  confirmPayment,
  midtransNotification,
  createSnapTransaction,
  getAllOrders,
  getMyOrders,
} from "../controllers/paymentController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ ok: true, message: "Payments router alive" });
});

// 🔥 HARUS DI ATAS
router.get("/orders/my", verifyToken, getMyOrders);

// baru yang dynamic
router.get("/orders/:order_id", getOrder);

router.post("/orders", createOrder);
router.post("/orders/confirm", confirmPayment);
router.post("/midtrans/webhook", midtransNotification);
router.post("/midtrans/create-transaction", createSnapTransaction);
router.get("/orders/all", getAllOrders);

export default router;
