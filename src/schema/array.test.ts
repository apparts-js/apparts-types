import {
  int,
  boolean,
  array,
  InferType,
  obj,
  InferAutoType,
  InferHasDefaultType,
} from "./index";

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

  it("should make derived", async () => {
    const arraySchema = array(boolean());

    expect(arraySchema.derived().getType().derived).toBe(true);
    expect(arraySchema.getType().derived).not.toBe(true);
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

  it("should correctly make auto", async () => {
    const baseTypeSchema = obj({ test: array(boolean()).auto() });
    expect(baseTypeSchema.getKeys().test.getType().auto).toBe(true);
    type HasAutos = InferAutoType<typeof baseTypeSchema>;
    const f = (a: HasAutos) => a;
    f({ test: [true] });
    // @ts-expect-error test type
    f({});
  });

  it("should correctly make hasDefault", async () => {
    const baseTypeSchema = obj({ test: array(boolean()).default([true]) });
    expect(baseTypeSchema.getKeys().test.getType().default).toStrictEqual([
      true,
    ]);
    type HasDefaults = InferHasDefaultType<typeof baseTypeSchema>;
    const f = (a: HasDefaults) => a;
    f({ test: [true] });
    // @ts-expect-error test type
    f({});
  });
});

describe("fillInDefaults", () => {
  it("should have correct input/output types", async () => {
    const schema = array(int());

    const res = schema.fillInDefaults([3]);

    const a = res[0];
    Math.abs(a);
    expect(typeof a === "number").toBeTruthy();

    // @ts-expect-error not optional
    array(int()).fillInDefaults(undefined);

    array(int()).optional().fillInDefaults(undefined);

    array(int()).default([]).fillInDefaults(undefined);
  });
});

describe("getPruned", () => {
  it("should get pruned", async () => {
    const schema = array(obj({ a: int() }));

    // @ts-expect-error wrong type
    schema.getPruned([{}]);

    const content = [{ a: 1, b: 2 }];
    const res = schema.getPruned(content);

    res[0].a;

    // @ts-expect-error too much
    res[0].b;
  });
});
