/**
 * Created by LaNet on 3/2/17.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var boom = require("boom");
const APIError = require("./../helpers/APIError");
const httpStatus = require('http-status');

const VoiceCallLog = new Schema({
    callUUId: {
        type: String,
    },
    direction: {
        type: String,
    },
    from: {
        type:  String,
    },
    to: {
        type: String,
    },
    callStatus: {
        type: String,
    },
    event: {
        type: String,
    },
    billRate: {
        type: Number,
    },
    aLegUUID: {
        type: String,
    },
    aLegRequestUUId: {
        type: String,
    },
    requestUUId: {
        type: String,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("VoiceCallLog", VoiceCallLog);