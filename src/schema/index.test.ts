import { int, bool, obj, array, oneOf, value, InferType } from "./index";

describe("ts type", () => {
  it("should match", () => {
    const deriveIsTrue = () => true;
    const isFour = () => 4;
    const testSchema = obj({
      id: int().auto().key().public(),
      isTrue: bool().derived(deriveIsTrue),
      isMaybeTrue: bool().optional(),
      isMaybeThree: int().optional(),
      anObj: obj({
        isMaybeTrue: bool().optional(),
        isThree: int().default(3),
        isFour: int().default(isFour),
      }).optional(),
      anArray: array(
        obj({
          aKey: int(),
        })
      ).optional(),
    });

    expect(testSchema.type).toStrictEqual({
      type: "object",
      keys: {
        id: {
          type: "int",
          auto: true,
          public: true,
          key: true,
        },
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
            },
          },
        },
      },
    });
  });

  it("should reject wrongly typed derived values", async () => {
    const objSchema = obj({
      isMaybeTrue: bool().optional(),
      isThree: int(),
    });

    objSchema.derived(() => ({
      isMaybeTrue: false,
      isThree: 4,
    }));

    // @ts-expect-error
    objSchema.derived(() => ({
      isMaybeTrue: false,
    }));

    // @ts-expect-error
    objSchema.derived(() => 3);
  });

  it("should reject wrongly typed default values", async () => {
    const objSchema = obj({
      isMaybeTrue: bool().optional(),
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

    // @ts-expect-error
    objSchema.derived(() => ({
      isMaybeTrue: false,
    }));

    objSchema.derived({
      // @ts-expect-error
      isMaybeTrue: false,
    });

    // @ts-expect-error
    objSchema.derived(() => 3);
  });
});
