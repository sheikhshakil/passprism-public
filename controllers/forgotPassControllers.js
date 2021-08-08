const { db } = require("../configs/firebase");
const { encrypt } = require("../apis/encrypt");
const { decrypt } = require("../apis/decrypt");
const { validationResult } = require("express-validator");
const formatter = require("../apis/validationFormatter");
//mailer
const createTransporter = require("../apis/mailSender");

exports.forgotPassGet = (req, res) => {
  res.render("pages/forgotPass.ejs");
};

exports.forgotPassSendCode = (req, res) => {
  //if user is logged in
  if (req.session.user) {
    if (!req.session.user.requestedAccPassReset) {
      const verCode = Math.floor(100000 + Math.random() * 900000).toString();

      const data = {
        code: encrypt(verCode),
        reason: "AccPassReset",
        createdOn: new Date(),
      };

      let codeRef = db
        .collection("verCodesAccPass")
        .doc(req.session.user.email);

      codeRef.set(data).then(() => {
        let mailOptions = {
          from: process.env.EMAIL,
          to: req.session.user.email,
          subject: "Regarding account password reset",

          text:
            "Hi " +
            req.session.user.fullName +
            ",\nHopefully you requested to reset your PassPrism account password.\nThe verification code is " +
            verCode +
            ".\nUse it to reset your account password.",
        };

        const sendEmail = async () => {
          let transporter = await createTransporter();
          await transporter.sendMail(mailOptions);
        };

        sendEmail(mailOptions); //send mail command

        req.session.user.requestedAccPassReset = true;

        res.send("Code sent!");
      });
    } else {
      res.send("Code already sent!");
    }
  } else {
    //if user is not logged in
    const { email } = req.body;
    let errors = validationResult(req).formatWith(formatter);
    if (!errors.isEmpty()) {
      //there are errors
      errors = errors.mapped();
      return res.render("pages/forgotPass.ejs", {
        errors,
        values: { email },
      });
    } else {
      //for avoiding undefined error
      if (req.session.recover) {
        if (req.session.recover.userEmail == email) {
          //if user has requested for a code before
          return res.render("pages/forgotPass.ejs", { ongoing: true });
        } else {
          //new request
          //all validations successful
          const verCode = Math.floor(
            100000 + Math.random() * 900000
          ).toString();

          const data = {
            code: encrypt(verCode),
            reason: "AccPassReset",
            createdOn: new Date(),
          };

          let codeRef = db.collection("verCodesAccPass").doc(email);

          codeRef.set(data).then(() => {
            let mailOptions = {
              from: process.env.EMAIL,
              to: email,
              subject: "Regarding account password reset",

              text:
                "Hello PassPrism user,\nHopefully you requested to reset your account password.\nThe verification code is " +
                verCode +
                ".\nUse it to reset your account password.",
            };

            const sendEmail = async () => {
              let transporter = await createTransporter();
              await transporter.sendMail(mailOptions);
            };

            sendEmail(mailOptions); //send mail command

            req.session.recover = {
              userEmail: email,
            };

            console.log(req.session.recover);
            res.render("pages/forgotPass.ejs", { ongoing: true });
          });
        }
      } else {
        //new request
        //all validations successful
        const verCode = Math.floor(100000 + Math.random() * 900000).toString();

        const data = {
          code: encrypt(verCode),
          reason: "AccPassReset",
          createdOn: new Date(),
        };

        let codeRef = db.collection("verCodesAccPass").doc(email);

        codeRef.set(data).then(() => {
          let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Regarding account password reset",

            text:
              "Hello PassPrism user,\nHopefully you requested to reset your account password.\nThe verification code is " +
              verCode +
              ".\nUse it to reset your account password.",
          };

          const sendEmail = async () => {
            let transporter = await createTransporter();
            await transporter.sendMail(mailOptions);
          };

          sendEmail(mailOptions); //send mail command

          req.session.recover = {
            userEmail: email,
          };

          res.render("pages/forgotPass.ejs", { ongoing: true });
        });
      }
    }
  }
};

exports.resetAccPassAuth = (req, res) => {
  const { verCode, newPass } = req.body;
  let errors = validationResult(req).formatWith(formatter);
  if (!errors.isEmpty()) {
    //there are errors
    errors = errors.mapped();
    return res.render("pages/forgotPass.ejs", {
      ongoing: true,
      errors,
      values: { verCode },
    });
  } else {
    if (req.session.user) {
      let userEmail = req.session.user.email;
      const codeRef = db.collection("verCodesAccPass").doc(userEmail);

      codeRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            let data = doc.data();
            if (verCode == decrypt(data.code)) {
              //set new pass here
              db.collection("users")
                .doc(userEmail)
                .set({ password: encrypt(newPass) }, { merge: true })
                .then(() => {
                  req.session.user.requestedAccPassReset = undefined;
                  res.render("pages/panel.ejs", {
                    showProfile: true,
                    updateSuccess: "Reset of account password is successful.",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              return res.render("pages/forgotPass.ejs", {
                ongoing: true,
                error: "Wrong verification code.",
                values: { verCode },
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (req.session.recover) {
      //if user isn't logged in
      let userEmail = req.session.recover.userEmail;
      const codeRef = db.collection("verCodesAccPass").doc(userEmail);

      codeRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            let data = doc.data();
            if (verCode == decrypt(data.code)) {
              //set new pass here
              db.collection("users")
                .doc(userEmail)
                .set({ password: encrypt(newPass) }, { merge: true })
                .then(() => {
                  req.session = null;
                  //reset success
                  res.redirect('/login?resetSuccess=true');
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              return res.render("pages/forgotPass.ejs", {
                ongoing: true,
                error: "Wrong verification code.",
                values: { verCode },
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
