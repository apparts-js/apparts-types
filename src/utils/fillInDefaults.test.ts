import {
  obj,
  int,
  any,
  objValues,
  array,
  string,
  oneOf,
  value,
} from "../schema";
import { fillInDefaultsSchema } from "./fillInDefaults";

describe("obj", () => {
  it("should keep empty input w/o direct default", async () => {
    expect(
      fillInDefaultsSchema(
        obj({ a: string().default("test") }).optional(),
        undefined
      )
    ).toStrictEqual(undefined);
    expect(
      fillInDefaultsSchema(
        obj({ a: string().default("test") }).default({ a: "deftest" }),
        undefined
      )
    ).toStrictEqual({ a: "deftest" });
  });

  it("should fill empty object", async () => {
    expect(
      fillInDefaultsSchema(
        obj({ a: string().default("test") }).default({ a: "deftest" }),
        {}
      )
    ).toStrictEqual({ a: "test" });
  });
  it("should fill in non-empty obj", async () => {
    expect(
      fillInDefaultsSchema(
        obj({ a: string().default("test"), b: string().default("test1") }),
        { a: "here" }
      )
    ).toStrictEqual({ a: "here", b: "test1" });
  });

  it("should have correct input/output types", async () => {
    const schema = obj({
      a: string().default("test"),
      c: int(),
    });

    const res = fillInDefaultsSchema(schema, { c: 3 });

    res.a;
    // @ts-expect-error b not on result
    res.b;

    // @ts-expect-error c missing
    fillInDefaultsSchema(schema, { a: 3 });

    // @ts-expect-error a wrong type
    fillInDefaultsSchema(obj({ a: string().default("test") }), { a: 3 });

    // @ts-expect-error not optional
    fillInDefaultsSchema(obj({}), undefined);

    fillInDefaultsSchema(obj({}).optional(), undefined);

    fillInDefaultsSchema(obj({}).default({}), undefined);
  });
});

describe("objValues", () => {
  it("should keep empty input w/o direct default", async () => {
    expect(
      fillInDefaultsSchema(objValues(string()).optional(), undefined)
    ).toStrictEqual(undefined);
  });
  it("should fill in valueObj with default", async () => {
    expect(
      fillInDefaultsSchema(
        objValues(string()).default({ yay: "uff" }),
        undefined
      )
    ).toStrictEqual({ yay: "uff" });
  });
  it("should have correct input/output types", async () => {
    const schema = objValues(int());

    const res = fillInDefaultsSchema(schema, { c: 3 });

    res.a;
    Math.abs(res.a);

    // @ts-expect-error not optional
    fillInDefaultsSchema(objValues(int()), undefined);

    fillInDefaultsSchema(objValues(int()).optional(), undefined);

    fillInDefaultsSchema(objValues(int()).default({}), undefined);
  });
});

describe("array", () => {
  it("should fill in missing array", async () => {
    expect(
      fillInDefaultsSchema(array(string()).default(["yay"]), undefined)
    ).toStrictEqual(["yay"]);
  });

  it("should keep existing array", async () => {
    expect(
      fillInDefaultsSchema(array(string()).default(["yay"]), [])
    ).toStrictEqual([]);
  });
  it("should have correct input/output types", async () => {
    // @ts-expect-error input not correctly typed
    fillInDefaultsSchema(array(string()), [3]);
    // @ts-expect-error input not correctly typed
    fillInDefaultsSchema(array(string()), 3);

    const res = fillInDefaultsSchema(array(string()), ["3"]);

    res[0].charAt;
    // @ts-expect-error wrong type
    Math.abs(res[1]);

    // @ts-expect-error not optional
    fillInDefaultsSchema(array(any()), undefined);

    fillInDefaultsSchema(array(any()).optional(), undefined);

    fillInDefaultsSchema(array(any()).default([]), undefined);
  });
});

describe("others", () => {
  it("should leave field without value or default alone", async () => {
    expect(
      fillInDefaultsSchema(oneOf([value(3), value(3)]).optional(), undefined)
    ).toStrictEqual(undefined);
  });

  it("should fill in oneOf", async () => {
    expect(
      fillInDefaultsSchema(oneOf([value(3), value(3)]).default(3), undefined)
    ).toStrictEqual(3);
  });
});

describe("should run default function", () => {
  it("should run default function ", async () => {
    expect(
      fillInDefaultsSchema(
        oneOf([value(3), value(3)]).default(() => 3),
        undefined
      )
    ).toStrictEqual(3);
  });
  it("should run default function with defaultFnParams ", async () => {
    expect(
      fillInDefaultsSchema(
        oneOf([value(3), int()]).default(((n: number) => n) as () => number),
        undefined,
        77
      )
    ).toStrictEqual(77);
  });
});

describe("base types", () => {
  it("should have correct type", async () => {
    fillInDefaultsSchema(int(), 3);

    // @ts-expect-error wrong type
    fillInDefaultsSchema(int(), "test");

    // @ts-expect-error not optional
    fillInDefaultsSchema(int(), undefined);

    fillInDefaultsSchema(int().optional(), undefined);

    fillInDefaultsSchema(int().default(3), undefined);
  });
});
