const { body } = require("express-validator");
const { db } = require("../configs/firebase");

//done-users
const updateEmailValidator = [
    body("newEmail")
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Please provide a valid Email!")
    .trim()
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
    .withMessage("Password is required!"),
]

module.exports = updateEmailValidator;