const nodemailer = require('nodemailer');
const axios = require('axios');
const fs = require('fs');

let sendEmail = async (email, subject, content, document_no, attachment) => {
    const pdfData = fs.readFileSync(attachment);
    // SMTP Configuration
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // TLS requires 'false'
        auth: {
        user: 'noreply@nationaltmt.com',
        pass: 'no@12345'
        }
    });
    try {
      // Send mail with defined transport object
      await transporter.sendMail({
        from: 'noreply@nationaltmt.com',
        to: email,
        subject: subject,
        text: content,
        attachments: [{
          filename: document_no+'.pdf',
          content: pdfData
      }]
      });
      console.log(`Email sent successfully to ${email}`);
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
      throw error; // Propagate error to handle it externally
    }
}

module.exports = {
    sendEmail
}