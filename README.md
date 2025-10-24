# E-Commerce Authorization (JWT, Google OAuth, RBAC, ABAC)

Project tugas **ALP Cyber Security** – implementasi otorisasi modern pada REST API e-commerce:
- 🔑 **JWT Login** (username/password) + expiry
- 🔐 **Google OAuth 2.0** (issue internal JWT)
- 🛂 **RBAC**: Admin, Seller, Customer
- 🧩 **ABAC**: cek kepemilikan (`sellerId`/`storeId`) pada produk
- 🌐 **Web sederhana** (static HTML) untuk demo

## 🚀 Tech Stack
Node.js + Express • MongoDB + Mongoose • Passport Google • JSON Web Token

## 📂 Struktur Proyek
```
controllers/
  authController.js
  productController.js
middleware/
  authMiddleware.js
  checkOwnership.js
models/
  User.js
  Product.js
routes/
  authRoutes.js
  productRoutes.js
public/
  index.html
index.js
```

## ⚙️ Persiapan
1. **Clone / download repo**
2. Buat file `.env` (lihat contoh di bawah)
3. Install dependencies & jalankan server
```bash
npm install
npm run dev
```
Server: `http://localhost:3000/`

### 🧾 Contoh `.env`
```
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce-db
JWT_SECRET=your_secret_key
JWT_EXPIRES=15m
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

> **Catatan:** Authorized redirect URI di Google Cloud harus sama persis dengan `GOOGLE_CALLBACK_URL`.

## 🧠 Endpoint Utama
### 🔐 Auth
| Method | Endpoint | Deskripsi |
|--------|-----------|-----------|
| POST | `/auth/register` | Daftar user baru (Admin/Seller/Customer) |
| POST | `/auth/login` | Login JWT (mengembalikan accessToken) |
| GET | `/auth/google` | Login via Google OAuth |
| GET | `/auth/google/callback` | Callback OAuth 2.0 |
| PUT | `/auth/role/:id` | (Opsional) Admin ubah role user |

### 🛒 Products
| Method | Endpoint | Deskripsi |
|--------|-----------|-----------|
| GET | `/products` | List publik (produk aktif) |
| POST | `/products` | Buat produk (Admin/Seller) |
| PUT | `/products/:id` | Ubah produk (Admin / Seller pemilik) |
| DELETE | `/products/:id` | Hapus produk (Admin / Seller pemilik) |

## 🧪 Cara Demo Cepat
1. Buka **http://localhost:3000/**
2. Register 4 akun (Admin, Seller A, Customer, Seller B)
3. Login (JWT) → token & payload tampil di "Status"
4. RBAC Test:
   - Customer POST /products → 403
   - Seller A POST /products → 201 (catat id)
   - Admin POST /products → 201
5. ABAC Test:
   - Seller B PUT /products/:id Seller A → 403
   - Seller A PUT /products/:id miliknya → 200
6. Gabungan RBAC + ABAC:
   - Customer DELETE → 403
   - Seller B DELETE → 403
   - Seller A DELETE → 204
   - Admin DELETE → 204
7. Google OAuth:
   - Login via Google → copy accessToken → test POST /products → 403

## 🌐 Web Sederhana
File `public/index.html` menyediakan antarmuka untuk:
- Register & Login (JWT)
- Login Google
- GET, POST, PUT, DELETE produk (sesuai hak akses)
- Toggle Dark/Light Mode untuk tampilan demo

## 📦 Postman
Gunakan koleksi `Ecommerce Auth ALP.postman_collection.json` dan environment `Ecommerce Local.postman_environment.json`.

Header penting:
```
Authorization: Bearer <accessToken>
```

## 🧰 Troubleshooting
| Masalah | Solusi |
|----------|--------|
| Cannot GET /auth/google/callback | Samakan URL di Google Cloud & .env, lalu restart server |
| Invalid/expired token | Login ulang, periksa `JWT_EXPIRES` |
| MongoDB tidak tersambung | Pakai `mongodb://127.0.0.1:27017/ecommerce-db` (bukan `localhost`) |

