# GuruBantu AI — Design System Reference
> Version 2.0 · React + Tailwind CSS · Mobile-First · Last Updated: 2026-06
>
> ⚠️ **v2.0 BREAKING CHANGE**: Palet warna utama telah diperbarui dari Red/Dark Blue menjadi Blue/Indigo/Lavender. Semua halaman baru HARUS mengacu ke system v2.0 ini.

---

## CARA PAKAI FILE INI

File ini adalah sumber kebenaran tunggal untuk semua keputusan visual GuruBantu AI.
Setiap komponen yang dibuat harus mengacu ke file ini.
Jika ada konflik antara file ini dan kode yang sudah ada, file ini yang menang.

---

## 1. COLOR SYSTEM (v2.0)

### 1.1 Brand Colors — AKTIF DIGUNAKAN

```
PRIMARY BLUE     #2563EB   → CTA utama (link, icon, aksen interaktif)
PRIMARY NAVY     #1E3A8A   → Tombol submit utama (Masuk, Daftar, Generate)
PRIMARY CYAN     #22D3EE   → Aksen logo, highlight elemen sekunder
PRIMARY INDIGO   #6366F1   → Gradient aksen, hover state card
```

### 1.2 Background Colors — AKTIF DIGUNAKAN

```
PAGE BG AUTH     linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #F0F9FF 100%)
                 → Background halaman Login & Register (lavender/periwinkle)

PAGE BG LANDING  #F8FAFC  → Background halaman Landing Page
PAGE BG DASH     #F8FAFC  → Background halaman Dashboard & App (abu-abu sangat terang)

CARD BG          #FFFFFF  → Background semua card/form panel
MASCOT BG        linear-gradient(135deg, #d4f5f3 0%, #dde8fd 50%, #f0d6fb 100%)
                 → Background di belakang ilustrasi maskot (teal-indigo-purple)
```

### 1.3 Semantic Colors

```
SUCCESS         #10B981   → Konfirmasi berhasil, kuota cukup, status aktif
SUCCESS BG      #ECFDF5   → Background success state ringan
WARNING         #F59E0B   → Kuota hampir habis, peringatan non-kritis
WARNING BG      #FFFBEB   → Background warning state ringan
ERROR           #EF4444   → Error state, field validasi gagal, danger action
ERROR BG        #FEF2F2   → Background error state ringan
INFO            #2563EB   → Informasi netral (sama dengan PRIMARY BLUE)
INFO BG         #EFF6FF   → Background info state ringan
```

### 1.4 Neutral / Text Colors

```
TEXT PRIMARY    #0F172A   → Heading, teks penting
TEXT SECONDARY  #334155   → Body teks standar
TEXT MUTED      #64748B   → Label, placeholder, teks sekunder, caption
TEXT LIGHT      #94A3B8   → Placeholder, disabled teks
BORDER          #E2E8F0   → Garis border normal
BORDER FOCUS    #2563EB   → Border saat input terfokus
BG DISABLED     #F1F5F9   → Background field disabled
```

### 1.5 Extended Palette (untuk badge, tag, highlight)

```
GREEN           #059669   → Fitur perpustakaan, status success kuat
GREEN BG        #ECFDF5
PURPLE          #7C3AED   → Fitur premium, Pro plan
PURPLE BG       #EDE9FE
ORANGE          #EA580C   → Fitur RPP & Modul (aksen), warning
ORANGE BG       #FFF7ED
CYAN            #0891B2   → Fitur speech, mascot aksen
CYAN BG         #ECFEFF
```

### 1.6 Tailwind Custom Config (perbarui `tailwind.config.js`)

```js
theme: {
  extend: {
    colors: {
      brand: {
        blue:   '#2563EB',
        navy:   '#1E3A8A',
        cyan:   '#22D3EE',
        indigo: '#6366F1',
      },
      success:  { DEFAULT: '#10B981', bg: '#ECFDF5' },
      warning:  { DEFAULT: '#F59E0B', bg: '#FFFBEB' },
      error:    { DEFAULT: '#EF4444', bg: '#FEF2F2' },
    },
  },
}
```

### 1.7 Aturan Penggunaan Warna

- **Tombol CTA utama (submit form)**: `bg-[#1E3A8A]` (navy gelap), teks putih
- **Tombol sekunder / link**: `text-[#2563EB]` (biru), border biru
- **Focus ring**: `ring-blue-100` dan `border-blue-500`
- **Background halaman auth**: gunakan gradient lavender `#EEF2FF → #E0E7FF → #F0F9FF`
- **Background halaman app (dashboard, generate)**: `#F8FAFC` (slate-50)
- Kontras minimum teks di atas background: 4.5:1 (WCAG AA)
- JANGAN gunakan merah untuk CTA — sudah diganti navy/biru

---

## 2. TYPOGRAPHY

### 2.1 Font Stack

```
DISPLAY    : 'Playfair Display', Georgia, serif
             → Hanya untuk H1 landing page dan angka metrik besar

BODY       : 'Arial', 'Helvetica Neue', sans-serif
             → Semua teks UI, label, body, form

MONO       : 'Courier New', 'Consolas', monospace
             → Kode, API endpoint, path file, badge ID
```

Import di `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
```

### 2.2 Type Scale

| Token     | Size     | Weight | Line Height | Tailwind Class          | Penggunaan                          |
|-----------|----------|--------|-------------|-------------------------|-------------------------------------|
| display   | 36px     | 900    | 1.1         | `text-4xl font-black`   | Hero heading landing page           |
| h1        | 30px     | 700    | 1.2         | `text-3xl font-bold`    | Page title di dashboard             |
| h2        | 24px     | 700    | 1.3         | `text-2xl font-bold`    | Section heading                     |
| h3        | 20px     | 700    | 1.4         | `text-xl font-bold`     | Card title, subsection              |
| h4        | 18px     | 600    | 1.4         | `text-lg font-semibold` | Label grup, item title              |
| body-lg   | 18px     | 400    | 1.6         | `text-lg`               | Body teks penting                   |
| body      | 16px     | 400    | 1.6         | `text-base`             | Body teks standar — minimum mobile  |
| body-sm   | 14px     | 400    | 1.5         | `text-sm`               | Label form, teks sekunder           |
| caption   | 12px     | 400    | 1.4         | `text-xs`               | Timestamp, badge kecil, footnote    |
| mono      | 14px     | 400    | 1.5         | `text-sm font-mono`     | Kode, endpoint, ID                  |

### 2.3 Aturan Typography

- JANGAN gunakan font size di bawah 12px — tidak terbaca di mobile
- Body text minimum 16px di mobile untuk kenyamanan baca
- Heading harus ada kontras visual yang jelas dengan body di bawahnya
- Maksimal 2 font weight berbeda dalam satu komponen
- Teks panjang (>3 baris): gunakan `leading-relaxed` (1.625)
- Paragraf dalam card: `max-w-prose` untuk keterbacaan optimal

---

## 3. SPACING SYSTEM

Semua spacing menggunakan kelipatan 4px (base: 4px = 1 unit Tailwind).

### 3.1 Spacing Scale

| Token  | Value | Tailwind  | Penggunaan                                    |
|--------|-------|-----------|-----------------------------------------------|
| xs     | 4px   | `p-1`     | Gap minimal antar elemen dalam komponen       |
| sm     | 8px   | `p-2`     | Padding badge, chip, tag kecil                |
| md     | 16px  | `p-4`     | Padding standar komponen (button, input)      |
| lg     | 24px  | `p-6`     | Padding card, gap antar komponen besar        |
| xl     | 32px  | `p-8`     | Gap antar section dalam halaman               |
| 2xl    | 48px  | `p-12`    | Section padding vertikal, hero spacing        |
| 3xl    | 64px  | `p-16`    | Spacing besar antar section landing page      |

### 3.2 Component Spacing Rules

