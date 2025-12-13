import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: "Token tidak ditemukan!" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak, Anda bukan admin!" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log("Admin auth error:", error);
    res.status(401).json({ error: "Token tidak valid!" });
  }
};
