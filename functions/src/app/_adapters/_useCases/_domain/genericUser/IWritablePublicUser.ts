import {
  checkWritablePublicGenericObjectRequest,
  DeepPartial,
  IWritablePublicGenericObject,
  newFakeWritablePublicGenericObject,
  newWritablePublicGenericObject,
} from '../genericObject';
import { faker } from '@faker-js/faker';
import { checkPhoneRequest, IPhone, newPhone } from '../phone';
import { CustomDate } from '../customDate';
import { Validator } from '../validator';

type ThisInterface = IWritablePublicUser;

export const checkWritablePublicUserRequest = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => {
  request.avatarUrl = request.avatarUrl ?? null;

  request.birthDate = Validator.validateRegex(
    { value: request.birthDate, name: 'birthDate', contextPath },
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-](\d{2}):(\d{2})/
  );

  request.firstName = Validator.validateLength(
    { value: request.firstName, name: 'firstName', contextPath },
    { min: 2, max: 100 }
  );

  request.lastName = Validator.validateLength(
    { value: request.lastName, name: 'lastName', contextPath },
    { min: 2, max: 100 }
  );

  request.mainLanguage = request.mainLanguage ?? 'en';

  request.phone = Validator.validateExistence({
    value: request.phone,
    name: 'phone',
    contextPath,
  });

  request.preferredCurrencyCodename = request.preferredCurrencyCodename ?? 'USD';

  return {
    ...checkWritablePublicGenericObjectRequest(request),
    avatarUrl: request.avatarUrl,
    birthDate: request.birthDate,
    firstName: request.firstName,
    lastName: request.lastName,
    mainLanguage: request.mainLanguage,
    phone: checkPhoneRequest(request.phone),
    preferredCurrencyCodename: request.preferredCurrencyCodename,
  };
};

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
