// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccessToken = require('./access_token.js');
const Util = require('../lib/util.js')

// create a schema
var clientUserSchema = new Schema({
  client_id: String,
  msisdn: Number
});
clientUserSchema.index({client_id: 1, msisdn: 1}, {unique: true});



var ClientUser = mongoose.model('ClientUser', clientUserSchema);

ClientUser.registerUserAndToken = function (msisdn, client_id, fcallback) {
    var query = {client_id: client_id, msisdn: msisdn},
    update = { client_id: client_id, msisdn: msisdn },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    ClientUser.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) {
            fcallback(err, null);
        } else {
            console.log("generatedid:" + result._id);
            var generatedToken = Util.randomStringAsBase64Url(11);
            
            var aToken = new AccessToken;
            aToken.client_user_id = result._id;
            aToken.access_token = generatedToken;
            aToken.save(function (err) {
                if (err) fcallback(err);
            });

            fcallback(null, generatedToken);
        }

        // do something with the document
    });
}

module.exports = ClientUser;