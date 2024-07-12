const axios = require('axios');
const cds = require('@sap/cds');
const configs = require("./FetchConfigs");

function replacePlaceholders(template, values) {
  let i = 0;
  return template.replace(/{#var#}/g, () => values[i++] || '');
}
async function sendSMS(contactNos) {
  const template = "{#var#}{#var#} bill no.{#var#}{#var#}{#var#} MT{#var#}{#var#} MT,{#var#}{#var#} MT, {#var#} {#var#} MT, {#var#}{#var#} MT,={#var#} MT {#var#} P.I.Truck- GALLANTT";
  //"AHEAD ENGINEERS bill no.GILGJ-05093 20MM-550D 34.950 MT,=34.950 MT GJ12BW6910 P.I.Truck-GALLANTT"
  
  let msg;
  msg = contactNos.content;
  if (!contactNos.content) {
    msg = replacePlaceholders(template, contactNos.placeholders);
  }
  //  let templateDetails = await configs.fetchEntryByDocumentType('Templates', 'Invoice');
  //configs.fetchEntryById('Configuration','SMS', 'GALL');
  //  let configDetails = await configs.fetchEntryByCommunicationType('Configuration', 'SMS', 'Gallant');
  //configs.fetchEntryById('Templates','Invoice Billing');
  //  const logTable = cds.entities['Log'];
  
  let payload = {
    userid: "gallantt",
    password: "Gall@2020",
    senderid: "GMLGDM",
    msgType: "text",
    dltTemplateId: "1107171291502855094",//"34545454541107171291502855094",
    duplicatecheck: "true",
    sendMethod: "quick",
    sms: [
      {
        mobile: contactNos.recipients,
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
    // await cds.run(INSERT.into(logTable).entries({
    //   messageContent: msg,
    //   sender: 'GMLGDM',
    //   status: 'success',
    //   statusText: `${response.data.reason}`
    // }));
    console.log('SMS sent successfully:', response.data.reason);
  } catch (error) {
    // await cds.run(INSERT.into(logTable).entries({
    //   messageContent: msg,
    //   sender: 'GMLGDM',
    //   status: 'failed',
    //   statusText: `Error sending SMS: ${error.message}`
    // }));
    console.error('Error sending SMS:', error);
  }
}

module.exports = { sendSMS };
