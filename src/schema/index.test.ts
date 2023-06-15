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
} from "./index";

describe("ts type", () => {
  it("should match", () => {
    const deriveIsTrue = () => true;
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

    /*    const otherSchema1 = obj({
      ...otherSchema.getKeysAsPrivate(),
      pw: testSchema.getKeys().pw.optional().public(),
    });
    type TTTTT1 = InferType<typeof otherSchema1>;*/

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

  it("should defer correctly through all complex types", () => {
    const deriveIsTrue = () => true;
    const isFour = () => 4;
    const testSchema = obj({
      anArray: array(
        objValues(
          oneOf([
            obj({
              isOptional: string().optional(),
              isPublic: string().public(),
              isDerived: string().derived(() => "a"),
            }),
          ])
        )
      ).public(),
    });

    type Test = InferType<typeof testSchema>;
    const f = (a: Test) => a;

    f({ anArray: [{ any: { isPublic: "test", isDerived: "bla" } }] });
    // @ts-expect-error test type
    f({ anArray: [{ any: { isPublic: "test" } }] });

    type HasPublic = InferPublicType<typeof testSchema>;
    const g = (a: HasPublic) => a;

    g({ anArray: [{ any: { isPublic: "test" } }] });
    // @ts-expect-error test type
    g({ anArray: [{ any: {} }] });

    type HasNoDerived = InferNotDerivedType<typeof testSchema>;
    const h = (a: HasNoDerived) => a;

    h({ anArray: [{ any: { isPublic: "" } }] });
    h({
      anArray: [
        {
          any: {
            isPublic: "",
            // @ts-expect-error test type
            isDerived: "test",
          },
        },
      ],
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

    objSchema.derived(() => ({
      isThree: 4,
    }));
    objSchema.derived(() => ({
      isThree: 4,
      isMaybeTrue: false,
    }));

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
