# ☕ KopiKita

**KopiKita** adalah aplikasi web full-stack untuk mengelola menu, pesanan, dan transaksi kedai kopi secara modern, cepat, dan terorganisir.

Project ini dirancang dengan pemisahan **frontend** dan **backend** agar mudah dikembangkan, dipelihara, dan diperluas. Backend menyediakan REST API yang aman, sementara frontend memberikan pengalaman pengguna yang responsif.

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

---

## ✨ Fitur Utama

- ☕ Manajemen menu kopi dan kategori produk
- 🛒 Pemesanan produk dan pengelolaan keranjang
- 📦 Pengecekan serta pengurangan stok secara transaksional
- 🔄 Pemulihan stok otomatis saat pesanan dibatalkan oleh admin
- 👥 Autentikasi pengguna menggunakan JWT
- 🔐 Password disimpan menggunakan bcrypt hash
- 🧾 Pembayaran simulasi tanpa transaksi nyata
- 📡 REST API dengan format respons konsisten
- 🧪 Testing, build, migrasi database, dan seeding data demo

---

## 🛠️ Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend | React, Vite, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| Autentikasi | JWT, bcrypt |
| Version Control | Git & GitHub |

---

## 📁 Struktur Project

```text
Kopi-Kita/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Persyaratan

Pastikan komputer kamu sudah terinstal:

- Node.js versi 20 atau lebih baru
- npm
- PostgreSQL versi 14 atau lebih baru
- Git

---

## 🚀 Setup Database

Buat user dan database PostgreSQL lokal:

```sql
CREATE USER kopikita WITH PASSWORD 'kopikita';
CREATE DATABASE kopikita OWNER kopikita;
```

Lalu salin file environment:

```powershell
Copy-Item backend\.env.example backend\.env
```

Isi `backend/.env` dengan:

```env
DATABASE_URL=postgresql://kopikita:kopikita@localhost:5432/kopikita
JWT_SECRET=ganti_dengan_secret_random_minimal_32_karakter
```

> ⚠️ Gunakan `JWT_SECRET` yang panjang, acak, dan tidak pernah dibagikan ke publik.

Opsional, untuk mengubah alamat API frontend:

```powershell
Copy-Item frontend\.env.example frontend\.env
```

---

## 💻 Menjalankan Project

### 1. Jalankan Backend

Buka terminal pertama:

```powershell
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Backend akan berjalan di:

```text
http://127.0.0.1:4000
```

Cek kesehatan API:

```text
http://127.0.0.1:4000/api/health
```

### 2. Jalankan Frontend

Buka terminal kedua:

```powershell
cd frontend
npm install
npm run dev
```

Buka URL Vite yang muncul di terminal, biasanya:

```text
http://localhost:5173
```

---

## 👤 Akun Demo

Setelah menjalankan `npm run db:seed`, gunakan akun berikut untuk mencoba aplikasi:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@kopikita.local` | `KopiKita123!` |
| Customer | `pelanggan@kopikita.local` | `KopiKita123!` |

> ⚠️ Ganti kredensial demo sebelum aplikasi digunakan di lingkungan publik atau production.

---

## 🧪 Perintah Penting

Jalankan perintah berikut dari folder `backend/`:

```powershell
npm test
npm run build
npm run db:migrate
npm run db:seed
```

Jalankan perintah berikut dari folder `frontend/`:

```powershell
npm test
npm run build
```

---

## 🔒 Keamanan dan Logika Bisnis

- Stok diperiksa dan dikurangi secara **transaksional** saat checkout.
- Pembatalan pesanan oleh admin akan mengembalikan stok secara **transaksional**.
- Password pengguna disimpan dalam bentuk **bcrypt hash**.
- Route yang dilindungi menggunakan autentikasi **JWT**.
- API menggunakan format respons yang konsisten:

```json
{
  "success": true,
  "data": {}
}
```

Untuk error:

```json
{
  "success": false,
  "error": "Pesan error"
}
```

- Pembayaran bersifat **simulasi** dan tidak melakukan transaksi pembayaran nyata.

---

## 📸 Preview Aplikasi
Maaf Belum Ditampilkan
Tambahkan screenshot aplikasi di folder `screenshots/`, lalu tampilkan seperti ini:

```md

```

| Halaman | Preview |
|---|---|
| Dashboard | ![Dashboard](screenshots/dashboard.png) | Maaf Belum Ditampilkan Sementara
| Halaman Menu | ![Menu](screenshots/menu.png) | Maaf Belum Ditampilkan Sementara
| Halaman Pesanan | ![Order](screenshots/order.png) | Maaf Belum Ditampilkan Sementara

---

## 🎯 Tujuan Project

Project ini dibuat untuk:

- Menerapkan kemampuan pengembangan web full-stack
- Membangun REST API yang aman dan terstruktur
- Melatih pengelolaan database PostgreSQL
- Menerapkan autentikasi JWT dan keamanan password
- Mengelola project menggunakan Git dan GitHub
- Menampilkan kemampuan dalam membangun aplikasi yang fungsional dan siap dikembangkan

---

## 📌 Rencana Pengembangan

- [ ] Menambahkan dashboard admin yang lebih lengkap
- [ ] Menambahkan riwayat pesanan pelanggan
- [ ] Menambahkan filter dan pencarian menu
- [ ] Menambahkan ekspor data pesanan ke Excel/PDF
- [ ] Menambahkan notifikasi status pesanan
- [ ] Deploy backend ke Render/Railway
- [ ] Deploy frontend ke Vercel/Netlify

---

## 🤝 Kontribusi

Project ini terbuka untuk pengembangan lebih lanjut. Jika ingin berkontribusi:

1. Fork repository ini
2. Buat branch baru
3. Lakukan perubahan
4. Kirim pull request

---

## 📬 Kontak

- GitHub: [@auliadafa994-ctrl](https://github.com/auliadafa994-ctrl)
- Email: auliadafa994@gmail.com

---

⭐ Jika project ini bermanfaat, jangan lupa beri **Star** pada repository ini!
