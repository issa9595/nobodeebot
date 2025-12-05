const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  console.error("Erreur lors de l'initialisation de Firebase Admin:", error);
}

exports.db = admin.firestore();
