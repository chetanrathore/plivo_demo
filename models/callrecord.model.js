/**
 * Created by LaNet on 3/2/17.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const APIError = require("./../helpers/APIError");
const httpStatus = require('http-status');

const RecordVoiceCall = new Schema({
    callUUId: {
        type: String,
    },
    apiId: {
        type: String,
    },
    message: {
        type: String,
    },
    recordingId: {
        type: String,
    },
    url: {
        type: String,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("RecordVoiceCall", RecordVoiceCall);