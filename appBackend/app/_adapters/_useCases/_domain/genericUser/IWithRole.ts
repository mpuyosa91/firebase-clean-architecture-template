import { DeepPartial, newArray } from '../genericObject';
import { UserRoleEnum } from '../userIdentification';
import _ from 'lodash';

type ThisInterface = IWithRole;
export const newWithRole = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    givenRoles: newArray(object?.givenRoles),
    role: object?.role ?? UserRoleEnum.NONE,
  };

  if (toReturnObject.role === UserRoleEnum.SUPER_ADMIN) {
    toReturnObject.givenRoles.push(UserRoleEnum.ADMIN);
  }

  toReturnObject.givenRoles = _.uniq(toReturnObject.givenRoles.concat(toReturnObject.role));

  return toReturnObject;
};

export interface IWithRole {
  /**
   * @default NONE
   */
  role: UserRoleEnum;

  /**
   * @default []
   */
  givenRoles: string[];
}
