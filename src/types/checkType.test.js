import { checkType as _checkType } from "./checkType";
const checkType = (a, b) => _checkType(b, a);

const any = () => {
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
};

describe("any", () => {
  it("should correctly classify", async () => {
    any();
  });
});

const int = (p = "id") => {
  const type = { type: p };
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
};

describe("int", () => {
  it("should correctly classify", async () => {
    int();
  });
});
describe("id", () => {
  it("should correctly classify", async () => {
    int("id");
  });
});

const uuidv4 = () => {
  const type = { type: "uuidv4" };
  expect(checkType(type, "7ce767a4-ec6e-4ff5-b163-f501165eaf83")).toBe(true);
  expect(checkType(type, 4)).toBe(false);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, [])).toBe(false);
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, { an: "object" })).toBe(false);
  expect(checkType(type, "its a string")).toBe(false);
  expect(checkType(type, "7ce767a4-ec6e-5ff5-b163-f501165eaf83")).toBe(false);
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

describe("uuid", () => {
  it("should correctly classify", async () => {
    uuidv4();
  });
});

const float = () => {
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
describe("float", () => {
  it("should correctly classify", async () => {
    float();
  });
});

const hex = () => {
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
describe("hex", () => {
  it("should correctly classify", async () => {
    hex();
  });
});

const base64 = () => {
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
describe("base64", () => {
  it("should correctly classify", async () => {
    base64();
  });
});

// boolean
const bool = (p) => {
  const type = { type: p };
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
describe("bool", () => {
  it("should correctly classify", async () => {
    bool("bool");
  });
});
describe("boolean", () => {
  it("should correctly classify", async () => {
    bool("boolean");
  });
});

// password
const string = (p = "string") => {
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
};
describe("string", () => {
  it("should correctly classify", async () => {
    string();
  });
});
describe("password", () => {
  it("should correctly classify", async () => {
    string("password");
  });
});

const email = () => {
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
describe("email", () => {
  it("should correctly classify", async () => {
    email();
  });
});

const array = () => {
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
describe("array", () => {
  it("should correctly classify", async () => {
    array();
  });
});

const arrayInt = () => {
  const type = { type: "array_int" };
  expect(checkType(type, 4)).toBe(false);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, [])).toBe(true);
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, [1, "3"])).toBe(false);
  expect(checkType(type, [1, 3.141])).toBe(false);
  expect(checkType(type, [1, 3])).toBe(true);
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
describe("array_int", () => {
  it("should correctly classify", async () => {
    arrayInt();
  });
});

const arrayId = () => {
  const type = { type: "array_id" };
  expect(checkType(type, 4)).toBe(false);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, [])).toBe(true);
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, [1, "3"])).toBe(false);
  expect(checkType(type, [1, 3.141])).toBe(false);
  expect(checkType(type, [1, 3])).toBe(true);
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
describe("array_id", () => {
  it("should correctly classify", async () => {
    arrayId();
  });
});

const time = () => {
  const type = { type: "time" };
  expect(checkType(type, 4)).toBe(true);
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
};
describe("time", () => {
  it("should correctly classify", async () => {
    time();
  });
});

const arrayTime = () => {
  const type = { type: "array_time" };
  expect(checkType(type, 4)).toBe(false);
  expect(checkType(type, 4.4)).toBe(false);
  expect(checkType(type, [])).toBe(true);
  expect(checkType(type, ["a", 3])).toBe(false);
  expect(checkType(type, [1, "3"])).toBe(false);
  expect(checkType(type, [1, 3.141])).toBe(false);
  expect(checkType(type, [1, 3])).toBe(true);
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
describe("array_time", () => {
  it("should correctly classify", async () => {
    arrayTime();
  });
});

const object = () => {
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
describe("object", () => {
  it("should correctly classify", async () => {
    object();
  });
});
