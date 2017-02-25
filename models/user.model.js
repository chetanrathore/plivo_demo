var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var boom = require("boom");
const APIError = require("./../helpers/APIError");
const httpStatus = require('http-status');

const User = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNo: {
        type: String,
        required: true,
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        trim: true,
    },
    userType: {
        type: String,
        enum: ['Customer', 'Dealer'],
    },
    createdOn: {
        type: Date,
        default: Date.now,
    }
});

//Static method to find user by id
User.statics.getByUserId = function (userId){
    return this.findOne({ _id: userId })
        .then(function (user) {
            if (user) {
                return user;
            }
            // const err = boom.notFound("No such user exists!");
            const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
            return Promise.reject(err);
        });
};

module.exports = mongoose.model("User", User);