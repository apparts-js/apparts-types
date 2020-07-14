const { checkType: _checkType, allChecked } = require("./checkApiTypes.js");
const myEndpoint = require("./myTestEndpoint");
const request = require("supertest");

const app = myEndpoint.app;
const checkType = (res, name) => _checkType(myEndpoint, res, name);

describe("myTypelessEndpoint", () => {
  test("Detect missing type-definition", async () => {
    const response = await request(app).post("/v/1/typelessendpoint");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("ok");
    expect(checkType(response, "myTypelessEndpoint")).toBeFalsy();
  });
});

describe("myFaultyEndpoint", () => {
  test("Test with default name", async () => {
    const response = await request(app).post("/v/1/faultyendpoint/3");
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("whut?");
    expect(checkType(response, "myFaultyEndpoint")).toBeFalsy();
  });
  test("Test with too long name", async () => {
    const response = await request(app)
      .post("/v/1/faultyendpoint/3")
      .send({
        name: "x".repeat(200),
      });
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({ error: "Name is too long" });
    expect(checkType(response, "myFaultyEndpoint")).toBeFalsy();
  });
  test("Test with filter", async () => {
    const response = await request(app).post(
      "/v/1/faultyendpoint/3?filter=wrongType"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      arr: [{ a: true }, { a: 2 }],
      boo: true,
    });
    expect(checkType(response, "myFaultyEndpoint")).toBeFalsy();
  });
  test("Check, there is not too much", async () => {
    const response = await request(app).post(
      "/v/1/faultyendpoint/3?filter=tooMuch"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      arr: [{ a: 2 }, { a: 2 }],
      boo: true,
      tooMuch: true,
    });
    expect(checkType(response, "myFaultyEndpoint")).toBeFalsy();
  });
  test("Check, there is not too little", async () => {
    const response = await request(app).post(
      "/v/1/faultyendpoint/3?filter=tooLittle"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      arr: [{ a: 2 }, { a: 2 }],
    });
    expect(checkType(response, "myFaultyEndpoint")).toBeFalsy();
  });
});

describe("myEndpoint, incomplete test", () => {
  test("Test with default name", async () => {
    const response = await request(app).post("/v/1/endpoint/3");
    expect(checkType(response, "myEndpoint")).toBeTruthy();
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("ok");
  });
  test("Test with too long name", async () => {
    const response = await request(app)
      .post("/v/1/endpoint/3")
      .send({
        name: "x".repeat(200),
      });
    expect(checkType(response, "myEndpoint")).toBeTruthy();
    expect(response.statusCode).toBe(400);
  });
  test("Test with filter asstring", async () => {
    const response = await request(app).post("/v/1/endpoint/3?filter=asstring");
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      arr: [{ a: 1 }, { a: 2 }],
      foo: "really!",
      boo: true,
      objectWithUnknownKeys: {
        baz: "77",
        boo: 99,
      },
      objectWithUnknownKeysAndUnknownTypes: {
        baz: 77,
        boo: false,
      },
    });
    expect(checkType(response, "myEndpoint")).toBeFalsy();
  });
});

describe("Notice, that not everything was tested", () => {
  test("", () => {
    expect(allChecked(myEndpoint, "myEndpoint")).toBeFalsy();
  });
});

describe("myEndpoint, the missing test", () => {
  test("Test with filter", async () => {
    const response = await request(app).post("/v/1/endpoint/3?filter=4");
    expect(checkType(response, "myEndpoint")).toBeTruthy();
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      arr: [{ a: 1 }, { a: 2 }],
      boo: true,
      objectWithUnknownKeys: {
        baz: 77,
        boo: 99,
      },
      objectWithUnknownKeysAndUnknownTypes: {
        baz: 77,
        boo: false,
      },
    });
  });
});

describe("All possible responses tested", () => {
  test("", () => {
    expect(allChecked(myEndpoint, "myEndpoint")).toBeTruthy();
  });
});
