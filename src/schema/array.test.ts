import { boolean, array, InferType, obj } from "./index";

describe("array type", () => {
  it("should fail on optional items-type", async () => {
    // @ts-expect-error test type
    array(boolean().optional());
  });

  it("should infer type correctly", async () => {
    const arrayType = array(boolean());
    type MyArr = InferType<typeof arrayType>;
    const f = (a: MyArr) => a;

    f([true, false]);
    f([]);
    // @ts-expect-error test type
    f([1]);
  });

  it("should reject wrongly typed default values", async () => {
    const arraySchema = array(boolean());

    // As function
    arraySchema.default(() => [true, false]);

    // As value
    arraySchema.default([true, false]);

    arraySchema.default([
      // @ts-expect-error test type
      3,
    ]);

    // @ts-expect-error test type
    arraySchema.default(3);
  });

  it("should reject wrongly typed derived values", async () => {
    const arraySchema = array(boolean());

    arraySchema.derived(() => [true, false]);

    arraySchema.derived(() => [
      // @ts-expect-error test type
      4,
    ]);

    // @ts-expect-error test type
    arraySchema.derived(4);
  });

  it("should correctly make optional/required", async () => {
    const arraySchema = array(boolean()).optional();
    expect(arraySchema.getType().optional).toBe(true);
    expect(arraySchema.required().getType().optional).not.toBe(true);

    const hasOptionals = obj({ val: arraySchema });
    type HasOptionals = InferType<typeof hasOptionals>;
    const f = (a: HasOptionals) => a;
    f({ val: [true] });
    f({});

    const hasRequireds = obj({ val: arraySchema.required() });
    type HasRequireds = InferType<typeof hasRequireds>;
    const g = (a: HasRequireds) => a;
    g({ val: [true] });
    // @ts-expect-error test type
    g({});
  });

  it("should correctly make public/private", async () => {
    const arraySchema = array(boolean()).public();
    expect(arraySchema.getType().public).toBe(true);
    expect(arraySchema.private().getType().public).not.toBe(true);
  });
});
