import express from "express";
import { db } from "../db/connection.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/checkRole.js"; // untuk DELETE admin

const router = express.Router();

/* GET testimonials per produk berdasarkan slug */
router.get("/product/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [products] = await db.query("SELECT id FROM products WHERE slug = ?", [slug]);
    if (!products.length) return res.status(404).json({ error: "Product not found" });

    const productId = products[0].id;
    const [rows] = await db.query(`
      SELECT t.id, t.message, t.rating, t.created_at,
             u.username AS name, u.avatar AS avatar_url
      FROM testimonials t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.products_id = ?
      ORDER BY t.created_at DESC
    `, [productId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product testimonials" });
  }
});

/* GET semua testimonials (filter sort) */
router.get("/", async (req, res) => {
  try {
    const { sort } = req.query;
    let orderBy = "t.created_at DESC";
    if (sort === "terlama") orderBy = "t.created_at ASC";
    if (sort === "rating-tinggi") orderBy = "t.rating DESC";
    if (sort === "rating-rendah") orderBy = "t.rating ASC";

    const [rows] = await db.query(`
      SELECT t.id, t.message, t.rating, t.created_at,
             t.products_id, u.username AS name, p.category
      FROM testimonials t
      LEFT JOIN users u ON t.user_id = u.id
      JOIN products p ON t.products_id = p.id
      ORDER BY ${orderBy}
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

/* POST testimonial (user login wajib) */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { message, rating, products_id } = req.body;
    const userId = req.user.id;

    if (!message || !products_id || !rating) {
      return res.status(400).json({ error: "Message, Rating, dan Product ID wajib diisi" });
    }

    const ratingValue = Number(rating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ error: "Rating harus angka 1-5" });
    }

    const [result] = await db.query(
      "INSERT INTO testimonials (user_id, products_id, message, rating) VALUES (?, ?, ?, ?)",
      [userId, products_id, message, ratingValue]
    );

    const [newData] = await db.query(`
      SELECT t.id, t.message, t.rating, t.created_at,
             u.username AS name, u.avatar AS avatar_url
      FROM testimonials t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [result.insertId]);

    res.status(201).json({ message: "Testimoni berhasil ditambahkan", data: newData[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save testimonial" });
  }
});

/* DELETE testimonial (admin only) */
router.delete("/:id", verifyToken, checkRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM testimonials WHERE id = ?", [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Testimoni tidak ditemukan" });

    res.json({ message: "Testimoni berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

export default router;
