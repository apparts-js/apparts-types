import { boolean, InferType } from "./index";

describe("baseType type", () => {
  it("should infer type correctly", async () => {
    const boolType = boolean();
    type MyArr = InferType<typeof boolType>;
    const f = (a: MyArr) => a;

    f(true);
    f(false);
    // @ts-expect-error test type
    f([1]);
  });

  it("should reject wrongly typed default values", async () => {
    const baseSchema = boolean();

    // As function
    baseSchema.default(() => true);

    // As value
    baseSchema.default(false);

    // @ts-expect-error test type
    baseSchema.default(3);
  });

  it("should reject wrongly typed derived values", async () => {
    const baseSchema = boolean();

    baseSchema.derived(() => true);

    // @ts-expect-error test type
    baseSchema.derived(4);
  });
});
