import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  AlignmentType,
  HeadingLevel,
  Footer,
  PageNumber
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

/**
 * Membuat berkas buffer .docx berdasarkan data RPP JSON sesuai standar Kemendikbud
 * @param data Data RPP terformat dari generator AI
 */
export const buildRPPDocx = async (data: RPPData): Promise<Buffer> => {
  // 1. Buat Paragraph Header / KOP RPP
  const headerTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: 'RENCANA PELAKSANAAN PEMBELAJARAN (RPP)',
        bold: true,
        font: 'Arial',
        size: 28, // 14pt
        color: '1F4E79' // Primary Dark
      }),
    ],
  });

  const subHeaderTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [
      new TextRun({
        text: 'KURIKULUM MERDEKA NASIONAL',
        bold: true,
        font: 'Arial',
        size: 24, // 12pt
        color: 'C84B2F' // Primary Red
      }),
    ],
  });

  // 2. Buat Divider horizontal ganda
  const dividerLine = new Paragraph({
    spacing: { after: 360 },
    border: {
      bottom: {
        color: 'C8BFB0', // Rule Color
        space: 1,
        style: BorderStyle.DOUBLE,
        size: 12,
      },
    },
  });

  // 3. Section Identitas Sekolah dalam bentuk Tabel 2 Kolom tanpa border kasar
  const identitasTable = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          createIdentitasCell('Satuan Pendidikan', data.identitas.sekolah || 'SD/SMP/SMA Negeri Terpadu'),
          createIdentitasCell('Mata Pelajaran', data.identitas.mapel),
        ],
      }),
      new TableRow({
        children: [
          createIdentitasCell('Kelas / Semester', `${data.identitas.kelas} / Ganjil`),
          createIdentitasCell('Alokasi Waktu', data.identitas.alokasiWaktu),
        ],
      }),
      new TableRow({
        children: [
          createIdentitasCell('Topik Pembelajaran', data.identitas.topik),
          createIdentitasCell('Model Pembelajaran', data.identitas.modelPembelajaran),
        ],
      }),
    ],
  });

  // Space after table
  const spacingParagraph = new Paragraph({
    spacing: { after: 360 }
  });

  // 4. Komponen Inti: Capaian Pembelajaran (CP)
  const cpHeading = createSectionHeading('A. CAPAIAN PEMBELAJARAN (CP)');
  const cpContent = new Paragraph({
    spacing: { after: 240, line: 360 }, // leading-relaxed
    alignment: AlignmentType.BOTH,
    children: [
      new TextRun({
        text: data.capaianPembelajaran,
        font: 'Arial',
        size: 22, // 11pt
      }),
    ],
  });

  // 5. Komponen Inti: Tujuan Pembelajaran (TP)
  const tpHeading = createSectionHeading('B. TUJUAN PEMBELAJARAN (TP)');
  const tpParagraphs = data.tujuanPembelajaran.map((tp, idx) => {
    return new Paragraph({
      spacing: { after: 120, line: 280 },
      children: [
        new TextRun({
          text: `  ${idx + 1}.  `,
          bold: true,
          font: 'Arial',
          size: 22,
        }),
        new TextRun({
          text: tp,
          font: 'Arial',
          size: 22,
        }),
      ],
    });
  });
  // Extra space after list
  const tpSpacing = new Paragraph({ spacing: { after: 180 } });

  // 6. Komponen Inti: Alur Tujuan Pembelajaran (ATP)
  const atpHeading = createSectionHeading('C. ALUR TUJUAN PEMBELAJARAN (ATP)');
  const atpContent = new Paragraph({
    spacing: { after: 240, line: 360 },
    children: [
      new TextRun({
        text: data.alurTujuanPembelajaran,
        font: 'Arial',
        size: 22,
      }),
    ],
  });

  // 7. Komponen Inti: Tabel Kegiatan Pembelajaran (Pendahuluan, Inti, Penutup)
  const kegiatanHeading = createSectionHeading('D. KEGIATAN PEMBELAJARAN');
  
  const tableRows = [
    // Header Row
    new TableRow({
      tableHeader: true,
      children: [
        createHeaderCell('Tahap Kegiatan', 20),
        createHeaderCell('Alokasi Waktu', 20),
        createHeaderCell('Deskripsi Langkah Kegiatan', 60),
      ],
    }),
  ];

  // Map kegiatan ke row tabel
  data.kegiatanPembelajaran.forEach((kegiatan) => {
    tableRows.push(
      new TableRow({
        children: [
          createBodyCell(kegiatan.tahap, true, 20),
          createBodyCell(kegiatan.durasi, false, 20),
          createBodyCell(kegiatan.deskripsi, false, 60),
        ],
      })
    );
  });

  const kegiatanTable = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: tableRows,
  });

  // 8. Komponen Asesmen
  const asesmenHeading = createSectionHeading('E. ASESMEN PEMBELAJARAN');
  const asesmenFormative = new Paragraph({
    spacing: { after: 120, line: 280 },
    children: [
      new TextRun({ text: '1. Asesmen Formatif: ', bold: true, font: 'Arial', size: 22, color: '2E75B6' }),
      new TextRun({ text: data.asesmen.formatif, font: 'Arial', size: 22 })
    ]
  });

  const asesmenSummative = new Paragraph({
    spacing: { after: 120, line: 280 },
    children: [
      new TextRun({ text: '2. Asesmen Sumatif: ', bold: true, font: 'Arial', size: 22, color: 'C84B2F' }),
      new TextRun({ text: data.asesmen.sumatif, font: 'Arial', size: 22 })
    ]
  });

  const asesmenInstrumen = new Paragraph({
    spacing: { after: 360, line: 280 },
    children: [
      new TextRun({ text: '3. Instrumen Penilaian:\n', bold: true, font: 'Arial', size: 22 }),
      new TextRun({ text: data.asesmen.instrumen, font: 'Arial', size: 22 })
    ]
  });

  // 9. Tanda Tangan Guru & Kepala Sekolah (Placeholder)
  const ttdTable = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { after: 600 },
                children: [
                  new TextRun({ text: 'Mengetahui,\nKepala Sekolah', font: 'Arial', size: 22 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: '_______________________\nNIP. 19800101 200501 1 001', font: 'Arial', size: 22 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { after: 600 },
                children: [
                  new TextRun({ text: 'Jakarta, 1 Juni 2026\nGuru Mata Pelajaran', font: 'Arial', size: 22 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: '_______________________\nNIP. -', font: 'Arial', size: 22 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // 10. Bungkus semua komponen ke dalam Dokumen
  const doc = new Document({
    sections: [
      {
        properties: {},
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'GuruBantu AI  ·  Halaman ', font: 'Arial', size: 18, color: '737373' }),
                  new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: '737373' }),
                  new TextRun({ text: ' dari ', font: 'Arial', size: 18, color: '737373' }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 18, color: '737373' }),
                ],
              }),
            ],
          }),
        },
        children: [
          headerTitle,
          subHeaderTitle,
          dividerLine,
          identitasTable,
          spacingParagraph,
          cpHeading,
          cpContent,
          tpHeading,
          ...tpParagraphs,
          tpSpacing,
          atpHeading,
          atpContent,
          kegiatanHeading,
          kegiatanTable,
          spacingParagraph,
          asesmenHeading,
          asesmenFormative,
          asesmenSummative,
          asesmenInstrumen,
          ttdTable,
        ],
      },
    ],
  });

  // 11. Compile Packer ke bentuk Buffer binary
  return await Packer.toBuffer(doc);
};

