import { z } from 'zod';

const rppInputSchema = z.object({
  mapel: z.string({ required_error: 'Mata pelajaran wajib diisi' }),
  kelas: z.string({ required_error: 'Kelas wajib diisi' }),
  topik: z.string({ required_error: 'Topik wajib diisi' }),
  alokasiWaktu: z.string({ required_error: 'Alokasi waktu wajib diisi' }),
  modelPembelajaran: z.string({ required_error: 'Model pembelajaran wajib diisi' }),
  asesmen: z.array(z.string()).min(1, 'Pilih minimal satu jenis asesmen'),
});

const soalInputSchema = z.object({
  mapel: z.string({ required_error: 'Mata pelajaran wajib diisi' }),
  kelas: z.string({ required_error: 'Kelas wajib diisi' }),
  topik: z.string({ required_error: 'Topik wajib diisi' }),
  jumlahPG: z.number({ required_error: 'Jumlah pilihan ganda wajib diisi' }).min(0),
  jumlahEssay: z.number({ required_error: 'Jumlah esai wajib diisi' }).min(0),
  tingkatKesulitan: z.string({ required_error: 'Tingkat kesulitan wajib diisi' }),
}).refine((data) => data.jumlahPG + data.jumlahEssay > 0, {
  message: 'Total jumlah soal (PG + Esai) harus lebih dari 0',
  path: ['jumlahPG'],
});

const modulAjarInputSchema = z.object({
  mapel: z.string({ required_error: 'Mata pelajaran wajib diisi' }),
  kelas: z.string({ required_error: 'Kelas wajib diisi' }),
  topik: z.string({ required_error: 'Topik wajib diisi' }),
  alokasiWaktu: z.string({ required_error: 'Alokasi waktu wajib diisi' }),
  modelPembelajaran: z.string({ required_error: 'Model pembelajaran wajib diisi' }),
  profilPelajarPancasila: z.array(z.string()).min(1, 'Pilih minimal satu profil Pelajar Pancasila'),
});

export const generateDocumentSchema = z.object({
  type: z.enum(['rpp', 'soal', 'modul_ajar'], {
    required_error: 'Tipe dokumen wajib diisi',
    invalid_type_error: 'Tipe dokumen tidak valid',
  }),
  inputData: z.unknown({ required_error: 'Data masukan wajib diisi' }),
}).superRefine((data, ctx) => {
  if (data.type === 'rpp') {
    const res = rppInputSchema.safeParse(data.inputData);
    if (!res.success) {
      res.error.issues.forEach((issue) => {
        ctx.addIssue({
          ...issue,
          path: ['inputData', ...issue.path],
        });
      });
    }
  } else if (data.type === 'soal') {
    const res = soalInputSchema.safeParse(data.inputData);
    if (!res.success) {
      res.error.issues.forEach((issue) => {
        ctx.addIssue({
          ...issue,
          path: ['inputData', ...issue.path],
        });
      });
    }
  } else if (data.type === 'modul_ajar') {
    const res = modulAjarInputSchema.safeParse(data.inputData);
    if (!res.success) {
      res.error.issues.forEach((issue) => {
        ctx.addIssue({
          ...issue,
          path: ['inputData', ...issue.path],
        });
      });
    }
  }
});

export type GenerateDocumentInput = z.infer<typeof generateDocumentSchema>;
