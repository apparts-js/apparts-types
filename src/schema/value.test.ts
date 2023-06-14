import { value, InferType, obj } from "./index";

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
});
