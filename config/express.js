var express    = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config');
const apiRouter = require("../routes/index.route");
var jwt = require("jsonwebtoken");
var expressValidation = require("express-validation");
const APIError = require("../helpers/APIError");
const httpStatus = require('http-status');

var plivo = require("plivo");
var util = require("util");

var cors = require("cors");
//Here configure the express
var app = express();
var server = require("http").Server(app);

app.use(cors());
//Listening port
app.set('port',process.env.PORT || config.webPort);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

server.listen(app.get('port'),function(){
    console.log('Server listing at port ' + server.address().port);
});

app.get('/test', function (req, res) {
    console.log(__dirname);
    res.sendFile(__dirname + "/testcall.html");
});

app.post('/receive_sms/', function(req, res, next) {
    res.send("Message received");
    console.log(JSON.stringify(req.body));
    var from_number = req.body.From || req.query.From;
    var to_number = req.body.To || req.query.To;
    var text = req.body.Text || req.query.Text;
    console.log('Message received - From: ', from_number, ', To: ', to_number, ', Text: ', text);
    // res.send("Message received");
});

app.all('/fallback_call/', function(req, res, next) {
    console.log("CALL FAIL");
});

// This file will be played when a caller presses 2.
var PLIVO_SONG = "https://s3.amazonaws.com/plivocloud/music.mp3";

// This is the message that Plivo reads when the caller dials in
var IVR_MESSAGE1 = "Welcome to the Plivo IVR Demo App. Press 1 to listen to a pre recorded text in different languages. Press 2 to listen to a song.";

var IVR_MESSAGE2 = "Press 1 for English. Press 2 for French. Press 3 for Russian";
// This is the message that Plivo reads when the caller does nothing at all
var NO_INPUT_MESSAGE = "Sorry, I didn't catch that. Please hangup and try again later.";

// This is the message that Plivo reads when the caller inputs a wrong number.
var WRONG_INPUT_MESSAGE = "Sorry, you've entered an invalid input.";



app.all('/response/ivr/', function(request, response) {
    if(request.method == "GET"){
        var getdigits_action_url = config.tmpServer + "/response_digits/";
        var r = plivo.Response();
        var params = {
            'action' : getdigits_action_url, // The URL to which the digits are sent
            'method' : 'POST', // Submit to action URL using GET or POST
            'timeout' : '7', // Time in seconds to wait to receive the first digit
            'numDigits' : '1', // Maximum number of digits to be processed in the current operation
            'retries' : '1' // Indicates the number of retries the user is allowed to input the digits
        }
        var getdigits = r.addGetDigits(params);
        getdigits.addSpeak(IVR_MESSAGE1);
        r.addSpeak(NO_INPUT_MESSAGE)
    } else {
        var digits = request.param('Digits');
        if (digit == "1"){
            var getdigits_action_url = config.tmpServer + "/response_digits/";
            var r = plivo.Response();
            var params = {
                'action' : getdigits_action_url, // The URL to which the digits are sent
                'method' : 'GET', // Submit to action URL using GET or POST
                'timeout' : '7', // Time in seconds to wait to receive the first digit
                'numDigits' : '1', // Maximum number of digits to be processed in the current operation
                'retries' : '1' // Indicates the number of retries the user is allowed to input the digits
            }
            var getdigits = r.addGetDigits(params);
            getdigits.addSpeak(IVR_MESSAGE2);
            r.addSpeak(NO_INPUT_MESSAGE)
        } else if (digit == "2"){
            r.addPlay(PLIVO_SONG);
        } else {
            r.addPlay(WRONG_INPUT_MESSAGE);
        }
    }
    console.log (r.toXML());

    response.set({
        'Content-Type': 'text/xml'
    });
    response.end(r.toXML());

});

app.all('/get_digits/', function (req, res) {

    console.log(JSON.stringify(req.body));
    // Plivo passes the digit captured by the xml produced by /record_api/ function as the parameter Digits
    var digit = req.params.Digits;
    // CallUUID parameter is automatically added by Plivo when processing the xml produced by /record_api/ function
    var call_uuid = req.params.CallUUID;

    var p = plivo.RestAPI({
        "authId": config.authId,
        "authToken": config.authToken
    });

    if (digit === "1") {
        console.log("Press 1");
    }else if(digit === "2") {
        console.log("Press 2");
    } else{
        console.log("Wrong press try again,");
    }
});

app.all('/response_digits/', function(request, response) {

    var digits = request.param('Digits');
    var r = plivo.Response();
    if (digits == "1"){
        var text = "This message is being read out in English"
        var params = {
            'language': "en-GB"
        }
        r.addSpeak(text,params);
    } else if (digits == "2"){
        var text = "Ce message est lu en français"
        var params = {
            'language': "fr-FR"
        }
        r.addSpeak(text,params);
    } else if (digits == "3"){
        var text = "Это сообщение было прочитано в России"
        var params = {
            'language': "ru-RU"
        }
        r.addSpeak(text,params);
    }else {
        r.addPlay(WRONG_INPUT_MESSAGE);
    }

    response.set({
        'Content-Type': 'text/xml'
    });
    response.end(r.toXML());

});


//DialDigitsMatch
app.post('/call_back/', function (req, res) {
    console.log("-----CallBack-----");
    console.log(JSON.stringify(req.body));

    var response = plivo.Response();
    response.addSpeak("Hello from Testing View in focus.Hello from Testing View in focus.");
    console.log(response.toXML());
    res.set({'Content-Type': 'text/xml'});
    res.send(response.toXML());
});

// sip:testcall1170301071206@phone.plivo.com
//sip:testcall1170301071206@phone.plivo.com

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