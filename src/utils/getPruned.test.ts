import { obj, int, any, objValues, array, oneOf, value } from "../schema";
import { getPrunedSchema } from "./getPruned";

describe("obj", () => {
  it("should get pruned", async () => {
    const schema = obj({
      a: int(),
    });

    const content = { a: 1, b: 2 };
    let res = getPrunedSchema(schema, content);
    expect(res).toStrictEqual({ a: 1 });

    // @ts-expect-error test type
    res = getPrunedSchema(schema, "99");
    expect(res).toStrictEqual(undefined);
  });
});

describe("objValues", () => {
  it("should get public", async () => {
    const schema = objValues(
      obj({
        a: int(),
      })
    );

    const content = { abc: { a: 1, b: 2 } };
    let res = getPrunedSchema(schema, content);
    expect(res).toStrictEqual({ abc: { a: 1 } });

    // @ts-expect-error test type
    res = getPrunedSchema(schema, "99");
    expect(res).toStrictEqual(undefined);
  });
});

describe("array", () => {
  it("should get public", async () => {
    const schema = array(obj({ a: int() }));

    const content = [{ a: 1, b: 2 }];
    let res = getPrunedSchema(schema, content);
    expect(res).toStrictEqual([{ a: 1 }]);

    // @ts-expect-error test type
    res = getPrunedSchema(schema, "99");
    expect(res).toStrictEqual(undefined);
  });
});

describe("oneOf", () => {
  it("should get public", async () => {
    const schema = oneOf([obj({ a: int() }), obj({ b: int() }), int()]);

    const content = { a: 1, b: 2 };
    let res = getPrunedSchema(schema, content);
    expect(res).toStrictEqual({ a: 1 });

    res = getPrunedSchema(schema, 4);
    expect(res).toStrictEqual(4);

    // @ts-expect-error test type
    res = getPrunedSchema(schema, "99");
    expect(res).toStrictEqual(undefined);
  });
});

describe("value", () => {
  it("should get public", async () => {
    const schema = value(99);

    const content = 99;
    let res = getPrunedSchema(schema, content);
    expect(res).toStrictEqual(99);

    // @ts-expect-error test type
    res = getPrunedSchema(schema, "100");
    expect(res).toStrictEqual(99);
  });
});

describe("base type", () => {
  it("should get public", async () => {
    const schema = int();

    const content = 99;
    let res = getPrunedSchema(schema, content);
    expect(res).toStrictEqual(99);

    // @ts-expect-error test type
    res = getPrunedSchema(schema, "99");
    expect(res).toStrictEqual(undefined);
  });
});

describe("any", () => {
  it("should get public", async () => {
    const schema = any();

    const content = 99;
    const res = getPrunedSchema(schema, content);
    expect(res).toStrictEqual(99);
  });
});
