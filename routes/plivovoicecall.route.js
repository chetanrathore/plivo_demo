const express = require("express");
const router = express.Router();
const plivoCallCtrl = require("../controllers/plivovoicecall.controller");

router.route('/')

    .post(plivoCallCtrl.create)

    .get(plivoCallCtrl.getAll)

    .put(plivoCallCtrl.update)

    .delete(plivoCallCtrl.remove);

router.route('/:callUUId')

    .get(plivoCallCtrl.getByCallUUId);

module.exports = router;