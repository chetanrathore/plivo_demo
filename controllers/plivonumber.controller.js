/**
 * Created by LaNet on 3/8/17.
 */

const User = require("../models/user.model");
var config = require('./../config/config');
var plivo = require('plivo');
var shortid = require('shortid');

var p = plivo.RestAPI({
    authId: config.authId,
    authToken: config.authToken
});

function createApplication(req, res, next) {
    var params = {};
    params.answer_url = config.tmpServer + "/make_call/";
    params.app_name = "VIF-" + shortid.generate();

    p.create_application(params, function (status, response) {
        console.log(response);
        res.send({ status: status, response: response });
    });
}

function createEndpoint(req, res, next) {
    var endpointparams = {};
    endpointparams.username = "testuser";
    var pwd = shortid.generate();
    console.log(pwd);
    endpointparams.password = pwd;//BJ9TmY05e//
    endpointparams.alias = "Test";
    p.create_endpoint(endpointparams, function (status, response) {
        console.log('Status: ', status);
        console.log('API Response:\n', response);
        res.send({ status: status, response: response });
    });
}

// "username": "zumba131031145958",
//     "alias": "zumba",
//     "message": "created",
//     "endpoint_id": "37371860103666",
//     "api_id": "1c13de4c-423d-11e3-9899-22000abfa5d5"

//Endpoint detail from plivo
function getEndPointById(req, res, next) { //26537872391771
    var endpointparams = {};
    endpointparams.endpoint_id = "26537872391771";
    p.get_endpoint(endpointparams, function (status, response) {
        res.send({ status: status, response: response });
    });
}

//Link application to endpoint
function linkAppToEndpoint(req, res, next) {
    var params = {};
    params.number = '';
    params.app_id = '';
    p.link_application_number(params, function (status, response) {
        res.send({ status: status, response: response });
    });
}

// Unlink application from app
function unlinkAppFromEndpoint(req, res, next) {
    var params = {};
    params.number = '';
    p.unlink_application_number(params, function (status, response) {
        res.send({ status: status, response: response });
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

// For plivo number
function getNewNumbers(req, res, next) {
    var params = {};
    // The ISO code A2 of the country
    params.country_iso = 'US';
    // The type of number you are looking for. The possible number types are local, national and tollfree.
    params.type = 'local';
    // Represents the pattern of the number to be searched.
    params.pattern = '210';
    // This filter is only applicable when the number_type is local. Region based filtering can be performed.
    params.region = 'Texas';
    p.search_phone_numbers(params, function (status, response) {
        return res.json({ status: status, data: response });
    });
}

function buyNewNumber(req, res, next) {
     var params = {};
     params.number = '12106706640';
     p.buy_phone_number(params, function (status, response) {
         return res.json({ status: status, data: response });
     });
}

function unrentNumber(req, res, next) {
    var params = {};
    params.number = '12106706640';
    p.unrent_number(params, function (status, response) {
        return res.json({ status: status, data: response });
    });
}

module.exports = { createApplication,
    createEndpoint, getEndPointById, linkAppToEndpoint, unlinkAppFromEndpoint,  updateApplicationById,
    getNewNumbers, buyNewNumber, unrentNumber };
