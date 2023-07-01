export interface IEmailSenderExternalInterfaceDriver {
  /**
   *
   * @param email
   * @param subject
   * @param content
   * @param htmlContent
   * @return {Promise<object | null>}
   */
  sendEmail(
    email: string,
    subject: string,
    content: string,
    htmlContent: string
  ): Promise<object | null>;
}
