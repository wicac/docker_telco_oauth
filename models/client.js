// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var clientSchema = new Schema({
  name: String,
  client_id: {type: String, index: true},
  redirect_url: String
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