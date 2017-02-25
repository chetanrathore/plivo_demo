var morgan = require('morgan');
var Promise = require('bluebird');
var mongoose = require('mongoose');
//All express config done in express.js
var app = require("./config/express");
//console.log(__dirname);
// connect to our database
mongoose.connect('mongodb://localhost/samplePlivoDB', function () {
    //for drop database
    //mongoose.connection.db.dropDatabase();
});

//Bluebird promise assign to mongoose
mongoose.Promise = Promise;

var config = require('./config/config');

module.exports = app;