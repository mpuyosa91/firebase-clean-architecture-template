import { CustomError, CustomErrorCodes } from '../customError';

type ToValidateField<T> = { value: T | undefined; name: string; contextPath: string };

export class Validator {
  public static validateExistence<T>(field: ToValidateField<T>): T {
    if (!field.value) {
      throw new CustomError({
        code: CustomErrorCodes.MISSED_ARGUMENT,
        message: `Missed ${field.contextPath}${field.name} argument`,
        status: 'invalid-argument',
      });
    }

    return field.value;
  }

  public static validateRegex(field: ToValidateField<string>, regExp: RegExp): string {
    Validator.validateExistence(field);

    if (!regExp.test(field.value ?? '')) {
      throw new CustomError({
        code: CustomErrorCodes.BAD_FORMAT_ARGUMENT,
        message: `${field.contextPath}${field.name} bad format. Regex not met ${regExp}. ${field.value} given`,
        status: 'invalid-argument',
      });
    }

    return field.value ?? '';
  }

  public static validateLength(
    field: ToValidateField<string>,
    options: { max?: number; min?: number } = {}
  ): string {
    if (options.max && (field.value ?? '').length > options.max) {
      throw new CustomError({
        code: CustomErrorCodes.BAD_FORMAT_ARGUMENT,
        message: `${field.contextPath}${field.name} bad format. Length has to be less than ${options.max}.`,
        status: 'invalid-argument',
      });
    }

    if (options.min && (field.value ?? '').length < options.min) {
      throw new CustomError({
        code: CustomErrorCodes.BAD_FORMAT_ARGUMENT,
        message: `${field.contextPath}${field.name} bad format. Length has to be more than ${options.min}.`,
        status: 'invalid-argument',
      });
    }

    return field.value ?? '';
  }
}
