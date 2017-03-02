/**
 * Created by LaNet on 3/2/17.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var boom = require("boom");
const APIError = require("./../helpers/APIError");
const httpStatus = require('http-status');

const SMSLog = new Schema({
    messageUUId: {
        type: String,
    },
    parentMessageUUId: {
        type: String,
    },
    from: {
        type:  String,
    },
    to: {
        type: String,
    },
    status: {
        type: String,
    },
    totalRate: {
        type: Number,
    },
    totalAmount: {
        type: Number,
    },
    MCC: {
      type: Number,
    },
    MNC: {
      type: Number,
    },
    PartInfo: {
        type: String,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("SMSLog", SMSLog);