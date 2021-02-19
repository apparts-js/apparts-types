"use strict";

const types = require("./types/types");
const preparator = require("./preparators/preparator");
const prepauth = require("./preparators/prepauth");
const checkApiTypes = require("./checkReturns/checkApiTypes");
const { HttpCode } = require("./code");
const genApiDocs = require("./apiDocs");
const checkType = require("./types/checkType");

module.exports = {
  types,
  preparator,
  ...prepauth,
  checkType,
  checkApiTypes,
  HttpCode,
  genApiDocs,
};