```
Card padding          : p-4 (mobile) → p-6 (desktop)
Form field gap        : space-y-4
Section gap           : space-y-8
Page content padding  : px-4 (mobile) → px-6 (tablet) → px-8 (desktop)
Modal padding         : p-6
Sidebar padding       : px-4 py-6
Bottom nav height     : h-14 (56px)
Sidebar width desktop : w-60 (240px)
Sidebar width tablet  : w-16 (64px) collapsed
Top navbar height     : h-14 (56px)
```

---

## 4. BORDER RADIUS

| Token  | Value  | Tailwind      | Penggunaan                              |
|--------|--------|---------------|-----------------------------------------|
| sm     | 4px    | `rounded`     | Badge, tag, tooltip                     |
| md     | 8px    | `rounded-lg`  | Button, input, card standar             |
| lg     | 12px   | `rounded-xl`  | Card besar, modal, pricing card         |
| xl     | 16px   | `rounded-2xl` | Hero card, feature highlight            |
| full   | 9999px | `rounded-full`| Avatar, toggle switch, pill badge       |

---

## 5. SHADOW SYSTEM

```css
/* shadow-card — card standar */
box-shadow: 0 2px 8px rgba(26, 26, 46, 0.08);
Tailwind: shadow-sm (gunakan + override jika perlu)

/* shadow-card-hover — card saat hover */
box-shadow: 0 6px 20px rgba(26, 26, 46, 0.12);
Tailwind: shadow-md

/* shadow-modal — modal, dropdown */
box-shadow: 0 20px 60px rgba(26, 26, 46, 0.20);
Tailwind: shadow-xl

/* shadow-button — tombol CTA primary saat hover */
box-shadow: 0 4px 14px rgba(200, 75, 47, 0.35);
Custom class: shadow-brand-red
```

---

## 6. COMPONENT SPECIFICATIONS

### 6.1 Button

#### Primary Button (CTA Utama)
```
Background    : #C84B2F (brand-red)
Text          : #FFFFFF, font-semibold, text-sm (14px) atau text-base (16px)
Padding       : px-6 py-3 (desktop) | px-4 py-3 (mobile, full-width)
Border Radius : rounded-lg (8px)
Min Height    : 44px (touch target minimum)
Min Width     : 120px

States:
  default  → bg-[#C84B2F] text-white
  hover    → bg-[#a83d25] shadow-md transition-all duration-150
  active   → scale-95 transition-transform duration-100
  loading  → opacity-90 cursor-not-allowed + spinner kiri
  disabled → opacity-50 cursor-not-allowed

Tailwind class string:
"inline-flex items-center justify-center gap-2 px-6 py-3 
 bg-[#C84B2F] text-white font-semibold text-sm rounded-lg 
 min-h-[44px] transition-all duration-150 
 hover:bg-[#a83d25] hover:shadow-md 
 active:scale-95 
 disabled:opacity-50 disabled:cursor-not-allowed
 focus-visible:outline-none focus-visible:ring-2 
 focus-visible:ring-[#C84B2F] focus-visible:ring-offset-2"
```

#### Secondary Button
```
Background    : transparent
Border        : 1.5px solid #C84B2F
Text          : #C84B2F, font-semibold
Padding       : px-6 py-3 (sama dengan primary, kurangi 1.5px padding untuk border)

Tailwind class string:
"inline-flex items-center justify-center gap-2 px-6 py-3 
 bg-transparent text-[#C84B2F] font-semibold text-sm 
 border-[1.5px] border-[#C84B2F] rounded-lg min-h-[44px] 
 transition-all duration-150 
 hover:bg-[#FCEAE6] 
 active:scale-95 
 disabled:opacity-50 disabled:cursor-not-allowed
 focus-visible:outline-none focus-visible:ring-2 
 focus-visible:ring-[#C84B2F] focus-visible:ring-offset-2"
```

#### Ghost Button
```
Background    : transparent
Border        : none
Text          : #737373, font-medium

Tailwind class string:
"inline-flex items-center justify-center gap-2 px-4 py-2 
 bg-transparent text-muted font-medium text-sm rounded-lg 
 min-h-[44px] transition-colors duration-150 
 hover:bg-[#F2F2F2] hover:text-ink 
 active:scale-95"
```

#### Danger Button
```
Background    : #DC2626 (red-600)
Text          : white
→ Selalu didahului konfirmasi dialog
→ JANGAN gunakan untuk aksi yang bisa dibatalkan

Tailwind:
"... bg-red-600 hover:bg-red-700 ..."
```

#### Button Sizes
```
sm  : px-3 py-2 text-xs min-h-[36px]   → untuk aksi dalam tabel/card kecil
md  : px-6 py-3 text-sm min-h-[44px]   → DEFAULT
lg  : px-8 py-4 text-base min-h-[52px] → untuk CTA hero landing page
full: w-full px-6 py-3                 → untuk mobile full-width CTA
```

---

### 6.2 Input & Form Fields

#### Text Input
```
Border        : 1px solid #C8BFB0 (rule)
Border Radius : rounded-lg (8px)
Padding       : px-4 py-3
Min Height    : 44px
Background    : white
Font size     : text-base (16px) — JANGAN di bawah ini di mobile
Label         : text-sm font-medium text-ink, SELALU di atas (bukan placeholder)

States:
  default  → border-rule bg-white
  focused  → border-[#2E75B6] ring-2 ring-[#2E75B6]/20
  filled   → border-rule bg-white (sama dengan default)
  error    → border-[#C84B2F] bg-[#FCEAE6] ring-2 ring-[#C84B2F]/20
  disabled → bg-[#F2F2F2] border-rule text-muted cursor-not-allowed

Tailwind class string:
"w-full px-4 py-3 text-base text-ink bg-white 
 border border-rule rounded-lg min-h-[44px]
 transition-colors duration-150
 placeholder:text-muted
 focus:outline-none focus:border-[#2E75B6] focus:ring-2 focus:ring-[#2E75B6]/20
 disabled:bg-[#F2F2F2] disabled:text-muted disabled:cursor-not-allowed"

Error state tambahan:
"border-[#C84B2F] bg-[#FCEAE6] focus:ring-[#C84B2F]/20"
```

#### Error Message
```
Position      : di bawah field input, bukan popup/toast
Color         : #C84B2F
Size          : text-xs (12px)
Icon          : ⚠️ atau ExclamationCircleIcon (Lucide) di depan teks
Animation     : fade-in 150ms ease-out

Tailwind:
"flex items-center gap-1 mt-1 text-xs text-[#C84B2F]"
```

#### Select / Dropdown
```
→ Gunakan custom dropdown (div+ul), BUKAN native <select>
→ Alasan: styling konsisten di semua browser

Trigger (closed state):
"flex items-center justify-between w-full px-4 py-3 
 text-base bg-white border border-rule rounded-lg min-h-[44px]
 cursor-pointer select-none
 hover:border-[#2E75B6] transition-colors"

Dropdown list:
"absolute top-full left-0 right-0 mt-1 z-50
 bg-white border border-rule rounded-lg shadow-xl
 max-h-60 overflow-y-auto"

Option item:
"px-4 py-3 text-base cursor-pointer transition-colors
 hover:bg-[#EBF3FB] hover:text-[#1F4E79]
 [&.selected]:bg-[#EBF3FB] [&.selected]:text-[#1F4E79] [&.selected]:font-medium
 [&.focused]:bg-[#F2F2F2]"
```

#### Form Layout
```
Vertical stack (default mobile):
<div class="space-y-4">
  <div class="flex flex-col gap-1">
    <label class="text-sm font-medium text-ink">Label *</label>
    <input ... />
    <p class="text-xs text-[#C84B2F]">Error message</p>
  </div>
</div>

2-column grid (tablet+):
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
  ...
</div>
```

---

### 6.3 Card

