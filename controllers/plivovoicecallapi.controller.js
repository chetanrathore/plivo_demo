/**
 * Created by LaNet on 3/7/17.
 */

var config = require('./../config/config');
var plivo = require("plivo");
var util = require("util");

//Call by plivo endpoint when the call is fired as answerurl
/**
 *
 * @param req   Plivo call detail
 * @param res   XML
 * @param next
 */
function makeCall(req, res, next) {

    console.log("---Make Call----");
    // console.log(JSON.stringify(req.body));

    console.log(JSON.stringify(req.body.Direction));
    var response = plivo.Response();

    var recordParam = {
        'action': config.tmpServer+"/get_recording",
        'method':'POST',
        'startOnDialAnswer': 'true',
        'redirect': 'false',
        'fileFormat':'mp3',
    }
    response.addRecord(recordParam);
    //util.format("http://%s/record_api_action/", req.get('host'));
    var param1 = {
        'action': config.tmpServer+"/call_action",
        'method':'POST',
        'callerId': "18064100731",
        'callerName':"Test VIF",
        'dialMusic': 'real',
        'redirect': 'true'
    };
    var dial = response.addDial(param1);
    dial.addNumber("917069592747");

    //response.addSpeak("Hello from Testing View in focus.");
    console.log(response.toXML());
    res.set({'Content-Type': 'text/xml'});
    res.send(response.toXML());
}

/**
 *
 * @param req  Recording details
 * @param res
 * @param next
 */
function getRecording(req, res, next, next) {
    console.log("--------------RECORDING--------------");
    console.log(JSON.stringify(req.body));
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function callAction(req, res, next, next) {
    console.log("-----------Call action-----------------");
    console.log(JSON.stringify(req.body));
}

/**
 *
 * @param req  call details from plivo
 * @param res
 */
function hangupCall(req, res, next) {
    console.log("--------------Call End--------------");
    console.log(JSON.stringify(req.body));
    var response = plivo.Response();
    var hangup_params = {
        'reason': 'rejected'
    };
    response.addHangup(hangup_params);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(response.toXML());
}

// Database operation
function addVoiceLog(req, res, next) {

}

function updateVoiceLog(req, res, next) {

}

function getByCallerUUId(req, res, next) {

}



module.exports = { makeCall, getRecording, callAction, hangupCall }