/**
 * Membuat Cell Identitas
 */
const createIdentitasCell = (label: string, value: string): TableCell => {
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
const createSectionHeading = (title: string): Paragraph => {
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
const createHeaderCell = (text: string, widthPercent: number): TableCell => {
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
const createBodyCell = (text: string, isBold: boolean, widthPercent: number): TableCell => {
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

/**
 * Membuat berkas buffer .docx berdasarkan data Soal Ujian JSON sesuai standar Kemendikbud
 * @param data Data Soal Ujian terformat dari generator AI
 */
export const buildSoalDocx = async (data: SoalData): Promise<Buffer> => {
  // 1. Paragraph Header / KOP Soal Ujian
  const headerTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: 'SOAL EVALUASI AKHIR KOMPETENSI GURU',
        bold: true,
        font: 'Arial',
        size: 28, // 14pt
        color: '1F4E79'
      }),
    ],
  });

  const subHeaderTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [
      new TextRun({
        text: `STANDAR EVALUASI ${data.identitas.tingkatKesulitan.toUpperCase()}`,
        bold: true,
        font: 'Arial',
        size: 24, // 12pt
        color: 'C84B2F'
      }),
    ],
  });

  // 2. Divider horizontal ganda
  const dividerLine = new Paragraph({
    spacing: { after: 360 },
    border: {
      bottom: {
        color: 'C8BFB0',
        space: 1,
        style: BorderStyle.DOUBLE,
        size: 12,
      },
    },
  });

  // 3. Section Identitas Sekolah dalam bentuk Tabel
  const identitasTable = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          createIdentitasCell('Satuan Pendidikan', data.identitas.sekolah || 'SD/SMP/SMA Negeri Terpadu'),
          createIdentitasCell('Mata Pelajaran', data.identitas.mapel),
        ],
      }),
      new TableRow({
        children: [
          createIdentitasCell('Kelas / Semester', `${data.identitas.kelas} / Ganjil`),
          createIdentitasCell('Topik Soal', data.identitas.topik),
        ],
      }),
      new TableRow({
        children: [
          createIdentitasCell('Tingkat Kesulitan', data.identitas.tingkatKesulitan),
          createIdentitasCell('Jumlah Butir Soal', `${data.identitas.jumlahPG} PG / ${data.identitas.jumlahEssay} Esai`),
        ],
      }),
    ],
  });

  const spacingParagraph = new Paragraph({
    spacing: { after: 360 }
  });

  // 4. Box Petunjuk Umum Pengerjaan (Premium Callout)
  const petunjukHeading = createSectionHeading('PETUNJUK UMUM PENGERJAAN');
  const petunjukContent = new Paragraph({
    spacing: { after: 360, line: 280 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 24, color: '2E75B6', space: 10 }
    },
    shading: {
      fill: 'FAF7F2'
    },
    children: [
      new TextRun({
        text: `\n${data.petunjuk}\n`,
        font: 'Arial',
        size: 20, // 10pt
        italics: true,
      }),
    ],
  });

  // 5. Bagian I: Soal Pilihan Ganda (PG)
  const pgHeading = createSectionHeading('BAGIAN I : PILIHAN GANDA (PG)');
  const pgChildren: Paragraph[] = [];

  data.soalPG.forEach((soal) => {
    // Pertanyaan
    pgChildren.push(
      new Paragraph({
        spacing: { before: 180, after: 120, line: 280 },
        alignment: AlignmentType.BOTH,
        children: [
          new TextRun({ text: `${soal.no}.  `, bold: true, font: 'Arial', size: 22 }),
          new TextRun({ text: soal.pertanyaan, font: 'Arial', size: 22 }),
        ],
      })
    );

    // Opsi A-E
    const opsiKeys: Array<'A' | 'B' | 'C' | 'D' | 'E'> = ['A', 'B', 'C', 'D', 'E'];
    opsiKeys.forEach((key) => {
      pgChildren.push(
        new Paragraph({
          spacing: { after: 80 },
          indent: { left: 450 }, // Tabbed indent
          children: [
            new TextRun({ text: `${key}.  `, bold: true, font: 'Arial', size: 22, color: '2E75B6' }),
            new TextRun({ text: soal.opsi[key], font: 'Arial', size: 22 }),
          ],
        })
      );
    });
  });

  // Extra Space
  const pgSpacing = new Paragraph({ spacing: { after: 360 } });

  // 6. Bagian II: Soal Esai (Essay)
  const essayHeading = createSectionHeading('BAGIAN II : SOAL ESAI (ESSAY)');
  const essayChildren: Paragraph[] = [];

  data.soalEssay.forEach((soal) => {
    // Pertanyaan Essay
    essayChildren.push(
      new Paragraph({
        spacing: { before: 180, after: 120, line: 280 },
        alignment: AlignmentType.BOTH,
        children: [
          new TextRun({ text: `${soal.no}.  `, bold: true, font: 'Arial', size: 22 }),
          new TextRun({ text: soal.pertanyaan, font: 'Arial', size: 22 }),
        ],
      })
    );
  });

  // 7. HALAMAN BARU: Kunci Jawaban & Rubrik Penilaian (Page Break)
  const kunciHeading = new Paragraph({
    pageBreakBefore: true, // Memaksa lompatan halaman baru (Page Break)
    spacing: { before: 360, after: 240 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: 'LEMBAR KUNCI JAWABAN & PEDOMAN PENILAIAN GURU',
        bold: true,
        font: 'Arial',
        size: 26,
        color: '1F4E79'
      }),
    ],
  });

  const kunciSub = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 360 },
    children: [
      new TextRun({
        text: '(Halaman ini khusus dipegang oleh Guru - Jangan dibagikan ke siswa)',
        italics: true,
        font: 'Arial',
        size: 20,
        color: '737373'
      }),
    ],
  });

  // Tabel Kunci PG 2 Kolom Rapi
  const tableRowsKunci = [
    new TableRow({
      tableHeader: true,
      children: [
        createHeaderCell('Nomor Soal PG', 50),
        createHeaderCell('Kunci Jawaban Tepat', 50),
      ],
    }),
  ];

  Object.entries(data.kunciPG).forEach(([no, kunci]) => {
    tableRowsKunci.push(
      new TableRow({
        children: [
          createBodyCell(`Nomor ${no}`, true, 50),
          createBodyCell(kunci, true, 50),
        ],
      })
    );
  });

  const kunciTable = new Table({
    width: { size: 60, type: WidthType.PERCENTAGE }, // Lebih ramping di tengah
    alignment: AlignmentType.CENTER,
    rows: tableRowsKunci,
  });

  // Rubrik Penilaian Esai detail
  const rubrikHeading = createSectionHeading('PEDOMAN RUBRIK EVALUASI ESAI');
  const rubrikChildren: Paragraph[] = [];

  data.soalEssay.forEach((soal) => {
    rubrikChildren.push(
      new Paragraph({
        spacing: { before: 180, after: 80 },
        children: [
          new TextRun({ text: `Rubrik Soal Esai ${soal.no}:`, bold: true, font: 'Arial', size: 22, color: 'C84B2F' }),
        ],
      })
    );

    rubrikChildren.push(
      new Paragraph({
        spacing: { after: 180, line: 280 },
        indent: { left: 360 },
        shading: { fill: 'FAF7F2' },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: 'C8BFB0', space: 6 } },
        children: [
          new TextRun({ text: soal.rubrik, font: 'Arial', size: 20, italics: true }),
        ],
      })
    );
  });

  // Tanda Tangan Guru
  const ttdTable = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { after: 600 },
                children: [
                  new TextRun({ text: 'Mengetahui,\nKepala Sekolah', font: 'Arial', size: 22 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: '_______________________\nNIP. 19800101 200501 1 001', font: 'Arial', size: 22 }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { after: 600 },
                children: [
                  new TextRun({ text: 'Jakarta, 1 Juni 2026\nGuru Evaluator', font: 'Arial', size: 22 }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: '_______________________\nNIP. -', font: 'Arial', size: 22 }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // 8. Compile ke Document
  const doc = new Document({
    sections: [
      {
        properties: {},
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'GuruBantu AI  ·  Lembar Soal Terstandardisasi  ·  Halaman ', font: 'Arial', size: 18, color: '737373' }),
                  new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: '737373' }),
                  new TextRun({ text: ' dari ', font: 'Arial', size: 18, color: '737373' }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 18, color: '737373' }),
                ],
              }),
            ],
          }),
        },
        children: [
          headerTitle,
          subHeaderTitle,
          dividerLine,
          identitasTable,
          spacingParagraph,
          petunjukHeading,
          petunjukContent,
          pgHeading,
          ...pgChildren,
          pgSpacing,
          essayHeading,
          ...essayChildren,
          kunciHeading,
          kunciSub,
          kunciTable,
          spacingParagraph,
          rubrikHeading,
          ...rubrikChildren,
          spacingParagraph,
          ttdTable,
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
};
