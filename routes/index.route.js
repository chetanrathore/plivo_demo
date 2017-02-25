const express = require("express");
const router = express.Router();
const userRoute = require("./user.route");
const smsRoute = require("./sms.route");

const trackSmsCntrl = require('./../controllers/smstracking.controller');
const trackCallCntrl = require('./../controllers/voicecall.controller');
const appCtrl = require('./../controllers/application.plivo');

//User routes
router.use('/api/user', userRoute);

//User routes
router.use('/api/sms', smsRoute);

//Test the server
router.get('/', function(req, res) {
    res.json({ message: 'hello from api test!' });
});

// Tracking report
router.get('/api/outbound', trackSmsCntrl.getOutBoundSMSReport);

router.get('/api/inbound', trackSmsCntrl.getInBoundSMSReport);

router.get('/api/makecall', trackCallCntrl.makeCall);

router.get('/api/calllog', trackCallCntrl.getCallLog);

router.get('/api/filteredcalllog', trackCallCntrl.getFilteredCallLog);

router.get('/api/endcall', trackCallCntrl.testCallBack);

router.get('/api/livecall', trackCallCntrl.getLiveCall);

router.get('/api/app', appCtrl.createApplication);

module.exports = router;