import { LogMessageType } from './IJsonWebServerFramework';

export interface IJsonPresenter {
  /**
   *
   * @returns {boolean}
   */
  isProduction(): boolean;

  /**
   *
   * @param {LogMessageType} type
   * @param {string} messages
   */
  logMessage(type: LogMessageType, ...messages: string[]): void;
}
