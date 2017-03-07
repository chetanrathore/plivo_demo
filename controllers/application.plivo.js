/**
 * Created by LaNet on 2/25/17.
 */
const User = require("../models/user.model");

//For SMS
var config = require('./../config/config');
var plivo = require('plivo');

var p = plivo.RestAPI({
    authId: config.authId,
    authToken: config.authToken
});

function createApplication(req, res, next) {
    var params = {};
    params.answer_url = "http://plivodirectdial.herokuapp.com/response/sip/route/?DialMusic=real&CLID=+917878499987";
    params.app_name = "Test API";
    p.create_application(params, function (status, response) {
        console.log(response);
        var endpointparams = {};
        endpointparams.username = "testuser";
        endpointparams.password = "test123";
        endpointparams.alias = "Test";
        endpointparams.app_id = response.app_id;
        p.create_endpoint(endpointparams, function (status, response) {
            console.log('Status: ', status);
            console.log('API Response:\n', response);
        });
    });
}

function getApplicationById(req, res, next) {
    var params = {
        'app_id': req.params.appId
    };
    p.get_application(params, function (status, response) {
        return res.json({ status: status, data: response });
    });
}

function updateApplicationById(req, res, next) {
    var params = {};
    params.app_id = "23207307156461887";
    params.answer_url = "http://plivodirectdial.herokuapp.com/response/sip/route/?DialMusic=real&CLID=+917878499987";
    p.modify_application(params, function (status, response) {
        return res.json({ status: status, data: response });
    });
}


module.exports = { createApplication, getApplicationById, updateApplicationById };
