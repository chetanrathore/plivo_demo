/**
 * Created by LaNet on 3/8/17.
 */
const express = require("express");
const router = express.Router();
const plivoRecordCtrl = require("../controllers/plivocallrecord.controller");

router.route('/')

    .post(plivoRecordCtrl.create)

    .get(plivoRecordCtrl.getAll)

    .delete(plivoRecordCtrl.remove);

router.route('/:callUUId')

    .get(plivoRecordCtrl.getByCallUUId);

module.exports = router;