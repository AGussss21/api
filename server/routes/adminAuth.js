import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/connection.js";

const router = express.Router();

// LOGIN ADMIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Ambil user dari DB
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    const user = users[0];

    // Debug
    console.log("DEBUG EMAIL FRONTEND:", email);
    console.log("DEBUG PASSWORD FRONTEND:", password);
    console.log("DEBUG USER FROM DB:", user);

    if (!user) {
      return res.status(400).json({ error: "Email tidak ditemukan!" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak, Anda bukan admin!" });
    }

    if (user.is_verified !== 1) {
      return res.status(403).json({ error: "Akun belum diverifikasi!" });
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("DEBUG MATCH RESULT:", match);

    if (!match) {
      return res.status(400).json({ error: "Password salah!" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.json({
      message: "Login admin berhasil!",
      token,
      role: user.role,
    });

  } catch (error) {
    console.error("Error login admin:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
