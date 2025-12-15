import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import path from "path";
import { db } from "./db/connection.js"; 

// Routes Imports
import productsRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import testimonialRoutes from "./routes/testimonials.js";
import profileRoutes from "./routes/profile.js";
import cartRoutes from "./routes/carts.js";
import adminAuthRouter from "./routes/adminAuth.js";
import businessInfoRoutes from "./routes/businessInfoRoutes.js";
import paymentsRouter from "./routes/payments.js";

dotenv.config();

const app = express();

// ============ Middleware ============
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
// Gunakan limit json sekali saja (ini menangani body parser)
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true }));

// Logger sederhana
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Test koneksi database
(async () => {
  try {
    // Test query sederhana
    await db.query("SELECT 1");
    console.log("✅ Koneksi ke database berhasil!");
  } catch (err) {
    console.error("❌ Gagal koneksi ke database:", err);
  }
})();

// ============ Helper Middleware ============
// Middleware untuk memverifikasi token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token tidak ditemukan" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token tidak valid" });
    req.user = user;
    next();
  });
}

// ============ Routes Definitions ============

// Endpoint Manual: Get Me (FIXED: Menggunakan async/await)
app.get("/api/users/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // Gunakan await, bukan callback
    const [results] = await db.query("SELECT name, email, role FROM users WHERE id = ?", [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ users: [results[0]] });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// Endpoint untuk Static Files (Gambar Produk)
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

// Mount Routes
app.use("/api/products", productsRoutes); // INI UTAMA: Handle Public & Admin Product
app.use("/api/auth", authRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/admin", adminAuthRouter); // Login admin
app.use("/api", businessInfoRoutes);
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