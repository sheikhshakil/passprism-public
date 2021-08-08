//validation
const { validationResult } = require("express-validator");
const formatter = require("../apis/validationFormatter");
//model
const user = require("../models/user");
const { db } = require("../configs/firebase"); //firestore db
const { encrypt } = require("../apis/encrypt");
const { decrypt } = require("../apis/decrypt");

//registration
exports.regPostController = (req, res) => {
  const { fullName, email, password } = req.body;
  //validation error gathering
  let errors = validationResult(req).formatWith(formatter);
  const uid = Math.floor(Math.random() * 100000000000000 + 1);

  if (!errors.isEmpty()) {
    //there are errors
    errors = errors.mapped();
    return res.render("pages/register.ejs", {
      errors,
      values: { fullName, email, password },
    });
  } else {
    //if no errors in validation
    user.uid = uid.toString();
    user.fullName = fullName;
    user.email = email;
    user.password = encrypt(password);
    user.savedPasswords = [];
    user.joinedOn = new Date();
    user.vaultPass = "";

    //save in db-------------change collection to 'users' before release
    db.collection("users") //----------------!!!!!!!!------------------
      .doc(user.email)
      .set(user)
      .then(() => {
        const userInfo = {
          uid: user.uid,
          fullName: user.fullName,
          email: user.email,
          joinedOn: {
            _seconds: Date.parse(user.joinedOn) / 1000,
          },
          vaultPass: user.vaultPass,
        };

        //------------create session here
        req.session.isLoggedIn = true;
        req.session.user = userInfo;
        res.redirect("/panel");
      })
      .catch((error) => {
        console.log(error);
      });
    //save in db-------------
  }
};

// Login
exports.loginPostController = (req, res) => {
  //getting form data
  let { email, password } = req.body;

  let errors = validationResult(req).formatWith(formatter); //gathering val. errors

  if (!errors.isEmpty()) {
    errors = errors.mapped();
    return res.render("pages/login.ejs", {
      errors,
      values: { email, password },
    });
  } else {
    //no validation errors
    //reading user from firebase db
    email = email.toLowerCase();
    let docRef = db.collection("users").doc(email); //----------------!!!!!!!!------------------

    docRef
      .get()
      .then((doc) => {
        //if user found
        if (doc.exists) {
          const user = doc.data();
          //checking password
          const plainText = decrypt(user.password);

          if (password == plainText) {
            // user is authenticated
            const userInfo = {
              uid: user.uid,
              fullName: user.fullName,
              email: user.email,
              joinedOn: user.joinedOn,
              vaultPass: user.vaultPass,
            };

            //---------create session here----
            req.session.isLoggedIn = true;
            req.session.user = userInfo;
            res.redirect("/panel");
          } else {
            //user not authenticated
            res.render("pages/login.ejs", { error: "Wrong credentials!" });
          }
        } else {
          //if user not found
          res.render("pages/login.ejs", { error: "Wrong credentials!" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.logoutController = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500);
    } else {
      res.redirect("/login");
    }
  });
};
