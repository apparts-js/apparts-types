import {
  value,
  InferType,
  obj,
  InferAutoType,
  InferHasDefaultType,
} from "./index";

describe("value type", () => {
  it("should infer type correctly", async () => {
    const valueSchema = value(3);
    type MyValueType = InferType<typeof valueSchema>;
    const f = (a: MyValueType) => a;

    f(3);
    // @ts-expect-error test type
    f(4);
    // @ts-expect-error test type
    f("3");
    // @ts-expect-error test type
    f(true);
    // @ts-expect-error test type
    f([]);
  });

  it("should reject wrongly typed default values", async () => {
    const baseSchema = value(3);

    // As function
    baseSchema.default(() => 3);

    // As value
    baseSchema.default(3);

    // @ts-expect-error test type
    baseSchema.default(4);
  });

  it("should make derived", async () => {
    const valueSchema = value(3);

    expect(valueSchema.derived().getType().derived).toBe(true);
    expect(valueSchema.getType().derived).not.toBe(true);
  });

  it("should correctly make optional/required", async () => {
    const valueSchema = value(3).optional();
    expect(valueSchema.getType().optional).toBe(true);
    expect(valueSchema.required().getType().optional).not.toBe(true);

    const hasOptionals = obj({ val: valueSchema });
    type HasOptionals = InferType<typeof hasOptionals>;
    const f = (a: HasOptionals) => a;
    f({ val: 3 });
    f({});

    const hasRequireds = obj({ val: valueSchema.required() });
    type HasRequireds = InferType<typeof hasRequireds>;
    const g = (a: HasRequireds) => a;
    g({ val: 3 });
    // @ts-expect-error test type
    g({});
  });

  it("should correctly make public/private", async () => {
    const valueSchema = value(3).public();
    expect(valueSchema.getType().public).toBe(true);
    expect(valueSchema.private().getType().public).not.toBe(true);
  });

  it("should correctly make auto", async () => {
    const baseTypeSchema = obj({ test: value(3).auto() });
    expect(baseTypeSchema.getKeys().test.getType().auto).toBe(true);
    type HasAutos = InferAutoType<typeof baseTypeSchema>;
    const f = (a: HasAutos) => a;
    f({ test: 3 });
    // @ts-expect-error test type
    f({});
  });
  it("should correctly make hasDefault", async () => {
    const baseTypeSchema = obj({ test: value(true).default(true) });
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
    const schema = value(3);

    const res = schema.fillInDefaults(3);

    expect(typeof res === "number").toBeTruthy();

    // @ts-expect-error not optional
    value(3).fillInDefaults(undefined);

    value(3).optional().fillInDefaults(undefined);

    value(3).default(3).fillInDefaults(undefined);
  });
});

describe("getPruned", () => {
  it("should get pruned", async () => {
    const schema = value(199);

    // @ts-expect-error wrong type
    schema.getPruned([{}]);

    const content = 199;
    const res = schema.getPruned(content);

    expect(res).toBe(199);

    // @ts-expect-error too much
    res.b;
  });
});
