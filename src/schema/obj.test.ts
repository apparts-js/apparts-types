import {
  boolean,
  obj /*, objValues*/,
  InferType,
  InferPublicType,
} from "./index";

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
  });

  //  it("should defer optinals when created indirectly", async () => {
  /*
      This test is here because in development there was a WTF moment,
      when optional-inferred types were correct when the type was
      created indirectly (keys where assigned to there own variable
      first), but were incorrect when created directly (keys were
      written as inline object in the obj({}) definition).

      To make sure, there is no difference in both approaches, this
      test is here.
    */

  /*    const keys = {
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
});

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
  });*/
});
