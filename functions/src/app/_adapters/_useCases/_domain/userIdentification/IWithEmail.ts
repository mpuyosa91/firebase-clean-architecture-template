import { DeepPartial } from '../genericObject';

type ThisInterface = IWithEmail;
export const newWithEmail = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    email: object?.email ?? 'null@none.com',
    emailVerified: object?.emailVerified ?? false,
  };

  return toReturnObject;
};

export interface IWithEmail {
  /**
   * @format email
   */
  email: string;

  /**
   * @default false
   */
  emailVerified: boolean;
}
