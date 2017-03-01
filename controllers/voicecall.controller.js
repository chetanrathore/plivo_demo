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
        to: '917069592747',
        answer_url: "http://localhost:3000/record_api/", // URL invoked by Plivo when the outbound call is answered
      //  callback_url : "http://localhost:3000/record_api",
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

function testCallBack(req,res, next) {
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












module.exports = { makeCall, getCallLog, getFilteredCallLog, testCallBack, getLiveCall};