const { body } = require("express-validator");

const accPassValidator = [
  body("newPass")
    .not()
    .isEmpty()
    .isLength({ min: 5, max: 15 })
    .withMessage("Please provide a password of 5 to 15 characters!")
    .isAscii()
    .withMessage("Must use English to avoid encryption errors!"),
];

module.exports = accPassValidator;
