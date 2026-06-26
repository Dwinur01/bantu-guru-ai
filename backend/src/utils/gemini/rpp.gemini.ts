import { genAI, useMockFallback, runWithTimeout } from './client';

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
