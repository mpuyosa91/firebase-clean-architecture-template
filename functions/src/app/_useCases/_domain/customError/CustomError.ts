import { CustomErrorCodes, IReportable, ResponseCode } from './ReportableEntity';

export class CustomError extends Error {
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

  private static pad(num: number, size: number) {
    let s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }
}
