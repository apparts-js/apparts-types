import {
  int,
  boolean,
  InferAutoType,
  InferHasDefaultType,
  InferType,
  obj,
  objValues,
} from "./index";

describe("objValues type", () => {
  it("should defer type correctly", async () => {
    const valuesObjSchema = objValues(boolean());
    type ValuesObjType = InferType<typeof valuesObjSchema>;
    const f = (a: ValuesObjType) => a;

    f({});
    f({ just: true, maybe: false });
    f({ just: true });
    // @ts-expect-error test type
    f({ number: 43 });
  });

  it("should reject wrongly typed default values", async () => {
    const objSchema = objValues(boolean());

    // As function
    objSchema.default(() => ({
      isBool: false,
    }));

    // As value
    objSchema.default({
      isBool: false,
    });

    objSchema.default({
      // @ts-expect-error test type
      isNumber: 3,
    });

    // @ts-expect-error test type
    objSchema.default(3);
  });

  it("should make derived", async () => {
    const objSchema = objValues(boolean());

    expect(objSchema.derived().getType().derived).toBe(true);
    expect(objSchema.getType().derived).not.toBe(true);
  });

  it("should correctly make optional/required", async () => {
    const objSchema = objValues(boolean()).optional();
    expect(objSchema.getType().optional).toBe(true);
    expect(objSchema.required().getType().optional).not.toBe(true);

    const hasOptionals = obj({ val: objSchema });
    type HasOptionals = InferType<typeof hasOptionals>;
    const f = (a: HasOptionals) => a;
    f({ val: { test: true } });
    f({});

    const hasRequireds = obj({ val: objSchema.required() });
    type HasRequireds = InferType<typeof hasRequireds>;
    const g = (a: HasRequireds) => a;
    g({ val: { test: true } });
    // @ts-expect-error test type
    g({});
  });

  it("should correctly make public/private", async () => {
    const objSchema = objValues(boolean()).public();
    expect(objSchema.getType().public).toBe(true);
    expect(objSchema.private().getType().public).not.toBe(true);
  });

  it("should correctly make auto", async () => {
    const baseTypeSchema = obj({ test: objValues(boolean()).auto() });
    expect(baseTypeSchema.getKeys().test.getType().auto).toBe(true);
    type HasAutos = InferAutoType<typeof baseTypeSchema>;
    const f = (a: HasAutos) => a;
    f({ test: { test: true } });
    // @ts-expect-error test type
    f({});
  });

  it("should correctly make hasDefault", async () => {
    const baseTypeSchema = obj({
      test: objValues(boolean()).default({ test: true }),
    });
    expect(baseTypeSchema.getKeys().test.getType().default).toStrictEqual({
      test: true,
    });
    type HasDefaults = InferHasDefaultType<typeof baseTypeSchema>;
    const f = (a: HasDefaults) => a;
    f({ test: { test: true } });
    // @ts-expect-error test type
    f({});
  });
});
describe("fillInDefaults", () => {
  it("should have correct input/output types", async () => {
    const schema = objValues(int());

    const res = schema.fillInDefaults({ c: 3 });

    res.a;
    Math.abs(res.a);

    // @ts-expect-error not optional
    objValues(int()).fillInDefaults(undefined);

    objValues(int()).optional().fillInDefaults(undefined);

    objValues(int()).default({}).fillInDefaults(undefined);
  });
});

describe("getPruned", () => {
  it("should get pruned", async () => {
    const schema = objValues(obj({ a: int() }));

    // @ts-expect-error wrong type
    schema.getPruned([{}]);

    const content = { abc: { a: 1, b: 2 } };
    const res = schema.getPruned(content);

    res.abc.a;

    // @ts-expect-error too much
    res.abc.b;
  });
});
