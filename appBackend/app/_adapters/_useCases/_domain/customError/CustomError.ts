import { CustomErrorCodes, IReportable, ResponseCode } from './ReportableEntity';

export class CustomError extends Error {
  private static pad(num: number, size: number) {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }
  public readonly status: ResponseCode;
  public readonly code: CustomErrorCodes;
  public readonly backStack: string[];
  public readonly payload?: object;
  public readonly reportAsError: boolean;

  constructor(e: IReportable) {
    super(e.message ?? 'no message');
    this.status = e.status ?? 'unknown';
    this.code = e.code ?? 'unknown';
    let i = 0;
    this.backStack = e.backStack ??
      this.stack?.split('\n').map((trace): string => {
        const result = `<${CustomError.pad(i, 2)}> ${trace}`;
        i += 1;
        return result;
      }) ?? ['Unknown code source'];
    this.payload = e.payload ? e.payload : undefined;
    this.reportAsError = e.reportAsError !== undefined ? e.reportAsError : false;
  }

  public get statusCode(): number {
    switch (this.status) {
      case 'ok':
        return 200;
      case 'failed-precondition':
      case 'invalid-argument':
      case 'out-of-range':
        return 400;
      case 'unauthenticated':
        return 401;
      case 'permission-denied':
        return 403;
      case 'not-found':
        return 404;
      case 'aborted':
      case 'already-exists':
        return 409;
      case 'resource-exhausted':
        return 429;
      case 'cancelled':
        return 499;
      case 'unknown':
      case 'internal':
      case 'data-loss':
        return 500;
      case 'unimplemented':
        return 501;
      case 'unavailable':
        return 503;
      case 'deadline-exceeded':
        return 504;
      default:
        return 500;
    }
  }
}