#### Standard Card
```
Background    : #FAF7F2 (cream)
Border        : 1px solid #C8BFB0 (rule)
Border Radius : rounded-xl (12px)
Padding       : p-4 (mobile) | p-6 (desktop)
Shadow        : shadow-sm (0 2px 8px rgba(26,26,46,0.08))

States:
  default → standard
  hover   → shadow-md, border-[#2E75B6]/50, -translate-y-0.5

Tailwind:
"bg-cream border border-rule rounded-xl p-4 sm:p-6
 shadow-sm transition-all duration-200
 hover:shadow-md hover:border-[#2E75B6]/50 hover:-translate-y-0.5"
```

#### Document Card (Riwayat)
```
Layout: flex items-center gap-3
Kiri  : ikon tipe dokumen (40x40px, bg colored, rounded-lg)
Tengah: judul (font-semibold) + metadata (text-xs text-muted)
Kanan : tombol download + hapus

Ikon per tipe:
  RPP   → bg-[#EBF3FB] text-[#2E75B6]  → DocumentTextIcon
  Soal  → bg-[#E8F5EE] text-[#1A7A4A]  → ClipboardListIcon
  Modul → bg-[#FDF3D8] text-[#B8860B]  → BookOpenIcon

Tailwind full:
"flex items-center gap-3 p-4 bg-cream border border-rule rounded-xl
 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
```

#### Pricing Card
```
3 variasi:
  default   → bg-cream border-rule
  popular   → bg-white border-[#C84B2F] border-2 shadow-lg (skala 1.02)
  pro       → bg-[#1F4E79] text-white border-[#1F4E79]

Badge "Paling Populer":
"absolute -top-3 left-1/2 -translate-x-1/2
 bg-[#C84B2F] text-white text-xs font-bold px-4 py-1 rounded-full"

Tailwind popular card:
"relative bg-white border-2 border-[#C84B2F] rounded-2xl p-6
 shadow-xl scale-[1.02] z-10"
```

#### Stat / Metric Card
```
Tailwind:
"bg-white border border-rule rounded-xl p-4 sm:p-6
 flex flex-col gap-1"

Value: "text-3xl font-bold text-ink"
Label: "text-sm text-muted"
Trend: "text-xs font-medium" (green jika positif, red jika negatif)
```

---

### 6.4 Modal

```
Overlay:
"fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
 flex items-center justify-center p-4"

Modal container:
"bg-white rounded-2xl shadow-xl w-full max-w-md
 animate-in fade-in zoom-in-95 duration-200"

Header:
"flex items-center justify-between p-6 border-b border-rule"
Title: "text-lg font-bold text-ink"
Close btn: "p-2 rounded-lg hover:bg-[#F2F2F2] transition-colors"

Body: "p-6"

Footer:
"flex items-center justify-end gap-3 p-6 border-t border-rule"

Animasi (gunakan @keyframes atau Tailwind animate plugin):
  open  → opacity 0→1, scale 0.95→1, duration 200ms ease-out
  close → opacity 1→0, scale 1→0.95, duration 150ms ease-in
```

---

### 6.5 Toast Notification

```
Container (fixed, stacked):
"fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full"

Toast base:
"flex items-start gap-3 p-4 rounded-xl shadow-lg border
 animate-in slide-in-from-right-full duration-200"

Variants:
  success → "bg-[#E8F5EE] border-[#1A7A4A] text-[#1A7A4A]"
  error   → "bg-[#FCEAE6] border-[#C84B2F] text-[#C84B2F]"
  warning → "bg-[#FDF3D8] border-[#B8860B] text-[#B8860B]"
  info    → "bg-[#EBF3FB] border-[#2E75B6] text-[#2E75B6]"

Icon: 20x20px, flex-shrink-0
Message: "text-sm font-medium"
Auto-dismiss: 4000ms
Max stack: 3 toast sekaligus
```

---

### 6.6 Badge / Tag

```
Base: "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"

Variants:
  success → "bg-[#E8F5EE] text-[#1A7A4A]"
  error   → "bg-[#FCEAE6] text-[#C84B2F]"
  warning → "bg-[#FDF3D8] text-[#B8860B]"
  info    → "bg-[#EBF3FB] text-[#2E75B6]"
  neutral → "bg-[#F2F2F2] text-[#737373]"
  purple  → "bg-[#F0EBFF] text-[#6A3EA1]"
  teal    → "bg-[#E0F5F8] text-[#0A7C8C]"
  dark    → "bg-[#1F4E79] text-white"

Status badge (dot + label):
"flex items-center gap-1.5"
Dot: "w-2 h-2 rounded-full"
```

---

### 6.7 Progress Bar (Kuota)

```
Container: "w-full"
Label row: "flex justify-between items-center mb-2"
  Label: "text-sm font-medium text-ink"
  Value: "text-sm text-muted"

Track:
"w-full h-2 bg-[#F2F2F2] rounded-full overflow-hidden"

Fill:
"h-full rounded-full transition-all duration-500 ease-out"

Color berdasarkan persentase:
  >50%  → bg-[#1A7A4A]   (hijau)
  20-50% → bg-[#B8860B]  (kuning/warning)
  ≤20%  → bg-[#C84B2F]   (merah/danger)
  unlimited → bg-[#2E75B6] (biru)
```

---

### 6.8 Skeleton Loader

```
Base animation: "animate-pulse bg-[#F2F2F2] rounded"

Variants:
  text-sm  → "h-3 rounded"
  text-md  → "h-4 rounded"
  text-lg  → "h-5 rounded"
  title    → "h-6 rounded w-3/4"
  avatar   → "w-10 h-10 rounded-full"
  card     → "h-24 rounded-xl"
  button   → "h-11 rounded-lg"

Document card skeleton:
"flex items-center gap-3 p-4"
  "w-10 h-10 rounded-lg animate-pulse bg-[#F2F2F2]"   ← ikon
  "flex-1 space-y-2"
    "h-4 bg-[#F2F2F2] rounded animate-pulse w-3/4"    ← judul
    "h-3 bg-[#F2F2F2] rounded animate-pulse w-1/2"    ← metadata

Aturan: tampilkan skeleton setelah 300ms delay (hindari flash loading)
```

---

### 6.9 Navigation

#### Bottom Tab Bar (Mobile ≤767px)
```
Container:
"fixed bottom-0 left-0 right-0 z-40
 bg-white border-t border-rule
 flex items-center justify-around
 h-14 px-2
 safe-area-bottom"

Tab item:
"flex flex-col items-center justify-center gap-0.5
 flex-1 h-full py-2 px-1
 transition-colors duration-150"

Tab icon: "w-5 h-5"
Tab label: "text-[10px] font-medium"

States:
  default → "text-muted"
  active  → "text-[#C84B2F]"
  active indicator: border-t-2 border-[#C84B2F] di atas tab item
```

#### Sidebar (Tablet 768px+ dan Desktop)
```
Collapsed (tablet):
"w-16 flex flex-col bg-[#1F4E79] h-screen fixed left-0 top-0 z-30
 py-4 items-center gap-1"

Expanded (desktop):
"w-60 flex flex-col bg-[#1F4E79] h-screen fixed left-0 top-0 z-30 py-4"

Logo area: "h-14 flex items-center px-4 border-b border-white/10"
Nav items container: "flex-1 px-2 py-4 space-y-1 overflow-y-auto"

Nav item:
"flex items-center gap-3 px-3 py-2.5 rounded-lg
 text-white/70 text-sm font-medium
 transition-all duration-150
 hover:bg-white/10 hover:text-white"

Active nav item:
"bg-white/15 text-white border-l-[3px] border-[#C84B2F]"

Icon: "w-5 h-5 flex-shrink-0"
```

---

### 6.10 Loading States

#### Page Loading (First Load)
```
"min-h-screen flex items-center justify-center bg-page"
Spinner: "w-8 h-8 border-2 border-[#C84B2F] border-t-transparent rounded-full animate-spin"
```

#### Button Loading
```
Spinner: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
Position: kiri tombol, sebelum teks
Teks: berubah jadi "Memproses..." saat loading
```

