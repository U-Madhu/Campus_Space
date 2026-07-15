import firebaseAdmin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccountKey = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (err) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env variable:", err.message);
    }
} else {
    // Load local file for development if it exists
    try {
        const filePath = path.resolve(__dirname, "../campus-space-01-firebase-adminsdk-fbsvc-864f73cdf1.json");
        if (fs.existsSync(filePath)) {
            serviceAccountKey = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }
    } catch (err) {
        console.error("Local Firebase Service Account file loading failed:", err.message);
    }
}

if (serviceAccountKey) {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccountKey)
    });
} else {
    console.warn("Firebase Admin failed to initialize: No credentials found (this is normal if you don't use Google Auth in production).");
}

export default firebaseAdmin;
