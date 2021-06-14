const { getApi } = require("./");
const { app } = require("../myTestEndpoint");
const { apiToMd } = require("./apiToMd");
const fs = require("fs");

describe("Full e2e test", () => {
  test("testApi as MD", () => {
    const html = apiToMd(getApi(app), "testcommithash");
    expect(html).toBe(fs.readFileSync("./apiDocs/api.md").toString());
  });
});
