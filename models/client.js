// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var clientSchema = new Schema({
  name: {type: String, required: true}, 
  client_id: {type: String, index: true},
  client_secret: {type: String, required: true},
  client_userId: {type: String, required: true}
});

var Client = mongoose.model('Client', clientSchema);
Client.isClientIdExist = function(strclientid, callback) {
    
    Client.findOne({ client_id: strclientid }, function(err, client) {
        if (err) {
            callback(err, null);
        } else {
            if (client === null) {
                callback(null, 0, null);    
            } else {
                callback(null, 1, client);
            }
        }
    });
}

module.exports = Client;
