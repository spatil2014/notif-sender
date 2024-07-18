const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const sendEmail = require("./utils/SendEmail");
const sendSMS = require("./utils/SendSMS");
const destHelper = require("./utils/DestHelper");
const destinationServiceInstanceName = "notif-sender-destination-service";


module.exports = async function (req) {

  // Event : ON
  this.on('messagingAction', async (req) => {
    const data = req.data; // Access the 'body' parameter directly from the request
  
    // Extract necessary information from the body
    const { recipients, subject, content, document_no, cc, channel, isSignRequired, values } = data;
    var oDestination;
    if(channel === 'EMAIL') {
      try {
        // Get destination details
        oDestination = (await destHelper.getDestination("notif-sender-destination-service", "my410378_basic_auth")).destDetails;
        console.log("dest"+JSON.stringify(oDestination));

        const authHeader = `Basic ${Buffer.from(`${oDestination.User}:${oDestination.Password}`).toString('base64')}`;
        const response = await axios.get(`${oDestination.URL}/sap/opu/odata/sap/API_BILLING_DOCUMENT_SRV/GetPDF?BillingDocument='${document_no}'`, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });
        let filePath = document_no+".pdf";
        let binaryData;
        binaryData = Buffer.from(response.data.d.GetPDF.BillingDocumentBinary, 'base64');
        fs.writeFileSync(filePath, binaryData, 'binary');
        if(isSignRequired) {
          // Get it signed
          try {
            // Retrieve destination information
            let destinationName = "SELF_SRV";
            let selfDest = await destHelper.getDestination(destinationServiceInstanceName, destinationName);
            await axios.request({
                url: `${selfDest.destDetails.URL}/signPDFinBinary`,
                method: 'POST',
                timeout: 0,
                "headers": {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${selfDest.authDetails[0].value}`
              },

              "data": JSON.stringify({
                  "file": response.data.d.GetPDF.BillingDocumentBinary,
                  "filename": document_no
              })
            }).then(function(oSingedData) {
              binaryData = Buffer.from(oSingedData.data, 'base64');
              fs.writeFileSync(filePath, binaryData, 'binary');
            });
    
        } catch (e) {
            throw 'Noob Error - Error while Fetching JWT Token ! '
          }
        }
        sendEmail.sendEmail(data, filePath);
        fs.unlinkSync(filePath);

      } catch (error) {
          console.error('Error:', error.message);
          req.error(500, 'Internal Server Error');
      }

    } else if(channel === 'SMS') {
      sendSMS.sendSMS(data);
    }
  });
};
