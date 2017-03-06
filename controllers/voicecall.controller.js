const VoiceCall = require("../models/voicecall.model");
const APIError = require("../helpers/APIError");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const VoiceCallLog = require("../models/voicecalllog.model");
const RecordVoiceCall = require("../models/callrecord.model");

//For SMS
var config = require('./../config/config');
var plivo = require('plivo');

var p = plivo.RestAPI({
    authId: config.authId,
    authToken: config.authToken
});

//make call and store in db
function create(req, res, next) {
    var voiceCall = new VoiceCall();
    voiceCall.fromUser = mongoose.Types.ObjectId(req.body.fromUser);
    voiceCall.toUser = mongoose.Types.ObjectId(req.body.toUser);
    var param = {};

    User.getByUserId(voiceCall.fromUser)
        .then(function (fromUser) {
            param.from = "18478335677"//"Test_PLV"//fromUser.phoneNo;
            return User.getByUserId(voiceCall.toUser)
        })
        .then(function (toUser) {
            console.log("---------------------");
            console.log(toUser.phoneNo);
            //param.to = "917878499987"
          //  param.to = "919687667944"////toUser.phoneNo;
            param.to = "917069592747"////toUser.phoneNo;
            param.answer_url = config.tmpServer+"/record_api/";
            param.answer_method = "POST";
            //param.hangup_url = config.tmpServer+"/hangup_api/";
            param.machine_detection = 'true';
            param.machine_detection_time = 'true';
            param.machine_detection = 'true';
            param.machine_detection = 'true';

            p.make_call(param, function(status, response) {
                if (status >= 200 && status < 300) {
                    console.log('Successfully made call request.');
                } else {
                    console.log('Oops! Something went wrong.');
                }
                voiceCall.status = status;
                voiceCall.apiId = response['api_id'] || "";
                voiceCall.callUUId = response["request_uuid"] || ""
                voiceCall.message = response["message"] || ""
                voiceCall.save();
                res.json({ status: status, response: response });
            });
        })
        .then(function (voiceCall) {
            //return res.json({message: "call detail added."});
        })
        .catch(function (err) {
            return next(err);
        })
}

//get call detail from db
function getAll(req, res, next) {
    VoiceCall.find()
        .populate('fromUser')
        .populate('toUser')
        .sort({ createdOn: -1 })
        .exec()
        .then(function (voicecall) {
            return res.json(voicecall);
        })
        .catch(function (err) {
            return next(err);
        })
}

//make a call

function makeCall(req, res, next) {
    var params = {
        from: '18064100731',
        to: '917069592747',
        answer_url: config.tmpServer+"/record_api/",
        answer_method : "POST",
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

//from Plivo
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
    var from = req.query.from;
    var to = req.query.to;

    console.log(req.query);
    var params = {
        'status': 'live'
    };
    p.get_live_calls(params, function (status, response) {
        let calls = response['callls'];
        if(calls.length > 0){

        }
        res.json({ status: status, response: response });


    });
}
function getDetailByCallId(req, res, next) {
    var params = {
        'call_uuid': "aa0f7c92-0256-11e7-ad6b-3db91c35bc11"//req.params.callId, // The ID of the call
    };
    p.get_cdr(params, function (status, response) {
        console.log('Status: ', status);
        console.log('API Response:\n', response);
        res.json({ status: status, response: response });
    });
}

//User action after receive the call
function recordCallbyCallId(req, res) {
    console.log("action called");
    console.log(req.query);
    var call_uuid = req.query.CallUUID;
    var params = {'call_uuid': call_uuid};
    p.record(params, function (status, response) {
        res.json({ status: status, response: response });
    })
}


//call when receive call by user
function receiveCall(req, res) {
    console.log(req.query);
    console.log("Call received");
    var voiceCallLog = new VoiceCallLog();
    voiceCallLog.from = req.query.From;
    voiceCallLog.to = req.query.To;
    voiceCallLog.direction = req.query.Direction;
    voiceCallLog.callStatus = req.query.CallStatus;
    voiceCallLog.callUUId = req.query.CallUUID;
    voiceCallLog.event = req.query.Event;
    voiceCallLog.billRate = req.query.BillRate;
    voiceCallLog.aLegUUID = req.query.ALegUUID;
    voiceCallLog.aLegRequestUUId = req.query.ALegRequestUUID;
    voiceCallLog.requestUUId = req.query.RequestUUID;
    voiceCallLog.save()
        .then(function (voiceCallLog) {
            console.log("log added");
        }).catch(function (err) {
        console.log("error when add voiceCallLog");
        //return next(err);
    })
    console.log(req.query);
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

}

// <Response><GetDigits action="http://61caab23.ngrok.io/record_api_action" method="GET" timeout="7" numDigits="1" retries="1" redirect="false">
//     <Speak>hello from testing, Press 1 to record this call</Speak>
// </GetDigits><Wait length="20"/></Response>

//User action after receive the call
function recordCall(req, res) {
    console.log("action called");
    console.log(req.query);
    var digit = req.query.Digits;
    var call_uuid = req.query.CallUUID;
    var p = plivo.RestAPI({
        "authId": config.authId,
        "authToken": config.authToken
    });
    console.log(call_uuid);
    if (digit === "1") {
        // ID of the call
        var params = {'call_uuid':call_uuid};
        p.record(params, function (status, response) {
            if (status == 202) {
                var record = new RecordVoiceCall();
                record.callUUId = call_uuid;
                record.apiId = response['api_id'] || "";
                record.recordingId = response['recording_id'] || "";
                record.message = response['message'] || "";
                record.url = response['url'] || "";
                record.save();
                console.log("Call recorded");
                console.log(status);
                console.log(response); //here get the url of mp3 file.
            }
        })
    } else
        console.log("Wrong Input");
}

//From database
function getCallRecordLogFromDB(req, res, next) {
    RecordVoiceCall.find().sort({ createdOn: -1 })
        .then(function (smsLog) {
            return res.json(smsLog);
        })
        .catch(function (err) {
            return next(err);
        })
}

function getVoiceCallLogFromDB(req, res, next) {
    VoiceCallLog.find().sort({ createdOn: -1 })
        .then(function (smsLog) {
            return res.json(smsLog);
        })
        .catch(function (err) {
            return next(err);
        })
}

module.exports = {create, getAll, makeCall, getCallLog, getFilteredCallLog,
    getLiveCall, getDetailByCallId, recordCallbyCallId, receiveCall, recordCall, getCallRecordLogFromDB, getVoiceCallLogFromDB};