#### Generate Progress
```
Container: "w-full space-y-3 py-6"

Progress track: "w-full h-1.5 bg-[#F2F2F2] rounded-full"
Progress fill: "h-full bg-[#C84B2F] rounded-full transition-all duration-700 ease-out"

Status text: "text-sm text-muted text-center animate-pulse"

Teks yang berganti setiap ~5 detik:
  → "Menyusun tujuan pembelajaran..."
  → "Membuat kegiatan belajar..."
  → "Menambahkan asesmen..."
  → "Memformat dokumen..."
  → "Hampir selesai..."
```

---

## 7. LAYOUT TEMPLATES

### 7.1 Page Layout Base

```jsx
// Layout utama dengan sidebar + content
<div className="min-h-screen bg-page">
  {/* Sidebar — hidden di mobile */}
  <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 bg-brand-dark flex-col z-30">
    {/* Sidebar content */}
  </aside>

  {/* Main content area */}
  <main className="md:ml-60 min-h-screen">
    {/* Top bar */}
    <header className="h-14 border-b border-rule bg-white flex items-center px-4 md:px-6 sticky top-0 z-20">
      {/* Top bar content */}
    </header>

    {/* Page content */}
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Children */}
    </div>
  </main>

  {/* Bottom nav — mobile only */}
  <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-rule z-40">
    {/* Tab items */}
  </nav>

  {/* Bottom padding untuk mobile nav */}
  <div className="md:hidden h-14" />
</div>
```

### 7.2 Dashboard Layout

```
Mobile  : Single column, semua stacked vertikal
Tablet  : 2 kolom untuk metric cards
Desktop : 3-4 kolom untuk metric cards, 2/3 content + 1/3 sidebar kanan

Grid metric cards:
"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"

Quick generate cards:
"grid grid-cols-1 sm:grid-cols-3 gap-4"

Recent documents:
"space-y-3"
```

### 7.3 Form Generate Layout

```
Mobile  : 1 kolom, semua stacked
Tablet  : 2 kolom untuk field pendek (jenjang + kelas dalam 1 baris)
Desktop : Split view — form kiri (50%) + preview kanan (50%)

Container:
"grid grid-cols-1 lg:grid-cols-2 gap-6"

Form section:
"space-y-4"

Preview section (desktop only):
"hidden lg:block sticky top-20 h-fit"
```

### 7.4 Auth Pages Layout (v2.0)

```
Mobile  : Single column, form card terpusat, tanpa ilustrasi
Desktop : Split — maskot + tagline kiri (50%), form card kanan (50%)

Background:
linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 50%, #F0F9FF 100%)

Container:
"min-h-screen flex flex-col"

Main content grid:
"flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"

Maskot side (kiri):
"hidden lg:flex flex-col items-center text-center space-y-5 relative"
- Ilustrasi maskot dalam frame rounded gradient (teal → indigo → purple)
- Brand badge: GuruBantu AI (slate/blue/cyan)
- Heading tagline: text-3xl font-extrabold text-blue-600
- Deskripsi singkat dengan ikon circle

Form card (kanan):
"w-full max-w-md bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8"

Tombol submit utama:
"bg-[#1E3A8A] hover:bg-[#1e40af] text-white font-bold rounded-2xl"

Maskot Login  : /mascot-login.png    (robot AI biru)
Maskot Register: /mascot-register.png (guru wanita berhijab)
```

### 7.5 Landing Page Sections

```
Hero section:
"min-h-[90vh] flex flex-col items-center justify-center text-center
 px-4 py-16 bg-page"

Feature section:
"py-16 px-4 bg-white"
Grid: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"

Pricing section:
"py-16 px-4 bg-page"
Grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto"

Testimonial section:
"py-16 px-4 bg-white"
Grid mobile: carousel, Desktop: "grid grid-cols-3 gap-6"

Section max-width: "max-w-6xl mx-auto" (1152px)
Section padding: "py-16 md:py-24"
```

---

## 8. RESPONSIVE BREAKPOINTS

```
xs    : 320px   → HP Android murah (Redmi 9A, dsb)
sm    : 375px   → iPhone SE, HP standar (default Tailwind 'sm' = 640px, kita override)
md    : 768px   → Tablet, HP besar
lg    : 1024px  → Laptop standar
xl    : 1280px  → Monitor besar
2xl   : 1536px  → Monitor 4K (max-width: 1440px untuk content)
```

Override Tailwind config untuk breakpoints:
```js
screens: {
  'xs':  '320px',
  'sm':  '375px',
  'md':  '768px',
  'lg':  '1024px',
  'xl':  '1280px',
  '2xl': '1536px',
}
```

### Aturan Responsive

```
Mobile-first: selalu tulis class mobile dulu, baru tambahkan md:, lg:, xl:

Text:
  "text-2xl md:text-3xl lg:text-4xl"

Padding:
  "p-4 md:p-6 lg:p-8"

Grid:
  "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

Hidden/Show:
  Mobile only   : "block md:hidden"
  Tablet+       : "hidden md:block"
  Desktop only  : "hidden lg:block"
```

---

## 9. ANIMATION & TRANSITIONS

### 9.1 Durasi Standar

```
instant    : 0ms      → State change yang immediate (focus ring)
fast       : 100ms    → Button press (scale)
normal     : 150ms    → Color transitions, border
smooth     : 200ms    → Modal open, dropdown, fade
slow       : 300ms    → Page transition, skeleton → content
very-slow  : 500ms    → Progress bar, large layout shift
```

### 9.2 Easing

```
ease-out    → Untuk elemen yang masuk ke layar (modal open, toast slide in)
ease-in     → Untuk elemen yang keluar dari layar (modal close, toast dismiss)
ease-in-out → Untuk elemen yang berubah posisi (accordion, tab switch)
```

### 9.3 Tailwind Transition Classes

```
Semua interactive element harus punya transition:
"transition-colors duration-150"           → warna saja
"transition-all duration-200"             → semua properti
"transition-transform duration-100"       → untuk scale/translate
```

### 9.4 Micro-interactions Spesifik

```
Button press    : active:scale-95 duration-100
Card hover      : hover:-translate-y-0.5 hover:shadow-md duration-200
Toast in        : animate-in slide-in-from-right-full duration-200
Toast out       : animate-out slide-out-to-right-full fade-out duration-150
Modal in        : animate-in fade-in zoom-in-95 duration-200
Modal out       : animate-out fade-out zoom-out-95 duration-150
Dropdown in     : animate-in fade-in slide-in-from-top-2 duration-150
Skeleton pulse  : animate-pulse (Tailwind built-in)
Spinner rotate  : animate-spin (Tailwind built-in)
Progress update : transition-all duration-700 ease-out
```

---

## 10. ICONS

**Library: Lucide React** (`lucide-react@0.383.0`)

### Icon Sizes

```
xs   : w-3 h-3 (12px)  → di dalam badge
sm   : w-4 h-4 (16px)  → di samping teks kecil
md   : w-5 h-5 (20px)  → DEFAULT — toolbar, nav
lg   : w-6 h-6 (24px)  → heading, fitur
xl   : w-8 h-8 (32px)  → empty state, ilustrasi kecil
2xl  : w-12 h-12 (48px)→ ilustrasi utama, onboarding
```

### Icon Mapping per Fitur

```
RPP dokumen         → FileText
Soal ujian          → ClipboardList
Modul ajar          → BookOpen
Rapor               → GraduationCap
PMM                 → Award
Download            → Download
Generate/AI         → Sparkles atau Wand2
Delete              → Trash2
Edit                → Pencil
Settings/Profile    → Settings atau User
Payment/Billing     → CreditCard
Success/Check       → CheckCircle2
Error/Warning       → AlertCircle
Info                → Info
Logout              → LogOut
Dashboard/Home      → LayoutDashboard
History/Documents   → History
Quota/Counter       → Gauge
Upgrade/Arrow up    → TrendingUp
Close/X             → X
Menu                → Menu
Back arrow          → ArrowLeft
External link       → ExternalLink
Copy                → Copy
Loading             → Loader2 (dengan animate-spin)
Google              → (custom SVG — lihat section aset)
QRIS/Payment        → QrCode
```

