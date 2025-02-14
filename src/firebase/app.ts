import { initializeApp, ServiceAccount } from 'firebase-admin/app';
import admin from 'firebase-admin';

const serviceAccount: ServiceAccount = {
  projectId: process.env.FB_PROJECT_ID,
  privateKey: process.env.FB_PRIVATE_KEY,
  clientEmail: process.env.FB_CLIENT_EMAIL,
};

const app = initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default app;
