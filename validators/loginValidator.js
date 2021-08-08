const { body } = require("express-validator");

const loginValidator = [
  body("email")
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Enter a valid Email!")
    .toLowerCase(),
  body("password").not().isEmpty().withMessage("Password can't be empty!"),
];

module.exports = loginValidator;
