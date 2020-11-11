
const getApi = app => {
  const api = app._router.stack.map((route) => {
    if (route.route && route.route.path) {
      const { route: { path, methods, stack: [{ method, handle }] } } = route;
      return {
        method,
        path,
        assertions: handle.assertions,
        returns: handle.returns,
        title: handle.title,
        description: handle.description,
        options: handle.options,
      };
    }
    return false;
  }).filter(a => !!a);
  return api;
};

const apiToHtml = (api, commitHash) => {

  const toc = [];
  const data = api.map(({ method = "", path, assertions = {}, returns = [], description, title }) => {
    const [,version] = path.match(/v\/?(\d+)/) || [,];
    toc.push([`${method}_${path}`, method.toUpperCase(), path]);
    return `<section id="${method}_${path}">
   <h2>${title || ""}</h2>
   <p >${description || ""}</p>
   <div class="api">
     <span class="version">${version ? "v" + version : ""}</span>
     <strong class="method">${method.toUpperCase()}</strong>
     <span class="path">${path}</span><br/>
     <ul>
     ${Object.keys(assertions).map(type => `
     <li>${type}: <br><ul>` + Object.keys(assertions[type]).map(key => `
       <li>${assertions[type][key].optional ? "?" : ""}${key}:
         <span class="type">&lt;${assertions[type][key].type}&gt; ${
         assertions[type][key].default ? `(= ${assertions[type][key].default})` : ""}</span></li>
       </li>`).join("") + "</ul></li>").join("")}
     </ul>
     <span class="returns">Returns:</span> <br>
     <ul>
     ${returns.map(({ status, error, ...rest }) => `
        <li>${status} - ${error ? `{ "error": ${error} }` : JSON.stringify(rest)}</li>
      `).join("")}
     </ul>
  </div>
</section>`;
  }).join("");

  return `
<!DOCTYPE html>
<!-- Commit hash: ${commitHash} -->
<html>
  <head>
    <style>
     * {
       font-family: sans-serif;
     }
     section {
       background: #dee;
       padding: 20px;
       border-radius: 10px;
       margin: 20px;
     }
     .api, p {
       margin-left: 20px;
     }
     .path {
       font-weight: bold;
       color: blue;
     }
     .version {
       color: green;
     }
     .method {
       color: darkblue;
     }
     .type {
       color: lightblue;
     }
     .funcName {
       font-size: 8px;
       color: gray;
     }
     .error {
       font-weight: bold;
       color: red;
     }
     .returns {
       font-weight: bold;
     }
.toc div {
position: absolute;
top: 0px;
left: 110px;
width: max-content;
}
.toc a {
text-decoration: none;
margin: 20px;
position: relative;
}
    </style>
  </head>
  <body>
    <div class="toc" style="max-width: 800px; margin: auto;padding: 20px;">
      ${toc.map(a => `<a href="#${a[0]}">${a[1]}<div>${a[2]}</div></a>`).join("<br/>")}
    </div>
    <div style="max-width: 800px; margin: auto;">
    ${data}
    </div>
  </body>
</html>

`;
};

module.exports = (app) => {
  const api = getApi(app);
  return apiToHtml(api);
};
