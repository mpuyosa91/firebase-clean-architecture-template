import { IJsonViewPresenter, IJsonViewPresenterDriver } from './_useCases';
import { JsonViewPresenterAdapter } from './jsonPresenter';


export class Application {
  private static instance: Application;
  private initialized: boolean = false;

  public constructor(
    private jsonViewPresenter: IJsonViewPresenter | null = null,
  ) {
  }

  public static getInstance(): Application {
    if (!Application.instance) {
      Application.instance = new Application();
    }

    return Application.instance;
  }

  private static _throwInitializationError() {
    return new Error('App not initialized please get first an instance with Application.getInstance().initialize(...)');
  }

  public initialize(
    jsonViewPresenterDriver: IJsonViewPresenterDriver,
  ) {
    this.initialized = true;

    /**
     * Blue Layer: Frameworks & Drivers (Drivers)
     * By Use Case Family
     */

    /**
     * Green Layer: Interface Adapters (Presenters)
     * By Use Case Family
     */

    this.jsonViewPresenter = new JsonViewPresenterAdapter(jsonViewPresenterDriver);

    /**
     * Green Layer: Interface Adapters (Persistence Gateways)
     * By Entity Family
     */

    /**
     * Red Layer: Application Business Rules
     * By Use Case Family
     */

    /**
     * Green Layer: Interface Adapters (Controllers)
     * By Use Case Family
     */

  }

  public getJsonViewPresenter(): IJsonViewPresenter {
    this.checkInitialized();
    if (!this.jsonViewPresenter) {
      throw Application._throwInitializationError();
    }
    return this.jsonViewPresenter;
  }

  private checkInitialized() {
    if (!this.initialized) {
      throw Application._throwInitializationError();
    }
  }
}

export * from './_useCases';
