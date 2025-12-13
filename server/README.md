# Dokumentasi API - Server

Base route asumsi: file route di-mount sesuai nama filenya, mis. `/auth`, `/products`, `/profile`, `/testimonials`.

**Environment Variables**:
- `EMAIL_USER`: alamat email pengirim (untuk verifikasi / reset).
- `EMAIL_PASS`: password atau app password email pengirim.
- `JWT_SECRET`: rahasia untuk sign JWT.
- `FRONTEND_URL`: URL frontend (dipakai untuk tautan verifikasi & reset).

**Catatan umum**:
- Semua endpoint yang membutuhkan autentikasi memakai header `Authorization: Bearer <token>`.
- Beberapa endpoint hanya boleh diakses oleh user dengan role `admin`.
- Format tanggal dan pesan mengikuti konfigurasi database aplikasi.

---

## 1) Auth (`/auth`)

- **POST** `/auth/register`
  - Deskripsi: Registrasi user (customer). Mengirim email verifikasi.
  - Body (JSON): `{ "fullname": "", "username": "", "email": "", "password": "", "phone": "" }`
  - Response: pesan sukses atau error validasi.

- **GET** `/auth/verify/:token`
  - Deskripsi: Verifikasi email menggunakan token yang dikirim via email.
  - Response: HTML sederhana untuk konfirmasi/verifikasi (ditampilkan di browser).

- **POST** `/auth/login`
  - Deskripsi: Login user setelah verifikasi.
  - Body (JSON): `{ "email": "", "password": "" }`
  - Response sukses: `{ message: "Login berhasil", token: "<jwt>", role: "<role>" }`

- **POST** `/auth/request-reset`
  - Deskripsi: Minta link reset password. Mengirim email dengan tautan yang mengandung token.
  - Body (JSON): `{ "email": "" }`
  - Response: pesan sukses jika email terdaftar.

- **POST** `/auth/reset-password/:token`
  - Deskripsi: Reset password menggunakan token yang dikirim via email.
  - Body (JSON): `{ "password": "" }`
  - Response: pesan sukses jika token valid dan belum kedaluwarsa.

- **POST** `/auth/register-admin`
  - Deskripsi: Membuat akun admin langsung (tanpa verifikasi).
  - Body (JSON): `{ "username": "", "email": "", "password": "" }`

---

## 2) Products (`/products`)

- **GET** `/products`
  - Deskripsi: Ambil semua produk (publik).
  - Response: array produk.

- **GET** `/products/:id`
  - Deskripsi: Detail produk by id (publik).
  - Response: objek produk atau 404 jika tidak ditemukan.

- **POST** `/products/add` (hanya admin)
  - Headers: `Authorization: Bearer <token>`
  - Body (JSON): `{ "name": "", "description": "", "price": <number>, "image": "<url_or_path>" }`
  - Response: pesan sukses (201) atau error.

- **PUT** `/products/update/:id` (hanya admin)
  - Headers: `Authorization: Bearer <token>`
  - Body (JSON): `{ "name": "", "description": "", "price": <number>, "image": "" }`
  - Response: pesan sukses atau error.

- **DELETE** `/products/delete/:id` (hanya admin)
  - Headers: `Authorization: Bearer <token>`
  - Response: pesan sukses atau error.

---

## 3) Profile (`/profile`)

- **GET** `/profile` (HARUS LOGIN)
  - Headers: `Authorization: Bearer <token>`
  - Deskripsi: Ambil data profile user (id, fullname, username, email, phone, profile_photo).

- **PUT** `/profile/photo` (HARUS LOGIN)
  - Headers: `Authorization: Bearer <token>`
  - Content-Type: `multipart/form-data`
  - Field file: `photo` (format JPG/JPEG atau PNG)
  - Batas ukuran file: 3 MB
  - Nama file disimpan menjadi: `user_<id><ext>` di direktori `uploads/profile/`
  - Response: `{ message: "Foto profile berhasil diupload", profile_photo: "/uploads/profile/user_<id>.<ext>" }`

---

## 4) Testimonials (`/testimonials`)

- **GET** `/testimonials`
  - Deskripsi: Ambil semua testimoni (publik). Mengembalikan juga `username` sebagai `name` setiap pengulas.

- **POST** `/testimonials` (HARUS LOGIN)
  - Headers: `Authorization: Bearer <token>`
  - Body (JSON): `{ "message": "", "rating": <number|null>, "products_id": <productId> }`
  - Response: objek testimoni baru (termasuk `name` dari users).

- **DELETE** `/testimonials/:id` (Hanya admin)
  - Headers: `Authorization: Bearer <token>` dan user harus `role=admin`.

- **GET** `/testimonials/product/:productId`
  - Deskripsi: Ambil semua testimoni untuk produk tertentu.

---

## Contoh singkat cURL

- Login (dapatkan token):
```
POST "http://localhost:PORT/api/auth/login" -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"secret"}'
```

- Ambil daftar produk (publik):
```
"http://localhost:PORT/api/products"
```

- Tambah produk (admin):
```
POST "http://localhost:PORT/api/products/add" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Kue Coklat","description":"Enak","price":50000,"image":"/images/kue.jpg"}'
```

- Upload foto profile (multipart):
```
PUT "http://localhost:PORT/api/profile/photo" \
  -H "Authorization: Bearer <TOKEN>" \
  -F "photo=@/path/to/photo.jpg"
```

---
