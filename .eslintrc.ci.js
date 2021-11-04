const eslintrc = require("./.eslintrc.js");

const newRules = {};

for (const key of Object.keys(eslintrc.rules)) {
  newRules[key] = "error";
}

module.exports = {
  ...eslintrc,
  rules: newRules,
};
