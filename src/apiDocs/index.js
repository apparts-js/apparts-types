const { apiToMd } = require("./apiToMd");
const { apiToHtml } = require("./apiToHtml");
const { apiToReact } = require("./apiToReact");
const { apiToOpenApi } = require("./apiToOpenApi");

const getRoutes = (app) => {
  return ((app._router || {}).stack || [])
    .map((route) => {
      if (route.route && route.route.path) {
        const {
          route: {
            path,
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
          options: { ...options, section: route.route.section },
          route: route.route,
        };
      }
      return false;
    })
    .filter((a) => !!a);
};

const section = ({ app, title, description, routes }) => {
  const prevRoutes = getRoutes(app);
  const prevSections = app.appartsApiSections || [];
  app.appartsApiSections = [];
  routes && routes(app);
  const newRoutes = getRoutes(app);
  const addedSections = app.appartsApiSections;
  const addedRoutes = newRoutes.filter(
    ({ method, path }) =>
      !prevRoutes.find(
        ({ method: m1, path: p1 }) => m1 === method && p1 === path
      )
  );

  app.appartsApiSections = prevSections;
  app.appartsApiSections.push({
    title,
    description,
    subsections: addedSections,
  });

  addedRoutes.forEach((route) => {
    const sectionId = app.appartsApiSections.length - 1;
    // Has to be attached to the route instead of the function, as
    // otherwise, routes that use the same function would be handled
    // multiple times in here. That would brake stuff.
    const options = route.route;
    options.section = options.section
      ? sectionId + "." + options.section
      : "" + sectionId;
  });
};

const getApi = (app) => {
  const api = getRoutes(app);
  return { routes: api, sections: app.appartsApiSections || [] };
};

module.exports = {
  getApi,
  apiToMd,
  apiToHtml,
  apiToOpenApi,
  apiToReact,
  section,
};
