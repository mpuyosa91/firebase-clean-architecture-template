export enum CustomErrorCodes {
  APP_NOT_INITIALIZED = 'APP_NOT_INITIALIZED',

  METHOD_NOT_PROVIDED = 'METHOD_NOT_PROVIDED',
  METHOD_NOT_FOUND = 'METHOD_NOT_FOUND',

  MISSED_ARGUMENT = 'MISSED_ARGUMENT',
  BAD_FORMAT_ARGUMENT = 'BAD_FORMAT_ARGUMENT',

  LOGGED_IN = 'LOGGED_IN',
  NOT_LOGGED_IN = 'NOT_LOGGED_IN',

  SUPER_ADMIN_ALREADY_EXISTS = 'SUPER_ADMIN_ALREADY_EXISTS',
  ADMIN_CREATION_ERROR = 'ADMIN_CREATION_ERROR',
  USER_CREATION_ERROR = 'USER_CREATION_ERROR',

  MISSING_PRIVILEGES = 'MISSING_PRIVILEGES',

  USER_EXIST = 'USER_EXIST',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_ALREADY_DELETED = 'USER_ALREADY_DELETED',
  USER_IDENTIFICATION_NOT_FOUND = 'USER_IDENTIFICATION_NOT_FOUND',
  USER_EMAIL_EXIST = 'USER_EMAIL_EXIST',
  BAD_FORMAT_EMAIL = 'BAD_FORMAT_EMAIL',

  ERROR_IN_SEARCH_ENGINE_OBJECT_WRITE = 'ERROR_IN_SEARCH_ENGINE_OBJECT_WRITE',
  ERROR_IN_SEARCH_ENGINE_OBJECT_READ = 'ERROR_IN_SEARCH_ENGINE_OBJECT_READ',
  ERROR_IN_SEARCH_ENGINE_OBJECT_SEARCH = 'ERROR_IN_SEARCH_ENGINE_OBJECT_SEARCH',
  ERROR_IN_SEARCH_ENGINE_OBJECT_DELETE = 'ERROR_IN_SEARCH_ENGINE_OBJECT_DELETE',

  ERROR_IN_OBJECT_WRITE = 'ERROR_IN_OBJECT_WRITE',
  ERROR_IN_OBJECT_READ = 'ERROR_IN_OBJECT_READ',
  ERROR_IN_OBJECT_MASSIVE_READ = 'ERROR_IN_OBJECT_MASSIVE_READ',
  ERROR_IN_OBJECT_DELETE = 'ERROR_IN_OBJECT_DELETE',

  IMPOSSIBLE_ERROR = 'IMPOSSIBLE_ERROR',

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
