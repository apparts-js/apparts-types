import { boolean, obj, InferType } from "./index";
import { InferAutoType, InferHasDefaultType } from "./infer";

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

  it("should correctly make auto", async () => {
    const baseTypeSchema = obj({ test: boolean().auto() });
    expect(baseTypeSchema.getKeys().test.getType().auto).toBe(true);
    type HasAutos = InferAutoType<typeof baseTypeSchema>;
    const f = (a: HasAutos) => a;
    f({ test: true });
    // @ts-expect-error test type
    f({});
  });

  it("should correctly make hasDefault", async () => {
    const baseTypeSchema = obj({ test: boolean().default(true) });
    expect(baseTypeSchema.getKeys().test.getType().default).toBe(true);
    type HasDefaults = InferHasDefaultType<typeof baseTypeSchema>;
    const f = (a: HasDefaults) => a;
    f({ test: true });
    // @ts-expect-error test type
    f({});
  });
});

describe("fillInDefaults", () => {
  it("should have correct input/output types", async () => {
    const schema = boolean();

    const res = schema.fillInDefaults(false);

    expect(typeof res === "boolean").toBeTruthy();

    // @ts-expect-error not optional
    boolean().fillInDefaults(undefined);

    boolean().optional().fillInDefaults(undefined);

    boolean().default(true).fillInDefaults(undefined);
  });
});

describe("getPruned", () => {
  it("should get pruned", async () => {
    const schema = boolean();

    // @ts-expect-error wrong type
    schema.getPruned([{}]);

    const content = true;
    const res = schema.getPruned(content);

    expect(typeof res).toBe("boolean");

    // @ts-expect-error too much
    res.b;
  });
});
