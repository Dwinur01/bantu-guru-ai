<div align="center">

<img src="https://img.shields.io/badge/GuruBantu-AI-C84B2F?style=for-the-badge&logo=google&logoColor=white" alt="GuruBantu AI"/>

# 🎓 GuruBantu AI

**Platform SaaS bertenaga AI untuk Guru Honorer Indonesia**

Buat RPP, Modul Ajar Kurikulum Merdeka, & Soal Ujian profesional dalam hitungan detik.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Gemini AI](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

</div>

---

## 📋 Tentang Proyek

**GuruBantu AI** adalah aplikasi web yang dirancang khusus untuk membebaskan waktu berharga para guru honorer di Indonesia dari beban administrasi sekolah yang rumit bertenaga Kecerdasan Buatan (AI). Guru cukup mengisi form singkat atau menggunakan suara, dan sistem akan menghasilkan:

- 📄 **RPP (Rencana Pelaksanaan Pembelajaran)** sesuai format Kurikulum Merdeka Kemendikbud.
- 📚 **Modul Ajar Kurikulum Merdeka** lengkap dengan Profil Pelajar Pancasila, TP, ATP, Sarana Prasarana, dan Asesmen.
- 📝 **Soal Ujian Lengkap** (Pilihan Ganda 5 opsi + Essay) dengan kunci jawaban & rubrik penilaian.

Dokumen dihasilkan dalam format **Microsoft Word (.docx)** yang siap cetak dan langsung digunakan.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🤖 **Generate RPP AI** | RPP Kurikulum Merdeka lengkap (CP, TP, ATP, Kegiatan, Asesmen) dihasilkan otomatis oleh Gemini AI |
| 📚 **Generate Modul Ajar AI** | Menyusun Modul Ajar terintegrasi Profil Pelajar Pancasila sesuai standar Kemendikbudristek |
| 📝 **Generate Soal AI** | Bank soal PG 5 opsi + Essay dengan rubrik koreksi berbasis taksonomi Bloom (Mudah → HOTS) |
| 🌐 **Perpustakaan Guru** | Community Library tempat guru dapat membagikan dokumen secara publik & mengunduh dokumen dari guru lain |
| 🎙️ **Masukan Suara (Speech-to-Text)** | Pengenalan suara native Bahasa Indonesia untuk mengisi form topik materi tanpa mengetik |
| 🧭 **Interactive Onboarding Tour** | Panduan wizard 3-langkah glassmorphism untuk mempermudah guru baru memahami dashboard |
| 📁 **Riwayat Dokumen** | Lihat, unduh ulang, bagikan ke perpustakaan publik, dan hapus semua dokumen Anda |
| 👤 **Profil & Kuota** | Pantau sisa kuota, update nama, dan kelola akun |
| 🔐 **Autentikasi Aman** | JWT + Refresh Token httpOnly cookie, perlindungan CSRF, dan Google OAuth |
| 💳 **Sistem Berlangganan** | Paket langganan (Free, Saset, Basic, Pro) terintegrasi langsung dengan Midtrans Snap |
| 📊 **Kuota Transaksional** | Kuota hanya berkurang jika dokumen **berhasil** dibuat & tersimpan (Atomic Transaction) |

---

## 🎨 Premium UI Overhaul & Live Preview (Baru)

Aplikasi telah diperbarui dengan sistem visual kelas dunia berkonsep **Glassmorphism, Dynamic Interactive UI, & Dual-Theme System**:
- **Dual-Mode Terang & Gelap (Light/Dark Theme)** — Peralihan tema dinamis instan antara mode gelap ("Lumina Obsidian") dan mode terang ("Clean Slate") di seluruh halaman internal aplikasi (Dashboard, RPP, Soal, Modul Ajar, Profil, Transaksi, dll) serta halaman otentikasi (Login/Register).
- **Hero Landing** — Dark Mode hero section dilengkapi dengan dynamic floating light-orbs (blobs) dan glowing gradient text.
- **Glassmorphism** — Panel navigasi, form input, dan card dashboard menggunakan translucent backdrop blur (`glass-card`) dengan focus ring dan border glow yang secara otomatis beradaptasi dengan warna kontras masing-masing mode.
- **A4 Live Document Preview** — Halaman generator (RPP, Modul Ajar, Soal Ujian) dilengkapi dengan lembar kertas virtual A4 reaktif di sebelah kanan desktop yang menampilkan draft teks secara instan saat guru mengisi formulir.
- **Speech Mic Ripples** — Animasi denyut radar konsentris melingkar pada tombol mikrofon input suara saat mendengarkan masukan guru.
- **Neon Pricing Cards** — Kartu paket langganan yang memancarkan pendaran cahaya neon (glow shadow) sesuai tingkat paket dengan FAQ accordion beranimasi halus.

---

## 🏗️ Arsitektur & Tech Stack

```
gemini-xprize/
├── frontend/          # React + TypeScript + Vite + Tailwind CSS
│   └── src/
│       ├── pages/     # GenerateRPP, GenerateSoal, GenerateModulAjar, Library, Documents, Profile, dll
│       ├── components/# Layout (WhatsApp floating button), QuotaBanner, UpgradeModal
│       ├── store/     # Zustand (auth & onboarding state)
│       └── services/  # Axios API client
│
├── backend/           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/ # Auth, User, Document
│   │   ├── middleware/  # JWT auth, Quota check, Error handler, Rate limit
│   │   ├── routes/      # Auth, User, Document, Cron, Payment
│   │   └── utils/       # Gemini AI, docxBuilder, GCS helper, Prisma
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
| **Database** | SQLite (development), MySQL (production) |
| **ORM** | Prisma ORM |
| **AI** | Google Gemini 1.5 Flash API |
| **Storage** | Google Cloud Storage (GCS) / Local filesystem fallback |
| **Auth** | JWT (Access Token 15m + Refresh Token 7d), Google OAuth 2.0 |
| **Speech API** | Web Speech API native browser (Bahasa Indonesia `id-ID`) |
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
> - `DATABASE_URL` — SQLite default: `DATABASE_URL="file:./dev.db"`
> - `JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET` — string acak minimal 32 karakter
> - `GEMINI_API_KEY` — dari [Google AI Studio](https://aistudio.google.com/app/apikey)

### 3. Setup Database (SQLite)

```bash
cd backend
npx prisma db push --schema=prisma/schema.prisma --accept-data-loss
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

### Authentication & Authorization
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/auth/register` | Registrasi akun baru (Rate limited: 3/jam) |
| `POST` | `/api/auth/login` | Login dengan email & password (Rate limited: 5/15m) |
| `POST` | `/api/auth/refresh` | Refresh access token via httpOnly cookie |
| `POST` | `/api/auth/logout` | Logout & cabut refresh token |
| `POST` | `/api/auth/google` | Login/Registrasi Google OAuth |

### Profil Pengguna
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/user/me` | Ambil profil, status langganan, & persentase kuota (🔒) |
| `PATCH` | `/api/user/me` | Perbarui nama profil (🔒) |
| `DELETE` | `/api/user/me` | Jadwalkan soft-delete akun 24 jam (🔒) |
| `GET` | `/api/user/cancel-deletion` | Batalkan jadwal penghapusan akun via token |

### Dokumen & AI
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/documents/generate` | Generate RPP, Soal, atau Modul Ajar (🔒, Rate limited: 10/m) |
| `GET` | `/api/documents` | Riwayat dokumen dengan filter & pagination (🔒) |
| `GET` | `/api/documents/:id/download` | Dapatkan signed URL unduh valid 24 jam (🔒) |
| `PATCH` | `/api/documents/:id/share` | Toggle status dokumen (publik / privat) (🔒) |
| `DELETE` | `/api/documents/:id` | Hapus permanen dokumen dari DB & cloud/local storage (🔒) |

### Perpustakaan Guru (Community Library)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/library` | Ambil daftar dokumen publik (Filter tipe & Pencarian) |

### Cron Jobs (Internal)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/cron/reset-saset-quota` | Reset kuota mingguan Saset |
| `POST` | `/api/cron/notify-expiring` | Kirim email notifikasi masa tenggang |
| `POST` | `/api/cron/cleanup-deleted-accounts` | Hapus data fisik akun terjadwal |

> 🔒 = Memerlukan header `Authorization: Bearer <accessToken>`  
> Endpoint Cron memerlukan header `X-Cron-Secret`

---

## 🔒 Keamanan & Kehandalan
- 🛡️ **JWT + httpOnly Cookie** — Mencegah pencurian token via serangan XSS.
- 🛡️ **Rate Limiting** — Melindungi endpoint autentikasi dan AI generator dari serangan brute force / spam.
- 🛡️ **Input Validation** — Menggunakan Zod schema parser di frontend & backend.
- 🛡️ **Secure Deletion & Storage Fallback** — Penyimpanan lokal fallback otomatis jika cloud storage offline, serta pembersihan file yatim-piatu (*orphan files*) saat data terhapus.

---

## 📦 Paket Berlangganan & Pembayaran
Midtrans Snap diintegrasikan penuh agar guru dapat dengan mudah membayar paket:
*   **Gratis**: 5 dokumen / bulan
*   **Saset**: Rp 15.000 / minggu (25 dokumen / minggu)
*   **Basic**: Rp 29.000 / bulan (Dokumen Tanpa Batas)
*   **Pro**: Rp 49.000 / bulan (Dokumen Tanpa Batas + Template Eksklusif)

---

## 🗺️ Roadmap Proyek

- [x] Sprint 1: Autentikasi Inti & Dual-Database Pipeline (SQLite + MySQL)
- [x] Sprint 2: Integrasi Gemini AI, docx Builder, & Input Speech-to-Text
- [x] Sprint 3: Generasi E2E, Halaman Sukses, & Dashboard Onboarding Tour
- [x] Sprint 4: Manajemen Kuota Transaksional, Profil Guru, & Cron Jobs Terjadwal
- [x] Sprint 5: Integrasi Pembayaran Midtrans Snap, Webhooks, & Polling Status
- [x] Sprint 6: Dockerisasi Produksi, Progressive Web App (PWA), CI/CD Actions
- [x] Pasca-Sprint: Penambahan **Modul Ajar Generator**, **Perpustakaan Bersama Guru (Sharing Library)**, **Pembaruan Landing Page Marketing Premium**, **Integrasi WhatsApp Aktual**, dan **Peralihan Mode Terang/Gelap (Light & Dark Theme Toggle)**.

---

## 🚀 Pembaruan Fitur Terbaru

### 1. Mata Pelajaran Kustom ("Lainnya — Tulis Sendiri")
* Di setiap formulir generator (RPP, Soal Ujian, Modul Ajar), ditambahkan opsi **"Lainnya (Tulis Sendiri)"** pada dropdown mata pelajaran.
* Memunculkan input area teks (*textarea*) dinamis yang memungkinkan guru menulis mata pelajaran kustom di luar daftar baku Kurikulum Merdeka.
* Validasi schema Zod terintegrasi penuh untuk memastikan nama mata pelajaran kustom wajib diisi.

### 2. Formulir Masukan Pengembang (Developer Feedback Form)
* Ditambahkan bagian **"Kirim Masukan untuk Developer"** di halaman Profil Guru.
* Guru dapat mengirimkan saran fitur baru, melaporkan bug, atau mengusulkan penambahan mata pelajaran baru yang belum terdaftar.
* Masukan dikirim melalui API terproteksi (`POST /api/user/feedback`) dan disimpan secara aman di backend dalam file `backend/feedbacks.json`.

### 3. Responsivitas & Desain Sidebar Melayang (Floating Sidebar)
* Menu navigasi utama di mobile didesain ulang menjadi **Floating Sidebar Panel** yang melayang modern dengan sudut membulat (`rounded-2xl`) dan bayangan lembut (`shadow-2xl`).
* Menyelesaikan masalah visibilitas ikon/teks di mode terang dengan memetakan warna latar belakang solid yang dinamis (`bg-sidebar`).
* Menyatukan tombol tutup (`X`) ke dalam baris logo atas, menjaga kerapihan antarmuka mobile.

---

## 📄 Lisensi
MIT License — lihat file [LICENSE](LICENSE) untuk detail.

---

<div align="center">

Dibuat dengan ❤️ untuk guru-guru honorer Indonesia yang berdedikasi 🇮🇩

**[GuruBantu AI](https://github.com/Dwinur01/bantu-guru-ai)** — *Satu Langkah Lebih Cepat!*

</div>
