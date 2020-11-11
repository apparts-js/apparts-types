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
    })
    .filter((a) => !!a);
  return api;
};

const recursivelyPrintType = (type, indent = 0) => {
  let res = "";
  const spaces = " ".repeat(indent);
  if (type.type === "object") {
    if (typeof type.values === "object") {
      res += `{
${Object.keys(type.values)
  .map(
    (key) =>
      spaces +
      `  "${key}": ${recursivelyPrintType(type.values[key], indent + 2)}`
  )
  .join(",\n")}
${spaces}}`;
    } else {
      res += `{
${spaces}  "/": <span class="type">&lt;${type.values}&gt;</span>
${spaces}}`;
    }
  } else if (type.type === "array") {
    res += `[
${spaces}  ${recursivelyPrintType(type.value, indent + 2)}
${spaces}]`;
  } else if (type.type) {
    res += `<span class="type">&lt;${type.type}&gt;</span>`;
  } else {
    res += JSON.stringify(type.value);
  }
  return res.replace(/\n/g, "<br/>").replace(/  /g, "&nbsp;&nbsp;");
};

const apiToHtml = (api, commitHash) => {
  const toc = [];
  const data = api
    .map(
      ({
        method = "",
        path,
        assertions = {},
        returns = [],
        description,
        title,
      }) => {
        const [, version] = path.match(/v\/?(\d+)/) || [,];
        toc.push([`${method}_${path}`, method.toUpperCase(), path]);
        return `<section id="${method}_${path}">
   <h2>${title || ""}</h2>
   <p >${description || ""}</p>
   <div class="api">
     <span class="version">${version ? "v" + version : ""}</span>
     <strong class="method">${method.toUpperCase()}</strong>
     <span class="path">${path}</span><br/>
     <ul>
     ${Object.keys(assertions)
       .map(
         (type) =>
           `
     <li>${type}: <br><ul>` +
           Object.keys(assertions[type])
             .map(
               (key) => `
       <li><code>${assertions[type][key].optional ? "? " : ""}${key}:
         <span class="type">&lt;${assertions[type][key].type}&gt; </span>${
                 assertions[type][key].default
                   ? `(= ${JSON.stringify(assertions[type][key].default)})`
                   : ""
               }</code></li>
       </li>`
             )
             .join("") +
           "</ul></li>"
       )
       .join("")}
     </ul>
     <span class="returns">Returns:</span> <br>
     <ul>
     ${returns
       .map(
         ({ status, error, ...rest }) => `
          <li>${status}<br/>
        <code>${
          error
            ? `{ "error": ${JSON.stringify(error)} }`
            : recursivelyPrintType(rest)
        }</code><br/><br/></li>
      `
       )
       .join("")}
     </ul>
  </div>
</section>`;
      }
    )
    .join("");

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
       color: purple;
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
     code {
       font-family: mono;
     }
    </style>
  </head>
  <body>
    <div class="toc" style="max-width: 800px; margin: auto;padding: 20px;">
      ${toc
        .map((a) => `<a href="#${a[0]}">${a[1]}<div>${a[2]}</div></a>`)
        .join("<br/>")}
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
