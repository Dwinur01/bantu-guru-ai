/**
 * Daftar mata pelajaran lengkap sesuai Kurikulum Merdeka (Kemendikbudristek)
 * Sumber: Permendikbudristek No. 12 Tahun 2024 & Keputusan Kepala BSKAP
 *
 * Terpusat di sini agar semua halaman (RPP, Soal, Modul Ajar) konsisten.
 */

// ─────────────────────────────────────────────────────────────────────────────
// JENJANG
// ─────────────────────────────────────────────────────────────────────────────
export const jenjangOptions = ['SD', 'SMP', 'SMA', 'SMK'];

// ─────────────────────────────────────────────────────────────────────────────
// KELAS per jenjang
// ─────────────────────────────────────────────────────────────────────────────
export const kelasOptions: Record<string, string[]> = {
  SD:  ['Kelas I', 'Kelas II', 'Kelas III', 'Kelas IV', 'Kelas V', 'Kelas VI'],
  SMP: ['Kelas VII', 'Kelas VIII', 'Kelas IX'],
  SMA: ['Kelas X', 'Kelas XI', 'Kelas XII'],
  SMK: ['Kelas X', 'Kelas XI', 'Kelas XII'],
};

// ─────────────────────────────────────────────────────────────────────────────
// ALOKASI WAKTU per jenjang
// ─────────────────────────────────────────────────────────────────────────────
export const alokasiWaktuOptions: Record<string, string[]> = {
  SD:  ['2 JP (2 x 35 menit)', '4 JP (4 x 35 menit)', '6 JP (6 x 35 menit)'],
  SMP: ['2 JP (2 x 40 menit)', '4 JP (4 x 40 menit)', '6 JP (6 x 40 menit)'],
  SMA: ['2 JP (2 x 45 menit)', '4 JP (4 x 45 menit)', '6 JP (6 x 45 menit)'],
  SMK: ['2 JP (2 x 45 menit)', '4 JP (4 x 45 menit)', '6 JP (6 x 45 menit)', '8 JP (8 x 45 menit)'],
};

