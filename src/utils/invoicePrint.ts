import dayjs from 'dayjs';

// Convert number to English words for BDT currency
export function numberToWords(num: number): string {
  if (num === 0) return 'Zero';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

  const convertThreeDigits = (n: number): string => {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + ' ';
    }
    return str.trim();
  };

  let words = '';
  let scaleIndex = 0;

  let tempNum = Math.floor(num);
  while (tempNum > 0) {
    const chunk = tempNum % 1000;
    if (chunk > 0) {
      const chunkStr = convertThreeDigits(chunk);
      words = chunkStr + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + ' ' + words;
    }
    tempNum = Math.floor(tempNum / 1000);
    scaleIndex++;
  }

  return words.trim();
}

export const printHTML = async (htmlContent: string, filename: string = 'invoice') => {
  if (typeof window === 'undefined') return;

  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    // On mobile, native printing the iframe often prints the parent page instead.
    // We open it in a new window/tab to show a clean HTML version of the invoice.
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    } else {
      window.location.href = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
    }
    return;
  }

  // Use native browser print/save-as-pdf engine for desktop
  // This is 100x faster than html2pdf, creates text-searchable PDFs, and prevents browser freezing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (doc) {
    // Inject a script to set the document title to the filename, so "Save as PDF" uses the correct default filename
    const processedHtml = htmlContent.replace(
      '<head>',
      `<head><title>${filename}</title>`
    );
    
    doc.write(processedHtml);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  }
};

