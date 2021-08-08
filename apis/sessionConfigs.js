require("dotenv").config();
//session management-----------
const session = require("express-session");
const firebaseSessionStore = require("connect-session-firebase")(session);
const firebase = require("firebase-admin");
const SA = require("../configs/SAK.json");

//session management
const ref = firebase.initializeApp(
  {
    credential: firebase.credential.cert(SA),
    databaseURL: process.env.SESS_DB_URL,
  },
  "sessionStore"
);

module.exports = {
  store: new firebaseSessionStore({
    database: ref.database(),
  }),
  cookie: {
    secure: false,
    maxAge: 604800000,
  },
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
};
