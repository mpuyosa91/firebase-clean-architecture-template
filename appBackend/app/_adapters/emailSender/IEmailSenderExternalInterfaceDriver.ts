export type EmailObject = {
  from: string;
  to: string;
  message: {
    subject: string;
    text: string;
    html: string;
  };
};

export interface IEmailSenderExternalInterfaceDriver {
  /**
   *
   * @param {EmailObject} email
   * @returns {Promise<object | null>}
   */
  sendEmail(email: EmailObject): Promise<object | null>;
}
