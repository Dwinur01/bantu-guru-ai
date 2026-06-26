export type DocumentType = 'rpp' | 'soal' | 'modul_ajar';

export interface DocumentItem {
  id: number;
  type: DocumentType;
  title: string;
  gcsPath: string;
  createdAt: string;
  isPublic?: boolean;
  sharedAt?: string | null;
  authorName?: string;
}

export interface RPPInput {
  mapel: string;
  kelas: string;
  topik: string;
  alokasiWaktu: string;
  modelPembelajaran: string;
  asesmen: string[];
}

export interface SoalInput {
  mapel: string;
  kelas: string;
  topik: string;
  jumlahPG: number;
  jumlahEssay: number;
  tingkatKesulitan: string;
}

export interface ModulAjarInput {
  mapel: string;
  kelas: string;
  topik: string;
  alokasiWaktu: string;
  modelPembelajaran: string;
  profilPelajarPancasila: string[];
}

export interface GenerateDocPayload {
  type: DocumentType;
  inputData: RPPInput | SoalInput | ModulAjarInput;
}
