import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: "Token tidak ditemukan!" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // simpan payload di req.user
    next();
  } catch (error) {
    console.log("AUTH HEADER:", req.headers.authorization);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("Token auth error:", error);
    res.status(401).json({ error: "Token tidak valid!" });
  }
};
