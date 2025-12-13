import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const adminOnly = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({
        status: "error",
        message: "Token tidak ditemukan"
      });

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err)
        return res.status(403).json({
          status: "error",
          message: "Token tidak valid"
        });

      // Cek role admin
      if (user.role !== "admin") {
        return res.status(403).json({
          status: "error",
          message: "Akses ditolak. Anda bukan admin"
        });
      }

      req.user = user;
      next();
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server"
    });
  }
};
