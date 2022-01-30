import { int, bool, obj, array } from "./index";

describe("ts type", () => {
  it("should match", () => {
    const testSchema = obj({
      isTrue: bool(),
      isMaybeTrue: bool().optional(),
      isMaybeThree: int().optional(),
      anObj: obj({
        isMaybeTrue: bool().optional(),
        isThree: int(),
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
        isTrue: { type: "boolean" },
        isMaybeTrue: { type: "boolean", optional: true },
        isMaybeThree: { type: "int", optional: true },
        anObj: {
          type: "object",
          optional: true,
          keys: {
            isMaybeTrue: { type: "boolean", optional: true },
            isThree: { type: "int" },
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
});