### Penggunaan

```jsx
// Import
import { FileText, Download, Sparkles } from 'lucide-react'

// Usage
<FileText className="w-5 h-5 text-[#2E75B6]" />

// Di dalam button
<button className="... inline-flex items-center gap-2">
  <Sparkles className="w-4 h-4" />
  Generate RPP
</button>
```

---

## 11. EMPTY STATES

Setiap empty state harus punya: Ilustrasi + Judul + Deskripsi singkat + CTA

```
Container:
"flex flex-col items-center justify-center py-16 px-4 text-center"

Ilustrasi emoji/icon:
"text-6xl mb-4" atau ikon Lucide 48px dengan warna muted

Judul:
"text-xl font-bold text-ink mb-2"

Deskripsi:
"text-sm text-muted max-w-xs mb-6"

CTA Button: Primary atau Secondary

Contoh teks per halaman:
  Dashboard baru  : "📄" / "Mulai buat dokumen pertamamu!" / [Buat RPP Sekarang]
  Riwayat kosong  : "📂" / "Belum ada dokumen." / [Mulai Generate]
  0 hasil filter  : "🔍" / "Tidak ada yang cocok." / [Reset Filter]
  Transaksi kosong: "💳" / "Belum ada transaksi." / [Lihat Paket]
```

---

## 12. ACCESSIBILITY CHECKLIST

Setiap komponen yang dibuat harus memenuhi:

```
[ ] Semua interactive element punya focus-visible ring yang jelas
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E75B6] focus-visible:ring-offset-2"

[ ] Touch target minimum 44x44px untuk semua elemen yang bisa diklik

[ ] Kontras teks minimum 4.5:1 (WCAG AA)

[ ] Semua gambar/ikon dekoratif: aria-hidden="true"

[ ] Semua ikon fungsional tanpa teks: aria-label yang deskriptif
    <button aria-label="Hapus dokumen RPP IPA Kelas 8">
      <Trash2 className="w-4 h-4" aria-hidden="true" />
    </button>

[ ] Form field: label yang terhubung via htmlFor/id
    <label htmlFor="topik">Topik</label>
    <input id="topik" ... />

[ ] Error message: aria-describedby menunjuk ke error element
    <input aria-describedby="topik-error" aria-invalid="true" ... />
    <p id="topik-error" role="alert">...</p>

[ ] Modal: role="dialog" aria-modal="true" aria-labelledby
[ ] Loading: aria-busy="true" pada container yang loading
[ ] Progress bar: role="progressbar" aria-valuenow aria-valuemin aria-valuemax
```

---

## 13. DO's AND DON'Ts

### ✅ DO
- Gunakan semantic HTML (section, article, nav, main, aside)
- Mobile-first: tulis class mobile dulu
- Konsisten menggunakan design tokens dari file ini
- Tambahkan transition untuk semua state change yang visual
- Test setiap komponen di 320px viewport
- Gunakan gap instead of margin untuk flex/grid children
- Gunakan `text-base` (16px) minimum untuk body text di mobile

### ❌ DON'T
- JANGAN gunakan nilai warna hardcode di luar yang sudah didefinisikan di sini
- JANGAN buat tombol dengan tinggi kurang dari 44px
- JANGAN letakkan label form sebagai placeholder yang hilang saat diisi
- JANGAN gunakan `outline: none` tanpa pengganti focus indicator
- JANGAN pakai z-index sembarangan — gunakan: modal=50, toast=100, overlay=40, sticky nav=20
- JANGAN gunakan font size di bawah 12px
- JANGAN lupakan `transition-colors` di elemen hover
- JANGAN pakai inline style kecuali untuk nilai dinamis (misal: progress bar width)

---

## 14. UTILITY CLASSES KUSTOM

Tambahkan di `src/index.css`:

```css
@layer utilities {
  /* Safe area untuk iPhone */
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  .safe-area-top {
    padding-top: env(safe-area-inset-top, 0px);
  }

  /* Custom shadow untuk brand */
  .shadow-brand {
    box-shadow: 0 4px 14px rgba(200, 75, 47, 0.35);
  }

  /* Text clamp untuk card judul */
  .line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; }
  .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

  /* Scrollbar tipis */
  .scrollbar-thin::-webkit-scrollbar { width: 4px; height: 4px; }
  .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
  .scrollbar-thin::-webkit-scrollbar-thumb { background: #C8BFB0; border-radius: 9999px; }

  /* Focus ring konsisten */
  .focus-ring {
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E75B6] focus-visible:ring-offset-2;
  }
}
```

---

## 15. CONTOH KOMPONEN SIAP PAKAI

### Primary Button dengan Loading State

```jsx
interface ButtonProps {
  children: React.ReactNode
  isLoading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'full'
}

const Button = ({ children, isLoading, disabled, onClick, className = '', type = 'button', variant = 'primary', size = 'md' }: ButtonProps) => {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E75B6] focus-visible:ring-offset-2"
  
  const variants = {
    primary:   "bg-[#C84B2F] text-white hover:bg-[#a83d25] active:scale-95 disabled:opacity-50",
    secondary: "bg-transparent text-[#C84B2F] border-[1.5px] border-[#C84B2F] hover:bg-[#FCEAE6] active:scale-95 disabled:opacity-50",
    ghost:     "bg-transparent text-muted hover:bg-[#F2F2F2] hover:text-ink active:scale-95",
  }
  
  const sizes = {
    sm:   "px-3 py-2 text-xs min-h-[36px]",
    md:   "px-6 py-3 text-sm min-h-[44px]",
    lg:   "px-8 py-4 text-base min-h-[52px]",
    full: "w-full px-6 py-3 text-sm min-h-[44px]",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {isLoading ? 'Memproses...' : children}
    </button>
  )
}
```

### Text Input dengan Error

```jsx
interface InputProps {
  label: string
  id: string
  error?: string
  required?: boolean
  placeholder?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = ({ label, id, error, required, placeholder, type = 'text', value, onChange }: InputProps) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-sm font-medium text-ink">
      {label} {required && <span className="text-[#C84B2F]">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={!!error}
      className={`w-full px-4 py-3 text-base bg-white border rounded-lg min-h-[44px]
        placeholder:text-muted transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-offset-0
        ${error
          ? 'border-[#C84B2F] bg-[#FCEAE6] focus:border-[#C84B2F] focus:ring-[#C84B2F]/20'
          : 'border-rule focus:border-[#2E75B6] focus:ring-[#2E75B6]/20'
        }`}
    />
    {error && (
      <p id={`${id}-error`} role="alert" className="flex items-center gap-1 text-xs text-[#C84B2F]">
        <AlertCircle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
        {error}
      </p>
    )}
  </div>
)
```

### Document Card

```jsx
interface DocCardProps {
  id: number
  title: string
  type: 'rpp' | 'soal' | 'modul'
  createdAt: string
  onDownload: (id: number) => void
  onDelete: (id: number) => void
}

const typeConfig = {
  rpp:   { icon: FileText,      bg: 'bg-[#EBF3FB]', color: 'text-[#2E75B6]', label: 'RPP' },
  soal:  { icon: ClipboardList, bg: 'bg-[#E8F5EE]', color: 'text-[#1A7A4A]', label: 'Soal' },
  modul: { icon: BookOpen,      bg: 'bg-[#FDF3D8]', color: 'text-[#B8860B]', label: 'Modul' },
}

const DocCard = ({ id, title, type, createdAt, onDownload, onDelete }: DocCardProps) => {
  const { icon: Icon, bg, color, label } = typeConfig[type]
  return (
    <article className="flex items-center gap-3 p-4 bg-cream border border-rule rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink line-clamp-1">{title}</p>
        <p className="text-xs text-muted mt-0.5">{label} · {createdAt}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onDownload(id)}
          aria-label={`Download ${title}`}
          className="p-2 rounded-lg text-muted hover:bg-[#EBF3FB] hover:text-[#2E75B6] transition-colors"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          onClick={() => onDelete(id)}
          aria-label={`Hapus ${title}`}
          className="p-2 rounded-lg text-muted hover:bg-[#FCEAE6] hover:text-[#C84B2F] transition-colors"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}
```

