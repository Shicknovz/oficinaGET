const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const root = __dirname;
const markdownPath = path.join(root, 'SISTEMA_AUTOGET.md');
const pdfPath = path.join(root, 'SISTEMA_AUTOGET.pdf');

const markdown = fs.readFileSync(markdownPath, 'utf8');
const lines = markdown.split(/\r?\n/);

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 52, right: 52 },
  info: {
    Title: 'Documentação Técnica - AUTOGET',
    Author: 'GitHub Copilot',
    Subject: 'Arquitetura e lógica do sistema AUTOGET',
  },
});

doc.pipe(fs.createWriteStream(pdfPath));

const colors = {
  title: '#0F172A',
  subtitle: '#173A8A',
  text: '#1E293B',
  muted: '#475569',
  bullet: '#0F172A',
  accent: '#2563EB',
  rule: '#CBD5E1',
};

function writeTitle(text) {
  doc.moveDown(0.4);
  doc.font('Helvetica-Bold').fontSize(22).fillColor(colors.title).text(text, { align: 'left' });
  doc.moveDown(0.25);
}

function writeHeading(text) {
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(16).fillColor(colors.subtitle).text(text, { align: 'left' });
  const y = doc.y + 3;
  doc.save();
  doc.moveTo(doc.page.margins.left, y).lineTo(doc.page.width - doc.page.margins.right, y).lineWidth(1).strokeColor(colors.rule).stroke();
  doc.restore();
  doc.moveDown(0.55);
}

function writeSubheading(text) {
  doc.moveDown(0.2);
  doc.font('Helvetica-Bold').fontSize(13).fillColor(colors.title).text(text, { align: 'left' });
  doc.moveDown(0.2);
}

function writeParagraph(text) {
  if (!text.trim()) {
    doc.moveDown(0.35);
    return;
  }

  doc.font('Helvetica').fontSize(10.5).fillColor(colors.text).text(text, {
    align: 'left',
    lineGap: 2,
  });
  doc.moveDown(0.35);
}

function writeBullet(text, indent = 14) {
  const startX = doc.x;
  const startY = doc.y;
  doc.font('Helvetica-Bold').fontSize(11).fillColor(colors.bullet).text('•', startX, startY, { continued: false });
  doc.font('Helvetica').fontSize(10.5).fillColor(colors.text).text(text, startX + indent, startY, {
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right - indent,
    lineGap: 2,
  });
  doc.moveDown(0.15);
}

function writeNumbered(index, text, indent = 18) {
  const startX = doc.x;
  const startY = doc.y;
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor(colors.bullet).text(`${index}.`, startX, startY);
  doc.font('Helvetica').fontSize(10.5).fillColor(colors.text).text(text, startX + indent, startY, {
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right - indent,
    lineGap: 2,
  });
  doc.moveDown(0.15);
}

writeTitle('Documentação Técnica do Sistema AUTOGET');
doc.font('Helvetica').fontSize(10).fillColor(colors.muted).text('Gerado automaticamente a partir de docs/SISTEMA_AUTOGET.md', { align: 'left' });
doc.moveDown(0.8);

let numberedCounter = 0;
for (const rawLine of lines) {
  const line = rawLine.trimEnd();

  if (!line.trim()) {
    numberedCounter = 0;
    writeParagraph('');
    continue;
  }

  if (line.startsWith('# ')) {
    writeTitle(line.replace(/^#\s+/, ''));
    numberedCounter = 0;
    continue;
  }

  if (line.startsWith('## ')) {
    writeHeading(line.replace(/^##\s+/, ''));
    numberedCounter = 0;
    continue;
  }

  if (line.startsWith('### ')) {
    writeSubheading(line.replace(/^###\s+/, ''));
    numberedCounter = 0;
    continue;
  }

  if (/^\d+\.\s+/.test(line)) {
    numberedCounter += 1;
    writeNumbered(numberedCounter, line.replace(/^\d+\.\s+/, ''));
    continue;
  }

  if (line.startsWith('- ')) {
    writeBullet(line.slice(2));
    continue;
  }

  writeParagraph(line);
}

doc.end();
console.log(`PDF gerado em: ${pdfPath}`);
