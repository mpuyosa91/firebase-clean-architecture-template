import { IUserIdentificationData } from '../../_useCases';

export interface IReplaceVariablesSource {
  adminEmail?: boolean;
  userIdentity?: IUserIdentificationData;
  validationToken?: string;
  passwordResetLink?: string;

  hasImage?: boolean;
  data64Image?: { url: string; alt: string };
  flexibleProperty?: Record<string, string>;
  extraInfo?: string[];
}
