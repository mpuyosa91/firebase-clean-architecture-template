import { IJsonWebServerFramework, LogMessageType } from '../../app/_adapters';

export class TestJsonWebServerFramework implements IJsonWebServerFramework {
  isProduction(): boolean {
    return false;
  }

  logMessage(type: LogMessageType, ...messages: string[]): void {
    switch (type) {
      case 'debug':
        console.debug(messages);
        break;
      case 'warning':
        console.warn(messages);
        break;
      case 'error':
        console.error(messages);
        break;
      case 'info':
        console.log(messages);
        break;
    }
  }
}
