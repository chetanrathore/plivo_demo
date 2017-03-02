var express    = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config');
const apiRouter = require("../routes/index.route");
var jwt = require("jsonwebtoken");
var expressValidation = require("express-validation");
const APIError = require("../helpers/APIError");
const httpStatus = require('http-status');

//Here configure the express
var app = express();
var server = require("http").Server(app);

//Listening port
app.set('port',process.env.PORT || config.webPort);

server.listen(app.get('port'),function(){
    console.log('Server listing at port ' + server.address().port);
});

var plivo = require("plivo");
var util = require("util");

app.all('/record_api/', function (req, res) {
    console.log("inside record call----");
    var getdigits_action_url = config.tmpServer+"/record_api_action";//util.format("http://%s/record_api_action/", req.get('host'));
    var params = {
        'action': getdigits_action_url, // The URL to which the digits are sent.
        'method': 'GET', // Submit to action URL using GET or POST.
        'timeout': '7', // Time in seconds to wait to receive the first digit.
        'numDigits': '1', // Maximum number of digits to be processed in the current operation.
        'retries': '1', // Indicates the number of attempts the user is allowed to input digits
        'redirect': 'false' // Redirect to action URL if true. If false, only request the URL and continue to next element.
    };
    var response = plivo.Response();
    var getDigits = response.addGetDigits(params);
    getDigits.addSpeak("hello from testing, Press 1 to record this call");

    // Time to wait in seconds
    params = {'length': "30"};
    response.addWait(params);

    console.log(response.toXML());
    res.set({'Content-  Type': 'text/xml'});
    res.send(response.toXML());
});

app.all('/record_api_action/', function (req, res) {
    var digit = req.query.Digits;
    var call_uuid = req.query.CallUUID;
    var p = plivo.RestAPI({
        "authId": config.authId,
        "authToken": config.authToken
    });
    if (digit === "1") {
        // ID of the call
        var params = {'call_uuid':call_uuid};
        p.record(params, function (status, response) {
            console.log(status);
            console.log(response); //here get the url of mp3 file.
        })
    } else
        console.log("Wrong Input");
});


/*
app.all('/record_api/', function (req, res) {
    console.log("inside record call----");
    var getdigits_action_url = config.tmpServer+"/record_api_action";//util.format("http://%s/record_api_action/", req.get('host'));
    var params = {
        'action': getdigits_action_url, // The URL to which the digits are sent.
        'method': 'GET', // Submit to action URL using GET or POST.
        'timeout': '7', // Time in seconds to wait to receive the first digit.
        'numDigits': '1', // Maximum number of digits to be processed in the current operation.
        'retries': '1', // Indicates the number of attempts the user is allowed to input digits
        'redirect': 'false' // Redirect to action URL if true. If false, only request the URL and continue to next element.
    };
    var response = plivo.Response();
    var getDigits = response.addGetDigits(params);
    getDigits.addSpeak("hello from testing, Press 1 to record this call");

    // Time to wait in seconds
    params = {'length': "30"};
    response.addWait(params);

    console.log(response.toXML());
    res.set({'Content-Type': 'text/xml'});
    res.send(response.toXML());
});

app.all('/record_api_action/', function (req, res) {
    var digit = req.query.Digits;
    var call_uuid = req.query.CallUUID;
    var p = plivo.RestAPI({
        "authId": config.authId,
        "authToken": config.authToken
    });
    if (digit === "1") {
        // ID of the call
        var params = {'call_uuid':call_uuid};
        p.record(params, function (status, response) {
            console.log(status);
            console.log(response); //here get the url of mp3 file.
        })
    } else
        console.log("Wrong Input");
});
*/
app.all('/hangup_api/', function (req, res) {
        console.log("Call end");
        console.log(req);
});

app.all('/receive_sms/', function(req, res) {
    console.log("receive sms");
    var from_number = req.body.From || req.query.From;
    var to_number = req.body.To || req.query.To;
    var text = req.body.Text || req.query.Text;
    console.log('Message received - From: ', from_number, ', To: ', to_number, ', Text: ', text);
    response.send("Message received");
});

// middleware to use for api requests and verify token by using jsonwebtoken.
// app.use('/api', function(req, res, next) {
//     console.log("Inside the function");
//     let token = req.headers['x-access-token'];
//     if (token) {
//         jwt.verify(token, config.jwtSecretKey, function (err, decoded) {
//             if (err) {
//                 res.send({ success: false, message: "Failed to authenticate token.", error: err });
//             }else {
//                 //console.log(decoded.userId);
//                 res.locals.session = decoded.userId;
//                 next();
//             }
//         })
//     }else {
//         res.status(403).send({ success: false, message: "Authenticate token required."});
//     }
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//all route assign here
app.use('/',apiRouter);

//Here handle an error when next with error
app.use(function (err, req, res, next) {
    console.log("inside next err call");
    if (err instanceof expressValidation.ValidationError) {
        console.log(err);
        const errorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
        return res.status(err.status).json({
            error: errorMessage
        });
    }else if (err instanceof APIError) {
        console.log(err);
        return res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: err.message
        });
    } else{
        next(err);
    }
})

// if api not found then send message
app.use(function (req, res, next) {
    console.log("inside not found");
    return res.status(404).json({ success: false, message: 'API not found.' });
})

module.exports = app;