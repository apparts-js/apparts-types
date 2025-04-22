import {
  int,
  boolean,
  float,
  string,
  hex,
  base64,
  email,
  phoneISD,
  nill,
  any,
  obj,
  objValues,
  array,
  oneOf,
  value,
  InferType,
  InferPublicType,
  InferNotDerivedType,
  InferIsKeyType,
} from "./index";
import { InferAutoType } from "./infer";

describe("schema", () => {
  const isFour = () => 4;
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
    isTrue: boolean().derived(),
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

  it("should accept value", () => {
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
          aOneOf: "hi",
        },
      ],
    };
    // @ts-expect-error test type
    t.anArray[1].aOneOf = "test";
  });

  it("should match type", () => {
    expect(testSchema.getType()).toStrictEqual({
      type: "object",
      keys: {
        id: {
          type: "int",
          auto: true,
          public: true,
          key: true,
        },
        pw: { type: "string", semantic: "password" },
        created: { type: "int", semantic: "time", public: true },
        createdTime: { type: "int", semantic: "daytime" },
        createdDate: { type: "int", semantic: "date" },
        aString: { type: "string" },
        aFloat: { type: "float" },
        aHex: { type: "hex" },
        aBase64: { type: "base64" },
        aEmail: { type: "email" },
        aPhoneISD: { type: "phoneISD" },
        aNill: { type: "null" },
        aAny: { type: "/" },
        isTrue: { type: "boolean", derived: true },
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
});

describe("deep inference", () => {
  it("should infer optional correctly through all complex types", () => {
    // Nesting all available wrapper types within each
    // other. Inferrence should still work.
    const testSchema = obj({
      anArray: array(
        objValues(
          oneOf([
            obj({
              isOptional: string().optional(),
              isNonOptional: string().public(),
            }),
          ])
        )
      ),
    });

    type Test = InferType<typeof testSchema>;
    const f = (a: Test) => a;

    f({ anArray: [{ any: { isOptional: "blu", isNonOptional: "bla" } }] });
    f({ anArray: [{ any: { isNonOptional: "bla" } }] });
    // @ts-expect-error test type
    f({ anArray: [{ any: {} }] });
  });

  it("should infer public correctly through all complex types", () => {
    // Nesting all available wrapper types within each
    // other. Inferrence should still work.
    const testSchema = obj({
      anArray: array(
        objValues(
          oneOf([
            obj({
              isPrivate: string(),
              isPublic: string().public(),
            }),
          ])
        )
      ).public(),
    });

    type HasPublic = InferPublicType<typeof testSchema>;
    const f = (a: HasPublic) => a;

    f({ anArray: [{ any: { isPublic: "test" } }] });
    // @ts-expect-error test type
    f({ anArray: [{ any: {} }] });
  });

  it("should infer derived correctly through all complex types", () => {
    // Nesting all available wrapper types within each
    // other. Inferrence should still work.
    const testSchema = obj({
      anArray: array(
        objValues(
          oneOf([
            obj({
              nonDerived: string(),
              isDerived: string().derived(),
            }),
          ])
        )
      ),
    });

    type HasNoDerived = InferNotDerivedType<typeof testSchema>;
    const f = (a: HasNoDerived) => a;

    f({ anArray: [{ any: { nonDerived: "" } }] });
    f({
      anArray: [
        {
          any: {
            nonDerived: "",
            // @ts-expect-error test type
            isDerived: "test",
          },
        },
      ],
    });
  });

  it("should infer auto correctly through all complex types", () => {
    // Nesting all available wrapper types within each
    // other. Inferrence should still work.
    const testSchema = obj({
      anArray: array(
        objValues(
          oneOf([
            obj({
              isNonAuto: string(),
              isAuto: string().auto(),
            }),
          ])
        )
      ).auto(),
    });

    type HasAuto = InferAutoType<typeof testSchema>;
    const f = (a: HasAuto) => a;

    f({ anArray: [{ any: { isAuto: "test" } }] });
    f({
      anArray: [
        {
          any: {
            // @ts-expect-error test type
            isNonAuto: "",
            isAuto: "",
          },
        },
      ],
    });
  });

  it("should infer key correctly on object", () => {
    const testSchema = obj({
      isKey: int().key(),
      isNotKey: int(),
      anObj: obj({
        isKey: int().key(),
        isNotKey: int(),
      }),
      aKeyObj: obj({
        isKey: int().key(),
        isNotKey: int(),
      }).key(),
    });

    type IsKeys = InferIsKeyType<typeof testSchema>;
    const f = (a: IsKeys) => a;

    f({ isKey: 3, aKeyObj: { isKey: 1, isNotKey: 1 } });
    // @ts-expect-error test type
    f({ isKey: 3 });
    // @ts-expect-error test type
    f({ aKeyObj: { isKey: 1, isNotKey: 1 } });
    // @ts-expect-error test type
    f({ isKey: 3, aKeyObj: { isKey: 1 } });
    // @ts-expect-error test type
    f({});
  });
});

describe("modification", () => {
  it("should create new instance on modification", async () => {
    const testBool = boolean();
    testBool.optional();
    testBool.description("Test");
    testBool.default(true);
    testBool.public();
    testBool.auto();
    testBool.key();
    testBool.derived();
    testBool.mapped("abc");
    testBool.readOnly();

    expect(testBool.getType()).toStrictEqual({
      type: "boolean",
    });
  });

  it("should overwrite flags", async () => {
    const testSchema = obj({
      id: int().auto().key().public(),
      pw: string().semantic("password"),
      created: int().semantic("time").public(),
      itsOptional: int()
        .public()
        .optional()
        .description("But later it will be required"),
    });

    const schemaWithOverwrittenPublic = obj({
      ...testSchema.getKeys(),
      id: testSchema.getKeys().id.private(),
      pw: testSchema.getKeys().pw.optional().public(),
      itsOptional: testSchema.getKeys().itsOptional.required(),
    });

    type TypeWithOverwrittenPublic = InferPublicType<
      typeof schemaWithOverwrittenPublic
    >;

    const f = (a: TypeWithOverwrittenPublic) => a;
    f({ created: 123, itsOptional: 123 });
    f({ pw: "pw", created: 123, itsOptional: 2 });
    // @ts-expect-error test type
    f({ pw: "pw" });
    // @ts-expect-error test type
    f({ id: 123 });

    expect(
      schemaWithOverwrittenPublic.getKeys().itsOptional.getType().optional
    ).not.toBe(true);
    expect(schemaWithOverwrittenPublic.getKeys().id.getType().public).not.toBe(
      true
    );
    expect(schemaWithOverwrittenPublic.getKeys().pw.getType().public).toBe(
      true
    );
  });
});

describe("sub-schema arithmetic", () => {
  it("should return sub schema elements", async () => {
    const testSchema = obj({
      anArray: array(
        obj({
          aKey: int(),
          aOneOf: oneOf([int(), value("hi")]),
        })
      ).optional(),
    });

    const anArrayObjKeys = testSchema.getKeys().anArray.getItems().getKeys();
    anArrayObjKeys.aKey;
    anArrayObjKeys.aOneOf;
    // @ts-expect-error test type
    anArrayObjKeys.doesNotExist;
    expect(anArrayObjKeys.aOneOf.getAlternatives()[0].getType()).toMatchObject({
      type: "int",
    });
  });
});

describe("check", () => {
  it("should use check function in validation", async () => {
    const checkFn = (v: number) => v === 3;
    const testSchema = obj({
      customCheck: int().check(checkFn),
    });
    expect(testSchema.getType().keys.customCheck.check).toBe(checkFn);
  });
});

describe("deepEqual", () => {
  it("should use deepEqual function", async () => {
    const testSchema = obj({
      num: int(),
    });
    expect(testSchema.deepEqual({ num: 3 }, { num: 3 })).toBe(true);
    expect(testSchema.deepEqual({ num: 4 }, { num: 3 })).toBe(false);
  });
});

describe("deepClone", () => {
  it("should use deepClone function", async () => {
    const testSchema = obj({
      num: int(),
    });
    expect(testSchema.deepClone({ num: 3 })).toMatchObject({ num: 3 });
  });
});
