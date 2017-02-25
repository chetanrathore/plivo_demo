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
        endpointparams.app_id = "75856007428319171";
        p.create_endpoint(endpointparams, function (status, response) {
            console.log('Status: ', status);
            console.log('API Response:\n', response);

        });
    });
}

module.exports = { createApplication };
