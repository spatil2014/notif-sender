const axios = require('axios');
const cds = require('@sap/cds');
const configs = require("./FetchConfigs");

function replacePlaceholders(template, values) {
  let i = 0;
  return template.replace(/{#var#}/g, () => values[i++] || '');
}

async function sendSMS(req) {

  // Fetch Configuration &  template details
  let configDetails = await configs.fetchEntryByCommunicationType('Configuration', req.vendor, req.channel);
  let templateDetails = await configs.fetchEntryByDocumentType('Templates',req.vendor, req.documentType, req.channel);
  const template = templateDetails[0].content;
  const logTable = cds.entities['Log'];
  
  let msg;
  msg = req.content;
  if (!req.content) {
    msg = replacePlaceholders(template, req.placeholders);
  }
  
  let payload = {
    userid: configDetails[0].username,
    password: configDetails[0].password,
    senderid: configDetails[0].sender,
    msgType: "text",
    dltTemplateId: templateDetails[0].templateID,//"34545454541107171291502855094",
    duplicatecheck: "true",
    sendMethod: "quick",
    sms: [
      {
        mobile: req.recipients,
        msg: msg
      }
    ]
  };

  try {
    const response = await axios.post('https://smsinteract.in/SMSApi/send', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    await cds.run(INSERT.into(logTable).entries({
      vendor: req.vendor,
      msgType: req.channel,
      documentType: req.documentType,
      documentRef: req.document_no,
      messageContent: msg,
      sender: configDetails[0].sender,
      status: 'success',
      statusText: `${response.data.reason}`
    }));
    console.log('SMS sent successfully:', response.data.reason);
  } catch (error) {
    await cds.run(INSERT.into(logTable).entries({
      vendor: req.vendor,
      msgType: req.channel,
      documentType: req.documentType,
      documentRef: req.document_no,
      messageContent: msg,
      sender: configDetails[0].sender,
      status: 'Failed',
      statusText: `${error.data.reason}`
    }));
    console.error('Error sending SMS:', error);
  }
}

module.exports = { sendSMS };
