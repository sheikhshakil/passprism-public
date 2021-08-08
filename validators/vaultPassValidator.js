const { body } = require("express-validator");

const vaultPassValidator = [
  body("vaultPass")
    .not()
    .isEmpty()
    .isLength({ min: 4, max: 10 })
    .withMessage("Minimum 4-10 characters required!")
    .isAscii()
    .withMessage("Must use English to avoid encryption errors!"),
];

module.exports = vaultPassValidator;
