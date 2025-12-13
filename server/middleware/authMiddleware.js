import jwt from "jsonwebtoken";

// ✅ Middleware untuk verifikasi JWT token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1]; // Mengambil token setelah "Bearer "

  // Memverifikasi token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token tidak valid" });
    }

    req.user = user;  // Menyimpan informasi pengguna di request untuk digunakan di route berikutnya
    next();  // Melanjutkan ke route berikutnya
  });
};

// ✅ Middleware untuk memeriksa role pengguna
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Akses ditolak" });
    }
    next();  // Lanjutkan ke route berikutnya jika role valid
  };
};
