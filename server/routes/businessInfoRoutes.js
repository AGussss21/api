import express from "express";
import { db } from "../db/connection.js";

const router = express.Router();

/* =======================================================
   GET INFORMASI USAHA
   Endpoint: /api/business-info
======================================================= */
router.get("/business-info", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM business_info LIMIT 1");

    if (rows.length === 0) {
      // Default jika belum ada data
      return res.json({
        name: "",
        description: "",
        phone: "",
        email: "",
        address: "",
        hours: "",
        instagram: "",
        facebook: "",
        location: { lat: 0, lng: 0 },
      });
    }

    const data = rows[0];

    // Pastikan location selalu ada
    data.location = (data.lat != null && data.lng != null) ? { lat: data.lat, lng: data.lng } : { lat: 0, lng: 0 };


    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =======================================================
   UPDATE / INSERT INFORMASI USAHA
   Endpoint: /api/business-info/update
======================================================= */
router.put("/business-info/update", async (req, res) => {
  const {
    name,
    description,
    phone,
    email,
    address,
    hours,
    instagram,
    facebook,
    lat,
    lng
  } = req.body;

  try {
    // Insert jika belum ada, update jika sudah ada
    await db.query(`
      INSERT INTO business_info 
        (id, name, description, phone, email, address, hours, instagram, facebook, lat, lng)
      VALUES 
        (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        description = VALUES(description),
        phone = VALUES(phone),
        email = VALUES(email),
        address = VALUES(address),
        hours = VALUES(hours),
        instagram = VALUES(instagram),
        facebook = VALUES(facebook),
        lat = VALUES(lat),
        lng = VALUES(lng)
    `, [name, description, phone, email, address, hours, instagram, facebook, lat || 0, lng || 0]);

    res.json({ message: "Informasi usaha berhasil diperbarui" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
