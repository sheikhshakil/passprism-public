require("dotenv").config();
const { db } = require("../configs/firebase");
const { encrypt } = require("../apis/encrypt");
const { decrypt } = require("../apis/decrypt");
const { validationResult } = require("express-validator");
const formatter = require("../apis/validationFormatter");
const admin = require("firebase-admin");
//mailer
const createTransporter = require("../apis/mailSender");

//done-users
exports.savePasswordController = (req, res, next) => {
  //get the values
  const { genPassword, note } = req.body;
  let errors = validationResult(req).formatWith(formatter);
  if (!errors.isEmpty()) {
    //there are errors
    errors = errors.mapped();
    return res.render("pages/panel.ejs", {
      errors,
      values: { genPassword, note },
    });
  } else {
    const user = req.session.user;

    let plainNote = note.split(" ");
    let encryptedNoteTags = [];

    plainNote.forEach((word) => {
      encryptedNoteTags.push(encrypt(word));
    });

    const dataObject = {
      savedPass: encrypt(genPassword),
      relatedNote: encrypt(note),
      savedOn: new Date(),
      tags: encryptedNoteTags,
    };

    const saveLocationRef = db.collection("users").doc(user.email); //-------!!!--------

    saveLocationRef
      .update({
        savedPasswords: admin.firestore.FieldValue.arrayUnion(dataObject),
      })
      .then(() => {
        res.render("pages/panel.ejs", { showCreate: true, vaultSuccess: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

//done-users
exports.updateEmailController = (req, res) => {
  const { newEmail, password } = req.body;
  let errors = validationResult(req).formatWith(formatter);
  if (!errors.isEmpty()) {
    //there are errors
    errors = errors.mapped();
    return res.render("pages/updateDetails.ejs", {
      title: "Update email",
      update: "email",
      errors,
      values: { newEmail },
    });
  } else {
    let oldData;
    //get old data
    let oldDocRef = db.collection("users").doc(req.session.user.email);
    oldDocRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          oldData = doc.data();
          if (password == decrypt(oldData.password)) {
            //pass match
            // set new email & copy old data
            oldData.email = newEmail;
            const newData = oldData;

            //write new data
            let newDocRef = db.collection("users").doc(newEmail);
            newDocRef
              .set(newData)
              .then(() => {
                oldDocRef
                  .delete()
                  .then(() => {
                    //change session email
                    req.session.user.email = newEmail;
                    //send success response
                    res.render("pages/panel.ejs", {
                      showProfile: true,
                      updateSuccess: "Successfully updated your email.",
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            return res.render("pages/updateDetails.ejs", {
              title: "Update email",
              update: "email",
              error: "Your given password doesn't match with database!",
              values: { newEmail },
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

//done-users
exports.changeAccPassController = (req, res) => {
  const { oldPass, newPass } = req.body;
  let errors = validationResult(req).formatWith(formatter);
  if (!errors.isEmpty()) {
    //there are errors
    errors = errors.mapped();
    return res.render("pages/updateDetails.ejs", {
      title: "Change account password",
      update: "pass",
      errors,
      values: { oldPass, newPass },
    });
  } else {
    //get user data
    let docRef = db.collection("users").doc(req.session.user.email);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          let userData = doc.data();

          //match old pass
          if (oldPass == decrypt(userData.password)) {
            docRef
              .set({ password: encrypt(newPass) }, { merge: true }) //set new pass
              .then(() => {
                //success
                res.render("pages/panel.ejs", {
                  showProfile: true,
                  updateSuccess: "Successfully changed your account password.",
                });
              })
              .catch((err) => {
                console.log(err);
              });
          } else {

            //old pass doesn't match
            return res.render("pages/updateDetails.ejs", {
              title: "Change account password",
              update: "pass",
              error: "Old password is wrong!",
              values: { newPass },
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};


//resetVaultPass controller
exports.resetVaultPassGetController = (req, res) => {
  if (!req.session.user.requestedVaultPassReset) {
    const verCode = Math.floor(100000 + Math.random() * 900000).toString();

    const data = {
      code: encrypt(verCode),
      reason: "VaultPassReset",
      createdOn: new Date(),
    };

    let codeRef = db
      .collection("verCodesVaultPass")
      .doc(req.session.user.email);
    codeRef
      .set(data)
      .then(() => {
        let mailOptions = {
          from: process.env.EMAIL,
          to: req.session.user.email,
          subject: "Regarding vault password reset",

          text:
            "Hi " +
            req.session.user.fullName +
            ",\nHopefully you requested to reset your PassPrism vault password.\nThe verification code is " +
            verCode +
            ".\nUse it to reset your vault password.",
        };

        const sendEmail = async () => {
          let transporter = await createTransporter();
          await transporter.sendMail(mailOptions);
        };

        sendEmail(mailOptions); //send mail command

        req.session.user.requestedVaultPassReset = true;

        res.render("pages/updateDetails.ejs", {
          title: "Reset vault password",
          update: "vaultPass",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.render("pages/updateDetails.ejs", {
      title: "Reset vault password",
      update: "vaultPass",
    });
  }
};
