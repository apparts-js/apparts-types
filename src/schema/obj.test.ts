import {
  boolean,
  InferNotDerivedType,
  InferPublicType,
  InferType,
  int,
  obj,
} from "./index";
import { InferAutoType, InferHasDefaultType } from "./infer";

describe("obj type", () => {
  it("should defer optional correctly", async () => {
    const hasOptionals = obj({
      just: boolean(),
      maybe: boolean().optional(),
    });
    type HasOptionals = InferType<typeof hasOptionals>;
    const f = (a: HasOptionals) => a;

    f({ just: true, maybe: true });
    f({ just: true });
    // @ts-expect-error test type
    f({ maybe: true });
  });

  it("should defer public correctly", async () => {
    const hasPublic = obj({
      isPublic: boolean().public(),
      isPrivate: boolean(),
      isPublicOptional: boolean().public().optional(),
      isPrivateOptional: boolean().optional(),
    });

    type HasPublic = InferPublicType<typeof hasPublic>;
    const f = (a: HasPublic) => a;

    f({ isPublic: true, isPublicOptional: true });
    f({ isPublic: true });
    // @ts-expect-error test type
    f({ isPrivate: true });
    // @ts-expect-error test type
    f({ isPrivate: true, isPublic: true });
    // @ts-expect-error test type
    f({ isPrivateOptional: true, isPublic: true });
  });

  it("should defer not-derived correctly", async () => {
    const hasDerived = obj({
      isNotDerived: boolean(),
      isDerived: boolean().derived(() => false),
    });

    type HasNoDerived = InferNotDerivedType<typeof hasDerived>;
    const f = (a: HasNoDerived) => a;

    f({ isNotDerived: true });
    // @ts-expect-error test type
    f({ isDerived: true });
    // @ts-expect-error test type
    f({ isDerived: true, isNotDerived: true });
  });

  it("should defer optinals when created indirectly", async () => {
    /*
      This test is here because in development there was a WTF moment,
      when optional-inferred types were correct when the type was
      created indirectly (keys where assigned to their own variable
      first), but were incorrect when created directly (keys were
      written as inline object in the obj({}) definition).

      To make sure, there is no difference in both approaches, this
      test is here.
    */

    const keys = {
      just: boolean(),
      maybe: boolean().optional(),
    };
    const indirectlyCreated = obj(keys);
    type IndirectType = InferType<typeof indirectlyCreated>;

    const g = (a: IndirectType) => a;
    g({ just: true });
    g({ just: true, maybe: true });
    // @ts-expect-error test type
    g({ maybe: true });
  });

  it("should defer optionals obj obj", async () => {
    const hasDesc = obj({
      maybe: obj({
        key: boolean(),
      }).optional(),
      just: obj({ key: boolean() }),
    });
    type HasDesc = InferType<typeof hasDesc>;
    const f = (a: HasDesc) => a;

    f({ just: { key: true }, maybe: { key: true } });
    f({ just: { key: true } });
    // @ts-expect-error test type
    f({});
  });

  it("should defer auto correctly", async () => {
    const hasAutos = obj({
      anAuto: boolean().auto(),
      notAnAuto: boolean(),
    });
    type HasAutos = InferAutoType<typeof hasAutos>;
    const f = (a: HasAutos) => a;

    f({ anAuto: true });
    // @ts-expect-error test type
    f({ notAnAuto: true });
  });

  it("should defer hasDefault correctly", async () => {
    const hasDefaults = obj({
      anDefault: boolean().default(true),
      notAnDefault: boolean(),
    });
    type HasDefaults = InferHasDefaultType<typeof hasDefaults>;
    const f = (a: HasDefaults) => a;

    f({ anDefault: true });
    // @ts-expect-error test type
    f({ notAnDefault: true });
  });

  it("should reject wrongly typed default values", async () => {
    const objSchema = obj({
      isMaybeTrue: boolean().optional(),
      isThree: int(),
    });

    // As function
    objSchema.default(() => ({
      isMaybeTrue: false,
      isThree: 4,
    }));

    // As value
    objSchema.default({
      isThree: 4,
    });

    // @ts-expect-error test type
    objSchema.default({
      isMaybeTrue: false,
    });
  });
  it("should reject wrongly typed derived values", async () => {
    const objSchema = obj({
      isMaybeTrue: boolean().optional(),
      isThree: int(),
    });

    objSchema.derived(() => ({
      isThree: 4,
    }));
    objSchema.derived(() => ({
      isThree: 4,
      isMaybeTrue: false,
    }));

    // @ts-expect-error test type
    objSchema.derived(() => ({
      isMaybeTrue: false,
    }));

    objSchema.derived({
      // @ts-expect-error test type
      isThree: 3,
    });

    // @ts-expect-error test type
    objSchema.derived(() => 3);
  });

  it("should correctly make optional/required", async () => {
    const objSchema = obj({ test: boolean() }).optional();
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
    const objSchema = obj({ test: boolean() }).public();
    expect(objSchema.getType().public).toBe(true);
    expect(objSchema.private().getType().public).not.toBe(true);
  });

  it("should correctly make auto", async () => {
    const baseTypeSchema = obj({
      test: obj({ content: boolean().auto() }).auto(),
    });
    expect(baseTypeSchema.getKeys().test.getType().auto).toBe(true);
    type HasAutos = InferAutoType<typeof baseTypeSchema>;
    const f = (a: HasAutos) => a;
    f({ test: { content: true } });
    // @ts-expect-error test type
    f({});
  });

  it("should correctly make hasDefault", async () => {
    const baseTypeSchema = obj({
      test: obj({ content: boolean().default(true) }).default({
        content: true,
      }),
    });
    expect(baseTypeSchema.getKeys().test.getType().default).toStrictEqual({
      content: true,
    });
    type HasDefaults = InferHasDefaultType<typeof baseTypeSchema>;
    const f = (a: HasDefaults) => a;
    f({ test: { content: true } });
    // @ts-expect-error test type
    f({});
  });
});
