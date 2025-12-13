import express from "express";
import { db } from "../db/connection.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// ============ Multer Setup ============
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/products";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// ============ GET All Products ============
router.get("/", async (req, res) => {
  try {
    const [rows] = await  db.execute("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============ GET Product By ID ============
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [id]);
    if (!rows[0]) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============ CREATE Product ============
router.post("/", upload.single("image"), async (req, res) => {
  try {
    let { name, category, type, description, price, stock, slug } = req.body;

    if (!name || !category || !type || price === undefined || stock === undefined) {
      return res.status(400).json({ error: "Kolom wajib tidak boleh kosong" });
    }

    price = parseFloat(price);
    stock = parseInt(stock);
    const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;

    const query = `
      INSERT INTO products (name, category, type, description, price, stock, image, slug)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await  db.execute(query, [
      name,
      category,
      type,
      description || null,
      price,
      stock,
      imagePath,
      slug || null,
    ]);

    res.json({ message: "Produk berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============ UPDATE Product ============
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  try {
    let { name, category, type, description, price, stock, slug } = req.body;

    if (!name || !category || !type || price === undefined || stock === undefined) {
      return res.status(400).json({ error: "Kolom wajib tidak boleh kosong" });
    }

    price = parseFloat(price);
    stock = parseInt(stock);

    // Ambil produk lama
    const [product] = await db.execute("SELECT * FROM products WHERE id = ?", [id]);
    if (!product[0]) return res.status(404).json({ error: "Produk tidak ditemukan" });

    let query = "UPDATE products SET name=?, category=?, type=?, price=?, description=?, stock=?, slug=?";
    const params = [name, category, type, price, description || null, stock, slug || null];

    // Jika ada file baru, hapus file lama
    if (req.file) {
      if (product[0].image && fs.existsSync(`.${product[0].image}`)) {
        fs.unlinkSync(`.${product[0].image}`);
      }
      query += ", image=?";
      params.push(`/uploads/products/${req.file.filename}`);
    }

    query += " WHERE id=?";
    params.push(id);

    await db.execute(query, params);
    res.json({ message: "Produk berhasil diupdate" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============ DELETE Product ============
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await db.execute("SELECT * FROM products WHERE id = ?", [id]);
    if (!product[0]) return res.status(404).json({ error: "Produk tidak ditemukan" });

    if (product[0].image && fs.existsSync(`.${product[0].image}`)) fs.unlinkSync(`.${product[0].image}`);
    await db.execute("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
