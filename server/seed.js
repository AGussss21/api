import { db } from "../db/connection.js";
import { products } from "../src/data.js";
import fs from "fs";
import path from "path";

// Folder tujuan gambar
const uploadDir = "./uploads/products";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

async function seedProducts() {
  try {
    for (const p of products) {
      const slug = p.slug || p.nama.toLowerCase().replace(/\s+/g, "-");

      // Copy gambar dari src/images ke uploads/products
      const sourceImage = path.join("./src/images", p.img);
      const destImage = path.join(uploadDir, path.basename(p.img));
      if (fs.existsSync(sourceImage) && !fs.existsSync(destImage)) {
        fs.copyFileSync(sourceImage, destImage);
      }
      const imagePath = `/uploads/products/${path.basename(p.img)}`;

      // Insert data, jika slug sudah ada update record
      await db.execute(
        `INSERT INTO products (name, category, type, price, stock, image, slug, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           category = VALUES(category),
           type = VALUES(type),
           price = VALUES(price),
           stock = VALUES(stock),
           image = VALUES(image),
           description = VALUES(description)`,
        [
          p.nama,
          p.category,
          p.type || "satuan",
          p.price,
          p.stock,
          imagePath,
          slug,
          p.desc || null
        ]
      );
    }

    console.log("Semua produk berhasil di-insert/update!");
    process.exit(0);
  } catch (err) {
    console.error("Error saat seeding:", err);
    process.exit(1);
  }
}

seedProducts();
