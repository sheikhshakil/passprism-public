const { body } = require("express-validator");

const savePassValidator = [
  body("genPassword")
    .not()
    .isEmpty()
    .withMessage("This field is required!")
    .isAscii()
    .withMessage("Must use English to avoid encryption errors!"),
  body("note")
    .trim()
    .not()
    .isEmpty()
    .withMessage("This field is required!")
    .isAscii()
    .withMessage("Must use English to avoid encryption errors!"),
];

module.exports = savePassValidator;
