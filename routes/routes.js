const router = require("express").Router();
const regValidator = require("../validators/regValidator");
const loginValidator = require("../validators/loginValidator");
const savePassValidator = require("../validators/savePassValidator");
const updateEmailValidator = require("../validators/updateEmailValidator");
const vaultPassValidator = require("../validators/vaultPassValidator");
const accPassValidator = require("../validators/changeAccPassValidator");
const sendCodeEmailValidator = require("../validators/sendCodeEmailValidator");

const {
  regPostController,
  loginPostController,
  logoutController,
} = require("../controllers/authControllers");
const {
  savePasswordController,
  updateEmailController,
  changeAccPassController,
  resetVaultPassGetController,
} = require("../controllers/panelControllers");

const {
  setVaultPass,
  resetVaultPass,
  showVaultData,
  deletePass,
} = require("../controllers/vaultControllers");

const {
  forgotPassGet,
  forgotPassSendCode,
  resetAccPassAuth,
} = require("../controllers/forgotPassControllers");

const isAuth = require("../middlewares/isAuthenticated");
const isUnauth = require("../middlewares/isUnauthenticated");

//login get & post------------
router.get("/login", isUnauth(), (req, res) => {
  if (req.query.resetSuccess) {
    res.render("pages/login.ejs", { resetSuccess: true });
  } else {
    res.render("pages/login.ejs");
  }
});
router.post("/login", isUnauth(), loginValidator, loginPostController);

//logout get
router.get("/logout", isAuth(), logoutController);

//register get & post---------
router.get("/register", isUnauth(), (req, res) => {
  res.render("pages/register.ejs");
});
router.post("/register", isUnauth(), regValidator, regPostController);

//secured get & post----------
router.get("/panel", isAuth(), (req, res) => {
  res.render("pages/panel.ejs");
});
router.get("/updateDetails", isAuth(), (req, res, next) => {
  if (req.query.email) {
    res.render("pages/updateDetails.ejs", {
      title: "Update email",
      update: "email",
    });
  } else if (req.query.pass) {
    res.render("pages/updateDetails.ejs", {
      title: "Change account password",
      update: "pass",
    });
  } else if (req.query.vaultPass) {
    resetVaultPassGetController(req, res);
  } else {
    let error = new Error("Page not found!");
    error.status = 404;
    next(error);
  }
});

router.post("/savePass", isAuth(), savePassValidator, savePasswordController);
router.post("/setVaultPass", isAuth(), vaultPassValidator, setVaultPass);
router.post("/resetVaultPass", isAuth(), vaultPassValidator, resetVaultPass);
router.post("/showVaultData", isAuth(), showVaultData);
router.post("/deletePass", isAuth(), deletePass);

//update details
//email update
router.post(
  "/updateEmail",
  isAuth(),
  updateEmailValidator,
  updateEmailController
);

//password change
router.post(
  "/changeAccPass",
  isAuth(),
  accPassValidator,
  changeAccPassController
);

//forgotPass
router.get("/forgotPass", forgotPassGet);
router.get("/forgotPassSendCode", forgotPassSendCode);
router.post("/forgotPassSendCode", sendCodeEmailValidator, forgotPassSendCode);
router.post("/resetAccPassAuth", accPassValidator, resetAccPassAuth);

router.get("/privacy-policy", (req, res) => {
  res.render("pages/privacy-policy.ejs");
});

//home get-----------
router.get("/", isUnauth(), (req, res) => {
  res.render("pages/home.ejs");
});

module.exports = router;
