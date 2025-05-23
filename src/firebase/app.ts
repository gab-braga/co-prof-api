import { initializeApp } from 'firebase-admin/app';
import admin from 'firebase-admin';

const credentialsBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 as string;
const credentialsDecoded = Buffer.from(credentialsBase64, "base64").toString("utf-8");
const serviceAccount = JSON.parse(credentialsDecoded);

const app = initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export default app;
