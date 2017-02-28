const SMS = require("../models/sms.model.js");
const APIError = require("../helpers/APIError");
const mongoose = require("mongoose");

const User = require("../models/user.model");

//For SMS
var config = require('./../config/config');
var plivo = require('plivo');

var p = plivo.RestAPI({
    authId: config.authId,
    authToken: config.authToken
});

//Send sms
function create(req, res, next) {
    var sms = new SMS();
    sms.fromUser = mongoose.Types.ObjectId(req.body.fromUser);
    sms.toUser = mongoose.Types.ObjectId(req.body.toUser);
    sms.smsText = req.body.smsText;
    var param = {};

    User.getByUserId(sms.fromUser)
        .then(function (fromUser) {
            param.src = "918140170017"//"Test_PLV"//fromUser.phoneNo;
            return User.getByUserId(sms.toUser)
        })
        .then(function (toUser) {
            param.dst = toUser.phoneNo;
            param.text = sms.smsText;
            p.send_message(param, function (status, response) {
                    console.log('Status: ', status);
                    console.log('API Response:\n', response);
                    sms.status = status;
                    sms.messageUUId = response['message_uuid'] || "";
                    sms.save();
                    return res.send({ status: status, response: response });
            });
        })
        .then(function (sms) {
            //return res.json({message: "sms added."});
        })
        .catch(function (err) {
        return next(err);
    })
}

// Get all sms details
function getAll(req, res, next) {
    SMS.find()
        .populate('fromUser')
        .populate('toUser')
        .sort({ createdOn: -1 })
        .exec()
        .then(function (sms) {
            return res.json(sms);
        })
        .catch(function (err) {
            return next(err);
        })
}

// sms detail by sim id from plivo
function getDetailSMSId(req, res, next) {
    SMS.getBySMSId(req.params.smsId)
        .then(function (sms) {
            var params = {'record_id': sms.messageUUId };
            p.get_message(params, function (status, response) {
                console.log('Status: ', status);
                console.log('API Response:\n', response);
                console.log('Units:', response['units']);
                console.log('Status:', response['message_state']);

                var SMSRes = { sms: sms, apiDetail: response };
                return res.json(SMSRes);
            });
        }).catch(function (err) {
        return next(err);
    })
}

//sms detail by ser id
function getAllSMSByUser(req, res, next) {
    SMS.find({ $or: [{fromUser: req.params.userId}, {toUser: req.params.userId}] }).exec()
        .then(function (smsDetail) {
            return res.json(smsDetail);
        }).catch(function (err) {
        return next(err);
    })
}

module.exports = { create, getAll, getDetailSMSId, getAllSMSByUser };