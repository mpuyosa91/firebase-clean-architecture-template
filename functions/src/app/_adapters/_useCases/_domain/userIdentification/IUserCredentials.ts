export interface IUserCredentials {
  /**
   * @format email
   */
  email: string;

  /**
   * @default ""
   * @minLength 6
   * @maxLength 127
   */
  password: string;
}
