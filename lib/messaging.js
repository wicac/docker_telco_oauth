var crypto = require('crypto');

module.exports = {
    // TODO ditambahin fungsi validasi MSISDN juga harusnya
  sendSms: function (msisdn, message, fcallback) {
    
    var client = require('twilio')(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
    );

    client.messages.create({
    from: "+17085014251 ",
    to: msisdn,
    body: message
    }, function(err, message) {
        if(err) {
            console.error(err.message);
            fcallback(err);
        } else {
            fcallback(null);
        }
    });
  }
}