require('dotenv').config()

// mongodb object and connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.99.100:27017/tselauthkit');
var Client = require('./models/client.js');
var OTP = require('./models/otp.js');
var ClientUser = require('./models/client_user.js');
var AccessToken = require('./models/access_token.js');

// Express and Co
const express = require('express')
const Util = require('./lib/util.js')
const messaging = require('./lib/messaging.js')
const app = express()
var session = require('express-session');

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.send('Hello World!')
})

// about page 
// var thename = "Rayhan";

app.get('/v1/oauth/authorize', function(req, res) {
    if( typeof req.query.client_id == 'undefined') {
        res.status(400).send("client_id not supplied");
    } else if( typeof req.query.response_type == 'undefined') {
        res.status(400).send("response_type not supplied");
    } else if (req.query.response_type != 'token') {
        res.status(403).send("response_type not supported");
    } else {
        // TODO = harusnya pengecekan client_id di DB
        Client.isClientIdExist(req.query.client_id, function(err, data, client) {
            if (err) throw err; else {
                if (data == 0) { // client_id not found
                    res.status(400).send("client_id not registered");
                } else {
                    var data = {'client_id': req.query.client_id};
                    res.render('sms/index', data);
                }
            }});
    }
});

app.get('/v1/oauth/sms/otp', function(req, res) {
    if( typeof req.query.client_id != 'undefined') {
        Client.isClientIdExist(req.query.client_id, function(err, data, client) {
            if (err) throw err; else {
                if (data == 0) { // client_id not found
                    res.status(403).send("client_id not registered");
                } else {
                    if( typeof req.query.msisdn == 'undefined') {
                        res.status(400).send("Msisdn not supplied");
                    } else {
                        // TODO submit OTP (send sms)
                        var otp = new OTP({client_id: req.query.client_id, msisdn: Util.formatMsisdn(req.query.msisdn)});
                        otp.generate(function(err, otpCode) {
                            if (err) {
                                res.status(500).send("Internal Error");
                            } else {
                                messaging.sendSms("+62" + Util.formatMsisdn(req.query.msisdn), "Kode untuk masuk aplikasi " + client.name + " adalah " + otpCode, function(err) {
                                    if (!err) {
                                        res.send("OTP Sent!");           
                                    } else {
                                        res.status(500).send("Internal errow while sending OTP");
                                    }
                                });
                                     
                                console.log("OTP generated=" + otpCode + ", from msisdn=" + otp.msisdn);
                            }
                        });
                        
                    }
                }
            }
        });
    } else {
        // TODO submit OTP and update DB
        res.status(400).send("client_id not supplied");
    }
});

app.get('/v1/oauth/sms/validateOtp', function(req, res) {
    if( typeof req.query.client_id != 'undefined') {
        Client.isClientIdExist(req.query.client_id, function(err, data, client) {
            if (err) throw err; else {
                if (data == 0) { // client_id not found
                    res.status(403).send("client_id not found");
                } else {
                    if( typeof req.query.msisdn == 'undefined') {
                        res.status(400).send("Msisdn not supplied");
                    } else if( typeof req.query.otp == 'undefined') {
                        res.status(400).send("OTP not supplied");
                    } else {
                        
                        var otp = new OTP({client_id: req.query.client_id, msisdn: Util.formatMsisdn(req.query.msisdn), value: req.query.otp});
                        // console.log("sebelum cek=" + otp.msisdn +",format=" + Util.formatMsisdn(req.query.msisdn));
                        otp.validateOtp(function(err, ret) {
                            if (err) {
                                res.status(500).send("Internal Error");
                            } else {
                                if (ret == 0) {
                                    res.send("OTP not valid :(");
                                } else {
                                    ClientUser.registerUserAndToken(Util.formatMsisdn(req.query.msisdn), req.query.client_id, function(err, generatedToken) {
                                        if (err) {
                                            res.status(500).send("Internal error generating token");
                                        } else {
                                            // res.send("cobain");
                                            var rdrcturl = client.redirect_url + "?token=" + generatedToken;
                                            var data = {msg: "OTP valid. Redirecting to back to application" + client.name + " in 3 seconds",
                                                        redirect_url: rdrcturl
                                                        };
                                            res.render('redirect.ejs', data);
                                        }
                                    });
                                    
                                }    
                            }
                        })
                        
                    }
                }
            }
        });
    } else {
        // TODO submit OTP and update DB
        res.status(400).send("client_id not supplied");
    }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})



/*
function registerUser(msisdn, client_id, fcallback) {
    var query = {client_id: client_id, msisdn: msisdn},
    update = { client_id: client_id, msisdn: msisdn },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Find the document
    ClientUser.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) {
            fcallback(err);
        } else {
            console.log("generatedid:" + result._id);
            var generatedToken = Util.randomStringAsBase64Url(11);
            var aToken = new AccessToken;
            aToken.client_user_id = result._id;
            aToken.access_token = generatedToken;
            aToken.save(function (err) {
                if (err) fcallback(err);
            });
            fcallback(null);
        }

        // do something with the document
    });
}*/