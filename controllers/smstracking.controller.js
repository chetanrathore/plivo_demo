/**
 * Created by LaNet on 2/25/17.
 */
const SMS = require("../models/sms.model.js");
const APIError = require("../helpers/APIError");
const mongoose = require("mongoose");
const SMSLog = require("../models/smslog.model");

const User = require("../models/user.model");

//For SMS
var config = require('./../config/config');
var plivo = require('plivo');

var p = plivo.RestAPI({
    authId: config.authId,
    authToken: config.authToken
});

//SMS Status after send and stored in smslog
function smsStatus(req, res, next) {
    console.log("SMS status");
    console.log(req.body);
    var smsLog = new SMSLog();
    smsLog.from = req.body.From;
    smsLog.to = req.body.To;
    smsLog.status = req.body.Status;
    smsLog.totalRate = req.body.TotalRate;
    smsLog.totalAmount = req.body.TotalAmount;
    smsLog.MCC = req.body.MCC;
    smsLog.MNC = req.body.MNC;
    smsLog.PartInfo = req.body.PartInfo;
    smsLog.parentMessageUUId = req.body.ParentMessageUUID;
    smsLog.messageUUId = req.body.MessageUUID;
    smsLog.save()
        .then(function (smslog) {
            console.log("log added");
            return res.send();
        }).catch(function (err) {
            console.log("error when add smslog");
            return next(err);
    })
}

//Get all smslog from db
function getAllSMSLogFromDB(req, res, next) {
    SMSLog.find().sort({ createdOn: -1 })
        .then(function (smsLog) {
            return res.json(smsLog);
        })
        .catch(function (err) {
            return next(err);
        })
}

//Get Tracking report from plivo
function getSMSReport(req, res, next) {
    var params = {};
    p.get_messages(params, function (status, response) {
        console.log('Status: ', status);
        console.log('API Response:\n', response);
        return res.json({ status: status, data: response });
    });
}

// Get Tracking report by applying filter
function getOutBoundSMSReport(req, res, next) {
    var params1 = {
        'limit': '10', // The number of results per page
        'offset': '0', // The number of items by which the results should be offset
        'message_state': "delivered", // The state of the message to be filtered
        'message_direction': "outbound" // The direction of the message to be fltered
    };
    p.get_messages(params1, function (status, response) {
        console.log('Status: ', status);
        console.log('API Response:\n', response);
        return res.json({ status: status, data: response });
    });
}

function getInBoundSMSReport(req, res, next) {
    var params1 = {
        'limit': '5',
        'offset': '0',
        'message_state': "delivered",
        'message_direction': "inbound"
    };
    p.get_messages(params1, function (status, response) {
        return res.json({ status: status, data: response });
    });
}

module.exports = { getSMSReport, getOutBoundSMSReport, getInBoundSMSReport, smsStatus, getAllSMSLogFromDB  };