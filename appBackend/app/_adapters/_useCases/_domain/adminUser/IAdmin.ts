import { IUser, newUser } from '../genericUser';
import { IWithChatRoomInfo, newWithChatRoomInfo } from '../chatRoom';
import { DeepPartial } from '../genericObject';
import { ObjectTypesEnum } from '../enums';
import { UserRoleEnum } from '../userIdentification';
import { IWritableAdmin, newWritableAdmin } from './IWritableAdmin';

type ThisInterface = IAdmin;
export const newAdmin = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newUser(object),
    ...newWritableAdmin(object),
    ...newWithChatRoomInfo(object),
    objectType:
      object?.role === UserRoleEnum.SUPER_ADMIN
        ? ObjectTypesEnum.SUPER_ADMIN
        : ObjectTypesEnum.ADMIN,
    role: object?.role === UserRoleEnum.SUPER_ADMIN ? UserRoleEnum.SUPER_ADMIN : UserRoleEnum.ADMIN,
  };

  return toReturnObject;
};

export interface IAdmin extends IUser, IWritableAdmin, IWithChatRoomInfo {}
