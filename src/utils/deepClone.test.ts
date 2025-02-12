import { array, int, obj, objValues, oneOf, string, value } from "../schema";
import { deepCloneSchema } from "./deepClone";

describe("deepClone should be equal", () => {
  it("obj", () => {
    const testSchema = obj({
      id: int(),
      pw: string().optional(),
      obj: obj({
        pwDeep: string().optional(),
      }),
      objOpt: obj({
        inner: string(),
      }).optional(),
    });
    const val = {
      id: 1,
      pw: "pw",
      obj: {
        pwDeep: "pwDeep",
      },
    };
    const valDeep = deepCloneSchema(val, testSchema);

    expect(testSchema.deepEqual(val, valDeep)).toBe(true);
    val.obj.pwDeep = "pwDeep2";
    expect(testSchema.deepEqual(val, valDeep)).toBe(false);
  });

  it("objValues", () => {
    const testSchema = objValues(obj({ val: string() }));
    const val = {
      test: { val: "test" },
    };
    const valDeep = deepCloneSchema(val, testSchema);

    expect(testSchema.deepEqual(val, valDeep)).toBe(true);
    val.test.val = "test2";
    expect(testSchema.deepEqual(val, valDeep)).toBe(false);
  });

  it("array", () => {
    const testSchema = array(obj({ val: string() }));
    const val = [{ val: "test" }];
    const valDeep = deepCloneSchema(val, testSchema);

    expect(testSchema.deepEqual(val, valDeep)).toBe(true);
    val[0].val = "test2";
    expect(testSchema.deepEqual(val, valDeep)).toBe(false);
  });
  it("oneOf", () => {
    const testSchema = oneOf([obj({ val: string() }), obj({ val: int() })]);
    const val = { val: "test" };
    const valDeep = deepCloneSchema(val, testSchema);

    expect(testSchema.deepEqual(val, valDeep)).toBe(true);
    val.val = "test2";
    expect(testSchema.deepEqual(val, valDeep)).toBe(false);
  });
  it("value", () => {
    const testSchema = value("test");
    const val = "test";
    const valDeep = deepCloneSchema(val, testSchema);

    expect(testSchema.deepEqual(val, valDeep)).toBe(true);
  });
  it("int", () => {
    const testSchema = int();
    const val = 1;
    const valDeep = deepCloneSchema(val, testSchema);

    expect(testSchema.deepEqual(val, valDeep)).toBe(true);
  });
});
