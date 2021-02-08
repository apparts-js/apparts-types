const { app } = require("./myTestEndpoint");
const express = require("express");
const {
  genApiDocs: { getApi, apiToHtml, apiToOpenApi },
} = require("./");

const docs = apiToHtml(getApi(app));
const oaDocs = apiToOpenApi(getApi(app));

console.log("\n\n\n#### HTML Api Docs");
console.log(docs);

console.log("\n\n\n#### Open Api Docs");
console.log(JSON.stringify(oaDocs, undefined, 2));
