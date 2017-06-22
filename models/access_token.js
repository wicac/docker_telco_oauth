// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var accessTokenchema = new Schema({
  client_user_id: Schema.ObjectId,
  access_token: {type: String, index: true},
  access_token_expiry: Date
});

accessTokenchema.methods.saveToken = function() {
  var aToken = new AccessToken;
            aToken.client_user_id = result._id;
            aToken.access_token = generatedToken;
            aToken.save(function (err) {
                if (err) fcallback(err);
            })
}

var AccessToken = mongoose.model('AccessToken', accessTokenchema);

module.exports = AccessToken;