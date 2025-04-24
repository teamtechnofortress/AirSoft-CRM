// Mark this route as dynamic to ensure it’s executed at request time.
export const dynamic = 'force-dynamic';

import WooCommerc from "@/helper/woocommerce";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { readFile } from 'fs/promises';
import path from 'path';


const genratepdf = async (data) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const drawText = (page, text, x, y, size = 10, fontRef = font) => {
    page.drawText(text, { x, y, size, font: fontRef, color: rgb(0, 0, 0) });
  };

  const drawCellBorder = (page, x, y, width, height) => {
    page.drawRectangle({
      x, y, width, height,
      borderWidth: 1,
      borderColor: rgb(0.7, 0.7, 0.7),
      // color: rgb(1, 1, 1),
    });
  };

  const drawUnderline = (page, x, y, width, bold = false) => {
    page.drawLine({
      start: { x, y },
      end: { x: x + width, y },
      thickness: bold ? 1.5 : 0.5,
      color: rgb(0, 0, 0),
    });
  };

  const getWrappedLines = (text, maxWidth, font, fontSize) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    for (let word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.slice(0, 3);
  };

  const colWidths = [250, 50, 80, 100];
  const colX = [45];
  for (let i = 1; i < colWidths.length; i++) {
    colX.push(colX[i - 1] + colWidths[i - 1]);
  }

  const fontSize = 10;
  const rowPaddingTop = 7;
  const rowPaddingBottom = 5;
  const rowLineHeight = 13;
  const pageHeight = 842;
  const marginBottom = 100;
  const startX = 50;

  let currentPage = pdfDoc.addPage([595, pageHeight]);
  let y = 0;

  const drawTableHeader = (page) => {
    const rowHeight = 30;
    const headerTitles = ['DESCRIPTION', 'QTY', 'UNIT PRICE', 'TOTAL'];
    for (let i = 0; i < colX.length; i++) {
      drawCellBorder(page, colX[i], y - rowHeight, colWidths[i], rowHeight);
    
      const text = headerTitles[i];
      const textWidth = boldFont.widthOfTextAtSize(text, 10);
      const colCenterX = colX[i] + (colWidths[i] / 2);
      const textX = colCenterX - (textWidth / 2);
    
      drawText(page, text, textX, y - 15, 10, boldFont);
    }
    y -= rowHeight;
  };

  const addNewPage = (withTableHeader = true) => {
    currentPage = pdfDoc.addPage([595, pageHeight]);
    y = 780;
    if (withTableHeader) drawTableHeader(currentPage);
  };
  

  const drawHeader = async (page) => {
    // Company Details
    drawText(page, 'Airsoft Wholesale UK', startX, 790, 14, boldFont);
    drawText(page, '6 Quantum Business Park, Beacon Hill Road', startX, 770);
    drawText(page, 'Fleet, Hampshire, GU52 8EA', startX, 755);
    drawText(page, 'trade@airsoftwholesaleuk.co.uk', startX, 740);
    drawText(page, '01252 615977', startX, 725);
    drawText(page, 'QUOTE', 460, 790, 16, boldFont);
    try {
      const logoPath = path.join(process.cwd(), 'public/images/brand/logo/AWUK.png');
      const logoImage = await readFile(logoPath);
      const logo = await pdfDoc.embedPng(logoImage);
      const pngDims = logo.scale(0.3);
      page.drawImage(logo, {
        x: 430,
        y: 720,
        width: 120,
        height: 60,
      });
    } catch (err) {
      console.error('⚠️ Logo error:', err.message);
    }
  
    // Add spacing gap before BILL TO section
    const sectionStartY = 695; // pushed down from previous 705
  
    // BILL TO Section
    drawText(page, 'BILL TO', startX, sectionStartY, 10, boldFont);
    drawText(page, `Name: ${data.billing?.first_name || ''} ${data.billing?.last_name || ''}`, startX, sectionStartY - 15);
    drawText(page, `Company Name: ${data.billing?.company}`, startX, sectionStartY - 30);
  
    const addressText = `Address: ${data.billing?.address_1 || ''}`;
    const addressLines = getWrappedLines(addressText, 200, font, 10);
    const addressStartY = sectionStartY - 45;
    const addressLineHeight = 13;
    addressLines.forEach((line, i) => {
      drawText(page, line, startX, addressStartY - (i * addressLineHeight), 10, font);
    });
  
    const phoneY = addressStartY - (addressLines.length * addressLineHeight) - 5;
    drawText(page, `Phone: ${data.billing?.phone}`, startX, phoneY, 10, font);
    const emailY = phoneY - addressLineHeight - 2;
    drawText(page, `Email: ${data.billing?.email}`, startX, emailY, 10, font);
  
    // SHIP TO Section - same vertical gap logic
    drawText(page, 'SHIP TO', 250, sectionStartY, 10, boldFont);
    drawText(page, `Name: ${data.shipping?.first_name || ''} ${data.shipping?.last_name || ''}`, 250, sectionStartY - 15);
    drawText(page, `Company Name: ${data.shipping?.company}`, 250, sectionStartY - 30);
  
    const shippingAddressText = `Address: ${data.shipping?.address_1 || ''}`;
    const shippingAddressLines = getWrappedLines(shippingAddressText, 200, font, 10);
    const shippingAddressStartY = sectionStartY - 45;
    const shippingLineHeight = 13;
  
    shippingAddressLines.forEach((line, i) => {
      drawText(page, line, 250, shippingAddressStartY - (i * shippingLineHeight), 10, font);
    });
  
    const shippingPhoneY = shippingAddressStartY - (shippingAddressLines.length * shippingLineHeight) - 5;
    drawText(page, `Phone: ${data.shipping?.phone}`, 250, shippingPhoneY, 10, font);
  
    // Quote Info
    drawText(page, 'Quote No:', 450, sectionStartY, 10, boldFont);
    drawText(page, `#${data.number}`, 500, sectionStartY, 10, font);
    drawText(page, 'Date:', 450, sectionStartY - 15, 10, boldFont);
  
    const date = new Date(data.date_created);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    drawText(page, formattedDate, 480, sectionStartY - 15, 10, font);
    drawText(page, 'Valid For:', 450, sectionStartY - 30, 10, boldFont);
    drawText(page, '14 days', 500, sectionStartY - 30, 10, font);
  
    return emailY - 10;
  };
  

  const tableTop = await drawHeader(currentPage) - 20;
  y = tableTop;
  drawTableHeader(currentPage);

  // Draw each line item
  for (let item of data.line_items) {
    const maxWidth = colWidths[0] - 10;
    const lines = getWrappedLines(item.name, maxWidth, font, fontSize);
    const visibleLines = lines.slice(0, 3);
    const dynamicHeight = rowPaddingTop + visibleLines.length * rowLineHeight + rowPaddingBottom;
  
    if (y - dynamicHeight < marginBottom + 150) {
      addNewPage();
    }
  
    y -= dynamicHeight;
  
    // ✅ Zebra background (even index rows)
    if (data.line_items.indexOf(item) % 2 === 0) {
      currentPage.drawRectangle({
        x: colX[0],
        y: y,
        width: colWidths.reduce((sum, w) => sum + w, 0),
        height: dynamicHeight,
        color: rgb(0.96, 0.96, 0.96), // light gray
      });
    }
  
    for (let i = 0; i < colX.length; i++) {
      drawCellBorder(currentPage, colX[i], y, colWidths[i], dynamicHeight);
    }
  
    // ✅ Properly vertically centered multi-line description block
    const totalTextBlockHeight = visibleLines.length * rowLineHeight;
    const startLineY = y + (dynamicHeight - totalTextBlockHeight) / 2 + (rowLineHeight - fontSize) / 2;
  
    visibleLines.forEach((line, i) => {
      const lineY = startLineY + (visibleLines.length - 1 - i) * rowLineHeight;
      drawText(currentPage, line, colX[0] + 5, lineY, fontSize, font);
    });
  
    const centerY = y + (dynamicHeight - fontSize) / 2;
    drawText(currentPage, String(item.quantity), colX[1] + 5, centerY, fontSize, font);
    drawText(currentPage, `${data.currency_symbol}${item.price}`, colX[2] + 5, centerY, fontSize, font);
    drawText(currentPage, `${data.currency_symbol}${item.total}`, colX[3] + 5, centerY, fontSize, font);
  }

  y -= 30;
  if (y < marginBottom + 160) {
    addNewPage(false);
  }
  

  const totals = [
    { label: 'SUBTOTAL', value: data.total, bold: false },
    { label: 'DISCOUNT', value: data.discount_total, bold: false },
    { label: 'SUBTOTAL LESS DISCOUNT', value: 0.00, bold: false },
    { label: 'TAX RATE', value: 0.00, bold: false },
    { label: 'TOTAL TAX', value: data.total_tax, bold: false },
    { label: 'SHIPPINGHANDLING', value: data.shipping_total, bold: false },
    { label: 'QUOTE TOTAL', value: data.total, bold: true },
  ];

  const totalsStartY = y;
  for (let t of totals) {
    const labelX = t.label === 'SUBTOTAL LESS DISCOUNT' ? 320 :
                   t.label === 'SHIPPINGHANDLING' ? 355 :
                   t.label === 'QUOTE TOTAL' ? 385 : 400;
    drawText(currentPage, t.label, labelX, y, 10, t.bold ? boldFont : font);
    drawText(currentPage, `${data.currency_symbol}${t.value}`, 470, y, 10, t.bold ? boldFont : font);
    drawUnderline(currentPage, 470, y - 2, 50, t.bold);
    y -= 20;
  }

  const middleY = totalsStartY - (totals.length * 20) / 2 + 10;
  drawText(currentPage, 'Thank you for your business!', startX, middleY, 10, boldFont);
  drawText(currentPage, 'Notes & Terms', startX, y - 20, 10, boldFont);
  drawText(currentPage, '- Stock is not reserved till order confirmed.', startX, y - 35);
  drawText(currentPage, '- All stock is property of Airsoft Wholesale UK till paid in Full.', startX, y - 50);
  // drawText(currentPage, '- Include project timeline...', startX, y - 65);

  return await pdfDoc.save();
};


