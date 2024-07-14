const axios = require('axios');
const cds = require('@sap/cds');
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
  console.log("template" + templateDetails.value[0]);
  
  console.log("request"+req);
  const template = templateDetails.value[0].content;
  const logTable = cds.entities['Log'];
  
  let msg;
  msg = req.content;
  if (!req.content) {
    msg = replacePlaceholders(template, req.placeholders);
  }
  console.log("config" + configDetails.value[0]);
  let payload = {
    userid: configDetails.value[0].username,
    password: configDetails.value[0].password,
    senderid: configDetails.value[0].sender,
    msgType: "text",
    dltTemplateId: templateDetails.value[0].templateID,//"34545454541107171291502855094",
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
