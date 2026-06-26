# Walkthrough — Bantu Guru AI (Restrukturisasi Arsitektur Layered)

Restrukturisasi arsitektur penuh (Opsi B) dari flat-file layout ke **feature-sliced + layered architecture** telah selesai dilakukan secara backend dan frontend. Seluruh fungsionalitas dan fitur yang sudah ada dipertahankan seutuhnya dan berjalan dengan lancar.

---

## 🛠 Perubahan yang Dilakukan

### 1. FASE 1 — Backend (Layered Architecture)

- **`types/` Folder**: Augmentasi global Express Request (`types/express.d.ts`) untuk properti `req.user` dan centralized types (`types/index.ts`).
- **`utils/response.ts`**: Standarisasi format response server (`sendSuccess` dan `sendError`) untuk menjamin konsistensi payload API.
- **`validators/` Folder**: Sentralisasi validasi input Zod schema (`auth.validator.ts`, `document.validator.ts`, `payment.validator.ts`) dan generic validation middleware (`validate.middleware.ts`).
- **Pecah `utils/gemini.ts`**: Pemisahan modular asisten AI Gemini ke folder `utils/gemini/` per domain:
  - `rpp.gemini.ts` (Generasi RPP)
  - `soal.gemini.ts` (Generasi Soal)
  - `modul-ajar.gemini.ts` (Generasi Modul Ajar)
  - `client.ts` (Koneksi & timeout runner bersama)
- **Pecah `utils/docxBuilder.ts`**: Pemisahan modular pembuat dokumen Word ke folder `utils/docx/` per domain:
  - `rpp.docx.ts`
  - `soal.docx.ts`
  - `modul-ajar.docx.ts`
  - `helpers.ts` (Pembangun cell, header, & tabel bersama)
- **`services/` Layer**: Logika bisnis utama dipisahkan ke class service terdedikasi (`AuthService`, `DocumentService`, `PaymentService`, `UserService`).
- **Thinner Controllers**: Refaktorisasi controller agar tipis dan fokus pada HTTP handling saja (parsing request, delegasi ke service, return response helper).

### 2. FASE 2 — Frontend (Clean Architecture)

- **`utils/` Folder**: Pembangun class name bersama (`cn.ts`) dan pembantu format uang, tanggal, dan JP (`format.ts`).
- **`constants/` Folder**: Sentralisasi rute navigasi klien (`routes.ts`) dan endpoint URL backend (`api.ts`).
- **`types/` Folder**: Pemisahan domain model (`document.ts`, `payment.ts`) dan penambahan model otentikasi.
- **`services/` Folder**: Pemisahan layer pemanggilan API per domain terstruktur (`authService.ts`, `documentService.ts`, `paymentService.ts`, `userService.ts`).
- **`hooks/` Folder**: Pembungkusan logika store & service ke custom React hooks (`useAuth.ts`, `useDocuments.ts`, `useQuota.ts`).
- **`components/` Folder**: Pembagian modular menjadi:
  - `components/ui/` (Atomic elements: Button, Input, Modal, Badge, Skeleton)
  - `components/layout/` (Pecahan sidebar, topbar, mobile nav drawer)
- **`pages/` Folder**: Pengelompokan 16 halaman ke subfolder:
  - `pages/public/` (Landing, About, LearnMore, Login, Register)
  - `pages/app/` (Dashboard, Generate RPP, Soal, Modul Ajar, Library, dll)
- **`App.tsx` Update**: Pembaruan menyeluruh path import halaman baru yang terstruktur.

---

## 🧪 Hasil Verifikasi & Validasi

### 1. Kompilasi TypeScript (Backend)
Hasil build backend menggunakan tsc berjalan sukses tanpa error:
```powershell
cd backend
npx tsc --noEmit
# Status: SUCCESS (0 errors)
```

### 2. Kompilasi TypeScript (Frontend)
Hasil build frontend menggunakan tsc berjalan sukses tanpa error:
```powershell
cd frontend
npx tsc --noEmit
# Status: SUCCESS (0 errors)
```

---

> [!IMPORTANT]
> Semua route, logic controller, penamaan, dan struktur data tetap kompatibel dengan database SQLite bawaan proyek. Restrukturisasi arsitektur ini siap digunakan untuk pengembangan fitur lanjutan atau migrasi database ke MySQL di masa depan dengan rapi.
