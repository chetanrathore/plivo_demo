/**
 * Created by LaNet on 3/7/17.
 */

var config = require('./../config/config');
var plivo = require("plivo");
var util = require("util");
var plivocallog = require('./plivovoicecall.controller');

//Call by plivo endpoint when the call is fired as answerurl
/**
 *
 * @param req   Plivo call detail
 * @param res   XML
 * @param next
 */
function makeCall(req, res, next) {

    console.log("---Make Call----");
    console.log(req.body.Direction);
    console.log(JSON.stringify(req.body));
    plivocallog.create(req, res, next);
    // console.log(JSON.stringify(req.body.Direction));
    var response = plivo.Response();


     var recordParam = {
        'action': config.tmpServer+"/get_recording/",
        'method':'POST',
        'startOnDialAnswer': 'true',
        'redirect': 'false',
        'fileFormat':'mp3',
    }
     response.addRecord(recordParam);
    //util.format("http://%s/record_api_action/", req.get('host'));
    var param1 = {
        'action': config.tmpServer+"/call_action/",
        'method':'POST',
        'callerId': "+1760-279-1418",
       // 'callerName':"Test VIF",
        'dialMusic': 'real',
        'redirect': 'true',
        'digitsMatch': '1,2,3',
        'digitsMatchBLeg': '1,2,3',
        'callbackUrl': config.tmpServer+'/call_back/',
        'callbackMethod': 'POST'
    };

    var dial = response.addDial(param1);

    // dial.addUser("sip:ios170308091034@phone.plivo.com");

    // if(req.body.From == "17602791418"){
        dial.addUser("sip:testcall1170301071206@phone.plivo.com");
    // }else{
          dial.addNumber(req.body.To);
    // }


   // response.addSpeak("Hello from Testing View in focus.Hello from Testing View in focus.");

    // // Send audio text to speech message to end user if don't receive
    response.addSpeak('Hello, Welcome to View In Focus');

//IVR
    var getdigits_action_url = config.tmpServer+"/get_digits/";
    var params = {
        'action': getdigits_action_url, // The URL to which the digits are sent.
        'method': 'GET', // Submit to action URL using GET or POST.
        'timeout': '7', // Time in seconds to wait to receive the first digit.
        'numDigits': '2', // Maximum number of digits to be processed in the current operation.
        'retries': '1', // Indicates the number of attempts the user is allowed to input digits
        'redirect': 'false' // Redirect to action URL if true. If false, only request the URL and continue to next element.
    };
    var getDigits = response.addGetDigits(params);
    getDigits.addSpeak("Press 1 for English, Press 2 for French");

    // Time to wait in seconds
    params = {'length': "30"};
    response.addWait(params);

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
function getRecording(req, res, next) {
    console.log("--------------RECORDING--------------");
    console.log(JSON.stringify(req.body));
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
// DialHangupCause":"ORIGINATOR_CANCEL",   when hang up by caller
//"DialHangupCause":"CALL_REJECTED" ----- When call hang by receiver
//DialHangupCause":"NORMAL_CLEARING"  --- After answer by receiver
function callAction(req, res, next) {
    console.log("-----------Call action-----------------");
    console.log(JSON.stringify(req.body));
    console.log(req.body.DialHangupCause);
  //  if(req.body.DialHangupCause == "CALL_REJECTED") {
        var response = plivo.Response();
        var hangup_params = {
            'reason': 'rejected'
        };
        response.addHangup(hangup_params);
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(response.toXML());
//    }
}

/**
 *
 * @param req  call details from plivo
 * @param res
 */
function hangupCall(req, res, next) {
    console.log("--------------Call End--------------");
    console.log(JSON.stringify(req.body));
    plivocallog.update(req, res, next);
    var response = plivo.Response();
    var hangup_params = {
        'reason': 'rejected'
    };
    response.addHangup(hangup_params);
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(response.toXML());
}

module.exports = { makeCall, getRecording, callAction, hangupCall };