/**
 * Created by LaNet on 3/8/17.
 */
const mongoose = require("mongoose");
const PlivoRecordCallLog = require("../models/plivorecordcall.model");

var config = require('./../config/config');
var plivo = require('plivo');

var p = plivo.RestAPI({
    authId: config.authId,
    authToken: config.authToken
});
// store recording data
function create(req, res, next) {
    PlivoRecordCallLog.findOne({ callUUId: req.body.CallUUID }).exec()
        .then(function (record) {
            if(record == null) {
                var plivoRecordCallLog = new PlivoRecordCallLog();
                plivoRecordCallLog.direction = req.body.Direction;
                plivoRecordCallLog.callUUId = req.body.CallUUID;
                plivoRecordCallLog.recordingID = req.body.RecordingID;
                plivoRecordCallLog.from = req.body.From;
                plivoRecordCallLog.to = req.body.To;
                plivoRecordCallLog.recordFile = req.body.RecordFile;
                plivoRecordCallLog.recordURL = req.body.RecordUrl;
                plivoRecordCallLog.recordingEndMs = req.body.RecordingEndMs;
                plivoRecordCallLog.recordingDurationMs = req.body.RecordingDurationMs;
                plivoRecordCallLog.billRate = req.body.BillRate;
                plivoRecordCallLog.recordingStartMs = req.body.RecordingStartMs;
                plivoRecordCallLog.recordingDuration = req.body.RecordingDuration;
                plivoRecordCallLog.event = req.body.Event;
                plivoRecordCallLog.callStatus = req.body.CallStatus;
                return plivoRecordCallLog.save()
            }else{
                if(! record.isUpdateFromPlivo) {
                var param = {
                    'recording_id': record.recordingID
                }
                p.get_recording(param, function (status, response) {
                    record.recordingEndMs = response['recording_end_ms'];
                    record.recordingDurationMs = response['recording_duration_ms'];
                    record.recordingStartMs = response['recording_start_ms'];
                    record.conferenceName = response['conference_name'];
                    record.isUpdateFromPlivo = true;
                    return record.save()
                })
                }
            }
        })
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
    PlivoRecordCallLog.find().sort({ createdOn: -1 })
        .then(function (voicelog) {
            return res.json(voicelog);
        })
        .catch(function (err) {
            return next(err);
        })
}

function getByCallUUId(req, res, next) {
    PlivoRecordCallLog.find({ callUUId: '5bdde124-032f-11e7-ac2c-d3f6ab578519' }).exec()
        .then(function (calldetail) {
            return res.json(calldetail);
        }).catch(function (err) {
        return next(err);
    })
}

function remove(req, res, next) {
    PlivoRecordCallLog.remove().exec()
        .then(function (callog) {
            return res.json({message: "callrecord retails successfully deleted."});
        })
        .catch(function (err){
            return next(err);
        })
}

module.exports = { create, getAll, getByCallUUId, remove };