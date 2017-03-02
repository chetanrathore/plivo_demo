/**
 * Created by LaNet on 3/2/17.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var boom = require("boom");
var APIError = require("./../helpers/APIError");
const httpStatus = require('http-status');

const VoiceCall = new Schema({
    fromUser: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    toUser: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    callUUId: {
        type: String,
    },
    apiId: {
        type: String,
    },
    status: {
        type: Number,
    },
    message:{
        type: String,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    }
});

//Static method to find call by id
VoiceCall.statics.getByVoiceCallId = function (callId){
    return this.findOne({ _id: callId })
        .then(function (call) {
            if (call) {
                return call;
            }
            const err = new APIError('No such call exists!', httpStatus.NOT_FOUND);
            return Promise.reject(err);
        });
};

module.exports = mongoose.model("VoiceCall", VoiceCall);