import firebaseAdmin from "firebase-admin";
import serviceAccountKey from '../campus-space-01-firebase-adminsdk-fbsvc-864f73cdf1.json' with { type: "json" };

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccountKey)
});

export default firebaseAdmin;
