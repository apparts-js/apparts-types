export const value = (checkType) => {
  expect(checkType({ value: "4" }, 4)).toBe(false);
  expect(checkType({ value: 4 }, 4)).toBe(true);
  expect(checkType({ value: "true" }, true)).toBe(false);
  expect(checkType({ value: true }, true)).toBe(true);
  expect(checkType({ value: false }, false)).toBe(true);
  expect(checkType({ value: "test" }, "Test")).toBe(false);
  expect(checkType({ value: "test" }, "test")).toBe(true);
  expect(checkType({ value: 0 }, 0)).toBe(true);
  expect(checkType({ value: "" }, "")).toBe(true);
  expect(checkType({ value: null }, null)).toBe(true);
};

export const any = (checkType) => {
  expect(checkType({ type: "/" }, 4)).toBe(true);
  expect(checkType({ type: "/" }, ["a", 3])).toBe(true);
  expect(checkType({ type: "/" }, { an: "object" })).toBe(true);
  expect(checkType({ type: "/" }, true)).toBe(true);
  expect(checkType({ type: "/" }, null)).toBe(true);
  expect(checkType({ type: "/" }, "its a string")).toBe(true);
  expect(checkType({ type: "/" }, "7ce767a4-ec6e-4ff5-b163-f501165eaf83")).toBe(
    true
  );
  expect(checkType({ type: "/" }, "3")).toBe(true);

  // with custom check
  const type = { type: "/", check: (x) => x.length && x.length === 8 };
  expect(checkType(type, "dGVzdA=")).toBe(false);
  expect(checkType(type, "dGVzdA==")).toBe(true);
  expect(checkType(type, 4.4)).toBe(false);
};

export const int = (checkType) => {
  const type = { type: "int" };
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, [])).toBe(false);
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, { an: "object" })).toBe(false);
  expect(checkType(type, "its a string")).toBe(false);
  expect(checkType(type, "")).toBe(false);
  expect(checkType(type, "3")).toBe(false);
  expect(checkType(type, "-4")).toBe(false);
  expect(checkType(type, 3)).toBe(true);
  expect(checkType(type, 0)).toBe(true);
  expect(checkType(type, -4)).toBe(true);
  expect(checkType(type, true)).toBe(false);
  expect(checkType(type, false)).toBe(false);
  expect(checkType(type, null)).toBe(false);
  expect(checkType(type, "ABCDEF1234567890")).toBe(false);
  expect(checkType(type, "dGVzdA==")).toBe(false);

  // with custom check
  type.check = (x) => x > 8;
  expect(checkType(type, "dGVzdA=")).toBe(false);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, 4)).toBe(false);
  expect(checkType(type, 10)).toBe(true);
};

export const uuid = (checkType) => {
  const type = { type: "uuid" };
  expect(checkType(type, "7ce767a4-ec6e-4ff5-b163-f501165eaf83")).toBe(true);
  expect(checkType(type, 4)).toBe(false);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, [])).toBe(false);
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, { an: "object" })).toBe(false);
  expect(checkType(type, "its a string")).toBe(false);
  expect(checkType(type, "7ce767a4-ec6e-5ff5-b163-f501165eaf83")).toBe(true);
  expect(checkType(type, "7ce767a4ec6e-4ff5-b163-f501165eaf83")).toBe(false);
  expect(checkType(type, "7ce767a4-ec6e-4ff5-b163-f501165eaf8")).toBe(false);
  expect(checkType(type, "7ce767a4-ec6e-4ff5-b163-g501165eaf83")).toBe(false);
  expect(checkType(type, "7ce76a4-ec6e-4ff5-b163-f501165eaf83")).toBe(false);
  expect(checkType(type, "")).toBe(false);
  expect(checkType(type, "3")).toBe(false);
  expect(checkType(type, true)).toBe(false);
  expect(checkType(type, false)).toBe(false);
  expect(checkType(type, null)).toBe(false);
  expect(checkType(type, "ABCDEF1234567890")).toBe(false);
  expect(checkType(type, "dGVzdA==")).toBe(false);
};

