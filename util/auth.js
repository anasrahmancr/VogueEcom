require('dotenv').config()
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const serviceSid = process.env.SERVICESID;
// const accountSid = 'AC68cbca3315d9cee5bf174baa9947f368';
// const authToken = '3efd07deed57f213c02ba19363a0c9a1';
// const serviceSid = 'VA6315b4d24867582a4f1e802caca1a1c1';
const client = require('twilio')(accountSid, authToken);


module.exports = { 

    sendOtp: ((userphone) => {
        client.verify.v2.services(serviceSid)
            .verifications
            .create({to: '+91' + userphone, channel: 'sms'})
            .then(verification => console.log(verification.sid)).catch(error => {
                console.log(error.message, "this is errror");
            })
    }),
    
    checkOtp : ((userphone,otpData) => {
    return client.verify.v2.services(serviceSid)
      .verificationChecks    
      .create({to: '+91' + userphone, code: otpData})
      .then(verification_check => {
        console.log(verification_check.status);
        if(verification_check.status === 'approved'){
            return true ;
        } else{
            return false;
        }
      });
        
    })
}