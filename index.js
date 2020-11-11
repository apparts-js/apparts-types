"use strict";

const types = require("./types");
const preparator = require("./preparator");
const prepauth = require("./prepauth");
const checkApiTypes = require("./checkApiTypes");
const { HttpCode } = require("./code");
const genApiDocs = require("./genApiDocs.js");

module.exports = { types, preparator, ...prepauth, checkApiTypes, HttpCode, genApiDocs };
