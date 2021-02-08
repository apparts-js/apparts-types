const STYLE = require("./style");
const { apiToHtml } = require("./apiToHtml");
const { apiToOpenApi } = require("./apiToOpenApi");

const getApi = (app) => {
  const api = app._router.stack
    .map((route) => {
      if (route.route && route.route.path) {
        const {
          route: {
            path,
            methods,
            stack: [{ method, handle }],
          },
        } = route;
        const { returns, title, description, ...options } =
          handle.options || {};
        return {
          method,
          path,
          assertions: handle.assertions,
          returns,
          title,
          description,
          options,
        };
      }
      return false;
    })
    .filter((a) => !!a);
  return api;
};

module.exports = {
  getApi,
  apiToHtml,
  apiToOpenApi,
};
