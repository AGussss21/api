import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";  // Mengimpor jwt untuk verifikasi token
import { db } from "./db/connection.js";  // Pastikan koneksi database Anda benar
import productsRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import testimonialRoutes from "./routes/testimonials.js";
import profileRoutes from "./routes/profile.js";
import cartRoutes from "./routes/carts.js";
import adminAuthRouter from "./routes/adminAuth.js";
import adminProductsRoutes from "./routes/adminProducts.js";
import businessInfoRoutes from "./routes/businessInfoRoutes.js";
import paymentsRouter from "./routes/payments.js";
import path from "path";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Test koneksi database
(async () => {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("✅ Koneksi ke database berhasil!");
  } catch (err) {
    console.error("❌ Gagal koneksi ke database:", err);
  }
})();

// Middleware untuk memverifikasi token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1]; // Mengambil token setelah "Bearer "

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token tidak valid" });
    }
    req.user = user;  // Menyimpan informasi pengguna di request untuk digunakan di route berikutnya
    next();  // Melanjutkan ke route berikutnya
  });
}

// Middleware untuk memeriksa role pengguna
function checkRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Akses ditolak" });
    }
    next();  // Melanjutkan ke route berikutnya jika role valid
  };
}

// Endpoint untuk mendapatkan data pengguna
app.get("/api/users/me", authenticateToken, (req, res) => {
  const userId = req.user.id;  // Ambil ID pengguna dari token

  db.query("SELECT name, email FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching user data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0]; // Ambil pengguna pertama dari hasil query
    res.json({ users: [user] });  // Mengembalikan data pengguna dalam array 'users'
  });
});

// di server.js, sebelum app.use("/api/payments", paymentsRouter);
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


// Routes
app.use("/api/products", productsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/admin", adminAuthRouter);
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api", businessInfoRoutes);
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.use("/api/payments", paymentsRouter);

// Health check
app.get("/api", (req, res) => {
  res.json({ message: "API berjalan dengan baik!" });
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server API berjalan di http://localhost:${PORT}`);
});
