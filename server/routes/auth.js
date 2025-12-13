import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { db } from "../db/connection.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const router = express.Router();
// Transporter email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

/* ======================================================
   REGISTER USER + EMAIL VERIFIKASI
====================================================== */
router.post("/register", async (req, res) => {
  try {
    const { fullname, username, email, password, phone } = req.body;

    // Validasi
    if (!fullname || !username || !email || !password || !phone)
      return res.status(400).json({ error: "Semua field wajib diisi" });

    // Cek email sudah digunakan
    const [exists] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (exists.length > 0)
      return res.status(400).json({ error: "Email sudah digunakan" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Token verifikasi
    const verificationToken = crypto.randomBytes(40).toString("hex");

    // INSERT user baru + fullname + phone
    await db.execute(
      `INSERT INTO users 
      (fullname, username, email, password, phone, role, is_verified, verification_token) 
      VALUES (?, ?, ?, ?, ?, 'customer', 0, ?)`,
      [fullname, username, email, hashedPassword, phone, verificationToken]
    );

    // Kirim email verifikasi
    await sendVerificationEmail(email, verificationToken);

    res.json({
      message: "Registrasi berhasil! Silakan cek email untuk verifikasi.",
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});


/* ======================================================
   VERIFIKASI EMAIL
====================================================== */
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const [user] = await db.execute(
      "SELECT id FROM users WHERE verification_token = ?",
      [token]
    );

    if (user.length === 0) {
      return res.status(400).send(`
        <div style="
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 40px;
          background: #fff0f0;
          border-radius: 12px;
          max-width: 500px;
          margin: 60px auto;
          border: 1px solid #ffb7b7;
        ">

          <h2 style="color:#d63031; font-size:28px; margin-bottom:10px;">
            ❌ Token Tidak Valid
          </h2>

          <p style="color:#444; font-size:16px; line-height:1.6;">
            Link verifikasi sudah kedaluwarsa atau tidak valid.
          </p>

          <a href="${process.env.FRONTEND_URL}/register"
            style="
              display:inline-block;
              margin-top:25px;
              padding:12px 22px;
              background:#d63031;
              color:white;
              border-radius:8px;
              font-size:16px;
              font-weight:bold;
              text-decoration:none;
              box-shadow:0 4px 10px rgba(214,48,49,0.25);
            ">
            Daftar Ulang
          </a>

        </div>
      `);
    }

    // Update user menjadi terverifikasi
    await db.execute(
      "UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?",
      [user[0].id]
    );

    return res.send(`
      <div style="
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 40px;
        background: #fff4f8;
        border-radius: 12px;
        max-width: 500px;
        margin: 60px auto;
        border: 1px solid #ffd3e3;
      ">

        <h2 style="color:#ff4f76; font-size:28px; margin-bottom:10px;">
          🎉 Akun Berhasil Diverifikasi!
        </h2>

        <p style="color:#555; font-size:16px; line-height:1.6;">
          Selamat! Email kamu sudah berhasil diverifikasi.  
          Sekarang kamu bisa login ke <strong>Lola Cake</strong> dan mulai berbelanja.
        </p>

        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/login"
          style="
            display:inline-block;
            margin-top:25px;
            padding:12px 22px;
            background:#ff4f76;
            color:white;
            border-radius:8px;
            font-size:16px;
            font-weight:bold;
            text-decoration:none;
            box-shadow:0 4px 10px rgba(255,79,118,0.25);
          ">
          Login Sekarang
        </a>

      </div>
    `);

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).send("Terjadi kesalahan server");
  }
});

/* ======================================================
   LOGIN
====================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email dan password wajib diisi" });

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: "User tidak ditemukan" });

    const user = rows[0];

    // Cek apakah sudah diverifikasi
    if (!user.is_verified)
      return res.status(403).json({
        error: "Akun belum diverifikasi! Silakan cek email Anda.",
      });

    // Cek password benar atau tidak
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ error: "Password salah" });

    // Buat JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

   res.json({
  message: "Login berhasil",
  token,
  user: {
    id: user.id,
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role
  }
});


  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

/* ======================================================
   RESET PASSWORD
====================================================== */

// Request reset password
router.post("/request-reset", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email wajib diisi" });

    // FIXED: query SQL benar
    const [rows] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(400).json({ error: "Email tidak terdaftar!" });

    const user = rows[0];

    // Generate token reset
    const resetToken = crypto.randomBytes(40).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 jam

    await db.execute(
      "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?",
      [resetToken, expires, user.id]
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Kirim email reset password
    await transporter.sendMail({
      from: `"Lola Cake 🍰" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔑 Reset Password Lola Cake",
      html: `
        <div style="font-family:Arial,sans-serif;padding:30px;background:#fff4f8;border-radius:12px;border:1px solid #ffd3e3;text-align:center;">
          <h2 style="color:#ff4f76;">Reset Password</h2>
          <p>Kami menerima permintaan untuk mereset password akun kamu.</p>
          <a href="${resetLink}" style="
            display:inline-block;margin-top:20px;padding:12px 22px;background:#ff4f76;color:white;border-radius:8px;text-decoration:none;font-weight:bold;
          ">Reset Password</a>
          <p style="margin-top:15px;color:#777;font-size:14px;">
            Link hanya berlaku 1 jam. Jika kamu tidak meminta reset, abaikan email ini.
          </p>
        </div>
      `
    });

    res.json({ message: "Email reset password telah dikirim!" });
  } catch (err) {
    console.error("REQUEST RESET ERROR:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});



// Reset password menggunakan token
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password)
      return res.status(400).json({ error: "Password baru wajib diisi" });

    const [rows] = await db.execute(
      "SELECT id, reset_token_expires FROM users WHERE reset_token = ?",
      [token]
    );

    if (rows.length === 0)
      return res.status(400).json({ error: "Token reset tidak valid" });

    const user = rows[0];

    // Cek expired token
    if (new Date(user.reset_token_expires) < new Date())
      return res.status(400).json({ error: "Token reset sudah kadaluarsa" });

    // Hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password & hapus token
    await db.execute(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    res.json({ message: "Password berhasil direset! Silakan login." });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

//register admin 
router.post("/register-admin", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "Email, username, dan password wajib diisi" });

    // Cek email
    const [exists] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (exists.length > 0)
      return res.status(400).json({ error: "Email sudah digunakan" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Query MURNI pakai kolom yang pasti ada
    await db.execute(
      `INSERT INTO users (username, email, password, role, is_verified)
       VALUES (?, ?, ?, 'admin', 1)`,
      [username, email, hashedPassword]
    );

    res.json({ message: "Akun admin berhasil dibuat tanpa verifikasi!" });

  } catch (err) {
    console.error("REGISTER ADMIN ERROR:", err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});


export default router;
