import {
  DeepPartial,
  IWritablePublicGenericObject,
  newFakeWritablePublicGenericObject,
  newWritablePublicGenericObject,
} from '../genericObject';
import { faker } from '@faker-js/faker';
import { IPhone, newPhone } from '../phone';
import { CustomDate } from '../customDate';

type ThisInterface = IWritablePublicUser;
export const newWritablePublicUser = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    ...newWritablePublicGenericObject(object),
    avatarUrl: object?.avatarUrl ?? null,
    birthDate: new CustomDate(object?.birthDate ?? 0).toIsoString(),
    firstName: object?.firstName ?? '',
    lastName: object?.lastName ?? '',
    mainLanguage: object?.mainLanguage ?? 'en',
    phone: newPhone(object?.phone),
    preferredCurrencyCodename: object?.preferredCurrencyCodename ?? 'USD',
  };

  return toReturnObject;
};

export interface IWritablePublicUser extends IWritablePublicGenericObject {
  /**
   * @default null
   */
  avatarUrl: string | null;

  /**
   * @minLength 2
   * @maxLength 100
   */
  firstName: string;

  /**
   * @minLength 2
   * @maxLength 100
   */
  lastName: string;

  /**
   * @pattern (\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})
   * @default 1970-01-01T00:00:00+00:00
   */
  birthDate: string;

  phone: IPhone;

  /**
   * @default en
   */
  mainLanguage: string;

  preferredCurrencyCodename: string;
}

export const newFakeWritablePublicUser = (params: { withAvatar?: boolean } = {}): ThisInterface => {
  return newWritablePublicUser({
    ...newFakeWritablePublicGenericObject(),
    avatarUrl: params.withAvatar
      ? faker.helpers.arrayElement([
          'bootstrapping_images/users/Frame 1899.png',
          'bootstrapping_images/users/Frame 1900.png',
          'bootstrapping_images/users/Frame 1901.png',
          'bootstrapping_images/users/Frame 1902.png',
          'bootstrapping_images/users/Frame 1903.png',
        ])
      : null,
    birthDate: new CustomDate(0).toIsoString(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    mainLanguage: 'ES',
    phone: {
      prefix: {
        countryCodename: faker.location.countryCode(),
        value: '+57',
      },
      value: faker.phone.number(),
    },
  });
};
