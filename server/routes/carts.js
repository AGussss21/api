// file: routes/carts.js
import express from "express";
import { db } from "../db/connection.js";

const router = express.Router();

// ====================
// GET user's cart
// ====================
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.execute(
      "SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image, p.stock " +
      "FROM carts c LEFT JOIN products p ON c.product_id = p.id " +
      "WHERE c.user_id = ?",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ====================
// POST add item to cart
// ====================
router.post("/", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ error: "user_id, product_id, dan quantity wajib diisi" });
  }

  try {
    const [existing] = await db.execute(
      "SELECT * FROM carts WHERE user_id=? AND product_id=?",
      [user_id, product_id]
    );

    if (existing[0]) {
      // update qty jika sudah ada
      await db.execute(
        "UPDATE carts SET quantity=quantity+? WHERE id=?",
        [quantity, existing[0].id]
      );
      return res.json({ message: "Cart updated" });
    }

    // insert baru
    await db.execute(
      "INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [user_id, product_id, quantity]
    );
    res.json({ message: "Item added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ====================
// PUT update cart item quantity
// ====================
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity) return res.status(400).json({ error: "Quantity wajib diisi" });

  try {
    await db.execute("UPDATE carts SET quantity=? WHERE id=?", [quantity, id]);
    res.json({ message: "Cart item updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ====================
// DELETE remove cart item
// ====================
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM carts WHERE id=?", [id]);
    res.json({ message: "Cart item removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
