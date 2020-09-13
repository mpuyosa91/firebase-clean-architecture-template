import { IDummyEntity } from '../app/dummy/domain/DummyEntity';
import {
  IDummyInputPort,
  IDummyOutputPort,
} from '../app/dummy/useCases/DummyContract';
import { DummyInteractor } from '../app/dummy/useCases/DummyInteractor';
import { functions } from '../firebase';
import { DummyFirestoreGateway } from './DummyFirestoreGateway';

const gateway: IDummyOutputPort = new DummyFirestoreGateway();
const interactor: IDummyInputPort = new DummyInteractor(gateway);

export const createDummyEntity = functions.https.onCall(
  async (data: IDummyEntity, context) => {
    const id = 'newData';

    await interactor.saveData(id, data);

    return id;
  }
);
