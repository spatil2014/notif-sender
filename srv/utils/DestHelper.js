const xsenv = require("@sap/xsenv");
const axios = require("axios");
async function getJWTToken(oDestInstance, oAuthTokenUrlSuffix) {
    const sUAAUrl = oDestInstance.url + oAuthTokenUrlSuffix;
    const sUAACredentials = "Basic " + Buffer.from(oDestInstance.clientid + ":" + oDestInstance.clientsecret).toString('base64');
    try {
        var oAuthResp = await axios.request({
            url: sUAAUrl,
            method: 'POST',
            headers: {
                'Authorization': sUAACredentials
            }
        });
        return oAuthResp.data.access_token;

    } catch (e) {
        throw "Noob Error - Error while Fetching JWT Token ! "
    }
}
 //Get Destination Information
async function getDestinationInfo(sDestinationUrl, sAccessToken, sDestinationName) {
    try {
        let oResponse = await axios.request({
            url: `${sDestinationUrl}/destination-configuration/v1/destinations/${sDestinationName}`,
            method: "GET",
            headers: {
                'Authorization': "Bearer " + sAccessToken
            }
        });

        return oResponse.data; // has both oAuthTokens & Destination details 
    } catch (e) {
        // throw "Intermediate Error - Cannot fetch Destination Information with Destination Name : "+ sDestinationName         
        throw e;
    }
}
async function getDestination(destinationServiceInstanceName, destinationName) {
    if(destinationServiceInstanceName && destinationName){
        xsenv.loadEnv();
        const oDestinationService = xsenv.getServices({ destination: { name: destinationServiceInstanceName } });
        var sAccessToken = await getJWTToken(oDestinationService.destination, "/oauth/token?grant_type=client_credentials");
        let oDestination = await getDestinationInfo(oDestinationService.destination.uri, sAccessToken, destinationName);
        return {
            "authDetails" : oDestination.authTokens ? oDestination.authTokens : "" , // [{value:<Bearer Token>}]
            "destDetails" : oDestination.destinationConfiguration
        };
    }else{
        return {
            "authDetails" : "" ,
            "destDetails" : ""
        };
    }

}

module.exports = {
    getDestination: getDestination
}