const { body } = require("express-validator");
const { db } = require("../configs/firebase");

const sendCodeEmailValidator = [
  body("email")
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Please provide a valid Email!")
    .toLowerCase()
    .custom((value) => {
      // checking email existence
      let docRef = db.collection("users").doc(value); //----------------!!!!!!!!------------------
      return docRef.get().then((doc) => {
        if (!doc.exists) {
          return Promise.reject("Sorry, can't process your request at this moment!");
        }
      });
    }),
];

module.exports = sendCodeEmailValidator;
