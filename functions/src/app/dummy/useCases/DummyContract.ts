import { IDummyEntity } from "../domain/DummyEntity";

export interface IDummyInputPort {
  saveData(id: string, data: IDummyEntity): Promise<boolean>;
  copyData(id: string, data: IDummyEntity): Promise<boolean>;
}

export interface IDummyOutputPort {
  saveDataInFirstPersistence(id: string, data: IDummyEntity): Promise<boolean>;
  saveDataInSecondPersistence(id: string, data: IDummyEntity): Promise<boolean>;
}
