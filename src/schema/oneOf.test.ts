import {
  obj,
  oneOf,
  boolean,
  int,
  InferType,
  InferAutoType,
  InferHasDefaultType,
} from "./index";

describe("obj type", () => {
  it("should defer type correctly", async () => {
    const oneOfSchema = oneOf([boolean(), int()]);
    type OneOf = InferType<typeof oneOfSchema>;
    const f = (a: OneOf) => a;

    f(true);
    f(3);
    // @ts-expect-error test type
    f({ maybe: true });
    // @ts-expect-error test type
    f("test");
  });

  it("should defer type correctly with obj", async () => {
    const oneOfSchema = oneOf([
      obj({
        testNumber: int(),
      }),
      obj({
        testBool: boolean(),
      }),
    ]);
    type OneOf = InferType<typeof oneOfSchema>;
    const f = (a: OneOf) => a;

    f({ testBool: true });
    // @ts-expect-error test type
    f({});
    // @ts-expect-error test type
    f(3);
  });

  it("should reject wrongly typed default values", async () => {
    const oneOfSchema = oneOf([boolean(), int()]);

    // As function
    oneOfSchema.default(() => true);

    // As value
    oneOfSchema.default(43);

    // @ts-expect-error test type
    oneOfSchema.default("string");
  });

  it("should reject wrongly typed derived values", async () => {
    const oneOfSchema = oneOf([boolean(), int()]);

    oneOfSchema.derived(() => true);
    oneOfSchema.derived(() => 43);

    // @ts-expect-error test type
    oneOfSchema.derived("string");
  });

  it("should correctly make optional/required", async () => {
    const oneOfSchema = oneOf([boolean(), int()]).optional();
    expect(oneOfSchema.getType().optional).toBe(true);
    expect(oneOfSchema.required().getType().optional).not.toBe(true);

    const hasOptionals = obj({ val: oneOfSchema });
    type HasOptionals = InferType<typeof hasOptionals>;
    const f = (a: HasOptionals) => a;
    f({ val: 3 });
    f({});

    const hasRequireds = obj({ val: oneOfSchema.required() });
    type HasRequireds = InferType<typeof hasRequireds>;
    const g = (a: HasRequireds) => a;
    g({ val: 3 });
    // @ts-expect-error test type
    g({});
  });

  it("should correctly make public/private", async () => {
    const oneOfSchema = oneOf([boolean(), int()]).public();
    expect(oneOfSchema.getType().public).toBe(true);
    expect(oneOfSchema.private().getType().public).not.toBe(true);
  });

  it("should correctly make auto", async () => {
    const baseTypeSchema = obj({ test: oneOf([boolean()]).auto() });
    expect(baseTypeSchema.getKeys().test.getType().auto).toBe(true);
    type HasAutos = InferAutoType<typeof baseTypeSchema>;
    const f = (a: HasAutos) => a;
    f({ test: true });
    // @ts-expect-error test type
    f({});
  });
  it("should correctly make hasDefault", async () => {
    const baseTypeSchema = obj({ test: oneOf([boolean()]).default(true) });
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
    const schema = oneOf([int()]);

    const res = schema.fillInDefaults(3);

    expect(typeof res === "number").toBeTruthy();

    // @ts-expect-error not optional
    oneOf([int()]).fillInDefaults(undefined);

    oneOf([int()]).optional().fillInDefaults(undefined);

    oneOf([int()]).default(3).fillInDefaults(undefined);
  });
});

describe("getPruned", () => {
  it("should get pruned", async () => {
    const schema = oneOf([obj({ a: int() }), obj({ a: int(), c: int() })]);

    // @ts-expect-error wrong type
    schema.getPruned([{}]);

    const content = { a: 1, b: 2 };
    const res = schema.getPruned(content);

    res.a;

    // @ts-expect-error too much
    res.b;
  });
});
