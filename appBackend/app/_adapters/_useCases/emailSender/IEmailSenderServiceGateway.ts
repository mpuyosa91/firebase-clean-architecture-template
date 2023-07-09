import { IUserIdentification, IUserIdentificationData } from '../_domain';

export interface IEmailSenderServiceGateway {
  /**
   *
   * @param {IUserIdentificationData} userIdentity
   * @param {string} email
   * @param {string} urlBase
   * @returns {Promise<object | null>}
   */
  sendVerificationEmail(
    userIdentity: IUserIdentificationData,
    email: string,
    urlBase?: string
  ): Promise<object | null>;

  /**
   *
   * @param {string} urlBase
   * @param {string} mainLanguage
   * @param {IUserIdentification} userIdentity
   * @returns {Promise<object | null>}
   */
  sendChangePasswordMail(
    urlBase: string,
    mainLanguage: string,
    userIdentity: IUserIdentification
  ): Promise<object | null>;
}
