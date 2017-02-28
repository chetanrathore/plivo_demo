var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var boom = require("boom");
const APIError = require("./../helpers/APIError");
const httpStatus = require('http-status');

const SMS = new Schema({
    fromUser: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    toUser: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    smsText: {
        type: String,
        required: true,
        trim: true,
    },
    messageUUId: {
        type: String,
    },
    status: {
        type: String,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    }
});

//Static method to find sms by id
SMS.statics.getBySMSId = function (smsId){
    return this.findOne({ _id: smsId })
        .then(function (sms) {
            if (sms) {
                return sms;
            }
            // const err = boom.notFound("No such sms exists!");
            const err = new APIError('No such sms exists!', httpStatus.NOT_FOUND);
            return Promise.reject(err);
        });
};

module.exports = mongoose.model("SMS", SMS);