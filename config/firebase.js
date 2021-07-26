let admin = require("firebase-admin");
let firebase = require("firebase").default;
let { fbServiceAccountKey } = require("./fbServiceAccountKey");

admin.initializeApp({
  credential: admin.credential.cert(fbServiceAccountKey),
  databaseURL: "https://sluqe-7977c-default-rtdb.firebaseio.com",
});

exports.admin = admin; // for the backend application to use
