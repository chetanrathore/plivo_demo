const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller.js");
const Joi = require("joi");
const validate = require("express-validation");

const userValidation = {
    createUser: {
        body: {
            fullName: Joi.string().required(),
            emailId: Joi.string().email().required(),
        }
    }
};

router.route('/')

    .post(validate(userValidation.createUser), userCtrl.create)

    .get(userCtrl.getAll);

router.route('/:userId')

    .get(userCtrl.getById)

    .delete(userCtrl.remove)

    .put(userCtrl.update);

module.exports = router;