export type CallableContextFunction = (data: object, context: object) => Promise<object>;
export type ControllerFunction = (data: object, user: string) => Promise<object>;

export interface IJsonWebServerFramework {
  /**
   *
   * @param request
   * @param response
   * @param {(data: object, context: object) => Promise<any>} callback
   * @returns {Promise<any>}
   */
  getOnRequestAsOnCall(
    request: unknown,
    response: unknown,
    callback: CallableContextFunction
  ): Promise<object>;

  /**
   *
   * @param {string} functionName
   * @param {object} data
   * @param {object} context
   * @param {(data: object, user: string) => Promise<object>} callback
   * @returns {Promise<object>}
   */
  executeIfAuthorizedAndManageErrorsIf(
    functionName: string,
    data: object,
    context: object,
    callback: ControllerFunction
  ): Promise<object>;

  /**
   *
   * @param {string} functionName
   * @param {object} data
   * @param {(data: object) => Promise<object>} callback
   * @returns {Promise<object>}
   */
  jsonOrErrorResponse(
    functionName: string,
    data: object,
    callback: ControllerFunction
  ): Promise<object>;
}
