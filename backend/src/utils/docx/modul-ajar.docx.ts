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
  ModulAjarData, 
  createIdentitasCell, 
  createSectionHeading, 
  createHeaderCell, 
  createBodyCell 
} from './helpers';

/**
 * Membuat berkas buffer .docx berdasarkan data Modul Ajar JSON sesuai standar Kurikulum Merdeka
 * @param data Data Modul Ajar terformat dari generator AI
 */
export const buildModulAjarDocx = async (data: ModulAjarData): Promise<Buffer> => {
  // 1. Header / KOP Modul Ajar
  const headerTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: 'MODUL AJAR',
        bold: true,
        font: 'Arial',
        size: 28,
        color: '1F4E79',
      }),
    ],
  });

  const subHeaderTitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [
      new TextRun({
        text: 'KURIKULUM MERDEKA — KEMENDIKBUDRISTEK RI',
        bold: true,
        font: 'Arial',
        size: 24,
        color: 'C84B2F',
      }),
    ],
  });

  // 2. Divider
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

  // 3. Tabel Identitas Modul Ajar
  const identitasTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
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
          createIdentitasCell('Topik / Materi', data.identitas.topik),
          createIdentitasCell('Model Pembelajaran', data.identitas.modelPembelajaran),
        ],
      }),
      new TableRow({
        children: [
          createIdentitasCell(
            'Profil Pelajar Pancasila',
            Array.isArray(data.identitas.profilPelajarPancasila)
              ? data.identitas.profilPelajarPancasila.join(', ')
              : data.identitas.profilPelajarPancasila || '-'
          ),
          createIdentitasCell('Dibuat oleh', 'GuruBantu AI — Divalidasi Guru'),
        ],
      }),
    ],
  });

  const spacingParagraph = new Paragraph({ spacing: { after: 360 } });

  // 4. Capaian Pembelajaran
  const cpHeading = createSectionHeading('A. CAPAIAN PEMBELAJARAN (CP)');
  const cpContent = new Paragraph({
    spacing: { after: 240, line: 360 },
    alignment: AlignmentType.BOTH,
    children: [
      new TextRun({ text: data.capaianPembelajaran, font: 'Arial', size: 22 }),
    ],
  });

  // 5. Tujuan Pembelajaran
  const tpHeading = createSectionHeading('B. TUJUAN PEMBELAJARAN (TP)');
  const tpParagraphs = (data.tujuanPembelajaran || []).map((tp, idx) =>
    new Paragraph({
      spacing: { after: 120, line: 280 },
      children: [
        new TextRun({ text: `  ${idx + 1}.  `, bold: true, font: 'Arial', size: 22 }),
        new TextRun({ text: tp, font: 'Arial', size: 22 }),
      ],
    })
  );
  const tpSpacing = new Paragraph({ spacing: { after: 180 } });

  // 6. Pemahaman Bermakna
  const pbHeading = createSectionHeading('C. PEMAHAMAN BERMAKNA');
  const pbContent = new Paragraph({
    spacing: { after: 240, line: 360 },
    alignment: AlignmentType.BOTH,
    children: [
      new TextRun({ text: data.pemahamanBermakna, font: 'Arial', size: 22 }),
    ],
  });

  // 7. Pertanyaan Pemantik
  const ppHeading = createSectionHeading('D. PERTANYAAN PEMANTIK');
  const ppParagraphs = (data.pertanyaanPemantik || []).map((pp, idx) =>
    new Paragraph({
      spacing: { after: 120, line: 280 },
      children: [
        new TextRun({ text: `  ${idx + 1}.  `, bold: true, font: 'Arial', size: 22 }),
        new TextRun({ text: pp, font: 'Arial', size: 22 }),
      ],
    })
  );
  const ppSpacing = new Paragraph({ spacing: { after: 180 } });

  // 8. Sarana dan Prasarana
  const spHeading = createSectionHeading('E. SARANA DAN PRASARANA');
  const spParagraphs = (data.saranaPrasarana || []).map((s, idx) =>
    new Paragraph({
      spacing: { after: 80, line: 280 },
      children: [
        new TextRun({ text: `  ${idx + 1}.  ${s}`, font: 'Arial', size: 22 }),
      ],
    })
  );
  const spSpacing = new Paragraph({ spacing: { after: 180 } });

  // 9. Kegiatan Pembelajaran - Tabel per Tahap
  const kegiatanHeading = createSectionHeading('F. KEGIATAN PEMBELAJARAN');

  // Build tabel kegiatan dengan kolom Tahap | Durasi | Aktivitas
  const kegiatanTableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        createHeaderCell('Tahap Kegiatan', 20),
        createHeaderCell('Alokasi Waktu', 15),
        createHeaderCell('Aktivitas Pembelajaran', 65),
      ],
    }),
  ];

  (data.kegiatanPembelajaran || []).forEach((kegiatan) => {
    const aktivitasText = Array.isArray(kegiatan.aktivitas)
      ? kegiatan.aktivitas.map((a, i) => `${i + 1}. ${a}`).join('\n')
      : String(kegiatan.aktivitas || '');

    kegiatanTableRows.push(
      new TableRow({
        children: [
          createBodyCell(kegiatan.tahap, true, 20),
          createBodyCell(kegiatan.durasi, false, 15),
          new TableCell({
            width: { size: 65, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 100, after: 100, line: 280 },
                children: [
                  new TextRun({ text: aktivitasText, font: 'Arial', size: 22, color: '1A1A2E' }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  });

  const kegiatanTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: kegiatanTableRows,
  });

  // 10. Asesmen
  const asesmenHeading = createSectionHeading('G. ASESMEN PEMBELAJARAN');
  const asesmenDiagnostik = new Paragraph({
    spacing: { after: 120, line: 280 },
    children: [
      new TextRun({ text: '1. Asesmen Diagnostik: ', bold: true, font: 'Arial', size: 22, color: '1F4E79' }),
      new TextRun({ text: data.asesmen?.diagnostik || '-', font: 'Arial', size: 22 }),
    ],
  });
  const asesmenFormatif = new Paragraph({
    spacing: { after: 120, line: 280 },
    children: [
      new TextRun({ text: '2. Asesmen Formatif: ', bold: true, font: 'Arial', size: 22, color: '2E75B6' }),
      new TextRun({ text: data.asesmen?.formatif || '-', font: 'Arial', size: 22 }),
    ],
  });
  const asesmenSumatif = new Paragraph({
    spacing: { after: 240, line: 280 },
    children: [
      new TextRun({ text: '3. Asesmen Sumatif: ', bold: true, font: 'Arial', size: 22, color: 'C84B2F' }),
      new TextRun({ text: data.asesmen?.sumatif || '-', font: 'Arial', size: 22 }),
    ],
  });

  // 11. Remedi dan Pengayaan
  const rpHeading = createSectionHeading('H. REMEDI DAN PENGAYAAN');
  const remediParagraph = new Paragraph({
    spacing: { after: 120, line: 280 },
    children: [
      new TextRun({ text: 'Program Remedi: ', bold: true, font: 'Arial', size: 22, color: 'C84B2F' }),
      new TextRun({ text: data.remediDanPengayaan?.remedi || '-', font: 'Arial', size: 22 }),
    ],
  });
  const pengayaanParagraph = new Paragraph({
    spacing: { after: 360, line: 280 },
    children: [
      new TextRun({ text: 'Program Pengayaan: ', bold: true, font: 'Arial', size: 22, color: '1A7A4A' }),
      new TextRun({ text: data.remediDanPengayaan?.pengayaan || '-', font: 'Arial', size: 22 }),
    ],
  });

  // 12. Tanda Tangan Guru & Kepala Sekolah
  const ttdTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
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

  // 13. Compile ke Document
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
                  new TextRun({ text: 'GuruBantu AI  ·  Modul Ajar Kurikulum Merdeka  ·  Halaman ', font: 'Arial', size: 18, color: '737373' }),
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
          pbHeading,
          pbContent,
          ppHeading,
          ...ppParagraphs,
          ppSpacing,
          spHeading,
          ...spParagraphs,
          spSpacing,
          kegiatanHeading,
          kegiatanTable,
          spacingParagraph,
          asesmenHeading,
          asesmenDiagnostik,
          asesmenFormatif,
          asesmenSumatif,
          rpHeading,
          remediParagraph,
          pengayaanParagraph,
          ttdTable,
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
};
