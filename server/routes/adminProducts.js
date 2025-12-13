import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "../db/connection.js";

const router = express.Router();

// Ensure upload folder exists
const uploadsDir = path.resolve(process.cwd(), "uploads/products");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".png";
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

// GET product by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ message: "Produk tidak ditemukan" });
    return res.json(rows[0]);
  } catch (err) {
    console.error("ERROR GET PRODUCT:", err);
    return res.status(500).json({ message: "Gagal mengambil produk", error: err.message });
  }
});

// CREATE product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("CREATE PRODUCT req.body:", req.body);
    console.log("CREATE PRODUCT req.file:", req.file);

    const { name, category, type, description } = req.body;
    const price = req.body.price ? Number(req.body.price) : 0;
    const stock = req.body.stock ? Number(req.body.stock) : 0;

    const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;

    const [result] = await db.query(
      `INSERT INTO products (name, category, type, description, price, stock, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name || null, category || null, type || null, description || null, price, stock, imagePath]
    );

    return res.json({ message: "Produk dibuat", id: result.insertId, image: imagePath });
  } catch (err) {
    console.error("ERROR CREATE PRODUCT:", err);
    return res.status(500).json({ message: "Gagal membuat produk", error: err.message });
  }
});

// UPDATE product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    console.log("PUT /api/admin/products/:id called, id=", id);
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { name, category, type, description } = req.body;
    const price = (req.body.price !== undefined && req.body.price !== null && req.body.price !== "") ? Number(req.body.price) : null;
    const stockAdd = !isNaN(Number(req.body.stock_add)) ? Number(req.body.stock_add) : 0;

    // get current product
    const [rowsOld] = await db.query("SELECT image, stock FROM products WHERE id = ?", [id]);
    if (!rowsOld || rowsOld.length === 0) return res.status(404).json({ message: "Produk tidak ditemukan" });

    const currentImage = rowsOld[0].image;
    const currentStock = Number(rowsOld[0].stock) || 0;

    // new image
    const newImagePath = req.file ? `/uploads/products/${req.file.filename}` : null;
    const finalImage = newImagePath || currentImage;

    // Build update query dynamically to avoid overwriting price with null unintentionally
    const fields = [];
    const params = [];

    fields.push("name = ?"); params.push(name || rowsOld[0].name);
    fields.push("category = ?"); params.push(category || rowsOld[0].category);
    fields.push("type = ?"); params.push(type || rowsOld[0].type);
    fields.push("description = ?"); params.push(description || rowsOld[0].description);

    // price: if parsed number provided, set it; otherwise keep existing
    if (price !== null) {
      fields.push("price = ?"); params.push(price);
    }

    // update stock if stockAdd !== 0
    if (stockAdd !== 0) {
      fields.push("stock = stock + ?"); params.push(stockAdd);
    }

    // image
    fields.push("image = ?"); params.push(finalImage);

    // finalize
    const updateQuery = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    console.log("UPDATE QUERY:", updateQuery, params);

    const [updateResult] = await db.query(updateQuery, params);
    console.log("updateResult:", updateResult);

    // insert history to product_updates
    await db.query(
      `INSERT INTO product_updates (product_id, name, category, type, description, price, stock_add, image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name || null, category || null, type || null, description || null, price, stockAdd, finalImage]
    );

    // Optionally delete old image file if a new one uploaded
    if (newImagePath && currentImage) {
      try {
        const oldFilePath = path.resolve(process.cwd(), currentImage.replace(/^(\/+)/, ""));
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      } catch (cleanupErr) {
        console.warn("Gagal menghapus file lama:", cleanupErr);
      }
    }

    return res.json({ message: "Produk diperbarui" });
  } catch (err) {
    console.error("ERROR UPDATE PRODUCT:", err);
    return res.status(500).json({ message: "Gagal update produk", error: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT image FROM products WHERE id = ?", [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ message: "Produk tidak ditemukan" });

    const image = rows[0].image;

    await db.query("DELETE FROM products WHERE id = ?", [id]);

    // try remove file
    if (image) {
      try {
        const filePath = path.resolve(process.cwd(), image.replace(/^(\/+)/, ""));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (err) {
        console.warn("Gagal hapus file saat delete:", err);
      }
    }

    return res.json({ message: "Produk dihapus" });
  } catch (err) {
    console.error("ERROR DELETE PRODUCT:", err);
    return res.status(500).json({ message: "Gagal menghapus produk", error: err.message });
  }
});

export default router;
