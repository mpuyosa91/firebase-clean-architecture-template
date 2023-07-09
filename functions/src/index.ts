import { Application, CollectionNames, IController } from 'appbackend';
import { FirestoreGenericObjectPersistenceDriverFactory } from './jsonPersistence/FirestoreGenericObjectPersistenceDriverFactory';
import { AlgoliaGenericObjectSearchEngineDriverFactory } from './searchEngine/AlgoliaGenericObjectSearchEngineDriverFactory';
import { FirebaseAuthUserIdentificationExternalInterfaceDriver } from './userIdentification/FirebaseAuthUserIdentificationExternalInterfaceDriver';
import { FirebaseEmailSenderExternalInterfaceDriver } from './emailSender/FirebaseEmailSenderExternalInterfaceDriver';
import { FirebaseCloudFunctionsHelper } from './jsonPresenter/FirebaseCloudFunctionsHelper';

import * as functions from 'firebase-functions';

/**
 * Blue Layer: Frameworks & Drivers
 * By View Type, Service or Entity Family
 * Name Convention
 * Classes: {Technology}{ViewType}{UI|WebServer|<Others>}Framework <Blue Layer>
 * Classes: {Technology}{Service}{ExternalInterface|<Others>}Driver <Blue Layer>
 * Classes: {Technology}{Entity}{Persistence|SearchEngine|<Others>}Driver <Blue Layer>
 */

const firebaseCloudFunctions = FirebaseCloudFunctionsHelper.getInstance();
const app = Application.getInstance();

app.initialize(
  firebaseCloudFunctions,
  new FirebaseAuthUserIdentificationExternalInterfaceDriver(),
  new FirebaseEmailSenderExternalInterfaceDriver(),
  new FirestoreGenericObjectPersistenceDriverFactory(),
  new AlgoliaGenericObjectSearchEngineDriverFactory()
);

export const genericUser = firebaseCloudFunctions.generateHttpsOnRequest(
  { timeoutSeconds: 540, memory: '256MB' },
  app.getGenericUserController() as unknown as IController
);

export const admin = firebaseCloudFunctions.generateHttpsOnRequest(
  { timeoutSeconds: 540, memory: '256MB' },
  app.getAdminController() as unknown as IController
);

export const onWriteUser = firebaseCloudFunctions.generateOnWrite(
  `${CollectionNames.USERS}/{objectId}`,
  app.getGenericUserController() as unknown as IController
);

export const onCreateUserIdentification = firebaseCloudFunctions.generateUserOnCreate(
  app.getGenericUserController() as unknown as IController
);

export const onDeleteUserIdentification = firebaseCloudFunctions.generateUserOnDelete(
  app.getGenericUserController() as unknown as IController
);

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});
