const STYLE = require("./style");

const { usageExample: _usageExample } = require("./generateUsageExample");

const usageExample = (...args) => {
  const res = _usageExample(...args);
  return res.replace(/\n/g, "<br/>").replace(/ {2}/g, "&nbsp;&nbsp;");
};

const recursivelyPrintType = (type, indent = 0) => {
  let res = "";
  const spaces = " ".repeat(indent);
  if (type.type === "object") {
    if (typeof type.keys === "object") {
      res += `${type.optional ? "? " : ""}{
${Object.keys(type.keys)
  .map(
    (key) =>
      spaces + `  "${key}": ${recursivelyPrintType(type.keys[key], indent + 2)}`
  )
  .join(",\n")}
${spaces}}`;
    } else {
      res += `${type.optional ? "? " : ""}{
${spaces}  <span class="type">&lt;/&gt;</span>: <span class="type">${recursivelyPrintType(
        type.values,
        indent + 2
      )}</span>
${spaces}}`;
    }
  } else if (type.type === "array") {
    res += `${type.optional ? "? " : ""}[
${spaces}  ${recursivelyPrintType(type.items, indent + 2)}
${spaces}]`;
  } else if (type.type === "oneOf") {
    res += `${type.optional ? "? " : ""}(
${spaces}  ${type.alternatives
      .map((alt) => recursivelyPrintType(alt, indent + 2))
      .join(`\n${spaces}  | `)}
${spaces})`;
  } else if (type.type) {
    res += `${type.optional ? "? " : ""}<span class="type">&lt;${
      type.type
    }&gt;</span>`;
  } else {
    res += JSON.stringify(type.value);
  }
  return res.replace(/\n/g, "<br/>").replace(/ {2}/g, "&nbsp;&nbsp;");
};

const apiToHtml = (api, commitHash, style = STYLE) => {
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
        options = {},
      }) => {
        const [, version] = path.match(/v\/?(\d+)/) || [undefined, undefined];
        toc.push([
          `${method}_${path}`,
          method.toUpperCase(),
          path,
          title,
          version,
        ]);
        return `<section id="${method}_${path}">
   <h3><span class="version">${version ? "v" + version : ""}</span>
${title || ""}</h3>
   <p >${description || ""}</p>
   <div class="api">
     <strong class="method">${method.toUpperCase()}</strong>
     <span class="path">${path}</span><br/>
     <ul>
     ${
       options.auth
         ? `
        <li>Header:
            <ul>
        <li>
        <code>Authorization: ${options.auth}</code>
        </li>
        </ul>
        </li>
        `
         : ""
     }

     ${Object.keys(assertions)
       .map(
         (type) =>
           `
        <li>${type.slice(0, 1).toUpperCase() + type.slice(1)}: <br><ul>` +
           Object.keys(assertions[type])
             .map(
               (key) => `
                                                               <li><code>${key}: ${recursivelyPrintType(
                 assertions[type][key]
               )}${
                 assertions[type][key].default
                   ? ` (= ${JSON.stringify(assertions[type][key].default)})`
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
        <li>Status: ${status}
        <code>${
          error
            ? `{ "error": ${JSON.stringify(error)} }`
            : recursivelyPrintType(rest)
        }</code></li>
        `
       )
       .join("")}
     </ul>
     <span class="usage">Usage:</span> <br><br>
     <code>${usageExample(method, path, assertions, options, returns)}</code>
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
      ${style}
    </style>
  </head>
  <body>
    <div class="docs" >
      <h2>Contents:</h2>
      <div class="toc">
        ${toc
          .map(
            (a) =>
              `<a href="#${a[0]}">
  <span class="version">${a[4] ? "v" + a[4] : ""}</span>
  <span class="link">${a[3] || ""}</span><br/>
             &nbsp;&nbsp;<span class="method">${a[1]}</span><code>${a[2]}</code>
  </a>`
          )
          .join("")}
      </div>
    </div>
    <div class="docs" >
     <h2>Endpoints:</h2>
    ${data}
    </div>
  </body>
</html>

  `;
};

module.exports = {
  apiToHtml,
};
