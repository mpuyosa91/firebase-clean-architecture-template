import { IDummyEntity } from "../domain/DummyEntity";
import { IDummyInputPort, IDummyOutputPort } from "./DummyContract";

export class DummyInteractor implements IDummyInputPort {
  constructor(private gateway: IDummyOutputPort) {}

  public async saveData(id: string, data: IDummyEntity): Promise<boolean> {
    await this.gateway.saveDataInFirstPersistence(id, data);
    return true;
  }

  public async copyData(id: string, data: IDummyEntity): Promise<boolean> {
    await this.gateway.saveDataInSecondPersistence(id, data);
    return true;
  }
}
