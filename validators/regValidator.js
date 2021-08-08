const { body } = require("express-validator");
const { db } = require("../configs/firebase");

//done-users
const regValidator = [
  body("fullName")
    .trim()
    .not()
    .isEmpty()
    .not()
    .isInt()
    .withMessage("Please provide your name!"),
  body("email")
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Please provide a valid Email!")
    .toLowerCase()
    .custom((value) => {
      // checking email existence
      value = value.toLowerCase(); //converting to lowercase
      let docRef = db.collection("users").doc(value); //----------------!!!!!!!!------------------
      return docRef.get().then((doc) => {
        if (doc.exists) {
          return Promise.reject("Email already exists!");
        }
      });
    }),
  body("password")
    .not()
    .isEmpty()
    .isLength({ min: 5, max: 15 })
    .withMessage("Please provide a password of 5 to 15 characters!")
    .isAscii()
    .withMessage("Must use English to avoid encryption errors!"),
];

module.exports = regValidator;
