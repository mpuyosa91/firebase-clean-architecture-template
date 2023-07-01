import * as functions from 'firebase-functions';
import { firebaseInitialization } from './firebase';

import { Application } from './app';
import { ExpressJsonWebServerFramework } from './jsonPresenter/ExpressJsonWebServerFramework';
import { FirestoreGenericObjectPersistenceDriverFactory } from './jsonPersistence/FirestoreGenericObjectPersistenceDriverFactory';
import { AlgoliaGenericObjectSearchEngineDriverFactory } from './searchEngine/AlgoliaGenericObjectSearchEngineDriverFactory';
import { FirebaseAuthUserIdentificationExternalInterfaceDriver } from './userIdentification/FirebaseAuthUserIdentificationExternalInterfaceDriver';
import { FirebaseEmailSenderExternalInterfaceDriver } from './emailSender/FirebaseEmailSenderExternalInterfaceDriver';

/**
 * Blue Layer: Frameworks & Drivers
 * By View Type, Service or Entity Family
 * Name Convention
 * Classes: {Technology}{ViewType}{UI|WebServer|<Others>}Framework <Blue Layer>
 * Classes: {Technology}{Service}{ExternalInterface|<Others>}Driver <Blue Layer>
 * Classes: {Technology}{Entity}{Persistence|SearchEngine|<Others>}Driver <Blue Layer>
 */

Application.getInstance().initialize(
  new ExpressJsonWebServerFramework(),
  new FirebaseAuthUserIdentificationExternalInterfaceDriver(),
  new FirebaseEmailSenderExternalInterfaceDriver(),
  new FirestoreGenericObjectPersistenceDriverFactory(),
  new AlgoliaGenericObjectSearchEngineDriverFactory()
);

firebaseInitialization
  .then((message) => functions.logger.info(message))
  .catch((e) => functions.logger.error(`Error on FirebaseInitialization: ${e.message}`));

/**
 * Manual Triggered Functions
 */
export { manualTriggeredFunctions } from './webFramework/httpRequest/ManualTriggersFirebaseHttpRequest';

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});
