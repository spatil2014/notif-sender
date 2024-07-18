/**
 * sendEmail - method to trigger email via configured API
 * recipients - from request
 * subject - from request
 * document_no - from request
 * content - from request
 * attachment - from request S4 API response
 */

const nodemailer = require('nodemailer');
const axios = require('axios');
const fs = require('fs');
const configs = require("./FetchConfigs");
const captureLog = require("./UpdateLogs");

let sendEmail = async (req, attachment) => {
    const pdfData = fs.readFileSync(attachment);
    // Fetch configuration details from Configuration table
    let configDetails = await configs.fetchEntryForConfiguration(req.vendor, req.channel);
    // SMTP Configuration
    const transporter = nodemailer.createTransport({
        host: configDetails.value[0].apihost,
        port: configDetails.value[0].port,
        secure: false, // TLS requires 'false'
        auth: {
        user: configDetails.value[0].username,
        pass: configDetails.value[0].password
        }
    });
    try {
      // Send mail with defined transport object
      for (const email of req.recipients) {
        await transporter.sendMail({
          from: configDetails.value[0].username,
          to: email,
          subject: req.subject,
          text: req.content,
          attachments: [{
            filename: req.document_no+'.pdf',
            content: pdfData
        }]
        });
      }
      console.log(`Email sent successfully to ${recipients}`);
      captureLog.updateLog(req.vendor, req.channel, req.documentType, req.document_no, req.content, configDetails.value[0].username, 'success', `${response.data.reason}`);
    } catch (error) {
      console.error(`Error sending email to ${recipients}:`, error);
      captureLog.updateLog(req.vendor, req.channel, req.documentType, req.document_no, req.content, configDetails.value[0].username, 'failed', `${response.data.reason}`);
      throw error; // Propagate error to handle it externally
    }
}

module.exports = {
    sendEmail
}