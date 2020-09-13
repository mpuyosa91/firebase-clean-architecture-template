export const DummyEntitySchemaValidator = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    DummyCollectionNames: {
      type: 'object',
    },
    IDummyEntity: {
      properties: {
        age: {
          default: 30,
          type: 'number',
        },
        city: {
          default: 'Test City',
          type: 'string',
        },
        name: {
          default: 'TestName',
          type: 'string',
        },
      },
      required: ['age', 'city', 'name'],
      type: 'object',
    },
  },
};