export const float = (checkType) => {
  const type = { type: "float" };
  expect(checkType(type, 4)).toBe(true);
  expect(checkType(type, 4.4)).toBe(true);
  expect(checkType(type, -4)).toBe(true);
  expect(checkType(type, -4.4)).toBe(true);
  expect(checkType(type, [])).toBe(false);
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, { an: "object" })).toBe(false);
  expect(checkType(type, "its a string")).toBe(false);
  expect(checkType(type, "7ce767a4-ec6e-4ff5-b163-f501165eaf83")).toBe(false);
  expect(checkType(type, "")).toBe(false);
  expect(checkType(type, "3")).toBe(false);
  expect(checkType(type, "-3.9")).toBe(false);
  expect(checkType(type, true)).toBe(false);
  expect(checkType(type, false)).toBe(false);
  expect(checkType(type, null)).toBe(false);
  expect(checkType(type, "ABCDEF1234567890")).toBe(false);
  expect(checkType(type, "dGVzdA==")).toBe(false);
};

export const hex = (checkType) => {
  const type = { type: "hex" };
  expect(checkType(type, 4)).toBe(false);
  expect(checkType(type, "")).toBe(false);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, [])).toBe(false);
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, { an: "object" })).toBe(false);
  expect(checkType(type, "its a string")).toBe(false);
  expect(checkType(type, "7ce767a4-ec6e-4ff5-b163-f501165eaf83")).toBe(false);
  expect(checkType(type, "3")).toBe(true);
  expect(checkType(type, true)).toBe(false);
  expect(checkType(type, false)).toBe(false);
  expect(checkType(type, null)).toBe(false);
  expect(checkType(type, "ABCDEF1234567890")).toBe(true);
  expect(checkType(type, "dGVzdA==")).toBe(false);
};

export const base64 = (checkType) => {
  const type = { type: "base64" };
  expect(checkType(type, 6455)).toBe(false);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, [])).toBe(false);
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, { an: "object" })).toBe(false);
  expect(checkType(type, "its a string")).toBe(false);
  expect(checkType(type, "7ce767a4-ec6e-4ff5-b163-f501165eaf83")).toBe(false);
  expect(checkType(type, "")).toBe(true);
  expect(checkType(type, true)).toBe(false);
  expect(checkType(type, false)).toBe(false);
  expect(checkType(type, null)).toBe(false);
  expect(checkType(type, "3")).toBe(false);
  expect(checkType(type, "ABCDEF1234567890=")).toBe(false);
  expect(checkType(type, "ABCDEF1234567890")).toBe(true);
  expect(checkType(type, "dGVzdA==")).toBe(true);
};

export const bool = (checkType) => {
  const type = { type: "boolean" };
  expect(checkType(type, 4)).toBe(false);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, [])).toBe(false);
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, { an: "object" })).toBe(false);
  expect(checkType(type, "its a string")).toBe(false);
  expect(checkType(type, "7ce767a4-ec6e-4ff5-b163-f501165eaf83")).toBe(false);
  expect(checkType(type, "")).toBe(false);
  expect(checkType(type, "3")).toBe(false);
  expect(checkType(type, true)).toBe(true);
  expect(checkType(type, false)).toBe(true);
  expect(checkType(type, null)).toBe(false);
  expect(checkType(type, "ABCDEF1234567890")).toBe(false);
  expect(checkType(type, "dGVzdA==")).toBe(false);
};

