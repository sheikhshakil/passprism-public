const admin = require("firebase-admin");
const SA = require("./SAK.json");

admin.initializeApp({
  credential: admin.credential.cert(SA),
});

exports.db = admin.firestore();
