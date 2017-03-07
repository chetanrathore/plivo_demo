var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const PlivoRecordCallLog = new Schema({
    direction: {
        type: String,
    },
    recordingID: {
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
    recordFile: {
        type: String,
    },
    recordingEndMs: {
        type: Number,
    },
    recordingDurationMs: {
        type: Number,
    },
    billRate: {
        type: Number,
    },
    recordingDuration:{
        type: Number,
    },
    recordingStartMs: {
        type: Number,
    },
    event:{
        type: String,
    },
    callStatus: {
        type: String,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("PlivoRecordCallLog", PlivoRecordCallLog);