---

*File ini adalah living document — update setiap kali ada keputusan desain baru.*
*GuruBantu AI Design System · v1.0 · 2026*

---

## 16. RESPONSIVE DESIGN — DETAIL LENGKAP PER HALAMAN

> Bagian ini mendefinisikan behavior SETIAP elemen di SETIAP breakpoint.
> Tidak ada yang boleh "dikira-kira" — semua sudah terdefinisi di sini.

---

### 16.1 Breakpoint Reference Card

```
┌─────────────┬──────────────┬─────────────────────────────────────────────┐
│ Breakpoint  │ Range        │ Device Target                               │
├─────────────┼──────────────┼─────────────────────────────────────────────┤
│ Mobile S    │ 320px–374px  │ Redmi 9A, Galaxy A01, HP budget Indonesia   │
│ Mobile M    │ 375px–424px  │ iPhone SE, Redmi Note standar               │
│ Mobile L    │ 425px–767px  │ Samsung A series, HP mid-range              │
│ Tablet      │ 768px–1023px │ iPad mini, tablet Android                   │
│ Desktop     │ 1024px–1279px│ Laptop 13"–14"                              │
│ Desktop L   │ 1280px+      │ Monitor 15"+, MacBook Pro                   │
└─────────────┴──────────────┴─────────────────────────────────────────────┘
```

---

### 16.2 Global Layout Behavior

#### Navigation Switching

```
320px–767px  → BOTTOM TAB BAR
  - Fixed di bottom, height: 56px (h-14)
  - 4 tab: Home, Generate, Dokumen, Profil
  - Icon 20px + label 10px
  - Active: border-top 2px #C84B2F + warna merah
  - Padding bottom: safe-area-inset-bottom (iPhone notch)
  - Tambah pb-14 di <main> agar konten tidak tertutup

768px–1023px → SIDEBAR COLLAPSED
  - Fixed kiri, width: 64px (w-16)
  - Hanya tampilkan icon (20px), tanpa label
  - Hover on desktop: expand ke 240px dengan label (transition 200ms)
  - Active item: bg-white/15 + border-left 3px #C84B2F
  - Main content: ml-16

1024px+     → SIDEBAR EXPANDED
  - Fixed kiri, width: 240px (w-60)
  - Icon (20px) + label (14px)
  - Logo area: height 56px
  - Main content: ml-60
  - User profile section di bagian bawah sidebar
```

#### Page Container

```
320px–767px  → px-4 py-4, no max-width
768px–1023px → px-6 py-6, no max-width
1024px+      → px-8 py-8, max-w-7xl mx-auto (1280px)
1280px+      → max-w-screen-xl mx-auto (1400px)
```

#### Top Header Bar

```
Semua breakpoint → height: 56px (h-14), sticky top-0, z-20, bg-white, border-bottom

Mobile  : Logo kiri + hamburger (hidden, diganti bottom nav) + avatar kanan
Tablet  : Logo kiri + breadcrumb tengah + notifikasi + avatar kanan  
Desktop : Search bar tengah (320px wide) + notifikasi + avatar + nama user kanan
```

---

### 16.3 Landing Page (/) — Per Breakpoint

#### Hero Section

```
320px–424px:
  - Padding: pt-16 pb-12 px-4
  - Judul: text-3xl font-black (30px), leading-tight
  - Subjudul: text-base (16px), text-muted, mt-3
  - CTA button: w-full, py-4, text-base
  - Video/GIF demo: DISEMBUNYIKAN (display:none) — hemat bandwidth
  - Stats (3 angka): hidden, tampil sebagai 1 baris teks saja
  - Layout: column, items-center, text-center

425px–767px:
  - Padding: pt-20 pb-16 px-6
  - Judul: text-4xl (36px)
  - CTA: w-full max-w-xs mx-auto
  - Stats: 3 kolom grid mini, masing-masing 1 angka + label

768px–1023px:
  - Padding: pt-24 pb-20 px-8
  - Layout: 2 kolom (teks kiri 55%, visual kanan 45%)
  - Judul: text-4xl (36px)
  - CTA button: inline, tidak full-width
  - Video/GIF: tampil di kolom kanan, rounded-2xl, shadow-xl
  - Stats: row horizontal di bawah CTA

1024px+:
  - Padding: pt-32 pb-24
  - Layout: 2 kolom (teks kiri 50%, visual kanan 50%)
  - Judul: text-5xl (48px), Playfair Display
  - Video autoplay muted
  - Stats: 3 kolom dengan divider vertikal
```

#### How It Works Section

```
320px–767px:
  - Layout: vertical stack (1 kolom)
  - Setiap step: nomor besar (text-5xl, brand-red) + icon + judul + deskripsi
  - Connector arrow: → horizontal jadi ↓ vertikal, display:none di mobile
  - Padding antar step: space-y-8

768px–1023px:
  - Layout: 3 kolom horizontal
  - Connector arrow: → horizontal antar step
  - Setiap kolom: text-center

1024px+:
  - Sama dengan tablet + max-w-4xl mx-auto
```

#### Features Grid

```
320px–767px  → 1 kolom, setiap card full-width
768px–1023px → 2 kolom grid
1024px+      → 3 kolom grid, max-w-6xl
```

#### Pricing Section

```
320px–424px:
  - 1 kolom, card stacked vertikal
  - Scroll vertikal untuk melihat semua paket
  - Popular card TIDAK di-scale (tidak ada ruang)
  - Tabel perbandingan: accordion (expand per fitur)

425px–767px:
  - 1 kolom tapi card lebih lebar
  - Horizontal scroll container untuk 4 kartu (scroll snap)
  - snap-x snap-mandatory, setiap card snap-start

768px–1023px:
  - 2 kolom grid: Gratis + Saset | Basic + Pro
  - Popular card (Basic): border-2 brand-red

1024px+:
  - 4 kolom berjejer
  - Popular card (Basic): scale-[1.04] z-10, shadow-xl
  - Tabel perbandingan: full tabel visible (tidak accordion)
```

#### Testimonial Section

```
320px–767px:
  - Carousel auto-scroll (setiap 4 detik)
  - 1 card visible, ada dot indicator di bawah
  - Swipe gesture support

768px–1023px:
  - 2 kartu visible sekaligus, carousel atau static

1024px+:
  - 3 kartu berjejer, static (tidak carousel)
```

#### Footer

```
320px–767px:
  - 1 kolom stack: logo + tagline → links → copyright
  - Links: 2 kolom grid (Privacy | Terms | Kontak | IG | TikTok)

768px+:
  - 3–4 kolom horizontal: logo | links | social | copyright
```

---

### 16.4 Dashboard Page (/dashboard) — Per Breakpoint

#### Header Greeting

```
Semua: "Halo, [Nama]! 👋" — text-xl (mobile) → text-2xl (desktop)
Sub  : Status langganan — text-sm text-muted
```

#### Quota Card

```
320px–767px:
  - Full-width card
  - Progress bar: h-2, full-width
  - Label: "18 dokumen tersisa" — text-sm
  - Tombol Upgrade: full-width secondary button di bawah progress bar
  - Warna progress bar: merah jika ≤20%, kuning jika ≤50%, hijau jika >50%

768px–1023px:
  - Card setengah lebar (50% atau 60%)
  - Tombol Upgrade: inline kanan

1024px+:
  - Card maks 400px
  - Layout: progress bar kiri + angka + tombol di satu baris
```

#### Quick Generate Cards

