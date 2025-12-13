import express from "express";
import multer from "multer";
import path from "path";
import { db } from "../db/connection.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// === Multer config untuk upload foto ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user_${req.user.id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const allowed = ["image/jpeg", "image/png"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Format harus JPG/PNG"));
    }
    cb(null, true);
  },
});

// =======================================
// GET Profile User (HARUS LOGIN)
// =======================================
router.get("/", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, fullname, username, email, phone, profile_photo 
       FROM users WHERE id = ? LIMIT 1`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================================
// UPLOAD Foto Profile User (HARUS LOGIN)
// =======================================
router.put("/photo", verifyToken, upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File foto wajib diupload" });
    }

    const photoPath = "/uploads/profile/" + req.file.filename;

    await db.execute(
      "UPDATE users SET profile_photo=? WHERE id=?",
      [photoPath, req.user.id]
    );

    res.json({
      message: "Foto profile berhasil diupload",
      profile_photo: photoPath
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
