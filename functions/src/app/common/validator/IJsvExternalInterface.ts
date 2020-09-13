export interface IJsvExternalInterface {
  /**
   *
   * @param {object} schemaValidator
   * @param {any} toValidateObject
   * @returns {Promise<string | null>} validationErrorMessage
   */
  validate(
    schemaValidator: object,
    toValidateObject: any
  ): Promise<string | null>;
}
