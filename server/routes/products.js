import express from "express";
import { db } from "../db/connection.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// ============ Multer Setup (Upload Gambar) ============
// Menggunakan path.resolve agar lebih aman di berbagai OS
const uploadsDir = path.resolve(process.cwd(), "uploads/products");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});
const upload = multer({ storage });

// ============ GET All Products ============
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("ERROR GET ALL:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============ GET Product By ID ============
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (!rows[0]) return res.status(404).json({ error: "Produk tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    console.error("ERROR GET BY ID:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============ CREATE Product ============
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Pastikan field sesuai dengan form di frontend
    let { name, category, type, description, price, stock, slug } = req.body;

    // Validasi sederhana
    if (!name || !price) {
      return res.status(400).json({ error: "Nama dan Harga wajib diisi" });
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock) || 0;
    const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;

    const query = `
      INSERT INTO products (name, category, type, description, price, stock, image, slug)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(query, [
      name,
      category || null,
      type || null,
      description || null,
      priceNum,
      stockNum,
      imagePath,
      slug || null,
    ]);

    res.json({ message: "Produk berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error("ERROR CREATE:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============ UPDATE Product ============
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  try {
    let { name, category, type, description, price, stock, slug } = req.body;

    // Ambil data lama untuk cek gambar
    const [product] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (!product[0]) return res.status(404).json({ error: "Produk tidak ditemukan" });

    // Siapkan data update
    const priceNum = price ? parseFloat(price) : product[0].price;
    const stockNum = stock ? parseInt(stock) : product[0].stock;
    
    let query = "UPDATE products SET name=?, category=?, type=?, description=?, price=?, stock=?, slug=?";
    const params = [
        name || product[0].name, 
        category || product[0].category, 
        type || product[0].type, 
        description || product[0].description, 
        priceNum, 
        stockNum, 
        slug || product[0].slug
    ];

    // Cek jika ada gambar baru
    if (req.file) {
      // Hapus gambar lama fisik
      if (product[0].image) {
        const oldPath = path.resolve(process.cwd(), product[0].image.replace(/^\//, ""));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      
      query += ", image=?";
      params.push(`/uploads/products/${req.file.filename}`);
    }

    query += " WHERE id=?";
    params.push(id);

    await db.query(query, params);
    res.json({ message: "Produk berhasil diupdate" });
  } catch (err) {
    console.error("ERROR UPDATE:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============ DELETE Product ============
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (!product[0]) return res.status(404).json({ error: "Produk tidak ditemukan" });

    // Hapus file gambar jika ada
    if (product[0].image) {
      const filePath = path.resolve(process.cwd(), product[0].image.replace(/^\//, ""));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    console.error("ERROR DELETE:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;