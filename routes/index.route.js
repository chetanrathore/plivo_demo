const express = require("express");
const router = express.Router();
const userRoute = require("./user.route");
const smsRoute = require("./sms.route");
const plivoVoiceRoute = require("./plivovoicecall.route");
const plivoCallRecordRoute = require("./plivovoicerecord.route");


const trackSmsCntrl = require('./../controllers/smstracking.controller');
const trackCallCntrl = require('./../controllers/voicecall.controller');

const plivoCtrl =  require('./../controllers/plivovoicecallapi.controller.js');

const plivoNoCtrl =  require('./../controllers/plivonumber.controller');

//Test the server
router.get('/', function(req, res) {
    res.json({ message: 'hello from api test!' });
});

//User routes
router.use('/api/user', userRoute);

router.use('/api/sms', smsRoute);

//Voice call routes
router.use('/api/plivovoicecall', plivoVoiceRoute);

//Voice call log
router.use('/api/plivovoicerecord', plivoCallRecordRoute);

// Tracking report
router.get('/api/outbound', trackSmsCntrl.getOutBoundSMSReport);

router.get('/api/inbound', trackSmsCntrl.getInBoundSMSReport);

router.get('/api/makecall', trackCallCntrl.makeCall);

router.post('/api/makecall', trackCallCntrl.create);

router.get('/api/calllog', trackCallCntrl.getCallLog);

router.get('/api/callfromdb', trackCallCntrl.getAll);

router.get('/api/filteredcalllog', trackCallCntrl.getFilteredCallLog);

router.get('/api/livecall', trackCallCntrl.getLiveCall);

router.get('/api/calldetailyid/:callId', trackCallCntrl.getDetailByCallId);

router.get('/api/recordcallbyid/:callId', trackCallCntrl.recordCallbyCallId);

router.post('/sms_status/', trackSmsCntrl.smsStatus);

router.get('/api/smslogfromdb/', trackSmsCntrl.getAllSMSLogFromDB);

router.post('/record_api/', trackCallCntrl.receiveCall);

router.get('/record_api_action/', trackCallCntrl.recordCall);

router.get('/api/recordlog/', trackCallCntrl.getCallRecordLogFromDB);

router.get('/api/voicecalllog/', trackCallCntrl.getVoiceCallLogFromDB);

//For Plivo web sdk

router.post('/make_call/', plivoCtrl.makeCall);

router.post('/get_recording/', plivoCtrl.getRecording);

router.post('/call_action/', plivoCtrl.callAction);

router.post('/hangup_call/', plivoCtrl.hangupCall);

//Plivo Endpoint

router.post('/api/plivo_app', plivoNoCtrl.createApplication);

router.post('/api/plivo_endpoint', plivoNoCtrl.createEndpoint);

router.put('/api/plivo_app/:appId', plivoNoCtrl.updateApplicationById);

router.post('/api/new_plivo_number/', plivoNoCtrl.getNewNumbers);

router.post('/api/buy_plivo_number/', plivoNoCtrl.buyNewNumber);

router.post('/api/unrent_plivo_number/', plivoNoCtrl.unrentNumber);

module.exports = router;