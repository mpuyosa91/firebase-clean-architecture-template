export interface IController {
  [index: string]: (request: any, userId: string) => Promise<Record<string, object>>;
}
