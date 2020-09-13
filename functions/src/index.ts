import { functions } from './firebase';

export { createDummyEntity } from './dummy/DummyFirestoreController';
export { onCreateDummyEntity } from './dummy/DummyFirestoreTrigger';

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});
