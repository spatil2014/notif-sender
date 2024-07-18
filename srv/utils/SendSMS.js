/**
 * sendSMS - method to trigger message via configured API
 * vendor - from request
 * channel - from request (SMS, EMAIL)
 * document type - from request
 * content - from request
 * placeholders - from request
 */

const axios = require('axios');
const configs = require("./FetchConfigs");
const captureLog = require("./UpdateLogs");

function replacePlaceholders(template, values) {
  let i = 0;
  return template.replace(/{#var#}/g, () => values[i++] || '');
}

async function sendSMS(req) {

  // Fetch Configuration &  template details
  let configDetails = await configs.fetchEntryForConfiguration(req.vendor, req.channel);
  let templateDetails = await configs.fetchEntryForTemplate(req.vendor, req.documentType, req.channel);
  const template = templateDetails.value[0].content;
  
  let msg;
  msg = req.content;
  if (!req.content) {
    msg = replacePlaceholders(template, req.placeholders);
  }
  
  /// Prepare payload based maintained data
  let payload = {
    userid: configDetails.value[0].username,
    password: configDetails.value[0].password,
    senderid: configDetails.value[0].sender,
    msgType: "text",
    dltTemplateId: templateDetails.value[0].templateID,
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
    const response = await axios.post(configDetails.value[0].apihost+'/send', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    captureLog.updateLog(req.vendor, req.channel, req.documentType, req.document_no, msg, configDetails.value[0].sender, 'success', `${response.data.reason}`);
    console.log('SMS sent successfully:', response.data.reason);
  } catch (error) {
    captureLog.updateLog(req.vendor, req.channel, req.documentType, req.document_no, msg, configDetails.value[0].sender, 'failed', `${error.message}`);
    console.error('Error sending SMS:', error);
  }
}

module.exports = { sendSMS };
