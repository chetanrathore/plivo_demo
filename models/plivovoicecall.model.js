var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const PlivoVoiceCallLog = new Schema({
    direction: {
        type: String,
    },
    callUUId: {
        type: String,
    },
    from: {
        type:  String,
    },
    to: {
        type: String,
    },
    callName: {
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
    sipHTo: {
        type: String,
    },
    totalCost: {
        type: Number,
    },
    startTime: {
        type: Date,
    },
    answerTime: {
        type: Date,
    },
    hangupCause: {
        type: String,
    },
    duration:{
        type: Number,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("PlivoVoiceCallLog", PlivoVoiceCallLog);