const { db } = require("../configs/firebase");
const { encrypt } = require("../apis/encrypt");
const { decrypt } = require("../apis/decrypt");
const { validationResult } = require("express-validator");
const validationFormatter = require("../apis/validationFormatter");

//done-users
exports.setVaultPass = (req, res) => {
  const { vaultPass } = req.body;
  let errors = validationResult(req).formatWith(validationFormatter);

  if (!errors.isEmpty()) {
    errors = errors.mapped();
    return res.render("pages/panel.ejs", { showVault: true, errors });
  } else {
    const docRef = db.collection("users").doc(req.session.user.email);

    docRef
      .set(
        {
          vaultPass: encrypt(vaultPass),
        },
        { merge: true }
      )
      .then(() => {
        req.session.user.vaultPass = encrypt(vaultPass);
        res.render("pages/panel.ejs", { showVault: true });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

//done-users
exports.resetVaultPass = (req, res) => {
  const { verCode, vaultPass } = req.body;
  let errors = validationResult(req).formatWith(validationFormatter);

  if (!errors.isEmpty()) {
    errors = errors.mapped();
    return res.render("pages/updateDetails.ejs", {
      title: "Reset vault password",
      update: "vaultPass",
      errors,
      values: { verCode, vaultPass },
    });
  } else {
    db.collection("verCodesVaultPass")
      .doc(req.session.user.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();

          if (data.reason == "VaultPassReset") {
            if (verCode == decrypt(data.code)) {
              //update vault pass here
              req.session.user.vaultPass = encrypt(vaultPass);
              db.collection("users")
                .doc(req.session.user.email)
                .set(
                  {
                    vaultPass: encrypt(vaultPass),
                  },
                  { merge: true }
                )
                .then(() => {
                  req.session.user.requestedVaultPassReset = undefined
                  res.render("pages/panel.ejs", {
                    showProfile: true,
                    updateSuccess: "Reset of vault password is successful!",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              res.render("pages/updateDetails.ejs", {
                title: "Reset vault password",
                update: "vaultPass",
                error: "Wrong verification code!",
                values: { verCode, vaultPass },
              });
            }
          } else {
            res.render("pages/updateDetails.ejs", {
              title: "Reset vault password",
              update: "vaultPass",
              error: "Wrong verification code!",
              values: { verCode, vaultPass },
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
exports.showVaultData = (req, res) => {
  const { vaultPass } = req.body;
  if (vaultPass == decrypt(req.session.user.vaultPass)) {
    db.collection("users")
      .doc(req.session.user.email)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let userData = doc.data().savedPasswords;
          userData.forEach((data) => {
            data.relatedNote = decrypt(data.relatedNote);
            data.savedPass = decrypt(data.savedPass);
          });

          res.render("pages/panel.ejs", {
            userData,
            shownData: true,
            showVault: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.render("pages/panel.ejs", {
      showVault: true,
      error: "Wrong vault password! If you forgot it, reset it from profile.",
    });
  }
};

//done-users
exports.deletePass = (req, res) => {
  let { deleteIndex, deleteNote } = req.body;
  deleteIndex = parseInt(deleteIndex);
  let tempArray = [];

  const dataRef = db.collection("users").doc(req.session.user.email);
  dataRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        let savedData = doc.data().savedPasswords;
        savedData.forEach((data, i) => {
          if (i != deleteIndex) {
            tempArray.push(data);
          }
        });

        dataRef
          .set({ savedPasswords: tempArray }, { merge: true })
          .then(() => {
            tempArray.forEach((data) => {
              data.savedPass = decrypt(data.savedPass);
              data.relatedNote = decrypt(data.relatedNote);
            });

            res.render("pages/panel.ejs", {
              showVault: true,
              shownData: true,
              userData: tempArray,
              deleteSuccess: true,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
