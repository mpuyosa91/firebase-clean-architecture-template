export const UserIdentityEntitySchemaValidator = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: {
    IUserIdentityDataEntity: {
      properties: {
        email: {
          default: null,
          type: "string",
        },
        firstName: {
          default: null,
          type: "string",
        },
        lastName: {
          default: null,
          type: "string",
        },
      },
      required: ["email", "firstName", "lastName"],
      type: "object",
    },
    IUserIdentityEntity: {
      properties: {
        data: {
          $ref: "#/definitions/IUserIdentityDataEntity",
          default: null,
        },
        id: {
          type: "string",
        },
        role: {
          $ref: "#/definitions/UserIdentityDataRoleEnum",
          default: "UserIdentityDataRoleEnum.NONE",
        },
      },
      required: ["data", "id", "role"],
      type: "object",
    },
    UserIdentityDataRoleEnum: {
      enum: ["ADMIN", "NONE"],
      type: "string",
    },
  },
};
