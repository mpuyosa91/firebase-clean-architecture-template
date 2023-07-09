import { DeepPartial } from '../genericObject';
import { Validator } from '../validator';

type ThisInterface = IPhone;

export const checkPhoneRequest = (
  request: DeepPartial<ThisInterface>,
  contextPath = ''
): ThisInterface => {
  request.prefix = Validator.validateExistence({
    value: request.prefix,
    name: 'prefix',
    contextPath,
  });

  request.prefix.countryCodename = Validator.validateRegex(
    {
      value: request.prefix.countryCodename,
      name: 'prefix.countryCodename',
      contextPath,
    },
    /[A-Z]{2}/
  );

  request.prefix.value = Validator.validateRegex(
    {
      value: request.prefix.value,
      name: 'prefix.value',
      contextPath,
    },
    /[+]?[(]?[0-9]{1,4}[)]?/
  );

  request.value = Validator.validateRegex(
    { value: request.value, name: 'value', contextPath },
    /[-\s./0-9]{7,15}/
  );

  return {
    prefix: {
      countryCodename: request.prefix.countryCodename,
      value: request.prefix.value,
    },
    value: request.value,
  };
};

export const newPhone = (object?: DeepPartial<ThisInterface>): ThisInterface => {
  const toReturnObject: ThisInterface = {
    prefix: {
      countryCodename: object?.prefix?.countryCodename ?? '',
      value: object?.prefix?.value ?? '',
    },
    value: object?.value ?? '',
  };

  toReturnObject.value = toReturnObject.value.replace(/-/g, ' ').replace(/\./g, ' ');

  return toReturnObject;
};

export interface IPhone {
  prefix: {
    /**
     * @pattern [A-Z]{2}
     */
    countryCodename: string;

    /**
     * @pattern [+]?[(]?[0-9]{1,4}[)]?
     */
    value: string;
  };

  /**
   * @pattern [-\s./0-9]{7,15}
   */
  value: string;
}
