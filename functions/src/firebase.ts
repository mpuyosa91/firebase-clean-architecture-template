import * as admin from 'firebase-admin';

let serviceAccount: any = null;

export async function getServiceAccount() {
  if (!serviceAccount) {
    serviceAccount = await import('./serviceAccountKey.json');
  }
  return serviceAccount;
}

let databaseURL: string | null = null;

export async function getDatabaseUrl(): Promise<string> {
  if (!databaseURL) {
    const serviceAccountSource = await getServiceAccount();
    databaseURL = 'https://' + serviceAccountSource.project_id + '.firebaseio.com';
  }

  return databaseURL;
}

let adminApp: admin.app.App | null = null;

export async function getAdminApp(): Promise<admin.app.App> {
  if (!adminApp) {
    const serviceAccountSource = await getServiceAccount();
    adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        clientEmail: serviceAccountSource.client_email,
        privateKey: serviceAccountSource.private_key,
        projectId: serviceAccountSource.project_id,
      }),
      databaseURL: await getDatabaseUrl(),
      storageBucket: serviceAccountSource.project_id + '.appspot.com',
    });
  }

  return adminApp;
}

let firebaseAuth: admin.auth.Auth | null = null;

export async function getFirebaseAuth(): Promise<admin.auth.Auth> {
  if (!firebaseAuth) {
    firebaseAuth = (await getAdminApp()).auth();
  }

  return firebaseAuth;
}

let firestoreDB: admin.firestore.Firestore | null = null;

export async function getDB(): Promise<admin.firestore.Firestore> {
  if (!firestoreDB) {
    firestoreDB = (await getAdminApp()).firestore();
  }

  return firestoreDB;
}

let realtimeDB: admin.database.Database | null = null;

export async function getRealtimeDB(): Promise<admin.database.Database> {
  if (!realtimeDB) {
    realtimeDB = (await getAdminApp()).database();
  }

  return realtimeDB;
}

let firestoreDbBatch: FirebaseFirestore.WriteBatch | null = null;

export async function getDbBatch(): Promise<FirebaseFirestore.WriteBatch> {
  if (!firestoreDbBatch) {
    firestoreDbBatch = (await getDB()).batch();
  }

  return firestoreDbBatch;
}

let firebaseStorage: admin.storage.Storage | null = null;

export async function getFirebaseStorage(): Promise<admin.storage.Storage> {
  if (!firebaseStorage) {
    firebaseStorage = (await getAdminApp()).storage();
  }

  return firebaseStorage;
}

export const firebaseInitialization = new Promise(async (resolve: any, reject: any) => {
  try {
    await getAdminApp();
    const allPromises: Promise<any>[] = [];
    allPromises.push(getFirebaseAuth());
    allPromises.push(getDB());
    allPromises.push(getRealtimeDB());
    allPromises.push(getFirebaseStorage());
    await Promise.all(allPromises);

    resolve('');
  } catch (e) {
    reject(e);
  }
  return;
});
