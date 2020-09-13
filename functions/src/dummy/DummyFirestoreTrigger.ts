import { DummyCollectionNames } from '../app/dummy/domain/DummyEntity';
import {
  IDummyInputPort,
  IDummyOutputPort,
} from '../app/dummy/useCases/DummyContract';
import { DummyInteractor } from '../app/dummy/useCases/DummyInteractor';
import { functions } from '../firebase';
import { DummyFirestoreGateway } from './DummyFirestoreGateway';

const gateway: IDummyOutputPort = new DummyFirestoreGateway();
const interactor: IDummyInputPort = new DummyInteractor(gateway);

export const onCreateDummyEntity = functions.firestore
  .document(DummyCollectionNames.DUMMY_1 + '/{docId}')
  .onCreate(async (snapshot) => {
    const data = snapshot.data();

    await interactor.copyData(snapshot.id, {
      age: data.age,
      city: data.city,
      name: data.name,
    });
  });
