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

server.listen(app.get('port'),function(){
    console.log('Server listing at port ' + server.address().port);
});

app.get('/test', function (req, res) {
    console.log(__dirname);
    res.sendFile(__dirname + "/testcall.html");
});

app.all('/make_call/', function(req, res) {
    var response = plivo.Response();
    var recordParam = {
        'action': config.tmpServer+"/get_recording/",
        'startOnDialAnswer': 'true',
        'redirect': 'false',
        'fileFormat':'mp3',
        'callbackUrl': config.tmpServer+"/callback_action",
        'transcriptionUrl': config.tmpServer+"/calldetail_action",
    }
    response.addRecord(recordParam);
    response.addSpeak("Hello from Testing View in focus.");

    var record_url = config.tmpServer+"/call_action";//util.format("http://%s/record_api_action/", req.get('host'));
    var param1 = {
       'callerId': "18478335677",
       'callerName':"Test VIF",
       'dialMusic': 'real',
    };

    var dial = response.addDial(param1);
    dial.addNumber("917069592747");

    console.log(response.toXML());
    res.set({'Content-Type': 'text/xml'});
    res.send(response.toXML());

});

app.all('/get_recording', function (req, res) {
    console.log("--------------RECORDING--------------");
    console.log(req.query);
    console.log(req.body);
    console.log(req.params);
});

app.all('/callback_action', function (req, res) {
    console.log("-----------Callback action-----------------");
    console.log(req.query);
    console.log(req.body);
    console.log(req.params);
});

app.all('/calldetail_action', function (req, res) {
    console.log("--------Call detail--------------------");
    console.log(req);
    console.log(req.params);
});


app.all('/hangup_api/', function (req, res) {
    console.log("--------------Call End--------------");
    //console.log(req);
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