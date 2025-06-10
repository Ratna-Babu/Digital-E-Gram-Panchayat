import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
try {
  // Check if already initialized to prevent multiple initializations
  if (!admin.apps.length) {
    // For production, use environment variables
    if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)),
      });
    } 
    // For local development, use service account file
    else {
      const serviceAccount = require('../../serviceAccountKey.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }
} catch (error) {
  console.error('Firebase admin initialization error:', error);
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();

export default admin; 