```
320px–424px:
  - 1 kolom, setiap card full-width
  - Card style: horizontal (icon kiri + teks kanan + arrow)
  - Height: 64px per card
  - Gap: gap-3

425px–767px:
  - 1 kolom, card lebih tinggi (vertical layout: icon atas + teks bawah)
  - Height: 120px per card

768px–1023px:
  - 3 kolom grid
  - Card: vertical layout, icon 32px, judul text-base, deskripsi text-sm

1024px+:
  - 3 kolom grid, max-w-3xl
  - Card: hover effect lebih pronounced (shadow + scale)
  - Keyboard shortcut hint muncul saat hover (contoh: "Ctrl+R")
```

#### Recent Documents List

```
320px–767px:
  - Full-width list
  - 5 item terbaru
  - Setiap item: horizontal card (icon + judul + tombol download)
  - Tombol hapus: hidden di mobile list (hanya di halaman riwayat penuh)

768px+:
  - Sama + tombol hapus muncul on hover
  - "Lihat Semua →" link di pojok kanan atas section
```

#### Stats/Metric Cards (jika ada)

```
320px–767px  → 2x2 grid (2 kolom, 2 baris)
768px–1023px → 2x2 atau 4 kolom
1024px+      → 4 kolom 1 baris, max-w-4xl
```

---

### 16.5 Form Generate RPP (/generate/rpp) — Per Breakpoint

#### Form Layout

```
320px–767px:
  - 1 kolom, full-width
  - Setiap field group: label (atas) + input (bawah)
  - Gap antar field: gap-y-4 (16px)
  - Dropdown: height 52px min (mudah di-tap)
  - Multi-select asesmen: 2 kolom checkbox grid
  - Tombol Generate: w-full, py-4, text-base, fixed di bottom atau di akhir form
  - "Kuota berkurang 1" info: text-xs, text-center, text-muted, di atas tombol

425px–767px:
  - Sama seperti Mobile S tapi padding lebih nyaman (px-6)

768px–1023px:
  - 2 kolom untuk field pendek:
    Row 1: [Mata Pelajaran (full-width)]
    Row 2: [Jenjang (50%)] [Kelas (50%)]
    Row 3: [Topik (full-width)]
    Row 4: [Alokasi Waktu (50%)] [Jumlah Pertemuan (50%)]
    Row 5: [Model Pembelajaran (full-width)]
    Row 6: [Jenis Asesmen (full-width, multi-select 3 kolom)]
  - Tombol Generate: inline kanan, bukan full-width
  - Preview section: tampil DI BAWAH form setelah generate

1024px+:
  - SPLIT VIEW: 2 kolom equal (50/50)
  - Kolom kiri: form (sticky saat preview tampil)
  - Kolom kanan: preview panel (sticky top-20)
  - Form tidak punya max-height — scroll bebas
  - Preview panel: max-h-[calc(100vh-120px)] overflow-y-auto
  - Sebelum generate: preview panel = empty state placeholder
  - Sesudah generate: preview muncul dengan animasi fade-in
```

#### Progress Bar saat Generate

```
320px–767px:
  - Full-width progress bar
  - Teks status di bawah progress bar, text-center
  - Form di-blur (opacity 50%) selama generate

768px+:
  - Progress bar di dalam area form (tidak fullscreen overlay)
  - Tombol Generate berubah jadi loading state
```

#### Hasil Generate (bawah form atau halaman terpisah)

```
320px–767px:
  - Tombol Download: w-full, primary, py-4, font-bold
  - Preview: accordion yang bisa di-expand
  - Tombol Generate Ulang: w-full, secondary
  - Tombol Edit Input: ghost, text-center
  - Urutan: Download → Preview accordion → Generate Ulang → Edit

768px–1023px:
  - Tombol Download: inline, tidak full-width
  - Preview: expanded by default (bukan accordion)
  - Tombol Generate Ulang: inline kanan

1024px+:
  - Preview live di kolom kanan setelah generate
  - Tombol download + ulang di atas preview panel
```

---

### 16.6 Riwayat Dokumen (/documents) — Per Breakpoint

#### Filter Bar

```
320px–424px:
  - Filter tersembunyi di belakang tombol "Filter ▼"
  - Tap tombol → bottom sheet muncul dari bawah
  - Bottom sheet: type filter (3 pill button) + date range + tombol Apply

425px–767px:
  - Filter partial visible: hanya type filter (pill buttons) di atas list
  - Date filter di dalam drawer/modal

768px–1023px:
  - Filter bar horizontal: [Semua | RPP | Soal | Modul] [Date From] [Date To] [Reset]
  - Inline di atas list, tidak perlu modal

1024px+:
  - Sama dengan tablet + search input tambahan
```

#### Document List

```
320px–767px:
  - 1 kolom list (bukan grid)
  - Card: horizontal layout — icon + info + tombol
  - Tombol: hanya Download (icon saja, 36px)
  - Hapus: swipe-left gesture atau tombol di halaman detail
  - Pagination: "Load More" button di bawah (bukan numbered pagination)

768px–1023px:
  - Masih 1 kolom tapi card lebih luas
  - Tombol Download + Hapus visible langsung (bukan hover)
  - Pagination: Load More

1024px+:
  - 2 kolom grid
  - Hover state: tombol download + hapus muncul
  - Pagination: numbered (1 2 3 ... 10) atau Load More, pilih salah satu

Ukuran card:
  Mobile  → min-h-[72px], icon 40px
  Desktop → min-h-[80px], icon 44px
```

---

### 16.7 Pricing Page (/pricing) — Per Breakpoint

#### Pricing Cards

```
320px–424px:
  - HORIZONTAL SCROLL dengan snap
  - Container: flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4
  - Setiap card: snap-start flex-shrink-0 w-[85vw] max-w-[320px]
  - Dot indicator di bawah (4 dots, active = brand-red)
  - Popular card: sama ukuran, badge Populer di atas

425px–767px:
  - 1 kolom stack vertikal
  - Setiap card: full-width
  - Popular card: border-2 brand-red (tidak ada scale, tidak ada ruang)

768px–1023px:
  - 2x2 grid: [Gratis | Saset] [Basic | Pro]
  - Popular card (Basic): border-2 brand-red + shadow-lg

1024px+:
  - 4 kolom 1 baris
  - Popular card: scale-[1.04] z-10 shadow-xl
  - Spacing: gap-4 dengan popular card sedikit lebih tinggi (via padding)
```

#### Feature Comparison Table

```
320px–424px:
  - TABLE TERSEMBUNYI, ganti dengan accordion
  - Setiap baris fitur = 1 accordion item
  - Di dalam accordion: 4 baris (Gratis / Saset / Basic / Pro) dengan ✓ / ✗

425px–767px:
  - Sticky header kolom (nama paket)
  - Table dengan horizontal scroll
  - Kolom pertama (nama fitur) sticky kiri

768px+:
  - Full table visible, tidak perlu scroll
  - Kolom Popular (Basic) di-highlight dengan background tipis
```

---

### 16.8 Auth Pages (Login & Register) — Per Breakpoint

#### Login Page

```
320px–767px:
  - Full-screen form, centered
  - Logo GuruBantu di atas form
  - Tidak ada ilustrasi
  - Form width: w-full max-w-sm mx-auto px-4
  - Tombol Google: FULL-WIDTH di ATAS form email (lebih prominent)
  - "atau" divider di antara Google button dan form
  - Padding top: pt-16 (karena tidak ada sidebar)

768px–1023px:
  - Same as mobile tapi di tengah layar
  - Card putih dengan shadow: max-w-md, p-8, rounded-2xl

1024px+:
  - SPLIT LAYOUT
  - Kiri (40%): form di tengah vertikal, logo di atas
  - Kanan (60%): bg-brand-dark, ilustrasi/testimonial putih
  - No card wrapper — form langsung di background page
```

#### Register Page

