import { boolean, InferAutoType, InferType, obj, objValues } from "./index";

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
  it("should reject wrongly typed derived values", async () => {
    const objSchema = objValues(boolean());

    objSchema.derived(() => ({
      isBool: true,
    }));

    objSchema.derived(() => ({
      // @ts-expect-error test type
      isNumber: 3,
    }));

    // @ts-expect-error test type
    objSchema.derived(() => 3);
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
});
