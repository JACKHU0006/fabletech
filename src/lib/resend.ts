import { Resend } from 'resend';

interface InquiryEmailData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  product?: string;
  quantity?: string;
  message: string;
}

interface NotificationEmailOptions {
  to: string | string[];
  from: string;
  subject: string;
  html: string;
}

let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY || 'dummy_key_for_build');
  }
  return resendInstance;
}

export async function sendInquiryNotification(inquiry: InquiryEmailData): Promise<void> {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; display: block; margin-bottom: 5px; }
        .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #e5e7eb; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Inquiry Received</h1>
        </div>
        <div class="content">
          <p>A new inquiry has been submitted through your website.</p>
          
          <div class="field">
            <span class="label">Timestamp (UTC):</span>
            <div class="value">${timestamp}</div>
          </div>
          
          <div class="field">
            <span class="label">Name:</span>
            <div class="value">${inquiry.name}</div>
          </div>
          
          <div class="field">
            <span class="label">Email:</span>
            <div class="value">${inquiry.email}</div>
          </div>
          
          ${inquiry.company ? `
          <div class="field">
            <span class="label">Company:</span>
            <div class="value">${inquiry.company}</div>
          </div>
          ` : ''}
          
          ${inquiry.phone ? `
          <div class="field">
            <span class="label">Phone:</span>
            <div class="value">${inquiry.phone}</div>
          </div>
          ` : ''}
          
          ${inquiry.product ? `
          <div class="field">
            <span class="label">Product of Interest:</span>
            <div class="value">${inquiry.product}</div>
          </div>
          ` : ''}
          
          ${inquiry.quantity ? `
          <div class="field">
            <span class="label">Quantity:</span>
            <div class="value">${inquiry.quantity}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <span class="label">Message:</span>
            <div class="value">${inquiry.message.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="footer">
            <p>This email was sent from FableTech website inquiry system.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'notifications@fabletech.cc.cd';
  const toEmail = process.env.RESEND_TO_EMAIL || 'info@fabletech.cc.cd';

  await sendEmail({
    to: toEmail,
    from: fromEmail,
    subject: `New Inquiry from ${inquiry.name}`,
    html,
  });
}

export async function sendEmail(options: NotificationEmailOptions): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email notification');
    return;
  }

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: options.from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Resend email error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
