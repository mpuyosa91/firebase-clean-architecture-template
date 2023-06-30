export enum CustomErrorCodes {
  METHOD_NOT_FOUND = 'METHOD_NOT_FOUND',

  NOT_LOGGED_IN = 'NOT_LOGGED_IN',

  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export type ResponseCode =
  | 'ok'
  | 'failed-precondition' // 400 Bad Request
  | 'invalid-argument' // 400 Bad Request
  | 'out-of-range' // 400 Bad Request
  | 'unauthenticated' // 401 Unauthorized
  | 'permission-denied' // 403 Forbidden
  | 'not-found' // 404 Not Found
  | 'aborted' // 409 Conflict
  | 'already-exists' // 409 Conflict
  | 'resource-exhausted' // 429 Too Many Requests
  | 'cancelled' // 499 Unknown
  | 'unknown' // 500
  | 'internal' // 500
  | 'data-loss' // 500
  | 'unimplemented' // 501
  | 'unavailable' // 503
  | 'deadline-exceeded'; // 504

export interface IReportable {
  message: string;
  status: ResponseCode;
  code: CustomErrorCodes;
  backStack?: string[];
  payload?: object;
  reportAsError?: boolean;
}
