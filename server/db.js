import mysql from "mysql2/promise";

export const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // isi sesuai XAMPP kamu
  database: "lolacake_db",
});

console.log("✅ Terhubung ke MySQL database!");
