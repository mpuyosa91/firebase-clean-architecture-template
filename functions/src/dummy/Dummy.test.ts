// tslint:disable: no-implicit-dependencies
// tslint:disable: no-import-side-effect
// tslint:disable: object-literal-sort-keys
import * as firebase from "@firebase/testing"; // <-- Always in top
import * as admin from "firebase-admin";
import functions from "firebase-functions-test";
import projectSpecs from "../serviceAccountKey.json";

import "jest";

// Online Testing
const databaseURL = "localhost:8080";
const projectId = projectSpecs.project_id;
process.env.GCLOUD_PROJECT = projectId;
process.env.FIRESTORE_EMULATOR_HOST = databaseURL;

const testEnv = functions({ databaseURL, projectId });

import {
  DummyCollectionNames,
  IDummyEntity,
} from "../app/dummy/domain/DummyEntity";
import { createDummyEntity } from "./DummyFirestoreController";
import { onCreateDummyEntity } from "./DummyFirestoreTrigger";

describe("Dummy Basic Test", () => {
  test("1 Should be 1", () => {
    expect(1).toBe(1);
  });
});

describe("Dummy Firebase Test", () => {
  const data: IDummyEntity = { name: "Moises", age: 29, city: "mundo" };

  // Applies only to tests in this describe block
  beforeAll(async () => {
    await firebase.clearFirestoreData({ projectId });
  });

  test("Firestore callable createDummyEntity", async () => {
    const wrappedCallable: any = testEnv.wrap(createDummyEntity);

    // Execute it
    const docIndex = await wrappedCallable(data);

    const after = await admin
      .firestore()
      .doc(DummyCollectionNames.DUMMY_1 + "/" + docIndex)
      .get();

    expect(after.data()).toStrictEqual(data);
  });

  test("Firestore Trigger onCreateDummyEntity", async () => {
    const wrappedTrigger: any = testEnv.wrap(onCreateDummyEntity);

    const docIndex = "exampleTest";

    // Create a Firestore snapshot
    const snap = testEnv.firestore.makeDocumentSnapshot(
      data,
      DummyCollectionNames.DUMMY_1 + "/" + docIndex
    );

    // Execute it
    await wrappedTrigger(snap);

    const after = await admin
      .firestore()
      .doc(DummyCollectionNames.DUMMY_2 + "/" + docIndex)
      .get();

    expect(after.data()).toStrictEqual(data);
  });

  afterAll(async (done) => {
    done();
  });
});
