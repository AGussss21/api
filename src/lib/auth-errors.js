export function parseAuthError(e) {
  const msg = (e?.message || "").toLowerCase();

  // dari backend login
  if (msg.includes("user tidak ditemukan")) return { type: "error", title: "Login gagal", message: "Akun tidak ditemukan." };
  if (msg.includes("password salah")) return { type: "error", title: "Login gagal", message: "Login gagal, periksa kembali username dan password!" };

  // kemungkinan duplicate email MySQL
  if (msg.includes("duplicate") || msg.includes("email sudah") || msg.includes("dup entry")) {
    return { type: "error", title: "Email sudah terdaftar", message: "Email sudah terdaftar. Silakan gunakan email lain." };
  }

  // fallback
  return { type: "error", title: "Terjadi kesalahan", message: e?.message || "Gagal memproses permintaan." };
}
