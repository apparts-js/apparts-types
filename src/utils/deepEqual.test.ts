import {
  InferType,
  any,
  array,
  base64,
  boolean,
  email,
  float,
  hex,
  int,
  nill,
  obj,
  objValues,
  oneOf,
  phoneISD,
  string,
  value,
} from "../schema";
import { deepEqualSchema } from "./deepEqual";

describe("deepCompare should say equal", () => {
  const testSchema = obj({
    id: int().auto().key().public(),
    pw: string().semantic("password"),
    created: int().semantic("time").public(),
    createdTime: int().semantic("daytime"),
    createdDate: int().semantic("date"),
    aString: string(),
    aFloat: float(),
    aHex: hex(),
    aBase64: base64(),
    aEmail: email(),
    aPhoneISD: phoneISD(),
    aNill: nill(),
    aAny: any(),
    isTrue: boolean(),
    isMaybeTrue: boolean().optional(),
    isMaybeThree: int().optional(),
    anObj: obj({
      isMaybeTrue: boolean().optional(),
      isThree: int(),
      isFour: int(),
    }).optional(),
    anArray: array(
      obj({
        aKey: int(),
        aOneOf: oneOf([int(), value("hi")]),
      })
    ).optional(),
    objValues: objValues(
      oneOf([
        obj({
          isOptional: string().optional(),
          isNonOptional: string().public(),
        }),
        value("test"),
      ])
    ),
  });

  it("should say equal", async () => {
    const val: InferType<typeof testSchema> = {
      id: 3,
      pw: "aobst",
      created: 1293,
      createdTime: 1293,
      createdDate: 1293,
      aString: "aosrten",
      aFloat: 3.4,
      aHex: "beef",
      aBase64: "eyB0eXBlOiAiYmFzZTY0In0=",
      aEmail: "test@test.de",
      aPhoneISD: "+49 1039 - 382039 . 83902",
      aNill: null,
      aAny: { type: "any" },
      isTrue: true,
      isMaybeTrue: true,
      isMaybeThree: 3,
      anObj: {
        isMaybeTrue: false,
        isThree: 3,
        isFour: 4,
      },
      anArray: [
        {
          aKey: 5,
          aOneOf: 22,
        },
        {
          aKey: 5,
          aOneOf: "hi" as const,
        },
      ],
      objValues: {
        isOptional: "test",
      },
    };

    expect(deepEqualSchema(val, val, testSchema)).toBe(true);
    expect(deepEqualSchema(val, { ...val }, testSchema)).toBe(true);
  });

  it("array", async () => {
    const testSchema = array(int());
    expect(deepEqualSchema([1, 2, 3], [1, 2, 3], testSchema)).toBe(true);
  });
});

describe("deepCompare should say not equal", () => {
  it("obj", async () => {
    const testSchema = obj({
      id: int(),
      pw: string().optional(),
    });
    // missing value
    expect(deepEqualSchema({ id: 3 }, { id: 3, pw: "a" }, testSchema)).toBe(
      false
    );
    // different value
    expect(deepEqualSchema({ id: 3 }, { id: 4 }, testSchema)).toBe(false);
  });

  it("objValues", async () => {
    const testSchema = objValues(oneOf([int(), value("test")]));
    // missing value
    expect(
      deepEqualSchema(
        { isNonOptional: "test", isOptional: "test" },
        { isNonOptional: "test" },
        testSchema
      )
    ).toBe(false);
    // different value
    expect(
      deepEqualSchema(
        { isNonOptional: "test" },
        { isNonOptional: 1 },
        testSchema
      )
    ).toBe(false);
  });

  it("array", async () => {
    const testSchema = array(int());
    // missing value
    expect(deepEqualSchema([1], [1, 2], testSchema)).toBe(false);
    // different value
    expect(deepEqualSchema([1], [2], testSchema)).toBe(false);
  });

  it("oneOf", async () => {
    const testSchema = oneOf([int(), string()]);
    // different type
    expect(deepEqualSchema(1, "1", testSchema)).toBe(false);
    // different value
    expect(deepEqualSchema(1, 2, testSchema)).toBe(false);
  });

  it("value", async () => {
    const testSchema = value(1);
    // different value
    // @ts-expect-error test type
    expect(deepEqualSchema(1, 2, testSchema)).toBe(false);
  });
  it("value type", async () => {
    const testSchema = int();
    // different value
    expect(deepEqualSchema(2, 1, testSchema)).toBe(false);
  });
});