// ─────────────────────────────────────────────────────────────────────────────
// MATA PELAJARAN per jenjang (Kurikulum Merdeka — Lengkap)
// ─────────────────────────────────────────────────────────────────────────────
export const mapelOptions: Record<string, string[]> = {

  // ── SD / MI ──────────────────────────────────────────────────────────────
  // Kurikulum Merdeka SD: mapel wajib + muatan lokal
  SD: [
    // Wajib
    'Pendidikan Agama Islam dan Budi Pekerti',
    'Pendidikan Agama Kristen dan Budi Pekerti',
    'Pendidikan Agama Katolik dan Budi Pekerti',
    'Pendidikan Agama Hindu dan Budi Pekerti',
    'Pendidikan Agama Buddha dan Budi Pekerti',
    'Pendidikan Agama Khonghucu dan Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
    'Seni Budaya',
    'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    'Bahasa Inggris',
    // Muatan lokal (umum)
    'Bahasa Daerah',
    'Prakarya',
    'Lainnya (Tulis Sendiri)',
  ],

  // ── SMP / MTs ─────────────────────────────────────────────────────────────
  SMP: [
    // Wajib
    'Pendidikan Agama Islam dan Budi Pekerti',
    'Pendidikan Agama Kristen dan Budi Pekerti',
    'Pendidikan Agama Katolik dan Budi Pekerti',
    'Pendidikan Agama Hindu dan Budi Pekerti',
    'Pendidikan Agama Buddha dan Budi Pekerti',
    'Pendidikan Agama Khonghucu dan Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Ilmu Pengetahuan Alam (IPA)',
    'Ilmu Pengetahuan Sosial (IPS)',
    'Bahasa Inggris',
    'Informatika',
    'Seni Budaya',
    'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    // Muatan lokal
    'Bahasa Daerah',
    'Prakarya',
    'Lainnya (Tulis Sendiri)',
  ],

  // ── SMA / MA ──────────────────────────────────────────────────────────────
  SMA: [
    // Umum (Kelas X — sebelum peminatan)
    'Pendidikan Agama Islam dan Budi Pekerti',
    'Pendidikan Agama Kristen dan Budi Pekerti',
    'Pendidikan Agama Katolik dan Budi Pekerti',
    'Pendidikan Agama Hindu dan Budi Pekerti',
    'Pendidikan Agama Buddha dan Budi Pekerti',
    'Pendidikan Agama Khonghucu dan Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Bahasa Inggris',
    'Informatika',
    'Seni Budaya',
    'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    'Sejarah',
    // Ilmu Pengetahuan Alam (IPA)
    'Fisika',
    'Kimia',
    'Biologi',
    // Ilmu Pengetahuan Sosial (IPS)
    'Geografi',
    'Ekonomi',
    'Sosiologi',
    // Bahasa & Sastra
    'Bahasa dan Sastra Indonesia',
    'Bahasa dan Sastra Inggris',
    'Bahasa Jerman',
    'Bahasa Jepang',
    'Bahasa Prancis',
    'Bahasa Mandarin',
    'Bahasa Arab',
    // Seni
    'Seni Musik',
    'Seni Rupa',
    'Seni Teater',
    'Seni Tari',
    // Lainnya
    'Antropologi',
    'Prakarya dan Kewirausahaan',
    'Bahasa Daerah',
    'Lainnya (Tulis Sendiri)',
  ],

  // ── SMK / MAK ─────────────────────────────────────────────────────────────
  // Umum + Kejuruan (dikelompokkan berdasarkan bidang keahlian utama)
  SMK: [
    // ─── Mapel Umum (wajib semua SMK) ───
    'Pendidikan Agama Islam dan Budi Pekerti',
    'Pendidikan Agama Kristen dan Budi Pekerti',
    'Pendidikan Agama Katolik dan Budi Pekerti',
    'Pendidikan Agama Hindu dan Budi Pekerti',
    'Pendidikan Agama Buddha dan Budi Pekerti',
    'Pendidikan Agama Khonghucu dan Budi Pekerti',
    'Pendidikan Pancasila',
    'Bahasa Indonesia',
    'Matematika',
    'Bahasa Inggris',
    'Informatika',
    'Projek Ilmu Pengetahuan Alam dan Sosial (PIPAS)',
    'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    'Seni Budaya',
    'Sejarah',
    'Bahasa Daerah',

    // ─── Teknologi Informasi dan Komunikasi ───
    'Dasar-Dasar Teknik Jaringan Komputer dan Telekomunikasi',
    'Administrasi Sistem Jaringan',
    'Teknik Komputer dan Jaringan',
    'Rekayasa Perangkat Lunak',
    'Pengembangan Perangkat Lunak dan GIM',
    'Sistem Informatika, Jaringan dan Aplikasi',
    'Animasi',
    'Desain Komunikasi Visual',

    // ─── Teknik dan Manufaktur ───
    'Dasar-Dasar Teknik Mesin',
    'Teknik Pemesinan',
    'Teknik Pengelasan dan Fabrikasi Logam',
    'Teknik Kendaraan Ringan Otomotif',
    'Teknik Sepeda Motor',
    'Teknik Alat Berat',
    'Teknik Otomotif',
    'Dasar-Dasar Teknik Elektronika',
    'Teknik Elektronika Industri',
    'Teknik Audio Video',
    'Teknik Instrumentasi dan Otomasi Industri',
    'Dasar-Dasar Teknik Listrik',
    'Teknik Instalasi Tenaga Listrik',
    'Teknik Pembangkit Tenaga Listrik',

    // ─── Konstruksi dan Properti ───
    'Dasar-Dasar Teknik Konstruksi dan Properti',
    'Desain Pemodelan dan Informasi Bangunan',
    'Konstruksi Gedung, Sanitasi, dan Perawatan',
    'Bisnis Konstruksi dan Properti',
    'Geomatika',

    // ─── Agribisnis dan Agroteknologi ───
    'Dasar-Dasar Agribisnis Tanaman',
    'Agribisnis Tanaman Pangan dan Hortikultura',
    'Agribisnis Perkebunan',
    'Dasar-Dasar Agribisnis Ternak',
    'Agribisnis Ternak Unggas',
    'Agribisnis Ternak Ruminansia',
    'Dasar-Dasar Perikanan',
    'Agribisnis Perikanan Air Tawar',
    'Agribisnis Perikanan Air Laut',
    'Agroteknologi Pengolahan Hasil Pertanian',

    // ─── Kesehatan dan Pekerjaan Sosial ───
    'Dasar-Dasar Layanan Kesehatan',
    'Asisten Keperawatan',
    'Caregiver',
    'Teknologi Laboratorium Medik',
    'Farmasi Klinis dan Komunitas',
    'Dental Asisten',

    // ─── Bisnis dan Manajemen ───
    'Dasar-Dasar Manajemen Perkantoran dan Layanan Bisnis',
    'Manajemen Perkantoran dan Layanan Bisnis',
    'Akuntansi dan Keuangan Lembaga',
    'Perbankan dan Keuangan Mikro',
    'Pemasaran',
    'Bisnis Daring dan Pemasaran',

    // ─── Pariwisata ───
    'Dasar-Dasar Pariwisata',
    'Usaha Layanan Pariwisata',
    'Perhotelan',
    'Kuliner',
    'Tata Boga',
    'Tata Busana',
    'Tata Kecantikan Kulit dan Rambut',
    'Spa dan Beauty Therapy',

    // ─── Seni dan Industri Kreatif ───
    'Dasar-Dasar Seni Rupa',
    'Seni Lukis',
    'Seni Patung',
    'Desain dan Produksi Kriya Logam',
    'Desain dan Produksi Kriya Kayu',
    'Desain dan Produksi Kriya Tekstil',
    'Desain dan Produksi Batik',
    'Broadcasting dan Perfilman',
    'Produksi dan Siaran Program Televisi',
    'Produksi Film',
    'Tata Artistik',
    'Seni Pedalangan',
    'Seni Karawitan',
    'Seni Tari dan Teater',

    // ─── Prakarya dan Kewirausahaan ───
    'Kewirausahaan',
    'Prakarya dan Kewirausahaan',
    'Lainnya (Tulis Sendiri)',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// MODEL PEMBELAJARAN
// ─────────────────────────────────────────────────────────────────────────────
export const modelPembelajaranOptions = [
  'Problem Based Learning (PBL)',
  'Project Based Learning (PjBL)',
  'Discovery Learning',
  'Inquiry Learning',
  'Cooperative Learning',
  'Contextual Teaching & Learning (CTL)',
  'Differentiated Learning',
  'Flipped Classroom',
  'STEM/STEAM',
  'Blended Learning',
];

// ─────────────────────────────────────────────────────────────────────────────
// ASESMEN
// ─────────────────────────────────────────────────────────────────────────────
export const asesmenOptions = [
  { id: 'Formatif', label: 'Asesmen Formatif' },
  { id: 'Sumatif', label: 'Asesmen Sumatif' },
  { id: 'Diagnostik', label: 'Asesmen Diagnostik' },
  { id: 'Sikap', label: 'Asesmen Sikap (Afektif)' },
  { id: 'Pengetahuan', label: 'Asesmen Pengetahuan (Kognitif)' },
  { id: 'Keterampilan', label: 'Asesmen Keterampilan (Psikomotorik)' },
  { id: 'Observasi', label: 'Observasi' },
  { id: 'Performa', label: 'Asesmen Performa / Proyek' },
];

// ─────────────────────────────────────────────────────────────────────────────
// TINGKAT KESULITAN SOAL
// ─────────────────────────────────────────────────────────────────────────────
export const kesulitanOptions = [
  { id: 'Mudah', label: 'Mudah (Pemahaman C1-C2)' },
  { id: 'Sedang', label: 'Sedang (Penerapan C3)' },
  { id: 'Sulit', label: 'Sulit (Analisis C4)' },
  { id: 'HOTS', label: 'HOTS (Evaluasi & Kreasi C5-C6)' },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROFIL PELAJAR PANCASILA (untuk Modul Ajar)
// ─────────────────────────────────────────────────────────────────────────────
export const profilPelajarPancasilaOptions = [
  { id: 'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia', label: 'Beriman & Berakhlak Mulia' },
  { id: 'Berkebhinekaan Global', label: 'Berkebhinekaan Global' },
  { id: 'Bergotong Royong', label: 'Bergotong Royong' },
  { id: 'Mandiri', label: 'Mandiri' },
  { id: 'Bernalar Kritis', label: 'Bernalar Kritis' },
  { id: 'Kreatif', label: 'Kreatif' },
];