export const string = (checkType, p = "string") => {
  const type = { type: p };
  expect(checkType(type, 4)).toBe(false);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, true)).toBe(false);
  expect(checkType(type, false)).toBe(false);
  expect(checkType(type, null)).toBe(false);
  expect(checkType(type, [])).toBe(false);
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, { an: "object" })).toBe(false);
  expect(checkType(type, "")).toBe(true);
  expect(checkType(type, "")).toBe(true);
  expect(checkType(type, encodeURIComponent("%rty"))).toBe(true);
  expect(checkType(type, "its a&stri=ng")).toBe(true);
  expect(checkType(type, "its a/string")).toBe(true);
  expect(checkType(type, "its a string")).toBe(true);
  expect(checkType(type, "7ce767a4-ec6e-4ff5-b163-f501165eaf83")).toBe(true);
  expect(checkType(type, "3")).toBe(true);
  expect(checkType(type, "ABCDEF1234567890")).toBe(true);
  expect(checkType(type, "dGVzdA==")).toBe(true);

  // with custom check
  type.check = (x) => x.length === 8;
  expect(checkType(type, "dGVzdA=")).toBe(false);
  expect(checkType(type, "dGVzdA==")).toBe(true);
  expect(checkType(type, 4.4)).toBe(false);
};

export const email = (checkType) => {
  const type = { type: "email" };
  expect(checkType(type, 4)).toBe(false);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, [])).toBe(false);
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, { an: "object" })).toBe(false);
  expect(checkType(type, "its a string")).toBe(false);
  expect(checkType(type, "7ce767a4-ec6e-4ff5-b163-f501165eaf83")).toBe(false);
  expect(checkType(type, "")).toBe(false);
  expect(checkType(type, "3")).toBe(false);
  expect(checkType(type, true)).toBe(false);
  expect(checkType(type, false)).toBe(false);
  expect(checkType(type, null)).toBe(false);
  expect(checkType(type, "ABCDEF1234567890")).toBe(false);
  expect(checkType(type, "dGVzdA==")).toBe(false);
  expect(checkType(type, "@def.gh")).toBe(false);
  expect(checkType(type, "abcdef.gh")).toBe(false);
  expect(checkType(type, "abc@defgh")).toBe(false);
  expect(checkType(type, "abc@def.g")).toBe(false);
  expect(checkType(type, "abc@.gh")).toBe(false);
  expect(checkType(type, "abc@def.gh")).toBe(true);
  expect(checkType(type, "abc@base.kitchen")).toBe(true);
};

export const phoneISD = (checkType) => {
  const type = { type: "phoneISD" };
  expect(checkType(type, 4)).toBe(false);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, [])).toBe(false);
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, { an: "object" })).toBe(false);
  expect(checkType(type, "its a string")).toBe(false);
  expect(checkType(type, "7ce767a4-ec6e-4ff5-b163-f501165eaf83")).toBe(false);
  expect(checkType(type, "")).toBe(false);
  expect(checkType(type, "3")).toBe(false);
  expect(checkType(type, true)).toBe(false);
  expect(checkType(type, false)).toBe(false);
  expect(checkType(type, null)).toBe(false);
  expect(checkType(type, "ABCDEF1234567890")).toBe(false);
  expect(checkType(type, "dGVzdA==")).toBe(false);
  expect(checkType(type, "abc@defgh")).toBe(false);
  expect(checkType(type, "+49 01573 193 84-2")).toBe(true);
  expect(checkType(type, "+49 01573 193 abc84-2")).toBe(false);
  expect(checkType(type, "01573 193 84-2")).toBe(false);
};

export const array = (checkType) => {
  const type = { type: "array", items: { type: "email" } };
  expect(checkType(type, 4)).toBe(false);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, [])).toBe(true);
  expect(checkType(type, ["abc@def.gh", "abc1@def.gh", "abc3@def.gh"])).toBe(
    true
  );
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, ["a", 3, true, false, null, undefined, 3.3])).toBe(
    false
  );
  expect(checkType(type, { an: "object" })).toBe(false);
  expect(checkType(type, "its a string")).toBe(false);
  expect(checkType(type, "7ce767a4-ec6e-4ff5-b163-f501165eaf83")).toBe(false);
  expect(checkType(type, "")).toBe(false);
  expect(checkType(type, "3")).toBe(false);
  expect(checkType(type, true)).toBe(false);
  expect(checkType(type, false)).toBe(false);
  expect(checkType(type, null)).toBe(false);
  expect(checkType(type, "ABCDEF1234567890")).toBe(false);
  expect(checkType(type, "dGVzdA==")).toBe(false);
};

