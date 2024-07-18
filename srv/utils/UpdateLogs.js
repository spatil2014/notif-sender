/**
 * updatelog - Method to capture communication action/results
 * vendor - from request
 * documentRef - from request
 * document type - from request
 * sender - from configuration table
 * status - from API result
 * placeholders - from API result
 */
const destHelper = require("./DestHelper");
const destinationServiceInstanceName = "notif-sender-destination-service"
const axios = require('axios');

async function updateLog(vendor, msgType, documentType, documentRef, messageContent, sender, status, statusText) {
    return new Promise(async (resolve, reject) => {
        let destinationName = "SELF_SRV";
        let selfDest = await destHelper.getDestination(destinationServiceInstanceName, destinationName);
        var payloadToUpdateinLog = {
            vendor, msgType, documentType, documentRef, messageContent, sender, status, statusText
        }
        //replace with empty string
        Object.keys(payloadToUpdateinLog).forEach(k => payloadToUpdateinLog[k] = payloadToUpdateinLog[k] ? payloadToUpdateinLog[k] : "");
        try{
            let response = await axios.post(`${selfDest.destDetails.URL}/msgself/log`, payloadToUpdateinLog, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${selfDest.authDetails[0].value}`
                }
            });
            resolve("Log Entry Created");
        }catch(e){
            reject(JSON.stringify(e))
        }
    });
};

module.exports = {
    updateLog
}