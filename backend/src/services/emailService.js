// Попробуем разные способы импорта nodemailer
let nodemailer;
try {
    nodemailer = require('nodemailer');
    console.log('📦 Nodemailer loaded:', typeof nodemailer);

    // Если nodemailer это объект с default
    if (nodemailer.default) {
        nodemailer = nodemailer.default;
    }

    // Проверка что createTransporter существует
    if (typeof nodemailer.createTransport !== 'function') {
        throw new Error('createTransport is not a function');
    }
} catch (error) {
    console.error('❌ Failed to load nodemailer:', error.message);
    console.log('⚠️ Email service will be disabled');
}

class EmailService {
    constructor() {
        this.transporter = null;
        this.enabled = false;

        if (nodemailer) {
            this.initializeTransporter();
        } else {
            console.warn('⚠️ Nodemailer not available - email service disabled');
        }
    }

    initializeTransporter() {
        try {
            if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
                console.warn('⚠️ Gmail credentials not found in .env - email service disabled');
                return;
            }

            console.log('🔧 Initializing Gmail transporter...');
            console.log('   User:', process.env.GMAIL_USER);
            console.log('   Password length:', process.env.GMAIL_APP_PASSWORD?.length);

            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD
                }
            });

            this.enabled = true;
            console.log('✅ Gmail transporter initialized for:', process.env.GMAIL_USER);

            // Проверка подключения
            this.transporter.verify((error, success) => {
                if (error) {
                    console.error('❌ Gmail verification failed:', error.message);
                    this.enabled = false;
                } else {
                    console.log('✅ Gmail server is ready to send emails');
                }
            });

        } catch (error) {
            console.error('❌ Failed to initialize email transporter:', error.message);
            this.enabled = false;
        }
    }

    async sendEmail({ to, subject, html, text }) {
        if (!this.enabled || !this.transporter) {
            const errorMsg = 'Email service not configured. Check GMAIL_USER and GMAIL_APP_PASSWORD in .env';
            console.error('❌', errorMsg);
            throw new Error(errorMsg);
        }

        try {
            const mailOptions = {
                from: `CRM System <${process.env.GMAIL_USER}>`,
                to,
                subject,
                html: html || text,
                text: text || this.htmlToText(html)
            };

            console.log('📨 Attempting to send email...');
            console.log('   To:', to);
            console.log('   Subject:', subject);

            const result = await this.transporter.sendMail(mailOptions);

            console.log('✅ Email sent successfully!');
            console.log('   Message ID:', result.messageId);

            return {
                success: true,
                messageId: result.messageId,
                response: result.response
            };
        } catch (error) {
            console.error('❌ Email sending failed:', error.message);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    htmlToText(html) {
        if (!html) return '';
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    async sendWelcomeEmail(client) {
        const subject = `Welcome to Our CRM System, ${client.name}!`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1976d2; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #1976d2; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Our CRM System!</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${client.name}</strong>,</p>
            <p>Thank you for joining our CRM system. We're excited to help you manage your business relationships more effectively.</p>
            
            <div class="info-box">
              <h3>Your Account Details:</h3>
              <p><strong>Name:</strong> ${client.name}</p>
              <p><strong>Email:</strong> ${client.email}</p>
              <p><strong>Company:</strong> ${client.company || 'Not specified'}</p>
              <p><strong>Status:</strong> ${client.status}</p>
            </div>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br><strong>CRM Team</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CRM System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

        return this.sendEmail({
            to: client.email,
            subject,
            html
        });
    }

    async sendDealNotification(client, deal) {
        const subject = `New Deal: ${deal.title}`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2e7d32; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .deal-box { background: white; padding: 20px; margin: 15px 0; border: 2px solid #2e7d32; border-radius: 5px; }
          .deal-value { font-size: 24px; color: #2e7d32; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 New Deal Created</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${client.name}</strong>,</p>
            <p>A new deal has been created in our system:</p>
            
            <div class="deal-box">
              <h2>${deal.title}</h2>
              <p class="deal-value">$${deal.value.toLocaleString()}</p>
              <p><strong>Stage:</strong> ${deal.stage}</p>
              <p><strong>Expected Close:</strong> ${new Date(deal.expectedCloseDate).toLocaleDateString()}</p>
            </div>
            
            <p>We'll keep you updated on the progress.</p>
            <p>Best regards,<br><strong>CRM Team</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CRM System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

        return this.sendEmail({
            to: client.email,
            subject,
            html
        });
    }

    async testConnection() {
        if (!this.enabled || !this.transporter) {
            return {
                connected: false,
                error: 'Email service not configured. Check GMAIL_USER and GMAIL_APP_PASSWORD in .env'
            };
        }

        try {
            console.log('🔍 Testing email connection...');
            await this.transporter.verify();

            console.log('✅ Email connection successful!');
            return {
                connected: true,
                user: process.env.GMAIL_USER
            };
        } catch (error) {
            console.error('❌ Email connection test failed:', error.message);
            return {
                connected: false,
                error: error.message
            };
        }
    }
}

module.exports = new EmailService();
