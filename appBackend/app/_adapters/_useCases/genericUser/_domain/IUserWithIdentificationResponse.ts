import { IUserIdentification } from '../../_domain';
import { IUserResponse } from './IUserResponse';

export interface IUserWithIdentificationResponse extends IUserResponse {
  userIdentification: IUserIdentification;
}