const sendOrderEmailWithPdf = async (recipientEmail, pdfBuffer) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: '"Air-Soft" <TechnoDeveloper@gmai.com>',
      to: recipientEmail,
      subject: 'Your Invoice from Air-Soft',
      text: 'Attached is your invoice.',
      html: '<p>Thank you for your business. Please find the invoice attached.</p>',
      attachments: [
        {
          filename: 'invoice.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    console.log('✅ PDF Email sent:', info.messageId);
  } catch (err) {
    console.error('❌ Failed to send PDF email:', err.message);
  }
};


export async function POST(req) {

    const body = await req.json();
    const { status, id, set_paid } = body;

    const data = {
      status: status,
    };
    
    if (typeof set_paid !== 'undefined') {
      data.set_paid = set_paid;
    }

  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    const response = NextResponse.json({ status: "tokenerror", message: "Token Missing!" }, { status: 401 });
    response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
    return response;
  }
  
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    let requiredpermission = '67b46cce7b14d62c9c5850e9';

    if (!decoded.permissions.includes(requiredpermission)) {
        return NextResponse.json(
          { status: "unauthorized", message: "Unauthorized" },
          { status: 403, headers: { Location: "/unauthorized" } }
        );
    }
    

    // Fetch products from the WooCommerce API.
    const response = await WooCommerc.put(`orders/${id}`, data);

    console.log("Response", response.data);
    // const pdfBytes = await genratepdf(response.data);
    // return new NextResponse(pdfBytes, {
    //   headers: {
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': 'attachment; filename="invoice.pdf"', // triggers download
    //   },
    // });

    // Check if the response is valid.
    if (!response || response.status !== 200) {
      return NextResponse.json(
        { status: 'error', message: "Failed to change order status" },
        { status: 500 }
      );
    }

    if (data.set_paid === true) {

      if(response.data.billing?.email || response.data.shipping?.email) {

        console.log("Email found in response data:", response.data.billing.email);
        console.log("Email found in response data:",  response.data.shipping.email);

        const email = response.data.billing?.email || response.data.shipping?.email;
        console.log("Email found in response data:",  email);
        
        if (email) {
          const pdfBytes = await genratepdf(response.data);

          console.log("process.env.SMTP_USERNAME", process.env.SMTP_USERNAME);
          console.log("process.env.SMTP_PASSWORD", process.env.SMTP_PASSWORD);
          console.log("process.env.SMTP_HOST", process.env.SMTP_HOST);
          console.log("process.env.SMTP_PORT", process.env.SMTP_PORT);
          // Send email with PDF as attachment
          await sendOrderEmailWithPdf(email, pdfBytes);
        }
      }

      return NextResponse.json(
          { status: 'success', message: "Quote converted to order successfully" },
          { status: 200 }
      );
    }

    return NextResponse.json(
        { status: 'success', message: "order status chnage successfully" },
        { status: 200 }
    );
      
    
  } catch (error) {
    console.error("Error:", error);
    console.error('Error during:', error.message);

    if(error.name === 'TokenExpiredError'){
        const response = NextResponse.json({ status: "tokenerror", message: "Token Expired!" }, { status: 401 });
        response.headers.set('Set-Cookie', `token=; Max-Age=0; Path=/; HttpOnly`);
        return response;
    }

    return NextResponse.json(
      { status: 'error', message: "Failed to chnage order status", error: error.message },
      { status: 500 }
    );
  }
}
