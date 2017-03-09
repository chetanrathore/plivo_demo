/**
 * Created by LaNet on 3/7/17.
 */
const mongoose = require("mongoose");
const User = require("../models/user.model");
const PlivoVoiceCallLog = require("../models/plivovoicecall.model");


//Add log at 1st time call answer_url
function create(req, res, next) {

    var plivoVoiceCallLog = new PlivoVoiceCallLog();
    plivoVoiceCallLog.direction = req.body.Direction;
    plivoVoiceCallLog.callUUId = req.body.CallUUID;
    plivoVoiceCallLog.from = req.body.From;
    plivoVoiceCallLog.to = req.body.To;
    plivoVoiceCallLog.callName = req.body.CallerName;
    plivoVoiceCallLog.callStatus = req.body.CallStatus;
    plivoVoiceCallLog.event = req.body.Event;
    plivoVoiceCallLog.billRate = req.body.BillRate;
    plivoVoiceCallLog.sipHTo = req.body["SIP-H-To"];

    // plivoVoiceCallLog.totalCost = req.body.TotalCost || 0;
    // plivoVoiceCallLog.startTime = req.body.StartTime || Date.now();
    // plivoVoiceCallLog.answerTime = req.body.AnswerTime || Date.now();
    // plivoVoiceCallLog.hangupCause = req.body.HangupCause || "";
    // plivoVoiceCallLog.duration = req.body.Duration || 0;

    plivoVoiceCallLog.save()
        .then(function () {
            console.log("successfully added");
            //return res.json({message: "successfully added."});
        })
        .catch(function (err) {
            console.log("Fail to add record.");
            // return next(err);
        })
}

function getAll(req, res, next) {
    PlivoVoiceCallLog.find().sort({ createdOn: -1 })
        .then(function (voicelog) {
            return res.json(voicelog);
        })
        .catch(function (err) {
            return next(err);
        })
}

function getByCallUUId(req, res, next) {
    // plivoVoiceCallLog.find({callUUId: req.params.callUUId }).exec()
    PlivoVoiceCallLog.find({ callUUId: '5bdde124-032f-11e7-ac2c-d3f6ab578519' }).exec()
        .then(function (calldetail) {
            return res.json(calldetail);
        }).catch(function (err) {
        return next(err);
    })
}

// find by callUUId and update remainig details
function update(req, res, next) {
    console.log(req.body.CallUUID);
    // plivoVoiceCallLog.find({callUUId: req.body.CallUUID }).exec()
    PlivoVoiceCallLog.findOne({ callUUId: req.body.CallUUID }).exec()
        .then(function (calldetail) {
            if(calldetail != null) {
                console.log(calldetail);
                calldetail.totalCost = req.body.TotalCost || 0;
                calldetail.startTime = req.body.StartTime || Date.now();
                calldetail.answerTime = req.body.AnswerTime || Date.now();
                calldetail.hangupCause = req.body.HangupCause || "";
                calldetail.duration = req.body.Duration || 0;
                return calldetail.save();
            }
            return;
        }).then(function (calldetails) {
            console.log("successfully updated");
        // return res.json({});
    })
        .catch(function (err) {
        //return next(err);
    })
}

function remove(req, res, next) {
        PlivoVoiceCallLog.remove().exec()
        .then(function (callog) {
            return res.json({message: "calllog successfully deleted."});
        })
        .catch(function (err){
            return next(err);
        })
}

module.exports = { create, getAll, getByCallUUId, update, remove };