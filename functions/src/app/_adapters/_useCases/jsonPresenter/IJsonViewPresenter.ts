export interface IJsonViewPresenter {
  /**
   *
   * @param request
   * @param response
   * @param {(data: object, context: object) => Promise<unknown>} callback
   * @returns {Promise<unknown>}
   */
  getOnRequestAsOnCall(
    request: unknown,
    response: unknown,
    callback: (data: object, context: object) => Promise<object>
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
    callback: (data: object, user: string) => Promise<object>
  ): Promise<object>;
}
