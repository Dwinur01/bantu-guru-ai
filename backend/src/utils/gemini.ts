import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;
let useMockFallback = true;

if (API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    useMockFallback = false;
    console.log('[Gemini] Gemini API Client initialized successfully.');
  } catch (error) {
    console.error('[Gemini] Failed to initialize Gemini API client:', error);
  }
} else {
  console.log('[Gemini] GEMINI_API_KEY missing. Using Mock RPP JSON Fallback.');
}

export interface RPPGenerateInput {
  mapel: string;
  kelas: string;
  topik: string;
  alokasiWaktu: string;
  modelPembelajaran: string;
  asesmen: string[];
}

/**
 * Memanggil Gemini API dengan Timeout 30s & Retry 1x.
 * Jika mati/gagal/tidak ada API key, mengembalikan Mock RPP JSON terformat tinggi secara cerdas.
 */
export const generateRPPContent = async (input: RPPGenerateInput): Promise<string> => {
  const prompt = `
Peran: Anda adalah pakar kurikulum pendidikan nasional Indonesia, khususnya spesialis Kurikulum Merdeka Kemendikbudristek.
Tugas: Buat dokumen Rencana Pelaksanaan Pembelajaran (RPP) yang detail dan berstandar formal tinggi dalam Bahasa Indonesia baku berdasarkan data masukan berikut:
- Mata Pelajaran: ${input.mapel}
- Kelas: ${input.kelas}
- Topik Utama: ${input.topik}
- Alokasi Waktu: ${input.alokasiWaktu}
- Model Pembelajaran: ${input.modelPembelajaran}
- Jenis Asesmen terpilih: ${input.asesmen.join(', ')}

Format Output Wajib: Kembalikan respons Anda HANYA berupa objek JSON mentah yang valid, tanpa format pembungkus markdown (JANGAN gunakan backticks \`\`\`json atau teks pengantar/penutup apapun).

Skema JSON Wajib:
{
  "identitas": {
    "sekolah": "SD/SMP/SMA Negeri Terpadu",
    "mapel": "${input.mapel}",
    "kelas": "${input.kelas}",
    "alokasiWaktu": "${input.alokasiWaktu}",
    "topik": "${input.topik}",
    "modelPembelajaran": "${input.modelPembelajaran}"
  },
  "capaianPembelajaran": "[Tulis deskripsi Capaian Pembelajaran (CP) Kurikulum Merdeka secara lengkap untuk kompetensi ini]",
  "tujuanPembelajaran": [
    "[Tulis Tujuan Pembelajaran 1 (spesifik, terukur, berpusat pada siswa)]",
    "[Tulis Tujuan Pembelajaran 2 (spesifik, terukur, berpusat pada siswa)]"
  ],
  "alurTujuanPembelajaran": "[Tulis alur pemahaman kompetensi siswa dari awal hingga akhir kegiatan pembelajaran]",
  "kegiatanPembelajaran": [
    { "tahap": "Pendahuluan", "durasi": "10 menit", "deskripsi": "[Langkah detail apersepsi, motivasi, dan penjelasan tujuan belajar oleh guru]" },
    { "tahap": "Inti", "durasi": "60 menit", "deskripsi": "[Langkah detail eksplorasi konsep kelompok, pemecahan masalah berdasarkan model ${input.modelPembelajaran}, presentasi, dan diskusi]" },
    { "tahap": "Penutup", "durasi": "10 menit", "deskripsi": "[Langkah detail kesimpulan bersama, evaluasi/kuis mandiri, dan refleksi pembelajaran]" }
  ],
  "asesmen": {
    "formatif": "[Jelaskan kegiatan penilaian formatif yang dilakukan selama proses belajar mengajar]",
    "sumatif": "[Jelaskan kegiatan penilaian sumatif akhir kompetensi]",
    "instrumen": "[Tulis rubrik kriteria penilaian singkat untuk jenis asesmen yang dipilih: ${input.asesmen.join(', ')}]"
  }
}
  `;

  if (useMockFallback || !genAI) {
    console.log('[Gemini] Active mock fallback mode. Generating highly realistic RPP JSON...');
    return JSON.stringify(getMockRPPData(input), null, 2);
  }

  // Helper untuk melakukan request ke Gemini API
  const makeRequest = async () => {
    const model = genAI!.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Bersihkan pembungkus markdown ```json jika Gemini tetap mengembalikannya
    return text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
  };

  // Bungkus request dalam timeout 30s & Retry 1x
  try {
    return await runWithTimeout(makeRequest, 30000);
  } catch (error: any) {
    console.warn('[Gemini] First attempt failed, retrying once...', error.message || error);
    try {
      return await runWithTimeout(makeRequest, 30000);
    } catch (retryError) {
      console.error('[Gemini] All attempts failed/timed out, falling back to mock JSON:', retryError);
      return JSON.stringify(getMockRPPData(input), null, 2);
    }
  }
};

/**
 * Helper untuk membungkus fungsi asinkron dengan batas waktu (timeout)
 */
const runWithTimeout = <T>(fn: () => Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI_TIMEOUT')), ms)
    ),
  ]);
};

/**
 * Generator RPP Mock Dinamis berkualitas tinggi yang diselaraskan dengan standar Kemendikbud
 */
const getMockRPPData = (input: RPPGenerateInput) => {
  const jenjang = input.kelas.match(/^(I|II|III|IV|V|VI)$/) ? 'Sekolah Dasar (SD)' : 
                  input.kelas.match(/^(VII|VIII|IX)$/) ? 'Sekolah Menengah Pertama (SMP)' : 'Sekolah Menengah Atas (SMA)';

  return {
    identitas: {
      sekolah: `${jenjang} Negeri Terpadu Harapan Bangsa`,
      mapel: input.mapel,
      kelas: input.kelas,
      alokasiWaktu: input.alokasiWaktu,
      topik: input.topik,
      modelPembelajaran: input.modelPembelajaran
    },
    capaianPembelajaran: `Pada akhir fase pembelajaran ini, peserta didik dapat memahami esensi dari topik ${input.topik} secara konseptual. Peserta didik mampu menganalisis keterkaitan teori dengan realitas praktis, memecahkan masalah kontekstual menggunakan model ${input.modelPembelajaran}, serta secara aktif mengomunikasikan pemahaman mereka secara logis dan runtut sesuai dengan kriteria Kurikulum Merdeka Kemendikbudristek.`,
    tujuanPembelajaran: [
      `Melalui metode ${input.modelPembelajaran}, peserta didik mampu mengidentifikasi karakteristik utama dan elemen kunci dari topik ${input.topik} secara mandiri dengan tingkat akurasi minimal 80%.`,
      `Peserta didik dapat menguji, menganalisis, dan memecahkan permasalahan nyata yang berkaitan dengan ${input.topik} melalui kegiatan kolaborasi kelompok secara proaktif.`,
      `Peserta didik mampu menyajikan laporan hasil penyelidikan kelompok mengenai ${input.topik} secara lisan dan tertulis dengan runtut.`
    ],
    alurTujuanPembelajaran: `1. Eksplorasi konsep awal konsep dasar ${input.topik} -> 2. Pemecahan masalah kelompok dengan model ${input.modelPembelajaran} -> 3. Evaluasi konsep & presentasi -> 4. Asesmen formatif terpadu dan refleksi.`,
    kegiatanPembelajaran: [
      {
        tahap: "Pendahuluan",
        durasi: "10 menit",
        deskripsi: "Guru membuka pelajaran dengan salam hangat, doa bersama, dan absensi kehadiran. Guru kemudian melakukan apersepsi menarik dengan memberikan pertanyaan pemantik kontekstual mengenai penerapan praktis dari topik '" + input.topik + "' dalam kehidupan nyata. Guru menyampaikan tujuan pembelajaran hari ini dan menjelaskan alur kegiatan dengan model " + input.modelPembelajaran + "."
      },
      {
        tahap: "Inti",
        durasi: "60 menit",
        deskripsi: "Siswa dibagi ke dalam kelompok heterogen berisi 4-5 orang. Guru membagikan Lembar Kerja Peserta Didik (LKPD) berbasis pemecahan masalah. Menggunakan model " + input.modelPembelajaran + ", siswa melakukan investigasi literatur untuk memecahkan studi kasus tentang '" + input.topik + "'. Guru mengawasi dan memberikan bimbingan berkala. Setelah selesai, perwakilan kelompok mempresentasikan hasil diskusi di depan kelas, disusul sesi tanggapan aktif (tanya-jawab) oleh kelompok lainnya."
      },
      {
        tahap: "Penutup",
        durasi: "10 menit",
        deskripsi: "Guru membimbing siswa menarik kesimpulan komprehensif atas materi '" + input.topik + "'. Guru membagikan kuis evaluasi tertulis mandiri singkat. Sesi diakhiri dengan melakukan refleksi bersama (apa yang dirasakan, kesulitan yang dihadapi, dan apa yang dipelajari), pemberian apresiasi kelompok terbaik, penugasan membaca mandiri untuk pertemuan selanjutnya, serta salam penutup."
      }
    ],
    asesmen: {
      formatif: "Observasi keaktifan kolaborasi kelompok, penilaian keaktifan bertanya, serta performa presentasi lisan menggunakan lembar penilaian sikap.",
      sumatif: "Tes evaluasi tertulis mandiri di akhir sesi (terdiri atas 3 butir soal esai penalaran analitis kognitif tentang " + input.topik + ").",
      instrumen: "1. Rubrik Penilaian Sikap Kolaborasi (Skala Likert 1-4) mencakup tanggung jawab dan kerja sama kelompok.\n2. Rubrik Kognitif Asesmen Tertulis (" + input.asesmen.join(', ') + ") yang menguji keakuratan pemecahan masalah dengan skor maksimal 100."
    }
  };
};

export interface SoalGenerateInput {
  mapel: string;
  kelas: string;
  topik: string;
  jumlahPG: number;
  jumlahEssay: number;
  tingkatKesulitan: string;
}

/**
 * Memanggil Gemini API dengan Timeout 30s & Retry 1x untuk Soal Ujian.
 * Jika mati/gagal/tidak ada API key, mengembalikan Mock Soal JSON terformat tinggi secara cerdas.
 */
export const generateSoalContent = async (input: SoalGenerateInput): Promise<string> => {
  const prompt = `
Peran: Anda adalah pakar kurikulum dan evaluasi pendidikan nasional Indonesia, spesialis Kurikulum Merdeka Kemendikbudristek.
Tugas: Buat dokumen Bank Soal Ujian yang komprehensif, bermutu tinggi, dan berstandar formal tinggi dalam Bahasa Indonesia baku berdasarkan data masukan berikut:
- Mata Pelajaran: ${input.mapel}
- Kelas: ${input.kelas}
- Topik Utama: ${input.topik}
- Jumlah Pilihan Ganda (PG): ${input.jumlahPG} butir (Wajib memiliki 5 opsi A, B, C, D, E per soal)
- Jumlah Soal Esai: ${input.jumlahEssay} butir
- Tingkat Kesulitan: ${input.tingkatKesulitan} (Jika HOTS, rancang soal bertipe analisis C4-C6 Taksonomi Bloom)

Format Output Wajib: Kembalikan respons Anda HANYA berupa objek JSON mentah yang valid, tanpa format pembungkus markdown (JANGAN gunakan backticks \`\`\`json atau teks pengantar/penutup apapun).

Skema JSON Wajib:
{
  "identitas": {
    "sekolah": "SD/SMP/SMA Negeri Terpadu",
    "mapel": "${input.mapel}",
    "kelas": "${input.kelas}",
    "topik": "${input.topik}",
    "jumlahPG": ${input.jumlahPG},
    "jumlahEssay": ${input.jumlahEssay},
    "tingkatKesulitan": "${input.tingkatKesulitan}"
  },
  "petunjuk": "1. Berdoalah sebelum mengerjakan soal.\\n2. Bacalah soal dengan teliti dan pilih/tulis jawaban yang paling tepat.\\n3. Dilarang bekerja sama atau menyontek selama ujian.",
  "soalPG": [
    {
      "no": 1,
      "pertanyaan": "[Tulis pertanyaan Pilihan Ganda 1 disini]",
      "opsi": {
        "A": "[Opsi A]",
        "B": "[Opsi B]",
        "C": "[Opsi C]",
        "D": "[Opsi D]",
        "E": "[Opsi E]"
      }
    }
  ],
  "kunciPG": {
    "1": "A"
  },
  "soalEssay": [
    {
      "no": 1,
      "pertanyaan": "[Tulis pertanyaan Esai 1 disini]",
      "rubrik": "[Tulis petunjuk rubrik penilaian detail berdasarkan kriteria jawaban dan bobot skor]"
    }
  ]
}
  `;

  if (useMockFallback || !genAI) {
    console.log('[Gemini] Active mock fallback mode. Generating highly realistic Soal Ujian JSON...');
    return JSON.stringify(getMockSoalData(input), null, 2);
  }

  // Helper untuk melakukan request ke Gemini API
  const makeRequest = async () => {
    const model = genAI!.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Bersihkan pembungkus markdown ```json jika Gemini tetap mengembalikannya
    return text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
  };

  // Bungkus request dalam timeout 30s & Retry 1x
  try {
    return await runWithTimeout(makeRequest, 30000);
  } catch (error: any) {
    console.warn('[Gemini] Soal generation first attempt failed, retrying once...', error.message || error);
    try {
      return await runWithTimeout(makeRequest, 30000);
    } catch (retryError) {
      console.error('[Gemini] All Soal attempts failed/timed out, falling back to mock JSON:', retryError);
      return JSON.stringify(getMockSoalData(input), null, 2);
    }
  }
};

/**
 * Generator Soal Ujian Mock Dinamis berkualitas tinggi yang diselaraskan dengan standar Kemendikbud
 */
const getMockSoalData = (input: SoalGenerateInput) => {
  const jenjang = input.kelas.match(/^(I|II|III|IV|V|VI)$/) ? 'Sekolah Dasar (SD)' : 
                  input.kelas.match(/^(VII|VIII|IX)$/) ? 'Sekolah Menengah Pertama (SMP)' : 'Sekolah Menengah Atas (SMA)';

  // Build PG list dynamically based on input.jumlahPG
  const soalPG = [];
  const kunciPG: Record<string, string> = {};
  
  for (let i = 1; i <= input.jumlahPG; i++) {
    soalPG.push({
      no: i,
      pertanyaan: `Manakah dari pernyataan berikut yang paling tepat menggambarkan konsep dasar dari ${input.topik} dalam mata pelajaran ${input.mapel} untuk siswa ${input.kelas} pada tingkat kesulitan ${input.tingkatKesulitan}?`,
      opsi: {
        A: `Penerapan konsep ${input.topik} secara kualitatif sederhana dalam aktivitas belajar harian.`,
        B: `Penerapan struktural terstandarisasi untuk memecahkan masalah kuantitatif tingkat dasar.`,
        C: `Analisis mendalam terhadap variabel fungsional yang memicu dinamika teori ${input.topik} secara berkelanjutan.`,
        D: `Kombinasi teori klasik ${input.topik} dengan metodologi observasi kelompok secara induktif.`,
        E: `Hipotesis spekulatif yang menolak relevansi ${input.topik} dalam ranah sains terapan modern.`
      }
    });
    // Cycle keys A, B, C, D, E
    const keys = ['A', 'B', 'C', 'D', 'E'];
    kunciPG[i.toString()] = keys[(i - 1) % 5];
  }

  // Build Essay list dynamically based on input.jumlahEssay
  const soalEssay = [];
  for (let i = 1; i <= input.jumlahEssay; i++) {
    soalEssay.push({
      no: i,
      pertanyaan: `Berikan analisis komprehensif Anda tentang bagaimana konsep '${input.topik}' dapat memengaruhi dan membantu penyelesaian problem praktis sehari-hari. Jelaskan argumen Anda secara terstruktur menggunakan metodologi ilmiah yang diajarkan dalam ${input.mapel}!`,
      rubrik: `Skor Maksimal: 10 poin.\n- Skor 8-10: Siswa mampu memaparkan analisis secara logis, memberikan contoh riil yang tepat, dan menggunakan bahasa Indonesia formal secara runtut.\n- Skor 4-7: Analisis benar secara teori namun minim contoh konkret, atau bahasa kurang baku.\n- Skor 1-3: Jawaban terlalu singkat, tidak menyentuh akar teori '${input.topik}', atau tidak relevan.`
    });
  }

  return {
    identitas: {
      sekolah: `${jenjang} Negeri Terpadu Harapan Bangsa`,
      mapel: input.mapel,
      kelas: input.kelas,
      topik: input.topik,
      jumlahPG: input.jumlahPG,
      jumlahEssay: input.jumlahEssay,
      tingkatKesulitan: input.tingkatKesulitan
    },
    petunjuk: "1. Berdoalah sebelum mengerjakan soal.\n2. Bacalah soal dengan teliti dan pilih/tulis jawaban yang paling tepat pada lembar jawaban.\n3. Dilarang bekerja sama atau menyontek selama ujian berjalan.",
    soalPG,
    kunciPG,
    soalEssay
  };
};

export interface ModulAjarGenerateInput {
  mapel: string;
  kelas: string;
  topik: string;
  alokasiWaktu: string;
  modelPembelajaran: string;
  profilPelajarPancasila: string[];
}

export const generateModulAjarContent = async (input: ModulAjarGenerateInput): Promise<string> => {
  const prompt = `
Peran: Anda adalah pakar kurikulum pendidikan nasional Indonesia, khususnya spesialis Kurikulum Merdeka Kemendikbudristek.
Tugas: Buat dokumen Modul Ajar yang lengkap, detail, dan berstandar formal tinggi dalam Bahasa Indonesia baku berdasarkan data masukan berikut:
- Mata Pelajaran: ${input.mapel}
- Kelas/Fase: ${input.kelas}
- Topik Utama: ${input.topik}
- Alokasi Waktu: ${input.alokasiWaktu}
- Model Pembelajaran: ${input.modelPembelajaran}
- Profil Pelajar Pancasila: ${input.profilPelajarPancasila.join(', ')}

Format Output Wajib: Kembalikan respons Anda HANYA berupa objek JSON mentah yang valid, tanpa format pembungkus markdown.

Skema JSON Wajib:
{
  "identitas": {
    "sekolah": "SD/SMP/SMA Negeri Terpadu",
    "mapel": "${input.mapel}",
    "kelas": "${input.kelas}",
    "topik": "${input.topik}",
    "alokasiWaktu": "${input.alokasiWaktu}",
    "modelPembelajaran": "${input.modelPembelajaran}",
    "profilPelajarPancasila": ${JSON.stringify(input.profilPelajarPancasila)}
  },
  "capaianPembelajaran": "[Tulis CP lengkap sesuai Kurikulum Merdeka]",
  "tujuanPembelajaran": ["[TP 1]", "[TP 2]", "[TP 3]"],
  "pemahamanBermakna": "[Tulis pemahaman bermakna yang akan dicapai siswa]",
  "pertanyaanPemantik": ["[PP 1]", "[PP 2]"],
  "saranaPrasarana": ["[Sarana 1]", "[Sarana 2]"],
  "kegiatanPembelajaran": [
    { "tahap": "Pendahuluan", "durasi": "15 menit", "aktivitas": ["[Aktivitas 1]", "[Aktivitas 2]"] },
    { "tahap": "Inti", "durasi": "60 menit", "aktivitas": ["[Aktivitas 1]", "[Aktivitas 2]", "[Aktivitas 3]"] },
    { "tahap": "Penutup", "durasi": "15 menit", "aktivitas": ["[Aktivitas 1]", "[Aktivitas 2]"] }
  ],
  "asesmen": {
    "diagnostik": "[Penilaian diagnostik sebelum pembelajaran]",
    "formatif": "[Penilaian selama proses belajar]",
    "sumatif": "[Penilaian akhir pembelajaran]"
  },
  "remediDanPengayaan": {
    "remedi": "[Program remedial untuk siswa yang belum mencapai TP]",
    "pengayaan": "[Program pengayaan untuk siswa yang sudah mencapai TP]"
  }
}
  `;

  if (useMockFallback || !genAI) {
    console.log('[Gemini] Active mock fallback mode. Generating highly realistic Modul Ajar JSON...');
    return JSON.stringify(getMockModulAjarData(input), null, 2);
  }

  const makeRequest = async () => {
    const model = genAI!.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
  };

  try {
    return await runWithTimeout(makeRequest, 30000);
  } catch (error: any) {
    console.warn('[Gemini] ModulAjar first attempt failed, retrying once...', error.message || error);
    try {
      return await runWithTimeout(makeRequest, 30000);
    } catch (retryError) {
      console.error('[Gemini] All ModulAjar attempts failed, falling back to mock JSON:', retryError);
      return JSON.stringify(getMockModulAjarData(input), null, 2);
    }
  }
};

const getMockModulAjarData = (input: ModulAjarGenerateInput) => {
  const jenjang = input.kelas.match(/^(I|II|III|IV|V|VI)$/) ? 'Sekolah Dasar (SD)' :
                  input.kelas.match(/^(VII|VIII|IX)$/) ? 'Sekolah Menengah Pertama (SMP)' : 'Sekolah Menengah Atas (SMA)';

  return {
    identitas: {
      sekolah: `${jenjang} Negeri Terpadu Harapan Bangsa`,
      mapel: input.mapel,
      kelas: input.kelas,
      topik: input.topik,
      alokasiWaktu: input.alokasiWaktu,
      modelPembelajaran: input.modelPembelajaran,
      profilPelajarPancasila: input.profilPelajarPancasila
    },
    capaianPembelajaran: `Pada akhir fase ini, peserta didik mampu memahami, menganalisis, dan menerapkan konsep ${input.topik} dalam konteks nyata. Peserta didik dapat berkolaborasi secara produktif, berpikir kritis, dan mengomunikasikan ide-ide mereka secara efektif sesuai Capaian Pembelajaran Kurikulum Merdeka.`,
    tujuanPembelajaran: [
      `Peserta didik dapat menjelaskan konsep dasar ${input.topik} dengan benar minimal 3 poin utama.`,
      `Peserta didik mampu menganalisis keterkaitan ${input.topik} dengan permasalahan nyata di lingkungan sekitarnya.`,
      `Peserta didik dapat merancang solusi kreatif berbasis ${input.topik} secara kolaboratif menggunakan model ${input.modelPembelajaran}.`
    ],
    pemahamanBermakna: `Dengan mempelajari ${input.topik}, peserta didik memahami bahwa ilmu pengetahuan bukan hanya teori abstrak, melainkan memiliki relevansi langsung dalam kehidupan sehari-hari dan dapat menjadi alat untuk memecahkan tantangan nyata di masyarakat.`,
    pertanyaanPemantik: [
      `Pernahkah kamu menjumpai ${input.topik} dalam kehidupan sehari-hari? Di mana dan bagaimana?`,
      `Bagaimana pemahaman tentang ${input.topik} bisa membantu kamu atau orang-orang di sekitarmu?`
    ],
    saranaPrasarana: [
      'Papan tulis / proyektor LCD',
      'Lembar Kerja Peserta Didik (LKPD)',
      `Buku teks ${input.mapel} Kelas ${input.kelas}`,
      'Alat tulis dan kertas HVS',
      'Akses internet (opsional untuk penelusuran referensi)'
    ],
    kegiatanPembelajaran: [
      {
        tahap: 'Pendahuluan',
        durasi: '15 menit',
        aktivitas: [
          'Guru membuka kelas dengan salam hangat, doa bersama, dan pemeriksaan kehadiran siswa.',
          `Guru menyajikan pertanyaan pemantik: "Pernahkah kamu menjumpai ${input.topik} dalam kehidupan sehari-hari?" — siswa diberi 2 menit untuk berpikir dan berbagi jawaban singkat.`,
          `Guru menyampaikan tujuan pembelajaran hari ini dan menjelaskan alur kegiatan dengan model ${input.modelPembelajaran} secara ringkas.`
        ]
      },
      {
        tahap: 'Inti',
        durasi: '60 menit',
        aktivitas: [
          `Siswa dibagi ke dalam kelompok heterogen 4-5 orang. Guru membagikan LKPD berbasis masalah kontekstual tentang ${input.topik}.`,
          `Menggunakan model ${input.modelPembelajaran}: Fase 1 — Siswa mengeksplorasi konsep ${input.topik} secara mandiri (15 menit). Fase 2 — Diskusi kelompok untuk memecahkan studi kasus di LKPD (25 menit).`,
          'Fase 3 — Presentasi kelompok: Perwakilan masing-masing kelompok memaparkan hasil diskusi (15 menit). Guru memfasilitasi sesi tanya-jawab dan memberikan penguatan konsep kunci.',
          'Fase 4 — Guru memberikan konfirmasi konsep dan meluruskan miskonsepsi yang muncul selama diskusi (5 menit).'
        ]
      },
      {
        tahap: 'Penutup',
        durasi: '15 menit',
        aktivitas: [
          `Guru bersama siswa menarik kesimpulan komprehensif tentang ${input.topik} menggunakan metode round-robin (siswa menyebutkan 1 poin penting secara bergantian).`,
          'Guru membagikan lembar refleksi singkat: "Apa yang kamu pelajari hari ini? Apa yang masih belum kamu pahami?" Siswa mengisinya selama 3 menit.',
          'Guru memberikan apresiasi kepada kelompok terbaik, menyampaikan tugas mandiri untuk pertemuan berikutnya, dan menutup pembelajaran dengan doa serta salam.'
        ]
      }
    ],
    asesmen: {
      diagnostik: `Guru mengajukan pertanyaan lisan di awal pembelajaran untuk mengetahui pemahaman awal siswa tentang ${input.topik}. Hasil digunakan untuk penyesuaian strategi pengajaran.`,
      formatif: `Observasi keaktifan selama diskusi kelompok, penilaian kualitas LKPD, dan pantauan presentasi kelompok menggunakan rubrik sikap dan keterampilan.`,
      sumatif: `Tes tertulis akhir (5 soal pilihan ganda + 2 esai) tentang ${input.topik}, dikumpulkan pada pertemuan berikutnya. Skor minimal ketuntasan: 70.`
    },
    remediDanPengayaan: {
      remedi: `Siswa yang belum mencapai KKM (< 70) mendapat bimbingan individual dari guru dengan pendekatan tutor sebaya, diberikan soal latihan tambahan setara tingkat Remembering-Understanding (C1-C2 Bloom), dan diberi kesempatan mengulang asesmen sumatif 1 minggu setelah perbaikan.`,
      pengayaan: `Siswa yang sudah mencapai KKM (≥ 70) diberikan tantangan lanjutan: membuat mini-proyek kreatif yang menghubungkan ${input.topik} dengan isu terkini atau permasalahan lokal, kemudian dipresentasikan kepada kelas sebagai role model.`
    }
  };
};

