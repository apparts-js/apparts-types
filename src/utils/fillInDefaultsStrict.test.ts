import {
  obj,
  int,
  objValues,
  array,
  string,
  oneOf,
  value,
  boolean,
} from "../schema";
import { fillInDefaultsStrictSchema } from "./fillInDefaultsStrict";

describe("obj", () => {
  it("should keep empty input w/o direct default", async () => {
    expect(
      fillInDefaultsStrictSchema(
        obj({ a: string().default("test") }).optional(),
        undefined
      )
    ).toStrictEqual(undefined);
    expect(
      fillInDefaultsStrictSchema(
        obj({
          a: string().default("innerdef"),
        }).default({ a: "outerdef" }),
        undefined
      )
    ).toStrictEqual({ a: "outerdef" });
  });

  it("should fill empty object", async () => {
    expect(
      fillInDefaultsStrictSchema(
        obj({ a: string().default("test") }).default({ a: "deftest" }),
        {}
      )
    ).toStrictEqual({ a: "test" });
  });
  it("should fill in non-empty obj", async () => {
    expect(
      fillInDefaultsStrictSchema(
        obj({
          a: string().default("test"),
          b: string().default("test1"),
          c: obj({ d: string().default("innerdef") }),
        }),
        // @ts-expect-error TODO: enable recursive omitting of fields
        // with default
        { a: "here", c: {} }
      )
    ).toStrictEqual({ a: "here", b: "test1", c: { d: "innerdef" } });
  });

  it("should not fill in empty valueObj", async () => {
    expect(
      fillInDefaultsStrictSchema(objValues(string()).optional(), undefined)
    ).toStrictEqual(undefined);
  });
  it("should fill in valueObj with default", async () => {
    expect(
      fillInDefaultsStrictSchema(
        objValues(string()).default({ yay: "uff" }),
        undefined
      )
    ).toStrictEqual({ yay: "uff" });
  });

  it("should leave non-obj that has default", async () => {
    expect(fillInDefaultsStrictSchema(obj({}).default({}), [])).toStrictEqual(
      []
    );
  });

  it("should not set optional value wo default", async () => {
    const result = fillInDefaultsStrictSchema(
      obj({ opt: string().optional(), req: string().default("bla") }),
      {}
    );

    expect(result).toStrictEqual({ req: "bla" });
    expect("opt" in result).toBe(false);
  });
});

describe("array", () => {
  it("should fill in missing array that has default", async () => {
    expect(
      fillInDefaultsStrictSchema(array(string()).default(["yay"]), undefined)
    ).toStrictEqual(["yay"]);
  });

  it("should keep existing array that has default", async () => {
    expect(
      fillInDefaultsStrictSchema(array(string()).default(["yay"]), [])
    ).toStrictEqual([]);
  });

  it("should keep missing array that has no default", async () => {
    expect(
      fillInDefaultsStrictSchema(array(string()).optional(), undefined)
    ).toStrictEqual(undefined);
  });
});

describe("others", () => {
  it("should leave field without value or default alone", async () => {
    expect(
      fillInDefaultsStrictSchema(
        oneOf([value(3), value(3)]).optional(),
        undefined
      )
    ).toStrictEqual(undefined);
    expect(
      fillInDefaultsStrictSchema(boolean().optional(), undefined)
    ).toStrictEqual(undefined);
  });

  it("should fill in oneOf that has a default", async () => {
    expect(
      fillInDefaultsStrictSchema(
        oneOf([value(3), value(3)]).default(3),
        undefined
      )
    ).toStrictEqual(3);
  });

  it("should leave wrongly typed input despite default", async () => {
    expect(
      fillInDefaultsStrictSchema(
        oneOf([value(3), value(3)]).default(3),
        // @ts-expect-error wrong type
        []
      )
    ).toStrictEqual([]);
  });

  it("should insert value with default", async () => {
    expect(
      fillInDefaultsStrictSchema(value(3).default(3), undefined)
    ).toStrictEqual(3);
  });
  it("should keep wrong value with default", async () => {
    expect(
      fillInDefaultsStrictSchema(
        value(3).default(3),
        // @ts-expect-error wrong type
        4
      )
    ).toStrictEqual(4);
  });
});

describe("should run default function", () => {
  it("should run default function ", async () => {
    expect(
      fillInDefaultsStrictSchema(
        oneOf([value(3), value(3)]).default(() => 3),
        undefined
      )
    ).toStrictEqual(3);
  });
  it("should run default function with defaultFnParams ", async () => {
    expect(
      fillInDefaultsStrictSchema(
        oneOf([value(3), int()]).default(((n: number) => n) as () => number),
        undefined,
        77
      )
    ).toStrictEqual(77);
  });
});