export const object = (checkType) => {
  const type = {
    type: "object",
    keys: {
      firstKey: { type: "email" },
      secondKey: { type: "int" },
    },
  };
  expect(checkType(type, 4)).toBe(false);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, [])).toBe(false);
  expect(checkType(type, ["abc@def.gh", "abc1@def.gh", "abc3@def.gh"])).toBe(
    false
  );
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, ["a", 3, true, false, null, undefined, 3.3])).toBe(
    false
  );
  expect(checkType(type, { an: "object" })).toBe(false);
  expect(checkType(type, "its a string")).toBe(false);
  expect(checkType(type, "7ce767a4-ec6e-4ff5-b163-f501165eaf83")).toBe(false);
  expect(checkType(type, "")).toBe(false);
  expect(checkType(type, "3")).toBe(false);
  expect(checkType(type, true)).toBe(false);
  expect(checkType(type, false)).toBe(false);
  expect(checkType(type, null)).toBe(false);
  expect(checkType(type, "ABCDEF1234567890")).toBe(false);
  expect(checkType(type, "dGVzdA==")).toBe(false);
  expect(checkType(type, {})).toBe(false);
  expect(checkType(type, { firstKey: "abc@de.de" })).toBe(false);
  expect(
    checkType(type, { firstKey: "abc@de.de", secondKey: 3, thirdKey: true })
  ).toBe(false);
  expect(checkType(type, { firstKey: "abc@de.de", secondKey: 3 })).toBe(true);
  expect(checkType(type, { firstKey: "abc@de.de", secondKey: 3.3 })).toBe(
    false
  );

  const objectValueType = {
    type: "object",
    values: {
      type: "object",
      keys: { firstKey: { type: "string" } },
    },
  };
  expect(
    checkType(objectValueType, {
      a: { firstKey: "abc@de.de" },
      b: { firstKey: "abc@de.de" },
    })
  ).toBe(true);
  expect(
    checkType(objectValueType, [
      { firstKey: "abc@de.de" },
      { firstKey: "abc@de.de" },
    ])
  ).toBe(false);
};

export const oneOf = (checkType) => {
  const type = {
    type: "oneOf",
    alternatives: [{ type: "email" }, { type: "int" }],
  };
  expect(checkType(type, "abc@de.de")).toBe(true);
  expect(checkType(type, 4)).toBe(true);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, [])).toBe(false);
  expect(checkType(type, ["abc@def.gh", "abc1@def.gh", "abc3@def.gh"])).toBe(
    false
  );
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, ["a", 3, true, false, null, undefined, 3.3])).toBe(
    false
  );
  expect(checkType(type, { an: "object" })).toBe(false);
  expect(checkType(type, "its a string")).toBe(false);
  expect(checkType(type, "7ce767a4-ec6e-4ff5-b163-f501165eaf83")).toBe(false);
  expect(checkType(type, "")).toBe(false);
  expect(checkType(type, "3")).toBe(false);
  expect(checkType(type, true)).toBe(false);
  expect(checkType(type, false)).toBe(false);
  expect(checkType(type, null)).toBe(false);
  expect(checkType(type, "ABCDEF1234567890")).toBe(false);
  expect(checkType(type, "dGVzdA==")).toBe(false);
  expect(checkType(type, {})).toBe(false);
  expect(checkType(type, { firstKey: "abc@de.de" })).toBe(false);
  expect(
    checkType(type, { firstKey: "abc@de.de", secondKey: 3, thirdKey: true })
  ).toBe(false);
  expect(checkType(type, { firstKey: "abc@de.de", secondKey: 3 })).toBe(false);
  expect(checkType(type, { firstKey: "abc@de.de", secondKey: 3.3 })).toBe(
    false
  );

  const valueType = {
    type: "oneOf",
    alternatives: [{ value: "test1" }, { value: "test2" }, { value: "" }],
  };
  expect(checkType(valueType, "abc@de.de")).toBe(false);
  expect(checkType(valueType, "test2")).toBe(true);
  expect(checkType(valueType, "")).toBe(true);
};
