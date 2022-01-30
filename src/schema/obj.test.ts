import { bool, obj, InferType } from "./index";

describe("obj type", () => {
  it("should defer optional correctly", async () => {
    const hasOptionals = obj({
      just: bool(),
      maybe: bool().optional(),
    });
    type HasOptionals = InferType<typeof hasOptionals>;
    const f = (a: HasOptionals) => a;

    f({ just: true, maybe: true });
    f({ just: true });
    // @ts-expect-error
    f({ maybe: true });
  });

  it("should defer optinals when created indirectly", async () => {
    /*
      This test is here because in development there was a WTF moment,
      when optional-inferred types were correct when the type was
      created indirectly (keys where assigned to there own variable
      first), but were incorrect when created directly (keys were
      written as inline object in the obj({}) definition).

      To make sure, there is no difference in both approaches, this
      test is here.
    */

    const keys = {
      just: bool(),
      maybe: bool().optional(),
    };
    const indirectlyCreated = obj(keys);
    type IndirectType = InferType<typeof indirectlyCreated>;

    const g = (a: IndirectType) => a;
    g({ just: true });
    g({ just: true, maybe: true });
    // @ts-expect-error
    g({ maybe: true });
  });

  it("should defer optionals obj obj", async () => {
    const hasDesc = obj({
      maybe: obj({
        key: bool(),
      }).optional(),
      just: obj({ key: bool() }),
    });
    type HasDesc = InferType<typeof hasDesc>;
    const f = (a: HasDesc) => a;

    f({ just: { key: true }, maybe: { key: true } });
    f({ just: { key: true } });
    // @ts-expect-error
    f({});
  });
});