```
320px–767px:
  - Same layout dengan login
  - Password strength indicator: bar berwarna di bawah input
  - 4 field: stacked 1 kolom
  - Checkbox ToS: text-xs, link ke halaman ToS

768px–1023px:
  - Card layout seperti login

1024px+:
  - Split layout seperti login
  - Di sisi kanan: bullet points manfaat GuruBantu
    "✅ RPP selesai dalam 5 menit"
    "✅ Format Kurikulum Merdeka otomatis"
    "✅ 5 dokumen gratis, tidak perlu kartu kredit"
```

---

### 16.9 Payment Pages — Per Breakpoint

#### Pricing Confirmation Page

```
320px–767px:
  - Card konfirmasi: full-width, p-4
  - Detail paket: judul besar, harga besar (text-3xl brand-red)
  - Metode bayar: icon-icon QRIS, GoPay, dll horizontal scroll
  - Tombol Bayar Sekarang: w-full, py-4

768px+:
  - Card centered: max-w-md
  - Metode bayar: grid 3 kolom
```

#### Payment Success / Failed

```
320px–767px:
  - Full-screen centered
  - Ikon besar (✅ atau ❌): 80px
  - Judul: text-2xl, centered
  - Detail: text-sm, text-muted
  - CTA: w-full

768px+:
  - Card centered: max-w-sm, shadow
```

---

### 16.10 Profil & Settings (/profile) — Per Breakpoint

#### Layout

```
320px–767px:
  - 1 kolom stack
  - Section tabs: horizontal scroll pill tabs di atas
    [Profil | Tagihan | Keamanan]
  - Setiap section: full-width card

768px–1023px:
  - 2 kolom: sidebar tabs kiri (30%) + konten kanan (70%)
  - Tabs: vertical list di sidebar

1024px+:
  - Sama dengan tablet, max-w-4xl mx-auto
```

#### Profile Form

```
Mobile  : 1 kolom, semua stacked
Desktop : nama di kiri, email (disabled) di kanan dalam 2 kolom grid
```

#### Danger Zone (Hapus Akun)

```
Semua breakpoint:
  - Card terpisah di bagian paling bawah
  - Border: border-[#C84B2F]/30
  - Background: bg-[#FCEAE6]/30
  - Tombol: "Hapus Akun" ghost dengan text-red + border merah
  - Di atas tombol: teks warning jelas
```

---

### 16.11 Touch & Gesture Behavior

```
Swipe kanan  → Navigasi back (mobile browser native, tidak perlu implement)
Swipe kiri   → Reveal tombol hapus pada document card list (mobile only)
Pull to refresh → Refresh data di dashboard dan riwayat dokumen
Pinch zoom   → DISABLED pada semua halaman app (meta viewport: user-scalable=no)
Long press   → Tidak digunakan

Implementasi swipe delete pada card:
  - Gunakan library: react-swipeable atau native touch events
  - Threshold: 60px swipe = reveal tombol hapus (warna merah, 72px wide)
  - Beyond 120px: auto-trigger delete confirmation
  - Snap back jika swipe tidak cukup jauh
```

---

### 16.12 Keyboard Navigation (Desktop)

```
Tab order:
  1. Skip to main content link (visually hidden, visible on focus)
  2. Top navigation items (kiri ke kanan)
  3. Main content area (top to bottom, left to right)
  4. Footer links

Keyboard shortcuts (Desktop only):
  Ctrl+G atau Cmd+G → Buka form Generate (dari mana saja)
  Ctrl+D atau Cmd+D → Buka riwayat Dokumen
  Escape            → Tutup modal / dropdown / toast
  Enter / Space     → Aktivasi button / checkbox / dropdown item
  ArrowUp / Down    → Navigasi item dalam dropdown
  ArrowLeft / Right → Navigasi tab (pricing, profile tabs)

Focus visible styling (WAJIB, tidak boleh hidden):
  "focus-visible:outline-none focus-visible:ring-2 
   focus-visible:ring-[#2E75B6] focus-visible:ring-offset-2"
```

---

### 16.13 Print Styles

```css
/* Di src/index.css */
@media print {
  /* Sembunyikan navigation */
  nav, aside, header, .bottom-nav { display: none !important; }
  
  /* Halaman generate: tampilkan preview, sembunyikan form */
  .generate-form { display: none !important; }
  .preview-panel { display: block !important; }
  
  /* Pricing: tampilkan semua kartu */
  .pricing-carousel { overflow: visible !important; }
  
  /* Typography untuk print */
  body { font-size: 12pt; color: black; }
  a { text-decoration: none; color: black; }
  
  /* Page break */
  .page-break { page-break-before: always; }
}
```

---

### 16.14 Dark Mode (Opsional — v2)

> Tidak diimplementasi di MVP. Dokumentasikan untuk referensi v2.

```
Jika di-implement, gunakan Tailwind dark mode class.
Setiap warna yang didefinisikan di Section 1 harus punya padanan dark mode.
Simpan preferensi di localStorage: 'gurubantu-theme': 'light' | 'dark' | 'system'
```

---

### 16.15 Responsive Typography Scale per Breakpoint

| Element        | 320px      | 768px      | 1024px     | Tailwind Class                    |
|----------------|------------|------------|------------|-----------------------------------|
| Hero H1        | 28px       | 36px       | 48px       | `text-3xl md:text-4xl lg:text-5xl`|
| Page H1        | 24px       | 28px       | 30px       | `text-2xl md:text-3xl`            |
| Section H2     | 20px       | 24px       | 24px       | `text-xl md:text-2xl`             |
| Card Title     | 16px       | 18px       | 18px       | `text-base md:text-lg`            |
| Body Text      | 16px       | 16px       | 16px       | `text-base` (tidak berubah)       |
| Label/Caption  | 12px       | 14px       | 14px       | `text-xs md:text-sm`              |
| Button Text    | 14px       | 14px       | 14px       | `text-sm` (tidak berubah)         |
| Metric Value   | 28px       | 32px       | 36px       | `text-3xl md:text-4xl`            |

---

### 16.16 Responsive Images & Assets

```
Logo:
  Mobile  : text logo saja (GuruBantu AI) — hemat bandwidth
  Tablet+ : logo icon + text

Hero illustration/video:
  Mobile  : hidden (display: none) atau static image ringan <50KB
  Tablet+ : GIF animasi atau video mp4 autoplay muted

Favicon      : 32x32 PNG + 180x180 apple-touch-icon
PWA icons    : 192x192 + 512x512 PNG untuk manifest.json

Lazy loading semua gambar:
  <img loading="lazy" ... />
  atau React: import { lazy } from 'react'
```

---

### 16.17 Responsive Testing Checklist

Sebelum setiap sprint selesai, test UI di resolusi berikut:

```
[ ] 320px  × 568px  → Galaxy S5 (mode portrait) — pakai Chrome DevTools
[ ] 375px  × 667px  → iPhone SE — pakai Chrome DevTools
[ ] 390px  × 844px  → iPhone 14 — pakai Chrome DevTools
[ ] 768px  × 1024px → iPad mini — pakai Chrome DevTools
[ ] 1280px × 800px  → Laptop standar — resize browser
[ ] 1440px × 900px  → MacBook — resize browser

Test untuk setiap resolusi:
  [ ] Tidak ada horizontal scroll yang tidak disengaja
  [ ] Semua teks terbaca (tidak terpotong, tidak overflow)
  [ ] Semua tombol bisa di-tap/klik (min 44px)
  [ ] Form bisa diisi dan disubmit
  [ ] Navigation berfungsi (bottom nav di mobile, sidebar di desktop)
  [ ] Modal terbuka dan bisa ditutup
  [ ] Toast muncul di posisi yang benar
  [ ] Tidak ada elemen yang overlap
  [ ] Tidak ada z-index yang bermasalah (modal tertutup navbar, dsb)
```

---

*Design System GuruBantu AI · v1.0 — Section 16 ditambahkan*
*Responsive Detail lengkap per halaman dan per breakpoint*
