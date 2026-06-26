import { 
  TableCell, 
  WidthType, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType
} from 'docx';

export interface RPPData {
  identitas: {
    sekolah: string;
    mapel: string;
    kelas: string;
    alokasiWaktu: string;
    topik: string;
    modelPembelajaran: string;
  };
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];
  alurTujuanPembelajaran: string;
  kegiatanPembelajaran: Array<{
    tahap: string;
    durasi: string;
    deskripsi: string;
  }>;
  asesmen: {
    formatif: string;
    sumatif: string;
    instrumen: string;
  };
}

export interface SoalData {
  identitas: {
    sekolah: string;
    mapel: string;
    kelas: string;
    topik: string;
    jumlahPG: number;
    jumlahEssay: number;
    tingkatKesulitan: string;
  };
  petunjuk: string;
  soalPG: Array<{
    no: number;
    pertanyaan: string;
    opsi: {
      A: string;
      B: string;
      C: string;
      D: string;
      E: string;
    };
  }>;
  kunciPG: Record<string, string>;
  soalEssay: Array<{
    no: number;
    pertanyaan: string;
    rubrik: string;
  }>;
}

export interface ModulAjarData {
  identitas: {
    sekolah: string;
    mapel: string;
    kelas: string;
    topik: string;
    alokasiWaktu: string;
    modelPembelajaran: string;
    profilPelajarPancasila: string[];
  };
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];
  pemahamanBermakna: string;
  pertanyaanPemantik: string[];
  saranaPrasarana: string[];
  kegiatanPembelajaran: Array<{
    tahap: string;
    durasi: string;
    aktivitas: string[];
  }>;
  asesmen: {
    diagnostik: string;
    formatif: string;
    sumatif: string;
  };
  remediDanPengayaan: {
    remedi: string;
    pengayaan: string;
  };
}

/**
 * Membuat Cell Identitas
 */
export const createIdentitasCell = (label: string, value: string): TableCell => {
  return new TableCell({
    width: {
      size: 50,
      type: WidthType.PERCENTAGE,
    },
    children: [
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: `${label} : `, font: 'Arial', size: 22, color: '737373' }),
          new TextRun({ text: value || '-', bold: true, font: 'Arial', size: 22, color: '1A1A2E' }),
        ],
      }),
    ],
  });
};

/**
 * Membuat Section Heading Tebal
 */
export const createSectionHeading = (title: string): Paragraph => {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 180, after: 120 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        font: 'Arial',
        size: 24, // 12pt
        color: '1F4E79', // Primary Dark
      }),
    ],
  });
};

/**
 * Membuat Cell Header Tabel Kegiatan
 */
export const createHeaderCell = (text: string, widthPercent: number): TableCell => {
  return new TableCell({
    width: {
      size: widthPercent,
      type: WidthType.PERCENTAGE,
    },
    shading: {
      fill: 'EBF3FB', // Brand Pale
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({
            text: text,
            bold: true,
            font: 'Arial',
            size: 22, // 11pt
            color: '1F4E79',
          }),
        ],
      }),
    ],
  });
};

/**
 * Membuat Cell Body Tabel Kegiatan
 */
export const createBodyCell = (text: string, isBold: boolean, widthPercent: number): TableCell => {
  return new TableCell({
    width: {
      size: widthPercent,
      type: WidthType.PERCENTAGE,
    },
    children: [
      new Paragraph({
        alignment: isBold ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { before: 120, after: 120, line: 280 },
        children: [
          new TextRun({
            text: text,
            bold: isBold,
            font: 'Arial',
            size: 22, // 11pt
            color: '1A1A2E',
          }),
        ],
      }),
    ],
  });
};
