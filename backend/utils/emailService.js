const nodemailer = require('nodemailer');

// Validate email credentials
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('EMAIL_USER or EMAIL_PASS not set in environment. Email functionality will be disabled.');
}

let transporter = null;
try {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
} catch (e) {
  console.error('Error creating transporter:', e);
}

const sendEmail = async (to, subject, text, html) => {
  if (!transporter) {
    console.error('Attempted to send email but transporter is not configured.');
    throw new Error('Email service not configured. Set EMAIL_USER and EMAIL_PASS in backend/.env (use app password for Gmail).');
  }

  try {
    const info = await transporter.sendMail({
      from: `"Smart Diploma" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Could not send email: ' + (error.message || 'unknown error'));
  }
};

module.exports = sendEmail;
