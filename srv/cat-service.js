const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const sendEmail = require("./utils/SendEmail");
const sendSMS = require("./utils/SendSMS");
const destHelper = require("./utils/DestHelper")


module.exports = async function (req) {

  this.on('sendSMS', async (req) => {
    const { recipient, message } = req.data;
    const { data } = req;
    try {
      const response = await axios.post('https://49.50.67.32/smsapi/jsonapi.jsp', SMSData);
      return response.data; // Return response from the SMS gateway
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error('Failed to send SMS');
    }
  });

  // Event : ON
  this.on('messagingAction', async (req) => {
    const data = req.data; // Access the 'body' parameter directly from the request
  
    // Extract necessary information from the body
    const { recipients, subject, content, document_no, cc, channel, isSignRequired, values } = data;
    var oDestination;
    // Simulate destination details
        //  oDestination = {
        //      destinationName: process.env.DESTINATION_NAME,
        //      URL: process.env.DESTINATION_URL,
        //      authentication: 'BasicAuthentication',
        //      User: process.env.User,
        //      Password: process.env.Password
        //  };
    if(channel === 'E') {
      try {
        // Get destination details
        oDestination = (await destHelper.getDestination("notif-sender-destination-service", "my410378_basic_auth")).destDetails;
        console.log("dest"+JSON.stringify(oDestination));

        // Make the API call
         // Retrieve destination information
         //const destination = cds.env.destinations.find(dest => dest.name === 'pdf-sign');
         //await cds.connect.to('my410378_basic_auth');
         //const { username, password, url: destinationURL } = destination.credentials;
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
            //const destination = cds.env.destinations.find(dest => dest.name === 'pdf-sign');
            //await cds.connect.to('pdf-sign');
            //'sb-pdf-digital-sign!t11651'
            //3Sn9E8Hz7i9clmwDuqw35OSjkWQ=
            //const { clientId, clientSecret, tokenServiceUrl, url: destinationURL } = destination.credentials;

            // Obtain OAuth2 token
            //var apiaccesstoken = await getJWTToken(destinationService.destination, "/oauth/token?grant_type=client_credentials");
            ///oDestination = await getDestinationInfo(destinationService.destination.uri, apiaccesstoken, "pdf-sign");
            console.log("client API"+JSON.stringify(oDestination));
            // oDestination = JSON.stringify(oDestination);
           // console.log(JSON.stringify(oDestination).clientId+" "+JSON.stringify(oDestination).clientSecret);
            const tokenResponse = await axios.post('https://dev1-avmqthsa.authentication.jp10.hana.ondemand.com/oauth/token', qs.stringify({
              grant_type: 'client_credentials',
              client_id: 'sb-pdf-digital-sign!t11651',
              client_secret: '3Sn9E8Hz7i9clmwDuqw35OSjkWQ='
            }), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            });

            //var accessToken = tokenResponse.data.access_token;
            let destinationURL ='https://gallantt-ispat-limited-dev1-avmqthsa-dev-sp-pdf-digital2fe2a18f.cfapps.jp10.hana.ondemand.com';
            await axios.request({
                url: `${destinationURL}/signPDFinBinary`,
                method: 'POST',
                timeout: 0,
                "headers": {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${tokenResponse.data.access_token}`
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
        for (const email of recipients) {
          sendEmail.sendEmail(email, subject, content, document_no, filePath, cc);
        }
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
