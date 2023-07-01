import {
  CustomError,
  CustomErrorCodes,
  DeepPartial,
  IAdmin,
  IAdminUseCases,
  IGenericUserUseCases,
  IUser,
  newAdmin,
  newNullable,
  newUser,
  ObjectTypesEnum,
} from '../_useCases';

export class GenericUserController {
  constructor(
    private genericUserUseCases: IGenericUserUseCases<IUser>,
    private adminUseCases: IAdminUseCases
  ) {}

  public async onWriteUser<T extends DeepPartial<IUser>>(
    request: any,
    _: string
  ): Promise<Record<string, object>> {
    const userId: string = request.userId ?? '';
    const userBefore: T | null = request.userBefore ?? null;
    const userAfter: T | null = request.userAfter ?? null;

    const objectType = userAfter?.objectType ?? userBefore?.objectType ?? ObjectTypesEnum.NONE;

    switch (objectType) {
      case ObjectTypesEnum.ADMIN:
        return this.executeOnWrite(
          userId,
          userBefore as IAdmin | null,
          userAfter as IAdmin | null,
          this.adminUseCases,
          newAdmin
        );
      default:
        return this.executeOnWrite(
          userId,
          userBefore as IUser | null,
          userAfter as IUser | null,
          this.genericUserUseCases,
          newUser
        );
    }
  }

  private async executeOnWrite<T extends IUser>(
    userId: string,
    userBefore: T | null,
    userAfter: T | null,
    useCase: IGenericUserUseCases<T>,
    objectMapper: (object?: DeepPartial<T>) => T
  ): Promise<Record<string, object>> {
    if (userAfter) {
      if (userAfter.id !== userId) {
        await useCase.write(objectMapper({ ...userAfter, id: userId }));
        return { idUpdated: { userId } };
      }

      return useCase.afterWrite(newNullable(objectMapper, userBefore), objectMapper(userAfter));
    } else if (userBefore) {
      return useCase.afterDelete(objectMapper(userBefore));
    } else {
      throw new CustomError({
        code: CustomErrorCodes.IMPOSSIBLE_ERROR,
        message: 'Double null onWriteUser',
        reportAsError: true,
        status: 'invalid-argument',
      });
    }
  }
}
