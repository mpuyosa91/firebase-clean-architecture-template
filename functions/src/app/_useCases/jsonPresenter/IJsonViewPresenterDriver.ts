export interface IJsonViewPresenterDriver {

  /**
   *
   * @param request
   * @param response
   * @param {(data: object, context: object) => Promise<any>} callback
   * @returns {Promise<any>}
   */
  getOnRequestAsOnCall(
    request: any,
    response: any,
    callback: (data: object, context: object) => Promise<any>,
  ): Promise<any>;

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
    callback: (data: object, user: string) => Promise<object>,
  ): Promise<object>;
}
