import type { APIRoute } from 'astro';
import { google } from 'googleapis';
import { sanitizeHtml, validateEmail, validatePhone, truncateAndSanitize } from '../../utils/security';

// Lazy load resend to avoid build-time errors
let sendInquiryNotification: any = null;
async function getSendInquiryNotification() {
  if (!sendInquiryNotification) {
    const module = await import('../../lib/resend');
    sendInquiryNotification = module.sendInquiryNotification;
  }
  return sendInquiryNotification;
}

interface InquiryData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  product?: string;
  quantity?: string;
  message: string;
}

const sheets = google.sheets('v4');

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: InquiryData = await request.json();

    const requiredFields = ['name', 'email', 'message'];
    for (const field of requiredFields) {
      if (!data[field as keyof InquiryData]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    if (!validateEmail(data.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (data.phone && !validatePhone(data.phone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedData = {
      name: truncateAndSanitize(data.name, 100),
      email: truncateAndSanitize(data.email, 255),
      company: data.company ? truncateAndSanitize(data.company, 200) : '',
      phone: data.phone ? truncateAndSanitize(data.phone, 50) : '',
      product: data.product ? truncateAndSanitize(data.product, 100) : '',
      quantity: data.quantity ? truncateAndSanitize(data.quantity, 50) : '',
      message: truncateAndSanitize(data.message, 2000),
    };

    const credentials = JSON.parse(
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'
    );

    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    await auth.authorize();

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Leads!A:I';
    const timestamp = new Date().toISOString();

    const values = [
      [
        timestamp,
        sanitizedData.name,
        sanitizedData.email,
        sanitizedData.company,
        sanitizedData.phone,
        sanitizedData.product,
        sanitizedData.quantity,
        sanitizedData.message,
        'New Lead',
      ],
    ];

    const result = await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    try {
      const sendNotification = await getSendInquiryNotification();
      await sendNotification(sanitizedData);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Inquiry submitted successfully',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Google Sheets Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to submit inquiry',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
