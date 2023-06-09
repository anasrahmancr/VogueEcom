require("dotenv").config();
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const serviceSid = process.env.SERVICESID;
const client = require("twilio")(accountSid, authToken);

module.exports = {
  sendOtp: (userphone) => {
    try {
      client.verify.v2
        .services(serviceSid)
        .verifications.create({ to: "+91" + userphone, channel: "sms" })
        .then((verification) => console.log(verification.sid))
        .catch((error) => {
          console.log(error.message, "this is errror");
        });
    } catch (error) {
      console.log(error.message, "error messsage in send otp");
    }
  },

  checkOtp: (userphone, otpData) => {
    try {
      return client.verify.v2.services(serviceSid)
        .verificationChecks.create({ to: "+91" + userphone, code: otpData })
        .then((verification_check) => {
          // console.log(verification_check.status);
          if (verification_check.status === "approved") {
            return true;
          } else {
            return false;
          }
        })
        .catch((error) => {
          console.log(error.message, "error in otp verify");
          // Handle the error case and return an appropriate value or throw a custom error
          throw new Error("OTP verification failed");
        });
    } catch (error) {
      console.log(error.message, "error in otp verify");
      // Handle any synchronous errors if needed
      throw error;
    }
  }
  
};
