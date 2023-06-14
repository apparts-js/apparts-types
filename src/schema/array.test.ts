import { boolean, array, InferType } from "./index";

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

    // @ts-expect-error test type
    arraySchema.default([3]);

    // @ts-expect-error test type
    arraySchema.default(3);
  });

  it("should reject wrongly typed derived values", async () => {
    const arraySchema = array(boolean());

    arraySchema.derived(() => [true, false]);

    // @ts-expect-error test type
    arraySchema.derived(() => [4]);

    // @ts-expect-error test type
    arraySchema.derived(4);
  });
});
