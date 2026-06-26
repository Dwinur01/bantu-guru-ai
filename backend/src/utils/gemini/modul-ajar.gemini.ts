import { genAI, useMockFallback, runWithTimeout } from './client';

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
