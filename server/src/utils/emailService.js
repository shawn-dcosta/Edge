import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendInquiryNotification = async (inquiryData) => {
  const { name, email, phone, message, company } = inquiryData;

  const mailOptions = {
    from: `"Edge Productions" <${process.env.EMAIL_USER}>`,
    to: process.env.RECIPIENT_EMAIL || 'dcostashawn@gmail.com',
    subject: `New Inquiry from ${name} - Edge Productions`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #e11d48; text-transform: uppercase; letter-spacing: 2px;">New Business Inquiry</h2>
        <p style="color: #666; font-size: 14px;">You have received a new inquiry through the Edge Productions contact form.</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || 'Null'}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <p style="color: #333; line-height: 1.6; background: #fff; padding: 15px; border-radius: 5px; border-left: 4px solid #e11d48;">${message}</p>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
          This is an automated notification from the Edge Productions CMS.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Notification email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw error;
  }
};
