const User = require("../models/user.model.js");
const APIError = require("../helpers/APIError");
/**
 *
 * @param { fullname, emailId }
 * @param res
 *
 */
function create(req, res, next) {
    console.log("inside call");
    var user = new User();
    user.fullName = req.body.fullName;
    user.emailId = req.body.emailId;
    user.userType = req.body.userType;
    user.phoneNo = req.body.phoneNo;
    if (req.body.profile)
        user.profile = req.body.profile;
    user.save()
        .then(function () {
            return res.json({message: "user added."});
        })
        .catch(function (err) {
            //return res.send(err);
            return next(err);
        })
}

function getAll(req, res, next) {
    console.log("user call");
    User.find().sort({ createdOn: -1 })
        .then(function (user) {
            return res.json(user);
        })
        .catch(function (err) {
            return next(err);
        })
}

/**
 *
 * @param req userId
 * @param res user detail or error if not found
 * @param next if any error
 */
function getById(req, res, next) {
    User.getByUserId(req.params.userId)
        .then(function (user) {
            return res.json(user);
        }).catch(function (err) {
        return next(err);
    })
}

/**
 *
 * @param req userId
 * @param res user detail or error
 */
function remove(req, res, next) {
    User.getByUserId(req.params.userId)
        .then(function (user) {
            User.remove({ _id: user._id })
        })
        .then(function (user) {
            return res.json({message: "user successfully deleted."});
        })
        .catch(function (err){
            return next(err);
        })
}

/**
 *
 * @param req userId and userdetails to update
 * @param res updated message
 * @param next if error
 */
function update(req, res, next) {
    User.getByUserId(req.params.userId)
        .then(function (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.emailId = req.body.emailId || user.emailId;
            user.gender = req.body.gender || user.gender;
            return user.save()
        })
        .then(function (user) {
            console.log(user);
            return res.json({message: "user successfully updated."});
        })
        .catch(function (err){
            return next(err);
        })
}

module.exports = { create, getAll, getById, remove, update };