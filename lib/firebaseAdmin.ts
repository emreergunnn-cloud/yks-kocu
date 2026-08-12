import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve(
  /*turbopackIgnore: true*/ process.cwd(),
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH ||
    "./firebase-service-account.json"
);

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(
    `Firebase service account not found: ${serviceAccountPath}`
  );
}

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
);

const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      });

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);

export default adminApp;
