/*import {
  int,
  boolean,
  float,
  string,
  hex,
  base64,
  email,
  nill,
  any,
  obj,
  array,
  oneOf,
  value,
  InferType,
} from "./index";

describe("ts type", () => {
  it("should match", () => {
    const deriveIsTrue = () => true;
    const isFour = () => 4;
    const testSchema = obj({
      id: int().auto().key().public(),
      pw: string().semantic("password"),
      created: int().semantic("time"),
      createdTime: int().semantic("daytime"),
      createdDate: int().semantic("date"),
      aString: string(),
      aFloat: float(),
      aHex: hex(),
      aBase64: base64(),
      aEmail: email(),
      aNill: nill(),
      aAny: any(),
      isTrue: boolean().derived(deriveIsTrue),
      isMaybeTrue: boolean().optional(),
      isMaybeThree: int().optional(),
      anObj: obj({
        isMaybeTrue: boolean().optional(),
        isThree: int().default(3),
        isFour: int().default(isFour),
      }).optional(),
      anArray: array(
        obj({
          aKey: int(),
          aOneOf: oneOf([int(), value("hi")]),
        })
      ).optional(),
    });
    type Test = InferType<typeof testSchema>;
    const t: Test = {
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
          aOneOf: "hi",
        },
      ],
    };
    // @ts-expect-error test type
    t.anArray[1].aOneOf = "test";

    expect(testSchema.getType()).toStrictEqual({
      type: "object",
      keys: {
        id: {
          type: "int",
          auto: true,
          public: true,
          key: true,
        },
        pw: { type: "password" },
        created: { type: "time" },
        createdTime: { type: "daytime" },
        createdDate: { type: "date" },
        aString: { type: "string" },
        aFloat: { type: "float" },
        aHex: { type: "hex" },
        aBase64: { type: "base64" },
        aEmail: { type: "email" },
        aNill: { type: "null" },
        aAny: { type: "/" },
        isTrue: { type: "boolean", derived: deriveIsTrue },
        isMaybeTrue: { type: "boolean", optional: true },
        isMaybeThree: { type: "int", optional: true },
        anObj: {
          type: "object",
          optional: true,
          keys: {
            isMaybeTrue: { type: "boolean", optional: true },
            isThree: { type: "int", default: 3 },
            isFour: { type: "int", default: isFour },
          },
        },
        anArray: {
          optional: true,
          type: "array",
          items: {
            type: "object",
            keys: {
              aKey: { type: "int" },
              aOneOf: {
                type: "oneOf",
                alternatives: [{ type: "int" }, { value: "hi" }],
              },
            },
          },
        },
      },
    });
  });

  it("should reject wrongly typed derived values", async () => {
    const objSchema = obj({
      isMaybeTrue: boolean().optional(),
      isThree: int(),
    });

    objSchema.derived(() => ({
      isMaybeTrue: false,
      isThree: 4,
    }));

    // @ts-expect-error test type
    objSchema.derived(() => ({
      isMaybeTrue: false,
    }));

    // @ts-expect-error test type
    objSchema.derived(() => 3);
  });

  it("should reject wrongly typed default values", async () => {
    const objSchema = obj({
      isMaybeTrue: boolean().optional(),
      isThree: int(),
    });

    objSchema.default(() => ({
      isMaybeTrue: false,
      isThree: 4,
    }));

    objSchema.default({
      isMaybeTrue: false,
      isThree: 4,
    });

    // @ts-expect-error test type
    objSchema.derived(() => ({
      isMaybeTrue: false,
    }));

    objSchema.derived({
      // @ts-expect-error test type
      isMaybeTrue: false,
    });

    // @ts-expect-error test type
    objSchema.derived(() => 3);
  });

  it("should create new instance on modification", async () => {
    const testBool = boolean();
    testBool.optional();
    testBool.description("Test");
    testBool.default(true);
    testBool.public();
    testBool.auto();
    testBool.key();
    testBool.derived(() => true);
    testBool.mapped("abc");
    testBool.readOnly();

    expect(testBool.getType()).toStrictEqual({
      type: "boolean",
    });
  });
});
*/
