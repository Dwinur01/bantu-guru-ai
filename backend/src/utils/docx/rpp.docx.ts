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
  Footer,
  PageNumber
} from 'docx';
import { 
  RPPData, 
  createIdentitasCell, 
  createSectionHeading, 
  createHeaderCell, 
  createBodyCell 
} from './helpers';

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
