export type LogMessageType = 'debug' | 'warning' | 'error' | 'info';

export interface IJsonWebServerFramework {
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
