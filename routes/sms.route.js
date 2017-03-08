const express = require("express");
const router = express.Router();
const smsCtrl = require("../controllers/sms.controller.js");

router.route('/')

    .post(smsCtrl.create)

    .get(smsCtrl.getAll);

router.route('/:smsId')

    .get(smsCtrl.getDetailSMSId);

router.route('/UserMessage/:userId')

    .get(smsCtrl.getAllSMSByUser);

module.exports = router;