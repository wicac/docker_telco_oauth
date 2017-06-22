// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var otpSchema = new Schema({
  client_id: {type: String, index: true},
  msisdn: Number,
  value: {type: String, index: true},
  expiration: Date
});

otpSchema.methods.generate = function(fcallback) {
    var otpCode = Math.round(Math.random() * (9999 - 1000) + 1000);
    this.value = otpCode;
    // TODO expiration count here
    this.save(function(err) {
        if (err) {
            fcallback(err, null);    
        } else {
            fcallback(null, otpCode);
        }
    });
}

otpSchema.methods.validateOtp = function(fcallback) {
    // console.log ("client_idheh=" + this.msisdn);
    OTP.findOne({client_id: this.client_id, msisdn:this.msisdn, value:this.value}, function(err, otp) {
        if (err) {
            fcallback(err, null);
        }
        else {
            
            fcallback(null, (otp == null) ? 0 : 1);
        }
    })
};

var OTP = mongoose.model('Otp', otpSchema);
module.exports = OTP;