import * as admin_source from 'firebase-admin';
import * as functions_source from 'firebase-functions';
import serviceAccount_source = require('./serviceAccountKey.json');

export const serviceAccount = serviceAccount_source;
export const databaseURL =
  'https://' + serviceAccount.project_id + '.firebaseio.com';

admin_source.initializeApp({
  credential: admin_source.credential.cert({
    clientEmail: serviceAccount_source.client_email,
    privateKey: serviceAccount_source.private_key,
    projectId: serviceAccount_source.project_id,
  }),
  databaseURL,
});

export const db = admin_source.firestore();
export const functions = functions_source;
export const admin = admin_source;
