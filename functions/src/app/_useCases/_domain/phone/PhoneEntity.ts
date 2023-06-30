import { DeepPartial } from '../genericObject';

export const newPhone = (object?: DeepPartial<IPhone>): IPhone => {
  const toReturnObject: IPhone = {
    prefix: {
      countryCodename: object?.prefix?.countryCodename ?? '',
      value: object?.prefix?.value ?? '',
    },
    value: object?.value ?? '',
  };

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
