import * as functions from 'firebase-functions';
import { firebaseInitialization } from './firebase';

import { Application } from './app';
import { JsonViewExpressPresenterDriver } from './presenterDrivers/JsonViewExpressPresenterDriver';

Application.getInstance().initialize(
  new JsonViewExpressPresenterDriver(),
);

firebaseInitialization
  .then((message) => functions.logger.info(message))
  .catch((e) => functions.logger.error(`Error on FirebaseInitialization: ${e.message}`));

/**
 * Manual Triggered Functions
 */
export { manualTriggeredFunctions } from './webFramework/httpRequest/ManualTriggersFirebaseHttpRequest';

export { createDummyEntity } from './dummy/DummyFirestoreController';
export { onCreateDummyEntity } from './dummy/DummyFirestoreTrigger';

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});
