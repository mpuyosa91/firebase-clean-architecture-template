import {
  DummyCollectionNames,
  IDummyEntity,
} from '../app/dummy/domain/DummyEntity';
import { IDummyOutputPort } from '../app/dummy/useCases/DummyContract';
import { db } from '../firebase';

export class DummyFirestoreGateway implements IDummyOutputPort {
  public async saveDataInFirstPersistence(
    id: string,
    data: IDummyEntity
  ): Promise<boolean> {
    await db.collection(DummyCollectionNames.DUMMY_1).doc(id).set(data);
    return true;
  }

  public async saveDataInSecondPersistence(
    id: string,
    data: IDummyEntity
  ): Promise<boolean> {
    await db.collection(DummyCollectionNames.DUMMY_2).doc(id).set(data);
    return true;
  }
}
