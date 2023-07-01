import {
  AdminInteractor,
  CollectionNames,
  EmailSenderServiceGatewayAdapter,
  JsonHelperServiceGatewayAdapter,
  IEmailSenderExternalInterfaceDriver,
  IEmailSenderServiceGateway,
  IJsonHelperServiceGateway,
  IGenericObjectPersistenceDriver,
  IGenericObjectPersistenceDriverFactory,
  IJsonPresenter,
  IJsonWebServerFramework,
  IGenericObjectSearchEngineDriver,
  IGenericObjectSearchEngineDriverFactory,
  IGenericObjectSearchEngineGateway,
  ISearchEngineUser,
  IUser,
  IUserIdentificationServiceGateway,
  IUserIdentificationExternalInterfaceDriver,
  JsonPresenterAdapter,
  GenericObjectSearchEngineGatewayAdapter,
  UserIdentificationServiceGatewayAdapter,
  GenericObjectPersistenceGatewayAdapter,
  IGenericObjectPersistenceGateway,
  IAdmin,
  IAdminUseCases,
} from './_adapters';
import { AdminController } from './_adapters/adminUser';
import { GenericUserController } from './_adapters/genericUser/GenericUserController';

export class Application {
  private static instance: Application;
  private initialized = false;

  public constructor(
    private jsonPresenter: IJsonPresenter | null = null,
    private genericUserController: GenericUserController | null = null,
    private adminController: AdminController | null = null
  ) {}

  public static getInstance(): Application {
    if (!Application.instance) {
      Application.instance = new Application();
    }

    return Application.instance;
  }

  private static _throwInitializationError() {
    return new Error(
      'App not initialized please get first an instance with Application.getInstance().initialize(...)'
    );
  }

  public initialize(
    jsonWebServerFramework: IJsonWebServerFramework,
    userIdentificationExternalInterfaceDriver: IUserIdentificationExternalInterfaceDriver,
    emailSenderExternalInterfaceDriver: IEmailSenderExternalInterfaceDriver,
    genericObjectPersistenceDriverFactory: IGenericObjectPersistenceDriverFactory,
    genericObjectSearchEngineDriverFactory: IGenericObjectSearchEngineDriverFactory
  ) {
    this.initialized = true;

    /**
     * Blue Layer: Frameworks & Drivers
     * By View Type, Service or Entity Family
     * Name Convention
     * Interfaces: I{ViewType}{UI|WebServer|<Others>}Framework <Green Layer>
     * Interfaces: I{Service}{ExternalInterface|<Others>}Driver <Green Layer>
     * Interfaces: I{Entity}{Persistence|SearchEngine|<Others>}Driver <Green Layer>
     */

    // jsonWebServerFramework: IJsonWebServerFramework,
    // userIdentificationExternalInterfaceDriver: IUserIdentificationExternalInterfaceDriver,
    // emailSenderExternalInterfaceDriver: IEmailSenderExternalInterfaceDriver,
    // genericObjectPersistenceDriverFactory: IGenericObjectPersistenceDriverFactory,
    // genericObjectSearchEngineDriverFactory: IGenericObjectSearchEngineDriverFactory

    const userPersistenceDriver: IGenericObjectPersistenceDriver<IUser> =
      genericObjectPersistenceDriverFactory.generate<IUser>(CollectionNames.USERS);
    const userSearchEngineDriver: IGenericObjectSearchEngineDriver<ISearchEngineUser> =
      genericObjectSearchEngineDriverFactory.generate<ISearchEngineUser>(CollectionNames.USERS);

    /**
     * Green Layer: Interface Adapters (Presenters) (Related to View Type Frameworks)
     * By View Type
     * Name Convention
     * Interfaces: I{ViewType}Presenter
     * Classes: {ViewType}PresenterAdapter
     */

    // IJsonPresenter
    this.jsonPresenter = new JsonPresenterAdapter(jsonWebServerFramework);

    /**
     * Green Layer: Interface Adapters (Service Gateways) (Related to Service Drivers)
     * By Service
     * Name Convention
     * Interfaces: I{Service}ServiceGateway <Red Layer>
     * Classes: {Service}ServiceGatewayAdapter <Green Layer>
     */

    const jsonHelperServiceGateway: IJsonHelperServiceGateway =
      new JsonHelperServiceGatewayAdapter();

    const userIdentificationServiceGateway: IUserIdentificationServiceGateway =
      new UserIdentificationServiceGatewayAdapter(userIdentificationExternalInterfaceDriver);

    const emailSenderServiceGateway: IEmailSenderServiceGateway =
      new EmailSenderServiceGatewayAdapter(emailSenderExternalInterfaceDriver);

    /**
     * Green Layer: Interface Adapters (Persistence Gateways) (Related to Entity Drivers)
     * By Entity Family
     * Interfaces: I{Entity}{Persistence|SearchEngine|<Others>}Gateway
     * Classes: {Entity}{Persistence|SearchEngine|<Others>}GatewayAdapter
     */

    const userSearchEngineGateway: IGenericObjectSearchEngineGateway<ISearchEngineUser> =
      new GenericObjectSearchEngineGatewayAdapter<ISearchEngineUser>(userSearchEngineDriver);

    const userPersistenceGatewayAdapter: IGenericObjectPersistenceGateway<IUser> =
      new GenericObjectPersistenceGatewayAdapter(userPersistenceDriver, userSearchEngineGateway);

    /**
     * Red Layer: Application Business Rules
     * By Use Case Family
     * Interfaces: I{Entity}UseCases
     * Classes: {Entity}Interactor
     */

    const adminUseCases: IAdminUseCases = new AdminInteractor(
      jsonHelperServiceGateway,
      userIdentificationServiceGateway,
      userPersistenceGatewayAdapter as IGenericObjectPersistenceGateway<IAdmin>,
      emailSenderServiceGateway
    );

    /**
     * Green Layer: Interface Adapters (Controllers)
     * By Use Case Family
     */

    this.adminController = new AdminController(adminUseCases);
  }

  public getJsonViewPresenter(): IJsonPresenter {
    return this.checkInitialized(this.jsonPresenter) as IJsonPresenter;
  }

  public getGenericUserController(): GenericUserController {
    return this.checkInitialized(this.genericUserController) as GenericUserController;
  }

  public getAdminController(): AdminController {
    return this.checkInitialized(this.adminController) as AdminController;
  }

  private checkInitialized(toReturnObject: object | null): object {
    if (!this.initialized || !toReturnObject) {
      throw Application._throwInitializationError();
    }
    return toReturnObject;
  }
}