// Generate standard booking invoice
export const printBookingInvoice = (booking: any) => {
  const invoiceNo = `INV-RS-${dayjs(booking.createdAt).format('YYYY')}-${booking.id}`;
  const invoiceDate = dayjs(booking.createdAt).format('MMMM D, YYYY');

  // Check payment status
  const isPaid = booking.payment_status?.toLowerCase() === 'paid' || booking.status === 'completed';
  const badgeText = isPaid ? 'PAID' : 'DUE';
  const badgeColor = isPaid ? '#10b981' : '#ff6014';
  const badgeBorder = isPaid ? 'rgba(16,185,129,0.2)' : 'rgba(255,96,20,0.2)';

  // Calculate prices
  const totalPayable = parseFloat(booking.total_price || booking.subtotal || 0);
  const paidAmount = isPaid ? totalPayable : 0;
  const dueAmount = totalPayable - paidAmount;
  const amountInWords = numberToWords(totalPayable);

  // Extract items
  const actualSubServices = booking.subServices?.filter((ss: any) => {
    if (booking.sub_service_items && booking.sub_service_items.length > 0) {
      const qty = booking.sub_service_items.find((entry: any) => entry.sub_service_id === ss.id)?.quantity;
      return qty && qty > 0;
    }
    return true;
  }) || [];

  let tableRowsHTML = '';
  if (actualSubServices.length > 0) {
    actualSubServices.forEach((ss: any) => {
      const qty = booking.sub_service_items?.find((entry: any) => entry.sub_service_id === ss.id)?.quantity || 1;
      const rate = parseFloat(ss.price || 0);
      const amount = rate * qty;
      tableRowsHTML += `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 14px 16px; font-size: 13px; font-weight: 600; color: #1e293b;">
            ${ss.name}
            ${ss.description ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; font-weight: normal;">${ss.description}</p>` : ''}
          </td>
          <td style="padding: 14px 16px; font-size: 13px; font-weight: 600; color: #475569; text-align: center;">${qty}</td>
          <td style="padding: 14px 16px; font-size: 13px; font-weight: 600; color: #475569; text-align: right;">${rate.toLocaleString()}.00</td>
          <td style="padding: 14px 16px; font-size: 13px; font-weight: 700; color: #0f172a; text-align: right;">${amount.toLocaleString()}.00</td>
        </tr>
      `;
    });
  } else {
    const serviceName = booking.service?.name || booking.pkg?.name || booking.nestedService?.name || 'Home Service';
    const qty = booking.quantity || 1;
    const rate = totalPayable / qty;
    tableRowsHTML += `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 14px 16px; font-size: 13px; font-weight: 600; color: #1e293b;">
          ${serviceName}
        </td>
        <td style="padding: 14px 16px; font-size: 13px; font-weight: 600; color: #475569; text-align: center;">${qty}</td>
        <td style="padding: 14px 16px; font-size: 13px; font-weight: 600; color: #475569; text-align: right;">${rate.toLocaleString()}.00</td>
        <td style="padding: 14px 16px; font-size: 13px; font-weight: 700; color: #0f172a; text-align: right;">${totalPayable.toLocaleString()}.00</td>
      </tr>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - ${invoiceNo}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            color: #334155;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            min-height: 1120px;
            padding: 40px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
          }
          .logo-container {
            display: flex;
            flex-direction: column;
          }
          .logo-title {
            font-size: 28px;
            font-weight: 900;
            color: #ff6014;
            letter-spacing: -0.5px;
            margin: 0;
            display: flex;
            align-items: center;
          }
          .logo-subtitle {
            font-size: 10px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 2px 0 0 0;
          }
          .info-box {
            background: linear-gradient(135deg, #ff6014 0%, #e0530a 100%);
            color: #ffffff;
            padding: 18px 24px;
            border-radius: 12px;
            font-size: 11px;
            line-height: 1.6;
            max-width: 280px;
            position: relative;
            box-shadow: 0 4px 12px rgba(255,96,20,0.2);
          }
          .info-box p {
            margin: 3px 0;
            font-weight: 500;
          }
          .info-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 6px 0;
          }
          .info-row.align-start {
            align-items: flex-start;
          }
          .info-row svg {
            width: 13px;
            height: 13px;
            color: rgba(255, 255, 255, 0.85);
            flex-shrink: 0;
            display: inline-block;
            vertical-align: middle;
          }
          .info-row.align-start svg {
            margin-top: 3px;
          }
          .stamp {
            position: absolute;
            top: -15px;
            right: -15px;
            background-color: #ffffff;
            color: ${badgeColor};
            border: 3px solid ${badgeColor};
            border-radius: 6px;
            padding: 4px 12px;
            font-size: 16px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            transform: rotate(8deg);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
          .invoice-title {
            text-align: center;
            margin-bottom: 30px;
          }
          .invoice-title h2 {
            font-size: 26px;
            font-weight: 900;
            color: #0f172a;
            margin: 0;
            letter-spacing: 1.5px;
            text-transform: uppercase;
          }
          .invoice-meta {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 10px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
          }
          .invoice-meta span {
            font-weight: 800;
            color: #0f172a;
          }
          .bill-to {
            background-color: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 16px;
            padding: 20px 24px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
          }
          .bill-to-col {
            flex: 1;
          }
          .bill-to-col.phone {
            flex: 0 0 140px;
            padding-left: 15px;
          }
          .bill-to-col.address {
            flex: 1.2;
            padding-left: 15px;
          }
          .bill-to-label {
            font-size: 10px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 6px;
          }
          .bill-to-value {
            font-size: 13px;
            font-weight: 700;
            color: #1e293b;
            line-height: 1.5;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .details-table th {
            background-color: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
            padding: 12px 16px;
            font-size: 11px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .summary-section {
            border-top: 1px solid #cbd5e1;
            padding-top: 20px;
            margin-bottom: 40px;
          }
          .summary-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 12px;
            font-weight: 600;
            color: #2563eb;
          }
          .summary-row span {
            font-weight: 700;
            color: #334155;
          }
          .summary-row.due {
            color: #ff6014;
          }
          .summary-row.due span {
            color: #ff6014;
            font-weight: 800;
          }
          .summary-bullet {
            color: #2563eb;
            margin-right: 8px;
            font-size: 14px;
          }
          .summary-row.due .summary-bullet {
            color: #ff6014;
          }
          .words {
            font-size: 12px;
            font-weight: 600;
            color: #475569;
            margin-top: 15px;
          }
          .words span {
            font-weight: 700;
            color: #1e293b;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 50px;
            margin-bottom: 20px;
          }
          .signature-col {
            font-size: 13px;
          }
          .sig-line {
            font-family: 'Georgia', serif;
            font-style: italic;
            font-size: 20px;
            color: #0f172a;
            margin-bottom: 4px;
            font-weight: 600;
          }
          .sig-name {
            font-weight: 800;
            color: #0f172a;
            margin: 0;
          }
          .sig-title {
            font-size: 11px;
            font-weight: 600;
            color: #64748b;
            margin: 2px 0 0 0;
          }
          .footer-pattern {
            width: 100%;
            height: 50px;
            margin-top: auto;
            overflow: hidden;
            border-radius: 0 0 12px 12px;
          }
          @media print {
            body {
              padding: 0;
            }
            .container {
              padding: 20px;
              min-height: 95vh;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div>
            <!-- Header -->
            <div class="header">
              <div class="logo-container">
                <img src="/rajshiblogo.png" alt="Rajseba Logo" style="height: 52px; width: auto; object-fit: contain;" />
              </div>
              <div class="info-box">
                <div class="stamp">${badgeText}</div>
                <div class="info-row">
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.806-5.122-4.11-6.928-6.928l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"></path>
                  </svg>
                  <span>+91 1788775100</span>
                </div>
                <div class="info-row">
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
                  </svg>
                  <span>info@rajseba.in</span>
                </div>
                <div class="info-row align-start">
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path>
                  </svg>
                  <span>Kaikhali, Kolkata, West Bengal 700052, India</span>
                </div>
              </div>
            </div>

            <!-- Title -->
            <div class="invoice-title">
              <h2>Invoice</h2>
              <div class="invoice-meta">
                <div>Date: <span>${invoiceDate}</span></div>
                <div>Invoice #: <span>${invoiceNo}</span></div>
                <div>Booking ID: <span>#${booking.id}</span></div>
              </div>
            </div>

            <!-- Bill To -->
            <div class="bill-to">
              <div class="bill-to-col">
                <div class="bill-to-label">Bill To:</div>
                <div class="bill-to-value">${booking.user?.name || booking.name || 'Guest Client'}</div>
              </div>
              <div class="bill-to-col phone">
                <div class="bill-to-label">Phone:</div>
                <div class="bill-to-value">${booking.user?.phone || booking.phone || '—'}</div>
              </div>
              <div class="bill-to-col address">
                <div class="bill-to-label">Address:</div>
                <div class="bill-to-value">${booking.location || '—'}</div>
              </div>
            </div>

            <!-- Service Details -->
            <p style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Service Details:</p>
            <table class="details-table">
              <thead>
                <tr>
                  <th style="text-align: left; width: 50%;">Description of Service</th>
                  <th style="text-align: center; width: 10%;">Qty</th>
                  <th style="text-align: right; width: 20%;">Rate (BDT)</th>
                  <th style="text-align: right; width: 20%;">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody>
                ${tableRowsHTML}
              </tbody>
            </table>

            <!-- Payment Summary -->
            <div class="summary-section">
              <p style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Payment Summary:</p>
              
              <div class="summary-row">
                <span class="summary-bullet">●</span>
                <div style="flex: 1;">Total Payable Amount: <span style="font-weight: 800; color: #0f172a;">${totalPayable.toLocaleString()}.00 BDT</span></div>
              </div>
              
              <div class="summary-row">
                <span class="summary-bullet">●</span>
                <div style="flex: 1;">Paid Amount: <span style="font-weight: 800; color: #0f172a;">${paidAmount.toLocaleString()}.00 BDT</span></div>
              </div>
              
              <div class="summary-row due">
                <span class="summary-bullet">●</span>
                <div style="flex: 1;">Due Amount: <span>${dueAmount.toLocaleString()}.00 BDT</span></div>
              </div>
              
              <div class="words">
                <span class="summary-bullet">●</span>
                In Words: <span>${amountInWords} BDT Only</span>
              </div>
            </div>
          </div>

          <!-- Signature & Footer -->
          <div>
            <div class="signature-section">
              <div>
                <!-- Spacer for layout -->
              </div>
              <div class="signature-col">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #475569; font-weight: 500;">Sincerely,</p>
                <div class="sig-line">Arif</div>
                <p class="sig-name">Ariful Islam Arif</p>
                <p class="sig-title">CEO, Rajseba</p>
              </div>
            </div>

            <!-- Footer Pattern -->
            <div class="footer-pattern">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" style="width: 100%; height: 50px; display: block;">
                <polygon points="0,100 120,60 240,100 360,50 480,100 600,55 720,100 840,40 960,100 1080,60 1200,100 1320,50 1440,100" fill="#FF6222" opacity="0.4" />
                <polygon points="80,100 180,75 300,100 420,65 540,100 660,70 780,100 900,60 1020,100 1140,70 1260,100 1380,65 1440,100" fill="#FF6222" />
              </svg>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  printHTML(html, invoiceNo);
};

// Generate single withdrawal transaction receipt/invoice
export const printWithdrawInvoice = (withdraw: any) => {
  const transactionNo = `TXN-RS-${dayjs(withdraw.createdAt).format('YYYY')}-${withdraw.id}`;
  const transactionDate = dayjs(withdraw.createdAt).format('MMMM D, YYYY');

  const statusMap: Record<string, string> = {
    pending: 'PENDING',
    approved: 'PAID',
    rejected: 'CANCELLED'
  };
  const status = withdraw.status?.toLowerCase() || 'pending';
  const badgeText = statusMap[status] || status.toUpperCase();
  const badgeColor = status === 'approved' ? '#10b981' : status === 'rejected' ? '#ef4444' : '#ff6014';

  const amount = parseFloat(withdraw.amount || 0);
  const amountInWords = numberToWords(amount);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Payout Receipt - ${transactionNo}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            color: #334155;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            min-height: 1120px;
            padding: 40px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
          }
          .logo-container {
            display: flex;
            flex-direction: column;
          }
          .logo-title {
            font-size: 28px;
            font-weight: 900;
            color: #ff6014;
            letter-spacing: -0.5px;
            margin: 0;
            display: flex;
            align-items: center;
          }
          .logo-subtitle {
            font-size: 10px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 2px 0 0 0;
          }
          .info-box {
            background: linear-gradient(135deg, #ff6014 0%, #e0530a 100%);
            color: #ffffff;
            padding: 18px 24px;
            border-radius: 12px;
            font-size: 11px;
            line-height: 1.6;
            max-width: 280px;
            position: relative;
            box-shadow: 0 4px 12px rgba(255,96,20,0.2);
          }
          .info-box p {
            margin: 3px 0;
            font-weight: 500;
          }
          .info-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 6px 0;
          }
          .info-row.align-start {
            align-items: flex-start;
          }
          .info-row svg {
            width: 13px;
            height: 13px;
            color: rgba(255, 255, 255, 0.85);
            flex-shrink: 0;
            display: inline-block;
            vertical-align: middle;
          }
          .info-row.align-start svg {
            margin-top: 3px;
          }
          .stamp {
            position: absolute;
            top: -15px;
            right: -15px;
            background-color: #ffffff;
            color: ${badgeColor};
            border: 3px solid ${badgeColor};
            border-radius: 6px;
            padding: 4px 12px;
            font-size: 16px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            transform: rotate(8deg);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
          .invoice-title {
            text-align: center;
            margin-bottom: 30px;
          }
          .invoice-title h2 {
            font-size: 26px;
            font-weight: 900;
            color: #0f172a;
            margin: 0;
            letter-spacing: 1.5px;
            text-transform: uppercase;
          }
          .invoice-meta {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 10px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
          }
          .invoice-meta span {
            font-weight: 800;
            color: #0f172a;
          }
          .bill-to {
            background-color: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 16px;
            padding: 20px 24px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
          }
          .bill-to-col {
            flex: 1;
          }
          .bill-to-label {
            font-size: 10px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 6px;
          }
          .bill-to-value {
            font-size: 13px;
            font-weight: 700;
            color: #1e293b;
            line-height: 1.5;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .details-table th {
            background-color: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
            padding: 12px 16px;
            font-size: 11px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .summary-section {
            border-top: 1px solid #cbd5e1;
            padding-top: 20px;
            margin-bottom: 40px;
          }
          .summary-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 12px;
            font-weight: 600;
            color: #2563eb;
          }
          .summary-row span {
            font-weight: 700;
            color: #334155;
          }
          .summary-bullet {
            color: #2563eb;
            margin-right: 8px;
            font-size: 14px;
          }
          .words {
            font-size: 12px;
            font-weight: 600;
            color: #475569;
            margin-top: 15px;
          }
          .words span {
            font-weight: 700;
            color: #1e293b;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 50px;
            margin-bottom: 20px;
          }
          .signature-col {
            font-size: 13px;
          }
          .sig-line {
            font-family: 'Georgia', serif;
            font-style: italic;
            font-size: 20px;
            color: #0f172a;
            margin-bottom: 4px;
            font-weight: 600;
          }
          .sig-name {
            font-weight: 800;
            color: #0f172a;
            margin: 0;
          }
          .sig-title {
            font-size: 11px;
            font-weight: 600;
            color: #64748b;
            margin: 2px 0 0 0;
          }
          .footer-pattern {
            width: 100%;
            height: 50px;
            margin-top: auto;
            overflow: hidden;
            border-radius: 0 0 12px 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div>
            <!-- Header -->
            <div class="header">
              <div class="logo-container">
                <img src="/rajshiblogo.png" alt="Rajseba Logo" style="height: 52px; width: auto; object-fit: contain;" />
              </div>
              <div class="info-box">
                <div class="stamp">${badgeText}</div>
                <div class="info-row">
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.806-5.122-4.11-6.928-6.928l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"></path>
                  </svg>
                  <span>+91 1788775100</span>
                </div>
                <div class="info-row">
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
                  </svg>
                  <span>info@rajseba.in</span>
                </div>
                <div class="info-row align-start">
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path>
                  </svg>
                  <span>Kaikhali, Kolkata, West Bengal 700052, India</span>
                </div>
              </div>
            </div>

            <!-- Title -->
            <div class="invoice-title">
              <h2>Payout Slip</h2>
              <div class="invoice-meta">
                <div>Date: <span>${transactionDate}</span></div>
                <div>Receipt #: <span>${transactionNo}</span></div>
              </div>
            </div>

            <!-- Bill To (Recipient Vendor/Agent) -->
            <div class="bill-to">
              <div class="bill-to-col">
                <div class="bill-to-label">Paid To (Vendor/Agent):</div>
                <div class="bill-to-value">${withdraw.vendor?.name || 'Partner Vendor'}</div>
              </div>
              <div class="bill-to-col">
                <div class="bill-to-label">Email:</div>
                <div class="bill-to-value">${withdraw.vendor?.email || '—'}</div>
              </div>
              <div class="bill-to-col">
                <div class="bill-to-label">Role:</div>
                <div class="bill-to-value" style="text-transform: capitalize;">${withdraw.vendor?.role || 'Vendor'}</div>
              </div>
            </div>

            <!-- Transaction Details -->
            <p style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Transaction Details:</p>
            <table class="details-table">
              <thead>
                <tr>
                  <th style="text-align: left; width: 45%;">Description</th>
                  <th style="text-align: center; width: 15%;">Reference</th>
                  <th style="text-align: center; width: 20%;">Gateway</th>
                  <th style="text-align: right; width: 20%;">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 14px 16px; font-size: 13px; font-weight: 600; color: #1e293b;">
                    Wallet Withdrawal payout
                    ${withdraw.admin_note ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; font-weight: normal;">Note: ${withdraw.admin_note}</p>` : ''}
                  </td>
                  <td style="padding: 14px 16px; font-size: 13px; font-weight: 600; color: #475569; text-align: center;">
                    ${withdraw.booking?.id ? `Booking #${withdraw.booking.id}` : `Withdrawal #${withdraw.id}`}
                  </td>
                  <td style="padding: 14px 16px; font-size: 13px; font-weight: 600; color: #475569; text-align: center; text-transform: uppercase;">
                    ${withdraw.getway?.getway_type || 'Wallet Transfer'}
                  </td>
                  <td style="padding: 14px 16px; font-size: 13px; font-weight: 700; color: #0f172a; text-align: right;">${amount.toLocaleString()}.00</td>
                </tr>
              </tbody>
            </table>

            <!-- Payment Summary -->
            <div class="summary-section">
              <p style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Summary:</p>
              
              <div class="summary-row">
                <span class="summary-bullet">●</span>
                <div style="flex: 1;">Total Payout Amount: <span style="font-weight: 800; color: #0f172a;">${amount.toLocaleString()}.00 BDT</span></div>
              </div>
              
              <div class="words">
                <span class="summary-bullet">●</span>
                In Words: <span>${amountInWords} BDT Only</span>
              </div>
            </div>
          </div>

          <!-- Signature & Footer -->
          <div>
            <div class="signature-section">
              <div>
                <!-- Spacer for layout -->
              </div>
              <div class="signature-col">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #475569; font-weight: 500;">Sincerely,</p>
                <div class="sig-line">Arif</div>
                <p class="sig-name">Ariful Islam Arif</p>
                <p class="sig-title">CEO, Rajseba</p>
              </div>
            </div>

            <!-- Footer Pattern -->
            <div class="footer-pattern">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" style="width: 100%; height: 50px; display: block;">
                <polygon points="0,100 120,60 240,100 360,50 480,100 600,55 720,100 840,40 960,100 1080,60 1200,100 1320,50 1440,100" fill="#FF6222" opacity="0.4" />
                <polygon points="80,100 180,75 300,100 420,65 540,100 660,70 780,100 900,60 1020,100 1140,70 1260,100 1380,65 1440,100" fill="#FF6222" />
              </svg>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  printHTML(html, transactionNo);
};

// Generate summary report / invoice for ALL withdrawal transactions combined
export const printAllWithdrawsInvoice = (withdraws: any[], totalAmount: number) => {
  const statementNo = `STMT-RS-${dayjs().format('YYYY-MMDD')}-${Math.floor(Math.random() * 900 + 100)}`;
  const statementDate = dayjs().format('MMMM D, YYYY');
  const amountInWords = numberToWords(totalAmount);

  let tableRowsHTML = '';
  withdraws.forEach((w) => {
    const amt = parseFloat(w.amount || 0);
    const date = dayjs(w.createdAt).format('DD MMM YYYY');
    const statusMap: Record<string, string> = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected'
    };
    tableRowsHTML += `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #1e293b;">
          Withdraw #${w.id}
          ${w.admin_note ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; font-weight: normal;">Note: ${w.admin_note}</p>` : ''}
        </td>
        <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #475569; text-align: center;">${date}</td>
        <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #475569; text-align: center; text-transform: uppercase;">
          ${w.getway?.getway_type || 'Wallet transfer'}
        </td>
        <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #475569; text-align: center;">
          ${statusMap[w.status?.toLowerCase()] || w.status}
        </td>
        <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0f172a; text-align: right;">${amt.toLocaleString()}.00</td>
      </tr>
    `;
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Payout Statement - ${statementNo}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            color: #334155;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            min-height: 1120px;
            padding: 40px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header {
            display: flex;
            justify-between: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            justify-content: space-between;
          }
          .logo-container {
            display: flex;
            flex-direction: column;
          }
          .logo-title {
            font-size: 28px;
            font-weight: 900;
            color: #ff6014;
            letter-spacing: -0.5px;
            margin: 0;
            display: flex;
            align-items: center;
          }
          .logo-subtitle {
            font-size: 10px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 2px 0 0 0;
          }
          .info-box {
            background: linear-gradient(135deg, #ff6014 0%, #e0530a 100%);
            color: #ffffff;
            padding: 18px 24px;
            border-radius: 12px;
            font-size: 11px;
            line-height: 1.6;
            max-width: 280px;
            position: relative;
            box-shadow: 0 4px 12px rgba(255,96,20,0.2);
          }
          .info-box p {
            margin: 3px 0;
            font-weight: 500;
          }
          .info-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 6px 0;
          }
          .info-row.align-start {
            align-items: flex-start;
          }
          .info-row svg {
            width: 13px;
            height: 13px;
            color: rgba(255, 255, 255, 0.85);
            flex-shrink: 0;
            display: inline-block;
            vertical-align: middle;
          }
          .info-row.align-start svg {
            margin-top: 3px;
          }
          .stamp {
            position: absolute;
            top: -15px;
            right: -15px;
            background-color: #ffffff;
            color: #10b981;
            border: 3px solid #10b981;
            border-radius: 6px;
            padding: 4px 12px;
            font-size: 16px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            transform: rotate(8deg);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
          .invoice-title {
            text-align: center;
            margin-bottom: 30px;
          }
          .invoice-title h2 {
            font-size: 26px;
            font-weight: 900;
            color: #0f172a;
            margin: 0;
            letter-spacing: 1.5px;
            text-transform: uppercase;
          }
          .invoice-meta {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 10px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
          }
          .invoice-meta span {
            font-weight: 800;
            color: #0f172a;
          }
          .bill-to {
            background-color: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 16px;
            padding: 20px 24px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
          }
          .bill-to-col {
            flex: 1;
          }
          .bill-to-label {
            font-size: 10px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 6px;
          }
          .bill-to-value {
            font-size: 13px;
            font-weight: 700;
            color: #1e293b;
            line-height: 1.5;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .details-table th {
            background-color: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
            padding: 12px 16px;
            font-size: 11px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .summary-section {
            border-top: 1px solid #cbd5e1;
            padding-top: 20px;
            margin-bottom: 40px;
          }
          .summary-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 12px;
            font-weight: 600;
            color: #2563eb;
          }
          .summary-row span {
            font-weight: 700;
            color: #334155;
          }
          .summary-bullet {
            color: #2563eb;
            margin-right: 8px;
            font-size: 14px;
          }
          .words {
            font-size: 12px;
            font-weight: 600;
            color: #475569;
            margin-top: 15px;
          }
          .words span {
            font-weight: 700;
            color: #1e293b;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 50px;
            margin-bottom: 20px;
          }
          .signature-col {
            font-size: 13px;
          }
          .sig-line {
            font-family: 'Georgia', serif;
            font-style: italic;
            font-size: 20px;
            color: #0f172a;
            margin-bottom: 4px;
            font-weight: 600;
          }
          .sig-name {
            font-weight: 800;
            color: #0f172a;
            margin: 0;
          }
          .sig-title {
            font-size: 11px;
            font-weight: 600;
            color: #64748b;
            margin: 2px 0 0 0;
          }
          .footer-pattern {
            width: 100%;
            height: 50px;
            margin-top: auto;
            overflow: hidden;
            border-radius: 0 0 12px 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div>
            <!-- Header -->
            <div class="header">
              <div class="logo-container">
                <img src="/rajshiblogo.png" alt="Rajseba Logo" style="height: 52px; width: auto; object-fit: contain;" />
              </div>
              <div class="info-box">
                <div class="stamp">REPORT</div>
                <div class="info-row">
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.806-5.122-4.11-6.928-6.928l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"></path>
                  </svg>
                  <span>+91 1788775100</span>
                </div>
                <div class="info-row">
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
                  </svg>
                  <span>info@rajseba.in</span>
                </div>
                <div class="info-row align-start">
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path>
                  </svg>
                  <span>Kaikhali, Kolkata, West Bengal 700052, India</span>
                </div>
              </div>
            </div>

            <!-- Title -->
            <div class="invoice-title">
              <h2>Payout Statement</h2>
              <div class="invoice-meta">
                <div>Generated: <span>${statementDate}</span></div>
                <div>Statement ID: <span>${statementNo}</span></div>
              </div>
            </div>

            <!-- Bill To -->
            <div class="bill-to">
              <div class="bill-to-col">
                <div class="bill-to-label">Partner details:</div>
                <div class="bill-to-value">${withdraws[0]?.vendor?.name || 'Multiple Vendors'}</div>
              </div>
              <div class="bill-to-col">
                <div class="bill-to-label">Total Transactions:</div>
                <div class="bill-to-value">${withdraws.length} Payouts</div>
              </div>
              <div class="bill-to-col">
                <div class="bill-to-label">Type:</div>
                <div class="bill-to-value">Wallet Ledger</div>
              </div>
            </div>

            <!-- Transaction Details Table -->
            <p style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Transaction History:</p>
            <table class="details-table">
              <thead>
                <tr>
                  <th style="text-align: left; width: 35%;">Transaction ID</th>
                  <th style="text-align: center; width: 15%;">Date</th>
                  <th style="text-align: center; width: 20%;">Gateway</th>
                  <th style="text-align: center; width: 15%;">Status</th>
                  <th style="text-align: right; width: 15%;">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody>
                ${tableRowsHTML}
              </tbody>
            </table>

            <!-- Payment Summary -->
            <div class="summary-section">
              <p style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Summary:</p>
              
              <div class="summary-row">
                <span class="summary-bullet">●</span>
                <div style="flex: 1;">Total Disbursed Amount: <span style="font-weight: 800; color: #0f172a;">${totalAmount.toLocaleString()}.00 BDT</span></div>
              </div>
              
              <div class="words">
                <span class="summary-bullet">●</span>
                In Words: <span>${amountInWords} BDT Only</span>
              </div>
            </div>
          </div>

          <!-- Signature & Footer -->
          <div>
            <div class="signature-section">
              <div>
                <!-- Spacer for layout -->
              </div>
              <div class="signature-col">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #475569; font-weight: 500;">Sincerely,</p>
                <div class="sig-line">Arif</div>
                <p class="sig-name">Ariful Islam Arif</p>
                <p class="sig-title">CEO, Rajseba</p>
              </div>
            </div>

            <!-- Footer Pattern -->
            <div class="footer-pattern">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" style="width: 100%; height: 50px; display: block;">
                <polygon points="0,100 120,60 240,100 360,50 480,100 600,55 720,100 840,40 960,100 1080,60 1200,100 1320,50 1440,100" fill="#FF6222" opacity="0.4" />
                <polygon points="80,100 180,75 300,100 420,65 540,100 660,70 780,100 900,60 1020,100 1140,70 1260,100 1380,65 1440,100" fill="#FF6222" />
              </svg>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  printHTML(html, statementNo);
};

// Generate summary statement report for ALL completed bookings for a client
export const printClientStatement = (bookings: any[], totalAmount: number) => {
  const statementNo = `STMT-CL-${dayjs().format('YYYY-MMDD')}-${Math.floor(Math.random() * 900 + 100)}`;
  const statementDate = dayjs().format('MMMM D, YYYY');
  const amountInWords = numberToWords(totalAmount);

  let tableRowsHTML = '';
  bookings.forEach((b) => {
    const amt = parseFloat(b.total_price || 0);
    const date = dayjs(b.createdAt).format('DD MMM YYYY');
    const serviceName = b.nestedService?.name || b.pkg?.name || b.service?.name || 'Service Booking';
    tableRowsHTML += `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #1e293b;">
          Order #${b.id} - ${serviceName}
          ${b.location ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; font-weight: normal;">Location: ${b.location}</p>` : ''}
        </td>
        <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #475569; text-align: center;">${date}</td>
        <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #475569; text-align: center;">
          ${b.payment_status || 'Paid'}
        </td>
        <td style="padding: 12px 16px; font-size: 13px; font-weight: 700; color: #0f172a; text-align: right;">${amt.toLocaleString()}.00</td>
      </tr>
    `;
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Account Statement - ${statementNo}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            color: #334155;
            background-color: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            min-height: 1120px;
            padding: 40px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
          }
          .logo-container {
            display: flex;
            flex-direction: column;
          }
          .logo-title {
            font-size: 28px;
            font-weight: 900;
            color: #ff6014;
            letter-spacing: -0.5px;
            margin: 0;
            display: flex;
            align-items: center;
          }
          .logo-subtitle {
            font-size: 10px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 2px 0 0 0;
          }
          .info-box {
            background: linear-gradient(135deg, #ff6014 0%, #e0530a 100%);
            color: #ffffff;
            padding: 18px 24px;
            border-radius: 12px;
            font-size: 11px;
            line-height: 1.6;
            max-width: 280px;
            position: relative;
            box-shadow: 0 4px 12px rgba(255,96,20,0.2);
          }
          .info-box p {
            margin: 3px 0;
            font-weight: 500;
          }
          .info-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 6px 0;
          }
          .info-row.align-start {
            align-items: flex-start;
          }
          .info-row svg {
            width: 13px;
            height: 13px;
            color: rgba(255, 255, 255, 0.85);
            flex-shrink: 0;
            display: inline-block;
            vertical-align: middle;
          }
          .info-row.align-start svg {
            margin-top: 3px;
          }
          .stamp {
            position: absolute;
            top: -15px;
            right: -15px;
            background-color: #ffffff;
            color: #10b981;
            border: 3px solid #10b981;
            border-radius: 6px;
            padding: 4px 12px;
            font-size: 16px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            transform: rotate(8deg);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
          .invoice-title {
            text-align: center;
            margin-bottom: 30px;
          }
          .invoice-title h2 {
            font-size: 26px;
            font-weight: 900;
            color: #0f172a;
            margin: 0;
            letter-spacing: 1.5px;
            text-transform: uppercase;
          }
          .invoice-meta {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 10px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
          }
          .invoice-meta span {
            font-weight: 800;
            color: #0f172a;
          }
          .bill-to {
            background-color: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 16px;
            padding: 20px 24px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
          }
          .bill-to-col {
            flex: 1;
          }
          .bill-to-label {
            font-size: 10px;
            font-weight: 800;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 6px;
          }
          .bill-to-value {
            font-size: 13px;
            font-weight: 700;
            color: #1e293b;
            line-height: 1.5;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .details-table th {
            background-color: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
            padding: 12px 16px;
            font-size: 11px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .summary-section {
            border-top: 1px solid #cbd5e1;
            padding-top: 20px;
            margin-bottom: 40px;
          }
          .summary-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 12px;
            font-weight: 600;
            color: #2563eb;
          }
          .summary-row span {
            font-weight: 700;
            color: #334155;
          }
          .summary-bullet {
            color: #2563eb;
            margin-right: 8px;
            font-size: 14px;
          }
          .words {
            font-size: 12px;
            font-weight: 600;
            color: #475569;
            margin-top: 15px;
          }
          .words span {
            font-weight: 700;
            color: #1e293b;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 50px;
            margin-bottom: 20px;
          }
          .signature-col {
            font-size: 13px;
          }
          .sig-line {
            font-family: 'Georgia', serif;
            font-style: italic;
            font-size: 20px;
            color: #0f172a;
            margin-bottom: 4px;
            font-weight: 600;
          }
          .sig-name {
            font-weight: 800;
            color: #0f172a;
            margin: 0;
          }
          .sig-title {
            font-size: 11px;
            font-weight: 600;
            color: #64748b;
            margin: 2px 0 0 0;
          }
          .footer-pattern {
            width: 100%;
            height: 50px;
            margin-top: auto;
            overflow: hidden;
            border-radius: 0 0 12px 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div>
            <!-- Header -->
            <div class="header">
              <div class="logo-container">
                <img src="/rajshiblogo.png" alt="Rajseba Logo" style="height: 52px; width: auto; object-fit: contain;" />
              </div>
              <div class="info-box">
                <div class="stamp">STATEMENT</div>
                <div class="info-row">
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.806-5.122-4.11-6.928-6.928l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"></path>
                  </svg>
                  <span>+91 1788775100</span>
                </div>
                <div class="info-row">
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path>
                  </svg>
                  <span>info@rajseba.in</span>
                </div>
                <div class="info-row align-start">
                  <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path>
                  </svg>
                  <span>Kaikhali, Kolkata, West Bengal 700052, India</span>
                </div>
              </div>
            </div>

            <!-- Title -->
            <div class="invoice-title">
              <h2>Account Statement</h2>
              <div class="invoice-meta">
                <div>Generated: <span>${statementDate}</span></div>
                <div>Statement ID: <span>${statementNo}</span></div>
              </div>
            </div>

            <!-- Bill To -->
            <div class="bill-to">
              <div class="bill-to-col">
                <div class="bill-to-label">Client Name:</div>
                <div class="bill-to-value">${bookings[0]?.user?.name || bookings[0]?.name || 'Valued Client'}</div>
              </div>
              <div class="bill-to-col">
                <div class="bill-to-label">Total Transactions:</div>
                <div class="bill-to-value">${bookings.length} Bookings</div>
              </div>
              <div class="bill-to-col">
                <div class="bill-to-label">Type:</div>
                <div class="bill-to-value">Expense Ledger</div>
              </div>
            </div>

            <!-- Transaction Details Table -->
            <p style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Transaction History:</p>
            <table class="details-table">
              <thead>
                <tr>
                  <th style="text-align: left; width: 45%;">Service Details</th>
                  <th style="text-align: center; width: 15%;">Date</th>
                  <th style="text-align: center; width: 20%;">Status</th>
                  <th style="text-align: right; width: 20%;">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody>
                ${tableRowsHTML}
              </tbody>
            </table>

            <!-- Payment Summary -->
            <div class="summary-section">
              <p style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Summary:</p>
              
              <div class="summary-row">
                <span class="summary-bullet">●</span>
                <div style="flex: 1;">Total Spent Amount: <span style="font-weight: 800; color: #0f172a;">${totalAmount.toLocaleString()}.00 BDT</span></div>
              </div>
              
              <div class="words">
                <span class="summary-bullet">●</span>
                In Words: <span>${amountInWords} BDT Only</span>
              </div>
            </div>
          </div>

          <!-- Signature & Footer -->
          <div>
            <div class="signature-section">
              <div>
                <!-- Spacer for layout -->
              </div>
              <div class="signature-col">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #475569; font-weight: 500;">Sincerely,</p>
                <div class="sig-line">Arif</div>
                <p class="sig-name">Ariful Islam Arif</p>
                <p class="sig-title">CEO, Rajseba</p>
              </div>
            </div>

            <!-- Footer Pattern -->
            <div class="footer-pattern">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" style="width: 100%; height: 50px; display: block;">
                <polygon points="0,100 120,60 240,100 360,50 480,100 600,55 720,100 840,40 960,100 1080,60 1200,100 1320,50 1440,100" fill="#FF6222" opacity="0.4" />
                <polygon points="80,100 180,75 300,100 420,65 540,100 660,70 780,100 900,60 1020,100 1140,70 1260,100 1380,65 1440,100" fill="#FF6222" />
              </svg>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  printHTML(html, statementNo);
};