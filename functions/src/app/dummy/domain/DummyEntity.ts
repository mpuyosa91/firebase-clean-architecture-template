// Run bellow command to generate the schema validator and replace it into DummyEntitySchemaValidator.ts
// npx typescript-json-schema .\src\app\dummy\domain\DummyEntity.ts * --required

export class DummyCollectionNames {
  public static readonly DUMMY_1 = 'TestCollection';
  public static readonly DUMMY_2 = 'TestCollectionCopy';
}

export interface IDummyEntity {
  /**
   *
   * @default "TestName"
   */
  name: string;
  /**
   *
   * @default 30
   */
  age: number;
  /**
   *
   * @default "Test City"
   */
  city: string;
}
