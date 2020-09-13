export interface IValidationGateway {
  /**
   *
   * @param {object} schemaValidator
   * @param {any} toValidateObject
   * @return {Promise<void>}
   * @throws {Error} validationError
   */
  validate(schemaValidator: object, toValidateObject: any): Promise<void>;
}
