import { boolean, obj, InferType } from "./index";

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

  it("should correctly make optional/required", async () => {
    const baseTypeSchema = boolean().optional();
    expect(baseTypeSchema.getType().optional).toBe(true);
    expect(baseTypeSchema.required().getType().optional).not.toBe(true);

    const hasOptionals = obj({ val: baseTypeSchema });
    type HasOptionals = InferType<typeof hasOptionals>;
    const f = (a: HasOptionals) => a;
    f({ val: true });
    f({});

    const hasRequireds = obj({ val: baseTypeSchema.required() });
    type HasRequireds = InferType<typeof hasRequireds>;
    const g = (a: HasRequireds) => a;
    g({ val: true });
    // @ts-expect-error test type
    g({});
  });

  it("should correctly make public/private", async () => {
    const baseTypeSchema = boolean().public();
    expect(baseTypeSchema.getType().public).toBe(true);
    expect(baseTypeSchema.private().getType().public).not.toBe(true);
  });
});
