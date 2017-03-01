/**
 * Created by LaNet on 2/25/17.
 */

//For SMS
var config = require('./../config/config');
var plivo = require('plivo');

var p = plivo.RestAPI({
    authId: config.authId,
    authToken: config.authToken
});

//make a call

function makeCall(req, res, next) {
    var params = {
        from: '18064100731',
        to: '917878499987',
        answer_url: config.tmpServer+"/record_api/",
        answer_method : "GET",
        hangup_url: config.tmpServer+"/hangup_api/",      //  callback_url : "http://6b36f2c5.ngrok.io/api/testcallback",
     //  callback_method : "GET" // The method used to notify the callback_url.
    };
    p.make_call(params, function(status, response) {
        if (status >= 200 && status < 300) {
            console.log('Successfully made call request.');
        } else {
            console.log('Oops! Something went wrong.');
        }
        res.json({ status: status, response: response });
    });
}

function testCallBack(req, res, next) {
    console.log(req);
    //console.log(req.body);
    console.log("Call method");
    res.send("End call");
}

function getCallLog(req, res, next) {
    var params = { };
    p.get_cdrs(params, function (status, response) {
        res.json({ status: status, response: response });
    });
}

function getFilteredCallLog(req, res, next) {
    var params = {
        'call_direction': 'outbound',
        'from_number': '18064100731',
        'to_number': '917878499987',
        'limit': '10',
        'offset': '0'
    };

    p.get_cdrs(params, function (status, response) {
        res.json({ status: status, response: response });
    });
}

function getLiveCall(req, res, next) {
    var params = {
        'status': 'live'
    };
    p.get_live_calls(params, function (status, response) {
        res.json({ status: status, response: response });
    });
}

//call when receive call by user
function receiveCall(req, res) {
    console.log("inside record call receive");
    var getdigits_action_url = config.tmpServer + "record_api_action/";//util.format("http://%s/record_api_action/", req.get('host'));
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
}

//User action after recive the call
function recordCall(req, res) {
    console.log("inside call record");
    console.log(req);
    console.log(req.query.Digits);
    // Plivo passes the digit captured by the xml produced by /record_api/ function as the parameter Digits
    var digit = req.query.Digits;
    // CallUUID parameter is automatically added by Plivo when processing the xml produced by /record_api/ function
    var call_uuid = req.query.CallUUID;
    var call_status = req.query.CallStatus;
    console.log("=============**********================");
    console.log(call_uuid);
    console.log(digit);

    // var p = plivo.RestAPI({
    //     "authId": config.authId,
    //     "authToken": config.authToken
    // });

    if (digit === "1") {
        // ID of the call
        var params = {'call_uuid': call_uuid};
        // Here we make the actual API call and store the response
        var response = p.record(params);
        p.record(params, function (response) {
            console.log("End record");
            console.log(response);
        })
    } else
        console.log("Wrong Input");
}

module.exports = { makeCall, getCallLog, getFilteredCallLog, testCallBack, getLiveCall, receiveCall, recordCall};