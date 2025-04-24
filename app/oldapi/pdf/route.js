// app/api/pdf/generate-quote-pdf/route.js
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Helper: draw text
  const drawText = (text, x, y, size = 10, fontRef = font) => {
    page.drawText(text, { x, y, size, font: fontRef, color: rgb(0, 0, 0) });
  };

  // Helper: draw rectangle border for table cells
  const drawCellBorder = (x, y, width, height) => {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      borderWidth: 1,
      borderColor: rgb(0.7, 0.7, 0.7),
      color: rgb(1, 1, 1),
    });
  };

  // Helper: draw underline
  const drawUnderline = (x, y, width, bold = false) => {
    page.drawLine({
      start: { x, y },
      end: { x: x + width, y },
      thickness: bold ? 1.5 : 0.5,
      color: rgb(0, 0, 0),
    });
  };

  // Header text
  drawText('Company Name', 50, 790, 14, boldFont);
  drawText('123 Street Address, City, State, Zip/Post', 50, 775);
  drawText('Website, Email Address', 50, 760);
  drawText('Phone Number', 50, 745);
  drawText('QUOTE', 500, 790, 16, boldFont);

  // Embed logo
  try {
    const logoPath = path.join(process.cwd(), 'public/images/brand/logo/image.png');
    const logoImage = await readFile(logoPath);
    const logo = await pdfDoc.embedPng(logoImage);
    const pngDims = logo.scale(0.3);
    page.drawImage(logo, {
      x: 500,
      y: 720,
      width: pngDims.width,
      height: pngDims.height,
    });
  } catch (err) {
    console.error('⚠️ Logo error:', err.message);
  }

  // BILL TO & SHIP TO
  drawText('BILL TO', 50, 705, 10, boldFont);
  drawText('<Contact Name>', 50, 690);
  drawText('<Client Company Name>', 50, 675);
  drawText('<Address>', 50, 660);
  drawText('<Phone, Email>', 50, 645);

  drawText('SHIP TO', 250, 705, 10, boldFont);
  drawText('<Name / Dept>', 250, 690);
  drawText('<Client Company Name>', 250, 675);
  drawText('<Address>', 250, 660);
  drawText('<Phone>', 250, 645);

  drawText('Quote No: #INV0001', 400, 705);
  drawText('Date: 11/11/11', 400, 690);
  drawText('Valid For: 14 days', 400, 675);

  // Table setup
  const colWidths = [250, 50, 80, 100];
  const colX = [45];
  for (let i = 1; i < colWidths.length; i++) {
    colX.push(colX[i - 1] + colWidths[i - 1]);
  }

  const tableTop = 615;
  const rowHeight = 20;
  const headerTitles = ['DESCRIPTION', 'QTY', 'UNIT PRICE', 'TOTAL'];

  // Table Header
  for (let i = 0; i < colX.length; i++) {
    drawCellBorder(colX[i], tableTop - rowHeight, colWidths[i], rowHeight);
    drawText(headerTitles[i], colX[i] + 5, tableTop - 15, 10, boldFont);
  }

  // Table Rows
  let y = tableTop - rowHeight;
  for (let r = 0; r < 10; r++) {
    y -= rowHeight;
    for (let c = 0; c < colX.length; c++) {
      drawCellBorder(colX[c], y, colWidths[c], rowHeight);
    }
    drawText(`Item ${r + 1}`, colX[0] + 5, y + 5);
    drawText('1', colX[1] + 5, y + 5);
    drawText('0.00', colX[2] + 5, y + 5);
    drawText('0.00', colX[3] + 5, y + 5);
  }

  // Totals
  const totals = [
    { label: 'SUBTOTAL', value: '0.00', y: 370 },
    { label: 'DISCOUNT', value: '0.00', y: 355 },
    { label: 'SUBTOTAL LESS DISCOUNT', value: '0.00', y: 340, x: 318 },
    { label: 'TAX RATE', value: '0.00%', y: 325 },
    { label: 'TOTAL TAX', value: '0.00', y: 310 },
    { label: 'SHIPPING/HANDLING', value: '0.00', y: 295, bold: true, x: 350 },
    { label: 'Quote Total', value: '$ 0.00', y: 270, bold: true, x: 370, fontSize: 12 },
  ];

  for (const t of totals) {
    const labelX = t.x || 400;
    const valueX = 470;
    drawText(t.label, labelX, t.y, t.fontSize || 10, t.bold ? boldFont : font);
    drawText(t.value, valueX, t.y, t.fontSize || 10, t.bold ? boldFont : font);
    drawUnderline(valueX, t.y - 2, 50, t.bold);
  }

  // Footer
  drawText('Thank you for your business!', 50, 300);
  drawText('Notes & Terms', 50, 230, 10, boldFont);
  drawText('- Add payment requirements here', 50, 215);
  drawText('- Add terms here, e.g. warranty, returns policy...', 50, 200);
  drawText('- Include project timeline...', 50, 185);

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="quote.pdf"',
    },
  });
}
