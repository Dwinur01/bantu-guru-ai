<div align="center">

<img src="https://img.shields.io/badge/GuruBantu-AI-C84B2F?style=for-the-badge&logo=google&logoColor=white" alt="GuruBantu AI"/>

# 🎓 GuruBantu AI

**Platform SaaS bertenaga AI untuk Guru Honorer Indonesia**

Buat RPP Kurikulum Merdeka & Soal Ujian profesional dalam hitungan menit — bukan jam.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Gemini AI](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

</div>

---

## 📋 Tentang Proyek

**GuruBantu AI** adalah aplikasi web yang membantu guru honorer Indonesia dalam membuat dokumen administrasi pendidikan secara otomatis menggunakan kecerdasan buatan (AI). Guru cukup mengisi form singkat, dan sistem akan menghasilkan:

- 📄 **RPP (Rencana Pelaksanaan Pembelajaran)** sesuai format Kurikulum Merdeka Kemendikbud
- 📝 **Soal Ujian Lengkap** (Pilihan Ganda + Essay) dengan kunci jawaban & rubrik penilaian di halaman terpisah

Dokumen dihasilkan dalam format **Microsoft Word (.docx)** yang siap cetak dan langsung digunakan.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🤖 **Generate RPP AI** | RPP Kurikulum Merdeka lengkap (CP, TP, ATP, Kegiatan, Asesmen) dihasilkan otomatis oleh Gemini AI |
| 📝 **Generate Soal AI** | Bank soal PG 5 opsi + Essay dengan rubrik koreksi berbasis taksonomi Bloom (Mudah → HOTS) |
| 📁 **Riwayat Dokumen** | Lihat, unduh ulang, dan hapus semua dokumen yang pernah dibuat |
| 👤 **Profil & Kuota** | Pantau sisa kuota, update nama, dan kelola akun |
| 🔐 **Autentikasi Aman** | JWT + Refresh Token httpOnly cookie, dukungan Google OAuth |
| 💳 **Sistem Berlangganan** | 4 paket: Gratis, Saset, Basic, Pro — integrasi Midtrans |
| 📊 **Kuota Transaksional** | Kuota hanya berkurang jika dokumen **berhasil** tersimpan (Atomic Transaction) |

---

## 🏗️ Arsitektur & Tech Stack

```
gemini-xprize/
├── frontend/          # React + TypeScript + Vite + Tailwind CSS
│   └── src/
│       ├── pages/     # GenerateRPP, GenerateSoal, Documents, Profile, dll
│       ├── components/# Layout, QuotaBanner, UpgradeModal
│       ├── store/     # Zustand (auth state)
│       └── services/  # Axios API client
│
├── backend/           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/ # Auth, User, Document
│   │   ├── middleware/  # JWT auth, Quota check, Error handler
│   │   ├── routes/      # Auth, User, Document, Cron
│   │   └── utils/       # Gemini AI, docxBuilder, GCS, Prisma
│   └── prisma/          # Schema & Migrations (SQLite dev / MySQL prod)
│
├── docker-compose.yml
└── package.json       # Monorepo workspace
```

### Stack Teknologi

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Zustand, React Hook Form + Zod, Axios |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | SQLite (development), MySQL via Cloud SQL (production) |
| **ORM** | Prisma ORM |
| **AI** | Google Gemini 1.5 Flash API |
| **Storage** | Google Cloud Storage (GCS) / Local fallback |
| **Auth** | JWT (Access Token 15m + Refresh Token 7d), Google OAuth 2.0 |
| **Dokumen** | `docx` npm library (Microsoft Word .docx builder) |
| **Pembayaran** | Midtrans Snap (QRIS, Transfer Bank, e-Wallet) |
| **Email** | Resend API |

---

## 🚀 Cara Menjalankan Lokal

### Prasyarat
- Node.js ≥ 18
- npm ≥ 9

### 1. Clone & Install

```bash
git clone https://github.com/Dwinur01/bantu-guru-ai.git
cd bantu-guru-ai
npm install
```

### 2. Konfigurasi Environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env dan isi semua variabel yang diperlukan
```

> **Variabel wajib untuk menjalankan lokal:**
> - `DATABASE_URL` — SQLite default: `file:./dev.db`
> - `JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET` — string acak minimal 32 karakter
> - `GEMINI_API_KEY` — dari [Google AI Studio](https://aistudio.google.com/app/apikey)

### 3. Setup Database

```bash
cd backend
npx prisma migrate deploy --schema=prisma/schema.sqlite.prisma
npx prisma generate --schema=prisma/schema.sqlite.prisma
cd ..
```

### 4. Jalankan Dev Server

```bash
npm run dev
```

Aplikasi akan berjalan di:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8080
- **Health Check:** http://localhost:8080/api/health

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/auth/register` | Registrasi akun baru |
| `POST` | `/api/auth/login` | Login dengan email & password |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/logout` | Logout & revoke refresh token |
| `POST` | `/api/auth/google` | Login dengan Google OAuth |

### User
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/user/me` | Ambil profil & kuota user |
| `PATCH` | `/api/user/me` | Update nama profil |
| `DELETE` | `/api/user/me` | Jadwalkan penghapusan akun (24 jam) |
| `GET` | `/api/user/cancel-deletion` | Batalkan penghapusan akun |

### Dokumen
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/documents/generate` | Generate RPP atau Soal Ujian (🔒) |
| `GET` | `/api/documents` | Riwayat dokumen dengan filter & pagination (🔒) |
| `GET` | `/api/documents/:id/download` | Signed URL unduh 24 jam (🔒) |
| `DELETE` | `/api/documents/:id` | Hapus dokumen (🔒) |

### Cron Jobs (Internal)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/cron/reset-saset-quota` | Reset kuota mingguan Saset |
| `POST` | `/api/cron/notify-expiring` | Kirim email notifikasi expiry |
| `POST` | `/api/cron/cleanup-deleted-accounts` | Hapus akun terjadwal |

> 🔒 = Memerlukan header `Authorization: Bearer <accessToken>`  
> Cron endpoints memerlukan header `X-Cron-Secret`

---

## 🔐 Keamanan

- ✅ **JWT** — Access Token 15 menit, Refresh Token 7 hari di httpOnly cookie
- ✅ **bcrypt** — Password di-hash dengan salt rounds 12
- ✅ **Helmet.js** — Security headers HTTP
- ✅ **CORS** — Hanya izinkan `FRONTEND_URL`
- ✅ **Atomic Transactions** — Kuota hanya terpotong jika file berhasil tersimpan
- ✅ **Ownership Validation** — Setiap request dokumen divalidasi kepemilikannya
- ✅ **Input Validation** — Zod schema validation di semua endpoint
- ✅ **File `.env` tidak di-commit** — Semua secret ada di environment variables

---

## 📦 Paket Berlangganan

| Paket | Harga | Kuota | Fitur |
|-------|-------|-------|-------|
| **Gratis** | Rp 0 | 5 dokumen/bulan | RPP & Soal Ujian |
| **Saset** | Rp 15.000/minggu | 25 dokumen/minggu | RPP & Soal Ujian |
| **Basic** | Rp 29.000/bulan | Unlimited | Semua fitur + prioritas |
| **Pro** | Rp 49.000/bulan | Unlimited | Semua + template eksklusif |

---

## 🗺️ Roadmap

- [x] Sprint 1: Foundation & Auth (Register, Login, JWT, Google OAuth)
- [x] Sprint 2: Dashboard, Form Generate, Gemini AI, GCS, docx Builder
- [x] Sprint 3: Generate E2E, Halaman Sukses, Riwayat Dokumen
- [x] Sprint 4: Kuota, Notifikasi, Profil, Cron Jobs
- [x] Sprint 5: Pembayaran Midtrans (Midtrans Snap, Webhook & Status Polling)
- [x] Sprint 6: Hardening, CI/CD, PWA, Deploy Production (Rate Limiting, Health Check, Docker, GitHub Actions CI)

---

## 🤝 Kontribusi

Proyek ini dikembangkan untuk kompetisi. Saat ini belum membuka kontribusi eksternal.

---

## 📄 Lisensi

MIT License — lihat file [LICENSE](LICENSE) untuk detail.

---

<div align="center">

Dibuat dengan ❤️ untuk guru-guru honorer Indonesia yang berdedikasi 🇮🇩

**[GuruBantu AI](https://github.com/Dwinur01/bantu-guru-ai)** — *Satu Langkah Lebih Cepat!*

</div>
